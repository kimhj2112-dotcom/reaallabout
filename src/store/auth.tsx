import { createContext, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  type User as FirebaseUser,
} from 'firebase/auth';
import { get, push, ref, serverTimestamp, set, update } from 'firebase/database';
import { auth, db, firebaseReady } from '../firebase';

// 인증: Firebase Auth (비밀번호는 Firebase Auth만 보관, 데이터베이스에는 저장하지 않음)
// 데이터베이스 구조:
//   users/{uid}            회원 정보 (이름, 이메일, 약관 동의, 가입일, 마지막 로그인)
//   loginLogs/{uid}/{id}   로그인 기록 (signup / login / logout, 시각, 브라우저 정보)

export interface User {
  uid: string;
  email: string;
  name: string;
}

interface AuthCtx {
  user: User | null;
  ready: boolean; // 로그인 상태 확인이 끝났는지
  login: (email: string, password: string) => Promise<string | null>; // 실패 시 에러 메시지
  signup: (data: { email: string; name: string; password: string; marketing: boolean }) => Promise<string | null>;
  logout: () => Promise<void>;
}

const Ctx = createContext<AuthCtx | null>(null);
const NOT_CONFIGURED = 'Firebase 설정이 아직 연결되지 않았어요. 관리자에게 문의해 주세요.';

const toUser = (u: FirebaseUser, name?: string): User => ({
  uid: u.uid,
  email: u.email ?? '',
  name: name ?? u.displayName ?? (u.email ?? '').split('@')[0],
});

function errorMessage(e: unknown): string {
  const code = (e as { code?: string })?.code ?? '';
  switch (code) {
    case 'auth/email-already-in-use':
      return '이미 가입된 이메일이에요.';
    case 'auth/invalid-email':
      return '올바른 이메일 형식이 아니에요.';
    case 'auth/weak-password':
      return '비밀번호가 너무 약해요. 영문과 숫자를 포함해 8자 이상 입력해 주세요.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return '이메일 또는 비밀번호가 올바르지 않아요.';
    case 'auth/too-many-requests':
      return '시도가 너무 많아요. 잠시 후 다시 시도해 주세요.';
    case 'auth/network-request-failed':
      return '네트워크 연결을 확인해 주세요.';
    case 'auth/operation-not-allowed':
      return 'Firebase 콘솔에서 이메일/비밀번호 로그인이 꺼져 있어요.';
    default:
      console.error('[auth]', e);
      return '요청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.';
  }
}

// 로그인 기록 저장. 기록 실패가 로그인 자체를 막지 않도록 에러는 콘솔에만 남김
async function logEvent(uid: string, type: 'signup' | 'login' | 'logout') {
  if (!db) return;
  try {
    const at = serverTimestamp();
    await push(ref(db, `loginLogs/${uid}`), { type, at, userAgent: navigator.userAgent.slice(0, 300) });
    if (type !== 'logout') await update(ref(db, `users/${uid}`), { lastLoginAt: at });
  } catch (e) {
    console.error('[auth] 로그인 기록 저장 실패', e);
  }
}

// 회원 정보가 비어 있으면(가입 중 저장이 끊긴 경우 등) 로그인할 때 채워 넣음
async function ensureProfile(u: FirebaseUser) {
  if (!db) return;
  try {
    const snap = await get(ref(db, `users/${u.uid}/email`));
    if (snap.exists()) return;
    await update(ref(db, `users/${u.uid}`), {
      name: u.displayName ?? (u.email ?? '').split('@')[0],
      email: u.email,
      createdAt: u.metadata.creationTime ? Date.parse(u.metadata.creationTime) : serverTimestamp(),
    });
  } catch (e) {
    console.error('[auth] 회원 정보 보완 실패', e);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(!firebaseReady);
  // 가입 저장이 끝나기 전에는 로그인 상태를 화면에 반영하지 않음
  // (중간에 로그아웃하면 회원 정보 저장이 끊기는 문제 방지)
  const signingUp = useRef(false);

  useEffect(() => {
    if (!auth) return;
    return onAuthStateChanged(auth, (u) => {
      if (!signingUp.current) setUser(u ? toUser(u) : null);
      setReady(true);
    });
  }, []);

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      ready,
      login: async (email, password) => {
        if (!auth) return NOT_CONFIGURED;
        try {
          const { user: u } = await signInWithEmailAndPassword(auth, email.trim(), password);
          await ensureProfile(u);
          await logEvent(u.uid, 'login');
          setUser(toUser(u));
          return null;
        } catch (e) {
          return errorMessage(e);
        }
      },
      signup: async ({ email, name, password, marketing }) => {
        if (!auth || !db) return NOT_CONFIGURED;
        const cleanName = name.trim();
        signingUp.current = true;
        try {
          const { user: u } = await createUserWithEmailAndPassword(auth, email.trim(), password);
          // 회원 정보 저장이 가장 중요하므로 먼저 저장
          const now = serverTimestamp();
          await set(ref(db, `users/${u.uid}`), {
            name: cleanName,
            email: u.email,
            agreements: { terms: true, privacy: true, marketing, agreedAt: now },
            createdAt: now,
          });
          await logEvent(u.uid, 'signup');
          try {
            await updateProfile(u, { displayName: cleanName });
          } catch (e) {
            console.error('[auth] 표시 이름 저장 실패', e);
          }
          setUser(toUser(u, cleanName));
          return null;
        } catch (e) {
          return errorMessage(e);
        } finally {
          signingUp.current = false;
        }
      },
      logout: async () => {
        if (!auth) return;
        if (auth.currentUser) await logEvent(auth.currentUser.uid, 'logout');
        await signOut(auth);
      },
    }),
    [user, ready],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}

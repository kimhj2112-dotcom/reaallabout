import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getDatabase, type Database } from 'firebase/database';

// 설정값은 .env.local 에서 읽습니다 (.env.example 참고)
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL:
    import.meta.env.VITE_FIREBASE_DATABASE_URL ||
    'https://reaallabout-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const firebaseReady = Boolean(config.apiKey && config.projectId && config.appId);

let app: FirebaseApp | null = null;
export let auth: Auth | null = null;
export let db: Database | null = null;

if (firebaseReady) {
  app = initializeApp(config);
  auth = getAuth(app);
  db = getDatabase(app);
} else {
  console.warn('[firebase] 설정값이 없어 로그인/회원가입이 비활성화됩니다. .env.local 을 확인하세요.');
}

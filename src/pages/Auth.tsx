import { useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { firebaseReady } from '../firebase';
import { useAuth } from '../store/auth';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 로그인 후 돌아갈 주소. 외부 주소로 튀지 않도록 내부 경로만 허용
function useRedirect() {
  const [params] = useSearchParams();
  const r = params.get('redirect') ?? '/';
  return r.startsWith('/') && !r.startsWith('//') ? r : '/';
}

export function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const redirect = useRedirect();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={redirect} replace />;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setError('이메일과 비밀번호를 입력해 주세요.');
      return;
    }
    setBusy(true);
    const err = await login(email, password);
    setBusy(false);
    if (err) setError(err);
    else navigate(redirect, { replace: true });
  };

  const signupHref = redirect === '/' ? '/signup' : `/signup?redirect=${encodeURIComponent(redirect)}`;

  return (
    <div className="container page">
      <div className="auth">
        <Link to="/" className="logo auth__logo">REAALL<span>ABOUT</span></Link>
        <h1 className="auth__title">로그인</h1>
        <p className="auth__sub">좋아하는 크리에이터의 굿즈를 만나보세요</p>

        {!firebaseReady && (
          <p className="auth__notice" role="status">Firebase 설정이 아직 연결되지 않아 로그인·회원가입을 사용할 수 없어요.</p>
        )}
        <form className="auth__form" onSubmit={onSubmit} noValidate>
          <label className="field">
            <span>이메일</span>
            <input type="email" autoComplete="email" placeholder="example@email.com" value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }} autoFocus />
          </label>
          <label className="field">
            <span>비밀번호</span>
            <input type="password" autoComplete="current-password" placeholder="비밀번호" value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }} />
          </label>
          {error && <p className="field__error" role="alert">{error}</p>}
          <button type="submit" className="btn btn--accent btn--block" disabled={busy}>
            {busy ? '로그인 중…' : '로그인'}
          </button>
        </form>

        <div className="auth__links">
          <button type="button" className="linkbtn" onClick={() => alert('데모 버전에서는 비밀번호 찾기를 지원하지 않아요.')}>
            비밀번호 찾기
          </button>
        </div>

        <div className="auth__divider"><span>아직 회원이 아니신가요?</span></div>
        <Link to={signupHref} className="btn btn--line btn--block">회원가입</Link>
      </div>
    </div>
  );
}

export function SignupPage() {
  const { user, signup } = useAuth();
  const navigate = useNavigate();
  const redirect = useRedirect();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [agree, setAgree] = useState({ terms: false, privacy: false, marketing: false });
  const [touched, setTouched] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user && !busy) return <Navigate to={redirect} replace />;

  const errors = {
    name: !form.name.trim() ? '이름을 입력해 주세요.' : '',
    email: !EMAIL_RE.test(form.email.trim()) ? '올바른 이메일 형식이 아니에요.' : '',
    password:
      form.password.length < 8 || !/[A-Za-z]/.test(form.password) || !/\d/.test(form.password)
        ? '영문과 숫자를 포함해 8자 이상 입력해 주세요.'
        : '',
    confirm: form.confirm !== form.password || !form.confirm ? '비밀번호가 일치하지 않아요.' : '',
    agree: !agree.terms || !agree.privacy ? '필수 약관에 동의해 주세요.' : '',
  };
  const valid = Object.values(errors).every((e) => !e);
  const allAgreed = agree.terms && agree.privacy && agree.marketing;

  const set = (k: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [k]: e.target.value });
    setError('');
  };
  const show = (msg: string) => touched && msg ? <p className="field__error">{msg}</p> : null;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (!valid) return;
    setBusy(true);
    const err = await signup({ name: form.name, email: form.email, password: form.password, marketing: agree.marketing });
    if (err) {
      setBusy(false);
      setError(err);
    } else {
      navigate(redirect, { replace: true });
    }
  };

  return (
    <div className="container page">
      <div className="auth">
        <Link to="/" className="logo auth__logo">REAALL<span>ABOUT</span></Link>
        <h1 className="auth__title">회원가입</h1>
        <p className="auth__sub">가입하고 크리에이터를 팔로우해 보세요</p>

        {!firebaseReady && (
          <p className="auth__notice" role="status">Firebase 설정이 아직 연결되지 않아 로그인·회원가입을 사용할 수 없어요.</p>
        )}
        <form className="auth__form" onSubmit={onSubmit} noValidate>
          <label className="field">
            <span>이름</span>
            <input autoComplete="name" placeholder="이름 또는 닉네임" value={form.name} onChange={set('name')} autoFocus />
            {show(errors.name)}
          </label>
          <label className="field">
            <span>이메일</span>
            <input type="email" autoComplete="email" placeholder="example@email.com" value={form.email} onChange={set('email')} />
            {show(errors.email)}
          </label>
          <label className="field">
            <span>비밀번호</span>
            <input type="password" autoComplete="new-password" placeholder="영문+숫자 8자 이상" value={form.password} onChange={set('password')} />
            {show(errors.password)}
          </label>
          <label className="field">
            <span>비밀번호 확인</span>
            <input type="password" autoComplete="new-password" placeholder="비밀번호를 한 번 더 입력" value={form.confirm} onChange={set('confirm')} />
            {show(errors.confirm)}
          </label>

          <div className="agree">
            <label className="check check--all">
              <input type="checkbox" checked={allAgreed}
                onChange={(e) => setAgree({ terms: e.target.checked, privacy: e.target.checked, marketing: e.target.checked })} />
              <span>전체 동의</span>
            </label>
            <label className="check">
              <input type="checkbox" checked={agree.terms} onChange={(e) => setAgree({ ...agree, terms: e.target.checked })} />
              <span>[필수] 이용약관 동의</span>
            </label>
            <label className="check">
              <input type="checkbox" checked={agree.privacy} onChange={(e) => setAgree({ ...agree, privacy: e.target.checked })} />
              <span>[필수] 개인정보 수집·이용 동의</span>
            </label>
            <label className="check">
              <input type="checkbox" checked={agree.marketing} onChange={(e) => setAgree({ ...agree, marketing: e.target.checked })} />
              <span>[선택] 이벤트·혜택 알림 수신</span>
            </label>
            {show(errors.agree)}
          </div>

          {error && <p className="field__error" role="alert">{error}</p>}
          <button type="submit" className="btn btn--accent btn--block" disabled={busy}>
            {busy ? '가입 중…' : '가입하기'}
          </button>
        </form>

        <p className="auth__foot">
          이미 계정이 있으신가요? <Link to={redirect === '/' ? '/login' : `/login?redirect=${encodeURIComponent(redirect)}`}>로그인</Link>
        </p>
      </div>
    </div>
  );
}

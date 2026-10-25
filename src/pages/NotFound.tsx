import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container page empty">
      <p style={{ fontSize: 48 }}>🫥</p>
      <h1 className="page__title">페이지를 찾을 수 없어요</h1>
      <Link to="/" className="btn btn--dark">홈으로</Link>
    </div>
  );
}

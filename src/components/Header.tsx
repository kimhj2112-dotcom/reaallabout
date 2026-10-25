import { useState, type FormEvent } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { POPULAR_KEYWORDS } from '../data/catalog';
import { useCart } from '../store/cart';

const NAV = [
  { to: '/ranking', label: '실시간·랭킹' },
  { to: '/goods', label: '굿즈' },
  { to: '/goods?handmade=1', label: '핸드메이드' },
  { to: '/preorder', label: '프리오더' },
  { to: '/curation', label: '큐레이션' },
  { to: '/creators', label: '크리에이터' },
];

const RECENT_KEY = 'reaallabout.recent';
function loadRecent(): string[] {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]');
  } catch {
    return [];
  }
}

export default function Header() {
  const { count } = useCart();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState<string[]>(loadRecent);

  const go = (keyword: string) => {
    const k = keyword.trim();
    if (!k) return;
    const next = [k, ...recent.filter((r) => r !== k)].slice(0, 6);
    setRecent(next);
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    setOpen(false);
    setQ(k);
    navigate(`/search?q=${encodeURIComponent(k)}`);
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    go(q);
  };

  return (
    <header className="header">
      <div className="header__util container">
        <span className="header__notice">크리에이터와 팬을 잇는 굿즈 마켓</span>
        <nav className="header__utilnav">
          <a href="#login" onClick={(e) => e.preventDefault()}>로그인</a>
          <a href="#signup" onClick={(e) => e.preventDefault()}>회원가입</a>
          <select aria-label="언어" defaultValue="ko">
            <option value="ko">KOR</option>
            <option value="en">ENG</option>
            <option value="ja">JPN</option>
          </select>
        </nav>
      </div>

      <div className="header__main container">
        <Link to="/" className="logo">
          REAALL<span>ABOUT</span>
        </Link>

        <form className="search" onSubmit={onSubmit} onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false);
        }}>
          <input
            type="search"
            placeholder="크리에이터, 상품을 검색해 보세요"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onFocus={() => setOpen(true)}
            aria-label="검색"
          />
          <button type="submit" aria-label="검색하기">🔍</button>
          {open && (
            <div className="search__panel">
              {recent.length > 0 && (
                <div className="search__group">
                  <div className="search__label">
                    최근 검색어
                    <button type="button" className="linkbtn" onClick={() => { setRecent([]); try { localStorage.removeItem(RECENT_KEY); } catch { /* ignore */ } }}>
                      전체 삭제
                    </button>
                  </div>
                  <div className="chips">
                    {recent.map((r) => (
                      <button type="button" key={r} className="chip" onClick={() => go(r)}>{r}</button>
                    ))}
                  </div>
                </div>
              )}
              <div className="search__group">
                <div className="search__label">인기 검색어</div>
                <ol className="search__popular">
                  {POPULAR_KEYWORDS.map((k, i) => (
                    <li key={k}>
                      <button type="button" onClick={() => go(k)}>
                        <b>{i + 1}</b> {k}
                      </button>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}
        </form>

        <div className="header__actions">
          <Link to="/creators" className="btn btn--dark btn--sm hide-mobile">크리에이터 입점</Link>
          <Link to="/cart" className="iconbtn" aria-label="장바구니">
            🛒{count > 0 && <span className="iconbtn__count">{count}</span>}
          </Link>
          <a href="#my" className="iconbtn" aria-label="마이페이지" onClick={(e) => e.preventDefault()}>👤</a>
        </div>
      </div>

      <nav className="gnb container">
        {NAV.map((n) => (
          <NavLink key={n.to} to={n.to} end className={({ isActive }) => (isActive ? 'is-active' : '')}>
            {n.label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { banners } from '../data/catalog';

export default function HeroCarousel() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = banners.length;

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % n), 5000);
    return () => clearInterval(t);
  }, [paused, n]);

  return (
    <div className="hero" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="hero__track" style={{ transform: `translateX(-${idx * 100}%)` }}>
        {banners.map((b, i) => (
          <Link
            key={b.id}
            to={b.to}
            className="hero__slide"
            aria-hidden={i !== idx}
            tabIndex={i === idx ? 0 : -1}
            style={{ background: `linear-gradient(120deg, hsl(${b.hue} 70% 55%), hsl(${(b.hue + 50) % 360} 75% 65%))` }}
          >
            <div className="hero__text">
              <span className="hero__tag">{b.tag}</span>
              <h1>{b.title}</h1>
              <p>{b.sub}</p>
            </div>
            <span className="hero__emoji" aria-hidden>{b.emoji}</span>
          </Link>
        ))}
      </div>
      <button className="hero__arrow hero__arrow--prev" aria-label="이전 배너" onClick={() => setIdx((idx - 1 + n) % n)}>‹</button>
      <button className="hero__arrow hero__arrow--next" aria-label="다음 배너" onClick={() => setIdx((idx + 1) % n)}>›</button>
      <div className="hero__count">{idx + 1} / {n}</div>
    </div>
  );
}

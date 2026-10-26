import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { banners } from '../data/catalog';
import Icon from './Icon';

const prefersReducedMotion = () => {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch {
    return false;
  }
};

export default function HeroCarousel() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef<number | null>(null);
  const n = banners.length;
  const go = (i: number) => setIdx((i + n) % n);

  useEffect(() => {
    if (paused || prefersReducedMotion()) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % n), 5000);
    return () => clearInterval(t);
  }, [paused, n]);

  return (
    <section
      className="hero"
      aria-roledescription="carousel"
      aria-label="추천 배너"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setPaused(false);
      }}
      onTouchStart={(e) => {
        touchX.current = e.touches[0].clientX;
        setPaused(true);
      }}
      onTouchEnd={(e) => {
        const start = touchX.current;
        touchX.current = null;
        if (start === null) return;
        const dx = e.changedTouches[0].clientX - start;
        if (Math.abs(dx) > 40) go(dx < 0 ? idx + 1 : idx - 1);
      }}
    >
      <div className="hero__track" style={{ transform: `translateX(-${idx * 100}%)` }}>
        {banners.map((b, i) => (
          <Link
            key={b.id}
            to={b.to}
            className="hero__slide"
            aria-hidden={i !== idx}
            tabIndex={i === idx ? 0 : -1}
            style={{ background: `linear-gradient(120deg, hsl(${b.hue} 62% 38%), hsl(${(b.hue + 50) % 360} 66% 52%))` }}
          >
            <div className="hero__text">
              <h2>{b.title}</h2>
              <p>{b.sub}</p>
            </div>
            <span className="hero__emoji" aria-hidden>{b.emoji}</span>
            <span className="hero__tag">{b.tag}</span>
          </Link>
        ))}
      </div>
      <div className="hero__controls">
        <button type="button" aria-label="이전 배너" onClick={() => go(idx - 1)}>
          <Icon name="chevronLeft" size={18} />
        </button>
        <span className="hero__count" aria-live="polite">
          {idx + 1} / {n}
        </span>
        <button type="button" aria-label="다음 배너" onClick={() => go(idx + 1)}>
          <Icon name="chevronRight" size={18} />
        </button>
      </div>
    </section>
  );
}

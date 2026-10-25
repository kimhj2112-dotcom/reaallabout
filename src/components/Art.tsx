import type { Creator, Product } from '../data/catalog';
import { creatorById, typeInfo } from '../data/catalog';

// 실제 사진 대신 쓰는 자체 제작 썸네일 (그라데이션 + 이모지)
export function ProductArt({ product, large = false }: { product: Product; large?: boolean }) {
  const creator = creatorById(product.creatorId)!;
  const h = creator.hue;
  return (
    <div
      className={`art ${large ? 'art--large' : ''}`}
      style={{ background: `linear-gradient(135deg, hsl(${h} 70% 92%), hsl(${(h + 40) % 360} 65% 84%))` }}
      role="img"
      aria-label={product.title}
    >
      <span className="art__item">{typeInfo(product.type).emoji}</span>
      <span className="art__badge" style={{ background: `hsl(${h} 55% 45%)` }}>
        {creator.emoji}
      </span>
    </div>
  );
}

export function Avatar({ creator, size = 24 }: { creator: Creator; size?: number }) {
  return (
    <span
      className="avatar"
      style={{ width: size, height: size, fontSize: size * 0.55, background: `hsl(${creator.hue} 60% 88%)` }}
      aria-hidden
    >
      {creator.emoji}
    </span>
  );
}

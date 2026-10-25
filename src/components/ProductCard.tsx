import { Link } from 'react-router-dom';
import { creatorById, formatPrice, type Product } from '../data/catalog';
import { Avatar, ProductArt } from './Art';

interface Props {
  product: Product;
  rank?: number;
  meta?: 'sold' | 'viewers' | 'sales';
}

export default function ProductCard({ product, rank, meta }: Props) {
  const creator = creatorById(product.creatorId)!;
  return (
    <Link to={`/product/${product.id}`} className="card">
      <div className="card__thumb">
        <ProductArt product={product} />
        {rank !== undefined && <span className={`card__rank ${rank <= 3 ? 'is-top' : ''}`}>{rank}</span>}
        {product.soldOut && <span className="card__soldout">SOLD OUT</span>}
      </div>
      <div className="card__creator">
        <Avatar creator={creator} size={18} />
        <span>{creator.name}</span>
      </div>
      <p className="card__title">{product.title}</p>
      <p className="card__price">{formatPrice(product.price)}</p>
      <div className="card__tags">
        {product.exclusive && <span className="tag tag--accent">단독</span>}
        {product.isNew && <span className="tag">NEW</span>}
        {product.handmade && <span className="tag">핸드메이드</span>}
        {meta === 'sold' && <span className="card__meta">{product.soldMinutesAgo}분 전 판매</span>}
        {meta === 'viewers' && <span className="card__meta">👀 {product.viewers}명이 보는 중</span>}
        {meta === 'sales' && <span className="card__meta">누적 {product.sales.toLocaleString()}개</span>}
      </div>
    </Link>
  );
}

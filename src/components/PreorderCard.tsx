import { Link } from 'react-router-dom';
import { creatorById, formatPrice, productById, type Preorder } from '../data/catalog';
import { ProductArt } from './Art';

export default function PreorderCard({ pre }: { pre: Preorder }) {
  const p = productById(pre.productId)!;
  const c = creatorById(p.creatorId)!;
  const pct = Math.round((pre.raised / pre.goal) * 100);
  const ended = pre.endsInHours === 0;
  const status = ended ? (pct >= 100 ? '챌린지 성공' : '종료') : pre.endsInHours < 24 ? `${pre.endsInHours}시간 남음` : `${Math.floor(pre.endsInHours / 24)}일 남음`;

  return (
    <Link to={`/product/${p.id}`} className="pre">
      <div className="pre__thumb"><ProductArt product={p} /></div>
      <div className="pre__body">
        <span className="pre__creator">{c.name}</span>
        <p className="pre__title">{p.title}</p>
        <div className="progress" aria-label={`달성률 ${pct}%`}>
          <span style={{ width: `${Math.min(100, pct)}%` }} />
        </div>
        <div className="pre__stats">
          <b className="pre__pct">{pct}%</b>
          <span>{formatPrice(pre.raised * p.price)}</span>
          <span className={`pre__status ${ended ? 'is-ended' : ''}`}>{status}</span>
        </div>
      </div>
    </Link>
  );
}

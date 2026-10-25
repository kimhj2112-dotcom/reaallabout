import { useState } from 'react';
import ProductCard from '../components/ProductCard';
import { PRODUCT_TYPES, ranking } from '../data/catalog';

export default function Ranking() {
  const [type, setType] = useState('');
  const list = (type ? ranking.filter((p) => p.type === type) : ranking).slice(0, 100);

  return (
    <div className="container page">
      <h1 className="page__title">실시간 랭킹 TOP 100</h1>
      <div className="chips chips--scroll filters">
        <button className={`chip ${!type ? 'is-on' : ''}`} onClick={() => setType('')}>전체</button>
        {PRODUCT_TYPES.map((t) => (
          <button key={t.type} className={`chip ${type === t.type ? 'is-on' : ''}`} onClick={() => setType(t.type)}>
            {t.type}
          </button>
        ))}
      </div>
      <div className="grid">
        {list.map((p, i) => <ProductCard key={p.id} product={p} rank={i + 1} meta="sales" />)}
      </div>
    </div>
  );
}

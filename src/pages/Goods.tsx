import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { creatorById, PRODUCT_TYPES, products, type Product } from '../data/catalog';

const SORTS = [
  { key: 'popular', label: '인기순' },
  { key: 'new', label: '신상품순' },
  { key: 'low', label: '낮은 가격순' },
  { key: 'high', label: '높은 가격순' },
] as const;

function sortBy(list: Product[], key: string) {
  const arr = [...list];
  if (key === 'low') return arr.sort((a, b) => a.price - b.price);
  if (key === 'high') return arr.sort((a, b) => b.price - a.price);
  if (key === 'new') return arr.sort((a, b) => Number(b.isNew) - Number(a.isNew) || a.soldMinutesAgo - b.soldMinutesAgo);
  return arr.sort((a, b) => b.sales - a.sales);
}

// /goods 와 /search 가 함께 쓰는 목록 페이지
export default function Goods({ mode = 'goods' }: { mode?: 'goods' | 'search' }) {
  const [params, setParams] = useSearchParams();
  const q = (params.get('q') ?? '').trim();
  const type = params.get('type') ?? '';
  const sort = params.get('sort') ?? 'popular';
  const handmade = params.get('handmade') === '1';
  const exclusive = params.get('exclusive') === '1';

  const list = useMemo(() => {
    let l = products;
    if (q) {
      const k = q.toLowerCase();
      l = l.filter((p) => {
        const c = creatorById(p.creatorId)!;
        return [p.title, p.type, c.name, c.category].some((s) => s.toLowerCase().includes(k));
      });
    }
    if (type) l = l.filter((p) => p.type === type);
    if (handmade) l = l.filter((p) => p.handmade);
    if (exclusive) l = l.filter((p) => p.exclusive);
    return sortBy(l, sort);
  }, [q, type, sort, handmade, exclusive]);

  const set = (k: string, v: string) => {
    const next = new URLSearchParams(params);
    if (v) next.set(k, v);
    else next.delete(k);
    setParams(next, { replace: true });
  };

  const title = mode === 'search' ? `‘${q}’ 검색 결과` : handmade ? '핸드메이드' : exclusive ? 'REAALL 단독' : '굿즈';

  return (
    <div className="container page">
      <h1 className="page__title">
        {title} <small>{list.length}개</small>
      </h1>

      <div className="filters">
        <div className="chips chips--scroll">
          <button className={`chip ${!type ? 'is-on' : ''}`} onClick={() => set('type', '')}>전체</button>
          {PRODUCT_TYPES.map((t) => (
            <button key={t.type} className={`chip ${type === t.type ? 'is-on' : ''}`} onClick={() => set('type', t.type)}>
              {t.emoji} {t.type}
            </button>
          ))}
        </div>
        <select value={sort} onChange={(e) => set('sort', e.target.value)} aria-label="정렬">
          {SORTS.map((s) => <option key={s.key} value={s.key}>{s.label}</option>)}
        </select>
      </div>

      {list.length ? (
        <div className="grid">
          {list.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <p className="empty">조건에 맞는 상품이 없어요.</p>
      )}
    </div>
  );
}

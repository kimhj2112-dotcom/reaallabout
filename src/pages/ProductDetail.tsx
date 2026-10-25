import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Avatar, ProductArt } from '../components/Art';
import ProductCard from '../components/ProductCard';
import Section from '../components/Section';
import { creatorById, formatPrice, productById, productsByCreator, typeInfo } from '../data/catalog';
import { useCart } from '../store/cart';
import NotFound from './NotFound';

const SIZES = ['S', 'M', 'L', 'XL'];

export default function ProductDetail() {
  const { id } = useParams();
  const p = id ? productById(id) : undefined;
  const { add } = useCart();
  const navigate = useNavigate();
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState('');
  const [toast, setToast] = useState('');

  if (!p) return <NotFound />;
  const c = creatorById(p.creatorId)!;
  const needsSize = !!typeInfo(p.type).hasSize;
  const others = productsByCreator(c.id).filter((x) => x.id !== p.id);

  const put = (thenGo: boolean) => {
    if (needsSize && !size) {
      setToast('사이즈를 선택해 주세요.');
      return;
    }
    add(p.id, qty, needsSize ? size : undefined);
    if (thenGo) navigate('/cart');
    else setToast('장바구니에 담았어요.');
  };

  return (
    <div className="container page">
      <div className="pdp">
        <div className="pdp__media">
          <ProductArt product={p} large />
        </div>

        <div className="pdp__info">
          <Link to={`/creator/${c.id}`} className="pdp__creator">
            <Avatar creator={c} size={28} /> {c.name} <span>›</span>
          </Link>
          <h1 className="pdp__title">{p.title}</h1>
          <p className="pdp__price">{formatPrice(p.price)}</p>
          <div className="card__tags">
            {p.exclusive && <span className="tag tag--accent">단독</span>}
            {p.isNew && <span className="tag">NEW</span>}
            <span className="tag">누적 판매 {p.sales.toLocaleString()}</span>
            <span className="tag">👀 {p.viewers}명이 보는 중</span>
          </div>

          <dl className="pdp__meta">
            <dt>배송비</dt><dd>3,000원 (5만원 이상 무료)</dd>
            <dt>제작</dt><dd>주문 후 제작 · 5~10 영업일</dd>
          </dl>

          {p.soldOut ? (
            <button className="btn btn--block" disabled>품절된 상품이에요</button>
          ) : (
            <>
              {needsSize && (
                <div className="opt">
                  <span className="opt__label">사이즈</span>
                  <div className="chips">
                    {SIZES.map((s) => (
                      <button key={s} className={`chip ${size === s ? 'is-on' : ''}`} onClick={() => { setSize(s); setToast(''); }}>{s}</button>
                    ))}
                  </div>
                </div>
              )}
              <div className="opt">
                <span className="opt__label">수량</span>
                <div className="qty">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} aria-label="수량 줄이기">−</button>
                  <span>{qty}</span>
                  <button onClick={() => setQty(Math.min(99, qty + 1))} aria-label="수량 늘리기">+</button>
                </div>
              </div>
              <div className="pdp__total">
                <span>총 상품금액</span>
                <b>{formatPrice(p.price * qty)}</b>
              </div>
              <div className="pdp__buttons">
                <button className="btn btn--line" onClick={() => put(false)}>장바구니</button>
                <button className="btn btn--accent" onClick={() => put(true)}>바로 구매</button>
              </div>
            </>
          )}
          {toast && <p className="toast" role="status">{toast}</p>}

          <div className="pdp__desc">
            <h3>상품 설명</h3>
            <p>{p.description}</p>
          </div>
        </div>
      </div>

      {others.length > 0 && (
        <Section title={`${c.name}의 다른 상품`} more={`/creator/${c.id}`}>
          <div className="hscroll">
            {others.map((o) => <ProductCard key={o.id} product={o} />)}
          </div>
        </Section>
      )}
    </div>
  );
}

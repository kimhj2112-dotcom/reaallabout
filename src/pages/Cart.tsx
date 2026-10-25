import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductArt } from '../components/Art';
import { creatorById, formatPrice, productById } from '../data/catalog';
import { useCart } from '../store/cart';

const FREE_SHIPPING = 50000;
const SHIPPING_FEE = 3000;

export default function Cart() {
  const { items, subtotal, setQty, remove, clear } = useCart();
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <div className="container page empty">
        <p style={{ fontSize: 48 }}>🎉</p>
        <h1 className="page__title">주문이 접수됐어요</h1>
        <p className="page__desc">데모 주문이라 실제 결제는 이루어지지 않았어요.</p>
        <Link to="/" className="btn btn--dark">쇼핑 계속하기</Link>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="container page empty">
        <p style={{ fontSize: 48 }}>🛒</p>
        <h1 className="page__title">장바구니가 비어 있어요</h1>
        <Link to="/ranking" className="btn btn--dark">인기 상품 보러가기</Link>
      </div>
    );
  }

  const shipping = subtotal >= FREE_SHIPPING ? 0 : SHIPPING_FEE;

  return (
    <div className="container page">
      <h1 className="page__title">장바구니</h1>
      <div className="cart">
        <ul className="cart__list">
          {items.map((i) => {
            const p = productById(i.productId)!;
            const c = creatorById(p.creatorId)!;
            return (
              <li key={i.key} className="cart__item">
                <Link to={`/product/${p.id}`} className="cart__thumb"><ProductArt product={p} /></Link>
                <div className="cart__info">
                  <span className="card__creator">{c.name}</span>
                  <Link to={`/product/${p.id}`} className="cart__title">{p.title}</Link>
                  {i.option && <span className="cart__opt">사이즈 {i.option}</span>}
                  <div className="qty qty--sm">
                    <button onClick={() => setQty(i.key, i.qty - 1)} aria-label="수량 줄이기">−</button>
                    <span>{i.qty}</span>
                    <button onClick={() => setQty(i.key, i.qty + 1)} aria-label="수량 늘리기">+</button>
                  </div>
                </div>
                <div className="cart__right">
                  <b>{formatPrice(p.price * i.qty)}</b>
                  <button className="linkbtn" onClick={() => remove(i.key)}>삭제</button>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="cart__sum">
          <div><span>상품금액</span><span>{formatPrice(subtotal)}</span></div>
          <div><span>배송비</span><span>{shipping ? formatPrice(shipping) : '무료'}</span></div>
          {shipping > 0 && (
            <p className="cart__hint">{formatPrice(FREE_SHIPPING - subtotal)} 더 담으면 무료배송</p>
          )}
          <div className="cart__total"><span>결제 예정금액</span><b>{formatPrice(subtotal + shipping)}</b></div>
          <button className="btn btn--accent btn--block" onClick={() => { clear(); setDone(true); }}>
            주문하기
          </button>
        </aside>
      </div>
    </div>
  );
}

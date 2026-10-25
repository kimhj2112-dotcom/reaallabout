import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Avatar, ProductArt } from '../components/Art';
import PreorderCard from '../components/PreorderCard';
import ProductCard from '../components/ProductCard';
import { creatorById, creatorRanking, curations, preorders, productById, productsByCreator } from '../data/catalog';
import NotFound from './NotFound';

export function PreorderPage() {
  return (
    <div className="container page">
      <h1 className="page__title">프리오더 챌린지</h1>
      <p className="page__desc">목표 수량을 넘기면 제작이 확정되는 선주문 상품이에요.</p>
      <div className="pre-grid">
        {preorders.map((p) => <PreorderCard key={p.id} pre={p} />)}
      </div>
    </div>
  );
}

export function CurationPage() {
  return (
    <div className="container page">
      <h1 className="page__title">큐레이션</h1>
      <div className="cur-grid">
        {curations.map((c) => (
          <Link key={c.id} to={`/curation/${c.id}`} className="cur" style={{ background: `hsl(${c.hue} 60% 95%)` }}>
            <div>
              <span className="hero__tag hero__tag--dark">CURATION</span>
              <h3>{c.title}</h3>
              <p>{c.desc}</p>
            </div>
            <div className="mini-grid">
              {c.productIds.slice(0, 3).map((id) => (
                <div key={id} className="mini"><ProductArt product={productById(id)!} /></div>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function CurationDetail() {
  const { id } = useParams();
  const c = curations.find((x) => x.id === id);
  if (!c) return <NotFound />;
  return (
    <div className="container page">
      <div className="banner" style={{ background: `hsl(${c.hue} 60% 94%)` }}>
        <span className="hero__tag hero__tag--dark">CURATION</span>
        <h1>{c.title}</h1>
        <p>{c.desc}</p>
      </div>
      <div className="grid">
        {c.productIds.map((pid) => <ProductCard key={pid} product={productById(pid)!} />)}
      </div>
    </div>
  );
}

export function CreatorsPage() {
  return (
    <div className="container page">
      <h1 className="page__title">크리에이터</h1>
      <div className="creator-list">
        {creatorRanking.map(({ creator, total }, i) => (
          <Link key={creator.id} to={`/creator/${creator.id}`} className="creator-tile">
            <b className="creator-rank__no">{i + 1}</b>
            <Avatar creator={creator} size={56} />
            <div className="creator-tile__name">{creator.name}</div>
            <span className="tag">{creator.category}</span>
            <p className="creator-tile__meta">팔로워 {creator.followers.toLocaleString()} · 판매 {total.toLocaleString()}</p>
          </Link>
        ))}
      </div>
      <div className="apply">
        <div>
          <h3>나만의 굿즈샵을 열어보세요</h3>
          <p>디자인만 올리면 제작·배송·CS는 함께 해결해요.</p>
        </div>
        <button className="btn btn--accent" onClick={() => alert('데모 버전에서는 입점 신청을 받을 수 없어요.')}>입점 신청하기</button>
      </div>
    </div>
  );
}

function FollowButton() {
  const [on, setOn] = useState(false);
  return (
    <button className={`btn ${on ? 'btn--line' : 'btn--dark'}`} onClick={() => setOn(!on)} aria-pressed={on}>
      {on ? '팔로잉 ✓' : '+ 팔로우'}
    </button>
  );
}

export function CreatorShop() {
  const { id } = useParams();
  const c = id ? creatorById(id) : undefined;
  if (!c) return <NotFound />;
  const list = productsByCreator(c.id);
  return (
    <div className="page">
      <div className="shop-cover" style={{ background: `linear-gradient(120deg, hsl(${c.hue} 70% 60%), hsl(${(c.hue + 50) % 360} 70% 72%))` }} />
      <div className="container">
        <div className="shop-head">
          <Avatar creator={c} size={88} />
          <div>
            <h1>{c.name}</h1>
            <p>{c.intro}</p>
            <p className="creator-tile__meta">{c.category} · 팔로워 {c.followers.toLocaleString()} · 상품 {list.length}</p>
          </div>
          <FollowButton key={c.id} />
        </div>
        <div className="grid">
          {list.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </div>
  );
}

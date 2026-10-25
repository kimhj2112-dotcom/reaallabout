import { Link } from 'react-router-dom';
import HeroCarousel from '../components/HeroCarousel';
import PreorderCard from '../components/PreorderCard';
import ProductCard from '../components/ProductCard';
import Section from '../components/Section';
import { Avatar, ProductArt } from '../components/Art';
import {
  creatorRanking,
  curations,
  formatPrice,
  justSold,
  preorders,
  productById,
  products,
  productsByCreator,
  ranking,
} from '../data/catalog';

const QUICK = [
  { to: '/ranking', emoji: '🏆', label: '주간 랭킹' },
  { to: '/goods?sort=new', emoji: '🆕', label: '신상품' },
  { to: '/goods?handmade=1', emoji: '🧶', label: '핸드메이드' },
  { to: '/preorder', emoji: '🚀', label: '프리오더' },
  { to: '/curation', emoji: '🎁', label: '큐레이션' },
  { to: '/creators', emoji: '🎨', label: '크리에이터' },
];

export default function Home() {
  const exclusive = products.filter((p) => p.exclusive);

  return (
    <>
      <div className="container">
        <HeroCarousel />

        <nav className="quick">
          {QUICK.map((q) => (
            <Link key={q.label} to={q.to} className="quick__item">
              <span className="quick__icon">{q.emoji}</span>
              <span>{q.label}</span>
            </Link>
          ))}
        </nav>

        <Section title="실시간 랭킹 TOP 100" sub="지금 가장 많이 팔리는 굿즈" more="/ranking">
          <div className="hscroll">
            {ranking.slice(0, 10).map((p, i) => (
              <ProductCard key={p.id} product={p} rank={i + 1} />
            ))}
          </div>
        </Section>

        <Section title="주목할 프리오더 챌린지" sub="목표 수량을 달성하면 제작이 시작돼요" more="/preorder">
          <div className="pre-grid">
            {preorders.slice(0, 4).map((pre) => (
              <PreorderCard key={pre.id} pre={pre} />
            ))}
          </div>
        </Section>

        <Section title="방금 팔렸어요" sub="다른 팬들이 지금 고른 상품">
          <div className="hscroll">
            {justSold.slice(0, 10).map((p) => (
              <ProductCard key={p.id} product={p} meta="sold" />
            ))}
          </div>
        </Section>

        <Section title="실시간 크리에이터 랭킹" more="/creators">
          <div className="creator-rank">
            {creatorRanking.slice(0, 4).map(({ creator }, i) => (
              <div key={creator.id} className="creator-rank__item">
                <Link to={`/creator/${creator.id}`} className="creator-rank__head">
                  <b className="creator-rank__no">{i + 1}</b>
                  <Avatar creator={creator} size={40} />
                  <div>
                    <div className="creator-rank__name">{creator.name}</div>
                    <span className="tag">{creator.category}</span>
                  </div>
                </Link>
                <div className="mini-grid">
                  {productsByCreator(creator.id).slice(0, 3).map((p) => (
                    <Link key={p.id} to={`/product/${p.id}`} className="mini">
                      <ProductArt product={p} />
                      <span className="mini__price">{formatPrice(p.price)}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Section>

        <Section title="REAALL 단독" sub="여기서만 만날 수 있는 한정 굿즈" more="/goods?exclusive=1">
          <div className="hscroll">
            {exclusive.slice(0, 10).map((p) => (
              <ProductCard key={p.id} product={p} meta="viewers" />
            ))}
          </div>
        </Section>

        <Section title="큐레이션" sub="에디터가 고른 테마별 셀렉션" more="/curation">
          <div className="cur-grid">
            {curations.slice(0, 2).map((c) => (
              <Link key={c.id} to={`/curation/${c.id}`} className="cur" style={{ background: `hsl(${c.hue} 60% 95%)` }}>
                <div>
                  <span className="hero__tag hero__tag--dark">CURATION</span>
                  <h3>{c.title}</h3>
                  <p>{c.desc}</p>
                </div>
                <div className="mini-grid">
                  {c.productIds.slice(0, 3).map((id) => {
                    const p = productById(id)!;
                    return <div key={id} className="mini"><ProductArt product={p} /></div>;
                  })}
                </div>
              </Link>
            ))}
          </div>
        </Section>
      </div>
    </>
  );
}

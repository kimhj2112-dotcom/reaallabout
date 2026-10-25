// 데모용 상품/크리에이터 데이터. 모든 이름과 문구는 이 프로젝트에서 새로 만든 것입니다.

export type ProductType =
  | '키링'
  | '티셔츠'
  | '후드'
  | '스티커'
  | '머그컵'
  | '에코백'
  | '포토카드'
  | '아크릴스탠드'
  | '폰케이스'
  | '뱃지'
  | '모자'
  | '엽서';

export const PRODUCT_TYPES: { type: ProductType; emoji: string; basePrice: number; hasSize?: boolean }[] = [
  { type: '키링', emoji: '🔑', basePrice: 9000 },
  { type: '티셔츠', emoji: '👕', basePrice: 29000, hasSize: true },
  { type: '후드', emoji: '🧥', basePrice: 49000, hasSize: true },
  { type: '스티커', emoji: '✨', basePrice: 4000 },
  { type: '머그컵', emoji: '☕', basePrice: 15000 },
  { type: '에코백', emoji: '👜', basePrice: 19000 },
  { type: '포토카드', emoji: '🃏', basePrice: 6000 },
  { type: '아크릴스탠드', emoji: '🧸', basePrice: 16000 },
  { type: '폰케이스', emoji: '📱', basePrice: 22000 },
  { type: '뱃지', emoji: '📛', basePrice: 7000 },
  { type: '모자', emoji: '🧢', basePrice: 27000 },
  { type: '엽서', emoji: '💌', basePrice: 3000 },
];

export const typeInfo = (t: ProductType) => PRODUCT_TYPES.find((p) => p.type === t)!;

export type CreatorCategory = '일러스트' | '게임' | '캐릭터' | '버추얼' | '웹툰' | '핸드메이드' | '사진';

export interface Creator {
  id: string;
  name: string;
  category: CreatorCategory;
  emoji: string;
  hue: number;
  intro: string;
  followers: number;
}

export interface Product {
  id: string;
  creatorId: string;
  title: string;
  type: ProductType;
  price: number;
  sales: number;
  soldMinutesAgo: number;
  viewers: number;
  soldOut: boolean;
  exclusive: boolean;
  isNew: boolean;
  handmade: boolean;
  description: string;
}

export interface Preorder {
  id: string;
  productId: string;
  goal: number;
  raised: number;
  endsInHours: number;
}

export interface Curation {
  id: string;
  title: string;
  desc: string;
  hue: number;
  productIds: string[];
}

export interface Banner {
  id: string;
  tag: 'CREATOR OPEN' | 'CURATION' | 'EVENT';
  title: string;
  sub: string;
  hue: number;
  emoji: string;
  to: string;
}

// 시드 고정 난수: 새로고침해도 같은 데이터가 나오도록 함
function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = seeded(20261025);
const pick = <T,>(arr: readonly T[]) => arr[Math.floor(rand() * arr.length)];

export const creators: Creator[] = [
  { id: 'moonlit-cat', name: '달빛고양이', category: '일러스트', emoji: '🐈‍⬛', hue: 250, intro: '밤 산책하는 고양이를 그립니다.', followers: 18420 },
  { id: 'pixel-lab', name: '픽셀공방', category: '게임', emoji: '👾', hue: 140, intro: '8비트 감성 굿즈를 만드는 작은 공방', followers: 12210 },
  { id: 'salt-bread', name: '소금빵작업실', category: '캐릭터', emoji: '🥐', hue: 35, intro: '빵 캐릭터 "소미"의 일상', followers: 30115 },
  { id: 'monotone', name: '모노톤스튜디오', category: '사진', emoji: '📷', hue: 220, intro: '흑백 필름으로 담은 도시 풍경', followers: 5480 },
  { id: 'cloud-post', name: '구름우체국', category: '웹툰', emoji: '☁️', hue: 200, intro: '구름 마을 집배원 이야기 연재 중', followers: 41230 },
  { id: 'butter-bunny', name: '버터토끼', category: '캐릭터', emoji: '🐰', hue: 50, intro: '말랑한 토끼와 함께하는 하루', followers: 27760 },
  { id: 'dawn-drawing', name: '새벽드로잉', category: '일러스트', emoji: '🌙', hue: 280, intro: '새벽 감성 수채 일러스트', followers: 9830 },
  { id: 'neon-ground', name: '네온그라운드', category: '버추얼', emoji: '🎧', hue: 310, intro: '버추얼 DJ 네오의 공식 굿즈샵', followers: 52900 },
  { id: 'forest-stationery', name: '숲속문방구', category: '핸드메이드', emoji: '🌿', hue: 110, intro: '손으로 만드는 자연 문구', followers: 7340 },
  { id: 'three-pm', name: '오후세시', category: '핸드메이드', emoji: '🫖', hue: 15, intro: '티타임을 위한 도자기와 패브릭', followers: 6120 },
  { id: 'retro-club', name: '레트로게임클럽', category: '게임', emoji: '🕹️', hue: 0, intro: '추억의 아케이드를 다시 플레이', followers: 15890 },
  { id: 'sea-glass', name: '바다유리', category: '버추얼', emoji: '🐚', hue: 180, intro: '바다를 노래하는 버추얼 싱어', followers: 38410 },
];

const ADJ = ['몽글몽글', '오리지널', '시그니처', '한정판', '데일리', '빈티지', '파스텔', '미드나잇', '썸머', '윈터', '스마일', '리미티드'];

export const products: Product[] = [];
creators.forEach((c, ci) => {
  const types = [...PRODUCT_TYPES].sort(() => rand() - 0.5).slice(0, 7);
  types.forEach((t, ti) => {
    const adj = pick(ADJ);
    const price = Math.round((t.basePrice * (0.85 + rand() * 0.5)) / 500) * 500;
    const handmade = c.category === '핸드메이드';
    products.push({
      id: `p${ci + 1}-${ti + 1}`,
      creatorId: c.id,
      title: `${c.name} ${adj} ${t.type}`,
      type: t.type,
      price,
      sales: Math.floor(rand() * 2400) + 20,
      soldMinutesAgo: Math.floor(rand() * 180) + 1,
      viewers: Math.floor(rand() * 60) + 2,
      soldOut: rand() < 0.08,
      exclusive: rand() < 0.15,
      isNew: rand() < 0.2,
      handmade,
      description: `${c.intro} ${c.name}의 ${adj} ${t.type}입니다. 주문 후 제작되며 영업일 기준 5~10일 안에 발송됩니다.`,
    });
  });
});

export const productById = (id: string) => products.find((p) => p.id === id);
export const creatorById = (id: string) => creators.find((c) => c.id === id);
export const productsByCreator = (id: string) => products.filter((p) => p.creatorId === id);

export const ranking = [...products].sort((a, b) => b.sales - a.sales);
export const justSold = [...products].sort((a, b) => a.soldMinutesAgo - b.soldMinutesAgo);

export const creatorRanking = [...creators]
  .map((c) => ({ creator: c, total: productsByCreator(c.id).reduce((s, p) => s + p.sales, 0) }))
  .sort((a, b) => b.total - a.total);

export const preorders: Preorder[] = products
  .filter((_, i) => i % 9 === 3)
  .slice(0, 8)
  .map((p, i) => {
    const goal = 50 + Math.floor(rand() * 150);
    return {
      id: `pre${i + 1}`,
      productId: p.id,
      goal,
      raised: Math.floor(goal * (0.3 + rand() * 2.2)),
      endsInHours: i % 4 === 3 ? 0 : Math.floor(rand() * 200) + 3,
    };
  });

const pickIds = (filter: (p: Product) => boolean, n: number) => products.filter(filter).slice(0, n).map((p) => p.id);

export const curations: Curation[] = [
  { id: 'desk', title: '책상 위를 채우는 작은 친구들', desc: '아크릴스탠드·뱃지·스티커 모음', hue: 260, productIds: pickIds((p) => ['아크릴스탠드', '뱃지', '스티커'].includes(p.type), 6) },
  { id: 'wear', title: '입고 다니는 최애', desc: '티셔츠·후드·모자 컬렉션', hue: 20, productIds: pickIds((p) => ['티셔츠', '후드', '모자'].includes(p.type), 6) },
  { id: 'gift', title: '3만원 이하 선물 추천', desc: '부담 없이 건네기 좋은 굿즈', hue: 150, productIds: pickIds((p) => p.price <= 30000 && !p.soldOut, 6) },
  { id: 'handmade', title: '손으로 만든 것들', desc: '핸드메이드 크리에이터 셀렉션', hue: 90, productIds: pickIds((p) => p.handmade, 6) },
];

export const banners: Banner[] = [
  { id: 'b1', tag: 'CREATOR OPEN', title: '구름우체국 공식 굿즈샵 오픈', sub: '첫 시즌 엽서·스티커 세트를 만나보세요', hue: 200, emoji: '☁️', to: '/creator/cloud-post' },
  { id: 'b2', tag: 'CURATION', title: '책상 위를 채우는 작은 친구들', sub: '이번 주 큐레이션 셀렉션', hue: 260, emoji: '🧸', to: '/curation/desk' },
  { id: 'b3', tag: 'EVENT', title: '네온그라운드 라이브 기념 프리오더', sub: '목표 달성 시 한정 뱃지 증정', hue: 310, emoji: '🎧', to: '/preorder' },
  { id: 'b4', tag: 'CREATOR OPEN', title: '오후세시의 티타임 컬렉션', sub: '손으로 빚은 머그와 패브릭', hue: 15, emoji: '🫖', to: '/creator/three-pm' },
];

export const POPULAR_KEYWORDS = ['키링', '아크릴스탠드', '포토카드', '버추얼', '후드', '스티커', '머그컵', '고양이'];

export const formatPrice = (n: number) => `${n.toLocaleString('ko-KR')}원`;

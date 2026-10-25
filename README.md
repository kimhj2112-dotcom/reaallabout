# reaallabout
모든 상품 기획

크리에이터 굿즈 마켓 데모 (React + Vite + TypeScript).

## 실행
```
npm install
npm run dev     # 개발 서버 (http://localhost:5173)
npm run build   # 배포용 빌드 → dist/
```

## 구조
- `src/data/catalog.ts` — 크리에이터·상품·프리오더·큐레이션 예시 데이터
- `src/store/cart.tsx` — 장바구니 상태 (브라우저에 저장)
- `src/components/` — 헤더, 푸터, 배너, 상품 카드 등
- `src/pages/` — 홈, 랭킹, 굿즈/검색, 프리오더, 큐레이션, 크리에이터, 상품 상세, 장바구니

상품 이미지는 아직 그라데이션 + 이모지로 된 임시 썸네일입니다. 실제 사진은 직접 촬영하거나 사용 권한이 있는 이미지로 바꿔 주세요.

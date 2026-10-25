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

## 로그인 / 회원가입 (Firebase)
- 인증은 Firebase Authentication(이메일/비밀번호), 회원 정보와 로그인 기록은 Realtime Database에 저장합니다.
  - `users/{uid}` — 이름, 이메일, 약관 동의, 가입·마지막 로그인 시각 (비밀번호는 저장하지 않음)
  - `loginLogs/{uid}/{id}` — signup / login / logout 기록
- 실행 전 `.env.example`을 `.env.local`로 복사하고 Firebase 웹 앱 설정값을 채우세요. `.env.local`은 GitHub에 올라가지 않습니다.
- 데이터베이스 보안 규칙은 `database.rules.json`에 있습니다 (본인 데이터만 읽기/쓰기, 로그 수정·삭제 불가).

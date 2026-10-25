import { useEffect } from 'react';
import { Route, Routes, useLocation, useParams } from 'react-router-dom';
import Footer from './components/Footer';
import Header from './components/Header';
import { LoginPage, SignupPage } from './pages/Auth';
import Cart from './pages/Cart';
import Goods from './pages/Goods';
import Home from './pages/Home';
import { CreatorShop, CreatorsPage, CurationDetail, CurationPage, PreorderPage } from './pages/Lists';
import NotFound from './pages/NotFound';
import ProductDetail from './pages/ProductDetail';
import Ranking from './pages/Ranking';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

// 상품이 바뀌면 수량·옵션 상태를 초기화하기 위해 key를 줌
function ProductRoute() {
  const { id } = useParams();
  return <ProductDetail key={id} />;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/goods" element={<Goods />} />
          <Route path="/search" element={<Goods mode="search" />} />
          <Route path="/preorder" element={<PreorderPage />} />
          <Route path="/curation" element={<CurationPage />} />
          <Route path="/curation/:id" element={<CurationDetail />} />
          <Route path="/creators" element={<CreatorsPage />} />
          <Route path="/creator/:id" element={<CreatorShop />} />
          <Route path="/product/:id" element={<ProductRoute />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

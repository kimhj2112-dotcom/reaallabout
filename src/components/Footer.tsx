export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <div className="logo logo--sm">REAALL<span>ABOUT</span></div>
          <p>크리에이터가 직접 만들고 판매하는 굿즈 마켓</p>
        </div>
        <div className="footer__cols">
          <div>
            <h4>고객센터</h4>
            <p>평일 10:00 – 18:00 (점심 12:00 – 13:00)</p>
            <p>주말·공휴일 휴무</p>
          </div>
          <div>
            <h4>크리에이터</h4>
            <p><a href="#apply" onClick={(e) => e.preventDefault()}>입점 신청</a></p>
            <p><a href="#guide" onClick={(e) => e.preventDefault()}>판매 가이드</a></p>
          </div>
          <div>
            <h4>안내</h4>
            <p><a href="#terms" onClick={(e) => e.preventDefault()}>이용약관</a></p>
            <p><a href="#privacy" onClick={(e) => e.preventDefault()}><b>개인정보처리방침</b></a></p>
          </div>
        </div>
      </div>
      <div className="container footer__legal">
        <p>본 사이트는 데모 프로젝트입니다. 표시된 상품·크리에이터·가격은 모두 예시 데이터입니다.</p>
        <p>© {new Date().getFullYear()} REAALLABOUT</p>
      </div>
    </footer>
  );
}

import { ArrowRight, Bell, Bot, MapPinned, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <main className="page home-page">
      <header className="topbar">
        <div className="brand-mark" aria-hidden="true"><Sparkles size={22} /></div>
        <div className="topbar__title"><strong>MyViUni <span>AI</span></strong><small>SMART CAMPUS ASSISTANT</small></div>
        <div className="avatar" aria-label="Tài khoản demo">SV</div>
      </header>

      <section className="hero-card">
        <div className="hero-card__glow" aria-hidden="true" />
        <span className="hero-card__eyebrow"><span className="online-dot" /> Trợ lý luôn sẵn sàng</span>
        <h1>Xin chào,<br /><em>bạn cần giúp gì?</em></h1>
        <p>Khám phá campus và tìm thông tin nhanh hơn cùng MyViUni AI.</p>
        <Link className="button button--light" to="/chat">Hỏi MyViUni AI <ArrowRight size={18} aria-hidden="true" /></Link>
        <div className="hero-card__ornament" aria-hidden="true"><Sparkles size={46} /></div>
      </section>

      <section className="section-block" aria-labelledby="services-title">
        <div className="section-heading"><h2 id="services-title">Dịch vụ dành cho bạn</h2><span>Khám phá ngay</span></div>
        <div className="service-grid">
          <Link className="service-card" to="/chat">
            <span className="service-card__icon service-card__icon--blue"><Bot size={25} aria-hidden="true" /></span>
            <strong>Trợ lý AI</strong>
            <p>Hỏi đáp thông tin campus với nguồn tham khảo rõ ràng.</p>
            <span className="service-card__action">Bắt đầu <ArrowRight size={16} aria-hidden="true" /></span>
          </Link>
          <Link className="service-card" to="/campus">
            <span className="service-card__icon service-card__icon--green"><MapPinned size={25} aria-hidden="true" /></span>
            <strong>Bản đồ campus</strong>
            <p>Tìm tòa nhà và xem tuyến đi bộ mô phỏng.</p>
            <span className="service-card__action">Xem bản đồ <ArrowRight size={16} aria-hidden="true" /></span>
          </Link>
        </div>
      </section>

      <section className="announcement" aria-label="Lưu ý dữ liệu">
        <span className="announcement__icon"><Bell size={18} aria-hidden="true" /></span>
        <div><strong>Lưu ý về dữ liệu</strong><p>Giờ mở cửa, vị trí phụ và tuyến đường trong bản demo cần được VinUni xác minh.</p></div>
      </section>
    </main>
  );
}

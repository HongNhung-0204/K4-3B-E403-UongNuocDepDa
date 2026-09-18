import { useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Flag, MapPin, Navigation2, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { CAMPUS_LOCATIONS } from '../data/campusLocations';
import { CAMPUS_ROUTES } from '../data/campusRoutes';
import { nextProgress, previousProgress, type NavigationProgress } from '../lib/navigationSteps';

export default function NavigationPage() {
  const { routeId } = useParams();
  const navigate = useNavigate();
  const route = CAMPUS_ROUTES.find((item) => item.id === routeId);
  const destination = route ? CAMPUS_LOCATIONS.find((item) => item.id === route.to) : undefined;
  const [progress, setProgress] = useState<NavigationProgress>({ index: 0, complete: false });

  useEffect(() => setProgress({ index: 0, complete: false }), [routeId]);

  if (!route || route.steps.length === 0) {
    return <main className="page simple-page"><div className="page-heading"><span className="eyebrow">CHỈ ĐƯỜNG</span><h1>Không tìm thấy tuyến</h1><p>Tuyến này chưa có trong bản demo.</p></div><div className="empty-panel"><Navigation2 size={40} aria-hidden="true" /><strong>Hãy chọn một điểm đến khác</strong><p>Chỉ các tuyến đã chuẩn bị sẵn mới có hướng dẫn.</p><button type="button" className="button button--primary" onClick={() => navigate('/campus')}>Quay lại Campus</button></div></main>;
  }

  const step = route.steps[progress.index];
  const next = route.steps[progress.index + 1];
  const returnToMap = () => navigate(`/campus?destination=${encodeURIComponent(route.to)}`);

  return (
    <main className="page navigation-page">
      <section className="navigation-panel">
        <header className="navigation-topbar"><button type="button" onClick={returnToMap} aria-label="Quay lại bản đồ"><ArrowLeft size={20} aria-hidden="true" /></button><span>MÔ PHỎNG CHỈ ĐƯỜNG</span><button type="button" onClick={returnToMap} aria-label="Kết thúc chỉ đường"><X size={20} aria-hidden="true" /></button></header>

        {progress.complete ? (
          <div className="navigation-complete" aria-live="polite"><span className="navigation-complete__icon"><CheckCircle2 size={48} aria-hidden="true" /></span><span className="navigation-kicker">HÀNH TRÌNH HOÀN TẤT</span><h1>Bạn đã đến nơi</h1><p>{destination?.subtitle ?? destination?.name ?? 'Điểm đến'} · {destination?.name ?? route.to}</p><button type="button" className="navigation-primary" onClick={returnToMap}>Kết thúc và xem bản đồ <ArrowRight size={18} aria-hidden="true" /></button></div>
        ) : (
          <>
            <div className="navigation-destination"><span className="navigation-destination__icon"><MapPin size={22} aria-hidden="true" /></span><div><span className="navigation-kicker">ĐIỂM ĐẾN</span><h1>{destination?.subtitle ?? destination?.name ?? route.to}</h1><p>{destination?.name ?? route.to}</p></div></div>
            <div className="navigation-stats"><div><strong>{route.distanceMeters} m</strong><span>Tổng quãng đường</span></div><div><strong>~{route.durationMinutes} phút</strong><span>Thời gian demo</span></div></div>
            <div className="navigation-progress"><div><span>Bước {progress.index + 1}/{route.steps.length}</span><span>{Math.round(((progress.index + 1) / route.steps.length) * 100)}%</span></div><div className="navigation-progress__track"><span style={{ width: `${((progress.index + 1) / route.steps.length) * 100}%` }} /></div></div>
            <div className="navigation-instruction" aria-live="polite"><span className="navigation-instruction__icon"><Navigation2 size={27} aria-hidden="true" /></span><span className="navigation-kicker">BƯỚC HIỆN TẠI · {step.distanceMeters} M</span><h2>{step.instruction}</h2></div>
            {next && <div className="navigation-next"><span><Flag size={17} aria-hidden="true" /> TIẾP THEO · {next.distanceMeters} M</span><p>{next.instruction}</p></div>}
            <div className="navigation-actions"><button type="button" className="navigation-secondary" disabled={progress.index === 0} onClick={() => setProgress((current) => previousProgress(current.index, route.steps.length))}><ArrowLeft size={18} aria-hidden="true" /> Trước</button><button type="button" className="navigation-primary" onClick={() => setProgress((current) => nextProgress(current.index, route.steps.length))}>{progress.index === route.steps.length - 1 ? 'Hoàn tất' : 'Tiếp theo'} <ArrowRight size={18} aria-hidden="true" /></button></div>
            <button type="button" className="navigation-end" onClick={returnToMap}>Kết thúc chỉ đường</button>
          </>
        )}
        <p className="navigation-disclaimer">Mô phỏng chỉ đường trong campus · Không sử dụng GPS thời gian thực. Tuyến và khoảng cách cần được kiểm tra thực địa.</p>
      </section>
    </main>
  );
}

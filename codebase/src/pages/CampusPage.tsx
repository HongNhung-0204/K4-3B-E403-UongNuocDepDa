import { useNavigate, useSearchParams } from 'react-router-dom';
import VinUniCampusMap from '../components/VinUniCampusMap';
import { CAMPUS_LOCATIONS } from '../data/campusLocations';

export default function CampusPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const destination = searchParams.get('destination') ?? undefined;
  const unknownDestination = Boolean(destination && !CAMPUS_LOCATIONS.some((item) => item.id === destination));

  return (
    <main className="page simple-page campus-page">
      <div className="page-heading"><span className="eyebrow">KHÁM PHÁ VINUNI</span><h1>Bản đồ campus</h1><p>Tìm địa điểm và xem tuyến đi bộ mô phỏng từ Quảng trường trung tâm.</p></div>
      {unknownDestination && <p className="map-notice" role="status">Không tìm thấy điểm đến trong bản đồ demo. Hãy chọn một địa điểm khác.</p>}
      <VinUniCampusMap
        initialDestinationId={destination}
        currentLocationId="central-plaza"
        onStartNavigation={(routeId) => navigate(`/navigation/${encodeURIComponent(routeId)}`)}
      />
      <p className="map-disclaimer">Bản đồ dùng ảnh campus được cung cấp. Vị trí phụ, khoảng cách và tuyến đường là dữ liệu demo cần khảo sát thực địa.</p>
    </main>
  );
}

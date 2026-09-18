import { useMemo, useState } from 'react';
import { CAMPUS_LOCATIONS, type CampusLocation } from '../data/campusLocations';
import { CAMPUS_ROUTES } from '../data/campusRoutes';
import './VinUniCampusMap.css';

type Props = {
  initialDestinationId?: string;
  currentLocationId?: string;
  onStartNavigation?: (routeId: string) => void;
};

const MAP_WIDTH = 1600;
const MAP_HEIGHT = 925;

export default function VinUniCampusMap({
  initialDestinationId = 'library-c',
  currentLocationId = 'central-plaza',
  onStartNavigation,
}: Props) {
  const [selectedId, setSelectedId] = useState(initialDestinationId);
  const [query, setQuery] = useState('');
  const [zoom, setZoom] = useState(1);

  const selected = CAMPUS_LOCATIONS.find((item) => item.id === selectedId);
  const route = CAMPUS_ROUTES.find(
    (item) => item.from === currentLocationId && item.to === selectedId,
  );

  const visibleLocations = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('vi');
    if (!normalized) return CAMPUS_LOCATIONS;
    return CAMPUS_LOCATIONS.filter((item) =>
      `${item.name} ${item.subtitle ?? ''} ${item.label}`
        .toLocaleLowerCase('vi')
        .includes(normalized),
    );
  }, [query]);

  const routePoints = route?.path.map(([x, y]) => `${x},${y}`).join(' ');

  const selectLocation = (location: CampusLocation) => {
    setSelectedId(location.id);
    setQuery('');
  };

  return (
    <section className="campus-map" aria-label="Bản đồ VinUni">
      <div className="campus-map__toolbar">
        <label className="campus-map__search">
          <span className="sr-only">Tìm địa điểm</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm tòa nhà, thư viện, phòng lab…"
          />
        </label>
        <div className="campus-map__zoom" aria-label="Điều khiển thu phóng">
          <button type="button" onClick={() => setZoom((value) => Math.min(2, value + 0.25))}>+</button>
          <button type="button" onClick={() => setZoom((value) => Math.max(1, value - 0.25))}>−</button>
        </div>
      </div>

      {query && (
        <div className="campus-map__results">
          {visibleLocations.slice(0, 6).map((location) => (
            <button key={location.id} type="button" onClick={() => selectLocation(location)}>
              <strong>{location.name}</strong>
              {location.subtitle && <span>{location.subtitle}</span>}
            </button>
          ))}
          {!visibleLocations.length && <p>Không tìm thấy địa điểm phù hợp.</p>}
        </div>
      )}

      <div className="campus-map__viewport">
        <div className="campus-map__canvas" style={{ width: `${zoom * 100}%` }}>
          <img src="/maps/vinuni-campus.webp" alt="Bản đồ tổng thể khuôn viên VinUni" />
          <svg
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            aria-label="Các địa điểm và tuyến đường trên campus"
            role="img"
          >
            {routePoints && (
              <>
                <polyline className="campus-map__route-shadow" points={routePoints} />
                <polyline className="campus-map__route" points={routePoints} />
              </>
            )}

            {CAMPUS_LOCATIONS.map((location) => {
              const isSelected = location.id === selectedId;
              const isCurrent = location.id === currentLocationId;
              return (
                <g
                  key={location.id}
                  className={`campus-map__marker${isSelected ? ' is-selected' : ''}${isCurrent ? ' is-current' : ''}`}
                  role="button"
                  tabIndex={0}
                  aria-label={`${location.name}${location.subtitle ? `, ${location.subtitle}` : ''}`}
                  transform={`translate(${location.x} ${location.y})`}
                  onClick={() => selectLocation(location)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') selectLocation(location);
                  }}
                >
                  <circle className="campus-map__marker-ring" r="28" />
                  <circle className="campus-map__marker-dot" r="18" />
                  <text y="5" textAnchor="middle">{isCurrent ? '●' : location.label}</text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {selected && (
        <article className="campus-map__place-card">
          <div>
            <span className="campus-map__eyebrow">ĐIỂM ĐẾN</span>
            <h2>{selected.subtitle ?? selected.name}</h2>
            <p>{selected.name}{route ? ` · ${route.distanceMeters} m · ${route.durationMinutes} phút đi bộ` : ''}</p>
          </div>
          {route ? (
            <button type="button" onClick={() => onStartNavigation?.(route.id)}>
              Bắt đầu chỉ đường
            </button>
          ) : (
            <span className="campus-map__no-route">Chưa có tuyến demo từ vị trí hiện tại</span>
          )}
        </article>
      )}
    </section>
  );
}


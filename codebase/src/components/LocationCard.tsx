import { ArrowUpRight, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

type Props = { locationId: string; title: string; subtitle: string };

export default function LocationCard({ locationId, title, subtitle }: Props) {
  return (
    <div className="location-card">
      <div className="location-card__pin"><MapPin size={20} aria-hidden="true" /></div>
      <div className="location-card__copy"><strong>{title}</strong><span>{subtitle}</span></div>
      <Link to={`/campus?destination=${encodeURIComponent(locationId)}`} className="location-card__link" aria-label={`Xem ${title} trên Campus Map`}>
        <ArrowUpRight size={19} aria-hidden="true" />
      </Link>
      <Link to={`/campus?destination=${encodeURIComponent(locationId)}`} className="location-card__cta">Xem trên Campus Map</Link>
    </div>
  );
}

import { useNavigate, useSearchParams } from 'react-router-dom';
import VinUniCampusMap from '../components/VinUniCampusMap';

export default function CampusPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  return (
    <main>
      <VinUniCampusMap
        initialDestinationId={searchParams.get('destination') ?? 'library-c'}
        currentLocationId="central-plaza"
        onStartNavigation={(routeId) => navigate(`/navigation/${routeId}`)}
      />
    </main>
  );
}


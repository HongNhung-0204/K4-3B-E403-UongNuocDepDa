import { Navigate, Route, Routes } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import HomePage from './pages/HomePage';
import ChatPage from './pages/ChatPage';
import CampusPage from './pages/CampusPage';
import NavigationPage from './pages/NavigationPage';
import ProfilePage from './pages/ProfilePage';

export default function App() {
  return (
    <div className="app-shell">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/campus" element={<CampusPage />} />
        <Route path="/navigation/:routeId" element={<NavigationPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <BottomNav />
    </div>
  );
}

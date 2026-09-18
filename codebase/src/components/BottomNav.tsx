import { House, MapPinned, MessageCircleMore, UserRound } from 'lucide-react';
import { NavLink, useLocation } from 'react-router-dom';

const items = [
  { to: '/', label: 'Trang chủ', icon: House, end: true },
  { to: '/chat', label: 'Chat AI', icon: MessageCircleMore, end: false },
  { to: '/campus', label: 'Campus', icon: MapPinned, end: false },
  { to: '/profile', label: 'Cá nhân', icon: UserRound, end: false },
];

export default function BottomNav() {
  const location = useLocation();
  const onNavigation = location.pathname.startsWith('/navigation/');

  return (
    <nav className="bottom-nav" aria-label="Điều hướng chính">
      <div className="bottom-nav__inner">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `bottom-nav__item${isActive || (onNavigation && to === '/campus') ? ' is-active' : ''}`}
            aria-current={location.pathname === to || (onNavigation && to === '/campus') ? 'page' : undefined}
          >
            <Icon size={21} strokeWidth={2.1} aria-hidden="true" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

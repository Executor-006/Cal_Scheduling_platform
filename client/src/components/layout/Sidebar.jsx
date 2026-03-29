import { NavLink } from 'react-router-dom';
import { Calendar, Clock, CalendarCheck, User } from 'lucide-react';
import useUser from '../../hooks/useUser';
import BrandMark from './BrandMark';

const navItems = [
  { to: '/dashboard', label: 'Event Types', icon: Calendar },
  { to: '/availability', label: 'Availability', icon: Clock },
  { to: '/bookings', label: 'Bookings', icon: CalendarCheck },
];

export default function Sidebar() {
  const { user } = useUser();

  return (
    <aside className="hidden lg:flex fixed left-0 top-0 z-50 h-screen bg-white border-r border-gray-200 flex-col w-56">
      {/* Logo */}
      <div className="h-14 px-4 flex items-center border-b border-gray-100">
        <BrandMark />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-0.5">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] font-medium transition-colors ${
                isActive
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <Icon size={16} strokeWidth={1.75} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* User info */}
      <div className="px-3 py-3 border-t border-gray-100">
        <div className="flex items-center gap-2.5 px-2.5 py-1.5">
          <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
            <User size={14} className="text-gray-500" />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-gray-900 truncate">{user?.name || 'Loading...'}</p>
            <p className="text-[11px] text-gray-400 truncate">{user?.email || ''}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

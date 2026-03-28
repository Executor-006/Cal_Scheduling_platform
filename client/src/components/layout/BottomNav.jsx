import { NavLink } from 'react-router-dom';
import { Calendar, Clock, CalendarCheck } from 'lucide-react';

const navItems = [
  { to: '/dashboard', label: 'Event Types', icon: Calendar },
  { to: '/availability', label: 'Availability', icon: Clock },
  { to: '/bookings', label: 'Bookings', icon: CalendarCheck },
];

export default function BottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200">
      <div className="flex items-center justify-around h-14 pb-[env(safe-area-inset-bottom)]">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
                isActive
                  ? 'text-gray-900'
                  : 'text-gray-400 hover:text-gray-600'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                <span className={`text-[10px] ${isActive ? 'font-semibold' : 'font-medium'}`}>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}

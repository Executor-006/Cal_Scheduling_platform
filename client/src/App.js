import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './hooks/useUser';
import ColdStartBanner from './components/ui/ColdStartBanner';
import Dashboard from './pages/Dashboard';
import Availability from './pages/Availability';
import Bookings from './pages/Bookings';
import PublicBooking from './pages/PublicBooking';

function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <ColdStartBanner />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/availability" element={<Availability />} />
          <Route path="/bookings" element={<Bookings />} />
          <Route path="/:username/:slug" element={<PublicBooking />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;

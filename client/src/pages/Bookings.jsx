import { useState } from 'react';
import Shell from '../components/layout/Shell';
import TopBar from '../components/layout/TopBar';
import BookingsList from '../components/bookings/BookingsList';
import RescheduleModal from '../components/bookings/RescheduleModal';
import useBookings from '../hooks/useBookings';
import { rescheduleBooking } from '../lib/api';

export default function Bookings() {
  const [tab, setTab] = useState('upcoming');
  const { bookings, loading, cancel, refetch } = useBookings(tab);
  const [rescheduleTarget, setRescheduleTarget] = useState(null);

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      await cancel(id);
    }
  };

  const handleReschedule = async (id, data) => {
    await rescheduleBooking(id, data);
    refetch();
  };

  return (
    <Shell>
      <TopBar title="Bookings" subtitle="See upcoming and past events booked through your event type links." />

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg w-fit">
          {['upcoming', 'past'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                tab === t
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <BookingsList
        bookings={bookings}
        loading={loading}
        onCancel={handleCancel}
        onReschedule={setRescheduleTarget}
        isPast={tab === 'past'}
      />

      <RescheduleModal
        isOpen={!!rescheduleTarget}
        onClose={() => setRescheduleTarget(null)}
        booking={rescheduleTarget}
        onReschedule={handleReschedule}
      />
    </Shell>
  );
}

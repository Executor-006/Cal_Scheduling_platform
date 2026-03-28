import { CalendarX } from 'lucide-react';
import BookingCard from './BookingCard';

export default function BookingsList({ bookings, loading, onCancel, onReschedule, isPast }) {
  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-48 mb-3" />
            <div className="space-y-2">
              <div className="h-3 bg-gray-100 rounded w-32" />
              <div className="h-3 bg-gray-100 rounded w-40" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12 sm:py-16 bg-white rounded-lg border border-gray-200">
        <CalendarX size={40} className="mx-auto text-gray-300 mb-3" />
        <p className="text-gray-500 font-medium">
          {isPast ? 'No past bookings' : 'No upcoming bookings'}
        </p>
        <p className="text-sm text-gray-400 mt-1">
          {isPast ? 'Your completed and cancelled bookings will appear here.' : 'When someone books a meeting, it will appear here.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {bookings.map(booking => (
        <BookingCard
          key={booking.id}
          booking={booking}
          onCancel={onCancel}
          onReschedule={onReschedule}
          isPast={isPast}
        />
      ))}
    </div>
  );
}

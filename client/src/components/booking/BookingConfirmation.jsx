import { CheckCircle, Calendar, Clock, User } from 'lucide-react';
import { formatDate, formatTime } from '../../lib/dateUtils';

export default function BookingConfirmation({ booking, eventInfo, timezone }) {
  return (
    <div className="text-center py-6 sm:py-8 px-4">
      <CheckCircle size={48} className="mx-auto text-green-500 mb-4" />
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">Booking Confirmed!</h2>
      <p className="text-sm text-gray-600 mb-6">
        A confirmation has been sent to <span className="font-medium">{booking.booker_email}</span>
      </p>
      <div className="bg-gray-50 rounded-lg p-4 text-left max-w-sm mx-auto space-y-3">
        <div className="flex items-start gap-3">
          <Calendar size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900">{eventInfo.title}</p>
            <p className="text-sm text-gray-600">{formatDate(booking.start_time, timezone)}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Clock size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-gray-900">
              {formatTime(booking.start_time, timezone)} - {formatTime(booking.end_time, timezone)}
            </p>
            <p className="text-xs text-gray-500">{eventInfo.duration} min</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <User size={16} className="text-gray-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-gray-900">{eventInfo.user_name}</p>
        </div>
      </div>
    </div>
  );
}

import { Calendar, Clock, User, Mail, MessageSquare, RefreshCw } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { formatDateTime } from '../../lib/dateUtils';

export default function BookingCard({ booking, onCancel, onReschedule, isPast }) {
  const statusVariant = {
    confirmed: 'success',
    cancelled: 'danger',
    rescheduled: 'default',
  };

  return (
    <div className="bg-white rounded-md border border-gray-200 p-4 hover:border-gray-300 transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div className="space-y-1.5 min-w-0 flex-1">
          {/* Title + status */}
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-medium text-gray-900">{booking.event_title}</h3>
            <Badge variant={statusVariant[booking.status] || 'default'}>
              {booking.status}
            </Badge>
            {booking.rescheduled_from && <Badge variant="blue">rescheduled</Badge>}
          </div>

          {/* Details grid */}
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <div className="flex items-center gap-1.5 text-[13px] text-gray-500">
              <User size={13} className="flex-shrink-0" />
              <span className="truncate">{booking.booker_name}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[13px] text-gray-500">
              <Mail size={13} className="flex-shrink-0" />
              <span className="truncate">{booking.booker_email}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[13px] text-gray-500">
              <Calendar size={13} className="flex-shrink-0" />
              <span>{formatDateTime(booking.start_time, booking.booker_timezone || 'Asia/Kolkata')}</span>
            </div>
            <div className="flex items-center gap-1.5 text-[13px] text-gray-500">
              <Clock size={13} className="flex-shrink-0" />
              <span>{booking.duration}m</span>
            </div>
          </div>

          {/* Custom answers */}
          {booking.answers && booking.answers.length > 0 && (
            <div className="pt-2 mt-1 border-t border-gray-100 space-y-1">
              {booking.answers.map((a, i) => (
                <div key={i} className="flex items-start gap-1.5 text-[13px]">
                  <MessageSquare size={12} className="text-gray-300 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-400">{a.question}:</span>
                  <span className="text-gray-600">{a.answer}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        {!isPast && booking.status === 'confirmed' && (
          <div className="flex gap-2 flex-shrink-0">
            <Button variant="secondary" size="sm" onClick={() => onReschedule(booking)}>
              <RefreshCw size={13} className="mr-1.5" />
              Reschedule
            </Button>
            <Button variant="danger" size="sm" onClick={() => onCancel(booking.id)}>
              Cancel
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

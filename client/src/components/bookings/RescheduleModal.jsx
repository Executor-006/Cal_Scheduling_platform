import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import CalendarView from '../booking/CalendarView';
import TimeSlotList from '../booking/TimeSlotList';
import { getPublicSlots } from '../../lib/api';
import { getUserTimezone, formatDate } from '../../lib/dateUtils';

export default function RescheduleModal({ isOpen, onClose, booking, onReschedule }) {
  const [timezone] = useState(getUserTimezone());
  const [selectedDate, setSelectedDate] = useState(null);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setSelectedDate(null);
      setSlots([]);
      setSelectedSlot(null);
      setError('');
    }
  }, [isOpen]);

  useEffect(() => {
    if (!selectedDate || !booking) return;
    setSlotsLoading(true);
    setSelectedSlot(null);
    getPublicSlots(booking.host_username, booking.event_slug, selectedDate, timezone)
      .then(data => setSlots(data.slots))
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [selectedDate, booking, timezone]);

  const handleConfirm = async () => {
    if (!selectedSlot) return;
    setSubmitting(true);
    setError('');
    try {
      await onReschedule(booking.id, {
        start_time: selectedSlot.utc,
        timezone,
      });
      onClose();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reschedule');
    } finally {
      setSubmitting(false);
    }
  };

  if (!booking) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Reschedule: ${booking.event_title}`}>
      <div className="space-y-4">
        {error && <div className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</div>}

        <div className="text-sm text-gray-600">
          Current: {formatDate(booking.start_time, timezone)}
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-900 mb-2">Pick a new date</h4>
          <CalendarView
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            timezone={timezone}
          />
        </div>

        {selectedDate && (
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-2">Pick a new time</h4>
            <TimeSlotList
              slots={slots}
              selectedSlot={selectedSlot}
              onSelectSlot={setSelectedSlot}
              loading={slotsLoading}
            />
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>Cancel</Button>
          <Button onClick={handleConfirm} disabled={!selectedSlot || submitting}>
            {submitting ? 'Rescheduling...' : 'Confirm Reschedule'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

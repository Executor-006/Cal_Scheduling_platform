import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, Globe, ArrowLeft } from 'lucide-react';
import CalendarView from '../components/booking/CalendarView';
import TimeSlotList from '../components/booking/TimeSlotList';
import BookingForm from '../components/booking/BookingForm';
import BookingConfirmation from '../components/booking/BookingConfirmation';
import { getPublicEventInfo, getPublicSlots, createPublicBooking } from '../lib/api';
import { getUserTimezone, dayjs, formatDate } from '../lib/dateUtils';
import { TIMEZONES } from '../lib/constants';

export default function PublicBooking() {
  const { username, slug } = useParams();
  const [eventInfo, setEventInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [timezone, setTimezone] = useState(getUserTimezone());
  const [selectedDate, setSelectedDate] = useState(null);
  const [slots, setSlots] = useState([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [booking, setBooking] = useState(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  // Step tracking for mobile: 'calendar' | 'time' | 'form'
  const [mobileStep, setMobileStep] = useState('calendar');

  useEffect(() => {
    getPublicEventInfo(username, slug)
      .then(setEventInfo)
      .catch(() => setError('Event type not found'))
      .finally(() => setLoading(false));
  }, [username, slug]);

  useEffect(() => {
    if (!selectedDate) return;
    setSlotsLoading(true);
    setSelectedSlot(null);
    setMobileStep('time');
    getPublicSlots(username, slug, selectedDate, timezone)
      .then(data => setSlots(data.slots))
      .catch(() => setSlots([]))
      .finally(() => setSlotsLoading(false));
  }, [selectedDate, timezone, username, slug]);

  const handleSelectSlot = (slot) => {
    setSelectedSlot(slot);
    setMobileStep('form');
  };

  const handleBack = () => {
    if (mobileStep === 'form') {
      setSelectedSlot(null);
      setMobileStep('time');
    } else if (mobileStep === 'time') {
      setSelectedDate(null);
      setMobileStep('calendar');
    }
  };

  const handleBook = async ({ name, email, answers }) => {
    setBookingLoading(true);
    try {
      const result = await createPublicBooking(username, slug, {
        name,
        email,
        start_time: selectedSlot.utc,
        timezone,
        answers,
      });
      setBooking(result);
    } finally {
      setBookingLoading(false);
    }
  };

  const formatSlotTime = (slot) => {
    if (!slot) return '';
    const h = parseInt(slot.time.split(':')[0]);
    const m = slot.time.split(':')[1];
    const ampm = h >= 12 ? 'PM' : 'AM';
    const dh = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${dh}:${m} ${ampm}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-500 text-lg">{error}</p>
          <p className="text-sm text-gray-400 mt-2">This booking link may be invalid or inactive.</p>
        </div>
      </div>
    );
  }

  if (booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full max-w-md">
          <BookingConfirmation booking={booking} eventInfo={eventInfo} timezone={timezone} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 w-full max-w-3xl">
        <div className="flex flex-col md:flex-row">

          {/* Left panel - Event info */}
          <div className="md:w-64 p-4 sm:p-6 border-b md:border-b-0 md:border-r border-gray-200">
            <p className="text-sm text-gray-500 mb-1">{eventInfo.user_name}</p>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">{eventInfo.title}</h1>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={16} className="flex-shrink-0" />
                <span>
                  {eventInfo.duration} min
                  {eventInfo.buffer_time > 0 && (
                    <span className="text-gray-400 ml-1">({eventInfo.buffer_time}m buffer)</span>
                  )}
                </span>
              </div>
              {eventInfo.description && (
                <p className="text-sm text-gray-500">{eventInfo.description}</p>
              )}
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Globe size={16} className="flex-shrink-0" />
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="text-sm border-0 bg-transparent text-gray-600 focus:outline-none cursor-pointer -ml-1 max-w-[180px] truncate"
                >
                  {TIMEZONES.map(tz => (
                    <option key={tz} value={tz}>{tz}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Selected date/time summary */}
            {selectedDate && (
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-900">{formatDate(dayjs(selectedDate), timezone)}</p>
                {selectedSlot && (
                  <p className="text-sm text-gray-600">{formatSlotTime(selectedSlot)}</p>
                )}
              </div>
            )}
          </div>

          {/* Right panel - Selection */}
          <div className="flex-1 p-4 sm:p-6">

            {/* Mobile back button */}
            {mobileStep !== 'calendar' && (
              <button
                onClick={handleBack}
                className="md:hidden flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
              >
                <ArrowLeft size={16} /> Back
              </button>
            )}

            {/* Desktop: show calendar + slots side by side; Mobile: step-by-step */}
            {!selectedSlot ? (
              <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
                {/* Calendar - visible on desktop always, on mobile only in 'calendar' step */}
                <div className={`${mobileStep !== 'calendar' ? 'hidden md:block' : ''}`}>
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Select a Date</h3>
                  <CalendarView
                    selectedDate={selectedDate}
                    onSelectDate={setSelectedDate}
                    timezone={timezone}
                  />
                </div>

                {/* Time slots - visible on desktop when date selected, on mobile in 'time' step */}
                {selectedDate && (
                  <div className={`md:w-48 ${mobileStep !== 'time' ? 'hidden md:block' : ''}`}>
                    <h3 className="text-sm font-medium text-gray-900 mb-3">Select a Time</h3>
                    <TimeSlotList
                      slots={slots}
                      selectedSlot={selectedSlot}
                      onSelectSlot={handleSelectSlot}
                      loading={slotsLoading}
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className={`${mobileStep !== 'form' ? 'hidden md:block' : ''}`}>
                {/* Desktop back button */}
                <button
                  onClick={() => { setSelectedSlot(null); setMobileStep('time'); }}
                  className="hidden md:flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 mb-4"
                >
                  <ArrowLeft size={16} /> Back
                </button>
                <h3 className="text-sm font-medium text-gray-900 mb-4">Enter your details</h3>
                <BookingForm
                  onSubmit={handleBook}
                  loading={bookingLoading}
                  customQuestions={eventInfo.custom_questions || []}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

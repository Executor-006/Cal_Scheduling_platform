export default function TimeSlotList({ slots, selectedSlot, onSelectSlot, loading }) {
  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2, 3, 4, 5].map(i => (
          <div key={i} className="h-10 bg-gray-100 rounded-md animate-pulse" />
        ))}
      </div>
    );
  }

  if (slots.length === 0) {
    return <div className="text-sm text-gray-500 py-4">No available times for this date.</div>;
  }

  return (
    <div className="space-y-2 max-h-72 sm:max-h-80 overflow-y-auto pr-1">
      {slots.map((slot) => {
        const isSelected = selectedSlot?.utc === slot.utc;
        const hours = parseInt(slot.time.split(':')[0]);
        const minutes = slot.time.split(':')[1];
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const displayHour = hours > 12 ? hours - 12 : hours === 0 ? 12 : hours;

        return (
          <button
            key={slot.utc}
            onClick={() => onSelectSlot(slot)}
            className={`w-full px-3 sm:px-4 py-2 sm:py-2.5 text-sm font-medium rounded-md border transition-colors ${
              isSelected
                ? 'border-gray-900 bg-gray-900 text-white'
                : 'border-blue-200 text-blue-600 hover:border-blue-400 hover:bg-blue-50'
            }`}
          >
            {displayHour}:{minutes} {ampm}
          </button>
        );
      })}
    </div>
  );
}

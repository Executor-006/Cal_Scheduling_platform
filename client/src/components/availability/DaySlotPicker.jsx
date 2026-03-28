import Toggle from '../ui/Toggle';

export default function DaySlotPicker({ day, schedule, onChange }) {
  const isActive = schedule?.is_active || false;
  const startTime = schedule?.start_time || '09:00';
  const endTime = schedule?.end_time || '17:00';

  const handleToggle = (val) => {
    onChange({ ...schedule, day_of_week: day.value, is_active: val, start_time: startTime, end_time: endTime });
  };

  const handleTimeChange = (field, value) => {
    onChange({ ...schedule, day_of_week: day.value, is_active: isActive, start_time: startTime, end_time: endTime, [field]: value });
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-3 border-b border-gray-100 last:border-0">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <Toggle enabled={isActive} onChange={handleToggle} />
        </div>
        <span className={`w-24 sm:w-28 text-sm font-medium ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>
          {/* Show short label on mobile, full on desktop */}
          <span className="sm:hidden">{day.short}</span>
          <span className="hidden sm:inline">{day.label}</span>
        </span>
      </div>
      {isActive ? (
        <div className="flex items-center gap-2 ml-9 sm:ml-0">
          <input
            type="time"
            value={startTime}
            onChange={(e) => handleTimeChange('start_time', e.target.value)}
            className="px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-[120px]"
          />
          <span className="text-gray-400 text-sm">to</span>
          <input
            type="time"
            value={endTime}
            onChange={(e) => handleTimeChange('end_time', e.target.value)}
            className="px-2 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-[120px]"
          />
        </div>
      ) : (
        <span className="text-sm text-gray-400 ml-9 sm:ml-0">Unavailable</span>
      )}
    </div>
  );
}

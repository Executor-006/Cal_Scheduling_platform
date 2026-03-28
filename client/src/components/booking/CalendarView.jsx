import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { dayjs } from '../../lib/dateUtils';

export default function CalendarView({ selectedDate, onSelectDate, timezone }) {
  const [currentMonth, setCurrentMonth] = useState(dayjs().tz(timezone));

  const startOfMonth = currentMonth.startOf('month');
  const startDay = startOfMonth.day();
  const daysInMonth = currentMonth.daysInMonth();
  const today = dayjs().tz(timezone).startOf('day');

  const prevMonth = () => setCurrentMonth(prev => prev.subtract(1, 'month'));
  const nextMonth = () => setCurrentMonth(prev => prev.add(1, 'month'));

  const days = [];
  for (let i = 0; i < startDay; i++) {
    days.push(<div key={`empty-${i}`} />);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const date = currentMonth.date(d);
    const dateStr = date.format('YYYY-MM-DD');
    const isPast = date.isBefore(today);
    const isSelected = selectedDate === dateStr;
    const isToday = date.isSame(today, 'day');

    days.push(
      <button
        key={d}
        disabled={isPast}
        onClick={() => onSelectDate(dateStr)}
        className={`aspect-square w-full max-w-[40px] rounded-full text-sm font-medium transition-colors mx-auto flex items-center justify-center
          ${isPast ? 'text-gray-300 cursor-not-allowed' : 'hover:bg-blue-50 cursor-pointer'}
          ${isSelected ? 'bg-gray-900 text-white hover:bg-gray-800' : ''}
          ${isToday && !isSelected ? 'border border-gray-900 text-gray-900' : ''}
          ${!isPast && !isSelected && !isToday ? 'text-gray-700' : ''}
        `}
      >
        {d}
      </button>
    );
  }

  return (
    <div className="w-full max-w-[320px]">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-1.5 hover:bg-gray-100 rounded">
          <ChevronLeft size={18} className="text-gray-600" />
        </button>
        <h3 className="text-sm font-semibold text-gray-900">
          {currentMonth.format('MMMM YYYY')}
        </h3>
        <button onClick={nextMonth} className="p-1.5 hover:bg-gray-100 rounded">
          <ChevronRight size={18} className="text-gray-600" />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
          <div key={d} className="text-center text-xs font-medium text-gray-500 py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days}
      </div>
    </div>
  );
}

import { useState, useEffect } from 'react';
import DaySlotPicker from './DaySlotPicker';
import TimezoneSelect from './TimezoneSelect';
import Button from '../ui/Button';
import { DAYS_OF_WEEK } from '../../lib/constants';

export default function AvailabilityForm({ availability, onSave, loading }) {
  const [schedules, setSchedules] = useState({});
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const map = {};
    DAYS_OF_WEEK.forEach(day => {
      const existing = availability.find(a => a.day_of_week === day.value);
      map[day.value] = existing
        ? { ...existing }
        : { day_of_week: day.value, start_time: '09:00', end_time: '17:00', is_active: false };
    });
    setSchedules(map);
  }, [availability]);

  const handleDayChange = (schedule) => {
    setSchedules(prev => ({ ...prev, [schedule.day_of_week]: schedule }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(Object.values(schedules));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6 sm:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          {[...Array(7)].map((_, i) => (
            <div key={i} className="h-10 bg-gray-100 rounded" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      <div className="mb-6">
        <TimezoneSelect value={timezone} onChange={setTimezone} />
      </div>
      <div>
        {DAYS_OF_WEEK.map(day => (
          <DaySlotPicker
            key={day.value}
            day={day}
            schedule={schedules[day.value]}
            onChange={handleDayChange}
          />
        ))}
      </div>
      <div className="mt-6 flex items-center gap-3">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
        {saved && <span className="text-sm text-green-600">Saved!</span>}
      </div>
    </div>
  );
}

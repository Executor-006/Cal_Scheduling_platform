import { TIMEZONES } from '../../lib/constants';

export default function TimezoneSelect({ value, onChange }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {TIMEZONES.map(tz => (
          <option key={tz} value={tz}>{tz}</option>
        ))}
      </select>
    </div>
  );
}

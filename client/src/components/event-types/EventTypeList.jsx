import EventTypeCard from './EventTypeCard';
import { Link2 } from 'lucide-react';

export default function EventTypeList({ eventTypes, onEdit, onDelete, onToggle }) {
  if (eventTypes.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-md border border-gray-200">
        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Link2 size={20} className="text-gray-400" />
        </div>
        <h3 className="text-sm font-medium text-gray-900 mb-1">No event types</h3>
        <p className="text-sm text-gray-500">Create your first event type to get started.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-md divide-y divide-gray-200 overflow-hidden">
      {eventTypes.map((et, i) => (
        <EventTypeCard
          key={et.id}
          eventType={et}
          index={i}
          onEdit={onEdit}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}

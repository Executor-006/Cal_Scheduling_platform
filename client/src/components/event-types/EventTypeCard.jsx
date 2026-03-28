import { useState, useRef, useEffect } from 'react';
import { MoreHorizontal, Pencil, Trash2, ExternalLink, Check, Clock, Copy } from 'lucide-react';
import Toggle from '../ui/Toggle';
import { EVENT_COLORS } from '../../lib/constants';
import useUser from '../../hooks/useUser';

export default function EventTypeCard({ eventType, index, onEdit, onDelete, onToggle }) {
  const { user } = useUser();
  const color = EVENT_COLORS[index % EVENT_COLORS.length];
  const [copied, setCopied] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const username = user?.username || 'john';

  // Close menu on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    if (menuOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [menuOpen]);

  const copyLink = () => {
    const url = `${window.location.origin}/${username}/${eventType.slug}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setMenuOpen(false);
    setTimeout(() => setCopied(false), 2000);
  };

  const bookingUrl = `/${username}/${eventType.slug}`;

  return (
    <div className={`group relative bg-white hover:bg-gray-50/50 transition-colors`}>
      {/* Colored left border accent */}
      <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-md ${color.replace('border-', 'bg-')}`} />

      <div className="flex items-center justify-between p-4 pl-5">
        {/* Left: Event info */}
        <div className="flex-1 min-w-0 mr-4">
          <div className="flex items-center gap-2 mb-0.5">
            <h3
              className="text-sm font-medium text-gray-900 truncate cursor-pointer hover:underline"
              onClick={() => window.open(bookingUrl, '_blank')}
              title={`Open ${bookingUrl}`}
            >
              {eventType.title}
            </h3>
            {!eventType.is_active && (
              <span className="text-[10px] uppercase tracking-wider font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                Hidden
              </span>
            )}
          </div>

          {/* Duration + buffer row */}
          <div className="flex items-center gap-3 mt-1">
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock size={12} />
              <span>{eventType.duration}m</span>
              {eventType.buffer_time > 0 && (
                <span className="text-gray-400">+ {eventType.buffer_time}m buffer</span>
              )}
            </div>
          </div>

          {/* Public link */}
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="text-xs text-gray-400 truncate">
              {window.location.host}{bookingUrl}
            </span>
            {copied && (
              <span className="text-[10px] text-green-600 font-medium">Copied!</span>
            )}
          </div>

          {/* Custom questions count */}
          {eventType.custom_questions && eventType.custom_questions.length > 0 && (
            <p className="text-[11px] text-gray-400 mt-1">
              {eventType.custom_questions.length} custom question{eventType.custom_questions.length > 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Right: Toggle + menu */}
        <div className="flex items-center gap-2">
          <Toggle enabled={eventType.is_active} onChange={(val) => onToggle(eventType.id, val)} />

          {/* Three-dot menu (Cal.com style) */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            >
              <MoreHorizontal size={16} />
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-20 py-1">
                <button
                  onClick={() => { window.open(bookingUrl, '_blank'); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <ExternalLink size={14} /> Preview
                </button>
                <button
                  onClick={copyLink}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                  Copy link
                </button>
                <button
                  onClick={() => { onEdit(eventType); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Pencil size={14} /> Edit
                </button>
                <div className="border-t border-gray-100 my-1" />
                <button
                  onClick={() => { onDelete(eventType.id); setMenuOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

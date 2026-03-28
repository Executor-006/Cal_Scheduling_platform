import { useState, useEffect, useCallback } from 'react';
import * as api from '../lib/api';

export default function useEventTypes() {
  const [eventTypes, setEventTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getEventTypes();
      setEventTypes(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load event types');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const create = async (data) => {
    const result = await api.createEventType(data);
    setEventTypes(prev => [result, ...prev]);
    return result;
  };

  const update = async (id, data) => {
    const result = await api.updateEventType(id, data);
    setEventTypes(prev => prev.map(et => et.id === id ? result : et));
    return result;
  };

  const toggle = async (id, is_active) => {
    const result = await api.toggleEventType(id, is_active);
    setEventTypes(prev => prev.map(et => et.id === id ? result : et));
    return result;
  };

  const remove = async (id) => {
    await api.deleteEventType(id);
    setEventTypes(prev => prev.filter(et => et.id !== id));
  };

  return { eventTypes, loading, error, refetch: fetch, create, update, toggle, remove };
}

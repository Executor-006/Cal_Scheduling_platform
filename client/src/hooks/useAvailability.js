import { useState, useEffect, useCallback } from 'react';
import * as api from '../lib/api';

export default function useAvailability() {
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getAvailability();
      setAvailability(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load availability');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const save = async (schedules) => {
    const data = await api.updateAvailability(schedules);
    setAvailability(data);
    return data;
  };

  return { availability, loading, error, refetch: fetch, save };
}

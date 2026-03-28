import { useState, useEffect, useCallback } from 'react';
import * as api from '../lib/api';

export default function useBookings(status = 'upcoming') {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getBookings(status);
      setBookings(data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load bookings');
    } finally {
      setLoading(false);
    }
  }, [status]);

  useEffect(() => { fetch(); }, [fetch]);

  const cancel = async (id) => {
    await api.cancelBooking(id);
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  return { bookings, loading, error, refetch: fetch, cancel };
}

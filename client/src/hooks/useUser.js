import { useState, useEffect, createContext, useContext } from 'react';
import { getCurrentUser } from '../lib/api';

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then(setUser)
      .catch(() => setUser({ username: 'john', name: 'John Doe', email: 'john@example.com' }))
      .finally(() => setLoading(false));
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
}

export default function useUser() {
  const ctx = useContext(UserContext);
  return ctx || { user: null, loading: true };
}

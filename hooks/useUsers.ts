import {
  fetchUsers as apiFetchUsers,
  getFallbackUsers,
  UserWithoutPassword
} from '@/lib/users';
import { useCallback, useEffect, useState } from 'react';

export function useUsers() {
  const [users, setUsers] = useState<UserWithoutPassword[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await apiFetchUsers();
      setUsers(data);
    } catch (error: any) {
      console.error('Error in useUsers hook:', error);
      setError(error.message || 'Failed to fetch users');

      // Use fallback data in development to keep UI working
      if (process.env.NODE_ENV !== 'production') {
        setUsers(getFallbackUsers());
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    isLoading,
    error,
    refetch: fetchUsers
  };
}

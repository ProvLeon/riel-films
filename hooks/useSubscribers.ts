import { Subscriber } from '@/types/mongodbSchema'; // Assuming Subscriber type is defined
import { useCallback, useEffect, useState } from 'react';

export function useSubscribers(initialFetch: boolean = true) {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(initialFetch); // Start loading if initialFetch is true
  const [error, setError] = useState<string | null>(null);

  const fetchSubscribers = useCallback(async (params: Record<string, string> = {}) => {
    setIsLoading(true);
    setError(null);
    console.log("Fetching subscribers with params:", params); // Debug log

    try {
      const queryParams = new URLSearchParams(params);
      const response = await fetch(`/api/subscribers?${queryParams.toString()}`, {
        cache: 'no-store', // Ensure fresh data, especially in admin areas
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({})); // Try to parse error
        throw new Error(errorData.error || `Failed to fetch subscribers (${response.status})`);
      }

      const data: Subscriber[] = await response.json();
      console.log("Subscribers fetched successfully:", data); // Debug log
      setSubscribers(data);
    } catch (err: any) {
      console.error('Error fetching subscribers:', err);
      setError(err.message || 'An error occurred while fetching subscribers.');
      setSubscribers([]); // Clear data on error
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialFetch) {
      fetchSubscribers(); // Initial fetch on mount if requested
    }
  }, [fetchSubscribers, initialFetch]);

  return {
    subscribers,
    isLoading,
    error,
    fetchSubscribers, // Expose fetch function for manual refetching/filtering
    setSubscribers, // Expose setter if needed for optimistic updates elsewhere
  };
}

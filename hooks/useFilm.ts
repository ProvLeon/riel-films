import { Film } from '@/types/mongodbSchema';
import { useCallback, useEffect, useState } from 'react';

export function useFilm(slugOrId: string | null) {
  const [film, setFilm] = useState<Film | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFilm = useCallback(async (identifier: string) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log(`Fetching film with identifier: ${identifier}`); // Debugging

      // Determine if this is a MongoDB ID (24 hex chars) or a slug
      const isMongoId = /^[0-9a-fA-F]{24}$/.test(identifier);

      // Use the appropriate endpoint based on the type of identifier
      const endpoint = isMongoId
        ? `/api/films/id/${identifier}`
        : `/api/films/${identifier}`;

      const response = await fetch(endpoint);

      if (!response.ok) {
        let errorMessage = `Failed to fetch film: ${response.status}`;

        try {
          const errorData = await response.json();
          errorMessage += ` - ${errorData.error || ''}`;
        } catch (e) {
          // If parsing JSON fails, just use the status code
        }

        console.error(errorMessage); // Log for debugging
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Film data received:', data); // Debugging
      setFilm(data);
    } catch (error: any) {
      console.error('Error in useFilm hook:', error); // Log for debugging
      setError(error.message);
      setFilm(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (slugOrId) {
      fetchFilm(slugOrId);
    } else {
      setFilm(null);
    }
  }, [slugOrId, fetchFilm]);

  const refetch = useCallback(() => {
    if (slugOrId) {
      fetchFilm(slugOrId);
    }
  }, [slugOrId, fetchFilm]);

  return { film, isLoading, error, refetch };
}

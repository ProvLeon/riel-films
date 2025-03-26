import { Film } from '@/types/mongodbSchema';
import { useCallback, useEffect, useState } from 'react';

export function useFilm(slug: string | null) {
  const [film, setFilm] = useState<Film | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFilm = useCallback(async (filmSlug: string) => {
    setIsLoading(true);
    setError(null);

    try {
      // console.log(`Fetching film with slug: ${filmSlug}`); // Debugging
      const response = await fetch(`/api/films/${filmSlug}`);

      // console.log(response)
      if (!response.ok) {
        let errorMessage = `Failed to fetch film: ${response.status}`;

        try {
          const errorData = await response.json();
          errorMessage += ` - ${errorData.error || ''}`;
        } catch (e) {
          // If parsing JSON fails, just use the status code
        }

        // console.error(errorMessage); // Log for debugging
        throw new Error(errorMessage);
      }

      const data = await response.json();
      // console.log('Film data received:', data); // Debugging
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
    if (slug) {
      fetchFilm(slug);
    } else {
      setFilm(null);
    }
  }, [slug, fetchFilm]);

  const refetch = useCallback(() => {
    if (slug) {
      fetchFilm(slug);
    }
  }, [slug, fetchFilm]);

  return { film, isLoading, error, refetch };
}

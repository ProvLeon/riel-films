import { useCallback, useEffect, useState } from 'react';

export function useFilm(filmId: string | null) {
  const [film, setFilm] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFilm = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/films/${id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch film');
      }

      const data = await response.json();
      setFilm(data);
    } catch (error: any) {
      setError(error.message);
      setFilm(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (filmId) {
      fetchFilm(filmId);
    } else {
      setFilm(null);
    }
  }, [filmId, fetchFilm]);

  const refetch = useCallback(() => {
    if (filmId) {
      fetchFilm(filmId);
    }
  }, [filmId, fetchFilm]);

  return { film, isLoading, error, refetch };
}

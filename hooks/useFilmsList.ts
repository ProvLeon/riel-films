import { useData } from '@/context/DataContext';
import { debounce } from '@/lib/utils';
import { Film } from '@/types/mongodbSchema';
import { useCallback, useEffect, useState } from 'react';

export function useFilmsList(params: Record<string, any> = {}) {
  const { films, isLoadingFilms, errorFilms, fetchFilms } = useData();
  const [filteredFilms, setFilteredFilms] = useState<Film[]>(films);

  // Debounced fetch function
  const debouncedFetch = useCallback(
    debounce((params: Record<string, any>) => {
      fetchFilms(params);
    }, 300),
    [fetchFilms]
  );

  useEffect(() => {
    debouncedFetch(params);
  }, [debouncedFetch, JSON.stringify(params)]);

  useEffect(() => {
    setFilteredFilms(films);
  }, [films]);

  return {
    films: filteredFilms,
    isLoading: isLoadingFilms,
    error: errorFilms,
    refetch: () => fetchFilms(params)
  };
}

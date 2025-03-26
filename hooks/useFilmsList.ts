import { useData } from '@/context/DataContext';
import { Film } from '@/types/mongodbSchema';
import { useEffect, useState } from 'react';


export function useFilmsList(params: Record<string, any> = {}) {
  const { films, isLoadingFilms, errorFilms, fetchFilms } = useData();
  const [filteredFilms, setFilteredFilms] = useState<Film[]>(films);

  useEffect(() => {
    fetchFilms(params);
  }, [JSON.stringify(params)]);

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

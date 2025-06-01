import { useFilmsList } from "./useFilmsList";
import { useProductionsList } from "./useProductionsList";
import { useStoriesList } from "./useStoriesList";

export function usePageData() {
  const films = useFilmsList();
  const productions = useProductionsList();
  const stories = useStoriesList();

  const isLoading = films.isLoading || productions.isLoading || stories.isLoading;
  const error = films.error || productions.error || stories.error;

  const refetchAll = () => {
    films.refetch();
    productions.refetch();
    stories.refetch();
  };

  return {
    films: films.films,
    productions: productions.productions,
    stories: stories.stories,
    isLoading,
    error,
    refetchAll,
  };
}

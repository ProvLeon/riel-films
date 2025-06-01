import { useData } from '@/context/DataContext';
import { Production } from '@/types/mongodbSchema';
import { useEffect, useState } from 'react';

export function useProductionsList(params: Record<string, any> = {}) {
  const { productions, isLoadingProductions, errorProductions, fetchProductions } = useData();
  const [filteredProductions, setFilteredProductions] = useState<Production[]>(productions);

  useEffect(() => {
    fetchProductions(params);
  }, [JSON.stringify(params), fetchProductions]); // Add fetchProductions to dependency array

  useEffect(() => {
    setFilteredProductions(productions);
  }, [productions]);

  return {
    productions: filteredProductions,
    isLoading: isLoadingProductions,
    error: errorProductions,
    refetch: () => fetchProductions(params)
  };
}

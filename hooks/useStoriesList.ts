import { useData } from '@/context/DataContext';
import { Story } from '@/types/mongodbSchema';
import { useEffect, useState } from 'react';



export function useStoriesList(params: Record<string, any> = {}) {
  const { stories, isLoadingStories, errorStories, fetchStories } = useData();
  const [filteredStories, setFilteredStories] = useState<Story[]>(stories);

  useEffect(() => {
    fetchStories(params);
  }, [JSON.stringify(params)]);

  useEffect(() => {
    setFilteredStories(stories);
  }, [stories]);

  return {
    stories: filteredStories,
    isLoading: isLoadingStories,
    error: errorStories,
    refetch: () => fetchStories(params)
  };
}

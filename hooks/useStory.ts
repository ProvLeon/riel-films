import { Story } from '@/types/mongodbSchema';
import { useCallback, useEffect, useState } from 'react';


export function useStory(storyId: string | null) {
  const [story, setStory] = useState<Story | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStory = useCallback(async (slug: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/stories/${slug}`);

      if (!response.ok) {
        throw new Error('Failed to fetch story');
      }

      const data = await response.json();
      setStory(data);
    } catch (error: any) {
      setError(error.message);
      setStory(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (storyId) {
      fetchStory(storyId);
    } else {
      setStory(null);
    }
  }, [storyId, fetchStory]);

  const refetch = useCallback(() => {
    if (storyId) {
      fetchStory(storyId);
    }
  }, [storyId, fetchStory]);

  return { story, isLoading, error, refetch };
}

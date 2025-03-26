import { Production } from '@/types/mongodbSchema';
import { useCallback, useEffect, useState } from 'react';

export function useProduction(slug: string | null) {
  const [production, setProduction] = useState<Production | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProduction = useCallback(async (prodSlug: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/productions/${prodSlug}`);

      if (!response.ok) {
        throw new Error('Failed to fetch production');
      }

      const data = await response.json();
      setProduction(data);
    } catch (error: any) {
      setError(error.message);
      setProduction(null);
    } finally {
      setIsLoading(false);
    }
  }, []);


  useEffect(() => {
    if (slug) {
      fetchProduction(slug);
    } else {
      setProduction(null);
    }
  }, [slug, fetchProduction]);

  const refetch = useCallback(() => {
    if (slug) {
      fetchProduction(slug);
    }
  }, [slug, fetchProduction]);

  return { production, isLoading, error, refetch };
}

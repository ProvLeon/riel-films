import { Production } from '@/types/mongodbSchema';
import { useCallback, useEffect, useState } from 'react';

export function useProduction(slug: string | null) {
  const [production, setProduction] = useState<Production | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProduction = useCallback(async (slug: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/productions/${slug}`);

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
    if (production) {
      fetchProduction(production.slug!);
    } else {
      setProduction(null);
    }
  }, [production, fetchProduction]);

  const refetch = useCallback(() => {
    if (production) {
      fetchProduction(production.slug!);
    }
  }, [production, fetchProduction]);

  return { production, isLoading, error, refetch };
}

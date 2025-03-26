import { initializeAnalytics, trackEvent, trackPageView } from '@/lib/analytics-client';
import { useCallback, useEffect, useState } from 'react';

export function useAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize analytics on component mount
  useEffect(() => {
    initializeAnalytics();
  }, []);

  // Fetch analytics data
  const fetchAnalyticsData = useCallback(async (days: number = 30, type?: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      queryParams.append('days', days.toString());
      if (type) queryParams.append('type', type);

      const response = await fetch(`/api/analytics?${queryParams.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const data = await response.json();
      setAnalyticsData(data);
    } catch (error: any) {
      setError(error.message);
      setAnalyticsData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    analyticsData,
    isLoading,
    error,
    trackEvent,
    trackPageView,
    fetchAnalyticsData,
  };
}

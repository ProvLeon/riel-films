import { initializeAnalytics, trackEvent, trackPageView } from '@/lib/analytics-client';
import { AnalyticsDataType } from '@/types/analytics'; // Import the specific type
import { useCallback, useEffect, useState } from 'react';

export function useAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsDataType | null>(null); // Use specific type
  const [isLoading, setIsLoading] = useState<boolean>(false); // Start false, set true on fetch
  const [error, setError] = useState<string | null>(null);

  // Initialize analytics on component mount
  useEffect(() => {
    initializeAnalytics();
  }, []);

  // Fetch analytics data
  const fetchAnalyticsData = useCallback(async (days: number = 30, type?: string) => {
    setIsLoading(true); // Set loading true when fetching starts
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      queryParams.append('days', days.toString());
      if (type) queryParams.append('type', type);

      console.log(`Fetching analytics for ${days} days...`); // Debug log
      const response = await fetch(`/api/analytics?${queryParams.toString()}`);

      if (!response.ok) {
        const errorBody = await response.text(); // Get error body for more details
        console.error(`Analytics fetch failed: ${response.status}`, errorBody);
        throw new Error(`Failed to fetch analytics data (Status: ${response.status})`);
      }

      const data: AnalyticsDataType = await response.json(); // Type the response
      console.log('Analytics data received:', data); // Debug log
      setAnalyticsData(data);
    } catch (error: any) {
      console.error('Error in fetchAnalyticsData:', error); // Debug log
      setError(error.message);
      setAnalyticsData(null); // Clear data on error
    } finally {
      setIsLoading(false); // Set loading false when fetching ends
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

import { AnalyticsData } from '@/types/analytics';

export async function fetchAnalyticsData(days: number = 30, type?: string): Promise<AnalyticsData> {
  const queryParams = new URLSearchParams();
  queryParams.append('days', days.toString());
  if (type) queryParams.append('type', type);

  const response = await fetch(`/api/analytics?${queryParams.toString()}`);

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.error || `Failed to fetch analytics data: ${response.status}`);
  }

  return await response.json();
}

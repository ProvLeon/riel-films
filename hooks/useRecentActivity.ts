import { fetchUsers, UserWithoutPassword } from '@/lib/users'; // Import User type if needed for user lookup simulations
import { useCallback, useEffect, useState } from 'react';

// Define ActivityItem interface directly here or import if defined elsewhere
export interface ActivityItem {
  id: string;
  action: string; // e.g., "created", "updated", "logged in"
  item: string; // e.g., Film title, "Settings", "User: John Doe"
  time: string; // Formatted relative time string (e.g., "5 min ago")
  user: string; // User name or "Anonymous Visitor"
  userImage: string; // URL to user avatar or placeholder
  isNew?: boolean; // Flag for recent activity
  type: 'film' | 'production' | 'story' | 'user' | 'settings' | 'auth' | 'other'; // Added 'auth' and 'other'
  itemId?: string; // ID of the related item (film, user, etc.)
  contentUrlPath?: string; // Optional URL to view the related content
  timestamp: Date; // Add the raw timestamp
}

// Helper function for relative time formatting (Exported)
export function getRelativeTimeString(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

  if (diffInSeconds < 60) return rtf.format(-diffInSeconds, 'second');
  if (diffInSeconds < 3600) { const m = Math.floor(diffInSeconds / 60); return rtf.format(-m, 'minute'); }
  if (diffInSeconds < 86400) { const h = Math.floor(diffInSeconds / 3600); return rtf.format(-h, 'hour'); }
  if (diffInSeconds < 604800) { const d = Math.floor(diffInSeconds / 86400); return rtf.format(-d, 'day'); }
  if (diffInSeconds < 2592000) { const w = Math.floor(diffInSeconds / 604800); return rtf.format(-w, 'week'); }
  // For older dates, show the actual date
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

// Helper function to check if activity is recent (< 30 min)
function isRecentActivity(timestamp: Date): boolean {
  return (new Date().getTime() - timestamp.getTime()) < (30 * 60 * 1000);
}

// Hook to fetch recent activity
export function useRecentActivity(initialLimit: number = 100) { // Fetch more by default for the main page
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async (limit: number = initialLimit, type?: string) => {
    setIsLoading(true);
    setError(null);
    console.log(`Fetching activities with limit: ${limit}, type: ${type || 'all'}`); // Debug

    try {
      const queryParams = new URLSearchParams();
      queryParams.append('limit', limit.toString());
      if (type) queryParams.append('type', type);

      const response = await fetch(`/api/activity?${queryParams.toString()}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch activity (${response.status})`);
      }

      const data = await response.json();

      // Process timestamps immediately after fetching
      const processedActivities = (data.activities || []).map((act: any) => ({
        ...act,
        timestamp: new Date(act.timestamp || Date.now()), // Ensure timestamp is a Date object
        time: getRelativeTimeString(new Date(act.timestamp || Date.now())) // Generate relative time string
      }));

      console.log("Fetched activities:", processedActivities); // Debug
      setActivities(processedActivities);

    } catch (err: any) {
      console.error('Error fetching activity:', err);
      setError(err.message || 'Failed to fetch activity');
      setActivities([]); // Clear activities on error
    } finally {
      setIsLoading(false);
    }
  }, [initialLimit]); // Removed generatePlaceholderActivities dependency

  useEffect(() => {
    fetchActivities(); // Initial fetch
  }, [fetchActivities]);

  // Add a simulated new activity (for demo/testing - REMOVE FOR PRODUCTION)
  const addSimulatedActivity = (activity: Partial<ActivityItem>) => {
    const now = new Date();
    const newActivity: ActivityItem = {
      id: `sim-${Date.now()}`,
      action: activity.action || 'performed an action on',
      item: activity.item || 'Unknown Item',
      time: getRelativeTimeString(now), // Use helper
      user: activity.user || 'Simulated User',
      userImage: activity.userImage || '/images/avatar/placeholder.jpg',
      isNew: true,
      type: activity.type || 'other',
      itemId: activity.itemId || `item-${Date.now()}`,
      contentUrlPath: '#', // Default path for simulation
      timestamp: now // Add timestamp
    };
    setActivities(prev => [newActivity, ...prev]);
    // Optional: Remove oldest if list exceeds a certain length visually
    // setTimeout(() => { setActivities(current => current.slice(0, initialLimit)) }, 10000);
  };

  return {
    activities,
    isLoading,
    error,
    refetchActivities: fetchActivities,
    addSimulatedActivity // Keep for potential testing
  };
}

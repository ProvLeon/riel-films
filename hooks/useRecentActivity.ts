import { fetchUsers } from '@/lib/users';
import { useCallback, useEffect, useState } from 'react';

export interface ActivityItem {
  id: string;
  action: string;
  item: string;
  time: string;
  user: string;
  userImage: string;
  isNew?: boolean;
  type: 'film' | 'production' | 'story' | 'user' | 'settings';
  itemId: string;
}

export function useRecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivities = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/activity');

      if (!response.ok) {
        throw new Error('Failed to fetch activity');
      }

      const data = await response.json();
      setActivities(data.activities);
    } catch (error: any) {
      console.error('Error fetching activity:', error);
      setError(error.message || 'Failed to fetch activity');

      // Generate placeholder activities if in development environment
      if (process.env.NODE_ENV !== 'production') {
        const placeholderActivities = await generatePlaceholderActivities();
        setActivities(placeholderActivities);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Generate placeholder activities for development
  const generatePlaceholderActivities = async (): Promise<ActivityItem[]> => {
    try {
      // Try to get real users
      const users = await fetchUsers();

      const actions = [
        { action: 'added a new film', type: 'film', item: 'The Silent Victory' },
        { action: 'updated production', type: 'production', item: 'Mountain Echoes' },
        { action: 'published a story', type: 'story', item: 'Indigenous Filmmaking' },
        { action: 'added a comment on', type: 'film', item: 'Lake of Memories' },
        { action: 'edited settings', type: 'settings', item: 'Site Configuration' }
      ];

      return actions.map((action, index) => {
        const user = users[index % users.length];
        const timeOffset = index * 30; // minutes ago
        const date = new Date(Date.now() - timeOffset * 60 * 1000);

        return {
          id: `placeholder-${index}`,
          action: action.action,
          item: action.item,
          time: getRelativeTimeString(date),
          user: user?.name || 'Anonymous User',
          userImage: user?.image || '/images/avatar/placeholder.jpg',
          isNew: index === 0,
          type: action.type as ActivityItem['type'],
          itemId: `placeholder-item-${index}`
        };
      });
    } catch (error) {
      // Fallback with hardcoded users if we can't fetch real ones
      return [
        {
          id: 'placeholder-1',
          action: 'added a new film',
          item: 'The Silent Victory',
          time: 'Just now',
          user: 'Admin User',
          userImage: '/images/avatar/1.jpg',
          isNew: true,
          type: 'film',
          itemId: 'placeholder-film-1'
        },
        {
          id: 'placeholder-2',
          action: 'updated production',
          item: 'Mountain Echoes',
          time: '30 minutes ago',
          user: 'Ama Serwaa',
          userImage: '/images/hero/hero3.jpg',
          isNew: false,
          type: 'production',
          itemId: 'placeholder-production-1'
        }
      ];
    }
  };

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  // Add a simulated new activity (for demo purposes)
  const addSimulatedActivity = (activity: Partial<ActivityItem>) => {
    const newActivity: ActivityItem = {
      id: `new-${Date.now()}`,
      action: activity.action || 'performed an action on',
      item: activity.item || 'Unknown Item',
      time: 'Just now',
      user: activity.user || 'Anonymous User',
      userImage: activity.userImage || '/images/avatar/placeholder.jpg',
      isNew: true,
      type: activity.type || 'film',
      itemId: activity.itemId || `item-${Date.now()}`
    };

    setActivities(prev => [newActivity, ...prev.slice(0, 4)]);
  };

  return {
    activities,
    isLoading,
    error,
    refetchActivities: fetchActivities,
    addSimulatedActivity
  };
}

// Helper function for relative time formatting
export function getRelativeTimeString(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Just now";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString();
  }
}

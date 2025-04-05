import { useCallback, useEffect, useState } from 'react';
import { getRelativeTimeString } from './useRecentActivity';
import { Notification } from '@prisma/client'; // Import Prisma-generated type

// Type for API response structure (if different from raw Notification)
// Use Prisma's generated Notification type directly or extend it
export interface NotificationItem extends Omit<Notification, 'userId'> { // Omit sensitive fields if necessary
  timeAgo?: string; // Add the formatted time string
}

export interface NotificationData {
  notifications: NotificationItem[];
  unreadCount: number;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalNotifications: number;
    limit: number;
  } | null;
}

export function useNotifications(initialFetch: boolean = true) {
  const [data, setData] = useState<NotificationData>({
    notifications: [],
    unreadCount: 0,
    pagination: null
  });
  const [isLoading, setIsLoading] = useState(initialFetch);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async (params: { limit?: number; page?: number; unread?: boolean } = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams();
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.unread) queryParams.append('unread', 'true');

      const response = await fetch(`/api/notifications?${queryParams.toString()}`, { cache: 'no-store' });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Failed to fetch notifications (${response.status})`);
      }
      const fetchedData = await response.json();

      // Process timestamps into relative strings *client-side*
      const processedNotifications = (fetchedData.notifications || []).map((n: Notification): NotificationItem => ({
        ...n,
        timestamp: new Date(n.timestamp), // Ensure it's a Date object client-side
        timeAgo: getRelativeTimeString(new Date(n.timestamp)) // Add relative time
      }));

      setData({
        notifications: processedNotifications,
        unreadCount: fetchedData.unreadCount || 0,
        pagination: fetchedData.pagination || null
      });

    } catch (err: any) {
      console.error("Error fetching notifications:", err);
      setError(err.message);
      // Optionally keep stale data on error
      // setData({ notifications: [], unreadCount: 0, pagination: null });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId: string | 'all') => {
    const previousData = { ...data }; // Store previous state for potential rollback

    // --- Optimistic Update ---
    setData(prev => {
      let newUnreadCount = prev.unreadCount;
      const updatedNotifications = prev.notifications.map(n => {
        // Only update if it's currently unread
        if ((notificationId === 'all' || n.id === notificationId) && !n.read) {
          if (notificationId !== 'all') { // Decrement only for single mark
            newUnreadCount = Math.max(0, newUnreadCount - 1);
          }
          return { ...n, read: true };
        }
        return n;
      });
      // Reset count if 'all' was selected
      if (notificationId === 'all') newUnreadCount = 0;
      return { ...prev, notifications: updatedNotifications, unreadCount: newUnreadCount };
    });
    // --- End Optimistic Update ---


    // --- API Call ---
    try {
      const response = await fetch(`/api/notifications`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: notificationId }) // API expects {ids: 'all' or ['id1', 'id2']}
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to mark notification(s) as read on server');
      }
      console.log(`Successfully marked notifications as read:`, notificationId);
      // Optionally refetch to get the absolute latest state, though optimistic update handles UI
      // fetchNotifications({ page: data.pagination?.currentPage, limit: data.pagination?.limit });

    } catch (err: any) { // Specify error type
      console.error("Failed to mark notification(s) as read:", err);
      // --- Rollback Optimistic Update ---
      setError(`Failed to update read status: ${err.message}. Reverting.`);
      setData(previousData); // Revert UI state
      // --- End Rollback ---
    }
  }, [data]); // Removed fetchNotifications dependency unless used in catch


  useEffect(() => {
    if (initialFetch) {
      fetchNotifications({ limit: 15 }); // Fetch initial batch
    }
  }, [fetchNotifications, initialFetch]);

  return {
    notifications: data.notifications,
    unreadCount: data.unreadCount,
    pagination: data.pagination,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
  };
}

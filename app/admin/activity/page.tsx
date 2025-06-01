"use client";
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Activity as ActivityIcon, Loader2, AlertTriangle, ArrowLeft, Filter, RefreshCw, ChevronLeft, ChevronRight, Calendar, Clock, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRecentActivity, ActivityItem } from '@/hooks/useRecentActivity'; // Use the hook
import { Button } from '@/components/UI/Button';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/UI/Alert';
import ErrorBoundary from '@/components/ErrorBoundary';
import { cn } from '@/lib/utils';

// Activity Log Item Component
const ActivityLogItem = ({
  action,
  item,
  time, // The pre-formatted relative time string from the hook
  user,
  userImage,
  type,
  itemId,
  contentUrlPath,
  timestamp // Raw timestamp for potential sorting/display
}: ActivityItem & { contentUrlPath?: string }) => {

  const fullTimestamp = timestamp.toLocaleString(); // For title attribute

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="flex items-start gap-4 py-4 border-b border-border-light dark:border-border-dark last:border-b-0"
    >
      {/* Avatar */}
      <div className="flex-shrink-0">
        <Image
          src={userImage || "/images/avatar/placeholder.jpg"}
          width={40}
          height={40}
          alt={user || 'User'}
          className="object-cover rounded-full border-2 border-gray-200 dark:border-film-black-700"
          onError={(e) => { e.currentTarget.src = "/images/avatar/placeholder.jpg"; }}
        />
      </div>

      {/* Activity Details */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-800 dark:text-gray-100 mb-0.5">
          <span className="font-semibold text-gray-900 dark:text-white">{user}</span>{' '}
          <span className="text-gray-600 dark:text-gray-300">{action}</span>{' '}
          {contentUrlPath && contentUrlPath !== '#' ? (
            <Link
              href={contentUrlPath}
              className="text-film-red-600 dark:text-film-red-500 font-medium hover:underline truncate"
              title={item}
            >
              {item}
            </Link>
          ) : (
            <span className="font-medium text-gray-900 dark:text-white truncate" title={item}>{item}</span>
          )}
        </p>
        <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 gap-2">
          <Calendar size={12} />
          <time dateTime={timestamp.toISOString()} title={fullTimestamp}>
            {time}
          </time>
          {/* Optional: Display event type */}
          <span className={cn(
            "ml-auto px-1.5 py-0.5 rounded text-[10px] font-medium capitalize",
            type === 'film' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
              : type === 'story' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                : type === 'production' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
                  : type === 'user' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300'
                    : type === 'auth' ? 'bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-300'
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
          )}>
            {type === 'auth' ? 'Authentication' : type}
          </span>
        </div>
      </div>
    </motion.div>
  );
};


// Main Activity Page Component
export default function ActivityLogPage() {
  const [filterType, setFilterType] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15; // Show more items per page here

  // Use the hook to get activities. The hook fetches a default large limit.
  const { activities, isLoading, error, refetchActivities } = useRecentActivity(100); // Fetch up to 100 initially

  // Apply client-side filtering based on the selected type
  const filteredActivities = useMemo(() => {
    if (!filterType) return activities;
    return activities.filter(act => {
      if (filterType === 'auth') return ['login', 'logout'].includes(act.event); // Special case for auth
      return act.type === filterType;
    });
  }, [activities, filterType]);

  // const fetchAllActivities = useCallback(async (page = 1, type = '') => {
  //   setIsLoading(true);
  //   setError(null);
  //   try {
  //     // Adjust limit/offset for pagination if API supports it
  //     // For now, fetching a larger limit initially
  //     const limit = 100; // Fetch more initially, paginate client-side for now
  //     const queryParams = new URLSearchParams();
  //     queryParams.append('limit', limit.toString());
  //     if (type) queryParams.append('type', type);

  //     const response = await fetch(`/api/activity?${queryParams.toString()}`);
  //     if (!response.ok) {
  //       throw new Error('Failed to fetch full activity log');
  //     }
  //     const data = await response.json();
  //     // Ensure timestamp is a Date object
  //     const processedActivities = data.activities.map((act: any) => ({
  //       ...act,
  //       timestamp: new Date(act.timestamp || Date.now()) // Ensure timestamp is Date object
  //     }));
  //     setActivities(processedActivities);

  //   } catch (err: any) {
  //     console.error('Error fetching activity log:', err);
  //     setError(err.message || 'Failed to fetch activity log');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, []);

  // useEffect(() => {
  //   fetchAllActivities(currentPage, filterType);
  // }, [fetchAllActivities, currentPage, filterType]);

  // Paginate the *filtered* activities
  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const paginatedActivities = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredActivities.slice(startIndex, endIndex);
  }, [filteredActivities, currentPage, itemsPerPage]);

  // Handle page change for client-side pagination
  const handlePageChange = useCallback((newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [totalPages]);

  // Handle filter change - fetches based on type
  const handleFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const newType = e.target.value;
    setFilterType(newType);
    setCurrentPage(1); // Reset page when filter changes
    // Note: Currently, filtering is client-side. If API supported type filtering,
    // you would call `refetchActivities(100, newType)` here instead of just setting state.
  }, []); // Removed refetchActivities from dependencies as filtering is client-side for now

  // Reset filters
  const resetFilters = useCallback(() => {
    setFilterType('');
    setCurrentPage(1);
    // Optional: refetch all if needed, but client-side filtering should handle it
    // refetchActivities(100);
  }, []); // Removed refetchActivities dependency

  return (
    <div className="bg-gray-50 dark:bg-film-black-950 min-h-screen">
      <div className="p-4 md:p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <div className="flex items-center mb-2">
              <Link href="/admin/dashboard" className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-film-black-800 mr-2 transition-colors" aria-label="Back to Dashboard">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <ActivityIcon className="h-6 w-6 text-film-red-600 mr-2" />
                Full Activity Log
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 ml-10 md:ml-0 text-sm">
              Comprehensive log of all actions and events.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 bg-white dark:bg-film-black-900 p-4 rounded-xl shadow-sm border border-border-light dark:border-border-dark">
          <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative flex-grow w-full sm:w-auto">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
              <select
                value={filterType}
                onChange={handleFilterChange}
                className="input-style pl-10 w-full" // Use global style
                aria-label="Filter activities by type"
              >
                <option value="">All Activity Types</option>
                <option value="film">Film Changes</option>
                <option value="production">Production Changes</option>
                <option value="story">Story Changes</option>
                <option value="user">User Management</option>
                <option value="settings">Settings Changes</option>
                <option value="auth">Login/Logout</option>
                {/* Add more specific event types if needed */}
              </select>
            </div>
            <Button variant="ghost" size="sm" onClick={resetFilters} icon={<RefreshCw className="h-4 w-4" />} disabled={!filterType}>
              Reset Filter
            </Button>
          </div>
        </div>

        {/* Activity List Container */}
        <ErrorBoundary fallback={
          <Alert variant="destructive">
            <AlertTitle>Error Loading Activity</AlertTitle>
            <AlertDescription>Could not load the activity log. Please try refreshing.</AlertDescription>
          </Alert>
        }>
          <div className="bg-white dark:bg-film-black-900 rounded-xl shadow-sm border border-border-light dark:border-border-dark">
            {isLoading ? (
              <div className="h-96 flex items-center justify-center"><LoadingSpinner size="large" /></div>
            ) : error ? (
              <div className="p-8 text-center text-red-500 dark:text-red-400 flex flex-col items-center">
                <AlertTriangle className="h-10 w-10 mb-2" />
                {error}
                <Button onClick={() => refetchActivities()} variant="secondary" className="mt-4">Try Again</Button>
              </div>
            ) : paginatedActivities.length === 0 ? (
              <div className="p-12 text-center text-gray-500 dark:text-gray-400">
                <ActivityIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                No activities found {filterType ? `for type: ${filterType}` : ''}.
              </div>
            ) : (
              <div className="divide-y divide-border-light dark:divide-border-dark px-6">
                {/* Use paginatedActivities for rendering */}
                {paginatedActivities.map((activity) => (
                  <ActivityLogItem key={activity.id} {...activity} />
                ))}
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-border-light dark:border-border-dark flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Page {currentPage} of {totalPages} (Total: {filteredActivities.length} activities)
                </span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="secondary" size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    icon={<ChevronLeft className="h-4 w-4" />}
                  > Prev </Button>
                  <Button
                    variant="secondary" size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    icon={<ChevronRight className="h-4 w-4" />}
                    className="flex-row-reverse" // Puts icon on the right
                  > Next </Button>
                </div>
              </div>
            )}
          </div>
        </ErrorBoundary>
      </div>
    </div>
  );
}

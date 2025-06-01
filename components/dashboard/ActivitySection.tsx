import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Loader2, AlertTriangle, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRecentActivity, ActivityItem } from '@/hooks/useRecentActivity'; // Assuming this hook fetches *all* recent activities needed
import { useEffect } from 'react';

const RecentActivityItem = ({
  action,
  item,
  time,
  user,
  userImage,
  isNew = false,
  type,
  contentUrlPath // Added from API response logic
}: ActivityItem & { contentUrlPath?: string }) => ( // Added contentUrlPath to props type
  <motion.div
    layout // Add layout animation for smoother adding/removing
    initial={isNew ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -10 }} // Adjust exit animation if needed
    transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
    className="flex items-start gap-4 py-3 relative"
  >
    {isNew && (
      <span className="absolute right-0 top-3 flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-film-red-500 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-film-red-600"></span>
      </span>
    )}
    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-film-red-500">
      <Image
        src={userImage || "/images/avatar/placeholder.jpg"}
        width={40}
        height={40}
        alt={user}
        className="object-cover"
      />
    </div>
    <div className="flex-1 min-w-0"> {/* Added min-w-0 for better text wrapping */}
      <p className="text-sm text-gray-800 dark:text-gray-100"> {/* Adjusted text size */}
        <span className="font-medium text-gray-900 dark:text-white">{user}</span>{" "}
        <span>{action}</span>{" "}
        {/* Make item clickable only if a valid path exists */}
        {contentUrlPath && contentUrlPath !== '#' ? (
          <Link
            href={contentUrlPath}
            className="text-film-red-600 dark:text-film-red-500 font-medium hover:underline truncate" // Added truncate
            title={item} // Show full item title on hover
          >
            {item}
          </Link>
        ) : (
          <span className="font-medium text-gray-900 dark:text-white truncate" title={item}>{item}</span>
        )}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{time}</p> {/* Adjusted size and margin */}
    </div>
  </motion.div>
);

// Renamed prop for clarity
export function ActivitySection({ limit = 2 }: { limit?: number }) {
  // Assuming useRecentActivity fetches enough activities (e.g., 5-10) even if we only show 3 initially
  const { activities, isLoading, error, refetchActivities } = useRecentActivity();

  // Slice the activities to show only the desired limit
  const displayedActivities = activities.slice(0, limit);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm lg:col-span-1 border border-border-light dark:border-border-dark h-full flex flex-col" // Added h-full and flex-col
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-film-red-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
        </div>
        {/* Optionally show refetch button if there's an error */}
        {error && (
          <button
            onClick={() => refetchActivities}
            className="text-xs text-blue-600 hover:underline"
            title="Retry loading activity"
          >
            Retry
          </button>
        )}
      </div>

      <div className="flex-grow space-y-1 divide-y divide-border-light dark:divide-border-dark overflow-y-auto max-h-[400px]"> {/* Added overflow and max-height */}
        {isLoading ? (
          <div className="py-12 flex justify-center">
            <Loader2 className="h-8 w-8 text-film-red-600 animate-spin" />
          </div>
        ) : error ? (
          <div className="flex flex-col items-center py-8 text-center text-gray-500 dark:text-gray-400">
            <AlertTriangle className="h-8 w-8 text-amber-500 mb-2" />
            <p className="text-sm">Error loading activity.</p>
          </div>
        ) : (
          <AnimatePresence initial={false}> {/* Set initial={false} for better update animations */}
            {displayedActivities.length > 0 ? (
              displayedActivities.map((activity) => (
                <RecentActivityItem
                  key={activity.id} // Use the actual unique ID from the data
                  {...activity}
                />
              ))
            ) : (
              <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                <p className="text-sm">No recent activity</p>
              </div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Always show "View all" link, even if initial list is short */}
      <div className="mt-auto pt-4 border-t border-border-light dark:border-border-dark"> {/* Push link to bottom */}
        <Link
          href="/admin/activity" // Link to a dedicated activity page
          className="text-sm text-film-red-600 dark:text-film-red-500 hover:underline flex items-center group justify-center"
        >
          View all activity
          <ArrowUpRight className="ml-1 h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}

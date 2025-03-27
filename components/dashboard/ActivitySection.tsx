import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Loader2, AlertTriangle, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { useRecentActivity, ActivityItem } from '@/hooks/useRecentActivity';
import { useEffect } from 'react';

const RecentActivityItem = ({
  action,
  item,
  time,
  user,
  userImage,
  isNew = false,
  type,
}: ActivityItem) => (
  <motion.div
    initial={isNew ? { opacity: 0, y: 10 } : { opacity: 1, y: 0 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
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
    <div className="flex-1">
      <p className="text-gray-900 dark:text-white">
        <span className="font-medium">{user}</span>{" "}
        <span>{action}</span>{" "}
        <Link
          href={`/admin/${type}s/${encodeURIComponent(item.toLowerCase().replace(/\s+/g, '-'))}`}
          className="text-film-red-600 dark:text-film-red-500 font-medium hover:underline"
        >
          {item}
        </Link>
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{time}</p>
    </div>
  </motion.div>
);

export function ActivitySection() {
  const { activities, isLoading, error, refetchActivities, addSimulatedActivity } = useRecentActivity();

  // Simulate a new activity after some time (for demo purposes)
  useEffect(() => {
    if (activities.length === 0) return;

    const timer = setTimeout(() => {
      addSimulatedActivity({
        action: "added a comment on",
        item: "The Silent Victory",
        user: "Ama Serwaa",
        userImage: "/images/hero/hero3.jpg",
        type: "film",
      });
    }, 25000);

    return () => clearTimeout(timer);
  }, [activities, addSimulatedActivity]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm lg:col-span-1 border border-gray-100 dark:border-film-black-800"
    >
      <div className="flex items-center space-x-2 mb-4">
        <TrendingUp className="h-5 w-5 text-film-red-600" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
      </div>

      {isLoading ? (
        <div className="py-12 flex justify-center">
          <Loader2 className="h-8 w-8 text-film-red-600 animate-spin" />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center py-8 text-gray-500 dark:text-gray-400">
          <AlertTriangle className="h-12 w-12 text-amber-500 mb-2" />
          <p>There was an error loading activity.</p>
          <button
            onClick={refetchActivities}
            className="mt-4 px-4 py-2 bg-film-red-600 text-white rounded-md hover:bg-film-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : (
        <div className="space-y-1 divide-y divide-gray-100 dark:divide-film-black-800">
          <AnimatePresence>
            {activities.length > 0 ? (
              activities.map((activity) => (
                <RecentActivityItem
                  key={activity.id}
                  {...activity}
                />
              ))
            ) : (
              <div className="py-8 text-center text-gray-500 dark:text-gray-400">
                <p>No recent activity</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      )}

      <div className="mt-4">
        <Link
          href="/admin/activity"
          className="text-sm text-film-red-600 dark:text-film-red-500 hover:underline flex items-center group"
        >
          View all activity
          <ArrowUpRight className="ml-1 h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>
    </motion.div>
  );
}

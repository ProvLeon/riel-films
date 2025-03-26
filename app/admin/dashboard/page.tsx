"use client";
import React, { useEffect } from "react";
import { useData } from "@/context/DataContext";
import {
  Film,
  Youtube,
  BookOpen,
  TrendingUp,
  Users,
  Calendar,
  ArrowUpRight,
  Eye,
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

// Chart components (You would implement these with a chart library like Recharts or Chart.js)
const FilmViewsChart = () => (
  <div className="h-48 w-full bg-gray-50 dark:bg-film-black-800/50 rounded-lg flex items-center justify-center">
    <p className="text-gray-500 dark:text-gray-400">Film Views Chart</p>
  </div>
);

const VisitorsChart = () => (
  <div className="h-48 w-full bg-gray-50 dark:bg-film-black-800/50 rounded-lg flex items-center justify-center">
    <p className="text-gray-500 dark:text-gray-400">Visitors Chart</p>
  </div>
);

const StatsCard = ({
  title,
  value,
  icon,
  trend,
  trendValue,
  bgColor
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: "up" | "down" | "neutral";
  trendValue: string;
  bgColor: string;
}) => {
  const trendColor = trend === "up"
    ? "text-green-600"
    : trend === "down"
      ? "text-red-600"
      : "text-gray-600";

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
          <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{value}</h3>
          <p className={`mt-2 text-sm flex items-center ${trendColor}`}>
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "–"}
            <span className="ml-1">{trendValue}</span>
          </p>
        </div>
        <div className={`p-3 rounded-lg ${bgColor}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

const RecentActivityItem = ({
  action,
  item,
  time,
  user,
  userImage
}: {
  action: string;
  item: string;
  time: string;
  user: string;
  userImage: string;
}) => (
  <div className="flex items-start gap-4 py-3">
    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
      <Image
        src={userImage}
        width={40}
        height={40}
        alt={user}
        className="object-cover"
      />
    </div>
    <div className="flex-1">
      <p className="text-gray-900 dark:text-white">
        <span className="font-medium">{user}</span> {action}{" "}
        <span className="text-film-red-600 dark:text-film-red-500">{item}</span>
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{time}</p>
    </div>
  </div>
);

const AdminDashboardPage = () => {
  const {
    films,
    productions,
    stories,
    fetchFilms,
    fetchProductions,
    fetchStories,
    isLoadingFilms,
    isLoadingProductions,
    isLoadingStories,
  } = useData();

  useEffect(() => {
    fetchFilms({ limit: 5 });
    fetchProductions({ limit: 5 });
    fetchStories({ limit: 5 });
  }, [fetchFilms, fetchProductions, fetchStories]);

  const isLoading = isLoadingFilms || isLoadingProductions || isLoadingStories;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back to the Riel Films admin dashboard</p>
        </div>
        <div>
          <span className="text-sm text-gray-500 dark:text-gray-400">Today is {new Date().toLocaleDateString()}</span>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Films"
          value={films?.length.toString() || "0"}
          icon={<Film className="h-6 w-6 text-blue-600" />}
          trend="up"
          trendValue="12% from last month"
          bgColor="bg-blue-100 dark:bg-blue-900/30"
        />
        <StatsCard
          title="Productions"
          value={productions?.length.toString() || "0"}
          icon={<Youtube className="h-6 w-6 text-red-600" />}
          trend="neutral"
          trendValue="Same as last month"
          bgColor="bg-red-100 dark:bg-red-900/30"
        />
        <StatsCard
          title="Stories"
          value={stories?.length.toString() || "0"}
          icon={<BookOpen className="h-6 w-6 text-amber-600" />}
          trend="up"
          trendValue="8% from last month"
          bgColor="bg-amber-100 dark:bg-amber-900/30"
        />
        <StatsCard
          title="User Engagement"
          value="2,845"
          icon={<Users className="h-6 w-6 text-green-600" />}
          trend="up"
          trendValue="24% from last month"
          bgColor="bg-green-100 dark:bg-green-900/30"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Film Views</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Last 30 days</span>
              <button className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-film-black-800">
                <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>
          <FilmViewsChart />
        </div>

        <div className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Website Visitors</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Last 30 days</span>
              <button className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-film-black-800">
                <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>
          <VisitorsChart />
        </div>
      </div>

      {/* Recent Activity & Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm lg:col-span-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
          <div className="space-y-1 divide-y divide-gray-100 dark:divide-film-black-800">
            <RecentActivityItem
              action="added a new film"
              item="Golden Dust"
              time="2 hours ago"
              user="Emmanuel Koffi"
              userImage="/images/hero/hero1.jpg"
            />
            <RecentActivityItem
              action="updated production"
              item="Voices of the Delta"
              time="Yesterday"
              user="Nana Adwoa"
              userImage="/images/hero/hero3.jpg"
            />
            <RecentActivityItem
              action="published a story"
              item="Behind the Scenes"
              time="2 days ago"
              user="Kofi Mensah"
              userImage="/images/hero/hero2.jpg"
            />
            <RecentActivityItem
              action="changed settings"
              item="Site Settings"
              time="3 days ago"
              user="Emmanuel Koffi"
              userImage="/images/hero/hero1.jpg"
            />
          </div>
          <div className="mt-4">
            <Link
              href="/admin/activity"
              className="text-sm text-film-red-600 dark:text-film-red-500 hover:underline flex items-center"
            >
              View all activity
              <ArrowUpRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Recent Content */}
        <div className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Content</h3>
            <div className="flex gap-2">
              <button className="text-sm text-gray-600 dark:text-gray-300 hover:text-film-red-600 dark:hover:text-film-red-500">
                Films
              </button>
              <button className="text-sm text-film-red-600 dark:text-film-red-500 font-medium">
                Productions
              </button>
              <button className="text-sm text-gray-600 dark:text-gray-300 hover:text-film-red-600 dark:hover:text-film-red-500">
                Stories
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-film-black-800">
                  <th className="pb-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
                  <th className="pb-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="pb-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Progress</th>
                  <th className="pb-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-gray-500 dark:text-gray-400">Loading...</td>
                  </tr>
                ) : productions?.length > 0 ? (
                  productions.slice(0, 5).map((production: any) => (
                    <tr key={production.id} className="border-b border-gray-100 dark:border-film-black-800">
                      <td className="py-3">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded overflow-hidden mr-3 flex-shrink-0 relative">
                            <Image
                              src={production.image || "/images/placeholder.jpg"}
                              alt={production.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{production.title}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{production.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${production.status === "In Production"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          : production.status === "Pre-Production"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                            : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
                          }`}>
                          {production.status}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center">
                          <div className="w-full bg-gray-200 dark:bg-film-black-800 rounded-full h-2 mr-2">
                            <div
                              className="bg-film-red-600 h-2 rounded-full"
                              style={{ width: `${production.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600 dark:text-gray-400 min-w-[32px]">
                            {production.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-right">
                        <Link
                          href={`/admin/productions/${production.id}`}
                          className="text-film-red-600 dark:text-film-red-500 hover:text-film-red-700 inline-flex items-center text-sm"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-gray-500 dark:text-gray-400">No productions found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4">
            <Link
              href="/admin/productions"
              className="text-sm text-film-red-600 dark:text-film-red-500 hover:underline flex items-center"
            >
              View all productions
              <ArrowUpRight className="ml-1 h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Link href="/admin/films/create">
            <motion.div
              whileHover={{ y: -2 }}
              className="p-4 border border-gray-200 dark:border-film-black-800 rounded-lg hover:border-film-red-500 dark:hover:border-film-red-500 transition-colors"
            >
              <div className="flex flex-col items-center text-center">
                <Film className="h-6 w-6 text-film-red-600 mb-2" />
                <p className="text-gray-900 dark:text-white">Add New Film</p>
              </div>
            </motion.div>
          </Link>

          <Link href="/admin/productions/create">
            <motion.div
              whileHover={{ y: -2 }}
              className="p-4 border border-gray-200 dark:border-film-black-800 rounded-lg hover:border-film-red-500 dark:hover:border-film-red-500 transition-colors"
            >
              <div className="flex flex-col items-center text-center">
                <Youtube className="h-6 w-6 text-film-red-600 mb-2" />
                <p className="text-gray-900 dark:text-white">New Production</p>
              </div>
            </motion.div>
          </Link>

          <Link href="/admin/stories/create">
            <motion.div
              whileHover={{ y: -2 }}
              className="p-4 border border-gray-200 dark:border-film-black-800 rounded-lg hover:border-film-red-500 dark:hover:border-film-red-500 transition-colors"
            >
              <div className="flex flex-col items-center text-center">
                <BookOpen className="h-6 w-6 text-film-red-600 mb-2" />
                <p className="text-gray-900 dark:text-white">New Story</p>
              </div>
            </motion.div>
          </Link>

          <Link href="/admin/users">
            <motion.div
              whileHover={{ y: -2 }}
              className="p-4 border border-gray-200 dark:border-film-black-800 rounded-lg hover:border-film-red-500 dark:hover:border-film-red-500 transition-colors"
            >
              <div className="flex flex-col items-center text-center">
                <Users className="h-6 w-6 text-film-red-600 mb-2" />
                <p className="text-gray-900 dark:text-white">Manage Users</p>
              </div>
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;

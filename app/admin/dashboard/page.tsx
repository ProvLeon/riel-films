"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useData } from "@/context/DataContext";
import { useAuth } from "@/context/AuthContext";
import { usePageData } from "@/hooks/usePageData";
import {
  Film,
  Youtube,
  BookOpen,
  TrendingUp,
  Users,
  Calendar,
  ArrowUpRight,
  Eye,
  BarChart2,
  Activity,
  Loader2,
  AlertTriangle,
  Settings,
  RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { cn } from "@/lib/utils";

// Dashboard components
const StatsCard = ({
  title,
  value,
  previousValue,
  icon,
  bgColor,
  isLoading,
  error,
  onClick
}: {
  title: string;
  value: number;
  previousValue?: number;
  icon: React.ReactNode;
  bgColor: string;
  isLoading: boolean;
  error?: string | null;
  onClick?: () => void;
}) => {
  const calculatedTrend = previousValue !== undefined ? (value > previousValue ? "up" : value < previousValue ? "down" : "neutral") : "neutral";

  const trendColor = calculatedTrend === "up"
    ? "text-green-600 dark:text-green-400"
    : calculatedTrend === "down"
      ? "text-red-600 dark:text-red-400"
      : "text-gray-600 dark:text-gray-500";

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return "100%";
    const growth = ((current - previous) / previous) * 100;
    return `${growth.toFixed(1)}%`;
  };

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.3 }}
      className={cn(
        "bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-film-black-800",
        onClick && "cursor-pointer"
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div className="w-full">
          <p className="text-gray-500 dark:text-gray-400 text-sm">{title}</p>
          {isLoading ? (
            <div className="mt-1 h-8 w-20 bg-gray-200 dark:bg-film-black-800 rounded animate-pulse"></div>
          ) : error ? (
            <div className="flex items-center mt-1 text-red-500">
              <AlertTriangle className="h-4 w-4 mr-1" />
              <span className="text-sm">Error loading data</span>
            </div>
          ) : (
            <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-white">{value.toString()}</h3>
          )}
          {previousValue !== undefined && !isLoading && !error && (
            <p className={`mt-2 text-sm flex items-center ${trendColor}`}>
              {calculatedTrend === "up" ? "↑" : calculatedTrend === "down" ? "↓" : "–"}
              <span className="ml-1">{calculateGrowth(value, previousValue)}</span>
            </p>
          )}
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
  userImage,
  isNew = false
}: {
  action: string;
  item: string;
  time: string;
  user: string;
  userImage: string;
  isNew?: boolean;
}) => (
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
        <span className="text-film-red-600 dark:text-film-red-500 font-medium">{item}</span>
      </p>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{time}</p>
    </div>
  </motion.div>
);

const ContentTabs = ({ children }: { children: React.ReactNode }) => {
  const [activeTab, setActiveTab] = useState("productions");

  return (
    <div>
      <div className="flex gap-4 mb-4 border-b border-gray-200 dark:border-film-black-800">
        <button
          onClick={() => setActiveTab("films")}
          className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "films"
            ? "text-film-red-600 dark:text-film-red-500 border-film-red-600 dark:border-film-red-500"
            : "text-gray-600 dark:text-gray-300 border-transparent hover:text-film-red-600 dark:hover:text-film-red-500"
            }`}
        >
          Films
        </button>
        <button
          onClick={() => setActiveTab("productions")}
          className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "productions"
            ? "text-film-red-600 dark:text-film-red-500 border-film-red-600 dark:border-film-red-500"
            : "text-gray-600 dark:text-gray-300 border-transparent hover:text-film-red-600 dark:hover:text-film-red-500"
            }`}
        >
          Productions
        </button>
        <button
          onClick={() => setActiveTab("stories")}
          className={`pb-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "stories"
            ? "text-film-red-600 dark:text-film-red-500 border-film-red-600 dark:border-film-red-500"
            : "text-gray-600 dark:text-gray-300 border-transparent hover:text-film-red-600 dark:hover:text-film-red-500"
            }`}
        >
          Stories
        </button>
      </div>

      {activeTab === "productions" && (
        <div className="productions-content">
          {children}
        </div>
      )}

      {activeTab === "films" && (
        <div className="films-content">
          <FilmsTab />
        </div>
      )}

      {activeTab === "stories" && (
        <div className="stories-content">
          <StoriesTab />
        </div>
      )}
    </div>
  );
};

// Tab contents for the different types of content
const FilmsTab = () => {
  const { films, isLoadingFilms, errorFilms } = useData();

  if (isLoadingFilms) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 text-film-red-600 animate-spin" />
      </div>
    );
  }

  if (errorFilms) {
    return (
      <div className="flex flex-col items-center py-12 text-gray-500 dark:text-gray-400">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-2" />
        <p>There was an error loading films.</p>
        <button className="mt-4 px-4 py-2 bg-film-red-600 text-white rounded-md hover:bg-film-red-700 transition-colors">
          Try Again
        </button>
      </div>
    );
  }

  if (!films || films.length === 0) {
    return (
      <div className="flex flex-col items-center py-12 text-gray-500 dark:text-gray-400">
        <Film className="h-12 w-12 mb-2" />
        <p>No films found.</p>
        <Link
          href="/admin/films/create"
          className="mt-4 px-4 py-2 bg-film-red-600 text-white rounded-md hover:bg-film-red-700 transition-colors"
        >
          Add Film
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-film-black-800">
            <th className="pb-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
            <th className="pb-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Released</th>
            <th className="pb-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
            <th className="pb-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody>
          {films.slice(0, 5).map((film: any) => (
            <motion.tr
              key={film.id}
              className="border-b border-gray-100 dark:border-film-black-800"
              whileHover={{ backgroundColor: "rgba(229, 9, 20, 0.05)" }}
            >
              <td className="py-3">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded overflow-hidden mr-3 flex-shrink-0 relative">
                    <Image
                      src={film.image || "/images/placeholder.jpg"}
                      alt={film.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{film.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{film.director}</p>
                  </div>
                </div>
              </td>
              <td className="py-3">
                <p className="text-gray-700 dark:text-gray-300">{film.year}</p>
              </td>
              <td className="py-3">
                <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                  {film.category}
                </span>
              </td>
              <td className="py-3 text-right">
                <Link
                  href={`/admin/films/${film.slug}`}
                  className="text-film-red-600 dark:text-film-red-500 hover:text-film-red-700 inline-flex items-center text-sm"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Link>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <Link
          href="/admin/films"
          className="text-sm text-film-red-600 dark:text-film-red-500 hover:underline flex items-center group"
        >
          View all films
          <ArrowUpRight className="ml-1 h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

const StoriesTab = () => {
  const { stories, isLoadingStories, errorStories } = useData();

  if (isLoadingStories) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 text-film-red-600 animate-spin" />
      </div>
    );
  }

  if (errorStories) {
    return (
      <div className="flex flex-col items-center py-12 text-gray-500 dark:text-gray-400">
        <AlertTriangle className="h-12 w-12 text-amber-500 mb-2" />
        <p>There was an error loading stories.</p>
        <button className="mt-4 px-4 py-2 bg-film-red-600 text-white rounded-md hover:bg-film-red-700 transition-colors">
          Try Again
        </button>
      </div>
    );
  }

  if (!stories || stories.length === 0) {
    return (
      <div className="flex flex-col items-center py-12 text-gray-500 dark:text-gray-400">
        <BookOpen className="h-12 w-12 mb-2" />
        <p>No stories found.</p>
        <Link
          href="/admin/stories/create"
          className="mt-4 px-4 py-2 bg-film-red-600 text-white rounded-md hover:bg-film-red-700 transition-colors"
        >
          Add Story
        </Link>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-200 dark:border-film-black-800">
            <th className="pb-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Title</th>
            <th className="pb-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Published</th>
            <th className="pb-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
            <th className="pb-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Action</th>
          </tr>
        </thead>
        <tbody>
          {stories.slice(0, 5).map((story: any) => (
            <motion.tr
              key={story.id}
              className="border-b border-gray-100 dark:border-film-black-800"
              whileHover={{ backgroundColor: "rgba(229, 9, 20, 0.05)" }}
            >
              <td className="py-3">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded overflow-hidden mr-3 flex-shrink-0 relative">
                    <Image
                      src={story.image || "/images/placeholder.jpg"}
                      alt={story.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{story.title}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {story.excerpt ? story.excerpt.substring(0, 30) + '...' : ''}
                    </p>
                  </div>
                </div>
              </td>
              <td className="py-3">
                <p className="text-gray-700 dark:text-gray-300">
                  {new Date(story.date).toLocaleDateString()}
                </p>
              </td>
              <td className="py-3">
                <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                  {story.category}
                </span>
              </td>
              <td className="py-3 text-right">
                <Link
                  href={`/admin/stories/${story.slug}`}
                  className="text-film-red-600 dark:text-film-red-500 hover:text-film-red-700 inline-flex items-center text-sm"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Link>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4">
        <Link
          href="/admin/stories"
          className="text-sm text-film-red-600 dark:text-film-red-500 hover:underline flex items-center group"
        >
          View all stories
          <ArrowUpRight className="ml-1 h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
};

// Main Dashboard Component
const AdminDashboardPage = () => {
  const {
    analyticsData,
    isLoadingAnalytics,
    errorAnalytics,
    fetchAnalytics,
    trackPageView,
    films,
    productions,
    stories,
    isLoadingFilms,
    isLoadingProductions,
    isLoadingStories,
    fetchFilms,
    fetchProductions,
    fetchStories
  } = useData();

  const { user } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("productions");
  const [chartData, setChartData] = useState<{
    filmViewsData: any[];
    visitorData: any[];
  }>({
    filmViewsData: [],
    visitorData: []
  });

  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  // Track dashboard view
  useEffect(() => {
    trackPageView('admin');
  }, [trackPageView]);

  // Fetch analytics data
  useEffect(() => {
    fetchAnalytics(30);
  }, [fetchAnalytics]);

  // Generate activity items based on real data
  const generateActivityItems = useCallback(() => {
    const activities: any[] = [];
    const combinedItems = [
      ...films.map(film => ({ type: 'film', item: film })),
      ...productions.map(prod => ({ type: 'production', item: prod })),
      ...stories.map(story => ({ type: 'story', item: story }))
    ];

    // Sort by creation date, most recent first
    combinedItems.sort((a, b) => {
      const dateA = new Date(a.item.createdAt || a.item.date);
      const dateB = new Date(b.item.createdAt || b.item.date);
      return dateB.getTime() - dateA.getTime();
    });

    // Generate activity messages for the most recent items
    combinedItems.slice(0, 5).forEach((entry, idx) => {
      const { type, item } = entry;
      const date = new Date(item.createdAt || item.date);

      // Format relative time
      const timeAgo = getRelativeTimeString(date);

      // Random users (in a real app, this would come from the database)
      const users = [
        { name: "Emmanuel Koffi", image: "/images/hero/hero1.jpg" },
        { name: "Nana Adwoa", image: "/images/hero/hero3.jpg" },
        { name: "Kofi Mensah", image: "/images/hero/hero2.jpg" }
      ];

      const userIndex = Math.floor(Math.random() * users.length);
      const action = date > new Date(Date.now() - 86400000) ? "added" : "updated";

      activities.push({
        id: item.id,
        action: action === "added" ? `added a new ${type}` : `updated ${type}`,
        item: item.title,
        time: timeAgo,
        user: users[userIndex].name,
        userImage: users[userIndex].image,
        isNew: idx === 0 && date > new Date(Date.now() - 3600000) // New if less than an hour old
      });
    });

    return activities;
  }, [films, productions, stories]);

  // Refresh all data
  const refreshAllData = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await Promise.all([
        fetchFilms(),
        fetchProductions(),
        fetchStories(),
        fetchAnalytics(30)
      ]);
    } catch (error) {
      console.error("Error refreshing data:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchFilms, fetchProductions, fetchStories, fetchAnalytics]);

  // Calculate historical counts for comparison (in a real app, this would come from analytics)
  const getPreviousCounts = (currentCounts: number, entityType: string) => {
    // Using the analytics data now
    if (analyticsData?.dailyStats) {
      const stats = analyticsData.dailyStats;
      if (stats.length < 14) return currentCounts * 0.9; // Fallback to 90% if not enough data

      // Last 7 days vs previous 7 days
      const currentPeriod = stats.slice(-7);
      const previousPeriod = stats.slice(-14, -7);

      if (entityType === 'films') {
        const currentSum = currentPeriod.reduce((sum, day) => sum + day.filmViews, 0);
        const previousSum = previousPeriod.reduce((sum, day) => sum + day.filmViews, 0);
        return previousSum;
      } else if (entityType === 'productions') {
        const currentSum = currentPeriod.reduce((sum, day) => sum + day.productionViews, 0);
        const previousSum = previousPeriod.reduce((sum, day) => sum + day.productionViews, 0);
        return previousSum;
      } else if (entityType === 'stories') {
        const currentSum = currentPeriod.reduce((sum, day) => sum + day.storyViews, 0);
        const previousSum = previousPeriod.reduce((sum, day) => sum + day.storyViews, 0);
        return previousSum;
      } else {
        const currentSum = currentPeriod.reduce((sum, day) => sum + day.engagements, 0);
        const previousSum = previousPeriod.reduce((sum, day) => sum + day.engagements, 0);
        return previousSum;
      }
    }

    // Fallback to simulated data
    const fluctuation = Math.random() * 0.3 - 0.1; // -10% to +20% change
    return Math.max(0, Math.round(currentCounts / (1 + fluctuation)));
  };

  // Process analytics data for charts
  useEffect(() => {
    if (analyticsData?.dailyStats) {
      // Format for film views chart
      const filmViewsData = analyticsData.dailyStats
        .slice(-7) // Last 7 days
        .map(day => ({
          name: new Date(day.date).toLocaleDateString('default', { month: 'short', day: 'numeric' }),
          views: day.filmViews
        }));

      // Format for visitor chart
      const visitorData = analyticsData.dailyStats
        .slice(-7) // Last 7 days
        .map(day => ({
          name: new Date(day.date).toLocaleDateString('default', { month: 'short', day: 'numeric' }),
          visitors: day.pageViews,
          newUsers: day.uniqueVisitors
        }));

      setChartData({
        filmViewsData,
        visitorData
      });
    } else if (films.length > 0 || productions.length > 0 || stories.length > 0) {
      // Fallback to generated data if no analytics
      const generatedData = generateAnalyticsData(films, productions, stories);
      setChartData(generatedData);
    }
  }, [analyticsData, films, productions, stories]);

  // Update activity items when our content changes
  useEffect(() => {
    if (films.length > 0 || productions.length > 0 || stories.length > 0) {
      const activities = generateActivityItems();
      setRecentActivity(activities);
    }
  }, [films, productions, stories, generateActivityItems]);

  // Simulate a new activity after some time
  useEffect(() => {
    // Only add simulated activity if we have real data and it's been processed
    if (recentActivity.length === 0) return;

    const timer = setTimeout(() => {
      const demoActivity = {
        id: "new-" + Date.now(),
        action: "added a comment on",
        item: "The Silent Victory",
        time: "Just now",
        user: "Ama Serwaa",
        userImage: "/images/hero/hero3.jpg",
        isNew: true
      };
      setRecentActivity(prev => [demoActivity, ...prev.slice(0, 4)]);
    }, 25000);

    return () => clearTimeout(timer);
  }, [recentActivity]);

  // Calculate current period metrics
  const currentFilmsViews = analyticsData?.dailyStats
    ? analyticsData.dailyStats.slice(-7).reduce((sum, day) => sum + day.filmViews, 0)
    : films.length * 150; // Fallback

  const currentProductionsViews = analyticsData?.dailyStats
    ? analyticsData.dailyStats.slice(-7).reduce((sum, day) => sum + day.productionViews, 0)
    : productions.length * 120; // Fallback

  const currentStoriesViews = analyticsData?.dailyStats
    ? analyticsData.dailyStats.slice(-7).reduce((sum, day) => sum + day.storyViews, 0)
    : stories.length * 80; // Fallback

  const currentEngagement = analyticsData?.dailyStats
    ? analyticsData.dailyStats.slice(-7).reduce((sum, day) => sum + day.engagements, 0)
    : calculateTotalEngagement(films, stories); // Fallback

  // Get previous period metrics
  const previousFilmsViews = getPreviousCounts(currentFilmsViews, 'films');
  const previousProductionsViews = getPreviousCounts(currentProductionsViews, 'productions');
  const previousStoriesViews = getPreviousCounts(currentStoriesViews, 'stories');
  const previousEngagement = getPreviousCounts(currentEngagement, 'engagement');

  const isLoading = isLoadingFilms || isLoadingProductions || isLoadingStories || isLoadingAnalytics || isRefreshing;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-film-black-900 to-film-red-900/30 rounded-xl p-6 shadow-md flex flex-col md:flex-row justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-300 mt-1">
            Welcome back, {user?.name || 'Admin'}! {new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 18 ? "Good afternoon" : "Good evening"}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-3">
          <button
            onClick={refreshAllData}
            disabled={isRefreshing}
            className={`bg-film-black-800/80 text-white p-2 rounded-lg flex items-center justify-center transition-colors
              ${isRefreshing ? 'opacity-70 cursor-not-allowed' : 'hover:bg-film-black-700'}`}
            title="Refresh data"
          >
            <RefreshCw className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>

          <div className="bg-film-black-800/80 text-white px-4 py-2 rounded-lg flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Films Engagement"
          value={currentFilmsViews}
          previousValue={previousFilmsViews}
          icon={<Film className="h-6 w-6 text-white" />}
          bgColor="bg-gradient-to-br from-blue-600 to-blue-700"
          isLoading={isLoadingAnalytics}
          error={errorAnalytics}
          onClick={() => setActiveTab("films")}
        />
        <StatsCard
          title="Productions Engagement"
          value={currentProductionsViews}
          previousValue={previousProductionsViews}
          icon={<Youtube className="h-6 w-6 text-white" />}
          bgColor="bg-gradient-to-br from-film-red-600 to-film-red-700"
          isLoading={isLoadingAnalytics}
          error={errorAnalytics}
          onClick={() => setActiveTab("productions")}
        />
        <StatsCard
          title="Stories Engagement"
          value={currentStoriesViews}
          previousValue={previousStoriesViews}
          icon={<BookOpen className="h-6 w-6 text-white" />}
          bgColor="bg-gradient-to-br from-amber-500 to-amber-600"
          isLoading={isLoadingAnalytics}
          error={errorAnalytics}
          onClick={() => setActiveTab("stories")}
        />
        <StatsCard
          title="User Engagement"
          value={currentEngagement}
          previousValue={previousEngagement}
          icon={<Users className="h-6 w-6 text-white" />}
          bgColor="bg-gradient-to-br from-green-600 to-green-700"
          isLoading={isLoadingAnalytics}
          error={errorAnalytics}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-film-black-800"
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <BarChart2 className="h-5 w-5 text-film-red-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Film Views</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Last 7 days</span>
              <button className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-film-black-800 transition-colors">
                <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="h-[225px] flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-film-red-600 animate-spin" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={225}>
              <AreaChart data={chartData.filmViewsData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E50914" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#E50914" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1F2937" opacity={0.2} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#121212",
                    borderColor: "#2D3748",
                    borderRadius: "6px",
                    color: "#F9FAFB"
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="views"
                  stroke="#E50914"
                  fillOpacity={1}
                  fill="url(#colorViews)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-film-black-800"
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-film-red-600" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Website Visitors</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Last 7 days</span>
              <button className="p-1 rounded-md hover:bg-gray-100 dark:hover:bg-film-black-800 transition-colors">
                <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="h-[225px] flex items-center justify-center">
              <Loader2 className="h-6 w-6 text-film-red-600 animate-spin" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={225}>
              <BarChart data={chartData.visitorData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1F2937" opacity={0.2} />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#121212",
                    borderColor: "#2D3748",
                    borderRadius: "6px",
                    color: "#F9FAFB"
                  }}
                />
                <Legend />
                <Bar dataKey="visitors" name="Total Visitors" fill="#E50914" radius={[4, 4, 0, 0]} />
                <Bar dataKey="newUsers" name="New Users" fill="#4B5563" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </motion.div>
      </div>

      {/* Recent Activity & Content Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
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

          {isLoading && recentActivity.length === 0 ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="h-8 w-8 text-film-red-600 animate-spin" />
            </div>
          ) : (
            <div className="space-y-1 divide-y divide-gray-100 dark:divide-film-black-800">
              <AnimatePresence>
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity) => (
                    <RecentActivityItem
                      key={activity.id}
                      action={activity.action}
                      item={activity.item}
                      time={activity.time}
                      user={activity.user}
                      userImage={activity.userImage}
                      isNew={activity.isNew}
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

        {/* Recent Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm lg:col-span-2 border border-gray-100 dark:border-film-black-800"
        >
          <ContentTabs>
            {isLoadingProductions ? (
              <div className="flex justify-center py-12">
                <Loader2 className="h-8 w-8 text-film-red-600 animate-spin" />
              </div>
            ) : errorAnalytics ? (
              <div className="flex flex-col items-center py-12 text-gray-500 dark:text-gray-400">
                <AlertTriangle className="h-12 w-12 text-amber-500 mb-2" />
                <p>There was an error loading productions.</p>
                <button
                  className="mt-4 px-4 py-2 bg-film-red-600 text-white rounded-md hover:bg-film-red-700 transition-colors"
                  onClick={() => fetchProductions()}
                >
                  Try Again
                </button>
              </div>
            ) : productions.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-gray-500 dark:text-gray-400">
                <Youtube className="h-12 w-12 mb-2" />
                <p>No productions found.</p>
                <Link
                  href="/admin/productions/create"
                  className="mt-4 px-4 py-2 bg-film-red-600 text-white rounded-md hover:bg-film-red-700 transition-colors"
                >
                  Add Production
                </Link>
              </div>
            ) : (
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
                    {productions.slice(0, 5).map((production: any) => (
                      <motion.tr
                        key={production.id}
                        className="border-b border-gray-100 dark:border-film-black-800"
                        whileHover={{ backgroundColor: "rgba(229, 9, 20, 0.05)" }}
                      >
                        <td className="py-3">
                          <div className="flex items-center">
                            <div className="w-12 h-12 rounded overflow-hidden mr-3 flex-shrink-0 relative">
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
                                className="bg-gradient-to-r from-film-red-500 to-film-red-600 h-2 rounded-full"
                                style={{ width: `${production.progress || 0}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-600 dark:text-gray-400 min-w-[32px]">
                              {production.progress || 0}%
                            </span>
                          </div>
                        </td>
                        <td className="py-3 text-right">
                          <Link
                            href={`/admin/productions/${production.slug}`}
                            className="text-film-red-600 dark:text-film-red-500 hover:text-film-red-700 inline-flex items-center text-sm"
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </ContentTabs>

          <div className="mt-4">
            <Link
              href="/admin/productions"
              className="text-sm text-film-red-600 dark:text-film-red-500 hover:underline flex items-center group"
            >
              View all productions
              <ArrowUpRight className="ml-1 h-3 w-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Quick Links */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-film-black-800"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quick Links</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Link href="/admin/films/create">
            <motion.div
              whileHover={{ y: -4, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
              className="p-4 border border-gray-200 dark:border-film-black-800 rounded-lg hover:border-film-red-500 dark:hover:border-film-red-500 transition-all group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-film-red-50 dark:bg-film-red-900/20 p-3 rounded-full mb-3 group-hover:bg-film-red-100 dark:group-hover:bg-film-red-900/30 transition-colors">
                  <Film className="h-6 w-6 text-film-red-600" />
                </div>
                <p className="text-gray-900 dark:text-white font-medium">Add New Film</p>
              </div>
            </motion.div>
          </Link>

          <Link href="/admin/productions/create">
            <motion.div
              whileHover={{ y: -4, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
              className="p-4 border border-gray-200 dark:border-film-black-800 rounded-lg hover:border-film-red-500 dark:hover:border-film-red-500 transition-all group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-film-red-50 dark:bg-film-red-900/20 p-3 rounded-full mb-3 group-hover:bg-film-red-100 dark:group-hover:bg-film-red-900/30 transition-colors">
                  <Youtube className="h-6 w-6 text-film-red-600" />
                </div>
                <p className="text-gray-900 dark:text-white font-medium">New Production</p>
              </div>
            </motion.div>
          </Link>

          <Link href="/admin/stories/create">
            <motion.div
              whileHover={{ y: -4, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
              className="p-4 border border-gray-200 dark:border-film-black-800 rounded-lg hover:border-film-red-500 dark:hover:border-film-red-500 transition-all group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-film-red-50 dark:bg-film-red-900/20 p-3 rounded-full mb-3 group-hover:bg-film-red-100 dark:group-hover:bg-film-red-900/30 transition-colors">
                  <BookOpen className="h-6 w-6 text-film-red-600" />
                </div>
                <p className="text-gray-900 dark:text-white font-medium">New Story</p>
              </div>
            </motion.div>
          </Link>

          <Link href="/admin/settings">
            <motion.div
              whileHover={{ y: -4, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
              className="p-4 border border-gray-200 dark:border-film-black-800 rounded-lg hover:border-film-red-500 dark:hover:border-film-red-500 transition-all group"
            >
              <div className="flex flex-col items-center text-center">
                <div className="bg-film-red-50 dark:bg-film-red-900/20 p-3 rounded-full mb-3 group-hover:bg-film-red-100 dark:group-hover:bg-film-red-900/30 transition-colors">
                  <Settings className="h-6 w-6 text-film-red-600" />
                </div>
                <p className="text-gray-900 dark:text-white font-medium">Site Settings</p>
              </div>
            </motion.div>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

// Helper functions
function getRelativeTimeString(date: Date): string {
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

// Generates analytics data based on films, productions and stories
const generateAnalyticsData = (films: any[], productions: any[], stories: any[]) => {
  // Create months array for the last 7 days
  const days = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const day = new Date(now);
    day.setDate(day.getDate() - i);
    days.push({
      name: day.toLocaleDateString('default', { month: 'short', day: 'numeric' }),
      date: day
    });
  }

  // Film views data - simulating this based on publication dates
  const filmViewsData = days.map(day => {
    // Count films created before this day
    const existingFilms = films.filter(film =>
      new Date(film.createdAt) < day.date
    ).length;

    // Generate views based on number of existing films
    const views = existingFilms * (Math.floor(Math.random() * 50) + 20);

    return {
      name: day.name,
      views
    };
  });

  // Visitor data - simulate based on films and stories published that day
  const visitorData = days.map(day => {
    const nextDay = new Date(day.date);
    nextDay.setDate(nextDay.getDate() + 1);

    // Count content created in this day
    const newFilms = films.filter(film =>
      new Date(film.createdAt) >= day.date && new Date(film.createdAt) < nextDay
    ).length;

    const newStories = stories.filter(story =>
      new Date(story.date) >= day.date && new Date(story.date) < nextDay
    ).length;

    // Base visitors
    const baseVisitors = 300 + (Math.floor(Math.random() * 200));
    // Add visitors based on new content
    const visitors = baseVisitors + (newFilms * 50) + (newStories * 20);
    // New users are typically 30-50% of total visitors
    const newUsers = Math.floor(visitors * (0.3 + Math.random() * 0.2));

    return {
      name: day.name,
      visitors,
      newUsers
    };
  });

  return {
    filmViewsData,
    visitorData
  };
};

function calculateTotalEngagement(films: any[], stories: any[]): number {
  // In a real app, this would pull from analytics systems
  // Here we'll simulate engagement based on content
  const BASE_ENGAGEMENT = 100;

  // Each film gets approximately 10-30 engagements
  const filmEngagement = films.reduce((total, film) => {
    // Simulated based on film age
    const filmAgeInDays = Math.floor((new Date().getTime() - new Date(film.createdAt).getTime()) / (1000 * 3600 * 24));
    // Films get more engagement when they're newer
    const engagementPerFilm = 30 - Math.min(20, filmAgeInDays);
    return total + Math.max(10, engagementPerFilm);
  }, 0);

  // Each story gets approximately 5-15 engagements
  const storyEngagement = stories.reduce((total, story) => {
    // Simulated based on story age
    const storyAgeInDays = Math.floor((new Date().getTime() - new Date(story.date).getTime()) / (1000 * 3600 * 24));
    // Stories get more engagement when they're newer
    const engagementPerStory = 15 - Math.min(10, storyAgeInDays);
    return total + Math.max(5, engagementPerStory);
  }, 0);

  return BASE_ENGAGEMENT + filmEngagement + storyEngagement;
}

export default AdminDashboardPage;

"use client";
import { useState } from "react";
import { useData } from "@/context/DataContext";
import { motion } from "framer-motion";
import {
  Film, Users, TrendingUp, Eye, Clock, BarChart2, Calendar,
  ChevronRight, LayoutDashboard, Bell, Video, FileText, AlertCircle,
  Activity as ActivityIcon // Renamed to avoid conflict
} from 'lucide-react';
import Link from "next/link";
import { ActivitySection } from "@/components/dashboard/ActivitySection";
import { UserSection } from "@/components/dashboard/UserSection";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import ContentCarousel from "@/components/admin/ContentCarousel";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Alert, AlertDescription, AlertTitle } from "@/components/UI/Alert";
import { Button } from "@/components/UI/Button"; // Import Button

// Mock data (can be removed if real data is available)
const MOCK_TEAM_COUNT = 12;
const MOCK_RECENT_FILMS = 3;
const MOCK_ACTIVE_PRODUCTIONS = 1;
const MOCK_STORIES_PUBLISHED = 5;

export default function DashboardPage() {
  const { films, productions, stories, isLoadingFilms, isLoadingProductions, isLoadingStories } = useData();
  const [timeRange] = useState<number>(30); // Default analytics time range

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  const statsCards = [
    { title: "Total Films", value: films.length, icon: <Film className="h-6 w-6 text-blue-600 dark:text-blue-400" />, color: "blue", trend: `+${MOCK_RECENT_FILMS} this month`, loading: isLoadingFilms },
    { title: "Total Productions", value: productions.length, icon: <Video className="h-6 w-6 text-purple-600 dark:text-purple-400" />, color: "purple", trend: `${MOCK_ACTIVE_PRODUCTIONS} active`, loading: isLoadingProductions },
    { title: "Published Stories", value: stories.length, icon: <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />, color: "green", trend: `+${MOCK_STORIES_PUBLISHED} this month`, loading: isLoadingStories },
    { title: "Team Members", value: MOCK_TEAM_COUNT, icon: <Users className="h-6 w-6 text-amber-600 dark:text-amber-400" />, color: "amber", trend: "Manage users", loading: false },
  ];

  const upcomingReleases = [
    { id: 1, title: "Echoes of the Savannah", type: "Documentary", duration: "1h 45m", releaseDate: "Oct 15, 2024", weeksAway: 3 },
    { id: 2, title: "Urban Rhythms", type: "Short Film", duration: "25m", releaseDate: "Nov 01, 2024", weeksAway: 5 },
    { id: 3, title: "Generations", type: "Feature Film", duration: "2h 10m", releaseDate: "Nov 20, 2024", weeksAway: 8 },
  ];

  // Tailwind classes for card colors (more maintainable)
  const cardColorClasses: Record<string, string> = {
    blue: "bg-blue-50 dark:bg-blue-900/20",
    purple: "bg-purple-50 dark:bg-purple-900/20",
    green: "bg-green-50 dark:bg-green-900/20",
    amber: "bg-amber-50 dark:bg-amber-900/20",
  };
  const trendColorClasses: Record<string, string> = {
    blue: "text-blue-600 dark:text-blue-400",
    purple: "text-purple-600 dark:text-purple-400",
    green: "text-green-600 dark:text-green-400",
    amber: "text-amber-600 dark:text-amber-400",
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } };

  // Error Boundary Fallback Component
  const ErrorFallback = ({ title, message }: { title: string; message: string }) => (
    <div className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm border border-red-200 dark:border-red-800">
      <AlertTitle className="text-red-600 dark:text-red-400">{title}</AlertTitle>
      <AlertDescription className="text-red-500 dark:text-red-300 mt-2">{message}</AlertDescription>
    </div>
  );

  return (
    <div className="bg-gray-50 dark:bg-film-black-950 min-h-screen pb-12">
      {/* Page Header - Refined styling */}
      <div className="bg-gradient-to-r from-film-black-900 to-film-red-900 dark:from-film-black-950 dark:to-film-red-950 text-white py-6 px-6 shadow-lg mb-8 rounded-b-xl">
        <div className="max-w-screen-2xl mx-auto">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          >
            <motion.div variants={itemVariants}>
              <div className="flex items-center">
                <LayoutDashboard className="h-7 w-7 text-film-red-500 mr-3" />
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Dashboard Overview
                </h1>
              </div>
              <p className="text-gray-300 mt-1">
                {currentDate} &nbsp;&nbsp;·&nbsp;&nbsp; Welcome back!
              </p>
            </motion.div>

            <motion.div variants={itemVariants} className="flex items-center gap-4">
              <div className="relative dropdown-container">
                <Button variant="ghost" size="icon" className="bg-white/10 hover:bg-white/20 relative">
                  <Bell className="h-5 w-5 text-white" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-film-red-500 rounded-full border-2 border-film-black-900"></span>
                </Button>
                {/* Dropdown content would go here */}
              </div>
              <Link href="/" target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="sm" className="bg-white/10 hover:bg-white/20 text-white border-transparent">
                  <Eye className="h-4 w-4 mr-1.5" />
                  View Site
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
        {/* Quick Stats Cards - Added hover effect */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
        >
          {statsCards.map((card) => (
            <motion.div
              key={card.title}
              variants={itemVariants}
              className="bg-white dark:bg-film-black-900 rounded-xl p-5 border border-gray-100 dark:border-film-black-800 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start">
                <div className={`${cardColorClasses[card.color]} p-3 rounded-lg mr-4 flex-shrink-0`}>
                  {card.icon}
                </div>
                <div className="overflow-hidden">
                  <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium truncate">{card.title}</h3>
                  <p className={`text-2xl font-bold text-gray-900 dark:text-white mt-1 ${card.loading ? 'animate-pulse' : ''}`}>
                    {card.loading ? '...' : card.value}
                  </p>
                  <p className={`text-xs ${trendColorClasses[card.color]} flex items-center mt-1 truncate`}>
                    {card.trend}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Analytics Dashboard */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-10"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <TrendingUp className="h-5 w-5 text-film-red-600 mr-2" />
              Analytics Overview (Last {timeRange} Days)
            </h2>
            <Link
              href="/admin/analytics"
              className="text-film-red-600 hover:text-film-red-700 dark:text-film-red-500 dark:hover:text-film-red-400 text-sm font-medium flex items-center group"
            >
              Full Analytics
              <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <ErrorBoundary fallback={
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error Loading Analytics</AlertTitle>
              <AlertDescription>Could not load the analytics dashboard component.</AlertDescription>
            </Alert>
          }>
            <AnalyticsDashboard defaultTimeRange={timeRange} condensed={true} />
          </ErrorBoundary>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Activity Feed */}
          <ErrorBoundary fallback={<ErrorFallback title="Error Loading Activity" message="Could not display recent activity." />}>
            <ActivitySection />
          </ErrorBoundary>

          {/* Team Members Section */}
          <div className="lg:col-span-2">
            <ErrorBoundary fallback={<ErrorFallback title="Error Loading Team" message="Could not display team members." />}>
              <UserSection />
            </ErrorBoundary>
          </div>
        </div>

        {/* Content Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-film-black-800 mb-10">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Film className="h-5 w-5 text-film-red-600 mr-2" />
              Content Management
            </h2>
            <ErrorBoundary fallback={<p className="text-red-500">Error loading films.</p>}>
              <ContentCarousel title="Most Viewed Films" items={films.slice(0, 10)} type="film" />
            </ErrorBoundary>
            <ErrorBoundary fallback={<p className="text-red-500">Error loading productions.</p>}>
              <ContentCarousel title="Recent Productions" items={productions.slice(0, 10)} type="production" />
            </ErrorBoundary>
            <ErrorBoundary fallback={<p className="text-red-500">Error loading stories.</p>}>
              <ContentCarousel title="Popular Stories" items={stories.slice(0, 10)} type="story" />
            </ErrorBoundary>
          </div>
        </motion.div>

        {/* Upcoming Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-film-black-800"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <Calendar className="h-5 w-5 text-film-red-600 mr-2" />
            Upcoming Releases
          </h2>
          {/* Enhanced Upcoming Release Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcomingReleases.length > 0 ? upcomingReleases.map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -5 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
                className="relative border border-gray-200 dark:border-film-black-800 rounded-lg p-5 hover:border-film-red-500 dark:hover:border-film-red-600 transition-all duration-300 hover:shadow-md bg-gray-50/50 dark:bg-film-black-800/30"
              >
                <div className="absolute top-4 right-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 text-xs rounded-full font-medium">
                  Upcoming
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-lg">{item.title}</h3>
                  <p className="text-sm text-film-red-600 dark:text-film-red-400 mb-3">
                    {item.type} · {item.duration}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center mb-1">
                    <Calendar className="h-4 w-4 mr-1.5 text-gray-500" />
                    Release: {item.releaseDate}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                    <Clock className="h-4 w-4 mr-1.5 text-gray-500" />
                    <span>{item.weeksAway} weeks from now</span>
                  </p>
                </div>
                <div className="mt-5 pt-4 border-t border-gray-100 dark:border-film-black-700 flex justify-end">
                  <Link
                    href={`/admin/productions/edit/${item.id}`} // Example link
                    className="text-film-red-600 hover:text-film-red-700 dark:text-film-red-500 dark:hover:text-film-red-400 text-sm font-medium group flex items-center"
                  >
                    View details
                    <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            )) : (
              <div className="md:col-span-3 text-center py-8 text-gray-500 dark:text-gray-400">
                No upcoming releases scheduled.
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

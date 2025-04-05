"use client";
import { useState, useMemo } from "react"; // Added useMemo
import { useData } from "@/context/DataContext";
import { useUsers } from "@/hooks/useUsers"; // Import useUsers
import { motion } from "framer-motion";
import {
  Film, Users, TrendingUp, Eye, Clock, BarChart2, Calendar,
  ChevronRight, LayoutDashboard, Bell, Video, FileText, AlertCircle,
  Activity as ActivityIcon
} from 'lucide-react';
import Link from "next/link";
import { ActivitySection } from "@/components/dashboard/ActivitySection"; // Assuming limit is handled internally or via props
import { UserSection } from "@/components/dashboard/UserSection";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import ContentCarousel from "@/components/admin/ContentCarousel";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Alert, AlertDescription, AlertTitle } from "@/components/UI/Alert";
import { Button } from "@/components/UI/Button";
import { formatDate } from "@/lib/utils"; // Import formatDate
import LoadingSpinner from "@/components/UI/LoadingSpinner"; // Import LoadingSpinner

export default function DashboardPage() {
  // --- Hooks & Data ---
  const {
    films, productions, stories,
    isLoadingFilms, isLoadingProductions, isLoadingStories,
    errorFilms, errorProductions, errorStories
  } = useData();
  const { users, isLoading: isLoadingUsers, error: errorUsers } = useUsers(); // Fetch real users
  const [timeRange] = useState<number>(30); // Default analytics time range

  // --- Derived Data ---
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });

  // Stats Cards with real data (Trends removed for simplicity until implemented)
  const statsCards = useMemo(() => [
    { title: "Total Films", value: films.length, icon: <Film className="h-6 w-6 text-blue-500" />, color: "blue", loading: isLoadingFilms },
    { title: "Total Productions", value: productions.length, icon: <Video className="h-6 w-6 text-purple-500" />, color: "purple", loading: isLoadingProductions },
    { title: "Published Stories", value: stories.length, icon: <FileText className="h-6 w-6 text-green-500" />, color: "green", loading: isLoadingStories },
    { title: "Team Members", value: users.length, icon: <Users className="h-6 w-6 text-amber-500" />, color: "amber", loading: isLoadingUsers },
  ], [films.length, productions.length, stories.length, users.length, isLoadingFilms, isLoadingProductions, isLoadingStories, isLoadingUsers]);

  // Upcoming Releases from real Production data
  const upcomingProductions = useMemo(() => {
    return productions
      .filter(p => p.status !== "Completed" && p.estimatedCompletion) // Filter non-completed with estimated dates
      .sort((a, b) => new Date(a.estimatedCompletion).getTime() - new Date(b.estimatedCompletion).getTime()) // Sort by date
      .slice(0, 3); // Show top 3
  }, [productions]);

  // Tailwind classes for card colors
  const cardColorClasses: Record<string, string> = {
    blue: "bg-blue-50 dark:bg-blue-900/20",
    purple: "bg-purple-50 dark:bg-purple-900/20",
    green: "bg-green-50 dark:bg-green-900/20",
    amber: "bg-amber-50 dark:bg-amber-900/20",
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } } // Faster stagger
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
  };

  // Error Boundary Fallback Component
  const ErrorFallback = ({ title, message }: { title: string; message: string }) => (
    <div className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm border border-red-200 dark:border-red-800">
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </div>
  );

  // Consolidated Loading Check
  const isPageLoading = isLoadingFilms || isLoadingProductions || isLoadingStories || isLoadingUsers;

  // --- Component Render ---
  return (
    <div className="bg-gray-50 dark:bg-film-black-950 min-h-screen pb-16"> {/* Increased pb */}
      {/* Page Header */}
      <div className="bg-gradient-to-r from-film-black-900 to-film-red-900 dark:from-film-black-950 dark:to-film-black-800 text-white py-8 px-6 shadow-xl mb-10 rounded-b-2xl">
        <div className="container-custom">
          <motion.div
            initial="hidden" animate="visible" variants={containerVariants}
            className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
          >
            <motion.div variants={itemVariants}>
              <div className="flex items-center">
                <LayoutDashboard className="h-7 w-7 text-film-red-500 mr-3" />
                <h1 className="text-2xl md:text-3xl font-bold text-white">Dashboard Overview</h1>
              </div>
              <p className="text-gray-300 mt-1 text-sm">{currentDate}</p>
            </motion.div>
            <motion.div variants={itemVariants} className="flex items-center gap-3">
              {/* <div className="relative dropdown-container">
                <Button variant="ghost" size="icon" className="bg-white/10 hover:bg-white/20 relative text-white">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-film-red-500 rounded-full border-2 border-film-black-900 animate-pulse"></span>
                </Button>
              </div> */}
              <Link href="/" target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="sm" className="bg-white/10 hover:bg-white/20 text-white border-transparent text-xs px-3 py-1.5">
                  <Eye className="h-4 w-4 mr-1" /> View Site
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className="container-custom">
        {/* Quick Stats Cards */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {statsCards.map((card) => (
            <motion.div key={card.title} variants={itemVariants}
              className="bg-white dark:bg-film-black-900 rounded-xl p-5 border border-border-light dark:border-border-dark shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex items-start">
                <div className={`${cardColorClasses[card.color]} p-3 rounded-lg mr-4 flex-shrink-0`}>
                  {card.icon}
                </div>
                <div className="overflow-hidden">
                  <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium truncate">{card.title}</h3>
                  <p className={`text-2xl font-bold text-gray-900 dark:text-white mt-1 ${card.loading ? 'animate-pulse' : ''}`}>
                    {card.loading ? <span className="text-gray-400">...</span> : card.value?.toLocaleString() ?? '0'}
                  </p>
                  {/* Removed the hardcoded trend line, display only value */}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Analytics Dashboard */}
        <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.2 }} className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <TrendingUp className="h-5 w-5 text-film-red-600 mr-2" /> Analytics Overview
            </h2>
            <Link href="/admin/analytics" className="text-film-red-600 hover:text-film-red-700 dark:text-film-red-500 dark:hover:text-film-red-400 text-sm font-medium flex items-center group">
              Full Analytics <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <ErrorBoundary fallback={<ErrorFallback title="Analytics Error" message="Could not load the analytics component." />}>
            {/* Render condensed analytics */}
            <AnalyticsDashboard defaultTimeRange={timeRange} condensed={true} />
          </ErrorBoundary>
        </motion.div>

        {/* Main Content Grid (Activity & Users) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <ErrorBoundary fallback={<ErrorFallback title="Activity Error" message="Could not display recent activity." />}>
            <ActivitySection /> {/* Assumes ActivitySection handles its loading/error and limit */}
          </ErrorBoundary>
          <div className="lg:col-span-2">
            <ErrorBoundary fallback={<ErrorFallback title="Team Error" message="Could not display team members." />}>
              <UserSection /> {/* Assumes UserSection handles its loading/error */}
            </ErrorBoundary>
          </div>
        </div>

        {/* Content Carousels */}
        <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.4 }}>
          <div className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm border border-border-light dark:border-border-dark mb-10">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Film className="h-5 w-5 text-film-red-600 mr-2" /> Content Overview
            </h2>
            {/* Add Error Boundaries and Loading States for Carousels */}
            {isLoadingFilms ? <div className="h-40 flex justify-center items-center"><LoadingSpinner /></div> : errorFilms ? <p className="text-red-500 text-sm">Error loading films.</p> :
              <ContentCarousel title="Recent Films" items={films.slice(0, 10)} type="film" />}

            {isLoadingProductions ? <div className="h-40 flex justify-center items-center mt-6"><LoadingSpinner /></div> : errorProductions ? <p className="text-red-500 text-sm mt-6">Error loading productions.</p> :
              <ContentCarousel title="Recent Productions" items={productions.slice(0, 10)} type="production" />}

            {isLoadingStories ? <div className="h-40 flex justify-center items-center mt-6"><LoadingSpinner /></div> : errorStories ? <p className="text-red-500 text-sm mt-6">Error loading stories.</p> :
              <ContentCarousel title="Recent Stories" items={stories.slice(0, 10)} type="story" />}
          </div>
        </motion.div>

        {/* Upcoming Productions */}
        <motion.div variants={itemVariants} initial="hidden" animate="visible" transition={{ delay: 0.5 }}
          className="mt-8 bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm border border-border-light dark:border-border-dark"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <Calendar className="h-5 w-5 text-film-red-600 mr-2" /> Upcoming Productions
          </h2>
          {isLoadingProductions ? (
            <div className="flex justify-center py-8"><LoadingSpinner /></div>
          ) : errorProductions ? (
            <div className="text-center py-8 text-red-500">Error loading upcoming productions.</div>
          ) : upcomingProductions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {upcomingProductions.map((item) => (
                <motion.div key={item.id} whileHover={{ y: -5 }} transition={{ type: "spring", stiffness: 300 }}
                  className="relative border border-border-light dark:border-border-dark rounded-lg p-5 hover:border-film-red-500/50 dark:hover:border-film-red-600/50 transition-all duration-300 hover:shadow-md bg-gray-50/50 dark:bg-film-black-800/30"
                >
                  <div className="absolute top-3 right-3 px-2 py-1 text-xs rounded-full font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                    {item.status}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1 text-base pr-20">{item.title}</h3>
                    <p className="text-sm text-film-red-600 dark:text-film-red-400 mb-3">{item.category}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center mb-1">
                      <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                      Est. Completion: {item.estimatedCompletion ? formatDate(item.estimatedCompletion) : 'TBD'}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-border-light dark:border-border-dark flex justify-end">
                    <Link href={`/admin/productions/edit/${item.id}`} className="text-film-red-600 hover:text-film-red-700 dark:text-film-red-500 dark:hover:text-film-red-400 text-xs font-medium group flex items-center">
                      View/Edit <ChevronRight className="h-3.5 w-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No upcoming productions found.
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

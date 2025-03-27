"use client";
import { useEffect, useState } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useData } from "@/context/DataContext";
import { motion } from "framer-motion";
import {
  Activity, Film, Users, TrendingUp,
  Eye, Clock, BarChart2, Calendar,
  ChevronRight, LayoutDashboard, Bell
} from 'lucide-react';
import { ActivitySection } from "@/components/dashboard/ActivitySection";
import { UserSection } from "@/components/dashboard/UserSection";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import ContentCarousel from "@/components/admin/ContentCarousel";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function DashboardPage() {
  const { films, productions, stories } = useData();
  const [timeRange, setTimeRange] = useState<number>(30);

  // Get current date for header display
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="bg-gray-50 dark:bg-film-black-950 min-h-screen pb-12">
      {/* Page Header - Netflix style with gradient */}
      <div className="bg-gradient-to-r from-film-black-900 to-film-red-900 dark:from-film-black-950 dark:to-film-red-950 text-white py-6 px-6 shadow-lg mb-6">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center">
                <LayoutDashboard className="h-7 w-7 text-film-red-500 mr-3" />
                <h1 className="text-2xl md:text-3xl font-bold text-white">
                  Dashboard Overview
                </h1>
              </div>
              <p className="text-gray-300 mt-1">
                {currentDate} · Welcome back to your content analytics
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <button className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                  <Bell className="h-5 w-5 text-white" />
                  <span className="absolute top-0 right-0 w-2 h-2 bg-film-red-500 rounded-full"></span>
                </button>
              </div>
              <button className="flex items-center gap-2 bg-film-red-600 hover:bg-film-red-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md">
                <Eye className="h-4 w-4" />
                <span className="hidden md:inline">View Site</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-6">
        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {/* Active Content Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-film-black-900 rounded-xl p-5 border border-gray-100 dark:border-film-black-800 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg mr-4">
                <Film className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Active Films</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{films.length}</p>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
                  <span className="flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                    </svg>
                    3 new this month
                  </span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Productions Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-film-black-900 rounded-xl p-5 border border-gray-100 dark:border-film-black-800 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start">
              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg mr-4">
                <svg className="h-6 w-6 text-purple-600 dark:text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Productions</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{productions.length}</p>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
                  <span className="flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                    </svg>
                    1 active production
                  </span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Stories Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white dark:bg-film-black-900 rounded-xl p-5 border border-gray-100 dark:border-film-black-800 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start">
              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg mr-4">
                <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 8l-7 5-7-5M5 19h14a2 2 0 002-2V9a2 2 0 00-2-2h-1" />
                </svg>
              </div>
              <div>
                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Stories</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stories.length}</p>
                <p className="text-xs text-green-600 dark:text-green-400 flex items-center mt-1">
                  <span className="flex items-center">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                    </svg>
                    5 published this month
                  </span>
                </p>
              </div>
            </div>
          </motion.div>

          {/* Team Members Card */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white dark:bg-film-black-900 rounded-xl p-5 border border-gray-100 dark:border-film-black-800 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start">
              <div className="bg-amber-50 dark:bg-amber-900/20 p-3 rounded-lg mr-4">
                <Users className="h-6 w-6 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">Team Members</h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">12</p>
                <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center mt-1">
                  <span className="flex items-center">
                    2 admin, 10 editors
                  </span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Analytics Dashboard */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <TrendingUp className="h-5 w-5 text-film-red-600 mr-2" />
              Analytics Overview
            </h2>
            <a
              href="/admin/analytics"
              className="text-film-red-600 hover:text-film-red-700 dark:text-film-red-500 dark:hover:text-film-red-400 text-sm font-medium flex items-center"
            >
              Full Analytics
              <ChevronRight className="h-4 w-4 ml-1" />
            </a>
          </div>

          <ErrorBoundary>
            <AnalyticsDashboard defaultTimeRange={timeRange} condensed={true} />
          </ErrorBoundary>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Activity Feed */}
          <ErrorBoundary>
            <ActivitySection />
          </ErrorBoundary>

          {/* Team Members Section (takes 2 columns) */}
          <div className="lg:col-span-2">
            <ErrorBoundary>
              <UserSection />
            </ErrorBoundary>
          </div>
        </div>

        {/* Content Sections */}
        <div className="mt-8">
          <div className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-film-black-800 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <Film className="h-5 w-5 text-film-red-600 mr-2" />
              Content Management
            </h2>

            <ErrorBoundary>
              <ContentCarousel
                title="Most Viewed Films"
                items={films.slice(0, 10)}
                type="film"
              />
            </ErrorBoundary>

            <ErrorBoundary>
              <ContentCarousel
                title="Recent Productions"
                items={productions.slice(0, 10)}
                type="production"
              />
            </ErrorBoundary>

            <ErrorBoundary>
              <ContentCarousel
                title="Popular Stories"
                items={stories.slice(0, 10)}
                type="story"
              />
            </ErrorBoundary>
          </div>
        </div>

        {/* Upcoming Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-film-black-800"
        >
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <Calendar className="h-5 w-5 text-film-red-600 mr-2" />
            Upcoming Releases
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="relative border border-gray-200 dark:border-film-black-800 rounded-lg p-4 hover:border-film-red-500 dark:hover:border-film-red-600 transition-colors"
              >
                <div className="absolute top-4 right-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-2 py-1 text-xs rounded-full">
                  Upcoming
                </div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-white mb-1">Film Title {item}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      Documentary · 1h 45m
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-film-red-500" />
                      <span>Oct 15, 2023</span>
                    </p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100 dark:border-film-black-800 flex justify-between">
                  <span className="text-xs text-gray-500 dark:text-gray-400">3 weeks from now</span>
                  <a
                    href="#"
                    className="text-film-red-600 hover:text-film-red-700 dark:text-film-red-500 dark:hover:text-film-red-400 text-xs font-medium"
                  >
                    View details
                  </a>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { TrendingUp, Film, FileText, Video, BarChart2, ArrowLeft } from 'lucide-react';
import AdminHeader from "@/components/admin/AdminHeader";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import Link from "next/link";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'films' | 'stories' | 'productions'>('overview');
  const [timeRange, setTimeRange] = useState<number>(30);
  const { analyticsData, fetchAnalyticsData } = useAnalytics();

  return (
    <div className="bg-gray-50 dark:bg-film-black-950 min-h-screen">
      <AdminHeader />

      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <div className="flex items-center mb-2">
              <Link
                href="/admin/dashboard"
                className="text-gray-600 dark:text-gray-400 hover:text-film-red-600 dark:hover:text-film-red-500 mr-2"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <BarChart2 className="h-6 w-6 text-film-red-600 mr-2" />
                Analytics
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400">
              Insights and performance metrics for your content
            </p>
          </div>
        </div>

        {/* Analytics tab navigation */}
        <div className="bg-white dark:bg-film-black-900 rounded-xl shadow-sm mb-6">
          <div className="border-b border-gray-200 dark:border-film-black-800">
            <nav className="flex -mb-px overflow-x-auto">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-6 font-medium text-sm inline-flex items-center whitespace-nowrap ${activeTab === 'overview'
                  ? 'border-b-2 border-film-red-600 text-film-red-600 dark:text-film-red-500'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
              >
                <TrendingUp className="h-5 w-5 mr-2" />
                Overview
              </button>

              <button
                onClick={() => setActiveTab('films')}
                className={`py-4 px-6 font-medium text-sm inline-flex items-center whitespace-nowrap ${activeTab === 'films'
                  ? 'border-b-2 border-film-red-600 text-film-red-600 dark:text-film-red-500'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
              >
                <Film className="h-5 w-5 mr-2" />
                Films
              </button>

              <button
                onClick={() => setActiveTab('stories')}
                className={`py-4 px-6 font-medium text-sm inline-flex items-center whitespace-nowrap ${activeTab === 'stories'
                  ? 'border-b-2 border-film-red-600 text-film-red-600 dark:text-film-red-500'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
              >
                <FileText className="h-5 w-5 mr-2" />
                Stories
              </button>

              <button
                onClick={() => setActiveTab('productions')}
                className={`py-4 px-6 font-medium text-sm inline-flex items-center whitespace-nowrap ${activeTab === 'productions'
                  ? 'border-b-2 border-film-red-600 text-film-red-600 dark:text-film-red-500'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
              >
                <Video className="h-5 w-5 mr-2" />
                Productions
              </button>
            </nav>
          </div>
        </div>

        {/* Analytics dashboard content */}
        {activeTab === 'overview' && <ErrorBoundary>
          <AnalyticsDashboard defaultTimeRange={timeRange} condensed={false} />
        </ErrorBoundary>}

        {activeTab === 'films' && (
          <div className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Film Analytics
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Detailed analytics about your films would be displayed here, including views, engagement, and user demographics.
            </p>
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-film-black-800/50 rounded-lg mt-6">
              <p className="text-gray-500 dark:text-gray-400">
                Film-specific analytics visualization
              </p>
            </div>
          </div>
        )}

        {activeTab === 'stories' && (
          <div className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Story Analytics
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Track how users engage with your stories, including read time, popularity, and sharing metrics.
            </p>
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-film-black-800/50 rounded-lg mt-6">
              <p className="text-gray-500 dark:text-gray-400">
                Story-specific analytics visualization
              </p>
            </div>
          </div>
        )}

        {activeTab === 'productions' && (
          <div className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Production Analytics
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Insights into how users interact with your productions, including interest levels and conversion metrics.
            </p>
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-film-black-800/50 rounded-lg mt-6">
              <p className="text-gray-500 dark:text-gray-400">
                Production-specific analytics visualization
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

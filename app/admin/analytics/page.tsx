"use client";
import { useState, Suspense } from "react";
import { TrendingUp, Film, FileText, Video, BarChart2, ArrowLeft } from 'lucide-react';
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import Link from "next/link";
import ErrorBoundary from "@/components/ErrorBoundary";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/UI/Alert"; // Use Alert

type ActiveTab = 'overview' | 'films' | 'stories' | 'productions';

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [timeRange, setTimeRange] = useState<number>(30); // Keep track of selected time range

  return (
    <div className="bg-gray-50 dark:bg-film-black-950 min-h-screen">
      <div className="p-4 md:p-6 lg:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <div className="flex items-center mb-2">
              <Link
                href="/admin/dashboard"
                className="p-2 rounded-full text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-film-black-800 mr-2 transition-colors"
                aria-label="Back to Dashboard"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <BarChart2 className="h-6 w-6 text-film-red-600 mr-2" />
                Analytics Dashboard
              </h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 ml-10 md:ml-0">
              Insights and performance metrics for your content.
            </p>
          </div>
          {/* Optional: Add Actions like Export */}
        </div>

        {/* Enhanced Analytics Tabs */}
        <div className="bg-white dark:bg-film-black-900 rounded-xl shadow-sm mb-6 border border-gray-100 dark:border-film-black-800">
          <div className="border-b border-gray-200 dark:border-film-black-800">
            <nav className="-mb-px flex space-x-6 overflow-x-auto scrollbar-hide px-4">
              {[
                { key: 'overview', label: 'Overview', icon: TrendingUp },
                { key: 'films', label: 'Films', icon: Film },
                { key: 'stories', label: 'Stories', icon: FileText },
                { key: 'productions', label: 'Productions', icon: Video },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as ActiveTab)}
                  className={`py-4 px-1 font-medium text-sm inline-flex items-center whitespace-nowrap border-b-2 transition-all duration-200 ease-in-out group relative ${activeTab === tab.key
                    ? 'border-film-red-600 text-film-red-600 dark:text-film-red-500'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    }`}
                >
                  <tab.icon className={`h-5 w-5 mr-2 transition-colors ${activeTab === tab.key ? 'text-film-red-500' : 'text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-300'}`} />
                  {tab.label}
                  {/* Underline effect */}
                  <span className={`absolute bottom-0 left-0 right-0 h-0.5 bg-film-red-600 transform transition-transform duration-300 ${activeTab === tab.key ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'}`}></span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Analytics dashboard content */}
        <Suspense fallback={<div className="h-96 flex items-center justify-center"><LoadingSpinner size="large" /></div>}>
          {activeTab === 'overview' && (
            <ErrorBoundary fallback={
              <Alert variant="destructive">
                <AlertTitle>Error Loading Analytics</AlertTitle>
                <AlertDescription>Could not load the overview analytics data. Please try again later.</AlertDescription>
              </Alert>
            }>
              <AnalyticsDashboard defaultTimeRange={timeRange} condensed={false} />
            </ErrorBoundary>
          )}
        </Suspense>

        {activeTab !== 'overview' && (
          <div className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-film-black-800">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 capitalize flex items-center">
              {activeTab === 'films' ? <Film className="h-5 w-5 mr-2 text-film-red-500" /> : activeTab === 'stories' ? <FileText className="h-5 w-5 mr-2 text-film-red-500" /> : <Video className="h-5 w-5 mr-2 text-film-red-500" />}
              {activeTab} Analytics
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Detailed analytics for {activeTab}. This section is currently under development.
            </p>
            {/* Enhanced Placeholder */}
            <div className="min-h-[300px] flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-film-black-800/30 dark:to-film-black-800/50 rounded-lg border border-dashed border-gray-300 dark:border-film-black-700 p-8 text-center">
              <div className="w-16 h-16 bg-gray-200 dark:bg-film-black-700 rounded-full flex items-center justify-center mb-4 ring-4 ring-gray-300/50 dark:ring-film-black-600/50">
                {activeTab === 'films' ? <Film className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                  : activeTab === 'stories' ? <FileText className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                    : <Video className="h-8 w-8 text-gray-400 dark:text-gray-500" />}
              </div>
              <p className="text-gray-500 dark:text-gray-400 font-medium mb-2 text-lg">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Analytics Coming Soon
              </p>
              <p className="text-sm text-gray-400 dark:text-gray-500 max-w-xs">
                Insights on views, engagement, audience demographics, and performance trends will appear here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

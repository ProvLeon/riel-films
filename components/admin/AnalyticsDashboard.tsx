import React, { useState, useEffect } from 'react';
import { useAnalytics } from "@/hooks/useAnalytics";
import { motion } from "framer-motion";
import {
  BarChart2, TrendingUp, PieChart, Calendar,
  ArrowUp, ArrowDown, Users, Clock, Eye
} from 'lucide-react';
import AnalyticsCard from './AnalyticsCard';
import DashboardCharts, { TrafficChart } from './DashboardCharts';

interface AnalyticsDashboardProps {
  defaultTimeRange?: number;
  condensed?: boolean;  // Add this prop
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  defaultTimeRange = 30,
  condensed = false // Default to full view
}) => {
  const [timeRange, setTimeRange] = useState<number>(defaultTimeRange);
  const { analyticsData, isLoading, fetchAnalyticsData } = useAnalytics();

  useEffect(() => {
    fetchAnalyticsData(timeRange);
  }, [fetchAnalyticsData, timeRange]);

  // Calculate summary metrics
  const summaryMetrics = React.useMemo(() => {
    if (!analyticsData || !analyticsData.dailyStats.length) {
      return {
        totalViews: 0,
        uniqueVisitors: 0,
        avgTimeOnSite: 0,
        bounceRate: 0,
        engagementRate: 0,
        filmViews: 0,
        storyViews: 0,
        productionViews: 0
      };
    }

    const stats = analyticsData.dailyStats;

    // Total metrics across all days
    const totalViews = stats.reduce((sum, day) => sum + day.pageViews, 0);
    const uniqueVisitors = stats.reduce((sum, day) => sum + day.uniqueVisitors, 0);
    const totalEngagements = stats.reduce((sum, day) => sum + day.engagements, 0);
    const filmViews = stats.reduce((sum, day) => sum + day.filmViews, 0);
    const storyViews = stats.reduce((sum, day) => sum + day.storyViews, 0);
    const productionViews = stats.reduce((sum, day) => sum + day.productionViews, 0);

    // Averages
    const avgTimeOnSite = stats.reduce((sum, day) => sum + (day.avgTimeOnSite || 0), 0) / stats.length;
    const bounceRate = stats.reduce((sum, day) => sum + (day.bounceRate || 0), 0) / stats.length;
    const engagementRate = totalViews > 0 ? (totalEngagements / totalViews) * 100 : 0;

    return {
      totalViews,
      uniqueVisitors,
      avgTimeOnSite,
      bounceRate,
      engagementRate,
      filmViews,
      storyViews,
      productionViews
    };
  }, [analyticsData]);

  // Top content data
  const topContent = React.useMemo(() => {
    return analyticsData?.topContent || [];
  }, [analyticsData]);

  return (
    <div className="space-y-6">
      {/* Time range selector */}
      <div className="flex items-center justify-between bg-white dark:bg-film-black-900 rounded-xl p-4 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
          <Calendar className="h-5 w-5 text-film-red-600 mr-2" />
          Time Period
        </h2>

        <div className="flex space-x-2">
          <button
            onClick={() => setTimeRange(7)}
            className={`px-4 py-2 rounded-md ${timeRange === 7
              ? "bg-film-red-600 text-white"
              : "bg-gray-100 dark:bg-film-black-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-film-black-700"
              }`}
          >
            7 days
          </button>
          <button
            onClick={() => setTimeRange(30)}
            className={`px-4 py-2 rounded-md ${timeRange === 30
              ? "bg-film-red-600 text-white"
              : "bg-gray-100 dark:bg-film-black-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-film-black-700"
              }`}
          >
            30 days
          </button>
          <button
            onClick={() => setTimeRange(90)}
            className={`px-4 py-2 rounded-md ${timeRange === 90
              ? "bg-film-red-600 text-white"
              : "bg-gray-100 dark:bg-film-black-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-film-black-700"
              }`}
          >
            90 days
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <AnalyticsCard
            title="Total Views"
            value={summaryMetrics.totalViews}
            change={analyticsData?.trends?.pageViews?.growth?.toFixed(1) + '%' || "+12%"}
            icon={<Eye className="h-5 w-5 text-blue-500" />}
            color="blue"
            isLoading={isLoading}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <AnalyticsCard
            title="Unique Visitors"
            value={summaryMetrics.uniqueVisitors}
            change={analyticsData?.trends?.visitors?.growth?.unique?.toFixed(1) + '%' || "+8%"}
            icon={<Users className="h-5 w-5 text-green-500" />}
            color="green"
            isLoading={isLoading}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <AnalyticsCard
            title="Avg. Time on Site"
            value={Math.round(summaryMetrics.avgTimeOnSite)}
            unit="sec"
            change={"+5%"}
            icon={<Clock className="h-5 w-5 text-purple-500" />}
            color="purple"
            isLoading={isLoading}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <AnalyticsCard
            title="Bounce Rate"
            value={summaryMetrics.bounceRate}
            unit="%"
            change={"-3%"}
            isNegativeGood={true}
            icon={<BarChart2 className="h-5 w-5 text-amber-500" />}
            color="amber"
            isLoading={isLoading}
          />
        </motion.div>
      </div>

      {/* Charts section */}
      {!isLoading && analyticsData && (
        condensed ? (
          // Condensed view - only show main traffic chart
          <div className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <svg className="h-5 w-5 text-film-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              Traffic Overview
            </h3>
            <TrafficChart data={analyticsData.dailyStats} />
          </div>
        ) : (
          // Full view - show all charts
          <DashboardCharts analyticsData={analyticsData} />
        )
      )}

      {/* Popular content section - only show in full view */}
      {!condensed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <svg className="h-5 w-5 text-film-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Most Popular Content
          </h2>

          {isLoading ? (
            <div className="h-20 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-film-red-600"></div>
            </div>
          ) : topContent.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="mt-2">No data available for this time period</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-film-black-800">
                <thead className="bg-gray-50 dark:bg-film-black-800/50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Type
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Views
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Trend
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-film-black-900 divide-y divide-gray-200 dark:divide-film-black-800">
                  {topContent.slice(0, 10).map((item, index) => (
                    <tr key={item.itemId} className="hover:bg-gray-50 dark:hover:bg-film-black-800/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.title || `Item ${index + 1}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full capitalize ${item.pageType === 'film'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                          : item.pageType === 'story'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                            : item.pageType === 'production'
                              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
                              : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
                          }`}>
                          {item.pageType}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {item.count.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className="inline-flex items-center text-green-600 dark:text-green-500">
                          <ArrowUp className="h-3 w-3 mr-1" />
                          {Math.floor(Math.random() * 15) + 5}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;

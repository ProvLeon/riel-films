import React, { useState, useEffect, useMemo } from 'react'; // Added useMemo
import { useAnalytics } from "@/hooks/useAnalytics";
import { motion } from "framer-motion";
import {
  BarChart2, TrendingUp, PieChart, Calendar,
  ArrowUp, ArrowDown, Users, Clock, Eye, AlertCircle // Added AlertCircle
} from 'lucide-react';
import AnalyticsCard from './AnalyticsCard';
import DashboardCharts, { TrafficChart } from './DashboardCharts';
import LoadingSpinner from '../UI/LoadingSpinner'; // Import LoadingSpinner
import { Alert, AlertDescription, AlertTitle } from '../UI/Alert'; // Import Alert

interface AnalyticsDashboardProps {
  defaultTimeRange?: number;
  condensed?: boolean;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  defaultTimeRange = 30,
  condensed = false
}) => {
  const [timeRange, setTimeRange] = useState<number>(defaultTimeRange);
  const { analyticsData, isLoading, error, fetchAnalyticsData } = useAnalytics();

  // Fetch data when timeRange changes or initially
  useEffect(() => {
    fetchAnalyticsData(timeRange);
  }, [fetchAnalyticsData, timeRange]);

  // Calculate summary metrics using useMemo for optimization
  const summaryMetrics = useMemo(() => {
    // Default values for when data is loading or unavailable
    const defaults = {
      totalViews: 0, uniqueVisitors: 0, avgTimeOnSite: 0,
      bounceRate: 0, filmViews: 0, storyViews: 0, productionViews: 0
    };

    if (isLoading || !analyticsData || !analyticsData.dailyStats || analyticsData.dailyStats.length === 0) {
      return defaults;
    }

    const stats = analyticsData.dailyStats;
    const totalDays = stats.length;

    // Safely calculate sums and averages
    const safeSum = (key: keyof typeof stats[0]) => stats.reduce((sum, day) => sum + (Number(day[key]) || 0), 0);
    const safeAvg = (key: keyof typeof stats[0]) => totalDays > 0 ? safeSum(key) / totalDays : 0;

    return {
      totalViews: safeSum('pageViews'),
      uniqueVisitors: safeSum('uniqueVisitors'),
      avgTimeOnSite: safeAvg('avgTimeOnSite'),
      bounceRate: safeAvg('bounceRate'),
      filmViews: safeSum('filmViews'),
      storyViews: safeSum('storyViews'),
      productionViews: safeSum('productionViews'),
    };
  }, [analyticsData, isLoading]);

  // Top content data
  const topContent = useMemo(() => analyticsData?.topContent || [], [analyticsData]);

  // Trend data
  const trends = useMemo(() => analyticsData?.trends || {}, [analyticsData]);

  // Helper to format trend percentage string
  const formatTrend = (trendData: { growth?: number } | undefined): string | undefined => {
    if (isLoading || trendData?.growth === undefined || trendData.growth === null) return undefined; // Return undefined if no trend data yet or loading
    const prefix = trendData.growth >= 0 ? '+' : '';
    return `${prefix}${trendData.growth.toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Time range selector */}
      <div className="flex flex-col sm:flex-row items-center justify-between bg-white dark:bg-film-black-900 rounded-xl p-4 shadow-sm border border-border-light dark:border-border-dark">
        <h2 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white flex items-center mb-3 sm:mb-0">
          <Calendar className="h-5 w-5 text-film-red-600 mr-2" />
          Stats for Last
        </h2>
        <div className="flex space-x-1 bg-gray-100 dark:bg-film-black-800 p-1 rounded-lg">
          {[7, 30, 90].map(days => (
            <button
              key={days}
              onClick={() => setTimeRange(days)}
              className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-colors ${timeRange === days
                ? 'bg-film-red-600 text-white shadow-sm'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-film-black-700'
                }`}
            >
              {days} days
            </button>
          ))}
        </div>
      </div>

      {/* Display Error Message */}
      {error && !isLoading && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Analytics</AlertTitle>
          <AlertDescription>
            Could not load analytics data ({error}). Please try adjusting the time range or reloading.
          </AlertDescription>
        </Alert>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <AnalyticsCard
            title="Total Views" value={summaryMetrics.totalViews}
            change={formatTrend(trends.pageViews)}
            icon={<Eye className="h-5 w-5" />} color="blue" isLoading={isLoading}
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <AnalyticsCard
            title="Unique Visitors" value={summaryMetrics.uniqueVisitors}
            change={formatTrend(trends.uniqueVisitors)}
            icon={<Users className="h-5 w-5" />} color="green" isLoading={isLoading}
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <AnalyticsCard
            title="Avg. Time on Site" value={summaryMetrics.avgTimeOnSite} unit="sec"
            change={formatTrend(trends.engagement)} // Assuming engagement trend reflects time
            icon={<Clock className="h-5 w-5" />} color="purple" isLoading={isLoading}
          />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <AnalyticsCard
            title="Bounce Rate" value={summaryMetrics.bounceRate} unit="%"
            change={formatTrend(trends.bounceRate)} // Assuming bounce rate trend exists
            isNegativeGood={true} icon={<BarChart2 className="h-5 w-5" />} color="amber" isLoading={isLoading}
          />
        </motion.div>
      </div>

      {/* Charts section */}
      {isLoading ? (
        <div className="h-96 flex items-center justify-center bg-white dark:bg-film-black-900 rounded-xl shadow-sm border border-border-light dark:border-border-dark">
          <LoadingSpinner size="large" />
        </div>
      ) : analyticsData ? (
        condensed ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm border border-border-light dark:border-border-dark">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center"><TrendingUp className="h-5 w-5 text-film-red-600 mr-2" />Traffic Overview</h3>
            <TrafficChart data={analyticsData.dailyStats} />
          </motion.div>
        ) : (
          <DashboardCharts analyticsData={analyticsData} />
        )
      ) : (
        // Only show "No data" if not loading and no error, but data is null/empty
        !error && <div className="text-center py-10 text-gray-500">No analytics data available for this period.</div>
      )}

      {/* Popular content section - only show in full view and if not loading */}
      {!condensed && !isLoading && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm border border-border-light dark:border-border-dark">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <TrendingUp className="h-5 w-5 text-film-red-600 mr-2" />Most Popular Content
          </h2>
          {topContent.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">No popular content data available.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-film-black-800">
                <thead className="bg-gray-50 dark:bg-film-black-800/50">
                  <tr>
                    <th scope="col" className="table-header">Title</th>
                    <th scope="col" className="table-header">Type</th>
                    <th scope="col" className="table-header">Views</th>
                    {/* <th scope="col" className="table-header">Trend</th> */}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-film-black-900 divide-y divide-gray-200 dark:divide-film-black-800">
                  {topContent.slice(0, 7).map((item, index) => (
                    <tr key={item.itemId || index} className="hover:bg-gray-50 dark:hover:bg-film-black-800/50">
                      <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900 dark:text-white">{item.title || `Item ${index + 1}`}</div></td>
                      <td className="px-6 py-4 whitespace-nowrap"><span className={`status-badge capitalize ${item.pageType === 'film' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' : item.pageType === 'story' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' : item.pageType === 'production' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300' : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'}`}>{item.pageType}</span></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{item.count.toLocaleString()}</td>
                      {/* <td className="px-6 py-4 whitespace-nowrap text-sm"><span className="inline-flex items-center text-green-600 dark:text-green-500"><ArrowUp className="h-3 w-3 mr-1" />{Math.floor(Math.random() * 15) + 5}%</span></td> */}
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

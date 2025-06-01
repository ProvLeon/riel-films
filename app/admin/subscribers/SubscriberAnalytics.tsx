"use client";
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Users, Mail, AtSign, Calendar, ArrowUp, ArrowDown,
  UserCheck, UserX, Activity, Globe, BarChartHorizontal, Info, AlertCircle // Added AlertCircle
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import AnalyticsCard from '@/components/admin/AnalyticsCard'; // Ensure correct path
import { useAnalytics } from '@/hooks/useAnalytics'; // Import the hook
import { Alert, AlertDescription, AlertTitle } from '@/components/UI/Alert'; // Import Alert components

const SubscriberAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30d'); // Keep local state for time range selection

  // --- Use the analytics hook ---
  const { analyticsData, isLoading, error, fetchAnalyticsData } = useAnalytics();
  // ------------------------------

  // Custom Tooltip for Charts (Remains the same)
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const date = label ? new Date(label) : null; // Handle potential undefined label
      const formattedDate = date ? date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'Data Point';

      return (
        <div className="bg-white dark:bg-film-black-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-film-black-700 text-xs">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">{formattedDate}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color || entry.fill || entry.stroke }}> {/* Use fill/stroke as fallback color */}
              {`${entry.name}: ${entry.value?.toLocaleString() ?? 'N/A'}${entry.unit || ''}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };
  // --- End Custom Tooltip ---

  // Fetch data when timeRange changes
  useEffect(() => {
    const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
    // Optional: Pass 'subscriber' if your API supports filtering, otherwise fetch general analytics
    fetchAnalyticsData(days /*, 'subscriber'*/);
  }, [timeRange, fetchAnalyticsData]);

  // Derive data from the hook's state using useMemo
  const summary = useMemo(() => analyticsData?.summary || {}, [analyticsData]);
  const growthData = useMemo(() => analyticsData?.dailyStats || [], [analyticsData]); // Use dailyStats for growth
  const emailData = useMemo(() => analyticsData?.emailStats || [], [analyticsData]); // Assuming emailStats exist
  const sourcesData = useMemo(() => analyticsData?.subscriberSources || [], [analyticsData]); // Assuming subscriberSources exist
  const countriesData = useMemo(() => analyticsData?.topCountries || [], [analyticsData]);
  const trends = useMemo(() => analyticsData?.trends || {}, [analyticsData]); // Use trends from hook

  // Helper to format trend percentage string (remains the same)
  const formatTrend = (trendData: { growth?: number } | undefined): string | undefined => { /* ... */ };

  // --- Render Logic ---
  return (
    <div className="space-y-8">
      {/* Header and time range selector (Remains the same) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-film-black-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-film-black-800">
        <div className="flex items-center">
          <TrendingUp className="h-6 w-6 text-film-red-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Subscriber Analytics
          </h2>
        </div>
        <div className="flex items-center space-x-1 bg-gray-100 dark:bg-film-black-800 p-1 rounded-lg">
          {['7d', '30d', '90d', '1y'].map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${timeRange === range ? 'bg-film-red-600 text-white shadow-sm' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-film-black-700'}`}
            >
              {range === '1y' ? '1 Year' : `${range.replace('d', '')} Days`}
            </button>
          ))}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center min-h-[400px]">
          <LoadingSpinner size="large" />
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Analytics</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <Button onClick={() => fetchAnalyticsData(timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365)} variant="secondary" size="sm" className="mt-2">
            Retry
          </Button>
        </Alert>
      )}

      {/* Data Display (only when not loading and no error) */}
      {!isLoading && !error && analyticsData && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Use summary data from the hook, calculate derived values */}
            <AnalyticsCard title="Total Subscribers" value={summary.totalSubscribers ?? 0} change={formatTrend(trends.totalSubscribers)} icon={<Users className="h-6 w-6" />} color="blue" />
            <AnalyticsCard title="Active Subscribers" value={summary.activeSubscribers ?? 0} unit={summary.totalSubscribers ? `(${Math.round((summary.activeSubscribers ?? 0) / summary.totalSubscribers * 100)}%)` : '(0%)'} icon={<UserCheck className="h-6 w-6" />} color="green" />
            <AnalyticsCard title="Unsubscribed" value={(summary.totalSubscribers ?? 0) - (summary.activeSubscribers ?? 0)} change={summary.unsubscribeRate ? `${summary.unsubscribeRate}%` : undefined} icon={<UserX className="h-6 w-6" />} color="red" isNegativeGood={true} />
            <AnalyticsCard title="Avg. Open Rate" value={summary.averageOpenRate ?? 0} unit="%" change={formatTrend(trends.openRate)} icon={<Mail className="h-6 w-6" />} color="purple" />
            <AnalyticsCard title="Avg. Click Rate" value={summary.averageClickRate ?? 0} unit="%" change={formatTrend(trends.clickRate)} icon={<AtSign className="h-6 w-6" />} color="amber" />
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            {/* Subscriber Growth Chart */}
            <motion.div className="chart-container" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h3 className="chart-title"><Activity className="chart-icon" />Subscriber Growth</h3>
              <div className="h-80">
                {/* Use growthData (dailyStats) from the hook */}
                {growthData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={growthData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                      <defs>
                        <linearGradient id="colorSubs" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3182CE" stopOpacity={0.8} /><stop offset="95%" stopColor="#3182CE" stopOpacity={0} /></linearGradient>
                        <linearGradient id="colorNew" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#38A169" stopOpacity={0.8} /><stop offset="95%" stopColor="#38A169" stopOpacity={0} /></linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                      <Area type="monotone" dataKey="uniqueVisitors" name="Total Visitors" stroke="#3182CE" fillOpacity={1} fill="url(#colorSubs)" /> {/* Changed to uniqueVisitors */}
                      <Area type="monotone" dataKey="newVisitors" name="New Visitors" stroke="#38A169" fillOpacity={1} fill="url(#colorNew)" /> {/* Changed to newVisitors */}
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">No growth data available</div>
                )}
              </div>
            </motion.div>

            {/* Email Engagement Chart */}
            <motion.div className="chart-container" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h3 className="chart-title"><Mail className="chart-icon" />Email Engagement (Placeholder)</h3>
              <div className="h-80">
                {/* Use emailData from the hook */}
                {emailData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    {/* ... LineChart code using emailData ... */}
                    <LineChart data={emailData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                      <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={11} tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={11} unit="%" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend wrapperStyle={{ fontSize: '12px' }} />
                      <Line type="monotone" dataKey="openRate" name="Open Rate" stroke="#8B5CF6" strokeWidth={2} activeDot={{ r: 6 }} dot={{ r: 3 }} unit="%" />
                      <Line type="monotone" dataKey="clickRate" name="Click Rate" stroke="#ED8936" strokeWidth={2} activeDot={{ r: 6 }} dot={{ r: 3 }} unit="%" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">Email engagement data not available</div>
                )}
              </div>
            </motion.div>
          </div>

          {/* Subscriber Sources and Geo Distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Subscriber Sources */}
            <motion.div className="chart-container" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <h3 className="chart-title"><AtSign className="chart-icon" />Subscriber Sources (Placeholder)</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                {/* Use sourcesData from the hook */}
                {sourcesData.length > 0 ? (
                  <>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        {/* ... PieChart code using sourcesData ... */}
                        <PieChart>
                          <Pie data={sourcesData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={3} labelLine={false} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                            {sourcesData.map((entry: any) => <Cell key={`cell-${entry.name}`} fill={entry.color} className="focus:outline-none ring-1 ring-inset ring-white/10 dark:ring-black/10" />)}
                          </Pie>
                          <Tooltip formatter={(value: number) => [`${value.toLocaleString()}`, 'Subscribers']} content={<CustomTooltip />} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="space-y-3">
                      {sourcesData.map((source: any) => (
                        <div key={source.name} className="flex items-center justify-between text-sm">
                          <div className="flex items-center"><div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: source.color }}></div><span className="text-gray-700 dark:text-gray-300">{source.name}</span></div>
                          <span className="font-medium text-gray-900 dark:text-white">{source.value.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 col-span-2">Subscriber source data not available</div>
                )}
              </div>
            </motion.div>

            {/* Geographic Distribution */}
            <motion.div className="chart-container" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <h3 className="chart-title"><Globe className="chart-icon" />Geographic Distribution (Top 5 - Placeholder)</h3>
              <div className="h-64 pr-4">
                {/* Use countriesData from the hook */}
                {countriesData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    {/* ... BarChart code using countriesData ... */}
                    <BarChart data={countriesData} layout="vertical" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} horizontal={false} />
                      <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} axisLine={false} tickLine={false} />
                      <YAxis dataKey="name" type="category" stroke="hsl(var(--muted-foreground))" fontSize={11} width={80} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Bar dataKey="value" name="Subscribers" fill="#E53E3E" radius={[0, 4, 4, 0]} barSize={15}>
                        {countriesData.map((entry: any, index: number) => <Cell key={`cell-${index}`} fillOpacity={1 - index * 0.1} className="focus:outline-none" />)}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400">Geographic data not available</div>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}

      {/* No Data State (only show if not loading, no error, but no analyticsData) */}
      {!isLoading && !error && !analyticsData && (
        <div className="text-center py-16 text-gray-500 dark:text-gray-400 bg-white dark:bg-film-black-900 rounded-xl shadow-sm border border-border-light dark:border-border-dark">
          No analytics data available for the selected period.
        </div>
      )}
    </div>
  );
};



// Add CSS for chart containers
const styles = `
  .chart-container { @apply bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-film-black-800; }
  .chart-title { @apply text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center; }
  .chart-icon { @apply h-5 w-5 text-film-red-600 mr-2; }
  /* Tailwind doesn't directly support chart styling, added for reference */
  .recharts-tooltip-wrapper { outline: none; }
  .recharts-legend-item { margin-right: 10px !important; }
`;
if (typeof window !== 'undefined') { const styleSheet = document.createElement("style"); styleSheet.innerText = styles; document.head.appendChild(styleSheet); }


export default SubscriberAnalytics;

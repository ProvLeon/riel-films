"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Users, Mail, AtSign, Calendar, ArrowUp, ArrowDown,
  Trash2, Activity, Globe, Clock, Filter
} from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import LoadingSpinner from '@/components/UI/LoadingSpinner';

const SubscriberAnalytics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d'); // '7d', '30d', '90d', '1y'
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  useEffect(() => {
    // In a real application, fetch data from API
    const fetchData = async () => {
      setIsLoading(true);

      // Simulate API call
      setTimeout(() => {
        // Generate mock data based on time range
        const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
        const mockData = {
          summary: {
            totalSubscribers: 1250,
            activeSubscribers: 1100,
            growthRate: 12.4,
            averageOpenRate: 32.5,
            averageClickRate: 5.8,
            unsubscribeRate: 0.4
          },
          subscriberGrowth: generateTimeSeriesData(days, 'growth'),
          emailStats: generateTimeSeriesData(days, 'email'),
          subscriberSources: [
            { name: 'Website', value: 650, color: '#3182CE' },
            { name: 'Social Media', value: 320, color: '#8B5CF6' },
            { name: 'Referral', value: 180, color: '#F05252' },
            { name: 'Event', value: 100, color: '#16BDCA' }
          ],
          topCountries: [
            { name: 'Ghana', value: 380, percent: 30.4 },
            { name: 'Nigeria', value: 280, percent: 22.4 },
            { name: 'South Africa', value: 210, percent: 16.8 },
            { name: 'Kenya', value: 160, percent: 12.8 },
            { name: 'Others', value: 220, percent: 17.6 }
          ]
        };

        setAnalyticsData(mockData);
        setIsLoading(false);
      }, 1200);
    };

    fetchData();
  }, [timeRange]);

  // Helper to generate time series data
  function generateTimeSeriesData(days: number, type: 'growth' | 'email') {
    const data = [];
    const now = new Date();

    // Different startValue based on type
    let startValue = type === 'growth' ? 950 : 25;

    for (let i = days; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);

      if (type === 'growth') {
        // For growth, we want an upward trend with some variation
        const variationFactor = 1 + (Math.random() * 0.1 - 0.02); // -2% to +8% variation
        startValue = Math.round(startValue * variationFactor);

        data.push({
          date: date.toISOString().split('T')[0],
          subscribers: startValue,
          newSubscribers: Math.round(Math.random() * 12) + 2,
          unsubscribes: Math.round(Math.random() * 3)
        });
      } else {
        // For email stats, we want somewhat consistent metrics with variations
        const openRate = startValue + (Math.random() * 10 - 5); // ±5% variation

        data.push({
          date: date.toISOString().split('T')[0],
          openRate: Math.min(Math.max(openRate, 15), 45), // Clamp between 15-45%
          clickRate: Math.min(Math.max(openRate * 0.2, 3), 10) // Click rate is roughly 20% of open rate
        });
      }
    }

    return data;
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header and time range selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center">
          <TrendingUp className="h-6 w-6 text-film-red-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Subscriber Analytics
          </h2>
        </div>

        <div className="flex items-center space-x-2 bg-white dark:bg-film-black-800 p-1 rounded-lg shadow-sm border border-gray-200 dark:border-film-black-700">
          <button
            onClick={() => setTimeRange('7d')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${timeRange === '7d'
              ? 'bg-film-red-600 text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-film-black-700'
              }`}
          >
            7 days
          </button>
          <button
            onClick={() => setTimeRange('30d')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${timeRange === '30d'
              ? 'bg-film-red-600 text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-film-black-700'
              }`}
          >
            30 days
          </button>
          <button
            onClick={() => setTimeRange('90d')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${timeRange === '90d'
              ? 'bg-film-red-600 text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-film-black-700'
              }`}
          >
            90 days
          </button>
          <button
            onClick={() => setTimeRange('1y')}
            className={`px-3 py-1.5 rounded-md text-sm font-medium ${timeRange === '1y'
              ? 'bg-film-red-600 text-white'
              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-film-black-700'
              }`}
          >
            1 year
          </button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-film-black-800"
        >
          <div className="flex items-start justify-between">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>

            <div className="flex items-center text-sm">
              <span className={`flex items-center ${analyticsData.summary.growthRate > 0
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-600 dark:text-red-400'
                }`}>
                {analyticsData.summary.growthRate > 0 ? (
                  <ArrowUp className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDown className="h-3 w-3 mr-1" />
                )}
                {Math.abs(analyticsData.summary.growthRate)}%
              </span>
              <span className="text-gray-500 dark:text-gray-400 ml-1">vs last period</span>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Subscribers</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {analyticsData.summary.totalSubscribers.toLocaleString()}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {analyticsData.summary.activeSubscribers.toLocaleString()} active ({Math.round(analyticsData.summary.activeSubscribers / analyticsData.summary.totalSubscribers * 100)}%)
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-film-black-800"
        >
          <div className="flex items-start justify-between">
            <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg">
              <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Average Open Rate</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {analyticsData.summary.averageOpenRate.toFixed(1)}%
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Click rate: {analyticsData.summary.averageClickRate.toFixed(1)}%
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-film-black-800"
        >
          <div className="flex items-start justify-between">
            <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
              <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">Unsubscribe Rate</p>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
              {analyticsData.summary.unsubscribeRate.toFixed(2)}%
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Industry avg: 0.5%
            </p>
          </div>
        </motion.div>
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Subscriber growth chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-film-black-800"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <Activity className="h-5 w-5 text-film-red-600 mr-2" />
              Subscriber Growth
            </h3>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={analyticsData.subscriberGrowth}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} />
                <XAxis
                  dataKey="date"
                  stroke="#888"
                  fontSize={12}
                  tickFormatter={(date) => {
                    const d = new Date(date);
                    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                  }}
                />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderColor: '#ddd',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: number) => [`${value.toLocaleString()}`, '']}
                  labelFormatter={(date) => {
                    const d = new Date(date);
                    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="subscribers"
                  name="Total Subscribers"
                  stroke="#E53E3E"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="newSubscribers"
                  name="New Subscribers"
                  stroke="#38A169"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="unsubscribes"
                  name="Unsubscribes"
                  stroke="#718096"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Email performance chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-film-black-800"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <Mail className="h-5 w-5 text-film-red-600 mr-2" />
              Email Engagement
            </h3>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={analyticsData.emailStats}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} />
                <XAxis
                  dataKey="date"
                  stroke="#888"
                  fontSize={12}
                  tickFormatter={(date) => {
                    const d = new Date(date);
                    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                  }}
                />
                <YAxis stroke="#888" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderColor: '#ddd',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: number) => [`${value.toFixed(1)}%`, '']}
                  labelFormatter={(date) => {
                    const d = new Date(date);
                    return d.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="openRate"
                  name="Open Rate"
                  stroke="#4C51BF"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                />
                <Line
                  type="monotone"
                  dataKey="clickRate"
                  name="Click Rate"
                  stroke="#ED8936"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* More analytics rows */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Subscriber sources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-film-black-800"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <AtSign className="h-5 w-5 text-film-red-600 mr-2" />
              Subscriber Sources
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Pie chart */}
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={analyticsData.subscriberSources}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {analyticsData.subscriberSources.map((entry: any) => (
                      <Cell key={`cell-${entry.name}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [`${value.toLocaleString()} subscribers`, '']}
                    contentStyle={{
                      backgroundColor: '#fff',
                      borderColor: '#ddd',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend/stats */}
            <div className="flex flex-col justify-center">
              <div className="space-y-4">
                {analyticsData.subscriberSources.map((source: any) => (
                  <div key={source.name} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{ backgroundColor: source.color }}
                      ></div>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{source.name}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {source.value.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Geographic distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-film-black-800"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <Globe className="h-5 w-5 text-film-red-600 mr-2" />
              Geographic Distribution
            </h3>
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={analyticsData.topCountries}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} />
                <XAxis type="number" stroke="#888" fontSize={12} />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#888"
                  fontSize={12}
                  width={100}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderColor: '#ddd',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value: number) => [`${value.toLocaleString()} subscribers`, '']}
                />
                <Legend />
                <Bar
                  dataKey="value"
                  name="Subscribers"
                  fill="#E53E3E"
                  radius={[0, 4, 4, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent activity section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-film-black-800"
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
            <Clock className="h-5 w-5 text-film-red-600 mr-2" />
            Recent Subscriber Activity
          </h3>
          <button className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm">
            <Filter className="h-4 w-4 mr-1" />
            Filter
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-film-black-700">
            <thead className="bg-gray-50 dark:bg-film-black-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Source
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-film-black-900 divide-y divide-gray-200 dark:divide-film-black-800">
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-teal-100 dark:bg-teal-900/30 flex items-center justify-center text-teal-700 dark:text-teal-300 text-sm font-medium">
                      KO
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">kofi.owusu@example.com</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                    Subscribed
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  Today, 10:23 AM
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  Homepage
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-700 dark:text-purple-300 text-sm font-medium">
                      AA
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">ama.agyei@example.com</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    Opened Email
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  Yesterday, 3:45 PM
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  Campaign: "New Documentary Release"
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-700 dark:text-pink-300 text-sm font-medium">
                      NN
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">nana.nyarko@example.com</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                    Unsubscribed
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  Sep 12, 2023
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  Campaign: "Monthly Newsletter"
                </td>
              </tr>
              <tr>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-700 dark:text-orange-300 text-sm font-medium">
                      JA
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">joshua.addo@example.com</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                    Clicked Link
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  Sep 10, 2023
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                  Campaign: "New Documentary Release"
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default SubscriberAnalytics;

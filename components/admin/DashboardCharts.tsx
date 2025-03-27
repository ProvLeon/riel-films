import React from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { motion } from 'framer-motion';

// Traffic Chart
export const TrafficChart = ({ data }: { data: any[] }) => {
  const COLORS = ['#f44336', '#4ade80', '#60a5fa'];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} />
        <XAxis
          dataKey="date"
          stroke="#888"
          fontSize={12}
          tickFormatter={(value) => {
            const date = new Date(value);
            return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
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
          formatter={(value: number) => [value.toLocaleString(), '']}
          labelFormatter={(value) => {
            const date = new Date(value);
            return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="pageViews"
          name="Page Views"
          stroke={COLORS[0]}
          strokeWidth={2}
          activeDot={{ r: 6 }}
          dot={{ r: 2 }}
        />
        <Line
          type="monotone"
          dataKey="uniqueVisitors"
          name="Unique Visitors"
          stroke={COLORS[1]}
          strokeWidth={2}
          activeDot={{ r: 6 }}
          dot={{ r: 2 }}
        />
        <Line
          type="monotone"
          dataKey="engagements"
          name="Engagements"
          stroke={COLORS[2]}
          strokeWidth={2}
          activeDot={{ r: 6 }}
          dot={{ r: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

// Content Breakdown Chart
export const ContentBreakdownChart = ({ data }: {
  data: {
    name: string;
    value: number;
    color: string;
  }[]
}) => {
  // Ensure we have data
  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center">
        <p className="text-gray-400">No data available</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={2}
          dataKey="value"
          labelLine={false}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: number) => [`${value.toLocaleString()} views`, '']}
          contentStyle={{
            backgroundColor: '#fff',
            borderColor: '#ddd',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
};

// Growth Chart
export const GrowthChart = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} />
        <XAxis
          dataKey="date"
          stroke="#888"
          fontSize={12}
          tickFormatter={(value) => {
            const date = new Date(value);
            return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
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
          formatter={(value: number) => [value.toLocaleString(), '']}
          labelFormatter={(value) => {
            const date = new Date(value);
            return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
          }}
        />
        <Legend />
        <Area
          type="monotone"
          dataKey="filmViews"
          name="Film Views"
          stackId="1"
          stroke="#f44336"
          fill="#f44336"
          fillOpacity={0.6}
        />
        <Area
          type="monotone"
          dataKey="storyViews"
          name="Story Views"
          stackId="1"
          stroke="#4ade80"
          fill="#4ade80"
          fillOpacity={0.6}
        />
        <Area
          type="monotone"
          dataKey="productionViews"
          name="Production Views"
          stackId="1"
          stroke="#60a5fa"
          fill="#60a5fa"
          fillOpacity={0.6}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

// Engagement Stats Chart
export const EngagementStatsChart = ({ data }: { data: any[] }) => {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#444" opacity={0.1} />
        <XAxis
          dataKey="name"
          stroke="#888"
          fontSize={12}
        />
        <YAxis stroke="#888" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: '#fff',
            borderColor: '#ddd',
            borderRadius: '8px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
          }}
          formatter={(value: number) => [`${value}${data[0].unit || ''}`, '']}
        />
        <Bar
          dataKey="value"
          fill="#8884d8"
          radius={[4, 4, 0, 0]}
          background={{ fill: '#eee', radius: [4, 4, 0, 0] }}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color || '#8884d8'} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
};

// Dashboard Charts Component
const DashboardCharts = ({ analyticsData }: { analyticsData: any }) => {
  // If no data is available
  if (!analyticsData || !analyticsData.dailyStats) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-film-black-900 rounded-xl p-6 h-80 flex items-center justify-center">
          <p className="text-gray-400">Loading analytics data...</p>
        </div>
        <div className="bg-white dark:bg-film-black-900 rounded-xl p-6 h-80 flex items-center justify-center">
          <p className="text-gray-400">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  // Prepare data for content breakdown
  const contentBreakdownData = [
    {
      name: "Films",
      value: analyticsData.trends?.contentViews?.films?.total || 0,
      color: "#f44336"
    },
    {
      name: "Stories",
      value: analyticsData.trends?.contentViews?.stories?.total || 0,
      color: "#4ade80"
    },
    {
      name: "Productions",
      value: analyticsData.trends?.contentViews?.productions?.total || 0,
      color: "#60a5fa"
    }
  ];

  // Prepare data for engagement stats
  const engagementStatsData = [
    {
      name: "Avg. Time",
      value: Math.round(analyticsData.trends?.engagement?.avgTimeOnSite || 0),
      unit: "s",
      color: "#8884d8"
    },
    {
      name: "Bounce Rate",
      value: Math.round(analyticsData.trends?.bounceRate?.average || 0),
      unit: "%",
      color: "#f44336"
    },
    {
      name: "Engagement",
      value: Math.round((analyticsData.trends?.engagement?.rate || 0) * 100),
      unit: "%",
      color: "#4ade80"
    }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Traffic Overview Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <svg className="h-5 w-5 text-film-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
          Traffic Overview
        </h3>

        <TrafficChart data={analyticsData.dailyStats} />
      </motion.div>

      {/* Content Breakdown Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <svg className="h-5 w-5 text-film-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
          </svg>
          Content Breakdown
        </h3>

        <ContentBreakdownChart data={contentBreakdownData} />

        <div className="mt-4 grid grid-cols-3 gap-4 text-center">
          {contentBreakdownData.map((item) => (
            <div key={item.name} className="p-2">
              <div className="flex items-center justify-center space-x-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {item.name}
                </span>
              </div>
              <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                {item.value.toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Growth Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <svg className="h-5 w-5 text-film-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          Content Growth
        </h3>

        <GrowthChart data={analyticsData.dailyStats} />
      </motion.div>

      {/* Engagement Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm"
      >
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
          <svg className="h-5 w-5 text-film-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Engagement Metrics
        </h3>

        <EngagementStatsChart data={engagementStatsData} />

        <div className="mt-6 grid grid-cols-3 gap-4">
          {engagementStatsData.map((stat) => (
            <div
              key={stat.name}
              className="bg-gray-50 dark:bg-film-black-800 p-4 rounded-lg text-center"
            >
              <h4 className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.name}</h4>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stat.value}{stat.unit}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardCharts;

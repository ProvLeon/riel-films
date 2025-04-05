import React from 'react';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { motion } from 'framer-motion';
import { AnalyticsDataType } from '@/types/analytics';
import { TrendingUp, PieChart as PieIcon } from 'lucide-react'; // Renamed PieChart import

// Custom Tooltip Component - Updated to use CSS variables via Tailwind classes
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const dateLabel = label ? new Date(label).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Data Point';
    return (
      // Apply Tailwind classes that use your CSS variables
      <div className="bg-[hsl(var(--tooltip-bg-hsl))] p-3 rounded-lg shadow-lg border border-[hsl(var(--tooltip-border-hsl))] text-xs text-[hsl(var(--foreground-hsl))]">
        <p className="text-sm font-medium mb-1">{dateLabel}</p>
        {payload.map((entry: any, index: number) => (
          <p key={`item-${index}`} style={{ color: entry.color || entry.stroke || entry.fill }}>
            {`${entry.name}: ${entry.value?.toLocaleString() ?? 'N/A'}${entry.unit || ''}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Traffic Chart - Updated axis/grid styling
export const TrafficChart = ({ data }: { data: AnalyticsDataType['dailyStats'] }) => {
  const COLORS = { pageViews: '#E53E3E', uniqueVisitors: '#38A169', engagements: '#8B5CF6' };

  if (!data || data.length === 0) return <div className="h-72 flex items-center justify-center text-gray-400">No traffic data</div>;

  return (
    // Apply base text color for axes to inherit
    <div className="text-gray-600 dark:text-gray-400">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}> {/* Adjusted left margin */}
          {/* Use Tailwind color variable for grid stroke */}
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border-hsl))" opacity={0.6} />
          <XAxis
            dataKey="date"
            fontSize={11}
            tick={{ fill: 'hsl(var(--muted-foreground-hsl))' }} // Use variable for tick fill
            axisLine={{ stroke: 'hsl(var(--border-hsl))' }} // Use variable for axis line
            tickLine={{ stroke: 'hsl(var(--border-hsl))' }} // Use variable for tick line
            tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis
            fontSize={11}
            allowDecimals={false}
            tick={{ fill: 'hsl(var(--muted-foreground-hsl))' }} // Use variable for tick fill
            axisLine={{ stroke: 'hsl(var(--border-hsl))' }} // Use variable for axis line
            tickLine={{ stroke: 'hsl(var(--border-hsl))' }} // Use variable for tick line
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
          <Line type="monotone" dataKey="pageViews" name="Page Views" stroke={COLORS.pageViews} strokeWidth={2} activeDot={{ r: 5 }} dot={{ r: 2, strokeWidth: 1, fill: COLORS.pageViews }} />
          <Line type="monotone" dataKey="uniqueVisitors" name="Unique Visitors" stroke={COLORS.uniqueVisitors} strokeWidth={2} activeDot={{ r: 5 }} dot={{ r: 2, strokeWidth: 1, fill: COLORS.uniqueVisitors }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

// Content Breakdown Chart - (No major styling changes needed here)
export const ContentBreakdownChart = ({ data }: { data: { name: string; value: number; color: string }[] }) => {
  // ... (rest of the component is likely fine, Tooltip handled above) ...
  if (!data || data.length === 0 || data.every(d => d.value === 0)) {
    return <div className="h-56 flex items-center justify-center text-gray-400">No content breakdown data</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} labelLine={false} label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}>
          {data.map((entry) => <Cell key={`cell-${entry.name}`} fill={entry.color} className="focus:outline-none ring-1 ring-inset ring-white/10 dark:ring-black/10" />)}
        </Pie>
        <Tooltip formatter={(value: number, name: string) => [`${value.toLocaleString()} views`, name]} content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
};


// Growth Chart - Updated axis/grid styling
export const GrowthChart = ({ data }: { data: AnalyticsDataType['dailyStats'] }) => {
  if (!data || data.length === 0) return <div className="h-72 flex items-center justify-center text-gray-400">No growth data</div>;

  const COLORS = { filmViews: '#3182CE', storyViews: '#38A169', productionViews: '#8B5CF6' };

  return (
    // Apply base text color for axes to inherit
    <div className="text-gray-600 dark:text-gray-400">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}> {/* Adjusted left margin */}
          <defs>
            <linearGradient id="colorFilm" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={COLORS.filmViews} stopOpacity={0.7} /><stop offset="95%" stopColor={COLORS.filmViews} stopOpacity={0} /></linearGradient>
            <linearGradient id="colorStory" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={COLORS.storyViews} stopOpacity={0.7} /><stop offset="95%" stopColor={COLORS.storyViews} stopOpacity={0} /></linearGradient>
            <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={COLORS.productionViews} stopOpacity={0.7} /><stop offset="95%" stopColor={COLORS.productionViews} stopOpacity={0} /></linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border-hsl))" opacity={0.6} />
          <XAxis
            dataKey="date"
            fontSize={11}
            tick={{ fill: 'hsl(var(--muted-foreground-hsl))' }}
            axisLine={{ stroke: 'hsl(var(--border-hsl))' }}
            tickLine={{ stroke: 'hsl(var(--border-hsl))' }}
            tickFormatter={(date) => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis
            fontSize={11}
            allowDecimals={false}
            tick={{ fill: 'hsl(var(--muted-foreground-hsl))' }}
            axisLine={{ stroke: 'hsl(var(--border-hsl))' }}
            tickLine={{ stroke: 'hsl(var(--border-hsl))' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
          <Area type="monotone" dataKey="filmViews" name="Film Views" stroke={COLORS.filmViews} fillOpacity={1} fill="url(#colorFilm)" />
          <Area type="monotone" dataKey="storyViews" name="Story Views" stroke={COLORS.storyViews} fillOpacity={1} fill="url(#colorStory)" />
          <Area type="monotone" dataKey="productionViews" name="Prod. Views" stroke={COLORS.productionViews} fillOpacity={1} fill="url(#colorProd)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};


// Dashboard Charts Component - Aggregates individual charts
const DashboardCharts = ({ analyticsData }: { analyticsData: AnalyticsDataType }) => {
  // If no data is available
  if (!analyticsData || !analyticsData.dailyStats) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-film-black-900 rounded-xl p-6 h-80 flex items-center justify-center border border-border-light dark:border-border-dark">
          <p className="text-gray-400">Loading chart data...</p>
        </div>
        <div className="bg-white dark:bg-film-black-900 rounded-xl p-6 h-80 flex items-center justify-center border border-border-light dark:border-border-dark">
          <p className="text-gray-400">Loading chart data...</p>
        </div>
      </div>
    );
  }

  // Prepare data for Content Breakdown
  const dailyStats = analyticsData.dailyStats || [];
  const totalFilmViews = dailyStats.reduce((sum, day) => sum + (day.filmViews || 0), 0);
  const totalStoryViews = dailyStats.reduce((sum, day) => sum + (day.storyViews || 0), 0);
  const totalProductionViews = dailyStats.reduce((sum, day) => sum + (day.productionViews || 0), 0);

  const contentBreakdownData = [
    { name: "Films", value: totalFilmViews, color: "#3182CE" }, // Blue
    { name: "Stories", value: totalStoryViews, color: "#38A169" }, // Green
    { name: "Prods", value: totalProductionViews, color: "#8B5CF6" }, // Purple
  ].filter(item => item.value > 0); // Filter out zero values

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Traffic Overview Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm border border-border-light dark:border-border-dark">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center"><TrendingUp className="h-5 w-5 text-film-red-600 mr-2" />Traffic Overview</h3>
        <TrafficChart data={dailyStats} />
      </motion.div>

      {/* Content Breakdown Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm border border-border-light dark:border-border-dark">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center"><PieIcon className="h-5 w-5 text-film-red-600 mr-2" />Content Views</h3> {/* Use PieIcon alias */}
        <ContentBreakdownChart data={contentBreakdownData} />
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          {contentBreakdownData.map((item) => (
            <div key={item.name} className="p-2">
              <div className="flex items-center justify-center space-x-1.5"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div><span className="text-xs font-medium text-gray-700 dark:text-gray-300">{item.name}</span></div>
              <p className="text-base font-semibold text-gray-900 dark:text-white mt-1">{item.value.toLocaleString()}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Optional: Growth Chart */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm border border-border-light dark:border-border-dark lg:col-span-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center"><TrendingUp className="h-5 w-5 text-film-red-600 mr-2" />Content Views Growth</h3>
        <GrowthChart data={dailyStats} />
      </motion.div>
    </div>
  );
};

export default DashboardCharts;

"use client";
import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, Users, Mail, AtSign, Calendar, ArrowUp, ArrowDown,
  UserCheck, UserX, Activity, Globe, BarChartHorizontal, Info
} from 'lucide-react'; // Removed unused icons
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import AnalyticsCard from '@/components/admin/AnalyticsCard'; // Ensure correct path

const SubscriberAnalytics = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [analyticsData, setAnalyticsData] = useState<any>(null);

  // Custom Tooltip for Charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const date = new Date(label);
      const formattedDate = date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

      return (
        <div className="bg-white dark:bg-film-black-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-film-black-700 text-xs">
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">{formattedDate}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value.toLocaleString()}${entry.unit || ''}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1200));
      const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : timeRange === '90d' ? 90 : 365;
      const mockData = generateMockAnalyticsData(days); // Assuming this function exists
      setAnalyticsData(mockData);
      setIsLoading(false);
    };
    fetchData();
  }, [timeRange]);

  const summary = useMemo(() => analyticsData?.summary || {}, [analyticsData]);
  const growthData = useMemo(() => analyticsData?.subscriberGrowth || [], [analyticsData]);
  const emailData = useMemo(() => analyticsData?.emailStats || [], [analyticsData]);
  const sourcesData = useMemo(() => analyticsData?.subscriberSources || [], [analyticsData]);
  const countriesData = useMemo(() => analyticsData?.topCountries || [], [analyticsData]);

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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-film-black-900 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-film-black-800">
        <div className="flex items-center">
          <TrendingUp className="h-6 w-6 text-film-red-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Subscriber Analytics
          </h2>
        </div>
        {/* Time Range Selector */}
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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnalyticsCard title="Total Subscribers" value={summary.totalSubscribers} change={summary.growthRate > 0 ? `+${summary.growthRate}%` : `${summary.growthRate}%`} icon={<Users className="h-6 w-6" />} color="blue" />
        <AnalyticsCard title="Active Subscribers" value={summary.activeSubscribers} unit={`(${Math.round(summary.activeSubscribers / summary.totalSubscribers * 100)}%)`} icon={<UserCheck className="h-6 w-6" />} color="green" />
        <AnalyticsCard title="Unsubscribed" value={summary.totalSubscribers - summary.activeSubscribers} change={`${summary.unsubscribeRate}%`} icon={<UserX className="h-6 w-6" />} color="red" isNegativeGood={true} />
        <AnalyticsCard title="Avg. Open Rate" value={summary.averageOpenRate} unit="%" icon={<Mail className="h-6 w-6" />} color="purple" />
        <AnalyticsCard title="Avg. Click Rate" value={summary.averageClickRate} unit="%" icon={<AtSign className="h-6 w-6" />} color="amber" />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        {/* Subscriber Growth Chart */}
        <motion.div className="chart-container" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <h3 className="chart-title"><Activity className="chart-icon" />Subscriber Growth</h3>
          <div className="h-80">
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
                <Area type="monotone" dataKey="subscribers" name="Total" stroke="#3182CE" fillOpacity={1} fill="url(#colorSubs)" />
                <Area type="monotone" dataKey="newSubscribers" name="New" stroke="#38A169" fillOpacity={1} fill="url(#colorNew)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Email Engagement Chart */}
        <motion.div className="chart-container" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <h3 className="chart-title"><Mail className="chart-icon" />Email Engagement</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
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
          </div>
        </motion.div>
      </div>

      {/* Subscriber Sources and Geo Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Subscriber Sources */}
        <motion.div className="chart-container" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
          <h3 className="chart-title"><AtSign className="chart-icon" />Subscriber Sources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
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
          </div>
        </motion.div>

        {/* Geographic Distribution */}
        <motion.div className="chart-container" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
          <h3 className="chart-title"><Globe className="chart-icon" />Geographic Distribution (Top 5)</h3>
          <div className="h-64 pr-4">
            <ResponsiveContainer width="100%" height="100%">
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
          </div>
        </motion.div>
      </div>

      {/* Placeholder for Recent Activity - could reuse ActivitySection if needed */}
      {/* <motion.div className="chart-container" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}> ... </motion.div> */}
    </div>
  );
};

// Helper function to generate mock data (ensure this exists)
function generateMockAnalyticsData(days: number) {
  function generateTimeSeriesData(days: number, type: 'growth' | 'email') {
    const data = []; const now = new Date(); let value = type === 'growth' ? 950 : 25;
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now); date.setDate(now.getDate() - i);
      if (type === 'growth') {
        value = Math.round(value * (1 + (Math.random() * 0.03 - 0.005)));
        data.push({ date: date.toISOString().split('T')[0], subscribers: value, newSubscribers: Math.round(Math.random() * 5) + 1 });
      } else {
        value += (Math.random() * 4 - 2);
        data.push({ date: date.toISOString().split('T')[0], openRate: Math.min(Math.max(value, 20), 40), clickRate: Math.min(Math.max(value * 0.25, 2), 8) });
      }
    } return data;
  }
  const totalSubs = 1250 + Math.floor(Math.random() * 50);
  const activeSubs = Math.round(totalSubs * (0.85 + Math.random() * 0.1));
  return {
    summary: { totalSubscribers: totalSubs, activeSubscribers: activeSubs, growthRate: (Math.random() * 10 + 5).toFixed(1), averageOpenRate: (Math.random() * 15 + 25).toFixed(1), averageClickRate: (Math.random() * 3 + 4).toFixed(1), unsubscribeRate: (Math.random() * 0.3 + 0.2).toFixed(2) },
    subscriberGrowth: generateTimeSeriesData(days, 'growth'),
    emailStats: generateTimeSeriesData(days, 'email'),
    subscriberSources: [{ name: 'Website', value: 650, color: '#3182CE' }, { name: 'Social', value: 320, color: '#8B5CF6' }, { name: 'Referral', value: 180, color: '#F05252' }, { name: 'Event', value: 100, color: '#16BDCA' }],
    topCountries: [{ name: 'Ghana', value: 380 }, { name: 'Nigeria', value: 280 }, { name: 'S. Africa', value: 210 }, { name: 'Kenya', value: 160 }, { name: 'USA', value: 120 }],
  };
}


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

"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/UI/Button";
import { Users, Mail, Send, Inbox, ChevronRight, List, Trash2, Activity, BarChart2 } from 'lucide-react'; // Added Activity, BarChart2
import { useEffect, useState, Suspense } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import SubscriberAnalytics from "./SubscriberAnalytics"; // Assuming this component exists
import LoadingSpinner from "@/components/UI/LoadingSpinner"; // Added LoadingSpinner
import { motion } from "framer-motion"; // Added motion
import Link from "next/link";

export default function SubscribersIndexPage() {
  const router = useRouter();
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);
  const [activeSubscriberCount, setActiveSubscriberCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      setIsLoading(true);
      try {
        // Simulate API fetch
        await new Promise(resolve => setTimeout(resolve, 1000));
        const total = 1250 + Math.floor(Math.random() * 100);
        const active = Math.round(total * (0.85 + Math.random() * 0.05));
        setSubscriberCount(total);
        setActiveSubscriberCount(active);
      } catch (error) {
        console.error("Error fetching subscriber summary:", error);
        // Set some defaults on error for UI stability
        setSubscriberCount(0);
        setActiveSubscriberCount(0);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const menuItems = [
    {
      title: "Subscriber List",
      description: "View and manage all subscribers",
      icon: <List className="h-6 w-6 text-blue-600 dark:text-blue-400" />,
      href: "/admin/subscribers/list",
      statsKey: "totalSubscribers"
    },
    {
      title: "Email Campaigns",
      description: "Create and send emails",
      icon: <Send className="h-6 w-6 text-green-600 dark:text-green-400" />,
      href: "/admin/subscribers/campaigns",
      statsKey: "campaigns" // Placeholder key
    },
    {
      title: "Analytics",
      description: "View subscriber growth & engagement",
      icon: <BarChart2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
      href: "/admin/analytics?type=subscribers", // Link to main analytics, could filter
      statsKey: "analytics" // Placeholder key
    },
    {
      title: "Unsubscribed Users",
      description: "View users who have opted out",
      icon: <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />,
      href: "/admin/subscribers/unsubscribed", // Assuming this page exists
      statsKey: "unsubscribed"
    }
  ];

  const getStatValue = (key: string): string => {
    if (isLoading) return "Loading...";
    switch (key) {
      case "totalSubscribers": return `${subscriberCount?.toLocaleString() ?? 0} subscribers`;
      case "campaigns": return "3 campaigns sent"; // Placeholder
      case "unsubscribed": return `${(subscriberCount ?? 0) - (activeSubscriberCount ?? 0)} unsubscribed`;
      case "analytics": return "View Insights";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-film-black-950">
      {/* Removed AdminHeader */}
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-film-red-600 mr-3" />
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Email Management</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Manage your subscribers and email campaigns.</p>
              </div>
            </div>
            <Button variant="primary" onClick={() => router.push('/admin/subscribers/campaigns')} icon={<Send className="h-4 w-4 mr-2" />}>
              Create Campaign
            </Button>
          </div>

          <ErrorBoundary>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {[
                { title: "Total Subscribers", value: subscriberCount, icon: Users, color: "blue" },
                { title: "Active Subscribers", value: activeSubscriberCount, icon: Users, color: "green" },
                { title: "Unsubscribed", value: (subscriberCount ?? 0) - (activeSubscriberCount ?? 0), icon: Trash2, color: "red" },
              ].map((stat, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                  <div className="bg-white dark:bg-film-black-900 overflow-hidden shadow-sm rounded-lg p-6">
                    <div className="flex items-center">
                      <div className={`flex-shrink-0 bg-${stat.color}-100 dark:bg-${stat.color}-900/20 rounded-md p-3`}>
                        <stat.icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                      </div>
                      <div className="ml-5 w-0 flex-1"><dl><dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">{stat.title}</dt><dd><div className="text-lg font-medium text-gray-900 dark:text-white">{isLoading ? <LoadingSpinner size="small" /> : stat.value?.toLocaleString() ?? 'N/A'}</div></dd></dl></div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Menu Cards - Enhanced styling */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {menuItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  whileHover={{ y: -4, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                  className="bg-white dark:bg-film-black-900 overflow-hidden shadow-sm rounded-lg cursor-pointer border border-gray-100 dark:border-film-black-800"
                  onClick={() => router.push(item.href)}
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-gray-100 dark:bg-film-black-800 rounded-md p-3 mr-4">{item.icon}</div>
                        <div><h3 className="text-lg font-medium text-gray-900 dark:text-white">{item.title}</h3><p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.description}</p></div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 pl-[64px]"> {/* Aligned with text */}
                      {getStatValue(item.statsKey)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Analytics Section */}
            <div className="mb-12">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Subscriber Analytics Overview</h2>
              <Suspense fallback={<div className="h-80 flex items-center justify-center bg-white dark:bg-film-black-900 rounded-xl shadow-sm"><LoadingSpinner size="large" /></div>}>
                <SubscriberAnalytics />
              </Suspense>
            </div>

            {/* Recent Activity (Placeholder/Example) */}
            <div className="mt-12">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-film-red-600" /> Recent Activity
              </h2>
              <div className="bg-white dark:bg-film-black-900 shadow-sm rounded-lg overflow-hidden border border-gray-100 dark:border-film-black-800">
                <ul className="divide-y divide-gray-200 dark:divide-film-black-800">
                  {/* Example Activity Items */}
                  <li className="px-4 py-4 sm:px-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-film-black-800/50"><p className="text-sm font-medium text-film-red-600 dark:text-film-red-500 truncate">Campaign Sent: 'May Newsletter'</p><p className="text-xs text-gray-500 dark:text-gray-400">May 15, 2023</p></li>
                  <li className="px-4 py-4 sm:px-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-film-black-800/50"><p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">New Subscriber: john.doe@example.com</p><p className="text-xs text-gray-500 dark:text-gray-400">May 12, 2023</p></li>
                  <li className="px-4 py-4 sm:px-6 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-film-black-800/50"><p className="text-sm font-medium text-red-600 dark:text-red-400 truncate">Unsubscribed: alice.smith@example.com</p><p className="text-xs text-gray-500 dark:text-gray-400">May 3, 2023</p></li>
                </ul>
                <div className="p-4 text-center"><Link href="/admin/activity" className="text-sm text-film-red-600 dark:text-film-red-500 hover:underline">View all activity</Link></div>
              </div>
            </div>
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}

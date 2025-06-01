"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/UI/Button";
import { Users, Mail, Send, List, Trash2, BarChart2 } from 'lucide-react'; // Simplified imports
import { useMemo, Suspense } from "react"; // Added useMemo
import ErrorBoundary from "@/components/ErrorBoundary";
import SubscriberAnalytics from "./SubscriberAnalytics";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import { motion } from "framer-motion";
import Link from "next/link";
import { useSubscribers } from "@/hooks/useSubscribers"; // Import the hook

export default function SubscribersIndexPage() {
  const router = useRouter();
  // --- Use the hook to get subscriber data and loading state ---
  const { subscribers, isLoading, error } = useSubscribers();
  // -----------------------------------------------------------

  // --- Calculate counts using useMemo ---
  const subscriberCounts = useMemo(() => {
    if (isLoading || !subscribers) {
      return { total: null, active: null, unsubscribed: null };
    }
    const total = subscribers.length;
    const active = subscribers.filter(s => s.subscribed).length;
    const unsubscribed = total - active;
    return { total, active, unsubscribed };
  }, [subscribers, isLoading]);
  // --------------------------------------

  const menuItems = [
    { title: "Subscriber List", description: "View and manage all subscribers", icon: <List className="h-6 w-6 text-blue-600 dark:text-blue-400" />, href: "/admin/subscribers/list", statsKey: "totalSubscribers" },
    { title: "Email Campaigns", description: "Create and send emails", icon: <Send className="h-6 w-6 text-green-600 dark:text-green-400" />, href: "/admin/subscribers/campaigns", statsKey: "campaigns" },
    {
      title: "Analytics", description: "View subscriber growth & engagement", icon: <BarChart2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />, href: "/admin/subscribers/analytics", // Link to new dedicated analytics page
      statsKey: "analytics"
    },
    // Removed unsubscribed from here as it's often part of the main list filter
    // { title: "Unsubscribed Users", description: "View users who have opted out", icon: <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />, href: "/admin/subscribers/list?filter=unsubscribed", statsKey: "unsubscribed"}
  ];

  const getStatValue = (key: string): string => {
    if (isLoading) return "Loading...";
    switch (key) {
      case "totalSubscribers": return `${subscriberCounts.total?.toLocaleString() ?? '?'} subscribers`;
      case "campaigns": return "Manage Campaigns"; // Updated text
      case "unsubscribed": return `${subscriberCounts.unsubscribed?.toLocaleString() ?? '?'} unsubscribed`;
      case "analytics": return "View Insights";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen"> {/* Removed unnecessary background */}
      <main className=""> {/* Removed padding, assuming layout handles it */}
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
              { title: "Total Subscribers", value: subscriberCounts.total, icon: Users, color: "blue" },
              { title: "Active Subscribers", value: subscriberCounts.active, icon: Users, color: "green" },
              { title: "Unsubscribed", value: subscriberCounts.unsubscribed, icon: Trash2, color: "red" },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <div className="bg-white dark:bg-film-black-900 overflow-hidden shadow-sm rounded-lg p-6 border border-gray-100 dark:border-film-black-800">
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
                whileHover={{ y: -4, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -4px rgba(0, 0, 0, 0.05)" }} // Subtle hover effect
                className="bg-white dark:bg-film-black-900 overflow-hidden shadow-sm rounded-lg cursor-pointer border border-gray-100 dark:border-film-black-800"
                onClick={() => router.push(item.href)}
              >
                {/* ... (Menu card content remains the same) ... */}
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-gray-100 dark:bg-film-black-800 rounded-md p-3 mr-4">{item.icon}</div>
                      <div><h3 className="text-lg font-medium text-gray-900 dark:text-white">{item.title}</h3><p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.description}</p></div>
                    </div>
                    {/* Removed ChevronRight as the whole card is clickable */}
                  </div>
                  <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 pl-[64px]">
                    {getStatValue(item.statsKey)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Analytics Section */}
          {/* Removed the SubscriberAnalytics component from here, assuming it's now on its own page */}
          {/* <div className="mb-12"> ... </div> */}

        </ErrorBoundary>
      </main>
    </div>
  );
}

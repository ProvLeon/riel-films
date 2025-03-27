"use client";
import { useRouter } from "next/navigation";
import AdminHeader from "@/components/admin/AdminHeader";
import { Button } from "@/components/UI/Button";
import { Users, Mail, Send, Inbox, ChevronRight, List, Trash2 } from 'lucide-react';
import { useEffect, useState } from "react";
import ErrorBoundary from "@/components/ErrorBoundary";
import SubscriberAnalytics from "./SubscriberAnalytics";

export default function SubscribersIndexPage() {
  const router = useRouter();
  const [subscriberCount, setSubscriberCount] = useState<number | null>(null);
  const [activeSubscriberCount, setActiveSubscriberCount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      setIsLoading(true);
      try {
        // In a real app, this would fetch actual data
        // For now, we'll simulate it
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSubscriberCount(324);
        setActiveSubscriberCount(298);
      } catch (error) {
        console.error("Error fetching subscriber summary:", error);
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
      stats: isLoading ? "Loading..." : `${subscriberCount} total subscribers`
    },
    {
      title: "Email Campaigns",
      description: "Create and send emails to your subscribers",
      icon: <Send className="h-6 w-6 text-green-600 dark:text-green-400" />,
      href: "/admin/subscribers/campaigns",
      stats: "3 campaigns sent"
    },
    {
      title: "Import & Export",
      description: "Import subscribers from CSV or export your list",
      icon: <Inbox className="h-6 w-6 text-purple-600 dark:text-purple-400" />,
      href: "/admin/subscribers/import",
      stats: "Last import: Never"
    },
    {
      title: "Unsubscribed Users",
      description: "View users who have unsubscribed",
      icon: <Trash2 className="h-6 w-6 text-red-600 dark:text-red-400" />,
      href: "/admin/subscribers/unsubscribed",
      stats: isLoading ? "Loading..." : `${subscriberCount! - activeSubscriberCount!} unsubscribed`
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-film-black-950">
      {/* <AdminHeader /> */}

      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center">
            <Mail className="h-8 w-8 text-film-red-600 mr-3" />
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Email Management
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Manage your subscribers and email campaigns
              </p>
            </div>
          </div>

          <ErrorBoundary>
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white dark:bg-film-black-900 overflow-hidden shadow-sm rounded-lg">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-blue-100 dark:bg-blue-900/20 rounded-md p-3">
                      <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                          Total Subscribers
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900 dark:text-white">
                            {isLoading ? "Loading..." : subscriberCount}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-film-black-900 overflow-hidden shadow-sm rounded-lg">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-green-100 dark:bg-green-900/20 rounded-md p-3">
                      <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                          Active Subscribers
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900 dark:text-white">
                            {isLoading ? "Loading..." : activeSubscriberCount}
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white dark:bg-film-black-900 overflow-hidden shadow-sm rounded-lg">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-amber-100 dark:bg-amber-900/20 rounded-md p-3">
                      <Send className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                          Recent Campaigns
                        </dt>
                        <dd>
                          <div className="text-lg font-medium text-gray-900 dark:text-white">
                            3
                          </div>
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-4 mb-12">
              <Button
                variant="primary"
                onClick={() => router.push('/admin/subscribers/campaigns')}
                icon={<Send className="h-4 w-4 mr-2" />}
              >
                Create Campaign
              </Button>
              <Button
                variant="secondary"
                onClick={() => router.push('/admin/subscribers/list')}
                icon={<Users className="h-4 w-4 mr-2" />}
              >
                View Subscribers
              </Button>
            </div>

            {/* Menu Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  onClick={() => router.push(item.href)}
                  className="bg-white dark:bg-film-black-900 overflow-hidden shadow-sm rounded-lg cursor-pointer hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-gray-100 dark:bg-film-black-800 rounded-md p-3 mr-4">
                          {item.icon}
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {item.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                    <div className="mt-4 text-xs text-gray-500 dark:text-gray-400 pl-14">
                      {item.stats}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="mt-12">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Recent Email Activity
              </h2>
              <div className="bg-white dark:bg-film-black-900 shadow-sm rounded-lg overflow-hidden">
                <ul className="divide-y divide-gray-200 dark:divide-film-black-800">
                  {[
                    {
                      title: "Campaign Sent: 'May Newsletter'",
                      date: "May 15, 2023",
                      description: "Sent to 298 subscribers"
                    },
                    {
                      title: "New Subscriber: john.doe@example.com",
                      date: "May 12, 2023",
                      description: "Subscribed via website footer"
                    },
                    {
                      title: "Campaign Sent: 'New Documentary Release'",
                      date: "May 5, 2023",
                      description: "Sent to 295 subscribers"
                    },
                    {
                      title: "Unsubscribed: alice.smith@example.com",
                      date: "May 3, 2023",
                      description: "User opted out via email link"
                    },
                    {
                      title: "Campaign Sent: 'African Film Festival'",
                      date: "Apr 20, 2023",
                      description: "Sent to 290 subscribers"
                    }
                  ].map((activity, index) => (
                    <li key={index}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-film-red-600 dark:text-film-red-500 truncate">
                            {activity.title}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 dark:bg-film-black-800 text-gray-800 dark:text-gray-200">
                              {activity.date}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                              {activity.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </ErrorBoundary>
        </div>
      </main>
    </div>
  );
}

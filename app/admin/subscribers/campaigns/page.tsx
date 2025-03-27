"use client";
import AdminHeader from "@/components/admin/AdminHeader";
import { Button } from "@/components/UI/Button";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Users, Send, Mail, Filter, RefreshCw, CheckCircle, XCircle, AlertTriangle, ChevronDown, ChevronUp
} from 'lucide-react';

// Custom hook for subscriber management
function useSubscribers() {
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubscribers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/subscribers');
        if (!response.ok) {
          throw new Error('Failed to fetch subscribers');
        }
        const data = await response.json();
        setSubscribers(data);
      } catch (error: any) {
        setError(error.message);
        // Provide some mock data for development
        if (process.env.NODE_ENV !== 'production') {
          setSubscribers([
            { id: '1', email: 'subscriber1@example.com', name: 'John Doe', subscribed: true, interests: ['films', 'stories'] },
            { id: '2', email: 'subscriber2@example.com', name: 'Jane Smith', subscribed: true, interests: ['productions'] },
            { id: '3', email: 'subscriber3@example.com', name: 'Alice Johnson', subscribed: true, interests: ['films', 'productions'] },
            { id: '4', email: 'subscriber4@example.com', subscribed: false, interests: [] },
            { id: '5', email: 'subscriber5@example.com', name: 'Bob Williams', subscribed: true, interests: ['stories'] },
          ]);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscribers();
  }, []);

  return { subscribers, isLoading, error };
}

// Campaign form interface
interface CampaignFormState {
  subject: string;
  content: string;
  filter: {
    interests: string[];
  };
}

export default function SubscriberCampaignsPage() {
  const router = useRouter();
  const { subscribers, isLoading: subscribersLoading } = useSubscribers();
  const [formState, setFormState] = useState<CampaignFormState>({
    subject: '',
    content: '',
    filter: {
      interests: []
    }
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{
    success: boolean;
    message: string;
    recipients?: string[];
  } | null>(null);
  const [showRecipients, setShowRecipients] = useState(false);

  // Available interest categories
  const interestOptions = [
    { value: 'films', label: 'Films' },
    { value: 'productions', label: 'Productions' },
    { value: 'stories', label: 'Stories' },
    { value: 'events', label: 'Events' },
    { value: 'news', label: 'Company News' },
  ];

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle interest checkbox changes
  const handleInterestChange = (interest: string) => {
    setFormState(prev => {
      const interests = prev.filter.interests.includes(interest)
        ? prev.filter.interests.filter(i => i !== interest)
        : [...prev.filter.interests, interest];

      return {
        ...prev,
        filter: {
          ...prev.filter,
          interests
        }
      };
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const response = await fetch('/api/subscribers/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formState),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email');
      }

      setSubmitResult({
        success: true,
        message: 'Email campaign sent successfully!',
        recipients: data.recipients
      });

      // Reset form after successful submission
      setFormState({
        subject: '',
        content: '',
        filter: {
          interests: []
        }
      });
    } catch (error: any) {
      setSubmitResult({
        success: false,
        message: error.message || 'Something went wrong. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate recipient count based on filters
  const getRecipientCount = () => {
    if (!subscribers.length) return 0;

    if (formState.filter.interests.length === 0) {
      return subscribers.filter(s => s.subscribed).length;
    }

    return subscribers.filter(s => {
      if (!s.subscribed) return false;

      // Check if subscriber has any of the selected interests
      return formState.filter.interests.some(interest =>
        s.interests && s.interests.includes(interest)
      );
    }).length;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-film-black-950">
      <AdminHeader />

      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex justify-between items-center">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-film-red-600 mr-3" />
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                Email Campaigns
              </h1>
            </div>
            <div>
              <Button
                variant="ghost"
                onClick={() => router.push('/admin/subscribers')}
                icon={<Users className="h-4 w-4 mr-2" />}
              >
                Manage Subscribers
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-film-black-900 rounded-lg shadow-sm border border-gray-200 dark:border-film-black-800">
                <div className="p-6 border-b border-gray-200 dark:border-film-black-800">
                  <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                    <Send className="h-5 w-5 text-film-red-600 mr-2" />
                    Create New Campaign
                  </h2>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Compose an email to send to your subscribers
                  </p>
                </div>

                <ErrorBoundary>
                  <form onSubmit={handleSubmit} className="p-6">
                    {/* Success/Error message */}
                    {submitResult && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`mb-6 p-4 rounded-lg ${submitResult.success
                            ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                            : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                          }`}
                      >
                        <div className="flex items-start">
                          {submitResult.success ? (
                            <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p className="font-medium">{submitResult.message}</p>

                            {submitResult.recipients && submitResult.recipients.length > 0 && (
                              <div className="mt-2">
                                <button
                                  type="button"
                                  onClick={() => setShowRecipients(!showRecipients)}
                                  className="text-sm flex items-center font-medium"
                                >
                                  {showRecipients ? (
                                    <>Hide recipient list <ChevronUp className="ml-1 h-3 w-3" /></>
                                  ) : (
                                    <>Show {submitResult.recipients.length} recipients <ChevronDown className="ml-1 h-3 w-3" /></>
                                  )}
                                </button>

                                {showRecipients && (
                                  <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: "auto" }}
                                    className="mt-2 text-sm overflow-hidden"
                                  >
                                    <div className="max-h-40 overflow-y-auto p-2 bg-white/10 rounded">
                                      {submitResult.recipients.map((email, index) => (
                                        <div key={index} className="mb-1">{email}</div>
                                      ))}
                                    </div>
                                  </motion.div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <div className="space-y-6">
                      {/* Subject line */}
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Subject Line <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          value={formState.subject}
                          onChange={handleInputChange}
                          required
                          className="w-full rounded-lg border border-gray-300 dark:border-film-black-700 bg-white dark:bg-film-black-800 px-4 py-2 focus:border-film-red-500 focus:ring-film-red-500 dark:text-white"
                          placeholder="e.g., New Releases from Riel Films"
                        />
                      </div>

                      {/* Email content */}
                      <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Email Content <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="content"
                          name="content"
                          value={formState.content}
                          onChange={handleInputChange}
                          required
                          rows={12}
                          className="w-full rounded-lg border border-gray-300 dark:border-film-black-700 bg-white dark:bg-film-black-800 px-4 py-2 focus:border-film-red-500 focus:ring-film-red-500 dark:text-white"
                          placeholder="Write your email content here... You can use basic HTML formatting."
                        ></textarea>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          You can use basic HTML tags like &lt;h1&gt;, &lt;p&gt;, &lt;a&gt;, &lt;img&gt;, etc.
                        </p>
                      </div>

                      {/* Submit button */}
                      <div className="flex justify-end space-x-4">
                        <Button
                          variant="secondary"
                          type="button"
                          onClick={() => router.push('/admin/subscribers')}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          type="submit"
                          isLoading={isSubmitting}
                          disabled={isSubmitting || !formState.subject || !formState.content}
                          icon={<Send className="h-4 w-4 mr-2" />}
                        >
                          Send Campaign
                        </Button>
                      </div>
                    </div>
                  </form>
                </ErrorBoundary>
              </div>
            </div>

            {/* Sidebar for campaign options */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-film-black-900 rounded-lg shadow-sm border border-gray-200 dark:border-film-black-800 sticky top-24">
                <div className="p-5 border-b border-gray-200 dark:border-film-black-800">
                  <h3 className="text-base font-medium text-gray-900 dark:text-white flex items-center">
                    <Filter className="h-4 w-4 text-film-red-600 mr-2" />
                    Target Audience
                  </h3>
                </div>

                <div className="p-5">
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Interests
                    </h4>
                    <div className="space-y-2">
                      {interestOptions.map(option => (
                        <label key={option.value} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={formState.filter.interests.includes(option.value)}
                            onChange={() => handleInterestChange(option.value)}
                            className="rounded border-gray-300 text-film-red-600 focus:ring-film-red-500"
                          />
                          <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            {option.label}
                          </span>
                        </label>
                      ))}
                    </div>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      No selection will target all active subscribers
                    </p>
                  </div>

                  <div className="mt-6 p-4 bg-gray-50 dark:bg-film-black-800 rounded-lg">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Recipients:
                      </h4>
                      <span className="text-sm font-semibold bg-film-red-100 dark:bg-film-red-900/30 text-film-red-800 dark:text-film-red-300 px-2 py-1 rounded">
                        {subscribersLoading ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          getRecipientCount()
                        )}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      {subscribersLoading
                        ? "Loading subscribers..."
                        : formState.filter.interests.length === 0
                          ? "Targeting all active subscribers"
                          : `Targeting subscribers interested in: ${formState.filter.interests.join(", ")}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Previous Campaigns Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                <Mail className="h-5 w-5 text-film-red-600 mr-2" />
                Recent Campaigns
              </h2>
            </div>

            <div className="bg-white dark:bg-film-black-900 rounded-lg shadow overflow-hidden">
              {/* This would be populated with real data in a production app */}
              <table className="min-w-full divide-y divide-gray-200 dark:divide-film-black-700">
                <thead className="bg-gray-50 dark:bg-film-black-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Subject
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Recipients
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Performance
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-film-black-900 divide-y divide-gray-200 dark:divide-film-black-800">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      New Documentary Release: "River's Edge"
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      June 12, 2023
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      342
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        32% open rate
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      May Newsletter: Behind the Scenes
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      May 3, 2023
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      328
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                        28% open rate
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      Important: Festival Submission Deadline
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      April 15, 2023
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      315
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
                        45% open rate
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

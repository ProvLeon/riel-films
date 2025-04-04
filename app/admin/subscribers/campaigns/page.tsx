"use client";
// AdminHeader removed, assuming it's handled by the main admin layout
import { Button } from "@/components/UI/Button";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useEffect, useState, useCallback, useMemo } from "react"; // Added useMemo
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion"; // Added AnimatePresence
import {
  Users, Send, Mail, Filter, RefreshCw, CheckCircle, XCircle, AlertTriangle, ChevronDown, ChevronUp, Eye, Edit
} from 'lucide-react';
import LoadingSpinner from "@/components/UI/LoadingSpinner"; // Added LoadingSpinner

// Assuming Subscriber type exists
type Subscriber = { id: string; email: string; name?: string; subscribed: boolean; interests: string[]; };
// Campaign form interface
interface CampaignFormState { subject: string; content: string; filter: { interests: string[]; }; }

export default function SubscriberCampaignsPage() {
  const router = useRouter();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [subscribersLoading, setSubscribersLoading] = useState(true);
  const [formState, setFormState] = useState<CampaignFormState>({ subject: '', content: '', filter: { interests: [] } });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string; recipients?: string[]; } | null>(null);
  const [showRecipients, setShowRecipients] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false); // State for filter panel

  // Fetch subscribers on mount
  useEffect(() => {
    const fetchSubscribers = async () => {
      setSubscribersLoading(true);
      try {
        const response = await fetch('/api/subscribers'); // Assuming GET returns all
        if (!response.ok) throw new Error('Failed to fetch subscribers');
        const data = await response.json();
        setSubscribers(data);
      } catch (error) {
        console.error("Error fetching subscribers:", error);
        // Use mock data if fetch fails in dev
        if (process.env.NODE_ENV !== 'production') {
          setSubscribers([
            { id: '1', email: 'sub1@example.com', subscribed: true, interests: ['films', 'stories'] },
            { id: '2', email: 'sub2@example.com', subscribed: true, interests: ['productions'] },
            { id: '3', email: 'sub3@example.com', subscribed: false, interests: [] }, // Unsubscribed example
          ]);
        }
      } finally {
        setSubscribersLoading(false);
      }
    };
    fetchSubscribers();
  }, []);

  // Available interest categories (should ideally come from settings or data)
  const interestOptions = useMemo(() => ['films', 'productions', 'stories', 'events', 'news'], []);

  // Handle form input changes
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    setSubmitResult(null); // Clear result on change
  }, []);

  // Handle interest checkbox changes
  const handleInterestChange = useCallback((interest: string) => {
    setFormState(prev => {
      const interests = prev.filter.interests.includes(interest)
        ? prev.filter.interests.filter(i => i !== interest)
        : [...prev.filter.interests, interest];
      return { ...prev, filter: { ...prev.filter, interests } };
    });
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitResult(null);
    setShowRecipients(false); // Close recipients list on new submission

    try {
      const response = await fetch('/api/subscribers/send-email', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to send email');
      setSubmitResult({ success: true, message: data.message || 'Campaign sent successfully!', recipients: data.recipients });
      setFormState({ subject: '', content: '', filter: { interests: [] } }); // Reset form
    } catch (error: any) {
      setSubmitResult({ success: false, message: error.message || 'Something went wrong.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate recipient count based on filters
  const recipientCount = useMemo(() => {
    if (subscribersLoading) return 0; // Return 0 while loading
    const activeSubscribers = subscribers.filter(s => s.subscribed);
    if (formState.filter.interests.length === 0) return activeSubscribers.length;
    return activeSubscribers.filter(s => formState.filter.interests.some(interest => s.interests?.includes(interest))).length;
  }, [subscribers, formState.filter.interests, subscribersLoading]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-film-black-950">
      {/* Removed AdminHeader, assuming it's in layout */}
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-film-red-600 mr-3" />
              <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Email Campaigns</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Create and send targeted emails.</p>
              </div>
            </div>
            <Button variant="secondary" onClick={() => router.push('/admin/subscribers/list')} icon={<Users className="h-4 w-4 mr-2" />}>Manage Subscribers</Button>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Campaign Editor Column */}
            <div className="lg:col-span-2">
              <div className="bg-white dark:bg-film-black-900 rounded-lg shadow-sm border border-gray-200 dark:border-film-black-800">
                <div className="p-6 border-b border-gray-200 dark:border-film-black-800"><h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center"><Send className="h-5 w-5 text-film-red-600 mr-2" />Create New Campaign</h2></div>
                <ErrorBoundary>
                  <form onSubmit={handleSubmit} className="p-6">
                    {/* Result Message */}
                    <AnimatePresence>
                      {submitResult && (
                        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`mb-6 p-4 rounded-lg text-sm ${submitResult.success ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300 border border-green-200 dark:border-green-700' : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300 border border-red-200 dark:border-red-700'}`}>
                          <div className="flex items-start">
                            {submitResult.success ? <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" /> : <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />}
                            <div className="flex-1">
                              <p className="font-medium">{submitResult.message}</p>
                              {submitResult.recipients && submitResult.recipients.length > 0 && (
                                <div className="mt-2"><button type="button" onClick={() => setShowRecipients(!showRecipients)} className="text-xs flex items-center font-medium hover:underline">{showRecipients ? 'Hide recipients' : `Show ${submitResult.recipients.length} recipients`} {showRecipients ? <ChevronUp className="ml-1 h-3 w-3" /> : <ChevronDown className="ml-1 h-3 w-3" />}</button>
                                  <AnimatePresence>{showRecipients && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="mt-2 overflow-hidden"><div className="max-h-40 overflow-y-auto p-2 bg-black/5 dark:bg-white/5 rounded text-xs">{submitResult.recipients.map((email, index) => (<div key={index} className="mb-1">{email}</div>))}</div></motion.div>)}</AnimatePresence>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {/* Form Fields */}
                    <div className="space-y-6">
                      <div><label htmlFor="subject" className="label-style">Subject Line <span className="text-red-500">*</span></label><input type="text" id="subject" name="subject" value={formState.subject} onChange={handleInputChange} required className="input-style" placeholder="e.g., New Releases from Riel Films" /></div>
                      <div><label htmlFor="content" className="label-style">Email Content <span className="text-red-500">*</span></label><textarea id="content" name="content" value={formState.content} onChange={handleInputChange} required rows={12} className="input-style" placeholder="Write your email content here... Basic HTML is supported."></textarea><p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Use basic HTML tags like &lt;p&gt;, &lt;a&gt;, &lt;strong&gt;, &lt;img&gt;.</p></div>
                      <div className="flex justify-end space-x-4">
                        <Button variant="secondary" type="button" onClick={() => router.push('/admin/subscribers')}>Cancel</Button>
                        <Button variant="primary" type="submit" isLoading={isSubmitting} disabled={isSubmitting || !formState.subject || !formState.content || recipientCount === 0} icon={<Send className="h-4 w-4 mr-2" />}>Send Campaign ({recipientCount})</Button>
                      </div>
                    </div>
                  </form>
                </ErrorBoundary>
              </div>
            </div>

            {/* Sidebar for Targeting */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-film-black-900 rounded-lg shadow-sm border border-gray-200 dark:border-film-black-800 sticky top-24">
                <div className="p-5 border-b border-gray-200 dark:border-film-black-800"><h3 className="text-base font-medium text-gray-900 dark:text-white flex items-center"><Filter className="h-4 w-4 text-film-red-600 mr-2" />Target Audience</h3></div>
                <div className="p-5">
                  <div className="mb-4"><h4 className="label-style mb-2">Interests</h4>
                    <div className="space-y-2">
                      {interestOptions.map(interest => (
                        <label key={interest} className="flex items-center"><input type="checkbox" checked={formState.filter.interests.includes(interest)} onChange={() => handleInterestChange(interest)} className="checkbox-style" /><span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">{interest}</span></label>
                      ))}
                    </div><p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Select interests to target specific subscribers. Leave blank to target all.</p>
                  </div>
                  <div className="mt-6 p-4 bg-gray-50 dark:bg-film-black-800 rounded-lg border border-gray-100 dark:border-film-black-700">
                    <div className="flex justify-between items-center"><h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Estimated Recipients:</h4><span className="text-sm font-semibold bg-film-red-100 dark:bg-film-red-900/30 text-film-red-800 dark:text-film-red-300 px-2 py-1 rounded">{subscribersLoading ? <LoadingSpinner size="small" /> : recipientCount.toLocaleString()}</span></div>
                    <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">{subscribersLoading ? "Calculating..." : formState.filter.interests.length === 0 ? "Targeting all active subscribers." : `Targeting active subscribers interested in: ${formState.filter.interests.join(", ")}`}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Campaigns Section (Placeholder) */}
          <div className="mt-12">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Recent Campaigns</h2>
            <div className="bg-white dark:bg-film-black-900 rounded-lg shadow overflow-hidden border border-gray-200 dark:border-film-black-800">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-film-black-700">
                <thead className="bg-gray-50 dark:bg-film-black-800"><tr><th className="table-header">Subject</th><th className="table-header">Date</th><th className="table-header">Recipients</th><th className="table-header">Performance</th><th className="table-header text-right">Actions</th></tr></thead>
                <tbody className="bg-white dark:bg-film-black-900 divide-y divide-gray-200 dark:divide-film-black-800">
                  {/* Placeholder Rows */}
                  {[1, 2, 3].map(i => (
                    <tr key={i} className="hover:bg-gray-50 dark:hover:bg-film-black-800/50">
                      <td className="px-6 py-4 table-cell-text font-medium">Campaign Subject {i}</td>
                      <td className="px-6 py-4 table-cell-text">July {20 - i * 5}, 2023</td>
                      <td className="px-6 py-4 table-cell-text">{(300 + i * 15).toLocaleString()}</td>
                      <td className="px-6 py-4"><span className="status-badge bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">{(30 - i * 2)}% open</span></td>
                      <td className="px-6 py-4 text-right"><button className="action-button"><Eye className="h-4 w-4" /></button><button className="action-button"><Edit className="h-4 w-4" /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Add shared styles
const styles = `
  .label-style { @apply block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1; }
  .input-style { @apply w-full px-4 py-2 rounded-lg bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white shadow-sm; }
  .checkbox-style { @apply rounded border-gray-300 text-film-red-600 focus:ring-film-red-500; }
  .table-header { @apply px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider; }
  .table-cell-text { @apply px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300; }
  .status-badge { @apply px-2 py-1 text-xs rounded-full inline-flex items-center font-medium; }
  .action-button { @apply p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-film-red-600 dark:hover:text-film-red-500 transition-colors; }
`;
if (typeof window !== 'undefined') { const styleSheet = document.createElement("style"); styleSheet.innerText = styles; document.head.appendChild(styleSheet); }

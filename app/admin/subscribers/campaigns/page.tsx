"use client";
import React, { useState, useEffect, useCallback, Suspense, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Filter, Clock, Check, Edit, X, Info,
  AlertTriangle, CheckCircle, ChevronDown, List, Eye, Trash2, ArrowLeft,
  Mail, ChevronRight, ChevronLeft
} from 'lucide-react';
import TiptapEditor from '@/components/admin/TiptapEditor';
import { Button } from '@/components/UI/Button';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/UI/Alert';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import { useSubscribers } from '@/hooks/useSubscribers'; // Import the hook

// --- Interfaces ---
interface CampaignFormState { subject: string; content: string; filter: { interests: string[] }; }
// Removed Subscriber interface, rely on hook
interface Campaign { id: string; subject: string; status: string; createdAt: string; sentAt?: string; recipientCount: number; deliveredCount?: number; openedCount?: number; clickedCount?: number; }
interface PaginationInfo { currentPage: number; totalPages: number; totalCampaigns: number; limit: number; }
// --- End Interfaces ---


// --- Helper Functions ---
const getStatusBadge = (status: string) => {
  switch (status?.toLowerCase()) {
    case 'sent': return <span className="status-badge bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"><CheckCircle className="h-3 w-3 mr-1" />Sent</span>;
    case 'sending': return <span className="status-badge bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400"><motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}><Clock className="h-3 w-3 mr-1" /></motion.div>Sending</span>;
    case 'queued': return <span className="status-badge bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"><Clock className="h-3 w-3 mr-1" />Queued</span>;
    case 'draft': return <span className="status-badge bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"><Edit className="h-3 w-3 mr-1" />Draft</span>;
    case 'failed': case 'failed_configuration': case 'partial_failure': return <span className="status-badge bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"><AlertTriangle className="h-3 w-3 mr-1" />Failed</span>;
    default: return <span className="status-badge bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400">{status}</span>;
  }
};
// --- End Helper Functions ---


// --- Main Component ---
// Renamed component to follow convention for page files
export default function CampaignsPage() {
  const [formState, setFormState] = useState<CampaignFormState>({ subject: '', content: '', filter: { interests: [] } });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState<{ success: boolean; message: string; campaignId?: string; } | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  // --- Use the subscribers hook for count estimation ---
  const { subscribers, isLoading: subscribersLoading } = useSubscribers(true); // Fetch initially for count
  // ----------------------------------------------------
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [isLoadingCampaigns, setIsLoadingCampaigns] = useState(true);
  const [campaignsError, setCampaignsError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemToDelete, setItemToDelete] = useState<Campaign | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // --- Fetch Campaigns (Remains the same) ---
  const fetchCampaigns = useCallback(async (page = 1) => { /* ... */ }, []);
  useEffect(() => { fetchCampaigns(currentPage); }, [currentPage, fetchCampaigns]);
  // --- End Fetch Campaigns ---

  // --- Calculate Recipient Count (Uses data from hook) ---
  const recipientCount = useMemo(() => {
    if (subscribersLoading) return 0; // Use loading state from hook
    const activeSubscribers = subscribers.filter(s => s.subscribed); // Filter for active
    if (formState.filter.interests.length === 0) return activeSubscribers.length;
    return activeSubscribers.filter(s =>
      formState.filter.interests.some(interest => s.interests?.includes(interest))
    ).length;
  }, [subscribers, formState.filter.interests, subscribersLoading]); // Depend on hook data/state
  // --- End Recipient Count ---

  const interestOptions = useMemo(() => ['films', 'productions', 'stories', 'events', 'news'], []);

  // --- Handlers ---
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
    setSubmitResult(null);
  }, []);

  const handleContentChange = useCallback((newContent: string) => {
    setFormState(prev => ({ ...prev, content: newContent }));
    setSubmitResult(null);
  }, []);

  const handleInterestChange = useCallback((interest: string) => {
    setFormState(prev => {
      const interests = prev.filter.interests.includes(interest)
        ? prev.filter.interests.filter(i => i !== interest)
        : [...prev.filter.interests, interest];
      return { ...prev, filter: { ...prev.filter, interests } };
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.subject || !formState.content) {
      setSubmitResult({ success: false, message: "Subject and Content are required." });
      return;
    }
    if (recipientCount === 0) {
      setSubmitResult({ success: false, message: "Cannot send campaign with 0 recipients." });
      return;
    }

    setIsSubmitting(true);
    setSubmitResult(null);

    try {
      const response = await fetch('/api/subscribers/send-email', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });
      const data = await response.json();
      if (!response.ok || response.status !== 202) {
        throw new Error(data.error || `Failed to queue campaign (Status: ${response.status})`);
      }
      setSubmitResult({ success: true, message: data.message || 'Campaign queued successfully!', campaignId: data.campaignId });
      setFormState({ subject: '', content: '', filter: { interests: [] } }); // Reset form
      fetchCampaigns(1); // Refresh campaign list after queuing new one
      setCurrentPage(1);
    } catch (error: any) {
      setSubmitResult({ success: false, message: error.message || 'Something went wrong.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Handlers
  const handleDeleteClick = (campaign: Campaign) => {
    setItemToDelete(campaign);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    setCampaignsError(null);
    try {
      const response = await fetch(`/api/campaigns/${itemToDelete.id}`, { method: 'DELETE' });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete campaign');
      }
      setItemToDelete(null);
      fetchCampaigns(currentPage); // Refresh list
    } catch (err: any) {
      setCampaignsError(err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  // Pagination Handler
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && (!pagination || newPage <= pagination.totalPages)) {
      setCurrentPage(newPage);
    }
  };
  // --- End Handlers ---

  return (
    <div className="min-h-screen"> {/* Use layout for padding/bg */}
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center">
          {/* Added back button for context */}
          <Link href="/admin/subscribers" className="mr-3 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-film-black-800">
            <ArrowLeft size={20} />
          </Link>
          <Mail className="h-6 w-6 text-film-red-600 mr-2" />
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Email Campaigns</h1>
        </div>
        {/* Removed redundant button */}
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Campaign Editor Section */}
        <div className="lg:col-span-2 bg-white dark:bg-film-black-900 rounded-xl shadow-sm border border-border-light dark:border-border-dark">
          {/* ... (Editor Header, Form, Subject, Content Editor, Feedback, Submit Button - all remain the same) ... */}
          <div className="p-6 border-b border-border-light dark:border-border-dark">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center"><Edit className="h-5 w-5 text-film-red-600 mr-2" />Compose Campaign</h2>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Subject */}
            <div>
              <label htmlFor="subject" className="label-style">Subject Line <span className="text-red-500">*</span></label>
              <input type="text" id="subject" name="subject" required value={formState.subject} onChange={handleInputChange} className="input-style" placeholder="Enter email subject" />
            </div>
            {/* Content Editor */}
            <div>
              <label className="label-style">Email Content <span className="text-red-500">*</span></label>
              <TiptapEditor
                content={formState.content}
                onChange={handleContentChange}
                placeholder="Start writing your email content here..."
                className="tiptap-editor-container"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Use the editor for formatting.</p>
            </div>
            {/* Submission Feedback */}
            <AnimatePresence>
              {submitResult && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}> <Alert variant={submitResult.success ? 'success' : 'destructive'}> {submitResult.success ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />} <AlertTitle>{submitResult.success ? 'Success!' : 'Error'}</AlertTitle><AlertDescription>{submitResult.message}</AlertDescription> </Alert> </motion.div>)}
            </AnimatePresence>
            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t border-border-light dark:border-border-dark">
              <Button variant="primary" type="submit" isLoading={isSubmitting} disabled={isSubmitting || !formState.subject || !formState.content || recipientCount === 0} icon={<Send className="h-4 w-4" />}>Send Campaign ({recipientCount})</Button>
            </div>
          </form>
        </div>

        {/* Sidebar for Targeting */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white dark:bg-film-black-900 rounded-xl shadow-sm border border-border-light dark:border-border-dark sticky top-24">
            {/* ... (Targeting Header/Toggle - remains the same) ... */}
            <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="flex justify-between items-center w-full p-5 border-b border-border-light dark:border-border-dark cursor-pointer">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center"><Filter className="h-4 w-4 text-film-red-600 mr-2" />Target Audience</h3>
              <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {isFilterOpen && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                  <div className="p-5 space-y-4">
                    {/* Filter by Interest (remains the same) */}
                    <div>
                      <h4 className="label-style mb-2">Filter by Interest</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                        {interestOptions.map(interest => (
                          <label key={interest} className="flex items-center cursor-pointer">
                            <input type="checkbox" checked={formState.filter.interests.includes(interest)} onChange={() => handleInterestChange(interest)} className="checkbox-style" />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">{interest}</span>
                          </label>
                        ))}
                      </div>
                      <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Select interests to target. Leave blank for all active.</p>
                    </div>
                    {/* Estimated Recipients (uses hook's loading state) */}
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-film-black-800 rounded-lg border border-border-light dark:border-border-dark">
                      <div className="flex justify-between items-center">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Est. Recipients:</h4>
                        <span className="text-sm font-semibold bg-film-red-100 dark:bg-film-red-900/30 text-film-red-800 dark:text-film-red-300 px-2 py-0.5 rounded-full">
                          {subscribersLoading ? <LoadingSpinner size="small" /> : recipientCount.toLocaleString()} {/* Use hook's loading state */}
                        </span>
                      </div>
                      {/* ... (rest of the recipient count info) ... */}
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Based on active subscribers {formState.filter.interests.length > 0 ? `interested in: ${formState.filter.interests.join(', ')}` : ''}.</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>


      <div className="mt-12">
        {/* ... (Table rendering, loading, error, pagination - all remain the same) ... */}
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Campaign History</h2>
        <div className="bg-white dark:bg-film-black-900 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-film-black-800">
          {isLoadingCampaigns ? (
            <div className="flex justify-center items-center h-64"><LoadingSpinner size="large" /></div>
          ) : campaignsError ? (
            <div className="p-8 text-center text-red-500 dark:text-red-400">{campaignsError}</div>
          ) : campaigns.length === 0 ? (
            <div className="p-12 text-center text-gray-500 dark:text-gray-400">No campaigns sent yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-film-black-800">
                <thead className="bg-gray-50 dark:bg-film-black-800"><tr><th className="table-header">Subject</th><th className="table-header">Status</th><th className="table-header">Created</th><th className="table-header">Sent</th><th className="table-header text-right">Recipients</th><th className="table-header text-right">Actions</th></tr></thead>
                <tbody className="bg-white dark:bg-film-black-900 divide-y divide-gray-200 dark:divide-film-black-800">
                  {campaigns.map((campaign) => (
                    <tr key={campaign.id} className="hover:bg-gray-50 dark:hover:bg-film-black-800/50">
                      <td className="px-6 py-4 table-cell-text font-medium">{campaign.subject}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(campaign.status)}</td>
                      <td className="px-6 py-4 table-cell-text">{formatDate(campaign.createdAt)}</td>
                      <td className="px-6 py-4 table-cell-text">{campaign.sentAt ? formatDate(campaign.sentAt) : '—'}</td>
                      <td className="px-6 py-4 table-cell-text text-right">{campaign.recipientCount?.toLocaleString() ?? 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right"><div className="flex justify-end space-x-2"><button className="action-button" title="View Details"><Eye className="h-4 w-4" /></button><button onClick={() => handleDeleteClick(campaign)} className="action-button text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30" title="Delete"><Trash2 className="h-4 w-4" /></button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {/* Pagination for Campaigns */}
          {pagination && pagination.totalPages > 1 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-film-black-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">Page {pagination.currentPage} of {pagination.totalPages}</span>
              <div className="flex items-center space-x-2">
                <Button variant="secondary" size="sm" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} icon={<ChevronLeft className="h-4 w-4" />} > Prev </Button>
                <Button variant="secondary" size="sm" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === pagination.totalPages} icon={<ChevronRight className="h-4 w-4" />} className="flex-row-reverse" > Next </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal (remains the same) */}
      <AnimatePresence>
        {itemToDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setItemToDelete(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-film-black-900 p-6 rounded-xl max-w-md w-full m-4 shadow-xl border border-gray-200 dark:border-film-black-700" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Delete Campaign</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">Are you sure you want to delete the campaign "{itemToDelete.subject}"? This action cannot be undone.</p>
              <div className="flex justify-end gap-4">
                <Button variant="secondary" onClick={() => setItemToDelete(null)} disabled={isDeleting}>Cancel</Button>
                <Button variant="danger" onClick={confirmDelete} isLoading={isDeleting} disabled={isDeleting}>Delete</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Add shared styles ---
const styles = `
        .label-style {@apply block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1; }
        .input-style {@apply w-full px-4 py-2 rounded-lg bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 dark:text-white shadow-sm; }
        .checkbox-style {@apply rounded border-gray-300 dark:border-film-black-600 text-film-red-600 focus:ring-film-red-500 dark:bg-film-black-700; }
        .table-header {@apply px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider; }
        .table-cell-text {@apply px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300; }
        .status-badge {@apply px-2 py-1 text-xs rounded-full inline-flex items-center font-medium; }
        .action-button {@apply p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-film-red-600 dark:hover:text-film-red-500 transition-colors; }
        /* Quill Editor Styling */
        .quill-editor .ql-toolbar {@apply bg-gray-50 dark:bg-film-black-800 border-gray-200 dark:border-film-black-700 rounded-t-lg border-b-0; }
        .quill-editor .ql-toolbar .ql-stroke {@apply stroke-gray-600 dark:stroke-gray-300; }
        .quill-editor .ql-toolbar .ql-fill {@apply fill-gray-600 dark:fill-gray-300; }
        .quill-editor .ql-toolbar .ql-picker-label {@apply text-gray-600 dark:text-gray-300; }
        .quill-editor .ql-container {@apply border-gray-200 dark:border-film-black-700 rounded-b-lg text-gray-900 dark:text-white; min-height: 350px; font-size: 1rem; }
        .quill-editor .ql-editor {@apply p-4; }
        .quill-editor .ql-editor.ql-blank::before {@apply text-gray-400 dark:text-gray-500 not-italic; }
        `;
if (typeof window !== 'undefined') { const styleSheet = document.createElement("style"); styleSheet.innerText = styles; document.head.appendChild(styleSheet); }
// --- End Styles ---

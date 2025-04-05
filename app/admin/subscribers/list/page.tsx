"use client";
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Search, Filter, Mail, ExternalLink, Trash2, MoreHorizontal,
  RefreshCw, Download, CheckCircle, XCircle, ArrowDown, ArrowUp, AlertTriangle, ChevronDown, ChevronLeft, ChevronRight, ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/UI/Button';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import { Subscriber } from '@/types/mongodbSchema';
import { useSubscribers } from '@/hooks/useSubscribers';
import { Alert, AlertDescription, AlertTitle } from '@/components/UI/Alert';
import Link from 'next/link'; // Import Link

const SubscribersListPage = () => {
  // --- Use the hook to manage subscribers data ---
  const { subscribers, isLoading, error, fetchSubscribers, setSubscribers } = useSubscribers();
  // ----------------------------------------------

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ subscribed: 'all', source: 'all' });
  const [sort, setSort] = useState({ field: 'subscribedAt', direction: 'desc' });
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isBulkActionsOpen, setIsBulkActionsOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); // State for delete confirmation modal
  const [itemToDelete, setItemToDelete] = useState<Subscriber | null>(null); // Track single item to delete via modal
  const [actionError, setActionError] = useState<string | null>(null); // For displaying general action errors

  // Apply filters, search, and sort to the data from the hook
  const filteredSubscribers = useMemo(() => {
    let result = [...subscribers];
    // Apply filters
    if (filters.subscribed !== 'all') result = result.filter(sub => filters.subscribed === 'active' ? sub.subscribed : !sub.subscribed);
    if (filters.source !== 'all') result = result.filter(sub => sub.source === filters.source);
    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(sub => sub.email.toLowerCase().includes(query) || (sub.name && sub.name.toLowerCase().includes(query)));
    }
    // Apply sort
    result.sort((a, b) => {
      const fieldA = a[sort.field as keyof Subscriber];
      const fieldB = b[sort.field as keyof Subscriber];
      let comparison = 0;
      if (typeof fieldA === 'string' && typeof fieldB === 'string') comparison = fieldA.localeCompare(fieldB);
      else if (typeof fieldA === 'boolean' && typeof fieldB === 'boolean') comparison = Number(fieldA) - Number(fieldB);
      else if (sort.field === 'subscribedAt' || sort.field === 'lastEmailSent') {
        const dateA = fieldA ? new Date(fieldA as string).getTime() : 0;
        const dateB = fieldB ? new Date(fieldB as string).getTime() : 0;
        comparison = dateA - dateB;
      }
      return sort.direction === 'asc' ? comparison : -comparison;
    });
    return result;
  }, [subscribers, filters, searchQuery, sort]);

  // Selection handlers
  const toggleSelection = (id: string) => setSelectedSubscribers(prev => prev.includes(id) ? prev.filter(subId => subId !== id) : [...prev, id]);
  const toggleSelectAll = () => setSelectedSubscribers(selectedSubscribers.length === filteredSubscribers.length ? [] : filteredSubscribers.map(sub => sub.id));

  // Sort handler
  const handleSort = (field: string) => setSort(prev => ({ field, direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc' }));

  // Unique sources for filter dropdown
  const uniqueSources = useMemo(() => ['all', ...new Set(subscribers.map(sub => sub.source).filter(Boolean))], [subscribers]);

  // Format date
  const formatDate = (dateString?: string | Date) => { // Accept Date object too
    if (!dateString) return '—';
    try {
      return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch (e) {
      return 'Invalid Date';
    }
  }

  // --- Delete Handling ---
  const handleDeleteClick = (subscriber: Subscriber) => {
    setItemToDelete(subscriber);
    setIsDeleteModalOpen(true);
    setActionError(null); // Clear previous errors
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    setActionError(null);
    try {
      const response = await fetch(`/api/subscribers/${encodeURIComponent(itemToDelete.email)}`, { method: 'DELETE' });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to delete subscriber');
      }
      // Optimistic update: Remove from local state immediately
      setSubscribers(prev => prev.filter(sub => sub.id !== itemToDelete.id));
      setSelectedSubscribers(prev => prev.filter(id => id !== itemToDelete.id)); // Also remove from selection
      console.log(`Successfully deleted subscriber: ${itemToDelete.email}`);
    } catch (err: any) {
      console.error('Error deleting subscriber:', err);
      setActionError(err.message || 'An unexpected error occurred during deletion.');
      // Optional: fetchSubscribers() here to ensure sync if optimistic update fails visually
    } finally {
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
    }
  };
  // --- End Delete Handling ---

  // --- Bulk Actions ---
  const handleBulkAction = async (action: 'delete' | 'export' | 'email') => {
    if (selectedSubscribers.length === 0) return;
    setActionError(null); // Clear previous errors

    if (action === 'delete') {
      if (!confirm(`Are you sure you want to delete ${selectedSubscribers.length} selected subscriber(s)? This cannot be undone.`)) {
        return;
      }
      console.log('Attempting to bulk delete subscribers:', selectedSubscribers);
      try {
        // --- Call API to delete each selected subscriber ---
        // Note: A dedicated bulk delete API endpoint is highly recommended for performance.
        const deletePromises = selectedSubscribers.map(id => {
          const subToDelete = subscribers.find(s => s.id === id);
          if (!subToDelete) return Promise.resolve({ ok: false, error: `Subscriber ${id} not found` });
          return fetch(`/api/subscribers/${encodeURIComponent(subToDelete.email)}`, { method: 'DELETE' });
        });

        const results = await Promise.all(deletePromises);
        const failedDeletes = results.filter(res => !res.ok);
        const successfulIds = selectedSubscribers.filter((id, index) => results[index].ok);

        if (failedDeletes.length > 0) {
          console.error(`${failedDeletes.length} subscribers failed to delete.`);
          let errorMsg = `${failedDeletes.length} subscriber(s) could not be deleted.`;
          try {
            const firstFailedResult = failedDeletes[0];
            if (firstFailedResult instanceof Response) { // Check if it's a Response object
              // Attempt to parse JSON, but handle cases where it might not be valid JSON
              try {
                const errorJson = await firstFailedResult.json();
                errorMsg += ` First error: ${errorJson?.error || `Status ${firstFailedResult.status}` || 'Unknown reason'}`;
              } catch (parseError) {
                errorMsg += ` First error: Status ${firstFailedResult.status} (Could not parse error details)`;
              }
            } else if (typeof firstFailedResult === 'object' && firstFailedResult !== null && 'error' in firstFailedResult) { // Check if it's our custom error object
              errorMsg += ` First error: ${firstFailedResult.error}`;
            } else {
              errorMsg += ` First error: Unknown structure.`; // Fallback
            }
          } catch (e) {
            console.error("Could not process error response:", e);
            errorMsg += ` (Error processing details)`;
          }
          setActionError(errorMsg);
        }


        // Remove successfully deleted items from local state
        if (successfulIds.length > 0) {
          setSubscribers(prev => prev.filter(sub => !successfulIds.includes(sub.id)));
          console.log(`Successfully deleted ${successfulIds.length} subscribers.`);
        }

        setSelectedSubscribers([]); // Clear selection regardless of partial failure
        setIsBulkActionsOpen(false);

      } catch (err: any) {
        console.error('Error during bulk delete:', err);
        setActionError(err.message || 'An unexpected error occurred during bulk deletion.');
      }
    } else if (action === 'export') {
      console.log('Exporting subscribers:', selectedSubscribers);
      alert(`Simulating export of ${selectedSubscribers.length} subscribers`); // Replace with actual export logic
      setIsBulkActionsOpen(false);
    } else if (action === 'email') {
      console.log('Emailing subscribers:', selectedSubscribers);
      alert(`Simulating preparing email to ${selectedSubscribers.length} subscribers`); // Replace with logic to go to campaign editor
      setIsBulkActionsOpen(false);
    }
  };
  // --- End Bulk Actions ---

  // --- Render Logic ---
  return (
    <div className="min-h-screen"> {/* Layout handles padding */}
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div className="flex items-center">
          <Link href="/admin/subscribers" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-film-black-800 mr-2 transition-colors">
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </Link>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
            <Users className="h-6 w-6 text-film-red-600 mr-2" /> Subscriber List
          </h1>
        </div>
        {/* Action buttons can go here if needed, e.g., link to campaigns */}
        <Link href="/admin/subscribers/campaigns">
          <Button variant="primary" size="sm" icon={<Mail className="h-4 w-4" />}>
            Manage Campaigns
          </Button>
        </Link>
      </div>

      {/* Filters and Search Section */}
      <div className="bg-white dark:bg-film-black-900 rounded-xl shadow-sm p-4 mb-6 border border-gray-100 dark:border-film-black-800">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-grow w-full md:w-1/2 lg:w-1/3">
            <input type="text" placeholder="Search by email or name..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="input-style w-full pl-10" />
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>
          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Bulk Actions Dropdown */}
            {selectedSubscribers.length > 0 && (
              <div className="relative dropdown-container">
                <Button variant="secondary" size="sm" onClick={() => setIsBulkActionsOpen(!isBulkActionsOpen)}>
                  Actions ({selectedSubscribers.length}) <ChevronDown className={`ml-1 h-4 w-4 transition-transform ${isBulkActionsOpen ? 'rotate-180' : ''}`} />
                </Button>
                <AnimatePresence>
                  {isBulkActionsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-film-black-800 rounded-md shadow-lg border border-gray-100 dark:border-film-black-700 z-20 p-1" // Increased z-index
                    >
                      <button onClick={() => handleBulkAction('email')} className="button-menu-item text-blue-600 dark:text-blue-400"><Mail className="h-4 w-4" /> Email Selected</button>
                      <button onClick={() => handleBulkAction('export')} className="button-menu-item text-green-600 dark:text-green-400"><Download className="h-4 w-4" /> Export Selected</button>
                      <button onClick={() => handleBulkAction('delete')} className="button-menu-item text-red-600 dark:text-red-400"><Trash2 className="h-4 w-4" /> Delete Selected</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            <Button variant="secondary" size="sm" onClick={() => setIsFiltersOpen(!isFiltersOpen)} icon={<Filter className="h-4 w-4" />}>
              Filters {(filters.subscribed !== 'all' || filters.source !== 'all') && <span className="ml-1.5 w-2 h-2 rounded-full bg-film-red-600"></span>}
            </Button>
            {(filters.subscribed !== 'all' || filters.source !== 'all' || searchQuery) &&
              <Button variant="ghost" size="sm" onClick={() => { setSearchQuery(''); setFilters({ subscribed: 'all', source: 'all' }); setIsFiltersOpen(false); }} icon={<RefreshCw className="h-4 w-4" />} className="text-gray-600 dark:text-gray-400">Reset</Button>
            }
          </div>
        </div>
        {/* Expanded Filters Panel */}
        <AnimatePresence>
          {isFiltersOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-200 dark:border-film-black-700 overflow-hidden">
              <div><label className="label-style">Status</label><select value={filters.subscribed} onChange={e => setFilters(prev => ({ ...prev, subscribed: e.target.value }))} className="input-style w-full"><option value="all">All Subscribers</option><option value="active">Active Only</option><option value="inactive">Unsubscribed Only</option></select></div>
              <div><label className="label-style">Source</label><select value={filters.source} onChange={e => setFilters(prev => ({ ...prev, source: e.target.value }))} className="input-style w-full">
                {uniqueSources.map(source => (
                  <option key={source} value={source}>
                    {source === 'all' ? 'All Sources' : (source ? source.charAt(0).toUpperCase() + source.slice(1) : 'Unknown')} {/* Added check/fallback */}
                  </option>
                ))}
              </select></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Action Error Display */}
      {actionError && (
        <Alert variant="destructive" className="mb-6">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Action Failed</AlertTitle>
          <AlertDescription>{actionError}</AlertDescription>
        </Alert>
      )}

      {/* Table Container */}
      <div className="bg-white dark:bg-film-black-900 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-film-black-800">
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center min-h-[400px]"> <LoadingSpinner size="large" /> </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div className="p-8 text-center">
            <Alert variant="destructive"> <AlertTriangle className="h-4 w-4" /> <AlertTitle>Error Loading Subscribers</AlertTitle> <AlertDescription>{error}</AlertDescription> </Alert>
            <Button onClick={() => fetchSubscribers()} variant="secondary" size="sm" className="mt-4">Try Again</Button>
          </div>
        )}

        {/* Table (only render if not loading and no fetch error) */}
        {!isLoading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-film-black-800">
              <thead className="bg-gray-50 dark:bg-film-black-800">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left w-12"><input type="checkbox" checked={filteredSubscribers.length > 0 && selectedSubscribers.length === filteredSubscribers.length} onChange={toggleSelectAll} className="checkbox-style" disabled={filteredSubscribers.length === 0} /></th>
                  <th scope="col" className="table-header cursor-pointer hover:text-film-red-600 dark:hover:text-film-red-500" onClick={() => handleSort('email')}>Email {sort.field === 'email' && (sort.direction === 'asc' ? <ArrowUp className="h-3 w-3 ml-1 inline" /> : <ArrowDown className="h-3 w-3 ml-1 inline" />)}</th>
                  <th scope="col" className="table-header cursor-pointer hover:text-film-red-600 dark:hover:text-film-red-500" onClick={() => handleSort('subscribedAt')}>Subscribed {sort.field === 'subscribedAt' && (sort.direction === 'asc' ? <ArrowUp className="h-3 w-3 ml-1 inline" /> : <ArrowDown className="h-3 w-3 ml-1 inline" />)}</th>
                  <th scope="col" className="table-header cursor-pointer hover:text-film-red-600 dark:hover:text-film-red-500" onClick={() => handleSort('subscribed')}>Status {sort.field === 'subscribed' && (sort.direction === 'asc' ? <ArrowUp className="h-3 w-3 ml-1 inline" /> : <ArrowDown className="h-3 w-3 ml-1 inline" />)}</th>
                  {/* <th scope="col" className="table-header cursor-pointer hover:text-film-red-600 dark:hover:text-film-red-500" onClick={() => handleSort('lastEmailSent')}>Last Email {sort.field === 'lastEmailSent' && (sort.direction === 'asc' ? <ArrowUp className="h-3 w-3 ml-1 inline" /> : <ArrowDown className="h-3 w-3 ml-1 inline" />)}</th> */}
                  <th scope="col" className="table-header cursor-pointer hover:text-film-red-600 dark:hover:text-film-red-500" onClick={() => handleSort('source')}>Source {sort.field === 'source' && (sort.direction === 'asc' ? <ArrowUp className="h-3 w-3 ml-1 inline" /> : <ArrowDown className="h-3 w-3 ml-1 inline" />)}</th>
                  <th scope="col" className="px-6 py-3 text-right table-header">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-film-black-900 divide-y divide-gray-200 dark:divide-film-black-800">
                {filteredSubscribers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-16 text-center"> {/* Increased padding */}
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-100 dark:bg-film-black-800 p-5 rounded-full mb-4"> {/* Larger icon bg */}
                          <Search className="h-8 w-8 text-gray-400 dark:text-gray-500" /> {/* Larger icon */}
                        </div>
                        <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">No subscribers found</p> {/* Larger text */}
                        <p className="text-gray-500 dark:text-gray-500 text-sm mt-1">Try adjusting your search or filters.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredSubscribers.map((subscriber) => (
                    <tr key={subscriber.id} className={`hover:bg-gray-50 dark:hover:bg-film-black-800/50 transition-colors ${selectedSubscribers.includes(subscriber.id) ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input type="checkbox" checked={selectedSubscribers.includes(subscriber.id)} onChange={() => toggleSelection(subscriber.id)} className="checkbox-style" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-film-black-700 flex items-center justify-center mr-3 text-gray-600 dark:text-gray-400 text-sm font-medium flex-shrink-0">{subscriber.name ? subscriber.name.charAt(0).toUpperCase() : subscriber.email.charAt(0).toUpperCase()}</div>
                          <div><div className="text-sm font-medium text-gray-900 dark:text-white truncate max-w-xs">{subscriber.email}</div>{subscriber.name && (<div className="text-xs text-gray-500 dark:text-gray-400">{subscriber.name}</div>)}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap table-cell-text">
                        {formatDate(subscriber.subscribedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{subscriber.subscribed ? (
                        <span className="status-badge bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active</span>
                      ) : (
                        <span className="status-badge bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400">
                          <XCircle className="h-3 w-3 mr-1" />
                          Inactive
                        </span>
                      )}</td>
                      {/* <td className="px-6 py-4 whitespace-nowrap table-cell-text">{formatDate(subscriber.lastEmailSent)}</td> */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="status-badge bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 capitalize">{subscriber.source || 'Unknown'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-1">
                          {/* View Profile (Conceptual) */}
                          <button className="action-button" onClick={() => alert(`View profile for ${subscriber.email}`)} title="View Profile"><ExternalLink className="h-4 w-4" /></button>
                          {/* Single Delete */}
                          <button className="action-button text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30" onClick={() => handleDeleteClick(subscriber)} title="Delete"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination (Placeholder - Needs API support for full functionality) */}
        {!isLoading && !error && subscribers.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-film-black-800 flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">Showing <span className="font-medium">{filteredSubscribers.length}</span> of <span className="font-medium">{subscribers.length}</span> subscribers</div>
            <div className="flex items-center space-x-2">
              {/* Replace with dynamic pagination controls when API supports it */}
              <button className="pagination-button" disabled={true}><ChevronLeft className="h-4 w-4" /></button>
              <button className="pagination-button active">1</button>
              <button className="pagination-button" disabled={true}><ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && itemToDelete && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setIsDeleteModalOpen(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white dark:bg-film-black-900 p-6 rounded-xl max-w-md w-full m-4 shadow-xl border border-gray-200 dark:border-film-black-700" onClick={(e) => e.stopPropagation()}>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Delete Subscriber</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">Are you sure you want to delete the subscriber "{itemToDelete.email}"? This action cannot be undone.</p>
              <div className="flex justify-end gap-4">
                <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                <Button variant="danger" onClick={confirmDelete}>Delete</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Add shared styles
const styles = `
  .label-style { @apply block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1; }
  .input-style { @apply w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-film-black-800 border border-gray-200 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white shadow-sm; }
  .checkbox-style { @apply h-4 w-4 text-film-red-600 focus:ring-film-red-500 border-gray-300 rounded dark:bg-film-black-700 dark:border-film-black-600; }
  .table-header { @apply px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider; }
  .table-cell-text { @apply px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300; }
  .status-badge { @apply px-2 py-1 text-xs rounded-full inline-flex items-center font-medium; }
  .action-button { @apply p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-film-red-600 dark:hover:text-film-red-500 transition-colors; }
  .pagination-button { @apply px-3 py-1 rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed; }
  .pagination-button:not(.active):not(:disabled) { @apply bg-gray-100 dark:bg-film-black-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-film-black-700; }
  .pagination-button.active { @apply bg-film-red-600 text-white; }
  .button-menu-item { @apply flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-film-black-700 rounded-md; }
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
`;
if (typeof window !== 'undefined') { const styleSheet = document.createElement("style"); styleSheet.innerText = styles; document.head.appendChild(styleSheet); }

export default SubscribersListPage;

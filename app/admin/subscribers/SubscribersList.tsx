"use client";
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Search, Filter, Mail, ExternalLink, Trash2, MoreHorizontal,
  RefreshCw, Download, CheckCircle, XCircle, ArrowDown, ArrowUp, AlertTriangle, ChevronDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/UI/Button';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import { Subscriber } from '@/types/mongodbSchema';
import { useSubscribers } from '@/hooks/useSubscribers'; // Import the new hook
import { Alert, AlertDescription, AlertTitle } from '@/components/UI/Alert'; // Import Alert

const SubscribersList = () => {
  // --- Use the hook to manage subscribers data ---
  const { subscribers, isLoading, error, fetchSubscribers, setSubscribers } = useSubscribers();
  // ----------------------------------------------

  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ subscribed: 'all', source: 'all' });
  const [sort, setSort] = useState({ field: 'subscribedAt', direction: 'desc' });
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isBulkActionsOpen, setIsBulkActionsOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null); // State for delete errors

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
  const uniqueSources = useMemo(() => ['all', ...new Set(subscribers.map(sub => sub.source).filter(Boolean))], [subscribers]); // Filter out null/undefined sources

  // Format date
  const formatDate = (dateString?: string) => dateString ? new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

  // Bulk actions - including Delete
  const handleBulkAction = async (action: 'delete' | 'export' | 'email') => {
    if (selectedSubscribers.length === 0) return;
    setDeleteError(null); // Clear previous delete errors

    if (action === 'delete') {
      if (!confirm(`Are you sure you want to delete ${selectedSubscribers.length} subscriber(s)? This cannot be undone.`)) {
        return;
      }
      console.log('Attempting to delete subscribers:', selectedSubscribers);
      try {
        // --- Call API to delete each selected subscriber ---
        // NOTE: This can be slow for many subscribers. A bulk delete API endpoint would be better.
        const deletePromises = selectedSubscribers.map(id => {
          // Assuming your API for single delete uses email, find the email first
          const subToDelete = subscribers.find(s => s.id === id);
          if (!subToDelete) return Promise.resolve({ ok: false, error: `Subscriber ${id} not found` }); // Skip if not found locally

          return fetch(`/api/subscribers/${encodeURIComponent(subToDelete.email)}`, { method: 'DELETE' });
        });

        const results = await Promise.all(deletePromises);
        const failedDeletes = results.filter(res => !res.ok);

        if (failedDeletes.length > 0) {
          console.error(`${failedDeletes.length} subscribers failed to delete.`);
          // Try to get a specific error message if possible
          let errorMsg = `${failedDeletes.length} subscriber(s) could not be deleted.`;
          try {
            const firstError = await failedDeletes[0].json();
            errorMsg += ` First error: ${firstError.error || 'Unknown reason'}`;
          } catch { }
          setDeleteError(errorMsg);
          // Only remove successfully deleted items locally
          const successfulIds = selectedSubscribers.filter((id, index) => results[index].ok);
          setSubscribers(prev => prev.filter(sub => !successfulIds.includes(sub.id)));
        } else {
          // Remove all selected from local state on success
          setSubscribers(prev => prev.filter(sub => !selectedSubscribers.includes(sub.id)));
          console.log(`Successfully deleted ${selectedSubscribers.length} subscribers.`);
        }
        setSelectedSubscribers([]); // Clear selection
        setIsBulkActionsOpen(false);
        // No need to call fetchSubscribers() here if local state is updated accurately

      } catch (err: any) {
        console.error('Error during bulk delete:', err);
        setDeleteError(err.message || 'An unexpected error occurred during deletion.');
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

  // --- Render Logic ---
  return (
    <div className="bg-white dark:bg-film-black-900 rounded-xl shadow-sm border border-gray-100 dark:border-film-black-800">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-film-black-800">
        {/* ... (header content remains the same) ... */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center">
            <Users className="h-6 w-6 text-film-red-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Subscribers <span className="text-sm text-gray-500 dark:text-gray-400">({filteredSubscribers.length})</span></h2>
          </div>
          <div className="flex flex-wrap items-center gap-3">
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
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-film-black-800 rounded-md shadow-lg border border-gray-100 dark:border-film-black-700 z-10 p-1"
                    >
                      <button onClick={() => handleBulkAction('email')} className="button-menu-item text-blue-600 dark:text-blue-400"><Mail className="h-4 w-4" /> Email Selected</button>
                      <button onClick={() => handleBulkAction('export')} className="button-menu-item text-green-600 dark:text-green-400"><Download className="h-4 w-4" /> Export Selected</button>
                      <button onClick={() => handleBulkAction('delete')} className="button-menu-item text-red-600 dark:text-red-400"><Trash2 className="h-4 w-4" /> Delete Selected</button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
            <Button variant="secondary" size="sm" onClick={() => setIsFiltersOpen(!isFiltersOpen)} icon={<Filter className="h-4 w-4" />}>Filters</Button>
          </div>
        </div>
        {/* Search and Filters Panel */}
        <div className="mt-4 flex flex-col gap-4">
          <div className="relative">
            <input type="text" placeholder="Search by email or name..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="input-style w-full pl-10" />
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
          {isFiltersOpen && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
              <div><label className="label-style">Status</label><select value={filters.subscribed} onChange={e => setFilters(prev => ({ ...prev, subscribed: e.target.value }))} className="input-style w-full"><option value="all">All Subscribers</option><option value="active">Active Only</option><option value="inactive">Unsubscribed Only</option></select></div>
              <div><label className="label-style">Source</label><select value={filters.source} onChange={e => setFilters(prev => ({ ...prev, source: e.target.value }))} className="input-style w-full">{uniqueSources.map(source => (<option key={source} value={source}>{source === 'all' ? 'All Sources' : source.charAt(0).toUpperCase() + source.slice(1)}</option>))}</select></div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center min-h-[300px]">
          <LoadingSpinner size="large" />
        </div>
      )}

      {/* Error State */}
      {!isLoading && error && (
        <div className="p-6 text-center">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Loading Subscribers</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={() => fetchSubscribers()} variant="secondary" size="sm" className="mt-4">Try Again</Button>
        </div>
      )}

      {/* Delete Error State */}
      {deleteError && (
        <div className="p-6">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Deletion Error</AlertTitle>
            <AlertDescription>{deleteError}</AlertDescription>
          </Alert>
        </div>
      )}


      {/* Table (only render if not loading and no fetch error) */}
      {!isLoading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-film-black-800">
            <thead className="bg-gray-50 dark:bg-film-black-800">
              <tr>
                <th scope="col" className="px-6 py-3 text-left w-12"><input type="checkbox" checked={filteredSubscribers.length > 0 && selectedSubscribers.length === filteredSubscribers.length} onChange={toggleSelectAll} className="checkbox-style" disabled={filteredSubscribers.length === 0} /></th>
                <th scope="col" className="table-header cursor-pointer hover:text-film-red-600" onClick={() => handleSort('email')}>Email {sort.field === 'email' && (sort.direction === 'asc' ? <ArrowUp className="h-3 w-3 ml-1 inline" /> : <ArrowDown className="h-3 w-3 ml-1 inline" />)}</th>
                <th scope="col" className="table-header cursor-pointer hover:text-film-red-600" onClick={() => handleSort('subscribedAt')}>Subscribed {sort.field === 'subscribedAt' && (sort.direction === 'asc' ? <ArrowUp className="h-3 w-3 ml-1 inline" /> : <ArrowDown className="h-3 w-3 ml-1 inline" />)}</th>
                <th scope="col" className="table-header cursor-pointer hover:text-film-red-600" onClick={() => handleSort('subscribed')}>Status {sort.field === 'subscribed' && (sort.direction === 'asc' ? <ArrowUp className="h-3 w-3 ml-1 inline" /> : <ArrowDown className="h-3 w-3 ml-1 inline" />)}</th>
                <th scope="col" className="table-header cursor-pointer hover:text-film-red-600" onClick={() => handleSort('lastEmailSent')}>Last Email {sort.field === 'lastEmailSent' && (sort.direction === 'asc' ? <ArrowUp className="h-3 w-3 ml-1 inline" /> : <ArrowDown className="h-3 w-3 ml-1 inline" />)}</th>
                <th scope="col" className="table-header cursor-pointer hover:text-film-red-600" onClick={() => handleSort('source')}>Source {sort.field === 'source' && (sort.direction === 'asc' ? <ArrowUp className="h-3 w-3 ml-1 inline" /> : <ArrowDown className="h-3 w-3 ml-1 inline" />)}</th>
                <th scope="col" className="px-6 py-3 text-right table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-film-black-900 divide-y divide-gray-200 dark:divide-film-black-800">
              {filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center">
                      <div className="bg-gray-100 dark:bg-film-black-800 p-4 rounded-full mb-4"><Search className="h-6 w-6 text-gray-500 dark:text-gray-400" /></div>
                      <p className="text-gray-500 dark:text-gray-400 font-medium">No subscribers found</p>
                      <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map((subscriber) => (
                  <tr key={subscriber.id} className={`hover:bg-gray-50 dark:hover:bg-film-black-800/50 transition-colors ${selectedSubscribers.includes(subscriber.id) ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}>
                    <td className="px-6 py-4 whitespace-nowrap"><input type="checkbox" checked={selectedSubscribers.includes(subscriber.id)} onChange={() => toggleSelection(subscriber.id)} className="checkbox-style" /></td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-film-black-800 flex items-center justify-center mr-3 text-gray-600 dark:text-gray-400 text-sm font-medium">{subscriber.name ? subscriber.name.charAt(0).toUpperCase() : subscriber.email.charAt(0).toUpperCase()}</div>
                        <div><div className="text-sm font-medium text-gray-900 dark:text-white">{subscriber.email}</div>{subscriber.name && (<div className="text-xs text-gray-500 dark:text-gray-400">{subscriber.name}</div>)}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap table-cell-text">{formatDate(subscriber.subscribedAt)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{subscriber.subscribed ? (<span className="status-badge bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"><CheckCircle className="h-3 w-3 mr-1" />Active</span>) : (<span className="status-badge bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"><XCircle className="h-3 w-3 mr-1" />Inactive</span>)}</td>
                    <td className="px-6 py-4 whitespace-nowrap table-cell-text">{formatDate(subscriber.lastEmailSent)}</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="status-badge bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 capitalize">{subscriber.source}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        {/* Keep actions, but maybe disable delete for single items if bulk is preferred */}
                        <button className="action-button" onClick={() => alert(`View profile for ${subscriber.email}`)} title="View Profile"><ExternalLink className="h-4 w-4" /></button>
                        <button className="action-button text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30" onClick={() => handleBulkAction('delete')} title="Delete"><Trash2 className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination (only show if not loading/error and there are subscribers) */}
      {!isLoading && !error && subscribers.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-film-black-800 flex items-center justify-between">
          {/* ... (pagination logic remains the same) ... */}
          <div className="text-sm text-gray-700 dark:text-gray-300">Showing <span className="font-medium">{filteredSubscribers.length}</span> of <span className="font-medium">{subscribers.length}</span> subscribers</div>
          <div className="flex items-center space-x-2">
            <button className="pagination-button" disabled={true}><ChevronLeft className="h-4 w-4" /></button>
            <button className="pagination-button active">1</button>
            {/* Add more page buttons dynamically */}
            <button className="pagination-button" disabled={true}><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      )}
    </div>
  );
};

// Add specific styles for this component
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
`;
if (typeof window !== 'undefined') { const styleSheet = document.createElement("style"); styleSheet.innerText = styles; document.head.appendChild(styleSheet); }

export default SubscribersList;

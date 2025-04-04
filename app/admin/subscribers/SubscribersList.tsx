"use client";
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Search, Filter, Mail, ExternalLink, Trash2, MoreHorizontal,
  RefreshCw, Download, CheckCircle, XCircle, ArrowDown, ArrowUp, AlertTriangle, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/UI/Button';
import LoadingSpinner from '@/components/UI/LoadingSpinner';

// Subscriber Type (ensure it matches your API/data structure)
type Subscriber = {
  id: string;
  email: string;
  name?: string; // Made optional
  subscribed: boolean;
  subscribedAt: string;
  lastEmailSent?: string;
  interests: string[];
  source: string;
};

const SubscribersList = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [filteredSubscribers, setFilteredSubscribers] = useState<Subscriber[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ subscribed: 'all', source: 'all' });
  const [sort, setSort] = useState({ field: 'subscribedAt', direction: 'desc' });
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isBulkActionsOpen, setIsBulkActionsOpen] = useState(false);

  // Fetch subscribers data
  const fetchSubscribers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/subscribers');
      if (!res.ok) throw new Error('Failed to fetch subscribers');
      const data = await res.json();
      setSubscribers(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      // Generate mock data for development/preview if fetch fails
      if (process.env.NODE_ENV !== 'production') {
        const mockData = Array.from({ length: 25 }, (_, i) => ({
          id: `sub-${i + 1}`, email: `subscriber${i + 1}@example.com`, name: `Subscriber ${i + 1}`,
          subscribed: Math.random() > 0.2, subscribedAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
          lastEmailSent: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 1000000000).toISOString() : undefined,
          interests: ['Documentary', 'African Cinema', 'Behind The Scenes'].filter(() => Math.random() > 0.5),
          source: ['website', 'event', 'referral', 'social'][Math.floor(Math.random() * 4)]
        }));
        setSubscribers(mockData);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  // Apply filters, search, and sort
  useEffect(() => {
    let result = [...subscribers];
    if (filters.subscribed !== 'all') result = result.filter(sub => filters.subscribed === 'active' ? sub.subscribed : !sub.subscribed);
    if (filters.source !== 'all') result = result.filter(sub => sub.source === filters.source);
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(sub => sub.email.toLowerCase().includes(query) || (sub.name && sub.name.toLowerCase().includes(query)));
    }
    result.sort((a, b) => {
      const fieldA = a[sort.field as keyof Subscriber]; const fieldB = b[sort.field as keyof Subscriber];
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
    setFilteredSubscribers(result);
  }, [subscribers, filters, searchQuery, sort]);

  // Selection handlers
  const toggleSelection = (id: string) => setSelectedSubscribers(prev => prev.includes(id) ? prev.filter(subId => subId !== id) : [...prev, id]);
  const toggleSelectAll = () => setSelectedSubscribers(selectedSubscribers.length === filteredSubscribers.length ? [] : filteredSubscribers.map(sub => sub.id));

  // Sort handler
  const handleSort = (field: string) => setSort(prev => ({ field, direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc' }));

  // Unique sources for filter dropdown
  const uniqueSources = useMemo(() => ['all', ...new Set(subscribers.map(sub => sub.source))], [subscribers]);

  // Format date
  const formatDate = (dateString?: string) => dateString ? new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

  // Bulk actions
  const handleBulkAction = async (action: 'delete' | 'export' | 'email') => {
    if (selectedSubscribers.length === 0) return;
    if (action === 'delete' && confirm(`Are you sure you want to delete ${selectedSubscribers.length} subscribers?`)) {
      console.log('Deleting subscribers:', selectedSubscribers);
      // Add API call logic here
      // Simulate deletion for UI
      setSubscribers(prev => prev.filter(sub => !selectedSubscribers.includes(sub.id)));
      setSelectedSubscribers([]);
      setIsBulkActionsOpen(false);
    } else if (action === 'export') {
      console.log('Exporting subscribers:', selectedSubscribers); alert(`Exported ${selectedSubscribers.length} subscribers`);
      setIsBulkActionsOpen(false);
    } else if (action === 'email') {
      console.log('Emailing subscribers:', selectedSubscribers); alert(`Prepare email to ${selectedSubscribers.length} subscribers`);
      setIsBulkActionsOpen(false);
      // Potentially navigate to campaign editor with pre-selected segment
    }
  };

  // --- Render Logic ---
  if (isLoading) return <div className="flex justify-center items-center min-h-[400px]"><LoadingSpinner size="large" /></div>;
  if (error && subscribers.length === 0) { /* Error state handling */ }

  return (
    <div className="bg-white dark:bg-film-black-900 rounded-xl shadow-sm border border-gray-100 dark:border-film-black-800">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-film-black-800">
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

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-film-black-800">
          <thead className="bg-gray-50 dark:bg-film-black-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left w-12"><input type="checkbox" checked={selectedSubscribers.length === filteredSubscribers.length && filteredSubscribers.length > 0} onChange={toggleSelectAll} className="checkbox-style" /></th>
              <th scope="col" className="table-header" onClick={() => handleSort('email')}>Email {sort.field === 'email' && (sort.direction === 'asc' ? <ArrowUp className="h-3 w-3 ml-1 inline" /> : <ArrowDown className="h-3 w-3 ml-1 inline" />)}</th>
              <th scope="col" className="table-header" onClick={() => handleSort('subscribedAt')}>Subscribed {sort.field === 'subscribedAt' && (sort.direction === 'asc' ? <ArrowUp className="h-3 w-3 ml-1 inline" /> : <ArrowDown className="h-3 w-3 ml-1 inline" />)}</th>
              <th scope="col" className="table-header" onClick={() => handleSort('subscribed')}>Status {sort.field === 'subscribed' && (sort.direction === 'asc' ? <ArrowUp className="h-3 w-3 ml-1 inline" /> : <ArrowDown className="h-3 w-3 ml-1 inline" />)}</th>
              <th scope="col" className="table-header" onClick={() => handleSort('lastEmailSent')}>Last Email {sort.field === 'lastEmailSent' && (sort.direction === 'asc' ? <ArrowUp className="h-3 w-3 ml-1 inline" /> : <ArrowDown className="h-3 w-3 ml-1 inline" />)}</th>
              <th scope="col" className="table-header" onClick={() => handleSort('source')}>Source {sort.field === 'source' && (sort.direction === 'asc' ? <ArrowUp className="h-3 w-3 ml-1 inline" /> : <ArrowDown className="h-3 w-3 ml-1 inline" />)}</th>
              <th scope="col" className="px-6 py-3 text-right table-header">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-film-black-900 divide-y divide-gray-200 dark:divide-film-black-800">
            {filteredSubscribers.length === 0 ? ( /* Empty state row */): (
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
                  <button className="action-button" onClick={() => handleBulkAction('email')} title="Send Email"><Mail className="h-4 w-4" /></button>
                  <button className="action-button" title="View Profile"><ExternalLink className="h-4 w-4" /></button>
                  <button className="action-button text-red-600 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30" onClick={() => handleBulkAction('delete')} title="Delete"><Trash2 className="h-4 w-4" /></button>
                </div>
              </td>
            </tr>
            ))
            )}
          </tbody>
        </table>
        {filteredSubscribers.length === 0 && (
          <tr>
            <td colSpan={7} className="px-6 py-12 text-center">
              <div className="flex flex-col items-center">
                <div className="bg-gray-100 dark:bg-film-black-800 p-4 rounded-full mb-4"><Search className="h-6 w-6 text-gray-500 dark:text-gray-400" /></div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">No subscribers found</p>
                <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Try adjusting your search or filters</p>
              </div>
            </td>
          </tr>
        )}
      </div>

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-film-black-800 flex items-center justify-between">
        <div className="text-sm text-gray-700 dark:text-gray-300">Showing <span className="font-medium">{filteredSubscribers.length}</span> of <span className="font-medium">{subscribers.length}</span> subscribers</div>
        <div className="flex items-center space-x-2">
          <button className="pagination-button"><ChevronLeft className="h-4 w-4" /></button>
          <button className="pagination-button active">1</button>
          <button className="pagination-button">2</button>
          <button className="pagination-button"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>
    </div>
  );
};

// Add specific styles for this component
const styles = `
  .label-style { @apply block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1; }
  .input-style { @apply w-full px-4 py-2 rounded-lg bg-gray-50 dark:bg-film-black-800 border border-gray-200 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white shadow-sm; }
  .checkbox-style { @apply h-4 w-4 text-film-red-600 focus:ring-film-red-500 border-gray-300 rounded; }
  .table-header { @apply px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-film-red-600 dark:hover:text-film-red-500; }
  .table-cell-text { @apply px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300; }
  .status-badge { @apply px-2 py-1 text-xs rounded-full inline-flex items-center font-medium; }
  .action-button { @apply p-1.5 rounded-lg text-gray-500 dark:text-gray-400 hover:text-film-red-600 dark:hover:text-film-red-500 transition-colors; }
  .pagination-button { @apply px-3 py-1 rounded-lg text-sm transition-colors; }
  .pagination-button:not(.active) { @apply bg-gray-100 dark:bg-film-black-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-film-black-700; }
  .pagination-button.active { @apply bg-film-red-600 text-white; }
  .button-menu-item { @apply flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-film-black-700 rounded-md; }
`;
if (typeof window !== 'undefined') { const styleSheet = document.createElement("style"); styleSheet.innerText = styles; document.head.appendChild(styleSheet); }

export default SubscribersList;

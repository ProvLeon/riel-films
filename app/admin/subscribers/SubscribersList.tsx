"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Search, Filter, Mail, ExternalLink, Trash2, MoreHorizontal,
  RefreshCw, Download, CheckCircle, XCircle, ArrowDown, ArrowUp
} from 'lucide-react';
import { Button } from '@/components/UI/Button';
import LoadingSpinner from '@/components/UI/LoadingSpinner';

type Subscriber = {
  id: string;
  email: string;
  name: string;
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
  const [filters, setFilters] = useState({
    subscribed: 'all', // 'all', 'active', 'inactive'
    source: 'all'
  });
  const [sort, setSort] = useState({
    field: 'subscribedAt',
    direction: 'desc'
  });
  const [selectedSubscribers, setSelectedSubscribers] = useState<string[]>([]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Fetch subscribers data
  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/subscribers');

        if (!res.ok) {
          throw new Error('Failed to fetch subscribers');
        }

        const data = await res.json();
        setSubscribers(data);
        setFilteredSubscribers(data);
      } catch (err: any) {
        console.error('Error fetching subscribers:', err);
        setError(err.message || 'An error occurred while fetching subscribers');

        // Generate mock data for development/preview
        if (process.env.NODE_ENV !== 'production') {
          const mockData = Array.from({ length: 25 }, (_, i) => ({
            id: `sub-${i}`,
            email: `subscriber${i}@example.com`,
            name: `Subscriber ${i + 1}`,
            subscribed: Math.random() > 0.2,
            subscribedAt: new Date(Date.now() - Math.random() * 10000000000).toISOString(),
            lastEmailSent: Math.random() > 0.5 ? new Date(Date.now() - Math.random() * 1000000000).toISOString() : undefined,
            interests: ['Documentary', 'African Cinema', 'Behind The Scenes'].filter(() => Math.random() > 0.5),
            source: ['website', 'event', 'referral', 'social media'][Math.floor(Math.random() * 4)]
          }));
          setSubscribers(mockData);
          setFilteredSubscribers(mockData);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscribers();
  }, []);

  // Apply filters and search
  useEffect(() => {
    let result = [...subscribers];

    // Apply subscription status filter
    if (filters.subscribed !== 'all') {
      result = result.filter(sub =>
        filters.subscribed === 'active' ? sub.subscribed : !sub.subscribed
      );
    }

    // Apply source filter
    if (filters.source !== 'all') {
      result = result.filter(sub => sub.source === filters.source);
    }

    // Apply search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(sub =>
        sub.email.toLowerCase().includes(query) ||
        (sub.name && sub.name.toLowerCase().includes(query))
      );
    }

    // Apply sorting
    result.sort((a, b) => {
      const fieldA = a[sort.field as keyof Subscriber];
      const fieldB = b[sort.field as keyof Subscriber];

      // Handle string comparisons
      if (typeof fieldA === 'string' && typeof fieldB === 'string') {
        return sort.direction === 'asc'
          ? fieldA.localeCompare(fieldB)
          : fieldB.localeCompare(fieldA);
      }

      // Handle boolean comparisons
      if (typeof fieldA === 'boolean' && typeof fieldB === 'boolean') {
        return sort.direction === 'asc'
          ? Number(fieldA) - Number(fieldB)
          : Number(fieldB) - Number(fieldA);
      }

      // Default sorting (fallback to subscribedAt)
      const dateA = new Date(a.subscribedAt).getTime();
      const dateB = new Date(b.subscribedAt).getTime();
      return sort.direction === 'asc' ? dateA - dateB : dateB - dateA;
    });

    setFilteredSubscribers(result);
  }, [subscribers, filters, searchQuery, sort]);

  // Toggle subscriber selection
  const toggleSelection = (id: string) => {
    setSelectedSubscribers(prev =>
      prev.includes(id)
        ? prev.filter(subId => subId !== id)
        : [...prev, id]
    );
  };

  // Toggle all subscribers selection
  const toggleSelectAll = () => {
    setSelectedSubscribers(
      selectedSubscribers.length === filteredSubscribers.length
        ? []
        : filteredSubscribers.map(sub => sub.id)
    );
  };

  // Handle sorting
  const handleSort = (field: string) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Get all unique sources for filter dropdown
  const uniqueSources = ['all', ...new Set(subscribers.map(sub => sub.source))];

  // Format date for display
  const formatDate = (dateString?: string) => {
    if (!dateString) return '—';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Bulk actions
  const handleBulkAction = async (action: 'delete' | 'export' | 'email') => {
    if (selectedSubscribers.length === 0) return;

    if (action === 'delete' && confirm('Are you sure you want to delete these subscribers?')) {
      // Delete logic would go here with API calls
      console.log('Delete subscribers:', selectedSubscribers);

      // For demo purposes, we'll just remove them from the UI
      setSubscribers(prev =>
        prev.filter(sub => !selectedSubscribers.includes(sub.id))
      );
      setSelectedSubscribers([]);
    } else if (action === 'export') {
      // Export logic would go here
      console.log('Export subscribers:', selectedSubscribers);

      // For demo purposes, we'll just show an alert
      alert(`Exported ${selectedSubscribers.length} subscribers`);
    } else if (action === 'email') {
      // Navigate to email campaign with these subscribers pre-selected
      console.log('Email subscribers:', selectedSubscribers);

      // For demo purposes, we'll just show an alert
      alert(`Prepare email to ${selectedSubscribers.length} subscribers`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (error && subscribers.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="bg-red-100 dark:bg-red-900/20 p-4 rounded-full mb-4">
          <XCircle className="h-8 w-8 text-red-600 dark:text-red-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Failed to load subscribers</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
        <Button variant="secondary" onClick={() => window.location.reload()}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-film-black-900 rounded-xl shadow-sm border border-gray-100 dark:border-film-black-800">
      {/* Header section */}
      <div className="p-6 border-b border-gray-200 dark:border-film-black-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center">
            <Users className="h-6 w-6 text-film-red-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Subscribers
              {filteredSubscribers.length > 0 && (
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  ({filteredSubscribers.length} {filteredSubscribers.length === 1 ? 'subscriber' : 'subscribers'})
                </span>
              )}
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {selectedSubscribers.length > 0 && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleBulkAction('delete')}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleBulkAction('export')}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleBulkAction('email')}
                >
                  <Mail className="h-4 w-4 mr-1" />
                  Email
                </Button>
              </div>
            )}
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            >
              <Filter className="h-4 w-4 mr-1" />
              Filters
            </Button>
          </div>
        </div>

        {/* Search and filters */}
        <div className="mt-4 flex flex-col gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by email or name..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 dark:bg-film-black-800 border border-gray-200 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 dark:text-white"
            />
            <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>

          {isFiltersOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Status
                </label>
                <select
                  value={filters.subscribed}
                  onChange={e => setFilters(prev => ({ ...prev, subscribed: e.target.value }))}
                  className="w-full p-2 rounded-lg bg-gray-50 dark:bg-film-black-800 border border-gray-200 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 dark:text-white"
                >
                  <option value="all">All Subscribers</option>
                  <option value="active">Active Only</option>
                  <option value="inactive">Unsubscribed Only</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Source
                </label>
                <select
                  value={filters.source}
                  onChange={e => setFilters(prev => ({ ...prev, source: e.target.value }))}
                  className="w-full p-2 rounded-lg bg-gray-50 dark:bg-film-black-800 border border-gray-200 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 dark:text-white"
                >
                  {uniqueSources.map(source => (
                    <option key={source} value={source}>
                      {source === 'all' ? 'All Sources' : source.charAt(0).toUpperCase() + source.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Table section */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-film-black-800">
          <thead className="bg-gray-50 dark:bg-film-black-800">
            <tr>
              <th scope="col" className="px-6 py-3 text-left">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedSubscribers.length === filteredSubscribers.length && filteredSubscribers.length > 0}
                    onChange={toggleSelectAll}
                    className="h-4 w-4 text-film-red-600 focus:ring-film-red-500 border-gray-300 rounded"
                  />
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-film-red-600 dark:hover:text-film-red-500"
                onClick={() => handleSort('email')}
              >
                <div className="flex items-center">
                  <span>Email</span>
                  {sort.field === 'email' && (
                    sort.direction === 'asc'
                      ? <ArrowUp className="h-3 w-3 ml-1" />
                      : <ArrowDown className="h-3 w-3 ml-1" />
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-film-red-600 dark:hover:text-film-red-500"
                onClick={() => handleSort('subscribedAt')}
              >
                <div className="flex items-center">
                  <span>Subscribed Date</span>
                  {sort.field === 'subscribedAt' && (
                    sort.direction === 'asc'
                      ? <ArrowUp className="h-3 w-3 ml-1" />
                      : <ArrowDown className="h-3 w-3 ml-1" />
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-film-red-600 dark:hover:text-film-red-500"
                onClick={() => handleSort('subscribed')}
              >
                <div className="flex items-center">
                  <span>Status</span>
                  {sort.field === 'subscribed' && (
                    sort.direction === 'asc'
                      ? <ArrowUp className="h-3 w-3 ml-1" />
                      : <ArrowDown className="h-3 w-3 ml-1" />
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-film-red-600 dark:hover:text-film-red-500"
                onClick={() => handleSort('lastEmailSent')}
              >
                <div className="flex items-center">
                  <span>Last Email</span>
                  {sort.field === 'lastEmailSent' && (
                    sort.direction === 'asc'
                      ? <ArrowUp className="h-3 w-3 ml-1" />
                      : <ArrowDown className="h-3 w-3 ml-1" />
                  )}
                </div>
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hover:text-film-red-600 dark:hover:text-film-red-500"
                onClick={() => handleSort('source')}
              >
                <div className="flex items-center">
                  <span>Source</span>
                  {sort.field === 'source' && (
                    sort.direction === 'asc'
                      ? <ArrowUp className="h-3 w-3 ml-1" />
                      : <ArrowDown className="h-3 w-3 ml-1" />
                  )}
                </div>
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-film-black-900 divide-y divide-gray-200 dark:divide-film-black-800">
            {filteredSubscribers.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <div className="bg-gray-100 dark:bg-film-black-800 p-4 rounded-full mb-4">
                      <Search className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">No subscribers found</p>
                    <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">Try adjusting your search or filters</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredSubscribers.map((subscriber) => (
                <tr
                  key={subscriber.id}
                  className="hover:bg-gray-50 dark:hover:bg-film-black-800/50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedSubscribers.includes(subscriber.id)}
                      onChange={() => toggleSelection(subscriber.id)}
                      className="h-4 w-4 text-film-red-600 focus:ring-film-red-500 border-gray-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-film-black-800 flex items-center justify-center mr-3 text-gray-600 dark:text-gray-400">
                        {subscriber.name ? subscriber.name.charAt(0).toUpperCase() : subscriber.email.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {subscriber.email}
                        </div>
                        {subscriber.name && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {subscriber.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {formatDate(subscriber.subscribedAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {subscriber.subscribed ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400 flex items-center w-fit">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400 flex items-center w-fit">
                        <XCircle className="h-3 w-3 mr-1" />
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {formatDate(subscriber.lastEmailSent)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                      {subscriber.source}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        className="text-gray-600 dark:text-gray-400 hover:text-film-red-600 dark:hover:text-film-red-500"
                        onClick={() => handleBulkAction('email')}
                        title="Send Email"
                      >
                        <Mail className="h-4 w-4" />
                      </button>
                      <button
                        className="text-gray-600 dark:text-gray-400 hover:text-film-red-600 dark:hover:text-film-red-500"
                        title="View Subscriber Profile"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                      <button
                        className="text-gray-600 dark:text-gray-400 hover:text-red-600"
                        onClick={() => handleBulkAction('delete')}
                        title="Delete Subscriber"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination would go here */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-film-black-800 flex items-center justify-between">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Showing <span className="font-medium">{filteredSubscribers.length}</span> of <span className="font-medium">{subscribers.length}</span> subscribers
        </div>

        {/* Placeholder for pagination component */}
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-film-black-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-film-black-700 transition-colors">
            Previous
          </button>
          <button className="px-3 py-1 rounded-lg bg-film-red-600 text-white hover:bg-film-red-700 transition-colors">
            1
          </button>
          <button className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-film-black-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-film-black-700 transition-colors">
            2
          </button>
          <button className="px-3 py-1 rounded-lg bg-gray-100 dark:bg-film-black-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-film-black-700 transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubscribersList;

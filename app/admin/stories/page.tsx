"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/UI/Button";
import { Edit, Trash2, PlusCircle, Search, Filter, Calendar, BookOpen, ExternalLink, Star, Grid, List, Eye, RefreshCw } from "lucide-react"; // Added RefreshCw
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import { useRouter } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { Story } from "@/types/mongodbSchema";

const AdminStoriesPage = () => {
  const { stories, isLoadingStories, fetchStories } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isShowingFeatured, setIsShowingFeatured] = useState<boolean | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [storyToDelete, setStoryToDelete] = useState<Story | null>(null); // Store the whole story object
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false); // State for filter panel
  const router = useRouter();

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  // Extract categories from stories
  const categories = useMemo(() => {
    if (!stories || stories.length === 0) return ["All Categories"];
    const uniqueCategories = ["All Categories", ...new Set(stories.map((story) => story.category))].sort();
    return uniqueCategories;
  }, [stories]);

  // Filter stories based on search, category, and featured status
  const filteredStories = useMemo(() => {
    return stories?.filter((story) => {
      const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        story.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "" || selectedCategory === "All Categories" || story.category === selectedCategory;
      const matchesFeatured = isShowingFeatured === null || story.featured === isShowingFeatured;
      return matchesSearch && matchesCategory && matchesFeatured;
    }) || [];
  }, [stories, searchQuery, selectedCategory, isShowingFeatured]);

  // Sort stories by date (newest first)
  const sortedStories = useMemo(() => [...filteredStories].sort((a, b) => {
    const dateA = new Date(a.date || 0);
    const dateB = new Date(b.date || 0);
    return dateB.getTime() - dateA.getTime();
  }), [filteredStories]);

  // Handle delete confirmation
  const handleDeleteClick = (story: Story) => { // Pass the whole story object
    setStoryToDelete(story);
    setIsDeleteModalOpen(true);
  };

  // Handle actual delete
  const handleDelete = async () => {
    if (!storyToDelete) return;
    try {
      const response = await fetch(`/api/stories/id/${storyToDelete.id}`, { // Use ID-based API
        method: "DELETE",
      });
      if (response.ok) {
        fetchStories(); // Refresh stories data
        setIsDeleteModalOpen(false);
        setStoryToDelete(null);
      } else {
        throw new Error("Failed to delete story");
      }
    } catch (error) {
      console.error("Error deleting story:", error);
      // Optionally show error message
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setIsShowingFeatured(null);
    setIsFilterOpen(false);
  };

  const anyFiltersActive = searchQuery || selectedCategory || isShowingFeatured !== null;

  return (
    <div className="bg-gray-50 dark:bg-film-black-950 min-h-screen">
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <BookOpen className="h-6 w-6 text-film-red-600 mr-2" />
              Stories & Insights
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Manage articles, news, and behind-the-scenes content.</p>
          </div>
          <Link href="/admin/stories/create">
            <Button variant="primary" icon={<PlusCircle className="h-5 w-5" />}>
              Add New Story
            </Button>
          </Link>
        </div>

        {/* Filters and Search Section */}
        <div className="bg-white dark:bg-film-black-900 rounded-xl shadow-sm p-4 mb-6 border border-gray-100 dark:border-film-black-800">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-grow w-full md:w-auto">
              <input
                type="text"
                placeholder="Search stories by title, excerpt, author..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-lg bg-gray-100 dark:bg-film-black-800 border border-transparent focus:border-gray-300 dark:focus:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 dark:text-white"
              />
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="secondary" size="sm" onClick={() => setIsFilterOpen(!isFilterOpen)} icon={<Filter className="h-4 w-4" />}>Filters {anyFiltersActive && <span className="ml-1.5 w-2 h-2 rounded-full bg-film-red-600"></span>}</Button>
              {anyFiltersActive && <Button variant="ghost" size="sm" onClick={resetFilters} icon={<RefreshCw className="h-4 w-4" />} className="text-gray-600 dark:text-gray-400">Reset</Button>}
              <div className="flex space-x-1 bg-gray-100 dark:bg-film-black-800 p-1 rounded-lg">
                <Button variant={viewMode === 'grid' ? 'primary' : 'ghost'} size="icon" onClick={() => setViewMode('grid')} className={`w-8 h-8 ${viewMode === 'grid' ? '' : 'text-gray-600 dark:text-gray-400'}`} aria-label="Grid view"><Grid className="h-4 w-4" /></Button>
                <Button variant={viewMode === 'list' ? 'primary' : 'ghost'} size="icon" onClick={() => setViewMode('list')} className={`w-8 h-8 ${viewMode === 'list' ? '' : 'text-gray-600 dark:text-gray-400'}`} aria-label="List view"><List className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>
          {/* Expanded Filters Panel */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="mt-4 pt-4 border-t border-gray-200 dark:border-film-black-800 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-film-black-800 border border-transparent focus:border-gray-300 dark:focus:border-film-black-700 focus:outline-none text-gray-700 dark:text-gray-300">
                    {categories.map((category) => (<option key={category} value={category === "All Categories" ? "" : category}>{category}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  <select value={isShowingFeatured === null ? "" : isShowingFeatured ? "featured" : "regular"} onChange={(e) => { if (e.target.value === "") setIsShowingFeatured(null); else setIsShowingFeatured(e.target.value === "featured"); }} className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-film-black-800 border border-transparent focus:border-gray-300 dark:focus:border-film-black-700 focus:outline-none text-gray-700 dark:text-gray-300">
                    <option value="">All Stories</option>
                    <option value="featured">Featured Only</option>
                    <option value="regular">Regular Only</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Stories Display */}
        {isLoadingStories && sortedStories.length === 0 ? (
          <div className="flex justify-center py-12"><LoadingSpinner size="large" /></div>
        ) : sortedStories.length === 0 ? (
          <div className="bg-white dark:bg-film-black-900 rounded-xl p-12 text-center shadow-sm border border-gray-100 dark:border-film-black-800">
            <BookOpen className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No stories found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{anyFiltersActive ? "Try adjusting your search or filters." : "Start by adding your first story."}</p>
            {anyFiltersActive ? <Button variant="secondary" onClick={resetFilters} icon={<RefreshCw className="h-4 w-4" />}>Clear Filters</Button> : <Link href="/admin/stories/create"><Button variant="primary" icon={<PlusCircle className="h-5 w-5" />}>Add New Story</Button></Link>}
          </div>
        ) : viewMode === "grid" ? (
          // GRID VIEW
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedStories.map((story: Story, index) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="bg-white dark:bg-film-black-900 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100 dark:border-film-black-800 h-full flex flex-col"
              >
                <div className="relative aspect-[16/10] group">
                  <Image src={story.image || "/images/placeholder.jpg"} alt={story.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                  {story.featured && <div className="absolute top-2 right-2 px-2 py-1 rounded-md flex items-center text-xs font-medium bg-yellow-400/90 dark:bg-yellow-500/90 text-black"><Star className="h-3 w-3 fill-current mr-1" />Featured</div>}
                  <div className="absolute top-2 left-2 px-2 py-1 rounded-md text-xs font-medium bg-film-red-600/90 text-white">{story.category}</div>
                  {/* Overlay with actions */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                    <Link href={`/stories/${story.slug}`} target="_blank" className="action-button bg-white/20 backdrop-blur-sm text-white" title="View"><Eye className="h-4 w-4" /></Link>
                    <div className="flex space-x-1.5">
                      <Link href={`/admin/stories/edit/${story.id}`} className="action-button bg-blue-600/80 backdrop-blur-sm text-white" title="Edit"><Edit className="h-4 w-4" /></Link>
                      <button onClick={() => handleDeleteClick(story)} className="action-button bg-red-600/80 backdrop-blur-sm text-white" title="Delete"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                </div>
                <div className="p-4 flex-grow flex flex-col">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">{story.title}</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-3 line-clamp-3 flex-grow">{story.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <span className="flex items-center"><Calendar className="h-3.5 w-3.5 mr-1" />{formatDate(story.date)}</span>
                    <span className="flex items-center"><BookOpen className="h-3.5 w-3.5 mr-1" />{story.readTime}</span>
                  </div>
                  <div className="mt-auto pt-3 border-t border-gray-100 dark:border-film-black-800 flex items-center justify-between">
                    <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">{story.author}</span>
                    {/* Actions moved to hover overlay */}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          // LIST VIEW
          <div className="bg-white dark:bg-film-black-900 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-film-black-800">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-film-black-800">
                <thead className="bg-gray-50 dark:bg-film-black-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Story</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Author</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Published</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-film-black-900 divide-y divide-gray-200 dark:divide-film-black-800">
                  {sortedStories.map((story: Story) => (
                    <tr key={story.id} className="hover:bg-gray-50 dark:hover:bg-film-black-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-16 relative rounded overflow-hidden mr-4"><Image src={story.image || "/images/placeholder.jpg"} alt={story.title} fill className="object-cover" /></div>
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{story.title}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 max-w-xs">{story.excerpt}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-film-black-800 dark:text-gray-300">{story.category}</span></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">{story.author}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{formatDate(story.date)}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {story.featured ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300 flex items-center w-fit"><Star className="h-3 w-3 mr-1 fill-current" />Featured</span>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">Regular</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link href={`/stories/${story.slug}`} target="_blank" className="action-button" title="View story"><ExternalLink className="h-4 w-4" /></Link>
                          <Link href={`/admin/stories/edit/${story.id}`} className="action-button text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20 hover:bg-blue-200 dark:hover:bg-blue-900/40" title="Edit story"><Edit className="h-4 w-4" /></Link>
                          <button onClick={() => handleDeleteClick(story)} className="action-button text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/40" title="Delete story"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {isDeleteModalOpen && storyToDelete && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-film-black-900 p-6 rounded-xl max-w-md w-full shadow-xl border border-gray-200 dark:border-film-black-700"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Delete Story</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">Are you sure you want to delete the story "{storyToDelete.title}"? This action cannot be undone.</p>
                <div className="flex justify-end gap-4">
                  <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>Cancel</Button>
                  <Button variant="danger" onClick={handleDelete}>Delete</Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Add styles for action buttons
const styles = `
  .action-button { @apply p-1.5 rounded-lg transition-colors; }
  .action-button:not([class*="text-"]) { @apply bg-gray-100 dark:bg-film-black-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-film-black-700; }
`;
if (typeof window !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default AdminStoriesPage;

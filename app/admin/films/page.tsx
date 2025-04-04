"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useData } from "@/context/DataContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Film, Plus, Search, Filter, Check, X, Trash2, Edit, Eye, Star, List, Grid, ArrowUpRight, RefreshCw
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/UI/Button";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import { Film as FilmType } from "@/types/mongodbSchema"; // Renamed to avoid conflict

type SortKey = "newest" | "oldest" | "title-asc" | "title-desc" | "rating-high" | "rating-low";

export default function FilmsPage() {
  const { films, isLoadingFilms, fetchFilms } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>(""); // Use empty string for 'All'
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [sortBy, setSortBy] = useState<SortKey>("newest");
  const [filteredFilms, setFilteredFilms] = useState<FilmType[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [filmToDelete, setFilmToDelete] = useState<FilmType | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Initial fetch (consider if DataContext already handles this)
  useEffect(() => {
    fetchFilms();
  }, [fetchFilms]);

  // Get unique categories from films
  const categories = useMemo(() => ['All', ...Array.from(new Set(films.map(film => film.category))).sort()], [films]);

  // Apply filters and sorting whenever dependencies change
  useEffect(() => {
    let result = [...films];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(film =>
        film.title.toLowerCase().includes(query) ||
        film.director?.toLowerCase().includes(query) ||
        film.description?.toLowerCase().includes(query)
      );
    }
    // Category filter
    if (selectedCategory && selectedCategory !== 'All') {
      result = result.filter(film => film.category === selectedCategory);
    }
    // Featured filter
    if (showFeaturedOnly) {
      result = result.filter(film => film.featured);
    }

    // Sorting logic
    result.sort((a, b) => {
      switch (sortBy) {
        case "oldest": return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case "title-asc": return a.title.localeCompare(b.title);
        case "title-desc": return b.title.localeCompare(a.title);
        case "rating-high": return (b.rating || 0) - (a.rating || 0);
        case "rating-low": return (a.rating || 0) - (b.rating || 0);
        case "newest":
        default: return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    setFilteredFilms(result);
  }, [films, searchQuery, selectedCategory, showFeaturedOnly, sortBy]);

  // Reset all filters and sorting
  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setShowFeaturedOnly(false);
    setSortBy("newest");
    setIsFilterOpen(false);
  };

  // Open delete confirmation modal
  const confirmDelete = (film: FilmType) => {
    setFilmToDelete(film);
    setIsDeleteModalOpen(true);
  };

  // Execute film deletion
  const deleteFilm = async () => {
    if (!filmToDelete) return;

    try {
      // Use ID-based endpoint for deletion
      const response = await fetch(`/api/films/id/${filmToDelete.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete film');
      }
      fetchFilms(); // Refetch films after deletion
      setIsDeleteModalOpen(false);
      setFilmToDelete(null);
    } catch (error) {
      console.error("Error deleting film:", error);
      // Consider adding user feedback here (e.g., toast notification)
    }
  };

  const anyFiltersActive = searchQuery || selectedCategory || showFeaturedOnly || sortBy !== 'newest';

  return (
    <div className="bg-gray-50 dark:bg-film-black-950 min-h-screen">
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <Film className="h-6 w-6 text-film-red-600 mr-2" />
              Films Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Browse, add, edit, and manage all films in your collection.
            </p>
          </div>
          <Link href="/admin/films/create">
            <Button variant="primary" icon={<Plus className="h-5 w-5" />}>
              Add New Film
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search films by title, director, etc..."
                className="pl-10 pr-4 py-2 w-full rounded-lg bg-gray-100 dark:bg-film-black-800 border border-transparent focus:border-gray-300 dark:focus:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 dark:text-white"
              />
              <Search className="h-5 w-5 text-gray-500 dark:text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                icon={<Filter className="h-4 w-4" />}
              >
                Filters
                {anyFiltersActive && <span className="ml-1.5 w-2 h-2 rounded-full bg-film-red-600"></span>}
              </Button>
              {anyFiltersActive && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  icon={<RefreshCw className="h-4 w-4" />}
                  className="text-gray-600 dark:text-gray-400"
                >
                  Reset
                </Button>
              )}
              {/* View Mode Toggle */}
              <div className="flex space-x-1 bg-gray-100 dark:bg-film-black-800 p-1 rounded-lg">
                <Button variant={viewMode === 'grid' ? 'primary' : 'ghost'} size="icon" onClick={() => setViewMode('grid')} className={`w-8 h-8 ${viewMode === 'grid' ? '' : 'text-gray-600 dark:text-gray-400'}`} aria-label="Grid view"><Grid className="h-4 w-4" /></Button>
                <Button variant={viewMode === 'list' ? 'primary' : 'ghost'} size="icon" onClick={() => setViewMode('list')} className={`w-8 h-8 ${viewMode === 'list' ? '' : 'text-gray-600 dark:text-gray-400'}`} aria-label="List view"><List className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>

          {/* Expanded Filters Panel */}
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 pt-4 border-t border-gray-200 dark:border-film-black-800 grid grid-cols-1 md:grid-cols-3 gap-4 overflow-hidden"
              >
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-film-black-800 border border-transparent focus:border-gray-300 dark:focus:border-film-black-700 focus:outline-none text-gray-700 dark:text-gray-300">
                    {categories.map((category) => (<option key={category} value={category === 'All' ? '' : category}>{category}</option>))}
                  </select>
                </div>
                {/* Featured Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  <button onClick={() => setShowFeaturedOnly(!showFeaturedOnly)} className={`w-full px-3 py-2 rounded-lg text-sm font-medium flex items-center border ${showFeaturedOnly ? "bg-film-red-100 dark:bg-film-red-900/20 border-film-red-300 dark:border-film-red-700 text-film-red-800 dark:text-film-red-300" : "bg-gray-100 dark:bg-film-black-800 border-gray-200 dark:border-film-black-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-film-black-700"}`}>
                    <div className={`w-4 h-4 rounded border flex items-center justify-center mr-2 ${showFeaturedOnly ? "bg-film-red-600 border-film-red-600" : "border-gray-400 dark:border-gray-600"}`}>{showFeaturedOnly && <Check className="h-3 w-3 text-white" />}</div> Featured Only
                  </button>
                </div>
                {/* Sort Options */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Sort By</label>
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortKey)} className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-film-black-800 border border-transparent focus:border-gray-300 dark:focus:border-film-black-700 focus:outline-none text-gray-700 dark:text-gray-300">
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="title-asc">Title (A-Z)</option>
                    <option value="title-desc">Title (Z-A)</option>
                    <option value="rating-high">Highest Rating</option>
                    <option value="rating-low">Lowest Rating</option>
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Films Display Area */}
        {isLoadingFilms && films.length === 0 ? (
          <div className="flex justify-center py-12"> <LoadingSpinner size="large" /> </div>
        ) : filteredFilms.length === 0 ? (
          <div className="bg-white dark:bg-film-black-900 rounded-xl shadow-sm p-12 text-center border border-gray-100 dark:border-film-black-800">
            <Film className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No films found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6"> {anyFiltersActive ? "Try adjusting your search or filters." : "Get started by adding your first film."} </p>
            {anyFiltersActive ? (
              <Button variant="secondary" onClick={resetFilters} icon={<RefreshCw className="h-4 w-4" />}> Clear Filters </Button>
            ) : (
              <Link href="/admin/films/create"> <Button variant="primary" icon={<Plus className="h-5 w-5" />}> Add New Film </Button> </Link>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredFilms.map((film, index) => (
              <motion.div
                key={film.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-film-black-900 rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 dark:border-film-black-800 h-full flex flex-col"
              >
                <div className="relative h-48 group">
                  <Image src={film.image || "/images/placeholder.jpg"} alt={film.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                  {film.featured && <div className="absolute top-2 left-2 bg-yellow-400 dark:bg-yellow-500 text-black dark:text-black text-xs font-medium px-2 py-1 rounded-md flex items-center"><Star className="h-3 w-3 fill-current mr-1" />Featured</div>}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-3">
                    <h3 className="text-white font-medium text-lg line-clamp-1">{film.title}</h3>
                  </div>
                </div>
                <div className="p-4 flex-grow flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <div><span className="bg-gray-100 dark:bg-film-black-800 px-2 py-0.5 rounded text-xs text-gray-600 dark:text-gray-400">{film.category}</span></div>
                    {film.rating > 0 && <div className="flex items-center bg-black/50 px-2 py-0.5 rounded-md"><Star className="h-3 w-3 text-amber-400 mr-1" fill="currentColor" /><span className="text-white text-xs">{film.rating.toFixed(1)}</span></div>}
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-3 flex-grow">{film.description}</p>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">Director: {film.director || 'N/A'}</div>
                  <div className="mt-auto pt-3 border-t border-gray-100 dark:border-film-black-800 flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">{film.year} • {film.duration || 'N/A'}</span>
                    <div className="flex items-center space-x-1.5">
                      <Link href={`/films/${film.slug}`} target="_blank" className="action-button" title="View film"><Eye className="h-4 w-4" /></Link>
                      <Link href={`/admin/films/edit/${film.id}`} className="action-button text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20 hover:bg-blue-200 dark:hover:bg-blue-900/40" title="Edit film"><Edit className="h-4 w-4" /></Link>
                      <button onClick={() => confirmDelete(film)} className="action-button text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/40" title="Delete film"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          // List View
          <div className="bg-white dark:bg-film-black-900 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-film-black-800">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-film-black-800">
                <thead className="bg-gray-50 dark:bg-film-black-800">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Film</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Year</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rating</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-film-black-900 divide-y divide-gray-200 dark:divide-film-black-800">
                  {filteredFilms.map((film) => (
                    <tr key={film.id} className="hover:bg-gray-50 dark:hover:bg-film-black-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-16 relative rounded overflow-hidden"><Image src={film.image || "/images/placeholder.jpg"} alt={film.title} fill className="object-cover" /></div>
                          <div className="ml-4"><div className="text-sm font-medium text-gray-900 dark:text-white">{film.title}</div></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap"><span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-film-black-800 text-gray-700 dark:text-gray-300">{film.category}</span></td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{film.year}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{film.rating > 0 ? film.rating.toFixed(1) : 'N/A'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{film.featured ? <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300 flex items-center w-fit"><Star className="h-3 w-3 mr-1 fill-current" />Featured</span> : <span className="text-xs text-gray-500 dark:text-gray-400">Standard</span>}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link href={`/films/${film.slug}`} target="_blank" className="action-button" title="View film"><Eye className="h-4 w-4" /></Link>
                          <Link href={`/admin/films/edit/${film.id}`} className="action-button text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20 hover:bg-blue-200 dark:hover:bg-blue-900/40" title="Edit film"><Edit className="h-4 w-4" /></Link>
                          <button onClick={() => confirmDelete(film)} className="action-button text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/40" title="Delete film"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && filmToDelete && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setIsDeleteModalOpen(false)} // Close on backdrop click
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-film-black-900 p-6 rounded-xl max-w-md w-full shadow-xl border border-gray-200 dark:border-film-black-700"
              onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Confirm Deletion</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Are you sure you want to delete the film "{filmToDelete.title}"? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}> Cancel </Button>
                <Button variant="danger" onClick={deleteFilm}> Delete </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
// Add styles for action buttons
const styles = `
  .action-button {
    @apply p-1.5 rounded-lg transition-colors;
  }
  .action-button:not([class*="text-"]) {
    @apply bg-gray-100 dark:bg-film-black-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-film-black-700;
  }
`;

if (typeof window !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

"use client";
import { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { motion } from "framer-motion";
import {
  Film, Plus, Search, Filter, Check, X, Trash2, Edit, Eye, Star
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function FilmsPage() {
  const { films, isLoadingFilms, fetchFilms } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  const [filteredFilms, setFilteredFilms] = useState(films);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<string>("newest");

  // Load films when component mounts
  useEffect(() => {
    // Fetch films when component is mounted
    fetchFilms();
    console.log("Fetching films..."); // Debug log
  }, [fetchFilms]);

  useEffect(() => {
    console.log("Films data updated:", films.length); // Debug log
  }, [films]);

  // Get unique categories from films
  const categories = Array.from(new Set(films.map(film => film.category))).sort();

  // Apply filters and sorting
  useEffect(() => {
    let result = [...films];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(film =>
        film.title.toLowerCase().includes(query) ||
        film.director.toLowerCase().includes(query) ||
        film.description.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (selectedCategory) {
      result = result.filter(film => film.category === selectedCategory);
    }

    // Apply featured filter
    if (showFeaturedOnly) {
      result = result.filter(film => film.featured);
    }

    // Apply sorting
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case "title-asc":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-desc":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "rating-high":
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case "rating-low":
        result.sort((a, b) => (a.rating || 0) - (b.rating || 0));
        break;
    }

    setFilteredFilms(result);
  }, [films, searchQuery, selectedCategory, showFeaturedOnly, sortBy]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCategory(null);
    setShowFeaturedOnly(false);
    setSortBy("newest");
  };

  const deleteFilm = async (id: string) => {
    try {
      // In a real app, make the actual DELETE request
      const response = await fetch(`/api/films/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete film');
      }

      // After deleting, refetch the films
      fetchFilms();
    } catch (error) {
      console.error("Error deleting film:", error);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-film-black-950 min-h-screen">
      {/* Page content stays the same */}
      <div className="p-6">
        {/* Header content stays the same */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <Film className="h-6 w-6 text-film-red-600 mr-2" />
              Films
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage all films in your collection
            </p>
          </div>

          <Link
            href="/admin/films/create"
            className="mt-4 sm:mt-0 px-4 py-2 bg-film-red-600 text-white rounded-lg hover:bg-film-red-700 transition-colors flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Add New Film
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-film-black-900 rounded-xl shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search films by title, director or description..."
                className="pl-10 pr-4 py-2 w-full rounded-lg bg-gray-100 dark:bg-film-black-800 border border-transparent focus:border-gray-300 dark:focus:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 dark:text-white"
              />
              <Search className="h-5 w-5 text-gray-500 dark:text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-film-black-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-film-black-700 transition-colors"
              >
                <Filter className="h-5 w-5" />
                Filters
                {(selectedCategory || showFeaturedOnly || sortBy !== "newest") && (
                  <span className="w-2 h-2 rounded-full bg-film-red-600"></span>
                )}
              </button>

              {(selectedCategory || showFeaturedOnly || sortBy !== "newest") && (
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-film-black-800 transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Expanded filters */}
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 pt-4 border-t border-gray-200 dark:border-film-black-800 grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              {/* Category filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Category
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(prevCategory =>
                        prevCategory === category ? null : category
                      )}
                      className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-between ${selectedCategory === category
                        ? "bg-film-red-600 text-white"
                        : "bg-gray-100 dark:bg-film-black-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-film-black-700"
                        }`}
                    >
                      {category}
                      {selectedCategory === category && <Check className="h-4 w-4 ml-1" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Featured filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <button
                  onClick={() => setShowFeaturedOnly(!showFeaturedOnly)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center ${showFeaturedOnly
                    ? "bg-film-red-600 text-white"
                    : "bg-gray-100 dark:bg-film-black-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-film-black-700"
                    }`}
                >
                  <div className={`w-5 h-5 rounded border flex items-center justify-center mr-2 ${showFeaturedOnly
                    ? "bg-white border-white"
                    : "border-gray-400 dark:border-gray-600"
                    }`}>
                    {showFeaturedOnly && <Check className="h-4 w-4 text-film-red-600" />}
                  </div>
                  Featured Only
                </button>
              </div>

              {/* Sort options */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-film-black-800 border border-transparent focus:border-gray-300 dark:focus:border-film-black-700 focus:outline-none text-gray-700 dark:text-gray-300"
                >
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
        </div>

        {/* Films grid - add debug info */}
        {isLoadingFilms ? (
          <div className="flex justify-center py-12">
            <svg className="animate-spin h-8 w-8 text-film-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : filteredFilms.length === 0 ? (
          <div className="bg-white dark:bg-film-black-900 rounded-xl shadow-sm p-12 text-center">
            <Film className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No films found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              {searchQuery || selectedCategory || showFeaturedOnly
                ? "Try adjusting your search or filters to find what you're looking for."
                : "Get started by adding your first film."}
            </p>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm">
              Debug info: Loaded {films.length} film(s) from API.
            </p>
            {searchQuery || selectedCategory || showFeaturedOnly ? (
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-film-red-600 text-white rounded-lg hover:bg-film-red-700 transition-colors"
              >
                Clear Filters
              </button>
            ) : (
              <Link
                href="/admin/films/create"
                className="px-4 py-2 bg-film-red-600 text-white rounded-lg hover:bg-film-red-700 transition-colors inline-flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Add New Film
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFilms.map((film, index) => (
              <motion.div
                key={film.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-film-black-900 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-100 dark:border-film-black-800"
              >
                <div className="relative h-48">
                  <Image
                    src={film.image || "/images/placeholder.jpg"}
                    alt={film.title}
                    fill
                    className="object-cover"
                  />
                  {film.featured && (
                    <div className="absolute top-2 left-2 bg-film-red-600 text-white text-xs font-medium px-2 py-1 rounded-md">
                      Featured
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <div className="p-4 w-full">
                      <div className="flex justify-between items-center">
                        <h3 className="text-white font-medium text-lg">{film.title}</h3>
                        {film.rating > 0 && (
                          <div className="flex items-center bg-black/50 px-2 py-1 rounded-md">
                            <Star className="h-3 w-3 text-amber-400 mr-1" fill="currentColor" />
                            <span className="text-white text-xs">{film.rating.toFixed(1)}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <span className="bg-gray-100 dark:bg-film-black-800 px-2 py-0.5 rounded text-xs">
                          {film.category}
                        </span>
                        <span>{film.year}</span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{film.duration}</div>
                  </div>

                  <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2 mb-4">
                    {film.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {film.director && <div>Director: {film.director}</div>}
                    </div>

                    <div className="flex items-center space-x-2">
                      <Link
                        href={`/films/${film.slug}`}
                        target="_blank"
                        className="p-2 bg-gray-100 dark:bg-film-black-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-film-black-700 transition-colors"
                        title="View film"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/admin/films/edit/${film.id}`}
                        className="p-2 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/40 transition-colors"
                        title="Edit film"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => {
                          if (window.confirm(`Are you sure you want to delete "${film.title}"?`)) {
                            deleteFilm(film.id);
                          }
                        }}
                        className="p-2 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/40 transition-colors"
                        title="Delete film"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

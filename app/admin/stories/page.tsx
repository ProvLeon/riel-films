"use client";
import React, { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/UI/Button";
import { Edit, Trash2, PlusCircle, Search, Filter, Calendar, BookOpen, ExternalLink, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import { useRouter } from "next/navigation";
// import { formatDistance } from 'date-fns';
import { formatDate } from "@/lib/utils";

const AdminStoriesPage = () => {
  const { stories, isLoadingStories, fetchStories } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isShowingFeatured, setIsShowingFeatured] = useState<boolean | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [storyToDelete, setStoryToDelete] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const router = useRouter();

  useEffect(() => {
    fetchStories();
  }, [fetchStories]);

  // Extract categories from stories
  useEffect(() => {
    if (stories && stories.length > 0) {
      const uniqueCategories = [...new Set(stories.map((story: any) => story.category))];
      setCategories(["All Categories", ...uniqueCategories]);
    }
  }, [stories]);

  // Filter stories based on search, category, and featured status
  const filteredStories = stories?.filter((story: any) => {
    const matchesSearch = story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      story.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "" || selectedCategory === "All Categories" ||
      story.category === selectedCategory;
    const matchesFeatured = isShowingFeatured === null || story.featured === isShowingFeatured;

    return matchesSearch && matchesCategory && matchesFeatured;
  });

  // Sort stories by date (newest first)
  const sortedStories = [...(filteredStories || [])].sort((a: any, b: any) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  // Handle delete confirmation
  const handleDeleteClick = (id: string) => {
    setStoryToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // Handle actual delete
  const handleDelete = async () => {
    if (!storyToDelete) return;

    try {
      const response = await fetch(`/api/stories/${storyToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Refresh stories data
        fetchStories();
        setIsDeleteModalOpen(false);
        setStoryToDelete(null);
      } else {
        throw new Error("Failed to delete story");
      }
    } catch (error) {
      console.error("Error deleting story:", error);
    }
  };

  // Format date for display
  const formatPublishDate = (dateString: string) => {
    const date = new Date(dateString);
    return formatDate(date.toLocaleDateString());
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Stories</h1>

        <Button variant="primary">
          <Link href="/admin/stories/create" className="flex items-center">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Story
          </Link>
        </Button>
      </div>

      {/* Filters and search */}
      <div className="bg-white dark:bg-film-black-900 p-4 rounded-xl mb-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search stories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-film-black-700 rounded-lg bg-white dark:bg-film-black-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-film-red-500"
            />
          </div>

          <div className="flex gap-4 flex-col sm:flex-row">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 dark:border-film-black-700 rounded-lg bg-white dark:bg-film-black-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-film-red-500 appearance-none min-w-[160px]"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div className="relative">
              <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={isShowingFeatured === null ? "" : isShowingFeatured ? "featured" : "regular"}
                onChange={(e) => {
                  if (e.target.value === "") setIsShowingFeatured(null);
                  else setIsShowingFeatured(e.target.value === "featured");
                }}
                className="pl-10 pr-8 py-2 border border-gray-300 dark:border-film-black-700 rounded-lg bg-white dark:bg-film-black-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-film-red-500 appearance-none min-w-[160px]"
              >
                <option value="">All Stories</option>
                <option value="featured">Featured Only</option>
                <option value="regular">Regular Only</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex space-x-2 items-center">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md ${viewMode === "grid"
                ? "bg-film-red-100 text-film-red-600 dark:bg-film-red-900/30 dark:text-film-red-400"
                : "bg-gray-100 text-gray-600 dark:bg-film-black-800 dark:text-gray-400"
                }`}
              aria-label="Grid view"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md ${viewMode === "list"
                ? "bg-film-red-100 text-film-red-600 dark:bg-film-red-900/30 dark:text-film-red-400"
                : "bg-gray-100 text-gray-600 dark:bg-film-black-800 dark:text-gray-400"
                }`}
              aria-label="List view"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Stories display */}
      {isLoadingStories ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="large" />
        </div>
      ) : sortedStories && sortedStories.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedStories.map((story: any) => (
              <motion.div
                key={story.id}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-film-black-900 rounded-xl overflow-hidden shadow-sm"
              >
                <div className="relative aspect-video">
                  <Image
                    src={story.image}
                    alt={story.title}
                    fill
                    className="object-cover"
                  />
                  {story.featured && (
                    <div className="absolute top-2 right-2">
                      <div className="bg-yellow-400/90 dark:bg-yellow-500/90 px-2 py-1 rounded-md flex items-center">
                        <Star className="h-3 w-3 text-white fill-white mr-1" />
                        <span className="text-white text-xs">Featured</span>
                      </div>
                    </div>
                  )}
                  <div className="absolute top-2 left-2">
                    <div className="bg-film-red-600/90 px-2 py-1 rounded-md">
                      <span className="text-white text-xs">{story.category}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{story.title}</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">{story.excerpt}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Calendar className="h-3.5 w-3.5 mr-1" />
                      <span>{formatPublishDate(story.date)}</span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {story.readTime}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-medium">{story.author}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => window.open(`/stories/${story.slug}`, '_blank')}
                        className="p-1.5 bg-gray-100 dark:bg-film-black-800 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-film-black-700"
                        title="View on site"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => router.push(`/admin/stories/edit/${story.id}`)}
                        className="p-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/30"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(story.id)}
                        className="p-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/30"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-film-black-900 rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-film-black-800">
                <thead className="bg-gray-50 dark:bg-film-black-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Story
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Author
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Published
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-film-black-900 divide-y divide-gray-200 dark:divide-film-black-800">
                  {sortedStories.map((story: any) => (
                    <tr key={story.id} className="hover:bg-gray-50 dark:hover:bg-film-black-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-16 relative rounded overflow-hidden">
                            <Image
                              src={story.image}
                              alt={story.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{story.title}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{story.excerpt}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-film-black-800 dark:text-gray-300">
                          {story.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {story.author}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatPublishDate(story.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {story.featured ? (
                          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 flex items-center w-fit">
                            <Star className="h-3 w-3 mr-1 fill-current" />
                            Featured
                          </span>
                        ) : (
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-film-black-800 dark:text-gray-300">
                            Regular
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => window.open(`/stories/${story.slug}`, '_blank')}
                            className="p-1.5 bg-gray-100 dark:bg-film-black-800 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-film-black-700"
                            title="View on site"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => router.push(`/admin/stories/edit/${story.id}`)}
                            className="p-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/30"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(story.id)}
                            className="p-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/30"
                            title="Delete"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        <div className="bg-white dark:bg-film-black-900 rounded-xl p-8 text-center shadow-sm">
          <div className="flex flex-col items-center">
            <div className="bg-gray-100 dark:bg-film-black-800 p-6 rounded-full mb-4">
              <BookOpen className="h-10 w-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No stories found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">We couldn't find any stories matching your filters.</p>
            <Button variant="outline" onClick={() => {
              setSearchQuery("");
              setSelectedCategory("");
              setIsShowingFeatured(null);
            }}>
              Clear Filters
            </Button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-film-black-900 p-6 rounded-xl max-w-md w-full m-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Delete Story</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Are you sure you want to delete this story? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setStoryToDelete(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                >
                  Delete
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminStoriesPage;

"use client";
import React, { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/UI/Button";
import { Edit, Trash2, PlusCircle, Search, Filter, CalendarClock, Eye, ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import { useRouter } from "next/navigation";

const AdminProductionsPage = () => {
  const { productions, isLoadingProductions, fetchProductions } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productionToDelete, setProductionToDelete] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const router = useRouter();

  useEffect(() => {
    fetchProductions();
  }, [fetchProductions]);

  // Extract categories and statuses from productions
  useEffect(() => {
    if (productions && productions.length > 0) {
      const uniqueCategories = [...new Set(productions.map((prod: any) => prod.category))];
      const uniqueStatuses = [...new Set(productions.map((prod: any) => prod.status))];
      setCategories(["All Categories", ...uniqueCategories]);
      setStatuses(["All Statuses", ...uniqueStatuses]);
    }
  }, [productions]);

  // Filter productions based on search, category, and status
  const filteredProductions = productions?.filter((production: any) => {
    const matchesSearch = production.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      production.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "" || selectedCategory === "All Categories" ||
      production.category === selectedCategory;
    const matchesStatus = selectedStatus === "" || selectedStatus === "All Statuses" ||
      production.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Handle delete confirmation
  const handleDeleteClick = (id: string) => {
    setProductionToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // Handle actual delete
  const handleDelete = async () => {
    if (!productionToDelete) return;

    try {
      const response = await fetch(`/api/productions/${productionToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Refresh productions data
        fetchProductions();
        setIsDeleteModalOpen(false);
        setProductionToDelete(null);
      } else {
        throw new Error("Failed to delete production");
      }
    } catch (error) {
      console.error("Error deleting production:", error);
    }
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case "In Production":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "Pre-Production":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "Development":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
      case "Completed":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Productions</h1>

        <Button variant="primary">
          <Link href="/admin/productions/create" className="flex items-center">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Production
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
              placeholder="Search productions..."
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
              <CalendarClock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="pl-10 pr-8 py-2 border border-gray-300 dark:border-film-black-700 rounded-lg bg-white dark:bg-film-black-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-film-red-500 appearance-none min-w-[160px]"
              >
                <option value="">All Statuses</option>
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
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

      {/* Productions display */}
      {isLoadingProductions ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="large" />
        </div>
      ) : filteredProductions && filteredProductions.length > 0 ? (
        viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProductions.map((production: any) => (
              <motion.div
                key={production.id}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-film-black-900 rounded-xl overflow-hidden shadow-sm"
              >
                <div className="relative aspect-video">
                  <Image
                    src={production.image}
                    alt={production.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <div className={`px-2 py-1 rounded-md ${getStatusColor(production.status)}`}>
                      <span className="text-xs font-medium">{production.status}</span>
                    </div>
                  </div>
                  <div className="absolute top-2 left-2">
                    <div className="bg-film-red-600/90 px-2 py-1 rounded-md">
                      <span className="text-white text-xs">{production.category}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{production.title}</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">{production.description}</p>

                  <div className="mb-3">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 dark:bg-film-black-800 rounded-full h-2 mr-2">
                        <div
                          className="bg-film-red-600 h-2 rounded-full"
                          style={{ width: `${production.progress}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-600 dark:text-gray-400 min-w-[32px]">
                        {production.progress}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-medium">{production.director}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => window.open(`/productions/${production.slug}`, '_blank')}
                        className="p-1.5 bg-gray-100 dark:bg-film-black-800 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-film-black-700"
                        title="View on site"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => router.push(`/admin/productions/edit/${production.id}`)}
                        className="p-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/30"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(production.id)}
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
                      Production
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Progress
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Director
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-film-black-900 divide-y divide-gray-200 dark:divide-film-black-800">
                  {filteredProductions.map((production: any) => (
                    <tr key={production.id} className="hover:bg-gray-50 dark:hover:bg-film-black-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-16 relative rounded overflow-hidden">
                            <Image
                              src={production.image}
                              alt={production.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{production.title}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{production.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(production.status)}`}>
                          {production.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center w-32">
                          <div className="w-full bg-gray-200 dark:bg-film-black-800 rounded-full h-2 mr-2">
                            <div
                              className="bg-film-red-600 h-2 rounded-full"
                              style={{ width: `${production.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600 dark:text-gray-400 min-w-[32px]">
                            {production.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {production.director}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => window.open(`/productions/${production.slug}`, '_blank')}
                            className="p-1.5 bg-gray-100 dark:bg-film-black-800 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-film-black-700"
                            title="View on site"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => router.push(`/admin/productions/edit/${production.id}`)}
                            className="p-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/30"
                            title="Edit"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(production.id)}
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
              <CalendarClock className="h-10 w-10 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No productions found</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">We couldn't find any productions matching your filters.</p>
            <Button variant="outline" onClick={() => {
              setSearchQuery("");
              setSelectedCategory("");
              setSelectedStatus("");
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
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Delete Production</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                Are you sure you want to delete this production? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsDeleteModalOpen(false);
                    setProductionToDelete(null);
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

export default AdminProductionsPage;

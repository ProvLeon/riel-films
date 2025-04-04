"use client";
import React, { useState, useEffect, useMemo } from "react";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/UI/Button";
import { Edit, Trash2, PlusCircle, Search, Filter, ExternalLink, List, Grid, RefreshCw, Video, Activity } from "lucide-react"; // Added Activity icon
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import { useRouter } from "next/navigation";
import { Production } from "@/types/mongodbSchema";
import { getStatusColor } from "@/lib/utils"; // Import the utility

const AdminProductionsPage = () => {
  const { productions, isLoadingProductions, errorProductions, fetchProductions } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productionToDelete, setProductionToDelete] = useState<Production | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchProductions();
  }, [fetchProductions]);

  // Extract unique categories and statuses
  const { categories, statuses } = useMemo(() => {
    if (!productions || productions.length === 0) return { categories: ['All'], statuses: ['All'] };
    const uniqueCategories = ['All', ...new Set(productions.map((prod) => prod.category))].sort();
    const uniqueStatuses = ['All', 'Development', 'Pre-Production', 'In Production', 'Post-Production', 'Completed']; // Define standard order
    return { categories: uniqueCategories, statuses: uniqueStatuses };
  }, [productions]);

  // Filter productions
  const filteredProductions = useMemo(() => {
    return productions?.filter((production) => {
      const matchesSearch = production.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        production.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "" || selectedCategory === "All" || production.category === selectedCategory;
      const matchesStatus = selectedStatus === "" || selectedStatus === "All" || production.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    }) || [];
  }, [productions, searchQuery, selectedCategory, selectedStatus]);

  // Sort productions (e.g., by creation date descending)
  const sortedProductions = [...filteredProductions].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Open delete confirmation modal
  const confirmDelete = (production: Production) => {
    setProductionToDelete(production);
    setIsDeleteModalOpen(true);
  };

  // Handle actual delete
  const handleDelete = async () => {
    if (!productionToDelete) return;
    try {
      const response = await fetch(`/api/productions/id/${productionToDelete.id}`, { method: "DELETE" }); // Use ID-based API
      if (response.ok) {
        fetchProductions(); // Refetch after delete
        setIsDeleteModalOpen(false);
        setProductionToDelete(null);
      } else {
        throw new Error("Failed to delete production");
      }
    } catch (error) {
      console.error("Error deleting production:", error);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('');
    setSelectedStatus('');
    setIsFilterOpen(false);
  };

  const anyFiltersActive = searchQuery || selectedCategory || selectedStatus;

  return (
    <div className="bg-gray-50 dark:bg-film-black-950 min-h-screen">
      <div className="p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <Video className="h-6 w-6 text-film-red-600 mr-2" />Productions Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Track, manage, and update film production projects.</p>
          </div>
          <Link href="/admin/productions/create">
            <Button variant="primary" icon={<PlusCircle className="h-5 w-5" />}>Add New Production</Button>
          </Link>
        </div>

        {/* Filters and Search Section */}
        <div className="bg-white dark:bg-film-black-900 rounded-xl shadow-sm p-4 mb-6 border border-gray-100 dark:border-film-black-800">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="relative flex-grow w-full md:w-auto">
              <input type="text" placeholder="Search productions..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 pr-4 py-2 w-full rounded-lg bg-gray-100 dark:bg-film-black-800 border border-transparent focus:border-gray-300 dark:focus:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 dark:text-white" />
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="secondary" size="sm" onClick={() => setIsFilterOpen(!isFilterOpen)} icon={<Filter className="h-4 w-4" />}>Filters {anyFiltersActive && <span className="ml-1.5 w-2 h-2 rounded-full bg-film-red-600"></span>}</Button>
              {anyFiltersActive && <Button variant="ghost" size="sm" onClick={resetFilters} icon={<RefreshCw className="h-4 w-4" />} className="text-gray-600 dark:text-gray-400">Reset</Button>}
              <div className="flex space-x-1 bg-gray-100 dark:bg-film-black-800 p-1 rounded-lg">
                <Button variant={viewMode === 'grid' ? 'primary' : 'ghost'} size="icon" onClick={() => setViewMode('grid')} className={`w-8 h-8 ${viewMode === 'grid' ? '' : 'text-gray-600 dark:text-gray-400'}`} aria-label="Grid view"><Grid className="h-4 w-4" /></Button>
                <Button variant={viewMode === 'list' ? 'primary' : 'ghost'} size="icon" onClick={() => setViewMode('list')} className={`w-8 h-8 ${viewMode === 'list' ? '' : 'text-gray-600 dark:text-gray-400'}`} aria-label="List view"><List className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>
          <AnimatePresence>
            {isFilterOpen && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="mt-4 pt-4 border-t border-gray-200 dark:border-film-black-800 grid grid-cols-1 md:grid-cols-2 gap-4 overflow-hidden">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                  <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-film-black-800 border border-transparent focus:border-gray-300 dark:focus:border-film-black-700 focus:outline-none text-gray-700 dark:text-gray-300">
                    {categories.map((cat) => <option key={cat} value={cat === 'All' ? '' : cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                  <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-gray-100 dark:bg-film-black-800 border border-transparent focus:border-gray-300 dark:focus:border-film-black-700 focus:outline-none text-gray-700 dark:text-gray-300">
                    {statuses.map((stat) => <option key={stat} value={stat === 'All' ? '' : stat}>{stat}</option>)}
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Productions Display */}
        {isLoadingProductions && sortedProductions.length === 0 ? (
          <div className="flex justify-center py-12"><LoadingSpinner size="large" /></div>
        ) : sortedProductions.length === 0 ? (
          <div className="bg-white dark:bg-film-black-900 rounded-xl p-12 text-center shadow-sm border border-gray-100 dark:border-film-black-800">
            <Video className="h-12 w-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No productions found</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{anyFiltersActive ? "Try adjusting your search or filters." : "Start by adding a new production project."}</p>
            {anyFiltersActive ? <Button variant="secondary" onClick={resetFilters} icon={<RefreshCw className="h-4 w-4" />}>Clear Filters</Button> : <Link href="/admin/productions/create"><Button variant="primary" icon={<PlusCircle className="h-5 w-5" />}>Add New Production</Button></Link>}
          </div>
        ) : viewMode === 'grid' ? (
          // Grid View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedProductions.map((production, index) => (
              <motion.div key={production.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }} whileHover={{ y: -5 }} className="bg-white dark:bg-film-black-900 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-100 dark:border-film-black-800 h-full flex flex-col">
                <div className="relative aspect-video group">
                  <Image src={production.image || "/images/placeholder.jpg"} alt={production.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute top-2 right-2"><div className={`px-2 py-1 rounded-md text-xs font-medium ${getStatusColor(production.status)}`}>{production.status}</div></div>
                  <div className="absolute top-2 left-2"><div className="bg-black/50 text-white px-2 py-1 rounded-md text-xs">{production.category}</div></div>
                  {/* Overlay with actions on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-3">
                    <Link href={`/productions/${production.slug}`} target="_blank" className="action-button bg-white/20 backdrop-blur-sm text-white" title="View"><ExternalLink className="h-4 w-4" /></Link>
                    <div className="flex space-x-1.5">
                      <Link href={`/admin/productions/edit/${production.id}`} className="action-button bg-blue-600/80 backdrop-blur-sm text-white" title="Edit"><Edit className="h-4 w-4" /></Link>
                      <button onClick={() => confirmDelete(production)} className="action-button bg-red-600/80 backdrop-blur-sm text-white" title="Delete"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                </div>
                <div className="p-4 flex-grow flex flex-col">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">{production.title}</h2>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2 flex-grow">{production.description}</p>
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1"><span className="text-gray-500 dark:text-gray-400">Progress</span><span className="font-medium text-film-red-600 dark:text-film-red-500">{production.progress}%</span></div>
                    <div className="w-full bg-gray-200 dark:bg-film-black-800 rounded-full h-2"><motion.div className="bg-film-red-600 h-2 rounded-full" initial={{ width: '0%' }} animate={{ width: `${production.progress}%` }} transition={{ duration: 0.5, delay: index * 0.1 }} /></div>
                  </div>
                  <div className="mt-auto pt-3 border-t border-gray-100 dark:border-film-black-800 flex items-center justify-between">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Director: {production.director}</span>
                    {/* Actions moved to hover overlay */}
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Production</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Progress</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Director</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-film-black-900 divide-y divide-gray-200 dark:divide-film-black-800">
                  {sortedProductions.map((production) => (
                    <tr key={production.id} className="hover:bg-gray-50 dark:hover:bg-film-black-800/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-16 relative rounded overflow-hidden"><Image src={production.image || "/images/placeholder.jpg"} alt={production.title} fill className="object-cover" /></div>
                          <div className="ml-4"><div className="text-sm font-medium text-gray-900 dark:text-white">{production.title}</div><div className="text-xs text-gray-500 dark:text-gray-400">{production.category}</div></div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(production.status)}`}>{production.status}</span></td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center w-32">
                          <div className="w-full bg-gray-200 dark:bg-film-black-800 rounded-full h-2 mr-2"><motion.div className="bg-film-red-600 h-2 rounded-full" initial={{ width: '0%' }} animate={{ width: `${production.progress}%` }} transition={{ duration: 0.5 }} /></div>
                          <span className="text-xs text-gray-600 dark:text-gray-400 min-w-[32px]">{production.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{production.director}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link href={`/productions/${production.slug}`} target="_blank" className="action-button" title="View"><ExternalLink className="h-4 w-4" /></Link>
                          <Link href={`/admin/productions/edit/${production.id}`} className="action-button text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20 hover:bg-blue-200 dark:hover:bg-blue-900/40" title="Edit"><Edit className="h-4 w-4" /></Link>
                          <button onClick={() => confirmDelete(production)} className="action-button text-red-700 dark:text-red-400 bg-red-100 dark:bg-red-900/20 hover:bg-red-200 dark:hover:bg-red-900/40" title="Delete"><Trash2 className="h-4 w-4" /></button>
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
          {isDeleteModalOpen && productionToDelete && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white dark:bg-film-black-900 p-6 rounded-xl max-w-md w-full m-4 shadow-xl border border-gray-200 dark:border-film-black-700"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Delete Production</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-6">
                  Are you sure you want to delete the production "{productionToDelete.title}"? This action cannot be undone.
                </p>
                <div className="flex justify-end gap-4">
                  <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}> Cancel </Button>
                  <Button variant="danger" onClick={handleDelete}> Delete </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Add action button styles (if not already global)
const styles = `
  .action-button { @apply p-1.5 rounded-lg transition-colors; }
  .action-button:not([class*="text-"]) { @apply bg-gray-100 dark:bg-film-black-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-film-black-700; }
`;
if (typeof window !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}


export default AdminProductionsPage;

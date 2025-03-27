"use client";
import { useState, useEffect, Suspense } from "react";
import { useData } from "@/context/DataContext";
import { Button } from "@/components/UI/Button";
import { Edit, Trash2, PlusCircle, Search, Filter, Star } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import { useRouter } from "next/navigation";

const FilmsLoading = () => (
  <div className="flex justify-center items-center h-64">
    <LoadingSpinner size="large" />
  </div>
)


const AdminFilmsPage = () => {
  return (
    <Suspense fallback={<FilmsLoading />}>
      <AdminFilms />
    </Suspense>
  )
}

const AdminFilms = () => {
  const { films, isLoadingFilms, fetchFilms } = useData();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [filmToDelete, setFilmToDelete] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchFilms();
  }, [fetchFilms]);

  // Extract categories from films
  useEffect(() => {
    if (films && films.length > 0) {
      const uniqueCategories = [...new Set(films.map((film: any) => film.category))];
      setCategories(["All Categories", ...uniqueCategories]);
    }
  }, [films]);

  // Filter films based on search and category
  const filteredFilms = films?.filter((film: any) => {
    const matchesSearch = film.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      film.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "" || selectedCategory === "All Categories" ||
      film.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Handle delete confirmation
  const handleDeleteClick = (id: string) => {
    setFilmToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // Handle actual delete
  const handleDelete = async () => {
    if (!filmToDelete) return;

    try {
      const response = await fetch(`/api/films/${filmToDelete}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Refresh films data
        fetchFilms();
        setIsDeleteModalOpen(false);
        setFilmToDelete(null);
      } else {
        throw new Error("Failed to delete film");
      }
    } catch (error) {
      console.error("Error deleting film:", error);
      // Handle error (show toast, etc.)
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Films</h1>

        <Button variant="primary">
          <Link href="/admin/films/create" className="flex items-center">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Film
          </Link>
        </Button>
      </div>

      {/* Filters and search */}
      <div className="bg-white dark:bg-film-black-900 p-4 rounded-xl mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search films..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-film-black-700 rounded-lg bg-white dark:bg-film-black-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-film-red-500"
            />
          </div>

          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 dark:border-film-black-700 rounded-lg bg-white dark:bg-film-black-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-film-red-500 appearance-none"
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
        </div>
      </div>

      {/* Films grid */}
      {isLoadingFilms ? (
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="large" />
        </div>
      ) : filteredFilms && filteredFilms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFilms.map((film: any) => (
            <motion.div
              key={film.id}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-film-black-900 rounded-xl overflow-hidden shadow-sm"
            >
              <div className="relative aspect-video">
                <Image
                  src={film.image}
                  alt={film.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2">
                  <div className="bg-black/70 px-2 py-1 rounded-md flex items-center">
                    <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-white text-xs ml-1">{film.rating}</span>
                  </div>
                </div>
                <div className="absolute top-2 left-2">
                  <div className="bg-film-red-600/90 px-2 py-1 rounded-md">
                    <span className="text-white text-xs">{film.category}</span>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{film.title}</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-4 line-clamp-2">{film.description}</p>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {film.year} • {film.duration}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => router.push(`/admin/films/edit/${film.slug}`)}
                      className="p-1.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800/30"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(film.id)}
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
        <div className="bg-white dark:bg-film-black-900 rounded-xl p-6 text-center shadow-sm">
          <p className="text-gray-500 dark:text-gray-400">No films found matching your filters.</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-film-black-900 p-6 rounded-xl max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Delete Film</h3>
            <p className="text-gray-700 dark:text-gray-300 mb-6">
              Are you sure you want to delete this film? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setIsDeleteModalOpen(false);
                  setFilmToDelete(null);
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
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminFilmsPage;

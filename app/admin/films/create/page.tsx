"use client";
import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/UI/Button";
import { Save, ArrowLeft, Plus, X, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "@/components/UI/LoadingSpinner";

const CreateFilmLoading = () => (
  <div className="flex justify-center items-center h-64">
    <LoadingSpinner size="large" />
  </div>
);

const CreateFilmForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "",
    year: "",
    description: "",
    longDescription: "",
    image: "",
    director: "",
    producer: "",
    duration: "",
    languages: [""],
    subtitles: [""],
    releaseDate: "",
    awards: [""],
    gallery: [""],
    trailer: "",
    synopsis: "",
    quotes: [{ text: "", source: "" }],
    rating: 0
  });

  // Cast and Crew
  const [castCrew, setCastCrew] = useState([{ role: "", name: "" }]);

  // Helper function to handle basic input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle array inputs (languages, subtitles, awards, gallery)
  const handleArrayInputChange = (index: number, fieldName: string, value: string) => {
    const newArray = [...formData[fieldName as keyof typeof formData] as string[]];
    newArray[index] = value;
    setFormData({
      ...formData,
      [fieldName]: newArray
    });
  };

  // Add new item to an array
  const addItemToArray = (fieldName: string) => {
    const newArray = [...formData[fieldName as keyof typeof formData] as string[], ""];
    setFormData({
      ...formData,
      [fieldName]: newArray
    });
  };

  // Remove item from an array
  const removeItemFromArray = (fieldName: string, index: number) => {
    const newArray = [...formData[fieldName as keyof typeof formData] as string[]];
    newArray.splice(index, 1);
    setFormData({
      ...formData,
      [fieldName]: newArray
    });
  };

  // Handle quotes changes
  const handleQuoteChange = (index: number, field: 'text' | 'source', value: string) => {
    const newQuotes = [...formData.quotes];
    newQuotes[index] = { ...newQuotes[index], [field]: value };
    setFormData({
      ...formData,
      quotes: newQuotes
    });
  };

  // Add new quote
  const addQuote = () => {
    setFormData({
      ...formData,
      quotes: [...formData.quotes, { text: "", source: "" }]
    });
  };

  // Remove quote
  const removeQuote = (index: number) => {
    const newQuotes = [...formData.quotes];
    newQuotes.splice(index, 1);
    setFormData({
      ...formData,
      quotes: newQuotes
    });
  };

  // Handle cast/crew changes
  const handleCastCrewChange = (index: number, field: 'role' | 'name', value: string) => {
    const newCastCrew = [...castCrew];
    newCastCrew[index] = { ...newCastCrew[index], [field]: value };
    setCastCrew(newCastCrew);
  };

  // Add new cast/crew member
  const addCastCrewMember = () => {
    setCastCrew([...castCrew, { role: "", name: "" }]);
  };

  // Remove cast/crew member
  const removeCastCrewMember = (index: number) => {
    const newCastCrew = [...castCrew];
    newCastCrew.splice(index, 1);
    setCastCrew(newCastCrew);
  };

  // Generate slug from title
  const generateSlug = () => {
    const slug = formData.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    setFormData({
      ...formData,
      slug
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Combine form data with cast/crew for API request
      const filmData = {
        ...formData,
        castCrew,
        rating: Number(formData.rating)
      };

      const response = await fetch('/api/films', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filmData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create film');
      }

      router.push('/admin/films');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-film-black-900"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Film</h1>
        </div>

        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <LoadingSpinner size="small" />
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Film
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className="mb-6 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white dark:bg-film-black-900 rounded-xl shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-6 md:col-span-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-film-black-800">
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title<span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    onBlur={generateSlug}
                    className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Slug<span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="slug"
                    name="slug"
                    value={formData.slug}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Category<span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Year<span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="year"
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Short Description<span className="text-red-600">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="longDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Long Description
                  </label>
                  <textarea
                    id="longDescription"
                    name="longDescription"
                    value={formData.longDescription}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="synopsis" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Synopsis<span className="text-red-600">*</span>
                  </label>
                  <textarea
                    id="synopsis"
                    name="synopsis"
                    value={formData.synopsis}
                    onChange={handleInputChange}
                    rows={5}
                    className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Media */}
            <div className="space-y-6 md:col-span-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-film-black-800">
                Media
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Main Image URL<span className="text-red-600">*</span>
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      id="image"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      placeholder="https://..."
                      className="flex-1 px-4 py-2 rounded-l-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                      required
                    />
                    <button
                      type="button"
                      className="px-4 py-2 bg-gray-100 dark:bg-film-black-700 border-y border-r border-gray-300 dark:border-film-black-600 rounded-r-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-film-black-600"
                    >
                      <Upload className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="trailer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Trailer URL
                  </label>
                  <input
                    type="text"
                    id="trailer"
                    name="trailer"
                    value={formData.trailer}
                    onChange={handleInputChange}
                    placeholder="https://youtube.com/..."
                    className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                  />
                </div>
              </div>

              {/* Gallery Images */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Gallery Images
                  </label>
                  <button
                    type="button"
                    onClick={() => addItemToArray("gallery")}
                    className="flex items-center text-sm text-film-red-600 dark:text-film-red-500 hover:text-film-red-700 dark:hover:text-film-red-400"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Image
                  </button>
                </div>

                <div className="space-y-3">
                  <AnimatePresence>
                    {formData.gallery.map((image, index) => (
                      <motion.div
                        key={`gallery-${index}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-2"
                      >
                        <input
                          type="text"
                          value={image}
                          onChange={(e) => handleArrayInputChange(index, "gallery", e.target.value)}
                          placeholder="https://..."
                          className="flex-1 px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => removeItemFromArray("gallery", index)}
                          className="p-2 text-red-600 hover:text-red-700"
                          disabled={formData.gallery.length <= 1}
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Production Details */}
            <div className="space-y-6 md:col-span-2">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-film-black-800">
                Production Details
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="director" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Director<span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="director"
                    name="director"
                    value={formData.director}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="producer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Producer<span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="producer"
                    name="producer"
                    value={formData.producer}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Duration<span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="duration"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 120 minutes"
                    className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="releaseDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Release Date<span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="releaseDate"
                    name="releaseDate"
                    value={formData.releaseDate}
                    onChange={handleInputChange}
                    placeholder="e.g., January 15, 2023"
                    className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="rating" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Rating<span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    id="rating"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    min="0"
                    max="5"
                    step="0.1"
                    placeholder="0 - 5"
                    className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                    required
                  />
                </div>
              </div>

              {/* Languages */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Languages
                  </label>
                  <button
                    type="button"
                    onClick={() => addItemToArray("languages")}
                    className="flex items-center text-sm text-film-red-600 dark:text-film-red-500 hover:text-film-red-700 dark:hover:text-film-red-400"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Language
                  </button>
                </div>

                <div className="space-y-3">
                  <AnimatePresence>
                    {formData.languages.map((language, index) => (
                      <motion.div
                        key={`lang-${index}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-2"
                      >
                        <input
                          type="text"
                          value={language}
                          onChange={(e) => handleArrayInputChange(index, "languages", e.target.value)}
                          placeholder="e.g., English"
                          className="flex-1 px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => removeItemFromArray("languages", index)}
                          className="p-2 text-red-600 hover:text-red-700"
                          disabled={formData.languages.length <= 1}
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              {/* Subtitles */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Subtitles
                  </label>
                  <button
                    type="button"
                    onClick={() => addItemToArray("subtitles")}
                    className="flex items-center text-sm text-film-red-600 dark:text-film-red-500 hover:text-film-red-700 dark:hover:text-film-red-400"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Subtitle
                  </button>
                </div>

                <div className="space-y-3">
                  <AnimatePresence>
                    {formData.subtitles.map((subtitle, index) => (
                      <motion.div
                        key={`sub-${index}`}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex gap-2"
                      >
                        <input
                          type="text"
                          value={subtitle}
                          onChange={(e) => handleArrayInputChange(index, "subtitles", e.target.value)}
                          placeholder="e.g., French"
                          className="flex-1 px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => removeItemFromArray("subtitles", index)}
                          className="p-2 text-red-600 hover:text-red-700"
                          disabled={formData.subtitles.length <= 1}
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Cast and Crew */}
            <div className="space-y-6 md:col-span-2">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-film-black-800">
                  Cast & Crew
                </h2>
                <button
                  type="button"
                  onClick={addCastCrewMember}
                  className="flex items-center text-sm text-film-red-600 dark:text-film-red-500 hover:text-film-red-700 dark:hover:text-film-red-400"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Member
                </button>
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {castCrew.map((member, index) => (
                    <motion.div
                      key={`crew-${index}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex gap-4 items-center"
                    >
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input
                          type="text"
                          value={member.role}
                          onChange={(e) => handleCastCrewChange(index, 'role', e.target.value)}
                          placeholder="Role (e.g., Director)"
                          className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                        />
                        <input
                          type="text"
                          value={member.name}
                          onChange={(e) => handleCastCrewChange(index, 'name', e.target.value)}
                          placeholder="Name (e.g., John Doe)"
                          className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeCastCrewMember(index)}
                        className="p-2 text-red-600 hover:text-red-700"
                        disabled={castCrew.length <= 1}
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Awards */}
            <div className="space-y-6 md:col-span-2">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-film-black-800">
                  Awards
                </h2>
                <button
                  type="button"
                  onClick={() => addItemToArray("awards")}
                  className="flex items-center text-sm text-film-red-600 dark:text-film-red-500 hover:text-film-red-700 dark:hover:text-film-red-400"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Award
                </button>
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {formData.awards.map((award, index) => (
                    <motion.div
                      key={`award-${index}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex gap-2"
                    >
                      <input
                        type="text"
                        value={award}
                        onChange={(e) => handleArrayInputChange(index, "awards", e.target.value)}
                        placeholder="e.g., Best Film - African Film Festival 2023"
                        className="flex-1 px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => removeItemFromArray("awards", index)}
                        className="p-2 text-red-600 hover:text-red-700"
                        disabled={formData.awards.length <= 1}
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Quotes */}
            <div className="space-y-6 md:col-span-2">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-film-black-800">
                  Critical Reception & Quotes
                </h2>
                <button
                  type="button"
                  onClick={addQuote}
                  className="flex items-center text-sm text-film-red-600 dark:text-film-red-500 hover:text-film-red-700 dark:hover:text-film-red-400"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Quote
                </button>
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {formData.quotes.map((quote, index) => (
                    <motion.div
                      key={`quote-${index}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="p-4 border border-gray-200 dark:border-film-black-800 rounded-lg"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-medium text-gray-900 dark:text-white">Quote #{index + 1}</h3>
                        <button
                          type="button"
                          onClick={() => removeQuote(index)}
                          className="p-1 text-red-600 hover:text-red-700"
                          disabled={formData.quotes.length <= 1}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <textarea
                            value={quote.text}
                            onChange={(e) => handleQuoteChange(index, 'text', e.target.value)}
                            placeholder="Quote text"
                            rows={3}
                            className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                          />
                        </div>
                        <div>
                          <input
                            type="text"
                            value={quote.source}
                            onChange={(e) => handleQuoteChange(index, 'source', e.target.value)}
                            placeholder="Source (e.g., Film Critic, Publication)"
                            className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-film-black-800 flex justify-end">
            <div className="flex gap-4">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <LoadingSpinner size="small" />
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Film
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const AdminCreateFilmPage = () => {
  return (
    <Suspense fallback={<CreateFilmLoading />}>
      <CreateFilmForm />
    </Suspense>
  )
}

export default AdminCreateFilmPage;

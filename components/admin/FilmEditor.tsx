import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Film, X, Upload, Plus, Trash2, Save, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

interface FilmFormData {
  title: string;
  slug: string;
  category: string;
  year: string;
  description: string;
  longDescription: string;
  image: string;
  director: string;
  producer: string;
  duration: string;
  languages: string[];
  subtitles: string[];
  gallery: string[];
  trailer: string;
  featured: boolean;
  rating: number;
}

interface FilmEditorProps {
  initialData?: Partial<FilmFormData>;
  isEditing?: boolean;
}

const FilmEditor: React.FC<FilmEditorProps> = ({
  initialData = {},
  isEditing = false
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState<FilmFormData>({
    title: '',
    slug: '',
    category: '',
    year: '',
    description: '',
    longDescription: '',
    image: '',
    director: '',
    producer: '',
    duration: '',
    languages: [],
    subtitles: [],
    gallery: [],
    trailer: '',
    featured: false,
    rating: 0,
    ...initialData
  });

  const [languageInput, setLanguageInput] = useState('');
  const [subtitleInput, setSubtitleInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewImage, setPreviewImage] = useState<string | null>(initialData.image || null);

  // Auto-generate slug from title
  useEffect(() => {
    if (formData.title && !isEditing) {
      const slug = formData.title
        .toLowerCase()
        .replace(/[^\w\s]/gi, '')
        .replace(/\s+/g, '-');
      setFormData({ ...formData, slug });
    }
  }, [formData.title, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you would upload the file to a storage service
      // Here we're just creating a local URL for preview
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setFormData({ ...formData, image: `${file.name}` }); // Pretend we got the URL back
    }
  };

  const addLanguage = () => {
    if (languageInput.trim() && !formData.languages.includes(languageInput.trim())) {
      setFormData({
        ...formData,
        languages: [...formData.languages, languageInput.trim()]
      });
      setLanguageInput('');
    }
  };

  const removeLanguage = (lang: string) => {
    setFormData({
      ...formData,
      languages: formData.languages.filter(l => l !== lang)
    });
  };

  const addSubtitle = () => {
    if (subtitleInput.trim() && !formData.subtitles.includes(subtitleInput.trim())) {
      setFormData({
        ...formData,
        subtitles: [...formData.subtitles, subtitleInput.trim()]
      });
      setSubtitleInput('');
    }
  };

  const removeSubtitle = (sub: string) => {
    setFormData({
      ...formData,
      subtitles: formData.subtitles.filter(s => s !== sub)
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required';
    if (!formData.category.trim()) newErrors.category = 'Category is required';
    if (!formData.year.trim()) newErrors.year = 'Year is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // In a real app, you would make an API call to save the film
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call

      // Redirect to the films list page after saving
      router.push('/admin/films');
    } catch (error) {
      console.error('Error saving film:', error);
      setErrors({ submit: 'Failed to save film. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-film-black-900 rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-200 dark:border-film-black-800 flex items-center justify-between">
        <div className="flex items-center">
          <Film className="h-6 w-6 text-film-red-600 mr-3" />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
            {isEditing ? 'Edit Film' : 'Create New Film'}
          </h1>
        </div>
        <Link
          href="/admin/films"
          className="flex items-center text-gray-600 dark:text-gray-400 hover:text-film-red-600 dark:hover:text-film-red-500"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Films
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="p-6">
        {errors.submit && (
          <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg">
            {errors.submit}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            {/* Title field */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg bg-white dark:bg-film-black-800 border ${errors.title
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-film-black-700 focus:ring-film-red-500'
                  } focus:outline-none focus:ring-2 dark:text-white`}
                placeholder="Enter film title"
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">{errors.title}</p>
              )}
            </div>

            {/* Slug field */}
            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Slug <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className={`w-full px-4 py-2 rounded-lg bg-white dark:bg-film-black-800 border ${errors.slug
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-film-black-700 focus:ring-film-red-500'
                  } focus:outline-none focus:ring-2 dark:text-white`}
                placeholder="film-title-slug"
              />
              {errors.slug && (
                <p className="mt-1 text-sm text-red-500">{errors.slug}</p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                URL-friendly version of the title, used in the film's URL
              </p>
            </div>

            {/* Two column layout for category and year */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg bg-white dark:bg-film-black-800 border ${errors.category
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 dark:border-film-black-700 focus:ring-film-red-500'
                    } focus:outline-none focus:ring-2 dark:text-white`}
                >
                  <option value="">Select category</option>
                  <option value="Documentary">Documentary</option>
                  <option value="Drama">Drama</option>
                  <option value="Feature">Feature</option>
                  <option value="Short Film">Short Film</option>
                  <option value="Animation">Animation</option>
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-500">{errors.category}</p>
                )}
              </div>

              <div>
                <label htmlFor="year" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Year <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 rounded-lg bg-white dark:bg-film-black-800 border ${errors.year
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 dark:border-film-black-700 focus:ring-film-red-500'
                    } focus:outline-none focus:ring-2 dark:text-white`}
                  placeholder="2023"
                />
                {errors.year && (
                  <p className="mt-1 text-sm text-red-500">{errors.year}</p>
                )}
              </div>
            </div>

            {/* Description field */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Short Description <span className="text-red-500">*</span>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className={`w-full px-4 py-2 rounded-lg bg-white dark:bg-film-black-800 border ${errors.description
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 dark:border-film-black-700 focus:ring-film-red-500'
                  } focus:outline-none focus:ring-2 dark:text-white`}
                placeholder="Brief description of the film"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-500">{errors.description}</p>
              )}
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                A short summary that will appear in film listings (150 characters recommended)
              </p>
            </div>

            {/* Long Description field */}
            <div>
              <label htmlFor="longDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Full Description
              </label>
              <textarea
                id="longDescription"
                name="longDescription"
                value={formData.longDescription}
                onChange={handleChange}
                rows={6}
                className="w-full px-4 py-2 rounded-lg bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 dark:text-white"
                placeholder="Detailed description of the film"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                Comprehensive description for the film's detail page
              </p>
            </div>

            {/* Rating and featured */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Rating (0-5)
                </label>
                <input
                  type="number"
                  id="rating"
                  name="rating"
                  value={formData.rating}
                  onChange={handleChange}
                  min="0"
                  max="5"
                  step="0.1"
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 dark:text-white"
                />
              </div>

              <div className="flex items-center pt-6">
                <input
                  type="checkbox"
                  id="featured"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleCheckboxChange}
                  className="w-5 h-5 text-film-red-600 rounded border-gray-300 focus:ring-film-red-500"
                />
                <label htmlFor="featured" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Feature on homepage
                </label>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Film Poster Image
              </label>
              <div className="relative border-2 border-dashed border-gray-300 dark:border-film-black-700 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 dark:bg-film-black-800/50 h-64">
                {previewImage ? (
                  <div className="relative w-full h-full">
                    <Image
                      src={previewImage}
                      alt="Film poster preview"
                      fill
                      className="object-contain rounded"
                    />
                    <button
                      type="button"
                      onClick={() => setPreviewImage(null)}
                      className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="h-10 w-10 text-gray-500 dark:text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">Drag & drop or click to upload</p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">JPG, PNG or GIF, max 5MB</p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className={!previewImage ? "absolute inset-0 opacity-0 cursor-pointer" : "hidden"}
                />
              </div>
            </div>

            {/* Director and Producer */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="director" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Director
                </label>
                <input
                  type="text"
                  id="director"
                  name="director"
                  value={formData.director}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 dark:text-white"
                  placeholder="Director name"
                />
              </div>

              <div>
                <label htmlFor="producer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Producer
                </label>
                <input
                  type="text"
                  id="producer"
                  name="producer"
                  value={formData.producer}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 dark:text-white"
                  placeholder="Producer name"
                />
              </div>
            </div>

            {/* Duration and Trailer */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Duration
                </label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 dark:text-white"
                  placeholder="e.g., 1h 45m"
                />
              </div>

              <div>
                <label htmlFor="trailer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Trailer URL
                </label>
                <input
                  type="url"
                  id="trailer"
                  name="trailer"
                  value={formData.trailer}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 dark:text-white"
                  placeholder="YouTube or Vimeo URL"
                />
              </div>
            </div>

            {/* Languages */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Languages
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={languageInput}
                  onChange={(e) => setLanguageInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                  className="flex-1 px-4 py-2 rounded-l-lg bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 dark:text-white"
                  placeholder="Add a language"
                />
                <button
                  type="button"
                  onClick={addLanguage}
                  className="bg-film-red-600 text-white px-4 py-2 rounded-r-lg hover:bg-film-red-700 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.languages.map((lang) => (
                  <span
                    key={lang}
                    className="px-3 py-1 bg-film-red-100 dark:bg-film-red-900/20 text-film-red-800 dark:text-film-red-300 rounded-full text-sm flex items-center"
                  >
                    {lang}
                    <button
                      type="button"
                      onClick={() => removeLanguage(lang)}
                      className="ml-1 text-film-red-800 dark:text-film-red-300 hover:text-film-red-900 dark:hover:text-film-red-200"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Subtitles */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Subtitles
              </label>
              <div className="flex items-center">
                <input
                  type="text"
                  value={subtitleInput}
                  onChange={(e) => setSubtitleInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSubtitle())}
                  className="flex-1 px-4 py-2 rounded-l-lg bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 dark:text-white"
                  placeholder="Add subtitles"
                />
                <button
                  type="button"
                  onClick={addSubtitle}
                  className="bg-film-red-600 text-white px-4 py-2 rounded-r-lg hover:bg-film-red-700 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {formData.subtitles.map((sub) => (
                  <span
                    key={sub}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-full text-sm flex items-center"
                  >
                    {sub}
                    <button
                      type="button"
                      onClick={() => removeSubtitle(sub)}
                      className="ml-1 text-blue-800 dark:text-blue-300 hover:text-blue-900 dark:hover:text-blue-200"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Form actions */}
        <div className="mt-10 pt-6 border-t border-gray-200 dark:border-film-black-800 flex justify-end space-x-4">
          <Link
            href="/admin/films"
            className="px-6 py-2 bg-gray-100 dark:bg-film-black-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-film-black-700 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-film-red-600 text-white rounded-lg hover:bg-film-red-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-5 w-5 mr-1" />
                {isEditing ? 'Update Film' : 'Create Film'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FilmEditor;

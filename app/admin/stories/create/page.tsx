"use client";
import { Suspense, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/UI/Button";
import { Save, ArrowLeft, Plus, X, Upload, Star, StarOff, Image as ImageIcon, Type, Quote, Heading, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import Image from "next/image";
import { StoryContent } from "@/types/mongodbSchema";

const CreateStoryLoading = () => (
  <div className="flex justify-center items-center h-64">
    <LoadingSpinner size="large" />
  </div>
);

// Main component that gets exported
const AdminCreateStoryPage = () => {
  return (
    <Suspense fallback={<CreateStoryLoading />}>
      <CreateStoryForm />
    </Suspense>
  );
};

// Separate the form to use useRouter inside Suspense
const CreateStoryForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: [
      { type: "paragraph", content: "" }
    ] as StoryContent[],
    author: "",
    date: new Date().toISOString().split('T')[0],
    image: "",
    category: "",
    readTime: "",
    featured: false
  });

  // Helper function to handle basic input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Toggle featured status
  const toggleFeatured = () => {
    setFormData({
      ...formData,
      featured: !formData.featured
    });
  };

  // Handle content changes
  const handleContentChange = (index: number, field: keyof StoryContent, value: string) => {
    const newContent = [...formData.content];
    newContent[index] = { ...newContent[index], [field]: value };
    setFormData({
      ...formData,
      content: newContent
    });
  };

  // Add content block
  const addContentBlock = (type: StoryContent['type']) => {
    let newBlock: StoryContent;

    switch (type) {
      case "heading":
        newBlock = { type: "heading", content: "" };
        break;
      case "image":
        newBlock = { type: "image", url: "", caption: "" };
        break;
      case "quote":
        newBlock = { type: "quote", content: "", attribution: "" };
        break;
      default:
        newBlock = { type: "paragraph", content: "" };
    }

    setFormData({
      ...formData,
      content: [...formData.content, newBlock]
    });
  };

  // Remove content block
  const removeContentBlock = (index: number) => {
    const newContent = [...formData.content];
    newContent.splice(index, 1);
    setFormData({
      ...formData,
      content: newContent.length > 0 ? newContent : [{ type: "paragraph", content: "" }]
    });
  };

  // Move content block up
  const moveContentBlockUp = (index: number) => {
    if (index === 0) return;
    const newContent = [...formData.content];
    const temp = newContent[index];
    newContent[index] = newContent[index - 1];
    newContent[index - 1] = temp;
    setFormData({
      ...formData,
      content: newContent
    });
  };

  // Move content block down
  const moveContentBlockDown = (index: number) => {
    if (index === formData.content.length - 1) return;
    const newContent = [...formData.content];
    const temp = newContent[index];
    newContent[index] = newContent[index + 1];
    newContent[index + 1] = temp;
    setFormData({
      ...formData,
      content: newContent
    });
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

  // Estimate read time based on content length
  const estimateReadTime = () => {
    // Count total words in content
    const totalWords = formData.content.reduce((acc, block) => {
      if (block.type === "paragraph" || block.type === "heading" || block.type === "quote") {
        return acc + (block.content?.split(/\s+/).length || 0);
      }
      return acc;
    }, 0);

    // Average reading speed: 200 words per minute
    const minutes = Math.max(1, Math.ceil(totalWords / 200));

    setFormData({
      ...formData,
      readTime: `${minutes} min read`
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create story');
      }

      router.push('/admin/stories');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handler to navigate back
  const navigateBack = () => {
    router.back();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            onClick={navigateBack}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-film-black-900"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Story</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setPreviewMode(!previewMode)}
              className={`px-3 py-1.5 text-sm font-medium rounded-md ${previewMode
                ? "bg-film-red-100 text-film-red-700 dark:bg-film-red-900/30 dark:text-film-red-300"
                : "bg-gray-100 text-gray-700 dark:bg-film-black-800 dark:text-gray-300"
                }`}
            >
              {previewMode ? "Edit Mode" : "Preview"}
            </button>
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
                Publish Story
              </>
            )}
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 p-4 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Main editor */}
        <div className={`lg:col-span-${previewMode ? "3" : "5"} bg-white dark:bg-film-black-900 rounded-xl shadow-sm overflow-hidden`}>
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white pb-4 mb-6 border-b border-gray-200 dark:border-film-black-800">
              Story Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
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

                <div className="md:col-span-2">
                  <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Excerpt<span className="text-red-600">*</span>
                  </label>
                  <textarea
                    id="excerpt"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="author" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Author<span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="author"
                    name="author"
                    value={formData.author}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Publication Date<span className="text-red-600">*</span>
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Featured Image URL<span className="text-red-600">*</span>
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
                  <label htmlFor="readTime" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Read Time
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      id="readTime"
                      name="readTime"
                      value={formData.readTime}
                      onChange={handleInputChange}
                      placeholder="e.g., 5 min read"
                      className="flex-1 px-4 py-2 rounded-l-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                    />
                    <button
                      type="button"
                      onClick={estimateReadTime}
                      className="px-4 py-2 bg-gray-100 dark:bg-film-black-700 border-y border-r border-gray-300 dark:border-film-black-600 rounded-r-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-film-black-600"
                    >
                      Estimate
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Featured Story
                  </label>
                  <button
                    type="button"
                    onClick={toggleFeatured}
                    className={`w-full px-4 py-2 rounded-md border ${formData.featured
                      ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-300"
                      : "bg-gray-50 dark:bg-film-black-800 border-gray-300 dark:border-film-black-700 text-gray-700 dark:text-gray-300"
                      } flex items-center justify-center`}
                  >
                    {formData.featured ? (
                      <>
                        <Star className="h-5 w-5 mr-2 fill-yellow-500 text-yellow-500 dark:fill-yellow-400 dark:text-yellow-400" />
                        Featured
                      </>
                    ) : (
                      <>
                        <StarOff className="h-5 w-5 mr-2 text-gray-400 dark:text-gray-500" />
                        Not Featured
                      </>
                    )}
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-4 pt-4 border-t border-gray-200 dark:border-film-black-800">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">Content</h3>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => addContentBlock("paragraph")}
                      className="p-1.5 bg-gray-100 dark:bg-film-black-800 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-film-black-700 flex items-center"
                      title="Add Paragraph"
                    >
                      <Type className="h-4 w-4 mr-1" />
                      <span className="text-xs">Text</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => addContentBlock("heading")}
                      className="p-1.5 bg-gray-100 dark:bg-film-black-800 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-film-black-700 flex items-center"
                      title="Add Heading"
                    >
                      <Heading className="h-4 w-4 mr-1" />
                      <span className="text-xs">Heading</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => addContentBlock("image")}
                      className="p-1.5 bg-gray-100 dark:bg-film-black-800 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-film-black-700 flex items-center"
                      title="Add Image"
                    >
                      <ImageIcon className="h-4 w-4 mr-1" />
                      <span className="text-xs">Image</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => addContentBlock("quote")}
                      className="p-1.5 bg-gray-100 dark:bg-film-black-800 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-film-black-700 flex items-center"
                      title="Add Quote"
                    >
                      <Quote className="h-4 w-4 mr-1" />
                      <span className="text-xs">Quote</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <AnimatePresence>
                    {formData.content.map((block, index) => (
                      <motion.div
                        key={`block-${index}`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="relative border border-gray-200 dark:border-film-black-700 rounded-lg p-4 pt-10"
                      >
                        <div className="absolute top-2 left-2 right-2 flex justify-between">
                          <div className="flex gap-1">
                            <span className={`text-xs px-2 py-1 rounded ${block.type === "paragraph" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" :
                              block.type === "heading" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" :
                                block.type === "image" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" :
                                  "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                              }`}>
                              {block.type.charAt(0).toUpperCase() + block.type.slice(1)}
                            </span>
                            <button
                              type="button"
                              onClick={() => moveContentBlockUp(index)}
                              disabled={index === 0}
                              className={`p-1 rounded ${index === 0
                                ? "text-gray-300 dark:text-gray-700"
                                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-film-black-800"
                                }`}
                              title="Move Up"
                            >
                              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            </button>
                            <button
                              type="button"
                              onClick={() => moveContentBlockDown(index)}
                              disabled={index === formData.content.length - 1}
                              className={`p-1 rounded ${index === formData.content.length - 1
                                ? "text-gray-300 dark:text-gray-700"
                                : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-film-black-800"
                                }`}
                              title="Move Down"
                            >
                              <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeContentBlock(index)}
                            className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                            title="Remove"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {block.type === "paragraph" && (
                          <div className="mt-2">
                            <textarea
                              value={block.content || ""}
                              onChange={(e) => handleContentChange(index, 'content', e.target.value)}
                              placeholder="Enter paragraph text..."
                              rows={4}
                              className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                            />
                          </div>
                        )}

                        {block.type === "heading" && (
                          <div className="mt-2">
                            <input
                              type="text"
                              value={block.content || ""}
                              onChange={(e) => handleContentChange(index, 'content', e.target.value)}
                              placeholder="Enter heading text..."
                              className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white font-bold text-lg"
                            />
                          </div>
                        )}

                        {block.type === "image" && (
                          <div className="mt-2 space-y-3">
                            <div className="flex">
                              <input
                                type="text"
                                value={block.url || ""}
                                onChange={(e) => handleContentChange(index, 'url', e.target.value)}
                                placeholder="Enter image URL..."
                                className="flex-1 px-4 py-2 rounded-l-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                              />
                              <button
                                type="button"
                                className="px-4 py-2 bg-gray-100 dark:bg-film-black-700 border-y border-r border-gray-300 dark:border-film-black-600 rounded-r-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-film-black-600"
                              >
                                <Upload className="h-5 w-5" />
                              </button>
                            </div>
                            <input
                              type="text"
                              value={block.caption || ""}
                              onChange={(e) => handleContentChange(index, 'caption', e.target.value)}
                              placeholder="Image caption (optional)..."
                              className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                            />
                            {block.url && (
                              <div className="relative h-48 w-full rounded-md overflow-hidden">
                                <Image
                                  src={block.url}
                                  alt={block.caption || "Story image"}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            )}
                          </div>
                        )}

                        {block.type === "quote" && (
                          <div className="mt-2 space-y-3">
                            <textarea
                              value={block.content || ""}
                              onChange={(e) => handleContentChange(index, 'content', e.target.value)}
                              placeholder="Enter quote text..."
                              rows={3}
                              className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white italic"
                            />
                            <input
                              type="text"
                              value={block.attribution || ""}
                              onChange={(e) => handleContentChange(index, 'attribution', e.target.value)}
                              placeholder="Attribution (optional)..."
                              className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                            />
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Preview panel */}
        {previewMode && (
          <div className="lg:col-span-2 bg-white dark:bg-film-black-900 rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white pb-4 mb-6 border-b border-gray-200 dark:border-film-black-800">
                Preview
              </h2>

              <div className="prose prose-lg dark:prose-invert max-w-none">
                {/* Hero image */}
                {formData.image && (
                  <div className="relative w-full h-60 mb-6 rounded-lg overflow-hidden">
                    <Image
                      src={formData.image}
                      alt={formData.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* Title and metadata */}
                <div className="mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">{formData.title || "Story Title"}</h1>

                  <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 gap-4">
                    {formData.author && (
                      <div className="flex items-center">
                        <span className="font-medium">{formData.author}</span>
                      </div>
                    )}
                    {formData.date && (
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-3.5 w-3.5" />
                        <span>{new Date(formData.date).toLocaleDateString()}</span>
                      </div>
                    )}
                    {formData.readTime && (
                      <span>{formData.readTime}</span>
                    )}
                    {formData.category && (
                      <span className="bg-gray-100 dark:bg-film-black-800 px-2 py-0.5 rounded-full text-xs">
                        {formData.category}
                      </span>
                    )}
                    {formData.featured && (
                      <span className="bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-2 py-0.5 rounded-full text-xs flex items-center">
                        <Star className="h-3 w-3 mr-1 fill-current" />
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                {/* Content blocks preview */}
                {formData.content.map((block, index) => {
                  if (block.type === "paragraph") {
                    return <p key={index} className="mb-6">{block.content || "Paragraph content will appear here..."}</p>;
                  } else if (block.type === "heading") {
                    return <h2 key={index} className="text-2xl font-bold mt-8 mb-4">{block.content || "Heading will appear here..."}</h2>;
                  } else if (block.type === "image" && block.url) {
                    return (
                      <figure key={index} className="my-8">
                        <div className="relative h-80 w-full rounded-xl overflow-hidden">
                          <Image
                            src={block.url}
                            alt={block.caption || ""}
                            fill
                            className="object-cover"
                          />
                        </div>
                        {block.caption && (
                          <figcaption className="mt-2 text-center text-sm text-gray-500 dark:text-gray-400 italic">
                            {block.caption}
                          </figcaption>
                        )}
                      </figure>
                    );
                  } else if (block.type === "quote") {
                    return (
                      <blockquote key={index} className="border-l-4 border-film-red-500 pl-4 py-2 my-6 italic">
                        <p className="text-xl">{block.content || "Quote text will appear here..."}</p>
                        {block.attribution && (
                          <footer className="text-right mt-2 text-gray-600 dark:text-gray-400 not-italic">
                            — {block.attribution}
                          </footer>
                        )}
                      </blockquote>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-film-black-800 flex justify-end">
        <div className="flex gap-4">
          <Button
            variant="outline"
            type="button"
            onClick={navigateBack}
          >
            Cancel
          </Button>
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
                Publish Story
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};



export default AdminCreateStoryPage;

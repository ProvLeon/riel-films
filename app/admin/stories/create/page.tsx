"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/UI/Button";
import { Save, ArrowLeft, Plus, X, Upload, Star, StarOff, Image as ImageIcon, Type, Quote, Heading, Calendar, Trash2, Eye, Edit, MoveUp, MoveDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import Image from "next/image";
import { StoryContent } from "@/types/mongodbSchema";
import { Alert, AlertDescription, AlertTitle } from "@/components/UI/Alert";

const AdminCreateStoryPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [isAddingBlock, setIsAddingBlock] = useState(false);

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
    // Type assertion for safety
    (newContent[index] as any)[field] = value;
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
    setIsAddingBlock(false); // Close the add block menu
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
    [newContent[index - 1], newContent[index]] = [newContent[index], newContent[index - 1]];
    setFormData({ ...formData, content: newContent });
  };

  // Move content block down
  const moveContentBlockDown = (index: number) => {
    if (index === formData.content.length - 1) return;
    const newContent = [...formData.content];
    [newContent[index + 1], newContent[index]] = [newContent[index], newContent[index + 1]];
    setFormData({ ...formData, content: newContent });
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
    const totalWords = formData.content.reduce((acc, block) => {
      if (block.type === "paragraph" || block.type === "heading" || block.type === "quote") {
        return acc + (block.content?.split(/\s+/).filter(Boolean).length || 0);
      }
      return acc;
    }, 0);

    const minutes = Math.max(1, Math.ceil(totalWords / 200));
    setFormData({ ...formData, readTime: `${minutes} min read` });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Simple validation
    if (!formData.title || !formData.slug || !formData.excerpt || !formData.author || !formData.date || !formData.image || !formData.category) {
      setError("Please fill in all required fields marked with *");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/stories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-film-black-800 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Story</h1>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
          <Button
            variant={previewMode ? "secondary" : "outline"}
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
            icon={previewMode ? <Edit size={16} /> : <Eye size={16} />}
          >
            {previewMode ? "Edit Mode" : "Preview"}
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            disabled={isSubmitting}
            icon={<Save size={16} />}
          >
            Publish Story
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Main editor layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Form */}
        <motion.div
          className={`lg:col-span-2 space-y-6`}
          initial={false}
          animate={{ width: previewMode ? "66.66%" : "100%" }} // Adjust width based on preview mode
        >
          <div className="bg-white dark:bg-film-black-900 rounded-xl shadow-sm border border-gray-100 dark:border-film-black-800 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white pb-4 mb-6 border-b border-gray-200 dark:border-film-black-800">
              Story Details
            </h2>
            <form className="space-y-6">
              {/* Title, Slug, Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="title" className="input-label">Title<span className="text-red-500">*</span></label>
                  <input type="text" id="title" name="title" value={formData.title} onChange={handleInputChange} onBlur={generateSlug} className="input-field" required />
                </div>
                <div>
                  <label htmlFor="slug" className="input-label">Slug<span className="text-red-500">*</span></label>
                  <input type="text" id="slug" name="slug" value={formData.slug} onChange={handleInputChange} className="input-field" required />
                </div>
                <div>
                  <label htmlFor="category" className="input-label">Category<span className="text-red-500">*</span></label>
                  <input type="text" id="category" name="category" value={formData.category} onChange={handleInputChange} className="input-field" required />
                </div>
                <div>
                  <label htmlFor="image" className="input-label">Featured Image URL<span className="text-red-500">*</span></label>
                  <div className="flex">
                    <input type="text" id="image" name="image" value={formData.image} onChange={handleInputChange} placeholder="https://..." className="input-field rounded-r-none" required />
                    <button type="button" className="button-icon rounded-l-none">
                      <Upload size={18} />
                    </button>
                  </div>
                </div>
              </div>
              {/* Excerpt */}
              <div>
                <label htmlFor="excerpt" className="input-label">Excerpt<span className="text-red-500">*</span></label>
                <textarea id="excerpt" name="excerpt" value={formData.excerpt} onChange={handleInputChange} rows={3} className="input-field" required />
              </div>
              {/* Author, Date, Read Time */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label htmlFor="author" className="input-label">Author<span className="text-red-500">*</span></label>
                  <input type="text" id="author" name="author" value={formData.author} onChange={handleInputChange} className="input-field" required />
                </div>
                <div>
                  <label htmlFor="date" className="input-label">Date<span className="text-red-500">*</span></label>
                  <input type="date" id="date" name="date" value={formData.date} onChange={handleInputChange} className="input-field" required />
                </div>
                <div>
                  <label htmlFor="readTime" className="input-label">Read Time</label>
                  <div className="flex">
                    <input type="text" id="readTime" name="readTime" value={formData.readTime} onChange={handleInputChange} placeholder="e.g., 5 min read" className="input-field rounded-r-none" />
                    <button type="button" onClick={estimateReadTime} className="button-icon rounded-l-none">Est.</button>
                  </div>
                </div>
              </div>
              {/* Featured Toggle */}
              <div>
                <label className="input-label">Featured Story</label>
                <Button
                  type="button"
                  variant={formData.featured ? "secondary" : "outline"}
                  onClick={toggleFeatured}
                  className={`w-full justify-center ${formData.featured ? 'border-yellow-500 bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-700' : ''}`}
                  icon={formData.featured ? <Star size={16} className="fill-current" /> : <StarOff size={16} />}
                >
                  {formData.featured ? "Featured" : "Mark as Featured"}
                </Button>
              </div>
            </form>
          </div>

          {/* Content Editor */}
          <div className="bg-white dark:bg-film-black-900 rounded-xl shadow-sm border border-gray-100 dark:border-film-black-800 p-6">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-film-black-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Story Content</h2>
              {/* Add Block Button */}
              <div className="relative">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsAddingBlock(!isAddingBlock)}
                  icon={<Plus size={16} />}
                >
                  Add Block
                </Button>
                <AnimatePresence>
                  {isAddingBlock && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-40 bg-white dark:bg-film-black-800 rounded-lg shadow-lg border border-gray-100 dark:border-film-black-700 z-10 p-2"
                    >
                      <button onClick={() => addContentBlock("paragraph")} className="button-menu-item"> <Type size={16} /> Paragraph </button>
                      <button onClick={() => addContentBlock("heading")} className="button-menu-item"> <Heading size={16} /> Heading </button>
                      <button onClick={() => addContentBlock("image")} className="button-menu-item"> <ImageIcon size={16} /> Image </button>
                      <button onClick={() => addContentBlock("quote")} className="button-menu-item"> <Quote size={16} /> Quote </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Content Blocks */}
            <div className="space-y-6">
              <AnimatePresence initial={false}>
                {formData.content.map((block, index) => (
                  <motion.div
                    key={`block-${index}`} // Consider using a more stable key if possible
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="relative border border-gray-200 dark:border-film-black-700 rounded-lg p-4 pt-12 bg-gray-50/50 dark:bg-film-black-800/30 group"
                  >
                    {/* Block controls */}
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => moveContentBlockUp(index)} disabled={index === 0} className="button-control" title="Move Up"><MoveUp size={14} /></button>
                      <button onClick={() => moveContentBlockDown(index)} disabled={index === formData.content.length - 1} className="button-control" title="Move Down"><MoveDown size={14} /></button>
                      <button onClick={() => removeContentBlock(index)} className="button-control text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30" title="Remove"><Trash2 size={14} /></button>
                    </div>
                    <span className="absolute top-3 left-3 text-xs font-medium px-2 py-1 rounded bg-gray-200 dark:bg-film-black-700 text-gray-600 dark:text-gray-300 capitalize">
                      {block.type}
                    </span>

                    {/* Block content based on type */}
                    {block.type === "paragraph" && (
                      <textarea value={block.content || ""} onChange={(e) => handleContentChange(index, 'content', e.target.value)} placeholder="Enter paragraph..." rows={5} className="input-field mt-2" />
                    )}
                    {block.type === "heading" && (
                      <input type="text" value={block.content || ""} onChange={(e) => handleContentChange(index, 'content', e.target.value)} placeholder="Enter heading..." className="input-field mt-2 text-xl font-semibold" />
                    )}
                    {block.type === "image" && (
                      <div className="mt-2 space-y-3">
                        <div className="flex">
                          <input type="text" value={block.url || ""} onChange={(e) => handleContentChange(index, 'url', e.target.value)} placeholder="Image URL..." className="input-field rounded-r-none" />
                          <button type="button" className="button-icon rounded-l-none"><Upload size={18} /></button>
                        </div>
                        <input type="text" value={block.caption || ""} onChange={(e) => handleContentChange(index, 'caption', e.target.value)} placeholder="Caption (optional)..." className="input-field" />
                        {block.url && (
                          <div className="relative h-48 w-full rounded-md overflow-hidden border border-gray-200 dark:border-film-black-700">
                            <Image src={block.url} alt={block.caption || "Story image"} fill className="object-cover" />
                          </div>
                        )}
                      </div>
                    )}
                    {block.type === "quote" && (
                      <div className="mt-2 space-y-3">
                        <textarea value={block.content || ""} onChange={(e) => handleContentChange(index, 'content', e.target.value)} placeholder="Quote text..." rows={3} className="input-field italic" />
                        <input type="text" value={block.attribution || ""} onChange={(e) => handleContentChange(index, 'attribution', e.target.value)} placeholder="Attribution (optional)..." className="input-field" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Preview Panel */}
        <AnimatePresence>
          {previewMode && (
            <motion.div
              className="lg:col-span-1"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "33.33%" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-white dark:bg-film-black-900 rounded-xl shadow-sm border border-gray-100 dark:border-film-black-800 h-[calc(100vh-12rem)] overflow-y-auto sticky top-24">
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white pb-4 mb-6 border-b border-gray-200 dark:border-film-black-800">
                    Live Preview
                  </h2>
                  <div className="prose dark:prose-invert max-w-none">
                    {formData.image && (
                      <div className="relative aspect-video mb-6 rounded-lg overflow-hidden">
                        <Image src={formData.image} alt={formData.title || "Preview"} fill className="object-cover" />
                      </div>
                    )}
                    <h1 className="text-2xl font-bold mb-3">{formData.title || "Story Title"}</h1>
                    <div className="flex flex-wrap items-center text-sm text-gray-500 dark:text-gray-400 gap-x-4 gap-y-1 mb-6">
                      <span>By {formData.author || "Author"}</span>
                      <span>{formData.date ? new Date(formData.date).toLocaleDateString() : "Date"}</span>
                      <span>{formData.readTime || "Read Time"}</span>
                    </div>
                    {formData.content.map((block, index) => {
                      if (block.type === "paragraph") return <p key={index}>{block.content || "..."}</p>;
                      if (block.type === "heading") return <h2 key={index}>{block.content || "Heading"}</h2>;
                      if (block.type === "image" && block.url) return (
                        <figure key={index} className="my-6">
                          <Image src={block.url} alt={block.caption || ""} width={800} height={450} className="rounded-lg object-cover" />
                          {block.caption && <figcaption className="text-center italic text-sm mt-2">{block.caption}</figcaption>}
                        </figure>
                      );
                      if (block.type === "quote") return (
                        <blockquote key={index} className="border-l-4 border-film-red-500 pl-4 italic my-6">
                          <p>{block.content || "Quote text..."}</p>
                          {block.attribution && <footer className="text-right not-italic">— {block.attribution}</footer>}
                        </blockquote>
                      );
                      return null;
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Final Actions */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-film-black-800 flex justify-end">
        <div className="flex gap-4">
          <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            disabled={isSubmitting}
            icon={<Save size={16} />}
          >
            Publish Story
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminCreateStoryPage;

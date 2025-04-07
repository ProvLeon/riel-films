"use client";
import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/UI/Button";
import { Save, ArrowLeft, Upload, Star, StarOff, Eye, Edit } from "lucide-react";
import { motion } from "framer-motion";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import { useStory } from "@/hooks/useStory"; // Import useStory hook
import { Alert, AlertDescription, AlertTitle } from "@/components/UI/Alert";
import TiptapEditor from "@/components/admin/TiptapEditor"; // Import TiptapEditor
import { Story, StoryContent } from "@/types/mongodbSchema";
import ImageUploader from "@/components/admin/ImageUploader"; // Import ImageUploader
import { InputField, TextareaField } from "@/app/admin/productions/create/formHelpers";
// import { InputField, TextareaField } from '@/app/admin/productions/create/formHelpers'; // Re-use helpers

// Helper function to convert structured content to HTML
const convertContentToHtml = (content: StoryContent[] | undefined | null): string => {
  if (!Array.isArray(content)) return "";
  try {
    return content.map(block => {
      switch (block.type) {
        case 'heading': return `<h2 style="font-family: var(--font-montserrat); font-weight: bold; font-size: 1.5em; margin-top: 1.5em; margin-bottom: 0.5em;">${block.content || ''}</h2>`;
        case 'image':
          let imgHtml = `<img src="${block.url || ''}" alt="${block.caption || ''}" style="max-width: 100%; height: auto; border-radius: 8px; margin: 1em 0;" />`;
          if (block.caption) imgHtml += `<figcaption style="text-align: center; font-style: italic; font-size: 0.9em; color: #666;">${block.caption}</figcaption>`;
          return `<figure style="margin: 1.5em 0;">${imgHtml}</figure>`;
        case 'quote':
          let quoteHtml = `<p style="font-style: italic; font-size: 1.1em; margin-bottom: 0.5em;">${block.content || ''}</p>`;
          if (block.attribution) quoteHtml += `<footer style="text-align: right; font-style: normal; font-size: 0.9em; color: #555;">— ${block.attribution}</footer>`;
          return `<blockquote style="border-left: 4px solid var(--film-red-500); padding-left: 1em; margin: 1.5em 0; color: #444; background-color: #f9f9f9; border-radius: 0 8px 8px 0;">${quoteHtml}</blockquote>`;
        case 'paragraph': default: return `<p>${block.content || ''}</p>`;
      }
    }).join('');
  } catch (e) {
    console.error("Error converting content to HTML:", e);
    return ""; // Return empty string on error
  }
};


const EditStoryLoading = () => (
  <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
    <LoadingSpinner size="large" />
  </div>
);

const EditStoryForm = ({ storyId }: { storyId: string }) => {
  const router = useRouter();
  const { story, isLoading, error: storyError, refetch } = useStory(storyId); // Fetch story by ID
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Main form data state
  const [formData, setFormData] = useState<Partial<Story>>({
    title: "", slug: "", excerpt: "",
    author: "", date: new Date(), image: "", category: "", readTime: "", featured: false,
    // Initialize content structure if API expects it, otherwise can be empty
    content: [{ type: "paragraph", content: "" }],
  });

  // Separate state for Tiptap editor's HTML content
  const [tiptapHtmlContent, setTiptapHtmlContent] = useState<string>("");

  // Populate form and Tiptap state when story data loads
  useEffect(() => {
    if (story) {
      // Convert initial structured content to HTML for Tiptap
      const initialHtml = convertContentToHtml(story.content);
      setTiptapHtmlContent(initialHtml);

      // Set the main form data
      setFormData({
        ...story, // Spread fetched data first
        date: story.date ? new Date(story.date) : new Date(), // Ensure date is a Date object
        // Store the content in the format expected by the API (assuming it's the simplified single block structure)
        // If API expects the *original* structure, this needs adjustment
        content: [{ type: "paragraph", content: initialHtml }],
      });
    }
  }, [story]); // Run only when story data changes

  // --- Handlers ---
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
    setError(null);
  }, []);

  const handleDateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, date: new Date(e.target.value) }));
    setError(null);
  }, []);

  // Handle content change from Tiptap
  const handleContentChange = useCallback((newContentHtml: string) => {
    // Update the dedicated Tiptap state
    setTiptapHtmlContent(newContentHtml);
    // Update the main formData state (using the simplified structure for now)
    setFormData(prev => ({
      ...prev,
      content: [{ type: 'paragraph', content: newContentHtml }]
    }));
    setError(null);
  }, []);

  // Slug Generation
  const generateSlug = useCallback(() => {
    if (formData.title) {
      const slug = formData.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  }, [formData.title]);

  // Estimate read time based on Tiptap's current HTML
  const estimateReadTime = useCallback(() => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = tiptapHtmlContent || ""; // Use Tiptap's state
    const textContent = tempDiv.textContent || tempDiv.innerText || "";
    const wordCount = textContent.split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.ceil(wordCount / 200));
    setFormData(prev => ({ ...prev, readTime: `${minutes} min read` }));
  }, [tiptapHtmlContent]); // Depend on Tiptap's state

  // Image Uploader Handlers
  const handleImageUpdate = useCallback((url: string) => {
    setFormData(prev => ({ ...prev, image: url }));
  }, []);
  const handleImageRemove = useCallback(() => {
    setFormData(prev => ({ ...prev, image: "" }));
  }, []);
  // --- End Handlers ---

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    // Validation
    const requiredFields: (keyof Story)[] = ['title', 'slug', 'excerpt', 'author', 'date', 'image', 'category'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      setIsSubmitting(false);
      return;
    }
    // Basic check if content seems empty
    if (!tiptapHtmlContent || tiptapHtmlContent === '<p></p>') {
      setError("Please add content to the story.");
      setIsSubmitting(false);
      return;
    }

    // Prepare data for API: Omit fields that shouldn't be updated directly
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _id, createdAt, updatedAt, ...updateData } = formData;

    // Ensure date is ISO string and content is in the expected format
    const dataToSend = {
      ...updateData,
      date: formData.date instanceof Date ? formData.date.toISOString() : new Date().toISOString(), // Send date as ISO string
      // Send the content from formData (which reflects Tiptap's latest state)
      content: formData.content,
    };


    try {
      const response = await fetch(`/api/stories/id/${storyId}`, { // Use ID-based PATCH endpoint
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend), // Send the prepared data
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update story');
      }
      router.push('/admin/stories?success=updated'); // Redirect on success
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Loading and Error States ---
  if (isLoading) return <EditStoryLoading />;
  if (storyError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <Alert variant="destructive" className="max-w-lg">
          <AlertTitle>Error Loading Story</AlertTitle>
          <AlertDescription>{storyError}</AlertDescription>
        </Alert>
        <div className="mt-6 flex gap-4">
          <Button variant="secondary" onClick={() => router.push('/admin/stories')}>Back to List</Button>
          <Button variant="primary" onClick={() => refetch()}>Try Again</Button>
        </div>
      </div>
    );
  }
  if (!story) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <Alert variant="destructive" className="max-w-lg">
          <AlertTitle>Story Not Found</AlertTitle>
          <AlertDescription>The requested story could not be found.</AlertDescription>
        </Alert>
        <Button variant="secondary" onClick={() => router.push('/admin/stories')} className="mt-6">
          Back to Stories List
        </Button>
      </div>
    );
  }
  // --- End Loading/Error ---

  return (
    <div className="space-y-8 p-4 md:p-6"> {/* Add padding */}
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center">
          <button onClick={() => router.back()} className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-film-black-800 transition-colors" aria-label="Go back">
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white line-clamp-3 max-w-[52ch]">
            Edit Story: {formData.title || "Loading..."} class
          </h1>
        </div>
        <div className="flex items-center gap-4 w-full sm:w-auto justify-end">
          {story.slug && (
            <a href={`/stories/${story.slug}`} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="sm" icon={<Eye size={16} />}>Preview</Button>
            </a>
          )}
          <Button variant="primary" onClick={handleSubmit} isLoading={isSubmitting} disabled={isSubmitting} icon={<Save size={16} />}>Update Story</Button>
        </div>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Editor Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Story Details Card */}
            <div className="bg-white dark:bg-film-black-900 rounded-xl shadow-sm border border-gray-100 dark:border-film-black-800 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white pb-4 mb-6 border-b border-gray-200 dark:border-film-black-800 flex items-center gap-2"><Edit size={18} /> Story Details</h2>
              <div className="space-y-6">
                {/* Title, Slug, Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Re-using InputField component */}
                  <InputField id="title" name="title" label="Title" required value={formData.title || ''} onChange={handleInputChange} onBlur={generateSlug} />
                  <InputField id="slug" name="slug" label="Slug" required value={formData.slug || ''} onChange={handleInputChange} />
                  <InputField id="category" name="category" label="Category" required value={formData.category || ''} onChange={handleInputChange} />
                  {/* ImageUploader integrated */}
                  <div>
                    <label className="label-style">Featured Image<span className="text-red-500">*</span></label>
                    <ImageUploader
                      label="" // Hide redundant label if desired
                      currentImageUrl={formData.image}
                      onUploadComplete={handleImageUpdate}
                      onRemoveComplete={handleImageRemove}
                      required={true}
                      aspectRatio="aspect-video"
                      recommendedText="16:9 Recommended"
                    />
                  </div>
                </div>
                {/* Re-using TextareaField component */}
                <TextareaField id="excerpt" name="excerpt" label="Excerpt" required rows={3} value={formData.excerpt || ''} onChange={handleInputChange} />
              </div>
            </div>

            {/* Content Editor Card */}
            <div className="bg-white dark:bg-film-black-900 rounded-xl shadow-sm border border-gray-100 dark:border-film-black-800 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white pb-4 mb-6 border-b border-gray-200 dark:border-film-black-800">Story Content</h2>
              <TiptapEditor
                // Pass the dedicated HTML state
                content={tiptapHtmlContent}
                onChange={handleContentChange}
                placeholder="Write your story here..."
              />
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-film-black-900 rounded-xl shadow-sm border border-gray-100 dark:border-film-black-800 p-6 sticky top-24">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white pb-4 mb-6 border-b border-gray-200 dark:border-film-black-800">Metadata & Status</h2>
              <div className="space-y-6">
                {/* Author, Date, Read Time */}
                <InputField id="author" name="author" label="Author" required value={formData.author || ''} onChange={handleInputChange} />
                <InputField id="date" name="date" label="Date" required type="date" value={formData.date ? new Date(formData.date).toISOString().split('T')[0] : ''} onChange={handleDateChange} />

                <div>
                  <label htmlFor="readTime" className="label-style">Read Time</label>
                  <div className="flex">
                    <input type="text" id="readTime" name="readTime" value={formData.readTime || ''} onChange={handleInputChange} placeholder="e.g., 5 min read" className="input-style rounded-r-none" />
                    <button type="button" onClick={estimateReadTime} title="Estimate Read Time" className="button-icon rounded-l-none">Est.</button>
                  </div>
                </div>
                {/* Featured Toggle */}
                <div>
                  <label className="label-style">Featured Story</label>
                  <Button type="button" variant={formData.featured ? "secondary" : "outline"} onClick={() => handleInputChange({ target: { name: 'featured', type: 'checkbox', checked: !formData.featured } } as any)} className={`w-full justify-center ${formData.featured ? 'border-yellow-500 bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-700' : ''}`} icon={formData.featured ? <Star size={16} className="fill-current" /> : <StarOff size={16} />}>{formData.featured ? "Featured" : "Mark as Featured"}</Button>
                </div>
              </div>
              {/* Final Actions in Sidebar */}
              <div className="mt-8 pt-6 border-t border-gray-200 dark:border-film-black-800 flex flex-col gap-3">
                <Button variant="primary" type="submit" isLoading={isSubmitting} disabled={isSubmitting} icon={<Save size={16} />}>Update Story</Button>
                <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

// Wrapper component for the page
const AdminEditStoryPage = ({ params }: { params: { id: string } }) => {
  const { id } = React.use(params); // Use React.use for Server Components
  if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
    return <div className="p-8 text-center text-red-600">Error: Invalid story identifier.</div>;
  }
  return (
    <Suspense fallback={<EditStoryLoading />}>
      <EditStoryForm storyId={id} />
    </Suspense>
  );
};

// Add shared styles if not global
const styles = `
  .label-style { @apply block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1; }
  .input-style { @apply w-full px-4 py-2 rounded-lg bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white shadow-sm; }
  .button-icon { @apply px-4 py-2 bg-gray-100 dark:bg-film-black-700 border-y border-r border-gray-300 dark:border-film-black-600 rounded-r-lg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-film-black-600 transition-colors; }
  .button-control { @apply p-1.5 rounded-lg bg-gray-100 dark:bg-film-black-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-film-black-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors; }
  .button-menu-item { @apply flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-film-black-700 rounded-md; }
`;
if (typeof window !== 'undefined') { const styleSheet = document.createElement("style"); styleSheet.innerText = styles; document.head.appendChild(styleSheet); }

export default AdminEditStoryPage;

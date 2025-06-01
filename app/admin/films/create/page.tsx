"use client";
import { Suspense, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/UI/Button";
import { Save, ArrowLeft, Plus, X, Upload, Star, StarOff, Image as ImageIcon, Film, Users, Quote, Type, Calendar as CalendarIcon, Clock as ClockIcon, Award } from "lucide-react"; // Added more icons
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/UI/Alert";
import ImageUploader from '@/components/admin/ImageUploader'; // Import the component
import { CldImage } from "next-cloudinary";

const CreateFilmLoading = () => (
  <div className="flex justify-center items-center min-h-screen">
    <LoadingSpinner size="large" />
  </div>
);

// --- Reusable Input Components (Keep as internal or move to separate file) ---
const InputField = ({ id, label, required = false, errorField, formData, ...props }: any) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label}{required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      id={id}
      name={id}
      className={`w-full px-4 py-2 rounded-lg bg-white dark:bg-film-black-800 border ${errorField && !formData[id] ? 'border-red-500' : 'border-gray-300 dark:border-film-black-700'} focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white shadow-sm`}
      {...props}
    />
  </div>
);

const TextareaField = ({ id, label, required = false, errorField, formData, ...props }: any) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label}{required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <textarea
      id={id}
      name={id}
      className={`w-full px-4 py-2 rounded-lg bg-white dark:bg-film-black-800 border ${errorField && !formData[id] ? 'border-red-500' : 'border-gray-300 dark:border-film-black-700'} focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white shadow-sm`}
      {...props}
    />
  </div>
);

const ArrayInputSection = ({ fieldName, label, placeholder, items, addItem, removeItem, handleItemChange }: any) => (
  <div>
    <div className="flex justify-between items-center mb-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <button
        type="button"
        onClick={() => addItem(fieldName)}
        className="flex items-center text-sm text-film-red-600 dark:text-film-red-500 hover:text-film-red-700 dark:hover:text-film-red-400 font-medium"
      >
        <Plus className="h-4 w-4 mr-1" /> Add
      </button>
    </div>
    <div className="space-y-3">
      <AnimatePresence>
        {items.map((item: any, index: number) => (
          <motion.div
            key={`${fieldName}-${index}`} // Stable key based on index
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="flex gap-2 items-center"
          >
            <input
              type="text"
              value={item}
              onChange={(e) => handleItemChange(index, fieldName, e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
            />
            <button
              type="button"
              onClick={() => removeItem(fieldName, index)}
              className="p-2 text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              disabled={items.length <= 1 && (fieldName === 'languages' || fieldName === 'subtitles')} // Keep minimum item logic
            >
              <X className="h-5 w-5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  </div>
);
// --- End Reusable Components ---

const CreateFilmForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({}); // For field-specific errors

  const [formData, setFormData] = useState({
    title: "", slug: "", category: "", year: "", description: "", longDescription: "",
    image: "", director: "", producer: "", duration: "", languages: [""], subtitles: [""],
    releaseDate: "", awards: [""], gallery: [] as string[], trailer: "", synopsis: "",
    quotes: [{ text: "", source: "" }], rating: 0, featured: false, castCrew: [{ role: "", name: "" }]
  });

  // --- Handlers using useCallback ---
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : type === 'number' ? parseFloat(value) || 0 : value;
    setFormData(prev => ({ ...prev, [name]: val }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' })); // Clear specific error
    setError(null);
  }, [errors]);

  const handleArrayInputChange = useCallback((index: number, fieldName: keyof Pick<typeof formData, 'languages' | 'subtitles' | 'awards' | 'gallery'>, value: string) => {
    setFormData(prev => {
      // Ensure the field exists and is an array
      const currentArray = Array.isArray(prev[fieldName]) ? prev[fieldName] : [];
      const newArray = [...currentArray];
      newArray[index] = value;
      return { ...prev, [fieldName]: newArray };
    });
  }, []);

  const addItemToArray = useCallback((fieldName: keyof Pick<typeof formData, 'languages' | 'subtitles' | 'awards' | 'gallery'>) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: [...(Array.isArray(prev[fieldName]) ? prev[fieldName] : []), ""]
    }));
  }, []);

  const removeItemFromArray = useCallback((fieldName: keyof Pick<typeof formData, 'languages' | 'subtitles' | 'awards' | 'gallery'>, index: number) => {
    setFormData(prev => {
      // Ensure the field exists and is an array
      const currentArray = Array.isArray(prev[fieldName]) ? prev[fieldName] : [];
      const newArray = [...currentArray];
      if (newArray.length > 1 || (fieldName !== 'languages' && fieldName !== 'subtitles')) {
        newArray.splice(index, 1);
        // Keep at least one empty string if needed for specific fields after removal
        if (newArray.length === 0 && (fieldName === 'languages' || fieldName === 'subtitles' || fieldName === 'awards' || fieldName === 'gallery')) {
          return { ...prev, [fieldName]: [""] };
        }
        return { ...prev, [fieldName]: newArray };
      }
      return prev; // Don't remove if only one item left (unless it's gallery etc.)
    });
  }, []);


  const handleQuoteChange = useCallback((index: number, field: 'text' | 'source', value: string) => { /* ... */ }, []);
  const addQuote = useCallback(() => setFormData(prev => ({ ...prev, quotes: [...prev.quotes, { text: "", source: "" }] })), []);
  const removeQuote = useCallback((index: number) => { /* ... */ }, []);
  const handleCastCrewChange = useCallback((index: number, field: 'role' | 'name', value: string) => { /* ... */ }, []);
  const addCastCrewMember = useCallback(() => setFormData(prev => ({ ...prev, castCrew: [...prev.castCrew, { role: "", name: "" }] })), []);
  const removeCastCrewMember = useCallback((index: number) => { /* ... */ }, []);

  // Slug Generation
  const generateSlug = useCallback(() => {
    const slug = formData.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    setFormData(prev => ({ ...prev, slug }));
  }, [formData.title]);

  // Image Handlers using ImageUploader callbacks
  const handlePosterUpload = useCallback((url: string) => {
    setFormData(prev => ({ ...prev, image: url }));
    if (errors.image) setErrors(prev => ({ ...prev, image: '' }));
  }, [errors.image]);

  const handlePosterRemove = useCallback(() => {
    setFormData(prev => ({ ...prev, image: '' }));
  }, []);

  const handleGalleryUpload = useCallback((url: string) => {
    setFormData(prev => ({ ...prev, gallery: [...prev.gallery, url] }));
  }, []);

  const handleGalleryRemove = useCallback((index: number) => {
    setFormData(prev => {
      const newGallery = [...prev.gallery];
      newGallery.splice(index, 1);
      return { ...prev, gallery: newGallery };
    });
  }, []);
  // --- End Handlers ---


  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const requiredFields: (keyof typeof formData)[] = ['title', 'slug', 'category', 'year', 'description', 'image', 'director', 'producer', 'duration', 'releaseDate', 'synopsis'];
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`;
      }
    });
    // Add specific URL validation if needed (Zod handles this on API)
    if (formData.trailer && !formData.trailer.startsWith('http')) {
      newErrors.trailer = 'Please enter a valid URL for the trailer.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      setError("Please fix the errors in the form.");
      // Optionally scroll to the first error
      const firstErrorKey = Object.keys(errors).find(key => errors[key]);
      if (firstErrorKey) {
        const errorElement = document.getElementById(firstErrorKey);
        errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/films', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to create film (Status: ${response.status})`);
      }
      router.push('/admin/films?success=created'); // Add success param
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <button onClick={() => router.back()} className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-film-black-900 transition-colors" aria-label="Go back"><ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" /></button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Add New Film</h1>
        </div>
      </div>

      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-6">
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="bg-white dark:bg-film-black-900 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-film-black-800">
          <div className="p-6 md:p-8 space-y-10">

            {/* Basic Information Section */}
            <section>
              <h2 className="section-heading flex items-center">
                <Type className="icon-style" /> Basic Information
              </h2>
              {/* ... Title, Slug, Category, Year ... */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Use InputField/TextareaField components, passing errors */}
                <InputField id="title" label="Title" required value={formData.title} onChange={handleInputChange} onBlur={generateSlug} errorField={errors.title} formData={formData} />
                <InputField id="slug" label="Slug" required value={formData.slug} onChange={handleInputChange} errorField={errors.slug} formData={formData} />
                <div>
                  <label htmlFor="category" className="label-style">Category<span className="text-red-600 ml-1">*</span></label>
                  <select id="category" name="category" value={formData.category} onChange={handleInputChange} className={`input-style ${errors.category ? 'border-red-500' : ''}`} required>
                    {/* Options */}
                    <option value="Documentary">Documentary</option>
                    <option value="Drama">Drama</option>
                    <option value="In Production">In Production</option>
                    <option value="Post-Production">Post-Production</option>
                    <option value="Completed">Completed</option>
                  </select>
                  {errors.category && <p className="form-error">{errors.category}</p>}
                </div>
                <InputField id="year" label="Year" required type="number" value={formData.year} onChange={handleInputChange} errorField={errors.year} formData={formData} />
                <div className="md:col-span-2"><TextareaField id="description" label="Short Description" required rows={3} value={formData.description} onChange={handleInputChange} errorField={errors.description} formData={formData} /></div>
                <div className="md:col-span-2"><TextareaField id="longDescription" label="Long Description / About" rows={5} value={formData.longDescription} onChange={handleInputChange} /></div>
                <div className="md:col-span-2"><TextareaField id="synopsis" label="Synopsis" required rows={4} value={formData.synopsis} onChange={handleInputChange} errorField={errors.synopsis} formData={formData} /></div>
              </div>
            </section>

            {/* Media Section */}
            <section>
              <h2 className="section-heading"><ImageIcon className="icon-style" /> Media</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <ImageUploader
                    label="Main Film Poster *"
                    currentImageUrl={formData.image}
                    onUploadComplete={handlePosterUpload}
                    onRemoveComplete={handlePosterRemove}
                    required={true}
                    recommendedText="16:9 ratio recommended, max 5MB"
                    aspectRatio="aspect-video"
                  />
                  {errors.image && <p className="form-error">{errors.image}</p>}
                </div>
                <InputField id="trailer" label="Trailer URL (YouTube/Vimeo)" type="url" value={formData.trailer || ''} onChange={handleInputChange} errorField={errors.trailer} formData={formData} placeholder="https://youtube.com/..." />
              </div>
              {/* Gallery Uploader Section */}
              <div className="mt-8">
                <label className="label-style mb-2">Gallery Images</label>
                <div className="mb-4 p-4 border border-dashed border-gray-300 dark:border-film-black-700 rounded-lg bg-gray-50 dark:bg-film-black-800/50">
                  <ImageUploader
                    label="Add Image to Gallery"
                    currentImageUrl={null} // Pass null to indicate adding mode
                    onUploadComplete={handleGalleryUpload}
                    onRemoveComplete={() => { }} // No remove action needed for the uploader itself
                    recommendedText="Upload additional images (Max 5MB each)"
                    aspectRatio="aspect-video"
                  />
                </div>
                {/* Display uploaded gallery images */}
                <AnimatePresence>
                  {formData.gallery && formData.gallery.length > 0 && (
                    <div className="flex flex-wrap gap-3">
                      {formData.gallery.map((url, index) => (
                        <motion.div
                          key={url + index}
                          layout
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                          className="relative w-28 h-28 rounded-md overflow-hidden border dark:border-film-black-700 group"
                        >
                          <CldImage src={url} alt={`Gallery ${index + 1}`} fill className="object-cover" />
                          <button
                            type="button"
                            onClick={() => handleGalleryRemove(index)}
                            className="absolute top-1 right-1 bg-red-600/80 hover:bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                            aria-label="Remove image"
                          >
                            <X size={14} />
                          </button>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </section>

            {/* Production Details Section */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white pb-3 mb-6 border-b border-gray-200 dark:border-film-black-800 flex items-center"><Film className="h-5 w-5 mr-2 text-film-red-500" /> Production Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  id="director"
                  label="Director"
                  required
                  value={formData.director}
                  onChange={handleInputChange}
                  errorField={error}
                  formData={formData} />
                <InputField id="producer"
                  label="Producer"
                  required
                  value={formData.producer}
                  onChange={handleInputChange}
                  errorField={error}
                  formData={formData} />
                <InputField id="duration" label="Duration" required value={formData.duration} onChange={handleInputChange} placeholder="e.g., 1h 45m" errorField={error} formData={formData} />
                <InputField id="releaseDate" label="Release Date" required type="date" value={formData.releaseDate} onChange={handleInputChange} errorField={error} formData={formData} />
                <InputField id="rating" label="Rating (0-5)" required type="number" min="0" max="5" step="0.1" value={formData.rating} onChange={handleInputChange} />
                {/* Enhanced Featured Toggle */}
                <div className="flex items-center pt-7">
                  <label htmlFor="featured" className="flex items-center cursor-pointer">
                    <div className="relative">
                      <input type="checkbox" id="featured" name="featured" checked={formData.featured} onChange={handleInputChange} className="sr-only" />
                      <div className={`block w-14 h-8 rounded-full transition ${formData.featured ? 'bg-film-red-600' : 'bg-gray-200 dark:bg-film-black-700'}`}></div>
                      <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${formData.featured ? 'translate-x-6' : ''}`}></div>
                    </div>
                    <div className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                      Feature this film? {formData.featured ? <Star size={16} className="inline ml-1 text-yellow-500" /> : <StarOff size={16} className="inline ml-1 text-gray-400" />}
                    </div>
                  </label>
                </div>
                <div className="md:col-span-2"><ArrayInputSection fieldName="languages" label="Languages" placeholder="e.g., English" items={formData.languages} addItem={addItemToArray} removeItem={removeItemFromArray} handleItemChange={handleArrayInputChange} /></div>
                <div className="md:col-span-2"><ArrayInputSection fieldName="subtitles" label="Subtitles" placeholder="e.g., French" items={formData.subtitles} addItem={addItemToArray} removeItem={removeItemFromArray} handleItemChange={handleArrayInputChange} /></div>
              </div>
            </section>

            {/* Cast & Crew Section */}
            <section>
              <div className="flex justify-between items-center pb-3 mb-6 border-b border-gray-200 dark:border-film-black-800">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center"><Users className="h-5 w-5 mr-2 text-film-red-500" /> Cast & Crew</h2>
                <button type="button" onClick={addCastCrewMember} className="flex items-center text-sm text-film-red-600 dark:text-film-red-500 hover:text-film-red-700 dark:hover:text-film-red-400 font-medium"><Plus className="h-4 w-4 mr-1" />Add Member</button>
              </div>
              <div className="space-y-4">
                <AnimatePresence>
                  {formData.castCrew.map((member, index) => (
                    <motion.div key={`crew-${index}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="flex flex-col md:flex-row gap-4 items-start md:items-center border border-gray-200 dark:border-film-black-700 p-4 rounded-lg bg-gray-50/50 dark:bg-film-black-800/30">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        <InputField id={`role-${index}`} label={`Role`} value={member.role} onChange={(e: any) => handleCastCrewChange(index, 'role', e.target.value)} placeholder="e.g., Lead Actor" />
                        <InputField id={`name-${index}`} label={`Name`} value={member.name} onChange={(e: any) => handleCastCrewChange(index, 'name', e.target.value)} placeholder="e.g., Adwoa Aboah" />
                      </div>
                      <button type="button" onClick={() => removeCastCrewMember(index)} className="p-2 text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed self-end md:self-center mt-2 md:mt-0 md:mb-1" disabled={formData.castCrew.length <= 1}><X className="h-5 w-5" /></button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </section>

            {/* Awards Section */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white pb-3 mb-6 border-b border-gray-200 dark:border-film-black-800 flex items-center"><Award className="h-5 w-5 mr-2 text-film-red-500" /> Awards & Recognition</h2>
              <ArrayInputSection fieldName="awards" label="" placeholder="e.g., Best Documentary - AMAA 2023" items={formData.awards} addItem={addItemToArray} removeItem={removeItemFromArray} handleItemChange={handleArrayInputChange} />
            </section>

            {/* Quotes Section */}
            <section>
              <div className="flex justify-between items-center pb-3 mb-6 border-b border-gray-200 dark:border-film-black-800">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center"><Quote className="h-5 w-5 mr-2 text-film-red-500" /> Quotes & Reception</h2>
                <button type="button" onClick={addQuote} className="flex items-center text-sm text-film-red-600 dark:text-film-red-500 hover:text-film-red-700 dark:hover:text-film-red-400 font-medium"><Plus className="h-4 w-4 mr-1" />Add Quote</button>
              </div>
              <div className="space-y-4">
                <AnimatePresence>
                  {formData.quotes.map((quote, index) => (
                    <motion.div key={`quote-${index}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="p-4 border border-gray-200 dark:border-film-black-700 rounded-lg space-y-4 bg-gray-50/50 dark:bg-film-black-800/30">
                      <div className="flex justify-between items-center"><h3 className="font-medium text-gray-900 dark:text-white">Quote #{index + 1}</h3><button type="button" onClick={() => removeQuote(index)} className="p-1 text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed" disabled={formData.quotes.length <= 1}><X className="h-4 w-4" /></button></div>
                      <TextareaField id={`quote-text-${index}`} label="Quote Text" rows={3} value={quote.text} onChange={(e: any) => handleQuoteChange(index, 'text', e.target.value)} />
                      <InputField id={`quote-source-${index}`} label="Source" value={quote.source} onChange={(e: any) => handleQuoteChange(index, 'source', e.target.value)} placeholder="e.g., Variety Magazine" />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </section>

          </div>

          {/* Form Actions */}
          <div className="p-6 md:p-8 mt-8 border-t border-gray-200 dark:border-film-black-800 flex justify-end">
            <div className="flex gap-4">
              <Button variant="secondary" type="button" onClick={() => router.back()} disabled={isSubmitting}>Cancel</Button>
              <Button variant="primary" type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
                {!isSubmitting && <Save className="mr-2 h-4 w-4" />}
                Create Film
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

const AdminCreateFilmPage = () => (
  <Suspense fallback={<CreateFilmLoading />}>
    <CreateFilmForm />
  </Suspense>
);

export default AdminCreateFilmPage;

// Add styles for better visual appearance (inline or in globals.css)
const styles = `
.button-icon { @apply px-4 py-2 bg-gray-100 dark:bg-film-black-700 border-y border-r border-gray-300 dark:border-film-black-600 rounded-r-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-film-black-600 transition-colors; }
.button-control { @apply p-1.5 rounded-lg bg-gray-100 dark:bg-film-black-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-film-black-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors; }
.button-menu-item { @apply flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-film-black-700 rounded-md; }
`;
if (typeof window !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

"use client"
import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/UI/Button";
import { Save, ArrowLeft, Plus, X, Upload, ImageIcon, Type, Quote, Heading, Calendar as CalendarIcon, Trash2, Eye, Edit, MoveUp, MoveDown, Star, StarOff, Users as UsersIcon, Award, Film } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import { useFilm } from "@/hooks/useFilm";
import { Alert, AlertDescription, AlertTitle } from "@/components/UI/Alert";

const EditFilmLoading = () => (
  <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
    <LoadingSpinner size="large" />
  </div>
);

// --- Reusable Input Components (Copied from Create page for consistency) ---
const InputField = ({ id, label, required = false, errorField, formData, ...props }: any) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {label}{required && <span className="text-red-600 ml-1">*</span>}
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
      {label}{required && <span className="text-red-600 ml-1">*</span>}
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
              value={item || ""} // Ensure value is not undefined/null
              onChange={(e) => handleItemChange(index, fieldName, e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
            />
            <button
              type="button"
              onClick={() => removeItem(fieldName, index)}
              className="p-2 text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
              disabled={items.length <= 1 && (fieldName === 'languages' || fieldName === 'subtitles')}
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

const EditFilmForm = ({ filmId }: { filmId: string }) => { // Receive ID instead of slug
  const router = useRouter();
  const { film, isLoading, error: filmError, refetch } = useFilm(filmId); // Use ID with the hook
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "", slug: "", category: "", year: "", description: "", longDescription: "",
    image: "", director: "", producer: "", duration: "", languages: [""], subtitles: [""],
    releaseDate: "", awards: [""], gallery: [""], trailer: "", synopsis: "",
    quotes: [{ text: "", source: "" }], rating: 0, featured: false, castCrew: [{ role: "", name: "" }]
  });

  // Initialize form data when film is loaded
  useEffect(() => {
    if (film) {
      const ensureArray = (arr: any[] | undefined, defaultVal: any) => (arr && Array.isArray(arr) && arr.length > 0) ? arr : [defaultVal];
      const ensureObjectArray = (arr: any[] | undefined, defaultVal: any) => (arr && Array.isArray(arr) && arr.length > 0) ? arr : [defaultVal];

      setFormData({
        title: film.title || "",
        slug: film.slug || "",
        category: film.category || "",
        year: film.year || "",
        description: film.description || "",
        longDescription: film.longDescription || "",
        image: film.image || "",
        director: film.director || "",
        producer: film.producer || "",
        duration: film.duration || "",
        languages: ensureArray(film.languages, ""),
        subtitles: ensureArray(film.subtitles, ""),
        releaseDate: film.releaseDate ? new Date(film.releaseDate).toISOString().split('T')[0] : "",
        awards: ensureArray(film.awards, ""),
        gallery: ensureArray(film.gallery, ""),
        trailer: film.trailer || "",
        synopsis: film.synopsis || "",
        // Ensure quotes and castCrew are arrays of objects
        quotes: ensureObjectArray(film.quotes as any[], { text: "", source: "" }),
        rating: film.rating || 0,
        featured: film.featured || false,
        castCrew: ensureObjectArray(film.castCrew as any[], { role: "", name: "" }),
      });
    }
  }, [film]);


  // --- Handlers (Use useCallback for stability) ---
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // @ts-ignore
    const val = type === 'checkbox' ? e.target.checked : type === 'number' ? parseFloat(value) || 0 : value;
    setFormData(prev => ({ ...prev, [name]: val }));
    setError(null); // Clear global error on input change
  }, []);

  const handleArrayInputChange = useCallback((index: number, fieldName: keyof Pick<typeof formData, 'languages' | 'subtitles' | 'awards' | 'gallery'>, value: string) => {
    setFormData(prev => {
      const newArray = [...prev[fieldName]];
      newArray[index] = value;
      return { ...prev, [fieldName]: newArray };
    });
  }, []);

  const addItemToArray = useCallback((fieldName: keyof Pick<typeof formData, 'languages' | 'subtitles' | 'awards' | 'gallery'>) => {
    setFormData(prev => ({ ...prev, [fieldName]: [...prev[fieldName], ""] }));
  }, []);

  const removeItemFromArray = useCallback((fieldName: keyof Pick<typeof formData, 'languages' | 'subtitles' | 'awards' | 'gallery'>, index: number) => {
    setFormData(prev => {
      const newArray = [...prev[fieldName]];
      newArray.splice(index, 1);
      return { ...prev, [fieldName]: newArray.length > 0 ? newArray : [""] };
    });
  }, []);

  const handleQuoteChange = useCallback((index: number, field: 'text' | 'source', value: string) => {
    setFormData(prev => {
      const newQuotes = [...prev.quotes];
      newQuotes[index] = { ...newQuotes[index], [field]: value };
      return { ...prev, quotes: newQuotes };
    });
  }, []);

  const addQuote = useCallback(() => setFormData(prev => ({ ...prev, quotes: [...prev.quotes, { text: "", source: "" }] })), []);
  const removeQuote = useCallback((index: number) => {
    setFormData(prev => {
      const newQuotes = [...prev.quotes];
      newQuotes.splice(index, 1);
      return { ...prev, quotes: newQuotes.length > 0 ? newQuotes : [{ text: "", source: "" }] };
    });
  }, []);

  const handleCastCrewChange = useCallback((index: number, field: 'role' | 'name', value: string) => {
    setFormData(prev => {
      const newCastCrew = [...prev.castCrew];
      newCastCrew[index] = { ...newCastCrew[index], [field]: value };
      return { ...prev, castCrew: newCastCrew };
    });
  }, []);

  const addCastCrewMember = useCallback(() => setFormData(prev => ({ ...prev, castCrew: [...prev.castCrew, { role: "", name: "" }] })), []);
  const removeCastCrewMember = useCallback((index: number) => {
    setFormData(prev => {
      const newCastCrew = [...prev.castCrew];
      newCastCrew.splice(index, 1);
      return { ...prev, castCrew: newCastCrew.length > 0 ? newCastCrew : [{ role: "", name: "" }] };
    });
  }, []);
  // --- End Handlers ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const requiredFields: (keyof typeof formData)[] = ['title', 'slug', 'category', 'year', 'description', 'image', 'director', 'producer', 'duration', 'releaseDate', 'synopsis'];
    const missingFields = requiredFields.filter(field => !formData[field]);

    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      setIsSubmitting(false);
      return;
    }

    try {
      if (!filmId) throw new Error("Film ID is missing for update.");

      const response = await fetch(`/api/films/id/${filmId}`, { // Use ID-based endpoint
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update film');
      }
      router.push('/admin/films');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Loading and Error States ---
  if (isLoading) return <EditFilmLoading />;
  if (filmError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <Alert variant="destructive" className="max-w-lg">
          <AlertTitle>Error Loading Film</AlertTitle>
          <AlertDescription>{filmError}</AlertDescription>
        </Alert>
        <div className="mt-6 flex gap-4">
          <Button variant="secondary" onClick={() => router.push('/admin/films')}>Back to List</Button>
          <Button variant="primary" onClick={() => refetch()}>Try Again</Button>
        </div>
      </div>
    );
  }
  if (!film) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <Alert variant="destructive" className="max-w-lg">
          <AlertTitle>Film Not Found</AlertTitle>
          <AlertDescription>The requested film could not be found.</AlertDescription>
        </Alert>
        <Button variant="secondary" onClick={() => router.push('/admin/films')} className="mt-6">
          Back to Films List
        </Button>
      </div>
    );
  }
  // --- End Loading/Error ---

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <button onClick={() => router.back()} className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-film-black-900 transition-colors" aria-label="Go back"><ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" /></button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white truncate">Edit Film: {formData.title || "Loading..."}</h1>
        </div>
        <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting} isLoading={isSubmitting}>
          {!isSubmitting && <Save className="mr-2 h-4 w-4" />}
          Update Film
        </Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <div className="bg-white dark:bg-film-black-900 rounded-xl shadow-sm overflow-hidden border border-gray-100 dark:border-film-black-800">
          <div className="p-6 md:p-8 space-y-10">

            {/* --- Sections (Copied structure from Create page for consistency) --- */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white pb-3 mb-6 border-b border-gray-200 dark:border-film-black-800 flex items-center"><Edit className="h-5 w-5 mr-2 text-film-red-500" /> Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField id="title" label="Title" required value={formData.title} onChange={handleInputChange} errorField={error} formData={formData} />
                <InputField id="slug" label="Slug" required value={formData.slug} onChange={handleInputChange} errorField={error} formData={formData} />
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category<span className="text-red-600 ml-1">*</span></label>
                  <select id="category" name="category" value={formData.category} onChange={handleInputChange} className={`w-full px-4 py-2 rounded-lg bg-white dark:bg-film-black-800 border ${error && !formData.category ? 'border-red-500' : 'border-gray-300 dark:border-film-black-700'} focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white shadow-sm`} required>
                    <option value="">Select category</option>
                    <option value="Documentary">Documentary</option>
                    <option value="Feature Film">Feature Film</option>
                    <option value="Short Film">Short Film</option>
                    <option value="Animation">Animation</option>
                    <option value="Series">Series</option>
                  </select>
                </div>
                <InputField id="year" label="Year" required type="number" value={formData.year} onChange={handleInputChange} errorField={error} formData={formData} />
                <div className="md:col-span-2"><TextareaField id="description" label="Short Description" required rows={3} value={formData.description} onChange={handleInputChange} errorField={error} formData={formData} /></div>
                <div className="md:col-span-2"><TextareaField id="longDescription" label="Long Description / About" rows={5} value={formData.longDescription} onChange={handleInputChange} /></div>
                <div className="md:col-span-2"><TextareaField id="synopsis" label="Synopsis" required rows={4} value={formData.synopsis} onChange={handleInputChange} errorField={error} formData={formData} /></div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white pb-3 mb-6 border-b border-gray-200 dark:border-film-black-800 flex items-center"><ImageIcon className="h-5 w-5 mr-2 text-film-red-500" /> Media</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Main Image URL<span className="text-red-600 ml-1">*</span></label>
                  <div className="flex">
                    <input type="text" id="image" name="image" value={formData.image} onChange={handleInputChange} placeholder="https://..." className={`flex-1 px-4 py-2 rounded-l-md bg-white dark:bg-film-black-800 border ${error && !formData.image ? 'border-red-500' : 'border-gray-300 dark:border-film-black-700'} focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white`} required />
                    <button type="button" className="px-4 py-2 bg-gray-100 dark:bg-film-black-700 border-y border-r border-gray-300 dark:border-film-black-600 rounded-r-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-film-black-600"><Upload className="h-5 w-5" /></button>
                  </div>
                </div>
                <InputField id="trailer" label="Trailer URL" type="url" value={formData.trailer} onChange={handleInputChange} placeholder="https://youtube.com/..." />
              </div>
              <div className="mt-6"><ArrayInputSection fieldName="gallery" label="Gallery Images" placeholder="https://image-url.com/..." items={formData.gallery} addItem={addItemToArray} removeItem={removeItemFromArray} handleItemChange={handleArrayInputChange} /></div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white pb-3 mb-6 border-b border-gray-200 dark:border-film-black-800 flex items-center"><Film className="h-5 w-5 mr-2 text-film-red-500" /> Production Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField id="director" label="Director" required value={formData.director} onChange={handleInputChange} errorField={error} formData={formData} />
                <InputField id="producer" label="Producer" required value={formData.producer} onChange={handleInputChange} errorField={error} formData={formData} />
                <InputField id="duration" label="Duration" required value={formData.duration} onChange={handleInputChange} placeholder="e.g., 1h 45m" errorField={error} formData={formData} />
                <InputField id="releaseDate" label="Release Date" required type="date" value={formData.releaseDate} onChange={handleInputChange} errorField={error} formData={formData} />
                <InputField id="rating" label="Rating (0-5)" required type="number" min="0" max="5" step="0.1" value={formData.rating} onChange={handleInputChange} errorField={error} formData={formData} />
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

            <section>
              <div className="flex justify-between items-center pb-3 mb-6 border-b border-gray-200 dark:border-film-black-800">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center"><UsersIcon className="h-5 w-5 mr-2 text-film-red-500" /> Cast & Crew</h2>
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

            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white pb-3 mb-6 border-b border-gray-200 dark:border-film-black-800 flex items-center"><Award className="h-5 w-5 mr-2 text-film-red-500" /> Awards & Recognition</h2>
              <ArrayInputSection fieldName="awards" label="" placeholder="e.g., Best Documentary - AMAA 2023" items={formData.awards} addItem={addItemToArray} removeItem={removeItemFromArray} handleItemChange={handleArrayInputChange} />
            </section>

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
            {/* --- End Sections --- */}

          </div>

          {/* Form Actions */}
          <div className="p-6 md:p-8 mt-8 border-t border-gray-200 dark:border-film-black-800 flex justify-end">
            <div className="flex gap-4">
              <Button variant="secondary" type="button" onClick={() => router.back()} disabled={isSubmitting}>Cancel</Button>
              <Button variant="primary" type="submit" disabled={isSubmitting} isLoading={isSubmitting}>
                {!isSubmitting && <Save className="mr-2 h-4 w-4" />}
                Update Film
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

// Wrapper component for the page
const AdminEditFilmPage = ({ params }: { params: { id: string } }) => {
  // The slug param is used to fetch the ID initially, but we use the ID for updates/deletes.
  // The useFilm hook needs to handle fetching by slug/ID as appropriate.
  // For simplicity here, we assume the 'slug' parameter might actually be the ID.
  // A better approach would be to have the edit route use `[id]` instead of `[slug]`.
  // Let's adjust the page to expect an ID directly.
  const filmId = params?.id;

  if (!filmId) {
    return <div className="p-8 text-center text-red-600">Error: Missing film identifier.</div>;
  }

  return (
    <Suspense fallback={<EditFilmLoading />}>
      <EditFilmForm filmId={filmId} />
    </Suspense>
  );
};

export default AdminEditFilmPage;

// Add styles for better visual appearance
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

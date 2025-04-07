"use client";
import { useState, useCallback, Suspense } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/UI/Button";
import { Save, ArrowLeft, Plus, X, Upload, Star, StarOff, User, MapPin, HelpCircle, Edit3, FileText, DollarSign, Milestone, Calendar, Clock, Users, Percent } from "lucide-react"; // Added Percent
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import { Alert, AlertDescription, AlertTitle } from "@/components/UI/Alert";
import { InputField, TextareaField } from './formHelpers'; // Assume these are extracted
import ImageUploader from "@/components/admin/ImageUploader";

const AdminCreateProductionLoading = () => (
  <div className="flex justify-center items-center min-h-screen">
    <LoadingSpinner size="large" />
  </div>
);

const AdminCreateProductionForm = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Initial form state - ensuring all fields match the schema
  const [formData, setFormData] = useState({
    title: "", slug: "", category: "", status: "Development", description: "",
    longDescription: "", image: "", director: "", producer: "", cinematographer: "",
    editor: "", timeline: "", startDate: "", estimatedCompletion: "", locations: [""],
    logline: "", synopsis: "", featured: false, progress: 0,
    team: [{ name: "", role: "", bio: "", image: "" }],
    stages: [{ name: "Development", status: "upcoming" as const, milestones: [""] }],
    faq: [{ question: "", answer: "" }],
    updates: [{ date: "", title: "", content: "", image: "" }],
    supportOptions: [{ title: "", investment: "", description: "", perks: [""] }]
  });

  // --- Handlers (Use useCallback for stability) ---
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // @ts-ignore
    const val = type === 'checkbox' ? e.target.checked : type === 'number' ? parseInt(value, 10) || 0 : value;
    setFormData(prev => ({ ...prev, [name]: val }));
    setError(null); // Clear error on change
  }, []);

  const handleNestedArrayChange = useCallback((arrayName: keyof typeof formData, index: number, field: string, value: any) => {
    setFormData(prev => {
      const newArray = [...(prev[arrayName] as any[])];
      if (newArray[index]) { // Check if the item exists
        newArray[index] = { ...newArray[index], [field]: value };
        return { ...prev, [arrayName]: newArray };
      }
      return prev; // Return previous state if index is invalid
    });
  }, []);

  const handleNestedArrayItemChange = useCallback((arrayName: keyof typeof formData, arrayIndex: number, nestedArrayName: string, nestedIndex: number, value: string) => {
    setFormData(prev => {
      const newArray = [...(prev[arrayName] as any[])];
      if (newArray[arrayIndex]) { // Check if the item exists
        const nestedArray = [...(newArray[arrayIndex][nestedArrayName] || [])]; // Ensure nested array exists
        if (nestedArray[nestedIndex] !== undefined) { // Check if nested item exists
          nestedArray[nestedIndex] = value;
          newArray[arrayIndex] = { ...newArray[arrayIndex], [nestedArrayName]: nestedArray };
          return { ...prev, [arrayName]: newArray };
        }
      }
      return prev; // Return previous state if index is invalid
    });
  }, []);

  const addItemToNestedArray = useCallback((arrayName: keyof typeof formData, index: number, nestedArrayName: string, defaultItem: any = "") => {
    setFormData(prev => {
      const newArray = [...(prev[arrayName] as any[])];
      if (newArray[index]) { // Check if parent item exists
        const currentNested = newArray[index][nestedArrayName] || []; // Ensure nested array exists
        newArray[index] = { ...newArray[index], [nestedArrayName]: [...currentNested, defaultItem] };
        return { ...prev, [arrayName]: newArray };
      }
      return prev; // Return previous state if index is invalid
    });
  }, []);

  const removeItemFromNestedArray = useCallback((arrayName: keyof typeof formData, arrayIndex: number, nestedArrayName: string, nestedIndex: number) => {
    setFormData(prev => {
      const newArray = [...(prev[arrayName] as any[])];
      if (newArray[arrayIndex]) { // Check if parent item exists
        const nestedArray = [...(newArray[arrayIndex][nestedArrayName] || [])];
        if (nestedArray.length > 1 && nestedArray[nestedIndex] !== undefined) { // Ensure we don't remove the last item
          nestedArray.splice(nestedIndex, 1);
          newArray[arrayIndex] = { ...newArray[arrayIndex], [nestedArrayName]: nestedArray };
          return { ...prev, [arrayName]: newArray };
        }
      }
      return prev; // Return previous state if index is invalid or only one item left
    });
  }, []);

  const addArrayItem = useCallback((fieldName: keyof typeof formData, defaultItem: any = "") => {
    // Provide default structures based on fieldName
    if (fieldName === 'team') defaultItem = { name: "", role: "", bio: "", image: "" };
    else if (fieldName === 'stages') defaultItem = { name: "", status: "upcoming", milestones: [""] };
    else if (fieldName === 'faq') defaultItem = { question: "", answer: "" };
    else if (fieldName === 'updates') defaultItem = { date: "", title: "", content: "", image: "" };
    else if (fieldName === 'supportOptions') defaultItem = { title: "", investment: "", description: "", perks: [""] };

    setFormData(prev => ({ ...prev, [fieldName]: [...(prev[fieldName] as any[]), defaultItem] }));
  }, []);

  const removeArrayItem = useCallback((fieldName: keyof typeof formData, index: number, minItems = 1) => {
    setFormData(prev => {
      const newArray = [...(prev[fieldName] as any[])];
      if (newArray.length > minItems) {
        newArray.splice(index, 1);
        return { ...prev, [fieldName]: newArray };
      }
      return prev; // Don't remove if it violates minItems
    });
  }, []);

  const handleImageUpload = useCallback((url: string) => {
    setFormData(prev => ({ ...prev, image: url }));
  }, []);

  const handleImageRemove = useCallback(() => {
    setFormData(prev => ({ ...prev, image: '' }));
  }, []);

  const generateSlug = useCallback(() => {
    const slug = formData.title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-').replace(/^-+|-+$/g, '');
    setFormData(prev => ({ ...prev, slug }));
  }, [formData.title]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const requiredFields: (keyof typeof formData)[] = ['title', 'slug', 'category', 'status', 'description', 'image', 'director', 'producer', 'logline', 'synopsis'];
    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      setError(`Please fill in all required fields: ${missingFields.join(', ')}`);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/productions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create production');
      }
      router.push('/admin/productions');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <button onClick={() => router.back()} className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-film-black-900 transition-colors" aria-label="Go back"><ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" /></button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Production</h1>
        </div>
        <Button variant="primary" onClick={handleSubmit} disabled={isSubmitting} isLoading={isSubmitting}>
          {!isSubmitting && <Save className="h-4 w-4 mr-2" />}
          Save Production
        </Button>
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

            {/* --- Basic Information Section --- */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white pb-3 mb-6 border-b border-gray-200 dark:border-film-black-800 flex items-center"><Edit3 className="h-5 w-5 mr-2 text-film-red-500" /> Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2"><InputField id="title" label="Title" required value={formData.title} onChange={handleInputChange} onBlur={generateSlug} errorField={error} formData={formData} /></div>
                <InputField id="slug" label="Slug" required value={formData.slug} onChange={handleInputChange} errorField={error} formData={formData} />
                <InputField id="category" label="Category" required value={formData.category} onChange={handleInputChange} errorField={error} formData={formData} />
                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status<span className="text-red-600 ml-1">*</span></label>
                  <select id="status" name="status" value={formData.status} onChange={handleInputChange} className="input-style" required>
                    <option value="Development">Development</option>
                    <option value="Pre-Production">Pre-Production</option>
                    <option value="In Production">In Production</option>
                    <option value="Post-Production">Post-Production</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <InputField id="progress" label="Progress (%)" required type="number" min="0" max="100" value={formData.progress} onChange={handleInputChange} errorField={error} formData={formData} icon={<Percent size={16} className="input-icon" />} />
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Featured Production</label>
                  <button type="button" onClick={() => handleInputChange({ target: { name: 'featured', type: 'checkbox', checked: !formData.featured } } as any)} className={`w-full px-4 py-2 rounded-md border ${formData.featured ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-700 text-yellow-800 dark:text-yellow-300" : "bg-gray-50 dark:bg-film-black-800 border-gray-300 dark:border-film-black-700 text-gray-700 dark:text-gray-300"} flex items-center justify-center`}><Star className={`h-5 w-5 mr-2 ${formData.featured ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'}`} /> {formData.featured ? 'Featured' : 'Not Featured'}</button>
                </div>
                <div className="md:col-span-2">
                  <ImageUploader
                    label="Featured Image *"
                    currentImageUrl={formData.image}
                    onUploadComplete={handleImageUpload}
                    onRemoveComplete={handleImageRemove}
                    required={true}
                    recommendedText="16:9 ratio recommended"
                    aspectRatio="aspect-video"
                  />
                  {error && <p className="text-red-500">{error}</p>}
                </div>
                <div className="md:col-span-2"><TextareaField id="description" label="Short Description" required rows={3} value={formData.description} onChange={handleInputChange} errorField={error} formData={formData} /></div>
                <div className="md:col-span-2"><TextareaField id="longDescription" label="Long Description" rows={5} value={formData.longDescription} onChange={handleInputChange} /></div>
                <div className="md:col-span-2"><TextareaField id="logline" label="Logline" required rows={2} value={formData.logline} onChange={handleInputChange} errorField={error} formData={formData} /></div>
                <div className="md:col-span-2"><TextareaField id="synopsis" label="Synopsis" required rows={4} value={formData.synopsis} onChange={handleInputChange} errorField={error} formData={formData} /></div>
              </div>
            </section>

            {/* --- Crew Information Section --- */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white pb-3 mb-6 border-b border-gray-200 dark:border-film-black-800 flex items-center"><User className="h-5 w-5 mr-2 text-film-red-500" /> Crew Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField id="director" label="Director" required value={formData.director} onChange={handleInputChange} errorField={error} formData={formData} />
                <InputField id="producer" label="Producer" required value={formData.producer} onChange={handleInputChange} errorField={error} formData={formData} />
                <InputField id="cinematographer" label="Cinematographer" value={formData.cinematographer} onChange={handleInputChange} />
                <InputField id="editor" label="Editor" value={formData.editor} onChange={handleInputChange} />
              </div>
            </section>

            {/* --- Timeline & Locations Section --- */}
            <section>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white pb-3 mb-6 border-b border-gray-200 dark:border-film-black-800 flex items-center"><Calendar className="h-5 w-5 mr-2 text-film-red-500" /> Timeline & Locations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextareaField id="timeline" label="Timeline Description" rows={3} value={formData.timeline} onChange={handleInputChange} />
                <div className="space-y-6">
                  <InputField id="startDate" label="Start Date" type="date" value={formData.startDate} onChange={handleInputChange} />
                  <InputField id="estimatedCompletion" label="Estimated Completion" type="date" value={formData.estimatedCompletion} onChange={handleInputChange} />
                </div>
                <div className="md:col-span-2">
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Locations</label>
                    <button type="button" onClick={() => addArrayItem('locations')} className="flex items-center text-sm text-film-red-600 dark:text-film-red-500 hover:text-film-red-700 dark:hover:text-film-red-400"><Plus className="h-4 w-4 mr-1" /> Add Location</button>
                  </div>
                  <div className="space-y-3">
                    <AnimatePresence>
                      {formData.locations.map((location, index) => (
                        <motion.div key={`location-${index}`} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="flex gap-2 items-center">
                          <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0" />
                          <input type="text" value={location} onChange={(e) => handleNestedArrayChange('locations', index, '', e.target.value)} placeholder="e.g., Accra, Ghana" className="input-style flex-1" /> {/* Updated handler */}
                          <button type="button" onClick={() => removeArrayItem('locations', index, 1)} className="button-control text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30" disabled={formData.locations.length <= 1}><X className="h-5 w-5" /></button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </section>

            {/* --- Team Members Section --- */}
            <section>
              <div className="flex justify-between items-center pb-3 mb-6 border-b border-gray-200 dark:border-film-black-800">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center"><Users className="h-5 w-5 mr-2 text-film-red-500" /> Team Members</h2>
                <button type="button" onClick={() => addArrayItem('team')} className="flex items-center text-sm text-film-red-600 dark:text-film-red-500 hover:text-film-red-700 dark:hover:text-film-red-400"><Plus className="h-4 w-4 mr-1" /> Add Member</button>
              </div>
              <div className="space-y-6">
                <AnimatePresence>
                  {formData.team.map((member, index) => (
                    <motion.div key={`team-${index}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="p-4 border border-gray-200 dark:border-film-black-700 rounded-lg bg-gray-50/50 dark:bg-film-black-800/30">
                      <div className="flex justify-between items-center mb-4"><h3 className="font-medium text-gray-900 dark:text-white">Team Member #{index + 1}</h3><button type="button" onClick={() => removeArrayItem('team', index)} className="button-control text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30" disabled={formData.team.length <= 1}><X className="h-4 w-4" /></button></div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField id={`team-name-${index}`} label="Name" value={member.name} onChange={(e: any) => handleNestedArrayChange('team', index, 'name', e.target.value)} placeholder="Full Name" />
                        <InputField id={`team-role-${index}`} label="Role" value={member.role} onChange={(e: any) => handleNestedArrayChange('team', index, 'role', e.target.value)} placeholder="e.g., Director of Photography" />
                        <div className="md:col-span-2"><TextareaField id={`team-bio-${index}`} label="Bio" rows={3} value={member.bio} onChange={(e: any) => handleNestedArrayChange('team', index, 'bio', e.target.value)} placeholder="Short biography" /></div>
                        <div className="md:col-span-2">
                          <label htmlFor={`team-image-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                          <div className="flex"><input type="text" id={`team-image-${index}`} value={member.image} onChange={(e) => handleNestedArrayChange('team', index, 'image', e.target.value)} placeholder="https://..." className="input-style rounded-r-none" /><button type="button" className="button-icon rounded-l-none"><Upload className="h-5 w-5" /></button></div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </section>

            {/* --- Production Stages Section --- */}
            <section>
              <div className="flex justify-between items-center pb-3 mb-6 border-b border-gray-200 dark:border-film-black-800">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center"><Milestone className="h-5 w-5 mr-2 text-film-red-500" /> Production Stages</h2>
                <button type="button" onClick={() => addArrayItem('stages')} className="flex items-center text-sm text-film-red-600 dark:text-film-red-500 hover:text-film-red-700 dark:hover:text-film-red-400"><Plus className="h-4 w-4 mr-1" /> Add Stage</button>
              </div>
              <div className="space-y-6">
                <AnimatePresence>
                  {formData.stages.map((stage, stageIndex) => (
                    <motion.div key={`stage-${stageIndex}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="p-4 border border-gray-200 dark:border-film-black-700 rounded-lg bg-gray-50/50 dark:bg-film-black-800/30">
                      <div className="flex justify-between items-center mb-4"><h3 className="font-medium text-gray-900 dark:text-white">Stage #{stageIndex + 1}</h3><button type="button" onClick={() => removeArrayItem('stages', stageIndex)} className="button-control text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30" disabled={formData.stages.length <= 1}><X className="h-4 w-4" /></button></div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <InputField id={`stage-name-${stageIndex}`} label="Stage Name" value={stage.name} onChange={(e: any) => handleNestedArrayChange('stages', stageIndex, 'name', e.target.value)} placeholder="e.g., Pre-Production" />
                        <div>
                          <label htmlFor={`stage-status-${stageIndex}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
                          <select id={`stage-status-${stageIndex}`} value={stage.status} onChange={(e) => handleNestedArrayChange('stages', stageIndex, 'status', e.target.value)} className="input-style">
                            <option value="upcoming">Upcoming</option><option value="in-progress">In Progress</option><option value="completed">Completed</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-2"><label className="text-sm font-medium text-gray-700 dark:text-gray-300">Milestones</label><button type="button" onClick={() => addItemToNestedArray('stages', stageIndex, 'milestones')} className="flex items-center text-xs text-film-red-600 dark:text-film-red-500 hover:text-film-red-700 dark:hover:text-film-red-400"><Plus className="h-3 w-3 mr-1" />Add Milestone</button></div>
                        <div className="space-y-2 pl-3 border-l-2 border-gray-200 dark:border-film-black-700">
                          <AnimatePresence>
                            {stage.milestones.map((milestone, milestoneIndex) => (
                              <motion.div key={`milestone-${stageIndex}-${milestoneIndex}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="flex gap-2 items-center">
                                <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600 flex-shrink-0"></div>
                                <input type="text" value={milestone} onChange={(e) => handleNestedArrayItemChange('stages', stageIndex, 'milestones', milestoneIndex, e.target.value)} placeholder="e.g., Script finalized" className="input-style text-sm py-1.5 flex-1" />
                                <button type="button" onClick={() => removeItemFromNestedArray('stages', stageIndex, 'milestones', milestoneIndex)} className="button-control text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30" disabled={stage.milestones.length <= 1}><X className="h-4 w-4" /></button>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </section>

            {/* --- FAQ Section --- */}
            <section>
              <div className="flex justify-between items-center pb-3 mb-6 border-b border-gray-200 dark:border-film-black-800">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center"><HelpCircle className="h-5 w-5 mr-2 text-film-red-500" /> FAQ</h2>
                <button type="button" onClick={() => addArrayItem('faq')} className="flex items-center text-sm text-film-red-600 dark:text-film-red-500 hover:text-film-red-700 dark:hover:text-film-red-400"><Plus className="h-4 w-4 mr-1" /> Add FAQ</button>
              </div>
              <div className="space-y-4">
                <AnimatePresence>
                  {formData.faq.map((item, index) => (
                    <motion.div key={`faq-${index}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="p-4 border border-gray-200 dark:border-film-black-700 rounded-lg space-y-4 bg-gray-50/50 dark:bg-film-black-800/30">
                      <div className="flex justify-between items-center"><h3 className="font-medium text-gray-900 dark:text-white">FAQ #{index + 1}</h3><button type="button" onClick={() => removeArrayItem('faq', index)} className="button-control text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30" disabled={formData.faq.length <= 1}><X className="h-4 w-4" /></button></div>
                      <InputField id={`faq-question-${index}`} label="Question" value={item.question} onChange={(e: any) => handleNestedArrayChange('faq', index, 'question', e.target.value)} placeholder="Enter question..." />
                      <TextareaField id={`faq-answer-${index}`} label="Answer" rows={3} value={item.answer} onChange={(e: any) => handleNestedArrayChange('faq', index, 'answer', e.target.value)} placeholder="Enter answer..." />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </section>

            {/* --- Updates Section --- */}
            <section>
              <div className="flex justify-between items-center pb-3 mb-6 border-b border-gray-200 dark:border-film-black-800">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center"><FileText className="h-5 w-5 mr-2 text-film-red-500" /> Production Updates</h2>
                <button type="button" onClick={() => addArrayItem('updates')} className="flex items-center text-sm text-film-red-600 dark:text-film-red-500 hover:text-film-red-700 dark:hover:text-film-red-400"><Plus className="h-4 w-4 mr-1" /> Add Update</button>
              </div>
              <div className="space-y-6">
                <AnimatePresence>
                  {formData.updates.map((update, index) => (
                    <motion.div key={`update-${index}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="p-4 border border-gray-200 dark:border-film-black-700 rounded-lg bg-gray-50/50 dark:bg-film-black-800/30">
                      <div className="flex justify-between items-center mb-4"><h3 className="font-medium text-gray-900 dark:text-white">Update #{index + 1}</h3><button type="button" onClick={() => removeArrayItem('updates', index)} className="button-control text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30" disabled={formData.updates.length <= 1}><X className="h-4 w-4" /></button></div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField id={`update-date-${index}`} label="Date" type="date" value={update.date} onChange={(e: any) => handleNestedArrayChange('updates', index, 'date', e.target.value)} />
                        <InputField id={`update-title-${index}`} label="Title" value={update.title} onChange={(e: any) => handleNestedArrayChange('updates', index, 'title', e.target.value)} placeholder="e.g., Filming Completed" />
                        <div className="md:col-span-2"><TextareaField id={`update-content-${index}`} label="Content" rows={4} value={update.content} onChange={(e: any) => handleNestedArrayChange('updates', index, 'content', e.target.value)} placeholder="Update details..." /></div>
                        <div className="md:col-span-2">
                          <label htmlFor={`update-image-${index}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image URL</label>
                          <div className="flex"><input type="text" id={`update-image-${index}`} value={update.image} onChange={(e) => handleNestedArrayChange('updates', index, 'image', e.target.value)} placeholder="https://..." className="input-style rounded-r-none" /><button type="button" className="button-icon rounded-l-none"><Upload className="h-5 w-5" /></button></div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </section>

            {/* --- Support Options Section --- */}
            <section>
              <div className="flex justify-between items-center pb-3 mb-6 border-b border-gray-200 dark:border-film-black-800">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center"><DollarSign className="h-5 w-5 mr-2 text-film-red-500" /> Support Options</h2>
                <button type="button" onClick={() => addArrayItem('supportOptions')} className="flex items-center text-sm text-film-red-600 dark:text-film-red-500 hover:text-film-red-700 dark:hover:text-film-red-400"><Plus className="h-4 w-4 mr-1" /> Add Option</button>
              </div>
              <div className="space-y-6">
                <AnimatePresence>
                  {formData.supportOptions.map((option, optionIndex) => (
                    <motion.div key={`option-${optionIndex}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="p-4 border border-gray-200 dark:border-film-black-700 rounded-lg bg-gray-50/50 dark:bg-film-black-800/30">
                      <div className="flex justify-between items-center mb-4"><h3 className="font-medium text-gray-900 dark:text-white">Support Tier #{optionIndex + 1}</h3><button type="button" onClick={() => removeArrayItem('supportOptions', optionIndex)} className="button-control text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30" disabled={formData.supportOptions.length <= 1}><X className="h-4 w-4" /></button></div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputField id={`option-title-${optionIndex}`} label="Title" value={option.title} onChange={(e: any) => handleNestedArrayChange('supportOptions', optionIndex, 'title', e.target.value)} placeholder="e.g., Executive Producer" />
                        <InputField id={`option-investment-${optionIndex}`} label="Investment Amount" value={option.investment} onChange={(e: any) => handleNestedArrayChange('supportOptions', optionIndex, 'investment', e.target.value)} placeholder="e.g., $5,000" />
                        <div className="md:col-span-2"><TextareaField id={`option-desc-${optionIndex}`} label="Description" rows={3} value={option.description} onChange={(e: any) => handleNestedArrayChange('supportOptions', optionIndex, 'description', e.target.value)} placeholder="Describe this support tier..." /></div>
                        <div className="md:col-span-2">
                          <div className="flex justify-between items-center mb-2"><label className="text-sm font-medium text-gray-700 dark:text-gray-300">Perks</label><button type="button" onClick={() => addItemToNestedArray('supportOptions', optionIndex, 'perks')} className="flex items-center text-xs text-film-red-600 dark:text-film-red-500 hover:text-film-red-700 dark:hover:text-film-red-400"><Plus className="h-3 w-3 mr-1" />Add Perk</button></div>
                          <div className="space-y-2">
                            <AnimatePresence>
                              {option.perks.map((perk, perkIndex) => (
                                <motion.div key={`perk-${optionIndex}-${perkIndex}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="flex gap-2 items-center">
                                  <div className="w-2 h-2 rounded-full bg-film-red-500 flex-shrink-0"></div>
                                  <input type="text" value={perk} onChange={(e) => handleNestedArrayItemChange('supportOptions', optionIndex, 'perks', perkIndex, e.target.value)} placeholder="e.g., Name in credits" className="input-style text-sm py-1.5 flex-1" />
                                  <button type="button" onClick={() => removeItemFromNestedArray('supportOptions', optionIndex, 'perks', perkIndex)} className="button-control text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30" disabled={option.perks.length <= 1}><X className="h-4 w-4" /></button>
                                </motion.div>
                              ))}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
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
                {!isSubmitting && <Save className="h-4 w-4 mr-2" />}
                Save Production
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

// Helper components defined internally or imported
const formHelpers = { InputField, TextareaField };

const AdminCreateProductionPage = () => (
  <Suspense fallback={<AdminCreateProductionLoading />}>
    <AdminCreateProductionForm />
  </Suspense>
);

// Add styles for better visual appearance (inline or in globals.css)
const styles = `
.input-style { @apply w-full px-4 py-2 rounded-lg bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white shadow-sm; }
.input-icon { @apply h-4 w-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none; }
.button-icon { @apply px-4 py-2 bg-gray-100 dark:bg-film-black-700 border-y border-r border-gray-300 dark:border-film-black-600 rounded-r-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-film-black-600 transition-colors; }
.button-control { @apply p-1.5 rounded-lg bg-gray-100 dark:bg-film-black-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-film-black-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors; }
`;
if (typeof window !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default AdminCreateProductionPage;

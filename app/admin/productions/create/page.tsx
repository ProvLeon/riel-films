"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/UI/Button";
import { Save, ArrowLeft, Plus, X, Upload, Star, StarOff, User, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "@/components/UI/LoadingSpinner";

const AdminCreateProductionPage = () => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    category: "",
    status: "Development", // Default status
    description: "",
    longDescription: "",
    image: "",
    director: "",
    producer: "",
    cinematographer: "",
    editor: "",
    timeline: "",
    startDate: "",
    estimatedCompletion: "",
    locations: [""],
    logline: "",
    synopsis: "",
    featured: false,
    progress: 0,
    team: [{ name: "", role: "", bio: "", image: "" }],
    stages: [
      {
        name: "Pre-Production",
        status: "upcoming" as "upcoming" | "in-progress" | "completed",
        milestones: [""]
      }
    ],
    faq: [{ question: "", answer: "" }],
    updates: [{ date: "", title: "", content: "", image: "" }],
    supportOptions: [{ title: "", investment: "", description: "", perks: [""] }]
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

  // Handle array inputs (locations)
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

  // Handle team changes
  const handleTeamChange = (index: number, field: string, value: string) => {
    const newTeam = [...formData.team];
    newTeam[index] = { ...newTeam[index], [field]: value };
    setFormData({
      ...formData,
      team: newTeam
    });
  };

  // Add team member
  const addTeamMember = () => {
    setFormData({
      ...formData,
      team: [...formData.team, { name: "", role: "", bio: "", image: "" }]
    });
  };

  // Remove team member
  const removeTeamMember = (index: number) => {
    const newTeam = [...formData.team];
    newTeam.splice(index, 1);
    setFormData({
      ...formData,
      team: newTeam.length > 0 ? newTeam : [{ name: "", role: "", bio: "", image: "" }]
    });
  };

  // Handle stages changes
  const handleStageChange = (index: number, field: string, value: any) => {
    const newStages = [...formData.stages];
    newStages[index] = { ...newStages[index], [field]: value };
    setFormData({
      ...formData,
      stages: newStages
    });
  };

  // Add stage
  const addStage = () => {
    setFormData({
      ...formData,
      stages: [...formData.stages, { name: "", status: "upcoming" as "upcoming" | "in-progress" | "completed", milestones: [""] }]
    });
  };

  // Remove stage
  const removeStage = (index: number) => {
    const newStages = [...formData.stages];
    newStages.splice(index, 1);
    setFormData({
      ...formData,
      stages: newStages.length > 0 ? newStages : [{ name: "", status: "upcoming" as "upcoming" | "in-progress" | "completed", milestones: [""] }]
    });
  };

  // Handle stage milestones changes
  const handleMilestoneChange = (stageIndex: number, milestoneIndex: number, value: string) => {
    const newStages = [...formData.stages];
    const newMilestones = [...newStages[stageIndex].milestones];
    newMilestones[milestoneIndex] = value;
    newStages[stageIndex] = { ...newStages[stageIndex], milestones: newMilestones };
    setFormData({
      ...formData,
      stages: newStages
    });
  };

  // Add milestone to a stage
  const addMilestone = (stageIndex: number) => {
    const newStages = [...formData.stages];
    newStages[stageIndex] = {
      ...newStages[stageIndex],
      milestones: [...newStages[stageIndex].milestones, ""]
    };
    setFormData({
      ...formData,
      stages: newStages
    });
  };

  // Remove milestone from a stage
  const removeMilestone = (stageIndex: number, milestoneIndex: number) => {
    const newStages = [...formData.stages];
    const newMilestones = [...newStages[stageIndex].milestones];
    newMilestones.splice(milestoneIndex, 1);
    newStages[stageIndex] = {
      ...newStages[stageIndex],
      milestones: newMilestones.length > 0 ? newMilestones : [""]
    };
    setFormData({
      ...formData,
      stages: newStages
    });
  };

  // Handle FAQ changes
  const handleFaqChange = (index: number, field: string, value: string) => {
    const newFaq = [...formData.faq];
    newFaq[index] = { ...newFaq[index], [field]: value };
    setFormData({
      ...formData,
      faq: newFaq
    });
  };

  // Add FAQ item
  const addFaq = () => {
    setFormData({
      ...formData,
      faq: [...formData.faq, { question: "", answer: "" }]
    });
  };

  // Remove FAQ item
  const removeFaq = (index: number) => {
    const newFaq = [...formData.faq];
    newFaq.splice(index, 1);
    setFormData({
      ...formData,
      faq: newFaq.length > 0 ? newFaq : [{ question: "", answer: "" }]
    });
  };

  // Handle updates changes
  const handleUpdateChange = (index: number, field: string, value: string) => {
    const newUpdates = [...formData.updates];
    newUpdates[index] = { ...newUpdates[index], [field]: value };
    setFormData({
      ...formData,
      updates: newUpdates
    });
  };

  // Add update
  const addUpdate = () => {
    setFormData({
      ...formData,
      updates: [...formData.updates, { date: "", title: "", content: "", image: "" }]
    });
  };

  // Remove update
  const removeUpdate = (index: number) => {
    const newUpdates = [...formData.updates];
    newUpdates.splice(index, 1);
    setFormData({
      ...formData,
      updates: newUpdates.length > 0 ? newUpdates : [{ date: "", title: "", content: "", image: "" }]
    });
  };

  // Handle support options changes
  const handleSupportOptionChange = (index: number, field: string, value: any) => {
    const newOptions = [...formData.supportOptions];
    newOptions[index] = { ...newOptions[index], [field]: value };
    setFormData({
      ...formData,
      supportOptions: newOptions
    });
  };

  // Add support option
  const addSupportOption = () => {
    setFormData({
      ...formData,
      supportOptions: [...formData.supportOptions, { title: "", investment: "", description: "", perks: [""] }]
    });
  };

  // Remove support option
  const removeSupportOption = (index: number) => {
    const newOptions = [...formData.supportOptions];
    newOptions.splice(index, 1);
    setFormData({
      ...formData,
      supportOptions: newOptions.length > 0 ? newOptions : [{ title: "", investment: "", description: "", perks: [""] }]
    });
  };

  // Handle support option perks changes
  const handlePerkChange = (optionIndex: number, perkIndex: number, value: string) => {
    const newOptions = [...formData.supportOptions];
    const newPerks = [...newOptions[optionIndex].perks];
    newPerks[perkIndex] = value;
    newOptions[optionIndex] = { ...newOptions[optionIndex], perks: newPerks };
    setFormData({
      ...formData,
      supportOptions: newOptions
    });
  };

  // Add perk to a support option
  const addPerk = (optionIndex: number) => {
    const newOptions = [...formData.supportOptions];
    newOptions[optionIndex] = {
      ...newOptions[optionIndex],
      perks: [...newOptions[optionIndex].perks, ""]
    };
    setFormData({
      ...formData,
      supportOptions: newOptions
    });
  };

  // Remove perk from a support option
  const removePerk = (optionIndex: number, perkIndex: number) => {
    const newOptions = [...formData.supportOptions];
    const newPerks = [...newOptions[optionIndex].perks];
    newPerks.splice(perkIndex, 1);
    newOptions[optionIndex] = {
      ...newOptions[optionIndex],
      perks: newPerks.length > 0 ? newPerks : [""]
    };
    setFormData({
      ...formData,
      supportOptions: newOptions
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

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/productions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <button
            onClick={() => router.back()}
            className="mr-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-film-black-900"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-300" />
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create New Production</h1>
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
              Save Production
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
          <div className="space-y-8">
            {/* Basic Information Section */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white pb-2 mb-6 border-b border-gray-200 dark:border-film-black-800">
                Basic Information
              </h2>

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

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status<span className="text-red-600">*</span>
                  </label>
                  <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                    required
                  >
                    <option value="Development">Development</option>
                    <option value="Pre-Production">Pre-Production</option>
                    <option value="In Production">In Production</option>
                    <option value="Post-Production">Post-Production</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="progress" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Progress (%)<span className="text-red-600">*</span>
                  </label>
                  <input
                    type="number"
                    id="progress"
                    name="progress"
                    value={formData.progress}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Featured Production
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

                <div className="md:col-span-2">
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
                    rows={5}
                    className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="logline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Logline<span className="text-red-600">*</span>
                  </label>
                  <textarea
                    id="logline"
                    name="logline"
                    value={formData.logline}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                    required
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
                    rows={4}
                    className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Crew Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white pb-2 mb-6 border-b border-gray-200 dark:border-film-black-800">
                Crew Information
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
                  <label htmlFor="cinematographer" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Cinematographer
                  </label>
                  <input
                    type="text"
                    id="cinematographer"
                    name="cinematographer"
                    value={formData.cinematographer}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                  />
                </div>

                <div>
                  <label htmlFor="editor" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Editor
                  </label>
                  <input
                    type="text"
                    id="editor"
                    name="editor"
                    value={formData.editor}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Timeline Information */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white pb-2 mb-6 border-b border-gray-200 dark:border-film-black-800">
                Timeline Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="timeline" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Timeline Description
                  </label>
                  <textarea
                    id="timeline"
                    name="timeline"
                    value={formData.timeline}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                  />
                </div>

                <div className="space-y-6">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      value={formData.startDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label htmlFor="estimatedCompletion" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Estimated Completion
                    </label>
                    <input
                      type="date"
                      id="estimatedCompletion"
                      name="estimatedCompletion"
                      value={formData.estimatedCompletion}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Locations */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Locations
                </h2>
                <button
                  type="button"
                  onClick={() => addItemToArray("locations")}
                  className="flex items-center text-sm text-film-red-600 dark:text-film-red-500 hover:text-film-red-700 dark:hover:text-film-red-400"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Location
                </button>
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {formData.locations.map((location, index) => (
                    <motion.div
                      key={`location-${index}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex gap-2 items-center"
                    >
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        value={location}
                        onChange={(e) => handleArrayInputChange(index, "locations", e.target.value)}
                        placeholder="e.g., Accra, Ghana"
                        className="flex-1 px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => removeItemFromArray("locations", index)}
                        className="p-2 text-red-600 hover:text-red-700"
                        disabled={formData.locations.length <= 1}
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Team Members */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-film-black-800">
                  Team Members
                </h2>
                <button
                  type="button"
                  onClick={addTeamMember}
                  className="flex items-center text-sm text-film-red-600 dark:text-film-red-500 hover:text-film-red-700 dark:hover:text-film-red-400"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Team Member
                </button>
              </div>

              <div className="space-y-6">
                <AnimatePresence>
                  {formData.team.map((member, index) => (
                    <motion.div
                      key={`team-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                      transition={{ duration: 0.3 }}
                      className="p-4 border border-gray-200 dark:border-film-black-700 rounded-lg"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium text-gray-900 dark:text-white">Team Member #{index + 1}</h3>
                        <button
                          type="button"
                          onClick={() => removeTeamMember(index)}
                          className="p-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/30"
                          disabled={formData.team.length <= 1}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Name
                          </label>
                          <div className="flex">
                            <div className="bg-gray-100 dark:bg-film-black-700 border-y border-l border-gray-300 dark:border-film-black-600 rounded-l-md flex items-center justify-center px-3">
                              <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                            </div>
                            <input
                              type="text"
                              value={member.name}
                              onChange={(e) => handleTeamChange(index, 'name', e.target.value)}
                              placeholder="Full Name"
                              className="flex-1 px-4 py-2 rounded-r-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Role
                          </label>
                          <input
                            type="text"
                            value={member.role}
                            onChange={(e) => handleTeamChange(index, 'role', e.target.value)}
                            placeholder="e.g., Director of Photography"
                            className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Bio
                          </label>
                          <textarea
                            value={member.bio}
                            onChange={(e) => handleTeamChange(index, 'bio', e.target.value)}
                            placeholder="Short biography"
                            rows={3}
                            className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Image URL
                          </label>
                          <div className="flex">
                            <input
                              type="text"
                              value={member.image}
                              onChange={(e) => handleTeamChange(index, 'image', e.target.value)}
                              placeholder="https://..."
                              className="flex-1 px-4 py-2 rounded-l-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                            />
                            <button
                              type="button"
                              className="px-4 py-2 bg-gray-100 dark:bg-film-black-700 border-y border-r border-gray-300 dark:border-film-black-600 rounded-r-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-film-black-600"
                            >
                              <Upload className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Production Stages */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-film-black-800">
                  Production Stages
                </h2>
                <button
                  type="button"
                  onClick={addStage}
                  className="flex items-center text-sm text-film-red-600 dark:text-film-red-500 hover:text-film-red-700 dark:hover:text-film-red-400"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Stage
                </button>
              </div>

              <div className="space-y-6">
                <AnimatePresence>
                  {formData.stages.map((stage, stageIndex) => (
                    <motion.div
                      key={`stage-${stageIndex}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                      transition={{ duration: 0.3 }}
                      className="p-4 border border-gray-200 dark:border-film-black-700 rounded-lg"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium text-gray-900 dark:text-white">Stage #{stageIndex + 1}</h3>
                        <button
                          type="button"
                          onClick={() => removeStage(stageIndex)}
                          className="p-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/30"
                          disabled={formData.stages.length <= 1}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Stage Name
                          </label>
                          <input
                            type="text"
                            value={stage.name}
                            onChange={(e) => handleStageChange(stageIndex, 'name', e.target.value)}
                            placeholder="e.g., Pre-Production"
                            className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Status
                          </label>
                          <select
                            value={stage.status}
                            onChange={(e) => handleStageChange(stageIndex, 'status', e.target.value)}
                            className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                          >
                            <option value="upcoming">Upcoming</option>
                            <option value="in-progress">In Progress</option>
                            <option value="completed">Completed</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Milestones
                          </label>
                          <button
                            type="button"
                            onClick={() => addMilestone(stageIndex)}
                            className="flex items-center text-xs text-film-red-600 dark:text-film-red-500 hover:text-film-red-700 dark:hover:text-film-red-400"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Milestone
                          </button>
                        </div>

                        <div className="space-y-2 pl-3 border-l-2 border-gray-200 dark:border-film-black-700">
                          <AnimatePresence>
                            {stage.milestones.map((milestone, milestoneIndex) => (
                              <motion.div
                                key={`milestone-${stageIndex}-${milestoneIndex}`}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="flex gap-2 items-center"
                              >
                                <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-600"></div>
                                <input
                                  type="text"
                                  value={milestone}
                                  onChange={(e) => handleMilestoneChange(stageIndex, milestoneIndex, e.target.value)}
                                  placeholder="e.g., Script finalized"
                                  className="flex-1 px-3 py-1.5 text-sm rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeMilestone(stageIndex, milestoneIndex)}
                                  className="p-1 text-red-600 hover:text-red-700"
                                  disabled={stage.milestones.length <= 1}
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </motion.div>
                            ))}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* FAQ Section */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-film-black-800">
                  Frequently Asked Questions
                </h2>
                <button
                  type="button"
                  onClick={addFaq}
                  className="flex items-center text-sm text-film-red-600 dark:text-film-red-500 hover:text-film-red-700 dark:hover:text-film-red-400"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add FAQ
                </button>
              </div>

              <div className="space-y-4">
                <AnimatePresence>
                  {formData.faq.map((faq, index) => (
                    <motion.div
                      key={`faq-${index}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                      transition={{ duration: 0.3 }}
                      className="p-4 border border-gray-200 dark:border-film-black-700 rounded-lg"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-medium text-gray-900 dark:text-white">Question #{index + 1}</h3>
                        <button
                          type="button"
                          onClick={() => removeFaq(index)}
                          className="p-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/30"
                          disabled={formData.faq.length <= 1}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Question
                          </label>
                          <input
                            type="text"
                            value={faq.question}
                            onChange={(e) => handleFaqChange(index, 'question', e.target.value)}
                            placeholder="Enter question..."
                            className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Answer
                          </label>
                          <textarea
                            value={faq.answer}
                            onChange={(e) => handleFaqChange(index, 'answer', e.target.value)}
                            placeholder="Enter answer..."
                            rows={3}
                            className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Updates */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-film-black-800">
                  Production Updates
                </h2>
                <button
                  type="button"
                  onClick={addUpdate}
                  className="flex items-center text-sm text-film-red-600 dark:text-film-red-500 hover:text-film-red-700 dark:hover:text-film-red-400"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Update
                </button>
              </div>

              <div className="space-y-6">
                <AnimatePresence>
                  {formData.updates.map((update, index) => (
                    <motion.div
                      key={`update-${index}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                      transition={{ duration: 0.3 }}
                      className="p-4 border border-gray-200 dark:border-film-black-700 rounded-lg"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium text-gray-900 dark:text-white">Update #{index + 1}</h3>
                        <button
                          type="button"
                          onClick={() => removeUpdate(index)}
                          className="p-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/30"
                          disabled={formData.updates.length <= 1}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Date
                          </label>
                          <input
                            type="date"
                            value={update.date}
                            onChange={(e) => handleUpdateChange(index, 'date', e.target.value)}
                            className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            value={update.title}
                            onChange={(e) => handleUpdateChange(index, 'title', e.target.value)}
                            placeholder="e.g., Filming Completed in Accra"
                            className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Content
                          </label>
                          <textarea
                            value={update.content}
                            onChange={(e) => handleUpdateChange(index, 'content', e.target.value)}
                            placeholder="Update details..."
                            rows={4}
                            className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Image URL
                          </label>
                          <div className="flex">
                            <input
                              type="text"
                              value={update.image}
                              onChange={(e) => handleUpdateChange(index, 'image', e.target.value)}
                              placeholder="https://..."
                              className="flex-1 px-4 py-2 rounded-l-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                            />
                            <button
                              type="button"
                              className="px-4 py-2 bg-gray-100 dark:bg-film-black-700 border-y border-r border-gray-300 dark:border-film-black-600 rounded-r-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-film-black-600"
                            >
                              <Upload className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Support Options */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white pb-2 border-b border-gray-200 dark:border-film-black-800">
                  Support Options
                </h2>
                <button
                  type="button"
                  onClick={addSupportOption}
                  className="flex items-center text-sm text-film-red-600 dark:text-film-red-500 hover:text-film-red-700 dark:hover:text-film-red-400"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Support Option
                </button>
              </div>

              <div className="space-y-6">
                <AnimatePresence>
                  {formData.supportOptions.map((option, optionIndex) => (
                    <motion.div
                      key={`option-${optionIndex}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                      transition={{ duration: 0.3 }}
                      className="p-4 border border-gray-200 dark:border-film-black-700 rounded-lg"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="font-medium text-gray-900 dark:text-white">Support Tier #{optionIndex + 1}</h3>
                        <button
                          type="button"
                          onClick={() => removeSupportOption(optionIndex)}
                          className="p-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/30"
                          disabled={formData.supportOptions.length <= 1}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Title
                          </label>
                          <input
                            type="text"
                            value={option.title}
                            onChange={(e) => handleSupportOptionChange(optionIndex, 'title', e.target.value)}
                            placeholder="e.g., Executive Producer"
                            className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Investment Amount
                          </label>
                          <input
                            type="text"
                            value={option.investment}
                            onChange={(e) => handleSupportOptionChange(optionIndex, 'investment', e.target.value)}
                            placeholder="e.g., $5,000"
                            className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Description
                          </label>
                          <textarea
                            value={option.description}
                            onChange={(e) => handleSupportOptionChange(optionIndex, 'description', e.target.value)}
                            placeholder="Describe this support tier..."
                            rows={3}
                            className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                          />
                        </div>

                        <div className="md:col-span-2">
                          <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              Perks
                            </label>
                            <button
                              type="button"
                              onClick={() => addPerk(optionIndex)}
                              className="flex items-center text-xs text-film-red-600 dark:text-film-red-500 hover:text-film-red-700 dark:hover:text-film-red-400"
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              Add Perk
                            </button>
                          </div>

                          <div className="space-y-2">
                            <AnimatePresence>
                              {option.perks.map((perk, perkIndex) => (
                                <motion.div
                                  key={`perk-${optionIndex}-${perkIndex}`}
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={{ opacity: 0, height: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="flex gap-2 items-center"
                                >
                                  <div className="w-2 h-2 rounded-full bg-film-red-500"></div>
                                  <input
                                    type="text"
                                    value={perk}
                                    onChange={(e) => handlePerkChange(optionIndex, perkIndex, e.target.value)}
                                    placeholder="e.g., Name in credits"
                                    className="flex-1 px-3 py-1.5 text-sm rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => removePerk(optionIndex, perkIndex)}
                                    className="p-1 text-red-600 hover:text-red-700"
                                    disabled={option.perks.length <= 1}
                                  >
                                    <X className="h-4 w-4" />
                                  </button>
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
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <LoadingSpinner size="small" />
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Production
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

export default AdminCreateProductionPage;

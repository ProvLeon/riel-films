"use client";
import React, { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/UI/Button";
import { Settings as SettingsIcon, Save, Upload, Globe, LogOut, Mail, Phone, Badge as BrandingWatermark, Link2, Trash2, AlertCircle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { useData } from "@/context/DataContext";
import { Settings } from "@/types/mongodbSchema";

// Create a loading component for Suspense fallback
const SettingsPageLoading = () => (
  <div className="flex justify-center items-center h-64">
    <LoadingSpinner size="large" />
  </div>
);

// Create a wrapper component that uses the hooks
const SettingsPageContent = () => {
  const { user } = useAuth();
  const { settings, isLoadingSettings, refetchSettings } = useData();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmAction, setConfirmAction] = useState<() => Promise<void>>(() => async () => { });
  const [confirmMessage, setConfirmMessage] = useState("");

  // Settings state
  const [settingsData, setSettingsData] = useState<Settings>({
    id: "",
    siteName: "",
    siteDescription: "",
    contactEmail: "",
    contactPhone: "",
    socialLinks: [],
    logoLight: "",
    logoDark: "",
    metaImage: "",
    updatedAt: new Date()
  });

  useEffect(() => {
    if (settings) {
      setSettingsData(settings);
    }
  }, [settings]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettingsData({
      ...settingsData,
      [name]: value
    });
  };

  // Handle social link change
  const handleSocialLinkChange = (index: number, field: 'platform' | 'url', value: string) => {
    const updatedLinks = [...settingsData.socialLinks];
    updatedLinks[index] = { ...updatedLinks[index], [field]: value };

    setSettingsData({
      ...settingsData,
      socialLinks: updatedLinks
    });
  };

  // Add social link
  const addSocialLink = () => {
    setSettingsData({
      ...settingsData,
      socialLinks: [...settingsData.socialLinks, { platform: "", url: "" }]
    });
  };

  // Remove social link
  const removeSocialLink = (index: number) => {
    const updatedLinks = [...settingsData.socialLinks];
    updatedLinks.splice(index, 1);

    setSettingsData({
      ...settingsData,
      socialLinks: updatedLinks
    });
  };

  // Clear cache
  const clearCache = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Implement cache clearing logic here
      // This is a placeholder - actual implementation depends on your caching strategy
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulating API call

      setSuccess("Cache cleared successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      setError("Failed to clear cache: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset site settings
  const resetSettings = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      // Implement settings reset logic here
      // Fetch default settings from server and update
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulating API call

      // Reload settings
      await refetchSettings();

      setSuccess("Settings reset to defaults successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      setError("Failed to reset settings: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settingsData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update settings');
      }

      // Update settings in context
      await refetchSettings();

      setSuccess("Settings updated successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show confirmation dialog
  const confirmDialog = (message: string, action: () => Promise<void>) => {
    setConfirmMessage(message);
    setConfirmAction(() => action);
    setShowConfirmDialog(true);
  };

  // Tab content mapping
  const tabContent = {
    general: (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">General Settings</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Site Name
            </label>
            <input
              type="text"
              id="siteName"
              name="siteName"
              value={settingsData.siteName}
              onChange={handleInputChange}
              className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
              placeholder="Riel Films"
            />
          </div>

          <div className="md:col-span-2">
            <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Site Description
            </label>
            <textarea
              id="siteDescription"
              name="siteDescription"
              value={settingsData.siteDescription}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
              placeholder="A production company dedicated to telling authentic African stories..."
            />
          </div>

          <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="logoLight" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Logo (Light Theme)
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="logoLight"
                  name="logoLight"
                  value={settingsData.logoLight}
                  onChange={handleInputChange}
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
              {settingsData.logoLight && (
                <div className="mt-2 p-4 bg-white border border-gray-200 rounded-md">
                  <div className="relative h-12 w-auto">
                    <Image
                      src={settingsData.logoLight}
                      alt="Light Logo Preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="logoDark" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Logo (Dark Theme)
              </label>
              <div className="flex">
                <input
                  type="text"
                  id="logoDark"
                  name="logoDark"
                  value={settingsData.logoDark}
                  onChange={handleInputChange}
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
              {settingsData.logoDark && (
                <div className="mt-2 p-4 bg-film-black-950 border border-film-black-800 rounded-md">
                  <div className="relative h-12 w-auto">
                    <Image
                      src={settingsData.logoDark}
                      alt="Dark Logo Preview"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    ),
    contact: (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Contact Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Contact Email
            </label>
            <div className="flex">
              <div className="bg-gray-100 dark:bg-film-black-700 border-y border-l border-gray-300 dark:border-film-black-600 rounded-l-md flex items-center justify-center px-3">
                <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </div>
              <input
                type="email"
                id="contactEmail"
                name="contactEmail"
                value={settingsData.contactEmail}
                onChange={handleInputChange}
                placeholder="contact@rielfilms.com"
                className="flex-1 px-4 py-2 rounded-r-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Contact Phone
            </label>
            <div className="flex">
              <div className="bg-gray-100 dark:bg-film-black-700 border-y border-l border-gray-300 dark:border-film-black-600 rounded-l-md flex items-center justify-center px-3">
                <Phone className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              </div>
              <input
                type="text"
                id="contactPhone"
                name="contactPhone"
                value={settingsData.contactPhone}
                onChange={handleInputChange}
                placeholder="+233 xx xxx xxxx"
                className="flex-1 px-4 py-2 rounded-r-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
              />
            </div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Social Media Links
            </label>
            <button
              type="button"
              onClick={addSocialLink}
              className="text-sm text-film-red-600 dark:text-film-red-500 hover:text-film-red-700 dark:hover:text-film-red-400 flex items-center"
            >
              <span className="mr-1">Add Social Link</span>
              <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <AnimatePresence>
              {settingsData.socialLinks.map((link, index) => (
                <motion.div
                  key={`social-${index}`}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center border border-gray-200 dark:border-film-black-700 rounded-lg p-4"
                >
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      Platform
                    </label>
                    <select
                      value={link.platform}
                      onChange={(e) => handleSocialLinkChange(index, 'platform', e.target.value)}
                      className="w-full px-3 py-2 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                    >
                      <option value="">Select Platform</option>
                      <option value="facebook">Facebook</option>
                      <option value="twitter">Twitter</option>
                      <option value="instagram">Instagram</option>
                      <option value="youtube">YouTube</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="tiktok">TikTok</option>
                      <option value="vimeo">Vimeo</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="md:col-span-2 flex items-center gap-2">
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        URL
                      </label>
                      <div className="flex">
                        <div className="bg-gray-100 dark:bg-film-black-700 border-y border-l border-gray-300 dark:border-film-black-600 rounded-l-md flex items-center justify-center px-3">
                          <Link2 className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                        </div>
                        <input
                          type="url"
                          value={link.url}
                          onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                          placeholder="https://..."
                          className="flex-1 px-3 py-2 rounded-r-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                        />
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeSocialLink(index)}
                      className="mt-6 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
                      title="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {settingsData.socialLinks.length === 0 && (
              <div className="text-center p-6 border border-dashed border-gray-300 dark:border-film-black-700 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                  No social links added yet. Click "Add Social Link" to add one.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    seo: (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">SEO Settings</h2>

        <div>
          <label htmlFor="metaImage" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Default Meta Image
          </label>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            This image will be used for social media sharing when no specific image is provided.
          </p>
          <div className="flex">
            <input
              type="text"
              id="metaImage"
              name="metaImage"
              value={settingsData.metaImage}
              onChange={handleInputChange}
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

          {settingsData.metaImage && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Preview:</p>
              <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-md border border-gray-200 dark:border-film-black-700">
                <Image
                  src={settingsData.metaImage}
                  alt="Meta Image Preview"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </div>

        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300 flex items-center mb-2">
            <BrandingWatermark className="h-4 w-4 mr-2" />
            Best Practices for Meta Images
          </h3>
          <ul className="ml-6 list-disc text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>Use a 1200×630 pixel image (minimum size: 600×315)</li>
            <li>Keep file size under 1MB for faster loading</li>
            <li>Use clear, high-contrast images that are readable at small sizes</li>
            <li>Include your brand logo or film title in the image</li>
            <li>Avoid text-heavy images as they may be cut off on some platforms</li>
          </ul>
        </div>
      </div>
    ),
    advanced: (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Advanced Settings</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border border-gray-200 dark:border-film-black-700 rounded-xl bg-white dark:bg-film-black-900">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Clear Cache</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Clear the application cache to force reload of all data. This may temporarily slow down performance but ensures all content is up to date.
            </p>
            <Button
              variant="outline"
              onClick={() => confirmDialog(
                "Are you sure you want to clear the cache? This will temporarily slow down the site as the cache rebuilds.",
                clearCache
              )}
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <LoadingSpinner size="small" />
              ) : (
                <>
                  <Globe className="mr-2 h-4 w-4" />
                  Clear Cache
                </>
              )}
            </Button>
          </div>

          <div className="p-6 border border-red-200 dark:border-red-900/50 rounded-xl bg-white dark:bg-film-black-900">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Reset Settings</h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">
              Reset all settings to default values. This action cannot be undone and will remove all custom configuration.
            </p>
            <Button
              variant="danger"
              onClick={() => confirmDialog(
                "Are you sure you want to reset all settings to default? This cannot be undone.",
                resetSettings
              )}
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? (
                <LoadingSpinner size="small" />
              ) : (
                <>
                  <LogOut className="mr-2 h-4 w-4" />
                  Reset to Defaults
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
          <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300 flex items-center mb-2">
            <AlertCircle className="h-4 w-4 mr-2" />
            Advanced Settings Notice
          </h3>
          <p className="text-sm text-amber-700 dark:text-amber-300 ml-6">
            Changes to these settings can significantly impact site performance and functionality.
            Please use caution and only make changes if you understand the implications.
          </p>
        </div>
      </div>
    ),
  };

  if (isLoadingSettings) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <SettingsIcon className="mr-3 h-6 w-6 text-gray-600 dark:text-gray-300" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Site Settings</h1>
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
              Save Changes
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className="mb-6 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 p-4 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <p>{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 p-4 rounded-lg flex items-start gap-3">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0 mt-0.5" />
          <p>{success}</p>
        </div>
      )}

      <div className="bg-white dark:bg-film-black-900 rounded-xl shadow-sm overflow-hidden">
        <div className="flex border-b border-gray-200 dark:border-film-black-800">
          <button
            onClick={() => setActiveTab("general")}
            className={`px-6 py-4 text-sm font-medium ${activeTab === "general"
              ? "border-b-2 border-film-red-600 text-film-red-600 dark:text-film-red-500"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
          >
            General
          </button>
          <button
            onClick={() => setActiveTab("contact")}
            className={`px-6 py-4 text-sm font-medium ${activeTab === "contact"
              ? "border-b-2 border-film-red-600 text-film-red-600 dark:text-film-red-500"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
          >
            Contact
          </button>
          <button
            onClick={() => setActiveTab("seo")}
            className={`px-6 py-4 text-sm font-medium ${activeTab === "seo"
              ? "border-b-2 border-film-red-600 text-film-red-600 dark:text-film-red-500"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
          >
            SEO
          </button>
          <button
            onClick={() => setActiveTab("advanced")}
            className={`px-6 py-4 text-sm font-medium ${activeTab === "advanced"
              ? "border-b-2 border-film-red-600 text-film-red-600 dark:text-film-red-500"
              : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
          >
            Advanced
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {tabContent[activeTab as keyof typeof tabContent]}
          </form>
        </div>
      </div>

      {/* Last updated info */}
      <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
        Last updated: {settings?.updatedAt ? new Date(settings.updatedAt).toLocaleString() : "Never"} •
        Updated by: {user?.name || "Admin"}
      </div>

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowConfirmDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-film-black-900 p-6 rounded-xl max-w-md w-full m-4"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Confirm Action</h3>
              <p className="text-gray-700 dark:text-gray-300 mb-6">
                {confirmMessage}
              </p>
              <div className="flex justify-end gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    confirmAction();
                    setShowConfirmDialog(false);
                  }}
                >
                  Confirm
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Main component with Suspense boundary
const AdminSettingsPage = () => {
  return (
    <Suspense fallback={<SettingsPageLoading />}>
      <SettingsPageContent />
    </Suspense>
  );
};

export default AdminSettingsPage;

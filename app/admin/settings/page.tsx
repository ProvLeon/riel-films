"use client";
import { useState, useEffect, useCallback } from "react";
import { useData } from "@/context/DataContext";
import { Settings as SettingsIcon, Save, Upload, Trash2, Globe, Mail, Phone, Instagram, Facebook, Twitter, Youtube, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Button } from "@/components/UI/Button"; // Assuming Button component handles loading state
import { Settings } from "@/types/mongodbSchema";

// Helper component for Upload Button
const UploadButton = ({ onUpload }: { onUpload: (url: string) => void }) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, upload file here and get URL
      // For demo, we'll use a placeholder
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result as string); // Use data URL for local preview
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <label className="cursor-pointer px-3 py-1 bg-gray-100 dark:bg-film-black-700 border border-gray-300 dark:border-film-black-600 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-film-black-600 transition-colors flex items-center text-xs">
      <Upload className="h-3 w-3 mr-1" /> Upload
      <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
    </label>
  );
};

export default function SettingsPage() {
  const { settings, refetchSettings } = useData();
  const [formData, setFormData] = useState<Partial<Settings>>({
    siteName: '',
    siteDescription: '',
    contactEmail: '',
    contactPhone: '',
    logoLight: '',
    logoDark: '',
    metaImage: '',
    socialLinks: [
      { platform: 'instagram', url: '' },
      { platform: 'facebook', url: '' },
      { platform: 'twitter', url: '' },
      { platform: 'youtube', url: '' }
    ]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Memoize the settings update function
  const updateSettingsData = useCallback(() => {
    if (settings) {
      setFormData({
        siteName: settings.siteName || '',
        siteDescription: settings.siteDescription || '',
        contactEmail: settings.contactEmail || '',
        contactPhone: settings.contactPhone || '',
        logoLight: settings.logoLight || '',
        logoDark: settings.logoDark || '',
        metaImage: settings.metaImage || '',
        socialLinks: settings.socialLinks && settings.socialLinks.length > 0
          ? settings.socialLinks
          : [ // Ensure default structure if empty
            { platform: 'instagram', url: '' },
            { platform: 'facebook', url: '' },
            { platform: 'twitter', url: '' },
            { platform: 'youtube', url: '' }
          ]
      });
    }
  }, [settings]); // Only recalculate if settings change

  // Load settings when available or refetch if needed
  useEffect(() => {
    if (!settings) {
      refetchSettings();
    } else {
      updateSettingsData();
    }
  }, [settings, refetchSettings, updateSettingsData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSocialChange = (index: number, value: string) => {
    const updatedLinks = [...(formData.socialLinks || [])];
    if (updatedLinks[index]) {
      updatedLinks[index] = { ...updatedLinks[index], url: value };
      setFormData({ ...formData, socialLinks: updatedLinks });
    }
  };

  const handleImageChange = (field: keyof Settings, url: string) => {
    setFormData({ ...formData, [field]: url });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...settings, ...formData }), // Send combined data
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to save settings');
      }

      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      refetchSettings(); // Refresh data after save
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to save settings. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }

    // Hide message after 5 seconds
    setTimeout(() => {
      setMessage(null);
    }, 5000);
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <Instagram className="h-5 w-5" />;
      case 'facebook': return <Facebook className="h-5 w-5" />;
      case 'twitter': return <Twitter className="h-5 w-5" />;
      case 'youtube': return <Youtube className="h-5 w-5" />;
      default: return <Globe className="h-5 w-5" />;
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-film-black-950 min-h-screen">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center mb-8">
          <SettingsIcon className="h-6 w-6 text-film-red-600 mr-2" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Site Settings
          </h1>
        </div>

        {/* Settings form */}
        <form onSubmit={handleSubmit}>
          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className={`mb-6 p-4 rounded-lg flex items-center ${message.type === 'success'
                  ? 'bg-green-50 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                  : 'bg-red-50 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                  }`}
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                {message.text}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Column 1: General & Social */}
            <div className="lg:col-span-2 space-y-6">
              {/* General Settings Card */}
              <div className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-film-black-800">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-film-black-800 pb-3">
                  General Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="siteName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Site Name
                    </label>
                    <input
                      type="text"
                      id="siteName"
                      name="siteName"
                      value={formData.siteName || ''}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 dark:text-white"
                      placeholder="Riel Films"
                    />
                  </div>
                  <div>
                    <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Site Description (for SEO)
                    </label>
                    <textarea
                      id="siteDescription"
                      name="siteDescription"
                      value={formData.siteDescription || ''}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 dark:text-white"
                      placeholder="Authentic African storytelling..."
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Contact Email
                      </label>
                      <div className="relative">
                        <Mail className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                        <input
                          type="email"
                          id="contactEmail"
                          name="contactEmail"
                          value={formData.contactEmail || ''}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 dark:text-white"
                          placeholder="info@rielfilms.com"
                        />
                      </div>
                    </div>
                    <div>
                      <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Contact Phone
                      </label>
                      <div className="relative">
                        <Phone className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          id="contactPhone"
                          name="contactPhone"
                          value={formData.contactPhone || ''}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 dark:text-white"
                          placeholder="+233 12 345 6789"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links Card */}
              <div className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-film-black-800">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-film-black-800 pb-3">
                  Social Media Links
                </h2>
                <div className="space-y-4">
                  {formData.socialLinks?.map((social, index) => (
                    <div key={social.platform}>
                      <label htmlFor={`social-${social.platform}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize">
                        {social.platform}
                      </label>
                      <div className="flex items-center">
                        <div className="p-2 bg-gray-100 dark:bg-film-black-700 rounded-l-lg border border-r-0 border-gray-300 dark:border-film-black-600 text-gray-500 dark:text-gray-400">
                          {getSocialIcon(social.platform)}
                        </div>
                        <input
                          type="url"
                          id={`social-${social.platform}`}
                          value={social.url}
                          onChange={(e) => handleSocialChange(index, e.target.value)}
                          className="flex-1 px-4 py-2 rounded-r-lg bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-600 focus:outline-none focus:ring-2 focus:ring-film-red-500 dark:text-white"
                          placeholder={`https://www.${social.platform}.com/rielfilms`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 2: Branding */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-film-black-800 sticky top-24">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 border-b border-gray-200 dark:border-film-black-800 pb-3">
                  Branding & Media
                </h2>
                <div className="space-y-6">
                  {/* Logo Light */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Light Theme Logo
                    </label>
                    <div className="border border-dashed border-gray-300 dark:border-film-black-700 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 dark:bg-film-black-800/50 h-40 relative">
                      {formData.logoLight ? (
                        <>
                          <Image
                            src={formData.logoLight}
                            alt="Light logo preview"
                            fill
                            className="object-contain p-4"
                          />
                          <button
                            type="button"
                            onClick={() => handleImageChange('logoLight', '')}
                            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
                            title="Remove logo"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </>
                      ) : (
                        <div className="text-center">
                          <Upload className="h-8 w-8 text-gray-500 dark:text-gray-400 mx-auto mb-2" />
                          <UploadButton onUpload={(url) => handleImageChange('logoLight', url)} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Logo Dark */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Dark Theme Logo
                    </label>
                    <div className="border border-dashed border-gray-300 dark:border-film-black-700 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 dark:bg-film-black-800/50 h-40 relative">
                      {formData.logoDark ? (
                        <>
                          <Image
                            src={formData.logoDark}
                            alt="Dark logo preview"
                            fill
                            className="object-contain p-4"
                          />
                          <button
                            type="button"
                            onClick={() => handleImageChange('logoDark', '')}
                            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
                            title="Remove logo"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </>
                      ) : (
                        <div className="text-center">
                          <Upload className="h-8 w-8 text-gray-500 dark:text-gray-400 mx-auto mb-2" />
                          <UploadButton onUpload={(url) => handleImageChange('logoDark', url)} />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Default Meta Image */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Default Meta Image (SEO)
                    </label>
                    <div className="border border-dashed border-gray-300 dark:border-film-black-700 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 dark:bg-film-black-800/50 h-40 relative">
                      {formData.metaImage ? (
                        <>
                          <Image
                            src={formData.metaImage}
                            alt="Meta image preview"
                            fill
                            className="object-contain p-4"
                          />
                          <button
                            type="button"
                            onClick={() => handleImageChange('metaImage', '')}
                            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 transition-colors"
                            title="Remove image"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </>
                      ) : (
                        <div className="text-center">
                          <Upload className="h-8 w-8 text-gray-500 dark:text-gray-400 mx-auto mb-2" />
                          <UploadButton onUpload={(url) => handleImageChange('metaImage', url)} />
                        </div>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Used for social sharing previews (1200x630 recommended).
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end border-t border-gray-200 dark:border-film-black-800 pt-6">
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              disabled={isSubmitting}
              icon={<Save className="h-5 w-5 mr-2" />}
            >
              Save Settings
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

"use client";
import { useState, useEffect } from "react";
import { useData } from "@/context/DataContext";
import { Settings as SettingsIcon, Save, Upload, Trash2, Globe, Mail, Phone, Instagram, Facebook, Twitter, Youtube } from 'lucide-react';
// import AdminHeader from "@/components/admin/AdminHeader";
import { motion } from "framer-motion";
import Image from "next/image";

export default function SettingsPage() {
  const { settings, refetchSettings } = useData();
  const [formData, setFormData] = useState({
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
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Load settings when available
  useEffect(() => {
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
          : [
            { platform: 'instagram', url: '' },
            { platform: 'facebook', url: '' },
            { platform: 'twitter', url: '' },
            { platform: 'youtube', url: '' }
          ]
      });
    }
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSocialChange = (index: number, value: string) => {
    const updatedLinks = [...formData.socialLinks];
    updatedLinks[index].url = value;
    setFormData({ ...formData, socialLinks: updatedLinks });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      // Simulate API call for saving settings
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccessMessage('Settings saved successfully!');
      // In a real app, you would refetch settings here
      // refetchSettings();
    } catch (error) {
      setErrorMessage('Failed to save settings. Please try again.');
    } finally {
      setIsSubmitting(false);
    }

    // Hide success/error message after 5 seconds
    setTimeout(() => {
      setSuccessMessage('');
      setErrorMessage('');
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
      {/* <AdminHeader /> */}

      <div className="p-6">
        <div className="flex items-center mb-8">
          <SettingsIcon className="h-6 w-6 text-film-red-600 mr-2" />
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Site Settings
          </h1>
        </div>

        {/* Settings form */}
        <form onSubmit={handleSubmit}>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 p-4 bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300 rounded-lg"
            >
              {successMessage}
            </motion.div>
          )}

          {errorMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-6 p-4 bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300 rounded-lg"
            >
              {errorMessage}
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* General Settings */}
            <div className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
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
                    value={formData.siteName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 dark:text-white"
                    placeholder="Riel Films"
                  />
                </div>

                <div>
                  <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Site Description
                  </label>
                  <textarea
                    id="siteDescription"
                    name="siteDescription"
                    value={formData.siteDescription}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-2 rounded-lg bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 dark:text-white"
                    placeholder="African Stories, Global Impact"
                  />
                </div>

                <div>
                  <label htmlFor="contactEmail" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contact Email
                  </label>
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                    <input
                      type="email"
                      id="contactEmail"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleChange}
                      className="flex-1 px-4 py-2 rounded-lg bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 dark:text-white"
                      placeholder="info@rielfilms.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="contactPhone" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Contact Phone
                  </label>
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2" />
                    <input
                      type="text"
                      id="contactPhone"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleChange}
                      className="flex-1 px-4 py-2 rounded-lg bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 dark:text-white"
                      placeholder="+233 (0) 302 123 456"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Social Media Links
              </h2>

              <div className="space-y-4">
                {formData.socialLinks.map((social, index) => (
                  <div key={social.platform}>
                    <label htmlFor={`social-${social.platform}`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 capitalize">
                      {social.platform}
                    </label>
                    <div className="flex items-center">
                      {getSocialIcon(social.platform)}
                      <input
                        type="url"
                        id={`social-${social.platform}`}
                        value={social.url}
                        onChange={(e) => handleSocialChange(index, e.target.value)}
                        className="flex-1 ml-2 px-4 py-2 rounded-lg bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 dark:text-white"
                        placeholder={`https://${social.platform}.com/rielfilms`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Branding & Media */}
          <div className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm mt-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Branding & Media
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Logo Light */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Light Theme Logo
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-film-black-700 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 dark:bg-film-black-800/50 h-40">
                  {formData.logoLight ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={formData.logoLight}
                        alt="Light logo"
                        fill
                        className="object-contain"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="h-8 w-8 text-gray-500 dark:text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">Upload logo</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Logo Dark */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Dark Theme Logo
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-film-black-700 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 dark:bg-film-black-800/50 h-40">
                  {formData.logoDark ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={formData.logoDark}
                        alt="Dark logo"
                        fill
                        className="object-contain"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="h-8 w-8 text-gray-500 dark:text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">Upload logo</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Default Meta Image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Default Meta Image
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-film-black-700 rounded-lg p-4 flex flex-col items-center justify-center bg-gray-50 dark:bg-film-black-800/50 h-40">
                  {formData.metaImage ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={formData.metaImage}
                        alt="Meta image"
                        fill
                        className="object-contain"
                      />
                      <button
                        type="button"
                        className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="h-8 w-8 text-gray-500 dark:text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">Upload image</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-film-red-600 text-white rounded-lg hover:bg-film-red-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
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
                  <Save className="h-5 w-5 mr-2" />
                  Save Settings
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

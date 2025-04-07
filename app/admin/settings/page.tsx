"use client";
import { useState, useEffect, useCallback } from "react";
import { useData } from "@/context/DataContext";
import { Settings as SettingsIcon, Save, Globe, Mail, Phone, Instagram, Facebook, Twitter, Youtube, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/UI/Button";
import { Settings } from "@/types/mongodbSchema";
import ImageUploader from '@/components/admin/ImageUploader'; // *** CORRECT ***
import { Alert, AlertDescription, AlertTitle } from "@/components/UI/Alert";
import LoadingSpinner from "@/components/UI/LoadingSpinner";

// Reusable Input Components
const InputField = ({ id, label, ...props }: any) => (
  <div>
    <label htmlFor={id} className="label-style">{label}</label>
    <input id={id} name={id} className="input-style" {...props} />
  </div>
);
const TextareaField = ({ id, label, ...props }: any) => (
  <div>
    <label htmlFor={id} className="label-style">{label}</label>
    <textarea id={id} name={id} className="input-style" {...props} />
  </div>
);

export default function SettingsPage() {
  const { settings, refetchSettings, isLoadingSettings, errorSettings } = useData();
  // Ensure initial state matches the structure expected by the form and API
  const [formData, setFormData] = useState<Partial<Settings>>({
    siteName: '', siteDescription: '', contactEmail: '', contactPhone: '',
    logoLight: '', logoDark: '', metaImage: '',
    socialLinks: [
      { platform: 'instagram', url: '' }, { platform: 'facebook', url: '' },
      { platform: 'twitter', url: '' }, { platform: 'youtube', url: '' }
    ]
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // *** Corrected useEffect to handle potentially missing socialLinks ***
  useEffect(() => {
    if (settings) {
      const defaultSocialLinks = [
        { platform: 'instagram', url: '' }, { platform: 'facebook', url: '' },
        { platform: 'twitter', url: '' }, { platform: 'youtube', url: '' }
      ];
      const currentSocialLinks = settings.socialLinks && Array.isArray(settings.socialLinks)
        ? settings.socialLinks
        : [];

      const mergedSocialLinks = defaultSocialLinks.map(defaultLink => {
        const existingLink = currentSocialLinks.find(link => link.platform === defaultLink.platform);
        return existingLink ? { ...defaultLink, url: existingLink.url || '' } : defaultLink;
      });

      setFormData({
        siteName: settings.siteName || '',
        siteDescription: settings.siteDescription || '',
        contactEmail: settings.contactEmail || '',
        contactPhone: settings.contactPhone || '',
        logoLight: settings.logoLight || '', // Will be empty string or URL
        logoDark: settings.logoDark || '',   // Will be empty string or URL
        metaImage: settings.metaImage || '', // Will be empty string or URL
        socialLinks: mergedSocialLinks,
      });
    }
  }, [settings]);

  // Fetch on mount if needed
  useEffect(() => {
    if (!settings && !isLoadingSettings && !errorSettings) {
      refetchSettings();
    }
  }, [settings, isLoadingSettings, errorSettings, refetchSettings]);

  // --- Handlers (Corrected) ---
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setMessage(null);
  }, []);

  const handleSocialChange = useCallback((index: number, value: string) => {
    setFormData(prev => {
      // Ensure socialLinks exists and is an array before trying to update
      const currentLinks = Array.isArray(prev.socialLinks) ? [...prev.socialLinks] : [];
      if (currentLinks[index]) {
        currentLinks[index] = { ...currentLinks[index], url: value };
        return { ...prev, socialLinks: currentLinks };
      }
      return prev; // Return previous state if index is out of bounds
    });
    setMessage(null);
  }, []);

  // Correct handler for ImageUploader callbacks
  const handleImageUpdate = useCallback((fieldName: keyof Pick<Settings, 'logoLight' | 'logoDark' | 'metaImage'>, url: string | '') => {
    setFormData(prev => ({ ...prev, [fieldName]: url }));
    setMessage(null);
  }, []);
  // --- End Handlers ---

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      // Prepare payload with current form data
      const updatePayload = {
        siteName: formData.siteName,
        siteDescription: formData.siteDescription,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        logoLight: formData.logoLight,
        logoDark: formData.logoDark,
        metaImage: formData.metaImage,
        socialLinks: formData.socialLinks,
      };

      console.log("Submitting Settings:", updatePayload); // DEBUG: Check payload

      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePayload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }));
        console.error("API Error Response:", errorData); // DEBUG
        setMessage({ type: 'error', text: 'Failed to save settings!' });
        throw new Error(errorData.error || `Failed to save settings (Status: ${response.status})`);
      }

      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      refetchSettings();
    } catch (error: any) {
      console.error("Submit Error:", error); // DEBUG
      setMessage({ type: 'error', text: error.message || 'Failed to save settings. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
    setTimeout(() => { setMessage(null); }, 5000);
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

  // Loading state
  if (isLoadingSettings && !settings) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  // Error state during initial load
  if (errorSettings && !settings) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-10rem)]">
        <Alert variant="destructive" className="max-w-lg">
          <AlertTitle>Error Loading Settings</AlertTitle>
          <AlertDescription>{errorSettings}</AlertDescription>
        </Alert>
        <Button variant="secondary" onClick={refetchSettings} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }


  return (
    <div className="bg-gray-50 dark:bg-film-black-950 min-h-screen">
      <div className="p-6 max-w-7xl mx-auto">
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
        {/* ... Header ... */}
        <form onSubmit={handleSubmit}>
          {/* ... Message Display ... */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* --- General Settings Card --- */}
              <div className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-film-black-800">
                <h2 className="section-heading">General Information</h2>
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
              {/* --- Social Links Card --- */}
              <div className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-film-black-800">
                <h2 className="section-heading">Social Media Links</h2>
                <div className="space-y-4">
                  {/* Ensure formData.socialLinks is an array before mapping */}
                  {(Array.isArray(formData.socialLinks) ? formData.socialLinks : []).map((social, index) => (
                    <div key={social.platform || index}>
                      <label htmlFor={`social-${social.platform}`} className="label-style capitalize">{social.platform}</label>
                      <div className="flex items-center">
                        <div className="p-2.5 bg-gray-100 dark:bg-film-black-700 rounded-l-lg border border-r-0 border-gray-300 dark:border-film-black-600 text-gray-500 dark:text-gray-400">
                          {getSocialIcon(social.platform)}
                        </div>
                        <input type="url" id={`social-${social.platform}`} value={social.url || ''} onChange={(e) => handleSocialChange(index, e.target.value)} className="input-style rounded-l-none" placeholder={`https://www.${social.platform}.com/rielfilms`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* --- Branding Column --- */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-film-black-800 sticky top-24">
                <h2 className="section-heading">Branding & Media</h2>
                <div className="space-y-6">
                  {/* *** CORRECTLY Integrated ImageUploader *** */}
                  <ImageUploader
                    label="Light Theme Logo"
                    currentImageUrl={formData.logoLight}
                    onUploadComplete={(url) => handleImageUpdate('logoLight', url)}
                    onRemoveComplete={() => handleImageUpdate('logoLight', '')}
                    aspectRatio="aspect-auto"
                    recommendedText="Transparent background recommended"
                  />
                  <ImageUploader
                    label="Dark Theme Logo"
                    currentImageUrl={formData.logoDark}
                    onUploadComplete={(url) => handleImageUpdate('logoDark', url)}
                    onRemoveComplete={() => handleImageUpdate('logoDark', '')}
                    aspectRatio="aspect-auto"
                    recommendedText="Transparent background recommended"
                  />
                  <ImageUploader
                    label="Default Meta Image (SEO)"
                    currentImageUrl={formData.metaImage}
                    onUploadComplete={(url) => handleImageUpdate('metaImage', url)}
                    onRemoveComplete={() => handleImageUpdate('metaImage', '')}
                    recommendedText="1200x630px recommended"
                    aspectRatio="aspect-[1.91/1]"
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Submit Button */}
          <div className="mt-8 flex justify-end border-t border-gray-200 dark:border-film-black-800 pt-6">
            <Button type="submit" variant="primary" isLoading={isSubmitting} disabled={isSubmitting} icon={<Save className="h-5 w-5 mr-2" />}> Save Settings </Button>
          </div>
        </form>
      </div>
    </div>
  );
}


// Shared styles (can be in globals.css)
const styles = `
.input-style { @apply w-full px-4 py-2 rounded-lg bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 dark:text-white shadow-sm placeholder-gray-400 dark:placeholder-gray-500; }
.label-style { @apply block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1; }
.input-icon { @apply h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none; }
`;
if (typeof window !== 'undefined') { const styleSheet = document.createElement("style"); styleSheet.innerText = styles; document.head.appendChild(styleSheet); }

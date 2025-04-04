"use client";
import { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import dynamic from 'next/dynamic'; // Import dynamic
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Users, Image as ImageIcon, Link as LinkIcon, Smile, Clock, Calendar,
  Trash2, Copy, ChevronDown, Check, Edit, Eye, Save, X, AlignLeft, AlignCenter,
  AlignRight, Bold, Italic, Underline, List, Undo, Redo, Heading, Palette, Code,
  Type, Columns, Divide, PaletteIcon, Info, Monitor, Smartphone
} from 'lucide-react';
import { Button } from '@/components/UI/Button';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import Image from 'next/image';
import 'react-quill/dist/quill.snow.css'; // Import Quill styles

// Dynamically import ReactQuill only on the client side
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

// Interfaces (remain the same)
interface Segment { id: string; name: string; count: number; criteria?: string; }
interface Template { id: string; name: string; thumbnail: string; description: string; content: string; }

const EmailCampaignEditor = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [campaign, setCampaign] = useState({
    subject: '', preheader: '', template: '', segment: '',
    scheduledDate: '', scheduledTime: '', isScheduled: false
  });
  const [segments, setSegments] = useState<Segment[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [previewMode, setPreviewMode] = useState<'edit' | 'desktop' | 'mobile'>('edit');
  const [emailContent, setEmailContent] = useState('');
  const quillRef = useRef<any>(null); // Use any for dynamic import ref type

  // Fetch data (remains the same)
  useEffect(() => {
    setSegments([
      { id: 'all', name: 'All Subscribers', count: 1250, criteria: 'Everyone on your list' },
      { id: 'active', name: 'Active Subscribers', count: 1100, criteria: 'Opened email in last 90 days' },
      { id: 'docu-fans', name: 'Documentary Fans', count: 850, criteria: 'Interested in documentaries' },
      { id: 'new', name: 'New Subscribers', count: 320, criteria: 'Subscribed in last 30 days' }
    ]);
    setTemplates([
      { id: 'newsletter', name: 'Newsletter', thumbnail: '/images/email-templates/newsletter.jpg', description: 'Standard monthly updates', content: '<h1>Riel Films News</h1><p>Welcome! Stay tuned for exciting updates.</p>' },
      { id: 'announcement', name: 'New Release', thumbnail: '/images/email-templates/announcement.jpg', description: 'Announce a new film', content: '<h1>New Release!</h1><p>Check out our latest film: [Film Title]...</p>' },
      { id: 'event', name: 'Event Invite', thumbnail: '/images/email-templates/event.jpg', description: 'Invite to screenings/premieres', content: '<h1>You\'re Invited!</h1><p>Join us for the premiere of [Film Title]...</p>' },
      { id: 'blank', name: 'Blank Template', thumbnail: '/images/email-templates/blank.jpg', description: 'Start from scratch', content: '<p>Start writing your email here...</p>' }
    ]);
  }, []);

  // Helpers (remain the same)
  const getSegment = useCallback((id: string) => segments.find(s => s.id === id), [segments]);
  const getTemplate = useCallback((id: string) => templates.find(t => t.id === id), [templates]);

  // Handle template selection (remains the same)
  const handleTemplateSelect = (templateId: string) => {
    setCampaign({ ...campaign, template: templateId });
    const selectedTemplate = getTemplate(templateId);
    if (selectedTemplate) { setEmailContent(selectedTemplate.content); }
  };

  // Handle send/schedule (remains the same)
  const handleSendCampaign = () => {
    setIsLoading(true);
    console.log('Sending campaign:', { ...campaign, content: emailContent });
    setTimeout(() => {
      setIsLoading(false);
      alert('Campaign scheduled/sent successfully!');
      setStep(1);
    }, 1500);
  };

  // Format date (remains the same)
  const formatDateForInput = (date: Date) => date.toISOString().split('T')[0];

  // Quill Modules and Formats (remains the same)
  const quillModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image', 'video'], // Added video
      ['clean']
    ],
  };
  const quillFormats = [
    'header', 'bold', 'italic', 'underline', 'strike', 'list', 'bullet', 'align', 'link', 'image', 'video'
  ];

  // Validation (remains the same)
  const canProceed = () => {
    if (step === 1) return campaign.subject && campaign.segment && campaign.template;
    if (step === 2) return emailContent.replace(/<(.|\n)*?>/g, '').trim().length > 0;
    return true;
  };

  return (
    <div className="bg-white dark:bg-film-black-900 rounded-xl shadow-sm border border-gray-100 dark:border-film-black-800">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-film-black-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center">
            <Send className="h-6 w-6 text-film-red-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {step === 1 ? 'New Campaign: Setup' : step === 2 ? 'Design Your Email' : 'Review & Schedule'}
            </h2>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="secondary" onClick={() => step > 1 ? setStep(step - 1) : null} disabled={step === 1}>Back</Button>
            {step < 3 ? (
              <Button variant="primary" onClick={() => setStep(step + 1)} disabled={!canProceed()}>Next Step</Button>
            ) : (
              <Button variant="primary" onClick={handleSendCampaign} isLoading={isLoading} disabled={isLoading}>
                {campaign.isScheduled ? 'Schedule Campaign' : 'Send Now'}
              </Button>
            )}
          </div>
        </div>
        {/* Progress steps */}
        <div className="mt-6 flex items-center w-full max-w-md mx-auto">
          {[1, 2, 3].map(s => (
            <React.Fragment key={s}>
              <div className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors text-sm font-medium ${step >= s ? 'bg-film-red-600 text-white' : 'bg-gray-200 dark:bg-film-black-800 text-gray-600 dark:text-gray-400'}`}>{s}</div>
              {s < 3 && <div className={`h-0.5 flex-1 transition-colors ${step > s ? 'bg-film-red-600' : 'bg-gray-200 dark:bg-film-black-800'}`}></div>}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Setup */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <div className="max-w-4xl mx-auto space-y-8">
                {/* Campaign Details */}
                <div className="bg-gray-50 dark:bg-film-black-800/50 p-6 rounded-lg border border-gray-100 dark:border-film-black-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-film-black-700 pb-2">Campaign Details</h3>
                  <div className="space-y-4">
                    <div><label className="label-style">Email Subject <span className="text-red-500">*</span></label><input type="text" value={campaign.subject} onChange={(e) => setCampaign({ ...campaign, subject: e.target.value })} placeholder="Enter a compelling subject line" className="input-style" /></div>
                    <div><label className="label-style">Preheader Text <span className="text-gray-500 dark:text-gray-400 font-normal">(optional)</span></label><input type="text" value={campaign.preheader} onChange={(e) => setCampaign({ ...campaign, preheader: e.target.value })} placeholder="Brief text after subject line..." className="input-style" /><p className="mt-1 text-xs text-gray-500 dark:text-gray-400">Improves open rates in many email clients.</p></div>
                  </div>
                </div>
                {/* Recipients */}
                <div className="bg-gray-50 dark:bg-film-black-800/50 p-6 rounded-lg border border-gray-100 dark:border-film-black-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-film-black-700 pb-2">Select Recipients <span className="text-red-500">*</span></h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {segments.map(segment => (
                      <div key={segment.id} onClick={() => setCampaign({ ...campaign, segment: segment.id })} className={`segment-card ${campaign.segment === segment.id ? 'selected' : ''}`}>
                        <div className="flex justify-between items-start"><h4 className="font-medium text-gray-900 dark:text-white">{segment.name}</h4><span className="segment-count">{segment.count.toLocaleString()}</span></div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{segment.criteria}</p>
                        {campaign.segment === segment.id && <Check className="absolute top-2 right-2 h-5 w-5 text-film-red-500" />}
                      </div>
                    ))}
                  </div>
                </div>
                {/* Template */}
                <div className="bg-gray-50 dark:bg-film-black-800/50 p-6 rounded-lg border border-gray-100 dark:border-film-black-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-film-black-700 pb-2">Choose a Template <span className="text-red-500">*</span></h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {templates.map(template => (
                      <div key={template.id} onClick={() => handleTemplateSelect(template.id)} className={`template-card ${campaign.template === template.id ? 'selected' : ''}`}>
                        <div className="relative h-32 bg-gray-100 dark:bg-film-black-800"><Image src={template.thumbnail || '/images/placeholder.jpg'} alt={template.name} fill className="object-cover" /></div>
                        <div className="p-3"><h4 className="font-medium text-gray-900 dark:text-white text-sm">{template.name}</h4><p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{template.description}</p></div>
                        {campaign.template === template.id && <div className="absolute inset-0 border-2 border-film-red-500 rounded-lg pointer-events-none flex items-center justify-center bg-film-red-500/10"><Check className="h-6 w-6 text-film-red-500" /></div>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Design */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
                <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
                  {/* Preview Toggles */}
                  <Button variant={previewMode === 'edit' ? "primary" : "secondary"} size="sm" onClick={() => setPreviewMode('edit')} icon={<Edit className="h-4 w-4" />}>Edit</Button>
                  <Button variant={previewMode === 'desktop' ? "primary" : "secondary"} size="sm" onClick={() => setPreviewMode('desktop')} icon={<Monitor className="h-4 w-4" />}>Desktop</Button>
                  <Button variant={previewMode === 'mobile' ? "primary" : "secondary"} size="sm" onClick={() => setPreviewMode('mobile')} icon={<Smartphone className="h-4 w-4" />}>Mobile</Button>
                </div>
                <Button variant="secondary" size="sm" icon={<Save className="h-4 w-4" />}>Save Draft</Button>
              </div>

              {/* Editor / Preview Area */}
              <div className={`border border-gray-200 dark:border-film-black-700 rounded-lg overflow-hidden shadow-inner ${previewMode === 'mobile' ? 'max-w-sm mx-auto' : ''}`}>
                {/* Email Header Preview */}
                <div className="bg-gray-50 dark:bg-film-black-800 p-4 border-b border-gray-200 dark:border-film-black-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">From: Riel Films &lt;no-reply@rielfilms.com&gt;</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">To: {getSegment(campaign.segment)?.name || 'Recipients'}</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Subject: {campaign.subject || '[Email Subject]'}</p>
                </div>

                {previewMode === 'edit' && ReactQuill ? ( // Check if ReactQuill is loaded
                  // Rich Text Editor (Quill)
                  <div className="bg-white dark:bg-film-black-900">
                    <Suspense fallback={<LoadingSpinner />}> {/* Suspense boundary for Quill */}
                      <ReactQuill
                        ref={quillRef}
                        theme="snow"
                        value={emailContent}
                        onChange={setEmailContent}
                        modules={quillModules}
                        formats={quillFormats}
                        className="quill-editor"
                      />
                    </Suspense>
                  </div>
                ) : (
                  // HTML Preview
                  <div className="p-6 bg-white dark:bg-film-black-900 min-h-[400px]">
                    <div dangerouslySetInnerHTML={{ __html: emailContent }} className="prose dark:prose-invert max-w-none" />
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Step 3: Review & Schedule */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
              <div className="max-w-3xl mx-auto space-y-8">
                {/* Summary Card */}
                <div className="bg-gray-50 dark:bg-film-black-800/50 p-6 rounded-lg border border-gray-100 dark:border-film-black-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-film-black-700 pb-2">Campaign Summary</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Subject:</span> <span className="font-medium text-right text-gray-900 dark:text-white">{campaign.subject}</span></div>
                    <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Recipients:</span> <span className="font-medium text-right text-gray-900 dark:text-white">{getSegment(campaign.segment)?.name} ({getSegment(campaign.segment)?.count.toLocaleString()})</span></div>
                    <div className="flex justify-between"><span className="text-gray-600 dark:text-gray-400">Template:</span> <span className="font-medium text-right text-gray-900 dark:text-white">{getTemplate(campaign.template)?.name}</span></div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-film-black-700">
                    <Button variant="secondary" size="sm" onClick={() => setStep(2)} icon={<Edit className="h-4 w-4" />}>Edit Content</Button>
                  </div>
                </div>

                {/* Scheduling Card */}
                <div className="bg-gray-50 dark:bg-film-black-800/50 p-6 rounded-lg border border-gray-100 dark:border-film-black-700">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-film-black-700 pb-2">Schedule Send</h3>
                  <div className="flex items-center mb-4">
                    <input type="checkbox" id="scheduleEmail" checked={campaign.isScheduled} onChange={(e) => setCampaign({ ...campaign, isScheduled: e.target.checked })} className="h-4 w-4 text-film-red-600 focus:ring-film-red-500 border-gray-300 rounded" />
                    <label htmlFor="scheduleEmail" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">Schedule for later</label>
                  </div>
                  <AnimatePresence>
                    {campaign.isScheduled && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="ml-6 space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div><label className="label-style">Date</label><div className="relative"><input type="date" value={campaign.scheduledDate} onChange={(e) => setCampaign({ ...campaign, scheduledDate: e.target.value })} min={formatDateForInput(new Date())} className="input-style pr-10" /><Calendar className="input-icon" /></div></div>
                          <div><label className="label-style">Time</label><div className="relative"><input type="time" value={campaign.scheduledTime} onChange={(e) => setCampaign({ ...campaign, scheduledTime: e.target.value })} className="input-style pr-10" /><Clock className="input-icon" /></div></div>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center"><Info size={14} className="mr-1" /> Email will be sent at the specified time in your local timezone.</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Final Action Button */}
                <div className="flex justify-end mt-6">
                  <Button variant="primary" size="lg" onClick={handleSendCampaign} isLoading={isLoading} disabled={isLoading || (campaign.isScheduled && (!campaign.scheduledDate || !campaign.scheduledTime))} icon={<Send className="h-5 w-5" />}>
                    {campaign.isScheduled ? `Schedule for ${campaign.scheduledDate || 'later'}` : 'Send Campaign Now'}
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

// Add CSS for specific elements
const styles = `
  .label-style { @apply block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1; }
  .input-style { @apply w-full px-4 py-2 rounded-lg bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 dark:text-white shadow-sm; }
  .input-icon { @apply h-4 w-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none; }
  .segment-card { @apply p-4 rounded-lg border cursor-pointer transition-all duration-200 relative overflow-hidden; }
  .segment-card:not(.selected) { @apply border-gray-200 dark:border-film-black-700 hover:border-film-red-300 dark:hover:border-film-red-800 bg-white dark:bg-film-black-900; }
  .segment-card.selected { @apply border-film-red-500 ring-2 ring-film-red-500/50 bg-film-red-50 dark:bg-film-red-900/10; }
  .segment-count { @apply text-sm font-medium px-2 py-1 rounded-full bg-gray-100 dark:bg-film-black-700 text-gray-700 dark:text-gray-300; }
  .template-card { @apply rounded-lg overflow-hidden border cursor-pointer transition-all duration-200 bg-white dark:bg-film-black-900; }
  .template-card:not(.selected) { @apply border-gray-200 dark:border-film-black-700 hover:border-film-red-300 dark:hover:border-film-red-800 hover:shadow-md; }
  .template-card.selected { @apply border-film-red-500 ring-2 ring-film-red-500/50 shadow-lg; }
  /* Quill Editor Styling */
  .quill-editor .ql-toolbar { @apply bg-gray-50 dark:bg-film-black-800 border-gray-200 dark:border-film-black-700 rounded-t-lg border-b-0; }
  .quill-editor .ql-toolbar .ql-stroke { @apply stroke-gray-600 dark:stroke-gray-300; }
  .quill-editor .ql-toolbar .ql-fill { @apply fill-gray-600 dark:fill-gray-300; }
  .quill-editor .ql-toolbar .ql-picker-label { @apply text-gray-600 dark:text-gray-300; }
  .quill-editor .ql-container { @apply border-gray-200 dark:border-film-black-700 rounded-b-lg text-gray-900 dark:text-white; min-height: 350px; font-size: 1rem; }
  .quill-editor .ql-editor { @apply p-4; }
  .quill-editor .ql-editor.ql-blank::before { @apply text-gray-400 dark:text-gray-500 not-italic; }
`;

if (typeof window !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.innerText = styles;
  document.head.appendChild(styleSheet);
}

export default EmailCampaignEditor;

"use client";
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Send, Users, Image as ImageIcon, Link as LinkIcon, Smile, Clock, Calendar,
  Trash2, Copy, ChevronDown, Check, Edit, Eye, Save, X, AlignLeft, AlignCenter,
  AlignRight, Bold, Italic, Underline, List, Undo, Redo, Heading
} from 'lucide-react';
import { Button } from '@/components/UI/Button';
import LoadingSpinner from '@/components/UI/LoadingSpinner';
import Image from 'next/image';

interface Segment {
  id: string;
  name: string;
  count: number;
  criteria?: string;
}

interface Template {
  id: string;
  name: string;
  thumbnail: string;
  description: string;
}

const EmailCampaignEditor = () => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [campaign, setCampaign] = useState({
    subject: '',
    preheader: '',
    template: '',
    segment: '',
    scheduledDate: '',
    isScheduled: false
  });
  const [segments, setSegments] = useState<Segment[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [emailContent, setEmailContent] = useState('');
  const editorRef = useRef<HTMLDivElement>(null);

  // Fetch segments and templates on mount
  useEffect(() => {
    // In a real app, you would fetch from your API
    // For this demo, we'll use mock data
    setSegments([
      { id: 'all', name: 'All Subscribers', count: 1250, criteria: 'Everyone on your list' },
      { id: 'active', name: 'Active Subscribers', count: 1100, criteria: 'Opened an email in the last 90 days' },
      { id: 'documentary', name: 'Documentary Fans', count: 850, criteria: 'Interested in documentaries' },
      { id: 'recent', name: 'New Subscribers', count: 320, criteria: 'Subscribed in the last 30 days' }
    ]);

    setTemplates([
      {
        id: 'newsletter',
        name: 'Monthly Newsletter',
        thumbnail: '/images/email-templates/newsletter.jpg',
        description: 'Our standard newsletter template with the latest news and updates'
      },
      {
        id: 'announcement',
        name: 'New Release Announcement',
        thumbnail: '/images/email-templates/announcement.jpg',
        description: 'Announce a new film or production to your audience'
      },
      {
        id: 'event',
        name: 'Event Invitation',
        thumbnail: '/images/email-templates/event.jpg',
        description: 'Invite subscribers to screenings, premieres or other events'
      },
      {
        id: 'blank',
        name: 'Blank Template',
        thumbnail: '/images/email-templates/blank.jpg',
        description: 'Start from scratch with a minimal template'
      }
    ]);
  }, []);

  // Helper to get segment by ID
  const getSegment = (id: string) => {
    return segments.find(segment => segment.id === id);
  };

  // Helper to get template by ID
  const getTemplate = (id: string) => {
    return templates.find(template => template.id === id);
  };

  // Handle campaign sending
  const handleSendCampaign = () => {
    setIsLoading(true);

    // In a real app, you would call your API here
    setTimeout(() => {
      setIsLoading(false);
      alert('Campaign scheduled successfully!');
      // Redirect to campaigns list or show success message
    }, 1500);
  };

  // Format date for input
  const formatDateForInput = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // WYSIWYG editor commands
  const execCommand = (command: string, value: string = '') => {
    document.execCommand(command, false, value);

    // Focus back on the editor
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  // Initialize editor content
  useEffect(() => {
    if (editorRef.current && campaign.template) {
      // In a real app, you would load the template content
      const template = getTemplate(campaign.template);
      if (template) {
        let content = '';

        switch (template.id) {
          case 'newsletter':
            content = `
              <h1 style="color: #E53E3E; margin-bottom: 20px;">Riel Films Newsletter</h1>
              <p>Dear Subscriber,</p>
              <p>Welcome to our monthly newsletter. Here's what's new at Riel Films:</p>
              <ul>
                <li>New documentary release</li>
                <li>Behind the scenes footage</li>
                <li>Upcoming events</li>
              </ul>
              <p>Stay tuned for more updates!</p>
              <p>The Riel Films Team</p>
            `;
            break;
          case 'announcement':
            content = `
              <h1 style="color: #E53E3E; margin-bottom: 20px;">New Film Release</h1>
              <p>We're excited to announce our latest documentary:</p>
              <h2 style="color: #2D3748; margin: 15px 0;">The Silent Victory</h2>
              <p>An inspiring journey through the untold stories of perseverance.</p>
              <p>Premiering on <strong>October 15th, 2023</strong>.</p>
              <p>Don't miss it!</p>
            `;
            break;
          case 'event':
            content = `
              <h1 style="color: #E53E3E; margin-bottom: 20px;">You're Invited</h1>
              <p>Join us for the premiere screening of:</p>
              <h2 style="color: #2D3748; margin: 15px 0;">Mountain Echoes</h2>
              <p><strong>Date:</strong> November 10th, 2023</p>
              <p><strong>Time:</strong> 7:00 PM</p>
              <p><strong>Location:</strong> Grand Cinema, Accra</p>
              <p>RSVP by November 1st to secure your seat.</p>
            `;
            break;
          default:
            content = `<p>Start typing your email content here...</p>`;
        }

        editorRef.current.innerHTML = content;
      }
    }
  }, [campaign.template]);

  return (
    <div className="bg-white dark:bg-film-black-900 rounded-xl shadow-sm border border-gray-100 dark:border-film-black-800">
      {/* Header section */}
      <div className="p-6 border-b border-gray-200 dark:border-film-black-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center">
            <Send className="h-6 w-6 text-film-red-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {step === 1 ? 'New Email Campaign' : step === 2 ? 'Design Your Email' : 'Review & Schedule'}
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="secondary"
              onClick={() => step > 1 ? setStep(step - 1) : null}
              disabled={step === 1}
            >
              Back
            </Button>
            {step < 3 ? (
              <Button
                variant="primary"
                onClick={() => setStep(step + 1)}
                disabled={
                  (step === 1 && (!campaign.subject || !campaign.segment || !campaign.template)) ||
                  (step === 2 && !emailContent)
                }
              >
                Next Step
              </Button>
            ) : (
              <Button
                variant="primary"
                onClick={handleSendCampaign}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="small" />
                    Sending...
                  </>
                ) : campaign.isScheduled ? 'Schedule Campaign' : 'Send Now'}
              </Button>
            )}
          </div>
        </div>

        {/* Progress steps */}
        <div className="mt-6 flex items-center w-full">
          <div className="flex items-center w-full">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${step >= 1 ? 'bg-film-red-600 text-white' : 'bg-gray-200 dark:bg-film-black-800 text-gray-600 dark:text-gray-400'
              }`}>
              1
            </div>
            <div className={`h-1 flex-1 ${step > 1 ? 'bg-film-red-600' : 'bg-gray-200 dark:bg-film-black-800'
              }`}></div>
            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${step >= 2 ? 'bg-film-red-600 text-white' : 'bg-gray-200 dark:bg-film-black-800 text-gray-600 dark:text-gray-400'
              }`}>
              2
            </div>
            <div className={`h-1 flex-1 ${step > 2 ? 'bg-film-red-600' : 'bg-gray-200 dark:bg-film-black-800'
              }`}></div>
            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${step >= 3 ? 'bg-film-red-600 text-white' : 'bg-gray-200 dark:bg-film-black-800 text-gray-600 dark:text-gray-400'
              }`}>
              3
            </div>
          </div>
        </div>
      </div>

      {/* Step content */}
      <div className="p-6">
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="max-w-3xl mx-auto">
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Campaign Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={campaign.subject}
                      onChange={(e) => setCampaign({ ...campaign, subject: e.target.value })}
                      placeholder="Enter a compelling subject line"
                      className="w-full px-4 py-2 rounded-lg bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Preheader Text <span className="text-gray-500 dark:text-gray-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={campaign.preheader}
                      onChange={(e) => setCampaign({ ...campaign, preheader: e.target.value })}
                      placeholder="Brief text that appears after the subject line in some email clients"
                      className="w-full px-4 py-2 rounded-lg bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 dark:text-white"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      This text will appear in the inbox preview on most email clients, improving open rates.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Select Recipients
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {segments.map((segment) => (
                    <div
                      key={segment.id}
                      onClick={() => setCampaign({ ...campaign, segment: segment.id })}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors ${campaign.segment === segment.id
                          ? 'border-film-red-600 dark:border-film-red-500 bg-film-red-50 dark:bg-film-red-900/10'
                          : 'border-gray-200 dark:border-film-black-700 hover:border-film-red-300 dark:hover:border-film-red-800'
                        }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{segment.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{segment.criteria}</p>
                        </div>
                        <span className="text-sm font-medium px-2 py-1 rounded-full bg-gray-100 dark:bg-film-black-800 text-gray-700 dark:text-gray-300">
                          {segment.count.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Choose a Template
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {templates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => setCampaign({ ...campaign, template: template.id })}
                      className={`rounded-lg overflow-hidden border cursor-pointer transition-all ${campaign.template === template.id
                          ? 'border-film-red-600 dark:border-film-red-500 ring-2 ring-film-red-500 transform scale-[1.02]'
                          : 'border-gray-200 dark:border-film-black-700 hover:border-film-red-300 dark:hover:border-film-red-800'
                        }`}
                    >
                      <div className="relative h-32 bg-gray-100 dark:bg-film-black-800">
                        <Image
                          src={template.thumbnail || '/images/placeholder.jpg'}
                          alt={template.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">{template.name}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          {template.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-2">
                <Button
                  variant={previewMode ? "secondary" : "primary"}
                  size="sm"
                  onClick={() => setPreviewMode(false)}
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button
                  variant={previewMode ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setPreviewMode(true)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Button>
              </div>

              <div className="flex space-x-2">
                <Button variant="secondary" size="sm">
                  <Save className="h-4 w-4 mr-1" />
                  Save as Draft
                </Button>
              </div>
            </div>

            {/* Email preview */}
            <div className="border border-gray-200 dark:border-film-black-700 rounded-lg overflow-hidden shadow-sm">
              {/* Email header */}
              <div className="bg-gray-50 dark:bg-film-black-800 p-4 border-b border-gray-200 dark:border-film-black-700">
                <div className="mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">From: </span>
                  <span className="text-sm text-gray-800 dark:text-gray-200">Riel Films &lt;newsletter@rielfilms.com&gt;</span>
                </div>
                <div className="mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">To: </span>
                  <span className="text-sm text-gray-800 dark:text-gray-200">
                    {getSegment(campaign.segment)?.name || 'Recipients'}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Subject: </span>
                  <span className="text-sm text-gray-800 dark:text-gray-200">
                    {campaign.subject || 'Your email subject'}
                  </span>
                </div>
              </div>

              {previewMode ? (
                // Preview mode
                <div className="p-6 bg-white dark:bg-film-black-900 min-h-[400px]">
                  <div
                    dangerouslySetInnerHTML={{ __html: editorRef.current?.innerHTML || '' }}
                    className="prose dark:prose-invert max-w-none"
                  />
                </div>
              ) : (
                // Edit mode
                <>
                  {/* Editor toolbar */}
                  <div className="bg-gray-50 dark:bg-film-black-800 p-2 flex flex-wrap gap-1 border-b border-gray-200 dark:border-film-black-700">
                    {/* Text formatting */}
                    <button
                      onClick={() => execCommand('bold')}
                      className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-film-black-700 text-gray-700 dark:text-gray-300"
                      title="Bold"
                    >
                      <Bold className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => execCommand('italic')}
                      className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-film-black-700 text-gray-700 dark:text-gray-300"
                      title="Italic"
                    >
                      <Italic className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => execCommand('underline')}
                      className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-film-black-700 text-gray-700 dark:text-gray-300"
                      title="Underline"
                    >
                      <Underline className="h-4 w-4" />
                    </button>

                    <div className="h-6 w-px bg-gray-300 dark:bg-film-black-700 mx-1"></div>

                    {/* Heading */}
                    <div className="relative">
                      <button
                        onClick={() => { }}
                        className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-film-black-700 text-gray-700 dark:text-gray-300 flex items-center"
                        title="Heading"
                      >
                        <Heading className="h-4 w-4 mr-1" />
                        <ChevronDown className="h-3 w-3" />
                      </button>
                      {/* Dropdown would go here */}
                    </div>

                    {/* Text alignment */}
                    <button
                      onClick={() => execCommand('justifyLeft')}
                      className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-film-black-700 text-gray-700 dark:text-gray-300"
                      title="Align Left"
                    >
                      <AlignLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => execCommand('justifyCenter')}
                      className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-film-black-700 text-gray-700 dark:text-gray-300"
                      title="Align Center"
                    >
                      <AlignCenter className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => execCommand('justifyRight')}
                      className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-film-black-700 text-gray-700 dark:text-gray-300"
                      title="Align Right"
                    >
                      <AlignRight className="h-4 w-4" />
                    </button>

                    <div className="h-6 w-px bg-gray-300 dark:bg-film-black-700 mx-1"></div>

                    {/* Lists */}
                    <button
                      onClick={() => execCommand('insertUnorderedList')}
                      className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-film-black-700 text-gray-700 dark:text-gray-300"
                      title="Bullet List"
                    >
                      <List className="h-4 w-4" />
                    </button>

                    <div className="h-6 w-px bg-gray-300 dark:bg-film-black-700 mx-1"></div>

                    {/* Insert */}
                    <button
                      onClick={() => { }}
                      className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-film-black-700 text-gray-700 dark:text-gray-300"
                      title="Insert Image"
                    >
                      <ImageIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => { }}
                      className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-film-black-700 text-gray-700 dark:text-gray-300"
                      title="Insert Link"
                    >
                      <LinkIcon className="h-4 w-4" />
                    </button>

                    <div className="h-6 w-px bg-gray-300 dark:bg-film-black-700 mx-1"></div>

                    {/* Undo/Redo */}
                    <button
                      onClick={() => execCommand('undo')}
                      className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-film-black-700 text-gray-700 dark:text-gray-300"
                      title="Undo"
                    >
                      <Undo className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => execCommand('redo')}
                      className="p-1.5 rounded hover:bg-gray-200 dark:hover:bg-film-black-700 text-gray-700 dark:text-gray-300"
                      title="Redo"
                    >
                      <Redo className="h-4 w-4" />
                    </button>
                  </div>

                  {/* WYSIWYG editor */}
                  <div
                    ref={editorRef}
                    contentEditable
                    className="p-6 bg-white dark:bg-film-black-900 min-h-[400px] prose dark:prose-invert max-w-none focus:outline-none"
                    onInput={() => setEmailContent(editorRef.current?.innerHTML || '')}
                    onBlur={() => setEmailContent(editorRef.current?.innerHTML || '')}
                    dangerouslySetInnerHTML={{ __html: '' }} // Will be populated via useEffect
                  />
                </>
              )}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="max-w-3xl mx-auto">
              <div className="bg-gray-50 dark:bg-film-black-800 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                  Campaign Summary
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Subject Line
                    </div>
                    <div className="w-2/3 text-sm text-gray-900 dark:text-white">
                      {campaign.subject}
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Recipients
                    </div>
                    <div className="w-2/3 text-sm text-gray-900 dark:text-white">
                      {getSegment(campaign.segment)?.name}
                      <span className="text-gray-600 dark:text-gray-400 ml-1">
                        ({getSegment(campaign.segment)?.count.toLocaleString()} subscribers)
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <div className="w-1/3 text-sm font-medium text-gray-700 dark:text-gray-300">
                      Template
                    </div>
                    <div className="w-2/3 text-sm text-gray-900 dark:text-white">
                      {getTemplate(campaign.template)?.name}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 dark:border-film-black-700 pt-4">
                    <div className="flex items-center mb-4">
                      <input
                        type="checkbox"
                        id="scheduleEmail"
                        checked={campaign.isScheduled}
                        onChange={(e) => setCampaign({ ...campaign, isScheduled: e.target.checked })}
                        className="h-4 w-4 text-film-red-600 focus:ring-film-red-500 border-gray-300 rounded"
                      />
                      <label htmlFor="scheduleEmail" className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                        Schedule for later
                      </label>
                    </div>

                    {campaign.isScheduled && (
                      <div className="ml-6">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                          <div className="relative">
                            <input
                              type="date"
                              value={campaign.scheduledDate}
                              onChange={(e) => setCampaign({ ...campaign, scheduledDate: e.target.value })}
                              min={formatDateForInput(new Date())}
                              className="px-4 py-2 rounded-lg bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 dark:text-white"
                            />
                            <Calendar className="h-4 w-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                          </div>

                          <div className="relative">
                            <input
                              type="time"
                              className="px-4 py-2 rounded-lg bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 dark:text-white"
                            />
                            <Clock className="h-4 w-4 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>
                        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                          Email will be sent at the specified time in your local timezone.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-film-black-800 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                  <Eye className="h-5 w-5 mr-2 text-film-red-600" />
                  Email Preview
                </h3>

                <div className="border border-gray-200 dark:border-film-black-700 rounded-lg overflow-hidden bg-white dark:bg-film-black-900">
                  {/* Email header preview */}
                  <div className="bg-gray-100 dark:bg-film-black-800 p-3 border-b border-gray-200 dark:border-film-black-700">
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-film-red-600 flex items-center justify-center text-white text-xs mr-2">
                        R
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          Riel Films
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {campaign.subject}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Email content preview (truncated) */}
                  <div className="p-4 max-h-[300px] overflow-y-auto">
                    <div
                      dangerouslySetInnerHTML={{ __html: emailContent }}
                      className="prose dark:prose-invert max-w-none"
                    />
                  </div>

                  {/* Preview actions */}
                  <div className="bg-gray-50 dark:bg-film-black-800 p-3 border-t border-gray-200 dark:border-film-black-700 flex justify-end">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setStep(2)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit Content
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default EmailCampaignEditor;

"use client";
import React, { useState } from "react"; // Added useState
import { Button } from "@/components/UI/Button";
import Image from "next/image";
import PageTransition from "@/components/UI/PageTransition";
import SectionReveal from "@/components/UI/SectionReveal";
import { Mail, Phone, MapPin, Send, Instagram, Facebook, Twitter, Youtube } from "lucide-react"; // Added Send and social icons
import { AnimatePresence, motion } from "framer-motion"; // Added motion
import { Alert, AlertDescription, AlertTitle } from "@/components/UI/Alert"; // For feedback
import Link from "next/link";

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', inquiryType: '', message: '', privacy: false });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target as HTMLInputElement;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setSubmitStatus(null); // Clear status on input change
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.privacy) {
      setSubmitStatus({ type: 'error', message: 'You must agree to the privacy policy.' });
      return;
    }
    setIsSubmitting(true);
    setSubmitStatus(null);

    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Example: Simulate success/error
    const success = Math.random() > 0.2; // 80% success rate
    if (success) {
      setSubmitStatus({ type: 'success', message: 'Your message has been sent successfully! We will get back to you soon.' });
      setFormData({ name: '', email: '', subject: '', inquiryType: '', message: '', privacy: false }); // Reset form
    } else {
      setSubmitStatus({ type: 'error', message: 'Failed to send message. Please try again later.' });
    }

    setIsSubmitting(false);
  };

  const socialLinks = [
    { Icon: Facebook, href: "#", label: "Facebook" },
    { Icon: Instagram, href: "#", label: "Instagram" },
    { Icon: Twitter, href: "#", label: "Twitter" },
    { Icon: Youtube, href: "#", label: "YouTube" },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-white dark:bg-film-black-950 pt-32 pb-20"> {/* Increased pt */}
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <SectionReveal>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-film-black-900 dark:text-white text-center">
                Get In <span className="text-film-red-600">Touch</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 mb-16 max-w-3xl mx-auto text-center leading-relaxed">
                We'd love to hear from you! Whether you're interested in our films, exploring collaborations, or have questions, our team is ready to connect.
              </p>
            </SectionReveal>

            {/* Contact details and form */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 mb-20 items-start">
              {/* Contact information */}
              <SectionReveal direction="left" className="lg:col-span-2">
                <div className="bg-gray-50 dark:bg-film-black-900 p-8 rounded-xl border border-gray-100 dark:border-film-black-800">
                  <h2 className="text-2xl font-semibold mb-8 text-film-black-900 dark:text-white">Contact Information</h2>
                  <div className="space-y-8">
                    {/* Contact Methods */}
                    {[
                      { icon: Phone, title: "Phone", lines: ["+233 (0) 302 123 456", "Mon-Fri, 9am-5pm GMT"], href: "tel:+233302123456" },
                      { icon: Mail, title: "Email", lines: ["info@rielfilms.com", "Press: press@rielfilms.com"], href: "mailto:info@rielfilms.com" },
                      { icon: MapPin, title: "Location", lines: ["17 Independence Avenue", "Accra, Ghana"], href: "#map-section" } // Link to map section
                    ].map(item => (
                      <div key={item.title} className="flex items-start">
                        <div className="w-12 h-12 bg-film-red-100 dark:bg-film-red-900/30 rounded-full flex items-center justify-center mr-5 flex-shrink-0">
                          <item.icon className="h-6 w-6 text-film-red-600 dark:text-film-red-500" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium mb-1 text-film-black-900 dark:text-white">{item.title}</h3>
                          {item.lines.map((line, index) => (
                            item.href && (index === 0 || item.title === 'Email') ? // Make first line/emails clickable
                              <a key={index} href={item.href} className="block text-gray-700 dark:text-gray-300 hover:text-film-red-600 dark:hover:text-film-red-500 transition-colors">{line}</a>
                              : <p key={index} className="text-gray-700 dark:text-gray-300">{line}</p>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Social Media */}
                  <div className="mt-10 pt-8 border-t border-gray-200 dark:border-film-black-800">
                    <h3 className="text-lg font-medium mb-4 text-film-black-900 dark:text-white">Connect With Us</h3>
                    <div className="flex space-x-4">
                      {socialLinks.map(({ Icon, href, label }) => (
                        <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label}
                          className="w-10 h-10 rounded-full bg-film-black-900 dark:bg-film-black-700 flex items-center justify-center text-gray-400 hover:bg-film-red-600 hover:text-white transition-colors duration-300"
                          whileHover={{ y: -3, scale: 1.1 }} transition={{ type: "spring", stiffness: 400 }}
                        > <Icon className="h-5 w-5" /> </motion.a>
                      ))}
                    </div>
                  </div>
                </div>
              </SectionReveal>

              {/* Contact form */}
              <SectionReveal direction="right" delay={0.2} className="lg:col-span-3">
                <div className="bg-white dark:bg-film-black-900 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-film-black-800">
                  <h2 className="text-2xl font-semibold mb-6 text-film-black-900 dark:text-white">Send Us a Message</h2>
                  <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div><label htmlFor="name" className="label-style">Name<span className="text-red-500">*</span></label><input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} placeholder="Your name" className="input-style" required /></div>
                      <div><label htmlFor="email" className="label-style">Email<span className="text-red-500">*</span></label><input type="email" id="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Your email" className="input-style" required /></div>
                    </div>
                    <div><label htmlFor="subject" className="label-style">Subject</label><input type="text" id="subject" name="subject" value={formData.subject} onChange={handleInputChange} placeholder="What is your message about?" className="input-style" /></div>
                    <div><label htmlFor="inquiryType" className="label-style">Inquiry Type</label><select id="inquiryType" name="inquiryType" value={formData.inquiryType} onChange={handleInputChange} className="input-style"><option value="">Select an option</option><option value="general">General Inquiry</option><option value="collaboration">Collaboration</option><option value="distribution">Distribution</option><option value="press">Press & Media</option><option value="careers">Careers</option></select></div>
                    <div><label htmlFor="message" className="label-style">Message<span className="text-red-500">*</span></label><textarea id="message" name="message" rows={5} value={formData.message} onChange={handleInputChange} placeholder="Your message" className="input-style" required></textarea></div>
                    <div className="flex items-center"><input id="privacy" name="privacy" type="checkbox" checked={formData.privacy} onChange={handleInputChange} className="h-4 w-4 text-film-red-600 focus:ring-film-red-500 border-gray-300 rounded" /><label htmlFor="privacy" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">I agree to the <Link href="/privacy-policy" className="text-film-red-600 dark:text-film-red-500 hover:underline">privacy policy</Link><span className="text-red-500">*</span></label></div>
                    {/* Submission Feedback */}
                    <AnimatePresence>
                      {submitStatus && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          <Alert variant={submitStatus.type === 'error' ? 'destructive' : 'success'}>
                            <AlertDescription>{submitStatus.message}</AlertDescription>
                          </Alert>
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <Button variant="primary" type="submit" className="w-full !py-3.5" isLoading={isSubmitting} disabled={isSubmitting}>
                      {!isSubmitting && <Send className="mr-2 h-5 w-5" />} Send Message
                    </Button>
                  </form>
                </div>
              </SectionReveal>
            </div>
          </div>

          {/* Map Section */}
          <SectionReveal id="map-section">
            <div className="mb-20 rounded-xl overflow-hidden shadow-lg h-[400px] md:h-[500px] relative bg-gray-200 dark:bg-film-black-800">
              {/* Placeholder - Replace with actual map embed (e.g., Google Maps iframe) */}
              <Image src="/images/map.jpg" alt="Map showing Riel Films location" fill className="object-cover opacity-70" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center p-6 bg-white/80 dark:bg-film-black-900/80 backdrop-blur-sm rounded-lg shadow-md">
                  <h3 className="text-lg font-semibold mb-2 text-film-black-900 dark:text-white">Find Us Here</h3>
                  <p className="text-gray-700 dark:text-gray-300">17 Independence Avenue, Accra</p>
                  <a href="https://maps.google.com/?q=17+Independence+Avenue,Accra,Ghana" target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-film-red-600 hover:underline">View on Google Maps</a>
                </div>
              </div>
            </div>
          </SectionReveal>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto mb-20">
            <SectionReveal><h2 className="text-3xl font-semibold mb-8 text-film-black-900 dark:text-white text-center">Frequently Asked Questions</h2></SectionReveal>
            <div className="space-y-6">
              {[
                { q: "How can I watch your films?", a: "Our films are available through various platforms including film festivals, select theaters, and streaming services. Check our Films page for specific availability." },
                { q: "Do you accept film submissions?", a: "While we primarily produce original content, we occasionally collaborate. Please contact us with details about your project for consideration." },
                { q: "How can I work with Riel Films?", a: "We're always looking for talent! Check our website for current opportunities or send us your portfolio via the contact form." },
                { q: "Do you offer production services in Ghana?", a: "Yes, we offer comprehensive production services including location scouting, local crew hiring, equipment rental, and logistical support." },
              ].map((faq, index) => (
                <SectionReveal key={index} delay={0.1 * index}>
                  <div className="bg-white dark:bg-film-black-900 rounded-lg shadow-sm border border-gray-100 dark:border-film-black-800 p-6">
                    <h3 className="text-lg font-medium mb-2 text-film-black-900 dark:text-white">{faq.q}</h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{faq.a}</p>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

// Add shared styles if not global
const styles = `
  .label-style { @apply block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1; }
  .input-style { @apply w-full px-4 py-3 rounded-lg bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white shadow-sm; }
`;
if (typeof window !== 'undefined') { const styleSheet = document.createElement("style"); styleSheet.innerText = styles; document.head.appendChild(styleSheet); }

export default ContactPage;

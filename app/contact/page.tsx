"use client";
import React from "react";
import { Button } from "@/components/UI/Button";
import Image from "next/image";
import PageTransition from "@/components/UI/PageTransition";
import SectionReveal from "@/components/UI/SectionReveal";



const ContactPage = () => {
  return (
    <PageTransition>
      <div className="min-h-screen bg-white dark:bg-film-black-950 pt-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <SectionReveal>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-film-black-900 dark:text-white">
                Contact Us
              </h1>
              <p className="text-xl text-gray-700 dark:text-gray-300 mb-16 max-w-3xl">
                We'd love to hear from you! Whether you're interested in our films, exploring collaboration opportunities, or have questions about our work, our team is ready to connect.
              </p>
            </SectionReveal>

            {/* Contact details and form */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
              {/* Contact information */}
              <SectionReveal direction="left">
                <div>
                  <h2 className="text-2xl font-semibold mb-6 text-film-black-900 dark:text-white">Get in Touch</h2>


                  {/* Contact methods */}
                  <div className="space-y-8">
                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-film-red-100 dark:bg-film-red-900/30 rounded-full flex items-center justify-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-film-red-600 dark:text-film-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-1 text-film-black-900 dark:text-white">Phone</h3>
                        <p className="text-gray-700 dark:text-gray-300">+233 (0) 302 123 456</p>
                        <p className="text-gray-700 dark:text-gray-300">Monday-Friday, 9am-5pm GMT</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-film-red-100 dark:bg-film-red-900/30 rounded-full flex items-center justify-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-film-red-600 dark:text-film-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-1 text-film-black-900 dark:text-white">Email</h3>
                        <p className="text-gray-700 dark:text-gray-300">info@rielfilms.com</p>
                        <p className="text-gray-700 dark:text-gray-300">For press inquiries: press@rielfilms.com</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="w-12 h-12 bg-film-red-100 dark:bg-film-red-900/30 rounded-full flex items-center justify-center mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-film-red-600 dark:text-film-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-1 text-film-black-900 dark:text-white">Location</h3>
                        <p className="text-gray-700 dark:text-gray-300">17 Independence Avenue</p>
                        <p className="text-gray-700 dark:text-gray-300">Accra, Ghana</p>
                      </div>
                    </div>
                  </div>

                  {/* Social Media */}
                  <div className="mt-10">
                    <h3 className="text-lg font-medium mb-4 text-film-black-900 dark:text-white">Connect With Us</h3>
                    <div className="flex space-x-4">
                      <a href="#" className="w-10 h-10 bg-film-black-900 dark:bg-film-black-800 rounded-full flex items-center justify-center text-white hover:bg-film-red-600 dark:hover:bg-film-red-700 transition-colors">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                        </svg>
                      </a>
                      <a href="#" className="w-10 h-10 bg-film-black-900 dark:bg-film-black-800 rounded-full flex items-center justify-center text-white hover:bg-film-red-600 dark:hover:bg-film-red-700 transition-colors">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                        </svg>
                      </a>
                      <a href="#" className="w-10 h-10 bg-film-black-900 dark:bg-film-black-800 rounded-full flex items-center justify-center text-white hover:bg-film-red-600 dark:hover:bg-film-red-700 transition-colors">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      </a>
                      <a href="#" className="w-10 h-10 bg-film-black-900 dark:bg-film-black-800 rounded-full flex items-center justify-center text-white hover:bg-film-red-600 dark:hover:bg-film-red-700 transition-colors">
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </SectionReveal>

              {/* Contact form */}
              <SectionReveal direction="right" delay={0.2}>
                <div>
                  <h2 className="text-2xl font-semibold mb-6 text-film-black-900 dark:text-white">Send Us a Message</h2>
                  <form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name</label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          placeholder="Your name"
                          className="w-full px-4 py-3 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          placeholder="Your email"
                          className="w-full px-4 py-3 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject</label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        placeholder="What is your message about?"
                        className="w-full px-4 py-3 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                      />
                    </div>

                    <div>
                      <label htmlFor="inquiry-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Inquiry Type</label>
                      <select
                        id="inquiry-type"
                        name="inquiry-type"
                        className="w-full px-4 py-3 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                      >
                        <option value="">Select an option</option>
                        <option value="general">General Inquiry</option>
                        <option value="collaboration">Collaboration Opportunity</option>
                        <option value="distribution">Distribution Interest</option>
                        <option value="press">Press & Media</option>
                        <option value="careers">Careers & Opportunities</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message</label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        placeholder="Your message"
                        className="w-full px-4 py-3 rounded-md bg-white dark:bg-film-black-800 border border-gray-300 dark:border-film-black-700 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white"
                        required
                      ></textarea>
                    </div>

                    <div className="flex items-center">
                      <input
                        id="privacy"
                        name="privacy"
                        type="checkbox"
                        className="h-4 w-4 text-film-red-600 focus:ring-film-red-500 border-gray-300 rounded"
                        required
                      />
                      <label htmlFor="privacy" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                        I agree to the <a href="/privacy-policy" className="text-film-red-600 dark:text-film-red-500 hover:underline">privacy policy</a>
                      </label>
                    </div>

                    <Button variant="primary" className="w-full">Send Message</Button>
                  </form>
                </div>
              </SectionReveal>
            </div>
          </div>

          {/* Map */}
          <SectionReveal>
            <div className="mb-20 rounded-xl overflow-hidden shadow-lg">
              <div className="relative w-full h-[400px]">
                <Image
                  src="/images/map.jpg"
                  alt="Map showing Riel Films location in Accra, Ghana"
                  fill
                  className="object-cover"
                />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-film-red-600 text-white p-3 rounded-full shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </SectionReveal>

          {/* FAQ Section */}
          <div className="max-w-3xl mx-auto mb-20">
            <SectionReveal>
              <h2 className="text-3xl font-semibold mb-8 text-film-black-900 dark:text-white text-center">Frequently Asked Questions</h2>
            </SectionReveal>

            <div className="space-y-6">
              {/* FAQ items with staggered reveal */}
              <SectionReveal delay={0.1}>
                <div className="bg-white dark:bg-film-black-900 rounded-lg shadow-sm border border-gray-100 dark:border-film-black-800 p-6">
                  <h3 className="text-lg font-medium mb-2 text-film-black-900 dark:text-white">How can I watch your films?</h3>
                  <p className="text-gray-700 dark:text-gray-300">Our films are available through various platforms including film festivals, select theaters, and streaming services. Check our Films page for specific availability information for each production.</p>
                </div>
              </SectionReveal>

              <SectionReveal delay={0.2}>
                <div className="bg-white dark:bg-film-black-900 rounded-lg shadow-sm border border-gray-100 dark:border-film-black-800 p-6">
                  <h3 className="text-lg font-medium mb-2 text-film-black-900 dark:text-white">Do you accept film submissions?</h3>
                  <p className="text-gray-700 dark:text-gray-300">While we primarily produce our own original content, we occasionally collaborate with independent filmmakers. Please contact us with details about your project for consideration.</p>
                </div>
              </SectionReveal>

              <div className="bg-white dark:bg-film-black-900 rounded-lg shadow-sm border border-gray-100 dark:border-film-black-800 p-6">
                <h3 className="text-lg font-medium mb-2 text-film-black-900 dark:text-white">How can I work with Riel Films?</h3>
                <p className="text-gray-700 dark:text-gray-300">We're always looking for talented individuals passionate about authentic African storytelling. Check our website for current opportunities or send us your portfolio through the contact form.</p>
              </div>
              <div className="bg-white dark:bg-film-black-900 rounded-lg shadow-sm border border-gray-100 dark:border-film-black-800 p-6">
                <h3 className="text-lg font-medium mb-2 text-film-black-900 dark:text-white">Do you offer production services in Ghana?</h3>
                <p className="text-gray-700 dark:text-gray-300">Yes, we offer comprehensive production services for international crews looking to film in Ghana and other parts of West Africa. Our team provides location scouting, local crew hiring, equipment rental, and logistical support.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageTransition >
  );
};

export default ContactPage;

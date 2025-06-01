"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ThemeSwitcher } from "@/components/UI/ThemeSwitcher";
import { useTheme } from "@/context/ThemeProvider";
import { motion } from "framer-motion";
import { Button } from "@/components/UI/Button";
import { CldImage } from "next-cloudinary";
import { useData } from "@/context/DataContext";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { resolvedTheme } = useTheme();
  const { settings, isLoadingSettings } = useData(); // Get loading state too
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState("");
  const [subscribeError, setSubscribeError] = useState(false);
  const [mounted, setMounted] = useState(false); // Track mount state


  useEffect(() => {
    setMounted(true);
  }, []);

  // Determine which logo to use based on theme
  // Safely handle empty strings and loading state
  // const getLogoSrc = () => {
  //   const isDarkMode = mounted && resolvedTheme === "dark";
  //   const defaultLight = "/logo_light_bg.png";
  //   const defaultDark = "/logo_dark_bg.png";

  //   if (isLoadingSettings || !settings) {
  //     // Return a default based on potential theme preference before settings load
  //     // Or return a specific placeholder if you prefer
  //     return isDarkMode ? defaultDark : defaultLight;
  //   }

  //   const lightUrl = settings.logoLight;
  //   const darkUrl = settings.logoDark;

  //   // Use dark logo if dark mode AND dark logo URL exists, otherwise check light logo, then fallbacks
  //   if (isDarkMode) {
  //     console.log(darkUrl)
  //     return darkUrl || defaultDark; // Use darkUrl if it exists (not empty), else fallback
  //   } else {
  //     console.log(lightUrl)
  //     return lightUrl || defaultLight; // Use lightUrl if it exists (not empty), else fallback
  //   }
  // };

  const logoSrc = settings?.metaImage! //getLogoSrc(); // Call the function to get the src

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    setSubscribeMessage("");
    setSubscribeError(false);

    try {
      const response = await fetch("/api/subscribers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          source: "footer",
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubscribeMessage(data.message || "Successfully subscribed!");
        setEmail("");
      } else {
        setSubscribeError(true);
        setSubscribeMessage(data.error || "Failed to subscribe. Please try again.");
      }
    } catch (error) {
      setSubscribeError(true);
      setSubscribeMessage("An error occurred. Please try again later.");
      console.error("Subscription error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-gradient-to-b from-film-black-950 to-film-black-900 text-white pt-20 pb-8 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-film-red-600 to-transparent opacity-30"></div>
      <div className="absolute -left-24 top-40 w-64 h-64 rounded-full bg-film-red-900 opacity-5 blur-3xl"></div>
      <div className="absolute -right-32 bottom-40 w-80 h-80 rounded-full bg-film-red-800 opacity-5 blur-3xl"></div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-x-8 gap-y-12">
          {/* Column 1: Logo and About */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block mb-6 group">
              <div className="flex items-center gap-2">
                <CldImage
                  src={logoSrc} // Use the Cloudinary URL or fallback path
                  width={100} // Specify base width
                  height={40} // Specify base height to maintain aspect ratio
                  alt="Riel-Films Logo"
                  className="object-contain h-10 w-auto hover:brightness-[1.1] transition-all" // Control height, auto width
                  priority
                  format="auto"
                  quality="auto"
                />
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300 dark:from-white dark:to-gray-400">
                  RIEL FILMS
                </span>
              </div>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              We are dedicated to creating unforgettable cinematic experiences that
              celebrate the rich tapestry of African storytelling. Through authentic narratives,
              we connect cultures and inspire audiences worldwide.
            </p>
            <div className="flex items-center gap-4">
              <ThemeSwitcher />
              {/* <span className="text-sm text-gray-500">
                {theme === "dark" ? "Dark Mode" : "Light Mode"}
              </span> */}
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-medium mb-6 text-white relative inline-block">
              Explore
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-film-red-500"></span>
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/films"
                  className="text-gray-400 hover:text-white transition-colors flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-film-red-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Our Films
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-400 hover:text-white transition-colors flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-film-red-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/productions"
                  className="text-gray-400 hover:text-white transition-colors flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-film-red-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Productions
                </Link>
              </li>
              <li>
                <Link
                  href="/stories"
                  className="text-gray-400 hover:text-white transition-colors flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-film-red-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Stories
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white transition-colors flex items-center group"
                >
                  <span className="w-0 group-hover:w-2 h-0.5 bg-film-red-500 mr-0 group-hover:mr-2 transition-all duration-300"></span>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact */}
          <div className="lg:col-span-3">
            <h3 className="text-lg font-medium mb-6 text-white relative inline-block">
              Contact Us
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-film-red-500"></span>
            </h3>
            <ul className="space-y-4">
              <motion.li
                className="flex items-start group"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-10 h-10 rounded-full bg-film-black-800/50 flex items-center justify-center mr-3 group-hover:bg-film-red-900/30 transition-colors">
                  <svg
                    className="h-5 w-5 text-film-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <address className="text-gray-300 not-italic">
                    17 Independence Avenue
                    <br />
                    Accra, Ghana
                  </address>
                </div>
              </motion.li>
              <motion.li
                className="flex items-center group"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-10 h-10 rounded-full bg-film-black-800/50 flex items-center justify-center mr-3 group-hover:bg-film-red-900/30 transition-colors">
                  <svg
                    className="h-5 w-5 text-film-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <a
                  href="mailto:info@rielfilms.com"
                  className="text-gray-300 hover:text-white hover:underline decoration-film-red-500 decoration-2 underline-offset-4 transition-all"
                >
                  {settings?.contactEmail}
                </a>
              </motion.li>
              <motion.li
                className="flex items-center group"
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <div className="w-10 h-10 rounded-full bg-film-black-800/50 flex items-center justify-center mr-3 group-hover:bg-film-red-900/30 transition-colors">
                  <svg
                    className="h-5 w-5 text-film-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <a
                  href="tel:+233302123456"
                  className="text-gray-300 hover:text-white hover:underline decoration-film-red-500 decoration-2 underline-offset-4 transition-all"
                >
                  {settings?.contactPhone}
                </a>
              </motion.li>
            </ul>
          </div>

          {/* Column 4: Newsletter */}
          <div className="lg:col-span-3">
            <h3 className="text-lg font-medium mb-6 text-white relative inline-block">
              Stay Updated
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-film-red-500"></span>
            </h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter for the latest productions and
              African cinema insights.
            </p>
            <form className="flex flex-col space-y-3" onSubmit={handleSubscribe}>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-3 bg-film-black-800/50 border border-film-black-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-film-red-500 focus:border-transparent text-white placeholder-gray-500"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
              </div>
              <Button
                type="submit"
                variant="primary"
                className="w-full rounded-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </Button>
              {subscribeMessage && (
                <p className={`text-sm ${subscribeError ? 'text-red-400' : 'text-green-400'}`}>
                  {subscribeMessage}
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Social Media */}
        <div className="mt-16 mb-12">
          <div className="flex flex-col items-center">
            <h4 className="text-sm uppercase tracking-wider mb-6 text-gray-400">Connect With Us</h4>
            <div className="flex space-x-4">
              <motion.a
                href={settings?.socialLinks[1].url}
                className="w-10 h-10 rounded-full bg-film-black-800 flex items-center justify-center text-gray-400 hover:bg-film-red-600 hover:text-white transition-colors duration-300"
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <span className="sr-only">Facebook</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </motion.a>
              <motion.a
                href={settings?.socialLinks[0].url}
                className="w-10 h-10 rounded-full bg-film-black-800 flex items-center justify-center text-gray-400 hover:bg-film-red-600 hover:text-white transition-colors duration-300"
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <span className="sr-only">Instagram</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </motion.a>
              <motion.a
                href={settings?.socialLinks[2].url}
                className="w-10 h-10 rounded-full bg-film-black-800 flex items-center justify-center text-gray-400 hover:bg-film-red-600 hover:text-white transition-colors duration-300"
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <span className="sr-only">Twitter</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </motion.a>
              <motion.a
                href={settings?.socialLinks[3].url}
                className="w-10 h-10 rounded-full bg-film-black-800 flex items-center justify-center text-gray-400 hover:bg-film-red-600 hover:text-white transition-colors duration-300"
                whileHover={{ y: -3 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <span className="sr-only">YouTube</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path fillRule="evenodd" d="M19.812 5.418c.861.23 1.538.907 1.768 1.768C21.998 8.746 22 12 22 12s0 3.255-.418 4.814a2.504 2.504 0 0 1-1.768 1.768c-1.56.419-7.814.419-7.814.419s-6.255 0-7.814-.419a2.505 2.505 0 0 1-1.768-1.768C2 15.255 2 12 2 12s0-3.255.417-4.814a2.507 2.507 0 0 1 1.768-1.768C5.744 5 11.998 5 11.998 5s6.255 0 7.814.418ZM15.194 12 10 15V9l5.194 3Z" clipRule="evenodd" />
                </svg>
              </motion.a>
            </div>
          </div>
        </div>

        {/* Footer Bottom: Copyright and Policy Links */}
        <div className="pt-8 border-t border-film-black-800">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
            <div className="mb-4 md:mb-0 flex items-center">
              <p>© {currentYear} Riel Films. All rights reserved.</p>
              <span className="mx-2 text-film-red-600">•</span>
              <p>African Stories, Global Impact</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <Link
                href="/privacy-policy"
                className="hover:text-film-red-500 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms-of-service"
                className="hover:text-film-red-500 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="/cookie-policy"
                className="hover:text-film-red-500 transition-colors"
              >
                Cookie Policy
              </Link>
            </div>
          </div>

          {/* Back to top button */}
          <div className="flex justify-center mt-8">
            <motion.a
              href="#top"
              className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-film-black-800 text-gray-400 hover:bg-film-red-600 hover:text-white transition-colors"
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
              </svg>
            </motion.a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

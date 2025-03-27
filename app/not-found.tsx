"use client";
import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Home, Film, Coffee } from "lucide-react";
import LoadingSpinner from "@/components/UI/LoadingSpinner";

// Loading component for Suspense
const NotFoundLoading = () => (
  <div className="min-h-screen flex justify-center items-center bg-white dark:bg-film-black-950">
    <LoadingSpinner size="large" />
  </div>
);

// Custom button component (to avoid using the shared Button component)
const CustomButton = ({
  children,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  className?: string
}) => (
  <button
    className={`px-6 py-3 bg-film-red-600 text-white font-medium rounded-lg hover:bg-film-red-700 transition-colors ${className}`}
    {...props}
  >
    {children}
  </button>
);

// Custom section reveal component (instead of using the shared SectionReveal)
const CustomReveal = ({
  children,
  delay = 0
}: {
  children: React.ReactNode,
  delay?: number
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay: delay * 0.2,
        ease: [0.25, 0.1, 0.25, 1.0]
      }}
    >
      {children}
    </motion.div>
  );
};

// NotFound content without using shared components
const NotFoundContent = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", damping: 12 } }
  };

  const linkOptions = [
    { title: "Return Home", href: "/", icon: <Home size={18} /> },
    { title: "View Films", href: "/films", icon: <Film size={18} /> },
    { title: "Our Productions", href: "/productions", icon: <Coffee size={18} /> },
  ];

  if (!mounted) return <NotFoundLoading />;

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-film-black-950 px-4 sm:px-6">
      <motion.div
        className="max-w-3xl w-full text-center"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <CustomReveal>
          <motion.div
            className="mb-6"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 8 }}
          >
            <div className="text-9xl font-bold text-film-red-600 dark:text-film-red-500 lg:text-[180px]">404</div>
          </motion.div>
        </CustomReveal>

        <CustomReveal delay={0.1}>
          <motion.h1
            className="text-3xl md:text-4xl font-bold mb-4 text-film-black-900 dark:text-white"
            variants={itemVariants}
          >
            Page Not Found
          </motion.h1>
        </CustomReveal>

        <CustomReveal delay={0.2}>
          <motion.p
            className="text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-lg mx-auto"
            variants={itemVariants}
          >
            The page you are looking for might have been moved, deleted, or never existed in the first place. Let's get you back on track.
          </motion.p>
        </CustomReveal>

        <CustomReveal delay={0.3}>
          <motion.div
            className="mb-12 flex flex-col items-center"
            variants={itemVariants}
          >
            <Link href="/" className="inline-block mb-4">
              <CustomButton className="group flex items-center">
                <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Back to Home
              </CustomButton>
            </Link>

            <button
              onClick={() => window.history.back()}
              className="text-film-red-600 dark:text-film-red-500 hover:underline"
            >
              Or go back to previous page
            </button>
          </motion.div>
        </CustomReveal>

        <CustomReveal delay={0.4}>
          <motion.div variants={itemVariants}>
            <h3 className="text-lg font-medium text-film-black-900 dark:text-white mb-4">
              You might want to check out:
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {linkOptions.map((option, index) => (
                <motion.div
                  key={option.href}
                  whileHover={{ y: -4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="h-full"
                >
                  <Link href={option.href}>
                    <div className="bg-gray-50 dark:bg-film-black-900 rounded-xl p-6 hover:border-film-red-500 border border-transparent transition-colors h-full flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-film-red-100 dark:bg-film-red-900/30 rounded-full flex items-center justify-center mb-3">
                        {option.icon}
                      </div>
                      <span className="text-film-black-900 dark:text-white font-medium">
                        {option.title}
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </CustomReveal>

        {/* Visual Element: Animated film reel */}
        <CustomReveal delay={0.5}>
          <motion.div
            className="absolute bottom-10 right-10 opacity-20 dark:opacity-10 hidden lg:block"
            animate={{
              rotate: 360,
            }}
            transition={{
              repeat: Infinity,
              duration: 20,
              ease: "linear"
            }}
          >
            <svg width="180" height="180" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 2V22"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M2 12H22"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 18.2C15.4242 18.2 18.2 15.4242 18.2 12C18.2 8.57583 15.4242 5.80005 12 5.80005C8.57583 5.80005 5.80005 8.57583 5.80005 12C5.80005 15.4242 8.57583 18.2 12 18.2Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>
        </CustomReveal>
      </motion.div>
    </div>
  );
};

// Main component with Suspense boundary
const NotFoundPage = () => {
  return (
    <Suspense fallback={<NotFoundLoading />}>
      <NotFoundContent />
    </Suspense>
  );
};

export default NotFoundPage;

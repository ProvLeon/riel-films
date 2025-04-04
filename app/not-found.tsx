"use client";
import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Home, Film, Clapperboard } from "lucide-react"; // Changed Coffee to Clapperboard
import LoadingSpinner from "@/components/UI/LoadingSpinner";

// Loading component for Suspense
const NotFoundLoading = () => (
  <div className="min-h-screen flex justify-center items-center bg-white dark:bg-film-black-950">
    <LoadingSpinner size="large" />
  </div>
);

// NotFound content without using shared complex components
const NotFoundContent = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 12, stiffness: 100 } }
  };

  const linkOptions = [
    { title: "Homepage", href: "/", icon: <Home size={20} className="text-film-red-500" /> },
    { title: "Our Films", href: "/films", icon: <Film size={20} className="text-film-red-500" /> },
    { title: "Productions", href: "/productions", icon: <Clapperboard size={20} className="text-film-red-500" /> },
  ];

  if (!mounted) return <NotFoundLoading />; // Show loader until mounted

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-film-black-950 dark:via-film-black-900 dark:to-film-black-950 px-4 py-16">
      <motion.div
        className="max-w-3xl w-full text-center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* 404 Text */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="relative inline-block">
            <div className="text-8xl md:text-9xl lg:text-[180px] font-black text-film-red-600 dark:text-film-red-500 opacity-80 blur-sm">404</div>
            <div className="absolute inset-0 flex items-center justify-center text-8xl md:text-9xl lg:text-[180px] font-black text-film-red-600 dark:text-film-red-500">404</div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.h1 variants={itemVariants} className="text-3xl md:text-4xl font-bold mb-4 text-film-black-900 dark:text-white">
          Oops! Page Lost in Translation
        </motion.h1>

        {/* Description */}
        <motion.p variants={itemVariants} className="text-lg text-gray-600 dark:text-gray-300 mb-10 max-w-lg mx-auto">
          It seems the page you're looking for doesn't exist or might have been moved. Let's get you back to the main feature.
        </motion.p>

        {/* Action Buttons */}
        <motion.div variants={itemVariants} className="mb-12 flex flex-col items-center space-y-4">
          <Link href="/" className="inline-block">
            <button className="px-6 py-3 bg-film-red-600 text-white font-medium rounded-full hover:bg-film-red-700 transition-colors group flex items-center shadow-md hover:shadow-lg">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Homepage
            </button>
          </Link>
          <button onClick={() => window.history.back()} className="text-sm text-film-red-600 dark:text-film-red-500 hover:underline">
            Or go back to the previous page
          </button>
        </motion.div>

        {/* Suggestion Links */}
        <motion.div variants={itemVariants}>
          <h3 className="text-lg font-medium text-film-black-900 dark:text-white mb-4">
            Maybe you were looking for:
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {linkOptions.map((option) => (
              <motion.div key={option.href} whileHover={{ y: -4, scale: 1.03 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
                <Link href={option.href}>
                  <div className="bg-white dark:bg-film-black-900 rounded-xl p-6 border border-gray-200 dark:border-film-black-800 hover:border-film-red-500/50 dark:hover:border-film-red-600/50 transition-colors h-full flex flex-col items-center justify-center shadow-sm hover:shadow-md">
                    <div className="w-12 h-12 bg-film-red-100 dark:bg-film-red-900/30 rounded-full flex items-center justify-center mb-3">
                      {option.icon}
                    </div>
                    <span className="text-film-black-900 dark:text-white font-medium text-center">
                      {option.title}
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

// Main component with Suspense boundary
const NotFoundPage = () => (
  <Suspense fallback={<NotFoundLoading />}>
    <NotFoundContent />
  </Suspense>
);

export default NotFoundPage;

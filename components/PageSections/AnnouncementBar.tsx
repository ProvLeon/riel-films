import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AnnouncementInfo } from "../../types";
import { Button } from "@/components/UI/Button";

interface AnnouncementBarProps {
  announcement: AnnouncementInfo;
  onDismiss: () => void;
  className?: string;
}

const AnnouncementBar: React.FC<AnnouncementBarProps> = ({
  announcement,
  onDismiss,
  className = "",
}) => {
  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={`sticky top-16 z-30 bg-film-black-900 dark:bg-film-black-950 text-white shadow-lg ${className}`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-lg md:text-xl font-medium mb-3 md:mb-0 md:pr-4">
            {announcement.message}
          </div>
          <div className="flex items-center space-x-4 flex-shrink-0">
            <Button variant="outline" asChild>
              <Link href={announcement.ctaLink}>{announcement.ctaText}</Link>
            </Button>
            <button
              onClick={onDismiss}
              className="text-white p-1 hover:text-film-red-300 transition-colors rounded-full hover:bg-white hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
              aria-label="Dismiss announcement"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AnnouncementBar;

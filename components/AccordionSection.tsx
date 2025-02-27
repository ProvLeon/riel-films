"use client";
import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface AccordionItem {
  title: string;
  content: string;
}

interface AccordionSectionProps {
  title?: string;
  items: AccordionItem[];
  isDarkMode?: boolean;
  className?: string;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({
  title,
  items,
  isDarkMode = false,
  className = "",
}) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const textColorClass = isDarkMode
    ? "text-white dark:text-white"
    : "text-film-black-900 dark:text-white";

  const borderColorClass = isDarkMode
    ? "border-white dark:border-white"
    : "border-film-black-900 dark:border-film-gray-300";

  return (
    <section
      className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${className}`}
    >
      {title && (
        <h2
          className={`text-4xl md:text-5xl font-medium ${textColorClass} mb-8`}
        >
          {title}
        </h2>
      )}

      <div className="max-w-3xl">
        {items.map((item, index) => (
          <div
            key={index}
            className={`border-t-2 ${borderColorClass} ${
              index === items.length - 1 ? "border-b-2" : ""
            }`}
          >
            <button
              className="flex justify-between items-center py-5 w-full text-left"
              onClick={() => toggleAccordion(index)}
              aria-expanded={openIndex === index}
              aria-controls={`accordion-content-${index}`}
            >
              <h3 className={`text-2xl font-medium ${textColorClass}`}>
                {item.title}
              </h3>
              <div className={`p-1.5 ${textColorClass}`}>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </motion.div>
              </div>
            </button>
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  id={`accordion-content-${index}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div
                    className={`py-4 px-2 text-xl font-light mb-4 ${
                      isDarkMode
                        ? "text-gray-300 dark:text-gray-300"
                        : "text-film-black-800 dark:text-film-gray-200"
                    }`}
                  >
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AccordionSection;

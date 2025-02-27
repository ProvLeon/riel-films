import React from "react";
import { motion } from "framer-motion";

interface ApplicationTimelineProps {
  steps: string[];
  className?: string;
}

const ApplicationTimeline: React.FC<ApplicationTimelineProps> = ({
  steps,
  className = "",
}) => {
  if (!steps || steps.length === 0) return null;

  return (
    <div className={`hidden md:block mb-20 ${className}`}>
      <div className="relative">
        {/* Timeline line with enhanced styling */}
        <motion.div
          className="absolute top-1/2 left-0 right-0 h-1.5 bg-gradient-to-r from-film-red-600 via-film-red-500 to-film-red-600 dark:from-film-red-700 dark:via-film-red-600 dark:to-film-red-700 -translate-y-1/2 rounded-full shadow-sm"
          initial={{ scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        />

        {/* Steps with enhanced styling */}
        <div className="flex justify-between relative z-10">
          {steps.map((step, index) => {
            // Split step text at <br> if present
            const parts = step.split("<br>");

            return (
              <motion.div
                key={index}
                className="flex flex-col items-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-film-red-500 to-film-red-700 dark:from-film-red-600 dark:to-film-red-800 flex items-center justify-center mb-3 shadow-md transform transition-transform hover:scale-110">
                  <span className="text-lg font-bold text-white">
                    {index + 1}
                  </span>
                </div>
                <span className="text-sm font-medium text-center text-film-black-900 dark:text-white max-w-[120px]">
                  {parts[0]}
                  {parts.length > 1 && <br />}
                  {parts.length > 1 && parts[1]}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Mobile timeline for small screens */}
        <div className="md:hidden mt-10 space-y-8">
          {steps.map((step, index) => {
            const parts = step.split("<br>");

            return (
              <motion.div
                key={index}
                className="flex items-start"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-film-red-500 to-film-red-700 dark:from-film-red-600 dark:to-film-red-800 flex items-center justify-center mr-4 flex-shrink-0">
                  <span className="text-base font-bold text-white">
                    {index + 1}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-film-black-900 dark:text-white">
                    {parts.join(" ")}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ApplicationTimeline;

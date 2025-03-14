import React from "react";
import Link from "next/link";
import AccordionSection from "../AccordionSection";
import ApplicationTimeline from "./ApplicationTimeline";
import { motion } from "framer-motion";
import { AccordionItem } from "../../types";
import { Button } from "@/components/UI/Button";

interface AdmissionsSectionProps {
  title: string;
  ctaText: string;
  ctaLink: string;
  timelineSteps: string[];
  items: AccordionItem[];
  id?: string;
  className?: string;
}

const AdmissionsSection: React.FC<AdmissionsSectionProps> = ({
  title,
  ctaText,
  ctaLink,
  timelineSteps,
  items,
  id,
  className = "",
}) => {
  return (
    <section
      id={id}
      className={`relative py-24 md:py-32 bg-gradient-to-b from-white to-white dark:from-film-black-950 dark:to-film-black-900 text-white ${className}`}
    >
      <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
        <motion.div
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold mb-8 md:mb-0 leading-tight text-film-black-900 dark:text-white">
            {title}
          </h2>
          <Button variant="primary" asChild>
            <Link href={ctaLink} className="flex items-center">
              {ctaText}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 ml-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </Button>
        </motion.div>

        {/* Application process description */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <p className="text-lg text-gray-700 dark:text-gray-300 max-w-3xl mx-auto text-center mb-12">
            Our application process is designed to identify motivated and
            creative individuals who will thrive in our collaborative learning
            environment. Follow these steps to begin your journey with us.
          </p>
        </motion.div>

        {/* Application Timeline - properly integrated */}
        <ApplicationTimeline steps={timelineSteps} />

        {/* Enhanced accordion section */}
        <div className="mt-20 max-w-4xl mx-auto">
          <AccordionSection title="" items={items} />
        </div>
      </div>
    </section>
  );
};

export default AdmissionsSection;

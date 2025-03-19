import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/UI/Button";

interface CTASectionProps {
  title: string;
  subtitle: string;
  primaryCta: {
    text: string;
    link: string;
  };
  secondaryCta: {
    text: string;
    link: string;
  };
  className?: string;
}

const CTASection: React.FC<CTASectionProps> = ({
  title = "Ready to Experience Authentic African Cinema?",
  subtitle =
    "Join our community of film enthusiasts celebrating the rich tapestry of African storytelling.",
  primaryCta = {
    text: "Explore Our Films",
    link: "/films",
  },
  secondaryCta = {
    text: "Contact Us",
    link: "/contact",
  },
  className = "",
}) => {
  return (
    <section
      className={`relative overflow-hidden bg-gradient-to-b from-film-red-600 via-film-red-500 to-film-black-900 dark:from-film-red-700 dark:via-film-red-800 dark:to-film-black-900/20 py-20 md:py-24 ${className}`}
    >
      {/* Decorative elements */}
      <div className="absolute -left-24 top-1/2 transform -translate-y-1/2 w-64 h-64 rounded-full bg-film-red-400 dark:bg-film-red-900 opacity-20 blur-3xl">
      </div>
      <div className="absolute -right-24 -bottom-24 transform w-80 h-80 rounded-full bg-film-red-300 dark:bg-film-red-900 opacity-10 blur-3xl">
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center relative z-10 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-white">
            {title}
          </h2>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 text-white text-opacity-90">
            {subtitle}
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            <Button variant="primary" asChild>
              <Link href={primaryCta.link} className="flex items-center">
                {primaryCta.text}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={secondaryCta.link}>
                {secondaryCta.text}
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;

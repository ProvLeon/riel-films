import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FacilityFeature } from "../../types";
import { Card } from "@/components/UI/Card";

interface FacilitiesSectionProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaLink: string;
  backgroundImage: string;
  features: FacilityFeature[];
  id?: string;
  className?: string;
}

const FacilitiesSection: React.FC<FacilitiesSectionProps> = ({
  title,
  subtitle,
  ctaText,
  ctaLink,
  backgroundImage,
  features,
  id,
  className = "",
}) => {
  return (
    <section
      id={id}
      className={`relative py-28 md:py-36 text-white ${className}`}
    >
      {/* Background image with enhanced styling */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          fill
          className="object-cover"
          alt="Film studio facilities"
          quality={90}
          priority={false}
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-film-black-900/90 to-film-black-800/70 dark:from-film-black-950/95 dark:to-film-black-900/80">
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 lg:px-8 relative z-10 max-w-7xl">
        <motion.div
          className="max-w-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-8 leading-tight">
            {title}
          </h2>
          <p className="text-xl md:text-2xl font-light mb-14 text-gray-100">
            {subtitle}
          </p>
          <Link
            href={ctaLink}
            className="inline-flex items-center px-8 py-3 border-2 border-white rounded-full hover:bg-white hover:text-film-black-900 transition-all duration-300 group transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
          >
            {ctaText}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </Link>
        </motion.div>

        {/* Features Grid with enhanced styling */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-film-black-900/50 dark:bg-film-black-950/50 backdrop-blur-sm p-7 border border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:scale-[1.02]">
                <h3 className="text-xl font-medium mb-4 text-film-red-400">
                  {feature.title}
                </h3>
                <p className="text-gray-200 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FacilitiesSection;

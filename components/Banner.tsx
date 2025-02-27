"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/UI/Button";

interface BannerProps {
  title: string;
  subtitle: string;
  primaryCta: {
    text: string;
    href: string;
  };
  secondaryCta: {
    text: string;
    href: string;
  };
  backgroundImage: string;
  programInfo?: {
    duration: string;
    credits: string;
    location: string;
    startDate: string;
  };
}

const Banner = ({
  title = "Creative Production Film MA",
  subtitle =
    "Bring your film proposal to life through our flexible framework for negotiated and self-directed learning",
  primaryCta = { text: "Apply Now", href: "/apply" },
  secondaryCta = { text: "Discover More", href: "#course-details" },
  backgroundImage = "/images/shade.png",
  programInfo = {
    duration: "1 Year Full-time / 2 Years Part-time",
    credits: "60 ECTS Credits",
    location: "Berlin, Germany",
    startDate: "September 2025",
  },
}: BannerProps) => {
  return (
    <section className="relative w-full mt-0 md:mt-6 lg:mt-12">
      {/* Hero image with responsive sizing */}
      <div className="relative w-full aspect-[2.37] h-[80%] md:max-h-[700px]">
        <Image
          src={backgroundImage}
          fill
          priority
          quality={90}
          sizes="100vw"
          className="object-cover"
          alt={title}
        />

        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-film-warmWhite-300/20 to-film-black-900/50 dark:from-film-black-950/90 dark:to-film-black-950/60">
        </div>

        {/* Hero content */}
        <div className="absolute inset-0 flex flex-col justify-center items-start px-4 sm:px-8 md:px-16 lg:px-24">
          <div className="max-w-3xl">
            <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-4 drop-shadow-lg">
              {title}
            </h1>
            <p className="text-white text-lg md:text-xl mb-6 max-w-xl drop-shadow-md">
              {subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary" asChild>
                <Link href={primaryCta.href}>{primaryCta.text}</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href={secondaryCta.href}>{secondaryCta.text}</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Key program information bar */}
      <div className="bg-film-black-900 dark:bg-film-black-950 text-white py-4 md:py-6">
        <div className="container-custom">
          <div className="flex flex-wrap items-center justify-between gap-y-4">
            <div className="flex items-center space-x-2 md:space-x-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-film-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm md:text-base">
                {programInfo.duration}
              </span>
            </div>
            <div className="flex items-center space-x-2 md:space-x-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-film-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
              </svg>
              <span className="text-sm md:text-base">
                {programInfo.credits}
              </span>
            </div>
            <div className="flex items-center space-x-2 md:space-x-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-film-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm md:text-base">
                {programInfo.location}
              </span>
            </div>
            <div className="flex items-center space-x-2 md:space-x-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-film-red-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm md:text-base">
                Next intake: {programInfo.startDate}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Banner;

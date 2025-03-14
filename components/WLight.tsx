"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Header from "./Header";
import Banner from "./Banner";
import ContentSection from "./ContentSection";
import VideoSection from "./VideoSection";
import AccordionSection from "./AccordionSection";
import QuoteSection from "./QuoteSection";
import TutorGrid from "./TutorGrid";
// Import modular section components
import AnnouncementBar from "./PageSections/AnnouncementBar";
import FacilitiesSection from "./PageSections/FacilitiesSection";
import AdmissionsSection from "./PageSections/AdmissionsSection";
import CoursesGrid from "./PageSections/CoursesGrid";
import CTASection from "./PageSections/CTASection";
// Import data
import { coursePageData } from "../data/coursePageData";
import { PageData } from "../types";
import TableOfContents from "./PageSections/TableOfContents";
import BackToTop from "./UI/BackToTop";
import WDark from "./WDark";
import { getRevealClass } from "../lib/utils.ts";

interface WLightProps {
  data?: PageData;
  className?: string;
}

// Revised table of contents with logical flow
const tocItems = [
  { id: "overview", label: "Overview" },
  { id: "video-showcase", label: "Program Video" },
  { id: "creative-production", label: "Creative Production" },
  { id: "course-structure", label: "Course Structure" },
  { id: "tutors", label: "Our Faculty" },
  { id: "facilities", label: "Facilities" },
  { id: "community", label: "Community" },
  { id: "progression", label: "Career Pathways" },
  { id: "student-showcase", label: "Student Showcase" },
  { id: "admissions", label: "How to Apply" },
  { id: "more-courses", label: "Related Programs" },
];

function WLight({ data = coursePageData, className = "" }: WLightProps) {
  // State for intersection observer animations
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const [hasScrolled, setHasScrolled] = useState(false);

  // Set up scroll tracking for enhanced UI effects
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 100 && !hasScrolled) {
        setHasScrolled(true);
      } else if (scrollPosition <= 100 && hasScrolled) {
        setHasScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasScrolled]);

  // Set up intersection observer for scroll animations
  useEffect(() => {
    if (typeof window !== "undefined" && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries: any) => {
          entries.forEach((entry: any) => {
            if (entry.target.id) {
              setIsVisible((prev) => ({
                ...prev,
                [entry.target.id]: entry.isIntersecting,
              }));
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: "0px 0px -10% 0px", // Trigger slightly before element is in view
        },
      );

      document.querySelectorAll(".scroll-reveal").forEach((el) => {
        if (el.id) observer.observe(el);
      });

      return () => observer.disconnect();
    }
  }, []);

  // Auto-visible on mount (fallback if intersection observer doesn't work)
  useEffect(() => {
    // Set all sections to visible after a delay if they're not already visible
    const timer = setTimeout(() => {
      tocItems.forEach((item) => {
        if (!isVisible[item.id]) {
          setIsVisible((prev) => ({
            ...prev,
            [item.id]: true,
          }));
        }
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [isVisible]);

  // Verify that data exists and has required properties
  if (!data || !data.overview || !data.creativeProduction) {
    console.error("Missing required data for WLight component:", data);
    return <div className="p-8 text-center">Error loading course data</div>;
  }

  return (
    <div
      className={`relative bg-white dark:bg-film-black-950 ${className}`}
    >
      {/* Background pattern with more refined styling */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="w-full h-full max-w-[1920px] mx-auto">
          <Image
            src={data.heroBackground}
            fill
            className="object-cover opacity-[0.02] dark:opacity-[0.05]"
            alt=""
            aria-hidden="true"
            priority={false}
            quality={85}
          />
        </div>
      </div>

      {/* Main content container with refined gradient */}
      <div className="relative z-10 min-h-screen bg-gradient-to-b from-film-warmWhite-200 via-film-red-900/30 to-film-warmWhite-100 dark:from-film-black-950 dark:via-film-red-900/30 dark:to-film-black-900 text-white">
        <Header />

        {/* Hero Banner component */}
        <Banner />

        {/* Main content sections with improved narrative flow */}
        <main>
          <div className="mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
            {/* 1. OVERVIEW - Start with a compelling introduction */}
            <section
              id="overview"
              className={`scroll-reveal pt-16 md:pt-28 ${
                getRevealClass({ id: "overview", isVisible })
              }`}
            >
              <ContentSection
                title={data.overview.title}
                content={data.overview.paragraphs}
                textColor="text-white"
              />
            </section>

            {/* 2. VIDEO SHOWCASE - Visual introduction to the program */}
            <section
              id="video-showcase"
              className={`scroll-reveal pt-20 md:pt-32 ${
                getRevealClass({ id: "video-showcase", isVisible })
              }`}
            >
              <VideoSection />
            </section>

            {/* 3. CREATIVE PRODUCTION - Core program philosophy */}
            <section
              id="creative-production"
              className={`scroll-reveal pt-20 md:pt-32 ${
                getRevealClass({ id: "creative-production", isVisible })
              }`}
            >
              <ContentSection
                title={data.creativeProduction.title}
                content={data.creativeProduction.paragraphs}
                textColor="text-white"
              />
            </section>

            {/* 4. COURSE STRUCTURE - Program details */}
            <section
              id="course-structure"
              className={`scroll-reveal pt-20 md:pt-32 ${
                getRevealClass({ id: "course-structure", isVisible })
              }`}
            >
              <AccordionSection
                title={data.courseStructure.title}
                items={data.courseStructure.items}
                isDarkMode={true}
              />
            </section>

            {/* 5. TUTORS - Who will teach you */}
            <section
              id="tutors"
              className={`scroll-reveal pt-20 md:pt-32 ${
                getRevealClass({ id: "tutors", isVisible })
              }`}
            >
              <TutorGrid />
            </section>

            {/* Student Quote to transition to learning environment */}
            <section
              id="student-quote"
              className={`scroll-reveal pt-20 md:pt-32 ${
                getRevealClass({ id: "student-quote", isVisible })
              }`}
            >
              <QuoteSection
                quote={data.quotes[0].quote}
                author={data.quotes[0].author}
              />
            </section>
          </div>

          {/* 6. FACILITIES - Where you'll learn */}
          <section
            id="facilities"
            className={`scroll-reveal mt-24 md:mt-36 ${
              getRevealClass({ id: "facilities", isVisible })
            }`}
          >
            <FacilitiesSection
              title={data.facilities.title}
              subtitle={data.facilities.subtitle}
              ctaText={data.facilities.ctaText}
              ctaLink={data.facilities.ctaLink}
              backgroundImage={data.facilities.backgroundImage}
              features={data.facilities.features}
            />
          </section>

          {/* 7. COMMUNITY - Who you'll learn with */}
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
            <section
              id="community"
              className={`scroll-reveal pt-20 md:pt-32 ${
                getRevealClass({ id: "community", isVisible })
              }`}
            >
              <ContentSection
                title={data.community.title}
                content={data.community.paragraphs}
                textColor="text-white"
              />
            </section>

            {/* Student Quote to transition to career outcomes */}
            <section
              id="student-quote-2"
              className={`scroll-reveal pt-20 md:pt-32 ${
                getRevealClass({ id: "student-quote-2", isVisible })
              }`}
            >
              <QuoteSection
                quote={data.quotes[1].quote}
                author={data.quotes[1].author}
              />
            </section>

            {/* 8. PROGRESSION - Career outcomes */}
            <section
              id="progression"
              className={`scroll-reveal pt-20 md:pt-32 ${
                getRevealClass({ id: "progression", isVisible })
              }`}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-14 text-white">
                {data.progression.title}
              </h2>
              <AccordionSection
                title=""
                items={data.progression.items}
                isDarkMode={true}
              />
            </section>

            {/* 9. STUDENT SHOWCASE - Evidence of success */}
            <section
              id="student-showcase"
              className={`scroll-reveal pt-20 md:pt-32 ${
                getRevealClass({ id: "student-showcase", isVisible })
              }`}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-14 text-white">
                Student Success Stories
              </h2>
              <QuoteSection
                quote={data.quotes[2].quote}
                author={data.quotes[2].author}
              />
            </section>
          </div>

          {/* 10. ADMISSIONS - How to apply */}
          <section
            id="admissions"
            className={`scroll-reveal mt-24 md:mt-36 ${
              getRevealClass({ id: "admissions", isVisible })
            }`}
          >
            <AdmissionsSection
              title={data.admissions.title}
              ctaText={data.admissions.ctaText}
              ctaLink={data.admissions.ctaLink}
              timelineSteps={data.admissions.timelineSteps}
              items={data.admissions.items}
            />
          </section>

          {/* 11. RELATED COURSES - Other options */}
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
            <section
              id="more-courses"
              className={`scroll-reveal pt-24 ${
                getRevealClass({ id: "more-courses", isVisible })
              }`}
            >
              <CoursesGrid
                title={data.relatedCourses.title}
                courses={data.relatedCourses.courses}
                shortCourses={data.relatedCourses.shortCourses}
              />
            </section>
          </div>

          {/* Transition to Screenology section */}
          <section className="py-24 bg-gradient-to-b dark:from-film-black-900 dark:to-black text-center from-white via-white to-black/50">
            <div className="container mx-auto px-4">
              <h2 className="text-4xl md:text-5xl dark:font-medium mb-8 dark:text-white text-gray-900 font-bold">
                Discover Screenology
              </h2>
              <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto mb-12">
                Screenology offers a unique approach to film education that
                emphasizes hands-on learning, creative exploration, and personal
                growth. Learn how we're transforming film education.
              </p>
              <div className="h-16 flex items-center justify-center">
                <div className="animate-bounce">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-film-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </section>

          {/* Screenology Content */}
          <div id="screenology" className="scroll-reveal">
            <WDark />
          </div>
          {/* 12. CALL TO ACTION - Final push to apply */}
          <section
            id="cta"
            className={`scroll-reveal mt-0 ${
              getRevealClass({ id: "cta", isVisible })
            }`}
          >
            <CTASection
              title={data.cta.title}
              subtitle={data.cta.subtitle}
              primaryCta={data.cta.primaryCta}
              secondaryCta={data.cta.secondaryCta}
            />
          </section>
        </main>
        <TableOfContents
          items={[...tocItems, { id: "screenology", label: "Screenology" }]}
        />
        <BackToTop />
      </div>
    </div>
  );
}

export default WLight;

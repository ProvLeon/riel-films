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

interface WLightProps {
  data?: PageData;
  className?: string;
}

const tocItems = [
  { id: "overview", label: "Overview" },
  { id: "video-showcase", label: "Program Video" },
  { id: "creative-production", label: "Creative Production" },
  { id: "course-structure", label: "Course Structure" },
  { id: "facilities", label: "Facilities" },
  { id: "community", label: "Community" },
  { id: "tutors", label: "Tutors" },
  { id: "progression", label: "Progression" },
  { id: "admissions", label: "Admissions" },
  { id: "more-courses", label: "More Courses" },
];

function WLight({ data = coursePageData, className = "" }: WLightProps) {
  // State for sticky announcement bar
  const [showAnnouncement, setShowAnnouncement] = useState(true);

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

  const getRevealClass = (id: string) => {
    if (!id) return "";

    // Default to showing content if not tracked by intersection observer
    return isVisible[id] !== false
      ? "opacity-100 translate-y-0 transition-all duration-700 ease-out"
      : "opacity-0 translate-y-5 transition-all duration-700 ease-out";
  };

  // Verify that data exists and has required properties
  if (!data || !data.overview || !data.creativeProduction) {
    console.error("Missing required data for WLight component:", data);
    return <div className="p-8 text-center">Error loading course data</div>;
  }

  return (
    <div
      className={`relative bg-film-warmWhite-300 dark:bg-film-black-950 ${className}`}
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
      <div className="relative z-10 min-h-screen bg-gradient-to-b from-film-warmWhite-200 via-film-red-900/30 to-film-warmWhite-100 dark:from-film-black-950 dark:via-film-red-900/30 dark:to-film-black-900 text-white ">
        {/* Header component */}
        {
          /* <div
          className={`sticky top-0 z-40 transition-shadow duration-300 ${
            hasScrolled ? "shadow-md" : ""
          }`}
        > */
        }
        <Header />
        {/* </div> */}

        {/* Banner component */}
        <Banner />

        {/* Announcement Bar - if needed */}
        {showAnnouncement && (
          <AnnouncementBar
            announcement={data.announcement}
            onDismiss={() => setShowAnnouncement(false)}
          />
        )}

        {/* Main content sections with consistent container structure */}
        <main>
          <div className="mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
            {/* Overview Section */}
            <section
              id="overview"
              className={`scroll-reveal pt-16 md:pt-28 ${
                getRevealClass("overview")
              }`}
            >
              <ContentSection
                title={data.overview.title}
                content={data.overview.paragraphs}
                textColor="text-white"
              />
            </section>

            {/* Video Showcase Section with increased spacing */}
            <section
              id="video-showcase"
              className={`scroll-reveal pt-20 md:pt-32 ${
                getRevealClass("video-showcase")
              }`}
            >
              <VideoSection />
            </section>

            {/* Creative Production Section with consistent spacing */}
            <section
              id="creative-production"
              className={`scroll-reveal pt-20 md:pt-32 ${
                getRevealClass("creative-production")
              }`}
            >
              <ContentSection
                title={data.creativeProduction.title}
                content={data.creativeProduction.paragraphs}
                textColor="text-white"
              />
            </section>

            {/* Course Structure Section */}
            <section
              id="course-structure"
              className={`scroll-reveal pt-20 md:pt-32 ${
                getRevealClass("course-structure")
              }`}
            >
              <AccordionSection
                title={data.courseStructure.title}
                items={data.courseStructure.items}
                isDarkMode={true}
              />
            </section>

            {/* First Student Quote Section with refined spacing */}
            <section
              id="student-quote"
              className={`scroll-reveal pt-20 md:pt-32 ${
                getRevealClass("student-quote")
              }`}
            >
              <QuoteSection
                quote={data.quotes[0].quote}
                author={data.quotes[0].author}
              />
            </section>
          </div>

          {/* Facilities Section - Full width with improved spacing */}
          <section
            id="facilities"
            className={`scroll-reveal mt-24 md:mt-36 ${
              getRevealClass("facilities")
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

          {/* Community and additional sections */}
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
            <section
              id="community"
              className={`scroll-reveal pt-20 md:pt-32 ${
                getRevealClass("community")
              }`}
            >
              <ContentSection
                title={data.community.title}
                content={data.community.paragraphs}
                textColor="text-white"
              />
            </section>

            {/* Second Student Quote Section */}
            <section
              id="student-quote-2"
              className={`scroll-reveal pt-20 md:pt-32 ${
                getRevealClass("student-quote-2")
              }`}
            >
              <QuoteSection
                quote={data.quotes[1].quote}
                author={data.quotes[1].author}
              />
            </section>

            {/* Tutor Grid Section with improved spacing */}
            <section
              id="tutors"
              className={`scroll-reveal pt-20 md:pt-32 ${
                getRevealClass("tutors")
              }`}
            >
              <TutorGrid />
            </section>

            {/* Progression Section with improved spacing */}
            <section
              id="progression"
              className={`scroll-reveal pt-20 md:pt-32 ${
                getRevealClass("progression")
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

            {/* Third Student Quote Section */}
            <section
              id="student-quote-3"
              className={`scroll-reveal pt-20 md:pt-32 ${
                getRevealClass("student-quote-3")
              }`}
            >
              <QuoteSection
                quote={data.quotes[2].quote}
                author={data.quotes[2].author}
              />
            </section>
          </div>

          {/* Admissions Section - Full width with improved design */}
          <section
            id="admissions"
            className={`scroll-reveal mt-24 md:mt-36 ${
              getRevealClass("admissions")
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

          {/* Related Courses Section - Container width */}
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
            <section
              id="more-courses"
              className={`scroll-reveal pt-24 ${
                getRevealClass("more-courses")
              }`}
            >
              <CoursesGrid
                title={data.relatedCourses.title}
                courses={data.relatedCourses.courses}
                shortCourses={data.relatedCourses.shortCourses}
              />
            </section>
          </div>

          {/* Call to Action Section - Full width */}
          <section
            id="cta"
            className={`scroll-reveal mt-24 ${getRevealClass("cta")}`}
          >
            <CTASection
              title={data.cta.title}
              subtitle={data.cta.subtitle}
              primaryCta={data.cta.primaryCta}
              secondaryCta={data.cta.secondaryCta}
            />
          </section>
          <WDark />
        </main>
        <TableOfContents items={tocItems} />
        <BackToTop />
      </div>
    </div>
  );
}

export default WLight;

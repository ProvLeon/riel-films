"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import ContentSection from "@/components/ContentSection";
import VideoSection from "@/components/VideoSection";
import AccordionSection from "@/components/AccordionSection";
import QuoteSection from "@/components/QuoteSection";
import TutorGrid from "@/components/TutorGrid";
// Import modular section components
import FacilitiesSection from "@/components/PageSections/FacilitiesSection";
import CoursesGrid from "@/components/PageSections/CoursesGrid";
import CTASection from "@/components/PageSections/CTASection";
// Import data
import { coursePageData } from "@/data/coursePageData";
import { PageData } from "@/types";
// import TableOfContents from "@/components/PageSections/TableOfContents";
import BackToTop from "@/components/UI/BackToTop";
import WDark from "@/components/WDark";
import { getRevealClass } from "@/lib/utils";
import HeroSection from "@/components/sections/HeroSection";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { motion } from "framer-motion";

interface WLightProps {
  data?: PageData;
  className?: string;
}

// Revised table of contents with logical flow
const tocItems = [
  { id: "overview", label: "About Us" },
  { id: "video-showcase", label: "Featured Film" },
  { id: "our-storytelling", label: "Our Storytelling" },
  { id: "production-values", label: "Production Values" },
  { id: "our-team", label: "Our Team" },
  { id: "facilities", label: "Production Facilities" },
  { id: "community", label: "African Voices" },
  { id: "impact", label: "Our Impact" },
  { id: "collaborations", label: "Collaborations" },
  { id: "contact", label: "Work With Us" },
  { id: "productions", label: "Latest Productions" },
];

function Main({ data = coursePageData, className = "" }: WLightProps) {
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
        (entries: IntersectionObserverEntry[]) => {
          entries.forEach((entry: IntersectionObserverEntry) => {
            const targetElement = entry.target as HTMLElement;
            if (targetElement.id) {
              setIsVisible((prev) => ({
                ...prev,
                [targetElement.id]: entry.isIntersecting,
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
    <div className={`relative bg-white dark:bg-film-black-950 ${className}`}>
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="w-full h-full max-w-[1920px] mx-auto">
          <Image
            src={data.heroBackground}
            fill
            className="object-cover opacity-[0.03] dark:opacity-[0.05]"
            alt=""
            aria-hidden="true"
            quality={85}
          />
        </div>
      </div>

      {/* Main content container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        <main className="flex-grow">
          <HeroSection />

          {/* Wrap sections in consistent container */}
          <div className="container-custom py-16">
            {/* Section components with consistent spacing */}
            <section
              id="overview"
              className={`scroll-reveal mb-24 ${getRevealClass({ id: "overview", isVisible })
                }`}
            >
              <ContentSection
                title={data.overview.title}
                content={data.overview.paragraphs}
              />
            </section>

            {/* 2. VIDEO SHOWCASE - Visual introduction to the program */}
            <section
              id="video-showcase"
              className={`scroll-reveal pt-20 md:pt-32 ${getRevealClass({ id: "video-showcase", isVisible })
                }`}
            >
              <VideoSection
                videoTitle="Shaping the Future of African Storytelling"
                videoDescription="Experience our award-winning authentic African narratives"
              />
            </section>

            {/* 3. OUR STORYTELLING - Core philosophy */}
            <section
              id="our-storytelling"
              className={`scroll-reveal pt-20 md:pt-32 ${getRevealClass({ id: "our-storytelling", isVisible })
                }`}
            >
              <ContentSection
                title="Our Authentic Storytelling"
                content={[
                  "At Riel Films, we believe in the power of authentic representation. We are committed to portraying genuine African experiences, cultures, and perspectives with integrity and respect, ensuring that our films reflect the diversity and richness of the continent's storytelling traditions.",
                  "We embrace creativity as the heart of our filmmaking process, encouraging innovation, experimentation, and artistic expression to craft unique and unforgettable cinematic experiences that captivate audiences and leave a lasting impression.",
                ]}
              />
            </section>

            {/* 4. PRODUCTION VALUES - Company values */}
            <section
              id="production-values"
              className={`scroll-reveal pt-20 md:pt-32 ${getRevealClass({ id: "production-values", isVisible })
                }`}
            >
              <AccordionSection
                title="Our Production Values"
                items={[
                  {
                    title: "Authenticity",
                    content:
                      "We are committed to portraying genuine African experiences, cultures, and perspectives with integrity and respect, ensuring that our films reflect the diversity and richness of the continent's storytelling traditions.",
                  },
                  {
                    title: "Creativity",
                    content:
                      "We embrace creativity as the heart of our filmmaking process, encouraging innovation, experimentation, and artistic expression to craft unique and unforgettable cinematic experiences that captivate audiences and leave a lasting impression.",
                  },
                  {
                    title: "Excellence",
                    content:
                      "We strive for excellence in every aspect of our work, from scriptwriting and production to post-production and distribution, setting high standards for quality and craftsmanship to ensure that our films meet and exceed the expectations of our audience and industry peers.",
                  },
                  {
                    title: "Inclusivity",
                    content:
                      "We value inclusivity and diversity in all aspects of our filmmaking endeavors, fostering an inclusive and collaborative environment where voices from all backgrounds are heard, represented, and celebrated.",
                  },
                  {
                    title: "Impact",
                    content:
                      "We are driven by the belief that storytelling has the power to inspire change and make a positive impact on society. We aim to create films that not only entertain but also provoke thought, spark dialogue, and contribute to a deeper understanding of African cultures and issues, both locally and globally.",
                  },
                ]}
                isDarkMode={true}
              />
            </section>

            {/* 5. OUR TEAM - Production team */}
            <section
              id="our-team"
              className={`scroll-reveal pt-20 md:pt-32 ${getRevealClass({ id: "our-team", isVisible })
                }`}
            >
              <TutorGrid
                title="Our Creative Team"
                description="Meet the talented filmmakers, writers, directors, and producers behind our authentic African narratives."
              />
            </section>

            {/* Student Quote to transition to learning environment */}
            <section
              id="student-quote"
              className={`scroll-reveal pt-20 md:pt-32 ${getRevealClass({ id: "student-quote", isVisible })
                }`}
            >
              <QuoteSection
                quote={data.quotes[0].quote}
                author={data.quotes[0].author}
              />
            </section>
          </div>

          {/* 6. FACILITIES - Where you'll learn */}
          {/* Full-width sections can go outside container */}
          <section
            id="facilities"
            className={`scroll-reveal mb-24 ${getRevealClass({ id: "facilities", isVisible })
              }`}
          >
            <FacilitiesSection {...data.facilities} />
          </section>

          {/* 7. COMMUNITY - Who you'll learn with */}
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
            <section
              id="community"
              className={`scroll-reveal pt-20 md:pt-32 ${getRevealClass({ id: "community", isVisible })
                }`}
            >
              <ContentSection
                title="Our African Storytelling Community"
                content={[
                  "Riel Films serves diverse audiences, from local Ghanaian moviegoers who appreciate authentic storytelling and cultural representation to diaspora Africans living abroad who seek authentic portrayals of their culture and stories.",
                  "We also connect with international film enthusiasts interested in exploring stories from Africa and other non-Western cultures, including film festivals and organizations focusing on showcasing diverse voices and perspectives. Through our work, we foster a sense of community among fans of African cinema, encouraging dialogue, collaboration, and mutual support within the Riel Films community and beyond.",
                ]}
              />
            </section>

            {/* Student Quote to transition to career outcomes */}
            <section
              id="student-quote-2"
              className={`scroll-reveal pt-20 md:pt-32 ${getRevealClass({ id: "student-quote-2", isVisible })
                }`}
            >
              <QuoteSection
                quote={data.quotes[1].quote}
                author={data.quotes[1].author}
              />
            </section>

            {/* 8. PROGRESSION - Career outcomes */}
            {
              /* <section
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
            </section> */
            }

            {/* 9. STUDENT SHOWCASE - Evidence of success */}
            <section
              id="student-showcase"
              className={`scroll-reveal pt-20 md:pt-32 ${getRevealClass({ id: "student-showcase", isVisible })
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
          {
            /* <section
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
          </section> */
          }

          {/* 11. RELATED COURSES - Other options */}
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
            <section
              id="more-courses"
              className={`scroll-reveal pt-24 ${getRevealClass({ id: "more-courses", isVisible })
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
                growth. Learn how we&apos;re transforming film education.
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
            className={`scroll-reveal mt-0 ${getRevealClass({ id: "cta", isVisible })
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
        {/* <TableOfContents
          items={[...tocItems, { id: "screenology", label: "Screenology" }]}
        /> */}
        <BackToTop />
      </div>
    </div>
  );
}

export default Main;

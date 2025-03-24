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
import BackToTop from "@/components/UI/BackToTop";
import { getRevealClass } from "@/lib/utils";
import HeroSection from "@/components/sections/HeroSection";

interface MainProps {
  data?: PageData;
  className?: string;
}

// Key sections for our film company landing page
const sectionIds = [
  "overview",
  "video-showcase",
  "our-storytelling",
  "production-values",
  "our-team",
  "facilities",
  "community",
  "productions"
];

function Main({ data = coursePageData, className = "" }: MainProps) {
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
      sectionIds.forEach((id) => {
        if (!isVisible[id]) {
          setIsVisible((prev) => ({
            ...prev,
            [id]: true,
          }));
        }
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, [isVisible]);

  // Verify that data exists and has required properties
  if (!data || !data.overview || !data.creativeProduction) {
    console.error("Missing required data for Main component:", data);
    return <div className="p-8 text-center">Error loading page data</div>;
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
            {/* About Riel Films */}
            <section
              id="overview"
              className={`scroll-reveal mb-24 ${getRevealClass({ id: "overview", isVisible })}`}
            >
              <ContentSection
                title={data.overview.title}
                content={data.overview.paragraphs}
              />
            </section>

            {/* Featured Film/Showreel */}
            <section
              id="video-showcase"
              className={`scroll-reveal pt-20 md:pt-32 ${getRevealClass({ id: "video-showcase", isVisible })}`}
            >
              <VideoSection
                videoTitle="Shaping the Future of African Storytelling"
                videoDescription="Experience our award-winning authentic African narratives"
              />
            </section>

            {/* Our Storytelling Philosophy */}
            <section
              id="our-storytelling"
              className={`scroll-reveal pt-20 md:pt-32 ${getRevealClass({ id: "our-storytelling", isVisible })}`}
            >
              <ContentSection
                title="Our Authentic Storytelling"
                content={[
                  "At Riel Films, we believe in the power of authentic representation. We are committed to portraying genuine African experiences, cultures, and perspectives with integrity and respect, ensuring that our films reflect the diversity and richness of the continent's storytelling traditions.",
                  "We embrace creativity as the heart of our filmmaking process, encouraging innovation, experimentation, and artistic expression to craft unique and unforgettable cinematic experiences that captivate audiences and leave a lasting impression.",
                ]}
              />
            </section>

            {/* Production Values */}
            <section
              id="production-values"
              className={`scroll-reveal pt-20 md:pt-32 ${getRevealClass({ id: "production-values", isVisible })}`}
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

            {/* Our Creative Team */}
            <section
              id="our-team"
              className={`scroll-reveal pt-20 md:pt-32 ${getRevealClass({ id: "our-team", isVisible })}`}
            >
              <TutorGrid
                title="Our Creative Team"
                description="Meet the talented filmmakers, writers, directors, and producers behind our authentic African narratives."
              />
            </section>

            {/* Vision Statement */}
            <section
              id="vision-quote"
              className={`scroll-reveal pt-20 md:pt-32 ${getRevealClass({ id: "vision-quote", isVisible })}`}
            >
              <QuoteSection
                quote={data.quotes[0].quote}
                author={data.quotes[0].author}
              />
            </section>
          </div>

          {/* Production Facilities - Full Width Section */}
          <section
            id="facilities"
            className={`scroll-reveal mb-24 ${getRevealClass({ id: "facilities", isVisible })}`}
          >
            <FacilitiesSection {...data.facilities} />
          </section>

          {/* African Storytelling Community */}
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
            <section
              id="community"
              className={`scroll-reveal pt-20 md:pt-32 ${getRevealClass({ id: "community", isVisible })}`}
            >
              <ContentSection
                title="Our African Storytelling Community"
                content={[
                  "Riel Films serves diverse audiences, from local Ghanaian moviegoers who appreciate authentic storytelling and cultural representation to diaspora Africans living abroad who seek authentic portrayals of their culture and stories.",
                  "We also connect with international film enthusiasts interested in exploring stories from Africa and other non-Western cultures, including film festivals and organizations focusing on showcasing diverse voices and perspectives. Through our work, we foster a sense of community among fans of African cinema, encouraging dialogue, collaboration, and mutual support within the Riel Films community and beyond.",
                ]}
              />
            </section>

            {/* Value Proposition Quote */}
            <section
              id="value-quote"
              className={`scroll-reveal pt-20 md:pt-32 ${getRevealClass({ id: "value-quote", isVisible })}`}
            >
              <QuoteSection
                quote={data.quotes[2].quote}
                author="Riel Films Value Proposition"
              />
            </section>
          </div>

          {/* Our Productions */}
          <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-7xl">
            <section
              id="productions"
              className={`scroll-reveal pt-24 ${getRevealClass({ id: "productions", isVisible })}`}
            >
              <CoursesGrid
                title={data.relatedCourses.title}
                courses={data.relatedCourses.courses}
                shortCourses={data.relatedCourses.shortCourses}
              />
            </section>
          </div>

          {/* CTA Section */}
          <section
            id="cta"
            className={`scroll-reveal mt-24 ${getRevealClass({ id: "cta", isVisible })}`}
          >
            <CTASection
              title={data.cta.title}
              subtitle={data.cta.subtitle}
              primaryCta={data.cta.primaryCta}
              secondaryCta={data.cta.secondaryCta}
            />
          </section>
        </main>
        <BackToTop />
      </div>
    </div>
  );
}

export default Main;

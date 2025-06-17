"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/UI/Button";
import SmartImage from "@/components/UI/SmartImage";
import { GraduationCap, Users, Video, Award, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import EngagementTracker from "@/components/analytics/EngagementTracker";

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Hero content focusing on training and production
  const heroContent = [
    {
      id: 1,
      title: "RIEL FILMS ACADEMY",
      subtitle: "Where Raw Talent Becomes Real Skill",
      description: "You don't need a film background — just the passion. Whether you want to direct, act, edit, or write — we'll teach you the craft and walk with you every step of the way.",
      image: "/images/hero/hero1.jpg",
      cta: "Join Academy",
      ctaLink: "/academy",
      secondaryCta: "Learn More",
      secondaryLink: "/about"
    },
    {
      id: 2,
      title: "PROFESSIONAL FILM PRODUCTION",
      subtitle: "Bringing Ideas to Life",
      description: "From short films and music videos to corporate events and documentaries. We direct, shoot, edit, and deliver visual content that connects with real people.",
      image: "/images/hero/hero2.jpg",
      cta: "Our Services",
      ctaLink: "/productions",
      secondaryCta: "View Projects",
      secondaryLink: "/films"
    },
    {
      id: 3,
      title: "LEARN BY DOING",
      subtitle: "Real Sets, Real Experience",
      description: "Our students work on actual RIEL FILMS productions. This hands-on approach ensures you graduate with industry experience and a portfolio of professional work.",
      image: "/images/hero/hero3.jpg",
      cta: "Apply Now",
      ctaLink: "/academy#apply",
      secondaryCta: "View Programs",
      secondaryLink: "/academy#programs"
    }
  ];

  // Auto-rotate content
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroContent.length);
    }, 8000); // Change slide every 8 seconds

    return () => clearInterval(interval);
  }, [heroContent.length]);

  const currentContent = heroContent[currentSlide];

  // Statistics to display
  const stats = [
    { icon: <GraduationCap className="h-6 w-6" />, value: "100+", label: "Graduates" },
    { icon: <Users className="h-6 w-6" />, value: "8", label: "Week Program" },
    { icon: <Video className="h-6 w-6" />, value: "50+", label: "Projects" },
    { icon: <Award className="h-6 w-6" />, value: "5+", label: "Years Experience" }
  ];

  return (
    <section className="relative w-full h-[85vh] overflow-hidden">
      {/* Background with overlay */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentContent.id}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <div className="relative w-full h-full">
            <SmartImage
              src={currentContent.image}
              alt={currentContent.title}
              fill
              priority
              className="object-cover object-center"
              sizes="100vw"
            />

            {/* Enhanced gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-film-black-950/95 via-film-black-950/80 to-film-black-950/70"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-film-black-950/90 via-transparent to-film-black-950/30"></div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Content area */}
      <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-12 md:px-16 lg:px-24">
        <div className="max-w-5xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentContent.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-white"
            >
              {/* Main title */}
              <motion.h1
                className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 leading-none"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {currentContent.title.split(' ').map((word, index) => (
                  <span key={index} className={word === 'ACADEMY' || word === 'PRODUCTION' ? 'text-film-red-500' : ''}>
                    {word}{' '}
                  </span>
                ))}
              </motion.h1>

              {/* Subtitle */}
              <motion.h2
                className="text-xl md:text-3xl font-medium mb-6 text-film-red-300"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                {currentContent.subtitle}
              </motion.h2>

              {/* Description */}
              <motion.p
                className="text-white/90 text-lg md:text-xl mb-8 max-w-3xl leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                {currentContent.description}
              </motion.p>

              {/* Call-to-action buttons */}
              <motion.div
                className="flex flex-wrap gap-4 mb-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                <EngagementTracker
                  contentType="home"
                  contentId={currentContent.id.toString()}
                  contentTitle={currentContent.title}
                  contentCategory="hero-cta"
                  action="click"
                >
                  <Button variant="primary" size="lg" className="group">
                    <Link href={currentContent.ctaLink} className="flex items-center">
                      {currentContent.cta}
                      <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </EngagementTracker>

                <EngagementTracker
                  contentType="home"
                  contentId={currentContent.id.toString()}
                  contentTitle={currentContent.title}
                  contentCategory="hero-secondary"
                  action="click"
                >
                  <Button
                    variant="secondary"
                    size="lg"
                    className="text-white dark:text-white border-white dark:border-white hover:bg-white/20 dark:hover:bg-white/20 hover:text-white backdrop-blur-sm"
                  >
                    <Link href={currentContent.secondaryLink} className="text-white">
                      {currentContent.secondaryCta}
                    </Link>
                  </Button>
                </EngagementTracker>
              </motion.div>

              {/* Statistics Row */}
              <motion.div
                className="flex flex-wrap gap-8 text-white/80"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
              >
                {stats.map((stat, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="p-2 bg-film-red-500/20 rounded-lg text-film-red-400">
                      {stat.icon}
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-white">{stat.value}</div>
                      <div className="text-sm text-white/70">{stat.label}</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
        {heroContent.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
              ? "bg-film-red-500 scale-110"
              : "bg-white/50 hover:bg-white/80"
              }`}
            onClick={() => setCurrentSlide(index)}
            aria-label={`View slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation arrows for larger screens */}
      <div className="hidden md:block">
        <button
          className="absolute left-8 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all duration-300 backdrop-blur-sm"
          onClick={() => setCurrentSlide((prev) => (prev - 1 + heroContent.length) % heroContent.length)}
          aria-label="Previous slide"
        >
          <ArrowRight className="h-6 w-6 rotate-180" />
        </button>
        <button
          className="absolute right-8 top-1/2 transform -translate-y-1/2 p-3 bg-black/50 hover:bg-black/70 rounded-full text-white transition-all duration-300 backdrop-blur-sm"
          onClick={() => setCurrentSlide((prev) => (prev + 1) % heroContent.length)}
          aria-label="Next slide"
        >
          <ArrowRight className="h-6 w-6" />
        </button>
      </div>

      {/* Floating badge */}
      <motion.div
        className="absolute top-8 right-8 hidden lg:block"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 1.4 }}
      >
        <div className="bg-film-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
          Ghana's Premier Film Academy
        </div>
      </motion.div>
    </section>
  );
};

export default HeroSection;

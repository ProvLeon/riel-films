"use client";
import { useEffect, useState, useRef } from "react";
import { motion, useSpring, useScroll } from "framer-motion";

export default function Layout({ children }: { children: React.ReactNode }) {
  // Use Framer Motion's useScroll for accurate scroll tracking
  const { scrollYProgress } = useScroll();

  // Create a spring animation for smoother progress bar movement
  const scaleXProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Track if page has started scrolling
  const [hasScrolled, setHasScrolled] = useState(false);
  const [opacity, setOpacity] = useState(0);

  // Handle scroll events to control visibility
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Update hasScrolled state
      if (currentScrollY > 5 && !hasScrolled) {
        setHasScrolled(true);
      } else if (currentScrollY === 0) {
        setHasScrolled(false);
      }

      // Calculate opacity based on scroll position
      const scrollPercentage = window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight);

      if (scrollPercentage < 0.01) {
        setOpacity(scrollPercentage * 50); // Fade in slowly
      } else {
        setOpacity(1); // Fully visible after initial scroll
      }
    };

    // Initial check
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasScrolled]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-film-red-600 via-film-red-500 to-film-red-700 z-[100] rounded-full dark:from-film-black-800 dark:via-film-black-900 dark:to-film-black-900"
        style={{
          scaleX: scaleXProgress,
          opacity,
          transformOrigin: "left",
          boxShadow: "0 1px 3px rgba(254, 42, 42, 0.3)"
        }}
      />

      {/* Subtle glow effect */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-film-red-500/20 blur-[1px] z-[99]"
        style={{
          scaleX: scaleXProgress,
          opacity,
          transformOrigin: "left"
        }}
      />

      {children}
    </>
  );
}

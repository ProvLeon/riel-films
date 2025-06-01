"use client";
import React, { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { ThemeSwitcher } from "@/components/UI/ThemeSwitcher";
import { Button } from "@/components/UI/Button";
import { useTheme } from "@/context/ThemeProvider";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useData } from "@/context/DataContext";
import { CldImage } from 'next-cloudinary'; // *** Import CldImage ***

// Navigation links data - extracted for easier management
const navigationLinks = [
  { href: "/films", label: "Films" },
  { href: "/about", label: "About" },
  { href: "/productions", label: "Productions" },
  { href: "/stories", label: "Stories" },
];

// NavLink component extracted for reusability
const NavLink = ({
  href,
  children,
  isActive,
  mobile = false
}: {
  href: string;
  children: React.ReactNode;
  isActive: boolean;
  mobile?: boolean;
}) => {
  if (mobile) {
    return (
      <Link
        href={href}
        className={`block px-4 py-2 hover:bg-film-black-700 rounded-md transition-all duration-200 ${isActive
          ? 'text-film-red-500 border-l-2 border-film-red-500 pl-3'
          : 'text-white hover:text-film-red-300'
          }`}
      >
        {children}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={`relative py-1 transition-colors focus:text-film-red-500 duration-300 ${isActive
        ? 'text-film-red-500'
        : 'dark:text-white text-film-black-800 hover:text-film-red-400'
        } group`}
    >
      {children}
      <span
        className={`absolute left-0 right-0 bottom-0 h-0.5 bg-film-red-500 transform origin-left transition-transform duration-300 ease-out ${isActive
          ? 'scale-x-100'
          : 'scale-x-0 group-hover:scale-x-100'
          }`}>
      </span>
    </Link>
  );
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const { settings, isLoadingSettings, refetchSettings } = useData(); //  Get settings from context
  const pathname = usePathname();

  useEffect(() => {
    refetchSettings()
    setMounted(true);
  }, []);

  // Close mobile menu when path changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Scroll handler with throttling for performance
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen(prev => !prev);
  }, []);

  const isActive = useCallback((path: string) => {
    return pathname === path;
  }, [pathname]);

  // Determine which logo to use based on actual theme
  // Use a more reliable way to determine which logo to show
  const isDarkMode = mounted && (resolvedTheme === "dark");
  const logoLightUrl = settings?.logoLight || "/logo_light_bg.png"; // Fallback if settings not loaded
  const logoDarkUrl = settings?.logoDark || "/logo_dark_bg.png"; // Fallback
  const logoSrc = isDarkMode ? logoDarkUrl : logoLightUrl;

  // Animation variants
  const mobileNavVariants = {
    hidden: {
      opacity: 0,
      height: 0,
      transformOrigin: "top"
    },
    visible: {
      opacity: 1,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: [0.04, 0.62, 0.23, 0.98]
      }
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut"
      }
    }
  };

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);


  return (
    <header
      className={`w-full transition-all dark:bg-film-black-950/95 bg-white/95 backdrop-blur-sm sticky top-0 z-40 duration-300 ${isScrolled
        ? "shadow-md py-3"
        : "py-4"
        }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center group z-50"
            aria-label="Riel-Films Home"
          >
            <div className="flex items-center gap-2 h-auto text-film-red-500 group-hover:text-film-red-400 transition-colors">
              {mounted ? (
                <CldImage
                  src={logoSrc} // Use the Cloudinary URL or fallback path
                  width={100} // Specify base width
                  height={40} // Specify base height to maintain aspect ratio
                  alt="Riel-Films Logo"
                  className="object-contain h-10 w-auto hover:brightness-[1.1] transition-all" // Control height, auto width
                  priority
                  format="auto"
                  quality="auto"
                />
              ) : (
                <div className="w-24 h-10 bg-gray-200 dark:bg-gray-800 animate-pulse rounded" /> // Adjust skeleton size
              )}
            </div>
          </Link>

          {/* Rest of your component stays the same */}
          {/* Desktop Navigation and Theme Switcher */}
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex items-center space-x-8 text-base font-medium">
              {navigationLinks.map((link) => (
                <NavLink
                  key={link.href}
                  href={link.href}
                  isActive={isActive(link.href)}
                >
                  {link.label}
                </NavLink>
              ))}

              <Button variant="primary" className="ml-2">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </nav>

            <div className="hidden md:block">
              <ThemeSwitcher />
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-film-red-500 dark:text-white text-film-black-800 z-50"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation"
              aria-controls="mobile-menu"
            >
              <motion.div
                initial={false}
                animate={{ rotate: isMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.3 }}
              >
                {isMenuOpen ? (
                  <X size={24} className={mounted ? "text-white" : ""} />
                ) : (
                  <Menu size={24} />
                )}
              </motion.div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              id="mobile-menu"
              className="fixed inset-0 md:hidden bg-black bg-opacity-50 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <motion.nav
                variants={mobileNavVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="absolute top-16 left-0 right-0 bg-film-black-900 py-6 px-4 space-y-4 shadow-lg rounded-b-xl max-h-[80vh] overflow-y-auto"
              >
                <div className="space-y-1">
                  {navigationLinks.map((link) => (
                    <NavLink
                      key={link.href}
                      href={link.href}
                      isActive={isActive(link.href)}
                      mobile
                    >
                      {link.label}
                    </NavLink>
                  ))}
                </div>

                <div className="flex items-center justify-between px-4 py-4 mt-4 border-t border-film-black-700">
                  <Button variant="primary" onClick={() => setIsMenuOpen(false)}>
                    <Link href="/contact">Contact Us</Link>
                  </Button>
                  <ThemeSwitcher />
                </div>
              </motion.nav>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};

export default Header;

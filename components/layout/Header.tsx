"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ThemeSwitcher } from "@/components/UI/ThemeSwitcher";
import { Button } from "@/components/UI/Button";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`w-full transition-all light-mode-bg sticky top-0 z-40 transition-shadow duration-300 ${
        isScrolled ? "shadow-md py-4 sticky top-0" : "py-3"
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="flex items-center gap-2 h-auto text-film-red-500 group-hover:text-film-red-400 transition-colors">
              <Image
                src="/logo.png"
                width={31}
                height={31}
                alt="Riel-Films Logo"
                className="object-contain brightness-[80] hue-rotate-15"
                priority
              />
              <span className="text-sm md:text-base lg:text-2xl font-bold uppercase">
                Real Films
              </span>
            </div>
          </Link>

          {/* Desktop Navigation and Theme Switcher */}
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex items-center space-x-6 text-base font-medium light-mode-text">
              <Link
                href="/films"
                className="hover:text-film-red-500 focus:text-film-red-500 focus:outline-none transition-colors"
              >
                Films
              </Link>
              <Link
                href="/about"
                className="hover:text-film-red-500 focus:text-film-red-500 focus:outline-none transition-colors"
              >
                About
              </Link>
              <Link
                href="/productions"
                className="hover:text-film-red-500 focus:text-film-red-500 focus:outline-none transition-colors"
              >
                Productions
              </Link>
              <Link
                href="/stories"
                className="hover:text-film-red-500 focus:text-film-red-500 focus:outline-none transition-colors"
              >
                Stories
              </Link>

              <Button variant="primary">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </nav>

            <div className="hidden md:block">
              <ThemeSwitcher />
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-film-red-500 text-white"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen
                  ? (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  )
                  : (
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden bg-film-black-800 dark:bg-film-black-900 py-4 mt-2 space-y-3 rounded-b-lg">
            <Link
              href="/films"
              className="block px-4 py-2 hover:bg-film-black-700 text-white rounded-md"
            >
              Films
            </Link>
            <Link
              href="/about"
              className="block px-4 py-2 hover:bg-film-black-700 text-white rounded-md"
            >
              About
            </Link>
            <Link
              href="/productions"
              className="block px-4 py-2 hover:bg-film-black-700 text-white rounded-md"
            >
              Productions
            </Link>
            <Link
              href="/stories"
              className="block px-4 py-2 hover:bg-film-black-700 text-white rounded-md"
            >
              Stories
            </Link>
            <div className="flex items-center justify-between px-4 py-4 border-t border-film-black-700">
              <Button variant="primary">
                <Link href="/contact">Contact Us</Link>
              </Button>
              <ThemeSwitcher />
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;

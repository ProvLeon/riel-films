"use client";
import React, { useEffect, useState, useCallback, Suspense } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play, Info } from "lucide-react";

// Components
import BackToTop from "@/components/UI/BackToTop";
import { Button } from "@/components/UI/Button";
import { Card, CardContent, CardImage, CardTitle } from "@/components/UI/Card";
import PageViewTracker from "@/components/analytics/PageViewTracker";
import EngagementTracker from "@/components/analytics/EngagementTracker";
import LoadingSpinner from "@/components/UI/LoadingSpinner";

// Hooks and data
import { useFilmsList } from "@/hooks/useFilmsList";
import { useProductionsList } from "@/hooks/useProductionsList";
import { useStoriesList } from "@/hooks/useStoriesList";
import { getRevealClass } from "@/lib/utils";
// import { ContentType } from "@/types/analytics";

// Section IDs for animation tracking
const sectionIds = [
  "hero",
  "featured",
  "trending",
  "productions",
  "stories",
  "about"
];

function Main({ className = "" }: { className?: string }) {
  // State for intersection observer animations
  const [isVisible, setIsVisible] = useState<Record<string, boolean>>({});
  const [hasScrolled, setHasScrolled] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);

  // Fetch actual data from API using hooks
  const { films, isLoading: filmsLoading } = useFilmsList({ limit: 8 });
  const { productions, isLoading: productionsLoading } = useProductionsList({ limit: 3 });
  const { stories, isLoading: storiesLoading } = useStoriesList({ limit: 4, featured: true });

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

  // Autoplay for hero section
  useEffect(() => {
    if (!autoplayEnabled || filmsLoading || films.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % films.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [films, autoplayEnabled, filmsLoading]);

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

  // Derived featured and trending films
  const featuredFilms = films.filter(film => film.featured || film.rating > 4.0).slice(0, 2);
  const trendingFilms = films.slice(0, 6);

  // Get the current featured film for hero section
  const featuredFilm = films[currentSlide] || null;

  const handleSlideChange = useCallback((index: number) => {
    setCurrentSlide(index);
    setAutoplayEnabled(false); // Pause autoplay when user manually changes slides

    // Resume autoplay after 15 seconds
    setTimeout(() => setAutoplayEnabled(true), 15000);
  }, []);

  const isLoading = filmsLoading || productionsLoading || storiesLoading;

  return (
    <div className="relative bg-white dark:bg-film-black-950 min-h-screen">
      {/* Analytics tracker */}
      <Suspense fallback={null}>
        <PageViewTracker pageType="home" />
      </Suspense>

      {/* Back to top button */}

      {/* Subtle background pattern */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-5">
        <div className="absolute inset-0 bg-[url('/images/grain.png')] bg-repeat opacity-20"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col">
        <main className="flex-grow">
          {/* Hero Section - Netflix style featured content */}
          <section id="hero" className="relative w-full h-[85vh] overflow-hidden">
            {isLoading ? (
              <div className="relative w-full h-full bg-gradient-to-r from-film-black-950 to-film-black-900 flex items-center justify-center">
                <LoadingSpinner size="large" />
              </div>
            ) : (
              <>
                {/* Featured backdrop with smooth transitions */}
                <AnimatePresence mode="wait">
                  {featuredFilm && (
                    <motion.div
                      key={featuredFilm.id}
                      className="absolute inset-0"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.7 }}
                    >
                      <div className="relative w-full h-full">
                        <Image
                          src={featuredFilm.image || "/images/hero/hero1.jpg"}
                          alt={featuredFilm.title}
                          fill
                          priority
                          className="object-cover object-center"
                          sizes="100vw"
                        />

                        {/* Netflix-style gradient overlay that's stronger at bottom */}
                        <div className="absolute inset-0 bg-gradient-to-t from-film-black-950 via-film-black-950/80 to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-film-black-950/90 to-transparent"></div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Content area */}
                <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-12 md:px-16 lg:px-24">
                  <div className="max-w-3xl">
                    <AnimatePresence mode="wait">
                      {featuredFilm && (
                        <motion.div
                          key={featuredFilm.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          transition={{ duration: 0.5 }}
                        >
                          {/* Netflix-style large title */}
                          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 text-white leading-none">
                            {featuredFilm.title}
                          </h1>

                          {/* Film metadata row */}
                          <div className="flex items-center gap-3 mb-4 text-white/80 text-sm">
                            <span className="text-film-red-500 font-semibold">{featuredFilm.year}</span>
                            <span className="bg-white/20 px-1 rounded">{featuredFilm.rating ? `${featuredFilm.rating.toFixed(1)}/5` : "PG"}</span>
                            <span>{featuredFilm.duration || "1h 45m"}</span>
                            <span>{featuredFilm.category}</span>
                          </div>

                          {/* Description */}
                          <p className="text-white text-lg mb-8 line-clamp-3 md:line-clamp-none">
                            {featuredFilm.description}
                          </p>

                          {/* Call-to-action buttons */}
                          <div className="flex flex-wrap gap-4">
                            <EngagementTracker
                              contentType="film"
                              contentId={featuredFilm.id}
                              contentTitle={featuredFilm.title}
                              contentCategory={featuredFilm.category}
                              action="click"
                            >
                              <Button variant="primary" size="lg">
                                <Link href={`/films/${featuredFilm.slug}`} className="flex items-center">
                                  <Play className="mr-2 h-5 w-5" fill="currentColor" />
                                  Watch Now
                                </Link>
                              </Button>
                            </EngagementTracker>

                            <EngagementTracker
                              contentType="film"
                              contentId={featuredFilm.id}
                              contentTitle={featuredFilm.title}
                              contentCategory={featuredFilm.category}
                              action="click"
                              details={{ action: "more-info" }}
                            >
                              <Button variant="secondary" size="lg">
                                <Link href={`/films/${featuredFilm.slug}`} className="flex items-center">
                                  <Info className="mr-2 h-5 w-5" />
                                  More Info
                                </Link>
                              </Button>
                            </EngagementTracker>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Slide indicators (Netflix style dots) */}
                {films.length > 1 && (
                  <div className="absolute bottom-10 right-10 flex space-x-2">
                    {films.slice(0, 5).map((_, index) => (
                      <button
                        key={index}
                        className={`w-3 h-3 rounded-full transition-all ${index === currentSlide
                          ? "bg-white scale-110"
                          : "bg-white/50 hover:bg-white/80"
                          }`}
                        onClick={() => handleSlideChange(index)}
                        aria-label={`View slide ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </section>

          {/* Featured Content - Netflix-style spotlight */}
          <section
            id="featured"
            className={`scroll-reveal px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto mt-12 ${getRevealClass({ id: "featured", isVisible })}`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-film-black-900 dark:text-white">Featured Films</h2>
              <Link
                href="/films"
                className="flex items-center text-film-red-600 dark:text-film-red-500 hover:underline"
              >
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-24">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                {(featuredFilms.length > 0 ? featuredFilms : films.slice(0, 2)).map((film) => (
                  <EngagementTracker
                    key={film.id}
                    contentType="film"
                    contentId={film.id}
                    contentTitle={film.title}
                    contentCategory={film.category}
                  >
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Link href={`/films/${film.slug}`}>
                        <div className="relative h-[250px] md:h-[350px] rounded-lg overflow-hidden group">
                          <Image
                            src={film.image}
                            alt={film.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-film-black-900/90 via-film-black-900/30 to-transparent">
                          </div>
                          <div className="absolute bottom-0 left-0 p-6 w-full">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-film-red-500 font-medium">{film.category}</span>
                              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                              <span className="text-gray-300">{film.year}</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">{film.title}</h3>
                            <p className="text-gray-300 line-clamp-2">{film.description}</p>

                            <Button
                              variant="primary"
                              className="mt-4 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                              size="sm"
                              icon={<Play className="h-4 w-4" />}
                            >
                              Watch Now
                            </Button>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  </EngagementTracker>
                ))}
              </div>
            )}
          </section>

          {/* Trending Films - Horizontal scrollable row */}
          <section
            id="trending"
            className={`scroll-reveal mt-8 mb-16 ${getRevealClass({ id: "trending", isVisible })}`}
          >
            <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              <h2 className="text-2xl font-bold text-film-black-900 dark:text-white mb-6">Trending Now</h2>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="relative">
                <div className="flex space-x-4 overflow-x-auto pb-8 px-4 sm:px-6 lg:px-8 hide-scrollbar">
                  {trendingFilms.map((film) => (
                    <EngagementTracker
                      key={film.id}
                      contentType="film"
                      contentId={film.id}
                      contentTitle={film.title}
                      contentCategory={film.category}
                    >
                      <motion.div
                        className="flex-none w-[250px]"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Link href={`/films/${film.slug}`} className="block group">
                          <div className="relative h-[150px] rounded-lg overflow-hidden mb-2">
                            <Image
                              src={film.image}
                              alt={film.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-film-black-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <div className="absolute inset-0 flex items-center justify-center">
                                <div className="h-12 w-12 rounded-full bg-film-red-600/90 flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-300">
                                  <Play className="h-5 w-5 text-white" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <h3 className="font-medium text-film-black-900 dark:text-white group-hover:text-film-red-500 transition-colors">{film.title}</h3>
                          <div className="flex space-x-2 text-sm text-gray-600 dark:text-gray-400">
                            <span>{film.year}</span>
                            <span>•</span>
                            <span>{film.category}</span>
                          </div>
                        </Link>
                      </motion.div>
                    </EngagementTracker>
                  ))}
                </div>

                {/* Shadow indicators for horizontal scrolling */}
                <div className="absolute left-0 top-0 bottom-8 w-12 bg-gradient-to-r from-white dark:from-film-black-950 to-transparent pointer-events-none"></div>
                <div className="absolute right-0 top-0 bottom-8 w-12 bg-gradient-to-l from-white dark:from-film-black-950 to-transparent pointer-events-none"></div>
              </div>
            )}
          </section>

          {/* About Riel Films - Concise section with video */}
          <section className="bg-film-black-900 dark:bg-film-black-900/30 py-24">
            <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-6">The Voice of African Cinema</h2>
                  <p className="text-gray-300 mb-6 text-lg">
                    At Riel Films, we create authentic African stories through documentary film. Our mission is to showcase the richness and diversity of African culture, traditions, and contemporary life to global audiences.
                  </p>
                  <p className="text-gray-300 mb-8">
                    We collaborate with talented filmmakers across the continent to produce compelling narratives that educate, entertain, and inspire viewers worldwide.
                  </p>
                  <EngagementTracker
                    contentType="about"
                    contentId="about-section"
                    contentTitle="About Our Studio"
                    action="click"
                  >
                    <Button variant="primary">
                      <Link href="/about">
                        About Our Studio
                      </Link>
                    </Button>
                  </EngagementTracker>
                </div>

                <EngagementTracker
                  contentType="about"
                  contentId="about-video"
                  contentTitle="Studio Showcase Video"
                  action="click"
                  details={{ type: "video" }}
                >
                  <div className="relative h-[300px] md:h-[350px] rounded-lg overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center bg-film-black-900/20 z-10">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="h-16 w-16 md:h-20 md:w-20 bg-film-red-600 rounded-full flex items-center justify-center cursor-pointer shadow-lg"
                      >
                        <Play className="h-8 w-8 text-white ml-1" />
                      </motion.div>
                    </div>
                    <Image
                      src="/images/hero/hero7.jpg"
                      alt="Our Studio"
                      fill
                      className="object-cover"
                    />
                  </div>
                </EngagementTracker>
              </div>
            </div>
          </section>

          {/* Productions - Grid layout with hover effects */}
          <section
            id="productions"
            className={`scroll-reveal px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-16 ${getRevealClass({ id: "productions", isVisible })}`}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-film-black-900 dark:text-white">Current Productions</h2>
              <Link
                href="/productions"
                className="flex items-center text-film-red-600 dark:text-film-red-500 hover:underline"
              >
                All Productions <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>

            {productionsLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {productions.slice(0, 3).map((production) => (
                  <EngagementTracker
                    key={production.id}
                    contentType="production"
                    contentId={production.id}
                    contentTitle={production.title}
                    contentCategory={production.category}
                  >
                    <motion.div
                      whileHover={{ y: -8 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Link href={`/productions/${production.slug}`} className="block h-full group">
                        <Card className="h-full flex flex-col border-0 shadow-md dark:bg-film-black-900/40 hover:shadow-xl transition-shadow duration-300">
                          <CardImage
                            src={production.image}
                            alt={production.title}
                            className="transition-transform duration-500 group-hover:scale-105"
                            aspectRatio="aspect-[16/9]"
                            overlay={true}
                          />
                          <CardContent className="flex-grow dark:text-white">
                            <div className="flex justify-between items-start mb-2">
                              <CardTitle className="group-hover:text-film-red-600 dark:group-hover:text-film-red-500 transition-colors">
                                {production.title}
                              </CardTitle>
                            </div>
                            <div className="text-sm text-film-red-600 dark:text-film-red-400 mb-2">
                              {production.category} • {production.status}
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 line-clamp-2">
                              {production.description}
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  </EngagementTracker>
                ))}
              </div>
            )}
          </section>

          {/* Stories section - Simpler list view with hover effects */}
          <section
            id="stories"
            className={`scroll-reveal bg-gray-50 dark:bg-film-black-900/30 py-16 ${getRevealClass({ id: "stories", isVisible })}`}
          >
            <div className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-film-black-900 dark:text-white">Latest Stories</h2>
                <Link
                  href="/stories"
                  className="flex items-center text-film-red-600 dark:text-film-red-500 hover:underline"
                >
                  All Stories <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>

              {storiesLoading ? (
                <div className="flex justify-center py-12">
                  <LoadingSpinner />
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {stories.slice(0, 4).map((story) => (
                    <EngagementTracker
                      key={story.id}
                      contentType="story"
                      contentId={story.id}
                      contentTitle={story.title}
                      contentCategory={story.category}
                    >
                      <motion.div
                        whileHover={{ x: 10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link href={`/stories/${story.slug}`} className="block">
                          <div className="flex items-center p-4 bg-white dark:bg-film-black-800/40 rounded-lg hover:shadow-md transition-shadow group">
                            <div className="flex-grow">
                              <h3 className="font-medium text-film-black-900 dark:text-white group-hover:text-film-red-600 dark:group-hover:text-film-red-500 transition-colors">
                                {story.title}
                              </h3>
                              <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-1">
                                {story.excerpt}
                              </p>
                            </div>
                            <div className="h-10 w-10 rounded-full bg-film-red-50 dark:bg-film-red-900/20 flex items-center justify-center group-hover:bg-film-red-100 dark:group-hover:bg-film-red-900/40 transition-colors">
                              <ArrowRight className="h-4 w-4 text-film-red-600 dark:text-film-red-400 transform group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    </EngagementTracker>
                  ))}
                </div>
              )}
            </div>
          </section>

          {/* Call to Action - Netflix-style membership banner */}
          <section className="relative overflow-hidden bg-gradient-to-b from-film-red-600 via-film-red-500 to-film-black-900 dark:from-film-red-700 dark:via-film-red-800 dark:to-film-black-900/20 py-20 md:py-24">
            {/* Decorative elements */}
            <div className="absolute -left-24 top-1/2 transform -translate-y-1/2 w-64 h-64 rounded-full bg-film-red-400 dark:bg-film-red-900 opacity-20 blur-3xl"></div>
            <div className="absolute -right-24 -bottom-24 transform w-80 h-80 rounded-full bg-film-red-300 dark:bg-film-red-900 opacity-10 blur-3xl"></div>

            <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center relative z-10 max-w-5xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-white">
                  Join Our Community of African Film Enthusiasts
                </h2>
                <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-10 text-white text-opacity-90">
                  Subscribe to get updates on our latest releases, behind-the-scenes content, and exclusive stories.
                </p>
                <div className="flex flex-wrap justify-center gap-6">
                  <EngagementTracker
                    contentType="home"
                    contentId="cta-primary"
                    contentTitle="Explore Films CTA"
                    action="click"
                  >
                    <Button variant="primary">
                      <Link href="/films" className="flex items-center">
                        Explore Our Films
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 ml-2"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </Link>
                    </Button>
                  </EngagementTracker>

                  <EngagementTracker
                    contentType="home"
                    contentId="cta-secondary"
                    contentTitle="About Mission CTA"
                    action="click"
                  >
                    <Button variant="outline">
                      <Link href="/about">
                        About Our Mission
                      </Link>
                    </Button>
                  </EngagementTracker>
                </div>
              </motion.div>
            </div>
          </section>
        </main>
        <BackToTop />
      </div>
    </div>
  );
}

export default Main;

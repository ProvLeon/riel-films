"use client";
import React, { Suspense } from "react"; // Added Suspense
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import Image from "next/image";

// Components
import BackToTop from "@/components/UI/BackToTop";
import { Button } from "@/components/UI/Button";
import { Card, CardContent, CardImage, CardTitle } from "@/components/UI/Card";
import EngagementTracker from "@/components/analytics/EngagementTracker";
import LoadingSpinner from "@/components/UI/LoadingSpinner"; // Import LoadingSpinner
import HeroSection from "@/components/sections/HeroSection";
import CTASection from "@/components/sections/CTASection";
import SectionReveal from "@/components/UI/SectionReveal"; // Import SectionReveal

// Hooks and data
import { useFilmsList } from "@/hooks/useFilmsList";
import { useProductionsList } from "@/hooks/useProductionsList";
import { useStoriesList } from "@/hooks/useStoriesList";
import { FilmDetailSkeleton, FilmsPageSkeleton } from "../skeletons"; // Import appropriate skeletons
import { getStatusColor } from "@/lib/utils";
import { CardSkeleton } from "../UI/SkeletonLoaders";
import Skeleton from "../UI/Skeleton";


function Main({ className = "" }: { className?: string }) {
  // Fetch data using hooks
  const { films, isLoading: filmsLoading, error: filmsError } = useFilmsList({ limit: 8, featured: true }); // Fetch featured films first if possible
  const { productions, isLoading: productionsLoading, error: productionsError } = useProductionsList({ limit: 3, status: "In Production" }); // Fetch current productions
  const { stories, isLoading: storiesLoading, error: storiesError } = useStoriesList({ limit: 4, featured: true }); // Fetch featured stories

  // Combined loading state
  const isLoading = filmsLoading || productionsLoading || storiesLoading;

  // Derived featured and trending films
  const featuredFilms = films.filter(film => film.featured).slice(0, 2);
  const trendingFilms = films.slice(0, 6); // Use all fetched films for trending for now

  // Error Handling (Optional: Display a consolidated error message)
  const combinedError = filmsError || productionsError || storiesError;

  return (
    <div className="relative bg-white dark:bg-film-black-950 min-h-screen">
      <div className="relative z-10 flex flex-col">
        <main className="flex-grow">
          {/* Hero Section - This should handle its own loading/data if needed, or pass data */}
          <HeroSection />

          {/* Display consolidated error if any data fetch fails */}
          {combinedError && (
            <div className="container-custom my-10 p-4 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-lg text-center">
              Error loading page content: {combinedError}
            </div>
          )}

          {/* Featured Content */}
          <section id="featured" className="scroll-reveal container-custom mt-16 mb-12 md:mb-20">
            <SectionReveal>
              <div className="flex justify-between items-center mb-6 md:mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-film-black-900 dark:text-white">Featured Films</h2>
                <Link href="/films" className="flex items-center text-film-red-600 dark:text-film-red-500 hover:underline text-sm font-medium">
                  View all <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </SectionReveal>

            {filmsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Skeleton variant="rectangular" height={350} className="rounded-lg" />
                <Skeleton variant="rectangular" height={350} className="rounded-lg" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {(featuredFilms.length > 0 ? featuredFilms : films.slice(0, 2)).map((film, index) => (
                  <SectionReveal key={film.id} delay={index * 0.1}>
                    <EngagementTracker contentType="film" contentId={film.id} contentTitle={film.title}>
                      <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                        <Link href={`/films/${film.slug}`}>
                          <Card className="group h-full border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 dark:bg-film-black-900">
                            <div className="relative aspect-video overflow-hidden rounded-t-xl">
                              <CardImage src={film.image} alt={film.title} overlay={true} />
                              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="w-16 h-16 bg-film-red-600/90 rounded-full flex items-center justify-center backdrop-blur-sm">
                                  <Play className="h-6 w-6 text-white ml-1" />
                                </div>
                              </div>
                            </div>
                            <CardContent className="p-5">
                              <div className="flex items-center space-x-2 mb-2 text-xs">
                                <span className="text-film-red-500 font-medium">{film.category}</span>
                                <span className="text-gray-400">•</span>
                                <span className="text-gray-500 dark:text-gray-400">{film.year}</span>
                              </div>
                              <CardTitle className="text-lg group-hover:text-film-red-500 transition-colors">{film.title}</CardTitle>
                            </CardContent>
                          </Card>
                        </Link>
                      </motion.div>
                    </EngagementTracker>
                  </SectionReveal>
                ))}
              </div>
            )}
          </section>

          {/* Trending Films - Horizontal Scroll */}
          <section id="trending" className="scroll-reveal mt-8 mb-16 md:mb-24">
            <div className="container-custom mb-6 md:mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-film-black-900 dark:text-white">Trending Now</h2>
            </div>
            {filmsLoading ? (
              <div className="container-custom flex space-x-4 overflow-hidden pb-4">
                {[...Array(4)].map((_, i) => <Skeleton key={i} variant="rectangular" height={200} width={250} className="rounded-lg flex-none" />)}
              </div>
            ) : (
              <div className="relative">
                <div className="flex space-x-4 md:space-x-6 overflow-x-auto pb-8 px-4 sm:px-6 lg:px-8 scrollbar-hide">
                  {trendingFilms.map((film, index) => (
                    <SectionReveal key={film.id} delay={index * 0.05}>
                      <EngagementTracker contentType="film" contentId={film.id} contentTitle={film.title}>
                        <motion.div className="flex-none w-[260px] md:w-[300px]" whileHover={{ y: -5 }}>
                          <Link href={`/films/${film.slug}`} className="block group">
                            <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300 dark:bg-film-black-900">
                              <div className="relative aspect-video overflow-hidden rounded-t-xl">
                                <CardImage src={film.image} alt={film.title} overlay={true} />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <div className="w-12 h-12 bg-film-red-600/90 rounded-full flex items-center justify-center backdrop-blur-sm">
                                    <Play className="h-5 w-5 text-white ml-1" />
                                  </div>
                                </div>
                              </div>
                              <CardContent className="p-4">
                                <CardTitle className="text-base group-hover:text-film-red-500 transition-colors line-clamp-1">{film.title}</CardTitle>
                                <div className="flex space-x-2 text-xs text-gray-500 dark:text-gray-400 mt-1">
                                  <span>{film.year}</span>
                                  <span>•</span>
                                  <span>{film.category}</span>
                                </div>
                              </CardContent>
                            </Card>
                          </Link>
                        </motion.div>
                      </EngagementTracker>
                    </SectionReveal>
                  ))}
                </div>
                {/* Shadow indicators */}
                <div className="absolute left-0 top-0 bottom-8 w-16 bg-gradient-to-r from-white dark:from-film-black-950 to-transparent pointer-events-none md:hidden"></div>
                <div className="absolute right-0 top-0 bottom-8 w-16 bg-gradient-to-l from-white dark:from-film-black-950 to-transparent pointer-events-none md:hidden"></div>
              </div>
            )}
          </section>

          {/* About Riel Films Section */}
          <section className="bg-film-black-900 dark:bg-black py-20 md:py-28">
            <div className="container-custom">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <SectionReveal direction="left">
                  <div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">The Voice of African Cinema</h2>
                    <p className="text-gray-300 mb-6 text-lg leading-relaxed">
                      At Riel Films, we create authentic African stories through documentary film. Our mission is to showcase the richness and diversity of African culture, traditions, and contemporary life to global audiences.
                    </p>
                    <p className="text-gray-300 mb-8 leading-relaxed">
                      We collaborate with talented filmmakers across the continent to produce compelling narratives that educate, entertain, and inspire viewers worldwide.
                    </p>
                    <EngagementTracker contentType="about" contentId="about-section" contentTitle="About Our Studio">
                      <Button variant="primary" size="lg">
                        <Link href="/about">Learn About Our Mission</Link>
                      </Button>
                    </EngagementTracker>
                  </div>
                </SectionReveal>
                <SectionReveal direction="right">
                  <EngagementTracker contentType="about" contentId="about-video" contentTitle="Studio Showcase Video" action="play">
                    <motion.div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl cursor-pointer group" whileHover={{ scale: 1.03 }}>
                      <Image src="/images/hero/hero7.jpg" alt="Our Studio" fill className="object-cover" />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
                        <div className="w-20 h-20 bg-film-red-600/80 group-hover:bg-film-red-600 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors duration-300">
                          <Play className="h-8 w-8 text-white ml-1" />
                        </div>
                      </div>
                    </motion.div>
                  </EngagementTracker>
                </SectionReveal>
              </div>
            </div>
          </section>

          {/* Current Productions Section */}
          <section id="productions" className="scroll-reveal container-custom py-16 md:py-24">
            <SectionReveal>
              <div className="flex justify-between items-center mb-8 md:mb-10">
                <h2 className="text-2xl md:text-3xl font-bold text-film-black-900 dark:text-white">Current Productions</h2>
                <Link href="/productions" className="flex items-center text-film-red-600 dark:text-film-red-500 hover:underline text-sm font-medium">
                  All Productions <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </SectionReveal>
            {productionsLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[...Array(3)].map((_, i) => <CardSkeleton key={i} hasImage={true} imageHeight={200} />)}
              </div>
            ) : productions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                {productions.slice(0, 3).map((production, index) => (
                  <SectionReveal key={production.id} delay={index * 0.1}>
                    <EngagementTracker contentType="production" contentId={production.id} contentTitle={production.title}>
                      <motion.div whileHover={{ y: -8 }} transition={{ duration: 0.2 }} className="h-full">
                        <Link href={`/productions/${production.slug}`} className="block h-full group">
                          <Card className="h-full flex flex-col border border-gray-100 dark:border-film-black-800 shadow-sm hover:shadow-xl transition-shadow duration-300 dark:bg-film-black-900">
                            <CardImage src={production.image} alt={production.title} overlay={true} />
                            <CardContent className="p-5 flex-grow flex flex-col">
                              <span className={`inline-block px-2 py-0.5 rounded text-xs mb-2 w-fit ${getStatusColor(production.status)}`}>{production.status}</span>
                              <CardTitle className="text-lg group-hover:text-film-red-500 transition-colors line-clamp-1">{production.title}</CardTitle>
                              <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mt-1 flex-grow">{production.description}</p>
                              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-film-black-800">
                                <div className="w-full bg-gray-200 dark:bg-film-black-700 rounded-full h-1.5"><div className="bg-film-red-600 h-1.5 rounded-full" style={{ width: `${production.progress}%` }}></div></div>
                                <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 block text-right">{production.progress}% Complete</span>
                              </div>
                            </CardContent>
                          </Card>
                        </Link>
                      </motion.div>
                    </EngagementTracker>
                  </SectionReveal>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 dark:text-gray-400 py-10">No current productions to display.</p>
            )}
          </section>

          {/* Latest Stories Section */}
          <section id="stories" className="scroll-reveal bg-gray-50 dark:bg-film-black-900 py-16 md:py-24">
            <div className="container-custom">
              <SectionReveal>
                <div className="flex justify-between items-center mb-8 md:mb-10">
                  <h2 className="text-2xl md:text-3xl font-bold text-film-black-900 dark:text-white">Latest Stories</h2>
                  <Link href="/stories" className="flex items-center text-film-red-600 dark:text-film-red-500 hover:underline text-sm font-medium">
                    All Stories <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </SectionReveal>
              {storiesLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(4)].map((_, i) => <Skeleton key={i} height={100} className="rounded-lg" />)}
                </div>
              ) : stories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {stories.slice(0, 4).map((story, index) => (
                    <SectionReveal key={story.id} delay={index * 0.1}>
                      <EngagementTracker contentType="story" contentId={story.id} contentTitle={story.title}>
                        <motion.div whileHover={{ x: 6 }} transition={{ duration: 0.2 }}>
                          <Link href={`/stories/${story.slug}`} className="block p-5 bg-white dark:bg-film-black-800 rounded-xl hover:shadow-md transition-shadow group border border-gray-100 dark:border-film-black-700">
                            <div className="flex justify-between items-start">
                              <div className="flex-1 mr-4">
                                <span className="text-xs text-film-red-600 dark:text-film-red-400 font-medium mb-1 block">{story.category}</span>
                                <h3 className="font-semibold text-film-black-900 dark:text-white group-hover:text-film-red-500 transition-colors line-clamp-1">{story.title}</h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mt-1">{story.excerpt}</p>
                              </div>
                              <div className="mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <ArrowRight className="h-5 w-5 text-film-red-500" />
                              </div>
                            </div>
                          </Link>
                        </motion.div>
                      </EngagementTracker>
                    </SectionReveal>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 py-10">No stories available yet.</p>
              )}
            </div>
          </section>

          {/* Final CTA Section */}
          <CTASection
            title="Join Our Community of African Film Enthusiasts"
            subtitle="Subscribe to get updates on our latest releases, behind-the-scenes content, and exclusive stories."
            primaryCta={{
              text: "Explore Our Films",
              link: "/films"
            }}
            secondaryCta={{
              text: "About Our Mission",
              link: "/about"
            }}
          />
        </main>

        <BackToTop />
      </div>
    </div>
  );
}

export default Main;

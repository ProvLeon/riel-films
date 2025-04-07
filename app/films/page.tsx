"use client";
import React, { useMemo, useState } from "react"; // Added useState
import Link from "next/link";
import { Button } from "@/components/UI/Button";
import PageTransition from "@/components/UI/PageTransition";
import SectionReveal from "@/components/UI/SectionReveal";
import { useFilmsList } from "@/hooks/useFilmsList";
import { Film as FilmType } from "@/types/mongodbSchema";
import { Card, CardContent, CardImage, CardTitle } from "@/components/UI/Card"; // Use unified Card
import { FilmsPageSkeleton } from "@/components/skeletons/FilmsPageSkeleton";
import { Play, ArrowRight, Star, Filter, ChevronDown, Film } from "lucide-react"; // Added Filter, ChevronDown
import { CldImage } from 'next-cloudinary';


import Image from "next/image";
import { motion } from 'framer-motion';

const FilmsPage = () => {
  const { films, isLoading, error } = useFilmsList(); // Fetch all films
  const [selectedCategory, setSelectedCategory] = useState<string>("All"); // Filter state
  const [sortBy, setSortBy] = useState<string>("releaseDateDesc"); // Sort state

  // Derive categories for filter dropdown
  const categories = useMemo(() => ["All", ...Array.from(new Set(films.map(f => f.category))).sort()], [films]);

  // Filter and sort films based on state
  const filteredAndSortedFilms = useMemo(() => {
    let processedFilms = [...films];

    // Filter
    if (selectedCategory !== "All") {
      processedFilms = processedFilms.filter(f => f.category === selectedCategory);
    }

    // Sort
    processedFilms.sort((a, b) => {
      switch (sortBy) {
        case "titleAsc": return a.title.localeCompare(b.title);
        case "titleDesc": return b.title.localeCompare(a.title);
        case "yearAsc": return parseInt(a.year) - parseInt(b.year);
        case "yearDesc": return parseInt(b.year) - parseInt(a.year);
        case "ratingDesc": return (b.rating || 0) - (a.rating || 0);
        case "releaseDateDesc": // Fallback if releaseDate isn't always present/valid
        default:
          const dateA = a.releaseDate ? new Date(a.releaseDate).getTime() : 0;
          const dateB = b.releaseDate ? new Date(b.releaseDate).getTime() : 0;
          return dateB - dateA;
      }
    });
    return processedFilms;
  }, [films, selectedCategory, sortBy]);

  // Separate featured film
  const featuredFilm = useMemo(() => filteredAndSortedFilms.find(f => f.featured) || (filteredAndSortedFilms.length > 0 ? filteredAndSortedFilms[0] : null), [filteredAndSortedFilms]);
  // Exclude featured film from the archive list
  const archiveFilms = useMemo(() => filteredAndSortedFilms.filter(f => f.id !== featuredFilm?.id), [filteredAndSortedFilms, featuredFilm]);

  // Loading State
  if (isLoading && films.length === 0) {
    return <FilmsPageSkeleton />;
  }

  // Error State
  if (error) return <div className="container-custom py-40 text-center text-red-500">Error loading films: {error}</div>;

  // No Films State (Initial load or after filtering)
  const noFilmsFound = !isLoading && filteredAndSortedFilms.length === 0;

  return (
    <PageTransition>
      <div className="min-h-screen bg-white dark:bg-film-black-950 pt-24 pb-20">
        <div className="container-custom">
          {/* Header */}
          <SectionReveal>
            <h1 className="text-4xl md:text-5xl font-bold mb-10 text-film-black-900 dark:text-white text-center md:text-left">
              Our <span className="text-film-red-600">Films</span>
            </h1>
          </SectionReveal>

          {/* Featured Film Section */}
          {featuredFilm && !noFilmsFound && (
            <section className="mb-16 md:mb-20">
              <SectionReveal delay={0.1}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-center bg-gray-50 dark:bg-film-black-900 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-film-black-800">
                  {/* Image Side */}
                  <div className="relative aspect-video lg:aspect-auto lg:h-full group">
                    <CldImage src={featuredFilm.image} alt={featuredFilm.title} fill className="object-cover" overlay={true} />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4 bg-film-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold z-10">Featured Film</div>
                    {/* Play Button Overlay */}
                    <Link href={`/films/${featuredFilm.slug}`} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 z-10">
                      <motion.div whileHover={{ scale: 1.1 }} className="w-16 h-16 bg-film-red-600/80 hover:bg-film-red-600 rounded-full flex items-center justify-center text-white shadow-lg backdrop-blur-sm">
                        <Play size={32} className="ml-1" />
                      </motion.div>
                    </Link>
                  </div>
                  {/* Content Side */}
                  <div className="p-6 md:p-10 flex flex-col justify-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-3 text-film-black-900 dark:text-white">{featuredFilm.title}</h2>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm mb-4">
                      <span className="text-film-red-600 dark:text-film-red-500 font-medium">{featuredFilm.category}</span>
                      <span className="text-gray-500 dark:text-gray-400">•</span>
                      <span className="text-gray-600 dark:text-gray-300">{featuredFilm.year}</span>
                      {featuredFilm.rating > 0 && (
                        <>
                          <span className="text-gray-500 dark:text-gray-400">•</span>
                          <span className="flex items-center text-amber-500">
                            <Star size={14} fill="currentColor" className="mr-1" /> {featuredFilm.rating.toFixed(1)}
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 mb-6 text-base leading-relaxed line-clamp-3">{featuredFilm.description}</p>
                    <div className="flex flex-wrap gap-4">
                      <Button variant="primary" size="md"><Link href={`/films/${featuredFilm.slug}`}>Learn More</Link></Button>
                      {featuredFilm.trailer && <Button variant="secondary" size="md"><Link href={`/films/${featuredFilm.slug}#trailer`}>Watch Trailer</Link></Button>}
                    </div>
                  </div>
                </div>
              </SectionReveal>
            </section>
          )}

          {/* Film Archive & Filters */}
          <section className="mb-20">
            <SectionReveal>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <h2 className="text-3xl font-semibold text-film-black-900 dark:text-white">Film Archive</h2>
                {/* Filters */}
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="pl-9 pr-8 py-2 rounded-lg bg-gray-100 dark:bg-film-black-800 border border-gray-200 dark:border-film-black-700 text-sm focus:outline-none focus:ring-1 focus:ring-film-red-500 appearance-none text-gray-700 dark:text-gray-300"
                      aria-label="Filter by category"
                    >
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="pl-4 pr-8 py-2 rounded-lg bg-gray-100 dark:bg-film-black-800 border border-gray-200 dark:border-film-black-700 text-sm focus:outline-none focus:ring-1 focus:ring-film-red-500 appearance-none text-gray-700 dark:text-gray-300"
                      aria-label="Sort films"
                    >
                      <option value="releaseDateDesc">Newest First</option>
                      <option value="titleAsc">Title (A-Z)</option>
                      <option value="titleDesc">Title (Z-A)</option>
                      <option value="yearDesc">Year (Newest)</option>
                      <option value="yearAsc">Year (Oldest)</option>
                      <option value="ratingDesc">Rating (Highest)</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </SectionReveal>

            {noFilmsFound ? (
              <SectionReveal>
                <div className="text-center py-16 text-gray-500 dark:text-gray-400 border border-dashed border-gray-300 dark:border-film-black-700 rounded-lg">
                  <Film className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  No films found matching your criteria.
                </div>
              </SectionReveal>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
                {archiveFilms.map((film: FilmType, index: number) => (
                  <SectionReveal key={film.id || index} delay={0.05 * index}>
                    <motion.div className="h-full" whileHover={{ y: -6 }} transition={{ duration: 0.2 }}>
                      <Card className="h-full flex flex-col group bg-white dark:bg-film-black-900 border border-gray-100 dark:border-film-black-800 shadow-sm hover:shadow-lg transition-shadow duration-300">
                        <div className="relative aspect-video overflow-hidden rounded-t-xl">
                          <CardImage src={film.image} alt={film.title} overlay={true} />
                          <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 text-white text-xs rounded backdrop-blur-sm">{film.category}</div>
                        </div>
                        <CardContent className="p-5 flex-grow flex flex-col">
                          <CardTitle className="group-hover:text-film-red-600 dark:group-hover:text-film-red-500 transition-colors mb-2 text-lg line-clamp-1">{film.title}</CardTitle>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2 flex-grow">{film.description}</p>
                          <div className="mt-auto pt-3 border-t border-gray-100 dark:border-film-black-800 flex justify-between items-center text-sm">
                            <span className="text-gray-500 dark:text-gray-400">{film.year}</span>
                            <Link href={`/films/${film.slug}`} className="text-film-red-600 dark:text-film-red-500 font-medium hover:underline inline-flex items-center group/link">
                              Details <ArrowRight className="h-4 w-4 ml-1 group-hover/link:translate-x-1 transition-transform" />
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </SectionReveal>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </PageTransition>
  );
};

export default FilmsPage;

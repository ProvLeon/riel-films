"use client";
import React from "react";
import { Card, CardContent, CardImage, CardTitle, CardDescription } from "@/components/UI/Card";
import Link from "next/link";
import { Button } from "@/components/UI/Button";
import PageTransition from "@/components/UI/PageTransition";
import SectionReveal from "@/components/UI/SectionReveal";
import { useFilmsList } from "@/hooks/useFilmsList";
import { Film } from "@/types/mongodbSchema";
import { LinkCard } from "@/components/LinkCards"; // Assuming this handles analytics
import { FilmsPageSkeleton } from "@/components/skeletons/FilmsPageSkeleton"; // Import skeleton
import { Award, Play } from "lucide-react"; // Import icons
import Image from "next/image";
import { motion } from 'framer-motion'; // Import motion

const FilmsPage = () => {
  const { films, isLoading, error } = useFilmsList(); // Get all films

  // Loading State
  if (isLoading && (!films || films.length === 0)) {
    return <FilmsPageSkeleton />;
  }

  // Error State
  if (error) return <div className="p-8 text-center text-red-500">Error loading films: {error}</div>;

  // No Films State
  if (!films || films.length === 0) {
    return <div className="p-8 text-center text-gray-500">No films found.</div>;
  }

  // Find featured film (or use first as fallback)
  const featuredFilm = films.find(f => f.featured) || films[0];
  // Exclude featured film from the main archive list
  const archiveFilms = films.filter(f => f.id !== featuredFilm?.id);

  return (
    <PageTransition>
      <div className="min-h-screen bg-white dark:bg-film-black-950 pt-24 pb-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <SectionReveal>
            <h1 className="text-4xl md:text-5xl font-bold mb-10 text-film-black-900 dark:text-white text-center md:text-left">
              Our <span className="text-film-red-600">Films</span>
            </h1>
          </SectionReveal>

          {/* Featured Film Section */}
          {featuredFilm && (
            <section className="mb-16 md:mb-20">
              <SectionReveal delay={0.1}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center bg-gray-50 dark:bg-film-black-900 rounded-2xl shadow-lg overflow-hidden p-1"> {/* Subtle padding for border effect */}
                  {/* Image Side */}
                  <div className="relative aspect-[16/10] lg:aspect-auto lg:h-full group rounded-xl overflow-hidden">
                    <Image src={featuredFilm.image} alt={featuredFilm.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" priority />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4 bg-film-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">Featured Film</div>
                    {/* Play Button Overlay */}
                    <Link href={`/films/${featuredFilm.slug}`} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40">
                      <div className="w-16 h-16 bg-film-red-600/80 hover:bg-film-red-600 rounded-full flex items-center justify-center text-white shadow-lg backdrop-blur-sm">
                        <Play size={32} className="ml-1" />
                      </div>
                    </Link>
                  </div>
                  {/* Content Side */}
                  <div className="p-6 md:p-10 flex flex-col justify-center">
                    <h2 className="text-2xl md:text-3xl font-bold mb-3 text-film-black-900 dark:text-white">{featuredFilm.title}</h2>
                    <p className="text-film-red-600 dark:text-film-red-500 font-medium mb-3 text-sm">{featuredFilm.category} • {featuredFilm.year}</p>
                    <p className="text-gray-700 dark:text-gray-300 mb-6 text-base leading-relaxed line-clamp-4">{featuredFilm.description}</p>
                    {featuredFilm.awards && featuredFilm.awards.length > 0 && featuredFilm.awards[0] !== "" && (
                      <div className="mb-6">
                        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 flex items-center"><Award size={14} className="mr-1.5 text-amber-500" />Awards</h3>
                        <ul className="space-y-1 text-sm">
                          {featuredFilm.awards.slice(0, 2).map((award, index) => ( // Show max 2 awards here
                            <li key={index} className="text-gray-700 dark:text-gray-300 line-clamp-1" title={award}>• {award}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-4">
                      <Button variant="primary" size="md"><Link href={`/films/${featuredFilm.slug}`}>Learn More</Link></Button>
                      {featuredFilm.trailer && <Button variant="secondary" size="md"><Link href={`/films/${featuredFilm.slug}#trailer`}>Watch Trailer</Link></Button>}
                    </div>
                  </div>
                </div>
              </SectionReveal>
            </section>
          )}

          {/* Film Archive */}
          <section className="mb-20">
            <SectionReveal>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
                <h2 className="text-3xl font-semibold text-film-black-900 dark:text-white">Film Archive</h2>
                {/* Placeholder for Filters - Implement later */}
                <div className="flex items-center space-x-2">
                  <select className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-film-black-800 border border-gray-200 dark:border-film-black-700 text-sm focus:outline-none focus:ring-1 focus:ring-film-red-500">
                    <option>All Categories</option>
                    <option>Documentary</option>
                    <option>Feature Film</option>
                  </select>
                  <select className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-film-black-800 border border-gray-200 dark:border-film-black-700 text-sm focus:outline-none focus:ring-1 focus:ring-film-red-500">
                    <option>Sort by Year</option>
                    <option>Newest First</option>
                    <option>Oldest First</option>
                  </select>
                </div>
              </div>
            </SectionReveal>

            {archiveFilms.length === 0 ? (
              <SectionReveal>
                <div className="text-center py-16 text-gray-500 dark:text-gray-400">
                  More films coming soon!
                </div>
              </SectionReveal>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {archiveFilms.map((film: Film, index: number) => (
                  <SectionReveal key={film.id || index} delay={0.05 * index}>
                    <motion.div className="h-full" whileHover={{ y: -6 }} transition={{ duration: 0.2 }}>
                      <Card className="h-full flex flex-col group bg-white dark:bg-film-black-900 border border-gray-100 dark:border-film-black-800 shadow-sm hover:shadow-lg transition-shadow">
                        <div className="relative aspect-video overflow-hidden">
                          <CardImage src={film.image} alt={film.title} overlay={true} />
                          <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded">{film.category}</div>
                        </div>
                        <CardContent className="p-5 flex-grow flex flex-col">
                          <CardTitle className="group-hover:text-film-red-600 dark:group-hover:text-film-red-500 transition-colors mb-2 text-lg line-clamp-1">{film.title}</CardTitle>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-3 flex-grow">{film.description}</p>
                          <div className="mt-auto pt-3 border-t border-gray-100 dark:border-film-black-800 flex justify-between items-center text-sm">
                            <span className="text-gray-500 dark:text-gray-400">{film.year}</span>
                            {/* Use LinkCard for analytics tracking if needed, otherwise standard Link */}
                            <Link href={`/films/${film.slug}`} className="text-film-red-600 dark:text-film-red-500 font-medium hover:underline inline-flex items-center">
                              View details <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
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

          {/* Call to Action (Simplified or removed if redundant with footer/other sections) */}
          {/* Consider if this CTA is necessary or if the Footer's CTA is sufficient */}
          {/* <section className="mb-20"> ... </section> */}
        </div>
      </div>
    </PageTransition>
  );
};

export default FilmsPage;

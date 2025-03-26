// riel-films/app/films/page.tsx
"use client";
import React from "react";
import { Card, CardContent, CardImage, CardTitle, CardDescription } from "@/components/UI/Card";
import Link from "next/link";
import { Button } from "@/components/UI/Button";
import PageTransition from "@/components/UI/PageTransition";
import SectionReveal from "@/components/UI/SectionReveal";
import { useFilmsList } from "@/hooks/useFilmsList"; // Changed to useFilmsList
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import type { Film } from "@/types/mongodbSchema"; // Import the Film type


const FilmsPage = ({ params }: { params: { slug: string } }) => {
  const { films, isLoading, error, refetch } = useFilmsList();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;
  if (!films || films.length === 0) return <div>No films found</div>;

  const featuredFilm = films[0];
  console.log(films)

  return (
    <PageTransition>
      <div className="min-h-screen bg-white dark:bg-film-black-950 pt-24">
        <div className="container mx-auto px-4">
          {/* Featured Film */}
          <section className="mb-20">
            <SectionReveal>
              <h1 className="text-4xl md:text-5xl font-bold mb-16 text-film-black-900 dark:text-white">
                Our Films
              </h1>
            </SectionReveal>

            <SectionReveal delay={0.2}>
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3">
                  <div className="relative aspect-video rounded-xl overflow-hidden">
                    <CardImage
                      src={featuredFilm.image}
                      alt={featuredFilm.title}
                      aspectRatio="aspect-video"
                      overlay={true}
                    />
                    <div className="absolute top-4 left-4 bg-film-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Featured Film
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-2 flex flex-col justify-center">
                  <h2 className="text-3xl font-bold mb-3 text-film-black-900 dark:text-white">{featuredFilm.title}</h2>
                  <p className="text-film-red-600 dark:text-film-red-500 font-medium mb-2">{featuredFilm.category} • {featuredFilm.year}</p>
                  <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg">{featuredFilm.description}</p>

                  {featuredFilm.awards && featuredFilm.awards.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 uppercase mb-2">Awards</h3>
                      <ul className="space-y-1">
                        {featuredFilm.awards.map((award: string, index: number) => (
                          <li key={index} className="flex items-center text-gray-700 dark:text-gray-300">
                            <span className="text-film-red-500 mr-2">•</span> {award}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="flex space-x-4">
                    <Button variant="primary">
                      <Link href={`/films/${featuredFilm.slug}`}>Watch Trailer</Link>
                    </Button>
                    <Button variant="secondary">
                      <Link href={`/films/${featuredFilm.slug}`}>Learn More</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </SectionReveal>
          </section>

          {/* Film Archive */}
          <section className="mb-20">
            <SectionReveal>
              <div className="flex justify-between items-center mb-10">
                <h2 className="text-3xl font-semibold text-film-black-900 dark:text-white">Film Archive</h2>
                <div className="hidden md:flex items-center space-x-4">
                  {/* Filters */}
                </div>
              </div>
            </SectionReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {films.slice(1).map((film: Film, index: number) => (
                <SectionReveal key={film.id} delay={0.1 * (index % 3)}>
                  <Card className="h-full flex flex-col" isHoverable={true}>
                    <CardImage
                      src={film.image}
                      alt={film.title}
                      aspectRatio="aspect-video"
                      overlay={true}
                    />
                    <CardContent className="flex-grow dark:text-white">
                      <CardTitle className="group-hover:text-film-red-600 dark:group-hover:text-film-red-500 transition-colors">
                        {film.title}
                      </CardTitle>
                      <CardDescription>{film.category} • {film.year}</CardDescription>
                      <p className="text-gray-700 dark:text-gray-300 mt-2">{film.description}</p>
                      <div className="mt-4">
                        <Link href={`/films/${film.slug}`} className="text-film-red-600 dark:text-film-red-500 font-medium hover:underline inline-flex items-center">
                          View details
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </SectionReveal>
              ))}
            </div>
          </section>

          {/* Call to Action */}
          <section className="mb-20">
            <SectionReveal direction="up">
              <div className="bg-film-red-50 dark:bg-film-black-900 rounded-xl p-8 md:p-12">
                <div className="max-w-3xl mx-auto text-center">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 text-film-black-900 dark:text-white">Interested in screening our films?</h2>
                  <p className="text-gray-700 dark:text-gray-300 mb-6">
                    Riel Films is open to partnerships with film festivals, theaters, educational institutions, and cultural centers interested in showcasing authentic African cinema.
                  </p>
                  <Button variant="primary">
                    <Link href="/contact">Contact Our Distribution Team</Link>
                  </Button>
                </div>
              </div>
            </SectionReveal>
          </section>
        </div>
      </div>
    </PageTransition>
  );
};

export default FilmsPage;

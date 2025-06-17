"use client";
import React, { Suspense } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Play, GraduationCap, Video, Camera, Users, Award, CheckCircle } from "lucide-react";
import Image from "next/image";

// Components
import BackToTop from "@/components/UI/BackToTop";
import { Button } from "@/components/UI/Button";
import { Card, CardContent, CardImage, CardTitle } from "@/components/UI/Card";
import EngagementTracker from "@/components/analytics/EngagementTracker";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import HeroSection from "@/components/sections/HeroSection";
import CTASection from "@/components/sections/CTASection";
import SectionReveal from "@/components/UI/SectionReveal";
import SmartImage from '@/components/UI/SmartImage';

// Hooks and data
import { useFilmsList } from "@/hooks/useFilmsList";
import { useProductionsList } from "@/hooks/useProductionsList";
import { useStoriesList } from "@/hooks/useStoriesList";
import { getStatusColor } from "@/lib/utils";
import { CardSkeleton } from "../UI/SkeletonLoaders";
import Skeleton from "../UI/Skeleton";

function Main({ className = "" }: { className?: string }) {
  // Fetch data using hooks
  const { films, isLoading: filmsLoading, error: filmsError } = useFilmsList({ limit: 8, featured: true });
  const { productions, isLoading: productionsLoading, error: productionsError } = useProductionsList({ limit: 3, status: "In Production" });
  const { stories, isLoading: storiesLoading, error: storiesError } = useStoriesList({ limit: 4, featured: true });

  // Combined loading state
  const isLoading = filmsLoading || productionsLoading || storiesLoading;

  // Derived featured and trending films
  const featuredFilms = films.filter(film => film.featured).slice(0, 2);
  const trendingFilms = films.slice(0, 6);

  // Error Handling
  const combinedError = filmsError || productionsError || storiesError;

  // Academy programs data
  const academyPrograms = [
    {
      icon: <Video className="h-6 w-6" />,
      title: "Directing & Scriptwriting",
      description: "Master visual storytelling and bring your creative vision to life",
      duration: "2 weeks"
    },
    {
      icon: <Camera className="h-6 w-6" />,
      title: "Camera Operation",
      description: "Learn professional camera techniques and composition",
      duration: "2 weeks"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Acting for Screen",
      description: "Develop acting skills specifically for film and television",
      duration: "1 week"
    }
  ];

  // Production services data
  const productionServices = [
    {
      title: "Music Videos",
      description: "Creative and professional music video production",
      image: "/images/hero/hero1.jpg"
    },
    {
      title: "Corporate Events",
      description: "Professional coverage of corporate functions and events",
      image: "/images/hero/hero2.jpg"
    },
    {
      title: "Documentaries",
      description: "Compelling documentary storytelling that captures reality",
      image: "/images/hero/hero3.jpg"
    },
    {
      title: "Weddings",
      description: "Beautiful wedding cinematography to capture your special day",
      image: "/images/hero/hero4.jpg"
    },
    {
      title: "Live Streaming",
      description: "Professional live streaming services for events",
      image: "/images/hero/hero5.jpg"
    },
    {
      title: "Photography",
      description: "Professional photography for all occasions",
      image: "/images/hero/hero6.jpg"
    }
  ];

  // Academy features
  const academyFeatures = [
    "Hands-on training with real film sets",
    "Industry-standard equipment and software",
    "Mentorship from working professionals",
    "8-week comprehensive program",
    "Flexible weekday and weekend options",
    "Scholarships available for deserving candidates"
  ];

  return (
    <div className="relative bg-white dark:bg-film-black-950 min-h-screen">
      <div className="relative z-10 flex flex-col">
        <main className="flex-grow">
          {/* Hero Section */}
          <HeroSection />

          {/* Display consolidated error if any data fetch fails */}
          {combinedError && (
            <div className="container-custom my-10 p-4 bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 rounded-lg text-center">
              Error loading page content: {combinedError}
            </div>
          )}

          {/* About Section - Brief Overview */}
          <SectionReveal>
            <section className="py-16 lg:py-24 bg-gray-50 dark:bg-film-black-900">
              <div className="container-custom">
                <div className="max-w-4xl mx-auto text-center">
                  <h2 className="text-3xl md:text-5xl font-bold mb-6 dark:text-white text-film-black-900">
                    About <span className="text-film-red-500">RIEL FILMS</span>
                  </h2>
                  <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                    RIEL FILMS is a Ghanaian-based film production company that brings ideas to life — from short films and music videos to corporate events and documentaries. As part of our vision to grow Ghana's creative industry, we founded RIEL FILMS ACADEMY — our official training wing.
                  </p>
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                    Whether on set or in class, one thing is clear: <strong className="text-film-red-500">We're all about creative impact.</strong>
                  </p>
                  <Button variant="primary" size="lg">
                    <Link href="/about">Learn More About Us</Link>
                  </Button>
                </div>
              </div>
            </section>
          </SectionReveal>

          {/* Academy Section */}
          <SectionReveal>
            <section className="py-16 lg:py-24">
              <div className="container-custom">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  <div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 dark:text-white text-film-black-900">
                      RIEL FILMS <span className="text-film-red-500">ACADEMY</span>
                    </h2>
                    <p className="text-xl text-film-red-500 mb-4 font-medium">
                      "You don't need a film background — just the passion."
                    </p>
                    <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                      RIEL FILMS ACADEMY is where raw talent becomes real skill. Whether you want to direct, act, edit, or write — we'll teach you the craft and walk with you every step of the way.
                    </p>

                    <div className="space-y-3 mb-8">
                      {academyFeatures.map((feature, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <CheckCircle className="h-5 w-5 text-film-red-500 flex-shrink-0" />
                          <span className="text-gray-600 dark:text-gray-300">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button variant="primary" size="lg">
                        <Link href="/academy">Join Academy</Link>
                      </Button>
                      <Button variant="secondary" size="lg">
                        <Link href="/academy#programs">View Programs</Link>
                      </Button>
                    </div>
                  </div>

                  <div className="relative">
                    <SmartImage
                      src="/images/hero/hero8.jpg"
                      alt="RIEL FILMS Academy classroom session"
                      width={600}
                      height={400}
                      className="rounded-lg shadow-xl"
                    />
                  </div>
                </div>

                {/* Academy Programs Preview */}
                <div className="mt-16">
                  <h3 className="text-2xl md:text-3xl font-bold mb-8 text-center dark:text-white text-film-black-900">
                    What We Teach
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {academyPrograms.map((program, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        viewport={{ once: true }}
                      >
                        <Card className="h-full text-center border-l-4 border-l-film-red-500">
                          <CardContent className="p-6">
                            <div className="p-3 bg-film-red-100 dark:bg-film-red-900/20 rounded-full w-fit mx-auto mb-4 text-film-red-600 dark:text-film-red-400">
                              {program.icon}
                            </div>
                            <h4 className="font-semibold text-lg mb-2 dark:text-white">{program.title}</h4>
                            <p className="text-sm text-film-red-500 font-medium mb-3">{program.duration}</p>
                            <p className="text-gray-600 dark:text-gray-300">{program.description}</p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </SectionReveal>

          {/* Film Production Services */}
          <SectionReveal>
            <section className="py-16 lg:py-24 bg-gray-50 dark:bg-film-black-900">
              <div className="container-custom">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-5xl font-bold mb-6 dark:text-white text-film-black-900">
                    Film Production <span className="text-film-red-500">Services</span>
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                    At RIEL FILMS, we direct, shoot, edit, and deliver visual content that connects with real people. Every project is built with care — from script to screen.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {productionServices.map((service, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Card className="group h-full hover:shadow-lg transition-all duration-300 overflow-hidden">
                        <div className="relative aspect-video overflow-hidden">
                          <SmartImage
                            src={service.image}
                            alt={service.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                          <div className="absolute bottom-4 left-4">
                            <h3 className="text-white font-semibold text-lg">{service.title}</h3>
                          </div>
                        </div>
                        <CardContent className="p-6">
                          <p className="text-gray-600 dark:text-gray-300">{service.description}</p>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <div className="text-center mt-12">
                  <Button variant="primary" size="lg">
                    <Link href="/productions">View All Services</Link>
                  </Button>
                </div>
              </div>
            </section>
          </SectionReveal>

          {/* Film Projects Section */}
          <SectionReveal>
            <section id="projects" className="py-16 lg:py-24">
              <div className="container-custom">
                <div className="flex justify-between items-center mb-12">
                  <div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 dark:text-white text-film-black-900">
                      Film <span className="text-film-red-500">Projects</span>
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300">
                      Explore our portfolio of completed and ongoing film projects
                    </p>
                  </div>
                  <Link href="/films" className="flex items-center text-film-red-600 dark:text-film-red-500 hover:underline font-medium">
                    View all <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>

                {filmsLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[...Array(6)].map((_, i) => (
                      <CardSkeleton key={i} hasImage={true} animation="shimmer" />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {films.slice(0, 6).map((film, index) => (
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
              </div>
            </section>
          </SectionReveal>

          {/* Student Projects Section */}
          <SectionReveal>
            <section className="py-16 lg:py-24 bg-gray-50 dark:bg-film-black-900">
              <div className="container-custom">
                <div className="text-center mb-16">
                  <h2 className="text-3xl md:text-5xl font-bold mb-6 dark:text-white text-film-black-900">
                    Student <span className="text-film-red-500">Projects</span>
                  </h2>
                  <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                    Check out amazing projects completed by our academy students. These showcase the talent and skills developed through our hands-on training program.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {/* Placeholder for student projects - these would come from a separate data source */}
                  {[1, 2, 3].map((project, index) => (
                    <motion.div
                      key={project}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Card className="group h-full">
                        <div className="relative aspect-video overflow-hidden rounded-t-xl bg-gray-200 dark:bg-gray-700">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                              <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                              <p className="text-gray-500 text-sm">Student Project {project}</p>
                            </div>
                          </div>
                        </div>
                        <CardContent className="p-5">
                          <CardTitle className="text-lg mb-2">Student Project {project}</CardTitle>
                          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                            Amazing work by one of our academy graduates showcasing their newly acquired skills.
                          </p>
                          <Button variant="outline" size="sm">
                            Watch on YouTube
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <div className="text-center mt-12">
                  <Button variant="primary" size="lg">
                    <Link href="/academy">View All Student Work</Link>
                  </Button>
                </div>
              </div>
            </section>
          </SectionReveal>

          {/* CTA Section */}
          <CTASection />

          {/* Back to Top */}
          <BackToTop />
        </main>
      </div>
    </div>
  );
}

export default Main;

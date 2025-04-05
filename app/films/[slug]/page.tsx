"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react"; // Removed Suspense as skeleton handled by Provider
import Link from "next/link";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import PageTransition from "@/components/UI/PageTransition";
import SectionReveal from "@/components/UI/SectionReveal";
import { Button } from "@/components/UI/Button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Play, Share2, Award, Calendar, Clock, User, Star, ChevronRight, Link as LinkIcon, Facebook, Twitter, Mail as MailIcon, Users as UsersIcon, Tv, Radio, Film as FilmIcon, ChevronUp, X } from "lucide-react"; // Added ChevronUp, X
import { useFilm } from "@/hooks/useFilm";
import { useFilmsList } from "@/hooks/useFilmsList";
import PageViewTracker from "@/components/analytics/PageViewTracker";
import { FilmDetailSkeleton } from "@/components/skeletons/FilmDetailSkeleton";
import { formatDate } from "@/lib/utils";
import { Card, CardContent, CardImage, CardTitle } from "@/components/UI/Card"; // Use unified Card
import BackToTop from "@/components/UI/BackToTop"; // Import BackToTop

type SharePlatform = "twitter" | "facebook" | "email" | "copy";
type ActiveTab = 'about' | 'castCrew' | 'gallery' | 'availability';

// Helper styles
const sectionTitleClass = "text-2xl md:text-3xl font-bold mb-6 text-film-black-900 dark:text-white";
const iconStyleClass = "h-5 w-5 text-film-red-500 mr-3 flex-shrink-0"; // Adjusted size
const detailLabelClass = "text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1"; // Adjusted size/weight
const detailValueClass = "text-gray-800 dark:text-gray-100"; // Adjusted dark color
const shareOptionClass = "button-menu-item"; // Use global style

const FilmDetailPage = () => {
  const params = useParams();
  const slug = params?.slug as string;

  const { film, isLoading, error } = useFilm(slug);
  const { films: allFilms, isLoading: isLoadingAllFilms } = useFilmsList(); // Fetch all for related
  const [activeTab, setActiveTab] = useState<ActiveTab>('about');
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [activeGalleryImageIndex, setActiveGalleryImageIndex] = useState(0); // Use index
  const [showShareOptions, setShowShareOptions] = useState(false);

  // Calculate related films and director films
  const { relatedFilms, otherFilmsByDirector } = useMemo(() => {
    if (!film || !allFilms || allFilms.length === 0) return { relatedFilms: [], otherFilmsByDirector: [] };
    const directorFilms = allFilms.filter(f => f.director === film.director && f.id !== film.id).slice(0, 3); // Use ID for comparison
    const related = allFilms.filter(f => f.id !== film.id && f.category === film.category && !directorFilms.some(df => df.id === f.id)).slice(0, 3);
    // Fallback if not enough related in same category
    const fallbackCount = 3 - related.length;
    const fallbackRelated = fallbackCount > 0
      ? allFilms.filter(f => f.id !== film.id && f.category !== film.category && !directorFilms.some(df => df.id === f.id) && !related.some(rf => rf.id === f.id)).slice(0, fallbackCount)
      : [];
    return { relatedFilms: [...related, ...fallbackRelated], otherFilmsByDirector: directorFilms };
  }, [allFilms, film]);


  // Toggle trailer modal and lock body scroll
  const toggleTrailer = useCallback(() => setTrailerOpen(prev => !prev), []);
  useEffect(() => {
    document.body.style.overflow = trailerOpen ? "hidden" : "auto";
    return () => { document.body.style.overflow = "auto"; };
  }, [trailerOpen]);

  // Toggle share options dropdown
  const toggleShareOptions = useCallback(() => setShowShareOptions(prev => !prev), []);

  // Share functionality
  const shareFilm = useCallback((platform: SharePlatform) => { /* ... (keep existing logic) ... */ }, [film]);

  // Close share dropdown on outside click
  useEffect(() => { /* ... (keep existing logic) ... */ }, [showShareOptions]);


  // Loading State: Handled by PageSkeletonProvider via layout.tsx
  // if (isLoading) return <FilmDetailSkeleton />; // Remove this line

  // Error State
  if (error) {
    return <div className="container-custom py-40 text-center text-red-500">Error loading film details: {error}</div>;
  }
  // Not Found State (after loading and no error)
  if (!isLoading && !film) {
    notFound();
  }

  // If film data is still loading (e.g., initial SSR pass before client takes over), show skeleton
  if (!film) {
    return <FilmDetailSkeleton />;
  }

  // Prepare gallery images, ensuring fallback
  const galleryImages = film.gallery && film.gallery.length > 0 && film.gallery[0] !== "" ? film.gallery : [film.image];
  // Ensure index is valid
  const safeGalleryIndex = activeGalleryImageIndex >= 0 && activeGalleryImageIndex < galleryImages.length ? activeGalleryImageIndex : 0;


  return (
    <PageTransition>
      <PageViewTracker pageType="film" itemId={film?.id} />
      <div className="min-h-screen bg-white dark:bg-film-black-950 pt-20 pb-20"> {/* Consistent padding */}

        {/* --- Hero Section --- */}
        <div className="relative w-full h-[65vh] md:h-[80vh] overflow-hidden">
          <Image src={film.image || '/images/hero/hero_placeholder.jpg'} alt={film.title} fill className="object-cover object-center" priority onError={(e) => { e.currentTarget.src = "/images/hero/hero_placeholder.jpg"; }} />
          <div className="absolute inset-0 bg-gradient-to-t from-film-black-950 via-film-black-900/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-film-black-950/70 via-transparent to-transparent" />
          <div className="container-custom h-full flex flex-col justify-end pb-12 md:pb-16 relative z-10">
            <SectionReveal>
              <div className="max-w-4xl">
                <div className="mb-4"><Link href="/films" className="flex items-center text-white hover:text-film-red-400 transition-colors text-sm group"><ArrowLeft className="mr-1.5 h-4 w-4 group-hover:-translate-x-1 transition-transform" />Back to Films</Link></div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4">
                  <span className="inline-block px-3 py-1 bg-film-red-600 text-white text-xs font-semibold rounded-full uppercase tracking-wider">{film.category}</span>
                  <span className="text-white/90 text-sm">{film.year}</span>
                  {film.rating > 0 && <div className="flex items-center text-yellow-400"><Star className="h-4 w-4 fill-current" /><span className="ml-1 text-white/90 text-sm font-medium">{film.rating.toFixed(1)}/5</span></div>}
                </div>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-5 leading-tight shadow-text">{film.title}</h1>
                <p className="text-base md:text-lg text-white/90 max-w-3xl mb-8 line-clamp-3 leading-relaxed">{film.description}</p>
                <div className="flex flex-wrap gap-4 items-center">
                  {film.trailer && (
                    <Button variant="primary" onClick={toggleTrailer} className="group" size="lg"><Play className="mr-2 h-5 w-5 fill-current" />Watch Trailer</Button>
                  )}
                  <div className="relative share-options-container">
                    <Button variant="outline" onClick={toggleShareOptions} className="bg-transparent border-white/80 text-white/90 hover:bg-white/10 hover:border-white hover:text-white share-button" size="lg"><Share2 className="mr-2 h-5 w-5" />Share</Button>
                    <AnimatePresence>{showShareOptions && (
                      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute left-0 bottom-full mb-2 w-48 bg-white dark:bg-film-black-800 rounded-xl p-2 shadow-lg z-20 border border-border-light dark:border-border-dark">
                        <button onClick={() => shareFilm("twitter")} className={shareOptionClass}><Twitter className="h-4 w-4 mr-2 text-[#1DA1F2]" /> Twitter</button>
                        <button onClick={() => shareFilm("facebook")} className={shareOptionClass}><Facebook className="h-4 w-4 mr-2 text-[#1877F2]" /> Facebook</button>
                        <button onClick={() => shareFilm("email")} className={shareOptionClass}><MailIcon className="h-4 w-4 mr-2 text-gray-500" /> Email</button>
                        <button onClick={() => shareFilm("copy")} className={shareOptionClass}><LinkIcon className="h-4 w-4 mr-2 text-gray-500" /> Copy Link</button>
                      </motion.div>
                    )}</AnimatePresence>
                  </div>
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>

        {/* --- Content Section --- */}
        <div className="container-custom py-12 md:py-16">
          {/* Navigation tabs */}
          <div className="border-b border-border-light dark:border-border-dark mb-12 sticky top-[72px] bg-white/95 dark:bg-film-black-950/95 backdrop-blur-sm z-20">
            <nav className="flex space-x-6 md:space-x-8 overflow-x-auto scrollbar-hide">
              {(['about', 'castCrew', 'gallery', 'availability'] as ActiveTab[]).map(tab => (
                <button key={tab} className={`py-4 px-1 font-medium border-b-2 transition-colors whitespace-nowrap capitalize text-sm md:text-base ${activeTab === tab ? 'border-film-red-600 text-film-red-600 dark:border-film-red-500 dark:text-film-red-500' : 'border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white'}`} onClick={() => setActiveTab(tab)}>
                  {tab.replace('castCrew', 'Cast & Crew')}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">
            {/* Main content area */}
            <div className="lg:w-2/3">
              <AnimatePresence mode="wait">
                {/* --- About Tab --- */}
                {activeTab === 'about' && (
                  <motion.div key="about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                    <SectionReveal>
                      <div className="mb-12"><h2 className={sectionTitleClass}>Synopsis</h2><div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed"><p>{film.synopsis || "Synopsis not available."}</p></div></div>
                      {film.longDescription && <div className="mb-12 pt-8 border-t border-border-light dark:border-border-dark"><h2 className={sectionTitleClass}>About the Film</h2><div className="prose prose-lg dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 leading-relaxed"><p>{film.longDescription}</p></div></div>}
                      {film.awards && film.awards.length > 0 && film.awards[0] !== "" && (<div className="mb-12 pt-8 border-t border-border-light dark:border-border-dark"><h2 className={sectionTitleClass + " flex items-center"}><Award className={iconStyleClass} />Awards & Recognition</h2><ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300"> {film.awards.filter(a => a?.trim()).map((award, index) => (<li key={index}>{award}</li>))}</ul></div>)}
                      {film.quotes && film.quotes.length > 0 && film.quotes[0]?.text && (<div className="pt-8 border-t border-border-light dark:border-border-dark"><h2 className={sectionTitleClass}>Critical Reception</h2><div className="space-y-8">{film.quotes.filter(q => q.text?.trim()).map((quote, index) => (<blockquote key={index} className="border-l-4 border-film-red-500 pl-6 py-2 italic bg-gray-50 dark:bg-film-black-800/30 rounded-r-lg"><p className="text-lg text-gray-800 dark:text-gray-200 leading-relaxed">"{quote.text}"</p>{quote.source && <footer className="mt-3 text-right text-base text-gray-600 dark:text-gray-400 font-medium not-italic">— {quote.source}</footer>}</blockquote>))}</div></div>)}
                    </SectionReveal>
                  </motion.div>
                )}

                {/* --- Cast & Crew Tab --- */}
                {activeTab === 'castCrew' && (
                  <motion.div key="castCrew" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                    <SectionReveal>
                      <div className="mb-12">
                        <h2 className={sectionTitleClass + " flex items-center"}><UsersIcon className={iconStyleClass} />Key Creatives</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          {/* Explicitly list Director and Producer */}
                          {[
                            { role: 'Director', name: film.director },
                            { role: 'Producer', name: film.producer },
                            // Add others like Cinematographer, Editor if they exist in schema and data
                          ].filter(p => p.name?.trim()).map((person) => (
                            <div key={person.role} className="flex items-center p-4 bg-gray-50 dark:bg-film-black-800/30 rounded-xl border border-border-light dark:border-border-dark">
                              <div className="w-12 h-12 bg-film-red-100 dark:bg-film-red-900/30 rounded-full flex items-center justify-center mr-4 flex-shrink-0"><span className="text-film-red-600 dark:text-film-red-400 font-semibold text-lg">{person.name?.[0]}</span></div>
                              <div><h3 className="font-medium text-film-black-900 dark:text-white">{person.name}</h3><p className="text-sm text-gray-600 dark:text-gray-400">{person.role}</p></div>
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Cast List */}
                      {film.castCrew && film.castCrew.length > 0 && film.castCrew[0].name && (
                        <div className="mb-12 pt-8 border-t border-border-light dark:border-border-dark">
                          <h2 className={sectionTitleClass}>Cast</h2>
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {film.castCrew.filter(p => p.name?.trim()).map((person, index) => (
                              <div key={index} className="text-center p-4 bg-gray-50 dark:bg-film-black-800/30 rounded-xl border border-border-light dark:border-border-dark">
                                <div className="w-16 h-16 bg-gray-200 dark:bg-film-black-700 rounded-full flex items-center justify-center mx-auto mb-3"><span className="text-gray-600 dark:text-gray-400 font-medium text-xl">{person.name?.[0]}</span></div>
                                <h3 className="font-medium text-film-black-900 dark:text-white text-sm">{person.name}</h3>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{person.role}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      {/* Film Details (Combined with Cast/Crew) */}
                      <div className="mb-10 pt-8 border-t border-border-light dark:border-border-dark">
                        <h2 className={sectionTitleClass + " flex items-center"}><FilmIcon className={iconStyleClass} />Film Details</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-10">
                          <div><h3 className={detailLabelClass}>Runtime</h3><p className={detailValueClass}>{film.duration || 'N/A'}</p></div>
                          <div><h3 className={detailLabelClass}>Release Date</h3><p className={detailValueClass}>{film.releaseDate ? formatDate(film.releaseDate) : 'N/A'}</p></div>
                          <div><h3 className={detailLabelClass}>Languages</h3><p className={detailValueClass}>{film.languages?.filter(l => l).join(', ') || 'N/A'}</p></div>
                          <div><h3 className={detailLabelClass}>Subtitles</h3><p className={detailValueClass}>{film.subtitles?.filter(s => s).join(', ') || 'N/A'}</p></div>
                        </div>
                      </div>
                    </SectionReveal>
                  </motion.div>
                )}

                {/* --- Gallery Tab --- */}
                {activeTab === 'gallery' && (
                  <motion.div key="gallery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="space-y-8">
                    <SectionReveal>
                      <h2 className={sectionTitleClass}>Gallery</h2>
                      {galleryImages.length > 0 ? (
                        <>
                          <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg mb-4 border border-border-light dark:border-border-dark">
                            <AnimatePresence mode="wait">
                              <motion.div key={safeGalleryIndex} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }}>
                                <Image src={galleryImages[safeGalleryIndex] || '/images/hero/hero_placeholder.jpg'} alt={`${film.title} - Gallery image ${safeGalleryIndex + 1}`} fill className="object-cover" onError={(e) => { e.currentTarget.src = "/images/hero/hero_placeholder.jpg"; }} />
                              </motion.div>
                            </AnimatePresence>
                          </div>
                          {galleryImages.length > 1 && (
                            <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-hide">
                              {galleryImages.map((image, index) => (
                                <button key={index} onClick={() => setActiveGalleryImageIndex(index)} className={`relative w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 overflow-hidden rounded-lg transition-all flex-shrink-0 border-2 ${safeGalleryIndex === index ? 'border-film-red-500 opacity-100 scale-105' : 'border-transparent opacity-60 hover:opacity-100 hover:border-film-red-500/50'}`}>
                                  <Image src={image || '/images/hero/hero_placeholder.jpg'} alt={`Thumbnail ${index + 1}`} fill className="object-cover" onError={(e) => { e.currentTarget.src = "/images/hero/hero_placeholder.jpg"; }} />
                                </button>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="text-gray-600 dark:text-gray-400">No gallery images available for this film.</p>
                      )}
                    </SectionReveal>
                  </motion.div>
                )}

                {/* --- Availability Tab --- */}
                {activeTab === 'availability' && (
                  <motion.div key="availability" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                    <SectionReveal>
                      <h2 className={sectionTitleClass + " flex items-center"}><Tv className={iconStyleClass} />Where to Watch</h2>
                      <div className="space-y-6">
                        {/* Example: Replace with dynamic data if available */}
                        <div className="p-6 bg-gray-50 dark:bg-film-black-800/30 rounded-xl border border-border-light dark:border-border-dark">
                          <h3 className="text-xl font-semibold mb-3 text-film-black-900 dark:text-white flex items-center"><FilmIcon className="h-5 w-5 mr-2 text-blue-500" /> Film Festivals</h3>
                          <p className="text-gray-700 dark:text-gray-300 mb-4">Check festival websites for screening times and locations.</p>
                          <Button variant="secondary" size="sm" disabled>Festival Details Unavailable</Button> {/* Example disabled state */}
                        </div>
                        <div className="p-6 bg-gray-50 dark:bg-film-black-800/30 rounded-xl border border-border-light dark:border-border-dark">
                          <h3 className="text-xl font-semibold mb-3 text-film-black-900 dark:text-white flex items-center"><Radio className="h-5 w-5 mr-2 text-green-500" /> Streaming Platforms</h3>
                          <p className="text-gray-700 dark:text-gray-300 mb-4">Currently unavailable on major streaming platforms. Sign up for updates!</p>
                          <Button variant="secondary" size="sm"><Link href="/#newsletter">Get Notified</Link></Button> {/* Link to newsletter */}
                        </div>
                      </div>
                    </SectionReveal>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* --- Sidebar --- */}
            <aside className="lg:w-1/3">
              <div className="lg:sticky lg:top-28 space-y-8">
                <SectionReveal delay={0.2} direction="right">
                  {/* Film Info Card */}
                  <div className="bg-white dark:bg-film-black-900 rounded-xl shadow-lg p-6 border border-border-light dark:border-border-dark">
                    <h3 className="text-lg font-bold mb-5 text-film-black-900 dark:text-white border-b border-border-light dark:border-border-dark pb-3">Quick Info</h3>
                    <ul className="space-y-4 text-sm">
                      <li className="flex items-center"><Calendar className={iconStyleClass + " !h-4 !w-4"} /><div><span className={detailLabelClass}>Release:</span> <span className={detailValueClass}>{film.releaseDate ? formatDate(film.releaseDate) : 'TBA'}</span></div></li>
                      <li className="flex items-center"><Clock className={iconStyleClass + " !h-4 !w-4"} /><div><span className={detailLabelClass}>Runtime:</span> <span className={detailValueClass}>{film.duration || 'N/A'}</span></div></li>
                      <li className="flex items-center"><User className={iconStyleClass + " !h-4 !w-4"} /><div><span className={detailLabelClass}>Director:</span> <span className={detailValueClass}>{film.director}</span></div></li>
                      <li className="flex items-center"><UsersIcon className={iconStyleClass + " !h-4 !w-4"} /><div><span className={detailLabelClass}>Producer:</span> <span className={detailValueClass}>{film.producer}</span></div></li>
                    </ul>
                    <Button variant="primary" className="w-full mt-6 text-sm" onClick={() => setActiveTab('availability')}>Where to Watch</Button>
                  </div>

                  {/* More From Director Card */}
                  {otherFilmsByDirector.length > 0 && (
                    <div className="bg-white dark:bg-film-black-900 rounded-xl shadow-sm p-6 border border-border-light dark:border-border-dark">
                      <h3 className="text-lg font-bold mb-4 text-film-black-900 dark:text-white">More from {film.director}</h3>
                      <div className="space-y-4">
                        {otherFilmsByDirector.map((relatedFilm) => (
                          <Link href={`/films/${relatedFilm.slug}`} key={relatedFilm.id} className="flex gap-3 group items-center">
                            <div className="relative h-14 w-20 rounded-md overflow-hidden flex-shrink-0 border border-border-light dark:border-border-dark"><Image src={relatedFilm.image || '/images/hero/hero_placeholder.jpg'} alt={relatedFilm.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" onError={(e) => { e.currentTarget.src = "/images/hero/hero_placeholder.jpg"; }} /></div>
                            <div className="flex-1"><h4 className="font-medium text-xs text-film-black-900 dark:text-white group-hover:text-film-red-500 transition-colors line-clamp-2">{relatedFilm.title}</h4><p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{relatedFilm.year}</p></div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </SectionReveal>
              </div>
            </aside>
          </div>
        </div>

        {/* --- Related Films Section --- */}
        {relatedFilms.length > 0 && (
          <div className="bg-gray-50 dark:bg-film-black-900 py-16 md:py-20 mt-16">
            <div className="container-custom">
              <SectionReveal>
                <h2 className={sectionTitleClass}>You Might Also Like</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {relatedFilms.map((relatedFilm, index) => (
                    <motion.div key={relatedFilm.id} whileHover={{ y: -8 }} transition={{ type: "spring", stiffness: 300, delay: index * 0.05 }}>
                      <Link href={`/films/${relatedFilm.slug}`} className="block h-full">
                        <Card className="h-full flex flex-col group bg-white dark:bg-film-black-950 border border-border-light dark:border-border-dark shadow-sm hover:shadow-lg transition-shadow duration-300">
                          <div className="relative aspect-video overflow-hidden rounded-t-xl">
                            <CardImage src={relatedFilm.image || '/images/hero/hero_placeholder.jpg'} alt={relatedFilm.title} overlay={true} />
                            <div className="absolute top-2 left-2 px-2 py-0.5 bg-black/60 text-white text-xs rounded backdrop-blur-sm">{relatedFilm.category}</div>
                          </div>
                          <CardContent className="p-5 flex-grow flex flex-col">
                            <CardTitle className="group-hover:text-film-red-500 transition-colors mb-2 text-base line-clamp-1 flex-grow">{relatedFilm.title}</CardTitle>
                            <div className="flex justify-between items-center mt-3 text-sm">
                              <span className="text-gray-500 dark:text-gray-400">{relatedFilm.year}</span>
                              {relatedFilm.rating > 0 && <div className="flex items-center text-amber-500"><Star className="h-4 w-4 fill-current" /><span className="ml-1 text-gray-700 dark:text-gray-200">{relatedFilm.rating.toFixed(1)}</span></div>}
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </SectionReveal>
            </div>
          </div>
        )}

        {/* --- Trailer Modal --- */}
        <AnimatePresence>
          {trailerOpen && film.trailer && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4 backdrop-blur-sm" onClick={toggleTrailer}>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-black rounded-xl overflow-hidden w-full max-w-4xl shadow-2xl border border-film-black-700" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-3 bg-film-black-900 border-b border-film-black-800"><h3 className="text-base font-medium text-white truncate">{film.title} - Trailer</h3><button onClick={toggleTrailer} className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-film-black-700"><X className="h-5 w-5" /></button></div>
                <div className="relative aspect-video">
                  {/* Basic Iframe Embed - Needs logic to parse YouTube/Vimeo IDs */}
                  <iframe
                    width="100%" height="100%"
                    src={`https://www.youtube.com/embed/${film.trailer.split('v=')[1]?.split('&')[0] || film.trailer.split('/').pop()}?autoplay=1&rel=0`} // Example YouTube ID extraction
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen>
                  </iframe>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <BackToTop />
      </div>
    </PageTransition>
  );
};

export default FilmDetailPage;

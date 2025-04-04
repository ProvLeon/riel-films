"use client";
import React, { useState, useEffect, useCallback, Suspense, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import PageTransition from "@/components/UI/PageTransition";
import SectionReveal from "@/components/UI/SectionReveal";
import { Button } from "@/components/UI/Button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Play, Share2, Award, Calendar, Clock, User, ChevronDown, Star, ChevronRight, Link as LinkIcon, Facebook, Twitter, Mail as MailIcon, Users as UsersIcon, Tv, Radio, Film as FilmIcon } from "lucide-react"; // Added FilmIcon
import { useFilm } from "@/hooks/useFilm";
import { useFilmsList } from "@/hooks/useFilmsList";
import { Film } from "@/types/mongodbSchema";
import PageViewTracker from "@/components/analytics/PageViewTracker";
import { FilmDetailSkeleton } from "@/components/skeletons/FilmDetailSkeleton"; // Ensure correct path
import { formatDate } from "@/lib/utils"; // Import formatDate
import { Card, CardContent } from "@/components/UI/Card";

type SharePlatform = "twitter" | "facebook" | "email" | "copy";
type ActiveTab = 'about' | 'castCrew' | 'gallery' | 'availability'; // Added Availability

// Helper styles (can be moved to CSS/globals)
const sectionTitleClass = "text-2xl md:text-3xl font-bold mb-6 text-film-black-900 dark:text-white";
const iconStyleClass = "h-6 w-6 text-film-red-500 mr-3 flex-shrink-0";
const detailLabelClass = "text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1";
const detailValueClass = "text-gray-900 dark:text-gray-100";
const shareOptionClass = "flex items-center w-full px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-film-black-700 rounded-md";

const FilmDetailPage = () => {
  const params = useParams();
  const slug = params?.slug as string;

  const { film, isLoading, error } = useFilm(slug);
  const { films: allFilms } = useFilmsList();
  const [activeTab, setActiveTab] = useState<ActiveTab>('about');
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [activeGalleryImage, setActiveGalleryImage] = useState(0);
  const [showShareOptions, setShowShareOptions] = useState(false);

  const { relatedFilms, otherFilmsByDirector } = useMemo(() => {
    if (!film || !allFilms || allFilms.length === 0) return { relatedFilms: [], otherFilmsByDirector: [] };
    const directorFilms = allFilms.filter(f => f.director === film.director && f.slug !== slug).slice(0, 2);
    const related = allFilms.filter(f => f.slug !== slug && f.category === film.category).slice(0, 3);
    const fallbackRelated = allFilms.filter(f => f.slug !== slug && f.category !== film.category).slice(0, 3 - related.length);
    return { relatedFilms: [...related, ...fallbackRelated], otherFilmsByDirector: directorFilms };
  }, [allFilms, film, slug]);

  useEffect(() => { if (trailerOpen) { document.body.style.overflow = "hidden"; } else { document.body.style.overflow = "auto"; } return () => { document.body.style.overflow = "auto"; }; }, [trailerOpen]);
  const toggleTrailer = useCallback(() => setTrailerOpen(prev => !prev), []);
  const toggleShareOptions = useCallback(() => setShowShareOptions(prev => !prev), []);

  const shareFilm = useCallback((platform: SharePlatform) => {
    if (!film) return;
    const url = window.location.href;
    const text = `Check out "${film.title}" from Riel Films: `;
    let shareUrl = '';
    switch (platform) {
      case "twitter": shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`; break;
      case "facebook": shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`; break;
      case "email": shareUrl = `mailto:?subject=${encodeURIComponent(film.title)}&body=${encodeURIComponent(text + url)}`; break;
      case "copy": navigator.clipboard.writeText(url).then(() => alert("Link copied!")); break;
    }
    if (shareUrl) window.open(shareUrl, '_blank');
    setShowShareOptions(false);
  }, [film]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => { /* ... (same as before) ... */ };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showShareOptions]);

  if (isLoading) return <FilmDetailSkeleton />;
  if (error || !film) notFound();

  const galleryImages = film.gallery && film.gallery.length > 0 ? film.gallery : [film.image];
  const safeGalleryIndex = activeGalleryImage < galleryImages.length ? activeGalleryImage : 0;

  return (
    <PageTransition>
      <PageViewTracker pageType="film" itemId={film?.id} />
      <div className="min-h-screen bg-white dark:bg-film-black-950 pt-20 pb-20">

        {/* --- Hero Section --- */}
        <div className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden">
          <Image src={film.image} alt={film.title} fill className="object-cover object-center" priority onError={(e) => { e.currentTarget.src = "/images/hero/hero_placeholder.jpg"; }} />
          <div className="absolute inset-0 bg-gradient-to-t from-film-black-950 via-film-black-900/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-film-black-950/60 to-transparent" />
          <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-12 relative z-10">
            <SectionReveal>
              <div className="max-w-4xl">
                {/* ... (Hero content: back link, category, year, rating, title, description, buttons) ... */}
                <div className="flex items-center mb-4">
                  <Link href="/films" className="flex items-center text-white hover:text-film-red-400 transition-colors text-sm"><ArrowLeft className="mr-2 h-4 w-4" />Back to Films</Link>
                </div>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className="inline-block px-3 py-1 bg-film-red-600 text-white text-sm font-medium rounded-full">{film.category}</span>
                  <span className="text-white/90 text-sm">{film.year}</span>
                  {film.rating > 0 && <div className="flex items-center text-yellow-400"><Star className="h-4 w-4 fill-current" /><span className="ml-1 text-white/90 text-sm">{film.rating.toFixed(1)}/5</span></div>}
                </div>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6">{film.title}</h1>
                <p className="text-lg md:text-xl text-white/90 max-w-3xl mb-8 line-clamp-3">{film.description}</p>
                <div className="flex flex-wrap gap-4 items-center">
                  {film.trailer && (
                    <Button variant="primary" onClick={toggleTrailer} className="group" size="lg"><Play className="mr-2 h-5 w-5 fill-current" />Watch Trailer</Button>
                  )}
                  <div className="relative share-options-container">
                    <Button variant="outline" onClick={toggleShareOptions} className="bg-transparent border-white text-white hover:bg-white/10 share-button" size="lg"><Share2 className="mr-2 h-5 w-5" />Share</Button>
                    <AnimatePresence>
                      {showShareOptions && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="absolute left-0 bottom-full mb-2 w-48 bg-white dark:bg-film-black-800 rounded-xl p-2 shadow-lg z-20 border border-gray-200 dark:border-film-black-700">
                          <button onClick={() => shareFilm("twitter")} className={shareOptionClass}><Twitter className="h-4 w-4 mr-2 text-[#1DA1F2]" /> Twitter</button>
                          <button onClick={() => shareFilm("facebook")} className={shareOptionClass}><Facebook className="h-4 w-4 mr-2 text-[#1877F2]" /> Facebook</button>
                          <button onClick={() => shareFilm("email")} className={shareOptionClass}><MailIcon className="h-4 w-4 mr-2 text-gray-500" /> Email</button>
                          <button onClick={() => shareFilm("copy")} className={shareOptionClass}><LinkIcon className="h-4 w-4 mr-2 text-gray-500" /> Copy Link</button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>

        {/* --- Content Section --- */}
        <div className="container mx-auto px-4 py-12">
          {/* Navigation tabs */}
          <div className="border-b border-gray-200 dark:border-film-black-800 mb-12 sticky top-[72px] bg-white dark:bg-film-black-950 z-20"> {/* Sticky tabs */}
            <nav className="flex space-x-8 overflow-x-auto scrollbar-hide">
              {(['about', 'castCrew', 'gallery', 'availability'] as ActiveTab[]).map(tab => (
                <button key={tab} className={`py-4 px-2 font-medium border-b-2 transition-colors whitespace-nowrap capitalize ${activeTab === tab ? 'border-film-red-600 text-film-red-600 dark:border-film-red-500 dark:text-film-red-500' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`} onClick={() => setActiveTab(tab)}>
                  {tab.replace('castCrew', 'Cast & Crew')}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main content area */}
            <div className="lg:w-2/3">
              <AnimatePresence mode="wait">
                {/* --- About Tab --- */}
                {activeTab === 'about' && (
                  <motion.div key="about" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                    <SectionReveal>
                      <div className="mb-10"><h2 className={sectionTitleClass}>Synopsis</h2><div className="prose prose-lg dark:prose-invert max-w-none"><p>{film.synopsis || "Synopsis not available."}</p></div></div>
                      {film.longDescription && <div className="mb-10 pt-8 border-t border-gray-200 dark:border-film-black-800"><h2 className={sectionTitleClass}>About the Film</h2><div className="prose prose-lg dark:prose-invert max-w-none"><p>{film.longDescription}</p></div></div>}
                      {film.awards && film.awards.length > 0 && film.awards[0] !== "" && (<div className="mb-10 pt-8 border-t border-gray-200 dark:border-film-black-800"><h2 className={sectionTitleClass + " flex items-center"}><Award className={iconStyleClass} />Awards & Recognition</h2><ul className="list-disc pl-6 space-y-2 text-gray-800 dark:text-gray-200"> {film.awards.filter(a => a?.trim()).map((award, index) => (<li key={index}>{award}</li>))}</ul></div>)}
                      {film.quotes && film.quotes.length > 0 && film.quotes[0]?.text && (<div className="pt-8 border-t border-gray-200 dark:border-film-black-800"><h2 className={sectionTitleClass}>Critical Reception</h2><div className="space-y-6">{film.quotes.filter(q => q.text?.trim()).map((quote, index) => (<blockquote key={index} className="border-l-4 border-film-red-500 pl-6 py-2 italic"><p className="text-lg text-gray-800 dark:text-gray-200">"{quote.text}"</p>{quote.source && <footer className="mt-2 text-right text-gray-600 dark:text-gray-400 not-italic">— {quote.source}</footer>}</blockquote>))}</div></div>)}
                    </SectionReveal>
                  </motion.div>
                )}

                {/* --- Cast & Crew Tab --- */}
                {activeTab === 'castCrew' && (
                  <motion.div key="castCrew" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                    <SectionReveal>
                      <div className="mb-10">
                        <h2 className={sectionTitleClass + " flex items-center"}><UsersIcon className={iconStyleClass} />Cast & Crew</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Add Director and Producer first */}
                          <div className="flex items-center p-4 bg-gray-50 dark:bg-film-black-900 rounded-lg border border-gray-100 dark:border-film-black-800"><div className="w-12 h-12 bg-film-red-100 dark:bg-film-red-900/30 rounded-full flex items-center justify-center mr-4 flex-shrink-0"><span className="text-film-red-600 dark:text-film-red-400 font-medium">{film.director?.[0]}</span></div><div><h3 className="font-medium text-film-black-900 dark:text-white">{film.director}</h3><p className="text-sm text-gray-600 dark:text-gray-400">Director</p></div></div>
                          <div className="flex items-center p-4 bg-gray-50 dark:bg-film-black-900 rounded-lg border border-gray-100 dark:border-film-black-800"><div className="w-12 h-12 bg-film-red-100 dark:bg-film-red-900/30 rounded-full flex items-center justify-center mr-4 flex-shrink-0"><span className="text-film-red-600 dark:text-film-red-400 font-medium">{film.producer?.[0]}</span></div><div><h3 className="font-medium text-film-black-900 dark:text-white">{film.producer}</h3><p className="text-sm text-gray-600 dark:text-gray-400">Producer</p></div></div>
                          {/* Then map the castCrew array */}
                          {film.castCrew?.filter(p => p.name?.trim()).map((person, index) => (
                            <div key={index} className="flex items-center p-4 bg-gray-50 dark:bg-film-black-900 rounded-lg border border-gray-100 dark:border-film-black-800"><div className="w-12 h-12 bg-gray-200 dark:bg-film-black-800 rounded-full flex items-center justify-center mr-4 flex-shrink-0"><span className="text-gray-600 dark:text-gray-400 font-medium">{person.name?.[0]}</span></div><div><h3 className="font-medium text-film-black-900 dark:text-white">{person.name}</h3><p className="text-sm text-gray-600 dark:text-gray-400">{person.role}</p></div></div>
                          ))}
                        </div>
                      </div>
                      {/* Film Details */}
                      <div className="mb-10 pt-8 border-t border-gray-200 dark:border-film-black-800">
                        <h2 className={sectionTitleClass + " flex items-center"}><FilmIcon className={iconStyleClass} />Film Details</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-16">
                          <div><h3 className={detailLabelClass}>Runtime</h3><p className={detailValueClass}>{film.duration || 'N/A'}</p></div>
                          <div><h3 className={detailLabelClass}>Release Date</h3><p className={detailValueClass}>{film.releaseDate ? formatDate(film.releaseDate) : 'N/A'}</p></div>
                          <div><h3 className={detailLabelClass}>Languages</h3><p className={detailValueClass}>{film.languages?.join(', ') || 'N/A'}</p></div>
                          <div><h3 className={detailLabelClass}>Subtitles</h3><p className={detailValueClass}>{film.subtitles?.join(', ') || 'N/A'}</p></div>
                        </div>
                      </div>
                    </SectionReveal>
                  </motion.div>
                )}

                {/* --- Gallery Tab --- */}
                {activeTab === 'gallery' && (
                  <motion.div key="gallery" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="space-y-8">
                    <SectionReveal>
                      <h2 className={sectionTitleClass}>Gallery</h2>
                      {galleryImages.length > 0 ? (
                        <>
                          <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-lg mb-4">
                            <Image src={galleryImages[safeGalleryIndex]} alt={`${film.title} - Gallery image ${safeGalleryIndex + 1}`} fill className="object-cover" onError={(e) => { e.currentTarget.src = "/images/hero/hero_placeholder.jpg"; }} />
                          </div>
                          {galleryImages.length > 1 && (
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                              {galleryImages.map((image, index) => (
                                <button key={index} onClick={() => setActiveGalleryImage(index)} className={`relative w-20 h-20 md:w-24 md:h-24 overflow-hidden rounded-lg transition-all flex-shrink-0 ${safeGalleryIndex === index ? 'ring-4 ring-film-red-500 opacity-100' : 'opacity-60 hover:opacity-100'}`}>
                                  <Image src={image} alt={`Thumbnail ${index + 1}`} fill className="object-cover" onError={(e) => { e.currentTarget.src = "/images/hero/hero_placeholder.jpg"; }} />
                                </button>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="text-gray-600 dark:text-gray-400">No gallery images available for this film.</p>
                      )}
                      {/* Placeholder Behind the Scenes */}
                      <div className="mt-12 pt-8 border-t border-gray-200 dark:border-film-black-800"><h2 className={sectionTitleClass}>Behind the Scenes</h2><div className="prose prose-lg dark:prose-invert mb-6"><p>Explore exclusive moments from the making of {film.title}.</p></div><div className="grid grid-cols-1 md:grid-cols-2 gap-4"><div className="relative aspect-video overflow-hidden rounded-lg"><Image src="/images/hero/hero10.jpg" alt="Behind the scenes 1" fill className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4"><p className="text-white text-sm">Camera setup</p></div></div><div className="relative aspect-video overflow-hidden rounded-lg"><Image src="/images/hero/hero11.jpg" alt="Behind the scenes 2" fill className="object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4"><p className="text-white text-sm">Director and crew</p></div></div></div></div>
                    </SectionReveal>
                  </motion.div>
                )}

                {/* --- Availability Tab --- */}
                {activeTab === 'availability' && (
                  <motion.div key="availability" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                    <SectionReveal>
                      <h2 className={sectionTitleClass + " flex items-center"}><Tv className={iconStyleClass} />Where to Watch</h2>
                      <div className="space-y-8">
                        {/* Placeholder Availability Info */}
                        <div className="p-6 bg-gray-50 dark:bg-film-black-900 rounded-lg border border-gray-100 dark:border-film-black-800">
                          <h3 className="text-xl font-semibold mb-3 text-film-black-900 dark:text-white flex items-center"><FilmIcon className="h-5 w-5 mr-2 text-blue-500" />Film Festivals</h3>
                          <p className="text-gray-700 dark:text-gray-300 mb-4">Currently screening at select international film festivals. Check festival schedules for details.</p>
                          <Button variant="secondary" size="sm">Find Festival Screenings</Button>
                        </div>
                        <div className="p-6 bg-gray-50 dark:bg-film-black-900 rounded-lg border border-gray-100 dark:border-film-black-800">
                          <h3 className="text-xl font-semibold mb-3 text-film-black-900 dark:text-white flex items-center"><Radio className="h-5 w-5 mr-2 text-green-500" />Streaming Platforms</h3>
                          <p className="text-gray-700 dark:text-gray-300 mb-4">Coming soon to major streaming platforms. Subscribe to our newsletter for release date announcements.</p>
                          <Button variant="secondary" size="sm">Get Notified</Button>
                        </div>
                        <div className="p-6 bg-gray-50 dark:bg-film-black-900 rounded-lg border border-gray-100 dark:border-film-black-800">
                          <h3 className="text-xl font-semibold mb-3 text-film-black-900 dark:text-white flex items-center"><UsersIcon className="h-5 w-5 mr-2 text-purple-500" />Community Screenings</h3>
                          <p className="text-gray-700 dark:text-gray-300 mb-4">Interested in hosting a community or educational screening? Contact us for licensing information.</p>
                          <Button variant="secondary" size="sm">Request a Screening</Button>
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
                  <div className="bg-white dark:bg-film-black-900 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-film-black-800">
                    <h3 className="text-xl font-bold mb-5 text-film-black-900 dark:text-white border-b border-gray-200 dark:border-film-black-700 pb-3">Film Information</h3>
                    <ul className="space-y-4 text-sm">
                      <li className="flex items-center"><Calendar className="icon-style text-sm" /><div><span className="detail-label-sm">Release Date:</span> <span className={detailValueClass}>{film.releaseDate ? formatDate(film.releaseDate) : 'TBA'}</span></div></li>
                      <li className="flex items-center"><Clock className="icon-style text-sm" /><div><span className="detail-label-sm">Runtime:</span> <span className={detailValueClass}>{film.duration || 'N/A'}</span></div></li>
                      <li className="flex items-center"><User className="icon-style text-sm" /><div><span className="detail-label-sm">Director:</span> <span className={detailValueClass}>{film.director}</span></div></li>
                      <li className="flex items-center"><UsersIcon className="icon-style text-sm" /><div><span className="detail-label-sm">Producer:</span> <span className={detailValueClass}>{film.producer}</span></div></li>
                      <li className="flex items-center"><svg className={iconStyleClass + " w-5 h-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg><div><span className="detail-label-sm">Languages:</span> <span className={detailValueClass}>{film.languages?.join(', ') || 'N/A'}</span></div></li>
                      <li className="flex items-center"><svg className={iconStyleClass + " w-5 h-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 11a5 5 0 01-5 5h-1a5 5 0 01-5-5V7a5 5 0 015-5h1a5 5 0 015 5v4zm-6 0a1 1 0 10-2 0 1 1 0 002 0zm4 0a1 1 0 10-2 0 1 1 0 002 0z" /></svg><div><span className="detail-label-sm">Subtitles:</span> <span className={detailValueClass}>{film.subtitles?.join(', ') || 'N/A'}</span></div></li>
                    </ul>
                    <Button variant="primary" className="w-full mt-6" onClick={() => setActiveTab('availability')}>Find Where to Watch</Button>
                  </div>

                  {/* More From Director Card */}
                  {otherFilmsByDirector.length > 0 && (
                    <div className="bg-white dark:bg-film-black-900 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-film-black-800 mt-8">
                      <h3 className="text-xl font-bold mb-4 text-film-black-900 dark:text-white">More from {film.director}</h3>
                      <div className="space-y-4">
                        {otherFilmsByDirector.map((relatedFilm) => (
                          <Link href={`/films/${relatedFilm.slug}`} key={relatedFilm.slug} className="flex gap-4 group items-center">
                            <div className="relative h-16 w-24 rounded-lg overflow-hidden flex-shrink-0"><Image src={relatedFilm.image} alt={relatedFilm.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" onError={(e) => { e.currentTarget.src = "/images/hero/hero_placeholder.jpg"; }} /></div>
                            <div><h4 className="font-medium text-sm text-film-black-900 dark:text-white group-hover:text-film-red-600 dark:group-hover:text-film-red-500 transition-colors">{relatedFilm.title}</h4><p className="text-xs text-gray-600 dark:text-gray-400">{relatedFilm.year} • {relatedFilm.category}</p></div>
                          </Link>
                        ))}
                      </div>
                      <div className="mt-5 pt-4 border-t border-gray-200 dark:border-film-black-800">
                        <Link href={`/films?director=${film.director}`} className="text-film-red-600 dark:text-film-red-500 hover:underline flex items-center text-sm">View all by director<ChevronRight className="ml-1 h-4 w-4" /></Link>
                      </div>
                    </div>
                  )}
                </SectionReveal>
              </div>
            </aside>
          </div>
        </div>

        {/* --- Related Films Section --- */}
        <div className="bg-gray-50 dark:bg-film-black-900 py-16 mt-12">
          <div className="container mx-auto px-4">
            <SectionReveal>
              <h2 className={sectionTitleClass}>You Might Also Like</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedFilms.map((relatedFilm) => (
                  <motion.div key={relatedFilm.slug} whileHover={{ y: -8 }} transition={{ type: "spring", stiffness: 300 }}>
                    <Link href={`/films/${relatedFilm.slug}`} className="block h-full">
                      <Card className="h-full flex flex-col group bg-white dark:bg-film-black-950 border border-gray-100 dark:border-film-black-800 shadow-sm hover:shadow-lg transition-shadow">
                        <div className="relative aspect-video overflow-hidden">
                          <Image src={relatedFilm.image} alt={relatedFilm.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" onError={(e) => { e.currentTarget.src = "/images/hero/hero_placeholder.jpg"; }} />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                          <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded">{relatedFilm.category}</div>
                        </div>
                        <CardContent className="p-4 flex-grow flex flex-col">
                          <h3 className="font-medium text-film-black-900 dark:text-white group-hover:text-film-red-600 dark:group-hover:text-film-red-500 transition-colors flex-grow">{relatedFilm.title}</h3>
                          <div className="flex justify-between items-center mt-3 text-sm">
                            <span className="text-gray-600 dark:text-gray-400">{relatedFilm.year}</span>
                            {relatedFilm.rating > 0 && <div className="flex items-center text-yellow-500"><Star className="h-4 w-4 fill-current" /><span className="ml-1 text-gray-900 dark:text-gray-200">{relatedFilm.rating.toFixed(1)}</span></div>}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
              {allFilms.length > 4 && ( // Show "View All" only if there are more films
                <div className="mt-10 text-center"><Button variant="secondary"><Link href="/films">View All Films</Link></Button></div>
              )}
            </SectionReveal>
          </div>
        </div>

        {/* --- Trailer Modal --- */}
        <AnimatePresence>
          {trailerOpen && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={toggleTrailer}>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-film-black-900 rounded-xl overflow-hidden w-full max-w-4xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-film-black-800"><h3 className="text-lg font-bold text-white">{film.title} - Trailer</h3><button onClick={toggleTrailer} className="text-gray-400 hover:text-white"><X className="h-6 w-6" /></button></div>
                <div className="relative aspect-video bg-black">
                  {/* Embed YouTube/Vimeo Player Here */}
                  {/* Example Placeholder */}
                  <div className="flex items-center justify-center h-full p-4 text-center">
                    <div className="max-w-lg">
                      <Play className="h-16 w-16 text-film-red-500 mx-auto mb-4 opacity-50" />
                      <p className="text-gray-300">Video player embed for trailer URL: {film.trailer}</p>
                      {/* Add iframe or video component based on film.trailer URL */}
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

// Add shared styles if not global
const styles = `
  .section-title { @apply text-2xl md:text-3xl font-bold mb-6 text-film-black-900 dark:text-white; }
  .icon-style { @apply h-5 w-5 text-film-red-500 mr-3 flex-shrink-0; }
  .detail-label-sm { @apply text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide; }
  .share-option { @apply flex items-center w-full px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-film-black-700 rounded-md; }
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
`;
if (typeof window !== 'undefined') { const styleSheet = document.createElement("style"); styleSheet.innerText = styles; document.head.appendChild(styleSheet); }

export default FilmDetailPage;

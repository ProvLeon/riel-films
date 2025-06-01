"use client";
import React, { useState, useEffect, useCallback, Suspense, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft, Share2, BookmarkPlus, Calendar, Clock, Tag, User, Bookmark, ChevronUp, ChevronRight, Link as LinkIcon, Facebook, Twitter, Mail as MailIcon } from "lucide-react"; // Import icons
import PageTransition from "@/components/UI/PageTransition";
import SectionReveal from "@/components/UI/SectionReveal";
import { Button } from "@/components/UI/Button";
import { motion, AnimatePresence } from "framer-motion";
import { useStory } from "@/hooks/useStory"; // Import useStory
import { useStoriesList } from "@/hooks/useStoriesList"; // Import useStoriesList
import { StoryDetailSkeleton } from "@/components/skeletons/StoryDetailSkeleton"; // Import skeleton
import { formatDate } from "@/lib/utils"; // Import formatDate
import { Story } from "@/types/mongodbSchema"; // Import Story type

type SharePlatform = "twitter" | "facebook" | "email" | "copy";

// Helper styles (can be moved to CSS/globals)
const sectionTitleClass = "text-2xl md:text-3xl font-bold mt-10 mb-6 text-film-black-900 dark:text-white";
const proseStyle = "prose prose-lg dark:prose-invert max-w-none prose-headings:font-heading prose-headings:text-film-black-900 dark:prose-headings:text-white prose-a:text-film-red-600 hover:prose-a:text-film-red-700 dark:prose-a:text-film-red-500 dark:hover:prose-a:text-film-red-400";
const shareOptionClass = "flex items-center w-full px-3 py-2 text-sm text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-film-black-700 rounded-md";

const StoryPage = () => {
  const params = useParams();
  const slug = params?.slug as string;

  const { story, isLoading, error } = useStory(slug);
  const { stories: allStories } = useStoriesList(); // Fetch all for related
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll progress and scroll-to-top visibility logic
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight; // Use documentElement for accuracy
      const scrolled = window.scrollY;
      const progress = fullHeight > windowHeight ? (scrolled / (fullHeight - windowHeight)) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress))); // Clamp between 0 and 100
      setShowScrollTop(scrolled > windowHeight * 0.5); // Show after scrolling half screen height
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Related stories calculation
  const relatedStories = useMemo(() => {
    if (!story || !allStories || allStories.length === 0) return [];
    return allStories.filter(s => s.category === story.category && s.slug !== slug).slice(0, 3);
  }, [allStories, story, slug]);

  // Toggle bookmark state (implement actual saving logic if needed)
  const toggleBookmark = useCallback(() => setIsBookmarked(prev => !prev), []);
  const toggleShareOptions = useCallback(() => setShowShareOptions(prev => !prev), []);

  // Share logic (same as film detail page)
  const shareStory = useCallback((platform: SharePlatform) => {
    if (!story) return;
    const url = window.location.href; const text = `Check out this story: ${story.title}`;
    let shareUrl = '';
    switch (platform) {
      case "twitter": shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`; break;
      case "facebook": shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`; break;
      case "email": shareUrl = `mailto:?subject=${encodeURIComponent(story.title)}&body=${encodeURIComponent(text + url)}`; break;
      case "copy": navigator.clipboard.writeText(url).then(() => alert("Link copied!")); break;
    }
    if (shareUrl) window.open(shareUrl, '_blank');
    setShowShareOptions(false);
  }, [story]);

  // Close share options on outside click (same as film detail page)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showShareOptions && !target.closest('.share-options-container') && !target.closest('.share-button')) {
        setShowShareOptions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showShareOptions]);


  // Loading and Error States
  if (isLoading) return <StoryDetailSkeleton />;
  if (error || !story) notFound();

  return (
    <PageTransition>
      {/* <PageViewTracker pageType="story" itemId={story?.id} /> */}
      <div className="min-h-screen bg-white dark:bg-film-black-950 pt-16 pb-20"> {/* Reduced pt */}

        {/* Reading progress bar */}
        <div className="fixed top-[72px] left-0 right-0 h-1 bg-gray-200 dark:bg-film-black-800 z-30"> {/* Adjusted top */}
          <motion.div className="h-full bg-gradient-to-r from-film-red-500 to-film-red-700" style={{ width: `${scrollProgress}%` }} />
        </div>

        {/* Hero section */}
        <div className="relative w-full h-[50vh] md:h-[65vh] lg:h-[75vh] overflow-hidden">
          <Image src={story.image} alt={story.title} fill className="object-cover object-center" priority onError={(e) => { e.currentTarget.src = "/images/hero/hero_placeholder.jpg"; }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
          <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-10 md:pb-16 relative z-10">
            <SectionReveal>
              <div className="max-w-4xl">
                <div className="mb-4"><Link href="/stories" className="flex items-center text-white hover:text-film-red-400 transition-colors text-sm"><ArrowLeft className="mr-2 h-4 w-4" />Back to Stories</Link></div>
                <span className="inline-block px-3 py-1 bg-film-red-600 text-white text-xs font-semibold rounded-full mb-4 uppercase tracking-wider">{story.category}</span>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">{story.title}</h1>
                <div className="flex flex-wrap items-center text-white/80 gap-x-5 gap-y-2 text-sm">
                  <div className="flex items-center"><User className="mr-1.5 h-4 w-4 text-film-red-400" /><span>By {story.author}</span></div>
                  <div className="flex items-center"><Calendar className="mr-1.5 h-4 w-4 text-film-red-400" /><span>{formatDate(story.date)}</span></div>
                  <div className="flex items-center"><Clock className="mr-1.5 h-4 w-4 text-film-red-400" /><span>{story.readTime}</span></div>
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>

        {/* Main content area with sidebar */}
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-10 xl:gap-16">
            {/* Main content */}
            <div className="lg:w-2/3">
              <SectionReveal>
                <article className={proseStyle}>
                  {/* Render story content */}
                  {story.content?.map((section, index) => {
                    if (section.type === "paragraph") return <p key={index}>{section.content}</p>;
                    if (section.type === "heading") return <h2 key={index} className="font-heading !text-2xl md:!text-3xl !font-semibold !mt-10 !mb-6">{section.content}</h2>; // Use heading font
                    if (section.type === "image" && section.url) return (
                      <figure key={index} className="my-8">
                        <div className="relative aspect-video w-full overflow-hidden rounded-xl shadow-md">
                          <Image src={section.url} alt={section.caption || ""} fill className="object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                        </div>
                        {section.caption && <figcaption className="text-center italic text-sm mt-3 text-gray-600 dark:text-gray-400">{section.caption}</figcaption>}
                      </figure>
                    );
                    if (section.type === "quote") return (
                      <blockquote key={index} className="border-l-4 border-film-red-500 pl-6 py-4 my-8 italic bg-gray-50 dark:bg-film-black-800/30 rounded-r-lg">
                        <p className="!text-xl !leading-relaxed !mb-3">{section.content}</p>
                        {section.attribution && <footer className="text-right text-base text-gray-600 dark:text-gray-400 font-medium not-italic">— {section.attribution}</footer>}
                      </blockquote>
                    );
                    return null;
                  })}
                </article>

                {/* Tags (Placeholder) */}
                <div className="my-10 py-8 border-t border-gray-200 dark:border-film-black-800">
                  <div className="flex items-center flex-wrap gap-2"><Tag className="h-4 w-4 text-film-red-500 mr-2" /><span className="text-gray-600 dark:text-gray-400 mr-2 text-sm font-medium">Tags:</span>
                    {['Documentary', 'Filmmaking', 'Ghana', 'Culture'].map((tag) => (
                      <Link key={tag} href={`/stories?tag=${tag}`} className="px-3 py-1 bg-gray-100 dark:bg-film-black-800 rounded-full text-xs hover:bg-gray-200 dark:hover:bg-film-black-700 transition-colors text-gray-700 dark:text-gray-300">{tag}</Link>
                    ))}
                  </div>
                </div>

                {/* Author info */}
                <div className="mt-10 p-6 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-film-black-900 dark:to-film-black-800 rounded-xl flex flex-col md:flex-row gap-6 items-center border border-gray-200 dark:border-film-black-700">
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden flex-shrink-0 relative border-4 border-white dark:border-film-black-950 shadow-lg"><Image src="/images/hero/hero1.jpg" alt={story.author} fill className="object-cover" /></div>
                  <div className="text-center md:text-left">
                    <p className="text-xs uppercase tracking-wider text-film-red-600 dark:text-film-red-400 font-semibold mb-1">Written By</p>
                    <h3 className="text-xl font-bold mb-2 text-film-black-900 dark:text-white">{story.author}</h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">Filmmaker and Storyteller at Riel Films.</p>
                    <Link href="/about" className="text-film-red-600 dark:text-film-red-500 hover:underline text-sm font-medium inline-flex items-center">More about the author <ChevronRight className="ml-1 h-4 w-4" /></Link>
                  </div>
                </div>
              </SectionReveal>
            </div>

            {/* Sidebar */}
            <aside className="lg:w-1/3">
              <div className="lg:sticky lg:top-28 space-y-8">
                <SectionReveal delay={0.2} direction="right">
                  {/* Share and bookmark options */}
                  <div className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-film-black-800 relative">
                    <h3 className="text-lg font-bold mb-4 text-film-black-900 dark:text-white">Actions</h3>
                    <div className="flex gap-3">
                      <Button onClick={toggleShareOptions} variant="secondary" className="flex-1 share-button"><Share2 className="mr-2 h-4 w-4" />Share</Button>
                      <Button onClick={toggleBookmark} variant={isBookmarked ? "primary" : "secondary"} className="flex-1">{isBookmarked ? <Bookmark className="mr-2 h-4 w-4 fill-current" /> : <BookmarkPlus className="mr-2 h-4 w-4" />} {isBookmarked ? 'Saved' : 'Save'}</Button>
                    </div>
                    <AnimatePresence>{showShareOptions && (<motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-film-black-800 rounded-xl p-2 shadow-lg z-10 border border-gray-200 dark:border-film-black-700 share-options-container"><button onClick={() => shareStory("twitter")} className={shareOptionClass}><Twitter className="h-4 w-4 mr-2 text-[#1DA1F2]" /> Twitter</button><button onClick={() => shareStory("facebook")} className={shareOptionClass}><Facebook className="h-4 w-4 mr-2 text-[#1877F2]" /> Facebook</button><button onClick={() => shareStory("email")} className={shareOptionClass}><MailIcon className="h-4 w-4 mr-2 text-gray-500" /> Email</button><button onClick={() => shareStory("copy")} className={shareOptionClass}><LinkIcon className="h-4 w-4 mr-2 text-gray-500" /> Copy Link</button></motion.div>)}</AnimatePresence>
                  </div>

                  {/* Related stories */}
                  {relatedStories.length > 0 && (
                    <div className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-film-black-800">
                      <h3 className="text-lg font-bold mb-5 text-film-black-900 dark:text-white border-b border-gray-200 dark:border-film-black-700 pb-3">Related Stories</h3>
                      <div className="space-y-4">
                        {relatedStories.map((related) => (
                          <Link href={`/stories/${related.slug}`} key={related.slug} className="flex gap-4 group items-center">
                            <div className="relative h-16 w-24 rounded-lg overflow-hidden flex-shrink-0"><Image src={related.image} alt={related.title} fill className="object-cover transition-transform duration-300 group-hover:scale-105" onError={(e) => { e.currentTarget.src = "/images/hero/hero_placeholder.jpg"; }} /></div>
                            <div><h4 className="font-medium text-sm text-film-black-900 dark:text-white group-hover:text-film-red-600 dark:group-hover:text-film-red-500 transition-colors line-clamp-2">{related.title}</h4><p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formatDate(related.date)}</p></div>
                          </Link>
                        ))}
                      </div>
                      <div className="mt-5 pt-4 border-t border-gray-200 dark:border-film-black-800"><Link href="/stories" className="text-film-red-600 dark:text-film-red-500 hover:underline flex items-center text-sm">View all stories<ChevronRight className="ml-1 h-4 w-4" /></Link></div>
                    </div>
                  )}
                </SectionReveal>
              </div>
            </aside>
          </div>
        </div>

        {/* Scroll to top button */}
        <AnimatePresence>{showScrollTop && (<motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} onClick={scrollToTop} className="fixed bottom-8 right-8 p-3 bg-film-red-600 hover:bg-film-red-700 dark:bg-film-red-700 dark:hover:bg-film-red-600 text-white rounded-full shadow-lg z-30 focus:outline-none focus:ring-2 focus:ring-film-red-500 focus:ring-offset-2 dark:focus:ring-offset-film-black-950" aria-label="Scroll to top"><ChevronUp className="h-6 w-6" /></motion.button>)}</AnimatePresence>
      </div>
    </PageTransition>
  );
};

// Add shared styles if not global
const styles = `
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
`;
if (typeof window !== 'undefined') { const styleSheet = document.createElement("style"); styleSheet.innerText = styles; document.head.appendChild(styleSheet); }


export default StoryPage;

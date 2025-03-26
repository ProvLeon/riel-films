"use client";
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Share2, BookmarkPlus, Calendar, Clock, Tag, User, Bookmark, ChevronUp, ChevronRight } from "lucide-react";
import PageTransition from "@/components/UI/PageTransition";
import SectionReveal from "@/components/UI/SectionReveal";
import { Button } from "@/components/UI/Button";
import { motion, AnimatePresence } from "framer-motion";
import { allBlogPosts } from "@/data/storiesData";
import { formatDate } from "@/lib/utils";
import { useStory } from "@/hooks/useStory";
import LoadingSpinner from "@/components/UI/LoadingSpinner";

const StoryPage = ({ params }: { params: { slug: string } }) => {
  const { slug } = params
  const { story, isLoading, error } = useStory(slug);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showShareOptions, setShowShareOptions] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);


  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error || !story) {
    notFound();
  }

  // Find related stories (same category, excluding current)
  const relatedStories = allBlogPosts
    .filter((post) => post.category === story?.category && post.slug !== params.slug)
    .slice(0, 3);

  // If story doesn't exist, show 404
  // if (!story) {
  //   notFound();
  // }

  // Handle scroll events for progress indicator
  React.useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const fullHeight = document.body.scrollHeight;
      const scrolled = window.scrollY;
      const progress = scrolled / (fullHeight - windowHeight);

      setScrollProgress(progress * 100);
      setShowScrollTop(scrolled > windowHeight / 2);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Toggle bookmark state
  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  // Toggle share options
  const toggleShareOptions = () => {
    setShowShareOptions(!showShareOptions);
  };

  // Share story
  const shareStory = (platform: string) => {
    const url = window.location.href;
    const text = `Check out this story: ${story.title}`;

    switch (platform) {
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`);
        break;
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
        break;
      case "linkedin":
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`);
        break;
      case "email":
        window.open(`mailto:?subject=${text}&body=${url}`);
        break;
      default:
        // Copy to clipboard
        navigator.clipboard.writeText(url);
      // You could show a notification here
    }

    setShowShareOptions(false);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-white dark:bg-film-black-950 pt-24 pb-20">
        {/* Reading progress bar */}
        <div className="fixed top-[71px] left-0 right-0 h-1 bg-gray-200 dark:bg-film-black-800 z-30">
          <motion.div
            className="h-full bg-film-red-600 dark:bg-film-red-700"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Hero section */}
        <div className="relative w-full h-[40vh] md:h-[60vh] lg:h-[70vh] overflow-hidden">
          <Image
            src={story.image}
            alt={story.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent">
            <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-10">
              <SectionReveal>
                <div className="max-w-4xl">
                  <div className="flex items-center mb-4">
                    <Link href="/stories" className="flex items-center text-white hover:text-film-red-400 transition-colors">
                      <ArrowLeft className="mr-2 h-5 w-5" />
                      <span>Back to Stories</span>
                    </Link>
                  </div>
                  <span className="inline-block px-3 py-1 bg-film-red-600 text-white text-sm font-medium rounded-full mb-4">
                    {story.category}
                  </span>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                    {story.title}
                  </h1>
                  <div className="flex flex-wrap items-center text-white gap-4 md:gap-6">
                    <div className="flex items-center">
                      <User className="mr-2 h-4 w-4 text-film-red-500" />
                      <span>{story.author}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="mr-2 h-4 w-4 text-film-red-500" />
                      <span>{formatDate(story.date)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-film-red-500" />
                      <span>{story.readTime}</span>
                    </div>
                  </div>
                </div>
              </SectionReveal>
            </div>
          </div>
        </div>

        {/* Main content area with sidebar */}
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Main content */}
            <SectionReveal>
              <div className="lg:w-2/3">
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  {story.content.map((section, index) => {
                    if (section.type === "paragraph") {
                      return <p key={index}>{section.content}</p>;
                    } else if (section.type === "heading") {
                      return <h2 key={index} className="text-2xl md:text-3xl font-bold mt-10 mb-6">{section.content}</h2>;
                    } else if (section.type === "image") {
                      return (
                        <figure key={index} className="my-10">
                          <div className="relative h-[300px] md:h-[400px] lg:h-[500px] w-full overflow-hidden rounded-xl">
                            <Image
                              src={section.url!}
                              alt={section.caption || ""}
                              fill
                              className="object-cover"
                            />
                          </div>
                          {section.caption && (
                            <figcaption className="text-center italic text-gray-600 dark:text-gray-400 mt-3">
                              {section.caption}
                            </figcaption>
                          )}
                        </figure>
                      );
                    } else if (section.type === "quote") {
                      return (
                        <blockquote key={index} className="border-l-4 border-film-red-500 pl-6 py-2 my-8 italic">
                          <p className="text-xl">{section.content}</p>
                          {section.attribution && (
                            <footer className="text-right text-gray-600 dark:text-gray-400 font-medium not-italic">
                              — {section.attribution}
                            </footer>
                          )}
                        </blockquote>
                      );
                    }
                    return null;
                  })}
                </div>

                {/* Tags */}
                <div className="my-10 pt-8 border-t border-gray-200 dark:border-film-black-800">
                  <div className="flex items-center flex-wrap gap-2">
                    <Tag className="h-4 w-4 text-film-red-500 mr-2" />
                    <span className="text-gray-600 dark:text-gray-400 mr-2">Tags:</span>
                    {['Documentary', 'Filmmaking', 'Behind The Scenes', 'Ghana', 'African Cinema'].map((tag) => (
                      <Link
                        href={`/stories?tag=${tag}`}
                        key={tag}
                        className="px-3 py-1 bg-gray-100 dark:bg-film-black-800 rounded-full text-sm hover:bg-gray-200 dark:hover:bg-film-black-700 transition-colors"
                      >
                        {tag}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Author info */}
                <div className="mt-10 p-8 bg-gray-50 dark:bg-film-black-900 rounded-xl flex flex-col md:flex-row gap-6 items-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 relative">
                    <Image
                      src="/images/hero/hero3.jpg"
                      alt={story.author}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-film-black-900 dark:text-white">{story.author}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      Filmmaker and Production Director at Riel Films with over 15 years of experience in documentary storytelling across West Africa.
                    </p>
                    <div className="flex gap-3">
                      <Link href="/about" className="text-film-red-600 dark:text-film-red-500 hover:underline">
                        More about the author
                      </Link>
                      <ChevronRight className="h-5 w-5 text-film-red-600 dark:text-film-red-500" />
                    </div>
                  </div>
                </div>
              </div>
            </SectionReveal>

            {/* Sidebar */}
            <aside className="lg:w-1/3">
              {/* Sticky sidebar content */}
              <div className="lg:sticky lg:top-28">
                <SectionReveal delay={0.2} direction="right">
                  {/* Share and bookmark options */}
                  <div className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm mb-8 relative">
                    <h3 className="text-xl font-bold mb-4 text-film-black-900 dark:text-white">Share This Story</h3>
                    <div className="flex gap-3">
                      <Button
                        onClick={toggleShareOptions}
                        variant="secondary"
                        className="flex-1"
                      >
                        <Share2 className="mr-2 h-5 w-5" />
                        Share
                      </Button>
                      <Button
                        onClick={toggleBookmark}
                        variant={isBookmarked ? "primary" : "secondary"}
                        className="flex-1"
                      >
                        {isBookmarked ? (
                          <>
                            <Bookmark className="mr-2 h-5 w-5" />
                            Saved
                          </>
                        ) : (
                          <>
                            <BookmarkPlus className="mr-2 h-5 w-5" />
                            Save
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Share options popup */}
                    <AnimatePresence>
                      {showShareOptions && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-film-black-800 rounded-xl p-4 shadow-lg z-10"
                        >
                          <div className="flex flex-wrap gap-2">
                            <button
                              onClick={() => shareStory("twitter")}
                              className="p-2 bg-[#1DA1F2] text-white rounded-full hover:bg-opacity-90 transition-colors"
                              aria-label="Share on Twitter"
                            >
                              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                              </svg>
                            </button>
                            <button
                              onClick={() => shareStory("facebook")}
                              className="p-2 bg-[#1877F2] text-white rounded-full hover:bg-opacity-90 transition-colors"
                              aria-label="Share on Facebook"
                            >
                              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                              </svg>
                            </button>
                            <button
                              onClick={() => shareStory("linkedin")}
                              className="p-2 bg-[#0A66C2] text-white rounded-full hover:bg-opacity-90 transition-colors"
                              aria-label="Share on LinkedIn"
                            >
                              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                <path fillRule="evenodd" d="M19.7 3H4.3C3.582 3 3 3.582 3 4.3v15.4c0 .718.582 1.3 1.3 1.3h15.4c.718 0 1.3-.582 1.3-1.3V4.3c0-.718-.582-1.3-1.3-1.3zM8.339 18.338H5.667v-8.59h2.672v8.59zM7.004 8.574a1.548 1.548 0 11-.002-3.096 1.548 1.548 0 01.002 3.096zm11.335 9.764H15.67v-4.177c0-.996-.017-2.278-1.387-2.278-1.389 0-1.601 1.086-1.601 2.206v4.249h-2.667v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.779 3.203 4.092v4.711z" clipRule="evenodd" />
                              </svg>
                            </button>
                            <button
                              onClick={() => shareStory("email")}
                              className="p-2 bg-gray-600 text-white rounded-full hover:bg-opacity-90 transition-colors"
                              aria-label="Share via Email"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => shareStory("copy")}
                              className="p-2 bg-gray-400 dark:bg-gray-700 text-white rounded-full hover:bg-opacity-90 transition-colors"
                              aria-label="Copy Link"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Related stories */}
                  <div className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm">
                    <h3 className="text-xl font-bold mb-6 text-film-black-900 dark:text-white">Related Stories</h3>
                    <div className="space-y-6">
                      {relatedStories.map((relatedStory) => (
                        <Link href={`/stories/${relatedStory.slug}`} key={relatedStory.slug}>
                          <div className="flex gap-4 group">
                            <div className="relative h-20 w-20 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={relatedStory.image}
                                alt={relatedStory.title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                            </div>
                            <div>
                              <h4 className="font-medium text-film-black-900 dark:text-white group-hover:text-film-red-600 dark:group-hover:text-film-red-500 transition-colors">
                                {relatedStory.title}
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {relatedStory.readTime}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-film-black-800">
                      <Link href="/stories" className="text-film-red-600 dark:text-film-red-500 hover:underline flex items-center">
                        View all stories
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </SectionReveal>
              </div>
            </aside>
          </div>
        </div>

        {/* Scroll to top button */}
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              onClick={scrollToTop}
              className="fixed bottom-8 right-8 p-3 bg-film-red-600 hover:bg-film-red-700 dark:bg-film-red-700 dark:hover:bg-film-red-600 text-white rounded-full shadow-lg z-30"
              aria-label="Scroll to top"
            >
              <ChevronUp className="h-6 w-6" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export default StoryPage;

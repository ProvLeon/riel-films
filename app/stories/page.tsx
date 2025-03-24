"use client";
import React from "react";
import { useRouter } from "next/navigation";
import PageTransition from "@/components/UI/PageTransition";
import SectionReveal from "@/components/UI/SectionReveal";

// Component Imports
import PageHeader from "@/components/stories/PageHeader";
import SearchBar from "@/components/stories/SearchBar";
import FeaturedStory from "@/components/stories/FeaturedStory";
import CategoryFilter from "@/components/stories/CategoryFilter";
import StoryCard from "@/components/stories/StoryCard";
import Pagination from "@/components/stories/Pagination";
import NewsletterSubscribe from "@/components/stories/NewsletterSubscribe";
import CategoryExplorer from "@/components/stories/CategoryExplorer";
import EmptyState from "@/components/stories/EmptyState";

// Import data, hooks, and types
import { featuredStory, allBlogPosts, categories } from "@/data/storiesData";
import { useStories } from "@/hooks/useStories";
import { AnimatePresence } from "framer-motion";

const StoriesPage = () => {
  const router = useRouter();

  // Use our custom hook to handle all stories functionality
  const {
    selectedCategory,
    currentPage,
    searchQuery,
    hoveredPost,
    filteredPosts,
    currentPosts,
    totalPages,
    setHoveredPost,
    postsPerPage,
    handleCategoryChange,
    handlePageChange,
    handleSearchChange,
    resetFilters
  } = useStories({ allPosts: allBlogPosts });

  const handlePostClick = (slug: string) => {
    router.push(`/stories/${slug}`);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-white dark:bg-film-black-950 pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <SectionReveal>
            <PageHeader
              title="Stories & Insights"
              description="Discover behind-the-scenes stories, filmmaking insights, and the cultural narratives that inspire our work."
            />
          </SectionReveal>

          {/* Search bar */}
          <SectionReveal delay={0.1}>
            <SearchBar
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search stories..."
            />
          </SectionReveal>

          {/* Featured Story */}
          <section className="mb-20">
            <SectionReveal delay={0.2}>
              <FeaturedStory
                story={featuredStory}
                onClick={() => handlePostClick(featuredStory.slug)}
              />
            </SectionReveal>
          </section>

          {/* Categories Filter */}
          <section className="mb-12">
            <SectionReveal>
              <CategoryFilter
                categories={categories}
                selectedCategory={selectedCategory}
                onChange={handleCategoryChange}
              />
            </SectionReveal>
          </section>

          {/* Blog Posts Grid */}
          <section id="posts-section" className="mb-20 scroll-mt-24">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence mode="wait">
                {currentPosts.length > 0 ? (
                  currentPosts.map((post, index) => (
                    <StoryCard
                      key={post.slug}
                      post={post}
                      index={index}
                      onClick={() => handlePostClick(post.slug)}
                      isHovered={hoveredPost === index}
                      onMouseEnter={() => setHoveredPost(index)}
                      onMouseLeave={() => setHoveredPost(null)}
                    />
                  ))
                ) : (
                  <EmptyState onReset={resetFilters} />
                )}
              </AnimatePresence>
            </div>

            {/* Pagination */}
            {filteredPosts.length > postsPerPage && (
              <SectionReveal delay={0.5}>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </SectionReveal>
            )}
          </section>

          {/* Newsletter */}
          <section className="mb-20">
            <SectionReveal direction="up">
              <NewsletterSubscribe />
            </SectionReveal>
          </section>

          {/* Related Categories */}
          <section>
            <SectionReveal>
              <CategoryExplorer
                categories={categories.filter(cat => cat !== "All Categories")}
                selectedCategory={selectedCategory}
                onChange={handleCategoryChange}
                categoryCount={(category) => filteredPosts.filter(post => post.category === category).length}
              />
            </SectionReveal>
          </section>
        </div>
      </div>
    </PageTransition>
  );
};

export default StoriesPage;

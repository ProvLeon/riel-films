"use client";
import React, { useMemo } from "react";
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
import { useStories } from "@/hooks/useStories";
import { AnimatePresence } from "framer-motion";
import { useStoriesList } from "@/hooks/useStoriesList";
import LoadingSpinner from "@/components/UI/LoadingSpinner";

const StoriesPage = () => {
  const router = useRouter();
  const { stories, isLoading } = useStoriesList();

  const categories = useMemo(() => {
    if (!stories.length) return ["All Categories"];

    const uniqueCategories = Array.from(
      new Set(stories.map(story => story.category))
    );

    return ["All Categories", ...uniqueCategories];
  }, [stories]);

  const featuredStory = stories.find(story => story.featured);

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
  } = useStories({
    allPosts: stories,
    defaultCategory: 'All Categories',
    postsPerPage: 6
  });

  const handlePostClick = (slug: string) => {
    router.push(`/stories/${slug}`);
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Handle case where no featured story is found
  const featuredStoryToDisplay = featuredStory || (stories.length > 0 ? stories[0] : null);

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
          {featuredStoryToDisplay && (
            <section className="mb-20">
              <SectionReveal delay={0.2}>
                <FeaturedStory
                  story={featuredStoryToDisplay}
                  onClick={() => handlePostClick(featuredStoryToDisplay.slug)}
                />
              </SectionReveal>
            </section>
          )}

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

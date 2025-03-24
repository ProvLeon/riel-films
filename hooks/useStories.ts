import { BlogPost } from '@/types/story';
import { filterPosts, paginatePosts } from '@/utils/storyUtils';
import { useCallback, useState } from 'react';

interface UseStoriesProps {
  allPosts: BlogPost[];
  defaultCategory?: string;
  postsPerPage?: number;
}

export const useStories = ({
  allPosts,
  defaultCategory = 'All Categories',
  postsPerPage = 6
}: UseStoriesProps) => {
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredPost, setHoveredPost] = useState<number | null>(null);

  // Filter posts based on selected category and search query
  const filteredPosts = filterPosts(allPosts, selectedCategory, searchQuery);

  // Paginate posts
  const { currentPosts, totalPages } = paginatePosts(filteredPosts, currentPage, postsPerPage);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1); // Reset to first page when category changes
  }, []);

  const handlePageChange = useCallback((pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll smoothly to the top of the posts section
    document.getElementById("posts-section")?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const resetFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory('All Categories');
    setCurrentPage(1);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1); // Reset to first page when search changes
  }, []);

  return {
    selectedCategory,
    currentPage,
    searchQuery,
    hoveredPost,
    filteredPosts,
    currentPosts,
    totalPages,
    postsPerPage,
    setHoveredPost,
    handleCategoryChange,
    handlePageChange,
    handleSearchChange,
    resetFilters
  };
};

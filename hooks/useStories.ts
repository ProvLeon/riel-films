import { debounce } from '@/lib/utils';
import { Story } from '@/types/mongodbSchema';
import { filterPosts, paginatePosts } from '@/utils/storyUtils';
import { useCallback, useEffect, useState } from 'react';

interface UseStoriesProps {
  allPosts: Story[];
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
  const [filteredPosts, setFilteredPosts] = useState<Story[]>(allPosts);
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search handling
  const debouncedSearchFilter = useCallback(
    debounce((query: string, category: string) => {
      setIsSearching(true);
      const filtered = filterPosts(allPosts, category, query);
      setFilteredPosts(filtered);
      setIsSearching(false);
    }, 300),
    [allPosts]
  );

  useEffect(() => {
    debouncedSearchFilter(searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory, debouncedSearchFilter]);

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
    isSearching,
    setHoveredPost,
    handleCategoryChange,
    handlePageChange,
    handleSearchChange,
    resetFilters
  };
};

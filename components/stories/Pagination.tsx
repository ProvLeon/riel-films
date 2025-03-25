import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  // Display page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Show max 5 page numbers

    if (totalPages <= maxPagesToShow) {
      // If we have 5 or fewer pages, show all
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);

      // Calculate start and end of shown pages
      let startPage = Math.max(currentPage - 1, 2);
      let endPage = Math.min(currentPage + 1, totalPages - 1);

      // Adjust if we're near the beginning or end
      if (currentPage <= 2) {
        endPage = 4;
      } else if (currentPage >= totalPages - 1) {
        startPage = totalPages - 3;
      }

      // Add ellipsis if needed before middle pages
      if (startPage > 2) {
        pageNumbers.push('...');
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis if needed after middle pages
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }

      // Always show last page
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  return (
    <div className="flex justify-center mt-12">
      <div className="flex items-center space-x-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={currentPage === 1}
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${currentPage === 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'border border-gray-300 dark:border-film-black-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-film-black-800'
            }`}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-5 w-5" />
        </motion.button>

        {getPageNumbers().map((number, i) => (
          number === '...' ? (
            <span key={`ellipsis-${i}`} className="text-gray-600 dark:text-gray-400">...</span>
          ) : (
            <motion.button
              key={`page-${number}`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => typeof number === 'number' && onPageChange(number as number)}
              className={`w-10 h-10 rounded-full flex items-center justify-center ${currentPage === number
                ? 'bg-film-red-600 text-white'
                : 'border border-gray-300 dark:border-film-black-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-film-black-800'
                } transition-colors`}
            >
              {number}
            </motion.button>
          )
        ))}

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          disabled={currentPage === totalPages}
          onClick={() => currentPage < totalPages && onPageChange(currentPage + 1)}
          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${currentPage === totalPages
            ? 'text-gray-400 cursor-not-allowed'
            : 'border border-gray-300 dark:border-film-black-700 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-film-black-800'
            }`}
          aria-label="Next page"
        >
          <ChevronRight className="h-5 w-5" />
        </motion.button>
      </div>
    </div>
  );
};

export default Pagination;

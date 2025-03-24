import React from 'react';
import { motion } from 'framer-motion';

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selectedCategory, onChange }) => {
  return (
    <div className="flex overflow-x-auto pb-4 scrollbar-hide">
      <div className="flex gap-3 md:flex-wrap">
        {categories.map((category, index) => (
          <motion.button
            key={index}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onChange(category)}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${selectedCategory === category
                ? 'bg-film-red-600 dark:bg-film-red-700 text-white shadow-md'
                : 'bg-gray-100 dark:bg-film-black-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-film-black-700'
              }`}
          >
            {category}
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;

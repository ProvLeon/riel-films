import React from 'react';
import { motion } from 'framer-motion';

interface CategoryExplorerProps {
  categories: string[];
  selectedCategory: string;
  onChange: (category: string) => void;
  categoryCount: (category: string) => number;
}

const CategoryExplorer: React.FC<CategoryExplorerProps> = ({
  categories,
  selectedCategory,
  onChange,
  categoryCount
}) => {
  return (
    <>
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 text-film-black-900 dark:text-white">
          Explore by Topic
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Dive deeper into our content categories
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.map((category, index) => (
          <motion.div
            key={category}
            whileHover={{ y: -5 }}
            onClick={() => onChange(category)}
            className={`cursor-pointer rounded-xl p-6 text-center flex flex-col items-center justify-center transition-all ${selectedCategory === category
                ? 'bg-film-red-600 text-white shadow-md shadow-film-red-600/20'
                : 'bg-gray-100 dark:bg-film-black-800 text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-film-black-700'
              }`}
          >
            <div className="bg-white/20 dark:bg-black/20 w-12 h-12 rounded-full flex items-center justify-center mb-3">
              {/* Icon would go here - using number for demo */}
              <span className="text-xl font-bold">{index + 1}</span>
            </div>
            <span className="text-sm font-medium">{category}</span>
            <span className="text-xs mt-1 opacity-80">
              {categoryCount(category)} articles
            </span>
          </motion.div>
        ))}
      </div>
    </>
  );
};

export default CategoryExplorer;

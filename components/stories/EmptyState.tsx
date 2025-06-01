import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/UI/Button";
import { Search, RefreshCw } from 'lucide-react';

interface EmptyStateProps {
  onReset: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onReset }) => {
  return (
    <motion.div
      className="col-span-full flex flex-col items-center justify-center py-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
    >
      <div className="w-20 h-20 rounded-full bg-gray-100 dark:bg-film-black-800 flex items-center justify-center mb-6">
        <Search size={32} className="text-gray-400 dark:text-gray-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">No stories found</h3>
      <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
        We couldn't find any stories matching your search criteria. Try adjusting your filters or search terms.
      </p>
      <Button
        variant="secondary"
        onClick={onReset}
        className="flex items-center"
      >
        <RefreshCw size={16} className="mr-2" />
        Clear filters
      </Button>
    </motion.div>
  );
};

export default EmptyState;

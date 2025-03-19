import React from "react";
import { motion } from "framer-motion";

interface QuoteSectionProps {
  quote: string;
  author: string;
  className?: string;
}

const QuoteSection: React.FC<QuoteSectionProps> = ({
  quote,
  author,
  className = "",
}) => {
  return (
    <section
      className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 ${className}`}
    >
      <div className="max-w-4xl mx-auto">
        <motion.blockquote
          className="text-center relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {/* Decorative quote marks */}
          <div className="absolute -top-12 left-0 text-9xl opacity-10 text-film-red-500">
            &dquo;
          </div>
          <div className="absolute -bottom-44 right-0 text-9xl opacity-10 text-film-red-500">
            &dquo;
          </div>

          <p className="text-3xl md:text-4xl font-bold leading-tight text-film-black-900 dark:text-white mb-6 relative z-10">
            &dquo;{quote}&dquo;
          </p>
          <footer className="text-xl md:text-2xl font-medium text-film-red-600 dark:text-film-red-500">
            {author}
          </footer>
        </motion.blockquote>
      </div>
    </section>
  );
};

export default QuoteSection;

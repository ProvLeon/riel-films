import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, BookOpen, User } from 'lucide-react';
import { Card, CardContent, CardImage, CardTitle } from "@/components/UI/Card";

interface BlogPost {
  title: string;
  excerpt: string;
  author: string;
  date: string;
  image: string;
  category: string;
  slug: string;
  readTime: string;
}

interface StoryCardProps {
  post: BlogPost;
  index: number;
  onClick: () => void;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  hover: {
    y: -10,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: { duration: 0.3 }
  }
};

const StoryCard: React.FC<StoryCardProps> = ({
  post,
  index,
  onClick,
  isHovered,
  onMouseEnter,
  onMouseLeave
}) => {
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, y: 20 }}
      whileHover="hover"
      transition={{ delay: 0.1 * (index % 3) }}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="cursor-pointer"
    >
      <Card className="h-full flex flex-col relative group" isHoverable={true}>
        <div className="relative overflow-hidden">
          <CardImage
            src={post.image}
            alt={post.title}
            aspectRatio="aspect-video"
            overlay={isHovered}
          />
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent flex items-end justify-center pb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <span className="text-white text-base font-medium px-4 py-2 rounded-full bg-film-red-600/80 backdrop-blur-sm">
              Read Article
            </span>
          </motion.div>
          <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/90 dark:bg-film-black-800/90 backdrop-blur-sm text-xs font-medium text-film-red-600 dark:text-film-red-500 shadow-sm">
            {post.category}
          </div>
        </div>

        <CardContent className="flex-grow dark:text-white">
          <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-3">
            <span className="flex items-center">
              <Calendar size={14} className="mr-1" /> {post.date}
            </span>
            <span className="flex items-center">
              <BookOpen size={14} className="mr-1" /> {post.readTime}
            </span>
          </div>
          <CardTitle className="group-hover:text-film-red-600 dark:group-hover:text-film-red-500 transition-colors mb-3 line-clamp-2">
            {post.title}
          </CardTitle>
          <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3">{post.excerpt}</p>
          <div className="mt-auto flex justify-between items-center pt-4 border-t border-gray-100 dark:border-film-black-800">
            <span className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
              <User size={14} className="mr-1" /> {post.author}
            </span>
            <motion.span
              className="text-film-red-600 dark:text-film-red-500"
              animate={{ x: isHovered ? 3 : 0 }}
            >
              <ArrowRight size={18} />
            </motion.span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StoryCard;

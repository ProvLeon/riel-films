import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Calendar, BookOpen, User } from 'lucide-react';
import { Card, CardContent, CardImage, CardTitle } from "@/components/UI/Card";
import { Button } from "@/components/UI/Button";
import { Story } from '@/types/story';

interface FeaturedStoryProps {
  story: Story;
  onClick: () => void;
}

const FeaturedStory: React.FC<FeaturedStoryProps> = ({ story, onClick }) => {
  return (
    <motion.div
      whileHover="hover"
      initial="hidden"
      animate="visible"
      variants={{
        hover: { scale: 1.005 },
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.6 } }
      }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
      className="cursor-pointer"
    >
      <Card className="overflow-hidden bg-gradient-to-r from-gray-50 to-white dark:from-film-black-900 dark:to-film-black-950">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          <div className="relative lg:col-span-7 h-80 lg:h-auto">
            <CardImage
              src={story.image}
              alt={story.title}
              aspectRatio="aspect-[16/9]"
            />
            <div className="absolute top-4 left-4 bg-film-red-600 text-white px-4 py-2 rounded-full text-sm font-medium">
              Featured Story
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6 lg:hidden">
              <span className="text-white text-lg font-medium">Read Full Story <ArrowRight className="inline ml-2" size={18} /></span>
            </div>
          </div>

          <CardContent className="p-8 lg:p-12 flex flex-col justify-center lg:col-span-5">
            <div className="flex items-center space-x-4 mb-4">
              <span className="inline-flex items-center text-sm text-film-red-600 dark:text-film-red-500 font-medium">
                <Calendar size={16} className="mr-1" /> {story.date}
              </span>
              <span className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400">
                <BookOpen size={16} className="mr-1" /> {story.readTime}
              </span>
            </div>

            <CardTitle className="text-2xl md:text-3xl lg:text-4xl mb-4 group-hover:text-film-red-600 dark:group-hover:text-film-red-500 transition-colors">
              {story.title}
            </CardTitle>

            <p className="text-gray-700 dark:text-gray-300 mb-6 text-lg">{story.excerpt}</p>

            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700 mr-3 flex items-center justify-center">
                <User size={20} className="text-gray-600 dark:text-gray-400" />
              </div>
              <span className="text-gray-800 dark:text-gray-200 font-medium">By {story.author}</span>
            </div>

            <Button variant="primary" className="mt-2 flex items-center group">
              Read Full Story
              <motion.span
                initial={{ x: 0 }}
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, repeatDelay: 2, duration: 0.8 }}
              >
                <ArrowRight className="ml-2 h-5 w-5" />
              </motion.span>
            </Button>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
};

export default FeaturedStory;

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { CourseCard, ShortCourse } from "../../types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardImage,
  CardTitle,
} from "@/components/UI/Card";

interface CoursesGridProps {
  title: string;
  courses: CourseCard[];
  shortCourses?: {
    title: string;
    courses: ShortCourse[];
  };
  id?: string;
  className?: string;
}

const CoursesGrid: React.FC<CoursesGridProps> = ({
  title,
  courses,
  shortCourses,
  id,
  className = "",
}) => {
  return (
    <section
      id="productions"
      className={`pt-16 md:pt-24 pb-24 md:pb-32 ${className} `}
    >
      <motion.h2
        className="text-3xl md:text-4xl font-medium mb-14 text-film-black-900 dark:text-white"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        {title}
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.map((production, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Link
              href={production.href}
              className="group focus:outline-none block h-full"
            >
              <Card className="h-full flex flex-col">
                <CardImage
                  src={production.imageSrc}
                  alt={production.imageAlt}
                  className="transition-transform duration-500 group-hover:scale-105"
                  aspectRatio="aspect-video"
                  overlay={true}
                />
                <CardContent className="flex-grow dark:text-white">
                  <div className="flex justify-between items-start mb-3">
                    <CardTitle className="group-hover:text-film-red-600 dark:group-hover:text-film-red-500 transition-colors">
                      {production.title}
                    </CardTitle>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-film-red-500 transform translate-x-0 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  </div>
                  <CardDescription>{production.type}</CardDescription>
                  <p className="text-gray-700 dark:text-gray-200">
                    {production.description}
                  </p>
                </CardContent>
                {production.badge && (
                  <div className="px-6 pb-4">
                    <span className="inline-block bg-film-red-100 text-film-red-800 dark:bg-film-red-900/30 dark:text-film-red-300 text-xs font-semibold px-2 py-1 rounded">
                      {production.badge}
                    </span>
                  </div>
                )}
              </Card>
            </Link>
          </motion.div>
        ))}

        {/* Upcoming Projects section (previously Short Courses) */}
        {shortCourses && shortCourses.courses.length > 0 && (
          <motion.div
            className="lg:col-span-3 mt-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-2xl font-medium mb-8 text-film-black-900 dark:text-white">
              {shortCourses.title}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {shortCourses.courses.map((project, index) => (
                <Link
                  key={index}
                  href={project.href}
                  className="group focus:outline-none"
                >
                  <Card className="flex items-center justify-between p-6 group-hover:shadow-xl group-focus:ring-2 group-focus:ring-film-red-500">
                    <div>
                      <CardTitle className="group-hover:text-film-red-600 dark:group-hover:text-film-red-500 transition-colors">
                        {project.title}
                      </CardTitle>
                      <CardDescription>{project.description}</CardDescription>
                    </div>
                    <div className="p-2 bg-film-red-100 dark:bg-film-red-900/30 rounded-full group-hover:bg-film-red-200 dark:group-hover:bg-film-red-900/50 transition-colors">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-film-red-600 dark:text-film-red-400 transform group-hover:translate-x-1 transition-transform"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default CoursesGrid;

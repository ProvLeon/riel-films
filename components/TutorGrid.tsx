import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardImage,
  CardTitle,
} from "@/components/UI/Card";

interface Tutor {
  image: string;
  name: string;
  title: string;
  bio?: string;
}

interface TutorGridProps {
  tutors?: Tutor[];
  title?: string;
  description?: string;
  className?: string;
}

const TutorGrid: React.FC<TutorGridProps> = ({
  tutors,
  title = "Our Expert Tutors",
  description =
    "Our tutors are industry-acclaimed experts in their field, with a passion for passing on their knowledge to others.",
  className = "",
}) => {
  // Use the provided tutors or default to a predefined list
  const tutorsList: Tutor[] = tutors || [
    {
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/0a3a3c0bd3f40d759f038ee11e1353f5ab27ef524a2121c1f833d00eaf9b3280?placeholderIfAbsent=true&apiKey=931f40127e7944988057f598479fa95c",
      name: "Jon-Carlos Evans",
      title:
        "Programme Lead, Creative Production (Film); Tutor, Film Production",
    },
    {
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/fc9bf457f49ca08a8b034cf20e434887ae5aa1645bf36df24dee983494c122d3?placeholderIfAbsent=true&apiKey=931f40127e7944988057f598479fa95c",
      name: "Leandro Goddinho",
      title:
        "Programme Lead, Film Production; Tutor, Creative Production (Film)",
    },
    {
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/0508bf54dd69d7acb4b0fcfb090de6088e7f0c0feb26465e2b9ba5fa664d414d?placeholderIfAbsent=true&apiKey=931f40127e7944988057f598479fa95c",
      name: "Juli Saragosa",
      title:
        "Certificate Lead, Film Production; tutor, Creative Production (Film) MA",
    },
    {
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/9593ca3cced2d583c6c286801e6468f61d1c8db7f24c597917016d02b6da6e34?placeholderIfAbsent=true&apiKey=931f40127e7944988057f598479fa95c",
      name: "Shivani H",
      title:
        "Tutor, Creative Production (Film), Film Production & Visual Effects, Digital Arts & Animation",
    },
    {
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/cbf0ba5eab78f9adcea6232f45ac7b1f76c69a2168ef83dd4395c6700e86e38a?placeholderIfAbsent=true&apiKey=931f40127e7944988057f598479fa95c",
      name: "María Gisèle Royo",
      title: "Tutor, Creative Production (Film) and Film Production",
    },
    {
      image:
        "https://cdn.builder.io/api/v1/image/assets/TEMP/34a4c35bd30032a799694627a0b7d996678f8f26f67454a80b3034fbef54eb60?placeholderIfAbsent=true&apiKey=931f40127e7944988057f598479fa95c",
      name: "Marwa Zein",
      title: "Tutor, Creative Production (Film)",
    },
  ];

  return (
    <section
      className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ${className}`}
    >
      <div className="text-center mb-12">
        <motion.h2
          className="text-3xl md:text-4xl font-medium mb-4 text-film-black-900 dark:text-white"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h2>
        <motion.p
          className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          {description}
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {tutorsList.map((tutor, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="h-full flex flex-col">
              <CardImage
                src={tutor.image}
                alt={`Portrait of ${tutor.name}`}
                aspectRatio="aspect-square"
              />
              <CardContent className="flex-grow">
                <CardTitle>{tutor.name}</CardTitle>
                <CardDescription>{tutor.title}</CardDescription>
                {tutor.bio && (
                  <p className="mt-4 text-gray-700 dark:text-gray-300">
                    {tutor.bio}
                  </p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link
          href="/tutors"
          className="inline-flex items-center px-6 py-3 border border-film-black-900 dark:border-white text-film-black-900 dark:text-white font-medium rounded-full hover:bg-film-black-900 hover:text-white dark:hover:bg-white dark:hover:text-film-black-900 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-film-red-500"
        >
          View All Tutors
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 ml-2"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
};

export default TutorGrid;

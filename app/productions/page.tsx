"use client";
import React, { useState } from "react";
import { Card, CardContent, CardImage, CardTitle, CardDescription } from "@/components/UI/Card";
import { Button } from "@/components/UI/Button";
import Image from "next/image";
import Link from "next/link";
import PageTransition from "@/components/UI/PageTransition";
import SectionReveal from "@/components/UI/SectionReveal";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ArrowRight, ArrowUpRight, Clock, Calendar, AlertCircle, CheckCircle2, User, Award } from "lucide-react";

// Types for better modularity
interface Production {
  title: string;
  category: string;
  description: string;
  image: string;
}

interface CurrentProduction extends Production {
  status: string;
  progress: number;
  director: string;
  timeline: string;
  featured?: boolean;
}

interface CompletedProduction extends Production {
  year: number;
  awards: string;
}

interface CollaborationType {
  title: string;
  icon: string;
  description: string;
  benefits: string[];
}

interface ProcessStep {
  title: string;
  description: string;
  icon: string;
  activities: string[];
}

interface FAQ {
  q: string;
  a: string;
}

interface Testimonial {
  quote: string;
  author: string;
  position: string;
  image: string;
}

// Component for featured production card
const FeaturedProductionCard = ({ production }: { production: CurrentProduction }) => {
  const statusColor = (status: string) => {
    switch (status) {
      case "In Production":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "Pre-Production":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "Development":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-gray-50 dark:bg-film-black-900 rounded-2xl overflow-hidden shadow-lg">
      <div className="relative h-[300px] md:h-[400px] lg:h-full">
        <Image
          src={production.image}
          alt={production.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-film-red-600 text-white text-xs font-semibold">
          Featured Project
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/40 transition-all duration-300 opacity-0 hover:opacity-100">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-film-red-600/90 hover:bg-film-red-700 cursor-pointer transform hover:scale-105 transition-transform duration-300">
            <Play className="w-6 h-6 text-white ml-1" />
          </div>
        </div>
      </div>
      <div className="p-6 md:p-8 lg:p-10 flex flex-col justify-center">
        <div className="flex flex-wrap gap-3 items-center mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(production.status)}`}>
            {production.status}
          </span>
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {production.category}
          </span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-film-black-900 dark:text-white">
          {production.title}
        </h2>
        <p className="text-base md:text-lg text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
          {production.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-film-red-600" />
            <span className="text-sm text-gray-700 dark:text-gray-300">{production.timeline}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-film-red-600" />
            <span className="text-sm text-gray-700 dark:text-gray-300">Director: {production.director}</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600 dark:text-gray-400">Production Progress</span>
            <span className="font-medium text-film-red-600 dark:text-film-red-500">{production.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: '5%' }}
              animate={{ width: `${production.progress}%` }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              className="bg-film-red-600 dark:bg-film-red-500 h-3 rounded-full"
            />
          </div>
        </div>

        <Button variant="primary" className="self-start">
          <Link href="/contact" className="flex items-center">
            Request Updates
            <ArrowUpRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </div>
  );
};

// Component for current production card
const CurrentProductionCard = ({ production, index, onHover }: {
  production: CurrentProduction;
  index: number;
  onHover: (index: number | null) => void;
  isHovered?: boolean;
}) => {
  const statusColor = (status: string) => {
    switch (status) {
      case "In Production":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "Pre-Production":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300";
      case "Development":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  };

  return (
    <motion.div
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <Card className="h-full flex flex-col overflow-hidden relative shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="relative">
          <CardImage
            src={production.image}
            alt={production.title}
            aspectRatio="aspect-video"
          />
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end p-6 transition-opacity duration-300 opacity-0 hover:opacity-100`}
          >
            <Button variant="primary" size="sm" className="group">
              Learn More
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        <CardContent className="flex-grow">
          <div className="flex flex-wrap justify-between items-start gap-2 mb-3">
            <CardTitle className="text-film-black-900 dark:text-white text-xl">{production.title}</CardTitle>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColor(production.status)}`}>
              {production.status}
            </span>
          </div>
          <CardDescription className="mb-2">{production.category}</CardDescription>
          <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-3 text-sm">{production.description}</p>

          <div className="mt-auto pt-4 border-t border-gray-100 dark:border-film-black-800">
            <div className="flex items-center gap-2 mb-3 text-sm text-gray-600 dark:text-gray-400">
              <Clock className="w-4 h-4" />
              <span>{production.timeline}</span>
            </div>

            {/* Progress bar */}
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600 dark:text-gray-400">Progress</span>
                <span className="font-medium text-film-red-600 dark:text-film-red-500">{production.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: '5%' }}
                  animate={{ width: `${production.progress}%` }}
                  transition={{ duration: 0.8, delay: 0.2 * index, ease: "easeOut" }}
                  className="bg-film-red-600 dark:bg-film-red-500 h-2 rounded-full"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Component for completed production card
const CompletedProductionCard = ({ production }: { production: CompletedProduction }) => {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className="h-full flex flex-col overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="relative">
          <CardImage
            src={production.image}
            alt={production.title}
            aspectRatio="aspect-video"
          />
          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/90 dark:bg-film-black-800/90 backdrop-blur-sm text-xs font-medium text-film-black-900 dark:text-white">
            {production.year}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="w-14 h-14 flex items-center justify-center rounded-full bg-film-red-600/80 hover:bg-film-red-600 cursor-pointer backdrop-blur-sm transform hover:scale-105 transition-transform">
              <Play className="w-6 h-6 text-white ml-1" />
            </div>
          </div>
        </div>

        <CardContent className="flex-grow">
          <div className="mb-3">
            <CardTitle className="text-film-black-900 dark:text-white text-xl">{production.title}</CardTitle>
            <CardDescription className="mb-2">{production.category}</CardDescription>
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm line-clamp-3">{production.description}</p>

          <div className="mt-auto pt-4 border-t border-gray-100 dark:border-film-black-800">
            <div className="flex items-center gap-2 text-sm text-film-red-600 dark:text-film-red-500">
              <Award className="w-4 h-4" />
              <span>{production.awards}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

// Component for collaboration type card
const CollaborationCard = ({ collaboration, index }: { collaboration: CollaborationType, index: number }) => {
  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 12px 24px -10px rgba(0, 0, 0, 0.1)" }}
      transition={{ duration: 0.2 }}
      className="p-6 md:p-8 bg-gray-50 dark:bg-film-black-900 rounded-xl border border-gray-100 dark:border-film-black-800 h-full"
    >
      <div className="flex flex-col sm:flex-row gap-6 mb-6">
        <div className="w-16 h-16 flex-shrink-0 bg-film-red-100 dark:bg-film-red-900/30 rounded-full flex items-center justify-center">
          <Image src={collaboration.icon} width={32} height={32} alt={collaboration.title} />
        </div>
        <div>
          <h3 className="text-xl font-semibold mb-2 text-film-black-900 dark:text-white">{collaboration.title}</h3>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{collaboration.description}</p>
        </div>
      </div>

      <div className="pl-6 sm:pl-24">
        <h4 className="font-medium mb-3 text-film-black-900 dark:text-white">Key Benefits:</h4>
        <ul className="grid grid-cols-1 gap-2">
          {collaboration.benefits.map((benefit) => (
            <li key={benefit} className="flex items-center space-x-2">
              <CheckCircle2 className="text-film-red-600 dark:text-film-red-500 w-4 h-4 flex-shrink-0" />
              <span className="text-gray-700 dark:text-gray-300">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
};

// Component for process step
const ProcessStep = ({ step, index, totalSteps }: { step: ProcessStep; index: number; totalSteps: number }) => {
  const isEven = index % 2 === 0;

  return (
    <div className="lg:flex items-center lg:h-64">
      {/* Mobile step number and title */}
      <div className="lg:hidden flex items-center mb-4">
        <div className="w-10 h-10 rounded-full bg-film-red-600 text-white flex items-center justify-center text-lg font-bold mr-4">
          {index + 1}
        </div>
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-semibold text-film-black-900 dark:text-white">{step.title}</h3>
          <span className="text-2xl">{step.icon}</span>
        </div>
      </div>

      <div className={`lg:w-1/2 ${isEven ? 'lg:pr-20 lg:text-right' : 'lg:pl-20 order-1'} mb-6 lg:mb-0`}>
        <div className={`hidden lg:flex lg:items-center ${isEven ? 'lg:justify-end' : 'lg:justify-start'} mb-3 gap-3`}>
          <h3 className="text-2xl font-semibold text-film-black-900 dark:text-white">{step.title}</h3>
          <span className="text-3xl">{step.icon}</span>
        </div>
        <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">{step.description}</p>
        <div className={`flex flex-wrap gap-2 text-sm ${isEven ? 'lg:justify-end' : ''}`}>
          {step.activities.map((activity) => (
            <span
              key={activity}
              className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 dark:bg-film-black-800 text-gray-800 dark:text-gray-300"
            >
              <CheckCircle2 className="w-3 h-3 mr-1 text-film-red-600" />
              {activity}
            </span>
          ))}
        </div>
      </div>

      <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 items-center justify-center">
        <div className="w-12 h-12 rounded-full bg-film-red-600 text-white flex items-center justify-center text-lg font-bold shadow-lg">
          {index + 1}
        </div>
      </div>

      <div className={`lg:w-1/2 ${isEven ? 'hidden' : 'lg:pr-20'}`}>
        {!isEven && (
          <div className="h-full flex items-center">
            <div className="bg-gray-100 dark:bg-film-black-800 w-full h-40 md:h-48 rounded-lg relative overflow-hidden shadow-md">
              <Image
                src={`/images/process/step-${index + 1}.jpg`}
                alt={step.title}
                fill
                className="object-cover opacity-90 hover:opacity-100 transition-opacity"
                loading="lazy"
              />
            </div>
          </div>
        )}
      </div>

      <div className={`lg:w-1/2 ${isEven ? 'lg:pl-20' : 'hidden'}`}>
        {isEven && (
          <div className="h-full flex items-center">
            <div className="bg-gray-100 dark:bg-film-black-800 w-full h-40 md:h-48 rounded-lg relative overflow-hidden shadow-md">
              <Image
                src={`/images/process/step-${index + 1}.jpg`}
                alt={step.title}
                fill
                className="object-cover opacity-90 hover:opacity-100 transition-opacity"
                loading="lazy"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Component for FAQ card
const FAQCard = ({ faq }: { faq: FAQ }) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="bg-white dark:bg-film-black-900 p-6 rounded-lg border border-gray-200 dark:border-film-black-800 shadow-sm hover:shadow-md transition-all"
    >
      <h3 className="text-lg font-semibold mb-3 text-film-black-900 dark:text-white">{faq.q}</h3>
      <p className="text-gray-700 dark:text-gray-300">{faq.a}</p>
    </motion.div>
  );
};

// Component for testimonial card
const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
  return (
    <div className="bg-white dark:bg-film-black-900 p-6 rounded-xl shadow-sm h-full border border-gray-100 dark:border-film-black-800">
      <div className="flex items-start mb-4">
        <div className="text-film-red-600 dark:text-film-red-500 text-4xl">"</div>
      </div>
      <p className="text-gray-700 dark:text-gray-300 mb-6 italic">{testimonial.quote}</p>

      <div className="flex items-center mt-auto">
        <div className="w-12 h-12 rounded-full overflow-hidden mr-4">
          <Image
            src={testimonial.image}
            alt={testimonial.author}
            width={48}
            height={48}
            className="object-cover"
          />
        </div>
        <div>
          <div className="font-medium text-film-black-900 dark:text-white">{testimonial.author}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{testimonial.position}</div>
        </div>
      </div>
    </div>
  );
};

// Component for explore link card
const ExploreCard = ({ title, description, image, link, delay }: {
  title: string;
  description: string;
  image: string;
  link: string;
  delay: number;
}) => {
  return (
    <SectionReveal delay={delay}>
      <Link href={link}>
        <div className="group relative h-64 rounded-xl overflow-hidden shadow-md">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6">
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-white/80 text-sm mb-4">{description}</p>
            <div className="flex items-center text-film-red-500 text-sm font-medium">
              View {title}
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Link>
    </SectionReveal>
  );
};

// Main page component
const ProductionsPage = () => {
  const [activeTab, setActiveTab] = useState("current");
  const [hoveredProject, setHoveredProject] = useState<number | null>(null);

  // Data for current productions
  const currentProductions: CurrentProduction[] = [
    {
      title: "Voices of the Delta",
      category: "Documentary",
      status: "In Production",
      description: "A cinematic exploration of the vibrant communities along Ghana's Volta Delta and their resilience in the face of climate change.",
      image: "/images/productions/voices-delta.jpg",
      progress: 65,
      director: "Emmanuel Koffi",
      timeline: "Est. Completion: Q3 2023",
      featured: true
    },
    {
      title: "Market Queen",
      category: "Feature Film",
      status: "Pre-Production",
      description: "A powerful drama about a determined market woman's rise to become an influential leader in Kumasi's vibrant market scene.",
      image: "/images/productions/market-queen.jpg",
      progress: 30,
      director: "Ama Boateng",
      timeline: "Est. Completion: Q1 2024"
    },
    {
      title: "Diaspora Dreams",
      category: "Documentary Series",
      status: "Development",
      description: "A four-part series following African diaspora members as they reconnect with their ancestral homelands.",
      image: "/images/productions/diaspora-dreams.jpg",
      progress: 15,
      director: "Kofi Mensah",
      timeline: "Est. Completion: Q2 2024"
    }
  ];

  // Data for completed productions
  const completedProductions: CompletedProduction[] = [
    {
      title: "The River's Song",
      category: "Feature Film",
      year: 2022,
      awards: "Best African Film - Pan-African Film Festival",
      description: "A coming-of-age story set along the banks of the Volta River, where tradition meets modernity.",
      image: "/images/productions/rivers-song.jpg"
    },
    {
      title: "Highlife Origins",
      category: "Music Documentary",
      year: 2021,
      awards: "Official Selection - FESPACO",
      description: "An exploration of Ghana's influential highlife music and its impact on global music trends.",
      image: "/images/productions/highlife-origins.jpg"
    },
    {
      title: "Accra Dreams",
      category: "Short Film Collection",
      year: 2020,
      awards: "Special Mention - African Film Festival",
      description: "A collection of five short films capturing the diverse experiences of life in Ghana's vibrant capital.",
      image: "/images/productions/accra-dreams.jpg"
    }
  ];

  // Data for collaboration types
  const collaborationTypes: CollaborationType[] = [
    {
      title: "Co-Production",
      icon: "/images/icons/co-production.svg",
      description: "Partner with us to co-produce feature films, documentaries, or series that align with our vision for authentic African storytelling.",
      benefits: ["Shared creative control", "Combined resources", "Access to diverse markets"]
    },
    {
      title: "Distribution",
      icon: "/images/icons/distribution.svg",
      description: "Help bring our completed films to audiences worldwide through theatrical, streaming, or broadcast partnerships.",
      benefits: ["Exclusive content", "Cultural diversity", "Award-winning productions"]
    },
    {
      title: "Production Services",
      icon: "/images/icons/production-services.svg",
      description: "Utilize our local knowledge, production expertise, and networks for your production needs in Ghana and across West Africa.",
      benefits: ["Local expertise", "Experienced crews", "Logistical support"]
    },
    {
      title: "Talent Development",
      icon: "/images/icons/talent.svg",
      description: "Support our initiatives to train and develop emerging African filmmaking talent through workshops and mentorship programs.",
      benefits: ["Community impact", "Talent discovery", "Sustainable industry growth"]
    }
  ];

  // Data for process steps
  const processSteps: ProcessStep[] = [
    {
      title: "Development",
      description: "During this phase, we focus on story development, script writing, research, and securing initial funding. We identify authentic stories that represent the diversity and richness of African experiences.",
      icon: "📝",
      activities: ["Story development", "Screenwriting", "Research", "Initial funding"]
    },
    {
      title: "Pre-Production",
      description: "We assemble our creative team, cast actors, scout locations, plan logistics, create shot lists and schedules, and finalize all preparations before filming begins.",
      icon: "🎬",
      activities: ["Casting", "Location scouting", "Crew assembly", "Production planning"]
    },
    {
      title: "Production",
      description: "The filming process begins, where our local expertise and connections shine. We capture authentic moments and stories with respect for cultural nuances and community engagement.",
      icon: "🎥",
      activities: ["Principal photography", "Direction", "Cinematography", "Sound recording"]
    },
    {
      title: "Post-Production",
      description: "We edit, add sound design, music, color grading, and finalize our productions with meticulous attention to detail.",
      icon: "✂️",
      activities: ["Editing", "Sound design", "Music scoring", "Color grading"]
    },
    {
      title: "Distribution",
      description: "We work with our partners to distribute the finished work to audiences worldwide through festivals, theatrical release, streaming platforms, and more.",
      icon: "🌍",
      activities: ["Festival submissions", "Theatrical release", "Streaming platforms", "Community screenings"]
    }
  ];

  // Data for FAQs
  const faqs: FAQ[] = [
    {
      q: "How can I submit a film idea or script?",
      a: "We welcome submissions from writers and filmmakers. Please visit our Contact page and select the 'Project Submission' option to share your idea with our team."
    },
    {
      q: "Do you offer production services for international crews?",
      a: "Yes, we provide comprehensive production services for international crews filming in Ghana and other parts of West Africa, including permits, location scouting, and crew hiring."
    },
    {
      q: "How can I invest in a Riel Films production?",
      a: "We're open to investment partnerships for our upcoming productions. Please contact our production office through the Contact page to discuss investment opportunities."
    },
    {
      q: "Do you hire local talent and crew?",
      a: "Absolutely. We're committed to developing local talent and primarily work with crews and actors from Ghana and across Africa while providing training and growth opportunities."
    }
  ];

  // Data for testimonials
  const testimonials: Testimonial[] = [
    {
      quote: "Working with Riel Films opened my eyes to the incredible talent pool in Ghana. Their dedication to authentic storytelling is unmatched.",
      author: "Sarah Johnson",
      position: "Executive Producer, Global Films",
      image: "/images/testimonials/person-1.jpg"
    },
    {
      quote: "The team's deep understanding of West African cultures and their technical expertise made our documentary project a resounding success.",
      author: "Kwame Nkrumah",
      position: "Director, African Heritage Films",
      image: "/images/testimonials/person-2.jpg"
    },
    {
      quote: "Riel Films provided exceptional production services. Their local knowledge and professional crew made filming in Ghana seamless.",
      author: "Maria Rodriguez",
      position: "Location Manager, International Productions",
      image: "/images/testimonials/person-3.jpg"
    }
  ];

  // Data for explore links
  const exploreLinks = [
    {
      title: "Our Films",
      description: "Explore our completed film projects and award-winning works",
      image: "/images/productions/explore-films.jpg",
      link: "/films"
    },
    {
      title: "Meet Our Team",
      description: "Get to know the creatives behind our productions",
      image: "/images/productions/explore-team.jpg",
      link: "/about"
    },
    {
      title: "Get In Touch",
      description: "Contact us for collaborations, projects or inquiries",
      image: "/images/productions/explore-contact.jpg",
      link: "/contact"
    }
  ];

  // Find the featured production
  const featuredProduction = currentProductions.find(p => p.featured);

  // Filter current productions excluding the featured one
  const nonFeaturedProductions = currentProductions.filter(p => !p.featured);

  return (
    <PageTransition>
      <div className="min-h-screen bg-white dark:bg-film-black-950">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 lg:py-32 overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-film-black-950/90 to-film-black-900/70 z-10" />
            <Image
              src="/images/hero/hero9.jpg"
              alt="Production Background"
              fill
              className="object-cover object-center"
              priority
            />
          </div>

          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl">
              <SectionReveal>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
                  Our <span className="text-film-red-500">Productions</span>
                </h1>
              </SectionReveal>

              <SectionReveal delay={0.1}>
                <p className="text-lg md:text-xl dark:text-gray-200 text-gray-600 mb-8 leading-relaxed">
                  From concept to screen, we bring authentic African stories to life through
                  compelling narratives and visually stunning cinematography.
                </p>
              </SectionReveal>

              <SectionReveal delay={0.2}>
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary" className="group">
                    <Link href="#current-projects" className="flex items-center">
                      View Current Projects
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                  <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                    <Link href="/films">Explore Completed Films</Link>
                  </Button>
                </div>
              </SectionReveal>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6">
          {/* Projects Tabs Section */}
          <section id="current-projects" className="mb-16 md:mb-24 pt-4 md:pt-0 scroll-mt-24">
            <SectionReveal>
              <div className="mb-8 border-b border-gray-200 dark:border-film-black-800">
                <div className="flex space-x-4 md:space-x-8 overflow-x-auto scrollbar-hide">
                  <button
                    onClick={() => setActiveTab("current")}
                    aria-selected={activeTab === "current"}
                    className={`py-4 px-1 text-lg font-medium relative ${activeTab === "current"
                      ? "text-film-red-600 dark:text-film-red-500"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      }`}
                  >
                    Current Projects
                    {activeTab === "current" && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-film-red-600 dark:bg-film-red-500"
                      />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab("completed")}
                    aria-selected={activeTab === "completed"}
                    className={`py-4 px-1 text-lg font-medium relative whitespace-nowrap ${activeTab === "completed"
                      ? "text-film-red-600 dark:text-film-red-500"
                      : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      }`}
                  >
                    Completed Productions
                    {activeTab === "completed" && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-film-red-600 dark:bg-film-red-500"
                      />
                    )}
                  </button>
                </div>
              </div>
            </SectionReveal>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="mb-16"
              >
                {activeTab === "current" ? (
                  <>
                    {/* Featured Project */}
                    {featuredProduction && (
                      <SectionReveal delay={0.1}>
                        <div className="mb-16">
                          <FeaturedProductionCard production={featuredProduction} />
                        </div>
                      </SectionReveal>
                    )}

                    {/* Other Current Projects */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                      {nonFeaturedProductions.map((production, index) => (
                        <SectionReveal key={production.title} delay={0.1 * (index % 3)}>
                          <CurrentProductionCard
                            production={production}
                            index={index}
                            onHover={setHoveredProject}
                          />
                        </SectionReveal>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {completedProductions.map((production, index) => (
                      <SectionReveal key={production.title} delay={0.1 * (index % 3)}>
                        <CompletedProductionCard production={production} />
                      </SectionReveal>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </section>

          {/* Production Process */}
          <section className="mb-16 md:mb-24">
            <SectionReveal>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 text-film-black-900 dark:text-white">Our Production Process</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-10 max-w-3xl">
                From initial concept to final distribution, we follow a comprehensive approach to ensure each production meets our high standards for authentic storytelling and cinematic excellence.
              </p>
            </SectionReveal>

            <div className="relative">
              <div className="hidden lg:block absolute left-1/2 top-12 bottom-12 w-1 bg-gradient-to-b from-film-red-600/20 via-film-red-600 to-film-red-600/20 transform -translate-x-1/2" />

              <div className="space-y-16 lg:space-y-0">
                {processSteps.map((step, index) => (
                  <SectionReveal
                    key={step.title}
                    delay={0.1 * index}
                    direction={index % 2 === 0 ? "left" : "right"}
                  >
                    <ProcessStep step={step} index={index} totalSteps={processSteps.length} />
                  </SectionReveal>
                ))}
              </div>
            </div>
          </section>

          {/* Collaboration Opportunities */}
          <section className="mb-16 md:mb-24">
            <SectionReveal>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-2 text-film-black-900 dark:text-white">
                    Collaboration Opportunities
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                    Partner with us to bring authentic African stories to global audiences through various collaboration models.
                  </p>
                </div>
                <Button variant="primary" className="mt-4 md:mt-0">
                  <Link href="/contact" className="flex items-center">
                    Discuss a Collaboration
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </SectionReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {collaborationTypes.map((collab, index) => (
                <SectionReveal
                  key={collab.title}
                  delay={0.1 * (index % 2)}
                  direction={index % 2 === 0 ? "left" : "right"}
                >
                  <CollaborationCard collaboration={collab} index={index} />
                </SectionReveal>
              ))}
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mb-16 md:mb-24">
            <SectionReveal>
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-film-black-900 dark:text-white">
                Frequently Asked Questions
              </h2>
            </SectionReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faqs.map((faq, index) => (
                <SectionReveal key={index} delay={0.1 * (index % 2)}>
                  <FAQCard faq={faq} />
                </SectionReveal>
              ))}
            </div>

            <SectionReveal delay={0.4}>
              <div className="text-center mt-10">
                <Button variant="secondary" className="group">
                  <Link href="/contact" className="flex items-center">
                    More Questions? Contact Us
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </div>
            </SectionReveal>
          </section>

          {/* Call to Action */}
          <section className="mb-16 md:mb-24">
            <SectionReveal direction="up">
              <div className="relative overflow-hidden rounded-2xl">
                <div className="absolute inset-0 -z-10">
                  <div className="absolute inset-0 bg-gradient-to-r from-film-red-800 to-film-black-900 dark:from-film-red-900 dark:to-film-black-950 opacity-95 z-10"></div>
                  <Image
                    src="/images/productions/cta-bg.jpg"
                    alt="Production scene"
                    fill
                    className="object-cover object-center"
                    loading="eager"
                  />
                </div>

                <div className="relative z-10 p-8 md:p-12 lg:p-16">
                  <div className="max-w-3xl mx-auto text-center">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.6 }}
                    >
                      <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4 text-white">
                        Have a project in mind?
                      </h2>
                      <p className="mb-8 text-white/90 text-base md:text-lg leading-relaxed">
                        Whether you're looking to collaborate on a production, distribute a film, or utilize our production services in Ghana, we'd love to hear from you.
                      </p>
                      <div className="flex flex-wrap justify-center gap-4">
                        <Button variant="primary" size="lg" className="group">
                          <Link href="/contact" className="flex items-center">
                            Start a Conversation
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                          </Link>
                        </Button>
                        <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white/10">
                          <Link href="/about">Learn About Our Team</Link>
                        </Button>
                      </div>

                      <div className="mt-8 flex items-center justify-center gap-6">
                        <div className="flex -space-x-4">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                              <Image
                                src={`/images/hero/hero${i}.jpg`}
                                alt={`Team member ${i}`}
                                width={40}
                                height={40}
                                className="object-cover"
                              />
                            </div>
                          ))}
                        </div>
                        <span className="text-white/80 text-sm">
                          Join our growing team of partners and collaborators
                        </span>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </SectionReveal>
          </section>

          {/* Partners Section */}
          <section className="mb-16 md:mb-24">
            <SectionReveal>
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-film-black-900 dark:text-white text-center">
                Our Partners & Collaborators
              </h2>
            </SectionReveal>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 md:gap-8">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <SectionReveal key={i} delay={0.05 * i}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-center h-20 md:h-24 bg-white dark:bg-film-black-900 rounded-lg p-4 md:p-6 grayscale  transition-all shadow-sm hover:shadow-md "
                  >
                    <Image
                      src={`/images/partners/partner-${i}.png`}
                      alt={`Partner ${i}`}
                      width={120}
                      height={60}
                      className="object-contain max-h-18 dark:filter dark:brightness-1 dark:invert dark:hover:brightness-100 dark:hover:invert"
                    />
                  </motion.div>
                </SectionReveal>
              ))}
            </div>
          </section>
        </div>

        {/* Video Reel Section */}
        <section className="py-16 md:py-24 bg-gray-50 dark:bg-film-black-900">
          <div className="container mx-auto px-4 sm:px-6">
            <SectionReveal>
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-film-black-900 dark:text-white">
                  Our Production Reel
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  A glimpse into our filmmaking process and the stories we bring to life across Ghana and beyond.
                </p>
              </div>
            </SectionReveal>

            <SectionReveal delay={0.2}>
              <div className="relative rounded-xl overflow-hidden shadow-xl max-w-4xl mx-auto aspect-video">
                <div className="absolute inset-0 bg-black flex items-center justify-center">
                  {/* This would typically be a video component */}
                  <div className="relative w-full h-full">
                    <Image
                      src="/images/productions/reel-cover.jpg"
                      alt="Production Reel"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <motion.div
                        whileHover={{ scale: 1.1 }}
                        className="w-20 h-20 flex items-center justify-center rounded-full bg-film-red-600 hover:bg-film-red-700 cursor-pointer transition-colors"
                      >
                        <Play className="w-8 h-8 text-white ml-1" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </SectionReveal>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4 sm:px-6">
            <SectionReveal>
              <div className="text-center mb-10">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-film-black-900 dark:text-white">
                  What People Are Saying
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  Hear from industry professionals who have worked with us on various projects.
                </p>
              </div>
            </SectionReveal>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, index) => (
                <SectionReveal key={index} delay={0.1 * index}>
                  <TestimonialCard testimonial={testimonial} />
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="bg-gray-50 dark:bg-film-black-900 py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <SectionReveal>
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-film-black-900 dark:text-white">
                  Stay Updated on Our Productions
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  Subscribe to our newsletter for exclusive updates, behind-the-scenes content, and news about upcoming productions.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="flex-grow px-4 py-3 rounded-lg border border-gray-300 dark:border-film-black-700 dark:bg-film-black-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-film-red-500"
                  />
                  <Button variant="primary" className="whitespace-nowrap">
                    Subscribe Now
                  </Button>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </div>
            </SectionReveal>
          </div>
        </section>

        {/* Related Links */}
        <section className="py-16">
          <div className="container mx-auto px-4 sm:px-6">
            <SectionReveal>
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-film-black-900 dark:text-white">
                Explore More
              </h2>
            </SectionReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {exploreLinks.map((link, index) => (
                <ExploreCard
                  key={index}
                  title={link.title}
                  description={link.description}
                  image={link.image}
                  link={link.link}
                  delay={0.1 * (index + 1)}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default ProductionsPage;

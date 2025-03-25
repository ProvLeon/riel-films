"use client";
import React, { useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import PageTransition from "@/components/UI/PageTransition";
import SectionReveal from "@/components/UI/SectionReveal";
import { Button } from "@/components/UI/Button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Play, Share2, Award, Calendar, Clock, User, ChevronDown, Star, ChevronRight } from "lucide-react";

// Import production page utils
const films = [
  {
    id: 1,
    title: "The River's Song",
    category: "Feature Film",
    year: "2023",
    description: "A lyrical journey through Ghana's river communities as they face environmental challenges and preserve traditions.",
    longDescription: "In 'The River's Song,' we explore the delicate balance between tradition and change along Ghana's vital river systems. This documentary presents an intimate portrait of communities whose way of life is being transformed by environmental shifts and modernization, while also celebrating the cultural resilience and adaptive strategies that have sustained these communities for generations.",
    image: "/images/films/rivers-song.jpg",
    slug: "rivers-song",
    director: "Emmanuel Koffi",
    producer: "Nana Adwoa",
    duration: "98 minutes",
    languages: ["Twi", "English"],
    subtitles: ["English", "French", "Spanish"],
    releaseDate: "March 15, 2023",
    awards: ["Best Documentary - Pan African Film Festival", "Special Mention - Berlin International Film Festival"],
    castCrew: [
      { role: "Director", name: "Emmanuel Koffi" },
      { role: "Producer", name: "Nana Adwoa" },
      { role: "Cinematographer", name: "Kofi Mensah" },
      { role: "Editor", name: "Efua Owusu" },
      { role: "Sound Design", name: "Joseph Quarcoo" }
    ],
    gallery: [
      "/images/hero/hero1.jpg",
      "/images/hero/hero8.jpg",
      "/images/hero/hero3.jpg",
      "/images/hero/hero6.jpg"
    ],
    trailer: "https://www.youtube.com/watch?v=example",
    synopsis: "When a series of environmental changes threaten the traditional fishing practices of a small Ghanaian river community, a young fisher named Kwame must navigate between preserving his family's traditions and embracing new methods for survival. As he journeys along the river seeking solutions, he encounters various communities each responding differently to similar challenges, while an unexpected connection with a visiting environmental researcher opens his eyes to both the global context of local problems and possible sustainable paths forward.",
    quotes: [
      {
        text: "A visually stunning and deeply moving portrait of communities at the crossroads of tradition and environmental change.",
        source: "African Film Journal"
      },
      {
        text: "Koffi's direction creates an intimate window into lives rarely seen on screen, giving voice to communities often overlooked.",
        source: "Global Documentary Review"
      }
    ],
    rating: 4.8
  },
  {
    id: 2,
    title: "Golden Dust",
    category: "Feature Film",
    year: "2022",
    description: "The untold story of Ghana's gold mining history through the eyes of three generations of a family in Obuasi.",
    longDescription: "Golden Dust weaves together personal narrative and historical documentation to tell the complex story of gold mining in Ghana, from traditional methods to industrial exploitation. Through the experiences of the Mensah family, whose three generations have worked in different capacities within the mining sector, the film examines questions of heritage, economic necessity, environmental impact, and the ongoing legacy of colonialism in resource extraction.",
    image: "/images/films/golden-dust.jpg",
    slug: "golden-dust",
    director: "Ama Boateng",
    producer: "Emmanuel Koffi",
    duration: "112 minutes",
    languages: ["Twi", "English"],
    subtitles: ["English", "French", "German"],
    releaseDate: "October 7, 2022",
    awards: ["Best Cinematography - African Movie Academy Awards"],
    castCrew: [
      { role: "Director", name: "Ama Boateng" },
      { role: "Producer", name: "Emmanuel Koffi" },
      { role: "Writer", name: "Kwame Nsiah" },
      { role: "Cinematographer", name: "Kofi Mensah" },
      { role: "Production Designer", name: "Abena Osei" }
    ],
    gallery: [
      "/images/hero/hero2.jpg",
      "/images/hero/hero4.jpg",
      "/images/hero/hero7.jpg",
      "/images/hero/hero9.jpg"
    ],
    trailer: "https://www.youtube.com/watch?v=example2",
    synopsis: "In the historic mining town of Obuasi, Solomon Mensah prepares to retire after 40 years working in the industrial gold mines. His father before him was a traditional gold panner, while his daughter studies environmental science with plans to address mining pollution. When Solomon discovers old family documents revealing their ancestral land was appropriated for the mine he dedicated his life to, the family faces difficult questions about heritage, livelihood, and justice. Their personal journey mirrors Ghana's complex relationship with its most valuable natural resource and the foreign interests that continue to influence its extraction.",
    quotes: [
      {
        text: "A nuanced exploration of how gold has shaped not only Ghana's economy but the very identity of communities built around its extraction.",
        source: "Mining World Magazine"
      },
      {
        text: "Boateng's direction strikes a perfect balance between family drama and social commentary, resulting in a film that is both intimately personal and broadly relevant.",
        source: "West African Cinema Review"
      }
    ],
    rating: 4.6
  },
  {
    id: 3,
    title: "Market Tales",
    category: "Documentary Series",
    year: "2022",
    description: "A vibrant exploration of West Africa's iconic markets and the entrepreneurs who bring them to life.",
    longDescription: "Market Tales is an immersive documentary series that takes viewers into the heart of West Africa's bustling marketplaces. Each episode focuses on a different iconic market, from Ghana's Kejetia Market to Senegal's Sandaga Market, exploring the economic ecosystems, cultural significance, and personal stories of the traders who form the backbone of local economies. The series celebrates entrepreneurship, resilience, and the rich tapestry of West African commerce.",
    image: "/images/films/market-tales.jpg",
    slug: "market-tales",
    director: "Kofi Mensah",
    producer: "Nana Adwoa",
    duration: "6 episodes, 45 minutes each",
    languages: ["Multiple West African languages", "English"],
    subtitles: ["English", "French", "Portuguese"],
    releaseDate: "August 12, 2022",
    awards: ["Audience Award - African Diaspora International Film Festival"],
    castCrew: [
      { role: "Creator & Director", name: "Kofi Mensah" },
      { role: "Producer", name: "Nana Adwoa" },
      { role: "Research Coordinator", name: "Fatou Diallo" },
      { role: "Sound Recordist", name: "Joseph Quarcoo" },
      { role: "Editor", name: "Efua Owusu" }
    ],
    gallery: [
      "/images/hero/hero5.jpg",
      "/images/hero/hero10.jpg",
      "/images/hero/hero11.jpg",
      "/images/hero/hero12.jpg"
    ],
    trailer: "https://www.youtube.com/watch?v=example3",
    synopsis: "Market Tales journeys through six of West Africa's most vibrant and culturally significant marketplaces, revealing the intricate networks, generational knowledge, and entrepreneurial spirit that power these economic hubs. Each episode profiles different traders—from the fabric merchants of Mali's Grand Market to the tech dealers of Ghana's Makola—exploring how traditional commerce intersects with globalization, digital innovation, and changing consumer habits. Throughout the series, we discover how these markets serve not only as places of transaction but as vital social institutions where cultures blend, information flows, and communities are sustained.",
    quotes: [
      {
        text: "A celebration of entrepreneurial spirit and cultural heritage that will forever change how you see African marketplaces.",
        source: "Documentary World"
      },
      {
        text: "Vibrant, informative, and deeply respectful of its subjects, Market Tales achieves that rare balance of being both educational and thoroughly entertaining.",
        source: "Global Streaming Guide"
      }
    ],
    rating: 4.7
  }
];

const FilmDetailPage = ({ params }: { params: { slug: string } }) => {
  const [activeTab, setActiveTab] = useState<'about' | 'details' | 'gallery'>('about');
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [activeGalleryImage, setActiveGalleryImage] = useState(0);
  const [showShareOptions, setShowShareOptions] = useState(false);

  // Unwrap params using React.use
  const slug = use(params).slug;

  // Find the requested film from our data
  const film = films.find((film) => film.slug === slug);

  // Find other films by same director (excluding current)
  const otherFilmsByDirector = films
    .filter((f) => f.director === film?.director && f.slug !== slug)
    .slice(0, 2);

  // If film doesn't exist, show 404
  if (!film) {
    notFound();
  }

  // Toggle trailer modal
  const toggleTrailer = () => {
    setTrailerOpen(!trailerOpen);
    // When closing trailer, ensure body scroll is restored
    if (trailerOpen) {
      document.body.style.overflow = "auto";
    } else {
      document.body.style.overflow = "hidden";
    }
  };

  // Toggle share options
  const toggleShareOptions = () => {
    setShowShareOptions(!showShareOptions);
  };

  // Share film
  const shareFilm = (platform: string) => {
    const url = window.location.href;
    const text = `Check out this film: ${film.title}`;

    switch (platform) {
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`);
        break;
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`);
        break;
      case "linkedin":
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`);
        break;
      case "email":
        window.open(`mailto:?subject=${text}&body=${url}`);
        break;
      default:
        // Copy to clipboard
        navigator.clipboard.writeText(url);
    }

    setShowShareOptions(false);
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-white dark:bg-film-black-950 pt-24 pb-20">
        {/* Hero section */}
        <div className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden">
          {/* Background image with gradient overlay */}
          <Image
            src={film.image}
            alt={film.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-film-black-950 via-film-black-900/70 to-transparent">
            <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-12">
              <SectionReveal>
                <div className="max-w-4xl">
                  <div className="flex items-center mb-4">
                    <Link href="/films" className="flex items-center text-white hover:text-film-red-400 transition-colors">
                      <ArrowLeft className="mr-2 h-5 w-5" />
                      <span>Back to Films</span>
                    </Link>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className="inline-block px-3 py-1 bg-film-red-600 text-white text-sm font-medium rounded-full">
                      {film.category}
                    </span>
                    <span className="text-white text-opacity-90">{film.year}</span>
                    <div className="flex items-center text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="ml-1 text-white">{film.rating}/5</span>
                    </div>
                  </div>
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                    {film.title}
                  </h1>
                  <p className="text-lg md:text-xl text-white text-opacity-90 max-w-3xl mb-8">
                    {film.description}
                  </p>
                  <div className="flex flex-wrap gap-4 relative">
                    <Button
                      variant="primary"
                      onClick={toggleTrailer}
                      className="group"
                    >
                      <Play className="mr-2 h-5 w-5" />
                      Watch Trailer
                    </Button>
                    <div className="relative">
                      <Button
                        variant="outline"
                        onClick={toggleShareOptions}
                        className="bg-transparent text-white hover:bg-white/10"
                      >
                        <Share2 className="mr-2 h-5 w-5" />
                        Share
                      </Button>

                      {/* Share options popup */}
                      <AnimatePresence>
                        {showShareOptions && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="absolute left-36 -top-10 mt-2 bg-white dark:bg-film-black-800 rounded-xl p-4 shadow-lg z-50 mb-12"
                            style={{ minWidth: '200px' }}
                          >
                            <div className="flex gap-2 flex-wrap">
                              <button
                                onClick={() => shareFilm("twitter")}
                                className="p-2 bg-[#1DA1F2] text-white rounded-full hover:bg-opacity-90 transition-colors"
                                aria-label="Share on Twitter"
                              >
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                                </svg>
                              </button>
                              <button
                                onClick={() => shareFilm("facebook")}
                                className="p-2 bg-[#1877F2] text-white rounded-full hover:bg-opacity-90 transition-colors"
                                aria-label="Share on Facebook"
                              >
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                                </svg>
                              </button>
                              <button
                                onClick={() => shareFilm("copy")}
                                className="p-2 bg-gray-400 dark:bg-gray-700 text-white rounded-full hover:bg-opacity-90 transition-colors"
                                aria-label="Copy Link"
                              >
                                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              </button>
                            </div>
                            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                              <button
                                onClick={() => shareFilm("copy")}
                                className="text-sm text-gray-600 dark:text-gray-300 hover:text-film-red-600 dark:hover:text-film-red-500"
                              >
                                Copy link to clipboard
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </div>
              </SectionReveal>
            </div>
          </div>
        </div>

        {/* Content section */}
        <div className="container mx-auto px-4 py-12">
          {/* Navigation tabs */}
          <div className="border-b border-gray-200 dark:border-film-black-800 mb-12">
            <nav className="flex space-x-8 overflow-x-auto scrollbar-hide">
              <button
                className={`py-4 px-2 font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'about'
                  ? 'border-film-red-600 text-film-red-600 dark:border-film-red-500 dark:text-film-red-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                onClick={() => setActiveTab('about')}
              >
                About
              </button>
              <button
                className={`py-4 px-2 font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'details'
                  ? 'border-film-red-600 text-film-red-600 dark:border-film-red-500 dark:text-film-red-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                onClick={() => setActiveTab('details')}
              >
                Cast & Crew
              </button>
              <button
                className={`py-4 px-2 font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'gallery'
                  ? 'border-film-red-600 text-film-red-600 dark:border-film-red-500 dark:text-film-red-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                onClick={() => setActiveTab('gallery')}
              >
                Gallery
              </button>
            </nav>
          </div>

          {/* Tab content */}
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main content area */}
            <div className="lg:w-2/3">
              <AnimatePresence mode="wait">
                {activeTab === 'about' && (
                  <motion.div
                    key="about"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SectionReveal>
                      <div className="mb-10">
                        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-film-black-900 dark:text-white">Synopsis</h2>
                        <div className="prose prose-lg dark:prose-invert">
                          <p>{film.synopsis}</p>
                        </div>
                      </div>

                      {/* Awards section */}
                      {film.awards && film.awards.length > 0 && (
                        <div className="mb-10 pt-6 border-t border-gray-200 dark:border-film-black-800">
                          <h2 className="text-2xl font-bold mb-6 text-film-black-900 dark:text-white flex items-center">
                            <Award className="mr-2 h-6 w-6 text-film-red-500" />
                            Awards & Recognition
                          </h2>
                          <ul className="space-y-3">
                            {film.awards.map((award, index) => (
                              <li key={index} className="flex items-start">
                                <div className="bg-film-red-100 dark:bg-film-red-900/30 rounded-full p-1 mr-3 mt-1">
                                  <Star className="h-4 w-4 text-film-red-600 dark:text-film-red-400" />
                                </div>
                                <span className="text-gray-800 dark:text-gray-200">{award}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Reviews/Quotes section */}
                      {film.quotes && film.quotes.length > 0 && (
                        <div className="mb-10 pt-6 border-t border-gray-200 dark:border-film-black-800">
                          <h2 className="text-2xl font-bold mb-6 text-film-black-900 dark:text-white">
                            Critical Reception
                          </h2>
                          <div className="space-y-6">
                            {film.quotes.map((quote, index) => (
                              <blockquote key={index} className="border-l-4 border-film-red-500 pl-6 py-2 italic">
                                <p className="text-lg text-gray-800 dark:text-gray-200">"{quote.text}"</p>
                                <footer className="mt-2 text-right text-gray-600 dark:text-gray-400 not-italic">
                                  — {quote.source}
                                </footer>
                              </blockquote>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Director's statement - A fictional section */}
                      <div className="mb-10 pt-6 border-t border-gray-200 dark:border-film-black-800">
                        <h2 className="text-2xl font-bold mb-6 text-film-black-900 dark:text-white">
                          Director's Statement
                        </h2>
                        <div className="mb-6 flex items-center">
                          <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 relative mr-4">
                            <Image
                              src="/images/hero/hero3.jpg"
                              alt={film.director}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="font-bold text-lg text-film-black-900 dark:text-white">{film.director}</h3>
                            <p className="text-gray-600 dark:text-gray-400">Director</p>
                          </div>
                        </div>
                        <div className="prose prose-lg dark:prose-invert">
                          <p>
                            "Creating {film.title} has been a profound journey of discovery and connection.
                            Through this film, we sought to capture not just the visual beauty of Ghana, but the
                            complex emotional landscapes of communities experiencing rapid change.
                          </p>
                          <p>
                            Our approach was one of deep listening and collaborative storytelling. We worked closely
                            with local communities, ensuring their voices were not just included but centered in the narrative.
                            The result is a film that balances artistic vision with authentic representation.
                          </p>
                          <p>
                            I hope audiences will come away with both a deeper appreciation for these
                            stories and a recognition of our shared humanity across cultural boundaries."
                          </p>
                        </div>
                      </div>
                    </SectionReveal>
                  </motion.div>
                )}

                {activeTab === 'details' && (
                  <motion.div
                    key="details"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SectionReveal>
                      {/* Cast & Crew section */}
                      <div className="mb-10">
                        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-film-black-900 dark:text-white">
                          Cast & Crew
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {film.castCrew.map((person, index) => (
                            <div key={index} className="flex items-center p-4 bg-gray-50 dark:bg-film-black-900 rounded-lg">
                              <div className="w-12 h-12 bg-film-red-100 dark:bg-film-red-900/30 rounded-full flex items-center justify-center mr-4">
                                <span className="text-film-red-600 dark:text-film-red-400 font-medium">
                                  {person.name.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <h3 className="font-medium text-film-black-900 dark:text-white">
                                  {person.name}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 text-sm">
                                  {person.role}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Film details */}
                      <div className="mb-10 pt-6 border-t border-gray-200 dark:border-film-black-800">
                        <h2 className="text-2xl font-bold mb-6 text-film-black-900 dark:text-white">
                          Film Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-16">
                          <div>
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                              Runtime
                            </h3>
                            <p className="text-gray-900 dark:text-gray-100">{film.duration}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                              Release Date
                            </h3>
                            <p className="text-gray-900 dark:text-gray-100">{film.releaseDate}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                              Languages
                            </h3>
                            <p className="text-gray-900 dark:text-gray-100">{film.languages.join(', ')}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                              Subtitles
                            </h3>
                            <p className="text-gray-900 dark:text-gray-100">{film.subtitles.join(', ')}</p>
                          </div>
                        </div>
                      </div>

                      {/* Production details - A fictional section */}
                      <div className="mb-10 pt-6 border-t border-gray-200 dark:border-film-black-800">
                        <h2 className="text-2xl font-bold mb-6 text-film-black-900 dark:text-white">
                          Production Notes
                        </h2>
                        <div className="prose prose-lg dark:prose-invert">
                          <p>
                            {film.title} was filmed over a period of eight weeks in various locations across Ghana.
                            The production employed over 60 local crew members and featured numerous community participants
                            who shared their stories and expertise.
                          </p>
                          <p>
                            Special attention was paid to environmental sustainability during production, with the team
                            implementing a comprehensive carbon offset program and minimizing single-use plastics on set.
                            The film was produced with support from the Ghana Film Authority and received partial funding
                            from the Pan-African Film Fund.
                          </p>
                        </div>
                      </div>
                    </SectionReveal>
                  </motion.div>
                )}

                {activeTab === 'gallery' && (
                  <motion.div
                    key="gallery"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <SectionReveal>
                      {/* Featured image */}
                      <div className="relative aspect-video w-full overflow-hidden rounded-xl">
                        <Image
                          src={film.gallery[activeGalleryImage]}
                          alt={`${film.title} - Gallery image ${activeGalleryImage + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Thumbnails */}
                      <div className="flex gap-4 mt-4 flex-wrap">
                        {film.gallery.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setActiveGalleryImage(index)}
                            className={`relative w-24 h-24 overflow-hidden rounded-lg transition-all ${activeGalleryImage === index
                              ? 'ring-4 ring-film-red-600 dark:ring-film-red-500'
                              : 'opacity-70 hover:opacity-100'
                              }`}
                          >
                            <Image
                              src={image}
                              alt={`Thumbnail ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          </button>
                        ))}
                      </div>

                      {/* Behind the scenes section */}
                      <div className="mt-12">
                        <h2 className="text-2xl font-bold mb-6 text-film-black-900 dark:text-white">
                          Behind the Scenes
                        </h2>
                        <div className="prose prose-lg dark:prose-invert mb-6">
                          <p>
                            Explore exclusive behind-the-scenes moments from the production of {film.title}.
                            These images capture the collaborative process and dedication that went into bringing
                            this story to screen.
                          </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="relative aspect-video overflow-hidden rounded-lg">
                            <Image
                              src="/images/hero/hero10.jpg"
                              alt="Behind the scenes - Camera setup"
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                              <p className="text-white text-sm">Setting up for a complicated tracking shot</p>
                            </div>
                          </div>
                          <div className="relative aspect-video overflow-hidden rounded-lg">
                            <Image
                              src="/images/hero/hero11.jpg"
                              alt="Behind the scenes - Director and crew"
                              fill
                              className="object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                              <p className="text-white text-sm">Director discussing a scene with local participants</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </SectionReveal>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sidebar */}
            <div className="lg:w-1/3">
              <div className="lg:sticky lg:top-28">
                <SectionReveal delay={0.2} direction="right">
                  {/* Film details card */}
                  <div className="bg-white dark:bg-film-black-900 rounded-xl shadow-sm overflow-hidden mb-8">
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-4 text-film-black-900 dark:text-white">Film Information</h3>
                      <ul className="space-y-4">
                        <li className="flex items-center">
                          <Calendar className="h-5 w-5 text-film-red-500 mr-3" />
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400 block">Release Date</span>
                            <span className="text-gray-900 dark:text-gray-100">{film.releaseDate}</span>
                          </div>
                        </li>
                        <li className="flex items-center">
                          <Clock className="h-5 w-5 text-film-red-500 mr-3" />
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400 block">Runtime</span>
                            <span className="text-gray-900 dark:text-gray-100">{film.duration}</span>
                          </div>
                        </li>
                        <li className="flex items-center">
                          <User className="h-5 w-5 text-film-red-500 mr-3" />
                          <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400 block">Director</span>
                            <span className="text-gray-900 dark:text-gray-100">{film.director}</span>
                          </div>
                        </li>
                      </ul>

                      {/* Screening information - A fictional section */}
                      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-film-black-800">
                        <h4 className="font-medium text-film-black-900 dark:text-white mb-3">Availability</h4>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-600 dark:text-gray-400">Film Festivals</span>
                          <span className="inline-block px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs rounded-full">
                            Currently Showing
                          </span>
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-600 dark:text-gray-400">Theatrical Release</span>
                          <span className="inline-block px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs rounded-full">
                            Limited Release
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Streaming</span>
                          <span className="inline-block px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 text-xs rounded-full">
                            Coming Soon
                          </span>
                        </div>

                        <Button
                          variant="primary"
                          className="w-full mt-6"
                        >
                          Find Screenings
                        </Button>
                      </div>
                    </div>
                  </div>
                  {/* More from this director */}
                  {otherFilmsByDirector.length > 0 && (
                    <div className="bg-white dark:bg-film-black-900 rounded-xl shadow-sm p-6">
                      <h3 className="text-xl font-bold mb-4 text-film-black-900 dark:text-white">
                        More from {film.director}
                      </h3>
                      <div className="space-y-4">
                        {otherFilmsByDirector.map((relatedFilm) => (
                          <Link href={`/films/${relatedFilm.slug}`} key={relatedFilm.slug}>
                            <div className="flex gap-4 group">
                              <div className="relative h-20 w-28 rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                  src={relatedFilm.image}
                                  alt={relatedFilm.title}
                                  fill
                                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                              </div>
                              <div>
                                <h4 className="font-medium text-film-black-900 dark:text-white group-hover:text-film-red-600 dark:group-hover:text-film-red-500 transition-colors">
                                  {relatedFilm.title}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  {relatedFilm.year} • {relatedFilm.category}
                                </p>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-film-black-800">
                        <Link href={`/films?director=${film.director}`} className="text-film-red-600 dark:text-film-red-500 hover:underline flex items-center">
                          View all films by {film.director}
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  )}
                </SectionReveal>
              </div>
            </div>
          </div>
        </div>

        {/* Related Films section */}
        <div className="bg-gray-50 dark:bg-film-black-900 py-16">
          <div className="container mx-auto px-4">
            <SectionReveal>
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-film-black-900 dark:text-white">
                You Might Also Like
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {films.filter(f => f.slug !== film.slug).slice(0, 3).map((relatedFilm) => (
                  <motion.div
                    key={relatedFilm.slug}
                    whileHover={{ y: -10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Link href={`/films/${relatedFilm.slug}`}>
                      <div className="bg-white dark:bg-film-black-950 rounded-xl overflow-hidden shadow-sm group">
                        <div className="relative aspect-video overflow-hidden">
                          <Image
                            src={relatedFilm.image}
                            alt={relatedFilm.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-4">
                            <div>
                              <div className="text-white text-sm">{relatedFilm.category}</div>
                              <h3 className="text-white font-medium">{relatedFilm.title}</h3>
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600 dark:text-gray-400 text-sm">
                              {relatedFilm.year}
                            </span>
                            <div className="flex items-center text-yellow-500">
                              <Star className="h-4 w-4 fill-current" />
                              <span className="ml-1 text-gray-900 dark:text-gray-200">{relatedFilm.rating}/5</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className="mt-10 text-center">
                <Button variant="secondary">
                  <Link href="/films">View All Films</Link>
                </Button>
              </div>
            </SectionReveal>
          </div>
        </div>

        {/* Newsletter signup */}
        <div className="bg-film-black-950 text-white py-16">
          <div className="container mx-auto px-4">
            <SectionReveal>
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">Stay Updated on Film Screenings</h2>
                <p className="text-gray-300 mb-8">
                  Join our newsletter to receive updates about screenings, film festivals, and special events featuring our productions.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="flex-grow px-4 py-3 rounded-full border border-gray-700 bg-film-black-900 text-white focus:outline-none focus:ring-2 focus:ring-film-red-500"
                  />
                  <Button variant="primary">
                    Subscribe Now
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-4">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </div>
            </SectionReveal>
          </div>
        </div>

        {/* Trailer Modal */}
        <AnimatePresence>
          {trailerOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              onClick={toggleTrailer}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-film-black-900 rounded-xl overflow-hidden w-full max-w-5xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center p-4 border-b border-film-black-800">
                  <h3 className="text-xl font-bold text-white">{film.title} - Official Trailer</h3>
                  <button
                    onClick={toggleTrailer}
                    className="text-gray-400 hover:text-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="relative aspect-video bg-black">
                  {/* This is where the video would be embedded */}
                  <div className="flex items-center justify-center h-full p-4 text-center">
                    <div className="max-w-lg">
                      <Play className="h-16 w-16 text-film-red-500 mx-auto mb-4 opacity-50" />
                      <p className="text-gray-300">
                        This is a placeholder for the trailer video. In a real implementation, a video player would be embedded here.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageTransition>
  );
};

export default FilmDetailPage;

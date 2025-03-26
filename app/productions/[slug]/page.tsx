"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import PageTransition from "@/components/UI/PageTransition";
import SectionReveal from "@/components/UI/SectionReveal";
import { Button } from "@/components/UI/Button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Play, Calendar, Clock, User, MessageCircle, ChevronRight, ChevronDown, ChevronUp, Check } from "lucide-react";
import { Production } from '@/types/mongodbSchema';
import { useProduction } from '@/hooks/useProduction';


interface ProductionDetailPageProps {
  params: {
    slug: string;
  };
}


// const ProductionDetailPage = ({ params }: ProductionDetailPageProps) => {


const ProductionDetailPage = ({ params }: { params: { slug: string } }) => {
  const { slug } = params
  const { production, isLoading, error } = useProduction(slug);
  const [activeTab, setActiveTab] = useState<'about' | 'updates' | 'team' | 'support'>('about');
  const [showTrailer, setShowTrailer] = useState(false);
  const [expandedFaqItem, setExpandedFaqItem] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Handle scroll tracking
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.body.offsetHeight - window.innerHeight;
      const progress = (scrollTop / docHeight) * 100;
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // If production doesn't exist, show 404
  if (!production || production.slug !== slug) {
    notFound();
  }

  // Toggle FAQ item expansion
  const toggleFaqItem = (index: number) => {
    setExpandedFaqItem(expandedFaqItem === index ? null : index);
  };

  // Calculate the visual representation of production progress
  const getStageStatus = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          statusClass: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
          icon: <Check className="h-5 w-5" />
        };
      case 'in-progress':
        return {
          statusClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
          icon: <motion.div
            className="h-3 w-3 rounded-full bg-blue-500 dark:bg-blue-400"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        };
      default:
        return {
          statusClass: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
          icon: <div className="h-3 w-3 rounded-full border-2 border-gray-500 dark:border-gray-400" />
        };
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-white dark:bg-film-black-950 pt-24 pb-20">
        {/* Reading progress bar */}
        <div className="fixed top-[71px] left-0 right-0 h-1 bg-gray-200 dark:bg-film-black-800 z-30">
          <motion.div
            className="h-full bg-film-red-600 dark:bg-film-red-700"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>

        {/* Hero section */}
        <div className="relative w-full h-[50vh] md:h-[70vh] overflow-hidden">
          <Image
            src={production.image}
            alt={production.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-film-black-950 via-film-black-900/70 to-transparent">
            <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-12">
              <SectionReveal>
                <div className="max-w-4xl">
                  <div className="flex items-center mb-4">
                    <Link href="/productions" className="flex items-center text-white hover:text-film-red-400 transition-colors">
                      <ArrowLeft className="mr-2 h-5 w-5" />
                      <span>Back to Productions</span>
                    </Link>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <span className={`inline-block px-3 py-1
                      ${production.status === "In Production"
                        ? "bg-green-600"
                        : production.status === "Pre-Production"
                          ? "bg-blue-600"
                          : "bg-yellow-600"
                      }
                      text-white text-sm font-medium rounded-full`}
                    >
                      {production.status}
                    </span>
                    <span className="text-white text-opacity-90">{production.category}</span>
                  </div>
                  <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
                    {production.title}
                  </h1>
                  <p className="text-lg md:text-xl text-white text-opacity-90 max-w-3xl mb-8">
                    {production.description}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <Button
                      variant="primary"
                      onClick={() => setShowTrailer(true)}
                      className="group"
                    >
                      <Play className="mr-2 h-5 w-5" />
                      Watch Preview
                    </Button>
                    <Button
                      variant="outline"
                      className="bg-transparent border-white text-white hover:bg-white/10"
                    >
                      <Link href="#support" onClick={() => setActiveTab('support')}>
                        Support This Film
                      </Link>
                    </Button>
                  </div>
                </div>
              </SectionReveal>
            </div>
          </div>
        </div>

        {/* Production Progress */}
        <div className="bg-gray-50 dark:bg-film-black-900 py-10">
          <div className="container mx-auto px-4">
            <SectionReveal>
              <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-film-black-900 dark:text-white">Production Progress</h2>
                  <div className="text-film-red-600 dark:text-film-red-500 font-bold">{production.progress}%</div>
                </div>
                <div className="w-full h-3 bg-gray-200 dark:bg-film-black-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: `${production.progress}%` }}
                    transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                    className="h-full bg-film-red-600 dark:bg-film-red-500 rounded-full"
                  />
                </div>
                <div className="flex flex-wrap justify-between items-center mt-6 text-sm text-gray-600 dark:text-gray-400 gap-y-2">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Started: {production.startDate}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{production.timeline}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    <span>Director: {production.director}</span>
                  </div>
                </div>
              </div>
            </SectionReveal>
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
                className={`py-4 px-2 font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'updates'
                  ? 'border-film-red-600 text-film-red-600 dark:border-film-red-500 dark:text-film-red-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                onClick={() => setActiveTab('updates')}
              >
                Production Updates
              </button>
              <button
                className={`py-4 px-2 font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'team'
                  ? 'border-film-red-600 text-film-red-600 dark:border-film-red-500 dark:text-film-red-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                onClick={() => setActiveTab('team')}
              >
                Creative Team
              </button>
              <button
                className={`py-4 px-2 font-medium border-b-2 transition-colors whitespace-nowrap ${activeTab === 'support'
                  ? 'border-film-red-600 text-film-red-600 dark:border-film-red-500 dark:text-film-red-500'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                  }`}
                onClick={() => setActiveTab('support')}
                id="support"
              >
                Support This Film
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
                        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-film-black-900 dark:text-white">About the Production</h2>
                        <div className="prose prose-lg dark:prose-invert max-w-none mb-6">
                          <p>{production.longDescription}</p>
                        </div>

                        <div className="mt-8 mb-12">
                          <h3 className="text-xl font-bold mb-4 text-film-black-900 dark:text-white">Logline</h3>
                          <div className="italic text-lg text-gray-700 dark:text-gray-300 border-l-4 border-film-red-500 pl-4 py-2">
                            {production.logline}
                          </div>
                        </div>

                        <h3 className="text-xl font-bold mb-4 text-film-black-900 dark:text-white">Synopsis</h3>
                        <div className="prose prose-lg dark:prose-invert">
                          <p>{production.synopsis}</p>
                        </div>
                      </div>

                      {/* Production Details */}
                      <div className="mb-10 pt-8 border-t border-gray-200 dark:border-film-black-800">
                        <h2 className="text-2xl font-bold mb-6 text-film-black-900 dark:text-white">
                          Production Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-16">
                          <div>
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                              Category
                            </h3>
                            <p className="text-gray-900 dark:text-gray-100">{production.category}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                              Status
                            </h3>
                            <p className="text-gray-900 dark:text-gray-100">{production.status}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                              Director
                            </h3>
                            <p className="text-gray-900 dark:text-gray-100">{production.director}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                              Producer
                            </h3>
                            <p className="text-gray-900 dark:text-gray-100">{production.producer}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                              Timeline
                            </h3>
                            <p className="text-gray-900 dark:text-gray-100">{production.timeline}</p>
                          </div>
                          <div>
                            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1">
                              Filming Locations
                            </h3>
                            <p className="text-gray-900 dark:text-gray-100">{production.locations.join(', ')}</p>
                          </div>
                        </div>
                      </div>

                      {/* Production Process */}
                      <div className="mb-10 pt-8 border-t border-gray-200 dark:border-film-black-800">
                        <h2 className="text-2xl font-bold mb-6 text-film-black-900 dark:text-white">
                          Production Process
                        </h2>
                        <div className="relative">
                          {/* Timeline line */}
                          <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-300 dark:bg-film-black-700 hidden md:block"></div>

                          <div className="space-y-8">
                            {production.stages.map((stage, index) => {
                              const { statusClass, icon } = getStageStatus(stage.status);

                              return (
                                <div key={stage.name} className="flex flex-col md:flex-row">
                                  <div className="md:w-1/4 flex md:justify-end mb-4 md:mb-0 md:pr-8">
                                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusClass} md:relative md:z-10`}>
                                      <span className="mr-2">{icon}</span>
                                      {stage.name}
                                    </div>
                                  </div>

                                  <div className="md:w-3/4 pl-8 md:pl-12 relative">
                                    {/* Timeline dot */}
                                    <div className={`absolute left-0 top-3 w-6 h-6 rounded-full border-2 ${stage.status === 'completed'
                                      ? 'bg-green-500 border-green-600'
                                      : stage.status === 'in-progress'
                                        ? 'bg-blue-500 border-blue-600 animate-pulse'
                                        : 'bg-gray-200 dark:bg-film-black-800 border-gray-400 dark:border-gray-600'
                                      } hidden md:block`}></div>

                                    <ul className="space-y-2">
                                      {stage.milestones.map((milestone, idx) => (
                                        <li key={idx} className={`flex items-start ${stage.status === 'completed'
                                          ? 'text-gray-900 dark:text-gray-100'
                                          : stage.status === 'in-progress'
                                            ? 'text-gray-900 dark:text-gray-100 font-medium'
                                            : 'text-gray-500 dark:text-gray-400'
                                          }`}>
                                          {stage.status === 'completed' ? (
                                            <Check className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                                          ) : (
                                            <div className={`w-5 h-5 mr-2 rounded-full border flex-shrink-0 border-gray-300 dark:border-gray-600 ${stage.status === 'in-progress' ? 'border-blue-400 dark:border-blue-500' : ''
                                              }`}></div>
                                          )}
                                          {milestone}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>


                      {/* FAQ Section */}
                      <div className="mb-10 pt-8 border-t border-gray-200 dark:border-film-black-800">
                        <h2 className="text-2xl font-bold mb-6 text-film-black-900 dark:text-white">
                          Frequently Asked Questions
                        </h2>
                        <div className="space-y-4">
                          {production.faq.map((item, index) => (
                            <div
                              key={index}
                              className="border border-gray-200 dark:border-film-black-800 rounded-lg overflow-hidden"
                            >
                              <button
                                onClick={() => toggleFaqItem(index)}
                                className="flex justify-between items-center w-full p-4 text-left bg-gray-50 dark:bg-film-black-900 hover:bg-gray-100 dark:hover:bg-film-black-800 transition-colors"
                              >
                                <span className="font-medium text-film-black-900 dark:text-white">{item.question}</span>
                                {expandedFaqItem === index ? (
                                  <ChevronUp className="h-5 w-5 text-film-red-600 dark:text-film-red-500" />
                                ) : (
                                  <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                                )}
                              </button>
                              <AnimatePresence>
                                {expandedFaqItem === index && (
                                  <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                  >
                                    <div className="p-4 prose dark:prose-invert">
                                      <p>{item.answer}</p>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          ))}
                        </div>
                      </div>
                    </SectionReveal>
                  </motion.div>
                )}

                {activeTab === 'updates' && (
                  <motion.div
                    key="updates"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SectionReveal>
                      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-film-black-900 dark:text-white">Production Updates</h2>
                      <div className="space-y-12">
                        {production.updates.map((update, index) => (
                          <div key={index} className="flex flex-col md:flex-row gap-8">
                            <div className="relative md:w-1/3 h-64 overflow-hidden rounded-lg">
                              <Image
                                src={update.image}
                                alt={update.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="md:w-2/3">
                              <div className="text-film-red-600 dark:text-film-red-500 font-medium mb-2">{update.date}</div>
                              <h3 className="text-xl font-bold mb-3 text-film-black-900 dark:text-white">{update.title}</h3>
                              <div className="prose prose-lg dark:prose-invert">
                                <p>{update.content}</p>
                                {index === 0 && (
                                  <p className="mt-4">
                                    The team faced challenging weather conditions but managed to capture stunning footage
                                    of seasonal fishing rituals and community adaptation efforts. Interviews with elders
                                    provide historical context that will form the backbone of our narrative structure.
                                  </p>
                                )}
                              </div>

                              {/* Comments section for the first update */}
                              {index === 0 && (
                                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-film-black-800">
                                  <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                    <MessageCircle className="h-5 w-5" />
                                    <span>2 comments</span>
                                  </div>

                                  <div className="mt-4 space-y-4">
                                    <div className="flex gap-4">
                                      <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-film-black-800 flex-shrink-0 overflow-hidden relative">
                                        <Image
                                          src="/images/hero/hero4.jpg"
                                          alt="Commenter"
                                          fill
                                          className="object-cover"
                                        />
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <span className="font-medium text-film-black-900 dark:text-white">Sarah Johnson</span>
                                          <span className="text-sm text-gray-500 dark:text-gray-400">June 18, 2023</span>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300 mt-1">
                                          So excited to see this project progressing! The imagery in your previous work has been stunning,
                                          and I can't wait to see how you capture the delta communities.
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex gap-4 pl-14">
                                      <div className="w-10 h-10 rounded-full bg-film-red-100 dark:bg-film-red-900/30 flex-shrink-0 overflow-hidden relative">
                                        <div className="absolute inset-0 flex items-center justify-center text-film-red-600 dark:text-film-red-400 font-medium">
                                          EK
                                        </div>
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <span className="font-medium text-film-black-900 dark:text-white">Emmanuel Koffi</span>
                                          <span className="text-xs px-2 py-0.5 bg-film-red-100 dark:bg-film-red-900/30 text-film-red-600 dark:text-film-red-400 rounded-full">Director</span>
                                          <span className="text-sm text-gray-500 dark:text-gray-400">June 19, 2023</span>
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300 mt-1">
                                          Thanks Sarah! We're working with a fantastic local cinematographer who brings deep knowledge of the region.
                                          It's making all the difference in how we're capturing these stories.
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="text-center mt-12">
                        <Button variant="secondary">
                          <Link href="#">Sign up for production updates</Link>
                        </Button>
                      </div>
                    </SectionReveal>
                  </motion.div>
                )}

                {activeTab === 'team' && (
                  <motion.div
                    key="team"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SectionReveal>
                      <h2 className="text-2xl md:text-3xl font-bold mb-10 text-film-black-900 dark:text-white">Creative Team</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {production.team.map((member, index) => (
                          <div key={index} className="flex flex-col sm:flex-row gap-6 bg-gray-50 dark:bg-film-black-900 p-6 rounded-xl">
                            <div className="sm:w-1/3 flex-shrink-0">
                              <div className="relative h-52 sm:h-full rounded-lg overflow-hidden">
                                <Image
                                  src={member.image}
                                  alt={member.name}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                            </div>
                            <div className="sm:w-2/3">
                              <h3 className="text-xl font-bold mb-1 text-film-black-900 dark:text-white">{member.name}</h3>
                              <p className="text-film-red-600 dark:text-film-red-500 font-medium mb-4">{member.role}</p>
                              <p className="text-gray-700 dark:text-gray-300">{member.bio}</p>

                              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-film-black-800">
                                <Link href="#" className="text-film-red-600 dark:text-film-red-500 hover:underline flex items-center">
                                  View filmography
                                  <ChevronRight className="ml-2 h-4 w-4" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Additional team section */}
                      <div className="mt-12 pt-12 border-t border-gray-200 dark:border-film-black-800">
                        <h3 className="text-xl font-bold mb-6 text-film-black-900 dark:text-white">Additional Team Members</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                          {[
                            { name: "Abena Osei", role: "Production Coordinator" },
                            { name: "Kwame Ansah", role: "Sound Recordist" },
                            { name: "Fatou Diallo", role: "Research Assistant" },
                            { name: "Isaac Mensa", role: "Drone Operator" },
                            { name: "Grace Addo", role: "Production Assistant" },
                            { name: "Daniel Okeke", role: "Translation Supervisor" }
                          ].map((member, index) => (
                            <div key={index} className="bg-white dark:bg-film-black-950 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-film-black-800">
                              <div className="w-12 h-12 bg-film-red-100 dark:bg-film-red-900/30 rounded-full flex items-center justify-center mb-3">
                                <span className="text-film-red-600 dark:text-film-red-400 font-medium">
                                  {member.name.charAt(0)}
                                </span>
                              </div>
                              <h4 className="font-medium text-film-black-900 dark:text-white">{member.name}</h4>
                              <p className="text-sm text-gray-600 dark:text-gray-400">{member.role}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Supporting organizations */}
                      <div className="mt-12 pt-12 border-t border-gray-200 dark:border-film-black-800">
                        <h3 className="text-xl font-bold mb-6 text-film-black-900 dark:text-white">Supporting Organizations</h3>
                        <div className="flex flex-wrap gap-6 items-center">
                          {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="grayscale hover:grayscale-0 transition-all">
                              <Image
                                src={`/images/partners/partner-${i}.png`}
                                alt={`Supporting organization ${i}`}
                                width={120}
                                height={60}
                                className="object-contain max-h-16 dark:filter dark:brightness-1 dark:invert dark:hover:brightness-100 dark:hover:invert"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </SectionReveal>
                  </motion.div>
                )}

                {activeTab === 'support' && (
                  <motion.div
                    key="support"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <SectionReveal>
                      <h2 className="text-2xl md:text-3xl font-bold mb-6 text-film-black-900 dark:text-white">Support This Production</h2>
                      <div className="prose prose-lg dark:prose-invert mb-10">
                        <p>
                          By supporting <strong>{production.title}</strong>, you're not only helping bring an important story to the screen—you're
                          investing in authentic African storytelling and contributing to a production that centers community voices.
                        </p>
                        <p>
                          Your support enables our team to work with the highest production standards while maintaining our commitment to ethical
                          storytelling and community collaboration.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {production.supportOptions.map((option, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ y: -5 }}
                            className="bg-white dark:bg-film-black-900 rounded-xl shadow-sm p-6 border-2 border-transparent hover:border-film-red-500 transition-all relative"
                          >
                            {index === 0 && (
                              <div className="absolute -top-3 -right-3">
                                <div className="bg-film-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                                  Featured
                                </div>
                              </div>
                            )}
                            <h3 className="text-xl font-bold mb-2 text-film-black-900 dark:text-white">{option.title}</h3>
                            <div className="text-2xl font-bold text-film-red-600 dark:text-film-red-500 mb-4">{option.investment}</div>
                            <p className="text-gray-700 dark:text-gray-300 mb-6">{option.description}</p>
                            <ul className="space-y-2 mb-8">
                              {option.perks.map((perk, i) => (
                                <li key={i} className="flex items-start">
                                  <Check className="h-5 w-5 text-film-red-600 dark:text-film-red-500 mr-2 flex-shrink-0" />
                                  <span className="text-gray-700 dark:text-gray-300">{perk}</span>
                                </li>
                              ))}
                            </ul>
                            <Button
                              variant={index === 0 ? "primary" : "secondary"}
                              className="w-full"
                            >
                              Select This Option
                            </Button>
                          </motion.div>
                        ))}
                      </div>

                      {/* Custom support option */}
                      <div className="bg-gray-50 dark:bg-film-black-900 rounded-xl p-6 md:p-8">
                        <h3 className="text-xl font-bold mb-4 text-film-black-900 dark:text-white">Custom Support Options</h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-6">
                          Interested in supporting our work in other ways? We offer flexible options for individuals and organizations
                          who want to contribute to this production.
                        </p>
                        <Button variant="secondary">Contact Our Team</Button>
                      </div>

                      {/* Impact section */}
                      <div className="mt-12 pt-12 border-t border-gray-200 dark:border-film-black-800">
                        <h3 className="text-xl font-bold mb-6 text-film-black-900 dark:text-white">The Impact of Your Support</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="relative h-64 rounded-xl overflow-hidden">
                            <Image
                              src="/images/hero/hero12.jpg"
                              alt="Community impact"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="prose prose-lg dark:prose-invert">
                              <p>
                                Your contribution to <strong>{production.title}</strong> goes beyond just supporting a film project. It helps:
                              </p>
                              <ul>
                                <li>Amplify authentic African stories on the global stage</li>
                                <li>Support local filmmaking talent in Ghana</li>
                                <li>Document valuable cultural knowledge for future generations</li>
                                <li>Create educational resources about climate adaptation</li>
                                <li>Build community screening programs that maximize social impact</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Testimonials from supporters */}
                      <div className="mt-12 pt-12 border-t border-gray-200 dark:border-film-black-800">
                        <h3 className="text-xl font-bold mb-6 text-film-black-900 dark:text-white">From Previous Supporters</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <blockquote className="bg-white dark:bg-film-black-950 p-6 rounded-xl shadow-sm">
                            <p className="text-gray-700 dark:text-gray-300 italic mb-4">
                              "Supporting Riel Films has been one of the most rewarding investments I've made. The team's dedication to authentic storytelling and their collaborative approach with local communities sets them apart."
                            </p>
                            <footer className="font-medium text-film-black-900 dark:text-white">
                              — James Thornton, Executive Producer
                            </footer>
                          </blockquote>
                          <blockquote className="bg-white dark:bg-film-black-950 p-6 rounded-xl shadow-sm">
                            <p className="text-gray-700 dark:text-gray-300 italic mb-4">
                              "As an organization focused on environmental education, partnering with Riel Films gave us a powerful way to communicate complex issues through compelling human stories."
                            </p>
                            <footer className="font-medium text-film-black-900 dark:text-white">
                              — Green Future Foundation
                            </footer>
                          </blockquote>
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
                  {/* Key people card */}
                  <div className="bg-white dark:bg-film-black-900 rounded-xl shadow-sm overflow-hidden mb-8">
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-6 text-film-black-900 dark:text-white">Key Team</h3>
                      <div className="space-y-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0 relative">
                            <Image
                              src="/images/hero/hero1.jpg"
                              alt="Emmanuel Koffi"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium text-film-black-900 dark:text-white">{production.director}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Director</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0 relative">
                            <Image
                              src="/images/hero/hero3.jpg"
                              alt="Nana Adwoa"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium text-film-black-900 dark:text-white">{production.producer}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Producer</div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0 relative">
                            <Image
                              src="/images/hero/hero2.jpg"
                              alt="Kofi Mensah"
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-medium text-film-black-900 dark:text-white">{production.cinematographer}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">Director of Photography</div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-film-black-800">
                        <Button
                          variant="secondary"
                          className="w-full"
                          onClick={() => setActiveTab('team')}
                        >
                          View Full Team
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Upcoming production milestones */}
                  <div className="bg-white dark:bg-film-black-900 rounded-xl shadow-sm p-6 mb-8">
                    <h3 className="text-xl font-bold mb-4 text-film-black-900 dark:text-white">Upcoming Milestones</h3>
                    <ul className="space-y-4">
                      <li className="border-l-2 border-blue-500 dark:border-blue-600 pl-4 py-1">
                        <div className="text-film-black-900 dark:text-white font-medium">Final Filming Phase</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">August 2023</div>
                      </li>
                      <li className="border-l-2 border-gray-300 dark:border-gray-700 pl-4 py-1">
                        <div className="text-film-black-900 dark:text-white font-medium">Rough Cut Preview</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">October 2023</div>
                      </li>
                      <li className="border-l-2 border-gray-300 dark:border-gray-700 pl-4 py-1">
                        <div className="text-film-black-900 dark:text-white font-medium">Community Screenings</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">December 2023</div>
                      </li>
                      <li className="border-l-2 border-gray-300 dark:border-gray-700 pl-4 py-1">
                        <div className="text-film-black-900 dark:text-white font-medium">Festival Submissions</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">January 2024</div>
                      </li>
                    </ul>
                  </div>

                  {/* Support call to action */}
                  <div className="bg-gradient-to-br from-film-red-600 to-film-red-800 dark:from-film-red-800 dark:to-film-black-900 text-white rounded-xl p-6">
                    <h3 className="text-xl font-bold mb-4">Support This Film</h3>
                    <p className="mb-6 text-white/90">
                      Join us in bringing this important story to screens worldwide. Your contribution makes a difference.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab('support')}
                      className="w-full bg-transparent border-white text-white hover:bg-white/10"
                    >
                      View Support Options
                    </Button>
                  </div>
                </SectionReveal>
              </div>
            </div>
          </div>
        </div>

        {/* Related Productions */}
        <div className="bg-gray-50 dark:bg-film-black-900 py-16">
          <div className="container mx-auto px-4">
            <SectionReveal>
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-film-black-900 dark:text-white">
                Other Productions You Might Be Interested In
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    title: "Market Queen",
                    category: "Feature Film",
                    status: "Pre-Production",
                    image: "/images/productions/market-queen.jpg",
                    slug: "market-queen"
                  },
                  {
                    title: "Diaspora Dreams",
                    category: "Documentary Series",
                    status: "Development",
                    image: "/images/productions/diaspora-dreams.jpg",
                    slug: "diaspora-dreams"
                  },
                  {
                    title: "Accra Dreams",
                    category: "Short Film Collection",
                    status: "Completed",
                    image: "/images/hero/hero6.jpg",
                    slug: "accra-dreams"
                  }
                ].map((relatedProduction) => (
                  <motion.div
                    key={relatedProduction.slug}
                    whileHover={{ y: -10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Link href={`/productions/${relatedProduction.slug}`}>
                      <div className="bg-white dark:bg-film-black-950 rounded-xl overflow-hidden shadow-sm group h-full">
                        <div className="relative aspect-video overflow-hidden">
                          <Image
                            src={relatedProduction.image}
                            alt={relatedProduction.title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute top-2 left-2">
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${relatedProduction.status === "Completed"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                              : relatedProduction.status === "Pre-Production"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300"
                                : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300"
                              }`}>
                              {relatedProduction.status}
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="text-gray-600 dark:text-gray-400 text-sm mb-1">{relatedProduction.category}</div>
                          <h3 className="text-film-black-900 dark:text-white font-medium group-hover:text-film-red-600 dark:group-hover:text-film-red-500 transition-colors">
                            {relatedProduction.title}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className="mt-10 text-center">
                <Button variant="secondary">
                  <Link href="/productions">View All Productions</Link>
                </Button>
              </div>
            </SectionReveal>
          </div>
        </div>

        {/* Newsletter signup */}
        <div className="bg-white dark:bg-film-black-950 py-16">
          <div className="container mx-auto px-4">
            <SectionReveal>
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-film-black-900 dark:text-white">
                  Stay Updated on This Production
                </h2>
                <p className="text-gray-700 dark:text-gray-300 mb-8">
                  Join our newsletter to receive exclusive behind-the-scenes updates, production milestones, and be the first to know when {production.title} is ready for screening.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    className="flex-grow px-4 py-3 rounded-lg border border-gray-300 dark:border-film-black-700 bg-white dark:bg-film-black-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-film-red-500"
                  />
                  <Button variant="primary">
                    Subscribe Now
                  </Button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-4">
                  We respect your privacy. Unsubscribe at any time.
                </p>
              </div>
            </SectionReveal>
          </div>
        </div>

        {/* Trailer Modal */}
        <AnimatePresence>
          {showTrailer && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              onClick={() => setShowTrailer(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-film-black-900 rounded-xl overflow-hidden w-full max-w-5xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center p-4 border-b border-film-black-800">
                  <h3 className="text-xl font-bold text-white">{production.title} - Preview</h3>
                  <button
                    onClick={() => setShowTrailer(false)}
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
                        This is a placeholder for the preview video. In a real implementation, a video player would be embedded here.
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

export default ProductionDetailPage;

"use client";
import React, { Suspense } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import PageTransition from "@/components/UI/PageTransition";
import SectionReveal from "@/components/UI/SectionReveal";
import { Button } from "@/components/UI/Button";
import { Card } from "@/components/UI/Card";
import Link from "next/link";
import { ArrowRight, Play, Film, Globe, Users, Heart, Star, Award } from "lucide-react";
import LoadingSpinner from "@/components/UI/LoadingSpinner";

// Loading component for Suspense
const AboutPageLoading = () => (
  <div className="h-screen flex items-center justify-center">
    <LoadingSpinner size="large" />
  </div>
);

// Main content component
const AboutPageContent = () => {
  const coreValues = [
    {
      icon: <Star className="w-6 h-6 text-film-red-500" />,
      title: "Authenticity",
      description: "We are committed to portraying genuine African experiences, cultures, and perspectives with integrity and respect."
    },
    {
      icon: <Film className="w-6 h-6 text-film-red-500" />,
      title: "Creativity",
      description: "We embrace creativity as the heart of our filmmaking process, encouraging innovation and artistic expression."
    },
    {
      icon: <Award className="w-6 h-6 text-film-red-500" />,
      title: "Excellence",
      description: "We strive for excellence in every aspect of our work, from scriptwriting and production to post-production and distribution."
    },
    {
      icon: <Users className="w-6 h-6 text-film-red-500" />,
      title: "Inclusivity",
      description: "We value inclusivity and diversity in all aspects of our filmmaking endeavors, fostering a collaborative environment."
    },
    {
      icon: <Heart className="w-6 h-6 text-film-red-500" />,
      title: "Impact",
      description: "We believe storytelling has the power to inspire change and make a positive impact on society."
    },
    {
      icon: <Globe className="w-6 h-6 text-film-red-500" />,
      title: "Global Reach",
      description: "We aim to bring authentic African narratives to audiences worldwide, transcending borders and cultural barriers."
    }
  ];

  const teamMembers = [
    {
      name: "Emmanuel Koffi",
      role: "Founder & Creative Director",
      bio: "With over 15 years of experience in filmmaking, Emmanuel founded Riel Films with a vision to showcase authentic African narratives globally.",
      image: "/images/hero/hero1.jpg"
    },
    {
      name: "Nana Adwoa",
      role: "Head of Production",
      bio: "Award-winning producer with a keen eye for compelling stories that resonate with diverse audiences.",
      image: "/images/hero/hero3.jpg"
    },
    {
      name: "Kofi Mensah",
      role: "Director of Photography",
      bio: "Internationally acclaimed cinematographer whose work has been featured in major film festivals around the world.",
      image: "/images/hero/hero2.jpg"
    }
  ];

  const milestones = [
    {
      year: "2015",
      title: "Foundation",
      description: "Riel Films was established with a vision to revolutionize African storytelling."
    },
    {
      year: "2017",
      title: "First Feature Film",
      description: "Released 'River's Edge', winning Best African Film at the Pan-African Film Festival."
    },
    {
      year: "2019",
      title: "International Recognition",
      description: "Our documentary 'Voices of the Delta' was screened at Cannes Film Festival."
    },
    {
      year: "2021",
      title: "Streaming Partnership",
      description: "Secured major distribution deals with global streaming platforms."
    },
    {
      year: "2023",
      title: "Expansion",
      description: "Opened new production studio and launched training programs for emerging filmmakers."
    }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-white dark:bg-film-black-950">
        {/* Hero Section */}
        <section className="relative pt-24 pb-16 md:pt-32 md:pb-20 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-film-black-950/90 to-film-black-900/80 dark:from-film-black-950/95 dark:to-film-black-950/70 z-10"></div>
            <Image
              src="/images/hero/hero1.jpg"
              alt="Riel Films Cinema"
              fill
              className="object-cover object-center"
              priority
            />
          </div>

          <div className="container mx-auto px-4 relative z-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <SectionReveal>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 text-white">
                    Empowering <span className="text-film-red-500">African</span> Voices,
                    <br />Sharing <span className="text-film-red-500">Global</span> Stories
                  </h1>
                </SectionReveal>

                <SectionReveal delay={0.2}>
                  <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl">
                    Riel Films is dedicated to creating unforgettable cinematic experiences that
                    entertain and inspire audiences worldwide, showcasing the richness and diversity
                    of African storytelling.
                  </p>
                </SectionReveal>

                <SectionReveal delay={0.4}>
                  <div className="flex flex-wrap gap-4">
                    <Button variant="primary" className="group">
                      <Link href="/productions" className="flex items-center">
                        View Our Productions
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>

                    <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10">
                      <Link href="/contact" className="flex items-center">
                        Contact Us
                      </Link>
                    </Button>
                  </div>
                </SectionReveal>
              </div>

              <div className="hidden lg:flex justify-end">
                <SectionReveal direction="right">
                  <motion.div
                    className="relative w-80 h-96 border-4 border-film-red-500 rounded-lg overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Image
                      src="/images/hero/hero8.jpg"
                      alt="Filmmaking"
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-film-black-950 to-transparent flex items-end p-6">
                      <div>
                        <p className="text-white font-medium text-lg">Our Craft</p>
                        <p className="text-gray-300 text-sm">Bringing African stories to life</p>
                      </div>
                    </div>

                    <motion.div
                      className="absolute inset-0 flex items-center justify-center cursor-pointer"
                      whileHover={{ backgroundColor: "rgba(0,0,0,0.3)" }}
                    >
                      <motion.div
                        className="w-16 h-16 bg-film-red-600 rounded-full flex items-center justify-center"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Play className="w-6 h-6 text-white ml-1" />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </SectionReveal>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16 md:py-24 bg-gray-50 dark:bg-film-black-900">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <SectionReveal>
                <div className="relative">
                  <Image
                    src="/images/hero/hero1.jpg"
                    alt="Our Story"
                    width={600}
                    height={400}
                    className="rounded-lg shadow-xl object-cover"
                  />
                  <div className="absolute -bottom-10 -right-10 hidden md:block">
                    <Image
                      src="/images/hero/hero9.jpg"
                      alt="Filmmaking"
                      width={300}
                      height={200}
                      className="rounded-lg border-4 border-white dark:border-film-black-950 shadow-lg"
                    />
                  </div>
                </div>
              </SectionReveal>

              <div>
                <SectionReveal direction="right">
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-film-black-900 dark:text-white">
                    Our <span className="text-film-red-600">Story</span>
                  </h2>

                  <div className="prose prose-lg dark:prose-invert">
                    <p>
                      Founded in 2015, Riel Films was born out of a passion for authentic storytelling and a desire to showcase the rich cultural tapestry of Africa to global audiences. What began as a small team of dedicated filmmakers has evolved into a leading production company known for its compelling narratives and visual excellence.
                    </p>
                    <p>
                      Our journey has been marked by a commitment to amplifying African voices and perspectives, challenging stereotypes, and creating content that resonates with audiences across cultural boundaries. Through our films, we aim to bridge gaps in understanding and foster a deeper appreciation for the diversity of human experiences.
                    </p>
                    <p>
                      Today, Riel Films stands as a beacon for authentic African cinema, working with talented creators across the continent to produce content that entertains, educates, and inspires. Our portfolio spans feature films, documentaries, and short-form content, each piece crafted with care and dedication to our core values.
                    </p>
                  </div>

                  <div className="mt-8">
                    <Button variant="secondary">
                      <Link href="/films">Explore Our Films</Link>
                    </Button>
                  </div>
                </SectionReveal>
              </div>
            </div>
          </div>
        </section>

        {/* Vision & Mission Section */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <SectionReveal>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-film-black-900 dark:text-white">
                  Vision <span className="text-film-red-600">&</span> Mission
                </h2>
                <div className="w-24 h-1 bg-film-red-600 mx-auto"></div>
              </div>
            </SectionReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <SectionReveal>
                <Card className="p-8 h-full flex flex-col dark:border-film-black-800 hover:border-film-red-500 dark:hover:border-film-red-500 transition-colors">
                  <h3 className="text-2xl font-bold mb-4 text-film-red-600">Our Vision</h3>
                  <div className="prose dark:prose-invert">
                    <p>
                      To become the premier platform for authentic African cinema, leading the charge in elevating African storytelling on the global stage. We envision a world where African narratives are celebrated, respected, and accessible to audiences worldwide.
                    </p>
                    <p>
                      We aspire to create a legacy of groundbreaking films that challenge perceptions, inspire future generations of filmmakers, and contribute to the rich tapestry of global cinema.
                    </p>
                  </div>
                </Card>
              </SectionReveal>

              <SectionReveal delay={0.2}>
                <Card className="p-8 h-full flex flex-col dark:border-film-black-800 hover:border-film-red-500 dark:hover:border-film-red-500 transition-colors">
                  <h3 className="text-2xl font-bold mb-4 text-film-red-600">Our Mission</h3>
                  <div className="prose dark:prose-invert">
                    <p>
                      Our mission is to produce captivating and thought-provoking cinematic experiences that celebrate the rich tapestry of African storytelling. We are dedicated to showcasing authentic narratives that entertain, inspire, and resonate with audiences worldwide.
                    </p>
                    <p>
                      Through our films, we aim to foster cultural appreciation and understanding, bridging gaps between communities and contributing to a more inclusive global narrative.
                    </p>
                  </div>
                </Card>
              </SectionReveal>
            </div>
          </div>
        </section>

        {/* Core Values Section */}
        <section className="py-16 md:py-24 bg-film-black-950">
          <div className="container mx-auto px-4">
            <SectionReveal>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                  Our Core <span className="text-film-red-600">Values</span>
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  These principles guide every aspect of our work, from story development to production and distribution.
                </p>
                <div className="w-24 h-1 bg-film-red-600 mx-auto mt-6"></div>
              </div>
            </SectionReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {coreValues.map((value, index) => (
                <SectionReveal key={value.title} delay={0.1 * index}>
                  <motion.div
                    whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(255,255,255,0.1)" }}
                    className="bg-film-black-900 p-6 rounded-lg border border-film-black-800"
                  >
                    <div className="w-12 h-12 bg-film-red-600/10 rounded-full flex items-center justify-center mb-4">
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-white">{value.title}</h3>
                    <p className="text-gray-400">{value.description}</p>
                  </motion.div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Our Journey/Milestones */}
        <section className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <SectionReveal>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-film-black-900 dark:text-white">
                  Our <span className="text-film-red-600">Journey</span>
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  The key milestones that have shaped our story and our commitment to authentic African storytelling.
                </p>
                <div className="w-24 h-1 bg-film-red-600 mx-auto mt-6"></div>
              </div>
            </SectionReveal>

            <div className="relative max-w-4xl mx-auto">
              {/* Timeline line */}
              <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gray-300 dark:bg-film-black-800 transform md:translate-x-[-0.5px]"></div>

              {milestones.map((milestone, index) => (
                <SectionReveal key={milestone.year} delay={index * 0.15}>
                  <div className={`relative flex flex-col md:flex-row gap-8 mb-12 ${index % 2 === 0 ? 'md:flex-row' : ''}`}>
                    {/* Timeline dot */}
                    <div className="absolute left-[-8px] md:left-1/2 top-0 w-4 h-4 rounded-full bg-film-red-600 transform md:translate-x-[-8px]"></div>

                    {/* Content */}
                    <div className="md:w-1/2 pl-8 md:pl-0 md:pr-12">
                      {index % 2 === 1 && <div className="md:text-right">
                        <span className="text-film-red-600 font-bold text-xl">{milestone.year}</span>
                        <h3 className="text-xl font-bold mb-2 text-film-black-900 dark:text-white">{milestone.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{milestone.description}</p>
                      </div>}
                    </div>

                    <div className="md:w-1/2 pl-8 md:pl-12">
                      {index % 2 === 0 && <div>
                        <span className="text-film-red-600 font-bold text-xl">{milestone.year}</span>
                        <h3 className="text-xl font-bold mb-2 text-film-black-900 dark:text-white">{milestone.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400">{milestone.description}</p>
                      </div>}
                    </div>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 md:py-24 bg-gray-50 dark:bg-film-black-900">
          <div className="container mx-auto px-4">
            <SectionReveal>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-film-black-900 dark:text-white">
                  Meet Our <span className="text-film-red-600">Team</span>
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                  The passionate individuals behind our cinematic vision, committed to bringing authentic African stories to global audiences.
                </p>
                <div className="w-24 h-1 bg-film-red-600 mx-auto mt-6"></div>
              </div>
            </SectionReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <SectionReveal key={member.name} delay={0.1 * index}>
                  <motion.div
                    whileHover={{ y: -5 }}
                    className="bg-white dark:bg-film-black-950 rounded-lg overflow-hidden shadow-lg"
                  >
                    <div className="relative h-72">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-6">
                      <h3 className="text-xl font-bold mb-1 text-film-black-900 dark:text-white">{member.name}</h3>
                      <p className="text-film-red-600 font-medium mb-4">{member.role}</p>
                      <p className="text-gray-600 dark:text-gray-400">{member.bio}</p>
                    </div>
                  </motion.div>
                </SectionReveal>
              ))}
            </div>

            <SectionReveal delay={0.4}>
              <div className="text-center mt-12">
                <Button variant="secondary">
                  <Link href="/contact">Join Our Team</Link>
                </Button>
              </div>
            </SectionReveal>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 relative overflow-hidden">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-r from-film-red-900/90 to-film-black-900/95 z-10"></div>
            <Image
              src="/images/hero/hero8.jpg"
              alt="Collaborate with us"
              fill
              className="object-cover object-center"
            />
          </div>

          <div className="container mx-auto px-4 relative z-20">
            <div className="max-w-3xl mx-auto text-center">
              <SectionReveal>
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
                  Ready to Bring Your Story to Life?
                </h2>
              </SectionReveal>

              <SectionReveal delay={0.2}>
                <p className="text-xl text-gray-200 mb-8">
                  Whether you're looking to collaborate on a film project, join our team, or learn more about our work, we'd love to hear from you.
                </p>
              </SectionReveal>

              <SectionReveal delay={0.3}>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button variant="primary" size="lg">
                    <Link href="/contact">Contact Us</Link>
                  </Button>
                  <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white/10">
                    <Link href="/productions">View Our Work</Link>
                  </Button>
                </div>
              </SectionReveal>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

// Main component with Suspense
const AboutPage = () => {
  return (
    <Suspense fallback={<AboutPageLoading />}>
      <AboutPageContent />
    </Suspense>
  );
};

export default AboutPage;

"use client";
import React, { Suspense } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import PageTransition from "@/components/UI/PageTransition";
import SectionReveal from "@/components/UI/SectionReveal";
import { Button } from "@/components/UI/Button";
import { Card } from "@/components/UI/Card"; // Using Card for consistency
import Link from "next/link";
import { ArrowRight, Film, Globe, Users, Heart, Star, Award } from "lucide-react";
import LoadingSpinner from "@/components/UI/LoadingSpinner";
import PageViewTracker from "@/components/analytics/PageViewTracker";
import { FilmDetailSkeleton } from "@/components/skeletons/FilmDetailSkeleton"; // Use a relevant skeleton

// Loading component - Using a more specific skeleton
const AboutPageLoading = () => (
  <div className="bg-white dark:bg-film-black-950 min-h-screen">
    {/* Using a detail skeleton as a placeholder for a content-rich page */}
    <FilmDetailSkeleton />
  </div>
);

// Main content component
const AboutPageContent = () => {
  const coreValues = [
    { icon: <Star className="w-6 h-6 text-film-red-500" />, title: "Authenticity", description: "Portraying genuine African experiences with integrity and respect." },
    { icon: <Film className="w-6 h-6 text-film-red-500" />, title: "Creativity", description: "Embracing creativity and innovation as the heart of our filmmaking." },
    { icon: <Award className="w-6 h-6 text-film-red-500" />, title: "Excellence", description: "Striving for excellence in every aspect, from script to screen." },
    { icon: <Users className="w-6 h-6 text-film-red-500" />, title: "Inclusivity", description: "Valuing diversity and fostering a collaborative, inclusive environment." },
    { icon: <Heart className="w-6 h-6 text-film-red-500" />, title: "Impact", description: "Believing in storytelling's power to inspire change and understanding." },
    { icon: <Globe className="w-6 h-6 text-film-red-500" />, title: "Global Reach", description: "Bringing authentic African narratives to audiences worldwide." }
  ];

  const teamMembers = [
    { name: "Emmanuel Koffi", role: "Founder & Creative Director", bio: "With over 15 years of experience, Emmanuel founded Riel Films to showcase authentic African narratives globally.", image: "/images/hero/hero1.jpg" },
    { name: "Nana Adwoa", role: "Head of Production", bio: "Award-winning producer known for finding compelling stories that resonate with diverse audiences.", image: "/images/hero/hero3.jpg" },
    { name: "Kofi Mensah", role: "Director of Photography", bio: "Acclaimed cinematographer whose visual storytelling has graced international film festivals.", image: "/images/hero/hero2.jpg" }
  ];

  const milestones = [
    { year: "2015", title: "Foundation", description: "Riel Films established to revolutionize African storytelling." },
    { year: "2017", title: "First Feature", description: "Released 'River's Edge', winning Best African Film at Pan-African Film Festival." },
    { year: "2019", title: "Global Recognition", description: "'Voices of the Delta' screened at Cannes Film Festival." },
    { year: "2021", title: "Streaming Deals", description: "Secured major distribution deals with global streaming platforms." },
    { year: "2023", title: "Studio Expansion", description: "Opened new studio and launched training programs for emerging filmmakers." }
  ];

  return (
    <PageTransition>
      <PageViewTracker pageType="about" />
      <div className="min-h-screen bg-white dark:bg-film-black-950">
        {/* Hero Section - Enhanced cinematic feel */}
        <section className="relative pt-40 pb-32 md:pt-52 md:pb-40 overflow-hidden">
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/hero/hero_about_bg.jpg" // Dedicated background for About
              alt="Riel Films team collaborating"
              fill
              className="object-cover object-center"
              priority
            />
            {/* Stronger Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-film-black-950 via-film-black-950/80 to-transparent z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-film-black-950 via-transparent to-transparent z-10 opacity-60"></div>
          </div>

          <div className="container mx-auto px-4 relative z-20">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <SectionReveal>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 text-white leading-tight drop-shadow-lg">
                    Crafting <span className="text-film-red-500">Authentic</span> Narratives,
                    <br />Connecting <span className="text-film-red-500">Global</span> Audiences.
                  </h1>
                </SectionReveal>

                <SectionReveal delay={0.2}>
                  <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl leading-relaxed">
                    Riel Films is a beacon for African cinema, dedicated to producing unforgettable cinematic journeys that showcase the richness and diversity of the continent.
                  </p>
                </SectionReveal>

                <SectionReveal delay={0.4}>
                  <div className="flex flex-wrap gap-4">
                    <Button variant="primary" size="lg" className="group">
                      <Link href="/productions" className="flex items-center">
                        Explore Our Work
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                      <Link href="/contact">Partner With Us</Link>
                    </Button>
                  </div>
                </SectionReveal>
              </div>

              {/* Image Collage Section */}
              <div className="hidden lg:flex justify-center items-center relative">
                <SectionReveal direction="right" delay={0.3}>
                  <motion.div
                    className="relative w-full max-w-lg h-[500px]"
                    whileHover={{ scale: 1.03 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Image
                      src="/images/hero/hero8.jpg"
                      alt="Filmmaking Craft"
                      fill
                      className="object-cover rounded-xl shadow-2xl border-4 border-film-red-500/30"
                    />
                    <motion.div
                      className="absolute -bottom-12 -left-20 w-56 h-72 rounded-lg overflow-hidden shadow-lg border-4 border-white dark:border-film-black-900 transform rotate-[-8deg]"
                      initial={{ opacity: 0, x: -30, rotate: -15 }}
                      animate={{ opacity: 1, x: 0, rotate: -8 }}
                      transition={{ delay: 0.5, duration: 0.6, type: "spring" }}
                      whileHover={{ rotate: -4, scale: 1.05 }}
                    >
                      <Image src="/images/hero/hero2.jpg" alt="Behind the scenes" fill className="object-cover" />
                    </motion.div>
                    <motion.div
                      className="absolute -top-12 -right-20 w-48 h-64 rounded-lg overflow-hidden shadow-lg border-4 border-white dark:border-film-black-900 transform rotate-[10deg]"
                      initial={{ opacity: 0, x: 30, rotate: 20 }}
                      animate={{ opacity: 1, x: 0, rotate: 10 }}
                      transition={{ delay: 0.6, duration: 0.6, type: "spring" }}
                      whileHover={{ rotate: 6, scale: 1.05 }}
                    >
                      <Image src="/images/hero/hero3.jpg" alt="Director working" fill className="object-cover" />
                    </motion.div>
                  </motion.div>
                </SectionReveal>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story Section - Enhanced visuals */}
        <section className="py-20 md:py-28 bg-gray-50 dark:bg-film-black-900">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <SectionReveal>
                <div className="relative aspect-w-4 aspect-h-3 group shadow-xl rounded-xl overflow-hidden">
                  <Image
                    src="/images/hero/hero9.jpg" // Dedicated story image
                    alt="Riel Films - The journey of storytelling"
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Optional decorative elements */}
                  <div className="absolute -bottom-8 -right-8 w-40 h-40 bg-film-red-500/5 rounded-full -z-10 transition-transform duration-500 group-hover:scale-110"></div>
                  <div className="absolute -top-8 -left-8 w-32 h-32 border-4 border-film-red-500/10 rounded-full -z-10"></div>
                </div>
              </SectionReveal>

              <SectionReveal direction="right">
                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-film-black-900 dark:text-white">
                  Our <span className="text-film-red-600">Genesis</span>
                </h2>
                {/* Keep prose styling for readability */}
                <div className="prose prose-lg dark:prose-invert max-w-none space-y-6 text-gray-700 dark:text-gray-300">
                  <p>
                    Founded in 2015, Riel Films ignited from a shared passion for authentic African narratives and a drive to illuminate the continent's rich cultural tapestry on the global stage. What started as a small, dedicated collective has evolved into a leading production house, celebrated for compelling stories and cinematic excellence.
                  </p>
                  <p>
                    Our journey is woven with the threads of amplifying diverse African voices, challenging outdated stereotypes, and crafting content that resonates across cultures, bridging understanding through the universal language of film.
                  </p>
                  <p>
                    Today, Riel Films stands as a champion of contemporary African cinema, fostering collaborations with visionary creators across the continent. Our diverse portfolio—spanning features, documentaries, and shorts—is a testament to our unwavering commitment to our core values.
                  </p>
                </div>
                <div className="mt-10">
                  <Button variant="secondary" size="lg" className="group">
                    <Link href="/films" className="flex items-center">
                      Explore Our Films
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </div>
              </SectionReveal>
            </div>
          </div>
        </section>

        {/* Vision & Mission Section - Using Cards for structure */}
        <section className="py-20 md:py-28 bg-white dark:bg-film-black-950">
          <div className="container mx-auto px-4">
            <SectionReveal>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-film-black-900 dark:text-white">
                  Our Compass: Vision <span className="text-film-red-600">&</span> Mission
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">Our guiding principles shape every narrative we craft and every connection we build.</p>
                <div className="w-24 h-1 bg-film-red-600 mx-auto mt-6"></div>
              </div>
            </SectionReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              <SectionReveal>
                <Card className="p-8 h-full flex flex-col bg-gray-50 dark:bg-film-black-900 border border-gray-100 dark:border-film-black-800 hover:border-film-red-500/30 dark:hover:border-film-red-500/50 transition-colors duration-300 hover:shadow-lg">
                  <h3 className="text-2xl font-bold mb-4 text-film-red-600">Our Vision</h3>
                  <div className="prose dark:prose-invert text-gray-700 dark:text-gray-300 flex-grow">
                    <p>
                      To be the premier global destination for authentic African cinema, spearheading the elevation of African storytelling and creating a legacy of groundbreaking, culturally resonant films.
                    </p>
                    <p>
                      We envision a world where African narratives are celebrated, respected, and readily accessible, challenging perceptions and inspiring generations.
                    </p>
                  </div>
                </Card>
              </SectionReveal>
              <SectionReveal delay={0.2}>
                <Card className="p-8 h-full flex flex-col bg-gray-50 dark:bg-film-black-900 border border-gray-100 dark:border-film-black-800 hover:border-film-red-500/30 dark:hover:border-film-red-500/50 transition-colors duration-300 hover:shadow-lg">
                  <h3 className="text-2xl font-bold mb-4 text-film-red-600">Our Mission</h3>
                  <div className="prose dark:prose-invert text-gray-700 dark:text-gray-300 flex-grow">
                    <p>
                      To produce captivating and thought-provoking cinematic experiences that celebrate Africa's vibrant storytelling tapestry, showcasing authentic narratives that entertain, inspire, and resonate globally.
                    </p>
                    <p>
                      Through our films, we strive to foster cultural appreciation, bridge community divides, and contribute to a more inclusive and representative global narrative.
                    </p>
                  </div>
                </Card>
              </SectionReveal>
            </div>
          </div>
        </section>

        {/* Core Values Section - Enhanced card styling */}
        <section className="py-20 md:py-28 bg-film-black-950">
          <div className="container mx-auto px-4">
            <SectionReveal>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
                  Our Guiding <span className="text-film-red-500">Values</span>
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                  These principles are the bedrock of our work, influencing every decision from story conception to final cut.
                </p>
                <div className="w-24 h-1 bg-film-red-500 mx-auto mt-6"></div>
              </div>
            </SectionReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {coreValues.map((value, index) => (
                <SectionReveal key={value.title} delay={0.1 * index}>
                  <motion.div
                    whileHover={{ y: -6, boxShadow: "0 15px 30px -15px rgba(229, 62, 62, 0.15)" }} // Red shadow on hover
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                    className="bg-film-black-900 p-8 rounded-lg border border-film-black-800 h-full flex flex-col"
                  >
                    <div className="w-12 h-12 bg-film-red-600/10 rounded-full flex items-center justify-center mb-5 ring-2 ring-film-red-500/30 flex-shrink-0">
                      {value.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3 text-white">{value.title}</h3>
                    <p className="text-gray-400 leading-relaxed flex-grow">{value.description}</p>
                  </motion.div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Milestones Section - Enhanced timeline */}
        <section className="py-20 md:py-28 bg-white dark:bg-film-black-950">
          <div className="container mx-auto px-4">
            <SectionReveal>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-film-black-900 dark:text-white">
                  Charting Our <span className="text-film-red-600">Journey</span>
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                  Key milestones marking our evolution and dedication to authentic African cinema.
                </p>
                <div className="w-24 h-1 bg-film-red-600 mx-auto mt-6"></div>
              </div>
            </SectionReveal>

            {/* Enhanced Timeline */}
            <div className="relative max-w-3xl mx-auto">
              {/* Vertical line with gradient */}
              <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-film-red-500/10 via-film-red-500 to-film-red-500/10 transform -translate-x-1/2 rounded-full"></div>

              {milestones.map((milestone, index) => (
                <SectionReveal key={milestone.year} delay={index * 0.15}>
                  <div className={`relative mb-16 flex items-center ${index % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}>
                    {/* Content Box */}
                    <div className={`w-full lg:w-5/12 ${index % 2 === 0 ? 'lg:text-right' : 'lg:text-left'}`}>
                      <motion.div
                        initial={{ opacity: 0, x: index % 2 === 0 ? 30 : -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.5, ease: "easeOut" }}
                        className="bg-white dark:bg-film-black-900 p-6 rounded-lg shadow-lg border border-gray-100 dark:border-film-black-800 hover:border-film-red-200 dark:hover:border-film-red-800 transition-colors"
                      >
                        <span className="text-film-red-600 dark:text-film-red-500 font-bold text-xl">{milestone.year}</span>
                        <h3 className="text-xl font-semibold mt-1 mb-2 text-film-black-900 dark:text-white">{milestone.title}</h3>
                        <p className="text-gray-600 dark:text-gray-400 text-sm">{milestone.description}</p>
                      </motion.div>
                    </div>

                    {/* Timeline Dot */}
                    <div className="hidden lg:flex w-2/12 justify-center">
                      <motion.div
                        className="w-5 h-5 rounded-full bg-film-red-600 border-4 border-white dark:border-film-black-950 shadow-md relative z-10"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                      ></motion.div>
                    </div>

                    <div className="hidden lg:block w-5/12"></div> {/* Spacer */}
                  </div>
                </SectionReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Team Section - Enhanced team card styling */}
        <section className="py-20 md:py-28 bg-gray-50 dark:bg-film-black-900">
          <div className="container mx-auto px-4">
            <SectionReveal>
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-film-black-900 dark:text-white">
                  Meet the <span className="text-film-red-600">Visionaries</span>
                </h2>
                <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
                  The passionate individuals driving our cinematic vision and commitment to authentic storytelling.
                </p>
                <div className="w-24 h-1 bg-film-red-600 mx-auto mt-6"></div>
              </div>
            </SectionReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <SectionReveal key={member.name} delay={0.1 * index}>
                  <motion.div
                    whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)" }} // Enhanced shadow
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    className="bg-white dark:bg-film-black-950 rounded-xl overflow-hidden shadow-lg h-full flex flex-col border border-gray-100 dark:border-film-black-800"
                  >
                    <div className="relative h-80 group">
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/80 to-transparent"></div>
                      {/* Optional: Social links or icon overlay on hover */}
                    </div>
                    <div className="p-6 flex-grow flex flex-col">
                      <h3 className="text-xl font-bold mb-1 text-film-black-900 dark:text-white">{member.name}</h3>
                      <p className="text-film-red-600 dark:text-film-red-500 font-medium mb-4">{member.role}</p>
                      <p className="text-gray-700 dark:text-gray-300 flex-grow text-sm leading-relaxed">{member.bio}</p>
                      {/* Optional: Add social links */}
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-film-black-800 text-right">
                        <Link href="#" className="text-sm text-film-red-600 dark:text-film-red-500 hover:underline">Read more</Link>
                      </div>
                    </div>
                  </motion.div>
                </SectionReveal>
              ))}
            </div>

            <SectionReveal delay={0.4}>
              <div className="text-center mt-16">
                <Button variant="primary" size="lg">
                  <Link href="/contact">Join Our Mission</Link>
                </Button>
              </div>
            </SectionReveal>
          </div>
        </section>

        {/* CTA Section - Enhanced background */}
        <section className="py-24 md:py-32 relative overflow-hidden bg-film-black-900">
          <div className="absolute inset-0 z-0 opacity-15">
            <Image
              src="/images/hero/hero_cta_bg.jpg" // More dynamic CTA background
              alt="Collaboration background"
              fill
              className="object-cover object-center"
            />
            {/* Darker, more sophisticated gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-film-red-900/80 via-film-black-900/90 to-film-black-900/95 z-10"></div>
          </div>

          <div className="container mx-auto px-4 relative z-20">
            <div className="max-w-3xl mx-auto text-center">
              <SectionReveal>
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-white leading-tight">
                  Ready to Bring Your Story to Life?
                </h2>
              </SectionReveal>
              <SectionReveal delay={0.2}>
                <p className="text-xl text-gray-200 mb-10 leading-relaxed">
                  Whether you're looking to collaborate, invest, join our team, or simply learn more about our vision, we'd love to connect. Let's create something impactful together.
                </p>
              </SectionReveal>
              <SectionReveal delay={0.3}>
                <div className="flex flex-wrap justify-center gap-4">
                  <Button variant="primary" size="lg" className="group">
                    <Link href="/contact" className="flex items-center">Contact Us <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /></Link>
                  </Button>
                  <Button variant="outline" size="lg" className="bg-transparent border-white text-white hover:bg-white/10">
                    <Link href="/productions">Explore Productions</Link>
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

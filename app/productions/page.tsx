// riel-films/app/productions/page.tsx
"use client";
import React from "react";
import { Card, CardContent, CardImage, CardTitle, CardDescription } from "@/components/UI/Card";
import { Button } from "@/components/UI/Button";
import Image from "next/image";
import Link from "next/link";
import PageTransition from "@/components/UI/PageTransition";
import SectionReveal from "@/components/UI/SectionReveal";

const ProductionsPage = () => {
  const currentProductions = [
    {
      title: "Voices of the Delta",
      category: "Documentary",
      status: "In Production",
      description: "A cinematic exploration of the vibrant communities along Ghana's Volta Delta and their resilience in the face of climate change.",
      image: "/images/productions/voices-delta.jpg",
      progress: 65
    },
    {
      title: "Market Queen",
      category: "Feature Film",
      status: "Pre-Production",
      description: "A powerful drama about a determined market woman's rise to become an influential leader in Kumasi's vibrant market scene.",
      image: "/images/productions/market-queen.jpg",
      progress: 30
    },
    {
      title: "Diaspora Dreams",
      category: "Documentary Series",
      status: "Development",
      description: "A four-part series following African diaspora members as they reconnect with their ancestral homelands.",
      image: "/images/productions/diaspora-dreams.jpg",
      progress: 15
    }
  ];

  const collaborationTypes = [
    {
      title: "Co-Production",
      icon: "/images/icons/co-production.svg",
      description: "Partner with us to co-produce feature films, documentaries, or series that align with our vision for authentic African storytelling."
    },
    {
      title: "Distribution",
      icon: "/images/icons/distribution.svg",
      description: "Help bring our completed films to audiences worldwide through theatrical, streaming, or broadcast partnerships."
    },
    {
      title: "Production Services",
      icon: "/images/icons/production-services.svg",
      description: "Utilize our local knowledge, production expertise, and networks for your production needs in Ghana and across West Africa."
    },
    {
      title: "Talent Development",
      icon: "/images/icons/talent.svg",
      description: "Support our initiatives to train and develop emerging African filmmaking talent through workshops and mentorship programs."
    }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-white dark:bg-film-black-950 pt-24">
        <div className="container mx-auto px-4">
          <SectionReveal>
            <h1 className="text-4xl md:text-5xl font-bold mb-16 text-film-black-900 dark:text-white">
              Productions
            </h1>
          </SectionReveal>

          {/* Current Productions */}
          <section className="mb-20">
            <SectionReveal>
              <h2 className="text-3xl font-semibold mb-10 text-film-black-900 dark:text-white">Current Projects</h2>
            </SectionReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentProductions.map((production, index) => (
                <SectionReveal key={index} delay={0.1 * (index % 3)}>
                  <Card className="h-full flex flex-col">
                    <CardImage
                      src={production.image}
                      alt={production.title}
                      aspectRatio="aspect-video"
                    />
                    <CardContent className="flex-grow dark:text-white">
                      <div className="flex justify-between items-start mb-3">
                        <CardTitle>{production.title}</CardTitle>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${production.status === 'In Production'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : production.status === 'Pre-Production'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                          }`}>
                          {production.status}
                        </span>
                      </div>
                      <CardDescription>{production.category}</CardDescription>
                      <p className="text-gray-700 dark:text-gray-300 my-3">{production.description}</p>

                      {/* Progress bar */}
                      <div className="mt-4">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 dark:text-gray-400">Production Progress</span>
                          <span className="font-medium">{production.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                          <div
                            className="bg-film-red-600 dark:bg-film-red-500 h-2.5 rounded-full"
                            style={{ width: `${production.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </CardContent>

                  </Card>
                </SectionReveal>
              ))}
            </div>
          </section>

          {/* Collaboration Opportunities */}
          <section className="mb-20">
            <SectionReveal>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
                <h2 className="text-3xl font-semibold text-film-black-900 dark:text-white">Collaboration Opportunities</h2>
                <Button variant="primary" className="mt-4 md:mt-0">
                  <Link href="/contact">Discuss a Collaboration</Link>
                </Button>
              </div>
            </SectionReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {collaborationTypes.map((collab, index) => (
                <SectionReveal key={index} delay={0.1 * (index % 2)} direction={index % 2 === 0 ? "left" : "right"}>
                  <div className="flex gap-6 p-6 bg-gray-50 dark:bg-film-black-900 rounded-xl border border-gray-100 dark:border-film-black-800">
                    <div className="w-16 h-16 flex-shrink-0 bg-film-red-100 dark:bg-film-red-900/30 rounded-full flex items-center justify-center">
                      <Image src={collab.icon} width={32} height={32} alt={collab.title} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2 text-film-black-900 dark:text-white">{collab.title}</h3>
                      <p className="text-gray-700 dark:text-gray-300">{collab.description}</p>
                    </div>
                  </div>
                </SectionReveal>
              ))}
            </div>
          </section>

          {/* Production Process */}
          <section className="mb-20">
            <SectionReveal>
              <h2 className="text-3xl font-semibold mb-10 text-film-black-900 dark:text-white">Our Production Process</h2>
            </SectionReveal>

            <div className="relative">
              {/* Process timeline */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gray-200 dark:bg-gray-800 transform -translate-x-1/2"></div>

              <div className="space-y-16 relative">
                {/* Step 1 */}
                <div className="md:flex items-center">
                  <div className="md:w-1/2 md:pr-12 md:text-right mb-8 md:mb-0">
                    <h3 className="text-2xl font-semibold mb-3 text-film-black-900 dark:text-white">Development</h3>
                    <p className="text-gray-700 dark:text-gray-300">During this phase, we focus on story development, script writing, research, and securing initial funding. We identify authentic stories that represent the diversity and richness of African experiences.</p>
                  </div>
                  <div className="hidden md:block absolute left-1/2 w-12 h-12 rounded-full bg-film-red-600 transform -translate-x-1/2 flex items-center justify-center text-white font-bold">1</div>
                  <div className="md:w-1/2 md:pl-12"></div>
                </div>

                {/* Step 2 */}
                <div className="md:flex items-center">
                  <div className="md:w-1/2 md:pr-12"></div>
                  <div className="hidden md:block absolute left-1/2 w-12 h-12 rounded-full bg-film-red-600 transform -translate-x-1/2 flex items-center justify-center text-white font-bold">2</div>
                  <div className="md:w-1/2 md:pl-12 mb-8 md:mb-0">
                    <h3 className="text-2xl font-semibold mb-3 text-film-black-900 dark:text-white">Pre-Production</h3>
                    <p className="text-gray-700 dark:text-gray-300">We assemble our creative team, cast actors, scout locations, plan logistics, create shot lists and schedules, and finalize all preparations before filming begins.</p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="md:flex items-center">
                  <div className="md:w-1/2 md:pr-12 md:text-right mb-8 md:mb-0">
                    <h3 className="text-2xl font-semibold mb-3 text-film-black-900 dark:text-white">Production</h3>
                    <p className="text-gray-700 dark:text-gray-300">The filming process begins, where our local expertise and connections shine. We capture authentic moments and stories with respect for cultural nuances and community engagement.</p>
                  </div>
                  <div className="hidden md:block absolute left-1/2 w-12 h-12 rounded-full bg-film-red-600 transform -translate-x-1/2 flex items-center justify-center text-white font-bold">3</div>
                  <div className="md:w-1/2 md:pl-12"></div>
                </div>

                {/* Step 4 */}
                <div className="md:flex items-center">
                  <div className="md:w-1/2 md:pr-12"></div>
                  <div className="hidden md:block absolute left-1/2 w-12 h-12 rounded-full bg-film-red-600 transform -translate-x-1/2 flex items-center justify-center text-white font-bold">4</div>
                  <div className="md:w-1/2 md:pl-12">
                    <h3 className="text-2xl font-semibold mb-3 text-film-black-900 dark:text-white">Post-Production & Distribution</h3>
                    <p className="text-gray-700 dark:text-gray-300">We edit, add sound design, music, color grading, and finalize our productions with meticulous attention to detail. Then we work with our partners to distribute the finished work to audiences worldwide.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="mb-20">
            <SectionReveal direction="up">
              <div className="bg-gradient-to-r from-film-red-600 to-film-red-700 dark:from-film-red-700 dark:to-film-red-800 rounded-xl p-8 md:p-12 text-white">
                <div className="max-w-3xl mx-auto text-center">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4">Have a project in mind?</h2>
                  <p className="mb-6 text-white/90">
                    Whether you're looking to collaborate on a production, distribute a film, or utilize our production services in Ghana, we'd love to hear from you.
                  </p>
                  <Button variant="outline">
                    <Link href="/contact">Start a Conversation</Link>
                  </Button>
                </div>
              </div>
            </SectionReveal>
          </section>
        </div>
      </div>
    </PageTransition>
  );
};

export default ProductionsPage;

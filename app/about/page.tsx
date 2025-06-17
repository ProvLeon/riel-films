"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  Award,
  GraduationCap,
  Video,
  Heart,
  Target,
  Eye,
  Camera,
  Film,
  Star,
  CheckCircle,
  ArrowRight,
  Play,
  Quote
} from "lucide-react";
import { Button } from "@/components/UI/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/Card";
import SectionReveal from "@/components/UI/SectionReveal";
import SmartImage from '@/components/UI/SmartImage';

const AboutPage = () => {
  const stats = [
    { icon: <GraduationCap className="h-8 w-8" />, value: "100+", label: "Students Trained" },
    { icon: <Video className="h-8 w-8" />, value: "50+", label: "Projects Completed" },
    { icon: <Award className="h-8 w-8" />, value: "5+", label: "Years Experience" },
    { icon: <Users className="h-8 w-8" />, value: "15+", label: "Industry Partners" }
  ];

  const values = [
    {
      icon: <Heart className="h-6 w-6" />,
      title: "Creative Impact",
      description: "We believe in the power of storytelling to create meaningful change and inspire communities."
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Authentic Storytelling",
      description: "Every story we tell is rooted in authenticity, capturing the true essence of Ghanaian culture."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Community Growth",
      description: "We're committed to growing Ghana's creative industry through education and mentorship."
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: "Visual Excellence",
      description: "We maintain the highest standards in visual production and technical execution."
    }
  ];

  const services = [
    {
      icon: <Film className="h-6 w-6" />,
      title: "Film Production",
      description: "Short films, documentaries, music videos, and corporate content production",
      highlights: ["Professional Equipment", "Experienced Crew", "Full Post-Production"]
    },
    {
      icon: <GraduationCap className="h-6 w-6" />,
      title: "Film Academy",
      description: "Comprehensive 8-week training program for aspiring filmmakers",
      highlights: ["Hands-on Learning", "Industry Mentorship", "Real Set Experience"]
    },
    {
      icon: <Camera className="h-6 w-6" />,
      title: "Event Coverage",
      description: "Weddings, corporate events, live streaming, and photography services",
      highlights: ["Multi-Camera Setup", "Live Streaming", "Same-Day Highlights"]
    }
  ];

  const team = [
    {
      name: "Emmanuel Riel",
      role: "Founder & Director",
      bio: "Visionary filmmaker with over 5 years of experience in African cinema and education.",
      image: "/images/hero/hero1.jpg",
      expertise: ["Direction", "Scriptwriting", "Film Education"]
    },
    {
      name: "Sarah Mensah",
      role: "Head of Academy",
      bio: "Passionate educator and filmmaker dedicated to nurturing the next generation of talent.",
      image: "/images/hero/hero2.jpg",
      expertise: ["Education", "Curriculum Development", "Student Mentorship"]
    },
    {
      name: "Kwame Asante",
      role: "Lead Cinematographer",
      bio: "Award-winning cinematographer with expertise in both documentary and narrative filmmaking.",
      image: "/images/hero/hero3.jpg",
      expertise: ["Cinematography", "Camera Operation", "Visual Storytelling"]
    }
  ];

  const milestones = [
    {
      year: "2019",
      title: "RIEL FILMS Founded",
      description: "Started as a small production company with a vision to tell authentic African stories."
    },
    {
      year: "2020",
      title: "First Documentary",
      description: "Released our first major documentary exploring Ghanaian cultural traditions."
    },
    {
      year: "2021",
      title: "Academy Launch",
      description: "Founded RIEL FILMS ACADEMY to train the next generation of filmmakers."
    },
    {
      year: "2022",
      title: "100+ Students",
      description: "Reached milestone of training over 100 students in filmmaking skills."
    },
    {
      year: "2023",
      title: "Industry Recognition",
      description: "Received recognition for contribution to Ghana's creative industry development."
    },
    {
      year: "2024",
      title: "Expansion",
      description: "Expanded services and launched new training programs with industry partnerships."
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-film-black-950">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <SmartImage
            src="/images/hero/hero7.jpg"
            alt="RIEL FILMS team"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-film-black-950/95 via-film-black-950/80 to-film-black-950/70"></div>
        </div>

        <div className="relative container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center text-white"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              About <span className="text-film-red-500">RIEL FILMS</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
              Where creativity meets education. We're not just making films — we're building the future of Ghana's creative industry.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg">
                <Link href="#our-story">Our Story</Link>
              </Button>
              <Button variant="secondary" size="lg" className="text-white border-white hover:bg-white/20">
                <Link href="#team">Meet the Team</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <SectionReveal>
        <section className="py-16 lg:py-24 bg-gray-50 dark:bg-film-black-900">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="p-4 bg-film-red-100 dark:bg-film-red-900/20 rounded-full w-fit mx-auto mb-4 text-film-red-600 dark:text-film-red-400">
                    {stat.icon}
                  </div>
                  <div className="text-3xl md:text-4xl font-bold mb-2 text-film-red-500">{stat.value}</div>
                  <div className="text-gray-600 dark:text-gray-300 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* Our Story */}
      <SectionReveal>
        <section id="our-story" className="py-16 lg:py-24">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold mb-6 dark:text-white text-film-black-900">
                  Our Story
                </h2>
                <div className="space-y-6 text-lg text-gray-600 dark:text-gray-300">
                  <p>
                    <strong className="text-film-red-500">RIEL FILMS</strong> is a Ghanaian-based film production company that brings ideas to life — from short films and music videos to corporate events and documentaries.
                  </p>
                  <p>
                    As part of our vision to grow Ghana's creative industry, we founded <strong className="text-film-red-500">RIEL FILMS ACADEMY</strong> — our official training wing. Here, we pass on what we practice, training the next generation of filmmakers through hands-on mentorship and real-life industry experience.
                  </p>
                  <p>
                    Whether on set or in class, one thing is clear: <strong className="text-film-red-500">We're all about creative impact.</strong>
                  </p>
                </div>
                <div className="mt-8">
                  <Button variant="primary" size="lg">
                    <Link href="/films">View Our Work</Link>
                  </Button>
                </div>
              </div>

              <div className="relative">
                <SmartImage
                  src="/images/hero/hero8.jpg"
                  alt="RIEL FILMS behind the scenes"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-xl"
                />
                <div className="absolute -bottom-6 -right-6 bg-film-red-500 text-white p-6 rounded-lg shadow-lg">
                  <div className="text-2xl font-bold">5+</div>
                  <div className="text-sm">Years of Excellence</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* Our Values */}
      <SectionReveal>
        <section className="py-16 lg:py-24 bg-gray-50 dark:bg-film-black-900">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 dark:text-white text-film-black-900">
                Our Values
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                These core values guide everything we do, from the stories we tell to the students we train.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full text-center border-l-4 border-l-film-red-500">
                    <CardContent className="p-6">
                      <div className="p-3 bg-film-red-100 dark:bg-film-red-900/20 rounded-full w-fit mx-auto mb-4 text-film-red-600 dark:text-film-red-400">
                        {value.icon}
                      </div>
                      <h3 className="font-semibold text-lg mb-3 dark:text-white">{value.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{value.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* What We Do */}
      <SectionReveal>
        <section className="py-16 lg:py-24">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 dark:text-white text-film-black-900">
                What We Do
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                We operate in two main areas: professional film production and comprehensive film education.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                    <CardHeader>
                      <div className="p-3 bg-film-red-100 dark:bg-film-red-900/20 rounded-full w-fit mb-4 text-film-red-600 dark:text-film-red-400">
                        {service.icon}
                      </div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">{service.description}</p>
                      <ul className="space-y-2">
                        {service.highlights.map((highlight, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                            <CheckCircle className="h-4 w-4 text-film-red-500 flex-shrink-0" />
                            {highlight}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* Team Section */}
      <SectionReveal>
        <section id="team" className="py-16 lg:py-24 bg-gray-50 dark:bg-film-black-900">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 dark:text-white text-film-black-900">
                Meet Our Team
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                The passionate professionals behind RIEL FILMS and RIEL FILMS ACADEMY.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full">
                    <div className="relative aspect-square overflow-hidden rounded-t-xl">
                      <SmartImage
                        src={member.image}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <CardContent className="p-6">
                      <h3 className="font-bold text-xl mb-1 dark:text-white">{member.name}</h3>
                      <p className="text-film-red-500 font-medium mb-3">{member.role}</p>
                      <p className="text-gray-600 dark:text-gray-300 mb-4">{member.bio}</p>
                      <div className="flex flex-wrap gap-2">
                        {member.expertise.map((skill, idx) => (
                          <span key={idx} className="px-2 py-1 bg-film-red-100 dark:bg-film-red-900/20 text-film-red-600 dark:text-film-red-400 text-xs rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* Timeline */}
      <SectionReveal>
        <section className="py-16 lg:py-24">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 dark:text-white text-film-black-900">
                Our Journey
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                From a small production company to a comprehensive film education center — our growth story.
              </p>
            </div>

            <div className="relative">
              <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-film-red-200 dark:bg-film-red-800"></div>

              <div className="space-y-12">
                {milestones.map((milestone, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className={`relative flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                      <div className="bg-white dark:bg-film-black-900 p-6 rounded-lg shadow-lg border border-gray-100 dark:border-film-black-800">
                        <div className="text-2xl font-bold text-film-red-500 mb-2">{milestone.year}</div>
                        <h3 className="font-semibold text-lg mb-3 dark:text-white">{milestone.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300">{milestone.description}</p>
                      </div>
                    </div>

                    <div className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-film-red-500 rounded-full border-4 border-white dark:border-film-black-950"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* Mission Statement */}
      <SectionReveal>
        <section className="py-16 lg:py-24 bg-film-red-500">
          <div className="container-custom">
            <div className="text-center text-white">
              <Quote className="h-12 w-12 mx-auto mb-6 opacity-50" />
              <h2 className="text-3xl md:text-5xl font-bold mb-8">
                Our Mission
              </h2>
              <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto leading-relaxed">
                "To grow Ghana's creative industry by producing authentic visual content and training the next generation of filmmakers through hands-on education and real industry experience."
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg" className="bg-white text-film-red-500 hover:bg-gray-100">
                  <Link href="/academy">Join Our Academy</Link>
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/20">
                  <Link href="/productions">Hire Our Services</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* Contact CTA */}
      <SectionReveal>
        <section className="py-16 lg:py-24">
          <div className="container-custom">
            <div className="text-center max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 dark:text-white text-film-black-900">
                Ready to Work With Us?
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                Whether you're looking to create compelling visual content or learn the art of filmmaking, we're here to help you achieve your goals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="primary" size="lg">
                  <Link href="/contact">Get in Touch</Link>
                </Button>
                <Button variant="secondary" size="lg">
                  <Link href="/films">View Our Portfolio</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </SectionReveal>
    </div>
  );
};

export default AboutPage;

"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Video,
  Camera,
  Music,
  Building2,
  Heart,
  Radio,
  Users,
  Award,
  CheckCircle,
  Star,
  Play,
  ArrowRight,
  Mic,
  Film,
  Eye
} from "lucide-react";
import { Button } from "@/components/UI/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/Card";
import SectionReveal from "@/components/UI/SectionReveal";
import SmartImage from '@/components/UI/SmartImage';
import { useRouter } from "next/navigation";
import Image from "next/image";

const ProductionsPage = () => {

  const router = useRouter();

  const productionServices = [
    {
      icon: <Music className="h-8 w-8" />,
      title: "Music Videos",
      description: "Creative and professional music video production that brings your sound to life with stunning visuals.",
      features: ["Creative Direction", "Multi-Camera Setup", "Professional Lighting", "Post-Production"],
      image: "/images/hero/hero1.jpg",
      price: "Starting from GHS 2,500",
      duration: "2-3 days production"
    },
    {
      icon: <Building2 className="h-8 w-8" />,
      title: "Corporate Events",
      description: "Professional coverage of corporate functions, conferences, and business events.",
      features: ["Multi-Camera Coverage", "Live Streaming Options", "Event Highlights", "Professional Editing"],
      image: "/images/hero/hero2.jpg",
      price: "Starting from GHS 1,800",
      duration: "1-2 days production"
    },
    {
      icon: <Film className="h-8 w-8" />,
      title: "Documentaries",
      description: "Compelling documentary storytelling that captures reality and tells meaningful stories.",
      features: ["Research & Planning", "Interview Setup", "B-Roll Coverage", "Story Development"],
      image: "/images/hero/hero3.jpg",
      price: "Starting from GHS 5,000",
      duration: "2-4 weeks production"
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Weddings",
      description: "Beautiful wedding cinematography to capture your special day with cinematic excellence.",
      features: ["Ceremony Coverage", "Reception Filming", "Drone Shots", "Highlight Reel"],
      image: "/images/hero/hero4.jpg",
      price: "Starting from GHS 3,200",
      duration: "1-2 days production"
    },
    {
      icon: <Radio className="h-8 w-8" />,
      title: "Live Streaming",
      description: "Professional live streaming services for events, conferences, and special occasions.",
      features: ["HD Live Streaming", "Multi-Platform Broadcasting", "Real-time Monitoring", "Interactive Features"],
      image: "/images/hero/hero5.jpg",
      price: "Starting from GHS 1,200",
      duration: "Event duration"
    },
    {
      icon: <Camera className="h-8 w-8" />,
      title: "Photography",
      description: "Professional photography services for portraits, events, and commercial needs.",
      features: ["Portrait Photography", "Event Photography", "Product Photography", "Professional Editing"],
      image: "/images/hero/hero6.jpg",
      price: "Starting from GHS 800",
      duration: "Half day to full day"
    }
  ];

  const workProcess = [
    {
      step: "01",
      title: "Consultation",
      description: "We discuss your vision, requirements, and budget to create the perfect plan for your project."
    },
    {
      step: "02",
      title: "Pre-Production",
      description: "Detailed planning including storyboarding, location scouting, and equipment preparation."
    },
    {
      step: "03",
      title: "Production",
      description: "Professional filming with our experienced crew using industry-standard equipment."
    },
    {
      step: "04",
      title: "Post-Production",
      description: "Expert editing, color grading, sound design, and final delivery in your preferred format."
    }
  ];

  const testimonials = [
    {
      name: "Kwame Asante",
      role: "Event Coordinator",
      company: "Elite Events Ghana",
      content: "RIEL FILMS captured our corporate event beautifully. The team was professional and the final video exceeded our expectations.",
      rating: 5,
      service: "Corporate Events"
    },
    {
      name: "Ama & Kofi",
      role: "Couple",
      company: "Wedding Clients",
      content: "Our wedding video is absolutely stunning! They captured every precious moment perfectly. We couldn't be happier.",
      rating: 5,
      service: "Wedding Cinematography"
    },
    {
      name: "DJ Rhythmic",
      role: "Musician",
      company: "Independent Artist",
      content: "The music video they created for my latest single has over 100K views! Their creative vision brought my song to life.",
      rating: 5,
      service: "Music Videos"
    }
  ];

  const whyChooseUs = [
    {
      icon: <Award className="h-6 w-6" />,
      title: "Professional Quality",
      description: "Industry-standard equipment and experienced crew ensure top-quality results"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Experienced Team",
      description: "Our team has years of experience in film production and storytelling"
    },
    {
      icon: <Eye className="h-6 w-6" />,
      title: "Creative Vision",
      description: "We bring fresh, creative perspectives to every project we undertake"
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Reliable Service",
      description: "On-time delivery and professional service you can count on"
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-film-black-950">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <SmartImage
            src="/images/hero/hero7.jpg"
            alt="RIEL FILMS Production Services"
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
              Film Production <span className="text-film-red-500">Services</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 max-w-3xl mx-auto">
              We direct, shoot, edit, and deliver visual content that connects with real people. Every project is built with care — from script to screen.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg">
                <Link href="#services">View Services</Link>
              </Button>
              <Button variant="secondary" size="lg" className="text-white border-white hover:bg-white/20">
                <Link href="/contact">Get Quote</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <SectionReveal>
        <section id="services" className="py-16 lg:py-24">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 dark:text-white text-film-black-900">
                Our Production Services
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                From concept to completion, we offer comprehensive film production services tailored to your specific needs.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {productionServices.map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-xl transition-shadow duration-300 group">
                    <div className="relative aspect-video overflow-hidden rounded-t-xl">
                      <SmartImage
                        src={service.image}
                        alt={service.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute top-4 left-4">
                        <div className="p-3 bg-film-red-500/90 rounded-full text-white backdrop-blur-sm">
                          {service.icon}
                        </div>
                      </div>
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white font-bold text-xl mb-1">{service.title}</h3>
                        <p className="text-white/80 text-sm">{service.duration}</p>
                      </div>
                    </div>

                    <CardContent className="p-6">
                      <p className="text-gray-600 dark:text-gray-300 mb-4">
                        {service.description}
                      </p>

                      <div className="mb-4">
                        <h4 className="font-semibold mb-2 dark:text-white">What's Included:</h4>
                        <ul className="space-y-1">
                          {service.features.map((feature, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                              <CheckCircle className="h-4 w-4 text-film-red-500 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                        <span className="font-semibold text-film-red-500">{service.price}</span>
                        <Button variant="outline" size="sm">
                          <Link href="/contact">Get Quote</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* Why Choose Us */}
      <SectionReveal>
        <section className="py-16 lg:py-24 bg-gray-50 dark:bg-film-black-900">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 dark:text-white text-film-black-900">
                Why Choose <span className="text-film-red-500">RIEL FILMS</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                We combine technical expertise with creative vision to deliver exceptional results for every project.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {whyChooseUs.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="p-4 bg-film-red-100 dark:bg-film-red-900/20 rounded-full w-fit mx-auto mb-4 text-film-red-600 dark:text-film-red-400">
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-2 dark:text-white">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* Our Process */}
      <SectionReveal>
        <section className="py-16 lg:py-24">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 dark:text-white text-film-black-900">
                Our Production Process
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                From initial consultation to final delivery, we follow a proven process to ensure exceptional results.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {workProcess.map((process, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-film-red-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
                      {process.step}
                    </div>
                    <h3 className="font-semibold text-xl mb-3 dark:text-white">{process.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{process.description}</p>
                  </div>
                  {index < workProcess.length - 1 && (
                    <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-film-red-200 dark:bg-film-red-800 -translate-x-8"></div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* Client Testimonials */}
      <SectionReveal>
        <section className="py-16 lg:py-24 bg-gray-50 dark:bg-film-black-900">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 dark:text-white text-film-black-900">
                What Our Clients Say
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Don't just take our word for it. Here's what our satisfied clients have to say about our work.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="flex mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                        "{testimonial.content}"
                      </p>
                      <div className="border-t pt-4">
                        <h4 className="font-semibold dark:text-white">{testimonial.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                        <p className="text-sm text-film-red-500 font-medium">{testimonial.service}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* Portfolio Showcase */}
      {/* <SectionReveal>
        <section className="py-16 lg:py-24">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 dark:text-white text-film-black-900">
                Recent Work
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Take a look at some of our recent production work across different service categories.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="group overflow-hidden">
                    <div className="relative aspect-video overflow-hidden bg-gray-200 dark:bg-gray-700">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <Play className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500 text-sm">Sample Project {item}</p>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button variant="primary" size="sm" onClick={() => router.push(`/productions/${item}`)}>
                          View Project
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-1 dark:text-white">Project Title {item}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Service Category</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Button variant="primary" size="lg">
                <Link href="/films">View All Projects</Link>
              </Button>
            </div>
          </div>
        </section>
      </SectionReveal> */}

      {/* CTA Section */}
      <SectionReveal>
        <section className="py-16 lg:py-24 bg-film-red-500">
          <div className="container-custom">
            <div className="text-center text-white">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                Ready to Bring Your Vision to Life?
              </h2>
              <p className="text-xl mb-8 max-w-3xl mx-auto">
                Let's discuss your project and create something amazing together. Get in touch with us today for a free consultation.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="secondary" size="lg" className="bg-white text-film-red-500 hover:bg-gray-100">
                  <Link href="/contact">Get Free Quote</Link>
                </Button>
                <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/20">
                  <Link href="/contact">Schedule Consultation</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </SectionReveal>
    </div>
  );
};

export default ProductionsPage;

"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  GraduationCap,
  Video,
  Camera,
  Edit3,
  Users,
  Award,
  Clock,
  Calendar,
  CheckCircle,
  Star,
  PlayCircle,
  Lightbulb,
  Mic,
  Palette
} from "lucide-react";
import { Button } from "@/components/UI/Button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/UI/Card";
import SectionReveal from "@/components/UI/SectionReveal";
import SmartImage from '@/components/UI/SmartImage';

const AcademyPage = () => {
  const programs = [
    {
      icon: <Video className="h-8 w-8" />,
      title: "Directing & Scriptwriting",
      description: "Master the art of visual storytelling and bring your creative vision to life.",
      duration: "2 weeks"
    },
    {
      icon: <Camera className="h-8 w-8" />,
      title: "Camera Operation",
      description: "Learn professional camera techniques, lighting, and composition.",
      duration: "2 weeks"
    },
    {
      icon: <Edit3 className="h-8 w-8" />,
      title: "Video Editing",
      description: "Master industry-standard editing software and post-production workflow.",
      duration: "1.5 weeks"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Acting for Screen",
      description: "Develop your acting skills specifically for film and television.",
      duration: "1 week"
    },
    {
      icon: <PlayCircle className="h-8 w-8" />,
      title: "Content Creation",
      description: "Create engaging content for social media and digital platforms.",
      duration: "1 week"
    },
    {
      icon: <Lightbulb className="h-8 w-8" />,
      title: "Set Design & Lighting",
      description: "Learn the fundamentals of creating compelling visual environments.",
      duration: "1 week"
    },
    {
      icon: <Mic className="h-8 w-8" />,
      title: "Sound & Music for Film",
      description: "Understanding audio production and music integration in filmmaking.",
      duration: "0.5 weeks"
    }
  ];

  const features = [
    {
      icon: <Award className="h-6 w-6" />,
      title: "Real Set Experience",
      description: "Work on actual RIEL FILMS productions during your training"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Industry Mentorship",
      description: "Learn directly from working professionals in the film industry"
    },
    {
      icon: <Clock className="h-6 w-6" />,
      title: "Flexible Schedule",
      description: "Choose between weekday or weekend training options"
    },
    {
      icon: <GraduationCap className="h-6 w-6" />,
      title: "Certificate Program",
      description: "Receive official certification upon successful completion"
    }
  ];

  const testimonials = [
    {
      name: "Kwame Asante",
      role: "Graduate - Director",
      content: "RIEL FILMS ACADEMY transformed my passion into professional skills. The hands-on experience was invaluable.",
      rating: 5
    },
    {
      name: "Ama Osei",
      role: "Graduate - Editor",
      content: "The mentorship and real-world projects gave me confidence to start my own production company.",
      rating: 5
    },
    {
      name: "Kofi Mensah",
      role: "Graduate - Camera Operator",
      content: "From zero experience to working on professional sets - this program changed my life.",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-film-black-950">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0">
          <SmartImage
            src="/images/hero/hero5.jpg"
            alt="RIEL FILMS Academy classroom session"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-film-black-950/90 via-film-black-950/70 to-film-black-950/90"></div>
        </div>

        <div className="relative container-custom">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center text-white"
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              RIEL FILMS <span className="text-film-red-500">ACADEMY</span>
            </h1>
            <p className="text-xl md:text-2xl mb-4 font-medium">
              "You don't need a film background — just the passion."
            </p>
            <p className="text-lg md:text-xl mb-8 text-white/90 max-w-3xl mx-auto">
              Where raw talent becomes real skill. Whether you want to direct, act, edit, or write — we'll teach you the craft and walk with you every step of the way.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg">
                <Link href="#apply">Apply Now</Link>
              </Button>
              <Button variant="secondary" size="lg" className="text-white border-white hover:bg-white/20">
                <Link href="#programs">View Programs</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Program Overview */}
      <SectionReveal>
        <section id="programs" className="py-16 lg:py-24">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 dark:text-white text-film-black-900">
                What We Teach
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Our comprehensive 8-week program covers all aspects of filmmaking, from pre-production to post-production.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {programs.map((program, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-film-red-500">
                    <CardHeader>
                      <div className="flex items-center gap-4 mb-4">
                        <div className="p-3 bg-film-red-100 dark:bg-film-red-900/20 rounded-full text-film-red-600 dark:text-film-red-400">
                          {program.icon}
                        </div>
                        <div>
                          <CardTitle className="text-xl mb-2">{program.title}</CardTitle>
                          <span className="text-sm text-film-red-500 font-medium">{program.duration}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-300">{program.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* Learn by Doing Section */}
      <SectionReveal>
        <section className="py-16 lg:py-24 bg-gray-50 dark:bg-film-black-900">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-5xl font-bold mb-6 dark:text-white text-film-black-900">
                  Learn by <span className="text-film-red-500">Doing</span>
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
                  Our students work on real sets and projects produced by RIEL FILMS. This hands-on approach ensures you graduate with actual industry experience and a portfolio of professional work.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="p-2 bg-film-red-100 dark:bg-film-red-900/20 rounded-lg text-film-red-600 dark:text-film-red-400 mt-1">
                        {feature.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1 dark:text-white">{feature.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{feature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative">
                <SmartImage
                  src="/images/hero/hero6.jpg"
                  alt="Students working on film set"
                  width={600}
                  height={400}
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* Program Details */}
      <SectionReveal>
        <section className="py-16 lg:py-24">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold mb-6 dark:text-white text-film-black-900">
                  Duration & Intake
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="text-center">
                  <CardHeader>
                    <div className="mx-auto p-4 bg-film-red-100 dark:bg-film-red-900/20 rounded-full w-fit mb-4">
                      <Clock className="h-8 w-8 text-film-red-600 dark:text-film-red-400" />
                    </div>
                    <CardTitle>8 Week Program</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300">
                      Intensive training covering all aspects of filmmaking in just 8 weeks.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardHeader>
                    <div className="mx-auto p-4 bg-film-red-100 dark:bg-film-red-900/20 rounded-full w-fit mb-4">
                      <Calendar className="h-8 w-8 text-film-red-600 dark:text-film-red-400" />
                    </div>
                    <CardTitle>Flexible Schedule</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300">
                      Choose between weekday and weekend training options to fit your schedule.
                    </p>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardHeader>
                    <div className="mx-auto p-4 bg-film-red-100 dark:bg-film-red-900/20 rounded-full w-fit mb-4">
                      <GraduationCap className="h-8 w-8 text-film-red-600 dark:text-film-red-400" />
                    </div>
                    <CardTitle>Scholarships Available</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 dark:text-gray-300">
                      Financial assistance available for deserving candidates with exceptional talent.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* Student Success Stories */}
      <SectionReveal>
        <section className="py-16 lg:py-24 bg-gray-50 dark:bg-film-black-900">
          <div className="container-custom">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 dark:text-white text-film-black-900">
                Student Success Stories
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Hear from our graduates who are now working professionals in the film industry.
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
                      <div>
                        <h4 className="font-semibold dark:text-white">{testimonial.name}</h4>
                        <p className="text-sm text-film-red-500">{testimonial.role}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </SectionReveal>

      {/* Application Section */}
      <SectionReveal>
        <section id="apply" className="py-16 lg:py-24">
          <div className="container-custom">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 dark:text-white text-film-black-900">
                Ready to Start Your <span className="text-film-red-500">Film Journey?</span>
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                "Whatever brings you here — a dream, a role, or a story — we're ready to create with you."
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button variant="primary" size="lg">
                  <Link href="/contact?type=academy">Apply Now</Link>
                </Button>
                <Button variant="secondary" size="lg">
                  <Link href="/contact?type=info">Request Info</Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-film-red-500" />
                      Application Process
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                      <li>• Submit online application form</li>
                      <li>• Attend brief interview session</li>
                      <li>• Portfolio review (if applicable)</li>
                      <li>• Receive acceptance notification</li>
                    </ul>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-film-red-500" />
                      What You'll Need
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-gray-600 dark:text-gray-300">
                      <li>• Passion for filmmaking</li>
                      <li>• Commitment to 8-week program</li>
                      <li>• Basic computer literacy</li>
                      <li>• Creative mindset and willingness to learn</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </SectionReveal>
    </div>
  );
};

export default AcademyPage;

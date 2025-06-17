"use client";
import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, GraduationCap, Video, Users, Play } from "lucide-react";
import { Button } from "@/components/UI/Button";
import SmartImage from "@/components/UI/SmartImage";

interface CTASectionProps {
  title?: string;
  subtitle?: string;
  primaryCta?: {
    text: string;
    link: string;
  };
  secondaryCta?: {
    text: string;
    link: string;
  };
  className?: string;
}

const CTASection: React.FC<CTASectionProps> = ({
  title = "Ready to Start Your Creative Journey?",
  subtitle = "Whether you want to learn filmmaking or need professional production services, we're here to help you succeed.",
  primaryCta = {
    text: "Join Our Academy",
    link: "/academy",
  },
  secondaryCta = {
    text: "Hire Our Services",
    link: "/productions",
  },
  className = "",
}) => {
  return (
    <section
      className={`relative overflow-hidden py-20 md:py-24 ${className}`}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <SmartImage
          src="/images/hero/hero4.jpg"
          alt="RIEL FILMS production and training"
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-film-black-950/95 via-film-black-950/85 to-film-black-950/95"></div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -left-24 top-1/4 w-64 h-64 rounded-full bg-film-red-500/20 blur-3xl"></div>
      <div className="absolute -right-24 bottom-1/4 w-80 h-80 rounded-full bg-film-red-500/10 blur-3xl"></div>

      <div className="container-custom relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight text-white">
              {title}
            </h2>
            <p className="text-lg md:text-xl max-w-3xl mx-auto mb-12 text-white/90 leading-relaxed">
              {subtitle}
            </p>

            {/* Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 max-w-4xl mx-auto">
              {/* Academy Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 hover:bg-white/15 transition-colors duration-300 group"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-film-red-500 rounded-full mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Learn Filmmaking</h3>
                <p className="text-white/80 mb-6">
                  Join our 8-week academy program and learn from industry professionals through hands-on training.
                </p>
                <ul className="text-white/70 text-sm space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-film-red-500 rounded-full"></div>
                    Real set experience
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-film-red-500 rounded-full"></div>
                    Industry mentorship
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-film-red-500 rounded-full"></div>
                    Certificate program
                  </li>
                </ul>
                <Button variant="primary" className="w-full group-hover:shadow-lg transition-shadow">
                  <Link href="/academy" className="flex items-center justify-center">
                    Enroll Now
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </motion.div>

              {/* Production Services Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8 hover:bg-white/15 transition-colors duration-300 group"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-film-red-500 rounded-full mb-6 mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Video className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Hire Our Services</h3>
                <p className="text-white/80 mb-6">
                  Professional film production services for all your creative and business needs.
                </p>
                <ul className="text-white/70 text-sm space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-film-red-500 rounded-full"></div>
                    Music videos & documentaries
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-film-red-500 rounded-full"></div>
                    Corporate events & weddings
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-film-red-500 rounded-full"></div>
                    Live streaming & photography
                  </li>
                </ul>
                <Button variant="outline" className="w-full text-white border-white hover:bg-white/20 group-hover:shadow-lg transition-shadow">
                  <Link href="/productions" className="flex items-center justify-center">
                    Get Quote
                    <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </motion.div>
            </div>

            {/* Bottom CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row justify-center gap-4 mb-12"
            >
              <Button variant="primary" size="lg" className="group">
                <Link href={primaryCta.link} className="flex items-center">
                  {primaryCta.text}
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/20">
                <Link href={secondaryCta.link}>
                  {secondaryCta.text}
                </Link>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-8 text-white/80"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-film-red-500/20 rounded-lg">
                  <GraduationCap className="h-5 w-5 text-film-red-400" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">100+</div>
                  <div className="text-sm">Students Trained</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-film-red-500/20 rounded-lg">
                  <Video className="h-5 w-5 text-film-red-400" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">50+</div>
                  <div className="text-sm">Projects Completed</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-film-red-500/20 rounded-lg">
                  <Users className="h-5 w-5 text-film-red-400" />
                </div>
                <div>
                  <div className="text-xl font-bold text-white">5+</div>
                  <div className="text-sm">Years Experience</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Quote Section */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
      >
        <p className="text-white/60 italic text-sm max-w-md">
          "Whatever brings you here — a dream, a role, or a story — we're ready to create with you."
        </p>
      </motion.div>
    </section>
  );
};

export default CTASection;

"use client";
import React, { useState, useEffect, useCallback, Suspense, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import PageTransition from "@/components/UI/PageTransition";
import SectionReveal from "@/components/UI/SectionReveal";
import { Button } from "@/components/UI/Button";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Play, Calendar, Clock, User, MessageCircle, ChevronRight, ChevronDown, ChevronUp, Check, Milestone, Activity, Users as UsersIcon, HelpCircle, DollarSign, FileText } from "lucide-react"; // Added more icons
import { Production } from '@/types/mongodbSchema';
import { useProduction } from '@/hooks/useProduction';
import { ProductionDetailSkeleton } from "@/components/skeletons/ProductionDetailSkeleton"; // Import skeleton
import { formatDate, getStatusColor } from "@/lib/utils"; // Import utils

type ActiveTab = 'about' | 'updates' | 'team' | 'support';

// Helper styles
const sectionTitleClass = "text-2xl md:text-3xl font-bold mb-6 text-film-black-900 dark:text-white";
const iconStyleClass = "h-6 w-6 text-film-red-500 mr-3 flex-shrink-0";
const detailLabelClass = "text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase mb-1 tracking-wider";
const detailValueClass = "text-gray-900 dark:text-gray-100";

const ProductionDetailPage = () => {
  const params = useParams();
  const slug = params?.slug as string;
  const { production, isLoading, error } = useProduction(slug);
  const [activeTab, setActiveTab] = useState<ActiveTab>('about');
  const [showTrailer, setShowTrailer] = useState(false);
  const [expandedFaqItem, setExpandedFaqItem] = useState<number | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Handle scroll tracking
  useEffect(() => {
    const handleScroll = () => { /* ... (same as before) ... */ };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle body scroll lock for modal
  useEffect(() => {
    if (showTrailer) { document.body.style.overflow = "hidden"; }
    else { document.body.style.overflow = "auto"; }
    return () => { document.body.style.overflow = "auto"; }; // Cleanup on unmount
  }, [showTrailer]);

  const toggleTrailer = useCallback(() => setShowTrailer(prev => !prev), []);
  const toggleFaqItem = useCallback((index: number) => {
    setExpandedFaqItem(prev => prev === index ? null : index);
  }, []);

  // Calculate stage status styling
  const getStageStatusVisuals = useCallback((status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return { statusClass: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300', icon: <Check className="h-5 w-5" />, dotClass: 'bg-green-500 border-green-600' };
      case 'in-progress': return { statusClass: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300', icon: <motion.div className="h-3 w-3 rounded-full bg-blue-500 dark:bg-blue-400" animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} />, dotClass: 'bg-blue-500 border-blue-600 animate-pulse' };
      default: return { statusClass: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300', icon: <div className="h-3 w-3 rounded-full border-2 border-gray-400 dark:border-gray-500" />, dotClass: 'bg-gray-200 dark:bg-film-black-800 border-gray-400 dark:border-gray-600' };
    }
  }, []);

  // Loading State
  if (isLoading) return <ProductionDetailSkeleton />;
  // Error or Not Found State
  if (error || !production) notFound();

  return (
    <PageTransition>
      {/* <PageViewTracker pageType="production" itemId={production?.id} /> */}
      <div className="min-h-screen bg-white dark:bg-film-black-950 pt-20 pb-20"> {/* Adjusted pt */}
        {/* Reading progress bar */}
        <div className="fixed top-[72px] left-0 right-0 h-1 bg-gray-200 dark:bg-film-black-800 z-30"> {/* Adjusted top */}
          <motion.div className="h-full bg-film-red-600 dark:bg-film-red-700" style={{ width: `${scrollProgress}%` }} />
        </div>

        {/* Hero section */}
        <div className="relative w-full h-[60vh] md:h-[75vh] overflow-hidden">
          <Image src={production.image} alt={production.title} fill className="object-cover object-center" priority onError={(e) => { e.currentTarget.src = "/images/hero/hero_placeholder.jpg"; }} />
          <div className="absolute inset-0 bg-gradient-to-t from-film-black-950 via-film-black-900/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-film-black-950/60 to-transparent" />
          <div className="container mx-auto px-4 h-full flex flex-col justify-end pb-12 relative z-10">
            <SectionReveal>
              <div className="max-w-4xl">
                <div className="flex items-center mb-4"><Link href="/productions" className="flex items-center text-white hover:text-film-red-400 transition-colors text-sm"><ArrowLeft className="mr-2 h-4 w-4" />Back to Productions</Link></div>
                <div className="flex flex-wrap items-center gap-3 mb-4"><span className={`inline-block px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(production.status)}`}>{production.status}</span><span className="text-white/90 text-sm">{production.category}</span></div>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-6">{production.title}</h1>
                <p className="text-lg md:text-xl text-white/90 max-w-3xl mb-8 line-clamp-3">{production.description}</p>
                <div className="flex flex-wrap gap-4">
                  <Button variant="primary" onClick={toggleTrailer} className="group" size="lg"><Play className="mr-2 h-5 w-5 fill-current" />Watch Preview</Button>
                  <Button variant="outline" className="bg-transparent border-white text-white hover:bg-white/10" size="lg"><Link href="#support" onClick={() => setActiveTab('support')}>Support This Film</Link></Button>
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>

        {/* Production Progress */}
        <div className="bg-gray-50 dark:bg-film-black-900 py-10 border-b border-gray-200 dark:border-film-black-800">
          <div className="container mx-auto px-4">
            <SectionReveal>
              <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg md:text-xl font-bold text-film-black-900 dark:text-white">Production Progress</h2>
                  <div className="text-film-red-600 dark:text-film-red-500 font-bold text-lg">{production.progress}%</div>
                </div>
                <div className="w-full h-3 bg-gray-200 dark:bg-film-black-800 rounded-full overflow-hidden shadow-inner">
                  <motion.div initial={{ width: "0%" }} animate={{ width: `${production.progress}%` }} transition={{ duration: 1, delay: 0.5, ease: "easeOut" }} className="h-full bg-gradient-to-r from-film-red-500 to-film-red-700 rounded-full" />
                </div>
                <div className="flex flex-wrap justify-between items-center mt-6 text-sm text-gray-600 dark:text-gray-400 gap-y-3 gap-x-6">
                  <div className="flex items-center"><Calendar className="h-4 w-4 mr-2" /><span>Started: {production.startDate ? formatDate(production.startDate) : 'TBA'}</span></div>
                  {production.estimatedCompletion && <div className="flex items-center"><Clock className="h-4 w-4 mr-2" /><span>Est. Completion: {formatDate(production.estimatedCompletion)}</span></div>}
                  <div className="flex items-center"><User className="h-4 w-4 mr-2" /><span>Director: {production.director}</span></div>
                </div>
              </div>
            </SectionReveal>
          </div>
        </div>

        {/* Content section */}
        <div className="container mx-auto px-4 py-12">
          {/* Navigation tabs */}
          <div className="border-b border-gray-200 dark:border-film-black-800 mb-12 sticky top-[73px] bg-white dark:bg-film-black-950 z-20"> {/* Adjusted top */}
            <nav className="flex space-x-8 overflow-x-auto scrollbar-hide">
              {(['about', 'updates', 'team', 'support'] as ActiveTab[]).map(tab => (
                <button key={tab} className={`py-4 px-2 font-medium border-b-2 transition-colors whitespace-nowrap capitalize ${activeTab === tab ? 'border-film-red-600 text-film-red-600 dark:border-film-red-500 dark:text-film-red-500' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`} onClick={() => setActiveTab(tab)} id={tab === 'support' ? 'support' : undefined}>
                  {tab}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab content */}
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Main content area */}
            <div className="lg:w-2/3">
              <AnimatePresence mode="wait">
                {/* --- About Tab --- */}
                {activeTab === 'about' && (
                  <motion.div key="about" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                    <SectionReveal>
                      <div className="mb-10"><h2 className={sectionTitleClass}>About the Production</h2><div className="prose prose-lg dark:prose-invert max-w-none mb-6"><p>{production.longDescription || production.description}</p></div></div>
                      <div className="mt-8 mb-12"><h3 className="text-xl font-bold mb-4 text-film-black-900 dark:text-white">Logline</h3><div className="italic text-lg text-gray-700 dark:text-gray-300 border-l-4 border-film-red-500 pl-4 py-2">{production.logline}</div></div>
                      <h3 className="text-xl font-bold mb-4 text-film-black-900 dark:text-white">Synopsis</h3><div className="prose prose-lg dark:prose-invert"><p>{production.synopsis}</p></div>
                      {/* Production Process Timeline */}
                      {production.stages && production.stages.length > 0 && (
                        <div className="mb-10 pt-8 border-t border-gray-200 dark:border-film-black-800 mt-10">
                          <h2 className={sectionTitleClass + " flex items-center"}><Milestone className={iconStyleClass} />Production Process</h2>
                          <div className="relative pl-6 border-l-2 border-gray-200 dark:border-film-black-700">
                            {production.stages.map((stage, index) => {
                              const { statusClass, icon, dotClass } = getStageStatusVisuals(stage.status);
                              return (
                                <div key={index} className="mb-8 last:mb-0 relative">
                                  <div className={`absolute -left-[13px] top-1 w-6 h-6 rounded-full border-4 border-white dark:border-film-black-950 ${dotClass} z-10`}></div>
                                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusClass} mb-3`}>{icon}<span className="ml-2">{stage.name}</span></div>
                                  <ul className="space-y-2 pl-2">
                                    {stage.milestones?.map((milestone, idx) => (
                                      <li key={idx} className={`flex items-start text-sm ${stage.status === 'completed' ? 'text-gray-700 dark:text-gray-300' : stage.status === 'in-progress' ? 'text-gray-800 dark:text-gray-200 font-medium' : 'text-gray-500 dark:text-gray-400'}`}>
                                        {stage.status === 'completed' ? <Check className="mr-2 h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" /> : <div className={`w-1.5 h-1.5 mt-1.5 mr-2.5 rounded-full flex-shrink-0 ${stage.status === 'in-progress' ? 'bg-blue-500' : 'bg-gray-400 dark:bg-gray-600'}`}></div>}
                                        {milestone}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                      {/* FAQ Section */}
                      {production.faq && production.faq.length > 0 && production.faq[0].question && (
                        <div className="mb-10 pt-8 border-t border-gray-200 dark:border-film-black-800 mt-10">
                          <h2 className={sectionTitleClass + " flex items-center"}><HelpCircle className={iconStyleClass} />FAQ</h2>
                          <div className="space-y-4">
                            {production.faq.filter(f => f.question?.trim()).map((item, index) => (
                              <div key={index} className="border border-gray-200 dark:border-film-black-800 rounded-lg overflow-hidden">
                                <button onClick={() => toggleFaqItem(index)} className="flex justify-between items-center w-full p-4 text-left bg-gray-50 dark:bg-film-black-900 hover:bg-gray-100 dark:hover:bg-film-black-800 transition-colors">
                                  <span className="font-medium text-film-black-900 dark:text-white">{item.question}</span>
                                  {expandedFaqItem === index ? <ChevronUp className="h-5 w-5 text-film-red-600 dark:text-film-red-500" /> : <ChevronDown className="h-5 w-5 text-gray-500 dark:text-gray-400" />}
                                </button>
                                <AnimatePresence>{expandedFaqItem === index && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden"><div className="p-4 prose dark:prose-invert max-w-none"><p>{item.answer}</p></div></motion.div>)}</AnimatePresence>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </SectionReveal>
                  </motion.div>
                )}
                {/* --- Updates Tab --- */}
                {activeTab === 'updates' && (
                  <motion.div key="updates" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                    <SectionReveal>
                      <h2 className={sectionTitleClass + " flex items-center"}><Activity className={iconStyleClass} />Production Updates</h2>
                      {production.updates && production.updates.length > 0 && production.updates[0].title ? (
                        <div className="space-y-12">
                          {production.updates.filter(u => u.title?.trim()).map((update, index) => (
                            <div key={index} className="flex flex-col md:flex-row gap-8 border-b border-gray-200 dark:border-film-black-800 pb-8 last:border-b-0 last:pb-0">
                              {update.image && <div className="relative md:w-1/3 h-64 overflow-hidden rounded-lg flex-shrink-0"><Image src={update.image} alt={update.title} fill className="object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} /></div>}
                              <div className={update.image ? "md:w-2/3" : "w-full"}>
                                <div className="text-film-red-600 dark:text-film-red-500 font-medium mb-2 text-sm">{update.date ? formatDate(update.date) : ''}</div>
                                <h3 className="text-xl font-bold mb-3 text-film-black-900 dark:text-white">{update.title}</h3>
                                <div className="prose dark:prose-invert max-w-none"><p>{update.content}</p></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-600 dark:text-gray-400">No updates posted yet. Check back soon!</p>
                      )}
                    </SectionReveal>
                  </motion.div>
                )}
                {/* --- Team Tab --- */}
                {activeTab === 'team' && (
                  <motion.div key="team" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                    <SectionReveal>
                      <h2 className={sectionTitleClass + " flex items-center"}><UsersIcon className={iconStyleClass} />Creative Team</h2>
                      {production.team && production.team.length > 0 && production.team[0].name ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {production.team.filter(m => m.name?.trim()).map((member, index) => (
                            <div key={index} className="flex flex-col sm:flex-row gap-6 bg-gray-50 dark:bg-film-black-900 p-6 rounded-xl border border-gray-100 dark:border-film-black-800">
                              {member.image && <div className="sm:w-1/3 flex-shrink-0"><div className="relative h-52 sm:h-full rounded-lg overflow-hidden"><Image src={member.image} alt={member.name} fill className="object-cover" onError={(e) => { e.currentTarget.style.display = 'none'; }} /></div></div>}
                              <div className={member.image ? "sm:w-2/3" : "w-full"}>
                                <h3 className="text-xl font-bold mb-1 text-film-black-900 dark:text-white">{member.name}</h3>
                                <p className="text-film-red-600 dark:text-film-red-500 font-medium mb-4">{member.role}</p>
                                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{member.bio}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-600 dark:text-gray-400">Team details coming soon.</p>
                      )}
                    </SectionReveal>
                  </motion.div>
                )}
                {/* --- Support Tab --- */}
                {activeTab === 'support' && (
                  <motion.div key="support" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
                    <SectionReveal>
                      <h2 className={sectionTitleClass + " flex items-center"}><DollarSign className={iconStyleClass} />Support This Production</h2>
                      <div className="prose prose-lg dark:prose-invert max-w-none mb-10"><p>Become a part of bringing <strong>{production.title}</strong> to life. Your support directly contributes to authentic African storytelling and empowers local talent.</p></div>
                      {production.supportOptions && production.supportOptions.length > 0 && production.supportOptions[0].title ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                          {production.supportOptions.filter(o => o.title?.trim()).map((option, index) => (
                            <motion.div key={index} whileHover={{ y: -5 }} className="bg-white dark:bg-film-black-900 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-film-black-800 flex flex-col h-full hover:border-film-red-500/50 transition-colors">
                              <h3 className="text-xl font-bold mb-2 text-film-black-900 dark:text-white">{option.title}</h3>
                              <div className="text-2xl font-bold text-film-red-600 dark:text-film-red-500 mb-4">{option.investment}</div>
                              <p className="text-gray-700 dark:text-gray-300 text-sm mb-6 flex-grow">{option.description}</p>
                              <ul className="space-y-2 mb-8 text-sm">
                                {option.perks?.map((perk, i) => (<li key={i} className="flex items-start"><Check className="h-4 w-4 text-green-500 mr-2 flex-shrink-0 mt-0.5" /><span className="text-gray-700 dark:text-gray-300">{perk}</span></li>))}
                              </ul>
                              <Button variant={index === 0 ? "primary" : "secondary"} className="w-full mt-auto">Support at this level</Button>
                            </motion.div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-center py-8 text-gray-600 dark:text-gray-400">Support options are currently being finalized. Please check back soon or contact us directly.</p>
                      )}
                      <div className="bg-gray-50 dark:bg-film-black-800/50 rounded-xl p-6 md:p-8 text-center border border-gray-100 dark:border-film-black-700">
                        <h3 className="text-xl font-bold mb-4 text-film-black-900 dark:text-white">Other Ways to Support</h3>
                        <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-xl mx-auto">Interested in corporate sponsorship, in-kind donations, or other forms of partnership? We'd love to discuss tailored opportunities.</p>
                        <Button variant="primary"><Link href="/contact?subject=Support Inquiry">Contact Us</Link></Button>
                      </div>
                    </SectionReveal>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* --- Sidebar --- */}
            <aside className="lg:w-1/3">
              <div className="lg:sticky lg:top-28 space-y-8">
                <SectionReveal delay={0.2} direction="right">
                  {/* Key Team Card */}
                  <div className="bg-white dark:bg-film-black-900 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-film-black-800">
                    <h3 className="text-xl font-bold mb-5 text-film-black-900 dark:text-white border-b border-gray-200 dark:border-film-black-700 pb-3">Key Team</h3>
                    <div className="space-y-4">
                      {[
                        { name: production.director, role: 'Director', image: '/images/hero/hero1.jpg' },
                        { name: production.producer, role: 'Producer', image: '/images/hero/hero3.jpg' },
                        { name: production.cinematographer, role: 'Cinematographer', image: '/images/hero/hero2.jpg' },
                      ].filter(p => p.name).map((person, index) => (
                        <div key={index} className="flex items-center">
                          <div className="w-10 h-10 rounded-full overflow-hidden mr-3 flex-shrink-0 relative"><Image src={person.image || '/images/avatar/placeholder.jpg'} alt={person.name} fill className="object-cover" /></div>
                          <div><div className="font-medium text-sm text-film-black-900 dark:text-white">{person.name}</div><div className="text-xs text-gray-600 dark:text-gray-400">{person.role}</div></div>
                        </div>
                      ))}
                    </div>
                    <Button variant="secondary" className="w-full mt-6 text-sm" onClick={() => setActiveTab('team')}>View Full Team</Button>
                  </div>

                  {/* Related Productions Card (if needed, or keep films) */}
                  {/* ... similar structure to film detail page ... */}

                  {/* Support CTA in sidebar */}
                  <div className="bg-gradient-to-br from-film-red-600 to-film-red-800 dark:from-film-red-800 dark:to-film-black-900 text-white rounded-xl p-6 mt-8">
                    <h3 className="text-xl font-bold mb-4">Support This Film</h3>
                    <p className="mb-6 text-white/90 text-sm">Your contribution helps bring authentic stories to the screen.</p>
                    <Button variant="outline" onClick={() => setActiveTab('support')} className="w-full bg-transparent border-white text-white hover:bg-white/10">View Support Options</Button>
                  </div>
                </SectionReveal>
              </div>
            </aside>
          </div>
        </div>

        {/* --- Trailer Modal --- */}
        <AnimatePresence>
          {showTrailer && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 backdrop-blur-sm" onClick={toggleTrailer}>
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-film-black-900 rounded-xl overflow-hidden w-full max-w-4xl shadow-2xl" onClick={(e) => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-film-black-800"><h3 className="text-lg font-bold text-white">{production.title} - Preview</h3><button onClick={toggleTrailer} className="text-gray-400 hover:text-white"><X className="h-6 w-6" /></button></div>
                <div className="relative aspect-video bg-black">
                  {/* Placeholder for Video Embed */}
                  <div className="flex items-center justify-center h-full p-4 text-center">
                    <div className="max-w-lg"><Play className="h-16 w-16 text-film-red-500 mx-auto mb-4 opacity-50" /><p className="text-gray-300">Video player placeholder.</p></div>
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

// Add shared styles if not global
const styles = `
  .scrollbar-hide::-webkit-scrollbar { display: none; }
  .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
  .detail-label-sm { @apply text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider; }
`;
if (typeof window !== 'undefined') { const styleSheet = document.createElement("style"); styleSheet.innerText = styles; document.head.appendChild(styleSheet); }


export default ProductionDetailPage;

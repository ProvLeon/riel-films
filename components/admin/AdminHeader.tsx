"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useTheme } from "@/context/ThemeProvider";
import { useAuth } from "@/context/AuthContext";
import {
  Search, Bell, Film, User, Settings, LogOut, Plus, Menu, X,
  LayoutDashboard, ChevronDown, Video, BookOpen, Mail, BarChart2, Activity as ActivityIcon, CheckCheck // Added CheckCheck
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ThemeSwitcher } from "../UI/ThemeSwitcher";
import MobileNavOverlay from "./MobileNavOverlay";
import { useNotifications } from "@/hooks/useNotifications"; // Import useNotifications hook
import LoadingSpinner from "../UI/LoadingSpinner";

const AdminHeader = () => {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, isLoading: isLoadingNotifications, markAsRead } = useNotifications(); // Use the hook

  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scrolling for shadow effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns and mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.dropdown-container') && !target.closest('.mobile-menu-button') && !target.closest('.mobile-nav-panel')) {
        setIsUserDropdownOpen(false);
        setIsNotificationsOpen(false);
        setIsCreateMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const handleSearchSubmit = (e: React.FormEvent) => { /* ... (keep existing logic) ... */ };

  const handleNotificationClick = (id: string) => {
    markAsRead(id);
    // Optional: Navigate to related item if link exists
    setIsNotificationsOpen(false); // Close dropdown after click
  }

  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent closing dropdown immediately
    markAsRead('all');
  };

  return (
    <>
      <header className={`h-16 border-b border-gray-200 dark:border-film-black-800 bg-white/95 dark:bg-film-black-900/95 backdrop-blur-sm flex items-center px-4 md:px-6 sticky top-0 z-30 transition-shadow duration-300 ${isScrolled ? 'shadow-md' : ''} `}>
        <div className="flex items-center w-full justify-between">
          {/* Left Side: Logo/Title */}
          <div className="flex items-center flex-shrink-0">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <div className="relative h-8 w-8"> {/* Logo image */}
                <Image src="/logo_foot.png" alt="Riel Films" fill className="object-contain" />
              </div>
              <span className="text-lg font-semibold text-gray-800 dark:text-white hidden sm:inline">Admin</span>
            </Link>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Quick Create Button */}
            <div className="dropdown-container relative">
              <button onClick={() => setIsCreateMenuOpen(prev => !prev)} className="btn-icon bg-film-red-600 text-white hover:bg-film-red-700 shadow-sm"> <Plus size={18} /> </button>
              <AnimatePresence> {isCreateMenuOpen && (<motion.div variants={dropdownVariants} initial="hidden" animate="visible" exit="hidden" className="dropdown-panel w-48 right-0"> <Link href="/admin/films/create" className="button-menu-item" onClick={() => setIsCreateMenuOpen(false)}><Film size={16} />New Film</Link> <Link href="/admin/productions/create" className="button-menu-item" onClick={() => setIsCreateMenuOpen(false)}><Video size={16} />New Production</Link> <Link href="/admin/stories/create" className="button-menu-item" onClick={() => setIsCreateMenuOpen(false)}><BookOpen size={16} />New Story</Link> </motion.div>)} </AnimatePresence>
            </div>

            {/* View Site Link */}
            <Link href="/" target="_blank" className="btn-icon hidden sm:flex" title="View Live Site"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h4a.75.75 0 010 1.5h-4a.75.75 0 00-.75.75z" clipRule="evenodd" /><path fillRule="evenodd" d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.19a.75.75 0 00-.053 1.06z" clipRule="evenodd" /></svg> </Link>

            {/* Theme Switcher */}
            <ThemeSwitcher />

            {/* Notifications */}
            <div className="dropdown-container relative">
              <button onClick={() => setIsNotificationsOpen(prev => !prev)} className="btn-icon relative">
                <Bell size={18} />
                {unreadCount > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-film-red-600 rounded-full text-white text-[10px] flex items-center justify-center border-2 border-white dark:border-film-black-900">{unreadCount}</span>}
              </button>
              <AnimatePresence> {isNotificationsOpen && (
                <motion.div variants={dropdownVariants} initial="hidden" animate="visible" exit="hidden" className="dropdown-panel w-80 right-0">
                  <div className="p-3 border-b border-gray-100 dark:border-film-black-700 flex justify-between items-center">
                    <h3 className="font-semibold text-sm text-gray-900 dark:text-white">Notifications</h3>
                    {unreadCount > 0 && <button onClick={handleMarkAllRead} className="text-xs text-film-red-600 hover:underline flex items-center gap-1"><CheckCheck size={14} />Mark all read</button>}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {isLoadingNotifications ? (<div className="p-8 flex justify-center"><LoadingSpinner /></div>)
                      : notifications.length === 0 ? (<div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">No new notifications</div>)
                        : (notifications.map((n) => (
                          <div key={n.id} className={`p-3 border-b border-gray-100 dark:border-film-black-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-film-black-700/50 cursor-pointer ${!n.read ? 'font-medium' : 'opacity-70'}`} onClick={() => handleNotificationClick(n.id)} role="button">
                            {/* Add Icon based on type? */}
                            <p className="text-sm text-gray-800 dark:text-gray-200 line-clamp-2">{n.message}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{n.timeAgo}</p>
                          </div>
                        ))
                        )}
                  </div>
                  <div className="p-2 border-t border-gray-100 dark:border-film-black-700">
                    <Link href="/admin/activity" onClick={() => setIsNotificationsOpen(false)} className="block w-full text-center py-1.5 text-sm text-film-red-600 dark:text-film-red-500 hover:underline">View all activity</Link>
                  </div>
                </motion.div>
              )}</AnimatePresence>
            </div>

            {/* User profile */}
            <div className="dropdown-container relative">
              <button onClick={() => setIsUserDropdownOpen(prev => !prev)} className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-film-black-800">
                <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-film-black-700 flex items-center justify-center overflow-hidden border border-gray-300 dark:border-film-black-600">
                  {user?.image ? <Image src={user.image} alt={user.name || "User"} width={32} height={32} className="object-cover w-full h-full" /> : <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.name?.charAt(0) || "U"}</span>}
                </div>
                <ChevronDown size={16} className="text-gray-500 dark:text-gray-400 hidden sm:block" />
              </button>
              <AnimatePresence> {isUserDropdownOpen && (
                <motion.div variants={dropdownVariants} initial="hidden" animate="visible" exit="hidden" className="dropdown-panel w-56 right-0">
                  <div className="p-3 border-b border-gray-100 dark:border-film-black-700">
                    <div className="font-medium text-sm text-gray-900 dark:text-white truncate">{user?.name || 'User'}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</div>
                  </div>
                  <div className="p-1">
                    {/* <Link href="/admin/profile" onClick={() => setIsUserDropdownOpen(false)} className="button-menu-item"><User size={16} />Your Profile</Link> */}
                    <Link href="/admin/settings" onClick={() => setIsUserDropdownOpen(false)} className="button-menu-item"><Settings size={16} />Settings</Link>
                    <button onClick={() => { logout(); setIsUserDropdownOpen(false); }} className="button-menu-item text-red-600 dark:text-red-400 w-full"><LogOut size={16} />Logout</button>
                  </div>
                </motion.div>
              )} </AnimatePresence>
            </div>

            {/* Mobile Menu Button */}
            <button className="p-2 rounded-lg text-gray-600 dark:text-gray-300 md:hidden mobile-menu-button" onClick={() => setIsMobileMenuOpen(true)} aria-label="Open Menu">
              <Menu size={20} />
            </button>

          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <MobileNavOverlay isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
    </>
  );
};

// Define dropdown variants for animation
const dropdownVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -5 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.15, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.95, y: -5, transition: { duration: 0.1 } }
};


// Add button style helper
const styles = `
  .btn-icon { @apply p-2 rounded-lg transition-colors text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-film-black-800 focus:outline-none focus:ring-2 focus:ring-film-red-500 focus:ring-offset-1 dark:focus:ring-offset-film-black-900; }
    .button-menu-item { @apply flex items-center gap-2 w-full px-3 py-2 text-left text-sm text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-film-black-700 rounded-md transition-colors; }
    .dropdown-panel { @apply absolute mt-2 bg-white dark:bg-film-black-800 rounded-lg shadow-lg border border-gray-100 dark:border-film-black-700 z-20; }
`;
if (typeof window !== 'undefined') { const styleSheet = document.createElement("style"); styleSheet.innerText = styles; document.head.appendChild(styleSheet); }


export default AdminHeader;

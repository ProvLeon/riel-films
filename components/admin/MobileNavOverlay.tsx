"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Home, Film, Video, BookOpen, Settings, Users,
  LogOut, Mail, BarChart2, Activity as ActivityIcon
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '../UI/Button';
import { ThemeSwitcher } from '../UI/ThemeSwitcher';
import Image from 'next/image';

interface MobileNavOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

// Use the same sidebarItems definition or import it if extracted
const sidebarItems = [
  { href: '/admin/dashboard', icon: <Home size={18} />, text: 'Dashboard', access: ['admin', 'editor'] },
  { href: '/admin/films', icon: <Film size={18} />, text: 'Films', access: ['admin', 'editor'] },
  { href: '/admin/productions', icon: <Video size={18} />, text: 'Productions', access: ['admin', 'editor'] },
  { href: '/admin/stories', icon: <BookOpen size={18} />, text: 'Stories', access: ['admin', 'editor'] },
  { href: '/admin/subscribers', icon: <Mail size={18} />, text: 'Subscribers', access: ['admin', 'editor'] },
  { href: '/admin/analytics', icon: <BarChart2 size={18} />, text: 'Analytics', access: ['admin', 'editor'] },
  { href: '/admin/activity', icon: <ActivityIcon size={18} />, text: 'Activity Log', access: ['admin', 'editor'] },
  { href: '/admin/users', icon: <Users size={18} />, text: 'Users', access: ['admin'] },
  { href: '/admin/settings', icon: <Settings size={18} />, text: 'Settings', access: ['admin'] },
];

const MobileNavOverlay: React.FC<MobileNavOverlayProps> = ({ isOpen, onClose }) => {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const mobileNavVariants = {
    hidden: { x: "-100%", transition: { duration: 0.2, ease: "easeOut" } },
    visible: { x: 0, transition: { duration: 0.25, ease: "easeIn" } },
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      {/* Sidebar Panel */}
      <motion.div
        variants={mobileNavVariants}
        initial="hidden"
        animate={isOpen ? "visible" : "hidden"}
        exit="hidden"
        className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-film-black-900 md:hidden shadow-lg flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-film-black-800 px-4 flex-shrink-0">
          <Link href="/admin/dashboard" onClick={onClose}>
            <div className="relative h-10 w-32">
              <Image src="/logo_light_bg.png" alt="Riel Films" fill className="object-contain dark:hidden" />
              <Image src="/logo_dark_bg.png" alt="Riel Films" fill className="object-contain hidden dark:block" />
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1.5">
          {sidebarItems.map((item) => {
            const hasAccess = item.access.includes(user?.role || '');
            if (!hasAccess) return null;
            const isActive = pathname === item.href || (item.basePath && pathname.startsWith(item.basePath));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose} // Close menu on link click
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${isActive
                  ? 'bg-film-red-600 text-white'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-film-black-800'
                  }`}
              >
                {item.icon}
                <span>{item.text}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-film-black-800 mt-auto flex-shrink-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-film-black-700 flex items-center justify-center overflow-hidden">
                {user?.image ? (<Image src={user.image} alt={user.name || ''} width={32} height={32} className="object-cover" />
                ) : (<span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.name?.charAt(0) || 'U'}</span>)}
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name || 'User'}</p>
            </div>
            <ThemeSwitcher />
          </div>
          <Button variant="ghost" size="sm" onClick={() => { logout(); onClose(); }} className="w-full justify-start">
            <LogOut className="h-4 w-4 mr-2" /> Logout
          </Button>
        </div>
      </motion.div>
    </>
  );
};

export default MobileNavOverlay;

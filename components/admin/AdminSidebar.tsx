"use client"; // Keep client-side
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Home, Film, Video, BookOpen, Settings, Users,
  LogOut, Mail, ChevronDown, ChevronRight, BarChart2, Activity as ActivityIcon // Added more icons
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Button } from '../UI/Button';
import { SidebarItem } from '@/types';

const sidebarItems: SidebarItem[] = [
  { href: '/admin/dashboard', icon: <Home size={18} />, text: 'Dashboard', access: ['admin', 'editor'] },
  { href: '/admin/films', basePath: '/admin/films', icon: <Film size={18} />, text: 'Films', access: ['admin', 'editor'] },
  { href: '/admin/productions', basePath: '/admin/productions', icon: <Video size={18} />, text: 'Productions', access: ['admin', 'editor'] },
  { href: '/admin/stories', basePath: '/admin/stories', icon: <BookOpen size={18} />, text: 'Stories', access: ['admin', 'editor'] },
  {
    href: '/admin/subscribers',
    basePath: '/admin/subscribers',
    icon: <Mail size={18} />,
    text: 'Subscribers',
    access: ['admin', 'editor'],
    subItems: [
      { href: '/admin/subscribers', text: 'Overview' },
      { href: '/admin/subscribers/list', text: 'Subscriber List' },
      { href: '/admin/subscribers/campaigns', text: 'Campaigns' },
      { href: '/admin/subscribers/analytics', text: 'Analytics' },
    ]
  },
  { href: '/admin/analytics', icon: <BarChart2 size={18} />, text: 'Site Analytics', access: ['admin', 'editor'] },
  { href: '/admin/activity', icon: <ActivityIcon size={18} />, text: 'Activity Log', access: ['admin', 'editor'] },
  { href: '/admin/users', basePath: '/admin/users', icon: <Users size={18} />, text: 'Users', access: ['admin'] },
  { href: '/admin/settings', icon: <Settings size={18} />, text: 'Settings', access: ['admin'] },
];

// SubLink Component
const SubLink = ({ href, text, active }: { href: string; text: string; active: boolean }) => (
  <Link href={href} className={`block pl-11 pr-4 py-2 text-sm rounded-md transition-colors ${active
    ? 'text-film-red-600 dark:text-film-red-400 font-medium bg-film-red-50 dark:bg-film-red-900/20'
    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-film-black-800'
    }`}
  >
    {text}
  </Link>
);

// Main Sidebar Component
const AdminSidebar = () => {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  // Determine initial expanded menu based on current path
  useEffect(() => {
    const currentItem = sidebarItems.find(item =>
      item.basePath && pathname.startsWith(item.basePath) && item.subItems
    );
    if (currentItem) {
      setExpandedMenu(currentItem.text);
    }
  }, [pathname]);

  const toggleMenu = (menu: string) => {
    setExpandedMenu(prev => (prev === menu ? null : menu));
  };

  return (
    <div className="hidden md:flex md:flex-col md:w-64 bg-white dark:bg-film-black-900 border-r border-gray-200 dark:border-film-black-800 shrink-0 h-screen sticky top-0">
      {/* Logo Header */}
      <div className="flex items-center justify-center h-16 border-b border-gray-200 dark:border-film-black-800 px-4 flex-shrink-0">
        <Link href="/admin/dashboard">
          <div className="relative h-10 w-32"> {/* Adjusted size */}
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

          const basePath = item.basePath || item.href;
          const isActiveParent = pathname === basePath || pathname.startsWith(`${basePath}/`);
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isMenuOpen = expandedMenu === item.text;

          return (
            <div key={item.href}>
              <div
                onClick={hasSubItems ? () => toggleMenu(item.text) : undefined}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 ${hasSubItems ? 'cursor-pointer' : ''} ${isActiveParent
                  ? 'bg-film-red-50 dark:bg-film-red-900/30 text-film-red-600 dark:text-film-red-400 font-medium'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-film-black-800 hover:text-gray-900 dark:hover:text-white'
                  }`}
              >
                {item.icon}
                {hasSubItems ? (
                  <span className="flex-1">{item.text}</span>
                ) : (
                  <Link href={item.href} className="flex-1 block">{item.text}</Link>
                )}
                {hasSubItems && (
                  isMenuOpen ? <ChevronDown size={16} className="text-gray-400" /> : <ChevronRight size={16} className="text-gray-400" />
                )}
              </div>

              <AnimatePresence initial={false}>
                {hasSubItems && isMenuOpen && (
                  <motion.div
                    initial="collapsed" animate="open" exit="collapsed"
                    variants={{
                      open: { opacity: 1, height: 'auto' },
                      collapsed: { opacity: 0, height: 0 },
                    }}
                    transition={{ duration: 0.2, ease: [0.04, 0.62, 0.23, 0.98] }}
                    className="overflow-hidden mt-1 space-y-1"
                  >
                    {item.subItems.map((subItem) => (
                      <SubLink
                        key={subItem.href}
                        href={subItem.href}
                        text={subItem.text}
                        active={pathname === subItem.href}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </nav>

      {/* Footer - User Info & Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-film-black-800 mt-auto flex-shrink-0">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-film-black-700 flex items-center justify-center overflow-hidden">
            {user?.image ? (
              <Image src={user.image} alt={user.name || ''} width={40} height={40} className="object-cover" />
            ) : (
              <span className="text-lg font-medium text-gray-700 dark:text-gray-300">{user?.name?.charAt(0) || 'U'}</span>
            )}
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user?.role || 'Role'}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={() => logout()} className="w-full justify-start">
          <LogOut className="h-4 w-4 mr-2" /> Logout
        </Button>
      </div>
    </div>
  );
};

export default AdminSidebar;

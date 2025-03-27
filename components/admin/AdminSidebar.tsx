import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Home,
  Film,
  Video,
  BookOpen,
  Settings,
  Users,
  Menu,
  X,
  LogOut,
  Mail,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  text: string;
  active: boolean;
  onClick?: () => void;
  hasChildren?: boolean;
  isOpen?: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({
  href,
  icon,
  text,
  active,
  onClick,
  hasChildren,
  isOpen
}) => {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active
        ? 'bg-film-red-600 text-white'
        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-film-black-800'
        }`}
    >
      {icon}
      <span className="flex-1">{text}</span>
      {hasChildren && (
        isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
      )}
    </Link>
  );
};

const AdminSidebar = () => {
  const pathname = usePathname();
  const { logout, user, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  const toggleMenu = (menu: string) => {
    setExpandedMenu(expandedMenu === menu ? null : menu);
  };

  const sidebarItems = [
    {
      href: '/admin/dashboard',
      icon: <Home className="h-5 w-5" />,
      text: 'Dashboard',
      access: ['admin', 'editor']
    },
    {
      href: '/admin/films',
      icon: <Film className="h-5 w-5" />,
      text: 'Films',
      access: ['admin', 'editor'],
      subItems: [
        { href: '/admin/films', text: 'All Films' },
        { href: '/admin/films/create', text: 'Add New Film' },
        { href: '/admin/films/categories', text: 'Categories' },
      ]
    },
    {
      href: '/admin/productions',
      icon: <Video className="h-5 w-5" />,
      text: 'Productions',
      access: ['admin', 'editor'],
      subItems: [
        { href: '/admin/productions', text: 'All Productions' },
        { href: '/admin/productions/create', text: 'Add New Production' },
      ]
    },
    {
      href: '/admin/stories',
      icon: <BookOpen className="h-5 w-5" />,
      text: 'Stories',
      access: ['admin', 'editor'],
      subItems: [
        { href: '/admin/stories', text: 'All Stories' },
        { href: '/admin/stories/create', text: 'Add New Story' },
      ]
    },
    {
      href: '/admin/subscribers',
      icon: <Mail className="h-5 w-5" />,
      text: 'Subscribers',
      access: ['admin', 'editor'],
      subItems: [
        { href: '/admin/subscribers', text: 'Overview' },
        { href: '/admin/subscribers/list', text: 'Subscriber List' },
        { href: '/admin/subscribers/campaigns', text: 'Email Campaigns' },
      ]
    },
    {
      href: '/admin/users',
      icon: <Users className="h-5 w-5" />,
      text: 'Users',
      access: ['admin'],
    },
    {
      href: '/admin/settings',
      icon: <Settings className="h-5 w-5" />,
      text: 'Settings',
      access: ['admin'],
    },
  ];

  return (
    <>
      {/* Mobile menu toggle */}
      <button
        className="fixed top-4 right-4 z-50 md:hidden bg-white dark:bg-film-black-900 rounded-full p-2 shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      {/* Sidebar for desktop */}
      <div className="hidden md:block w-64 bg-white dark:bg-film-black-900 border-r border-gray-200 dark:border-film-black-800 shrink-0">
        <div className="h-full flex flex-col">
          <div className="p-4 border-b border-gray-200 dark:border-film-black-800">
            <div className="flex justify-center">
              <div className="relative h-12 w-36">
                <Image
                  src="/logo_foot.png"
                  alt="Riel Films"
                  fill
                  className="object-contain dark:hidden"
                />
                <Image
                  src="/logo_dark_bg.png"
                  alt="Riel Films"
                  fill
                  className="object-contain hidden dark:block"
                />
              </div>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {sidebarItems.map((item) => {
              const hasAccess = item.access.includes(user?.role || '');
              if (!hasAccess) return null;

              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              const hasSubItems = item.subItems && item.subItems.length > 0;
              const isMenuOpen = expandedMenu === item.text;

              return (
                <div key={item.href}>
                  {hasSubItems ? (
                    <>
                      <div
                        onClick={() => toggleMenu(item.text)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${isActive
                          ? 'bg-film-red-600 text-white'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-film-black-800'
                          }`}
                      >
                        {item.icon}
                        <span className="flex-1">{item.text}</span>
                        {isMenuOpen ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </div>
                      <AnimatePresence>
                        {isMenuOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden ml-4 pl-2 border-l border-gray-200 dark:border-film-black-800"
                          >
                            {item.subItems.map((subItem) => (
                              <Link
                                key={subItem.href}
                                href={subItem.href}
                                className={`flex items-center gap-2 px-4 py-2 mt-1 rounded-md transition-colors ${pathname === subItem.href
                                  ? 'bg-film-red-100 dark:bg-film-red-900/20 text-film-red-600 dark:text-film-red-400'
                                  : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-film-black-800'
                                  }`}
                              >
                                <span className="w-1 h-1 rounded-full bg-current" />
                                {subItem.text}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </>
                  ) : (
                    <SidebarLink
                      href={item.href}
                      icon={item.icon}
                      text={item.text}
                      active={isActive}
                    />
                  )}
                </div>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200 dark:border-film-black-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-film-black-800 flex items-center justify-center">
                <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                  {user?.name?.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900 dark:text-white truncate">
                  {user?.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                  {user?.role || "User"}
                </p>
              </div>
            </div>

            <button
              onClick={() => logout()}
              className="flex items-center gap-2 w-full px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-film-black-800 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.2 }}
              className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-film-black-900 md:hidden overflow-y-auto"
            >
              <div className="h-full flex flex-col">
                <div className="p-4 border-b border-gray-200 dark:border-film-black-800">
                  <div className="flex justify-center">
                    <div className="relative h-12 w-36">
                      <Image
                        src="/images/logo.png"
                        alt="Riel Films"
                        fill
                        className="object-contain dark:hidden"
                      />
                      <Image
                        src="/images/logo-dark.png"
                        alt="Riel Films"
                        fill
                        className="object-contain hidden dark:block"
                      />
                    </div>
                  </div>
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                  {sidebarItems.map((item) => {
                    const hasAccess = item.access.includes(user?.role || '');
                    if (!hasAccess) return null;

                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                    const hasSubItems = item.subItems && item.subItems.length > 0;
                    const isMenuOpen = expandedMenu === item.text;

                    return (
                      <div key={item.href}>
                        {hasSubItems ? (
                          <>
                            <div
                              onClick={() => toggleMenu(item.text)}
                              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors cursor-pointer ${isActive
                                ? 'bg-film-red-600 text-white'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-film-black-800'
                                }`}
                            >
                              {item.icon}
                              <span className="flex-1">{item.text}</span>
                              {isMenuOpen ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </div>
                            <AnimatePresence>
                              {isMenuOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden ml-4 pl-2 border-l border-gray-200 dark:border-film-black-800"
                                >
                                  {item.subItems.map((subItem) => (
                                    <Link
                                      key={subItem.href}
                                      href={subItem.href}
                                      onClick={() => setIsOpen(false)}
                                      className={`flex items-center gap-2 px-4 py-2 mt-1 rounded-md transition-colors ${pathname === subItem.href
                                        ? 'bg-film-red-100 dark:bg-film-red-900/20 text-film-red-600 dark:text-film-red-400'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-film-black-800'
                                        }`}
                                    >
                                      <span className="w-1 h-1 rounded-full bg-current" />
                                      {subItem.text}
                                    </Link>
                                  ))}
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </>
                        ) : (
                          <SidebarLink
                            href={item.href}
                            icon={item.icon}
                            text={item.text}
                            active={isActive}
                            onClick={() => setIsOpen(false)}
                          />
                        )}
                      </div>
                    );
                  })}
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-film-black-800">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-film-black-800 flex items-center justify-center">
                      <span className="text-lg font-medium text-gray-700 dark:text-gray-300">
                        {user?.name?.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {user?.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                        {user?.role || "User"}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => logout()}
                    className="flex items-center gap-2 w-full px-4 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-film-black-800 transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AdminSidebar;

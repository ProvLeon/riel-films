import { useState, useEffect, useCallback } from "react";
import { useTheme } from "@/context/ThemeProvider";
import { useAuth } from "@/context/AuthContext";
import {
  Search, Bell, Sun, Moon, Monitor, Film,
  User, Settings, LogOut, Plus, Menu,
  LayoutDashboard, ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ThemeSwitcher } from "../UI/ThemeSwitcher";

const AdminHeader = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, message: "New film added: River's Edge", time: "10 minutes ago", read: false },
    { id: 2, message: "Production updated: Mountain Echoes", time: "2 hours ago", read: false },
    { id: 3, message: "New user registered", time: "Yesterday", read: true },
  ]);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Handle scrolling to add shadow effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getThemeIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-5 w-5" />;
      case "dark":
        return <Moon className="h-5 w-5" />;
      default:
        return <Monitor className="h-5 w-5" />;
    }
  };

  const isActive = useCallback((path: string) => {
    if (path === "/admin" && pathname === "/admin/dashboard") return true;
    return pathname === path || pathname.startsWith(`${path}/`);
  }, [pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Searching for:", searchQuery);
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isThemeDropdownOpen || isUserDropdownOpen || isNotificationsOpen || isCreateMenuOpen) {
        // Check if the click was outside the dropdowns
        const target = e.target as HTMLElement;
        if (!target.closest('.dropdown-container')) {
          setIsThemeDropdownOpen(false);
          setIsUserDropdownOpen(false);
          setIsNotificationsOpen(false);
          setIsCreateMenuOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isThemeDropdownOpen, isUserDropdownOpen, isNotificationsOpen, isCreateMenuOpen]);

  return (
    <header className={`h-16 border-b border-gray-200 dark:border-film-black-800 bg-white dark:bg-film-black-900 flex items-center px-4 md:px-6 sticky top-0 z-50 transition-shadow duration-300 ${isScrolled ? 'shadow-md' : ''}`}>
      <div className="flex items-center w-full justify-between">
        {/* Logo and site title */}
        <div className="flex items-center">
          <Link href="/admin/dashboard" className="flex items-center">
            <div className="relative h-8 w-8 mr-3">
              <Image
                src="/logo_foot.png"
                alt="Riel Films"
                fill
                className="object-contain"
              />
            </div>
            <h1 className="text-xl font-bold text-film-black-900 dark:text-white hidden md:block">
              Admin
            </h1>
          </Link>

          <div className="hidden md:flex items-center ml-8 space-x-1">
            <Link
              href="/admin/dashboard"
              className={`px-3 py-2 text-sm font-medium rounded-md flex items-center ${isActive("/admin/dashboard")
                ? "text-film-red-600 dark:text-film-red-500 bg-film-red-50 dark:bg-film-red-900/20"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-film-black-800"
                }`}
            >
              <LayoutDashboard className="h-4 w-4 mr-1.5" />
              Dashboard
            </Link>
            <Link
              href="/admin/films"
              className={`px-3 py-2 text-sm font-medium rounded-md flex items-center ${isActive("/admin/films")
                ? "text-film-red-600 dark:text-film-red-500 bg-film-red-50 dark:bg-film-red-900/20"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-film-black-800"
                }`}
            >
              <Film className="h-4 w-4 mr-1.5" />
              Films
            </Link>
            <Link
              href="/admin/productions"
              className={`px-3 py-2 text-sm font-medium rounded-md flex items-center ${isActive("/admin/productions")
                ? "text-film-red-600 dark:text-film-red-500 bg-film-red-50 dark:bg-film-red-900/20"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-film-black-800"
                }`}
            >
              <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Productions
            </Link>
            <Link
              href="/admin/stories"
              className={`px-3 py-2 text-sm font-medium rounded-md flex items-center ${isActive("/admin/stories")
                ? "text-film-red-600 dark:text-film-red-500 bg-film-red-50 dark:bg-film-red-900/20"
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-film-black-800"
                }`}
            >
              <svg className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 8l-7 5-7-5M5 19h14a2 2 0 002-2V9a2 2 0 00-2-2h-1" />
              </svg>
              Stories
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Mobile menu button */}
          <button className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300">
            <Menu className="h-5 w-5" />
          </button>

          {/* Search */}
          <div className="hidden md:flex items-center relative">
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="py-1.5 px-3 pl-9 rounded-lg bg-gray-100 dark:bg-film-black-800 border border-transparent focus:border-gray-300 dark:focus:border-film-black-700 focus:outline-none text-gray-800 dark:text-white w-64"
              />
              <Search className="h-4 w-4 text-gray-500 dark:text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </form>
          </div>

          {/* Quick Create Button */}
          <div className="dropdown-container relative">
            <button
              onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
              className="p-2 rounded-lg bg-film-red-600 hover:bg-film-red-700 text-white relative flex items-center shadow-sm"
            >
              <Plus className="h-5 w-5" />
              <span className="ml-1 hidden sm:inline">Create</span>
            </button>

            <AnimatePresence>
              {isCreateMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-film-black-800 rounded-lg shadow-lg border border-gray-100 dark:border-film-black-700 z-10"
                >
                  <div className="p-2">
                    <Link
                      href="/admin/films/create"
                      className="flex items-center gap-2 w-full px-3 py-2 text-left text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-film-black-700 rounded-md"
                    >
                      <Film className="h-4 w-4 text-film-red-600" />
                      New Film
                    </Link>
                    <Link
                      href="/admin/productions/create"
                      className="flex items-center gap-2 w-full px-3 py-2 text-left text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-film-black-700 rounded-md"
                    >
                      <svg className="h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      New Production
                    </Link>
                    <Link
                      href="/admin/stories/create"
                      className="flex items-center gap-2 w-full px-3 py-2 text-left text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-film-black-700 rounded-md"
                    >
                      <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 8l-7 5-7-5M5 19h14a2 2 0 002-2V9a2 2 0 00-2-2h-1" />
                      </svg>
                      New Story
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* View Site */}
          <Link
            href="/"
            target="_blank"
            className="hidden sm:flex items-center text-gray-600 dark:text-gray-400 hover:text-film-red-600 dark:hover:text-film-red-500 text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            View Site
          </Link>

          {/* Theme switcher */}
          <div className="dropdown-container relative">
            {/* <button
              onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-film-black-800 text-gray-600 dark:text-gray-300"
            >
              {getThemeIcon()}
            </button> */}
            <ThemeSwitcher />

            <AnimatePresence>
              {isThemeDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-40 bg-white dark:bg-film-black-800 rounded-lg shadow-lg border border-gray-100 dark:border-film-black-700 z-10"
                >
                  <button
                    onClick={() => {
                      setTheme("light");
                      setIsThemeDropdownOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-left text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-film-black-700 rounded-t-lg"
                  >
                    <Sun className="h-4 w-4" />
                    Light
                  </button>
                  <button
                    onClick={() => {
                      setTheme("dark");
                      setIsThemeDropdownOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-left text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-film-black-700"
                  >
                    <Moon className="h-4 w-4" />
                    Dark
                  </button>
                  <button
                    onClick={() => {
                      setTheme("system");
                      setIsThemeDropdownOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-2 text-left text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-film-black-700 rounded-b-lg"
                  >
                    <Monitor className="h-4 w-4" />
                    System
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Notifications */}
          <div className="dropdown-container relative">
            <button
              onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-film-black-800 text-gray-600 dark:text-gray-300 relative"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-film-red-600 rounded-full text-white text-xs flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-film-black-800 rounded-lg shadow-lg border border-gray-100 dark:border-film-black-700 z-10"
                >
                  <div className="p-4 border-b border-gray-100 dark:border-film-black-700 flex justify-between items-center">
                    <h3 className="font-medium text-gray-900 dark:text-white">Notifications</h3>
                    <button
                      onClick={markAllAsRead}
                      className="text-sm text-film-red-600 hover:text-film-red-700 dark:text-film-red-500 dark:hover:text-film-red-400"
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-3 border-b border-gray-100 dark:border-film-black-700 last:border-0 ${!notification.read
                            ? "bg-blue-50 dark:bg-blue-900/10"
                            : ""
                            }`}
                        >
                          <div className="flex items-start">
                            <div className="flex-shrink-0 mt-0.5">
                              <div className="w-8 h-8 bg-film-red-100 dark:bg-film-red-900/20 rounded-full flex items-center justify-center text-film-red-600 dark:text-film-red-500">
                                <Bell className="h-4 w-4" />
                              </div>
                            </div>
                            <div className="ml-3 flex-1">
                              <p className="text-sm text-gray-800 dark:text-gray-200">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {notification.time}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-film-red-600 rounded-full"></div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                        No notifications
                      </div>
                    )}
                  </div>
                  <div className="p-2 border-t border-gray-100 dark:border-film-black-700">
                    <Link
                      href="/admin/notifications"
                      className="block w-full text-center py-2 text-sm text-film-red-600 dark:text-film-red-500 hover:underline"
                    >
                      View all notifications
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User profile */}
          <div className="dropdown-container relative">
            <button
              onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
              className="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-film-black-800"
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-film-black-800 flex items-center justify-center overflow-hidden">
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || "User"}
                    width={32}
                    height={32}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {user?.name?.charAt(0) || "U"}
                  </span>
                )}
              </div>
              <span className="text-sm font-medium text-gray-800 dark:text-white hidden md:block">
                {user?.name?.split(' ')[0]}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400 hidden md:block" />
            </button>

            <AnimatePresence>
              {isUserDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-48 bg-white dark:bg-film-black-800 rounded-lg shadow-lg border border-gray-100 dark:border-film-black-700 z-10"
                >
                  <div className="p-3 border-b border-gray-100 dark:border-film-black-700">
                    <div className="font-medium text-gray-900 dark:text-white">
                      {user?.name}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                      {user?.email}
                    </div>
                  </div>
                  <div className="p-2">
                    <Link
                      href="/admin/profile"
                      className="flex items-center gap-2 w-full px-3 py-2 text-left text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-film-black-700 rounded-md"
                    >
                      <User className="h-4 w-4" />
                      Your Profile
                    </Link>
                    <Link
                      href="/admin/settings"
                      className="flex items-center gap-2 w-full px-3 py-2 text-left text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-film-black-700 rounded-md"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                    <button
                      onClick={() => logout()}
                      className="flex items-center gap-2 w-full px-3 py-2 text-left text-gray-800 dark:text-white hover:bg-gray-100 dark:hover:bg-film-black-700 rounded-md"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;

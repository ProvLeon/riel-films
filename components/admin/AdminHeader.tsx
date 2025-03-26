import { useState } from "react";
import { useTheme } from "@/context/ThemeProvider";
import { Search, Bell, Sun, Moon, Monitor } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

const AdminHeader = () => {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = useState(false);

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

  return (
    <header className="h-16 border-b border-gray-200 dark:border-film-black-800 bg-white dark:bg-film-black-900 flex items-center px-4 md:px-6">
      <div className="flex items-center w-full justify-between">
        <h1 className="text-xl font-bold text-film-black-900 dark:text-white">
          Admin Dashboard
        </h1>

        <div className="flex items-center space-x-3">
          <Link
            href="/"
            target="_blank"
            className="text-gray-600 dark:text-gray-400 hover:text-film-red-600 dark:hover:text-film-red-500 text-sm"
          >
            View Site
          </Link>

          {/* Search */}
          <div className="hidden md:flex items-center relative">
            <input
              type="text"
              placeholder="Search..."
              className="py-1.5 px-3 pl-9 rounded-lg bg-gray-100 dark:bg-film-black-800 border border-transparent focus:border-gray-300 dark:focus:border-film-black-700 focus:outline-none text-gray-800 dark:text-white"
            />
            <Search className="h-4 w-4 text-gray-500 dark:text-gray-400 absolute left-3" />
          </div>

          {/* Theme switcher */}
          <div className="relative">
            <button
              onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-film-black-800 text-gray-600 dark:text-gray-300"
            >
              {getThemeIcon()}
            </button>

            {isThemeDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
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
          </div>

          {/* Notifications */}
          <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-film-black-800 text-gray-600 dark:text-gray-300 relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-film-red-600 rounded-full"></span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;

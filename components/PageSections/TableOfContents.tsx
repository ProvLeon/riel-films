import React, { useEffect, useState } from "react";
import { Link as ScrollLink } from "react-scroll";

interface TOCItem {
  id: string;
  label: string;
}

interface TableOfContentsProps {
  items: TOCItem[];
  className?: string;
}

const TableOfContents: React.FC<TableOfContentsProps> = ({
  items,
  className = "",
}) => {
  const [activeSection, setActiveSection] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show TOC after scrolling down a bit
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }

      // Find the current section in view
      const currentSection = items
        .map((item) => item.id)
        .find((id) => {
          const element = document.getElementById(id);
          if (!element) return false;

          const rect = element.getBoundingClientRect();
          return rect.top <= 200 && rect.bottom >= 0;
        });

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [items]);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed right-8 top-1/2 transform -translate-y-1/2 z-20 hidden xl:block ${className}`}
    >
      <div className="bg-white/90 dark:bg-film-black-900/90 backdrop-blur-sm p-4 rounded-xl shadow-lg border border-gray-100 dark:border-film-black-800">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          On this page
        </h3>
        <ul className="space-y-2">
          {items.map((item) => (
            <li key={item.id}>
              <ScrollLink
                to={item.id}
                spy={true}
                smooth={true}
                offset={-100}
                duration={500}
                className={`text-sm cursor-pointer block py-1 px-2 rounded transition-colors ${
                  activeSection === item.id
                    ? "bg-yellow-100 dark:bg-film-red-900/30 text-yellow-800 dark:text-film-red-200 font-medium"
                    : "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                }`}
              >
                {item.label}
              </ScrollLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TableOfContents;

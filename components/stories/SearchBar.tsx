import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ value, onChange, placeholder = "Search..." }) => {
  return (
    <div className="mb-12 relative">
      <div className="relative max-w-xl">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-6 py-4 pr-12 rounded-xl bg-white dark:bg-film-black-900 border border-gray-200 dark:border-film-black-800 focus:outline-none focus:ring-2 focus:ring-film-red-500 text-gray-800 dark:text-white shadow-sm"
        />
        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
          <Search className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;

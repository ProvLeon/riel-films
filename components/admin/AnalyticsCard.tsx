import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, Loader2 } from 'lucide-react';

interface AnalyticsCardProps {
  title: string;
  value: number;
  unit?: string;
  change?: string;
  icon: React.ReactNode;
  color: string;
  isNegativeGood?: boolean;
  isLoading?: boolean;
}

const colorMap: Record<string, string> = {
  blue: "bg-blue-50 dark:bg-blue-900/20 text-blue-500",
  green: "bg-green-50 dark:bg-green-900/20 text-green-500",
  purple: "bg-purple-50 dark:bg-purple-900/20 text-purple-500",
  amber: "bg-amber-50 dark:bg-amber-900/20 text-amber-500",
  red: "bg-red-50 dark:bg-red-900/20 text-red-500",
};

const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  title,
  value,
  unit = "",
  change,
  icon,
  color = "blue",
  isNegativeGood = false,
  isLoading = false,
}) => {
  const isPositiveChange = change?.startsWith('+');
  const iconBgClass = colorMap[color] || colorMap.blue;

  // Determine if the change is "good" (green) or "bad" (red)
  const isGoodChange = isNegativeGood ? !isPositiveChange : isPositiveChange;

  // Format the value for display
  const formattedValue = value?.toLocaleString('en-US', {
    maximumFractionDigits: 1,
  });

  return (
    <div className="bg-white dark:bg-film-black-900 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-film-black-800 h-full transition-all hover:shadow-md">
      <div className="flex justify-between items-start">
        <div className={`w-12 h-12 rounded-full ${iconBgClass} flex items-center justify-center`}>
          {icon}
        </div>

        {change && (
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${isGoodChange
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
            }`}>
            <span className="flex items-center">
              {isPositiveChange ?
                <ArrowUp className="h-3 w-3 mr-1" /> :
                <ArrowDown className="h-3 w-3 mr-1" />
              }
              {change}
            </span>
          </div>
        )}
      </div>

      <h3 className="text-gray-600 dark:text-gray-400 text-sm mt-4">{title}</h3>

      {isLoading ? (
        <div className="mt-2 flex items-center">
          <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
        </div>
      ) : (
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
          {formattedValue}{unit && <span className="text-sm ml-1">{unit}</span>}
        </p>
      )}
    </div>
  );
};

export default AnalyticsCard;

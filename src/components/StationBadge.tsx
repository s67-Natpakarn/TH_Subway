import React from 'react';

interface StationBadgeProps {
  line: string;
  className?: string;
}

export const StationBadge: React.FC<StationBadgeProps> = ({ line, className = '' }) => {
  const getLineConfig = (lineName: string) => {
    switch (lineName.toUpperCase()) {
      case 'BTS_GREEN':
        return {
          name: 'BTS Green',
          bg: 'bg-bts/10 text-bts border-bts/30',
          dot: 'bg-bts',
        };
      case 'MRT_BLUE':
        return {
          name: 'MRT Blue',
          bg: 'bg-mrt/10 text-mrt dark:text-blue-400 border-mrt/30',
          dot: 'bg-mrt dark:bg-blue-400',
        };
      case 'ARL':
        return {
          name: 'ARL Maroon',
          bg: 'bg-arl/10 text-arl dark:text-red-400 border-arl/30',
          dot: 'bg-arl dark:bg-red-400',
        };
      default:
        return {
          name: 'Transit',
          bg: 'bg-gray-100 text-gray-800 border-gray-300',
          dot: 'bg-gray-400',
        };
    }
  };

  const config = getLineConfig(line);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold border ${config.bg} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.name}
    </span>
  );
};

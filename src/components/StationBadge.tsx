import React from 'react';

interface StationBadgeProps {
  line: string;
  className?: string;
}

export const StationBadge: React.FC<StationBadgeProps> = ({ line, className = '' }) => {
  const getLineConfig = (lineName: string) => {
    switch (lineName.toUpperCase()) {
      case 'BTS_SUKHUMVIT':
        return {
          name: 'BTS Sukhumvit',
          bg: 'bg-bts-s/10 text-bts-s border-bts-s/30 dark:bg-bts-s/20',
          dot: 'bg-bts-s',
        };
      case 'BTS_SILOM':
        return {
          name: 'BTS Silom',
          bg: 'bg-bts-l/10 text-bts-l border-bts-l/30 dark:bg-bts-l/20',
          dot: 'bg-bts-l',
        };
      case 'MRT_BLUE':
        return {
          name: 'MRT Blue',
          bg: 'bg-mrt-b/10 text-mrt-b dark:text-blue-400 border-mrt-b/30 dark:bg-mrt-b/20',
          dot: 'bg-mrt-b dark:bg-blue-400',
        };
      case 'MRT_PURPLE':
        return {
          name: 'MRT Purple',
          bg: 'bg-mrt-p/10 text-mrt-p dark:text-purple-400 border-mrt-p/30 dark:bg-mrt-p/20',
          dot: 'bg-mrt-p dark:bg-purple-400',
        };
      case 'MRT_YELLOW':
        return {
          name: 'MRT Yellow',
          bg: 'bg-mrt-y/10 text-mrt-y dark:text-yellow-400 border-mrt-y/30 dark:bg-mrt-y/20',
          dot: 'bg-mrt-y dark:bg-yellow-400',
        };
      case 'MRT_PINK':
        return {
          name: 'MRT Pink',
          bg: 'bg-mrt-pk/10 text-mrt-pk dark:text-pink-400 border-mrt-pk/30 dark:bg-mrt-pk/20',
          dot: 'bg-mrt-pk dark:bg-pink-400',
        };
      case 'ARL':
        return {
          name: 'Airport Rail Link',
          bg: 'bg-arl/10 text-arl dark:text-red-400 border-arl/30 dark:bg-arl/20',
          dot: 'bg-arl dark:bg-red-400',
        };
      case 'SRT_RED':
        return {
          name: 'SRT Red',
          bg: 'bg-srt/10 text-srt dark:text-red-500 border-srt/30 dark:bg-srt/20',
          dot: 'bg-srt dark:bg-red-500',
        };
      default:
        return {
          name: 'Transit',
          bg: 'bg-gray-100 text-gray-800 border-gray-300 dark:bg-gray-800 dark:text-gray-200',
          dot: 'bg-gray-400',
        };
    }
  };

  const config = getLineConfig(line);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border transition ${config.bg} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.name}
    </span>
  );
};

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
 bg: 'bg-bts-s/10 text-bts-s border-bts-s/30 ',
 dot: 'bg-bts-s',
 };
 case 'BTS_SILOM':
 return {
 name: 'BTS Silom',
 bg: 'bg-bts-l/10 text-bts-l border-bts-l/30 ',
 dot: 'bg-bts-l',
 };
 case 'MRT_BLUE':
 return {
 name: 'MRT Blue',
 bg: 'bg-mrt-b/10 text-mrt-b border-mrt-b/30 ',
 dot: 'bg-mrt-b ',
 };
 case 'MRT_PURPLE':
 return {
 name: 'MRT Purple',
 bg: 'bg-mrt-p/10 text-mrt-p border-mrt-p/30 ',
 dot: 'bg-mrt-p ',
 };
 case 'MRT_YELLOW':
 return {
 name: 'MRT Yellow',
 bg: 'bg-mrt-y/10 text-mrt-y border-mrt-y/30 ',
 dot: 'bg-mrt-y ',
 };
 case 'MRT_PINK':
 return {
 name: 'MRT Pink',
 bg: 'bg-mrt-pk/10 text-mrt-pk border-mrt-pk/30 ',
 dot: 'bg-mrt-pk ',
 };
 case 'ARL':
 return {
 name: 'Airport Rail Link',
 bg: 'bg-arl/10 text-arl border-arl/30 ',
 dot: 'bg-arl ',
 };
 case 'SRT_RED':
 return {
 name: 'SRT Red',
 bg: 'bg-srt/10 text-srt border-srt/30 ',
 dot: 'bg-srt ',
 };
 default:
 return {
 name: 'Transit',
 bg: 'bg-gray-100 text-gray-800 border-gray-300 ',
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

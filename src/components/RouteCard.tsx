import React from 'react';
import type { RouteResult } from '../utils/pathfinder';
import { StationBadge } from './StationBadge';
import { Clock, Landmark, Navigation2, ArrowRight, AlertCircle } from 'lucide-react';

interface RouteCardProps {
  route: RouteResult;
  onClear: () => void;
}

export const RouteCard: React.FC<RouteCardProps> = ({ route, onClear }) => {
  const getLineBgColor = (line: string) => {
    switch (line.toUpperCase()) {
      case 'BTS_SUKHUMVIT': return 'bg-bts-s ring-bts-s/30';
      case 'BTS_SILOM': return 'bg-bts-l ring-bts-l/30';
      case 'MRT_BLUE': return 'bg-mrt-b ring-mrt-b/30';
      case 'MRT_PURPLE': return 'bg-mrt-p ring-mrt-p/30';
      case 'MRT_YELLOW': return 'bg-mrt-y ring-mrt-y/30';
      case 'MRT_PINK': return 'bg-mrt-pk ring-mrt-pk/30';
      case 'ARL': return 'bg-arl ring-arl/30';
      case 'SRT_RED': return 'bg-srt ring-srt/30';
      default: return 'bg-gray-400 ring-gray-400/30';
    }
  };

  return (
    <div className="flex flex-col gap-5 p-5 rounded-2xl glass-card transition-all duration-300 animate-in fade-in-50 slide-in-from-bottom-5">
      {/* Header Info */}
      <div className="flex justify-between items-start border-b border-black/5 dark:border-white/5 pb-4">
        <div>
          <h3 className="text-[10px] font-bold tracking-wider uppercase opacity-45">แนะนำเส้นทาง</h3>
          <h2 className="text-xl font-bold mt-0.5 tracking-tight">เดินทางรวดเร็วที่สุด</h2>
        </div>
        <button
          onClick={onClear}
          className="text-xs px-3 py-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10 text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition"
        >
          ล้างผลลัพธ์
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 text-center">
          <Clock className="w-4 h-4 opacity-60 mb-1" />
          <span className="text-[10px] font-medium opacity-60">เวลาเดินทาง</span>
          <span className="text-base font-bold tracking-tight mt-0.5">{route.totalTime} นาที</span>
        </div>
        <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 text-center">
          <Landmark className="w-4 h-4 opacity-60 mb-1" />
          <span className="text-[10px] font-medium opacity-60">ค่าโดยสาร</span>
          <span className="text-base font-bold tracking-tight mt-0.5">{route.totalFare} บาท</span>
        </div>
        <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.03] border border-black/5 dark:border-white/5 text-center">
          <Navigation2 className="w-4 h-4 opacity-60 mb-1" />
          <span className="text-[10px] font-medium opacity-60">เปลี่ยนสาย</span>
          <span className="text-base font-bold tracking-tight mt-0.5">{route.interchanges.length} ครั้ง</span>
        </div>
      </div>

      {/* Transfer Warning Alert */}
      {route.interchanges.length > 0 && (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-600 dark:text-yellow-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>บวกเวลาเปลี่ยนสายข้ามระบบแล้วครั้งละ 5 นาที</span>
        </div>
      )}

      {/* Steps Timeline */}
      <div className="flex flex-col gap-3 relative before:content-[''] before:absolute before:left-[17px] before:top-[12px] before:bottom-[12px] before:w-[2px] before:bg-black/10 dark:before:bg-white/10 max-h-[320px] overflow-y-auto pr-1">
        {route.steps.map((step, index) => {
          const isInterchange = step.type === 'interchange';
          const isCrossPlatform = step.type === 'cross-platform';
          const isLast = index === route.steps.length - 1;

          return (
            <div key={index} className="flex gap-4 items-start relative z-10">
              {/* Timeline Indicator */}
              <div className="flex items-center justify-center w-[36px] h-[36px]">
                <div
                  className={`w-3.5 h-3.5 rounded-full border-2 border-[#f5f5f7] dark:border-black ring-2 ${
                    isInterchange
                      ? 'bg-yellow-500 ring-yellow-500/30'
                      : isCrossPlatform
                      ? 'bg-orange-500 ring-orange-500/30'
                      : getLineBgColor(step.station.line)
                  }`}
                />
              </div>

              {/* Step Detail */}
              <div className="flex-1 pt-1">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-semibold text-xs leading-none">
                    {step.station.nameTH}
                  </span>
                  <span className="text-[10px] opacity-50 font-normal">
                    {step.station.nameEN}
                  </span>
                  <StationBadge line={step.station.line} className="scale-75 origin-left" />
                </div>

                {!isLast && (
                  <div className="mt-1.5 text-[10px] opacity-65 flex items-center gap-1.5 bg-black/[0.02] dark:bg-white/[0.02] py-1 px-2.5 rounded-lg w-fit">
                    {isInterchange ? (
                      <>
                        <ArrowRight className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-400" />
                        <span>เดินเท้าเปลี่ยนสายเดินรถ (บวกเวลาเปลี่ยนระบบ +5 นาที)</span>
                      </>
                    ) : isCrossPlatform ? (
                      <>
                        <ArrowRight className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                        <span>เปลี่ยนชานชาลาในสถานีเดียวกัน (ใช้เวลา 1 นาที)</span>
                      </>
                    ) : (
                      <>
                        <span>เดินทางถัดไป (ประมาณ {step.timeToNext} นาที)</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

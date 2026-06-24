import React, { useState } from 'react';
import type { RouteResult, PathStep } from '../utils/pathfinder';
import { getLineConfig } from '../utils/lineConfig';
import { Clock, Landmark, Navigation2, ChevronDown, ChevronUp, ArrowRight, AlertCircle, Train, MapPin } from 'lucide-react';

interface RouteCardProps {
  route: RouteResult;
  onClear: () => void;
}

interface LineSegment {
  line: string;
  stations: { step: PathStep; index: number }[];
}

/** Group consecutive steps of the same line into segments */
function buildSegments(steps: PathStep[]): LineSegment[] {
  const segments: LineSegment[] = [];
  let currentSegment: LineSegment | null = null;
  let stationIndex = 1;

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const isTransfer = step.type === 'interchange' || step.type === 'cross-platform';

    if (isTransfer) {
      // Close current segment before the transfer
      if (currentSegment) {
        segments.push(currentSegment);
        currentSegment = null;
      }
      // The transfer step itself becomes a separator (no segment)
      // But we push a "transfer marker" segment with 0 stations
      segments.push({ line: '__TRANSFER__' + step.type, stations: [{ step, index: stationIndex }] });
      stationIndex++;
    } else {
      if (!currentSegment || currentSegment.line !== step.station.line) {
        // New segment
        if (currentSegment) segments.push(currentSegment);
        currentSegment = { line: step.station.line, stations: [] };
      }
      currentSegment.stations.push({ step, index: stationIndex });
      stationIndex++;
    }
  }

  if (currentSegment) segments.push(currentSegment);
  return segments;
}

const SegmentCard: React.FC<{
  segment: LineSegment;
  segmentIndex: number;
  isLast: boolean;
}> = ({ segment, segmentIndex, isLast }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const isTransfer = segment.line.startsWith('__TRANSFER__');

  if (isTransfer) {
    const transferStep = segment.stations[0].step;
    const isCross = segment.line.includes('cross-platform');
    return (
      <div className="flex items-center gap-3 py-2 px-3 my-1 rounded-xl bg-amber-50 border border-amber-200/60">
        <div className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 border border-amber-300 shrink-0">
          <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
            {isCross ? 'เปลี่ยนชานชาลา' : 'เปลี่ยนสาย'}
          </div>
          <div className="text-[9px] text-amber-600 mt-0.5">
            {isCross
              ? 'เปลี่ยนชานชาลาในสถานีเดียวกัน (~1 นาที)'
              : 'เดินเท้าเปลี่ยนระบบ (~5 นาที)'}
          </div>
        </div>
      </div>
    );
  }

  const cfg = getLineConfig(segment.line);
  const count = segment.stations.length;
  const firstSt = segment.stations[0].step.station;
  const lastSt = segment.stations[count - 1].step.station;
  const sameStation = firstSt.id === lastSt.id;

  return (
    <div
      className="rounded-xl border overflow-hidden transition-all duration-200"
      style={{ borderColor: cfg.color + '40' }}
    >
      {/* Segment Header — clickable to expand */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 p-3 text-left hover:brightness-95 transition-all"
        style={{ backgroundColor: cfg.color + '12' }}
      >
        {/* Line color dot */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[8px] font-black shrink-0 shadow-sm"
          style={{ backgroundColor: cfg.color }}
        >
          <Train className="w-3.5 h-3.5" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold" style={{ color: cfg.color }}>
              {cfg.nameTH}
            </span>
            <span
              className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
              style={{ backgroundColor: cfg.color + '20', color: cfg.color }}
            >
              {count} สถานี
            </span>
          </div>
          <div className="text-[9px] text-gray-500 mt-0.5 truncate">
            {firstSt.nameTH}
            {!sameStation && (
              <>
                <span className="mx-1 opacity-60">→</span>
                {lastSt.nameTH}
              </>
            )}
          </div>
        </div>

        <div className="text-gray-400 shrink-0">
          {isExpanded
            ? <ChevronUp className="w-3.5 h-3.5" />
            : <ChevronDown className="w-3.5 h-3.5" />}
        </div>
      </button>

      {/* Expanded station list */}
      {isExpanded && (
        <div className="border-t divide-y" style={{ borderColor: cfg.color + '20' }}>
          {segment.stations.map(({ step, index }, si) => {
            const isFirst = si === 0;
            const isLastInSeg = si === segment.stations.length - 1;
            return (
              <div key={step.station.id} className="flex items-center gap-3 px-3 py-2 bg-white/60">
                {/* Index + line indicator */}
                <div className="flex flex-col items-center w-7 shrink-0">
                  <div
                    className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[7px] font-black"
                    style={{ backgroundColor: isFirst || isLastInSeg ? cfg.color : cfg.color + '60' }}
                  >
                    {index}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-semibold text-gray-800 leading-tight">
                    {step.station.nameTH}
                  </div>
                  <div className="text-[8.5px] text-gray-400">{step.station.nameEN}</div>
                </div>

                <div className="text-[8px] text-gray-400 font-mono shrink-0">
                  {step.station.id}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const RouteCard: React.FC<RouteCardProps> = ({ route, onClear }) => {
  const segments = buildSegments(route.steps);

  const lineSegments = segments.filter(s => !s.line.startsWith('__TRANSFER__'));
  const firstLine = lineSegments[0]?.line ?? '';
  const firstCfg = getLineConfig(firstLine);

  return (
    <div className="flex flex-col gap-4 animate-in fade-in-50 slide-in-from-bottom-5">
      {/* Header */}
      <div
        className="flex justify-between items-start px-4 py-3 rounded-xl"
        style={{ backgroundColor: firstCfg.color + '15', borderLeft: `3px solid ${firstCfg.color}` }}
      >
        <div>
          <div className="text-[9px] font-bold tracking-wider uppercase opacity-50">แนะนำเส้นทาง</div>
          <div className="text-base font-bold mt-0.5 tracking-tight">เส้นทางเดินทาง</div>
        </div>
        <button
          onClick={onClear}
          className="text-[10px] px-3 py-1.5 rounded-full hover:bg-black/5 text-gray-500 hover:text-black transition"
        >
          ล้าง
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-2">
        <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-black/[0.02] border border-black/5 text-center">
          <Clock className="w-3.5 h-3.5 opacity-50 mb-1" />
          <span className="text-[9px] text-gray-500">เวลา</span>
          <span className="text-sm font-bold mt-0.5">{route.totalTime} <span className="text-[9px] font-normal">นาที</span></span>
        </div>
        <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-black/[0.02] border border-black/5 text-center">
          <Landmark className="w-3.5 h-3.5 opacity-50 mb-1" />
          <span className="text-[9px] text-gray-500">ค่าโดยสาร</span>
          <span className="text-sm font-bold mt-0.5">{route.totalFare} <span className="text-[9px] font-normal">บาท</span></span>
        </div>
        <div className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-black/[0.02] border border-black/5 text-center">
          <Navigation2 className="w-3.5 h-3.5 opacity-50 mb-1" />
          <span className="text-[9px] text-gray-500">เปลี่ยนสาย</span>
          <span className="text-sm font-bold mt-0.5">{route.interchanges.length} <span className="text-[9px] font-normal">ครั้ง</span></span>
        </div>
      </div>

      {/* Transfer notice */}
      {route.interchanges.length > 0 && (
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-50 border border-amber-200/60 text-amber-700 text-[9px]">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>รวมเวลาเปลี่ยนสายข้ามระบบแล้ว ครั้งละ ~5 นาที</span>
        </div>
      )}

      {/* Segment Accordion List */}
      <div className="flex flex-col gap-2 overflow-y-auto max-h-[420px] pr-0.5">
        {/* Origin marker */}
        <div className="flex items-center gap-2 px-3 py-1.5">
          <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: firstCfg.color }} />
          <span className="text-[10px] font-semibold text-gray-600">ต้นทาง: {route.path[0]?.nameTH}</span>
        </div>

        {segments.map((seg, i) => (
          <SegmentCard
            key={`seg-${i}`}
            segment={seg}
            segmentIndex={i}
            isLast={i === segments.length - 1}
          />
        ))}

        {/* Destination marker */}
        <div className="flex items-center gap-2 px-3 py-1.5">
          <div className="w-3.5 h-3.5 rounded-full border-2 border-gray-400 shrink-0" />
          <span className="text-[10px] font-semibold text-gray-600">
            ปลายทาง: {route.path[route.path.length - 1]?.nameTH}
          </span>
        </div>
      </div>
    </div>
  );
};

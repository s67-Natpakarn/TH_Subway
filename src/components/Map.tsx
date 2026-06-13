import React from 'react';
import type { Station, RouteResult } from '../utils/pathfinder';

interface MapProps {
  stations: Station[];
  startStation: Station | null;
  endStation: Station | null;
  onSelectStation: (station: Station) => void;
  calculatedRoute: RouteResult | null;
}

// Coordinates for nodes (x, y coordinates inside SVG viewBox="0 0 1000 600")
export const stationCoords: Record<string, { x: number; y: number }> = {
  // BTS Green
  N3: { x: 250, y: 320 },   // Phaya Thai
  N1: { x: 400, y: 320 },   // Ratchathewi
  CEN: { x: 550, y: 320 },  // Siam
  E1: { x: 700, y: 320 },   // Chit Lom
  E4: { x: 850, y: 320 },   // Asok

  // MRT Blue
  BL20: { x: 850, y: 80 },  // Phra Ram 9
  BL21: { x: 850, y: 200 }, // Phetchaburi
  BL22: { x: 850, y: 380 }, // Sukhumvit
  BL23: { x: 850, y: 500 }, // Queen Sirikit

  // ARL
  A8: { x: 250, y: 200 },   // Phaya Thai ARL
  A7: { x: 450, y: 200 },   // Ratchaprarop
  A6: { x: 650, y: 200 },   // Makkasan ARL
};

export const Map: React.FC<MapProps> = ({
  stations,
  startStation,
  endStation,
  onSelectStation,
  calculatedRoute,
}) => {
  // Check if a station is part of the calculated route
  const isStationInRoute = (stationId: string) => {
    if (!calculatedRoute) return false;
    return calculatedRoute.path.some((s) => s.id === stationId);
  };

  // Check if an edge is part of the calculated route path
  const isEdgeInRoute = (fromId: string, toId: string) => {
    if (!calculatedRoute) return false;
    const path = calculatedRoute.path;
    for (let i = 0; i < path.length - 1; i++) {
      if (
        (path[i].id === fromId && path[i + 1].id === toId) ||
        (path[i].id === toId && path[i + 1].id === fromId)
      ) {
        return true;
      }
    }
    return false;
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-6 relative select-none">
      {/* Subtle Map Title / Instructions */}
      <div className="absolute top-8 right-8 text-right hidden md:block">
        <h2 className="text-xl font-bold tracking-tight">แผนที่ระบบขนส่งมวลชน</h2>
        <p className="text-xs opacity-40 mt-1">คลิกที่สถานีเพื่อเลือก ต้นทาง / ปลายทาง</p>
      </div>

      {/* SVG Container */}
      <svg
        viewBox="0 0 1050 580"
        className="w-full max-w-[950px] aspect-[1050/580] drop-shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:drop-shadow-[0_20px_50px_rgba(255,255,255,0.02)] transition-colors duration-500"
      >
        {/* Background Grid Elements for Minimalist Look */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-black/[0.02] dark:text-white/[0.01]" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" rx="24" />

        {/* --- STAGE 1: Static Subway Lines (Rails) --- */}
        {/* BTS Green Line */}
        <path
          d={`M ${stationCoords.N3.x} ${stationCoords.N3.y} L ${stationCoords.N1.x} ${stationCoords.N1.y} L ${stationCoords.CEN.x} ${stationCoords.CEN.y} L ${stationCoords.E1.x} ${stationCoords.E1.y} L ${stationCoords.E4.x} ${stationCoords.E4.y}`}
          fill="none"
          stroke="#84C225"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-20 dark:opacity-30"
        />

        {/* MRT Blue Line */}
        <path
          d={`M ${stationCoords.BL20.x} ${stationCoords.BL20.y} L ${stationCoords.BL21.x} ${stationCoords.BL21.y} L ${stationCoords.BL22.x} ${stationCoords.BL22.y} L ${stationCoords.BL23.x} ${stationCoords.BL23.y}`}
          fill="none"
          stroke="#003D7C"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-20 dark:opacity-30"
        />

        {/* ARL Maroon Line */}
        <path
          d={`M ${stationCoords.A8.x} ${stationCoords.A8.y} L ${stationCoords.A7.x} ${stationCoords.A7.y} L ${stationCoords.A6.x} ${stationCoords.A6.y}`}
          fill="none"
          stroke="#9E1B32"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="opacity-20 dark:opacity-30"
        />

        {/* Interchange Dotted Paths */}
        {/* Phaya Thai BTS (N3) <-> Phaya Thai ARL (A8) */}
        <line
          x1={stationCoords.N3.x}
          y1={stationCoords.N3.y}
          x2={stationCoords.A8.x}
          y2={stationCoords.A8.y}
          stroke="#94a3b8"
          strokeWidth="3"
          strokeDasharray="4 4"
          className="opacity-40"
        />
        {/* Makkasan ARL (A6) <-> Phetchaburi MRT (BL21) */}
        <line
          x1={stationCoords.A6.x}
          y1={stationCoords.A6.y}
          x2={stationCoords.BL21.x}
          y2={stationCoords.BL21.y}
          stroke="#94a3b8"
          strokeWidth="3"
          strokeDasharray="4 4"
          className="opacity-40"
        />
        {/* Asok BTS (E4) <-> Sukhumvit MRT (BL22) */}
        <line
          x1={stationCoords.E4.x}
          y1={stationCoords.E4.y}
          x2={stationCoords.BL22.x}
          y2={stationCoords.BL22.y}
          stroke="#94a3b8"
          strokeWidth="3"
          strokeDasharray="4 4"
          className="opacity-40"
        />

        {/* --- STAGE 2: Route Highlight Overlay (Pulsing Paths) --- */}
        {calculatedRoute && (
          <>
            {/* Draw active path segments */}
            {/* BTS Green Segments */}
            {isEdgeInRoute('N3', 'N1') && (
              <line x1={stationCoords.N3.x} y1={stationCoords.N3.y} x2={stationCoords.N1.x} y2={stationCoords.N1.y} stroke="#84C225" strokeWidth="6" strokeLinecap="round" className="map-line" />
            )}
            {isEdgeInRoute('N1', 'CEN') && (
              <line x1={stationCoords.N1.x} y1={stationCoords.N1.y} x2={stationCoords.CEN.x} y2={stationCoords.CEN.y} stroke="#84C225" strokeWidth="6" strokeLinecap="round" className="map-line" />
            )}
            {isEdgeInRoute('CEN', 'E1') && (
              <line x1={stationCoords.CEN.x} y1={stationCoords.CEN.y} x2={stationCoords.E1.x} y2={stationCoords.E1.y} stroke="#84C225" strokeWidth="6" strokeLinecap="round" className="map-line" />
            )}
            {isEdgeInRoute('E1', 'E4') && (
              <line x1={stationCoords.E1.x} y1={stationCoords.E1.y} x2={stationCoords.E4.x} y2={stationCoords.E4.y} stroke="#84C225" strokeWidth="6" strokeLinecap="round" className="map-line" />
            )}

            {/* MRT Blue Segments */}
            {isEdgeInRoute('BL20', 'BL21') && (
              <line x1={stationCoords.BL20.x} y1={stationCoords.BL20.y} x2={stationCoords.BL21.x} y2={stationCoords.BL21.y} stroke="#003D7C" strokeWidth="6" strokeLinecap="round" className="map-line" />
            )}
            {isEdgeInRoute('BL21', 'BL22') && (
              <line x1={stationCoords.BL21.x} y1={stationCoords.BL21.y} x2={stationCoords.BL22.x} y2={stationCoords.BL22.y} stroke="#003D7C" strokeWidth="6" strokeLinecap="round" className="map-line" />
            )}
            {isEdgeInRoute('BL22', 'BL23') && (
              <line x1={stationCoords.BL22.x} y1={stationCoords.BL22.y} x2={stationCoords.BL23.x} y2={stationCoords.BL23.y} stroke="#003D7C" strokeWidth="6" strokeLinecap="round" className="map-line" />
            )}

            {/* ARL Segments */}
            {isEdgeInRoute('A8', 'A7') && (
              <line x1={stationCoords.A8.x} y1={stationCoords.A8.y} x2={stationCoords.A7.x} y2={stationCoords.A7.y} stroke="#9E1B32" strokeWidth="6" strokeLinecap="round" className="map-line" />
            )}
            {isEdgeInRoute('A7', 'A6') && (
              <line x1={stationCoords.A7.x} y1={stationCoords.A7.y} x2={stationCoords.A6.x} y2={stationCoords.A6.y} stroke="#9E1B32" strokeWidth="6" strokeLinecap="round" className="map-line" />
            )}

            {/* Interchange Walk Segments */}
            {isEdgeInRoute('N3', 'A8') && (
              <line x1={stationCoords.N3.x} y1={stationCoords.N3.y} x2={stationCoords.A8.x} y2={stationCoords.A8.y} stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" strokeDasharray="5 5" />
            )}
            {isEdgeInRoute('BL21', 'A6') && (
              <line x1={stationCoords.BL21.x} y1={stationCoords.BL21.y} x2={stationCoords.A6.x} y2={stationCoords.A6.y} stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" strokeDasharray="5 5" />
            )}
            {isEdgeInRoute('E4', 'BL22') && (
              <line x1={stationCoords.E4.x} y1={stationCoords.E4.y} x2={stationCoords.BL22.x} y2={stationCoords.BL22.y} stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" strokeDasharray="5 5" />
            )}
          </>
        )}

        {/* --- STAGE 3: Station Circles & Interaction Handles --- */}
        {stations.map((st) => {
          const coords = stationCoords[st.id];
          if (!coords) return null;

          const isStart = startStation?.id === st.id;
          const isEnd = endStation?.id === st.id;
          const inRoute = isStationInRoute(st.id);

          // Station line styling
          let strokeColor = '#94a3b8';
          if (st.line === 'BTS_GREEN') strokeColor = '#84C225';
          else if (st.line === 'MRT_BLUE') strokeColor = '#003D7C';
          else if (st.line === 'ARL') strokeColor = '#9E1B32';

          return (
            <g key={`map-node-${st.id}`} className="cursor-pointer" onClick={() => onSelectStation(st)}>
              {/* Outer Glow Ring if selected or route active */}
              {(isStart || isEnd) && (
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r="16"
                  fill="none"
                  stroke={isStart ? '#84C225' : '#003D7C'}
                  strokeWidth="2.5"
                  className="animate-ping opacity-40"
                  style={{ animationDuration: '2s' }}
                />
              )}

              {/* Station Circle Body */}
              <circle
                cx={coords.x}
                cy={coords.y}
                r={isStart || isEnd ? '9' : inRoute ? '7' : '5'}
                fill={isStart || isEnd ? '#ffffff' : inRoute ? strokeColor : '#ffffff'}
                stroke={isStart || isEnd ? (isStart ? '#84C225' : '#003D7C') : strokeColor}
                strokeWidth={isStart || isEnd ? '4.5' : '3.5'}
                className="map-station dark:fill-black"
              />

              {/* Station English Label */}
              <text
                x={coords.x}
                y={coords.y - 12}
                textAnchor="middle"
                className={`text-[10px] font-bold tracking-tight select-none pointer-events-none fill-black/80 dark:fill-white/80 ${
                  isStart || isEnd ? 'opacity-100 font-extrabold text-[11px]' : inRoute ? 'opacity-90' : 'opacity-40'
                }`}
              >
                {st.nameEN}
              </text>

              {/* Station Thai Label */}
              <text
                x={coords.x}
                y={coords.y + 22}
                textAnchor="middle"
                className={`text-[9.5px] font-semibold select-none pointer-events-none fill-black/60 dark:fill-white/60 ${
                  isStart || isEnd ? 'opacity-100 font-bold' : inRoute ? 'opacity-95' : 'opacity-30'
                }`}
              >
                {st.nameTH}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

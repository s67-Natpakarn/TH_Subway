import React from 'react';
import type { Station, RouteResult } from '../utils/pathfinder';

interface MapProps {
  stations: Station[];
  startStation: Station | null;
  endStation: Station | null;
  onSelectStation: (station: Station) => void;
  calculatedRoute: RouteResult | null;
}

// Coordinate layout of all nodes inside SVG viewBox="0 0 1000 580"
export const stationCoords: Record<string, { x: number; y: number }> = {
  // BTS Sukhumvit
  N24: { x: 450, y: 30 },
  N17: { x: 450, y: 90 },
  N8: { x: 450, y: 155 },
  N3: { x: 450, y: 250 },
  CEN_S: { x: 450, y: 320 },
  E4: { x: 600, y: 320 },
  E9: { x: 720, y: 320 },
  E15: { x: 840, y: 320 },
  E23: { x: 950, y: 320 },

  // BTS Silom
  W1: { x: 380, y: 340 },
  CEN_L: { x: 450, y: 340 },
  S2: { x: 450, y: 410 },
  S7: { x: 360, y: 480 },
  S12: { x: 260, y: 480 },

  // MRT Blue
  BL10: { x: 260, y: 155 },
  BL11: { x: 340, y: 155 },
  BL13: { x: 500, y: 155 },
  BL15: { x: 600, y: 155 },
  BL21: { x: 600, y: 235 },
  BL22: { x: 600, y: 355 },
  BL26: { x: 500, y: 410 },
  BL01: { x: 260, y: 390 },
  BL34: { x: 230, y: 480 },
  BL38: { x: 130, y: 480 },

  // MRT Purple
  PP01: { x: 50, y: 155 },
  PP11: { x: 150, y: 155 },
  PP16: { x: 230, y: 155 },

  // MRT Yellow
  YL01: { x: 650, y: 155 },
  YL23: { x: 840, y: 275 },

  // MRT Pink
  PK01: { x: 150, y: 90 },
  PK14: { x: 340, y: 90 },
  PK16: { x: 500, y: 90 },
  PK30: { x: 780, y: 90 },

  // ARL
  A8: { x: 450, y: 205 },
  A6: { x: 560, y: 205 },
  A1: { x: 880, y: 205 },

  // SRT Red
  RN10: { x: 340, y: 30 },
  RN06: { x: 340, y: 115 },
  RW01: { x: 310, y: 155 },
  RW06: { x: 130, y: 235 }
};

export const Map: React.FC<MapProps> = ({
  stations,
  startStation,
  endStation,
  onSelectStation,
  calculatedRoute,
}) => {
  const isStationInRoute = (stationId: string) => {
    if (!calculatedRoute) return false;
    return calculatedRoute.path.some((s) => s.id === stationId);
  };

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

  // Helper to get line colors dynamically
  const getLineColor = (lineName: string) => {
    switch (lineName.toUpperCase()) {
      case 'BTS_SUKHUMVIT': return '#159E40';
      case 'BTS_SILOM': return '#006432';
      case 'MRT_BLUE': return '#003399';
      case 'MRT_PURPLE': return '#800080';
      case 'MRT_YELLOW': return '#FCD116';
      case 'MRT_PINK': return '#FF66B2';
      case 'ARL': return '#800000';
      case 'SRT_RED': return '#E60000';
      default: return '#94a3b8';
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-4 relative select-none">
      {/* Dynamic Map Title */}
      <div className="absolute top-6 right-6 text-right hidden lg:block">
        <h2 className="text-lg font-bold tracking-tight">แผนที่เดินรถไฟฟ้ารวม</h2>
        <span className="text-[10px] opacity-45 block mt-0.5">คลิกสถานีเพื่อระบุ ต้นทาง ↔ ปลายทาง</span>
      </div>

      <svg
        viewBox="0 0 1020 540"
        className="w-full max-w-[960px] aspect-[1020/540] drop-shadow-[0_20px_50px_rgba(0,0,0,0.04)] dark:drop-shadow-[0_20px_50px_rgba(255,255,255,0.01)] transition-colors duration-500"
      >
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-black/[0.015] dark:text-white/[0.01]" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" rx="20" />

        {/* --- STAGE 1: Standard Rail Tracks (Static) --- */}
        
        {/* BTS Sukhumvit */}
        <path
          d={`M ${stationCoords.N24.x} ${stationCoords.N24.y} L ${stationCoords.N17.x} ${stationCoords.N17.y} L ${stationCoords.N8.x} ${stationCoords.N8.y} L ${stationCoords.N3.x} ${stationCoords.N3.y} L ${stationCoords.CEN_S.x} ${stationCoords.CEN_S.y} L ${stationCoords.E4.x} ${stationCoords.E4.y} L ${stationCoords.E9.x} ${stationCoords.E9.y} L ${stationCoords.E15.x} ${stationCoords.E15.y} L ${stationCoords.E23.x} ${stationCoords.E23.y}`}
          fill="none" stroke={getLineColor('BTS_SUKHUMVIT')} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-25"
        />

        {/* BTS Silom */}
        <path
          d={`M ${stationCoords.W1.x} ${stationCoords.W1.y} L ${stationCoords.CEN_L.x} ${stationCoords.CEN_L.y} L ${stationCoords.S2.x} ${stationCoords.S2.y} L ${stationCoords.S7.x} ${stationCoords.S7.y} L ${stationCoords.S12.x} ${stationCoords.S12.y}`}
          fill="none" stroke={getLineColor('BTS_SILOM')} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-25"
        />

        {/* MRT Blue Loop and branch */}
        <path
          d={`M ${stationCoords.BL38.x} ${stationCoords.BL38.y} L ${stationCoords.BL34.x} ${stationCoords.BL34.y} L ${stationCoords.BL01.x} ${stationCoords.BL01.y} L ${stationCoords.BL10.x} ${stationCoords.BL10.y} L ${stationCoords.BL11.x} ${stationCoords.BL11.y} L ${stationCoords.BL13.x} ${stationCoords.BL13.y} L ${stationCoords.BL15.x} ${stationCoords.BL15.y} L ${stationCoords.BL21.x} ${stationCoords.BL21.y} L ${stationCoords.BL22.x} ${stationCoords.BL22.y} L ${stationCoords.BL26.x} ${stationCoords.BL26.y} L ${stationCoords.BL01.x} ${stationCoords.BL01.y}`}
          fill="none" stroke={getLineColor('MRT_BLUE')} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-25"
        />

        {/* MRT Purple */}
        <path
          d={`M ${stationCoords.PP01.x} ${stationCoords.PP01.y} L ${stationCoords.PP11.x} ${stationCoords.PP11.y} L ${stationCoords.PP16.x} ${stationCoords.PP16.y}`}
          fill="none" stroke={getLineColor('MRT_PURPLE')} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-25"
        />

        {/* MRT Yellow */}
        <path
          d={`M ${stationCoords.YL01.x} ${stationCoords.YL01.y} L ${stationCoords.YL23.x} ${stationCoords.YL23.y}`}
          fill="none" stroke={getLineColor('MRT_YELLOW')} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-25"
        />

        {/* MRT Pink */}
        <path
          d={`M ${stationCoords.PK01.x} ${stationCoords.PK01.y} L ${stationCoords.PK14.x} ${stationCoords.PK14.y} L ${stationCoords.PK16.x} ${stationCoords.PK16.y} L ${stationCoords.PK30.x} ${stationCoords.PK30.y}`}
          fill="none" stroke={getLineColor('MRT_PINK')} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-25"
        />

        {/* ARL */}
        <path
          d={`M ${stationCoords.A8.x} ${stationCoords.A8.y} L ${stationCoords.A6.x} ${stationCoords.A6.y} L ${stationCoords.A1.x} ${stationCoords.A1.y}`}
          fill="none" stroke={getLineColor('ARL')} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-25"
        />

        {/* SRT Red */}
        <path
          d={`M ${stationCoords.RN10.x} ${stationCoords.RN10.y} L ${stationCoords.RN06.x} ${stationCoords.RN06.y} L ${stationCoords.RW01.x} ${stationCoords.RW01.y} L ${stationCoords.RW06.x} ${stationCoords.RW06.y}`}
          fill="none" stroke={getLineColor('SRT_RED')} strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-25"
        />

        {/* Interchange connectors (gray dashes) */}
        {/* Phaya Thai BTS <-> Phaya Thai ARL */}
        <line x1={stationCoords.N3.x} y1={stationCoords.N3.y} x2={stationCoords.A8.x} y2={stationCoords.A8.y} stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="3 3" />
        {/* Asok BTS <-> Sukhumvit MRT */}
        <line x1={stationCoords.E4.x} y1={stationCoords.E4.y} x2={stationCoords.BL22.x} y2={stationCoords.BL22.y} stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="3 3" />
        {/* Sala Daeng BTS <-> Si Lom MRT */}
        <line x1={stationCoords.S2.x} y1={stationCoords.S2.y} x2={stationCoords.BL26.x} y2={stationCoords.BL26.y} stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="3 3" />
        {/* Mo Chit BTS <-> Chatuchak Park MRT */}
        <line x1={stationCoords.N8.x} y1={stationCoords.N8.y} x2={stationCoords.BL13.x} y2={stationCoords.BL13.y} stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="3 3" />
        {/* Makkasan ARL <-> Phetchaburi MRT */}
        <line x1={stationCoords.A6.x} y1={stationCoords.A6.y} x2={stationCoords.BL21.x} y2={stationCoords.BL21.y} stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="3 3" />
        {/* Krung Thep Aphiwat SRT <-> Bang Sue MRT */}
        <line x1={stationCoords.RW01.x} y1={stationCoords.RW01.y} x2={stationCoords.BL11.x} y2={stationCoords.BL11.y} stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="3 3" />
        {/* Siam Cross-platform */}
        <line x1={stationCoords.CEN_S.x} y1={stationCoords.CEN_S.y} x2={stationCoords.CEN_L.x} y2={stationCoords.CEN_L.y} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="2 2" />
        {/* Tao Poon Cross-platform */}
        <line x1={stationCoords.BL10.x} y1={stationCoords.BL10.y} x2={stationCoords.PP16.x} y2={stationCoords.PP16.y} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="2 2" />
        {/* Bang Wa BTS <-> Bang Wa MRT */}
        <line x1={stationCoords.S12.x} y1={stationCoords.S12.y} x2={stationCoords.BL34.x} y2={stationCoords.BL34.y} stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="3 3" />
        {/* Samrong BTS <-> Samrong Yellow */}
        <line x1={stationCoords.E15.x} y1={stationCoords.E15.y} x2={stationCoords.YL23.x} y2={stationCoords.YL23.y} stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="3 3" />
        {/* Lat Phrao MRT <-> Lat Phrao Yellow */}
        <line x1={stationCoords.BL15.x} y1={stationCoords.BL15.y} x2={stationCoords.YL01.x} y2={stationCoords.YL01.y} stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="3 3" />
        {/* Nonthaburi Civic Center Purple <-> Pink */}
        <line x1={stationCoords.PP11.x} y1={stationCoords.PP11.y} x2={stationCoords.PK01.x} y2={stationCoords.PK01.y} stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="3 3" />
        {/* Lak Si Red <-> Pink */}
        <line x1={stationCoords.RN06.x} y1={stationCoords.RN06.y} x2={stationCoords.PK14.x} y2={stationCoords.PK14.y} stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="3 3" />
        {/* Wat Phra Sri Mahathat BTS <-> Pink */}
        <line x1={stationCoords.N17.x} y1={stationCoords.N17.y} x2={stationCoords.PK16.x} y2={stationCoords.PK16.y} stroke="#94a3b8" strokeWidth="2.5" strokeDasharray="3 3" />

        {/* --- STAGE 2: Route Overlay Highlighting (Pulsing flow paths) --- */}
        {calculatedRoute && (
          <>
            {/* BTS Sukhumvit Active segments */}
            {isEdgeInRoute('N24', 'N17') && <line x1={stationCoords.N24.x} y1={stationCoords.N24.y} x2={stationCoords.N17.x} y2={stationCoords.N17.y} stroke={getLineColor('BTS_SUKHUMVIT')} strokeWidth="5" strokeLinecap="round" className="map-line" />}
            {isEdgeInRoute('N17', 'N8') && <line x1={stationCoords.N17.x} y1={stationCoords.N17.y} x2={stationCoords.N8.x} y2={stationCoords.N8.y} stroke={getLineColor('BTS_SUKHUMVIT')} strokeWidth="5" strokeLinecap="round" className="map-line" />}
            {isEdgeInRoute('N8', 'N3') && <line x1={stationCoords.N8.x} y1={stationCoords.N8.y} x2={stationCoords.N3.x} y2={stationCoords.N3.y} stroke={getLineColor('BTS_SUKHUMVIT')} strokeWidth="5" strokeLinecap="round" className="map-line" />}
            {isEdgeInRoute('N3', 'CEN_S') && <line x1={stationCoords.N3.x} y1={stationCoords.N3.y} x2={stationCoords.CEN_S.x} y2={stationCoords.CEN_S.y} stroke={getLineColor('BTS_SUKHUMVIT')} strokeWidth="5" strokeLinecap="round" className="map-line" />}
            {isEdgeInRoute('CEN_S', 'E4') && <line x1={stationCoords.CEN_S.x} y1={stationCoords.CEN_S.y} x2={stationCoords.E4.x} y2={stationCoords.E4.y} stroke={getLineColor('BTS_SUKHUMVIT')} strokeWidth="5" strokeLinecap="round" className="map-line" />}
            {isEdgeInRoute('E4', 'E9') && <line x1={stationCoords.E4.x} y1={stationCoords.E4.y} x2={stationCoords.E9.x} y2={stationCoords.E9.y} stroke={getLineColor('BTS_SUKHUMVIT')} strokeWidth="5" strokeLinecap="round" className="map-line" />}
            {isEdgeInRoute('E9', 'E15') && <line x1={stationCoords.E9.x} y1={stationCoords.E9.y} x2={stationCoords.E15.x} y2={stationCoords.E15.y} stroke={getLineColor('BTS_SUKHUMVIT')} strokeWidth="5" strokeLinecap="round" className="map-line" />}
            {isEdgeInRoute('E15', 'E23') && <line x1={stationCoords.E15.x} y1={stationCoords.E15.y} x2={stationCoords.E23.x} y2={stationCoords.E23.y} stroke={getLineColor('BTS_SUKHUMVIT')} strokeWidth="5" strokeLinecap="round" className="map-line" />}

            {/* BTS Silom Active segments */}
            {isEdgeInRoute('W1', 'CEN_L') && <line x1={stationCoords.W1.x} y1={stationCoords.W1.y} x2={stationCoords.CEN_L.x} y2={stationCoords.CEN_L.y} stroke={getLineColor('BTS_SILOM')} strokeWidth="5" strokeLinecap="round" className="map-line" />}
            {isEdgeInRoute('CEN_L', 'S2') && <line x1={stationCoords.CEN_L.x} y1={stationCoords.CEN_L.y} x2={stationCoords.S2.x} y2={stationCoords.S2.y} stroke={getLineColor('BTS_SILOM')} strokeWidth="5" strokeLinecap="round" className="map-line" />}
            {isEdgeInRoute('S2', 'S7') && <line x1={stationCoords.S2.x} y1={stationCoords.S2.y} x2={stationCoords.S7.x} y2={stationCoords.S7.y} stroke={getLineColor('BTS_SILOM')} strokeWidth="5" strokeLinecap="round" className="map-line" />}
            {isEdgeInRoute('S7', 'S12') && <line x1={stationCoords.S7.x} y1={stationCoords.S7.y} x2={stationCoords.S12.x} y2={stationCoords.S12.y} stroke={getLineColor('BTS_SILOM')} strokeWidth="5" strokeLinecap="round" className="map-line" />}

            {/* MRT Blue Active segments */}
            {isEdgeInRoute('BL38', 'BL34') && <line x1={stationCoords.BL38.x} y1={stationCoords.BL38.y} x2={stationCoords.BL34.x} y2={stationCoords.BL34.y} stroke={getLineColor('MRT_BLUE')} strokeWidth="5" strokeLinecap="round" className="map-line" />}
            {isEdgeInRoute('BL34', 'BL01') && <line x1={stationCoords.BL34.x} y1={stationCoords.BL34.y} x2={stationCoords.BL01.x} y2={stationCoords.BL01.y} stroke={getLineColor('MRT_BLUE')} strokeWidth="5" strokeLinecap="round" className="map-line" />}
            {isEdgeInRoute('BL01', 'BL10') && <line x1={stationCoords.BL01.x} y1={stationCoords.BL01.y} x2={stationCoords.BL10.x} y2={stationCoords.BL10.y} stroke={getLineColor('MRT_BLUE')} strokeWidth="5" strokeLinecap="round" className="map-line" />}
            {isEdgeInRoute('BL10', 'BL11') && <line x1={stationCoords.BL10.x} y1={stationCoords.BL10.y} x2={stationCoords.BL11.x} y2={stationCoords.BL11.y} stroke={getLineColor('MRT_BLUE')} strokeWidth="5" strokeLinecap="round" className="map-line" />}
            {isEdgeInRoute('BL11', 'BL13') && <line x1={stationCoords.BL11.x} y1={stationCoords.BL11.y} x2={stationCoords.BL13.x} y2={stationCoords.BL13.y} stroke={getLineColor('MRT_BLUE')} strokeWidth="5" strokeLinecap="round" className="map-line" />}
            {isEdgeInRoute('BL13', 'BL15') && <line x1={stationCoords.BL13.x} y1={stationCoords.BL13.y} x2={stationCoords.BL15.x} y2={stationCoords.BL15.y} stroke={getLineColor('MRT_BLUE')} strokeWidth="5" strokeLinecap="round" className="map-line" />}
            {isEdgeInRoute('BL15', 'BL21') && <line x1={stationCoords.BL15.x} y1={stationCoords.BL15.y} x2={stationCoords.BL21.x} y2={stationCoords.BL21.y} stroke={getLineColor('MRT_BLUE')} strokeWidth="5" strokeLinecap="round" className="map-line" />}
            {isEdgeInRoute('BL21', 'BL22') && <line x1={stationCoords.BL21.x} y1={stationCoords.BL21.y} x2={stationCoords.BL22.x} y2={stationCoords.BL22.y} stroke={getLineColor('MRT_BLUE')} strokeWidth="5" strokeLinecap="round" className="map-line" />}
            {isEdgeInRoute('BL22', 'BL26') && <line x1={stationCoords.BL22.x} y1={stationCoords.BL22.y} x2={stationCoords.BL26.x} y2={stationCoords.BL26.y} stroke={getLineColor('MRT_BLUE')} strokeWidth="5" strokeLinecap="round" className="map-line" />}
            {isEdgeInRoute('BL26', 'BL01') && <line x1={stationCoords.BL26.x} y1={stationCoords.BL26.y} x2={stationCoords.BL01.x} y2={stationCoords.BL01.y} stroke={getLineColor('MRT_BLUE')} strokeWidth="5" strokeLinecap="round" className="map-line" />}
            {isEdgeInRoute('BL10', 'BL01') && <line x1={stationCoords.BL10.x} y1={stationCoords.BL10.y} x2={stationCoords.BL01.x} y2={stationCoords.BL01.y} stroke={getLineColor('MRT_BLUE')} strokeWidth="5" strokeLinecap="round" className="map-line" />}

            {/* MRT Purple Active segments */}
            {isEdgeInRoute('PP01', 'PP11') && <line x1={stationCoords.PP01.x} y1={stationCoords.PP01.y} x2={stationCoords.PP11.x} y2={stationCoords.PP11.y} stroke={getLineColor('MRT_PURPLE')} strokeWidth="5" strokeLinecap="round" className="map-line" />}
            {isEdgeInRoute('PP11', 'PP16') && <line x1={stationCoords.PP11.x} y1={stationCoords.PP11.y} x2={stationCoords.PP16.x} y2={stationCoords.PP16.y} stroke={getLineColor('MRT_PURPLE')} strokeWidth="5" strokeLinecap="round" className="map-line" />}

            {/* MRT Yellow Active segments */}
            {isEdgeInRoute('YL01', 'YL23') && <line x1={stationCoords.YL01.x} y1={stationCoords.YL01.y} x2={stationCoords.YL23.x} y2={stationCoords.YL23.y} stroke={getLineColor('MRT_YELLOW')} strokeWidth="5" strokeLinecap="round" className="map-line" />}

            {/* MRT Pink Active segments */}
            {isEdgeInRoute('PK01', 'PK14') && <line x1={stationCoords.PK01.x} y1={stationCoords.PK01.y} x2={stationCoords.PK14.x} y2={stationCoords.PK14.y} stroke={getLineColor('MRT_PINK')} strokeWidth="5" strokeLinecap="round" className="map-line" />}
            {isEdgeInRoute('PK14', 'PK16') && <line x1={stationCoords.PK14.x} y1={stationCoords.PK14.y} x2={stationCoords.PK16.x} y2={stationCoords.PK16.y} stroke={getLineColor('MRT_PINK')} strokeWidth="5" strokeLinecap="round" className="map-line" />}
            {isEdgeInRoute('PK16', 'PK30') && <line x1={stationCoords.PK16.x} y1={stationCoords.PK16.y} x2={stationCoords.PK30.x} y2={stationCoords.PK30.y} stroke={getLineColor('MRT_PINK')} strokeWidth="5" strokeLinecap="round" className="map-line" />}

            {/* ARL Active segments */}
            {isEdgeInRoute('A8', 'A6') && <line x1={stationCoords.A8.x} y1={stationCoords.A8.y} x2={stationCoords.A6.x} y2={stationCoords.A6.y} stroke={getLineColor('ARL')} strokeWidth="5" strokeLinecap="round" className="map-line" />}
            {isEdgeInRoute('A6', 'A1') && <line x1={stationCoords.A6.x} y1={stationCoords.A6.y} x2={stationCoords.A1.x} y2={stationCoords.A1.y} stroke={getLineColor('ARL')} strokeWidth="5" strokeLinecap="round" className="map-line" />}

            {/* SRT Red Active segments */}
            {isEdgeInRoute('RN10', 'RN06') && <line x1={stationCoords.RN10.x} y1={stationCoords.RN10.y} x2={stationCoords.RN06.x} y2={stationCoords.RN06.y} stroke={getLineColor('SRT_RED')} strokeWidth="5" strokeLinecap="round" className="map-line" />}
            {isEdgeInRoute('RN06', 'RW01') && <line x1={stationCoords.RN06.x} y1={stationCoords.RN06.y} x2={stationCoords.RW01.x} y2={stationCoords.RW01.y} stroke={getLineColor('SRT_RED')} strokeWidth="5" strokeLinecap="round" className="map-line" />}
            {isEdgeInRoute('RW01', 'RW06') && <line x1={stationCoords.RW01.x} y1={stationCoords.RW01.y} x2={stationCoords.RW06.x} y2={stationCoords.RW06.y} stroke={getLineColor('SRT_RED')} strokeWidth="5" strokeLinecap="round" className="map-line" />}

            {/* Interchange active lines (pulsing orange/yellow dashes) */}
            {isEdgeInRoute('N8', 'BL13') && <line x1={stationCoords.N8.x} y1={stationCoords.N8.y} x2={stationCoords.BL13.x} y2={stationCoords.BL13.y} stroke="#f59e0b" strokeWidth="3.5" strokeDasharray="4 4" />}
            {isEdgeInRoute('E4', 'BL22') && <line x1={stationCoords.E4.x} y1={stationCoords.E4.y} x2={stationCoords.BL22.x} y2={stationCoords.BL22.y} stroke="#f59e0b" strokeWidth="3.5" strokeDasharray="4 4" />}
            {isEdgeInRoute('S2', 'BL26') && <line x1={stationCoords.S2.x} y1={stationCoords.S2.y} x2={stationCoords.BL26.x} y2={stationCoords.BL26.y} stroke="#f59e0b" strokeWidth="3.5" strokeDasharray="4 4" />}
            {isEdgeInRoute('N3', 'A8') && <line x1={stationCoords.N3.x} y1={stationCoords.N3.y} x2={stationCoords.A8.x} y2={stationCoords.A8.y} stroke="#f59e0b" strokeWidth="3.5" strokeDasharray="4 4" />}
            {isEdgeInRoute('RW01', 'BL11') && <line x1={stationCoords.RW01.x} y1={stationCoords.RW01.y} x2={stationCoords.BL11.x} y2={stationCoords.BL11.y} stroke="#f59e0b" strokeWidth="3.5" strokeDasharray="4 4" />}
            {isEdgeInRoute('A6', 'BL21') && <line x1={stationCoords.A6.x} y1={stationCoords.A6.y} x2={stationCoords.BL21.x} y2={stationCoords.BL21.y} stroke="#f59e0b" strokeWidth="3.5" strokeDasharray="4 4" />}
            {isEdgeInRoute('S12', 'BL34') && <line x1={stationCoords.S12.x} y1={stationCoords.S12.y} x2={stationCoords.BL34.x} y2={stationCoords.BL34.y} stroke="#f59e0b" strokeWidth="3.5" strokeDasharray="4 4" />}
            {isEdgeInRoute('YL23', 'E15') && <line x1={stationCoords.YL23.x} y1={stationCoords.YL23.y} x2={stationCoords.E15.x} y2={stationCoords.E15.y} stroke="#f59e0b" strokeWidth="3.5" strokeDasharray="4 4" />}
            {isEdgeInRoute('YL01', 'BL15') && <line x1={stationCoords.YL01.x} y1={stationCoords.YL01.y} x2={stationCoords.BL15.x} y2={stationCoords.BL15.y} stroke="#f59e0b" strokeWidth="3.5" strokeDasharray="4 4" />}
            {isEdgeInRoute('PK01', 'PP11') && <line x1={stationCoords.PK01.x} y1={stationCoords.PK01.y} x2={stationCoords.PP11.x} y2={stationCoords.PP11.y} stroke="#f59e0b" strokeWidth="3.5" strokeDasharray="4 4" />}
            {isEdgeInRoute('PK14', 'RN06') && <line x1={stationCoords.PK14.x} y1={stationCoords.PK14.y} x2={stationCoords.RN06.x} y2={stationCoords.RN06.y} stroke="#f59e0b" strokeWidth="3.5" strokeDasharray="4 4" />}
            {isEdgeInRoute('PK16', 'N17') && <line x1={stationCoords.PK16.x} y1={stationCoords.PK16.y} x2={stationCoords.N17.x} y2={stationCoords.N17.y} stroke="#f59e0b" strokeWidth="3.5" strokeDasharray="4 4" />}
            
            {/* Cross-platforms */}
            {isEdgeInRoute('CEN_S', 'CEN_L') && <line x1={stationCoords.CEN_S.x} y1={stationCoords.CEN_S.y} x2={stationCoords.CEN_L.x} y2={stationCoords.CEN_L.y} stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="2 2" />}
            {isEdgeInRoute('BL10', 'PP16') && <line x1={stationCoords.BL10.x} y1={stationCoords.BL10.y} x2={stationCoords.PP16.x} y2={stationCoords.PP16.y} stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="2 2" />}
          </>
        )}

        {/* --- STAGE 3: Station Circles & Hover Details --- */}
        {stations.map((st) => {
          const coords = stationCoords[st.id];
          if (!coords) return null;

          const isStart = startStation?.id === st.id;
          const isEnd = endStation?.id === st.id;
          const inRoute = isStationInRoute(st.id);
          const strokeColor = getLineColor(st.line);

          return (
            <g key={`map-node-${st.id}`} className="cursor-pointer" onClick={() => onSelectStation(st)}>
              {/* Ripple Glow */}
              {(isStart || isEnd) && (
                <circle
                  cx={coords.x}
                  cy={coords.y}
                  r="14" fill="none"
                  stroke={isStart ? '#159E40' : '#003399'}
                  strokeWidth="2"
                  className="animate-ping opacity-35"
                  style={{ animationDuration: '2s' }}
                />
              )}

              {/* Station Circle Body */}
              <circle
                cx={coords.x}
                cy={coords.y}
                r={isStart || isEnd ? '7.5' : inRoute ? '6' : '4'}
                fill={isStart || isEnd ? '#ffffff' : inRoute ? strokeColor : '#ffffff'}
                stroke={isStart || isEnd ? (isStart ? '#159E40' : '#003399') : strokeColor}
                strokeWidth={isStart || isEnd ? '3.5' : '2.5'}
                className="map-station dark:fill-black"
              />

              {/* Station English Label */}
              <text
                x={coords.x}
                y={coords.y - 9}
                textAnchor="middle"
                className={`text-[8.5px] font-bold tracking-tight select-none pointer-events-none fill-black/75 dark:fill-white/85 ${
                  isStart || isEnd ? 'opacity-100 font-extrabold text-[9px]' : inRoute ? 'opacity-95' : 'opacity-30'
                }`}
              >
                {st.nameEN}
              </text>

              {/* Station Thai Label */}
              <text
                x={coords.x}
                y={coords.y + 17}
                textAnchor="middle"
                className={`text-[8px] font-semibold select-none pointer-events-none fill-black/55 dark:fill-white/65 ${
                  isStart || isEnd ? 'opacity-100 font-bold' : inRoute ? 'opacity-95' : 'opacity-25'
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

import React from 'react';
import type { Station, RouteResult } from '../utils/pathfinder';
import transitData from '../data/transitGraph.json';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

interface MapProps {
 stations: Station[];
 startStation: Station | null;
 endStation: Station | null;
 onSelectStation: (station: Station) => void;
 calculatedRoute: RouteResult | null;
}

// Coordinate layout of all nodes inside SVG viewBox="0 0 1000 580"
export const stationCoords: Record<string, { x: number; y: number }> = {
 "N24": {
 "x": 450,
 "y": 30
 },
 "N23": {
 "x": 450,
 "y": 38.6
 },
 "N22": {
 "x": 450,
 "y": 47.1
 },
 "N21": {
 "x": 450,
 "y": 55.7
 },
 "N20": {
 "x": 450,
 "y": 64.3
 },
 "N19": {
 "x": 450,
 "y": 72.9
 },
 "N18": {
 "x": 450,
 "y": 81.4
 },
 "N17": {
 "x": 450,
 "y": 90
 },
 "N16": {
 "x": 450,
 "y": 97.2
 },
 "N15": {
 "x": 450,
 "y": 104.4
 },
 "N14": {
 "x": 450,
 "y": 111.7
 },
 "N13": {
 "x": 450,
 "y": 118.9
 },
 "N12": {
 "x": 450,
 "y": 126.1
 },
 "N11": {
 "x": 450,
 "y": 133.3
 },
 "N10": {
 "x": 450,
 "y": 140.6
 },
 "N9": {
 "x": 450,
 "y": 147.8
 },
 "N8": {
 "x": 450,
 "y": 155
 },
 "N7": {
 "x": 450,
 "y": 178.8
 },
 "N5": {
 "x": 450,
 "y": 202.5
 },
 "N4": {
 "x": 450,
 "y": 226.3
 },
 "N3": {
 "x": 450,
 "y": 250
 },
 "N2": {
 "x": 450,
 "y": 273.3
 },
 "N1": {
 "x": 450,
 "y": 296.7
 },
 "CEN_S": {
 "x": 450,
 "y": 320
 },
 "E1": {
 "x": 487.5,
 "y": 320
 },
 "E2": {
 "x": 525,
 "y": 320
 },
 "E3": {
 "x": 562.5,
 "y": 320
 },
 "E4": {
 "x": 600,
 "y": 320
 },
 "E5": {
 "x": 624,
 "y": 320
 },
 "E6": {
 "x": 648,
 "y": 320
 },
 "E7": {
 "x": 672,
 "y": 320
 },
 "E8": {
 "x": 696,
 "y": 320
 },
 "E9": {
 "x": 720,
 "y": 320
 },
 "E10": {
 "x": 740,
 "y": 320
 },
 "E11": {
 "x": 760,
 "y": 320
 },
 "E12": {
 "x": 780,
 "y": 320
 },
 "E13": {
 "x": 800,
 "y": 320
 },
 "E14": {
 "x": 820,
 "y": 320
 },
 "E15": {
 "x": 840,
 "y": 320
 },
 "E16": {
 "x": 853.8,
 "y": 320
 },
 "E17": {
 "x": 867.5,
 "y": 320
 },
 "E18": {
 "x": 881.3,
 "y": 320
 },
 "E19": {
 "x": 895,
 "y": 320
 },
 "E20": {
 "x": 908.8,
 "y": 320
 },
 "E21": {
 "x": 922.5,
 "y": 320
 },
 "E22": {
 "x": 936.3,
 "y": 320
 },
 "E23": {
 "x": 950,
 "y": 320
 },
 "W1": {
 "x": 380,
 "y": 340
 },
 "CEN_L": {
 "x": 450,
 "y": 340
 },
 "S1": {
 "x": 450,
 "y": 375
 },
 "S2": {
 "x": 450,
 "y": 410
 },
 "S3": {
 "x": 432,
 "y": 424
 },
 "S4": {
 "x": 414,
 "y": 438
 },
 "S5": {
 "x": 396,
 "y": 452
 },
 "S6": {
 "x": 378,
 "y": 466
 },
 "S7": {
 "x": 360,
 "y": 480
 },
 "S8": {
 "x": 340,
 "y": 480
 },
 "S9": {
 "x": 320,
 "y": 480
 },
 "S10": {
 "x": 300,
 "y": 480
 },
 "S11": {
 "x": 280,
 "y": 480
 },
 "S12": {
 "x": 260,
 "y": 480
 },
 "BL01": {
 "x": 260,
 "y": 390
 },
 "BL02": {
 "x": 260,
 "y": 363.9
 },
 "BL03": {
 "x": 260,
 "y": 337.8
 },
 "BL04": {
 "x": 260,
 "y": 311.7
 },
 "BL05": {
 "x": 260,
 "y": 285.6
 },
 "BL06": {
 "x": 260,
 "y": 259.4
 },
 "BL07": {
 "x": 260,
 "y": 233.3
 },
 "BL08": {
 "x": 260,
 "y": 207.2
 },
 "BL09": {
 "x": 260,
 "y": 181.1
 },
 "BL10": {
 "x": 260,
 "y": 155
 },
 "BL11": {
 "x": 340,
 "y": 155
 },
 "BL12": {
 "x": 420,
 "y": 155
 },
 "BL13": {
 "x": 500,
 "y": 155
 },
 "BL14": {
 "x": 550,
 "y": 155
 },
 "BL15": {
 "x": 600,
 "y": 155
 },
 "BL16": {
 "x": 600,
 "y": 168.3
 },
 "BL17": {
 "x": 600,
 "y": 181.7
 },
 "BL18": {
 "x": 600,
 "y": 195
 },
 "BL19": {
 "x": 600,
 "y": 208.3
 },
 "BL20": {
 "x": 600,
 "y": 221.7
 },
 "BL21": {
 "x": 600,
 "y": 235
 },
 "BL22": {
 "x": 600,
 "y": 355
 },
 "BL23": {
 "x": 575,
 "y": 368.8
 },
 "BL24": {
 "x": 550,
 "y": 382.5
 },
 "BL25": {
 "x": 525,
 "y": 396.3
 },
 "BL26": {
 "x": 500,
 "y": 410
 },
 "BL27": {
 "x": 470,
 "y": 417.8
 },
 "BL28": {
 "x": 440,
 "y": 425.6
 },
 "BL29": {
 "x": 410,
 "y": 433.3
 },
 "BL30": {
 "x": 380,
 "y": 441.1
 },
 "BL31": {
 "x": 350,
 "y": 448.9
 },
 "BL32": {
 "x": 320,
 "y": 456.7
 },
 "BL01_2": {
 "x": 290,
 "y": 464.4
 },
 "BL33": {
 "x": 260,
 "y": 472.2
 },
 "BL34": {
 "x": 230,
 "y": 480
 },
 "BL35": {
 "x": 205,
 "y": 480
 },
 "BL36": {
 "x": 180,
 "y": 480
 },
 "BL37": {
 "x": 155,
 "y": 480
 },
 "BL38": {
 "x": 130,
 "y": 480
 },
 "PP01": {
 "x": 50,
 "y": 155
 },
 "PP02": {
 "x": 60,
 "y": 155
 },
 "PP03": {
 "x": 70,
 "y": 155
 },
 "PP04": {
 "x": 80,
 "y": 155
 },
 "PP05": {
 "x": 90,
 "y": 155
 },
 "PP06": {
 "x": 100,
 "y": 155
 },
 "PP07": {
 "x": 110,
 "y": 155
 },
 "PP08": {
 "x": 120,
 "y": 155
 },
 "PP09": {
 "x": 130,
 "y": 155
 },
 "PP10": {
 "x": 140,
 "y": 155
 },
 "PP11": {
 "x": 150,
 "y": 155
 },
 "PP12": {
 "x": 166,
 "y": 155
 },
 "PP13": {
 "x": 182,
 "y": 155
 },
 "PP14": {
 "x": 198,
 "y": 155
 },
 "PP15": {
 "x": 214,
 "y": 155
 },
 "PP16": {
 "x": 230,
 "y": 155
 },
 "YL01": {
 "x": 650,
 "y": 155
 },
 "YL02": {
 "x": 658.6,
 "y": 160.5
 },
 "YL03": {
 "x": 667.3,
 "y": 165.9
 },
 "YL04": {
 "x": 675.9,
 "y": 171.4
 },
 "YL05": {
 "x": 684.5,
 "y": 176.8
 },
 "YL06": {
 "x": 693.2,
 "y": 182.3
 },
 "YL07": {
 "x": 701.8,
 "y": 187.7
 },
 "YL08": {
 "x": 710.5,
 "y": 193.2
 },
 "YL09": {
 "x": 719.1,
 "y": 198.6
 },
 "YL10": {
 "x": 727.7,
 "y": 204.1
 },
 "YL11": {
 "x": 736.4,
 "y": 209.5
 },
 "YL12": {
 "x": 745,
 "y": 215
 },
 "YL13": {
 "x": 753.6,
 "y": 220.5
 },
 "YL14": {
 "x": 762.3,
 "y": 225.9
 },
 "YL15": {
 "x": 770.9,
 "y": 231.4
 },
 "YL16": {
 "x": 779.5,
 "y": 236.8
 },
 "YL17": {
 "x": 788.2,
 "y": 242.3
 },
 "YL18": {
 "x": 796.8,
 "y": 247.7
 },
 "YL19": {
 "x": 805.5,
 "y": 253.2
 },
 "YL20": {
 "x": 814.1,
 "y": 258.6
 },
 "YL21": {
 "x": 822.7,
 "y": 264.1
 },
 "YL22": {
 "x": 831.4,
 "y": 269.5
 },
 "YL23": {
 "x": 840,
 "y": 275
 },
 "PK01": {
 "x": 150,
 "y": 90
 },
 "PK02": {
 "x": 164.6,
 "y": 90
 },
 "PK03": {
 "x": 179.2,
 "y": 90
 },
 "PK04": {
 "x": 193.8,
 "y": 90
 },
 "PK05": {
 "x": 208.5,
 "y": 90
 },
 "PK06": {
 "x": 223.1,
 "y": 90
 },
 "PK07": {
 "x": 237.7,
 "y": 90
 },
 "PK08": {
 "x": 252.3,
 "y": 90
 },
 "PK09": {
 "x": 266.9,
 "y": 90
 },
 "PK10": {
 "x": 281.5,
 "y": 90
 },
 "PK11": {
 "x": 296.2,
 "y": 90
 },
 "PK12": {
 "x": 310.8,
 "y": 90
 },
 "PK13": {
 "x": 325.4,
 "y": 90
 },
 "PK14": {
 "x": 340,
 "y": 90
 },
 "PK15": {
 "x": 420,
 "y": 90
 },
 "PK16": {
 "x": 500,
 "y": 90
 },
 "PK17": {
 "x": 520,
 "y": 90
 },
 "PK18": {
 "x": 540,
 "y": 90
 },
 "PK19": {
 "x": 560,
 "y": 90
 },
 "PK20": {
 "x": 580,
 "y": 90
 },
 "PK21": {
 "x": 600,
 "y": 90
 },
 "PK22": {
 "x": 620,
 "y": 90
 },
 "PK23": {
 "x": 640,
 "y": 90
 },
 "PK24": {
 "x": 660,
 "y": 90
 },
 "PK25": {
 "x": 680,
 "y": 90
 },
 "PK26": {
 "x": 700,
 "y": 90
 },
 "PK27": {
 "x": 720,
 "y": 90
 },
 "PK28": {
 "x": 740,
 "y": 90
 },
 "PK29": {
 "x": 760,
 "y": 90
 },
 "PK30": {
 "x": 780,
 "y": 90
 },
 "A8": {
 "x": 450,
 "y": 205
 },
 "A7": {
 "x": 505,
 "y": 205
 },
 "A6": {
 "x": 560,
 "y": 205
 },
 "A5": {
 "x": 624,
 "y": 205
 },
 "A4": {
 "x": 688,
 "y": 205
 },
 "A3": {
 "x": 752,
 "y": 205
 },
 "A2": {
 "x": 816,
 "y": 205
 },
 "A1": {
 "x": 880,
 "y": 205
 },
 "RN10": {
 "x": 340,
 "y": 30
 },
 "RN09": {
 "x": 340,
 "y": 51.3
 },
 "RN08": {
 "x": 340,
 "y": 72.5
 },
 "RN07": {
 "x": 340,
 "y": 93.8
 },
 "RN06": {
 "x": 340,
 "y": 115
 },
 "RN05": {
 "x": 334,
 "y": 123
 },
 "RN04": {
 "x": 328,
 "y": 131
 },
 "RN03": {
 "x": 322,
 "y": 139
 },
 "RN02": {
 "x": 316,
 "y": 147
 },
 "RW01": {
 "x": 310,
 "y": 155
 },
 "RW02": {
 "x": 265,
 "y": 175
 },
 "RW03": {
 "x": 220,
 "y": 195
 },
 "RW05": {
 "x": 175,
 "y": 215
 },
 "RW06": {
 "x": 130,
 "y": 235
 }
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

 <TransformWrapper
    initialScale={1}
    minScale={0.5}
    maxScale={6}
    wheel={{ step: 0.1 }}
    doubleClick={{ disabled: true }}
  >
    {({ state }) => {
      const isZoomedIn = state.scale >= 2.2;
      return (
        <TransformComponent wrapperClass="w-full h-full !flex items-center justify-center cursor-grab active:cursor-grabbing">
          <svg
            viewBox="0 0 1020 540"
            className="w-full max-w-[960px] aspect-[1020/540] drop-shadow-[0_20px_50px_rgba(0,0,0,0.04)] transition-colors duration-500"
          >
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-black/[0.015]" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" rx="20" />

 {/* --- STAGE 1: Standard Rail Tracks (Static) --- */}
 {transitData.edges.map((edge, i) => {
 const c1 = stationCoords[edge.from];
 const c2 = stationCoords[edge.to];
 if (!c1 || !c2) return null;

 const fromSt = (transitData.stations as any)[edge.from];
 const toSt = (transitData.stations as any)[edge.to];
 const isInterchange = edge.type === 'interchange' || edge.type === 'cross-platform' || (fromSt && toSt && fromSt.line !== toSt.line);
 const lineName = (fromSt && toSt && fromSt.line === toSt.line) ? fromSt.line : 'INTERCHANGE';

 if (isInterchange) {
 return (
 <line
 key={`edge-${i}`}
 x1={c1.x} y1={c1.y} x2={c2.x} y2={c2.y}
 stroke="#94a3b8"
 strokeWidth={edge.type === 'cross-platform' ? "2" : "3.5"}
 strokeDasharray={edge.type === 'cross-platform' ? "2 2" : "3 3"}
 />
 );
 }

 return (
 <line
 key={`edge-${i}`}
 x1={c1.x} y1={c1.y} x2={c2.x} y2={c2.y}
 stroke={getLineColor(lineName)}
 strokeWidth="6"
 strokeLinecap="round"
 className="opacity-30"
 />
 );
 })}

 {/* --- STAGE 2: Route Overlay Highlighting (Pulsing flow paths) --- */}
 {calculatedRoute && transitData.edges.map((edge, i) => {
 const c1 = stationCoords[edge.from];
 const c2 = stationCoords[edge.to];
 if (!c1 || !c2) return null;

 if (isEdgeInRoute(edge.from, edge.to)) {
 const fromSt = (transitData.stations as any)[edge.from];
 const toSt = (transitData.stations as any)[edge.to];
 const isInterchange = edge.type === 'interchange' || edge.type === 'cross-platform' || (fromSt && toSt && fromSt.line !== toSt.line);
 const lineName = (fromSt && toSt && fromSt.line === toSt.line) ? fromSt.line : 'INTERCHANGE';

 if (isInterchange) {
 return (
 <line
 key={`active-edge-${i}`}
 x1={c1.x} y1={c1.y} x2={c2.x} y2={c2.y}
 stroke="#f59e0b"
 strokeWidth={edge.type === 'cross-platform' ? "3.5" : "5"}
 strokeDasharray={edge.type === 'cross-platform' ? "2 2" : "4 4"}
 />
 );
 }

 return (
 <line
 key={`active-edge-${i}`}
 x1={c1.x} y1={c1.y} x2={c2.x} y2={c2.y}
 stroke={getLineColor(lineName)}
 strokeWidth="7.5"
 strokeLinecap="round"
 className="map-line"
 />
 );
 }
 return null;
 })}

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
 r="10" fill="none"
 stroke={isStart ? '#159E40' : '#003399'}
 strokeWidth="2"
 className="animate-ping opacity-40"
 style={{ animationDuration: '2s' }}
 />
 )}

 {/* Station Circle Body */}
 <circle
 cx={coords.x}
 cy={coords.y}
 r={isStart || isEnd ? '6.5' : inRoute ? '5.5' : '4'}
 fill={isStart || isEnd ? '#ffffff' : inRoute ? strokeColor : '#ffffff'}
 stroke={isStart || isEnd ? (isStart ? '#159E40' : '#003399') : strokeColor}
 strokeWidth={isStart || isEnd ? '2.5' : '1.5'}
 className="map-station"
 />

 {/* Station Code inside the dot */}
 <text
 x={coords.x}
 y={coords.y + 1}
 textAnchor="middle"
 className={`text-[2.8px] font-extrabold select-none pointer-events-none transition-opacity ${
 isStart || isEnd ? (isStart ? 'fill-[#159E40]' : 'fill-[#003399]') : inRoute ? 'fill-white' : 'fill-black/80'
 }`}
 >
 {st.id.split('_')[0]}
 </text>

 {/* Station English Label (Only show when zoomed in) */}
 <text
 x={coords.x}
 y={coords.y - 7}
 textAnchor="middle"
 className={`text-[5.5px] font-bold tracking-tight select-none pointer-events-none fill-black/90 transition-opacity duration-300 ${
 isZoomedIn || isStart || isEnd ? 'opacity-100' : 'opacity-0'
 } ${isStart || isEnd ? 'font-extrabold text-[6.5px]' : ''}`}
 style={{ textShadow: '0 0 3px white, 0 0 3px white, 0 0 3px white' }}
 >
 {st.nameEN}
 </text>

 {/* Station Thai Label (Only show when zoomed in) */}
 <text
 x={coords.x}
 y={coords.y + 9}
 textAnchor="middle"
 className={`text-[5px] font-semibold select-none pointer-events-none fill-black/75 transition-opacity duration-300 ${
 isZoomedIn || isStart || isEnd ? 'opacity-100' : 'opacity-0'
 } ${isStart || isEnd ? 'font-bold text-[6px]' : ''}`}
 style={{ textShadow: '0 0 3px white, 0 0 3px white, 0 0 3px white' }}
 >
 {st.nameTH}
 </text>
 </g>
 );
 })}
 </svg>
        </TransformComponent>
      );
    }}
  </TransformWrapper>
 </div>
 );
};

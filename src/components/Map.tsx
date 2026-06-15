import React, { useState } from 'react';
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
    "x": 500,
    "y": -80
  },
  "N23": {
    "x": 500,
    "y": -60
  },
  "N22": {
    "x": 500,
    "y": -40
  },
  "N21": {
    "x": 500,
    "y": -20
  },
  "N20": {
    "x": 500,
    "y": 0
  },
  "N19": {
    "x": 500,
    "y": 20
  },
  "N18": {
    "x": 500,
    "y": 40
  },
  "N17": {
    "x": 500,
    "y": 60
  },
  "N16": {
    "x": 500,
    "y": 80
  },
  "N15": {
    "x": 500,
    "y": 100
  },
  "N14": {
    "x": 500,
    "y": 120
  },
  "N13": {
    "x": 500,
    "y": 140
  },
  "N12": {
    "x": 500,
    "y": 160
  },
  "N11": {
    "x": 500,
    "y": 180
  },
  "N10": {
    "x": 500,
    "y": 200
  },
  "N9": {
    "x": 500,
    "y": 220
  },
  "N8": {
    "x": 500,
    "y": 240
  },
  "N7": {
    "x": 500,
    "y": 265
  },
  "N5": {
    "x": 500,
    "y": 290
  },
  "N4": {
    "x": 500,
    "y": 315
  },
  "N3": {
    "x": 500,
    "y": 340
  },
  "N2": {
    "x": 500,
    "y": 360
  },
  "N1": {
    "x": 500,
    "y": 380
  },
  "CEN_S": {
    "x": 500,
    "y": 400
  },
  "E1": {
    "x": 520,
    "y": 400
  },
  "E2": {
    "x": 540,
    "y": 400
  },
  "E3": {
    "x": 560,
    "y": 400
  },
  "E4": {
    "x": 580,
    "y": 400
  },
  "E5": {
    "x": 600,
    "y": 400
  },
  "E6": {
    "x": 620,
    "y": 400
  },
  "E7": {
    "x": 640,
    "y": 400
  },
  "E8": {
    "x": 660,
    "y": 400
  },
  "E9": {
    "x": 680,
    "y": 400
  },
  "E10": {
    "x": 700,
    "y": 400
  },
  "E11": {
    "x": 720,
    "y": 400
  },
  "E12": {
    "x": 740,
    "y": 400
  },
  "E13": {
    "x": 760,
    "y": 400
  },
  "E14": {
    "x": 780,
    "y": 400
  },
  "E15": {
    "x": 800,
    "y": 400
  },
  "E16": {
    "x": 820,
    "y": 400
  },
  "E17": {
    "x": 840,
    "y": 400
  },
  "E18": {
    "x": 860,
    "y": 400
  },
  "E19": {
    "x": 880,
    "y": 400
  },
  "E20": {
    "x": 900,
    "y": 400
  },
  "E21": {
    "x": 920,
    "y": 400
  },
  "E22": {
    "x": 940,
    "y": 400
  },
  "E23": {
    "x": 960,
    "y": 400
  },
  "W1": {
    "x": 480,
    "y": 400
  },
  "CEN_L": {
    "x": 500,
    "y": 400
  },
  "S1": {
    "x": 500,
    "y": 420
  },
  "S2": {
    "x": 500,
    "y": 440
  },
  "S3": {
    "x": 500,
    "y": 460
  },
  "S4": {
    "x": 500,
    "y": 480
  },
  "S5": {
    "x": 500,
    "y": 500
  },
  "S6": {
    "x": 500,
    "y": 520
  },
  "S7": {
    "x": 500,
    "y": 540
  },
  "S8": {
    "x": 480,
    "y": 540
  },
  "S9": {
    "x": 460,
    "y": 540
  },
  "S10": {
    "x": 440,
    "y": 540
  },
  "S11": {
    "x": 420,
    "y": 540
  },
  "S12": {
    "x": 400,
    "y": 540
  },
  "BL01": {
    "x": 300,
    "y": 440
  },
  "BL02": {
    "x": 315.6,
    "y": 417.8
  },
  "BL03": {
    "x": 331.1,
    "y": 395.6
  },
  "BL04": {
    "x": 346.7,
    "y": 373.3
  },
  "BL05": {
    "x": 362.2,
    "y": 351.1
  },
  "BL06": {
    "x": 377.8,
    "y": 328.9
  },
  "BL07": {
    "x": 393.3,
    "y": 306.7
  },
  "BL08": {
    "x": 408.9,
    "y": 284.4
  },
  "BL09": {
    "x": 424.4,
    "y": 262.2
  },
  "BL10": {
    "x": 440,
    "y": 240
  },
  "BL11": {
    "x": 460,
    "y": 240
  },
  "BL12": {
    "x": 480,
    "y": 240
  },
  "BL13": {
    "x": 500,
    "y": 240
  },
  "BL14": {
    "x": 520,
    "y": 240
  },
  "BL15": {
    "x": 540,
    "y": 240
  },
  "BL16": {
    "x": 546.7,
    "y": 263.3
  },
  "BL17": {
    "x": 553.3,
    "y": 286.7
  },
  "BL18": {
    "x": 560,
    "y": 310
  },
  "BL19": {
    "x": 566.7,
    "y": 333.3
  },
  "BL20": {
    "x": 573.3,
    "y": 356.7
  },
  "BL21": {
    "x": 580,
    "y": 380
  },
  "BL22": {
    "x": 580,
    "y": 400
  },
  "BL23": {
    "x": 560,
    "y": 410
  },
  "BL24": {
    "x": 540,
    "y": 420
  },
  "BL25": {
    "x": 520,
    "y": 430
  },
  "BL26": {
    "x": 500,
    "y": 440
  },
  "BL27": {
    "x": 488.9,
    "y": 451.1
  },
  "BL28": {
    "x": 477.8,
    "y": 462.2
  },
  "BL29": {
    "x": 466.7,
    "y": 473.3
  },
  "BL30": {
    "x": 455.6,
    "y": 484.4
  },
  "BL31": {
    "x": 444.4,
    "y": 495.6
  },
  "BL32": {
    "x": 433.3,
    "y": 506.7
  },
  "BL01_2": {
    "x": 422.2,
    "y": 517.8
  },
  "BL33": {
    "x": 411.1,
    "y": 528.9
  },
  "BL34": {
    "x": 400,
    "y": 540
  },
  "BL35": {
    "x": 380,
    "y": 540
  },
  "BL36": {
    "x": 360,
    "y": 540
  },
  "BL37": {
    "x": 340,
    "y": 540
  },
  "BL38": {
    "x": 320,
    "y": 540
  },
  "PP01": {
    "x": 140,
    "y": 240
  },
  "PP02": {
    "x": 160,
    "y": 240
  },
  "PP03": {
    "x": 180,
    "y": 240
  },
  "PP04": {
    "x": 200,
    "y": 240
  },
  "PP05": {
    "x": 220,
    "y": 240
  },
  "PP06": {
    "x": 240,
    "y": 240
  },
  "PP07": {
    "x": 260,
    "y": 240
  },
  "PP08": {
    "x": 280,
    "y": 240
  },
  "PP09": {
    "x": 300,
    "y": 240
  },
  "PP10": {
    "x": 320,
    "y": 240
  },
  "PP11": {
    "x": 340,
    "y": 240
  },
  "PP12": {
    "x": 360,
    "y": 240
  },
  "PP13": {
    "x": 380,
    "y": 240
  },
  "PP14": {
    "x": 400,
    "y": 240
  },
  "PP15": {
    "x": 420,
    "y": 240
  },
  "PP16": {
    "x": 440,
    "y": 240
  },
  "YL01": {
    "x": 540,
    "y": 240
  },
  "YL02": {
    "x": 551.8,
    "y": 247.3
  },
  "YL03": {
    "x": 563.6,
    "y": 254.5
  },
  "YL04": {
    "x": 575.5,
    "y": 261.8
  },
  "YL05": {
    "x": 587.3,
    "y": 269.1
  },
  "YL06": {
    "x": 599.1,
    "y": 276.4
  },
  "YL07": {
    "x": 610.9,
    "y": 283.6
  },
  "YL08": {
    "x": 622.7,
    "y": 290.9
  },
  "YL09": {
    "x": 634.5,
    "y": 298.2
  },
  "YL10": {
    "x": 646.4,
    "y": 305.5
  },
  "YL11": {
    "x": 658.2,
    "y": 312.7
  },
  "YL12": {
    "x": 670,
    "y": 320
  },
  "YL13": {
    "x": 681.8,
    "y": 327.3
  },
  "YL14": {
    "x": 693.6,
    "y": 334.5
  },
  "YL15": {
    "x": 705.5,
    "y": 341.8
  },
  "YL16": {
    "x": 717.3,
    "y": 349.1
  },
  "YL17": {
    "x": 729.1,
    "y": 356.4
  },
  "YL18": {
    "x": 740.9,
    "y": 363.6
  },
  "YL19": {
    "x": 752.7,
    "y": 370.9
  },
  "YL20": {
    "x": 764.5,
    "y": 378.2
  },
  "YL21": {
    "x": 776.4,
    "y": 385.5
  },
  "YL22": {
    "x": 788.2,
    "y": 392.7
  },
  "YL23": {
    "x": 800,
    "y": 400
  },
  "PK01": {
    "x": 340,
    "y": 240
  },
  "PK02": {
    "x": 349.2,
    "y": 226.2
  },
  "PK03": {
    "x": 358.5,
    "y": 212.3
  },
  "PK04": {
    "x": 367.7,
    "y": 198.5
  },
  "PK05": {
    "x": 376.9,
    "y": 184.6
  },
  "PK06": {
    "x": 386.2,
    "y": 170.8
  },
  "PK07": {
    "x": 395.4,
    "y": 156.9
  },
  "PK08": {
    "x": 404.6,
    "y": 143.1
  },
  "PK09": {
    "x": 413.8,
    "y": 129.2
  },
  "PK10": {
    "x": 423.1,
    "y": 115.4
  },
  "PK11": {
    "x": 432.3,
    "y": 101.5
  },
  "PK12": {
    "x": 441.5,
    "y": 87.7
  },
  "PK13": {
    "x": 450.8,
    "y": 73.8
  },
  "PK14": {
    "x": 460,
    "y": 60
  },
  "PK15": {
    "x": 480,
    "y": 60
  },
  "PK16": {
    "x": 500,
    "y": 60
  },
  "PK17": {
    "x": 520,
    "y": 60
  },
  "PK18": {
    "x": 540,
    "y": 60
  },
  "PK19": {
    "x": 560,
    "y": 60
  },
  "PK20": {
    "x": 580,
    "y": 60
  },
  "PK21": {
    "x": 600,
    "y": 60
  },
  "PK22": {
    "x": 620,
    "y": 60
  },
  "PK23": {
    "x": 640,
    "y": 60
  },
  "PK24": {
    "x": 660,
    "y": 60
  },
  "PK25": {
    "x": 680,
    "y": 60
  },
  "PK26": {
    "x": 700,
    "y": 60
  },
  "PK27": {
    "x": 720,
    "y": 60
  },
  "PK28": {
    "x": 740,
    "y": 60
  },
  "PK29": {
    "x": 760,
    "y": 60
  },
  "PK30": {
    "x": 780,
    "y": 60
  },
  "A8": {
    "x": 500,
    "y": 340
  },
  "A7": {
    "x": 540,
    "y": 360
  },
  "A6": {
    "x": 580,
    "y": 380
  },
  "A5": {
    "x": 600,
    "y": 380
  },
  "A4": {
    "x": 620,
    "y": 380
  },
  "A3": {
    "x": 640,
    "y": 380
  },
  "A2": {
    "x": 660,
    "y": 380
  },
  "A1": {
    "x": 680,
    "y": 380
  },
  "RN10": {
    "x": 460,
    "y": -20
  },
  "RN09": {
    "x": 460,
    "y": 0
  },
  "RN08": {
    "x": 460,
    "y": 20
  },
  "RN07": {
    "x": 460,
    "y": 40
  },
  "RN06": {
    "x": 460,
    "y": 60
  },
  "RN05": {
    "x": 460,
    "y": 96
  },
  "RN04": {
    "x": 460,
    "y": 132
  },
  "RN03": {
    "x": 460,
    "y": 168
  },
  "RN02": {
    "x": 460,
    "y": 204
  },
  "RW01": {
    "x": 460,
    "y": 240
  },
  "RW02": {
    "x": 435,
    "y": 265
  },
  "RW03": {
    "x": 410,
    "y": 290
  },
  "RW05": {
    "x": 385,
    "y": 315
  },
  "RW06": {
    "x": 360,
    "y": 340
  }
};

export const Map: React.FC<MapProps> = ({
 stations,
 startStation,
 endStation,
 onSelectStation,
 calculatedRoute,
}) => {
 const [scale, setScale] = useState(1);
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
    minScale={0.3}
    maxScale={8}
    wheel={{ step: 0.1 }}
    doubleClick={{ disabled: true }}
    onZoom={(ref) => setScale(ref.state.scale)}
    onInit={(ref) => setScale(ref.state.scale)}
    onPanning={(ref) => setScale(ref.state.scale)}
  >
    {() => {
      const isZoomedIn = scale >= 1.5;
      return (
        <TransformComponent wrapperClass="w-full h-full cursor-grab active:cursor-grabbing" contentClass="w-full h-full flex items-center justify-center">
          <svg
            viewBox="-100 -150 1200 800"
            className="w-full h-full min-w-[1400px] min-h-[740px] drop-shadow-[0_20px_50px_rgba(0,0,0,0.04)] transition-colors duration-500"
          >
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse" x="0" y="0">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-black/[0.015]" />
              </pattern>
            </defs>
            <rect x="-100" y="-150" width="1200" height="800" fill="url(#grid)" rx="20" />

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
 {stations.map((st, i) => {
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
 r="12" fill="none"
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
 r={isStart || isEnd ? '7.5' : inRoute ? '6.5' : '5'}
 fill={isStart || isEnd ? '#ffffff' : inRoute ? strokeColor : '#ffffff'}
 stroke={isStart || isEnd ? (isStart ? '#159E40' : '#003399') : strokeColor}
 strokeWidth={isStart || isEnd ? '3' : '2'}
 className="map-station"
 />

 {/* Station Code inside the dot */}
 <text
 x={coords.x}
 y={coords.y + 1.2}
 textAnchor="middle"
 className={`text-[3.5px] font-extrabold select-none pointer-events-none transition-opacity ${
 isStart || isEnd ? (isStart ? 'fill-[#159E40]' : 'fill-[#003399]') : inRoute ? 'fill-white' : 'fill-black/80'
 }`}
 >
 {st.id.split('_')[0]}
 </text>

 {/* Station English Label (Only show when zoomed in) */}
 {isZoomedIn && (
 <text
 x={coords.x}
 y={coords.y + (i % 2 === 0 ? -12 : 11)}
 textAnchor="middle"
 className={`text-[6.5px] font-bold tracking-tight select-none pointer-events-none fill-black/90 ${
 isStart || isEnd ? 'font-extrabold text-[7.5px]' : ''
 }`}
 style={{ textShadow: '0 0 4px white, 0 0 4px white, 0 0 4px white' }}
 >
 {st.nameEN}
 </text>
 )}

 {/* Station Thai Label (Only show when zoomed in) */}
 {isZoomedIn && (
 <text
 x={coords.x}
 y={coords.y + (i % 2 === 0 ? -7 : 16)}
 textAnchor="middle"
 className={`text-[5.5px] font-semibold select-none pointer-events-none fill-black/80 ${
 isStart || isEnd ? 'font-bold text-[6.5px]' : ''
 }`}
 style={{ textShadow: '0 0 4px white, 0 0 4px white, 0 0 4px white' }}
 >
 {st.nameTH}
 </text>
 )}
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

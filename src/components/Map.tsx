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
    "x": 600,
    "y": -120
  },
  "N23": {
    "x": 600,
    "y": -90
  },
  "N22": {
    "x": 600,
    "y": -60
  },
  "N21": {
    "x": 600,
    "y": -30
  },
  "N20": {
    "x": 600,
    "y": 0
  },
  "N19": {
    "x": 600,
    "y": 30
  },
  "N18": {
    "x": 600,
    "y": 60
  },
  "N17": {
    "x": 600,
    "y": 90
  },
  "N16": {
    "x": 600,
    "y": 120
  },
  "N15": {
    "x": 600,
    "y": 150
  },
  "N14": {
    "x": 600,
    "y": 180
  },
  "N13": {
    "x": 600,
    "y": 210
  },
  "N12": {
    "x": 600,
    "y": 240
  },
  "N11": {
    "x": 600,
    "y": 270
  },
  "N10": {
    "x": 600,
    "y": 300
  },
  "N9": {
    "x": 600,
    "y": 330
  },
  "N8": {
    "x": 600,
    "y": 360
  },
  "N7": {
    "x": 600,
    "y": 397.5
  },
  "N5": {
    "x": 600,
    "y": 435
  },
  "N4": {
    "x": 600,
    "y": 472.5
  },
  "N3": {
    "x": 600,
    "y": 510
  },
  "N2": {
    "x": 600,
    "y": 540
  },
  "N1": {
    "x": 600,
    "y": 570
  },
  "CEN_S": {
    "x": 600,
    "y": 600
  },
  "E1": {
    "x": 630,
    "y": 600
  },
  "E2": {
    "x": 660,
    "y": 600
  },
  "E3": {
    "x": 690,
    "y": 600
  },
  "E4": {
    "x": 720,
    "y": 600
  },
  "E5": {
    "x": 750,
    "y": 600
  },
  "E6": {
    "x": 780,
    "y": 600
  },
  "E7": {
    "x": 810,
    "y": 600
  },
  "E8": {
    "x": 840,
    "y": 600
  },
  "E9": {
    "x": 870,
    "y": 600
  },
  "E10": {
    "x": 890,
    "y": 620
  },
  "E11": {
    "x": 910,
    "y": 640
  },
  "E12": {
    "x": 930,
    "y": 660
  },
  "E13": {
    "x": 950,
    "y": 680
  },
  "E14": {
    "x": 970,
    "y": 700
  },
  "E15": {
    "x": 990,
    "y": 720
  },
  "E16": {
    "x": 990,
    "y": 750
  },
  "E17": {
    "x": 990,
    "y": 780
  },
  "E18": {
    "x": 990,
    "y": 810
  },
  "E19": {
    "x": 990,
    "y": 840
  },
  "E20": {
    "x": 990,
    "y": 870
  },
  "E21": {
    "x": 990,
    "y": 900
  },
  "E22": {
    "x": 990,
    "y": 930
  },
  "E23": {
    "x": 990,
    "y": 960
  },
  "W1": {
    "x": 570,
    "y": 600
  },
  "CEN_L": {
    "x": 600,
    "y": 600
  },
  "S1": {
    "x": 600,
    "y": 630
  },
  "S2": {
    "x": 600,
    "y": 660
  },
  "S3": {
    "x": 570,
    "y": 690
  },
  "S4": {
    "x": 540,
    "y": 720
  },
  "S5": {
    "x": 510,
    "y": 750
  },
  "S6": {
    "x": 480,
    "y": 780
  },
  "S7": {
    "x": 450,
    "y": 780
  },
  "S8": {
    "x": 420,
    "y": 780
  },
  "S9": {
    "x": 390,
    "y": 780
  },
  "S10": {
    "x": 360,
    "y": 780
  },
  "S11": {
    "x": 330,
    "y": 780
  },
  "S12": {
    "x": 300,
    "y": 780
  },
  "BL01": {
    "x": 480,
    "y": 720
  },
  "BL02": {
    "x": 476.7,
    "y": 680
  },
  "BL03": {
    "x": 473.3,
    "y": 640
  },
  "BL04": {
    "x": 470,
    "y": 600
  },
  "BL05": {
    "x": 466.7,
    "y": 560
  },
  "BL06": {
    "x": 463.3,
    "y": 520
  },
  "BL07": {
    "x": 460,
    "y": 480
  },
  "BL08": {
    "x": 456.7,
    "y": 440
  },
  "BL09": {
    "x": 453.3,
    "y": 400
  },
  "BL10": {
    "x": 450,
    "y": 360
  },
  "BL11": {
    "x": 480,
    "y": 360
  },
  "BL12": {
    "x": 540,
    "y": 360
  },
  "BL13": {
    "x": 600,
    "y": 360
  },
  "BL14": {
    "x": 660,
    "y": 360
  },
  "BL15": {
    "x": 720,
    "y": 360
  },
  "BL16": {
    "x": 720,
    "y": 395
  },
  "BL17": {
    "x": 720,
    "y": 430
  },
  "BL18": {
    "x": 720,
    "y": 465
  },
  "BL19": {
    "x": 720,
    "y": 500
  },
  "BL20": {
    "x": 720,
    "y": 535
  },
  "BL21": {
    "x": 720,
    "y": 570
  },
  "BL22": {
    "x": 720,
    "y": 600
  },
  "BL23": {
    "x": 690,
    "y": 615
  },
  "BL24": {
    "x": 660,
    "y": 630
  },
  "BL25": {
    "x": 630,
    "y": 645
  },
  "BL26": {
    "x": 600,
    "y": 660
  },
  "BL27": {
    "x": 570,
    "y": 660
  },
  "BL28": {
    "x": 540,
    "y": 660
  },
  "BL29": {
    "x": 528,
    "y": 672
  },
  "BL30": {
    "x": 516,
    "y": 684
  },
  "BL31": {
    "x": 504,
    "y": 696
  },
  "BL32": {
    "x": 492,
    "y": 708
  },
  "BL01_2": {
    "x": 480,
    "y": 720
  },
  "BL33": {
    "x": 390,
    "y": 750
  },
  "BL34": {
    "x": 300,
    "y": 780
  },
  "BL35": {
    "x": 270,
    "y": 780
  },
  "BL36": {
    "x": 240,
    "y": 780
  },
  "BL37": {
    "x": 210,
    "y": 780
  },
  "BL38": {
    "x": 180,
    "y": 780
  },
  "PP01": {
    "x": 240,
    "y": 120
  },
  "PP02": {
    "x": 240,
    "y": 150
  },
  "PP03": {
    "x": 240,
    "y": 180
  },
  "PP04": {
    "x": 240,
    "y": 210
  },
  "PP05": {
    "x": 240,
    "y": 240
  },
  "PP06": {
    "x": 240,
    "y": 270
  },
  "PP07": {
    "x": 270,
    "y": 270
  },
  "PP08": {
    "x": 300,
    "y": 270
  },
  "PP09": {
    "x": 330,
    "y": 270
  },
  "PP10": {
    "x": 360,
    "y": 270
  },
  "PP11": {
    "x": 390,
    "y": 270
  },
  "PP12": {
    "x": 390,
    "y": 300
  },
  "PP13": {
    "x": 390,
    "y": 330
  },
  "PP14": {
    "x": 390,
    "y": 360
  },
  "PP15": {
    "x": 420,
    "y": 360
  },
  "PP16": {
    "x": 450,
    "y": 360
  },
  "YL01": {
    "x": 720,
    "y": 360
  },
  "YL02": {
    "x": 758.6,
    "y": 360
  },
  "YL03": {
    "x": 797.1,
    "y": 360
  },
  "YL04": {
    "x": 835.7,
    "y": 360
  },
  "YL05": {
    "x": 874.3,
    "y": 360
  },
  "YL06": {
    "x": 912.9,
    "y": 360
  },
  "YL07": {
    "x": 951.4,
    "y": 360
  },
  "YL08": {
    "x": 990,
    "y": 360
  },
  "YL09": {
    "x": 990,
    "y": 384
  },
  "YL10": {
    "x": 990,
    "y": 408
  },
  "YL11": {
    "x": 990,
    "y": 432
  },
  "YL12": {
    "x": 990,
    "y": 456
  },
  "YL13": {
    "x": 990,
    "y": 480
  },
  "YL14": {
    "x": 990,
    "y": 504
  },
  "YL15": {
    "x": 990,
    "y": 528
  },
  "YL16": {
    "x": 990,
    "y": 552
  },
  "YL17": {
    "x": 990,
    "y": 576
  },
  "YL18": {
    "x": 990,
    "y": 600
  },
  "YL19": {
    "x": 990,
    "y": 624
  },
  "YL20": {
    "x": 990,
    "y": 648
  },
  "YL21": {
    "x": 990,
    "y": 672
  },
  "YL22": {
    "x": 990,
    "y": 696
  },
  "YL23": {
    "x": 990,
    "y": 720
  },
  "PK01": {
    "x": 390,
    "y": 270
  },
  "PK02": {
    "x": 390,
    "y": 234
  },
  "PK03": {
    "x": 390,
    "y": 198
  },
  "PK04": {
    "x": 390,
    "y": 162
  },
  "PK05": {
    "x": 390,
    "y": 126
  },
  "PK06": {
    "x": 390,
    "y": 90
  },
  "PK07": {
    "x": 420,
    "y": 90
  },
  "PK08": {
    "x": 450,
    "y": 90
  },
  "PK09": {
    "x": 480,
    "y": 90
  },
  "PK10": {
    "x": 510,
    "y": 90
  },
  "PK11": {
    "x": 540,
    "y": 90
  },
  "PK12": {
    "x": 570,
    "y": 90
  },
  "PK13": {
    "x": 600,
    "y": 90
  },
  "PK14": {
    "x": 630,
    "y": 90
  },
  "PK15": {
    "x": 615,
    "y": 90
  },
  "PK16": {
    "x": 600,
    "y": 90
  },
  "PK17": {
    "x": 630,
    "y": 90
  },
  "PK18": {
    "x": 660,
    "y": 90
  },
  "PK19": {
    "x": 690,
    "y": 90
  },
  "PK20": {
    "x": 720,
    "y": 90
  },
  "PK21": {
    "x": 750,
    "y": 90
  },
  "PK22": {
    "x": 780,
    "y": 90
  },
  "PK23": {
    "x": 810,
    "y": 90
  },
  "PK24": {
    "x": 840,
    "y": 90
  },
  "PK25": {
    "x": 870,
    "y": 90
  },
  "PK26": {
    "x": 900,
    "y": 90
  },
  "PK27": {
    "x": 930,
    "y": 90
  },
  "PK28": {
    "x": 960,
    "y": 90
  },
  "PK29": {
    "x": 990,
    "y": 90
  },
  "PK30": {
    "x": 1020,
    "y": 90
  },
  "A8": {
    "x": 600,
    "y": 540
  },
  "A7": {
    "x": 660,
    "y": 555
  },
  "A6": {
    "x": 720,
    "y": 570
  },
  "A5": {
    "x": 855,
    "y": 600
  },
  "A4": {
    "x": 990,
    "y": 630
  },
  "A3": {
    "x": 1020,
    "y": 640
  },
  "A2": {
    "x": 1050,
    "y": 650
  },
  "A1": {
    "x": 1080,
    "y": 660
  },
  "RN10": {
    "x": 630,
    "y": -30
  },
  "RN09": {
    "x": 630,
    "y": 0
  },
  "RN08": {
    "x": 630,
    "y": 30
  },
  "RN07": {
    "x": 630,
    "y": 60
  },
  "RN06": {
    "x": 630,
    "y": 90
  },
  "RN05": {
    "x": 600,
    "y": 144
  },
  "RN04": {
    "x": 570,
    "y": 198
  },
  "RN03": {
    "x": 540,
    "y": 252
  },
  "RN02": {
    "x": 510,
    "y": 306
  },
  "RW01": {
    "x": 480,
    "y": 360
  },
  "RW02": {
    "x": 435,
    "y": 375
  },
  "RW03": {
    "x": 390,
    "y": 390
  },
  "RW05": {
    "x": 345,
    "y": 405
  },
  "RW06": {
    "x": 300,
    "y": 420
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
 const [popupGroup, setPopupGroup] = useState<{ stations: Station[], coords: {x: number, y: number} } | null>(null);

  const stationsByCoord: Record<string, Station[]> = {};
  stations.forEach(st => {
    const coords = stationCoords[st.id];
    if (!coords) return;
    const key = `${coords.x},${coords.y}`;
    if (!stationsByCoord[key]) stationsByCoord[key] = [];
    stationsByCoord[key].push(st);
  });

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
            viewBox="-50 -150 1200 1300"
            className="w-full h-full min-w-[1400px] min-h-[740px] drop-shadow-[0_20px_50px_rgba(0,0,0,0.04)] transition-colors duration-500"
            onClick={() => setPopupGroup(null)}
          >
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse" x="0" y="0">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-black/[0.015]" />
              </pattern>
            </defs>
            <rect x="-100" y="-200" width="1400" height="1500" fill="url(#grid)" rx="20" />

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
 strokeLinecap="round"
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
 strokeLinecap="round"
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
 <g 
   key={`map-node-${st.id}`} 
   className="cursor-pointer group" 
   onClick={(e) => {
     e.stopPropagation();
     const group = stationsByCoord[`${coords.x},${coords.y}`];
     if (group && group.length > 1) {
       setPopupGroup({ stations: group, coords });
     } else {
       setPopupGroup(null);
       onSelectStation(st);
     }
   }}
 >
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
          {/* --- STAGE 4: Interchange Line Selector Popup --- */}
          {popupGroup && (
            <foreignObject
              x={popupGroup.coords.x - 30}
              y={popupGroup.coords.y + 10}
              width="60"
              height="80"
              className="overflow-visible"
            >
              <div className="bg-white/95 backdrop-blur-sm rounded-md shadow-2xl border border-gray-200/50 p-1.5 flex flex-col gap-0.5 w-[60px] transform -translate-x-1/2 left-1/2 relative z-50">
                <div className="text-[3.5px] font-bold text-gray-500 mb-0.5 px-1 uppercase tracking-wider">Select Line</div>
                {popupGroup.stations.map((st) => (
                  <button
                    key={st.id}
                    className="text-[4px] text-left px-1.5 py-1 hover:bg-gray-100/80 rounded-[2px] text-gray-800 font-semibold truncate flex items-center gap-1 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectStation(st);
                      setPopupGroup(null);
                    }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: getLineColor(st.line) }}></span>
                    {st.line.replace('BTS_', '').replace('MRT_', '').replace('SRT_', '')}
                  </button>
                ))}
              </div>
            </foreignObject>
          )}
 </svg>
        </TransformComponent>
      );
    }}
  </TransformWrapper>
 </div>
 );
};

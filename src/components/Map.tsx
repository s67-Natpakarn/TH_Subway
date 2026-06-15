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
    "x": 1000,
    "y": 40
  },
  "N23": {
    "x": 1000,
    "y": 80
  },
  "N22": {
    "x": 1000,
    "y": 120
  },
  "N21": {
    "x": 1000,
    "y": 160
  },
  "N20": {
    "x": 1000,
    "y": 200
  },
  "N19": {
    "x": 1000,
    "y": 240
  },
  "N18": {
    "x": 1000,
    "y": 280
  },
  "N17": {
    "x": 1000,
    "y": 320
  },
  "N16": {
    "x": 1000,
    "y": 360
  },
  "N15": {
    "x": 1000,
    "y": 400
  },
  "N14": {
    "x": 1000,
    "y": 440
  },
  "N13": {
    "x": 1000,
    "y": 480
  },
  "N12": {
    "x": 1000,
    "y": 520
  },
  "N11": {
    "x": 1000,
    "y": 560
  },
  "N10": {
    "x": 1000,
    "y": 600
  },
  "N9": {
    "x": 1000,
    "y": 640
  },
  "N8": {
    "x": 1000,
    "y": 680
  },
  "N7": {
    "x": 1000,
    "y": 730
  },
  "N5": {
    "x": 1000,
    "y": 780
  },
  "N4": {
    "x": 1000,
    "y": 830
  },
  "N3": {
    "x": 1000,
    "y": 880
  },
  "N2": {
    "x": 1000,
    "y": 920
  },
  "N1": {
    "x": 1000,
    "y": 960
  },
  "CEN_S": {
    "x": 1000,
    "y": 1000
  },
  "E1": {
    "x": 1040,
    "y": 1000
  },
  "E2": {
    "x": 1080,
    "y": 1000
  },
  "E3": {
    "x": 1120,
    "y": 1000
  },
  "E4": {
    "x": 1160,
    "y": 1000
  },
  "E5": {
    "x": 1200,
    "y": 1000
  },
  "E6": {
    "x": 1240,
    "y": 1000
  },
  "E7": {
    "x": 1280,
    "y": 1000
  },
  "E8": {
    "x": 1320,
    "y": 1000
  },
  "E9": {
    "x": 1360,
    "y": 1000
  },
  "E10": {
    "x": 1386.7,
    "y": 1026.7
  },
  "E11": {
    "x": 1413.3,
    "y": 1053.3
  },
  "E12": {
    "x": 1440,
    "y": 1080
  },
  "E13": {
    "x": 1466.7,
    "y": 1106.7
  },
  "E14": {
    "x": 1493.3,
    "y": 1133.3
  },
  "E15": {
    "x": 1520,
    "y": 1160
  },
  "E16": {
    "x": 1520,
    "y": 1200
  },
  "E17": {
    "x": 1520,
    "y": 1240
  },
  "E18": {
    "x": 1520,
    "y": 1280
  },
  "E19": {
    "x": 1520,
    "y": 1320
  },
  "E20": {
    "x": 1520,
    "y": 1360
  },
  "E21": {
    "x": 1520,
    "y": 1400
  },
  "E22": {
    "x": 1520,
    "y": 1440
  },
  "E23": {
    "x": 1520,
    "y": 1480
  },
  "W1": {
    "x": 960,
    "y": 1000
  },
  "CEN_L": {
    "x": 1000,
    "y": 1000
  },
  "S1": {
    "x": 1000,
    "y": 1040
  },
  "S2": {
    "x": 1000,
    "y": 1080
  },
  "S3": {
    "x": 960,
    "y": 1120
  },
  "S4": {
    "x": 920,
    "y": 1120
  },
  "S5": {
    "x": 880,
    "y": 1120
  },
  "S6": {
    "x": 840,
    "y": 1120
  },
  "S7": {
    "x": 800,
    "y": 1120
  },
  "S8": {
    "x": 760,
    "y": 1120
  },
  "S9": {
    "x": 720,
    "y": 1120
  },
  "S10": {
    "x": 680,
    "y": 1120
  },
  "S11": {
    "x": 640,
    "y": 1120
  },
  "S12": {
    "x": 600,
    "y": 1120
  },
  "BL01": {
    "x": 720,
    "y": 1120
  },
  "BL02": {
    "x": 720,
    "y": 1074.3
  },
  "BL03": {
    "x": 720,
    "y": 1028.6
  },
  "BL04": {
    "x": 720,
    "y": 982.9
  },
  "BL05": {
    "x": 720,
    "y": 937.1
  },
  "BL06": {
    "x": 720,
    "y": 891.4
  },
  "BL07": {
    "x": 720,
    "y": 845.7
  },
  "BL08": {
    "x": 720,
    "y": 800
  },
  "BL09": {
    "x": 840,
    "y": 680
  },
  "BL10": {
    "x": 880,
    "y": 680
  },
  "BL11": {
    "x": 920,
    "y": 680
  },
  "BL12": {
    "x": 960,
    "y": 680
  },
  "BL13": {
    "x": 1000,
    "y": 680
  },
  "BL14": {
    "x": 1040,
    "y": 680
  },
  "BL15": {
    "x": 1080,
    "y": 680
  },
  "BL16": {
    "x": 1160,
    "y": 760
  },
  "BL17": {
    "x": 1160,
    "y": 800
  },
  "BL18": {
    "x": 1160,
    "y": 840
  },
  "BL19": {
    "x": 1160,
    "y": 880
  },
  "BL20": {
    "x": 1160,
    "y": 920
  },
  "BL21": {
    "x": 1160,
    "y": 960
  },
  "BL22": {
    "x": 1160,
    "y": 1000
  },
  "BL23": {
    "x": 1160,
    "y": 1040
  },
  "BL24": {
    "x": 1120,
    "y": 1080
  },
  "BL25": {
    "x": 1060,
    "y": 1080
  },
  "BL26": {
    "x": 1000,
    "y": 1080
  },
  "BL27": {
    "x": 960,
    "y": 1080
  },
  "BL28": {
    "x": 920,
    "y": 1080
  },
  "BL29": {
    "x": 880,
    "y": 1080
  },
  "BL30": {
    "x": 840,
    "y": 1080
  },
  "BL31": {
    "x": 800,
    "y": 1120
  },
  "BL32": {
    "x": 760,
    "y": 1120
  },
  "BL01_2": {
    "x": 720,
    "y": 1120
  },
  "BL33": {
    "x": 660,
    "y": 1120
  },
  "BL34": {
    "x": 600,
    "y": 1120
  },
  "BL35": {
    "x": 560,
    "y": 1120
  },
  "BL36": {
    "x": 520,
    "y": 1120
  },
  "BL37": {
    "x": 480,
    "y": 1120
  },
  "BL38": {
    "x": 440,
    "y": 1120
  },
  "PP01": {
    "x": 240,
    "y": 480
  },
  "PP02": {
    "x": 280,
    "y": 480
  },
  "PP03": {
    "x": 320,
    "y": 480
  },
  "PP04": {
    "x": 360,
    "y": 480
  },
  "PP05": {
    "x": 400,
    "y": 480
  },
  "PP06": {
    "x": 440,
    "y": 480
  },
  "PP07": {
    "x": 480,
    "y": 480
  },
  "PP08": {
    "x": 520,
    "y": 480
  },
  "PP09": {
    "x": 560,
    "y": 480
  },
  "PP10": {
    "x": 600,
    "y": 480
  },
  "PP11": {
    "x": 640,
    "y": 480
  },
  "PP12": {
    "x": 720,
    "y": 480
  },
  "PP13": {
    "x": 773.3,
    "y": 533.3
  },
  "PP14": {
    "x": 826.7,
    "y": 586.7
  },
  "PP15": {
    "x": 880,
    "y": 640
  },
  "PP16": {
    "x": 880,
    "y": 680
  },
  "YL01": {
    "x": 1080,
    "y": 680
  },
  "YL02": {
    "x": 1111.1,
    "y": 680
  },
  "YL03": {
    "x": 1142.2,
    "y": 680
  },
  "YL04": {
    "x": 1173.3,
    "y": 680
  },
  "YL05": {
    "x": 1204.4,
    "y": 680
  },
  "YL06": {
    "x": 1235.6,
    "y": 680
  },
  "YL07": {
    "x": 1266.7,
    "y": 680
  },
  "YL08": {
    "x": 1297.8,
    "y": 680
  },
  "YL09": {
    "x": 1328.9,
    "y": 680
  },
  "YL10": {
    "x": 1360,
    "y": 680
  },
  "YL11": {
    "x": 1400,
    "y": 720
  },
  "YL12": {
    "x": 1440,
    "y": 760
  },
  "YL13": {
    "x": 1480,
    "y": 800
  },
  "YL14": {
    "x": 1520,
    "y": 840
  },
  "YL15": {
    "x": 1520,
    "y": 875.6
  },
  "YL16": {
    "x": 1520,
    "y": 911.1
  },
  "YL17": {
    "x": 1520,
    "y": 946.7
  },
  "YL18": {
    "x": 1520,
    "y": 982.2
  },
  "YL19": {
    "x": 1520,
    "y": 1017.8
  },
  "YL20": {
    "x": 1520,
    "y": 1053.3
  },
  "YL21": {
    "x": 1520,
    "y": 1088.9
  },
  "YL22": {
    "x": 1520,
    "y": 1124.4
  },
  "YL23": {
    "x": 1520,
    "y": 1160
  },
  "PK01": {
    "x": 640,
    "y": 480
  },
  "PK02": {
    "x": 640,
    "y": 440
  },
  "PK03": {
    "x": 640,
    "y": 400
  },
  "PK04": {
    "x": 640,
    "y": 360
  },
  "PK05": {
    "x": 640,
    "y": 320
  },
  "PK06": {
    "x": 671.1,
    "y": 320
  },
  "PK07": {
    "x": 702.2,
    "y": 320
  },
  "PK08": {
    "x": 733.3,
    "y": 320
  },
  "PK09": {
    "x": 764.4,
    "y": 320
  },
  "PK10": {
    "x": 795.6,
    "y": 320
  },
  "PK11": {
    "x": 826.7,
    "y": 320
  },
  "PK12": {
    "x": 857.8,
    "y": 320
  },
  "PK13": {
    "x": 888.9,
    "y": 320
  },
  "PK14": {
    "x": 920,
    "y": 320
  },
  "PK15": {
    "x": 960,
    "y": 320
  },
  "PK16": {
    "x": 1000,
    "y": 320
  },
  "PK17": {
    "x": 1040,
    "y": 320
  },
  "PK18": {
    "x": 1080,
    "y": 320
  },
  "PK19": {
    "x": 1120,
    "y": 320
  },
  "PK20": {
    "x": 1160,
    "y": 320
  },
  "PK21": {
    "x": 1200,
    "y": 320
  },
  "PK22": {
    "x": 1240,
    "y": 320
  },
  "PK23": {
    "x": 1280,
    "y": 320
  },
  "PK24": {
    "x": 1320,
    "y": 320
  },
  "PK25": {
    "x": 1360,
    "y": 320
  },
  "PK26": {
    "x": 1400,
    "y": 320
  },
  "PK27": {
    "x": 1440,
    "y": 320
  },
  "PK28": {
    "x": 1480,
    "y": 320
  },
  "PK29": {
    "x": 1520,
    "y": 320
  },
  "PK30": {
    "x": 1560,
    "y": 320
  },
  "A8": {
    "x": 1000,
    "y": 920
  },
  "A7": {
    "x": 1040,
    "y": 960
  },
  "A6": {
    "x": 1160,
    "y": 960
  },
  "A5": {
    "x": 1216,
    "y": 960
  },
  "A4": {
    "x": 1272,
    "y": 960
  },
  "A3": {
    "x": 1328,
    "y": 960
  },
  "A2": {
    "x": 1384,
    "y": 960
  },
  "A1": {
    "x": 1440,
    "y": 960
  },
  "RN10": {
    "x": 920,
    "y": 160
  },
  "RN09": {
    "x": 920,
    "y": 200
  },
  "RN08": {
    "x": 920,
    "y": 240
  },
  "RN07": {
    "x": 920,
    "y": 280
  },
  "RN06": {
    "x": 920,
    "y": 320
  },
  "RN05": {
    "x": 920,
    "y": 392
  },
  "RN04": {
    "x": 920,
    "y": 464
  },
  "RN03": {
    "x": 920,
    "y": 536
  },
  "RN02": {
    "x": 920,
    "y": 608
  },
  "RW01": {
    "x": 920,
    "y": 680
  },
  "RW02": {
    "x": 880,
    "y": 640
  },
  "RW03": {
    "x": 800,
    "y": 640
  },
  "RW05": {
    "x": 720,
    "y": 640
  },
  "RW06": {
    "x": 640,
    "y": 640
  }
};

export const Map: React.FC<MapProps> = ({
  stations,
  startStation,
  endStation,
  onSelectStation,
  calculatedRoute,
}) => {
  const [isZoomedIn, setIsZoomedIn] = useState(false);
  const [popupGroup, setPopupGroup] = useState<{ stations: Station[], coords: { x: number, y: number } } | null>(null);

  const stationsByCoord: Record<string, Station[]> = {};
  stations.forEach(st => {
    const coords = stationCoords[st.id];
    if (!coords) return;
    const key = `${coords.x},${coords.y}`;
    if (!stationsByCoord[key]) stationsByCoord[key] = [];
    stationsByCoord[key].push(st);
  });
  const interchangeCoords = Object.values(stationsByCoord)
    .filter(g => g.length > 1)
    .map(g => stationCoords[g[0].id]);

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
        initialScale={0.8}
        minScale={0.3}
        maxScale={4}
        centerOnInit={true}
        onTransform={(ref) => {
          setIsZoomedIn(ref.state.scale > 1.2);
        }}
      >
        {() => {
          return (
            <TransformComponent wrapperClass="w-full h-full cursor-grab active:cursor-grabbing" contentClass="w-full h-full flex items-center justify-center">
              <svg
                viewBox="-100 -150 2000 2000"
                className="w-full h-full min-w-[1400px] min-h-[740px] drop-shadow-[0_20px_50px_rgba(0,0,0,0.04)] transition-colors duration-500"
                onClick={() => setPopupGroup(null)}
              >
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse" x="0" y="0">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-black/[0.015]" />
                  </pattern>
                </defs>
                <rect x="0" y="-100" width="1800" height="1800" fill="url(#grid)" rx="20" />

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
                        strokeWidth={edge.type === 'cross-platform' ? "3" : "4.5"}
                        strokeDasharray={edge.type === 'cross-platform' ? "3 3" : "4 4"}
                        strokeLinecap="round"
                      />
                    );
                  }

                  return (
                    <line
                      key={`edge-${i}`}
                      x1={c1.x} y1={c1.y} x2={c2.x} y2={c2.y}
                      stroke={getLineColor(lineName)}
                      strokeWidth="8"
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
                    const fromSt = stations.find(s => s.id === edge.from);
                    const toSt = stations.find(s => s.id === edge.to);
                    const isInterchange = edge.type === 'interchange' || edge.type === 'cross-platform' || (fromSt && toSt && fromSt.line !== toSt.line);
                    const lineName = (fromSt && toSt && fromSt.line === toSt.line) ? fromSt.line : 'INTERCHANGE';

                    let startC = c1;
                    let endC = c2;
                    if (calculatedRoute?.path) {
                      const idxFrom = calculatedRoute.path.findIndex(s => s.id === edge.from);
                      const idxTo = calculatedRoute.path.findIndex(s => s.id === edge.to);
                      if (idxFrom > -1 && idxTo > -1 && idxFrom > idxTo) {
                        startC = c2;
                        endC = c1;
                      }
                    }

                    if (isInterchange) {
                      return (
                        <line
                          key={`active-edge-${i}`}
                          x1={startC.x} y1={startC.y} x2={endC.x} y2={endC.y}
                          stroke="#f59e0b"
                          strokeWidth={edge.type === 'cross-platform' ? "5" : "6.5"}
                          strokeDasharray={edge.type === 'cross-platform' ? "3 3" : "5 5"}
                          strokeLinecap="round"
                        />
                      );
                    }

                    return (
                      <line
                        key={`active-edge-${i}`}
                        x1={startC.x} y1={startC.y} x2={endC.x} y2={endC.y}
                        stroke={getLineColor(lineName)}
                        strokeWidth="10"
                        strokeLinecap="round"
                        className="map-line"
                      />
                    );
                  }
                  return null;
                })}

                {/* --- STAGE 2.5: Interchange Background Connectors --- */}
                {interchangeCoords.map((c, i) => (
                  <circle
                    key={`interchange-bg-${i}`}
                    cx={c.x}
                    cy={c.y}
                    r="16"
                    fill="#ffffff"
                    stroke="#cbd5e1"
                    strokeWidth="2.5"
                    className="pointer-events-none drop-shadow-sm"
                  />
                ))}

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
                          r="18" fill="none"
                          stroke={isStart ? '#159E40' : '#003399'}
                          strokeWidth="3"
                          className="opacity-40"
                        />
                      )}

                      {/* Station Circle Body */}
                      <circle
                        cx={coords.x}
                        cy={coords.y}
                        r={isStart || isEnd ? '11' : inRoute ? '9' : '7.5'}
                        fill={isStart || isEnd ? '#ffffff' : inRoute ? strokeColor : '#ffffff'}
                        stroke={isStart || isEnd ? (isStart ? '#159E40' : '#003399') : strokeColor}
                        strokeWidth={isStart || isEnd ? '4' : '2.5'}
                        className="map-station"
                      />

                      {/* Station Code inside the dot */}
                      <text
                        x={coords.x}
                        y={coords.y + 1.6}
                        textAnchor="middle"
                        className={`text-[5px] font-extrabold select-none pointer-events-none transition-opacity ${isStart || isEnd ? (isStart ? 'fill-[#159E40]' : 'fill-[#003399]') : inRoute ? 'fill-white' : 'fill-black/80'
                          }`}
                      >
                        {st.id.split('_')[0]}
                      </text>

                      {/* Station EN Label */}
                      <text
                        x={coords.x}
                        y={coords.y + (i % 2 === 0 ? -16 : 15)}
                        textAnchor="middle"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinejoin="round"
                        paintOrder="stroke"
                        className={`text-[8.5px] font-bold tracking-tight select-none pointer-events-none fill-black/90 transition-opacity duration-300 ${isStart || isEnd ? 'font-extrabold text-[10px]' : ''
                          } ${isZoomedIn ? 'opacity-100' : 'opacity-0'}`}
                      >
                        {st.nameEN}
                      </text>

                      {/* Station Thai Label */}
                      <text
                        x={coords.x}
                        y={coords.y + (i % 2 === 0 ? -9 : 21)}
                        textAnchor="middle"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinejoin="round"
                        paintOrder="stroke"
                        className={`text-[7px] font-semibold select-none pointer-events-none fill-black/80 transition-opacity duration-300 ${isStart || isEnd ? 'font-bold text-[8.5px]' : ''
                          } ${isZoomedIn ? 'opacity-100' : 'opacity-0'}`}
                      >
                        {st.nameTH}
                      </text>
                    </g>
                  );
                })}
                {/* --- STAGE 4: Interchange Line Selector Popup --- */}
                {popupGroup && (
                  <foreignObject
                    x={popupGroup.coords.x - 45}
                    y={popupGroup.coords.y + 15}
                    width="90"
                    height="110"
                    className="overflow-visible"
                  >
                    <div className="bg-white/95 backdrop-blur-sm rounded-md shadow-2xl border border-gray-200/50 p-2 flex flex-col gap-1 w-[90px] transform -translate-x-1/2 left-1/2 relative z-50">
                      <div className="text-[5px] font-bold text-gray-500 mb-0.5 px-1 uppercase tracking-wider">Select Line</div>
                      {popupGroup.stations.map((st) => (
                        <button
                          key={st.id}
                          className="text-[6px] text-left px-2 py-1.5 hover:bg-gray-100/80 rounded-[3px] text-gray-800 font-semibold truncate flex items-center gap-1.5 transition-colors"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectStation(st);
                            setPopupGroup(null);
                          }}
                        >
                          <span className="w-2 h-2 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: getLineColor(st.line) }}></span>
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
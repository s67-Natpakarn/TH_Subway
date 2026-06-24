import React, { useState } from 'react';
import type { Station, RouteResult, GraphData } from '../utils/pathfinder';
import transitData from '../data/transitGraph.json';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

const transitGraph = transitData as GraphData;

interface MapProps {
  stations: Station[];
  startStation: Station | null;
  endStation: Station | null;
  onSelectStation: (station: Station) => void;
  calculatedRoute: RouteResult | null;
}

// Coordinate layout of all nodes inside SVG viewBox="-100 -150 2000 2120"
const stationCoords: Record<string, { x: number; y: number }> = {
  "N24": {
    "x": 1260,
    "y": 70
  },
  "N23": {
    "x": 1228.6,
    "y": 105.7
  },
  "N22": {
    "x": 1197.1,
    "y": 141.4
  },
  "N21": {
    "x": 1165.7,
    "y": 177.1
  },
  "N20": {
    "x": 1134.3,
    "y": 212.9
  },
  "N19": {
    "x": 1102.9,
    "y": 248.6
  },
  "N18": {
    "x": 1071.4,
    "y": 284.3
  },
  "N17": {
    "x": 1040,
    "y": 320
  },
  "N16": {
    "x": 1033.3,
    "y": 364.4
  },
  "N15": {
    "x": 1026.7,
    "y": 408.9
  },
  "N14": {
    "x": 1020,
    "y": 453.3
  },
  "N13": {
    "x": 1013.3,
    "y": 497.8
  },
  "N12": {
    "x": 1006.7,
    "y": 542.2
  },
  "N11": {
    "x": 1000,
    "y": 586.7
  },
  "N10": {
    "x": 993.3,
    "y": 631.1
  },
  "N9": {
    "x": 986.7,
    "y": 675.6
  },
  "N8": {
    "x": 980,
    "y": 720
  },
  "N7": {
    "x": 980,
    "y": 762.5
  },
  "N5": {
    "x": 980,
    "y": 805
  },
  "N4": {
    "x": 980,
    "y": 847.5
  },
  "N3": {
    "x": 980,
    "y": 890
  },
  "N2": {
    "x": 980,
    "y": 935
  },
  "N1": {
    "x": 980,
    "y": 980
  },
  "CEN_S": {
    "x": 980,
    "y": 1025
  },
  "E1": {
    "x": 1025,
    "y": 1025
  },
  "E2": {
    "x": 1070,
    "y": 1025
  },
  "E3": {
    "x": 1115,
    "y": 1025
  },
  "E4": {
    "x": 1160,
    "y": 1025
  },
  "E5": {
    "x": 1205,
    "y": 1052
  },
  "E6": {
    "x": 1250,
    "y": 1079
  },
  "E7": {
    "x": 1295,
    "y": 1106
  },
  "E8": {
    "x": 1340,
    "y": 1133
  },
  "E9": {
    "x": 1385,
    "y": 1160
  },
  "E10": {
    "x": 1410,
    "y": 1222
  },
  "E11": {
    "x": 1435,
    "y": 1284
  },
  "E12": {
    "x": 1460,
    "y": 1346
  },
  "E13": {
    "x": 1485,
    "y": 1408
  },
  "E14": {
    "x": 1510,
    "y": 1470
  },
  "E15": {
    "x": 1510,
    "y": 1550
  },
  "E16": {
    "x": 1510,
    "y": 1585
  },
  "E17": {
    "x": 1510,
    "y": 1620
  },
  "E18": {
    "x": 1510,
    "y": 1655
  },
  "E19": {
    "x": 1510,
    "y": 1690
  },
  "E20": {
    "x": 1510,
    "y": 1725
  },
  "E21": {
    "x": 1510,
    "y": 1760
  },
  "E22": {
    "x": 1510,
    "y": 1795
  },
  "E23": {
    "x": 1510,
    "y": 1830
  },
  "W1": {
    "x": 930,
    "y": 1025
  },
  "CEN_L": {
    "x": 980,
    "y": 1025
  },
  "S1": {
    "x": 980,
    "y": 1070
  },
  "S2": {
    "x": 980,
    "y": 1115
  },
  "S3": {
    "x": 955,
    "y": 1160
  },
  "S4": {
    "x": 923.8,
    "y": 1193.8
  },
  "S5": {
    "x": 892.5,
    "y": 1227.5
  },
  "S6": {
    "x": 861.3,
    "y": 1261.3
  },
  "S7": {
    "x": 830,
    "y": 1295
  },
  "S8": {
    "x": 774,
    "y": 1295
  },
  "S9": {
    "x": 718,
    "y": 1295
  },
  "S10": {
    "x": 662,
    "y": 1295
  },
  "S11": {
    "x": 606,
    "y": 1295
  },
  "S12": {
    "x": 550,
    "y": 1295
  },
  "BL01": {
    "x": 650,
    "y": 1295
  },
  "BL02": {
    "x": 655.7,
    "y": 1242.9
  },
  "BL03": {
    "x": 661.4,
    "y": 1190.7
  },
  "BL04": {
    "x": 667.1,
    "y": 1138.6
  },
  "BL05": {
    "x": 672.9,
    "y": 1086.4
  },
  "BL06": {
    "x": 678.6,
    "y": 1034.3
  },
  "BL07": {
    "x": 684.3,
    "y": 982.1
  },
  "BL08": {
    "x": 690,
    "y": 930
  },
  "BL09": {
    "x": 780,
    "y": 720
  },
  "BL10": {
    "x": 850,
    "y": 700
  },
  "BL11": {
    "x": 900,
    "y": 700
  },
  "BL12": {
    "x": 940,
    "y": 710
  },
  "BL13": {
    "x": 980,
    "y": 720
  },
  "BL14": {
    "x": 1045,
    "y": 710
  },
  "BL15": {
    "x": 1110,
    "y": 700
  },
  "BL16": {
    "x": 1160,
    "y": 760
  },
  "BL17": {
    "x": 1162,
    "y": 808
  },
  "BL18": {
    "x": 1164,
    "y": 856
  },
  "BL19": {
    "x": 1166,
    "y": 904
  },
  "BL20": {
    "x": 1168,
    "y": 952
  },
  "BL21": {
    "x": 1170,
    "y": 1000
  },
  "BL22": {
    "x": 1160,
    "y": 1025
  },
  "BL23": {
    "x": 1160,
    "y": 1070
  },
  "BL24": {
    "x": 1115,
    "y": 1115
  },
  "BL25": {
    "x": 1047.5,
    "y": 1115
  },
  "BL26": {
    "x": 980,
    "y": 1115
  },
  "BL27": {
    "x": 930,
    "y": 1115
  },
  "BL28": {
    "x": 880,
    "y": 1115
  },
  "BL29": {
    "x": 830,
    "y": 1115
  },
  "BL30": {
    "x": 780,
    "y": 1115
  },
  "BL31": {
    "x": 735,
    "y": 1160
  },
  "BL32": {
    "x": 700,
    "y": 1230
  },
  "BL01_2": {
    "x": 650,
    "y": 1295
  },
  "BL33": {
    "x": 600,
    "y": 1295
  },
  "BL34": {
    "x": 550,
    "y": 1295
  },
  "BL35": {
    "x": 500,
    "y": 1295
  },
  "BL36": {
    "x": 450,
    "y": 1295
  },
  "BL37": {
    "x": 400,
    "y": 1295
  },
  "BL38": {
    "x": 350,
    "y": 1295
  },
  "PP01": {
    "x": 120,
    "y": 520
  },
  "PP02": {
    "x": 175,
    "y": 520
  },
  "PP03": {
    "x": 230,
    "y": 520
  },
  "PP04": {
    "x": 285,
    "y": 520
  },
  "PP05": {
    "x": 340,
    "y": 520
  },
  "PP06": {
    "x": 395,
    "y": 520
  },
  "PP07": {
    "x": 450,
    "y": 520
  },
  "PP08": {
    "x": 505,
    "y": 520
  },
  "PP09": {
    "x": 560,
    "y": 520
  },
  "PP10": {
    "x": 615,
    "y": 520
  },
  "PP11": {
    "x": 670,
    "y": 520
  },
  "PP12": {
    "x": 735,
    "y": 520
  },
  "PP13": {
    "x": 773.3,
    "y": 566.7
  },
  "PP14": {
    "x": 811.7,
    "y": 613.3
  },
  "PP15": {
    "x": 850,
    "y": 660
  },
  "PP16": {
    "x": 850,
    "y": 700
  },
  "YL01": {
    "x": 1110,
    "y": 700
  },
  "YL02": {
    "x": 1155,
    "y": 700
  },
  "YL03": {
    "x": 1200,
    "y": 700
  },
  "YL04": {
    "x": 1245,
    "y": 700
  },
  "YL05": {
    "x": 1290,
    "y": 700
  },
  "YL06": {
    "x": 1334,
    "y": 740
  },
  "YL07": {
    "x": 1378,
    "y": 780
  },
  "YL08": {
    "x": 1422,
    "y": 820
  },
  "YL09": {
    "x": 1466,
    "y": 860
  },
  "YL10": {
    "x": 1510,
    "y": 900
  },
  "YL11": {
    "x": 1510,
    "y": 950
  },
  "YL12": {
    "x": 1510,
    "y": 1000
  },
  "YL13": {
    "x": 1510,
    "y": 1050
  },
  "YL14": {
    "x": 1510,
    "y": 1100
  },
  "YL15": {
    "x": 1510,
    "y": 1150
  },
  "YL16": {
    "x": 1510,
    "y": 1200
  },
  "YL17": {
    "x": 1510,
    "y": 1250
  },
  "YL18": {
    "x": 1510,
    "y": 1300
  },
  "YL19": {
    "x": 1510,
    "y": 1350
  },
  "YL20": {
    "x": 1510,
    "y": 1400
  },
  "YL21": {
    "x": 1510,
    "y": 1450
  },
  "YL22": {
    "x": 1510,
    "y": 1500
  },
  "YL23": {
    "x": 1510,
    "y": 1550
  },
  "PK01": {
    "x": 670,
    "y": 520
  },
  "PK02": {
    "x": 647.5,
    "y": 480
  },
  "PK03": {
    "x": 625,
    "y": 440
  },
  "PK04": {
    "x": 602.5,
    "y": 400
  },
  "PK05": {
    "x": 580,
    "y": 360
  },
  "PK06": {
    "x": 617.8,
    "y": 357.2
  },
  "PK07": {
    "x": 655.6,
    "y": 354.4
  },
  "PK08": {
    "x": 693.3,
    "y": 351.7
  },
  "PK09": {
    "x": 731.1,
    "y": 348.9
  },
  "PK10": {
    "x": 768.9,
    "y": 346.1
  },
  "PK11": {
    "x": 806.7,
    "y": 343.3
  },
  "PK12": {
    "x": 844.4,
    "y": 340.6
  },
  "PK13": {
    "x": 882.2,
    "y": 337.8
  },
  "PK14": {
    "x": 920,
    "y": 335
  },
  "PK15": {
    "x": 980,
    "y": 327.5
  },
  "PK16": {
    "x": 1040,
    "y": 320
  },
  "PK17": {
    "x": 1090,
    "y": 321.9
  },
  "PK18": {
    "x": 1140,
    "y": 323.8
  },
  "PK19": {
    "x": 1190,
    "y": 325.6
  },
  "PK20": {
    "x": 1240,
    "y": 327.5
  },
  "PK21": {
    "x": 1290,
    "y": 329.4
  },
  "PK22": {
    "x": 1340,
    "y": 331.3
  },
  "PK23": {
    "x": 1390,
    "y": 333.1
  },
  "PK24": {
    "x": 1440,
    "y": 335
  },
  "PK25": {
    "x": 1481.7,
    "y": 372.5
  },
  "PK26": {
    "x": 1523.3,
    "y": 410
  },
  "PK27": {
    "x": 1565,
    "y": 447.5
  },
  "PK28": {
    "x": 1606.7,
    "y": 485
  },
  "PK29": {
    "x": 1648.3,
    "y": 522.5
  },
  "PK30": {
    "x": 1690,
    "y": 560
  },
  "A8": {
    "x": 980,
    "y": 890
  },
  "A7": {
    "x": 1040,
    "y": 950
  },
  "A6": {
    "x": 1170,
    "y": 1000
  },
  "A5": {
    "x": 1260,
    "y": 1000
  },
  "A4": {
    "x": 1350,
    "y": 1000
  },
  "A3": {
    "x": 1440,
    "y": 1000
  },
  "A2": {
    "x": 1530,
    "y": 1000
  },
  "A1": {
    "x": 1620,
    "y": 1000
  },
  "RN10": {
    "x": 920,
    "y": 80
  },
  "RN09": {
    "x": 920,
    "y": 130
  },
  "RN08": {
    "x": 920,
    "y": 180
  },
  "RN07": {
    "x": 920,
    "y": 230
  },
  "RN06": {
    "x": 920,
    "y": 335
  },
  "RN05": {
    "x": 920,
    "y": 413.8
  },
  "RN04": {
    "x": 920,
    "y": 492.5
  },
  "RN03": {
    "x": 920,
    "y": 571.3
  },
  "RN02": {
    "x": 920,
    "y": 650
  },
  "RW01": {
    "x": 900,
    "y": 700
  },
  "RW02": {
    "x": 850,
    "y": 660
  },
  "RW03": {
    "x": 760,
    "y": 660
  },
  "RW05": {
    "x": 670,
    "y": 660
  },
  "RW06": {
    "x": 580,
    "y": 660
  }
};

type Coord = { x: number; y: number };
type LabelSide = 'above' | 'below' | 'left' | 'right';
type LabelAnchor = 'start' | 'middle' | 'end';

interface LabelLine {
  text: string;
  kind: 'th' | 'en';
}

interface LabelBox {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

interface LabelPlacement {
  key: string;
  x: number;
  top: number;
  anchor: LabelAnchor;
  lines: LabelLine[];
  selected: boolean;
}

const LABEL_OFFSET = 17;
const LABEL_GAP = 5;
const LINE_HEIGHT = 7.4;

const getIdNumber = (id: string) => Number(id.match(/\d+/)?.[0] ?? 0);

const uniqueValues = (values: string[]) => [...new Set(values.filter(Boolean))];

const cleanEnglishName = (name: string) =>
  name.replace(/\s+\((Sukhumvit|Silom)\)$/i, '').trim();

const wrapText = (text: string, maxChars: number) => {
  const normalized = text.replace(/\s*\/\s*/g, ' / ').trim();
  const words = normalized.includes(' ')
    ? normalized.split(/\s+/).filter(Boolean)
    : normalized.match(new RegExp(`.{1,${maxChars}}`, 'g')) ?? [normalized];

  const lines: string[] = [];
  let current = '';

  words.forEach((word) => {
    const chunks = word.length > maxChars && word !== '/'
      ? word.match(new RegExp(`.{1,${maxChars}}`, 'g')) ?? [word]
      : [word];

    chunks.forEach((chunk) => {
      const next = current ? `${current} ${chunk}` : chunk;
      if (next.length > maxChars && current) {
        lines.push(current);
        current = chunk;
      } else {
        current = next;
      }
    });
  });

  if (current) lines.push(current);
  return lines;
};

const isDenseLabelArea = (station: Station, coords: Coord) => {
  const id = station.id;
  return (
    id.startsWith('PK') ||
    (id.startsWith('PP') && coords.y <= 560) ||
    (id.startsWith('YL') && coords.y <= 920) ||
    (id.startsWith('BL') && (coords.y <= 730 || coords.y >= 1110)) ||
    id.startsWith('A')
  );
};

const buildLabelLines = (group: Station[], coords: Coord): LabelLine[] => {
  const dense = isDenseLabelArea(group[0], coords);
  const thMax = dense ? 11 : 13;
  const enMax = dense ? 13 : 16;
  const thNames = uniqueValues(group.map((station) => station.nameTH));
  const enNames = uniqueValues(group.map((station) => cleanEnglishName(station.nameEN)));
  const thText = thNames.join(' / ');
  const enText = enNames.join(' / ');

  return [
    ...wrapText(thText, thMax).map((text) => ({ text, kind: 'th' as const })),
    ...wrapText(enText, enMax).map((text) => ({ text, kind: 'en' as const })),
  ];
};

const estimateLabelBox = (lines: LabelLine[]) => {
  const width = Math.max(
    28,
    ...lines.map((line) => line.text.length * (line.kind === 'th' ? 4.2 : 3.7)),
  );

  return {
    width: Math.min(width, 96),
    height: Math.max(10, lines.length * LINE_HEIGHT),
  };
};

const getPreferredSides = (station: Station, group: Station[], coords: Coord): LabelSide[] => {
  const ids = group.map((item) => item.id);
  const id = station.id;
  const n = getIdNumber(id);
  const alternate: LabelSide[] = n % 2 === 0 ? ['above', 'below'] : ['below', 'above'];

  if (coords.x >= 1500) return ['left', ...alternate, 'right'];
  if (coords.x <= 160) return ['right', ...alternate, 'left'];
  if (ids.some((item) => item.startsWith('CEN'))) return ['left', 'below', 'above', 'right'];
  if (ids.includes('N3') || ids.includes('A8')) return ['left', 'right', 'above', 'below'];
  if (ids.includes('S12') || ids.includes('BL34')) return ['below', 'left', 'above', 'right'];
  if (ids.includes('BL15') || ids.includes('YL01')) return ['above', 'right', 'below', 'left'];

  if (id.startsWith('PK')) {
    if (n <= 5) return ['left', 'right', ...alternate];
    if (n >= 25) return ['right', 'left', ...alternate];
    return [...alternate, 'right', 'left'];
  }

  if (id.startsWith('PP')) {
    if (coords.y <= 540) return [...alternate, 'left', 'right'];
    return ['left', 'right', ...alternate];
  }

  if (id.startsWith('RN')) return ['left', 'right', 'above', 'below'];
  if (id.startsWith('RW')) return ['above', 'below', 'left', 'right'];

  if (id.startsWith('N')) {
    if (n >= 17) return ['right', 'left', 'above', 'below'];
    if (n <= 5) return ['left', 'right', 'above', 'below'];
    return ['right', 'left', 'below', 'above'];
  }

  if (id.startsWith('E')) {
    if (n <= 4) return [...alternate, 'right', 'left'];
    if (n >= 15) return ['left', 'right', 'above', 'below'];
    return ['right', 'left', ...alternate];
  }

  if (id.startsWith('S')) {
    if (n <= 2) return ['right', 'left', 'below', 'above'];
    return [...alternate, 'left', 'right'];
  }

  if (id.startsWith('BL')) {
    if (coords.x <= 660) return ['left', 'right', 'above', 'below'];
    if (coords.y <= 730) return [...alternate, 'right', 'left'];
    if (coords.x >= 1140) return ['right', 'left', ...alternate];
    if (coords.y >= 1110) return [...alternate, 'left', 'right'];
    return ['left', 'right', ...alternate];
  }

  if (id.startsWith('YL')) {
    if (coords.y <= 920) return [...alternate, 'right', 'left'];
    return ['right', 'left', ...alternate];
  }

  if (id.startsWith('A')) return [...alternate, 'left', 'right'];
  return [...alternate, 'right', 'left'];
};

const uniqueSides = (sides: LabelSide[]) =>
  sides.filter((side, index) => sides.indexOf(side) === index);

const createLabelBox = (
  coords: Coord,
  side: LabelSide,
  size: { width: number; height: number },
  offset: number,
) => {
  let x = coords.x;
  let top = coords.y - size.height / 2;
  let anchor: LabelAnchor = 'middle';

  if (side === 'above') {
    top = coords.y - LABEL_OFFSET - size.height - offset;
  } else if (side === 'below') {
    top = coords.y + LABEL_OFFSET + offset;
  } else if (side === 'left') {
    x = coords.x - LABEL_OFFSET;
    top += offset;
    anchor = 'end';
  } else {
    x = coords.x + LABEL_OFFSET;
    top += offset;
    anchor = 'start';
  }

  const left = anchor === 'middle' ? x - size.width / 2 : anchor === 'end' ? x - size.width : x;

  return {
    x,
    top,
    anchor,
    box: {
      left,
      top,
      right: left + size.width,
      bottom: top + size.height,
    },
  };
};

const boxesOverlap = (a: LabelBox, b: LabelBox) =>
  a.left < b.right + LABEL_GAP &&
  a.right + LABEL_GAP > b.left &&
  a.top < b.bottom + LABEL_GAP &&
  a.bottom + LABEL_GAP > b.top;

const placeStationLabels = (
  stations: Station[],
  stationsByCoord: Record<string, Station[]>,
  startId?: string,
  endId?: string,
): LabelPlacement[] => {
  const seenCoords = new Set<string>();
  const placedBoxes: LabelBox[] = [];

  return stations
    .flatMap((station) => {
      const coords = stationCoords[station.id];
      if (!coords) return [];

      const coordKey = `${coords.x},${coords.y}`;
      if (seenCoords.has(coordKey)) return [];
      seenCoords.add(coordKey);

      const group = stationsByCoord[coordKey] ?? [station];
      return [{ station: group[0], group, coords, coordKey }];
    })
    .sort((a, b) => {
      const groupRank = b.group.length - a.group.length;
      if (groupRank !== 0) return groupRank;
      if (a.coords.y !== b.coords.y) return a.coords.y - b.coords.y;
      return a.coords.x - b.coords.x;
    })
    .map(({ station, group, coords, coordKey }) => {
      const lines = buildLabelLines(group, coords);
      const size = estimateLabelBox(lines);
      const sideOrder = uniqueSides([
        ...getPreferredSides(station, group, coords),
        'above',
        'below',
        'left',
        'right',
      ]);

      const candidates = sideOrder.flatMap((side) => {
        const offsets = side === 'left' || side === 'right'
          ? [0, -14, 14, -28, 28, -42, 42]
          : [0, 10, 22, 34];
        return offsets.map((offset) => createLabelBox(coords, side, size, offset));
      });
      const selected = candidates.find((candidate) =>
        !placedBoxes.some((box) => boxesOverlap(candidate.box, box)),
      ) ?? candidates[0];

      placedBoxes.push(selected.box);

      return {
        key: coordKey,
        x: selected.x,
        top: selected.top,
        anchor: selected.anchor,
        lines,
        selected: group.some((item) => item.id === startId || item.id === endId),
      };
    });
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
  const interchangeGroups = Object.values(stationsByCoord).filter(g => g.length > 1);
  const labelPlacements = placeStationLabels(stations, stationsByCoord, startStation?.id, endStation?.id);

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
        initialScale={0.88}
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
                viewBox="-100 -150 2000 2120"
                className="w-full h-full min-w-[1400px] min-h-[820px] drop-shadow-[0_20px_50px_rgba(0,0,0,0.04)] transition-colors duration-500"
                onClick={() => setPopupGroup(null)}
              >
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse" x="0" y="0">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-black/[0.015]" />
                  </pattern>
                </defs>
                <rect x="0" y="-100" width="1800" height="2050" fill="url(#grid)" rx="20" />

                {/* --- STAGE 1: Standard Rail Tracks (Static) --- */}
                {transitGraph.edges.map((edge, i) => {
                  const c1 = stationCoords[edge.from];
                  const c2 = stationCoords[edge.to];
                  if (!c1 || !c2) return null;

                  const fromSt = transitGraph.stations[edge.from];
                  const toSt = transitGraph.stations[edge.to];
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
                {calculatedRoute && transitGraph.edges.map((edge, i) => {
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

                {/* --- STAGE 2.5: Interchange Multi-Color Pill Markers --- */}
                {interchangeGroups.map((group, gi) => {
                  const c = stationCoords[group[0].id];
                  if (!c) return null;
                  const n = group.length;
                  // Determine pill orientation based on line direction at this point
                  // Horizontal pill for horizontal-running lines, vertical for vertical ones
                  const isVertical = (() => {
                    const id = group[0].id;
                    if (id.startsWith('N') || id.startsWith('CEN') || id.startsWith('BL') && c.x === 720) return true;
                    if (c.x === 1000) return true;
                    if (c.x === 1160 && c.y !== 680) return true;
                    if (c.x === 920 && c.y < 700) return false;
                    return false;
                  })();
                  const RX = isVertical ? 11 : 15;
                  const RY = isVertical ? 15 : 11;
                  const segmentColors = group.map(st => getLineColor(st.line));

                  return (
                    <g key={`interchange-pill-${gi}`} className="pointer-events-none">
                      {/* White background pill */}
                      <ellipse
                        cx={c.x} cy={c.y}
                        rx={RX + 3} ry={RY + 3}
                        fill="white"
                        stroke="#e2e8f0"
                        strokeWidth="1.5"
                        className="drop-shadow-sm"
                      />
                      {/* Color segments using clipPath */}
                      {segmentColors.map((_, si) => {
                        if (isVertical) {
                          const startY = c.y - RY + si * (2 * RY / n);
                          const segH = 2 * RY / n;
                          return (
                            <clipPath key={`clip-${gi}-${si}`} id={`seg-clip-${gi}-${si}`}>
                              <rect x={c.x - RX} y={startY} width={2 * RX} height={segH} />
                            </clipPath>
                          );
                        } else {
                          const startX = c.x - RX + si * (2 * RX / n);
                          const segW = 2 * RX / n;
                          return (
                            <clipPath key={`clip-${gi}-${si}`} id={`seg-clip-${gi}-${si}`}>
                              <rect x={startX} y={c.y - RY} width={segW} height={2 * RY} />
                            </clipPath>
                          );
                        }
                      })}
                      {segmentColors.map((color, si) => (
                        <ellipse
                          key={`seg-${gi}-${si}`}
                          cx={c.x} cy={c.y}
                          rx={RX} ry={RY}
                          fill={color}
                          clipPath={`url(#seg-clip-${gi}-${si})`}
                          opacity="0.9"
                        />
                      ))}
                      {/* Divider lines between segments */}
                      {segmentColors.slice(0, -1).map((_, si) => {
                        const frac = (si + 1) / n;
                        if (isVertical) {
                          const lineY = c.y - RY + frac * (2 * RY);
                          return <line key={`div-${gi}-${si}`} x1={c.x - RX} y1={lineY} x2={c.x + RX} y2={lineY} stroke="white" strokeWidth="1.5" />;
                        } else {
                          const lineX = c.x - RX + frac * (2 * RX);
                          return <line key={`div-${gi}-${si}`} x1={lineX} y1={c.y - RY} x2={lineX} y2={c.y + RY} stroke="white" strokeWidth="1.5" />;
                        }
                      })}
                      {/* Outer border on top */}
                      <ellipse
                        cx={c.x} cy={c.y}
                        rx={RX} ry={RY}
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                      />
                    </g>
                  );
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
                      {/* Ripple Glow - for selected start/end stations */}
                      {(isStart || isEnd) && (
                        <circle
                          cx={coords.x}
                          cy={coords.y}
                          r="22" fill="none"
                          stroke={isStart ? '#159E40' : '#003399'}
                          strokeWidth="3"
                          className="opacity-40"
                        />
                      )}

                      {/* Station Circle Body - hidden for interchange (pill from Stage 2.5 shows instead) */}
                      {(() => {
                        const grp = stationsByCoord[`${coords.x},${coords.y}`];
                        const isInterchangeNode = grp && grp.length > 1;
                        if (isInterchangeNode && !isStart && !isEnd) return null;
                        return (
                          <circle
                            cx={coords.x}
                            cy={coords.y}
                            r={isStart || isEnd ? '11' : inRoute ? '9' : '7.5'}
                            fill={isStart || isEnd ? '#ffffff' : inRoute ? strokeColor : '#ffffff'}
                            stroke={isStart || isEnd ? (isStart ? '#159E40' : '#003399') : strokeColor}
                            strokeWidth={isStart || isEnd ? '4' : '2.5'}
                            className="map-station"
                          />
                        );
                      })()}

                      {/* Station Code inside the dot - hidden for interchange (pill shows instead) */}
                      {!stationsByCoord[`${coords.x},${coords.y}`]?.length || stationsByCoord[`${coords.x},${coords.y}`].length <= 1 ? (
                        <text
                          x={coords.x}
                          y={coords.y + 1.6}
                          textAnchor="middle"
                          className={`text-[5px] font-extrabold select-none pointer-events-none transition-opacity ${isStart || isEnd ? (isStart ? 'fill-[#159E40]' : 'fill-[#003399]') : inRoute ? 'fill-white' : 'fill-black/80'
                            }`}
                        >
                          {st.id.split('_')[0]}
                        </text>
                      ) : null}

                    </g>
                  );
                })}
                {/* --- STAGE 3.5: Collision-aware station labels --- */}
                {labelPlacements.map((label) => (
                  <g key={`label-${label.key}`} className="pointer-events-none select-none">
                    {label.lines.map((line, lineIndex) => (
                      <text
                        key={`${label.key}-${line.kind}-${lineIndex}`}
                        x={label.x}
                        y={label.top + 6 + lineIndex * LINE_HEIGHT}
                        textAnchor={label.anchor}
                        stroke="white"
                        strokeWidth={line.kind === 'th' ? '2.4' : '2.1'}
                        strokeLinejoin="round"
                        paintOrder="stroke"
                        className={`${line.kind === 'th' ? 'text-[7px] font-bold fill-black/90' : 'text-[6.1px] font-semibold fill-black/75'} ${label.selected ? 'font-extrabold fill-black' : ''} ${isZoomedIn ? 'opacity-100' : 'opacity-90'} transition-opacity duration-300`}
                      >
                        {line.text}
                      </text>
                    ))}
                  </g>
                ))}
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

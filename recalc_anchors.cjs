const fs = require('fs');

const UNIT = 40;
const CEN_X = 1000;
const CEN_Y = 1000;

// Blue Line
const BL13 = { x: CEN_X, y: CEN_Y - 320 }; // (1000, 680)
const BL14 = { x: BL13.x + 1 * UNIT, y: BL13.y }; // (1040, 680)
const BL15 = { x: BL14.x + 1 * UNIT, y: BL14.y }; // (1080, 680)
const BL16 = { x: BL15.x + 2 * UNIT, y: BL15.y + 2 * UNIT }; // (1160, 760)
const BL22 = { x: BL16.x, y: BL16.y + 6 * UNIT }; // (1160, 1000)
const BL23 = { x: BL22.x, y: BL22.y + 1 * UNIT }; // (1160, 1040)
const BL24 = { x: BL23.x - 1 * UNIT, y: BL23.y + 1 * UNIT }; // (1120, 1080)
const BL26 = { x: BL24.x - 3 * UNIT, y: BL24.y }; // (1000, 1080)
const BL30 = { x: BL26.x - 4 * UNIT, y: BL26.y }; // (840, 1080)
const BL31 = { x: BL30.x - 1 * UNIT, y: BL30.y + 1 * UNIT }; // (800, 1120)
const BL01 = { x: BL31.x - 2 * UNIT, y: BL31.y }; // (720, 1120)
const BL08 = { x: BL01.x, y: BL01.y - 8 * UNIT }; // (720, 800)
const BL09 = { x: BL08.x + 3 * UNIT, y: BL08.y - 3 * UNIT }; // (840, 680)
const BL11 = { x: BL09.x + 2 * UNIT, y: BL09.y }; // (920, 680)
const BL34 = { x: BL01.x - 3 * UNIT, y: BL01.y }; // (600, 1120)
const BL38 = { x: BL34.x - 4 * UNIT, y: BL34.y }; // (440, 1120)

const BL_anchors = {
  BL13, BL14, BL15, BL16, BL22, BL23, BL24, BL26, BL30, BL31, BL01, BL08, BL09, BL11, BL34, BL38,
  BL01_2: BL01
};

// BTS Sukhumvit
const N_anchors = {
  CEN_S: { x: BL13.x, y: BL22.y }, // (1000, 1000)
  N2: { x: BL13.x, y: 1000 - 2 * UNIT }, // (1000, 920)
  N3: { x: BL13.x, y: 1000 - 3 * UNIT }, // (1000, 880)
  N8: BL13, // (1000, 680)
  N17: { x: BL13.x, y: 1000 - 17 * UNIT }, // (1000, 320)
  N24: { x: BL13.x, y: 1000 - 24 * UNIT }, // (1000, 40)
  E4: BL22, // (1160, 1000)
  E9: { x: 1160 + 5 * UNIT, y: 1000 }, // (1360, 1000)
  E15: { x: 1360 + 4 * UNIT, y: 1000 + 4 * UNIT }, // (1520, 1160)
  E23: { x: 1520, y: 1160 + 8 * UNIT }, // (1520, 1480)
};

// BTS Silom
const S_anchors = {
  CEN_L: N_anchors.CEN_S, // (1000, 1000)
  W1: { x: 1000 - 1 * UNIT, y: 1000 }, // (960, 1000)
  S2: BL26, // (1000, 1080)
  S3: { x: 1000 - 1 * UNIT, y: 1080 + 1 * UNIT }, // (960, 1120)
  S12: BL34, // (600, 1120)
};

// Pink Line
const PK16 = N_anchors.N17; // (1000, 320)
const PK14 = { x: 1000 - 2 * UNIT, y: 320 }; // (920, 320)
const PK05 = { x: 640, y: 320 }; // (640, 320)
const PK01 = { x: 640, y: 480 }; // (640, 480)
const PK30 = { x: 1000 + 14 * UNIT, y: 320 }; // (1560, 320)
const PK_anchors = { PK01, PK05, PK14, PK16, PK30 };

// Purple Line
const PP16 = { x: 880, y: 680 }; // BL10
const PP15 = { x: 880, y: 640 }; // North of Tao Poon
const PP12 = { x: 720, y: 480 }; // Corner
const PP11 = PK01; // (640, 480)
const PP06 = { x: 440, y: 480 }; // (440, 480)
const PP01 = { x: 240, y: 480 }; // (240, 480)
const PP_anchors = { PP16, PP15, PP12, PP11, PP06, PP01 };

// Yellow Line
const YL01 = BL15; // (1080, 680)
const YL10 = { x: 1080 + 7 * UNIT, y: 680 }; // (1360, 680)
const YL14 = { x: 1360 + 4 * UNIT, y: 680 + 4 * UNIT }; // (1520, 840)
const YL23 = N_anchors.E15; // (1520, 1160)
const YL_anchors = { YL01, YL10, YL14, YL23 };

// ARL
const A8 = N_anchors.N2; // (1000, 920)
const A6 = { x: 1160, y: 1000 - 1 * UNIT }; // (1160, 960)
const A7 = { x: 1000 + 1 * UNIT, y: 920 + 1 * UNIT }; // (1040, 960)
const A1 = { x: 1160 + 7 * UNIT, y: 960 }; // (1440, 960)
const ARL_anchors = { A8, A7, A6, A1 };

// SRT Red
const SRT_RW01 = BL11; // (920, 680)
const SRT_RW02 = PP15; // (880, 640)
const SRT_RW06 = { x: 640, y: 640 }; // (640, 640)
const SRT_RN06 = PK14; // (920, 320)
const SRT_RN10 = { x: 920, y: 320 - 4 * UNIT }; // (920, 160)
const SRT_anchors = { RW01: SRT_RW01, RW02: SRT_RW02, RW06: SRT_RW06, RN06: SRT_RN06, RN10: SRT_RN10 };

const anchorCoords = {
  ...N_anchors, ...S_anchors, ...BL_anchors, ...PP_anchors, ...PK_anchors, ...YL_anchors, ...ARL_anchors, ...SRT_anchors
};

let gd = fs.readFileSync('generate_data.cjs', 'utf8');
const regex = /const anchorCoords = \{[\s\S]*?\n\};\n\nconst finalCoords/;
const replacement = `const anchorCoords = ${JSON.stringify(anchorCoords, null, 2)};\n\nconst finalCoords`;
gd = gd.replace(regex, replacement);
fs.writeFileSync('generate_data.cjs', gd);
console.log("Updated generate_data.cjs with new Purple/Red Line geometry.");

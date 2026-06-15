const fs = require('fs');

const UNIT = 40;
const CEN_X = 1000;
const CEN_Y = 1000;

// BTS Sukhumvit
const N_anchors = {
  CEN_S: { x: CEN_X, y: CEN_Y },
  N2: { x: CEN_X, y: CEN_Y - 2 * UNIT }, // Phaya Thai
  N3: { x: CEN_X, y: CEN_Y - 3 * UNIT },
  N8: { x: CEN_X, y: CEN_Y - 8 * UNIT },
  N17: { x: CEN_X, y: CEN_Y - 17 * UNIT },
  N24: { x: CEN_X, y: CEN_Y - 24 * UNIT },
  
  E4: { x: CEN_X + 4 * UNIT, y: CEN_Y },
  E9: { x: CEN_X + 9 * UNIT, y: CEN_Y },
  E15: { x: CEN_X + 15 * UNIT, y: CEN_Y + 6 * UNIT }, // dx=6U, dy=6U
  E23: { x: CEN_X + 15 * UNIT, y: CEN_Y + 14 * UNIT }, // dx=0, dy=8U
};

// BTS Silom
const S_anchors = {
  CEN_L: { x: CEN_X, y: CEN_Y },
  W1: { x: CEN_X - 1 * UNIT, y: CEN_Y },
  S2: { x: CEN_X, y: CEN_Y + 2 * UNIT },
  S12: { x: CEN_X - 10 * UNIT, y: CEN_Y + 2 * UNIT }, // dx=-10U, dy=0
};

// MRT Blue Line Loop
const BL13 = N_anchors.N8;
const BL22 = N_anchors.E4;
const BL26 = S_anchors.S2;
const BL34 = S_anchors.S12;

const BL14 = { x: BL13.x + 1 * UNIT, y: BL13.y }; // dx=1U, dy=0
const BL17 = { x: BL14.x + 3 * UNIT, y: BL14.y + 3 * UNIT }; // dx=3U, dy=3U

const BL24 = { x: BL22.x - 2 * UNIT, y: BL22.y }; // dx=-2U, dy=0
const BL28 = { x: BL26.x - 2 * UNIT, y: BL26.y }; // dx=-2U, dy=0
const BL01 = { x: BL28.x - 5 * UNIT, y: BL28.y }; // dx=-5U, dy=0

const BL11 = { x: BL13.x - 2 * UNIT, y: BL13.y }; // dx=-2U, dy=0
const BL06 = { x: BL11.x, y: BL11.y + 5 * UNIT }; // dx=0, dy=5U

const BL38 = { x: BL34.x - 4 * UNIT, y: BL34.y };

const BL_anchors = {
  BL13, BL22, BL26, BL34,
  BL14, BL17, BL24, BL28, BL01, BL06, BL11, BL38,
  BL01_2: BL01 // Loop closure
};

// MRT Purple Line
const PP16 = { x: BL11.x - 1 * UNIT, y: BL11.y }; // dx=-1U, dy=0
const PP14 = { x: PP16.x - 2 * UNIT, y: PP16.y - 2 * UNIT }; // dx=-2U, dy=-2U
const PP11 = { x: PP14.x, y: PP14.y - 3 * UNIT }; // dx=0, dy=-3U
const PP06 = { x: PP11.x - 5 * UNIT, y: PP11.y - 5 * UNIT }; // dx=-5U, dy=-5U
const PP01 = { x: PP06.x - 5 * UNIT, y: PP06.y }; // dx=-5U, dy=0
const PP_anchors = { PP16, PP14, PP11, PP06, PP01 };

// MRT Pink Line
const PK01 = PP11;
const PK16 = N_anchors.N17;
const PK05 = { x: PK01.x, y: PK16.y }; // dx=0
const PK14 = { x: PK16.x - 2 * UNIT, y: PK16.y }; // dx=-2U, dy=0
const PK30 = { x: PK16.x + 14 * UNIT, y: PK16.y };
const PK_anchors = { PK01, PK05, PK14, PK16, PK30 };

// MRT Yellow Line
const YL01 = { x: BL14.x + 1 * UNIT, y: BL14.y + 1 * UNIT };
const YL10 = { x: YL01.x + 9 * UNIT, y: YL01.y }; // dx=9U, dy=0
const YL14 = { x: YL10.x + 4 * UNIT, y: YL10.y + 4 * UNIT }; // dx=4U, dy=4U
const YL23 = N_anchors.E15; // dx=0, dy=9U
const YL_anchors = { YL01, YL10, YL14, YL23 };

// ARL
const A8 = N_anchors.N2;
const A6 = { x: BL22.x, y: BL22.y - 1 * UNIT };
const A7 = { x: A8.x + 1 * UNIT, y: A8.y + 1 * UNIT }; // dx=1U, dy=1U. (45 degrees!)
const A1 = { x: A6.x + 5 * UNIT, y: A6.y };
const ARL_anchors = { A8, A7, A6, A1 };

// SRT Red
const SRT_RW01 = BL11;
const SRT_RN06 = PK14;
const SRT_RN10 = { x: SRT_RN06.x, y: SRT_RN06.y - 4 * UNIT };
const SRT_RW06 = { x: SRT_RW01.x - 6 * UNIT, y: SRT_RW01.y };
const SRT_anchors = { RW01: SRT_RW01, RN06: SRT_RN06, RN10: SRT_RN10, RW06: SRT_RW06 };

const anchorCoords = {
  ...N_anchors, ...S_anchors, ...BL_anchors, ...PP_anchors, ...PK_anchors, ...YL_anchors, ...ARL_anchors, ...SRT_anchors
};

let gd = fs.readFileSync('generate_data.cjs', 'utf8');
const regex = /const anchorCoords = \{[\s\S]*?\n\};\n\nconst finalCoords/;
const replacement = `const anchorCoords = ${JSON.stringify(anchorCoords, null, 2)};\n\nconst finalCoords`;
gd = gd.replace(regex, replacement);
fs.writeFileSync('generate_data.cjs', gd);
console.log("Updated generate_data.cjs with perfectly scaled and strict anchors.");

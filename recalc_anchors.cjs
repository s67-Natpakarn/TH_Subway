const fs = require('fs');

const UNIT = 30;
const CEN_X = 600;
const CEN_Y = 600;

// BTS Sukhumvit
const N_anchors = {
  CEN_S: { x: CEN_X, y: CEN_Y },
  N3: { x: CEN_X, y: CEN_Y - 3 * UNIT },
  N8: { x: CEN_X, y: CEN_Y - 8 * UNIT },
  N17: { x: CEN_X, y: CEN_Y - 17 * UNIT },
  N24: { x: CEN_X, y: CEN_Y - 24 * UNIT },
  
  E4: { x: CEN_X + 4 * UNIT, y: CEN_Y },
  E9: { x: CEN_X + 9 * UNIT, y: CEN_Y },
  // E9 to E15 bends 45 degrees SE. E9 is (870, 600). E15 is 6 stations away.
  // We'll just define E15 directly
  E15: { x: CEN_X + 13 * UNIT, y: CEN_Y + 4 * UNIT }, 
  // E15 to E23 goes South
  E23: { x: CEN_X + 13 * UNIT, y: CEN_Y + 12 * UNIT },
};

// BTS Silom
const S_anchors = {
  CEN_L: { x: CEN_X, y: CEN_Y },
  W1: { x: CEN_X - 1 * UNIT, y: CEN_Y },
  S2: { x: CEN_X, y: CEN_Y + 2 * UNIT },
  // S2 to S6 bends SW. S2 is (600, 660). S6 is 4 stations away.
  S6: { x: CEN_X - 4 * UNIT, y: CEN_Y + 6 * UNIT },
  // S6 to S12 goes West. S12 is 6 stations away.
  S12: { x: CEN_X - 10 * UNIT, y: CEN_Y + 6 * UNIT },
};

// MRT Blue Line Loop
// Chatuchak (BL13)
const BL13 = N_anchors.N8;
// Sukhumvit (BL22)
const BL22 = N_anchors.E4;
// Si Lom (BL26)
const BL26 = S_anchors.S2;

// Lat Phrao (BL15)
const BL15 = { x: BL22.x, y: BL13.y }; // (720, 360)
// Phetchaburi (BL21)
const BL21 = { x: BL22.x, y: BL22.y - 1 * UNIT }; // (720, 570)

// Hua Lamphong (BL28) - goes West from Si Lom
const BL28 = { x: BL26.x - 2 * UNIT, y: BL26.y }; // (540, 660)
// Tha Phra (BL01) - goes SW from Hua Lamphong
const BL01 = { x: BL28.x - 2 * UNIT, y: BL28.y + 2 * UNIT }; // (480, 720)
// Bang Wa (BL34) - S12
const BL34 = S_anchors.S12; // (300, 780)
// Lak Song (BL38) - West of Bang Wa
const BL38 = { x: BL34.x - 4 * UNIT, y: BL34.y };

// Bang Sue (BL11) - North of Tha Phra, West of Chatuchak
const BL11 = { x: BL01.x, y: BL13.y }; // (480, 360)
// Tao Poon (BL10) - West of Bang Sue
const BL10 = { x: BL11.x - 1 * UNIT, y: BL11.y }; // (450, 360)

const BL_anchors = {
  BL13, BL22, BL26, BL15, BL21, BL28, BL01, BL34, BL38, BL11, BL10,
  BL01_2: BL01 // Loop closure
};

// MRT Purple Line
const PP16 = BL10;
// Wong Sawang (PP14) - West of Tao Poon
const PP14 = { x: PP16.x - 2 * UNIT, y: PP16.y };
// Nonthaburi Civic Center (PP11) - North of Wong Sawang
const PP11 = { x: PP14.x, y: PP14.y - 3 * UNIT };
// Bang Rak Noi Tha It (PP06) - West of PP11
const PP06 = { x: PP11.x - 5 * UNIT, y: PP11.y };
// Khlong Bang Phai (PP01) - North of PP06
const PP01 = { x: PP06.x, y: PP06.y - 5 * UNIT };

const PP_anchors = { PP16, PP14, PP11, PP06, PP01 };

// MRT Pink Line
const PK01 = PP11;
// Pak Kret (PK06) - North of PK01
const PK06 = { x: PK01.x, y: N_anchors.N17.y };
// Lak Si (PK14) - East of Pak Kret
const PK14 = { x: PK06.x + 8 * UNIT, y: PK06.y };
// Wat Phra Sri (PK16) - N17
const PK16 = N_anchors.N17;
// Min Buri (PK30) - East of PK16
const PK30 = { x: PK16.x + 14 * UNIT, y: PK16.y };

const PK_anchors = { PK01, PK06, PK14, PK16, PK30 };

// MRT Yellow Line
const YL01 = BL15;
const YL23 = N_anchors.E15;
// Bang Kapi (YL08) - East of Lat Phrao, North of Samrong
const YL08 = { x: YL23.x, y: YL01.y };
const YL_anchors = { YL01, YL23, YL08 };

// ARL
const A8 = { x: CEN_X, y: CEN_Y - 2 * UNIT }; // N2 is Phaya Thai
const A6 = BL21;
// Hua Mak (A4) - East of Makkasan, crosses Yellow line
const A4 = { x: YL08.x, y: A6.y + 2 * UNIT };
const A1 = { x: A4.x + 3 * UNIT, y: A4.y + 1 * UNIT };
const ARL_anchors = { A8, A6, A4, A1 };

// SRT Red
const RW01 = BL11;
const RN06 = PK14;
const RN10 = { x: RN06.x, y: RN06.y - 4 * UNIT };
const RW06 = { x: RW01.x - 6 * UNIT, y: RW01.y + 2 * UNIT }; // Taling Chan (SW of Bang Sue)
const SRT_anchors = { RW01, RN06, RN10, RW06 };

const anchorCoords = {
  ...N_anchors, ...S_anchors, ...BL_anchors, ...PP_anchors, ...YL_anchors, ...PK_anchors, ...ARL_anchors, ...SRT_anchors
};

let gd = fs.readFileSync('generate_data.cjs', 'utf8');

// Replace the anchorCoords block in generate_data.cjs
const regex = /const anchorCoords = \{[\s\S]*?\n\};\n\nconst finalCoords/;
const replacement = `const anchorCoords = ${JSON.stringify(anchorCoords, null, 2)};\n\nconst finalCoords`;
gd = gd.replace(regex, replacement);

fs.writeFileSync('generate_data.cjs', gd);
console.log("Updated generate_data.cjs with topological anchors.");

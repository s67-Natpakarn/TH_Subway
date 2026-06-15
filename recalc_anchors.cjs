const fs = require('fs');

const UNIT = 20;
const CEN_X = 500;
const CEN_Y = 400;

// BTS Sukhumvit: N24 to E23
// N line goes North (decreasing Y), E line goes East (increasing X)
const N_anchors = {
  CEN_S: { x: CEN_X, y: CEN_Y },
  N3: { x: CEN_X, y: CEN_Y - 3 * UNIT },
  N8: { x: CEN_X, y: CEN_Y - 8 * UNIT },
  N17: { x: CEN_X, y: CEN_Y - 17 * UNIT },
  N24: { x: CEN_X, y: CEN_Y - 24 * UNIT },
  
  E4: { x: CEN_X + 4 * UNIT, y: CEN_Y },
  E9: { x: CEN_X + 9 * UNIT, y: CEN_Y },
  E15: { x: CEN_X + 15 * UNIT, y: CEN_Y },
  E23: { x: CEN_X + 23 * UNIT, y: CEN_Y },
};

// BTS Silom: W1 to S12
// W1 goes West, S line goes South (increasing Y)
const S_anchors = {
  CEN_L: { x: CEN_X, y: CEN_Y },
  W1: { x: CEN_X - 1 * UNIT, y: CEN_Y },
  S2: { x: CEN_X, y: CEN_Y + 2 * UNIT },
  S7: { x: CEN_X, y: CEN_Y + 7 * UNIT },
  // S12 turns west at S7
  S12: { x: CEN_X - 5 * UNIT, y: CEN_Y + 7 * UNIT },
};

// MRT Blue Line Loop
// Let's anchor it to interchanges: 
// BL13 (Chatuchak) = N8
// BL22 (Sukhumvit) = E4
// BL26 (Si Lom) = S2
const BL_anchors = {
  BL13: N_anchors.N8,
  BL22: N_anchors.E4,
  BL26: S_anchors.S2,
  
  // BL13 to BL22 is 9 stations.
  // BL13 is (CEN_X, CEN_Y - 8U). BL22 is (CEN_X + 4U, CEN_Y).
  // This forms a curve. Let's add anchors to make it rectangular.
  // Lat Phrao (BL15) is 2 stations east of Chatuchak.
  BL15: { x: CEN_X + 2 * UNIT, y: CEN_Y - 8 * UNIT },
  
  // Phetchaburi (BL21) is 1 station north of Sukhumvit.
  BL21: { x: CEN_X + 4 * UNIT, y: CEN_Y - 1 * UNIT },
  
  // Bang Sue (BL11) is 2 stations west of Chatuchak.
  BL11: { x: CEN_X - 2 * UNIT, y: CEN_Y - 8 * UNIT },
  
  // Tao Poon (BL10) is 1 station west of Bang Sue.
  BL10: { x: CEN_X - 3 * UNIT, y: CEN_Y - 8 * UNIT },
  
  // Tha Phra (BL01)
  BL01: { x: CEN_X - 10 * UNIT, y: CEN_Y + 2 * UNIT },
  
  // Bang Wa (BL34) = S12
  BL34: S_anchors.S12,
  
  // Lak Song (BL38) is 4 stations west of Bang Wa
  BL38: { x: S_anchors.S12.x - 4 * UNIT, y: S_anchors.S12.y },
};

// MRT Purple
// Tao Poon (PP16) = BL10
const PP_anchors = {
  PP16: BL_anchors.BL10,
  // Nonthaburi Civic Center (PP11) is 5 stations North/West.
  PP11: { x: BL_anchors.BL10.x - 5 * UNIT, y: BL_anchors.BL10.y },
  // Khlong Bang Phai (PP01) is 10 stations West of PP11.
  PP01: { x: BL_anchors.BL10.x - 15 * UNIT, y: BL_anchors.BL10.y },
};

// MRT Yellow
// Lat Phrao (YL01) = BL15
// Samrong (YL23) = E15
const YL_anchors = {
  YL01: BL_anchors.BL15,
  YL23: N_anchors.E15,
};

// MRT Pink
// Nonthaburi Civic Center (PK01) = PP11
// Lak Si (PK14) = 13 stations east
// Wat Phra Sri Mahathat (PK16) = N17
const PK_anchors = {
  PK01: PP_anchors.PP11,
  PK14: { x: N_anchors.N17.x - 2 * UNIT, y: N_anchors.N17.y },
  PK16: N_anchors.N17,
  // Min Buri (PK30) is 14 stations east of PK16
  PK30: { x: N_anchors.N17.x + 14 * UNIT, y: N_anchors.N17.y },
};

// ARL
// Phaya Thai (A8) = N3
// Makkasan (A6) = BL21
// Suvarnabhumi (A1) = 5 stations east
const ARL_anchors = {
  A8: N_anchors.N3,
  A6: BL_anchors.BL21,
  A1: { x: BL_anchors.BL21.x + 5 * UNIT, y: BL_anchors.BL21.y },
};

// SRT Red
// Bang Sue (RW01) = BL11
// Lak Si (RN06) = PK14
// Rangsit (RN10) = 4 stations north of Lak Si
const SRT_anchors = {
  RW01: BL_anchors.BL11,
  RN06: PK_anchors.PK14,
  RN10: { x: PK_anchors.PK14.x, y: PK_anchors.PK14.y - 4 * UNIT },
  RW06: { x: BL_anchors.BL11.x - 5 * UNIT, y: BL_anchors.BL11.y + 5 * UNIT }, // Taling Chan
};

const anchorCoords = {
  ...N_anchors, ...S_anchors, ...BL_anchors, ...PP_anchors, ...YL_anchors, ...PK_anchors, ...ARL_anchors, ...SRT_anchors
};

let gd = fs.readFileSync('generate_data.cjs', 'utf8');

// Replace the anchorCoords block in generate_data.cjs
const regex = /const anchorCoords = \{[\s\S]*?\n\};\n\nconst finalCoords/;
const replacement = `const anchorCoords = ${JSON.stringify(anchorCoords, null, 2)};\n\nconst finalCoords`;
gd = gd.replace(regex, replacement);

fs.writeFileSync('generate_data.cjs', gd);
console.log("Updated generate_data.cjs with exact uniform anchors.");

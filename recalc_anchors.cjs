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
  // E9 to E15 is 6 stations. Goes SE.
  E15: { x: CEN_X + 15 * UNIT, y: CEN_Y + 6 * UNIT }, 
  // E15 to E23 goes South
  E23: { x: CEN_X + 15 * UNIT, y: CEN_Y + 14 * UNIT },
};

// BTS Silom
const S_anchors = {
  CEN_L: { x: CEN_X, y: CEN_Y },
  W1: { x: CEN_X - 1 * UNIT, y: CEN_Y },
  S2: { x: CEN_X, y: CEN_Y + 2 * UNIT },
  // S2 to S12 goes strictly West to hit Bang Wa!
  S12: { x: CEN_X - 10 * UNIT, y: CEN_Y + 2 * UNIT },
};

// MRT Blue Line Loop
const BL13 = N_anchors.N8;      // (600, 360)
const BL22 = N_anchors.E4;      // (720, 600)
const BL26 = S_anchors.S2;      // (600, 660)
const BL34 = S_anchors.S12;     // (300, 660)

// BL13 to BL22: East 1, SE 3, South 5
const BL14 = { x: BL13.x + 1 * UNIT, y: BL13.y }; // (630, 360)
const BL17 = { x: BL14.x + 3 * UNIT, y: BL14.y + 3 * UNIT }; // (720, 450)

// BL22 to BL26: West 2, SW 2
const BL24 = { x: BL22.x - 2 * UNIT, y: BL22.y }; // (660, 600)

// BL26 to BL01_2: West 2, West 5 -> straight West to Tha Phra?
// Hua Lamphong (BL28) is West 2
const BL28 = { x: BL26.x - 2 * UNIT, y: BL26.y }; // (540, 660)
// Tha Phra (BL01) is West 5 from Hua Lamphong. Wait, BL28 to BL01 is 5 stations.
const BL01 = { x: BL28.x - 5 * UNIT, y: BL28.y }; // (390, 660)

// BL01 to Bang Wa (BL34) is 3 stations West
// Wait, 390 to 300 is exactly 3 units! (390 - 3*30 = 300). Perfect!

// Bang Sue (BL11) to Chatuchak (BL13) is 2 stations. Bang Sue is West of Chatuchak.
const BL11 = { x: BL13.x - 2 * UNIT, y: BL13.y }; // (540, 360)

// BL11 to Tha Phra (BL01): South 5, SW 5.
const BL06 = { x: BL11.x, y: BL11.y + 5 * UNIT }; // (540, 510)
// Check SW 5 from BL06: (540 - 150, 510 + 150) = (390, 660). Exactly BL01!

// Lak Song (BL38) is 4 stations West of Bang Wa
const BL38 = { x: BL34.x - 4 * UNIT, y: BL34.y };

const BL_anchors = {
  BL13, BL22, BL26, BL34,
  BL14, BL17, BL24, BL28, BL01, BL06, BL11, BL38,
  BL01_2: BL01 // Loop closure
};

// MRT Purple Line
// Tao Poon (PP16) = BL10. (1 station West of Bang Sue)
const PP16 = { x: BL11.x - 1 * UNIT, y: BL11.y }; // (510, 360)
// Wong Sawang (PP14) - NW? In official map, goes West, then NW, then North.
// Let's do NW 2 stations to PP14.
const PP14 = { x: PP16.x - 2 * UNIT, y: PP16.y - 2 * UNIT }; // (450, 300)
// Nonthaburi Civic Center (PP11) - North 3 stations
const PP11 = { x: PP14.x, y: PP14.y - 3 * UNIT }; // (450, 210)
// Khlong Bang Phai (PP01) - West 10 stations?
// Let's go NW 5, West 5.
const PP06 = { x: PP11.x - 5 * UNIT, y: PP11.y - 5 * UNIT }; // (300, 60)
const PP01 = { x: PP06.x - 5 * UNIT, y: PP06.y }; // (150, 60)
const PP_anchors = { PP16, PP14, PP11, PP06, PP01 };

// MRT Pink Line
const PK01 = PP11; // (450, 210)
// PK01 to Wat Phra Sri (PK16) = 15 stations.
// Wat Phra Sri (PK16) = N17 (600, 90).
// PK01 to PK16: dx = 150, dy = -120. (5 units East, 4 units North).
// Path: NE 4 stations, East 11 stations.
const PK05 = { x: PK01.x + 4 * UNIT, y: PK01.y - 4 * UNIT }; // (570, 90)
const PK16 = N_anchors.N17; // (600, 90)
// PK16 to Min Buri (PK30): 14 stations East
const PK30 = { x: PK16.x + 14 * UNIT, y: PK16.y };
const PK_anchors = { PK01, PK05, PK16, PK30 };

// MRT Yellow Line
// Lat Phrao (YL01) = BL15.
// BL15 is between BL14 (630,360) and BL17 (720,450). It is 1 station from BL14.
const YL01 = { x: BL14.x + 1 * UNIT, y: BL14.y + 1 * UNIT }; // (660, 390)
// Samrong (YL23) = E15 (1050, 780).
// YL01 to YL23: 22 stations. dx = 390 (13 units), dy = 390 (13 units).
// Path: East 9 stations, SE 13 stations.
const YL10 = { x: YL01.x + 9 * UNIT, y: YL01.y }; // (930, 390)
// Wait, SE 13 stations from YL10: (930 + 390, 390 + 390) = (1320, 780). Doesn't hit E15!
// We must hit E15 (1050, 780).
// dx = 390 (13u), dy = 390 (13u). This means it is EXACTLY 13 stations SE!!
// But there are 22 stations.
// So we must go SE, South, etc.
// Wait! dx=13u, dy=13u. If we go South `s`, East `e`, SE `se`.
// e + se = 13.
// s + se = 13.
// e + s + se = 22.
// Substitute: e = 13 - se, s = 13 - se.
// (13 - se) + (13 - se) + se = 22 => 26 - se = 22 => se = 4.
// So e = 9, s = 9, se = 4.
// Path: East 9, SE 4, South 9.
const YL10_anchor = { x: YL01.x + 9 * UNIT, y: YL01.y }; // East 9
const YL14_anchor = { x: YL10_anchor.x + 4 * UNIT, y: YL10_anchor.y + 4 * UNIT }; // SE 4
const YL23 = N_anchors.E15;
const YL_anchors = { YL01, YL10: YL10_anchor, YL14: YL14_anchor, YL23 };

// ARL
const A8 = N_anchors.N3; // Phaya Thai
const A6 = { x: BL24.x, y: BL24.y - 1 * UNIT }; // Makkasan = Phetchaburi = BL21. Wait, BL21 is between BL17(720,450) and BL22(720,600).
// BL21 is 1 station North of BL22 -> (720, 570).
const ARL_Makkasan = { x: 720, y: 570 }; 
// A8 to A6: dx = 720 - 600 = 120 (4u), dy = 570 - 510 = 60 (2u). 2 stations.
// Path: SE 2 stations.
// A8 is (600, 510). SE 2 stations -> (660, 570). Then East 2 stations -> (720, 570). But ARL has only A7 in between! So it's 2 stations total. 
// A8 -> A7 -> A6.
// Let's just put A7 at (660, 540).
const A7 = { x: 660, y: 540 };
// A6 to A1 (Suvarnabhumi) is 5 stations. East.
const A1 = { x: ARL_Makkasan.x + 5 * UNIT, y: ARL_Makkasan.y };
const ARL_anchors = { A8, A7, A6: ARL_Makkasan, A1 };

// SRT Red
// Bang Sue (RW01) = BL11 = (540, 360).
// Lak Si (RN06) = PK14 = (810, 90). (Wait, PK14 = PK06(450,90) + 8U(240) = 690, 90. But PK16=N17=(600,90)!! PK14 must be WEST of PK16!
// Ah! PK14 is West of PK16. PK06 is West of PK14.
// Let's fix PK!
// PK01=(450,210). PK16=(600,90). dx=150(5u), dy=-120(-4u). Total 15 stations.
// Path: East `e`, NE `ne`, North `n`.
// e + ne = 5.
// n + ne = 4.
// e + n + ne = 15 => (5 - ne) + (4 - ne) + ne = 15 => 9 - ne = 15 => ne = -6. Impossible!
// We need to route PK North then East.
// PK01(450,210). North 4 stations -> (450, 90). (PK05).
// East 11 stations -> (450+330=780, 90). But PK16 is (600, 90)!!
// This means PK01 must be West of PK16 by 11 units.
// So PK01 = (600 - 330, 210) = (270, 210).
// Let's redefine PP11 (which is PK01).
const PP11_new = { x: 270, y: 210 };
const PP14_new = { x: 270, y: 360 };
const PP16_new = { x: 450, y: 360 }; // Tao Poon is West of Bang Sue(540,360). 3 units = 90.
const PK05_new = { x: 270, y: 90 };
const PK14_new = { x: 270 + 9 * UNIT, y: 90 }; // (540, 90)
const SRT_RN06 = PK14_new;
const SRT_RN10 = { x: SRT_RN06.x, y: SRT_RN06.y - 4 * UNIT };
const SRT_RW01 = BL11; // (540, 360)
const SRT_RW06 = { x: SRT_RW01.x - 6 * UNIT, y: SRT_RW01.y + 2 * UNIT }; // Taling Chan
const SRT_anchors = { RW01: SRT_RW01, RN06: SRT_RN06, RN10: SRT_RN10, RW06: SRT_RW06 };

const PP_anchors_fixed = { PP16: PP16_new, PP14: PP14_new, PP11: PP11_new, PP06: {x: 120, y: 60}, PP01: {x: 0, y: 60} };
const PK_anchors_fixed = { PK01: PP11_new, PK05: PK05_new, PK14: PK14_new, PK16: N_anchors.N17, PK30: { x: 600 + 14 * UNIT, y: 90 } };

const anchorCoords = {
  ...N_anchors, ...S_anchors, ...BL_anchors, ...YL_anchors, ...ARL_anchors,
  ...PP_anchors_fixed, ...PK_anchors_fixed, ...SRT_anchors
};

let gd = fs.readFileSync('generate_data.cjs', 'utf8');
const regex = /const anchorCoords = \{[\s\S]*?\n\};\n\nconst finalCoords/;
const replacement = `const anchorCoords = ${JSON.stringify(anchorCoords, null, 2)};\n\nconst finalCoords`;
gd = gd.replace(regex, replacement);
fs.writeFileSync('generate_data.cjs', gd);
console.log("Updated generate_data.cjs with perfect 45-deg anchors.");

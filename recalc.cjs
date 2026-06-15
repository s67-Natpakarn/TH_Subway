const fs = require('fs');

const stationsData = {
  "BTS_SUKHUMVIT": [
    { id: "N24" }, { id: "N23" }, { id: "N22" }, { id: "N21" }, { id: "N20" }, { id: "N19" }, { id: "N18" }, { id: "N17" },
    { id: "N16" }, { id: "N15" }, { id: "N14" }, { id: "N13" }, { id: "N12" }, { id: "N11" }, { id: "N10" }, { id: "N9" }, { id: "N8" },
    { id: "N7" }, { id: "N5" }, { id: "N4" }, { id: "N3" }, { id: "N2" }, { id: "N1" }, { id: "CEN_S" },
    { id: "E1" }, { id: "E2" }, { id: "E3" }, { id: "E4" }, { id: "E5" }, { id: "E6" }, { id: "E7" }, { id: "E8" }, { id: "E9" },
    { id: "E10" }, { id: "E11" }, { id: "E12" }, { id: "E13" }, { id: "E14" }, { id: "E15" }, { id: "E16" }, { id: "E17" }, { id: "E18" }, { id: "E19" }, { id: "E20" }, { id: "E21" }, { id: "E22" }, { id: "E23" }
  ],
  "BTS_SILOM": [
    { id: "W1" }, { id: "CEN_L" }, { id: "S1" }, { id: "S2" }, { id: "S3" }, { id: "S4" }, { id: "S5" }, { id: "S6" }, { id: "S7" }, { id: "S8" }, { id: "S9" }, { id: "S10" }, { id: "S11" }, { id: "S12" }
  ],
  "MRT_BLUE": [
    { id: "BL01" }, { id: "BL02" }, { id: "BL03" }, { id: "BL04" }, { id: "BL05" }, { id: "BL06" }, { id: "BL07" }, { id: "BL08" }, { id: "BL09" }, { id: "BL10" },
    { id: "BL11" }, { id: "BL12" }, { id: "BL13" }, { id: "BL14" }, { id: "BL15" }, { id: "BL16" }, { id: "BL17" }, { id: "BL18" }, { id: "BL19" }, { id: "BL20" },
    { id: "BL21" }, { id: "BL22" }, { id: "BL23" }, { id: "BL24" }, { id: "BL25" }, { id: "BL26" }, { id: "BL27" }, { id: "BL28" }, { id: "BL29" }, { id: "BL30" },
    { id: "BL31" }, { id: "BL32" }, { id: "BL01_2" }, { id: "BL33" }, { id: "BL34" }, { id: "BL35" }, { id: "BL36" }, { id: "BL37" }, { id: "BL38" }
  ],
  "MRT_PURPLE": [
    { id: "PP01" }, { id: "PP02" }, { id: "PP03" }, { id: "PP04" }, { id: "PP05" }, { id: "PP06" }, { id: "PP07" }, { id: "PP08" }, { id: "PP09" }, { id: "PP10" },
    { id: "PP11" }, { id: "PP12" }, { id: "PP13" }, { id: "PP14" }, { id: "PP15" }, { id: "PP16" }
  ],
  "MRT_YELLOW": [
    { id: "YL01" }, { id: "YL02" }, { id: "YL03" }, { id: "YL04" }, { id: "YL05" }, { id: "YL06" }, { id: "YL07" }, { id: "YL08" }, { id: "YL09" }, { id: "YL10" },
    { id: "YL11" }, { id: "YL12" }, { id: "YL13" }, { id: "YL14" }, { id: "YL15" }, { id: "YL16" }, { id: "YL17" }, { id: "YL18" }, { id: "YL19" }, { id: "YL20" },
    { id: "YL21" }, { id: "YL22" }, { id: "YL23" }
  ],
  "MRT_PINK": [
    { id: "PK01" }, { id: "PK02" }, { id: "PK03" }, { id: "PK04" }, { id: "PK05" }, { id: "PK06" }, { id: "PK07" }, { id: "PK08" }, { id: "PK09" }, { id: "PK10" },
    { id: "PK11" }, { id: "PK12" }, { id: "PK13" }, { id: "PK14" }, { id: "PK15" }, { id: "PK16" }, { id: "PK17" }, { id: "PK18" }, { id: "PK19" }, { id: "PK20" },
    { id: "PK21" }, { id: "PK22" }, { id: "PK23" }, { id: "PK24" }, { id: "PK25" }, { id: "PK26" }, { id: "PK27" }, { id: "PK28" }, { id: "PK29" }, { id: "PK30" }
  ],
  "ARL": [
    { id: "A8" }, { id: "A7" }, { id: "A6" }, { id: "A5" }, { id: "A4" }, { id: "A3" }, { id: "A2" }, { id: "A1" }
  ],
  "SRT_RED": [
    { id: "RN10" }, { id: "RN09" }, { id: "RN08" }, { id: "RN07" }, { id: "RN06" }, { id: "RN05" }, { id: "RN04" }, { id: "RN03" }, { id: "RN02" }, { id: "RW01" },
    { id: "RW02" }, { id: "RW03" }, { id: "RW05" }, { id: "RW06" }
  ]
};

const UNIT = 15;

const anchorCoords = {
  // BTS Sukhumvit (Vertical to CEN, then Horizontal)
  CEN_S: { x: 500, y: 350 },
  N3: { x: 500, y: 350 - 3 * UNIT },
  N8: { x: 500, y: 350 - 7 * UNIT },
  N17: { x: 500, y: 350 - 16 * UNIT },
  N24: { x: 500, y: 350 - 23 * UNIT },
  
  E4: { x: 500 + 4 * UNIT, y: 350 },
  E9: { x: 500 + 9 * UNIT, y: 350 },
  E15: { x: 500 + 15 * UNIT, y: 350 },
  E23: { x: 500 + 23 * UNIT, y: 350 },

  // BTS Silom (Horizontal W1 to CEN, then Vertical South)
  CEN_L: { x: 500, y: 350 },
  W1: { x: 500 - 1 * UNIT, y: 350 },
  S2: { x: 500, y: 350 + 2 * UNIT },
  S7: { x: 500, y: 350 + 7 * UNIT },
  S12: { x: 500 - 5 * UNIT, y: 350 + 7 * UNIT }, // Turn west at S7

  // MRT Blue (Loop roughly, but we can make it a rectangle)
  BL22: { x: 500 + 4 * UNIT, y: 350 - 2 * UNIT }, // Asok is E4, BL22 is below it? E4 is 560, 350. Let's make Asok/Sukhumvit exact.
};

// Let's force interchanges to exact identical coordinates
anchorCoords.CEN_L = anchorCoords.CEN_S;
anchorCoords.BL22 = anchorCoords.E4;
anchorCoords.BL13 = anchorCoords.N8;
anchorCoords.BL26 = anchorCoords.S2;

// From BL13 (N8: 500, 245) to BL22 (E4: 560, 350) = 9 stations.
// X diff: +60, Y diff: +105. 
// We just add anchors to route it
anchorCoords.BL15 = { x: 500 + 8 * UNIT, y: anchorCoords.N8.y }; // Lat Phrao
anchorCoords.BL21 = { x: 500 + 4 * UNIT, y: 350 - 4 * UNIT }; // Phetchaburi

// We will let the script interpolate everything else directly!
// But wait, the previous code had a specific layout. I can just use a generic node layout script or just keep it simple.

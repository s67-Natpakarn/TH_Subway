const fs = require('fs');

const stationsData = {
  "BTS_SUKHUMVIT": [
    { id: "N24", en: "Khu Khot", th: "คูคต" },
    { id: "N23", en: "Yaek Kor Por Aor", th: "แยก คปอ." },
    { id: "N22", en: "Royal Thai Air Force Museum", th: "พิพิธภัณฑ์กองทัพอากาศ" },
    { id: "N21", en: "Bhumibol Adulyadej Hospital", th: "โรงพยาบาลภูมิพลอดุลยเดช" },
    { id: "N20", en: "Saphan Mai", th: "สะพานใหม่" },
    { id: "N19", en: "Sai Yud", th: "สายหยุด" },
    { id: "N18", en: "Phahon Yothin 59", th: "พหลโยธิน 59" },
    { id: "N17", en: "Wat Phra Sri Mahathat", th: "วัดพระศรีมหาธาตุ" },
    { id: "N16", en: "11th Infantry Regiment", th: "กรมทหารราบที่ 11" },
    { id: "N15", en: "Bang Bua", th: "บางบัว" },
    { id: "N14", en: "Royal Forest Department", th: "กรมป่าไม้" },
    { id: "N13", en: "Kasetsart University", th: "มหาวิทยาลัยเกษตรศาสตร์" },
    { id: "N12", en: "Sena Nikhom", th: "เสนานิคม" },
    { id: "N11", en: "Ratchayothin", th: "รัชโยธิน" },
    { id: "N10", en: "Phahon Yothin 24", th: "พหลโยธิน 24" },
    { id: "N9", en: "Ha Yaek Lat Phrao", th: "ห้าแยกลาดพร้าว" },
    { id: "N8", en: "Mo Chit", th: "หมอชิต" },
    { id: "N7", en: "Saphan Khwai", th: "สะพานควาย" },
    { id: "N5", en: "Ari", th: "อารีย์" },
    { id: "N4", en: "Sanam Pao", th: "สนามเป้า" },
    { id: "N3", en: "Victory Monument", th: "อนุสาวรีย์ชัยสมรภูมิ" },
    { id: "N2", en: "Phaya Thai", th: "พญาไท" },
    { id: "N1", en: "Ratchathewi", th: "ราชเทวี" },
    { id: "CEN_S", en: "Siam (Sukhumvit)", th: "สยาม" },
    { id: "E1", en: "Chit Lom", th: "ชิดลม" },
    { id: "E2", en: "Phloen Chit", th: "เพลินจิต" },
    { id: "E3", en: "Nana", th: "นานา" },
    { id: "E4", en: "Asok", th: "อโศก" },
    { id: "E5", en: "Phrom Phong", th: "พร้อมพงษ์" },
    { id: "E6", en: "Thong Lo", th: "ทองหล่อ" },
    { id: "E7", en: "Ekkamai", th: "เอกมัย" },
    { id: "E8", en: "Phra Khanong", th: "พระโขนง" },
    { id: "E9", en: "On Nut", th: "อ่อนนุช" },
    { id: "E10", en: "Bang Chak", th: "บางจาก" },
    { id: "E11", en: "Punnawithi", th: "ปุณณวิถี" },
    { id: "E12", en: "Udom Suk", th: "อุดมสุข" },
    { id: "E13", en: "Bang Na", th: "บางนา" },
    { id: "E14", en: "Bearing", th: "แบริ่ง" },
    { id: "E15", en: "Samrong", th: "สำโรง" },
    { id: "E16", en: "Pu Chao", th: "ปู่เจ้า" },
    { id: "E17", en: "Chang Erawan", th: "ช้างเอราวัณ" },
    { id: "E18", en: "Royal Thai Naval Academy", th: "โรงเรียนนายเรือ" },
    { id: "E19", en: "Pak Nam", th: "ปากน้ำ" },
    { id: "E20", en: "Srinagarindra", th: "ศรีนครินทร์" },
    { id: "E21", en: "Phraek Sa", th: "แพรกษา" },
    { id: "E22", en: "Sai Luat", th: "สายลวด" },
    { id: "E23", en: "Kheha", th: "เคหะฯ" }
  ],
  "BTS_SILOM": [
    { id: "W1", en: "National Stadium", th: "สนามกีฬาแห่งชาติ" },
    { id: "CEN_L", en: "Siam (Silom)", th: "สยาม" },
    { id: "S1", en: "Ratchadamri", th: "ราชดำริ" },
    { id: "S2", en: "Sala Daeng", th: "ศาลาแดง" },
    { id: "S3", en: "Chong Nonsi", th: "ช่องนนทรี" },
    { id: "S4", en: "Saint Louis", th: "เซนต์หลุยส์" },
    { id: "S5", en: "Surasak", th: "สุรศักดิ์" },
    { id: "S6", en: "Saphan Taksin", th: "สะพานตากสิน" },
    { id: "S7", en: "Krung Thon Buri", th: "กรุงธนบุรี" },
    { id: "S8", en: "Wongwian Yai", th: "วงเวียนใหญ่" },
    { id: "S9", en: "Pho Nimit", th: "โพธิ์นิมิตร" },
    { id: "S10", en: "Talat Phlu", th: "ตลาดพลู" },
    { id: "S11", en: "Wutthakat", th: "วุฒากาศ" },
    { id: "S12", en: "Bang Wa", th: "บางหว้า" }
  ],
  "MRT_BLUE": [
    { id: "BL01", en: "Tha Phra", th: "ท่าพระ" },
    { id: "BL02", en: "Charan 13", th: "จรัญฯ 13" },
    { id: "BL03", en: "Fai Chai", th: "ไฟฉาย" },
    { id: "BL04", en: "Bang Khun Non", th: "บางขุนนนท์" },
    { id: "BL05", en: "Bang Yi Khan", th: "บางยี่ขัน" },
    { id: "BL06", en: "Sirindhorn", th: "สิรินธร" },
    { id: "BL07", en: "Bang Phlat", th: "บางพลัด" },
    { id: "BL08", en: "Bang O", th: "บางอ้อ" },
    { id: "BL09", en: "Bang Pho", th: "บางโพ" },
    { id: "BL10", en: "Tao Poon", th: "เตาปูน" },
    { id: "BL11", en: "Bang Sue", th: "บางซื่อ" },
    { id: "BL12", en: "Kamphaeng Phet", th: "กำแพงเพชร" },
    { id: "BL13", en: "Chatuchak Park", th: "สวนจตุจักร" },
    { id: "BL14", en: "Phahon Yothin", th: "พหลโยธิน" },
    { id: "BL15", en: "Lat Phrao", th: "ลาดพร้าว" },
    { id: "BL16", en: "Ratchadaphisek", th: "รัชดาภิเษก" },
    { id: "BL17", en: "Sutthisan", th: "สุทธิสาร" },
    { id: "BL18", en: "Huai Khwang", th: "ห้วยขวาง" },
    { id: "BL19", en: "Thailand Cultural Centre", th: "ศูนย์วัฒนธรรมแห่งประเทศไทย" },
    { id: "BL20", en: "Phra Ram 9", th: "พระราม 9" },
    { id: "BL21", en: "Phetchaburi", th: "เพชรบุรี" },
    { id: "BL22", en: "Sukhumvit", th: "สุขุมวิท" },
    { id: "BL23", en: "Queen Sirikit National Convention Centre", th: "ศูนย์การประชุมแห่งชาติสิริกิติ์" },
    { id: "BL24", en: "Khlong Toei", th: "คลองเตย" },
    { id: "BL25", en: "Lumphini", th: "ลุมพินี" },
    { id: "BL26", en: "Si Lom", th: "สีลม" },
    { id: "BL27", en: "Sam Yan", th: "สามย่าน" },
    { id: "BL28", en: "Hua Lamphong", th: "หัวลำโพง" },
    { id: "BL29", en: "Wat Mangkon", th: "วัดมังกร" },
    { id: "BL30", en: "Sam Yot", th: "สามยอด" },
    { id: "BL31", en: "Sanam Chai", th: "สนามไชย" },
    { id: "BL32", en: "Itsaraphap", th: "อิสรภาพ" },
    { id: "BL01_2", en: "Tha Phra", th: "ท่าพระ" },
    { id: "BL33", en: "Bang Phai", th: "บางไผ่" },
    { id: "BL34", en: "Bang Wa", th: "บางหว้า" },
    { id: "BL35", en: "Phetkasem 48", th: "เพชรเกษม 48" },
    { id: "BL36", en: "Phasi Charoen", th: "ภาษีเจริญ" },
    { id: "BL37", en: "Bang Khae", th: "บางแค" },
    { id: "BL38", en: "Lak Song", th: "หลักสอง" }
  ],
  "MRT_PURPLE": [
    { id: "PP01", en: "Khlong Bang Phai", th: "คลองบางไผ่" },
    { id: "PP02", en: "Talad Bang Yai", th: "ตลาดบางใหญ่" },
    { id: "PP03", en: "Sam Yaek Bang Yai", th: "สามแยกบางใหญ่" },
    { id: "PP04", en: "Bang Phlu", th: "บางพลู" },
    { id: "PP05", en: "Bang Rak Yai", th: "บางรักใหญ่" },
    { id: "PP06", en: "Bang Rak Noi Tha It", th: "บางรักน้อย-ท่าอิฐ" },
    { id: "PP07", en: "Sai Ma", th: "ไทรม้า" },
    { id: "PP08", en: "Phra Nangklao Bridge", th: "สะพานพระนั่งเกล้า" },
    { id: "PP09", en: "Yaek Nonthaburi 1", th: "แยกนนทบุรี 1" },
    { id: "PP10", en: "Bang Krasor", th: "บางกระสอ" },
    { id: "PP11", en: "Nonthaburi Civic Center", th: "ศูนย์ราชการนนทบุรี" },
    { id: "PP12", en: "Ministry of Public Health", th: "กระทรวงสาธารณสุข" },
    { id: "PP13", en: "Yaek Tiwanon", th: "แยกติวานนท์" },
    { id: "PP14", en: "Wong Sawang", th: "วงศ์สว่าง" },
    { id: "PP15", en: "Bang Son", th: "บางซ่อน" },
    { id: "PP16", en: "Tao Poon", th: "เตาปูน" }
  ],
  "MRT_YELLOW": [
    { id: "YL01", en: "Lat Phrao", th: "ลาดพร้าว" },
    { id: "YL02", en: "Phawana", th: "ภาวนา" },
    { id: "YL03", en: "Chok Chai 4", th: "โชคชัย 4" },
    { id: "YL04", en: "Lat Phrao 71", th: "ลาดพร้าว 71" },
    { id: "YL05", en: "Lat Phrao 83", th: "ลาดพร้าว 83" },
    { id: "YL06", en: "Mahatthai", th: "มหาดไทย" },
    { id: "YL07", en: "Lat Phrao 101", th: "ลาดพร้าว 101" },
    { id: "YL08", en: "Bang Kapi", th: "บางกะปิ" },
    { id: "YL09", en: "Yaek Lam Sali", th: "แยกลำสาลี" },
    { id: "YL10", en: "Si Kritha", th: "ศรีกรีฑา" },
    { id: "YL11", en: "Hua Mak", th: "หัวหมาก" },
    { id: "YL12", en: "Kalantan", th: "กลันตัน" },
    { id: "YL13", en: "Si Nut", th: "ศรีนุช" },
    { id: "YL14", en: "Srinagarindra 38", th: "ศรีนครินทร์ 38" },
    { id: "YL15", en: "Suan Luang Rama IX", th: "สวนหลวง ร.9" },
    { id: "YL16", en: "Si Udom", th: "ศรีอุดม" },
    { id: "YL17", en: "Si Iam", th: "ศรีเอี่ยม" },
    { id: "YL18", en: "Si La Salle", th: "ศรีลาซาล" },
    { id: "YL19", en: "Si Bearing", th: "ศรีแบริ่ง" },
    { id: "YL20", en: "Si Dan", th: "ศรีด่าน" },
    { id: "YL21", en: "Si Thepha", th: "ศรีเทพา" },
    { id: "YL22", en: "Thipphawan", th: "ทิพวัล" },
    { id: "YL23", en: "Samrong", th: "สำโรง" }
  ],
  "MRT_PINK": [
    { id: "PK01", en: "Nonthaburi Civic Center", th: "ศูนย์ราชการนนทบุรี" },
    { id: "PK02", en: "Khae Rai", th: "แคราย" },
    { id: "PK03", en: "Sanambin Nam", th: "สนามบินน้ำ" },
    { id: "PK04", en: "Samakkhi", th: "สามัคคี" },
    { id: "PK05", en: "Royal Irrigation Department", th: "กรมชลประทาน" },
    { id: "PK06", en: "Yaek Pak Kret", th: "แยกปากเกร็ด" },
    { id: "PK07", en: "Pak Kret Bypass", th: "เลี่ยงเมืองปากเกร็ด" },
    { id: "PK08", en: "Chaeng Watthana-Pak Kret 28", th: "แจ้งวัฒนะ-ปากเกร็ด 28" },
    { id: "PK09", en: "Si Rat", th: "ศรีรัช" },
    { id: "PK10", en: "Muang Thong Thani", th: "เมืองทองธานี" },
    { id: "PK11", en: "Chaeng Watthana 14", th: "แจ้งวัฒนะ 14" },
    { id: "PK12", en: "Government Complex", th: "ศูนย์ราชการเฉลิมพระเกียรติ" },
    { id: "PK13", en: "National Telecom", th: "โทรคมนาคมแห่งชาติ" },
    { id: "PK14", en: "Lak Si", th: "หลักสี่" },
    { id: "PK15", en: "Rajabhat Phranakhon", th: "ราชภัฏพระนคร" },
    { id: "PK16", en: "Wat Phra Sri Mahathat", th: "วัดพระศรีมหาธาตุ" },
    { id: "PK17", en: "Ram Inthra 3", th: "รามอินทรา 3" },
    { id: "PK18", en: "Lat Pla Khao", th: "ลาดปลาเค้า" },
    { id: "PK19", en: "Ram Inthra Kor Mor 4", th: "รามอินทรา กม. 4" },
    { id: "PK20", en: "Maiyalap", th: "มัยลาภ" },
    { id: "PK21", en: "Vacharaphol", th: "วัชรพล" },
    { id: "PK22", en: "Ram Inthra Kor Mor 6", th: "รามอินทรา กม. 6" },
    { id: "PK23", en: "Khu Bon", th: "คู้บอน" },
    { id: "PK24", en: "Ram Inthra Kor Mor 9", th: "รามอินทรา กม. 9" },
    { id: "PK25", en: "Outer Ring Road - Ram Inthra", th: "วงแหวนรามอินทรา" },
    { id: "PK26", en: "Nopparat", th: "นพรัตน์" },
    { id: "PK27", en: "Bang Chan", th: "บางชัน" },
    { id: "PK28", en: "Setthabutbamphen", th: "เศรษฐบุตรบำเพ็ญ" },
    { id: "PK29", en: "Min Buri Market", th: "ตลาดมีนบุรี" },
    { id: "PK30", en: "Min Buri", th: "มีนบุรี" }
  ],
  "ARL": [
    { id: "A8", en: "Phaya Thai", th: "พญาไท" },
    { id: "A7", en: "Ratchaprarop", th: "ราชปรารภ" },
    { id: "A6", en: "Makkasan", th: "มักกะสัน" },
    { id: "A5", en: "Ramkhamhaeng", th: "รามคำแหง" },
    { id: "A4", en: "Hua Mak", th: "หัวหมาก" },
    { id: "A3", en: "Ban Thap Chang", th: "บ้านทับช้าง" },
    { id: "A2", en: "Lat Krabang", th: "ลาดกระบัง" },
    { id: "A1", en: "Suvarnabhumi", th: "สุวรรณภูมิ" }
  ],
  "SRT_RED": [
    { id: "RN10", en: "Rangsit", th: "รังสิต" },
    { id: "RN09", en: "Lak Hok", th: "หลักหก" },
    { id: "RN08", en: "Don Mueang", th: "ดอนเมือง" },
    { id: "RN07", en: "Kan Kheha", th: "การเคหะ" },
    { id: "RN06", en: "Lak Si", th: "หลักสี่" },
    { id: "RN05", en: "Thung Song Hong", th: "ทุ่งสองห้อง" },
    { id: "RN04", en: "Bang Khen", th: "บางเขน" },
    { id: "RN03", en: "Wat Samian Nari", th: "วัดเสมียนนารี" },
    { id: "RN02", en: "Chatuchak", th: "จตุจักร" },
    { id: "RW01", en: "Krung Thep Aphiwat", th: "กรุงเทพอภิวัฒน์" },
    { id: "RW02", en: "Bang Son", th: "บางซ่อน" },
    { id: "RW03", en: "Bang Bamru", th: "บางบำหรุ" },
    { id: "RW05", en: "Bang Ramat", th: "บางระมาด" },
    { id: "RW06", en: "Taling Chan", th: "ตลิ่งชัน" }
  ]
};

const anchorCoords = {
  // BTS Sukhumvit
  N24: { x: 450, y: 30 },
  N17: { x: 450, y: 90 },
  N8: { x: 450, y: 155 },
  N3: { x: 450, y: 250 },
  CEN_S: { x: 450, y: 320 },
  E4: { x: 600, y: 320 },
  E9: { x: 720, y: 320 },
  E15: { x: 840, y: 320 },
  E23: { x: 950, y: 320 },

  // BTS Silom
  W1: { x: 380, y: 340 },
  CEN_L: { x: 450, y: 340 },
  S2: { x: 450, y: 410 },
  S7: { x: 360, y: 480 },
  S12: { x: 260, y: 480 },

  // MRT Blue
  BL10: { x: 260, y: 155 },
  BL11: { x: 340, y: 155 },
  BL13: { x: 500, y: 155 },
  BL15: { x: 600, y: 155 },
  BL21: { x: 600, y: 235 },
  BL22: { x: 600, y: 355 },
  BL26: { x: 500, y: 410 },
  BL01: { x: 260, y: 390 },
  BL34: { x: 230, y: 480 },
  BL38: { x: 130, y: 480 },

  // MRT Purple
  PP01: { x: 50, y: 155 },
  PP11: { x: 150, y: 155 },
  PP16: { x: 230, y: 155 },

  // MRT Yellow
  YL01: { x: 650, y: 155 },
  YL23: { x: 840, y: 275 },

  // MRT Pink
  PK01: { x: 150, y: 90 },
  PK14: { x: 340, y: 90 },
  PK16: { x: 500, y: 90 },
  PK30: { x: 780, y: 90 },

  // ARL
  A8: { x: 450, y: 205 },
  A6: { x: 560, y: 205 },
  A1: { x: 880, y: 205 },

  // SRT Red
  RN10: { x: 340, y: 30 },
  RN06: { x: 340, y: 115 },
  RW01: { x: 310, y: 155 },
  RW06: { x: 130, y: 235 }
};

const finalCoords = {};

for (const line in stationsData) {
  const lineStations = stationsData[line];
  let lastAnchorIdx = 0;
  let nextAnchorIdx = -1;

  for (let i = 0; i < lineStations.length; i++) {
    const st = lineStations[i];
    if (anchorCoords[st.id]) {
      finalCoords[st.id] = anchorCoords[st.id];
      lastAnchorIdx = i;
      nextAnchorIdx = -1;
      // find next anchor
      for (let j = i + 1; j < lineStations.length; j++) {
        if (anchorCoords[lineStations[j].id]) {
          nextAnchorIdx = j;
          break;
        }
      }
    } else {
      // interpolate between lastAnchor and nextAnchor
      // If there is no next anchor, wait, there should always be a next anchor for end-points if we didn't specify one?
      // actually, all endpoints are in anchorCoords.
      if (nextAnchorIdx !== -1) {
        const lastAnchor = anchorCoords[lineStations[lastAnchorIdx].id];
        const nextAnchor = anchorCoords[lineStations[nextAnchorIdx].id];
        const totalSegments = nextAnchorIdx - lastAnchorIdx;
        const currentSegment = i - lastAnchorIdx;
        const x = lastAnchor.x + ((nextAnchor.x - lastAnchor.x) / totalSegments) * currentSegment;
        const y = lastAnchor.y + ((nextAnchor.y - lastAnchor.y) / totalSegments) * currentSegment;
        finalCoords[st.id] = { x: Math.round(x * 10) / 10, y: Math.round(y * 10) / 10 };
      }
    }
  }
}

// Generate the transitGraph.json
const outputGraph = {
  stations: {},
  edges: []
};

// Insert stations
for (const line in stationsData) {
  for (const st of stationsData[line]) {
    // skip BL01_2 to prevent duplicate stations object, it's just a routing artifact
    if (st.id === "BL01_2") continue;
    
    outputGraph.stations[st.id] = {
      id: st.id,
      nameEN: st.en,
      nameTH: st.th,
      line: line
    };
  }
}

// Generate linear edges with generic weights/fares
for (const line in stationsData) {
  const lineStations = stationsData[line];
  for (let i = 0; i < lineStations.length - 1; i++) {
    const from = lineStations[i].id;
    let to = lineStations[i+1].id;
    if (to === "BL01_2") to = "BL01"; // loop closure for Blue line
    if (from === "BL01_2") continue; 

    // Find the weight (just linear distance approx or fixed cost)
    // we use a fixed weight of 2 per segment, and a fare of 2
    outputGraph.edges.push({
      from,
      to,
      weight: 2,
      fare: 2
    });
  }
}

// Add interchange edges
const interchanges = [
  { from: "N8", to: "BL13" }, // Mo Chit / Chatuchak
  { from: "E4", to: "BL22" }, // Asok / Sukhumvit
  { from: "S2", to: "BL26" }, // Sala Daeng / Si Lom
  { from: "N3", to: "A8" },   // Phaya Thai
  { from: "RW01", to: "BL11" }, // Krung Thep Aphiwat / Bang Sue
  { from: "A6", to: "BL21" }, // Makkasan / Phetchaburi
  { from: "CEN_S", to: "CEN_L", type: "cross-platform" }, // Siam
  { from: "BL10", to: "PP16", type: "cross-platform" }, // Tao Poon
  { from: "S12", to: "BL34" }, // Bang Wa
  { from: "YL01", to: "BL15" }, // Lat Phrao
  { from: "YL23", to: "E15" }, // Samrong
  { from: "PK01", to: "PP11" }, // Nonthaburi Civic Center
  { from: "PK14", to: "RN06" }, // Lak Si
  { from: "PK16", to: "N17" } // Wat Phra Sri Mahathat
];

for (const inter of interchanges) {
  outputGraph.edges.push({
    from: inter.from,
    to: inter.to,
    weight: inter.type === "cross-platform" ? 1 : 4,
    fare: 0,
    type: inter.type || "interchange"
  });
}

// Output files
fs.writeFileSync('src/data/transitGraph.json', JSON.stringify(outputGraph, null, 2));
fs.writeFileSync('newCoords.json', JSON.stringify(finalCoords, null, 2));

console.log('Generated transitGraph.json and newCoords.json successfully!');

/**
 * Line metadata files — one per transit line.
 * These export static info about each line (not station data, which stays in transitGraph.json).
 */

// ──────────────────────────────────────────────
// BTS Sukhumvit Line
// ──────────────────────────────────────────────
export const BTS_SUKHUMVIT_INFO = {
  id: 'BTS_SUKHUMVIT' as const,
  nameTH: 'BTS สายสุขุมวิท',
  nameEN: 'BTS Sukhumvit Line',
  color: '#159E40',
  stationCount: 47,
  termini: { north: 'Khu Khot (N24)', south: 'Bearing (E23) / Samrong area' },
  notes: 'รถไฟฟ้า BTS สายสุขุมวิท วิ่งจากสถานีคูคต (N24) ผ่านใจกลางเมืองที่สยาม (CEN) ไปยังแบริ่ง และสาขาตะวันออก',
};

// ──────────────────────────────────────────────
// BTS Silom Line
// ──────────────────────────────────────────────
export const BTS_SILOM_INFO = {
  id: 'BTS_SILOM' as const,
  nameTH: 'BTS สายสีลม',
  nameEN: 'BTS Silom Line',
  color: '#006432',
  stationCount: 14,
  termini: { north: 'National Stadium (W1)', south: 'Bang Wa (S12)' },
  notes: 'รถไฟฟ้า BTS สายสีลม วิ่งจากสถานีสนามกีฬาแห่งชาติ ผ่านสีลม-สาทร ไปยังบางหว้า',
};

// ──────────────────────────────────────────────
// MRT Blue Line
// ──────────────────────────────────────────────
export const MRT_BLUE_INFO = {
  id: 'MRT_BLUE' as const,
  nameTH: 'MRT สายสีน้ำเงิน',
  nameEN: 'MRT Blue Line',
  color: '#003399',
  stationCount: 38,
  termini: { loop: 'วนรอบ Tao Poon ↔ Hua Lamphong ↔ Lak Song' },
  notes: 'รถไฟใต้ดิน MRT สายสีน้ำเงิน เป็นเส้นทางวนรอบเชื่อม ท่าพระ-บางซื่อ',
};

// ──────────────────────────────────────────────
// MRT Purple Line
// ──────────────────────────────────────────────
export const MRT_PURPLE_INFO = {
  id: 'MRT_PURPLE' as const,
  nameTH: 'MRT สายสีม่วง',
  nameEN: 'MRT Purple Line',
  color: '#800080',
  stationCount: 16,
  termini: { south: 'Tao Poon (PP01)', north: 'Khlong Bang Phai (PP16)' },
  notes: 'MRT สายสีม่วง วิ่งจากเตาปูนไปนนทบุรี เชื่อมต่อ MRT สายสีน้ำเงินที่เตาปูน',
};

// ──────────────────────────────────────────────
// MRT Yellow Line
// ──────────────────────────────────────────────
export const MRT_YELLOW_INFO = {
  id: 'MRT_YELLOW' as const,
  nameTH: 'MRT สายสีเหลือง',
  nameEN: 'MRT Yellow Line',
  color: '#FCD116',
  stationCount: 23,
  termini: { west: 'Lat Phrao (YL01)', east: 'Samrong (YL23)' },
  notes: 'MRT สายสีเหลือง (โมโนเรล) วิ่งจากลาดพร้าวไปสำโรง',
};

// ──────────────────────────────────────────────
// MRT Pink Line
// ──────────────────────────────────────────────
export const MRT_PINK_INFO = {
  id: 'MRT_PINK' as const,
  nameTH: 'MRT สายสีชมพู',
  nameEN: 'MRT Pink Line',
  color: '#FF66B2',
  stationCount: 30,
  termini: { west: 'Nonthaburi Civic Center (PK01)', east: 'Minburi (PK30)' },
  notes: 'MRT สายสีชมพู (โมโนเรล) วิ่งจากศูนย์ราชการนนทบุรีไปมีนบุรี',
};

// ──────────────────────────────────────────────
// Airport Rail Link (ARL)
// ──────────────────────────────────────────────
export const ARL_INFO = {
  id: 'ARL' as const,
  nameTH: 'Airport Rail Link',
  nameEN: 'Suvarnabhumi Airport Rail Link',
  color: '#800000',
  stationCount: 8,
  termini: { city: 'Phaya Thai (A8)', airport: 'Suvarnabhumi Airport (A1)' },
  notes: 'รถไฟเชื่อมท่าอากาศยานสุวรรณภูมิ วิ่งจากพญาไทถึงสนามบิน',
};

// ──────────────────────────────────────────────
// SRT Red Line
// ──────────────────────────────────────────────
export const SRT_RED_INFO = {
  id: 'SRT_RED' as const,
  nameTH: 'รถไฟชานเมืองสายสีแดง',
  nameEN: 'SRT Red Line',
  color: '#E60000',
  stationCount: 14,
  termini: { north: 'Rangsit (RN10)', south: 'Taling Chan (RW06)', hub: 'Bang Sue Grand Station' },
  notes: 'รถไฟชานเมืองสายสีแดง วิ่งจากรังสิตผ่านบางซื่อ (สถานีกลางบางซื่อ) ไปตลิ่งชัน',
};

// Re-export all as a unified map
export const ALL_LINE_INFO = {
  BTS_SUKHUMVIT: BTS_SUKHUMVIT_INFO,
  BTS_SILOM: BTS_SILOM_INFO,
  MRT_BLUE: MRT_BLUE_INFO,
  MRT_PURPLE: MRT_PURPLE_INFO,
  MRT_YELLOW: MRT_YELLOW_INFO,
  MRT_PINK: MRT_PINK_INFO,
  ARL: ARL_INFO,
  SRT_RED: SRT_RED_INFO,
} as const;

export type LineId = keyof typeof ALL_LINE_INFO;

export function getLineInfo(lineId: string) {
  return ALL_LINE_INFO[lineId as LineId] ?? null;
}

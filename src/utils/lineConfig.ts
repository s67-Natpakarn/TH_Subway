/**
 * Centralized line configuration for all transit lines.
 * Single source of truth for colors, labels, and operators.
 */

export interface LineConfig {
  id: string;
  nameTH: string;
  nameEN: string;
  shortName: string;
  color: string;           // hex color
  lightColor: string;      // lighter tint for backgrounds
  operator: string;        // operator code
  operatorNameTH: string;
  tailwindBg: string;      // tailwind class
  tailwindText: string;
  tailwindBorder: string;
  tailwindRing: string;
}

export const LINE_CONFIG: Record<string, LineConfig> = {
  BTS_SUKHUMVIT: {
    id: 'BTS_SUKHUMVIT',
    nameTH: 'BTS สายสุขุมวิท',
    nameEN: 'BTS Sukhumvit',
    shortName: 'BTS S',
    color: '#159E40',
    lightColor: '#e6f7eb',
    operator: 'BTS',
    operatorNameTH: 'กรุงเทพมหานคร (BTS)',
    tailwindBg: 'bg-bts-s',
    tailwindText: 'text-bts-s',
    tailwindBorder: 'border-bts-s',
    tailwindRing: 'ring-bts-s',
  },
  BTS_SILOM: {
    id: 'BTS_SILOM',
    nameTH: 'BTS สายสีลม',
    nameEN: 'BTS Silom',
    shortName: 'BTS L',
    color: '#006432',
    lightColor: '#e0f0e8',
    operator: 'BTS',
    operatorNameTH: 'กรุงเทพมหานคร (BTS)',
    tailwindBg: 'bg-bts-l',
    tailwindText: 'text-bts-l',
    tailwindBorder: 'border-bts-l',
    tailwindRing: 'ring-bts-l',
  },
  MRT_BLUE: {
    id: 'MRT_BLUE',
    nameTH: 'MRT สายสีน้ำเงิน',
    nameEN: 'MRT Blue Line',
    shortName: 'MRT B',
    color: '#003399',
    lightColor: '#e0e8f7',
    operator: 'MRT_BEM',
    operatorNameTH: 'รฟม. (MRT)',
    tailwindBg: 'bg-mrt-b',
    tailwindText: 'text-mrt-b',
    tailwindBorder: 'border-mrt-b',
    tailwindRing: 'ring-mrt-b',
  },
  MRT_PURPLE: {
    id: 'MRT_PURPLE',
    nameTH: 'MRT สายสีม่วง',
    nameEN: 'MRT Purple Line',
    shortName: 'MRT P',
    color: '#800080',
    lightColor: '#f3e0f3',
    operator: 'MRT_BEM',
    operatorNameTH: 'รฟม. (MRT)',
    tailwindBg: 'bg-mrt-p',
    tailwindText: 'text-mrt-p',
    tailwindBorder: 'border-mrt-p',
    tailwindRing: 'ring-mrt-p',
  },
  MRT_YELLOW: {
    id: 'MRT_YELLOW',
    nameTH: 'MRT สายสีเหลือง',
    nameEN: 'MRT Yellow Line',
    shortName: 'MRT Y',
    color: '#FCD116',
    lightColor: '#fef9e0',
    operator: 'MRT_MONORAIL',
    operatorNameTH: 'รฟม. (MRT)',
    tailwindBg: 'bg-mrt-y',
    tailwindText: 'text-mrt-y',
    tailwindBorder: 'border-mrt-y',
    tailwindRing: 'ring-mrt-y',
  },
  MRT_PINK: {
    id: 'MRT_PINK',
    nameTH: 'MRT สายสีชมพู',
    nameEN: 'MRT Pink Line',
    shortName: 'MRT PK',
    color: '#FF66B2',
    lightColor: '#ffe0ef',
    operator: 'MRT_MONORAIL',
    operatorNameTH: 'รฟม. (MRT)',
    tailwindBg: 'bg-mrt-pk',
    tailwindText: 'text-mrt-pk',
    tailwindBorder: 'border-mrt-pk',
    tailwindRing: 'ring-mrt-pk',
  },
  ARL: {
    id: 'ARL',
    nameTH: 'Airport Rail Link',
    nameEN: 'Airport Rail Link',
    shortName: 'ARL',
    color: '#800000',
    lightColor: '#f5e0e0',
    operator: 'ARL',
    operatorNameTH: 'การรถไฟแห่งประเทศไทย (รฟท.)',
    tailwindBg: 'bg-arl',
    tailwindText: 'text-arl',
    tailwindBorder: 'border-arl',
    tailwindRing: 'ring-arl',
  },
  SRT_RED: {
    id: 'SRT_RED',
    nameTH: 'รถไฟชานเมืองสายสีแดง',
    nameEN: 'SRT Red Line',
    shortName: 'SRT R',
    color: '#E60000',
    lightColor: '#fde8e8',
    operator: 'SRT',
    operatorNameTH: 'การรถไฟแห่งประเทศไทย (รฟท.)',
    tailwindBg: 'bg-srt',
    tailwindText: 'text-srt',
    tailwindBorder: 'border-srt',
    tailwindRing: 'ring-srt',
  },
};

export function getLineConfig(line: string): LineConfig {
  return LINE_CONFIG[line?.toUpperCase()] ?? {
    id: line,
    nameTH: line,
    nameEN: line,
    shortName: line,
    color: '#94a3b8',
    lightColor: '#f1f5f9',
    operator: 'OTHER',
    operatorNameTH: 'อื่นๆ',
    tailwindBg: 'bg-gray-400',
    tailwindText: 'text-gray-600',
    tailwindBorder: 'border-gray-300',
    tailwindRing: 'ring-gray-300',
  };
}

/** Returns hex color string for a given line ID */
export function getLineHexColor(line: string): string {
  return getLineConfig(line).color;
}

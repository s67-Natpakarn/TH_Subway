import React, { useState, useMemo } from 'react';
import type { Station, RouteResult } from '../utils/pathfinder';
import { getLineConfig } from '../utils/lineConfig';
import { RouteCard } from './RouteCard';
import { MapPin, Navigation, ChevronLeft, ChevronRight, Shuffle, Train, Search } from 'lucide-react';

interface SidebarProps {
  stations: Station[];
  startStation: Station | null;
  endStation: Station | null;
  selectionMode: 'start' | 'end';
  onSelectStation: (station: Station) => void;
  onSwapStations: () => void;
  calculatedRoute: RouteResult | null;
  onFindRoute: () => void;
  onClear: () => void;
}

// Per-line filter tabs — each line gets its own color-named button
const LINE_TABS = [
  { key: 'all',           labelTH: 'ทั้งหมด',       labelEN: 'All Lines',       color: '#6b7280' },
  { key: 'BTS_SUKHUMVIT', labelTH: 'สายสีเขียว',    labelEN: 'Green Line',      color: '#159E40' },
  { key: 'BTS_SILOM',     labelTH: 'สายสีเขียวเข้ม',labelEN: 'Dark Green',      color: '#006432' },
  { key: 'MRT_BLUE',      labelTH: 'สายสีน้ำเงิน',  labelEN: 'Blue Line',       color: '#003399' },
  { key: 'MRT_PURPLE',    labelTH: 'สายสีม่วง',     labelEN: 'Purple Line',     color: '#800080' },
  { key: 'MRT_YELLOW',    labelTH: 'สายสีเหลือง',   labelEN: 'Yellow Line',     color: '#C8A000' },
  { key: 'MRT_PINK',      labelTH: 'สายสีชมพู',     labelEN: 'Pink Line',       color: '#FF66B2' },
  { key: 'ARL',           labelTH: 'สายสีแดงเข้ม',  labelEN: 'Airport Rail',    color: '#800000' },
  { key: 'SRT_RED',       labelTH: 'สายสีแดง',      labelEN: 'Red Line',        color: '#E60000' },
];

const LINE_ORDER = LINE_TABS.filter((tab) => tab.key !== 'all').map((tab) => tab.key);

const PREFIX_ORDER: Record<string, string[]> = {
  BTS_SUKHUMVIT: ['N', 'CEN', 'E'],
  BTS_SILOM: ['W', 'CEN', 'S'],
  MRT_BLUE: ['BL'],
  MRT_PURPLE: ['PP'],
  MRT_YELLOW: ['YL'],
  MRT_PINK: ['PK'],
  ARL: ['A'],
  SRT_RED: ['RN', 'RW'],
};

const getStationPrefix = (stationId: string) => stationId.match(/^[A-Z]+/)?.[0] ?? stationId;
const getStationNumber = (stationId: string) => Number(stationId.match(/\d+/)?.[0] ?? 0);

const compareStationsByCode = (a: Station, b: Station) => {
  const lineDiff = LINE_ORDER.indexOf(a.line) - LINE_ORDER.indexOf(b.line);
  if (lineDiff !== 0) return lineDiff;

  const prefixOrder = PREFIX_ORDER[a.line] ?? [];
  const aPrefix = getStationPrefix(a.id);
  const bPrefix = getStationPrefix(b.id);
  const prefixDiff = prefixOrder.indexOf(aPrefix) - prefixOrder.indexOf(bPrefix);
  if (prefixDiff !== 0) return prefixDiff;

  const numberDiff = getStationNumber(a.id) - getStationNumber(b.id);
  if (numberDiff !== 0) return numberDiff;

  return a.id.localeCompare(b.id);
};

const getNameSizeClass = (station: Station) => {
  const length = station.nameTH.length + station.nameEN.length;
  if (length > 46) return { th: 'text-[10px]', en: 'text-[8.5px]' };
  if (length > 34) return { th: 'text-[11px]', en: 'text-[9px]' };
  return { th: 'text-xs', en: 'text-[9.5px]' };
};

export const Sidebar: React.FC<SidebarProps> = ({
  stations,
  startStation,
  endStation,
  selectionMode,
  onSelectStation,
  onSwapStations,
  calculatedRoute,
  onFindRoute,
  onClear,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');

  // Get line configs for selected stations
  const startCfg = startStation ? getLineConfig(startStation.line) : null;
  const endCfg = endStation ? getLineConfig(endStation.line) : null;

  // Header accent: use start station line, fallback to neutral
  const headerColor = startCfg?.color ?? '#1d1d1f';
  const headerLight = startCfg?.lightColor ?? '#f5f5f7';

  const filteredStations = useMemo(() => {
    return stations.filter((station) => {
      const matchesSearch =
        station.nameTH.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.nameEN.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.id.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;
      if (activeTab === 'all') return true;
      // Each tab key = exact line ID
      return station.line === activeTab;
    }).sort(compareStationsByCode);
  }, [stations, searchQuery, activeTab]);

  const handleSwap = () => {
    onSwapStations();
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen z-30 flex items-center transition-all duration-500 ease-in-out ${
        isOpen ? 'w-[400px]' : 'w-0'
      }`}
    >
      {/* Sidebar Content Card */}
      <div
        className={`h-[calc(100vh-24px)] m-3 w-[376px] rounded-2xl glass shadow-2xl flex flex-col overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'translate-x-0 opacity-100' : '-translate-x-[420px] opacity-0'
        }`}
      >
        {/* ── Brand Header ── dynamic color based on start station line */}
        <div
          className="p-5 border-b border-black/[0.05] flex items-center gap-3 transition-all duration-500"
          style={{
            background: startCfg
              ? `linear-gradient(135deg, ${headerLight} 0%, white 100%)`
              : 'transparent',
            borderBottomColor: startCfg ? headerColor + '20' : undefined,
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg transition-all duration-500"
            style={{ backgroundColor: headerColor }}
          >
            <Train className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg font-bold tracking-tight m-0 leading-none">ThaiTransit</h1>
            {startCfg ? (
              <div className="flex items-center gap-1.5 mt-0.5">
                {/* Colored pill with line color name */}
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                  style={{ backgroundColor: headerColor }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white/60" />
                  {LINE_TABS.find(t => t.key === startStation?.line)?.labelEN ?? startCfg.nameEN}
                </span>
              </div>
            ) : (
              <span className="text-[10px] opacity-50 font-medium">ระบบคำนวณเส้นทางรถไฟฟ้า 8 สาย</span>
            )}
          </div>
        </div>

        {/* ── Station Selectors ── */}
        <div className="p-4 flex flex-col gap-3 bg-black/[0.01] border-b border-black/[0.03]">
          {/* Start Station */}
          <div className="relative">
            <label className="text-[9px] font-bold tracking-wider uppercase opacity-45 block mb-1 px-1">
              สถานีต้นทาง
            </label>
            <button
              type="button"
              onClick={() => startStation && onSelectStation(startStation)}
              className="w-full text-left flex items-start gap-2 hover:bg-black/[0.05] transition px-3 py-2 rounded-xl border"
              style={{
                backgroundColor: startCfg ? startCfg.color + '0a' : 'rgba(0,0,0,0.03)',
                borderColor: selectionMode === 'start'
                  ? (startCfg?.color ?? '#1d1d1f')
                  : startCfg ? startCfg.color + '40' : 'rgba(0,0,0,0.05)',
              }}
            >
              <MapPin
                className="w-4 h-4 shrink-0 mt-0.5"
                style={{ color: startCfg?.color ?? '#94a3b8' }}
              />
              <div className="min-w-0 flex-1">
                <div className={`font-semibold leading-tight break-words ${startStation ? getNameSizeClass(startStation).th : 'text-xs text-black/45'}`}>
                  {startStation?.nameTH ?? 'เลือกสถานีต้นทาง...'}
                </div>
                {startStation && (
                  <div className="text-[9px] opacity-55 leading-tight break-words mt-0.5">
                    {startStation.nameEN} · {startStation.id}
                  </div>
                )}
              </div>
              {startStation && (
                <div
                  className="w-2 h-2 rounded-full shrink-0 mt-1.5"
                  style={{ backgroundColor: startCfg?.color }}
                />
              )}
            </button>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center -my-2 relative z-10">
            <button
              onClick={handleSwap}
              disabled={!startStation || !endStation}
              className="p-1.5 rounded-full border border-black/5 bg-white hover:scale-105 active:scale-95 shadow-md transition text-gray-500 hover:text-black disabled:opacity-35 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              <Shuffle className="w-3.5 h-3.5 rotate-90" />
            </button>
          </div>

          {/* End Station */}
          <div className="relative">
            <label className="text-[9px] font-bold tracking-wider uppercase opacity-45 block mb-1 px-1">
              สถานีปลายทาง
            </label>
            <div
              className="flex items-start gap-2 transition px-3 py-2 rounded-xl border"
              style={{
                backgroundColor: endCfg ? endCfg.color + '0a' : 'rgba(0,0,0,0.03)',
                borderColor: selectionMode === 'end'
                  ? (endCfg?.color ?? startCfg?.color ?? '#1d1d1f')
                  : endCfg ? endCfg.color + '40' : 'rgba(0,0,0,0.05)',
              }}
            >
              <Navigation
                className="w-4 h-4 shrink-0 mt-0.5"
                style={{ color: endCfg?.color ?? '#94a3b8' }}
              />
              <div className="min-w-0 flex-1">
                <div className={`font-semibold leading-tight break-words ${endStation ? getNameSizeClass(endStation).th : 'text-xs text-black/45'}`}>
                  {endStation?.nameTH ?? 'เลือกสถานีปลายทาง...'}
                </div>
                {endStation && (
                  <div className="text-[9px] opacity-55 leading-tight break-words mt-0.5">
                    {endStation.nameEN} · {endStation.id}
                  </div>
                )}
              </div>
              {endStation && (
                <div
                  className="w-2 h-2 rounded-full shrink-0 mt-1.5"
                  style={{ backgroundColor: endCfg?.color }}
                />
              )}
            </div>
          </div>

          {/* Find Route Button */}
          <button
            onClick={onFindRoute}
            disabled={!startStation || !endStation}
            className="w-full py-2.5 px-4 rounded-xl text-xs font-bold tracking-tight transition shadow-md"
            style={
              startStation && endStation
                ? {
                    backgroundColor: headerColor,
                    color: '#ffffff',
                  }
                : undefined
            }
            {...(!startStation || !endStation
              ? { className: 'w-full py-2.5 px-4 rounded-xl text-xs font-bold tracking-tight transition bg-black/10 text-black/30 cursor-not-allowed shadow-none' }
              : {})}
          >
            คำนวณเส้นทางเชื่อมต่อ
          </button>
        </div>

        {/* ── Results / Browser ── */}
        <div className="flex-1 overflow-y-auto p-4">
          {calculatedRoute ? (
            <RouteCard route={calculatedRoute} onClear={onClear} />
          ) : (
            <div className="flex flex-col h-full">
              {/* Search + Tabs */}
              <div className="mb-4">
                <h3 className="text-[9px] font-bold tracking-wider uppercase opacity-45 mb-2 px-1">
                  ค้นหาและเลือกสถานีรถไฟฟ้า
                </h3>

                <div className="flex items-center gap-2 bg-black/[0.02] px-3 py-2 rounded-lg border border-black/5 mb-3">
                  <Search className="w-3.5 h-3.5 opacity-40 shrink-0" />
                  <input
                    type="text"
                    placeholder="พิมพ์ชื่อสถานี ไทย / อังกฤษ หรือ รหัส..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent text-xs w-full focus:outline-none placeholder:opacity-50"
                  />
                </div>

                {/* Line Filter — horizontal scrollable pill row */}
                <div className="flex gap-1.5 overflow-x-auto pb-0.5 -mx-0.5 px-0.5" style={{ scrollbarWidth: 'none' }}>
                  {LINE_TABS.map((tab) => {
                    const isActive = activeTab === tab.key;
                    const isAll = tab.key === 'all';
                    return (
                      <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key)}
                        className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[9px] font-bold transition-all border whitespace-nowrap"
                        style={
                          isActive
                            ? { backgroundColor: tab.color, borderColor: tab.color, color: 'white' }
                            : { backgroundColor: tab.color + '12', borderColor: tab.color + '35', color: isAll ? '#6b7280' : tab.color }
                        }
                      >
                        {!isAll && (
                          <span
                            className="w-1.5 h-1.5 rounded-full shrink-0"
                            style={{ backgroundColor: isActive ? 'rgba(255,255,255,0.75)' : tab.color }}
                          />
                        )}
                        {tab.labelEN}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Station Listing */}
              <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-1 pr-1">
                {filteredStations.length === 0 ? (
                  <div className="text-center py-6 text-xs opacity-40">ไม่พบสถานีที่ตรงกัน</div>
                ) : (
                  filteredStations.map((st) => {
                    const isSelectedStart = startStation?.id === st.id;
                    const isSelectedEnd = endStation?.id === st.id;
                    const stCfg = getLineConfig(st.line);
                    const nameSize = getNameSizeClass(st);
                    const selectedLabel = isSelectedStart ? 'ต้นทาง' : isSelectedEnd ? 'ปลายทาง' : null;

                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => onSelectStation(st)}
                        className="p-2.5 rounded-xl border transition flex items-start gap-2 text-left hover:bg-black/[0.03] active:scale-[0.99]"
                        style={
                          isSelectedStart
                            ? { backgroundColor: stCfg.color + '10', borderColor: stCfg.color + '50' }
                            : isSelectedEnd
                            ? { backgroundColor: stCfg.color + '10', borderColor: stCfg.color + '50' }
                            : { backgroundColor: 'rgba(0,0,0,0.01)', borderColor: 'rgba(0,0,0,0.05)' }
                        }
                      >
                        <div
                          className="w-9 h-9 rounded-lg flex flex-col items-center justify-center shrink-0 border bg-white/65"
                          style={{ borderColor: stCfg.color + '30', color: stCfg.color }}
                        >
                          <span className="text-[8.5px] font-black leading-none">{st.id.replace('_', '')}</span>
                        </div>

                        <div className="flex flex-col min-w-0 flex-1">
                          <div className={`font-semibold leading-tight break-words ${nameSize.th}`}>
                            {st.nameTH}
                          </div>
                          <div className={`opacity-55 leading-tight break-words mt-0.5 ${nameSize.en}`}>
                            {st.nameEN}
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1.5 shrink-0 max-w-[110px]">
                          <span
                            className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[8px] font-black leading-none"
                            style={{
                              borderColor: stCfg.color + '35',
                              backgroundColor: stCfg.color + '12',
                              color: stCfg.color,
                            }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: stCfg.color }} />
                            {stCfg.shortName}
                          </span>
                          {selectedLabel && (
                            <span
                              className="px-1.5 py-0.5 text-[8px] font-black rounded-full text-white"
                              style={{ backgroundColor: stCfg.color }}
                            >
                              {selectedLabel}
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Floating Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-12 w-7.5 rounded-r-xl glass border-l-0 shadow-lg flex items-center justify-center cursor-pointer hover:bg-white text-gray-500 hover:text-black transition-all duration-300"
      >
        {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
    </div>
  );
};

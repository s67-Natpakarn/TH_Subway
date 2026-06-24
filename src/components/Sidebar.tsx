import React, { useState, useMemo } from 'react';
import type { Station, RouteResult } from '../utils/pathfinder';
import { getLineConfig } from '../utils/lineConfig';
import { RouteCard } from './RouteCard';
import { StationBadge } from './StationBadge';
import { MapPin, Navigation, ChevronLeft, ChevronRight, Shuffle, Train, Search } from 'lucide-react';

interface SidebarProps {
  stations: Station[];
  startStation: Station | null;
  endStation: Station | null;
  onSelectStart: (station: Station | null) => void;
  onSelectEnd: (station: Station | null) => void;
  calculatedRoute: RouteResult | null;
  onFindRoute: () => void;
  onClear: () => void;
}

const LINE_TABS = [
  { key: 'all', label: 'ทั้งหมด', color: '#6b7280' },
  { key: 'bts', label: 'BTS', color: '#159E40' },
  { key: 'mrt', label: 'MRT', color: '#003399' },
  { key: 'arl', label: 'ARL', color: '#800000' },
  { key: 'srt', label: 'SRT', color: '#E60000' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  stations,
  startStation,
  endStation,
  onSelectStart,
  onSelectEnd,
  calculatedRoute,
  onFindRoute,
  onClear,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'bts' | 'mrt' | 'arl' | 'srt'>('all');

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
      if (activeTab === 'bts') return station.line.startsWith('BTS_');
      if (activeTab === 'mrt') return station.line.startsWith('MRT_');
      if (activeTab === 'arl') return station.line === 'ARL';
      if (activeTab === 'srt') return station.line === 'SRT_RED';
      return true;
    });
  }, [stations, searchQuery, activeTab]);

  const handleSwap = () => {
    const temp = startStation;
    onSelectStart(endStation);
    onSelectEnd(temp);
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
          <div>
            <h1 className="text-lg font-bold tracking-tight m-0 leading-none">ThaiTransit</h1>
            {startCfg ? (
              <span className="text-[10px] font-semibold" style={{ color: headerColor }}>
                {startCfg.nameTH}
              </span>
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
            <div
              className="flex items-center gap-2 hover:bg-black/[0.05] transition px-3 py-2 rounded-xl border"
              style={{
                backgroundColor: startCfg ? startCfg.color + '0a' : 'rgba(0,0,0,0.03)',
                borderColor: startCfg ? startCfg.color + '40' : 'rgba(0,0,0,0.05)',
              }}
            >
              <MapPin
                className="w-4 h-4 shrink-0"
                style={{ color: startCfg?.color ?? '#94a3b8' }}
              />
              <select
                value={startStation?.id || ''}
                onChange={(e) => {
                  const s = stations.find((st) => st.id === e.target.value) || null;
                  onSelectStart(s);
                }}
                className="bg-transparent text-xs w-full font-semibold focus:outline-none appearance-none cursor-pointer"
              >
                <option value="">เลือกสถานีต้นทาง...</option>
                {stations.map((st) => (
                  <option key={`start-${st.id}`} value={st.id}>
                    {st.nameTH} ({st.nameEN}) - {st.id}
                  </option>
                ))}
              </select>
              {startStation && (
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: startCfg?.color }}
                />
              )}
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center -my-2 relative z-10">
            <button
              onClick={handleSwap}
              className="p-1.5 rounded-full border border-black/5 bg-white hover:scale-105 active:scale-95 shadow-md transition text-gray-500 hover:text-black"
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
              className="flex items-center gap-2 hover:bg-black/[0.05] transition px-3 py-2 rounded-xl border"
              style={{
                backgroundColor: endCfg ? endCfg.color + '0a' : 'rgba(0,0,0,0.03)',
                borderColor: endCfg ? endCfg.color + '40' : 'rgba(0,0,0,0.05)',
              }}
            >
              <Navigation
                className="w-4 h-4 shrink-0"
                style={{ color: endCfg?.color ?? '#94a3b8' }}
              />
              <select
                value={endStation?.id || ''}
                onChange={(e) => {
                  const s = stations.find((st) => st.id === e.target.value) || null;
                  onSelectEnd(s);
                }}
                className="bg-transparent text-xs w-full font-semibold focus:outline-none appearance-none cursor-pointer"
              >
                <option value="">เลือกสถานีปลายทาง...</option>
                {stations.map((st) => (
                  <option key={`end-${st.id}`} value={st.id}>
                    {st.nameTH} ({st.nameEN}) - {st.id}
                  </option>
                ))}
              </select>
              {endStation && (
                <div
                  className="w-2 h-2 rounded-full shrink-0"
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

                {/* Colored Tabs */}
                <div className="flex gap-1 p-0.5 rounded-lg bg-black/[0.03] border border-black/5">
                  {LINE_TABS.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key as any)}
                      className="flex-1 py-1 text-[9px] font-bold rounded transition-all flex items-center justify-center gap-1"
                      style={
                        activeTab === tab.key
                          ? { backgroundColor: tab.color, color: 'white' }
                          : { color: tab.color }
                      }
                    >
                      {tab.key !== 'all' && (
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{
                            backgroundColor: activeTab === tab.key ? 'white' : tab.color,
                            opacity: activeTab === tab.key ? 0.8 : 1,
                          }}
                        />
                      )}
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Station Listing */}
              <div className="flex-1 overflow-y-auto flex flex-col gap-1 max-h-[300px] pr-1">
                {filteredStations.length === 0 ? (
                  <div className="text-center py-6 text-xs opacity-40">ไม่พบสถานีที่ตรงกัน</div>
                ) : (
                  filteredStations.map((st) => {
                    const isSelectedStart = startStation?.id === st.id;
                    const isSelectedEnd = endStation?.id === st.id;
                    const stCfg = getLineConfig(st.line);

                    return (
                      <div
                        key={st.id}
                        className="p-2 rounded-xl border transition flex justify-between items-center"
                        style={
                          isSelectedStart
                            ? { backgroundColor: stCfg.color + '10', borderColor: stCfg.color + '50' }
                            : isSelectedEnd
                            ? { backgroundColor: stCfg.color + '10', borderColor: stCfg.color + '50' }
                            : { backgroundColor: 'rgba(0,0,0,0.01)', borderColor: 'rgba(0,0,0,0.05)' }
                        }
                      >
                        <div className="flex flex-col min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-xs truncate">{st.nameTH}</span>
                            <span className="text-[9px] opacity-50 shrink-0">({st.nameEN})</span>
                          </div>
                          <span className="text-[9px] opacity-40 font-semibold">{st.id}</span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <StationBadge line={st.line} className="scale-75 origin-right" />
                          <div className="flex gap-0.5">
                            <button
                              onClick={() => onSelectStart(isSelectedStart ? null : st)}
                              className="px-1.5 py-0.5 text-[8.5px] font-bold rounded transition border"
                              style={
                                isSelectedStart
                                  ? { backgroundColor: stCfg.color, borderColor: stCfg.color, color: 'white' }
                                  : { borderColor: 'rgba(0,0,0,0.1)' }
                              }
                            >
                              ต้นทาง
                            </button>
                            <button
                              onClick={() => onSelectEnd(isSelectedEnd ? null : st)}
                              className="px-1.5 py-0.5 text-[8.5px] font-bold rounded transition border"
                              style={
                                isSelectedEnd
                                  ? { backgroundColor: stCfg.color, borderColor: stCfg.color, color: 'white' }
                                  : { borderColor: 'rgba(0,0,0,0.1)' }
                              }
                            >
                              ปลายทาง
                            </button>
                          </div>
                        </div>
                      </div>
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

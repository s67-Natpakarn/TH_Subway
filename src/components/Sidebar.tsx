import React, { useState, useMemo } from 'react';
import type { Station, RouteResult } from '../utils/pathfinder';
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
  const [activeTab, setActiveTab] = useState<'all' | 'bts' | 'mrt' | 'arl'>('all');

  const filteredStations = useMemo(() => {
    return stations.filter((station) => {
      const matchesSearch =
        station.nameTH.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.nameEN.toLowerCase().includes(searchQuery.toLowerCase()) ||
        station.id.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeTab === 'all') return true;
      if (activeTab === 'bts') return station.line === 'BTS_GREEN';
      if (activeTab === 'mrt') return station.line === 'MRT_BLUE';
      if (activeTab === 'arl') return station.line === 'ARL';
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
        {/* Brand Header */}
        <div className="p-6 border-b border-black/[0.05] dark:border-white/[0.05] flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black dark:bg-white flex items-center justify-center text-white dark:text-black shadow-lg">
            <Train className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight m-0 leading-none">ThaiTransit</h1>
            <span className="text-xs opacity-50 font-medium">Minimal Subway Planner</span>
          </div>
        </div>

        {/* Station Selectors */}
        <div className="p-5 flex flex-col gap-3.5 bg-black/[0.01] dark:bg-white/[0.01] border-b border-black/[0.03] dark:border-white/[0.03]">
          {/* Start Station */}
          <div className="relative">
            <label className="text-[10px] font-bold tracking-wider uppercase opacity-45 block mb-1 px-1">
              สถานีต้นทาง
            </label>
            <div className="flex items-center gap-2.5 bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition px-3.5 py-2.5 rounded-xl border border-black/5 dark:border-white/5">
              <MapPin className="w-4.5 h-4.5 text-bts shrink-0" />
              <select
                value={startStation?.id || ''}
                onChange={(e) => {
                  const s = stations.find((st) => st.id === e.target.value) || null;
                  onSelectStart(s);
                }}
                className="bg-transparent text-sm w-full font-medium focus:outline-none appearance-none cursor-pointer"
              >
                <option value="" className="dark:bg-[#1c1c1e]">เลือกสถานีต้นทาง...</option>
                {stations.map((st) => (
                  <option key={`start-${st.id}`} value={st.id} className="dark:bg-[#1c1c1e]">
                    {st.nameTH} ({st.nameEN}) - {st.id}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button container */}
          <div className="flex justify-center -my-2.5 relative z-10">
            <button
              onClick={handleSwap}
              className="p-2 rounded-full border border-black/5 dark:border-white/10 bg-white dark:bg-[#2c2c2e] hover:scale-105 active:scale-95 shadow-md transition text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
            >
              <Shuffle className="w-4 h-4 rotate-90" />
            </button>
          </div>

          {/* End Station */}
          <div className="relative">
            <label className="text-[10px] font-bold tracking-wider uppercase opacity-45 block mb-1 px-1">
              สถานีปลายทาง
            </label>
            <div className="flex items-center gap-2.5 bg-black/[0.03] dark:bg-white/[0.05] hover:bg-black/[0.05] dark:hover:bg-white/[0.08] transition px-3.5 py-2.5 rounded-xl border border-black/5 dark:border-white/5">
              <Navigation className="w-4.5 h-4.5 text-mrt dark:text-blue-400 shrink-0" />
              <select
                value={endStation?.id || ''}
                onChange={(e) => {
                  const s = stations.find((st) => st.id === e.target.value) || null;
                  onSelectEnd(s);
                }}
                className="bg-transparent text-sm w-full font-medium focus:outline-none appearance-none cursor-pointer"
              >
                <option value="" className="dark:bg-[#1c1c1e]">เลือกสถานีปลายทาง...</option>
                {stations.map((st) => (
                  <option key={`end-${st.id}`} value={st.id} className="dark:bg-[#1c1c1e]">
                    {st.nameTH} ({st.nameEN}) - {st.id}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={onFindRoute}
            disabled={!startStation || !endStation}
            className={`w-full py-3 px-4 rounded-xl text-sm font-bold tracking-tight transition shadow-lg ${
              startStation && endStation
                ? 'bg-black text-white hover:bg-black/90 active:scale-[0.98] dark:bg-white dark:text-black dark:hover:bg-white/90'
                : 'bg-black/10 dark:bg-white/10 text-black/30 dark:text-white/30 cursor-not-allowed shadow-none'
            }`}
          >
            ค้นหาเส้นทาง
          </button>
        </div>

        {/* Results / List Area */}
        <div className="flex-1 overflow-y-auto p-5">
          {calculatedRoute ? (
            <RouteCard route={calculatedRoute} onClear={onClear} />
          ) : (
            <div className="flex flex-col h-full">
              {/* Search Bar & Station Browser */}
              <div className="mb-4">
                <h3 className="text-[10px] font-bold tracking-wider uppercase opacity-45 mb-2.5 px-1">
                  รายชื่อสถานีทั้งหมด
                </h3>
                
                {/* Custom Search Input */}
                <div className="flex items-center gap-2 bg-black/[0.02] dark:bg-white/[0.03] px-3.5 py-2 rounded-lg border border-black/5 dark:border-white/5 mb-3.5">
                  <Search className="w-4 h-4 opacity-40 shrink-0" />
                  <input
                    type="text"
                    placeholder="ค้นหาตามชื่อสถานี หรือ รหัส..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent text-xs w-full focus:outline-none placeholder:opacity-50"
                  />
                </div>

                {/* Tabs */}
                <div className="grid grid-cols-4 gap-1 p-0.5 rounded-lg bg-black/[0.03] dark:bg-white/[0.05] border border-black/5 dark:border-white/5">
                  {['all', 'bts', 'mrt', 'arl'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as any)}
                      className={`py-1 text-[10px] font-bold rounded uppercase transition ${
                        activeTab === tab
                          ? 'bg-white dark:bg-[#2c2c2e] shadow-sm text-black dark:text-white'
                          : 'text-gray-500 hover:text-black dark:hover:text-white'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Station Listing */}
              <div className="flex-1 overflow-y-auto flex flex-col gap-1.5 max-h-[300px] pr-1">
                {filteredStations.length === 0 ? (
                  <div className="text-center py-6 text-xs opacity-40">ไม่พบสถานีที่ต้องการค้นหา</div>
                ) : (
                  filteredStations.map((st) => {
                    const isSelectedStart = startStation?.id === st.id;
                    const isSelectedEnd = endStation?.id === st.id;

                    return (
                      <div
                        key={st.id}
                        className={`p-2.5 rounded-xl border transition flex justify-between items-center ${
                          isSelectedStart
                            ? 'bg-bts/5 border-bts/45 text-bts'
                            : isSelectedEnd
                            ? 'bg-mrt/5 border-mrt/45 text-mrt dark:text-blue-400'
                            : 'bg-black/[0.01] dark:bg-white/[0.01] hover:bg-black/[0.03] dark:hover:bg-white/[0.03] border-black/5 dark:border-white/5'
                        }`}
                      >
                        <div className="flex flex-col gap-0.5">
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-xs">{st.nameTH}</span>
                            <span className="text-[10px] opacity-50">({st.nameEN})</span>
                          </div>
                          <span className="text-[10px] opacity-40 font-semibold">{st.id}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <StationBadge line={st.line} className="scale-75 origin-right" />
                          <div className="flex gap-1">
                            <button
                              onClick={() => onSelectStart(isSelectedStart ? null : st)}
                              className={`px-1.5 py-0.5 text-[9px] font-bold rounded transition border ${
                                isSelectedStart
                                  ? 'bg-bts border-bts text-white'
                                  : 'border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5'
                              }`}
                            >
                              ต้นทาง
                            </button>
                            <button
                              onClick={() => onSelectEnd(isSelectedEnd ? null : st)}
                              className={`px-1.5 py-0.5 text-[9px] font-bold rounded transition border ${
                                isSelectedEnd
                                  ? 'bg-mrt border-mrt text-white'
                                  : 'border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/5'
                              }`}
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

      {/* Floating Sidebar Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-8 rounded-r-xl glass border-l-0 shadow-lg flex items-center justify-center cursor-pointer hover:bg-white dark:hover:bg-[#1c1c1e] text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white transition-all duration-300"
      >
        {isOpen ? <ChevronLeft className="w-4.5 h-4.5" /> : <ChevronRight className="w-4.5 h-4.5" />}
      </button>
    </div>
  );
};

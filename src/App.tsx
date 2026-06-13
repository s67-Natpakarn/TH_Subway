import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { Map } from './components/Map';
import { findRoute, getAllStations } from './utils/pathfinder';
import type { Station, RouteResult } from './utils/pathfinder';
import { Sun, Moon } from 'lucide-react';

function App() {
  const [stations] = useState<Station[]>(() => getAllStations());
  const [startStation, setStartStation] = useState<Station | null>(null);
  const [endStation, setEndStation] = useState<Station | null>(null);
  const [calculatedRoute, setCalculatedRoute] = useState<RouteResult | null>(null);
  
  // Set default dark mode state matching Apple premium dark mode
  const [isDark, setIsDark] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark') || 
             window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply dark mode styling class to root HTML
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const handleSelectStart = (station: Station | null) => {
    setStartStation(station);
    setCalculatedRoute(null);
  };

  const handleSelectEnd = (station: Station | null) => {
    setEndStation(station);
    setCalculatedRoute(null);
  };

  const handleSelectStationFromMap = (station: Station) => {
    if (!startStation) {
      setStartStation(station);
    } else if (!endStation && startStation.id !== station.id) {
      setEndStation(station);
    } else {
      // If both are filled or clicking start again, reset selection sequence
      setStartStation(station);
      setEndStation(null);
      setCalculatedRoute(null);
    }
  };

  const handleFindRoute = () => {
    if (startStation && endStation) {
      const route = findRoute(startStation.id, endStation.id);
      setCalculatedRoute(route);
    }
  };

  const handleClear = () => {
    setStartStation(null);
    setEndStation(null);
    setCalculatedRoute(null);
  };

  return (
    <div className="w-screen h-screen relative overflow-hidden bg-[#f5f5f7] dark:bg-black text-[#1d1d1f] dark:text-[#f5f5f7] transition-colors duration-500">
      {/* Floating Dark Mode Toggle Button */}
      <div className="absolute top-6 right-6 z-20">
        <button
          onClick={() => setIsDark(!isDark)}
          className="p-3 rounded-full glass hover:bg-white dark:hover:bg-[#1c1c1e] shadow-lg transition-all duration-300 active:scale-95 cursor-pointer text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white"
          title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
      </div>

      {/* Main Layout Grid */}
      <div className="w-full h-full flex flex-col md:flex-row">
        {/* Route Planner Panel */}
        <Sidebar
          stations={stations}
          startStation={startStation}
          endStation={endStation}
          onSelectStart={handleSelectStart}
          onSelectEnd={handleSelectEnd}
          calculatedRoute={calculatedRoute}
          onFindRoute={handleFindRoute}
          onClear={handleClear}
        />

        {/* Map Canvas Component */}
        <div className="flex-1 h-full flex items-center justify-center md:pl-[60px] pl-0">
          <Map
            stations={stations}
            startStation={startStation}
            endStation={endStation}
            onSelectStation={handleSelectStationFromMap}
            calculatedRoute={calculatedRoute}
          />
        </div>
      </div>
    </div>
  );
}

export default App;

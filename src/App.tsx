import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Map } from './components/Map';
import { findRoute, getAllStations } from './utils/pathfinder';
import type { Station, RouteResult } from './utils/pathfinder';

function App() {
 const [stations] = useState<Station[]>(() => getAllStations());
 const [startStation, setStartStation] = useState<Station | null>(null);
 const [endStation, setEndStation] = useState<Station | null>(null);
 const [calculatedRoute, setCalculatedRoute] = useState<RouteResult | null>(null);
 const [selectionMode, setSelectionMode] = useState<'start' | 'end'>('start');


 const handleSelectStation = (station: Station) => {
 setCalculatedRoute(null);

 if (selectionMode === 'start' || !startStation) {
 setStartStation(station);
 setEndStation(null);
 setSelectionMode('end');
 return;
 }

 if (station.id === startStation.id) {
 setEndStation(null);
 setSelectionMode('start');
 return;
 }

 setEndStation(station);
 setSelectionMode('end');
 };

 const handleSwapStations = () => {
 if (!startStation || !endStation) return;
 setStartStation(endStation);
 setEndStation(startStation);
 setSelectionMode('end');
 setCalculatedRoute(null);
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
 setSelectionMode('start');
 };

 return (
 <div className="w-screen h-screen relative overflow-hidden bg-[#f5f5f7] text-[#1d1d1f] transition-colors duration-500">


 {/* Main Layout Grid */}
 <div className="w-full h-full flex flex-col md:flex-row">
 {/* Route Planner Panel */}
 <Sidebar
 stations={stations}
 startStation={startStation}
 endStation={endStation}
 selectionMode={selectionMode}
 onSelectStation={handleSelectStation}
 onSwapStations={handleSwapStations}
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
 onSelectStation={handleSelectStation}
 calculatedRoute={calculatedRoute}
 />
 </div>
 </div>
 </div>
 );
}

export default App;

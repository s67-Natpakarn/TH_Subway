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
 <div className="w-screen h-screen relative overflow-hidden bg-[#f5f5f7] text-[#1d1d1f] transition-colors duration-500">


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

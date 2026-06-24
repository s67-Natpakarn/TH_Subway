import graphData from '../data/transitGraph.json';

export interface Station {
  id: string;
  nameEN: string;
  nameTH: string;
  line: string;
}

export interface Edge {
  from: string;
  to: string;
  weight: number;
  fare: number;
  type?: string;
}

export interface GraphData {
  stations: Record<string, Station>;
  edges: Edge[];
}

const data = graphData as GraphData;

export interface PathStep {
  station: Station;
  timeToNext: number;
  fareToNext: number;
  type?: string;
  isTransferPenaltyApplied?: boolean;
}

export interface RouteResult {
  path: Station[];
  steps: PathStep[];
  totalTime: number;
  totalFare: number;
  interchanges: string[];
}

// Build adjacency list
const adjacencyList: Record<string, Edge[]> = {};

// Initialize list
Object.keys(data.stations).forEach((stationId) => {
  adjacencyList[stationId] = [];
});

// Build bi-directional edges
data.edges.forEach((edge) => {
  adjacencyList[edge.from].push(edge);
  adjacencyList[edge.to].push({
    from: edge.to,
    to: edge.from,
    weight: edge.weight,
    fare: edge.fare,
    type: edge.type,
  });
});

// Helper to determine the operator of a line
function getOperator(line: string): string {
  const lineUpper = line.toUpperCase();
  if (lineUpper.startsWith('BTS_')) return 'BTS';
  if (lineUpper.startsWith('MRT_BLUE') || lineUpper.startsWith('MRT_PURPLE')) return 'MRT_BEM';
  if (lineUpper.startsWith('MRT_YELLOW') || lineUpper.startsWith('MRT_PINK')) return 'MRT_MONORAIL';
  if (lineUpper === 'ARL') return 'ARL';
  if (lineUpper === 'SRT_RED') return 'SRT';
  return 'OTHER';
}

// Helper to calculate fare for a segment of a journey on one operator
function calculateSegmentFare(operator: string, stops: number): number {
  if (stops <= 0) return 0;
  
  switch (operator) {
    case 'BTS': {
      // Base fare 17, approx 3.2 THB per stop, cap at 47 THB
      const calculated = 17 + Math.ceil(stops * 3.2);
      return Math.min(calculated, 47);
    }
    case 'MRT_BEM': {
      // Blue/Purple lines: Base 17, approx 2.5 THB per stop, cap at 43 THB
      const calculated = 17 + Math.ceil(stops * 2.5);
      return Math.min(calculated, 43);
    }
    case 'MRT_MONORAIL': {
      // Yellow/Pink lines: Base 15, approx 2.3 THB per stop, cap at 45 THB
      const calculated = 15 + Math.ceil(stops * 2.3);
      return Math.min(calculated, 45);
    }
    case 'ARL': {
      // Base 15, +5 THB per stop, cap at 45 THB
      const calculated = 15 + stops * 5;
      return Math.min(calculated, 45);
    }
    case 'SRT': {
      // Red Line: Flat base 20 THB currently
      return 20;
    }
    default:
      return 20 + stops * 2;
  }
}

export function findRoute(startId: string, endId: string): RouteResult | null {
  if (!data.stations[startId] || !data.stations[endId]) return null;
  if (startId === endId) {
    return {
      path: [data.stations[startId]],
      steps: [],
      totalTime: 0,
      totalFare: 0,
      interchanges: [],
    };
  }

  const times: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const visited = new Set<string>();
  const queue: string[] = [];

  // Initialize
  Object.keys(data.stations).forEach((stationId) => {
    times[stationId] = Infinity;
    previous[stationId] = null;
  });

  times[startId] = 0;
  queue.push(startId);

  while (queue.length > 0) {
    // Sort queue by travel time (priority queue selection)
    queue.sort((a, b) => times[a] - times[b]);
    const currentId = queue.shift()!;

    if (currentId === endId) break;

    visited.add(currentId);

    const neighbors = adjacencyList[currentId] || [];
    for (const edge of neighbors) {
      if (visited.has(edge.to)) continue;

      // Time weight calculation: Edge weight + Transfer Penalty (+5 mins) if physical interchange
      let edgeWeight = edge.weight;
      if (edge.type === 'interchange') {
        edgeWeight += 5; // Add +5 minute walking/waiting transfer penalty
      }

      const newTime = times[currentId] + edgeWeight;
      if (newTime < times[edge.to]) {
        times[edge.to] = newTime;
        previous[edge.to] = currentId;
        if (!queue.includes(edge.to)) {
          queue.push(edge.to);
        }
      }
    }
  }

  // If destination is unreachable
  if (times[endId] === Infinity) return null;

  // Reconstruct path node IDs
  const pathIds: string[] = [];
  let current: string | null = endId;
  while (current !== null) {
    pathIds.unshift(current);
    current = previous[current];
  }

  const path = pathIds.map((id) => data.stations[id]);
  const steps: PathStep[] = [];
  const interchanges: string[] = [];

  // Segment analysis for fare calculation
  const segments: { operator: string; stops: number }[] = [];
  let currentOperator = getOperator(path[0].line);
  let currentStops = 0;

  for (let i = 0; i < pathIds.length - 1; i++) {
    const fromId = pathIds[i];
    const toId = pathIds[i + 1];
    const fromStation = data.stations[fromId];
    const toStation = data.stations[toId];
    const edge = adjacencyList[fromId].find((e) => e.to === toId)!;

    const isInterchange = edge.type === 'interchange';
    const displayTime = edge.weight + (isInterchange ? 5 : 0);

    steps.push({
      station: fromStation,
      timeToNext: displayTime,
      fareToNext: edge.fare,
      type: edge.type,
      isTransferPenaltyApplied: isInterchange,
    });

    if (edge.type === 'interchange' || edge.type === 'cross-platform') {
      interchanges.push(`${fromStation.nameEN} (${fromStation.line}) → ${toStation.nameEN} (${toStation.line})`);
      
      // Save completed operator segment if we did ride it
      if (currentStops > 0) {
        segments.push({ operator: currentOperator, stops: currentStops });
      }
      
      // Start a new operator segment
      currentOperator = getOperator(toStation.line);
      currentStops = 0;
    } else {
      // Estimate intermediate stops based on time (avg 2 mins per station)
      // If we don't have intermediate nodes, edge.weight represents time, stops is weight / 2
      const stopsOnEdge = Math.max(1, Math.round(edge.weight / 2));
      currentStops += stopsOnEdge;
    }
  }

  // Add final operator segment
  if (currentStops > 0) {
    segments.push({ operator: currentOperator, stops: currentStops });
  }

  // Add final destination node to step sequence
  steps.push({
    station: data.stations[endId],
    timeToNext: 0,
    fareToNext: 0,
  });

  // Calculate cumulative fare across operator segments
  let totalFare = 0;
  segments.forEach((seg) => {
    totalFare += calculateSegmentFare(seg.operator, seg.stops);
  });

  // If we had no stops (e.g. start and end are adjacent interchanges with 0 stops), ensure minimum operator base
  if (totalFare === 0 && path.length > 1) {
    totalFare = calculateSegmentFare(getOperator(path[0].line), 1);
  }

  return {
    path,
    steps,
    totalTime: times[endId],
    totalFare,
    interchanges,
  };
}

export function getAllStations(): Station[] {
  return Object.values(data.stations).sort((a, b) => a.nameTH.localeCompare(b.nameTH));
}

export function getStationById(id: string): Station {
  return data.stations[id];
}

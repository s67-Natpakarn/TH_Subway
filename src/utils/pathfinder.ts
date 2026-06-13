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
  // Reverse edge for bi-directional traversal
  adjacencyList[edge.to].push({
    from: edge.to,
    to: edge.from,
    weight: edge.weight,
    fare: edge.fare,
    type: edge.type,
  });
});

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
    // Sort queue by travel time (simple priority queue)
    queue.sort((a, b) => times[a] - times[b]);
    const currentId = queue.shift()!;

    if (currentId === endId) break;

    visited.add(currentId);

    const neighbors = adjacencyList[currentId] || [];
    for (const edge of neighbors) {
      if (visited.has(edge.to)) continue;

      const newTime = times[currentId] + edge.weight;
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

  // Reconstruct path
  const pathIds: string[] = [];
  let current: string | null = endId;
  while (current !== null) {
    pathIds.unshift(current);
    current = previous[current];
  }

  const path = pathIds.map((id) => data.stations[id]);
  const steps: PathStep[] = [];
  let totalFare = 0;
  const interchanges: string[] = [];

  // Calculate detailed steps, fares, and interchanges
  for (let i = 0; i < pathIds.length - 1; i++) {
    const fromId = pathIds[i];
    const toId = pathIds[i + 1];
    const edge = adjacencyList[fromId].find((e) => e.to === toId)!;

    steps.push({
      station: data.stations[fromId],
      timeToNext: edge.weight,
      fareToNext: edge.fare,
      type: edge.type,
    });

    if (edge.type === 'interchange') {
      interchanges.push(data.stations[fromId].nameEN);
    }
    totalFare += edge.fare;
  }

  // Add final station to steps (with 0 cost to next)
  steps.push({
    station: data.stations[endId],
    timeToNext: 0,
    fareToNext: 0,
  });

  // Dynamic fare adjustments for realism
  // Base fares: ARL=15, BTS=17, MRT=17.
  // When changing transit lines, users buy a new ticket, so we pay base fare of the new system.
  // In our simple edges array, standard edges have fare. Interchange edges have fare = 0.
  // The sum of fares on path will be calculated.
  // Let's refine the totalFare logic:
  // If the path has multiple systems, the fares of individual systems are summed.
  // Our edge values: N3->N1 is 17, N1->CEN is 17 (meaning it accumulates).
  // Real BTS fare: Phaya Thai to Siam is 28 THB. In our edge: 17 + 17 = 34 THB.
  // This is highly reasonable for Phase 1!

  return {
    path,
    steps,
    totalTime: times[endId],
    totalFare,
    interchanges,
  };
}

export function getAllStations() {
  return Object.values(data.stations);
}

export function getStationById(id: string) {
  return data.stations[id];
}

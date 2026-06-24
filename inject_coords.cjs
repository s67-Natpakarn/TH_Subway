const fs = require('fs');
const coords = fs.readFileSync('newCoords.json', 'utf8');
let mapCode = fs.readFileSync('src/components/Map.tsx', 'utf8');

const regex = /(?:export\s+)?const stationCoords: Record<string, \{ x: number; y: number \}> = \{[\s\S]*?\n\};\n/;
const replacement = `const stationCoords: Record<string, { x: number; y: number }> = ${coords};\n`;

if(regex.test(mapCode)) {
  mapCode = mapCode.replace(regex, replacement);
  fs.writeFileSync('src/components/Map.tsx', mapCode);
  console.log("Successfully injected coordinates.");
} else {
  console.error("Could not find stationCoords in Map.tsx");
}

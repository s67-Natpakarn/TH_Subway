const fs = require('fs');
const path = require('path');

function stripDark(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      stripDark(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.css')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (fullPath.endsWith('.css')) {
        // Just remove the specific dark mode blocks from index.css manually or via regex
        content = content.replace(/\.dark\s+\.[^{]+\{[\s\S]*?\}/g, '');
        content = content.replace(/\.dark\s+body\s*\{[\s\S]*?\}/g, '');
        content = content.replace(/\.dark\s+::-webkit-scrollbar-thumb\s*\{[\s\S]*?\}/g, '');
      } else {
        // Strip dark:* classes from TSX files
        content = content.replace(/dark:[^\s"'`]+/g, '');
        // Clean up multiple spaces that might have been left
        content = content.replace(/ {2,}/g, ' ');
      }
      fs.writeFileSync(fullPath, content);
    }
  }
}

stripDark('src');
console.log("Stripped dark mode classes.");

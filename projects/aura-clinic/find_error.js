const fs = require('fs');
const c = fs.readFileSync('index.html', 'utf8');
const scripts = c.match(/<script(?![^>]*src)[^>]*>([\s\S]*?)<\/script>/gi);
const code = scripts[1].replace(/<\/?script[^>]*>/gi, '');
const lines = code.split('\n');

function testCode(arr) {
  try { new Function(arr.join('\n')); return true; } catch(e) { return false; }
}

let lo = 0, hi = lines.length;
while (hi - lo > 1) {
  const mid = Math.floor((lo + hi) / 2);
  if (testCode(lines.slice(0, mid))) { lo = mid; } else { hi = mid; }
}
console.log('Error starts around JS code line', hi);
for (let i = Math.max(0, hi - 4); i < Math.min(lines.length, hi + 4); i++) {
  console.log((i+1) + ': ' + JSON.stringify(lines[i]));
}

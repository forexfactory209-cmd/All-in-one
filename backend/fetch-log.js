const fs = require('fs');
const lines = fs.readFileSync('logs/combined.log', 'utf-8').trim().split('\n');
fs.writeFileSync('out.json', JSON.stringify(lines.slice(-50), null, 2));

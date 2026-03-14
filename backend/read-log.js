const fs = require('fs');
const lines = fs.readFileSync('logs/combined.log', 'utf-8').split('\n');
console.log(lines.slice(-30).join('\n'));

const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const src = path.join(root, 'data', 'reactions-db.json');
const dst = path.join(root, 'js', 'reactions-db.js');

const json = fs.readFileSync(src, 'utf8');
fs.writeFileSync(dst, 'window.REACTIONS_DB = ' + json + ';\n', 'utf8');

console.log('Synced reactions DB -> js/reactions-db.js');

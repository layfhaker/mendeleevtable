'use strict';

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const dataPath = path.join(repoRoot, 'js', 'solubility', 'data.js');
const jsonPath = path.join(repoRoot, 'solubility-colors.json');

const args = new Set(process.argv.slice(2));
const checkOnly = args.has('--check');

const content = fs.readFileSync(dataPath, 'utf8');
const marker = 'const substanceColors';
const start = content.indexOf(marker);
if (start === -1) {
  console.error('Failed to find substanceColors in data.js');
  process.exit(2);
}
const open = content.indexOf('{', start);
if (open === -1) {
  console.error('Failed to find opening { for substanceColors');
  process.exit(2);
}
const close = content.indexOf('};', open);
if (close === -1) {
  console.error('Failed to find closing }; for substanceColors');
  process.exit(2);
}

const block = content.slice(open + 1, close);
const re = /"([^"]+)"\s*:\s*"([^"]*)"/g;
const entries = [];
let match;
while ((match = re.exec(block)) !== null) {
  entries.push({ key: match[1], value: match[2] });
}

if (entries.length === 0) {
  console.error('No entries found in substanceColors');
  process.exit(2);
}

const jsonOutput = JSON.stringify(entries, null, 2) + '\n';
let existing = '';
if (fs.existsSync(jsonPath)) {
  existing = fs.readFileSync(jsonPath, 'utf8');
}

if (checkOnly) {
  if (existing !== jsonOutput) {
    console.error('solubility-colors.json is out of sync with data.js');
    process.exit(1);
  }
  console.log('solubility-colors.json is in sync.');
  process.exit(0);
}

if (existing !== jsonOutput) {
  fs.writeFileSync(jsonPath, jsonOutput, 'utf8');
  console.log('Updated solubility-colors.json from data.js');
} else {
  console.log('No changes needed.');
}

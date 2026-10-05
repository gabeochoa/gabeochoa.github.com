// node scripts/verify-files.cjs — no silent dead weight at the repo root.
// verify-projects.cjs already gates images/projects (the "58MB of dead
// weight" cleanup); the same drift at root was unchecked: four old resume
// PDFs accumulated (jan2020, feb2022, nov2022, jan25), each new resume
// commit adding one and removing none. Root files must be referenced by
// a page, or listed here as intentionally kept (stable external URLs).
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const KEEP = {
  'discord.html': 'standalone redirect, linked from Discord profile',
  'pp-download.html': 'standalone download page, linked from itch.io',
  'sand.html': 'standalone page, linked externally',
  'old_pharmasea.html': 'archived page kept at its published URL',
  'gabriel-ochoa-resume-jan2020.pdf': 'archived resume, stable URL',
  'gabriel-ochoa-resume-feb2022.pdf': 'archived resume, stable URL',
  'gabriel-ochoa-resume-nov2022.pdf': 'archived resume, stable URL',
  'gabriel-ochoa-resume-jan25.pdf': 'archived resume, stable URL',
};
const pages = fs.readdirSync(root).filter(f => f.endsWith('.html')).map(f => fs.readFileSync(path.join(root, f), 'utf8')).join('\n')
  + fs.readFileSync(path.join(root, 'projects-data.js'), 'utf8');
const bad = [];
for (const f of fs.readdirSync(root)) {
  if (!/\.(pdf|html)$/.test(f) || f === 'index.html') continue;
  if (!pages.includes(f) && !(f in KEEP)) bad.push(f);
}
assert.deepEqual(bad, [], `unreferenced root files (link them, delete them, or add a KEEP reason): ${bad}`);
console.log(`ok — root files referenced or kept with a reason (${Object.keys(KEEP).length} kept)`);

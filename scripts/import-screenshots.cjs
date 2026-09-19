// node scripts/import-screenshots.cjs <spec.json>
//
// Converts freshly captured PNGs into the webp the projects page serves, swaps
// them into projects-data.js, records provenance in sources.json, and deletes
// whatever webp the project no longer references.
//
// Spec shape:
//   { "project": "wm_afterhours",
//     "date": "2026-09-18",                 // optional, defaults to today
//     "shots": [ { "file": "/abs/path.png", "name": "wm-kart-select",
//                  "caption": "Kart select screen" } ] }
const { execFileSync } = require('node:child_process');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const OUT_DIR = 'images/projects/2026-09';
const spec = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const date = spec.date || new Date().toISOString().slice(0, 10);

const dataPath = path.join(root, 'projects-data.js');
const projects = eval(fs.readFileSync(dataPath, 'utf8') + '; PROJECTS');
const project = projects.find(p => p.name === spec.project);
if (!project) throw new Error(`no project named ${spec.project}`);

const manifestPath = path.join(root, 'images/projects/sources.json');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

const dimensions = file => {
  const out = execFileSync('magick', ['identify', '-format', '%w %h', file]).toString().split(' ');
  return { width: +out[0], height: +out[1] };
};

const before = new Set(project.screenshots.map(s => s.src));
const screenshots = [];
for (const shot of spec.shots) {
  if (!fs.existsSync(shot.file)) throw new Error(`missing source ${shot.file}`);
  const src = `${OUT_DIR}/${shot.name}.webp`;
  const dest = path.join(root, src);
  // Cap the long edge at 1280 so a 4K capture doesn't ship as a 2MB webp.
  execFileSync('cwebp', ['-q', '82', '-resize', '1280', '0', shot.file, '-o', dest], { stdio: 'pipe' });
  const { width, height } = dimensions(dest);
  screenshots.push({ src, caption: shot.caption, date, width, height });
  manifest.screenshots = manifest.screenshots.filter(s => s.src !== src);
  manifest.screenshots.push({ src, caption: shot.caption, date, width, height, source: shot.file });
}

project.screenshots = screenshots;
fs.writeFileSync(dataPath, 'const PROJECTS = ' + JSON.stringify(projects, null, 2) + ';\n');

// Drop webp that nothing references any more, and their manifest rows.
const used = new Set(projects.flatMap(p => p.screenshots.map(s => s.src)));
let removed = 0;
for (const src of before) {
  if (used.has(src)) continue;
  fs.rmSync(path.join(root, src), { force: true });
  manifest.screenshots = manifest.screenshots.filter(s => s.src !== src);
  removed++;
}

manifest.reviewed = date;
manifest.screenshots.sort((a, b) => a.src.localeCompare(b.src));
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

console.log(`${spec.project}: ${screenshots.length} new, ${removed} removed`);

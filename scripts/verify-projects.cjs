// node scripts/verify-projects.cjs — checks projects-data.js against what's on disk.
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');

const root = path.join(__dirname, '..');
const projects = eval(fs.readFileSync(path.join(root, 'projects-data.js'), 'utf8') + '; PROJECTS');

assert.equal(new Set(projects.map(p => p.name)).size, projects.length, 'duplicate project names');
assert.ok(projects.some(p => p.featured), 'no featured projects to pin above the search');

for (const project of projects) {
  const where = project.name;
  assert.ok(project.desc && project.lang && project.tags, `${where}: missing desc/lang/tags`);
  assert.ok(/^\d{4}-\d{2}-\d{2}$/.test(project.updated), `${where}: bad updated date`);
  for (const shot of project.screenshots) {
    assert.ok(fs.existsSync(path.join(root, shot.src)), `${where}: missing ${shot.src}`);
    assert.ok(shot.width > 0 && shot.height > 0, `${where}: ${shot.src} has no dimensions`);
    assert.ok(shot.caption, `${where}: ${shot.src} has no caption`);
  }
}

// Every image under images/projects/ should be referenced, or it is 58MB of dead weight again.
const used = new Set(projects.flatMap(p => p.screenshots.map(s => s.src)));
const walk = dir => fs.readdirSync(dir, { withFileTypes: true })
  .flatMap(e => e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]);
const orphans = walk(path.join(root, 'images/projects'))
  .map(f => path.relative(root, f))
  .filter(f => /\.(png|gif|jpe?g|webp)$/i.test(f) && !used.has(f));
assert.deepEqual(orphans, [], 'unreferenced images');

console.log(`ok — ${projects.length} projects, ${used.size} screenshots`);

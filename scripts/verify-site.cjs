// node scripts/verify-site.cjs — cross-page chrome must not drift.
// Header nav was restyled twice page-by-page (df6dabd projects, 564df6a home)
// and the projects footer silently missed resume/chess/lichess until 5c29086.
// There is no build step to share the markup, so this check is the sharing.
const assert = require('node:assert');
const fs = require('node:fs');
const path = require('node:path');
const root = path.join(__dirname, '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
const links = (html, re) => [...html.matchAll(re)].map(m => m[1]);
const navOf = f => links(read(f), /<nav[^>]*>([\s\S]*?)<\/nav>/g).length ? [...read(f).matchAll(/<nav[^>]*>([\s\S]*?)<\/nav>/g)][0][1] : '';
function navLinks(f){ const nav=[...read(f).matchAll(/<nav[^>]*>([\s\S]*?)<\/nav>/g)][0][1]; return links(nav,/href="([^"]+)"/g); }
function current(f){ const nav=[...read(f).matchAll(/<nav[^>]*>([\s\S]*?)<\/nav>/g)][0][1]; const m=[...nav.matchAll(/<a href="([^"]+)" aria-current="page">/g)]; assert.equal(m.length,1,`${f}: exactly one aria-current in nav`); return m[0][1]; }
assert.deepEqual(navLinks('index.html'), navLinks('projects.html'), 'header nav links differ between index.html and projects.html');
assert.equal(current('index.html'), 'index.html');
assert.equal(current('projects.html'), 'projects.html');
const elsewhere = ['https://instagram.com/gabeochoa','https://letterboxd.com/choicehoney/','gabriel-ochoa-resume-aug26.pdf','https://github.com/gabeochoa','https://chess.com/member/gabeochoa','https://lichess.org/@/gabeochoa'];
for (const f of ['index.html','projects.html']) for (const u of elsewhere) assert.ok(read(f).includes(`href="${u}"`), `${f}: missing elsewhere link ${u}`);
console.log('ok — chrome in sync (nav, aria-current, elsewhere links)');

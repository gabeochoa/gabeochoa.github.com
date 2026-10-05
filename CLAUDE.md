# Agent rules — see CORRECT.md
- Before adding/changing header, footer, or a root file: `node scripts/verify-site.cjs && node scripts/verify-files.cjs && node scripts/verify-projects.cjs` must pass.
- Chrome (nav/elsewhere links) lives in both index.html and projects.html — always change both.
- New root PDF/HTML: link it, delete the old one, or add a KEEP reason in verify-files.cjs. Project screenshots only via scripts/import-screenshots.cjs.

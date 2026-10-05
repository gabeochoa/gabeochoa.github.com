# CORRECT — gabeochoa.github.com (2026-10-04)
Small static site (no build step); two real classes, both gated by extending the repo's existing verify-*.cjs pattern. Everything else is a one-off page — no invented classes.

## Classes (>=2x)
| # | Class | Evidence |
|---|---|---|
| 1 | Cross-page chrome drift: shared header/footer edited per-page and silently diverging | df6dabd restyles projects nav, 564df6a redoes the same for home; 5c29086 projects footer missing resume/chess/lichess |
| 2 | Dead-weight files accumulate: new version added, old never removed or accounted for | images/projects orphans ("58MB", gated by verify-projects.cjs + import-screenshots.cjs deletes); at root, 4 old resume PDFs (jan2020/feb2022/nov2022/jan25) from successive resume commits, unchecked |
Not counted (once): absolute `/assets/...` links breaking under a subpath (13f82c0, hospy, since removed).

## Fix level + why
Docs/lint is the ceiling here: no build, no types, no tests to move up to — a shared component would require introducing a generator (disproportionate). So: behaviour checks in the repo's established verify-*.cjs idiom, run by hand/CI.
1. scripts/verify-site.cjs — identical nav, exactly one aria-current self-link, full elsewhere set on both pages.
2. scripts/verify-files.cjs — root PDF/HTML must be referenced or carry a KEEP reason (archived resumes and standalone pages are kept deliberately for stable external URLs, not deleted).

## Commits (local, main, not pushed)
- 07fa94c verify: cross-page chrome sync check
- fb62ed5 verify: root files referenced or kept with a reason
- (this) docs: CORRECT.md + CLAUDE.md (+ .gitignore !CORRECT.md/!CLAUDE.md — *.md was ignored)

## Proof
- verify-site: FAIL on 5c29086^ projects.html (missing resume link), passes now.
- verify-files: FAIL on a dummy new resume PDF, passes now; verify-projects still ok (42 projects, 48 screenshots).

## Rule table
| Rule | Gate |
|---|---|
| Change chrome in both pages, keep nav/elsewhere in sync | verify-site.cjs |
| Root files referenced or KEEP-reasoned | verify-files.cjs |
| Project screenshots via import script, data matches disk | verify-projects.cjs (pre-existing) |

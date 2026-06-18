@AGENTS.md

# DF&I Subcontractor Coverage - Custom App (Build Plan + Loop State)

> Autonomous Ralph-loop project. Each iteration: read this file, do the next unchecked checkpoint, run the wiring audit at the bottom, mark progress, commit + push (auto-deploys to Render), repeat. STOP when DONE = true.

## DONE
DONE: false

## CURRENT DIRECTION (2026-06-18 pivot, do not lose)
This is **NOT a SaaS marketing site with pricing tiers.** It is a **custom internal application built FOR Design Fabricators & Integrators**, the kind The Solution Service LLC ships per client. There is no `/pricing` page. Instead, **premium / agentic AI features are marked with small "Premium" badges INSIDE the app** so DF&I can see what's automated vs manual, and the configuration of those features lives in **`/settings`** (Microsoft OAuth, email integration, notification preferences, document type catalog, outreach template).

Brandon will send the live URL to Clark + Travis + Olivia + Jen as a working preview of what the actual product would feel like for their org. It must look and feel like a real shipped product, not a prototype.

## NON-NEGOTIABLES
- Production-grade design language (no generic gradient + plain white card vibe).
- Distinctive typography pair (not Inter, not Space Grotesk). Editorial serif display + industrial sans body + monospace numerics.
- 100% responsive 320 -> 1920px. Tested at 375x812 (iPhone), 768x1024 (iPad), 1440x1100 (desktop). Top nav becomes a sheet/drawer below md. Tables become stacked cards below md. The Leaflet map never overflows the viewport.
- Em-dash rule (Rule 7): zero em-dashes (-) or en-dashes anywhere. Sweep before each commit.
- All existing functionality preserved (React-Leaflet map stays client-only via dynamic import).
- Auto-deploy on `git push` (Render is wired to the repo).

## LIVE
- URL: https://dfandi-coverage-demo.onrender.com
- GitHub: https://github.com/becomethebagfx/dfandi-coverage-demo
- Render service: srv-d8q0eaurnols738acgfg (workspace tea-d4ov5v1r0fns73ck7nvg, starter, Oregon)

## DESIGN LANGUAGE (commit to this)
- **Display font:** Fraunces (variable serif) for headlines + section labels. Editorial weight, signals seriousness.
- **Body font:** IBM Plex Sans for body + UI. Industrial, clear, anti-techy.
- **Numerics font:** JetBrains Mono for KPI numbers, counts, dollar amounts, dates.
- **Palette:**
  - Background: warm off-white (`#fbfaf7`), not pure white
  - Ink: deep blue-near-black (`#0d1220`)
  - Accent: deep brass/amber (`#c97a2b`) used sparingly for emphasis
  - Steel: muted blue (`#26415a`) for secondary information
  - Status: rose-700 / amber-700 / emerald-700 / steel-500 (muted, restrained)
- **Shape:** thin borders (1px), small radii (4-6px max), restrained shadow (subtle 1px ring + minimal drop). No bubbly cards.
- **Spacing:** 4-point grid. Generous vertical rhythm.
- **Texture:** subtle grain or noise on the hero band (CSS data-uri SVG), not gradients.
- **Motion:** restrained. Staggered reveal on first paint only. Hover states are micro (1-2px color change, no scaling animations).

## APP STRUCTURE (final)
Routes:
- `/` Dashboard - KPI strip, action queue, map preview, state risk list. Premium badge on the Action Queue if it implies autonomous monitoring.
- `/map` Full-screen interactive choropleth + pins. Mobile: full width with sticky filter bar.
- `/contractors` List + filters. Mobile: stacked cards, filter sheet at top.
- `/contractors/[id]` Profile + every document + outreach button.
- `/alerts` Tiered risk queue (Expired / <30d / <90d / <180d). Premium badge on the Auto-Outreach action.
- `/outreach` AI-drafted outreach composer. Whole page is Premium (Tier 3 agentic capability).
- `/upload` (NEW) Drag-and-drop with two modes: Manual (Tier 1, no AI) and Smart Intake (Premium, AI auto-extracts type/dates/coverage and auto-matches contractor). Both demoable.
- `/settings` (NEW) Settings panel: Microsoft 365 / Outlook OAuth connect, email-sending config, notification preferences, document type catalog, outreach email template editor, team & roles, audit log preview.

Components to add or rebuild:
- `Nav` - mobile drawer below md, refined typography, accent color for active link
- `KpiCard` - thin border, monospace numerics, no shadow
- `StatusBadge` - muted, refined dot + label
- `PremiumBadge` (NEW) - tiny "PREMIUM" pill in brass; appears next to features that depend on the AI agent
- `Dropzone` (NEW) - file dropzone shared by /upload (and reusable in /settings -> bulk import)
- `SegmentedToggle` (NEW) - Manual / Smart Intake toggle on /upload
- `IntegrationCard` (NEW) - settings card for Microsoft, email, etc.
- `SectionLabel` (NEW) - small uppercase tracked label used throughout pages
- `MobileNavSheet` (NEW) - off-canvas menu for sub-md

## SAMPLE DATA (already done)
- 90 contractors across 39 states, 389 documents, realistic risk spread.
- See `src/data/contractors.json` and `src/data/us-states.json`.
- Do not regenerate.

## BUILD CHECKPOINTS (Ralph-loop walks these in order)
- [x] C1-C20: Initial demo built + deployed (see git history, all done earlier today)

PIVOT WORK (2026-06-18 second pass, all incomplete):
- [x] C21: Install distinctive fonts via next/font (Fraunces + IBM Plex Sans + JetBrains Mono). Update globals.css tokens to match new palette. Verify build.
- [x] C22: Rebuild `Nav` with mobile drawer (sheet from right). New typography. Active-link underline in brass accent. Replace "Coverage Map" link with "Map", add "Upload" and "Settings" entries. No "Pricing" link.
- [x] C23: Create `PremiumBadge` component (small brass pill, all-caps tracked text PREMIUM, optional tooltip). Add it next to: /outreach page title, /upload Smart Intake mode, /alerts auto-outreach action, dashboard action-queue header.
- [x] C24: Rebuild `KpiCard` and `StatusBadge` in new design system. Refined, monospace numerics, no bubbly background tones.
- [x] C25: Redesign Dashboard (/) - section labels, refined hero (typography-led, not gradient), KPI strip, embedded map, action queue, state risk list. Fully mobile responsive.
- [x] C26: Redesign `/map` page - mobile sticky filter, map fills viewport down to bottom of screen, no overflow.
- [x] C27: Redesign `/contractors` page - desktop table -> stacked cards below md. Filter form collapses into a sheet.
- [x] C28: Redesign `/contractors/[id]` profile page - editorial layout, document timeline with refined status badges, premium-badged outreach button.
- [x] C29: Redesign `/alerts` page - tier sections with refined headers, premium badge on the auto-outreach feature.
- [x] C30: Redesign `/outreach` page (the composer) - keep functionality, refined chrome, add Premium badge to page header explaining this is the Tier 3 agent in action.
- [x] C31: Build `/upload` page - Dropzone component, Manual / Smart Intake segmented toggle, contractor picker (searchable list of 90 + Create-new inline form), date inputs, coverage limit, save toast. Smart Intake mode simulates AI extraction by parsing the filename for state codes / doc-type keywords and pre-filling, with a confidence badge. Premium badge on the Smart Intake side.
- [x] C32: Build `/settings` page - sections: Microsoft 365 connection (button shows "Connect" -> mocked connected state), Email sending (mock), Notification preferences (sliders for 180/90/30/day-of cadence per tier), Document type catalog (chips + add new), Outreach email template editor (textarea + variable picker), Team & roles (table with 4 placeholder rows), Audit log preview (mock entries).
- [x] C33: Mobile pass on every route at 375x812. Fix any overflow, font-size, tap-target issue. Use Playwright headless (or Chrome headless) to verify at 375x812, 768x1024, and 1440x1100.
- [ ] C34: Wiring audit: em-dash sweep clean, `npm run build` passes, every route 200 OK on the deployed URL.
- [ ] C35: Take screenshots at the 3 viewports for each of the 8 routes (24 total) into `screenshots/v2/`.
- [ ] C36: Update engagement memory + dfandi-ai/CONTINUITY.md with the new URL state + pivot note.
- [ ] C37: Mark DONE = true.

## WIRING AUDIT (run every iteration before checking a box)
1. `cd /Users/bjwet/dfandi-coverage-demo && npm run build` must succeed.
2. `grep -rnE "$(printf '\xe2\x80\x94|\xe2\x80\x93')" --include="*.ts" --include="*.tsx" --include="*.css" --include="*.md" src/` must return nothing (Rule 7).
3. No `any` types in committed code (TS strict).
4. After commit + push: wait ~3 min, then smoke test the live URL with curl on at least `/`, `/upload`, `/settings`.
5. Visual check: open `/` at 375 width (Playwright headless `--window-size=375,812`) and confirm no horizontal scrollbar.

## DEPLOY
- Render API key: rnd_VCIstdS0rlWoiUbxoCjWlXN232EL
- Service ID: srv-d8q0eaurnols738acgfg
- Auto-deploys on push to `main`; first build is the previous one already live.

## LOOP RULES (extended 2026-06-18)
- Each iteration: read this file -> find first unchecked [ ] -> do it -> run the WIRING AUDIT -> run the PHASE-CLOSE REVIEW below -> commit + push -> check the box -> continue.
- Max 1000 iterations (session-bounded; the 5-min cron naturally caps at ~2000 over 7 days, but stop early when DONE: true).
- Update this file AND `progress.txt` at the project root after every meaningful action so a context reset can resume from the file alone (compaction-safe).
- If stuck twice on the same checkpoint: write to `TODO_FOR_BRANDON.md` with file:line + what is needed, then continue with what is possible.
- Never silently skip a checkpoint.
- Em-dash rule fires before every commit.

## PHASE-CLOSE REVIEW (run after every multi-file change, before commit)
Senior engineer PR review on the diff:
1. **Correctness bugs.** Walk every changed function. Edge cases (empty arrays, null props, mobile widths, very long strings). Note file:line + the failure mode.
2. **Performance.** Look for accidental O(n^2), unnecessary re-renders, large client bundles, images without dimensions. Note file:line + the hot path.
3. **Security.** XSS via dangerouslySetInnerHTML, leaked secrets in client code, untrusted external URLs in src. Note file:line + the risk.
4. **Readability.** Dead code, magic numbers, inconsistent naming. Note file:line.
5. **Contract audit (frontend <-> data).** For every component, check: props it expects vs what callers pass; types in src/lib/types.ts vs the JSON shape; helper functions in src/lib/data.ts vs how pages consume them; any data transformations and whether they invert correctly. Format: `<file:line> | expected: <shape> | actual: <shape> | fix: <change>`. Fix every Tier 1 before commit.

## JOBS / IVE DESIGN AUDIT PROTOCOL (run alongside the PR review on UI changes)
For every screen and every component the phase touched, evaluate (do not implement during the audit):
- **Hierarchy:** does the eye land where it should within 2 seconds?
- **Spacing & rhythm:** consistent vertical rhythm; nothing cramped.
- **Typography:** every size earns its hierarchy; no competing weights.
- **Color:** restrained; brass used only for emphasis, never decoration.
- **Alignment:** every element on the grid; nothing off by 1-2px.
- **Components:** identical look + behavior across screens.
- **Iconography:** lucide-react only; consistent stroke/size.
- **Motion:** purposeful only; no decoration; respect prefers-reduced-motion.
- **Empty / loading / error states:** every screen has an intentional version of each.
- **Density:** can any element be removed without losing meaning? If yes, remove.
- **Responsiveness:** intentional at 320 / 375 / 768 / 1024 / 1440 / 1920, not just "scaled".
- **Accessibility:** focus rings, contrast, ARIA labels, keyboard reach.

Apply the Jobs filter to every element on every changed screen:
1. Would a user need to be told this exists? If yes, redesign.
2. Can this be removed without losing meaning? If yes, remove.
3. Does this feel inevitable? If no, keep refining.
4. Are the details users never see as refined as the visible ones?

Output a tiered list per phase: PHASE-1 Critical / PHASE-2 Refinement / PHASE-3 Polish. Fix Critical before commit. Refinement and Polish open new checkpoints (C-design-N) that the loop walks later. Do NOT silently ship cosmetic fixes; reference the design rule each fix serves.

## VISUAL AUDITOR (mandatory after every UI commit)
After every push that touches src/, wait for Render to deploy then run:

    npm run audit:visual

This walks every route at mobile / tablet / desktop, screenshots full pages,
and reports:
- overflow-x (page wider than viewport)
- nav-overflow (header doesn't fit)
- h1-low-opacity (text rendering invisible)
- tiny-tap-targets (under 30px tall on mobile)
- http-error / js-error / navigation-error

Findings land in `screenshots/audit/REPORT.md`. The exit code is non-zero when any of:
http-error, js-error, overflow-x, nav-overflow are present. Treat those as
blocking and fix BEFORE the next checkpoint. Use HEADED=1 to watch the run.

## MOBILE-FIRST CHECKLIST (must pass on every UI change)
For every page you touch, before commit, eyeball at 375x812 in dev or via headless:
- Nothing overflows horizontally
- Heading does not get cut off
- KPI grid wraps to 2 cols
- Tables become stacked cards
- Tap targets >= 32x32
- Forms readable; inputs full-width
- Map fills viewport, never clips
The visual-audit script enforces a subset of this automatically.

## OPS RESILIENCE (so the loop survives outages)
- Source of truth = GitHub. All code + sample data committed.
- Render is rebuildable: `git push` triggers a full rebuild from main; no state lives only on the Render box.
- Sample data is in-repo (`src/data/contractors.json`, `src/data/us-states.json`). No external API or DB to lose.
- The CLAUDE.md checkpoint state is in-repo. After every checkpoint, commit so a fresh context can pick up from the file alone.
- Screenshots live in `screenshots/` and are committed.
- Render service spec is documented in this file (id, plan, region, build/start commands).
- If Render dies: redeploy via `curl -X POST https://api.render.com/v1/services -d {...}` with the API key + same repo URL + same config; new URL issued; we point the world at it.
- If GitHub dies: local clone in `/Users/bjwet/dfandi-coverage-demo` is the working copy; can re-push to a new origin.
- If the local Mac dies: the GitHub repo is the master.
- Loop continuity: this file + progress.txt is the only state the next iteration needs.

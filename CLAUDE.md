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
- [ ] C25: Redesign Dashboard (/) - section labels, refined hero (typography-led, not gradient), KPI strip, embedded map, action queue, state risk list. Fully mobile responsive.
- [ ] C26: Redesign `/map` page - mobile sticky filter, map fills viewport down to bottom of screen, no overflow.
- [ ] C27: Redesign `/contractors` page - desktop table -> stacked cards below md. Filter form collapses into a sheet.
- [ ] C28: Redesign `/contractors/[id]` profile page - editorial layout, document timeline with refined status badges, premium-badged outreach button.
- [ ] C29: Redesign `/alerts` page - tier sections with refined headers, premium badge on the auto-outreach feature.
- [ ] C30: Redesign `/outreach` page (the composer) - keep functionality, refined chrome, add Premium badge to page header explaining this is the Tier 3 agent in action.
- [ ] C31: Build `/upload` page - Dropzone component, Manual / Smart Intake segmented toggle, contractor picker (searchable list of 90 + Create-new inline form), date inputs, coverage limit, save toast. Smart Intake mode simulates AI extraction by parsing the filename for state codes / doc-type keywords and pre-filling, with a confidence badge. Premium badge on the Smart Intake side.
- [ ] C32: Build `/settings` page - sections: Microsoft 365 connection (button shows "Connect" -> mocked connected state), Email sending (mock), Notification preferences (sliders for 180/90/30/day-of cadence per tier), Document type catalog (chips + add new), Outreach email template editor (textarea + variable picker), Team & roles (table with 4 placeholder rows), Audit log preview (mock entries).
- [ ] C33: Mobile pass on every route at 375x812. Fix any overflow, font-size, tap-target issue. Use Playwright headless (or Chrome headless) to verify at 375x812, 768x1024, and 1440x1100.
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

## LOOP RULES
- Each iteration: read this file -> find first unchecked [ ] -> do it -> run the wiring audit -> commit + push -> check the box -> continue.
- If stuck twice on the same checkpoint: write to `TODO_FOR_BRANDON.md` at the project root with file:line + what is needed, then continue with what is possible.
- Never silently skip a checkpoint.
- Em-dash rule fires before every commit.

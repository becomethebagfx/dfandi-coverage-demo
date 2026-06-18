@AGENTS.md

# DF&I Subcontractor Coverage Demo — Build Plan + Loop State

> Autonomous Ralph-loop project. Each iteration: read this file, do the next unchecked checkpoint, run the wiring audit at the bottom, mark progress, repeat. STOP when DONE = true.

## DONE
DONE: false

## CONTEXT (do not lose)
**Who:** Clark Brown (President, DF&I = Design Fabricators & Integrators, Louisville KY). Custom material-handling integrator. Discovery meeting 2026-05-27. As of 2026-06-18 Clark paused the QuickBooks-to-Excel automation engagement to hire a controller first. He is still interested in the **subcontractor coverage map**. This demo is the proactive pitch Brandon will send him next week.

**For Brandon to send the deployed Render URL to Clark cc Travis + Olivia, with a short note.**

**The real value (per RULE 0.5 layer-up):**
1. Liability exposure: never get caught with an uncovered sub on a live install. #1 driver.
2. Sales velocity at bid: instant answer to "do we have qualified subs in [state]?" when bidding.
3. Operational drag reduction: stop manually chasing PDFs and expiry emails.
4. Coverage strategy: see geographic gaps to inform recruiting.

## STACK
- Next.js 15 (App Router) + TypeScript + Tailwind v4 + Turbopack
- React-Leaflet + Leaflet (free OSM tiles, no Mapbox API key)
- US states GeoJSON (Natural Earth or public domain)
- lucide-react for icons
- Sample data: JSON file at `src/data/contractors.json` and `src/data/states.json`
- No backend / no auth for demo (read-only static data)
- Deploy: Render web service (Next.js standalone), workspace `tea-d4ov5v1r0fns73ck7nvg`

## PAGES (Next.js App Router)
- `/` Dashboard: brand hero, KPI cards (Total subs, States covered, Critical alerts, Expiring 90d), interactive US choropleth map with hover-state-count tooltips, contractor pins, side filters, critical-alert ticker below
- `/map` Same map, full-screen variant
- `/contractors` Sortable + filterable list (state, capability, status, search by name)
- `/contractors/[id]` Detail: contractor profile, every document with expiry badges, contact card, capabilities, jurisdictions, outreach button
- `/alerts` Risk queue grouped by tier: expired (red) | <30d (red) | <90d (amber) | <180d (yellow) | OK (green)
- `/outreach` AI agent outreach: select a contractor, see drafted email (Claude/Anthropic-style), [Demo] Send button shows toast

## DATA MODEL
- Contractor: id, company, contact_name, email, phone, address {street, city, state, zip, lat, lng}, capabilities[], status, notes
- Document: id, contractor_id, type (General Liability | Workers Comp | Auto Liability | Umbrella | State Contractor License | OSHA 30 | Drug Screening | W9), issued_date, expires_date, coverage_limit?, issuing_authority?, pdf_url?
- Capability enum: Mechanical Install | Electrical Install | Controls/PLC | Conveyor Install | Rigging | Crane Operator | Welding | Sheet Metal | Site Survey
- Document.status derives from expires_date: expired | critical (<30d) | warning (<90d) | upcoming (<180d) | ok
- Contractor.status = worst document status

## SAMPLE DATA RULES
- ~90 fictional contractors, US-wide with bias toward UPS/FedEx hub states (KY, TN, OH, IN, IL, MS, FL, TX, GA, AZ, NV, CA, NJ, PA)
- Plausible company-name patterns (e.g. "Bluegrass Conveyor Services LLC", "Sun Belt Material Systems", etc.)
- Each contractor: 3-6 documents
- Realistic expiration spread: ~8% expired, ~10% <30d, ~15% <90d, ~25% <180d, rest ok
- Coordinates roughly placed in major cities of each state
- Capabilities distributed (some specialist, some generalist)

## BUILD CHECKPOINTS (Ralph-loop walks these)
- [x] C1: Project scaffolded (next 15 + TS + Tailwind + App Router + src dir)
- [x] C2: Install deps (react-leaflet, leaflet, @types/leaflet, lucide-react, clsx)
- [x] C3: Generate sample data: src/data/contractors.json, fetch US states GeoJSON to src/data/us-states.json
- [x] C4: Types + data loaders (src/lib/types.ts, src/lib/data.ts, src/lib/status.ts)
- [x] C5: Shell layout: top nav (DF&I logo lockup, page links, DEMO badge), Tailwind theme tokens (DF&I blue), 8-pt grid, root layout
- [x] C6: KPI cards component + dashboard top section
- [x] C7: Interactive US choropleth map component (hover-tooltips per state with count + risk; click to filter list)
- [x] C8: Contractor pins overlay on the map (clustered when zoomed out, status-colored)
- [x] C9: Filters sidebar (state, capability, status, search) wired to URL params
- [x] C10: /contractors list view (sortable cards/table)
- [x] C11: /contractors/[id] detail page
- [x] C12: /alerts page (tiered queue)
- [x] C13: /outreach page (contractor picker + drafted email preview + [Demo] Send toast)
- [ ] C14: Polish: empty states, loading skeletons, responsive on tablet, accessibility pass
- [x] C15: Wiring audit (em-dash sweep, broken-link sweep, type-check npm run build passes)
- [ ] C16: Create public GitHub repo dfandi-coverage-demo under brandonhayman.b
- [ ] C17: Git commit + push
- [ ] C18: Deploy to Render via API (workspace tea-d4ov5v1r0fns73ck7nvg), get public URL
- [ ] C19: Smoke test deployed URL (curl + Playwright screenshots on the 6 pages)
- [ ] C20: Set DONE: true and update this file

## WIRING AUDIT (run each iteration before marking next checkpoint complete)
- npm run build must succeed
- grep for em/en dash bytes in src/ returns nothing (Rule 7)
- Every page renders without runtime error (npm run dev for spot check)
- No any types in committed code (TS strict mode)
- Sample data: at least 75 contractors, every state >= 1 contractor in at least 30 states, expired/critical/warning/ok spread present
- Map: clicking a state filters the list; clicking a marker opens the detail page

## DEPLOYMENT NOTES
- Render API key: rnd_VCIstdS0rlWoiUbxoCjWlXN232EL
- Workspace ID: tea-d4ov5v1r0fns73ck7nvg (brandonhayman.b@gmail.com personal)
- Region: oregon (default) or ohio for closer-to-Louisville latency
- Web Service config: build = npm install && npm run build, start = npm run start, Node 22, plan = free or starter
- Auto-deploy from GitHub main branch
- Once live, update CONTINUITY in /Users/bjwet/dfandi-ai/ with the URL

## ACCEPTANCE CRITERIA (what "done" means)
1. Brandon can open the live Render URL on his phone and the map works
2. Hovering Texas shows "Texas: N contractors, M expiring soon"
3. Critical alerts ticker on home page surfaces at least one expired-document case
4. /outreach shows a drafted AI email that reads like Claude wrote it
5. No em-dashes anywhere
6. Production build green
7. Screenshots saved for record

## LOOP RULES
- Each iteration: read this file -> find first unchecked [ ] -> do it -> run the wiring audit -> check it [x] -> commit progress -> continue
- If stuck twice in a row on the same checkpoint: write a question to TODO_FOR_BRANDON.md at the project root with file:line + what's needed and continue with what is possible
- Never silently skip a checkpoint

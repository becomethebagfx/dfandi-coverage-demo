# DF&I Subcontractor Coverage - Architecture

> Custom internal app built by The Solution Service LLC for Design Fabricators & Integrators. This file is the architect-of-record. Update it on every architectural change. Keep it terse and current.

## Goal
A single operational view of DF&I's subcontractor network: who they have, where, what each is qualified for, what is current vs expiring, and an autonomous agent that closes the loop on renewals.

## Production URL
- App: https://dfandi-coverage-demo.onrender.com
- GitHub (source of truth): https://github.com/becomethebagfx/dfandi-coverage-demo
- Render service: `srv-d8q0eaurnols738acgfg` (workspace `tea-d4ov5v1r0fns73ck7nvg`, starter plan, Oregon)

## Tiers (no SaaS pricing page in-app; tiers are an internal model that surface via PremiumBadge)
1. **COMPLIANCE LIBRARY** - directory, manual upload, expiration tracking, map. No AI document understanding.
2. **SMART INTAKE** (Premium) - everything in 1, plus AI reads dropped PDFs to extract type/dates/coverage and auto-matches contractor.
3. **AUTONOMOUS COMPLIANCE AGENT** (Premium) - everything in 1+2, plus the agent watches expiries, sends 180/90/30/day-of emails, ingests reply PDFs, updates DB, internal alerts, full audit log.

## Stack
- Next.js 16 (App Router, Turbopack), TypeScript strict.
- Tailwind v4 with @theme tokens; CSS variables for all design tokens.
- Fonts (via next/font/google): Fraunces (display, variable + opsz/SOFT axes), IBM Plex Sans (body), JetBrains Mono (numerics).
- React-Leaflet + Leaflet (client-only via next/dynamic ssr:false). Free OSM tiles via Carto.
- lucide-react for icons.
- No backend, no auth, no database. All data is bundled JSON.
- Auto-deploys from `main` to Render Web Service. Standard Node build/start.

## Module map
```
src/
  app/
    layout.tsx       Root layout, fonts, grain texture, header + footer.
    page.tsx         Overview / dashboard.
    map/             Full-screen interactive map.
    contractors/    List view with filters.
    contractors/[id]/ Contractor profile.
    alerts/          Tiered risk queue.
    outreach/        AI-drafted renewal email composer.
    upload/          Drop-and-extract intake.
    settings/        Workspace settings.
  components/
    Nav.tsx          Sticky header + mobile drawer.
    KpiCard.tsx
    StatusBadge.tsx
    SectionLabel.tsx
    PremiumBadge.tsx
    Map/USMap.tsx    Choropleth + pins + hover panel.
    Map/USMapDynamic.tsx   Client-only dynamic wrapper.
    OutreachComposer.tsx   Client component for outreach page.
    UploadComposer.tsx     Client component for upload page (manual + AI modes).
  lib/
    types.ts         Contractor, ComplianceDoc, Address, Capability, StatusTier.
    status.ts        tier derivation, TODAY anchor, color tokens per tier.
    data.ts          loaders, rollups, formatters.
  data/
    contractors.json   90 fictional subs, 389 documents.
    us-states.json     PublicaMundi public-domain state GeoJSON.
```

## Data model (in TypeScript)
- `Contractor { id, company, contact_name, email, phone, address{...}, capabilities[], documents[], notes }`
- `ComplianceDoc { id, type, issued_date, expires_date, coverage_limit?, issuing_authority?, pdf_url? }`
- `StatusTier = expired | critical | warning | upcoming | ok`
- `StateRollup { code, name, contractor_count, expired_count, critical_count, warning_count, worst_status }`

`tierForDoc(doc)` is the single source of truth for status derivation. All UI uses `TIER_STYLE[tier]` for color and label. No tier color is hardcoded outside `src/lib/status.ts`.

## State diagram for an in-life document
```
draft   ->  ok  ->  upcoming (<180d) ->  warning (<90d) ->  critical (<30d) ->  expired
                                                           \---(agent emails @180,90,30,0)---/
                                                           reply with new PDF -> ingest -> ok
                                                           no reply through critical+expired -> internal alert
```

## State diagram for the autonomous agent
```
WATCH (cron daily) ---finds-doc-at-threshold---> COMPOSE  ---sends--->  WAIT_REPLY
   ^                                                                      |
   |                              <----reply-with-pdf---ingest-extract--- |
   |                                                                      |
   ---no-reply-by-next-threshold--- ESCALATE --> COMPOSE (sharper) --> WAIT_REPLY
                                                       |
                                       past-day-of? --INTERNAL_ALERT --> resolved
```

## Build / compile gates
- `npm run build` must exit 0.
- TS strict; no `any` types in committed code.
- `grep -rnE em-dash bytes --include="*.ts" --include="*.tsx" --include="*.css" src/` must return nothing.
- Every route renders 200 on the live URL after deploy.
- Every page renders without horizontal scrollbar at 375x812.

## Deploy
- Render auto-deploys on push to `main` (build: `npm install && npm run build`, start: `npm start`, Node 22).
- API key is documented in CLAUDE.md DEPLOYMENT section for re-creation.

## Ops resilience
- GitHub is the master. Everything (source, data, screenshots, this file, CLAUDE.md) lives there.
- Local working copy at `/Users/bjwet/dfandi-coverage-demo` is a clone, not the source of truth.
- If Render fails: `curl -X POST https://api.render.com/v1/services -d ...` recreates the service from the same repo; new URL issued.
- If GitHub fails: local clone can be pushed to a fresh origin. Sample data is in-repo so nothing is lost.
- If the local Mac fails: clone fresh from GitHub on any machine, `npm install`, continue.

## Out of scope (this project)
- No real auth, no real database, no real PDF parsing. Settings page shows mocked integrations.
- No SaaS pricing UI. Tiers communicate via PremiumBadge on premium features only.

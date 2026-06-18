# DF&I Subcontractor Coverage Demo

Interactive demo built by **The Solution Service LLC** for **Design Fabricators & Integrators (Louisville, KY)**.

A coverage and compliance dashboard for DF&I's subcontractor base: interactive US map with risk-colored states, contractor pins, full directory, document expiration tracking, and an AI-drafted outreach composer that generates renewal emails per contractor.

All data is fictional sample data. No real records.

## Run locally

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run start
```

## Stack
- Next.js 16 (App Router, Turbopack)
- TypeScript + Tailwind v4
- React-Leaflet + Leaflet (free OSM tiles via Carto)
- US states GeoJSON (PublicaMundi public domain)
- lucide-react icons

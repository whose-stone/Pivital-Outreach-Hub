# Pivital.ai Outreach Dashboard

## Overview
A full-stack community outreach and presentation strategy dashboard for Pivital.ai. Manages events, training topics, and target audience segments for Phoenix-area outreach campaigns.

## Architecture
- **Frontend**: React + Vite, Tailwind CSS v4, Wouter routing, TanStack Query
- **Backend**: Express.js REST API
- **Database**: PostgreSQL via Drizzle ORM
- **UI**: Radix UI components with glassmorphism design, Inter + Playfair Display fonts

## Database Tables
- `events` — outreach events (organization, topic, date, time, format, venue, category, summary, callToAction, executionNotes)
- `audiences` — target audience segments (name)
- `topics` — training/presentation topics (name)
- `users` — reserved for future auth

## API Routes
All prefixed with `/api`:
- `GET/POST /api/events`
- `PATCH/DELETE /api/events/:id`
- `GET/POST /api/audiences`
- `PATCH/DELETE /api/audiences/:id`
- `GET/POST /api/topics`
- `PATCH/DELETE /api/topics/:id`

## Pages & Routes
- `/` — Calendar view (monthly) with overview stats
- `/events` — All events directory with search/filter
- `/schedule` — Chronological timeline view
- `/in-person` — In-person sessions only
- `/webinars` — Virtual webinars only
- `/audiences` — Target audience segments CRUD
- `/topics` — Training topics CRUD

## Key Files
- `client/src/context/EventContext.tsx` — React context wrapping all API calls via TanStack Query
- `client/src/data/events.ts` — Legacy seed data types (still referenced for type shape, data now comes from DB)
- `server/storage.ts` — Database storage layer (DatabaseStorage class)
- `server/routes.ts` — Express API route handlers
- `server/db.ts` — Drizzle ORM database connection
- `shared/schema.ts` — Drizzle schema + Zod validation types

## Design
- Primary color: `#00A4A6` (teal, from Pivital.ai brand)
- Glassmorphism cards with `glass-card` utility class
- Section accent colors: Green (in-person), Blue (webinars), Purple (audiences), Amber (topics)

## Development
- `npm run dev` — Start full-stack server on port 5000
- `npm run db:push` — Push schema changes to PostgreSQL
- `npm run build` — Build for production

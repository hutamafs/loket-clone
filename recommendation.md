# Recommendations (Beyond PRD)

These enhancements can elevate the project to a standout internship portfolio piece.

## Architecture & Code Quality

- Introduce a lightweight service layer (`/src/services`) to separate API shape from component usage (e.g. `createOrder`, `createCheckoutSession`).
- Add a domain-centric naming convention: `OrderStatus`, `EventSource` enums to avoid string litter.
- Use a central event normalization util so TM and custom events map to unified `UIEvent` type.

## Observability

- Add basic request logging + timing (middleware) and surface slow API handlers.
- Integrate simple error tracking (e.g. Sentry) for production readiness.

## Security & Hardening

- Validate Stripe webhook signature strictly (raw body parse) – document in README.
- Apply Row Level Security (RLS) policies for Supabase tables (orders only accessible by owner or organizer). Provide example policies.
- Rate-limit sensitive endpoints (orders, checkout) using edge middleware or a simple in-memory token bucket (dev) + KV store idea for prod.

## Performance

- Implement HTTP caching headers for TM proxy (short TTL) + stale-while-revalidate.
- Add React Suspense boundaries + streaming where appropriate (home sections).

## Testing Strategy

- Unit: zod schemas (refine logic), order price calc, merge custom + TM events sort.
- Integration: mock Stripe session creation + webhook flow.
- E2E: Playwright script: browse -> select ticket -> checkout -> webhook simulate -> tickets list.

## DX Improvements

- Add `make dev`, `make format`, `make typecheck` shortcuts or npm scripts.
- Provide a seed script for custom events (e.g. `scripts/seed.ts`).
- Add Storybook or a simple component preview route for isolated UI iteration.

## Analytics & Insights (Stretch)

- Track funnel metrics: viewed event -> started checkout -> completed payment.
- Organizer dashboard mini chart (tickets/day) using a windowed SQL view.

## Real-time Features

- Live ticket sold updates via Supabase realtime subscription filtered by event_id.
- Optimistic UI for favorites & order placement while Stripe redirect pending.

## Deployment Readiness

- Add Dockerfile + compose (db + edge simulator) for reproducible demo.
- Health check endpoint returning build commit + dependency versions.

## Accessibility & Usability

- Keyboard navigable map toggle + skip links.
- Form error announcements with aria-live.

## Documentation

- Architecture overview diagram (sequence diagram for checkout lifecycle).
- SECURITY.md summarizing data handling + secrets.

---

Prioritize based on time; even 3–4 of these will significantly elevate polish.

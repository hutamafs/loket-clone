# Project TODO (Derived from PRD vs Current State)

Legend: P0 = must-have (current 2-week scope), P1 = shine/stretch in PRD week2, Stretch = optional extra.

## 0. Baseline Audit Snapshot

Current implemented:

- Ticketmaster event listing + homepage sections (Featured, Top, Upcoming)
- Basic event detail page (no tabs fully wired? has tabs & map placeholder)
- Checkout Step1 (quantity select) – local state only
- Checkout Step2 (attendee form) – local state, mock POST to /api/orders (not Supabase, wrong contract shape)
- Map page with static Google Map (no dynamic markers, clustering, or viewport fetch)
- API proxies: /api/events/ticketmaster, /api/events/ticketmaster/[id]
- /api/orders mocked (console.log, no persistence)
- Supabase client initialized (unused in routes)
- No auth, no Stripe integration, no webhooks, no UGC event creation, no uploads, no favorites, no analytics.

## 1. Data & Infrastructure (P0)

[] Add Supabase schema migration docs / SQL (profiles, events, orders, favorites) under `supabase/` or docs.
[] Implement server-side helpers: `lib/db/orders.ts`, `lib/db/events.ts` for Supabase interactions.
[] Update /api/orders route to validate (zod) and insert pending order into Supabase with correct fields.
[] Introduce environment variable validation (e.g. `env.ts`) for STRIPE keys, SUPABASE keys, BASE_URL.

## 2. Auth (P0 prerequisite for UGC but PRD places Auth in Week2; may start scaffolding early)

[] Configure Supabase Auth (email + Google) client-side provider (create auth context / hooks).
[] Protected routes / server components (organizer dashboard, create event) with RLS-ready checks.
[] Profiles upsert on first login.

## 3. Checkout E2E (Week1 P0)

[] Step1: Bind quantity to context or checkout store (Zustand) so Step2 can access.
[] Step1: Validate max quantity (placeholder until inventory logic) & disable continue if 0.
[] Step2: Replace local form with React Hook Form + zod schema; realtime validation.
[] Step2: Form submission flow: 1) Create pending order (POST /api/orders) storing attendee & quantity. 2) Call POST /api/checkout to create Stripe Session (line items from order total) incl metadata {orderId}. 3) Redirect to Stripe Checkout (use stripe-js).
[] Implement /api/checkout route (server) – create session via Stripe SDK.
[] Install Stripe dependency & set webhook secret env vars.
[] Implement /api/webhooks/stripe – verify signature, on checkout.session.completed mark order paid (stripe_session_id match) and set total_amount from session.
[] Success page (e.g. /checkout/success?session_id=) – load session via Stripe API, find order by stripe_session_id, render summary.
[] My Tickets page (/dashboard/orders or similar) – list user orders (paid + pending) with basic status display.
[] Update price logic: derive totalAmount (cents) from event.price.min or fallback.
[] Refactor Step2 Order Summary to reflect quantity \* price, currency symbol dynamic.
[] Add loading / error / success toasts (sonner) around checkout operations.

## 4. Map-Based Discovery (Week2 P0)

[] Enhance EventMap: accept controlled center & bounds.
[] On map idle (debounced 400ms), compute center + approximate radius => fetch events via existing TM endpoint with lat,lng,radius.
[] Display markers for events (basic first, then cluster).
[] Add simple client-side marker clustering (e.g. using @googlemaps/markerclusterer or custom) – install dependency.
[] Support pagination (keep page param & next page token from TM; propagate through map query state).
[] Sync map interactions with a sidebar event list (list updates on refetch).
[] Mobile: map drawer pattern (list primary, map toggle) & desktop split view.

## 5. Create Event (UGC) (Week2 P0)

[] New route /dashboard/events/new (already placeholder? create if not) server wrapper + client multi-step.
[] Multi-step form: (1) Details (name, description, start/end, category, price range, currency) (2) Location (venue name, address search autocomplete, lat/lng) (3) Image upload + preview.
[] Implement /api/upload for S3 presign (PUT) – env vars for bucket, region, key, signature.
[] Perform PUT directly from browser to S3, store image_url.
[] Insert row into events; organizer_id = current user.
[] Ensure events API merging: when fetching homepage sections, fetch custom events (source='custom') limited & merge (include organizer label).
[] Organizer Dashboard: list my events (with counts placeholder for orders) – stub aggregator queries.

## 6. Analytics (P1)

[] Add endpoint or server util to aggregate orders per event (count, sum total_amount where status='paid').
[] Display counts in organizer dashboard (lazy load).
[] (Realtime – Stretch) Subscribe via Supabase realtime on orders table for events I own; update badge.

## 7. Favorites (P1)

[] Favorites table SQL already in PRD; implement /api/favorites (POST toggle, GET list).
[] Heart icon component on event cards; optimistic update; store user favorites locally.
[] My Favorites page or integrate into existing list.

## 8. UI Polish & Consistency (Cross-cutting)

[] Unify currency / price formatting util.
[] Replace magic numbers (e.g. fallback price 100) with constants.
[] Accessibility: label associations, button aria-disabled states, focus rings.
[] Error boundaries for key server components (event detail, checkout wrapper).
[] Skeleton states for map + event cards loading.

## 9. Validation & Types

[] Central zod schemas: EventCreateSchema, OrderCreateSchema, AttendeeSchema.
[] Derive TypeScript types from zod outputs.
[] Update API handlers to parse & narrow request bodies.

## 10. DevOps / DX Enhancements

[] Add `env.example` with required vars (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, SUPABASE_URL, SUPABASE_ANON_KEY, S3_BUCKET, S3_REGION, S3_ACCESS_KEY, S3_SECRET_KEY, NEXT_PUBLIC_BASE_URL, NEXT_PUBLIC_GOOGLE_MAPS_API_KEY).
[] Add `scripts/db/apply.sql` containing schema; README update for setup.
[] Add lint rule overrides for server components where needed.
[] Add simple unit tests (price calc, order payload builder) once infra solid.

## 11. Stretch (Optional but Valuable)

[] Realtime tickets sold badge with Supabase live query.
[] Favorites count on event cards.
[] Basic analytics charts page (line chart sales over time, bar revenue by category).
[] Rate limiting middleware for write endpoints (/api/orders, /api/checkout, /api/upload).
[] Caching layer for Ticketmaster API to reduce rate usage.

## 12. Order of Execution (Suggested Timeline)

Day 1-2: Orders persistence + schemas + env validation.
Day 2-3: Stripe checkout + webhook + success page.
Day 4: My Tickets + polish checkout UI.
Day 5: Buffer / hardening / auth groundwork.
Day 6-7: Map viewport fetch + markers + clustering + pagination.
Day 8-9: Create Event form + upload flow + merge custom events.
Day 10: Organizer dashboard + basic analytics counts.
Day 11-12: Favorites + UI polish.
Day 13: Stretch / realtime or performance.
Day 14: QA & documentation.

---

Add, reorder, or mark completed in this file as work progresses.

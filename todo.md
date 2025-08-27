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

✅ Supabase base schema (`supabase/schema.sql`) for profiles + orders (events & favorites still pending)
✅ Server-side helper: `lib/db/orders.ts` (events helper pending)
✅ /api/orders route uses zod + inserts pending order
[] Extend schema for events table + favorites table
[] Add `lib/db/events.ts`
[] Add environment variable validation module (`env.ts`)
[] Document migrations / add `supabase/README.md`

## 2. Auth (P0 prerequisite for UGC but PRD places Auth in Week2; may start scaffolding early)

[] Configure Supabase Auth (email + Google) client-side provider (create auth context / hooks).
[] Protected routes / server components (organizer dashboard, create event) with RLS-ready checks.
[] Profiles upsert on first login.

## 3. Checkout E2E (Week1 P0)

✅ Stripe dependency installed
✅ /api/checkout/session endpoint creates pending order + Stripe session
✅ Webhook `/api/webhooks/stripe` marks order paid (checkout.session.completed)
✅ Order stores `stripe_session_id`
✅ Success URL includes `session_id` & order id
✅ Fallback endpoint `/api/checkout/session-status` + success page polling
✅ Success page shows status badge (Paid / Pending)
✅ Basic multi-step UI (quantity, attendee, payment)
◐ Order summary uses pseudo price (real pricing pending)
◐ Price & fee calculation simple ($2 fee, deterministic pseudo unit price)
[] Bind quantity & attendee data to shared store (optional; current local state works)
[] Add max quantity validation + const for limit
[] Replace attendee form with React Hook Form + zod live validation
[] My Tickets page listing orders
[] Real price extraction from Ticketmaster data (min/max price range)
[] Dynamic currency symbol & formatting util
[] Toast notifications (success/error) via sonner
[] Idempotent session creation (reuse existing session if pending)
[] Show payment method details (brand/last4) on success page

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

◐ Basic select component improved (open/close, keyboard escape)
[] Unify currency / price formatting util
[] Replace magic numbers (e.g. service fee, pseudo price) with constants/config
[] Accessibility: focus states & aria attributes audit
[] Error boundaries for key server components (event detail, checkout wrapper)
[] Skeleton states for map + event cards loading
[] Consistent button variants & spacing review

## 9. Validation & Types

✅ OrderCreateSchema & AttendeeSchema (zod) in place
[] EventCreateSchema
[] Shared price schema / normalization
[] Add runtime env schema
[] Ensure every API handler uses schema parse (session-status & checkout endpoints)

## 10. DevOps / DX Enhancements

◐ Base schema file exists (needs events/favorites + apply script wrapper)
[] `env.example` with current required keys (Stripe, Supabase, Google Maps)
[] `scripts/db/apply.sql` or migration instructions
[] env validation script
[] Basic Jest/Vitest setup & unit tests (price calc, order creation)
[] Logging util (structured console) for webhook & checkout

## 11. Stretch (Optional but Valuable)

[] Realtime tickets sold badge with Supabase live query
[] Favorites count on event cards
[] Basic analytics charts page (sales over time, revenue by category)
[] Rate limiting middleware for write endpoints
[] Caching layer for Ticketmaster API responses
[] Email notifications (order confirmation / ticket delivery)
[] Ticket artifact generation (PDF / QR code)
[] Refund & dispute webhook handling
[] Session expiration cleanup job (pending orders stale >24h)

## 12. Order of Execution (Suggested Timeline)

Day 1-2: Orders persistence + schemas + env validation.
Day 2-3: Stripe checkout + webhook + success page. (Completed)
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

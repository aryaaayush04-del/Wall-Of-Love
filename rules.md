# Agent Rules of Conduct

Project: Wall of Love (rebrand in progress) — testimonial collection & deck-export SaaS
Reference: See `PRD.md` for product context, schema, and feature spec. If a request conflicts with `PRD.md`, flag it — don't silently override.

---

## 1. Approved Libraries & Stack

Stick to this list. Don't introduce a new dependency without asking first — even a small one.

| Layer | Use | Do not use |
|---|---|---|
| Framework | Next.js (App Router) | Pages Router, other frameworks |
| UI | React, Tailwind CSS | CSS-in-JS libs, Bootstrap, MUI, styled-components |
| Icons | lucide-react | Random icon packs |
| DB/Auth | Supabase (PostgreSQL, `@supabase/supabase-js`) | Prisma, raw `pg`, other ORMs |
| Sanitization | Custom strict URL sanitization (`src/lib/sanitize.ts`) | DOMPurify (not used), raw unescaped HTML |
| Payments | PayPal Business SDK | Stripe SDK (until we explicitly migrate — see PRD §8) |
| Hosting/Deploy | Vercel | — |
| Validation | Ad hoc manual validation (currently used in Server Actions) | — |

If a task seems to need something outside this table, stop and ask rather than picking a package.

---

## 2. What the Agent Can Do Autonomously

- Write/edit React components and UI within existing patterns
- Write Server Actions that follow the existing RLS/service_role pattern
- Write Supabase queries that respect RLS (client-side, `auth.uid()`-scoped)
- Fix lint, type, and build errors
- Write and update tests
- Refactor code without changing behavior or schema
- Update non-critical copy/UI text

## 3. What Requires Explicit Confirmation First

Never do these silently — propose the change and wait for a yes:

- Modifying or adding **Row Level Security policies**
- Any change touching the **PayPal integration** or payment flow
- Schema changes (new tables/columns, migrations) — must go through a migration file, never a direct prod DB edit
- Installing a new dependency
- Deploying to production / pushing to `main`
- Anything that touches `.env` files, secrets, or the `service_role` key
- Deleting data or dropping tables
- Force-pushing or rewriting git history

## 4. Hard Boundaries — Never Do This

- Never expose the Supabase `service_role` key in client-side code — it's server-only, used exclusively inside the `/submit/[user_id]` Server Action
- Never log or expose private submitter data in a client-facing response
- Never disable or bypass RLS "temporarily" to unblock a task — fix the policy instead
- Never hardcode API keys, tokens, or credentials — env vars only
- Never skip server-side URL sanitization (via `sanitizeUrl`) on any testimonial URLs before render
- Never assume the honeypot field should be visible or labeled — it must stay CSS-hidden and untouched by validation logic that would tip off bots

---

## 5. Error Handling Standard

- Server Actions return a typed result — `{ success: boolean, error?: string, data?: T }` — never throw raw errors across the client/server boundary
- Wrap every Supabase and PayPal call in `try/catch`; log the real error server-side (console/log service), return a generic safe message to the client
- Never surface raw stack traces, DB error strings, or internal IDs to end users
- Bot-flagged submissions (honeypot triggered) should fail **silently** — return a generic success-like response, don't reveal detection logic
- Prefer graceful degradation over hard failure: if the embed widget can't fetch testimonials, it should render empty/hidden, not throw a visible error on a client's site
- Any new error path should log enough context to debug without needing to reproduce

---

## 6. Terminal / Execution Boundaries

Recommended Antigravity Deny List additions for this workspace:
- `rm -rf`, any recursive delete outside `node_modules`/`.next`
- `git push --force`, `git push -f`
- Any direct `psql`/SQL client command against production
- `vercel --prod` / production deploy commands

Keep destructive and deploy-related commands on **Auto** or **Off**, not Turbo.

---

## 7. Living Document

This file should evolve alongside `PRD.md`. When we add a library, change an architectural boundary, or shift a security rule, update this file in the same session — don't let it drift from what the codebase actually does.

*Last updated: 2026-07-17*

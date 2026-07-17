# Project Memory & Logbook

This file serves as a chronological log of all major actions, decisions, and architectural shifts made in this project. It tracks the "what" and the "why" to provide context for future development.

**Rule for Agents:** Whenever a new task is completed that modifies the codebase or project structure, an entry MUST be appended to this file.

---

## [~ Mid-July 2026] - Initial Scaffold & Core Setup
- **Action:** Initialized the project with Next.js (App Router), Tailwind CSS v4, Shadcn UI, and Supabase SSR.
- **Logic & Reason:** Established the foundational tech stack to ensure a fast, modern, and easily deployable architecture on Vercel. Supabase was chosen for seamless Postgres and Auth integration.

## [~ Mid-July 2026] - Database & Security Implementation
- **Action:** Created `profiles` and `testimonials` tables in Supabase. Implemented Row Level Security (RLS) policies scoped to `user_id`.
- **Logic & Reason:** Essential for a multi-tenant SaaS architecture. Ensures that wall owners can only view, mutate, and manage their own collected data, preventing unauthorized access across accounts.

## [~ Mid-July 2026] - Frictionless Submission Engine & Spam Protection
- **Action:** Built the public `/submit/[user_id]` route using a Server Action powered by the Supabase Admin client (`service_role`). Integrated Upstash Redis rate-limiting and a CSS-hidden honeypot field.
- **Logic & Reason:** The core UX philosophy demands reviewers shouldn't need an account to leave a testimonial. The Admin client was necessary to safely bypass client RLS for inserts. Because the endpoint is public, the honeypot and rate limiting were added as silent security layers against automated bot spam.

## [~ Mid-July 2026] - Dashboard, Widget Preview, and XSS Security
- **Action:** Built the authenticated dashboard (for approving/rejecting testimonials) and the universal iframe route (`/widget/[user_id]`). Implemented strict custom server-side URL sanitization (`src/lib/sanitize.ts`).
- **Logic & Reason:** Gave founders full control over which testimonials are displayed. Instead of a heavy dependency like DOMPurify, a strict custom URL sanitizer was written to neutralize malicious schemes (`javascript:`, `data:`) before React safely renders the text content, securing the widget against XSS attacks on host client sites.

## [2026-07-17] - Documentation Alignment & Roadmap Definition
- **Action:** Audited the codebase and updated `PRD.md` and `rules.md` to reflect reality (removed `DOMPurify` and `Zod`, updated schema fields like `is_approved`, `platform`, `post_url`). Authored `architecture.md` and `phases.md`.
- **Logic & Reason:** Project documentation had drifted from the actual implementation. Fixing this established a robust single source of truth and clearly defined the upcoming phases (UI overhaul, Deck Export) needed before the MVP launch.

---
*(End of Past Logs - Future tasks will be appended below)*

## [2026-07-17] - Complete UI/UX Overhaul & Design System Application
- **Action:** Applied the strict "Ledger & Paper" physical brand identity from `design.md` across the entire app. Removed Next-Themes/Dark Mode to strictly enforce the unique color tokens (`ledger`, `paper`, `brass`, `moss`, `rust`, `fade`). Built a completely custom Landing Page (`/`) with a distinct structural "slide framing" layout and "seal of approval" signature. Moved the dashboard to `/dashboard`, restyled the login page to fit the product UI, and visually passed over `DashboardTestimonialCard`, `Sidebar`, `Settings`, and `Widget` components. Switched fonts to Fraunces (Hero/Display), IBM Plex Sans (Body), and IBM Plex Mono (Data).
- **Logic & Reason:** The app needed to step away from the generic "AI-generated SaaS" aesthetic to build intense trust with B2B consultants. The new design system physically resembles a rigorously verified ledger or stamped certificate, which perfectly aligns with the core value proposition of Wall of Love (verified proof).

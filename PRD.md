# Product Requirements Document
**Product:** Wall of Love *(rebrand in progress — name TBD, update this header once finalized)*
**Status:** Pre-launch / MVP validation phase
**Last updated:** 2026-07-17
**Owner:** Arya (Founder)

---

## 1. Product Vision

A lightweight, high-conversion testimonial collection and embed widget SaaS. Monetized through a slot-limited Lifetime Deal (LTD), built on a technical philosophy of bulletproof reliability and zero server overhead — favoring direct, zero-friction client links over fragile API scraping.

**Core differentiator:** unlike generic testimonial-widget tools, this product exports collected testimonials directly into proposal-deck-ready formats, giving consultants and agencies social proof they can drop straight into a sales deck — not just a webpage embed.

---

## 2. Target Audience (ICP)

| Priority | Segment | Notes |
|---|---|---|
| **Primary** | B2B consultants & agency owners | Sub-niches: business consulting, performance marketing, branding/creative agencies, SEO agencies. Deck-export is the hook — they need testimonials *in* proposals, not just on a website. |
| **Secondary** | Freelance web developers | Embed widgets into client sites without passing on recurring subscription costs to clients. |
| **Deprioritized** | Course creators / online coaches | Explored via Skool outreach; most lacked websites suited for embed widgets, weakening fit. Kept as a possible future segment, not a launch focus. |

---

## 3. Core Differentiator

**Testimonial → Proposal Deck Export**
Founders don't just collect and embed reviews — they select approved testimonials and export them into a ready-to-use slide/deck format for sales proposals. This is the primary reason a consultant/agency owner would choose this over a generic widget tool.

---

## 4. Tech Stack

- **Frontend/Framework:** Next.js (App Router), React, Tailwind CSS
- **Hosting:** Vercel
- **Backend/DB:** Supabase (PostgreSQL) — Auth + Database
- **Payments:** PayPal Business *(see §8 — updated from original Stripe-only plan)*

---

## 5. Core Features

### 5.1 Private Dashboard
- Authenticated area, protected via Next.js Edge Middleware
- View collected reviews, manage widget settings (e.g. `widget_title`)
- Generate submission links
- Select testimonials and trigger deck export (§5.4)

### 5.2 Frictionless Submission Engine
- Public route: `/submit/[user_id]` — no account required for reviewers
- Powered by a Next.js Server Action, using the `service_role` key to bypass client RLS on insert
- Bot protection via a CSS-hidden honeypot field

### 5.3 Universal Embed Widget
- Deployable `iframe` widget, forced transparent background to adapt to any host site
- Strict server-side URL sanitization on all rendered content (custom sanitization logic)
- Never exposes unapproved testimonials

### 5.4 Testimonial-to-Proposal-Deck Export *(NEW — core differentiator)*
- From the dashboard, founder selects a set of approved testimonials
- System generates a shareable/downloadable deck-ready export (e.g. slide-formatted output) for use in client proposals
- This is the primary paid-tier hook distinguishing the product from commodity widget tools

---

## 6. Database Schema

### `profiles` (extends `auth.users`)
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK, references `auth.users(id)` |
| full_name | text | nullable |
| website | text | nullable |
| widget_title | text | Editable display title for embed widget |
| created_at | timestamptz | default `now()` |

### `testimonials`
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK, default `gen_random_uuid()` |
| user_id | uuid | FK → `profiles.id`, not null |
| name | text | not null |
| handle | text | nullable |
| text | text | not null |
| rating | smallint | nullable, 1–5 |
| platform | text | nullable |
| original_date | text | nullable |
| post_url | text | nullable |
| is_approved | boolean | default `false` |
| created_at | timestamptz | default `now()` |

### `decks`
| Column | Type | Notes |
|---|---|---|
| id | uuid | PK |
| user_id | uuid | FK → `profiles.id`, not null |
| title | text | e.g. "Q3 Client Proposal" |
| created_at | timestamptz | default `now()` |

### `deck_testimonials` (join table)
| Column | Type | Notes |
|---|---|---|
| deck_id | uuid | FK → `decks.id` |
| testimonial_id | uuid | FK → `testimonials.id` |
| sort_order | int | order within the deck |

---

## 7. Security Model

- Row Level Security (RLS) enforced on all tables: `auth.uid() = user_id` required for all mutations (update/delete/insert from client)
- `testimonials` insert on the public submission route bypasses client RLS intentionally via `service_role` key inside a Server Action — this is the **only** sanctioned bypass path
- Public/anon `select` on `testimonials` restricted to `is_approved = true`
- All widget-rendered URLs passed through custom sanitization logic server-side before output

---

## 8. Monetization & Payments

- **Model:** Slot-limited Lifetime Deal (target ~10–20 slots), transitioning new signups to a ~$15/month subscription once the LTD sells out
- **Processor (current, MVP phase):** PayPal Business, held under a parent's account acting as seller of record — required because Stripe is currently invite-only in India and Arya is a minor (turns 18 in September 2026)
- **Processor (target, long-term):** Revisit Stripe once eligibility allows (post-18, and/or Stripe access opens up), for better subscription/LTD tooling
- **Tax/compliance:** Staying below India's GST registration threshold during initial validation phase

---

## 9. Operational Constraints

- Founder is a minor (17, turning 18 September 2026) — affects payment processor choice and business registration decisions until then
- Manual/lightweight MVP phase — expect some manual steps (e.g. payment reconciliation) that get automated post-validation

---

## 10. Non-Goals / Out of Scope (for now)

- Native mobile apps
- Video testimonial collection (text-first for MVP)
- Multi-seat/team accounts

---

## 11. Changelog

- **2026-07-17** — Initial PRD created. Updated from original brief: rebrand from "Wall of Love" in progress (name TBD); ICP narrowed from course creators/coaches to B2B consultants & agency owners; added Testimonial-to-Deck Export as core differentiator and feature (§5.4, §6 `decks`/`deck_testimonials`); payment processor updated from Stripe-only to PayPal Business (parent-owned) for MVP phase with Stripe as long-term target; pricing clarified as slot-limited LTD → ~$15/mo subscription.

*(This document is maintained as the single source of truth. Future feature, schema, API, or ICP changes should be appended here with a dated changelog entry.)*

# Project Phases & Roadmap

This document outlines the trajectory of the Wall of Love (rebrand TBD) project, tracking what has already been built and defining the roadmap required to reach a complete Minimum Viable Product (MVP) tailored for B2B consultants and agency owners.

---

## ✅ Phase 1: Foundation & Core Infrastructure (Completed)
*Setting up the secure, scalable base of the application.*
- [x] **Project Scaffolding:** Next.js (App Router), React 19, Tailwind CSS v4, Shadcn UI.
- [x] **Database & Auth Setup:** Supabase PostgreSQL schemas (`profiles`, `testimonials`) and Server-Side Rendering (SSR) Authentication.
- [x] **Security Model:** Implementation of Row Level Security (RLS) policies.
- [x] **Spam & Abuse Prevention:** Upstash Redis rate limiting and honeypot bot protection.
- [x] **XSS Protection:** Custom strict server-side URL sanitization (`src/lib/sanitize.ts`).

## ✅ Phase 2: Core Testimonial Engine (Completed)
*Building the fundamental CRUD operations and submission pipelines.*
- [x] **Public Submission Flow:** Frictionless unauthenticated route (`/submit/[user_id]`) using the Supabase Admin client for secure insertions.
- [x] **Private Dashboard:** Authenticated routes to view and manage incoming reviews.
- [x] **Management Actions:** Server Actions to manually add, edit, approve, reject, and delete testimonials safely.
- [x] **Profile Management:** Dashboard settings to manage `full_name`, `website`, and `widget_title`.

## ✅ Phase 3: The Embed Widget (Completed)
*Creating the lightweight, universal website embed.*
- [x] **Widget Route:** Public iframe route (`/widget/[user_id]`) to display only `is_approved = true` testimonials.
- [x] **Preview Implementation:** Internal preview wall (`/embed/my-wall`) for the founder to see what clients see.

---

## 🚧 Phase 4: UI/UX Overhaul & Onboarding (To Do - Next Up)
*Transforming the app from a functional prototype to a premium, high-converting SaaS.*
- [ ] **Landing / Home Page:** Design and build a stunning marketing site focused on the core value proposition (exporting reviews for proposal decks). Needs modern aesthetics, micro-animations, and a clear call-to-action.
- [ ] **Auth Pages Polish:** Redesign the `/login` and signup flows to feel premium and trustworthy.
- [ ] **Dashboard Aesthetic Upgrade:** Enhance the private dashboard UI/UX with better typography, spacing, interactive hover states, and seamless transitions.

## 🚧 Phase 5: The "Consultant MVP" Core Differentiator (To Do)
*Building the deck-export feature that separates this product from generic widget tools.*
- [ ] **Schema Expansion:** Implement the `decks` and `deck_testimonials` tables in Supabase (with appropriate RLS).
- [ ] **Deck Builder UI:** Allow users in the dashboard to select approved testimonials and organize them into specific decks/presentations.
- [ ] **Export Engine:** Generate downloadable, slide-formatted outputs (e.g., images or PDFs) that consultants can drop directly into sales proposals.

## 🚧 Phase 6: Monetization & Launch (To Do)
*Hooking up payments and finalizing the MVP for real-world validation.*
- [ ] **Payments Integration:** Implement PayPal Business SDK to process the initial slot-limited Lifetime Deal (LTD).
- [ ] **Paywall Logic:** Restrict the Deck Export feature (and potentially the embed widget) to paid users only.
- [ ] **Final QA:** End-to-end testing of the submission, approval, deck generation, and checkout flows.
- [ ] **MVP Launch!**

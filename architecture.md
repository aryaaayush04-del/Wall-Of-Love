# Wall of Love — Architecture & Flow

This document outlines the architecture, application flow, logic, file structure, and technology stack of the Wall of Love platform.

## 1. Technology Stack

- **Core Framework:** Next.js (App Router)
- **Frontend library:** React 19
- **Styling:** Tailwind CSS v4
- **Database & Authentication:** Supabase (PostgreSQL, Auth, SSR)
- **Rate Limiting:** Upstash Redis
- **UI Components:** Shadcn UI, Base UI, Lucide React (Icons)

---

## 2. Application Flow and Logic

### 2.1 Authentication & Session Management
- Handled securely via **Supabase Auth SSR**. 
- Users authenticate via the `/login` route. Upon successful login, Supabase redirects them to `/auth/callback` to securely set session cookies on the server side.
- Dashboard routes verify the server-side cookie to restrict access to authenticated owners only.

### 2.2 Private Dashboard (Authenticated)
- **Routes:** `/` (Main Dashboard), `/settings`, `/embed/my-wall`
- **Logic:**
  - Wall owners can view, manually add, edit, approve, reject, or delete testimonials.
  - Owners can manage their widget settings (like `widget_title` or their `website`) in the `/settings` route.
  - All database mutations from the dashboard are executed via **Server Actions** (`src/app/actions.ts`), bound strictly by Row Level Security (RLS) policies scoped specifically to the `user_id`.

### 2.3 Public Submission Flow
- **Route:** `/submit/[user_id]`
- **Logic:**
  - A frictionless flow where reviewers can submit feedback directly to a specific wall owner without creating an account.
  - Because it is unauthenticated, the submission Server Action (`src/app/submit/actions.ts`) relies on the **Supabase Admin Client** (bypassing RLS) to insert the `pending` testimonial securely.
  - **Security:** Protected against spam using **Upstash Redis** rate limiting and a CSS-hidden **honeypot** field to silently filter bot submissions.

### 2.4 Embed Widget Flow
- **Route:** `/widget/[user_id]`
- **Logic:**
  - The public-facing widget that wall owners embed into their sites via an `iframe`.
  - Uses the Next.js server to fetch and render only `is_approved = true` testimonials.
  - Enforces strict server-side **URL sanitization** (`src/lib/sanitize.ts`) to prevent XSS vulnerabilities from user-submitted content.

---

## 3. Folder and File Structure

The project is structured around the Next.js App Router paradigm, cleanly separating routes, components, and server logic.

```text
wallOfLove/
├── PRD.md                             # Product Requirements Document
├── architecture.md                    # Architecture and tech stack overview (this file)
├── .env.local                         # Environment variables (Supabase, Upstash, etc.)
├── package.json                       # Dependencies and project scripts
├── src/
│   ├── app/                           # Next.js App Router (Pages, Layouts, API, Server Actions)
│   │   ├── actions.ts                 # Dashboard Server Actions (add, delete, approve, etc.)
│   │   ├── layout.tsx                 # Root application layout & ThemeProvider
│   │   ├── page.tsx                   # Main Dashboard page (View & Manage testimonials)
│   │   ├── auth/callback/route.ts     # Supabase Auth callback handler
│   │   ├── embed/my-wall/page.tsx     # Internal preview of the embed widget
│   │   ├── login/page.tsx             # Authentication and login page
│   │   ├── settings/page.tsx          # Profile & Widget settings page
│   │   ├── submit/
│   │   │   ├── actions.ts             # Public form submission Server Actions
│   │   │   └── [user_id]/page.tsx     # Public URL for reviewers to submit testimonials
│   │   └── widget/[user_id]/page.tsx  # The lightweight iframe widget page
│   │
│   ├── components/                    # Reusable React Components
│   │   ├── ui/                        # Shadcn UI base components (buttons, inputs, dialogs, etc.)
│   │   ├── sidebar.tsx                # Dashboard navigation sidebar
│   │   ├── settings-form.tsx          # Form for managing profile settings
│   │   ├── submit-testimonial-form.tsx# Client form for public submissions
│   │   ├── dashboard-testimonial-card.tsx # Card component for dashboard reviews
│   │   ├── add-testimonial-dialog.tsx # Dialog for owners to manually add reviews
│   │   ├── copy-collection-link.tsx   # Utility to copy the public submission URL
│   │   └── theme-*.tsx                # Dark/Light mode theme providers and toggles
│   │
│   └── lib/                           # Utilities & Database Clients
│       ├── ratelimit.ts               # Upstash Redis initialization and rate limit checks
│       ├── sanitize.ts                # Custom URL sanitization logic for XSS prevention
│       ├── utils.ts                   # Tailwind merging and general utility functions
│       └── supabase/                  # Supabase clients for different contexts
│           ├── admin.ts               # Service Role client (bypasses RLS, used in public submission)
│           ├── client.ts              # Browser client
│           └── server.ts              # SSR client for Server Components/Actions
```

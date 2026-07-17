# Design System

Project: Wall of Love (rebrand in progress)
Reference: `PRD.md` for product/feature context, `rules.md` for engineering boundaries.
Last updated: 2026-07-17

---

## 1. Concept

The audience is B2B consultants and agency owners — people whose own job is convincing skeptical prospects to trust them. The product's job is to turn scattered praise into something that reads as **verified proof**, right down to a deck slide in a client proposal.

So the visual system is built around one idea: **a seal of approval, not a decoration.** Ledger, stamp, and certificate references run through the whole system — not as a twee gimmick, but because "this testimonial has been checked and approved" is the literal core action of the product (§5.1/5.2 in the PRD).

Deliberately avoided: the cream-background/high-contrast-serif/terracotta combination and the near-black/neon-accent combination that most AI-generated SaaS sites default to. Neither says "verified proof" — they say "generic AI landing page."

---

## 2. Color System

| Token | Hex | Role |
|---|---|---|
| **Ledger** | `#132A20` | Primary anchor — body text, nav, dark sections, dashboard chrome |
| **Paper** | `#F3F1E9` | Primary background — warm parchment, not stark white |
| **Brass** | `#B8863B` | Primary accent — CTAs, the seal/stamp mark, active states |
| **Moss** | `#3E6B52` | Secondary accent — links, "approved" chips, hover states on Paper |
| **Rust** | `#A8503A` | Attention only — errors, pending/rejected states. Never decorative. |
| **Fade** | `#6B6A5E` | Secondary text, captions, borders, dividers |

**Contrast rules:**
- Ledger on Paper: ~13:1 — safe for all body text
- Brass: doesn't meet AA for small text on Paper. Use for icons, large display numbers, buttons (with Paper text on top of Brass), or as text *on Ledger* backgrounds where contrast is strong
- Moss on Paper meets AA for body text — safe for links
- Rust reserved for error/attention text and icons only, at 16px+

---

## 3. Typography

| Token | Font | Size | Weight | Line-height | Use |
|---|---|---|---|---|---|
| Display | Fraunces | 3.5rem / 56px | 500 | 1.05 | Hero headline only |
| H1 | Fraunces | 2.25rem / 36px | 500 | 1.15 | Section headers |
| H2 | Fraunces | 1.5rem / 24px | 500 | 1.25 | Card/sub-section titles |
| Body-lg | IBM Plex Sans | 1.125rem / 18px | 400 | 1.6 | Intro copy, testimonial quotes |
| Body | IBM Plex Sans | 1rem / 16px | 400 | 1.6 | Default UI and marketing copy |
| Caption | IBM Plex Sans | 0.875rem / 14px | 500 | 1.4 | Labels, metadata |
| Mono-data | IBM Plex Mono | 0.875rem / 14px | 400 | 1.5 | Dates, ratings, slide numbers, IDs |

- **Fraunces** (display only, restrained): a soft, low-contrast serif with warmth — reads like an engraved certificate, not a fashion-magazine headline. Never set below H2 size. Weight capped at 500–600; avoid decorative italic.
- **IBM Plex Sans** (body/UI): chosen over the default Inter-everywhere look. Slightly technical, documentary character that fits a "proof" product without feeling cold.
- **IBM Plex Mono** (data): used specifically for anything that reads like a stamped fact — a date, a star rating, a slide number in the deck export. Ties the "ledger entry" feeling into real UI data.

---

## 4. Layout & Structural Devices

**Signature element — the Seal.** A small circular stamp mark (think wax seal / certification stamp, rendered simply — a ring with a checkmark or star at center, in Brass). It appears:
- On a testimonial card once approved in the dashboard
- As the micro-interaction when a founder clicks "Approve"
- As a watermark on exported deck slides — so the brand travels into the client's proposal, not just the widget

This is the one place the design gets to be bold. Everything else stays quiet around it.

**Structural device — Slide framing.** Since the core differentiator is exporting testimonials into a deck, marketing-site sections use a subtle presentation-canvas framing: thin corner brackets and a small "01 / 06"-style counter in Mono-data. Unlike decorative numbered markers, this one is literally true — it previews what the deck export feature produces.

**Geometry:** moderate radius, not sharp broadsheet corners and not bubbly consumer-app corners.
- `sm` 6px — inputs, chips
- `md` 10px — cards, buttons
- `lg` 16px — modals, hero panels
- `full` — the seal mark, avatars

---

## 5. Component Notes

- **Primary button:** Ledger background, Paper text → on hover, Brass background, Ledger text
- **Secondary button:** Ledger outline, transparent fill
- **Testimonial card:** Paper background, 1px Fade border at low opacity, `md` radius. Seal mark appears top-right once approved.
- **Deck export output:** Ledger background, Paper text, Brass seal watermark bottom corner — the exported artifact should look unmistakably branded even sitting inside someone else's proposal deck.
- **Embed widget (marketing-site theme does not fully apply here):** per the PRD's forced-transparent-background requirement, the widget default theme stays neutral and inherits the host site's `font-family` where possible. The only mandatory brand element is a small, togglable "Verified via [Brand]" seal badge — everything else is intentionally undressed so it doesn't clash with a client's site.
- **Dashboard/product UI:** calmer than marketing pages. Fraunces limited to page titles only; everything else Plex Sans/Mono. Brass reserved for the single primary action per screen, not sprinkled around.

---

## 6. Motion

- Testimonial cards "stamp" into place on first load (scale + settle, ~200ms) — once per session, not looping
- Hover on a card: slight lift + seal mark fades in at 60% opacity if not yet approved
- Respect `prefers-reduced-motion`: all of the above becomes an instant final-state render, no animation

---

## 7. Tailwind Tokens

```js
// tailwind.config.js — theme.extend
colors: {
  ledger: '#132A20',
  paper:  '#F3F1E9',
  brass:  '#B8863B',
  moss:   '#3E6B52',
  rust:   '#A8503A',
  fade:   '#6B6A5E',
},
fontFamily: {
  display: ['Fraunces', 'serif'],
  sans: ['"IBM Plex Sans"', 'sans-serif'],
  mono: ['"IBM Plex Mono"', 'monospace'],
},
borderRadius: {
  sm: '6px',
  md: '10px',
  lg: '16px',
},
```

---

## 8. Changelog

- **2026-07-17** — Initial design system: color tokens (Ledger/Paper/Brass/Moss/Rust/Fade), type system (Fraunces/IBM Plex Sans/IBM Plex Mono), seal-mark signature element, slide-framing structural device, embed widget theming constraint carried over from PRD.

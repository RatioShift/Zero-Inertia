---
version: "zero-inertia-omega-v2"
name: "Project Zero Inertia — Mission: Unbound Design System"
description: >
  A bespoke neuro-tactical design system built for zero-friction, deep-work execution.
  Inspired by aerospace telemetry dashboards, obsidian glass aesthetics, and behavioral
  momentum architecture. Every design decision is optimized to minimize cognitive load
  and maximize execution velocity.
authors:
  developer: "Abdullah Al Azmain"
  organization: "RatioShift"
created: "2026"
mission: "Mission: Unbound (90 Days)"

colors:
  # Core Identity
  primary: "#06B6D4"          # Signal Blue (Cyan) — action, activation, momentum
  primary-dim: "#0891B2"      # Deep Signal — hover states, borders
  secondary: "#3B82F6"        # Deep Cobalt — information hierarchy
  accent: "#10B981"           # Emerald Surge — Max execution, chain success
  
  # Status System
  max: "#10B981"              # Emerald — MAX execution day
  standard: "#06B6D4"         # Cyan — STANDARD execution day
  mvo: "#F59E0B"              # Amber — MVO/emergency execution day
  missed: "#EF4444"           # Crimson — MISSED day (never acceptable)
  upcoming: "#1E293B"         # Muted navy — future day (neutral)
  
  # Surface Hierarchy (Light Mode)
  background: "#F8FAFC"       # Cloud — page background
  surface: "#FFFFFF"          # Paper — card backgrounds
  surface-elevated: "#F1F5F9" # Pebble — button fills, input backgrounds
  surface-border: "#E2E8F0"   # Hairline — subtle card borders
  surface-mid: "#CBD5E1"      # Mist Gray — dividers, disabled
  
  # Typography
  text-primary: "#0B1120"     # Ink Navy — headings, critical text
  text-secondary: "#475569"   # Slate Gray — body text, descriptions
  text-muted: "#94A3B8"       # Mist — timestamps, meta, placeholders
  
  # Emergency / Danger
  danger: "#EF4444"
  danger-surface: "#FEF2F2"
  danger-border: "#FECACA"
  
  # Warning
  warning: "#F59E0B"
  warning-surface: "#FFFBEB"
  warning-border: "#FDE68A"

typography:
  # Display — Section headers, mission title
  display-lg:
    fontFamily: "Space Grotesk, Plus Jakarta Sans, sans-serif"
    fontSize: "clamp(24px, 4vw, 36px)"
    fontWeight: 700
    lineHeight: "1.1"
    letterSpacing: "-0.02em"
    usage: "Mission name, section titles on cockpit"

  # Heading — Card titles, modal headers
  display-md:
    fontFamily: "Space Grotesk, Plus Jakarta Sans, sans-serif"
    fontSize: "clamp(16px, 2.5vw, 22px)"
    fontWeight: 600
    lineHeight: "1.2"
    letterSpacing: "-0.01em"
    usage: "Card headers, tab labels, stat titles"

  # Body — Descriptions, rules text
  body-md:
    fontFamily: "Plus Jakarta Sans, Inter, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "1.65"
    usage: "Card descriptions, operating rules, log notes"
  
  body-sm:
    fontFamily: "Plus Jakarta Sans, Inter, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "1.5"
    usage: "Helper text, timestamps, footer"

  # Tactical Data — Streaks, counters, timers
  mono-data:
    fontFamily: "JetBrains Mono, Fira Code, monospace"
    fontSize: "clamp(11px, 1.5vw, 13px)"
    fontWeight: 600
    lineHeight: "1.2"
    letterSpacing: "0.04em"
    features: "tabular-nums"
    usage: "All numeric telemetry data, countdown timers, momentum scores"

  # Label — Badge names, status pills
  label-caps:
    fontFamily: "Space Grotesk, sans-serif"
    fontSize: "10px"
    fontWeight: 700
    letterSpacing: "0.08em"
    textTransform: "uppercase"
    usage: "Status badges (MAX / STANDARD / MVO), section labels"

spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  2xl: "48px"
  card-padding: "20px 24px"
  section-padding: "32px"
  header-height: "56px"    # mobile
  header-height-lg: "64px" # desktop

radius:
  sm: "6px"    # inner elements (badges, pills)
  md: "8px"    # cards, modals, buttons
  lg: "12px"   # modal overlays
  xl: "16px"   # large panels
  full: "9999px"  # pill shapes

shadows:
  xs: "0 1px 2px rgba(0,0,0,0.05)"
  sm: "0 2px 8px rgba(0,0,0,0.07)"
  md: "0 4px 20px rgba(0,0,0,0.10)"
  lg: "0 8px 40px rgba(0,0,0,0.12)"
  emergency: "0 0 40px rgba(239,68,68,0.15), 0 4px 20px rgba(0,0,0,0.12)"
  signal-glow: "0 0 12px rgba(6,182,212,0.20)"

animations:
  entrance:
    name: "fade-in + slide-up"
    duration: "200ms"
    easing: "cubic-bezier(0.16, 1, 0.3, 1)"
    usage: "Tab transitions, card appearances"
  micro:
    name: "scale(1) → scale(1.04)"
    duration: "150ms"
    easing: "ease-out"
    usage: "Button hover, badge hover, chain cell hover"
  pulse:
    name: "opacity 0% → 100% loop"
    duration: "1.5s"
    usage: "Emergency countdown ring, live sync indicator"
  confetti:
    library: "canvas-confetti"
    trigger: "Badge unlock, chain milestone"
    colors: ["#06B6D4", "#10B981", "#F59E0B", "#3B82F6"]
---

# Project: Zero Inertia — System Design Blueprint

> *Designing not just a UI, but a behavioral momentum machine.*

---

## 1. Aesthetic Thesis & Design Philosophy

**Project: Zero Inertia** is built on a single visual principle: **the interface must feel like a command center, not a to-do list.**

Every surface, color, and interaction is engineered to reduce cognitive load, accelerate decision-making, and reinforce the user's identity as a high-performance executor.

### Core Aesthetic Pillars

| Pillar | Expression |
|--------|-----------|
| **Tactical Clarity** | Clean white surfaces with surgical use of color — only meaningful data gets accent treatment |
| **Momentum Kinetics** | Micro-animations that signal progress and make the interface feel alive and responsive |
| **Data Density Without Chaos** | Compact information hierarchy that respects visual breathing room |
| **Identity Reinforcement** | Language, iconography, and copy that treats the user as a high-performance operative |

### Forbidden Design Patterns
- ❌ Decorative illustrations or stock imagery
- ❌ Rounded pill-shaped "friendly" buttons (except nav pills)
- ❌ Colorful gradients for card backgrounds
- ❌ Generic blue/red/green — curated semantic colors only
- ❌ Font weights below 500 in critical UI areas
- ❌ Any dummy/fake data displayed to real users

---

## 2. Layout Architecture

### Global Page Shell

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER (sticky, blur backdrop, 56px mobile / 64px desktop)      │
│  [Brand: ZI logo + "Zero Inertia OS"] [Nav Tabs] [Action Zone]  │
├─────────────────────────────────────────────────────────────────┤
│  TELEMETRY BAR (4 KPI cards, 2x2 mobile / 4-column desktop)     │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  TAB CONTENT AREA (max-width: 1200px, centered, px-4)           │
│                                                                   │
│  [Cockpit Tab]     7-col primary / 5-col sidebar                │
│  [Chain Matrix Tab] full-width calendar grid                     │
│  [Telemetry Tab]   full-width analytics                         │
│  [SOP Tab]         rules drawer trigger                         │
│  [Missions Tab]    mission cards grid                           │
│                                                                   │
├─────────────────────────────────────────────────────────────────┤
│  MOBILE BOTTOM NAV (fixed, 5-tab, lg:hidden)                    │
├─────────────────────────────────────────────────────────────────┤
│  FOOTER (desktop only, 3-column: Brand / Nav / Rules)           │
└─────────────────────────────────────────────────────────────────┘
```

### Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|-----------|-------|---------------|
| `xs` | < 380px | Icon-only header actions, D7/90 format |
| `sm` | 380–640px | Text in buttons reappears, mission name hidden |
| `md` | 640–1024px | 2-column grid in some cards |
| `lg` | 1024px+ | Full desktop nav, footer visible, 12-col grid |
| `xl` | 1280px+ | Nav tab text slightly larger |

---

## 3. Component Design Specifications

### 3.1 Header Component
**Philosophy:** Minimal, always-visible, no wasted real estate. Every element earns its place.

- Brand: ZI logo mark (8×8 border box) + wordmark "Zero Inertia" + OS pill
- Center Nav: Segmented pill (bg-pebble) with 5 tabs — active tab lifts to bg-paper
- Action Zone (right): Break Inertia [2m] button + Badges count + Auth control
- Responsive rule: At < 480px, "Sign In" text hidden (icon only), "Break" text hidden, brand shows abbreviated day count `D7/90`
- 24-Hour Reset Banner: Amber-on-warm-white alert that slides below header when chain at risk

### 3.2 Telemetry Overview (KPI Cards)
**4 cards in a responsive grid (2×2 → 4×1)**

Each card:
- Icon (colored, in a 32×32 bordered box)
- Primary metric (large, `font-mono tabular-nums`, colored)
- Label (uppercase, 10px, tracking-wider)
- Context line (12px slate-gray)

Cards: Phase · Day Count · Active Streak · Momentum Index

### 3.3 Daily Target & AI MVO Section
**Dual-panel card — the cognitive engine of the system**

- Target input (full-width textarea with placeholder coach text)
- Generate MVO button (calls Gemini AI, shows loading state)
- MVO display: bordered cyan-accented result block with 2-minute action
- Launch Emergency button embedded in the result zone

### 3.4 Daily Status Logger
**The Chain Lock Mechanism**

- Current day display with date
- Three classification buttons: MAX (emerald) / STANDARD (cyan) / MVO (amber)
- Optional notes textarea (collapsible)
- Save button with streak impact preview
- Contextual info: today's existing log shown with edit affordance

### 3.5 Chain Matrix (90-Day Calendar)
**The visual proof of unbroken momentum**

- 7-column weekly grid, all 90 days visible
- Cell color = execution level (MAX / STANDARD / MVO / MISSED / upcoming)
- Hover tooltip: day number, date, level, target snippet
- Click: opens daily logger pre-filled for that day
- Phase boundaries marked with subtle column group separators

### 3.6 Momentum Analytics
**Trajectory Curve + Output Distribution**

- SVG line chart: smooth bezier curve across logged days, momentum % Y-axis
- Phase background stripes (A / B / C) tinted behind the curve
- Output pie/donut (optional): MAX% / STANDARD% / MVO%
- Summary stat cards below chart: Current Streak, Longest, Avg Score, Active Days

### 3.7 Emergency Friction Breaker Modal
**The 120-Second Nuclear Option**

- Full-screen overlay with subtle red ambient glow
- Large countdown timer (`font-mono`, `tabular-nums`, 80px)
- Pulsing ring animation around timer
- 3 Emergency MVO action steps (auto-generated or manual)
- Audio: synthesized tone feedback via Web Audio API
- Complete button: logs day as MVO, locks chain, closes modal

---

## 4. Color Usage Rules

### Execution Level Color System

```
MAX (Emerald #10B981)    → Achieved 100% full session execution
STANDARD (Cyan #06B6D4)  → Achieved ~70% planned work session
MVO (Amber #F59E0B)      → Minimum Viable Output only (2-min rule)
MISSED (Red #EF4444)     → No execution logged (chain broken)
```

### Contextual Color Rules

| Element | Color | Rule |
|---------|-------|------|
| CTAs — primary | `bg-signal-blue text-white` | All primary action buttons |
| CTAs — secondary | `btn-outline` | Less critical actions |
| Emergency button | `red-gradient with pulse` | Emergency breaker only |
| Metric numbers — positive | `text-emerald-600` | Streak, max count |
| Metric numbers — neutral | `text-signal-blue` | Day, phase, score |
| Metric numbers — warning | `text-amber-600` | MVO count |
| Text — body | `text-slate-gray (#475569)` | All descriptions |
| Text — heading | `text-ink-navy (#0B1120)` | All bold labels |
| Text — meta/time | `text-mist-gray (#94A3B8)` | Dates, badges count context |

---

## 5. Mission Execution States

### Chain Status Visual Grammar

```
● STRONG CHAIN   — ≥7-day streak, all cells filled emerald/cyan
● MAINTAINED     — 1–6 day streak, cells mixed colors
● AMBER ALERT    — Yesterday missing, 24h reset banner triggers
● BROKEN CHAIN   — Red cell visible, recovery protocol opens
● NEW MISSION    — All cells muted navy (upcoming), Day 1 starts fresh
```

---

## 6. Mobile-First Execution Rules

- Header: icon-only actions below 480px, no horizontal scroll ever
- Telemetry: 2×2 grid on mobile, not forced 4×1
- Bottom Nav: fixed 5-tab bar, 64px height, z-50, only on `lg:hidden`
- Modals: `max-h-[90vh] overflow-y-auto` on mobile, bottom-sheet style
- Chain Matrix: horizontally scrollable on mobile with `overflow-x-auto`
- Footer: `hidden lg:block` — desktop only, never on mobile
- All touch targets: minimum 44×44px

---

## 7. Animation Choreography

| Trigger | Animation | Duration |
|---------|-----------|----------|
| Tab switch | fade-in + slide-up 8px | 200ms |
| Card appear | opacity 0→1 | 150ms |
| Button hover | scale 1.02 | 100ms |
| Badge unlock | confetti burst | instant |
| Emergency start | red pulse ring | loop 1.5s |
| MVO generate | spinner → result slide-in | 800ms+ |
| Chain cell hover | scale 1.1 | 120ms |

---

## 8. Typography Application Map

| Context | Font | Size | Weight |
|---------|------|------|--------|
| App title "Zero Inertia" | Space Grotesk | 14–16px | 700 |
| KPI metric values | JetBrains Mono | 28–36px | 700 |
| Card titles | Space Grotesk | 15–16px | 600 |
| Body / descriptions | Plus Jakarta Sans | 13–14px | 400 |
| Labels / badges | Space Grotesk | 10px | 700 + uppercase |
| Countdown timer | JetBrains Mono | 60–80px | 700 |
| Note textarea | Plus Jakarta Sans | 13px | 400 |

---

## 9. Design Anti-Patterns Reference

> These patterns were deliberately avoided to maintain tactical focus and premium feel.

- **Emoji abuse** — Only functional, sparingly (badge icons max)
- **Gradient card backgrounds** — Flat surfaces only; color is earned by data
- **Rounded xl/2xl corners** — Max radius 12px (modals), 8px (cards)
- **Shadow stacking** — One shadow level per component
- **Vibrant illustration** — Zero decorative graphics
- **Forced dark mode by default** — System uses a clean light mode; obsidian theme is a future option

---

*Design by: Abdullah Al Azmain · RatioShift © 2026*
*"Every pixel is a commitment to zero starting friction."*

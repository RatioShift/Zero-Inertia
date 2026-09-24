<div align="center">

<img src="https://img.shields.io/badge/Project-Zero%20Inertia-006bff?style=for-the-badge&logo=rocket&logoColor=white" alt="Project Zero Inertia" />
<img src="https://img.shields.io/badge/Status-Active%20Development-10b981?style=for-the-badge" />
<img src="https://img.shields.io/badge/Mission-Unbound%20%E2%80%94%2090%20Days-0b3558?style=for-the-badge" />

# 🚀 Project: Zero Inertia

### *The Neuro-Cognitive Momentum Operating System*

> **Permanently eliminate starting friction. Build an unbreakable deep work momentum engine. One 2-minute commitment at a time.**

[![React](https://img.shields.io/badge/React-19-%2361dafb?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-%233178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8.x-%23646cff?logo=vite&logoColor=white)](https://vitejs.dev)
[![Firebase](https://img.shields.io/badge/Firebase-12.x-%23ffca28?logo=firebase&logoColor=black)](https://firebase.google.com)
[![Gemini AI](https://img.shields.io/badge/Gemini%20AI-Powered-%234285f4?logo=google&logoColor=white)](https://ai.google.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind%20CSS-4.x-%2306b6d4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

</div>

---

## 📖 Overview

**Project: Zero Inertia** is a full-stack, AI-powered personal productivity operating system built for deep work practitioners. Grounded in neuroscience and behavioral psychology, it systematically reduces the cognitive friction coefficient to `0.00` — making deep work feel effortless, automatic, and unstoppable.

The system revolves around the **Mission Engine**: a multi-campaign framework where each mission is a structured 90-day neuro-behavioral protocol. The flagship campaign — **Mission: Unbound** — is pre-loaded and battle-tested.

---

## ✨ Features

### 🧠 AI-Powered Execution Engine
- **Daily MVO Generator** — Enter today's target; Gemini AI decomposes it into a frictionless 2-minute Micro-MVO (Minimum Viable Output) to eliminate decision fatigue.
- **Contextual Coaching** — AI understands your current mission phase, energy level, and resistance type to deliver precision action commands.

### ⚡ Emergency Friction Breaker
- One-click **120-Second Inertia Breaker** with live countdown timer and audio feedback.
- Instantly triggers an emergency MVO protocol to prevent zero-day regression.
- Chain protection at its core — **Never Zero** is the law.

### 📊 Momentum Telemetry Dashboard
- **4 live KPI cards** — Strategic Phase, Mission Timeline, Active Streak, Momentum Index.
- **Trajectory Curve** — SVG-rendered interactive performance chart across all logged days.
- **Output Distribution** — Real-time breakdown of Max / Standard / MVO execution ratios.

### 🔗 90-Day Visual Chain Matrix
- Color-coded interactive calendar grid (Max · Standard · MVO · Missed · Upcoming).
- Click any day to retroactively log or edit entries.
- Visual chain continuity display with streak integrity monitoring.

### 🏆 Milestone Badges & Leaderboard
- 10+ behavioral achievement badges (e.g., *First Strike*, *Iron Chain*, *Ghost Protocol*).
- Community leaderboard powered by Firebase Firestore (real users only — zero fake data).
- Confetti celebrations on badge unlocks.

### 🛡️ Fail-Safe & Recovery Protocol
- **24-Hour Reset Rule** monitor — warns when yesterday's log is missing.
- **Fail-Safe Reset Modal** — guided MVO recovery walkthrough for lapse days.
- **Operating Rules Drawer** — Full SOP with all 4 core rules.

### 🎯 Multi-Mission Architecture
- Create unlimited custom missions with configurable durations, phase boundaries, and objectives.
- Switch between active campaigns without losing historical data.
- Completed and archived missions preserved for retrospective analysis.

### 🔐 Firebase Authentication & Cloud Sync
- Email/password and Google OAuth login via Firebase Auth.
- All missions and logs sync to Firestore in real time across devices.
- Offline-first with localStorage fallback.

---

## 🗂️ Project Structure

```
project-zero-inertia/
├── src/
│   ├── components/
│   │   ├── Header.tsx              # Sticky responsive navigation bar
│   │   ├── TelemetryOverview.tsx   # Top 4 KPI metric cards
│   │   ├── DailyTargetSection.tsx  # AI MVO generator & daily directive
│   │   ├── DailyStatusLogger.tsx   # 1-click momentum classification
│   │   ├── MomentumAnalytics.tsx   # Trajectory chart & output distribution
│   │   ├── ChainMatrix.tsx         # 90-day visual chain calendar
│   │   ├── EmergencyBreakerModal.tsx  # 120-sec friction breaker
│   │   ├── MissionManagerModal.tsx # Mission creation & management
│   │   ├── OperatingRulesDrawer.tsx   # SOP rules drawer
│   │   ├── FailSafeResetModal.tsx  # 24h recovery protocol
│   │   ├── GamificationModal.tsx   # Badges & leaderboard
│   │   └── AuthModal.tsx           # Firebase authentication
│   ├── context/
│   │   └── AuthContext.tsx         # React auth context provider
│   ├── utils/
│   │   ├── storage.ts              # localStorage + Firestore persistence
│   │   ├── gamification.ts         # Badge evaluation engine
│   │   └── audio.ts                # Web Audio API sound engine
│   ├── types/                      # TypeScript type definitions
│   ├── firebase.ts                 # Firebase app initialization
│   ├── App.tsx                     # Root application component
│   ├── main.tsx                    # React entry point
│   └── index.css                   # Design system (Tailwind v4 + custom tokens)
├── server.ts                       # Express + Gemini AI backend
├── index.html                      # HTML shell
├── vite.config.ts                  # Vite build configuration
├── firebase-blueprint.json         # Firestore security rules reference
└── firestore.rules                 # Firebase security rules
```

---

## 🧱 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19 + TypeScript | Component-driven SPA |
| **Build Tool** | Vite 8 | Lightning-fast HMR dev server |
| **Styling** | Tailwind CSS v4 + Custom Design System | Utility-first, design-token-powered UI |
| **AI Engine** | Google Gemini API (`gemini-3.8-flash`) | MVO generation, friction coaching |
| **Backend** | Express.js + tsx | Gemini API proxy server |
| **Database** | Firebase Firestore | Real-time cloud persistence |
| **Auth** | Firebase Authentication | Secure user identity |
| **Icons** | Lucide React | Consistent iconography |
| **Animations** | canvas-confetti + CSS | Badge unlock celebrations |
| **Audio** | Web Audio API | Tone feedback engine |

---

## 🏗️ Core Mission Architecture

```
[Phase A: Ignition] ──> [Phase B: Stabilization] ──> [Phase C: Mastery]
   (Day 1 – 14)              (Day 15 – 45)              (Day 46 – 90)

   Break initial              Automate the               Zero-resistance
   resistance & build         habit loop &               deep work at
   the starting instinct      neutralize boredom         full scale
```

### 4 Non-Negotiable Operating Rules

| Rule | Protocol | Objective |
|------|----------|-----------|
| **Rule 1** | 2-Minute Friction Killer | Overcomes limbic system resistance via micro-commitment |
| **Rule 2** | Never Zero Standard (MVO) | Prevents zero-day regression; chain continuity is law |
| **Rule 3** | Dopamine Regulation | No high-stimulation content before execution |
| **Rule 4** | Novelty Injection | Environment micro-changes reboot dopamine pathways |

---

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- A [Google AI Studio](https://aistudio.google.com) API key (`gemini-3.8-flash`)
- A Firebase project with Firestore + Authentication enabled

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/RatioShift/Zero-Inertia.git
cd Zero-Inertia

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Configure environment variables
cp .env.example .env
# Fill in your values in .env
```

### Environment Variables

Create a `.env` file at the root:

```env
# Gemini AI (required for AI MVO generation)
GEMINI_API_KEY=your_gemini_api_key_here

# Firebase Configuration (required for cloud sync & auth)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Run Development Server

```bash
npm run dev
# Opens at http://localhost:3000
```

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📋 Daily Execution Flow (SOP)

```
[Morning — Mission Briefing]
  └─ Enter today's primary target
  └─ AI generates Micro-MVO (2-min frictionless start)
  └─ Review phase objectives & mindset

[During Work — Resistance Protocol]
  └─ Feeling resistance? Click "Break Inertia 2m"
  └─ 120-second emergency timer activates
  └─ Execute MVO → inertia breaks → flow state initiates

[Evening — Chain Lock]
  └─ Classify: Max (100%) / Standard (70%) / MVO (30%)
  └─ Log tactical reflection & novelty notes
  └─ Chain status updates → streak preserved
```

---

## 🗺️ Roadmap

- [ ] **PWA Support** — Install as native-like app on mobile
- [ ] **Weekly AI Retrospective** — Automated momentum pattern analysis
- [ ] **Mission Templates Marketplace** — Community-shared mission presets
- [ ] **Deep Focus Timer** — Integrated Pomodoro with session logging
- [ ] **Mobile App** — React Native companion app
- [ ] **Dark Mode** — Obsidian tactical theme option

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit with clear messages: `git commit -m "feat: add X feature"`
4. Push to your fork and open a Pull Request against `dev`

---

## 📄 License

**MIT License** — See [LICENSE](./LICENSE) for details.

---

<div align="center">

**© 2026 RatioShift. All rights reserved.**

Built with ⚡ by **Abdullah Al Azmain**

*"Zero inertia is not a goal — it's a default state you engineer."*

[![GitHub](https://img.shields.io/badge/GitHub-RatioShift%2FZero--Inertia-0b3558?logo=github)](https://github.com/RatioShift/Zero-Inertia)

</div>

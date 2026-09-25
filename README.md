# Neo Cashless — Intelligent Financial Ecosystem

Neo Cashless is a modern, high-performance web application designed for cashless financial management and automated digital transactions. Built with React, TypeScript, TanStack Start, and Tailwind CSS.

---

## Key Features

- **Dual Hero Landing Page**: Smooth scroll-snapping presentation featuring dual interactive themes (Purple & Green).
- **Multi-Language Support**: Complete bilingual interface supporting English and Bangla (বাংলা).
- **Authentication System**:
  - Email & Password Login / Registration via Supabase
  - Google OAuth 2.0 Single Sign-On
  - WebAuthn Biometric Verification (Fingerprint / FaceID / Security PIN)
  - Password Reset Workflow
- **Interactive UI**:
  - Fixed persistent navigation header
  - Bottom indicator dot navigation
  - Responsive layout optimized for desktop, tablet, and mobile devices
  - User Dashboard and account overview

---

## Tech Stack & Architecture

- **Frontend Framework**: React 19 + TypeScript
- **Routing & SSR**: TanStack React Router & TanStack Start
- **Styling**: Tailwind CSS & Custom CSS variables
- **Backend & Database**: Supabase (Authentication & PostgreSQL)
- **Biometric Security**: @simplewebauthn Browser API

---

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn / pnpm / bun

### Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd neo-cash-clone
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the project root:
   ```env
   VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
   VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
   SUPABASE_URL=https://your-supabase-project.supabase.co
   SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:8081` in your browser.

5. **Build for Production**:
   ```bash
   npm run build
   ```

---

## Project Structure

```
├── public/                 # Static assets (favicons, images)
├── src/
│   ├── assets/             # Brand illustrations and vector graphic assets
│   ├── components/         # Reusable UI components & Auth Modals
│   ├── hooks/              # Custom React Hooks (mobile viewport detectors)
│   ├── integrations/       # Database & Auth Client Integrations (Supabase)
│   ├── lib/                # Utility helpers & WebAuthn biometric logic
│   ├── routes/             # TanStack Start Route definitions & pages
│   └── styles.css          # Core CSS variables, responsive rules, animations
├── package.json
└── vite.config.ts
```

---

## License

Copyright © 2026 Neo Cashless. All rights reserved.

# MEMORY.md — Neo Cash AI Project State

> **Last updated:** 2026-10-04
> **Updated by:** Agent (initial creation from project inspection)

---

## 1. Project Identity

| Field | Value |
| ----- | ----- |
| **Name** | Neo Cash AI |
| **Purpose** | Intelligent cashless financial ecosystem for academic institutions in Bangladesh |
| **Target Users** | Students, Institutional Admins, Executive Heads (Principals/Directors) |
| **Problem Solved** | Eliminates paper-heavy fee collection, provides hardship flexibility, ensures audit transparency |
| **Stage** | Active MVP Development |
| **Repository** | `neo-cash-clone` |
| **Languages** | TypeScript, SQL |
| **Framework** | React 19 + TanStack Start + TanStack Router + Vite |
| **Runtime/Deploy** | Nitro SSR on Cloudflare Workers (`neo-cash-clone.sp2khb.workers.dev`) |
| **Backend** | Supabase (PostgreSQL + Auth + Storage) |
| **Styling** | TailwindCSS 4 + shadcn/ui (Radix) |

---

## 2. MVP Feature Matrix

### 2.1 Student Portal

| Feature | Status | Implementation | Testing | Notes |
| ------- | ------ | -------------- | ------- | ----- |
| Passkey / WebAuthn Biometric Auth | Implemented | `src/lib/webauthn.functions.ts`, `src/components/auth/biometric-panel.tsx` | Not Tested | SimpleWebAuthn browser + server |
| Email/Password Login | Implemented | `src/components/auth/login-modal.tsx` | Not Tested | Supabase Auth |
| Google OAuth SSO | Implemented | `src/components/auth/login-modal.tsx` | Not Tested | Via Supabase |
| Password Reset | Implemented | `src/routes/reset-password.tsx` | Not Tested | |
| Institution Discovery & Verification | Implemented | `src/routes/institution-setup.tsx`, `src/lib/college-identity.functions.ts` | Not Tested | Search + verified badge |
| Student Verification / Onboarding Flow | Implemented | `src/routes/verify-student.tsx`, `src/components/dashboard/onboarding-flow.tsx` | Not Tested | Multi-step onboarding |
| Session Verification Gate | Implemented | `src/components/dashboard/session-verification-gate.tsx` | Not Tested | |
| Identity Verification Panel | Implemented | `src/components/dashboard/identity-verification-panel.tsx` | Not Tested | |
| Digital Wallet (bKash/Nagad/Rocket/Card) | Implemented | `src/components/payment/wallet-topup-modal.tsx`, `src/lib/sslcommerz.functions.ts` | Not Tested | SSLCommerz sandbox |
| Fee Obligations Dashboard | Implemented | `src/components/dashboard/student-panel.tsx` | Not Tested | Itemized fees + deadlines |
| Fee Payment | Implemented | `src/components/payment/fee-payment-modal.tsx` | Not Tested | Wallet + gateway |
| Partial Payment Application (AI Check) | Implemented | `src/components/dashboard/student-panel.tsx` | Not Tested | Guardian NID + signature upload |
| AI Signature Verification | Implemented | `src/lib/signature-verification.functions.ts` | Not Tested | Vertex AI / Gemini Vision |
| Document Upload & Verification | Implemented | `src/components/verification/document-upload-verifier.tsx` | Not Tested | |
| Digital Receipt Generator | Implemented | `src/lib/receipt-generator.ts`, `src/components/dashboard/receipt-modal.tsx` | Not Tested | PDF via jsPDF |
| Social Impact Welfare & Leaderboards | Implemented | `src/components/dashboard/student-panel.tsx` | Not Tested | ৳100 = 1 Point |
| Neo AI Financial Assistant | Implemented | `src/components/ai/floating-ai.tsx` | Not Tested | Gemini integration |
| Notification Bell | Implemented | `src/components/notifications/notification-bell.tsx` | Not Tested | 12 event types |

### 2.2 Admin Operations Portal

| Feature | Status | Implementation | Testing | Notes |
| ------- | ------ | -------------- | ------- | ----- |
| Operations Center Dashboard | Implemented | `src/components/dashboard/admin-panel.tsx` | Not Tested | Solvency overview, collection rates |
| Admin Analytics Dashboard | Implemented | `src/components/dashboard/admin-analytics-dashboard.tsx` | Not Tested | Charts via Recharts |
| 6-Dimension Student Directory | Implemented | `src/components/dashboard/admin-panel.tsx` | Not Tested | Multi-field search + 6 filter dropdowns |
| Manual Student Enrolment Modal | Implemented | `src/components/dashboard/admin-panel.tsx` | Not Tested | |
| Bulk Cohort Fee Assignment | Implemented | `src/components/dashboard/admin-panel.tsx` | Not Tested | Safety confirmation modal |
| Excel/CSV AI Import Processor | Implemented | `src/components/admin/roster-import.tsx` | Not Tested | Batch upload + validation |
| Partial Payment Review Queue | Implemented | `src/components/dashboard/admin-panel.tsx` | Not Tested | Forward to Head |
| Financial Intelligence Risk Suite | Implemented | `src/components/dashboard/admin-panel.tsx` | Not Tested | AI risk flags + Contact Suite |
| Automated Reminder Rule Engine | Implemented | `src/components/dashboard/admin-panel.tsx` | Not Tested | weekly, near_deadline, final_day, missed |
| Human Support Escalation Queue | Implemented | `src/components/dashboard/admin-panel.tsx` | Not Tested | Ticket review + reply |

### 2.3 Executive Head Portal

| Feature | Status | Implementation | Testing | Notes |
| ------- | ------ | -------------- | ------- | ----- |
| Executive Command Dashboard | Implemented | `src/components/dashboard/head-panel.tsx` | Not Tested | Financial health overview |
| 10-Point Hardship Approval Center | Implemented | `src/components/dashboard/head-panel.tsx` | Not Tested | Full dossier modal |
| Executive Actions (Approve/Reject/Request Changes) | Implemented | `src/components/dashboard/head-panel.tsx` | Not Tested | Custom installment + deadline |
| Read-Only Student Directory | Implemented | `src/components/dashboard/head-panel.tsx` | Not Tested | Audit view |
| Nationwide Impact Trophy | Implemented | `src/components/dashboard/head-panel.tsx` | Not Tested | Regional rankings |

### 2.4 Cross-Cutting Features

| Feature | Status | Implementation | Testing | Notes |
| ------- | ------ | -------------- | ------- | ----- |
| Landing Page (Dual Hero) | Implemented | `src/routes/index.tsx`, `src/components/home-sections.tsx` | Not Tested | Scroll-snapping |
| Demo Controller / Role Switcher | Implemented | `src/components/dashboard/dashboard-shell.tsx` | Not Tested | Demo account switching |
| PWA Support | Implemented | `src/components/pwa/pwa-manager.tsx`, `public/manifest.json`, `public/sw.js` | Not Tested | Service worker + manifest |
| 12-Event Notification Engine | Implemented | Store actions in `neo-cash-store.ts` | Not Tested | See MVP.md §4 |
| SHA-256 Cryptographic Audit Trail | Implemented | Store audit logging in `neo-cash-store.ts` | Not Tested | 6-dimension ledger |
| Notion Integration | Implemented | `src/lib/notion.functions.ts`, `src/components/integrations/notion-sync-modal.tsx` | Not Tested | Fee/application sync |
| Design System & Tokens | Implemented | `src/components/design-system/tokens.ts` | Not Tested | Autumn palette |
| 404 / Error Boundary | Implemented | `src/routes/__root.tsx` | Not Tested | User-safe error pages |

---

## 3. Architecture

### 3.1 Frontend
- **Framework:** React 19 with TanStack Router (file-based routing)
- **SSR:** TanStack Start + Nitro
- **State Management:**
  - **Primary (MVP/Demo):** `useNeoStore()` hook — custom React state with `localStorage` persistence under key `neo_cash_state_v1`
  - **Production (In Progress):** React Query + `src/lib/db.ts` for Supabase-backed queries
- **UI Library:** shadcn/ui (Radix UI primitives) in `src/components/ui/` (47 components)
- **Styling:** TailwindCSS 4 via `@tailwindcss/vite` plugin
- **Charts:** Recharts
- **Forms:** React Hook Form + Zod validation
- **Icons:** Lucide React
- **Toasts:** Sonner
- **PDF:** jsPDF + jspdf-autotable

### 3.2 Backend
- **Runtime:** Nitro SSR (Cloudflare Workers edge runtime)
- **Server Functions:** TanStack Start `createServerFn()` pattern
- **Server Entry:** `src/server.ts` — custom Cloudflare Workers fetch handler with error normalization
- **Auth Middleware:** `src/integrations/supabase/auth-middleware.ts` (`requireSupabaseAuth`)

### 3.3 Database
- **Provider:** Supabase PostgreSQL
- **ORM/Client:** `@supabase/supabase-js` with generated types
- **RLS:** Enabled on all user-owned tables
- **Migrations:** `supabase/migrations/` (10 migration files, phases 1–6)
- **Query Layer:** `src/lib/db.ts` — structured query factories for React Query

### 3.4 Authentication
- **Provider:** Supabase Auth
- **Methods:** Email/password, Google OAuth, WebAuthn/Passkey biometrics
- **Route Guard:** `src/routes/_authenticated/route.tsx` — checks Supabase session + localStorage fallback for demo
- **Server Auth:** JWT Bearer validation via `requireSupabaseAuth` middleware
- **Session:** Supabase handles tokens; demo mode uses localStorage-stored session user

### 3.5 Authorization
- **Roles:** `student`, `admin`, `head`, `demo_controller`
- **Enforcement:** Currently primarily client-side via role-based panel rendering. Server-side RLS on database tables.
- **Note:** Server-side authorization per-endpoint is not fully enforced for all operations beyond RLS.

### 3.6 Payments
- **Gateway:** SSLCommerz (sandbox mode)
- **Flow:** `src/lib/sslcommerz.functions.ts` → `src/routes/api/payment/success.tsx`, `fail.tsx`, `cancel.tsx`
- **IPN:** `src/lib/sslcommerz-ipn.server.ts`
- **Callback URLs:** `src/lib/sslcommerz-callbacks.ts`

### 3.7 AI/ML
- **Signature Verification:** Vertex AI / Gemini Vision API (`src/lib/signature-verification.functions.ts`)
- **Financial Assistant:** Gemini API (`src/components/ai/floating-ai.tsx`)
- **Google AI Dependencies:** `@google-cloud/vertexai`, `@google/generative-ai`

### 3.8 Storage
- **Provider:** Supabase Storage (configured via migrations)
- **Buckets:** Avatars, guardian documents, signatures
- **File Upload UI:** `src/components/verification/document-upload-verifier.tsx`, `src/components/ui/avatar-upload.tsx`

### 3.9 Notifications
- **Engine:** 12 notification event types (see MVP.md §4)
- **In-App:** `src/components/notifications/notification-bell.tsx`
- **Email:** Demo-logged when no provider configured (`demoEmailLogs` in store)

### 3.10 Deployment
- **Primary:** Cloudflare Workers (`wrangler.json`, `npm run deploy:cf`)
- **Alternative:** Google Cloud App Engine (`app.yaml`, `npm run deploy:gcp`)
- **Alternative:** GitHub Pages static (`npm run deploy:gh`)
- **Live URL:** `https://neo-cash-clone.sp2khb.workers.dev/`

---

## 4. Directory Structure

```
neo-cash-clone/
├── public/                       # Static assets (favicon, manifest, SW, icons)
├── scripts/                      # Build/deploy scripts (Figma sync, GH Pages prep)
├── supabase/
│   └── migrations/               # 10 SQL migration files (phases 1–6)
├── src/
│   ├── assets/                   # Brand illustrations
│   ├── components/
│   │   ├── admin/                # roster-import.tsx
│   │   ├── ai/                   # floating-ai.tsx
│   │   ├── auth/                 # login-modal, biometric-panel, fingerprint-scan
│   │   ├── dashboard/            # admin-panel, head-panel, student-panel, dashboard-shell, etc.
│   │   ├── design-system/        # tokens, kpi-card, status-badge, financial-table, ui-primitives
│   │   ├── integrations/         # notion-sync-modal
│   │   ├── notifications/        # notification-bell
│   │   ├── payment/              # fee-payment-modal, wallet-topup-modal
│   │   ├── pwa/                  # pwa-manager
│   │   ├── ui/                   # 47 shadcn/ui components
│   │   ├── verification/         # document-upload-verifier, student-verification-flow
│   │   └── home-sections.tsx     # Landing page sections
│   ├── hooks/                    # use-mobile, use-neo-data
│   ├── integrations/
│   │   └── supabase/             # client, client.server, auth-middleware, types, cron-auth
│   ├── lib/                      # Core business logic
│   │   ├── neo-cash-store.ts     # Central reactive state engine (~2563 lines)
│   │   ├── db.ts                 # Supabase query layer (~937 lines)
│   │   ├── biometrics.ts         # WebAuthn client helpers
│   │   ├── webauthn.functions.ts # WebAuthn server functions
│   │   ├── sslcommerz.functions.ts, sslcommerz-ipn.server.ts, sslcommerz-callbacks.ts
│   │   ├── signature-verification.functions.ts
│   │   ├── college-identity.functions.ts
│   │   ├── notion.functions.ts
│   │   ├── receipt-generator.ts
│   │   ├── demo-auth.ts          # Demo account definitions
│   │   ├── error-capture.ts, error-page.ts
│   │   └── utils.ts
│   ├── routes/
│   │   ├── __root.tsx            # Root layout with head/meta
│   │   ├── index.tsx             # Landing page
│   │   ├── login.tsx, signup.tsx  # Auth redirect pages
│   │   ├── reset-password.tsx    # Password reset
│   │   ├── institution-setup.tsx # Institution onboarding
│   │   ├── verify-student.tsx    # Student verification
│   │   ├── _authenticated/
│   │   │   ├── route.tsx         # Auth guard layout
│   │   │   └── dashboard.tsx     # Main dashboard route
│   │   └── api/payment/          # SSLCommerz callbacks (success, fail, cancel)
│   ├── routeTree.gen.ts          # Auto-generated route tree
│   ├── router.tsx                # Router creation with QueryClient
│   ├── server.ts                 # Cloudflare Workers server entry
│   ├── start.ts                  # TanStack Start entry
│   └── styles.css                # Core CSS (74KB)
├── .env, .env.example            # Environment configuration
├── package.json, tsconfig.json, vite.config.ts
├── wrangler.json                 # Cloudflare Workers config
├── app.yaml                      # GCP App Engine config
├── components.json               # shadcn/ui config
├── eslint.config.js, .prettierrc
├── AGENTS.md, MEMORY.md, MVP.md, PROPOSAL.md, README.md
└── neo-cash-service-account.json # GCP service account (⚠ should not be committed)
```

---

## 5. Database State

### Migration History (10 files)

| Migration | Purpose |
| --------- | ------- |
| `20260922061802` | Initial schema (profiles, fees, transactions, etc.) |
| `20260922061824` | Schema patch |
| `20260927000000` | Demo identity profiles |
| `20260928000000` | User-owned data RLS policies |
| `20261001000000` | **Phase 1 full schema** — institutions, extended profiles/fees/transactions/notifications/audit_logs, wallets, donations, escalation_tickets, academic structure, RLS policies, RPCs, storage buckets |
| `20261002000000` | Phase 2: College identity verification |
| `20261003000000` | Phase 3: SSLCommerz payment sessions |
| `20261004000000` | Phase 4: Document AI verification |
| `20261005000000` | Phase 5: Analytics + security enhancements |
| `20261006000000` | Phase 6: Notifications + receipts |

### Key Tables
- `profiles` — User profiles with student metadata (student_id, cgpa, department, etc.)
- `institutions` — Academic institutions with verification status
- `fees` — Fee obligations per student
- `transactions` — Payment records with receipt numbers
- `partial_payment_applications` — Hardship applications with AI signature scores
- `notifications` — 12-type event notifications
- `audit_logs` — SHA-256 hashed 6-dimension audit trail
- `wallets` — Student wallet balances
- `donations` — Welfare contribution records
- `escalation_tickets` — Support ticket escalation
- Academic structure tables: departments, classes, sections

### RLS
- Enabled on all user-facing tables.
- Detailed policies in `20260928000000_user_owned_data_rls.sql` and Phase 1 migration.

### ⚠ Known Issues
- `src/lib/db.ts` uses `db = supabase as any` for tables not yet reflected in generated `types.ts`. Types need regeneration after applying Phase 1+ migrations.

---

## 6. API State

### Server Functions (TanStack Start)

| Module | File | Purpose |
| ------ | ---- | ------- |
| WebAuthn | `src/lib/webauthn.functions.ts` | Passkey registration + authentication |
| College Identity | `src/lib/college-identity.functions.ts` | Institution lookup + verification |
| SSLCommerz | `src/lib/sslcommerz.functions.ts` | Payment session creation |
| SSLCommerz IPN | `src/lib/sslcommerz-ipn.server.ts` | Payment IPN handler |
| Signature Verification | `src/lib/signature-verification.functions.ts` | Vertex AI document analysis |
| Notion | `src/lib/notion.functions.ts` | External data sync |

### API Routes

| Route | Purpose |
| ----- | ------- |
| `/api/payment/success` | SSLCommerz success callback |
| `/api/payment/fail` | SSLCommerz failure callback |
| `/api/payment/cancel` | SSLCommerz cancel callback |

### Auth Requirements
- Server functions use `requireSupabaseAuth` middleware for authenticated endpoints.
- Payment callbacks handle their own validation (SSLCommerz IPN verification).

---

## 7. Authentication & Authorization

| Aspect | Status |
| ------ | ------ |
| Email/Password | Implemented (Supabase Auth) |
| Google OAuth | Implemented (Supabase) |
| WebAuthn/Passkey | Implemented (SimpleWebAuthn) |
| Password Reset | Implemented |
| Route Protection | Implemented (`_authenticated/route.tsx`) |
| Server JWT Validation | Implemented (`requireSupabaseAuth`) |
| Role-Based UI Rendering | Implemented (client-side panel switching) |
| Server-Side Role Authorization per Endpoint | Partially Implemented (RLS only; no per-function role checks beyond auth) |
| Demo Account System | Implemented (`src/lib/demo-auth.ts`) |

**Roles:** `student`, `admin`, `head`, `demo_controller`

**⚠ Security Limitation:** Role-based authorization is primarily enforced via RLS and client-side panel selection. Individual server functions do not all perform explicit role checks beyond authenticating the user.

---

## 8. Completed Work

- ✅ Full landing page with dual hero sections and scroll-snapping
- ✅ Complete authentication system (email/password, Google OAuth, WebAuthn Passkey)
- ✅ Password reset workflow
- ✅ Institution discovery with verified badges
- ✅ Student onboarding flow (multi-step)
- ✅ Session verification gate
- ✅ Identity verification panel
- ✅ Student dashboard with fee obligations, wallet, partial payments, donations
- ✅ Digital wallet with SSLCommerz sandbox (bKash, Nagad, Rocket, Card)
- ✅ Fee payment modal with gateway integration
- ✅ Partial payment application with Guardian NID/Signature upload
- ✅ AI Signature Verification via Vertex AI / Gemini Vision
- ✅ Digital receipt generation (jsPDF)
- ✅ Social welfare donation system with leaderboards
- ✅ Neo AI floating assistant (Gemini)
- ✅ Notification bell with 12 event types
- ✅ Admin Operations Center dashboard (solvency, collection rates, trends)
- ✅ Admin analytics dashboard with Recharts
- ✅ 6-Dimension Student Directory with search + filters
- ✅ Manual student enrolment
- ✅ Bulk cohort fee assignment with safety modal
- ✅ Excel/CSV AI roster import processor
- ✅ Partial payment review queue (Admin → Forward to Head)
- ✅ Financial intelligence risk suite with AI flags
- ✅ Automated reminder rule engine
- ✅ Human support escalation queue
- ✅ Executive Head command dashboard
- ✅ 10-Point Hardship Approval Center (dossier modal)
- ✅ Executive actions (Approve/Reject/Request Changes)
- ✅ Read-only student directory for Head
- ✅ Nationwide Impact Trophy
- ✅ Demo controller / role switcher
- ✅ PWA support (manifest + service worker)
- ✅ SHA-256 cryptographic audit trail
- ✅ 6 phases of Supabase migrations applied
- ✅ Notion integration
- ✅ Design system with tokens + primitives
- ✅ 404 / Error boundary pages
- ✅ Cloudflare Workers deployment
- ✅ GCP App Engine configuration
- ✅ GitHub Pages deployment script

---

## 9. Current Work

| Field | Value |
| ----- | ----- |
| **Current Task** | Project memory initialization |
| **Current Feature** | N/A (establishing project context) |
| **Current Blockers** | None |
| **Branch** | Not Verified |

---

## 10. Pending Work

### Critical
- Set up a test framework (Vitest recommended for Vite projects)
- Regenerate Supabase types (`supabase gen types`) to remove `as any` casts in `db.ts`

### High
- Add server-side role authorization checks per server function (beyond RLS)
- Add input validation (Zod schemas) for all server functions
- Add comprehensive test coverage for auth flows
- Remove committed service account JSON (`neo-cash-service-account.json`) from repo and add to `.gitignore`
- Review and harden all RLS policies

### Medium
- Multi-language (English + Bangla) i18n system
- E2E test suite for critical user journeys
- Rate limiting on auth endpoints
- CSRF protection review
- Structured error logging

### Low
- Performance audit (bundle size, code splitting)
- Accessibility audit
- SEO optimization for landing page
- Storybook or similar component documentation

---

## 11. Bug Register

| ID | Bug | Severity | Status | Root Cause | Fix | Regression Test |
| -- | --- | -------- | ------ | ---------- | --- | --------------- |
| — | No bugs formally registered yet | — | — | — | — | — |

> Bugs will be recorded here as they are discovered during development and testing.

---

## 12. Testing Status

| Metric | Value |
| ------ | ----- |
| Test Framework | **Not Configured** |
| Unit Tests | 0 |
| Integration Tests | 0 |
| UI Tests | 0 |
| E2E Tests | 0 |
| Total Tests | 0 |
| Passing | N/A |
| Failing | N/A |
| Coverage | 0% |
| Last Run | Never |
| Known Untested Areas | Everything |

---

## 13. Security Status

| Area | Status |
| ---- | ------ |
| Authentication (Supabase Auth) | Implemented — Not Fully Tested |
| Authorization (RLS) | Implemented — Not Fully Tested |
| Server-Side Role Checks | Partially Implemented |
| Input Validation (Server Functions) | Not Verified |
| File Upload Security | Needs Review |
| Secrets Management | ⚠ `neo-cash-service-account.json` committed to repo |
| Dependency Security | Not Audited |
| API Security | Needs Review |
| Database RLS | Implemented (6 migration files with policies) — Not Fully Tested |
| Rate Limiting | Not Implemented |
| CSRF Protection | Not Verified |
| Logging / Privacy | Needs Review |

---

## 14. Technical Decisions

| Decision | Reason | Alternatives Considered | Status | Date |
| -------- | ------ | ----------------------- | ------ | ---- |
| TanStack Start over Next.js | Full-stack React with file-based routing, Vite-native, edge runtime compatible | Next.js, Remix | Active | Pre-project |
| Supabase over custom backend | Auth + PostgreSQL + Storage + RLS in one platform; rapid MVP development | Firebase, custom Express API | Active | Pre-project |
| localStorage store for MVP | Fast demo without requiring full DB round-trips; dual-layer migration path | Supabase-only from start | Active (transitioning) | Pre-project |
| SSLCommerz for payments | Dominant BD payment gateway supporting bKash/Nagad/Rocket/Cards | Stripe, custom integration | Active | Phase 3 |
| Cloudflare Workers deployment | Edge runtime, free tier, fast global distribution | Vercel, Netlify, GCP only | Active | Pre-project |
| shadcn/ui component library | Accessible Radix primitives, copy-paste ownership, TailwindCSS compatible | MUI, Chakra, Ant Design | Active | Pre-project |
| Autumn palette design system | Distinctive brand identity; warm academic institutional feel | Standard blue/corporate palette | Active | Pre-project |

---

## 15. Known Constraints

- **Platform:** Cloudflare Workers runtime (no Node.js native modules).
- **Database:** Supabase free/pro tier limits.
- **Payments:** SSLCommerz sandbox mode only (no live transactions).
- **AI:** Requires GCP project with Vertex AI API enabled + service account.
- **State:** Dual localStorage + Supabase state creates potential sync issues during migration.
- **Types:** `src/integrations/supabase/types.ts` may be stale relative to latest migrations.
- **Bundle:** Large component files (`admin-panel.tsx` at 305KB, `student-panel.tsx` at 160KB, `head-panel.tsx` at 105KB) may affect performance.
- **⚠ Security:** Service account JSON is committed to the repository.

---

## 16. Current Sprint

| Field | Value |
| ----- | ----- |
| **Sprint Goal** | Not formally defined |
| **Start Date** | Unknown |
| **End Date** | Unknown |
| **Sprint Backlog** | N/A |
| **Completed** | MVP feature implementation (all phases 1–25) |
| **In Progress** | Project documentation |
| **Blocked** | None |
| **Test Status** | No tests |
| **Coverage** | 0% |

---

## 17. Next Recommended Work

1. **Set up Vitest** — Enable test framework for the project.
2. **Remove committed secrets** — Delete `neo-cash-service-account.json` from repo, add to `.gitignore`, use environment variables.
3. **Regenerate Supabase types** — Run `supabase gen types` to remove `as any` casts.
4. **Add server-side role authorization** — Ensure server functions validate user roles, not just authentication.
5. **Add Zod validation schemas** — Validate all server function inputs.
6. **Write auth flow tests** — Login, signup, session guard, role switching.
7. **Security audit** — File uploads, RLS policies, input validation.

---

## 18. Recent Changes

### 2026-10-04
- Fixed Student Panel UI/UX Issues:
  - Removed generic styling and aligned with Autumn Palette.
  - Standardized Dashboard Card paddings and shadows.
  - Fixed horizontal scrollbars on Quick Actions/Chips by applying themed hidden scrollbars.
  - Reduced excessive gaps and inner padding (flex layout stretching) on Quick Actions and Institutional Notices.
- Implemented Framer Motion `AnimatePresence` morphing transition for the Floating AI Chatbot button.
- Resolved hydration mismatch in `PWAManager` causing persistent "offline" banners.
- Investigated Google OAuth 400 error (Missing credentials in Supabase project dashboard).
- Fixed content overlap issue in dashboard shell by adjusting `#main-scroll` padding.
- Added missing horizontal padding to `#main-scroll` to align main content with the header and prevent content from touching screen edges.
- **Profile Modal UI Polish:**
  - Removed off-brand purple (`#7C3AED`) gradients from Neo Wallet card and Avatar glow, applying Autumn Palette (`#FF8C42`).
  - Refactored Profile Menu buttons to use semi-transparent `rgba()` backgrounds to properly support Dark Mode without jarring white blocks.
  - Fixed Sign Out button styling (red background, matching chevron, fixed hover state).
  - Softened drag handle and modal divider lines for cross-theme compatibility.
- **Centralized Theme System:** Implemented a global `ThemeProvider` Context in `src/lib/theme-provider.tsx`. Wrapped the app in `src/routes/__root.tsx` and migrated `dashboard-shell.tsx` to use the `useTheme` hook, allowing any component to access or toggle the active theme without relying solely on `.dark` CSS overrides.
- **Color Palettes (Theme Switcher):** Introduced dynamic CSS variables (`--theme-color-900`, `--theme-color-500`, etc.) and defined 4 specific themes in `styles.css`: Sunset Vibes (default), Ocean Breeze, Nature Tones, and Royal Purple. Created `<ThemePaletteSelector />` and placed it in the navbar to let users switch themes on the fly. Replaced hardcoded primary colors (`#D35400`, `#FF8C42`) across the app with these new variables.
- Created comprehensive `AGENTS.md` with permanent project rules and agent configuration.
- Created comprehensive `MEMORY.md` with current project state from full codebase inspection.

---

## 19. Agent Handoff Notes

- **Critical:** `neo-cash-service-account.json` (GCP credentials) is committed to the repository. This is a security risk and should be addressed before any public exposure.
- **State architecture is dual-layer:** `useNeoStore()` (localStorage) coexists with `db.ts` (Supabase queries via React Query). The project is transitioning from localStorage-first to Supabase-first. Be careful not to break either layer.
- **No test framework is configured.** All features are marked "Not Tested" because there are zero automated tests.
- **`admin-panel.tsx` is 305KB.** This is an extremely large single component file and is fragile. Changes require careful impact analysis.
- **`neo-cash-store.ts` is 2563 lines.** This is the central state engine for the entire MVP. Any change can cascade across all three portals.
- **`db.ts` uses `as any` casts** because `types.ts` was not regenerated after Phase 1+ migrations.
- **Server-side authorization beyond RLS is incomplete.** Server functions authenticate users but don't all check roles explicitly.
- **The project uses TanStack Start with Cloudflare Workers.** This means no Node.js native modules (e.g., `fs`, `path`, `crypto` from Node) are available at runtime. Use Web APIs instead.
- **Styling uses TailwindCSS v4** (not v3). The configuration is via `@tailwindcss/vite` plugin, not a `tailwind.config.js` file.

# AGENTS.md — Neo Cash AI Project Rules & Agent Configuration

> **Mandatory First-Read Rule:** Before making ANY code change, the agent MUST read `AGENTS.md`, then `MEMORY.md`, then inspect the relevant project structure and existing implementation.

---

## 1. Project Identity

- **Project:** Neo Cash AI — Intelligent Cashless Financial Ecosystem for Academic Institutions
- **Stack:** React 19 + TypeScript, TanStack Start, TanStack Router, Vite, Nitro SSR, Tailwind CSS 4, Supabase (Auth + PostgreSQL), Cloudflare Workers
- **Type:** Standalone Vite & TanStack Start Web Application

---

## 2. Mandatory Pre-Work Sequence

Before writing ANY code:

1. Read `AGENTS.md`.
2. Read `MEMORY.md`.
3. Inspect the relevant project structure.
4. Identify the relevant module, feature, API, database table, component, service, test, or configuration.
5. Check existing implementation before creating a new implementation.
6. Check existing tests before modifying behavior.
7. Check known bugs and incomplete work in `MEMORY.md`.
8. Determine whether the change affects any documented architecture or security constraint.
9. Do NOT start coding immediately. Establish project context first.
10. If the requested change is already implemented, do NOT recreate it.
11. If the change conflicts with an existing architectural decision, explain the conflict first.

---

## 3. Context-Efficiency Rules

Optimize token usage through context management, not through reduced quality.

**Preferred inspection sequence:**
1. Read `AGENTS.md` → `MEMORY.md` → project tree.
2. Identify relevant files.
3. Read only relevant sections.
4. Search for existing implementations.
5. Modify the smallest necessary area.
6. Run targeted tests.
7. Update documentation/state.

**Avoid:**
- Re-reading unchanged files unnecessarily.
- Re-explaining the entire project in every response.
- Searching the repository without a specific purpose.
- Creating duplicate utilities, API logic, or components.
- Rewriting working code without a reason.
- Making unrelated refactors or formatting changes.
- Repeating information already stored in these files.

---

## 4. Source of Truth Hierarchy

1. Actual source code
2. Database/schema/configuration (Supabase migrations)
3. Tests
4. `AGENTS.md`
5. `MEMORY.md`
6. User request

If documentation contradicts actual implementation, investigate the difference. When the implementation is intentionally changed, update documentation.

---

## 5. Architecture Rules

- **Frontend:** React 19 with TanStack Router file-based routing under `src/routes/`.
- **State:** Dual-layer: `useNeoStore()` (localStorage-persisted reactive store in `src/lib/neo-cash-store.ts`) for demo/MVP + Supabase-backed queries via `src/lib/db.ts` (React Query).
- **Backend:** TanStack Start server functions, Nitro SSR, Cloudflare Workers runtime.
- **Database:** Supabase PostgreSQL with RLS. Migrations under `supabase/migrations/`.
- **Auth:** Supabase Auth (email/password, Google OAuth, WebAuthn/Passkey). Server middleware in `src/integrations/supabase/auth-middleware.ts`.
- **Styling:** TailwindCSS 4 with custom design tokens (Autumn Palette). UI primitives via Radix UI + shadcn/ui in `src/components/ui/`.
- **Payments:** SSLCommerz sandbox integration (server functions in `src/lib/sslcommerz.functions.ts`).
- **AI:** Vertex AI / Gemini for signature verification (`src/lib/signature-verification.functions.ts`).

**Before introducing a new pattern:**
- Verify the project doesn't already use an equivalent.
- Maintain consistency with existing folder structure, naming, state management, API architecture, and error handling.

**Before adding a dependency:**
- Check existing alternatives.
- Verify package maintenance, security, bundle impact, compatibility, license, and necessity.
- Prefer simple, maintainable solutions.

---

## 6. Code Modification Rules

1. Understand the current implementation.
2. Identify the smallest correct change.
3. Preserve existing behavior unless the requested change requires otherwise.
4. Avoid unrelated formatting or refactoring.
5. Do not rename public APIs unnecessarily.
6. Do not change database schemas unnecessarily.
7. Do not remove working functionality without explicit justification.
8. Preserve backward compatibility where practical.
9. Add or update tests for changed behavior.
10. Every code change must have a reason.

---

## 7. Database Change Rules

Database changes are high-risk. Before modifying a schema:

1. Inspect the current schema (check `supabase/migrations/` files).
2. Search all usages of affected tables/columns.
3. Check foreign keys, indexes, constraints.
4. Check RLS policies.
5. Check migrations history.
6. Check `src/lib/db.ts` queries and `src/lib/neo-cash-store.ts` state.
7. Check `src/integrations/supabase/types.ts`.
8. Check API server functions.
9. Check frontend component assumptions.
10. Document changes in `MEMORY.md`.

Never silently break existing data. Prefer migrations over undocumented modifications.

---

## 8. API Change Rules

Before modifying an API (TanStack Start server functions):

1. Locate the server function/endpoint.
2. Check request/response format.
3. Check auth requirements (`requireSupabaseAuth` middleware).
4. Check validation and error responses.
5. Search frontend usage (components calling the function).
6. Search tests.
7. Update all affected clients and tests when changing contracts.

---

## 9. Authentication & Authorization

- Authentication is via Supabase Auth (enforced server-side via `requireSupabaseAuth` middleware).
- Route protection via `_authenticated/route.tsx` layout guard.
- **Three roles:** `student`, `admin`, `head` (plus `demo_controller`).
- Authorization must be enforced server-side. Never trust client-side role checks alone.
- Never trust: user-provided roles, client-side permissions, hidden UI elements, client-provided user IDs, ownership information, or admin flags.
- Every protected operation must validate authorization.
- Use least privilege.

---

## 10. Security Rules

Treat all external input as untrusted.

**Validate:** Request bodies, query parameters, path parameters, uploaded files, file names/types/MIME, authentication tokens, user-controlled text, IDs, pagination, sorting, search parameters.

**Protect against:** SQL injection, XSS, CSRF, broken access control, IDOR, authentication bypass, privilege escalation, mass assignment, path traversal, malicious file uploads, SSRF, command injection, sensitive info disclosure, improper error exposure, rate-limit abuse, brute-force auth, session/token misuse.

**Never commit:** API keys, passwords, private keys, JWT secrets, database credentials, service account credentials, production tokens. Use environment variables.

**Never log:** Passwords, access tokens, refresh tokens, private keys, sensitive personal data.

---

## 11. File Upload Security

- Validate file size, extension, MIME type, file name, storage path, user authorization.
- Never trust file extension alone.
- Do not allow user-controlled file names as filesystem paths.
- Use generated storage names (Supabase Storage handles this).
- Prevent path traversal.

---

## 12. Error Handling

- Do not expose: stack traces, database credentials, internal paths, SQL queries, auth secrets, infrastructure details.
- Use user-safe error messages.
- Log technical info for debugging without logging secrets.
- Handle expected errors explicitly.
- No empty catch blocks. No silently swallowed errors (except where explicitly justified).

---

## 13. Performance Rules

Avoid unnecessary: API requests, database queries, component rebuilds, network calls, large payloads, repeated calculations, duplicate queries, blocking operations.

- Use pagination for large datasets.
- Use caching (React Query `staleTime`) where appropriate.
- Don't optimize blindly; measure first.

---

## 14. Testing Requirements

> **Current status: No test framework is configured.** See `MEMORY.md` for details.

Testing is mandatory for meaningful code changes. When a test framework is set up:

**Coverage targets:**
- Minimum: 60%
- Security-critical / auth / core business logic: significantly higher.
- Do not write tests only to satisfy a percentage.

**Testing levels:**
- **Unit:** Isolated functions, validators, services, business logic.
- **Integration:** API + database, auth + authorization, services.
- **UI/Component:** Important UI behavior, states, validation, navigation.
- **E2E:** Critical user journeys (registration, login, role-based access, payments, etc.).

**Must cover:** Happy paths, invalid input, boundary conditions, empty states, null values, unauthorized access, auth failures, permission failures, duplicate requests, network failures, timeout scenarios, malformed responses, large inputs, concurrent behavior.

**Hard test cases required:** Invalid user ID, another user's resource, invalid role, expired/missing/tampered token, empty/oversized/malformed requests, duplicate records, unauthorized endpoint/object access, invalid file uploads, network interruptions.

---

## 15. Regression Testing

Every bug fix should include a regression test. The test should fail before the fix and pass after.

---

## 16. Bug Management

Every discovered bug must be recorded in `MEMORY.md` with: Bug ID, Title, Severity (Critical/High/Medium/Low), Priority, Feature/module, Description, Reproduction steps, Expected behavior, Actual behavior, Root cause, Status, Fix, Regression test, Date discovered, Date fixed.

---

## 17. Agile Workflow

**Use:** Product Backlog, Sprint Backlog, User Stories, Tasks, Bug Tracking, Sprint Goals, Definition of Done, Retrospective notes.

**Feature format:**
```
As a [user], I want [function], so that [benefit].

Acceptance Criteria:
- Given... When... Then...

Technical Tasks: Frontend, Backend, Database, Security, Testing, Documentation
```

---

## 18. Definition of Done

A feature is Done only when:
- [ ] Requirements implemented
- [ ] Code follows project architecture
- [ ] Input validation exists
- [ ] Authorization verified
- [ ] Error handling exists
- [ ] Tests exist
- [ ] Relevant tests pass
- [ ] Regression testing completed
- [ ] Coverage ≥ 60%
- [ ] Security implications checked
- [ ] Documentation updated where necessary
- [ ] `MEMORY.md` updated
- [ ] `AGENTS.md` updated if permanent rules changed
- [ ] No known critical regression introduced

---

## 19. Git Rules

- Small, meaningful commits.
- Avoid giant commits with unrelated changes.
- Message format: `feat:`, `fix:`, `test:`, `refactor:`, `docs:`, `chore:`, `perf:`, `security:`
- Never commit secrets or generated build artifacts.

---

## 20. Change Verification

After changing code, verify:
1. Formatting (Prettier via `npm run format`)
2. Linting (`npm run lint`)
3. TypeScript compilation (`npm run build`)
4. Unit tests (when available)
5. Integration tests (when relevant)
6. Security-sensitive tests
7. Code coverage

Do not claim something works without running relevant verification.

---

## 21. Documentation Synchronization

After every meaningful implementation change:
- `AGENTS.md`: Only if a permanent project rule or convention changed.
- `MEMORY.md`: When features, bugs, tests, coverage, architecture, database, API, security, or sprint status changed.

---

## 22. Mandatory Memory Update

When making a meaningful code change, update `MEMORY.md` in the same task. Do not wait for the user to request it. Keep updates concise and factual.

---

## 23. Memory Accuracy

- Never invent project status.
- If not verified, mark as: `Unknown`, `Unverified`, `Not Tested`, `Needs Verification`.
- Do not write "working" merely because code exists.

---

## 24. Agent Decision Priorities

When multiple valid approaches exist:
1. Prefer the existing project pattern.
2. Prefer the simplest maintainable solution.
3. Prefer fewer dependencies.
4. Prefer better testability.
5. Prefer stronger security.
6. Prefer backward compatibility.
7. Prefer smaller changes.
8. Prefer solutions that reduce future maintenance.
9. Do not over-engineer the MVP.

---

## 25. MVP Protection

- MVP scope is documented in `MEMORY.md`.
- Do not silently expand the MVP.
- Do not introduce unrelated features during implementation.
- If a requested feature is outside the MVP, identify it as an extension.

---

## 26. Response Efficiency

After implementation, report only:
- What changed
- Important files changed
- Tests executed and results
- Coverage
- Security considerations
- Documentation updates
- Remaining issues

Do not re-explain unchanged code.

---

## 27. Anti-Hallucination Rule

Distinguish: `Verified`, `Observed`, `Inferred`, `Assumed`, `Unknown`.
Never present an assumption as a verified project fact.
If the repository contradicts `MEMORY.md`, inspect actual implementation and correct `MEMORY.md`.

---

## 28. Change Impact Analysis

Before modifying a shared component, service, database table, API, auth mechanism, or utility:
- Who uses it?
- What depends on it?
- What tests cover it?
- What could break?
- Does the change affect security, API compatibility, database compatibility, performance?

Make the smallest safe change.

---

## 29. Security-First Change Check

For every change involving auth, user data, roles, permissions, file uploads, DB queries, APIs, tokens, storage, notifications, or admin functions:

1. Can an unauthorized user perform this action?
2. Can a user access another user's data?
3. Can the client manipulate authorization information?
4. Is input validated?
5. Can malformed input break the system?
6. Can sensitive information leak?
7. Are secrets protected?
8. Are errors safe?
9. Are relevant security tests present?
10. Is regression coverage present?

---

## 30. Design System

**Autumn Palette (from `PROPOSAL.md`):**
- Primary: `#D35400` (Burnt Orange)
- Accents: `#FF8C42` (Warm Amber), `#F7B733` (Gold), `#C49A6C` (Tan)
- Backgrounds: `#FFF7E6` (Warm Ivory), `#FFFFFF` (Clean Surface), `#FDF9F3` (Beige)
- Text: `#241A14` (Dark Charcoal), `#66564A` (Muted Charcoal)
- Fonts: `Nunito Sans` (body), `Lobster Two` (display)
- Design tokens defined in `src/components/design-system/tokens.ts`
- UI primitives in `src/components/design-system/ui-primitives.tsx`
- Component library: shadcn/ui (Radix UI) in `src/components/ui/`

---

## 31. Naming Conventions

- **Files:** kebab-case (`fee-payment-modal.tsx`, `neo-cash-store.ts`)
- **Components:** PascalCase (`DashboardShell`, `StudentPanel`)
- **Functions:** camelCase (`useNeoStore`, `profileQueries`)
- **Types/Interfaces:** PascalCase (`NeoState`, `Fee`, `PartialApplication`)
- **Routes:** File-based routing via TanStack Router (`__root.tsx`, `_authenticated/`, `index.tsx`)
- **Server functions:** `*.functions.ts` (e.g., `sslcommerz.functions.ts`, `webauthn.functions.ts`)
- **Server-only files:** `*.server.ts` (e.g., `sslcommerz-ipn.server.ts`)
- **Path alias:** `@/` maps to `src/`

---

## 32. Environment Variables

- Client-accessible variables prefixed with `VITE_`.
- Server-only variables without prefix.
- Reference `.env.example` for required variables.
- Never hardcode secrets.

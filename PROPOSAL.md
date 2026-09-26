# PROPOSAL.md — Project Proposal: Neo Cash AI

## Executive Summary

**Neo Cash AI** is an intelligent, unified, and automated cashless financial ecosystem designed specifically for modern academic institutions (colleges, universities, and polytechnics). The platform bridges the gap between student financial self-service, administrative operations, and executive leadership authorization.

By combining WebAuthn Passkey biometric authentication, multi-gateway digital wallet top-ups (bKash, Nagad, Rocket, Visa/Mastercard), AI-assisted signature document verification, social welfare impact gamification, and an immutable 6-dimension SHA-256 cryptographic audit trail, Neo Cash AI eliminates paper-heavy administrative bottlenecks, reduces fee collection defaults, and guarantees institutional financial transparency.

---

## 1. Problem Statement & Institutional Challenges

Educational institutions in Bangladesh and emerging regional markets face significant financial operational challenges:

1. **Manual & Fragmented Fee Collections:** Queue-heavy manual counter deposits lead to delayed revenue intake, missing records, and high administrative overhead.
2. **Lack of Hardship & Partial Payment Flexibility:** Students experiencing temporary financial hardship face rigid payment deadlines or informal, unrecorded waiver requests.
3. **Information Asymmetry Between Admin & Executive Leadership:** Departmental admins process fee paperwork manually, leaving the Principal, Director, or Head of Institution with delayed financial visibility and no formal digital approval trail.
4. **Audit Vulnerabilities:** Disconnected spreadsheets and paper receipts lack cryptographic verification, exposing institutions to reconciliation discrepancies.
5. **Student Disengagement:** Conventional payment portals offer cold, transactional experiences without social impact, peer support, or welfare incentives.

---

## 2. Proposed Solution: Neo Cash AI Ecosystem

Neo Cash AI solves these challenges through a **3-Tiered Information Architecture** built on a single reactive state engine:

```
+-----------------------------------------------------------------------------------+
|                                 NEO CASH AI                                       |
+-----------------------------------------------------------------------------------+
|  1. STUDENT PORTAL       |  2. ADMIN OPERATIONS       |  3. EXECUTIVE HEAD        |
|  - Passkey / WebAuthn    - Student Directory (6D)     - Executive Command         |
|  - Digital Wallet (bKash)- Bulk Fee Assignment Engine - 10-Point Approval Center  |
|  - AI Hardship Application- Excel AI Import Processor - Institutional Solvency    |
|  - Digital Receipts      - Risk & Attention Engine    - Nationwide Impact Trophy  |
|  - Social Welfare Points - Reminder Rules Control     - Read-Only Audit Ledger    |
+-----------------------------------------------------------------------------------+
|               CORE ENGINE: Reactive Store + SHA-256 Cryptographic Audit           |
+-----------------------------------------------------------------------------------+
```

---

## 3. System Architecture & Core Technology Stack

### 3.1 Technology Stack
- **Frontend Framework:** React 19, TypeScript, TanStack Start, TanStack Router.
- **Build System & Runtime:** Vite, Rolldown, Nitro SSR.
- **Styling & Design System:** Vanilla CSS + TailwindCSS (Autumn Palette Design System: `#D35400` Burnt Orange, `#FF8C42` Warm Amber, `#FFF7E6` Warm Ivory, `#241A14` High-Contrast Charcoal).
- **Security & Authentication:** SimpleWebAuthn (WebAuthn / Passkey Biometrics), SHA-256 Cryptographic Event Hashing.
- **Icons & UI:** Lucide React, Custom Glassmorphism Surface Tokens.

### 3.2 3-Tier Navigation Architecture

#### Tier 1: Student Self-Service Portal
- **Biometric Passkey Login:** WebAuthn passwordless authentication.
- **Institution Search & Verification:** Verified institutional seal (`Dhaka City College • Verified 🏛️`).
- **Multi-Gateway Digital Wallet:** Instantly top up or pay via bKash, Nagad, Rocket, or Visa/Mastercard debit cards.
- **Fee Obligation Schedule:** Real-time visibility into tuition, lab, exam, library, and hostel dues.
- **AI Signature Verification Hardship Application:** Upload Guardian NID & Signature document -> AI model computes similarity match score (e.g. 96%) -> Transmits application to Admin queue.
- **Social Impact Welfare Ecosystem:** Earn 1 Impact Point for every ৳100 donated to student welfare -> Live rankings (Class, Department, Institution, Nationwide).
- **Print-Ready Digital Receipts:** Instant modal with Reference ID, Receipt # (`REC-XXXXXX`), timestamp, and fee breakdown.

#### Tier 2: Admin Operations Center
- **Institutional Solvency Dashboard:** Real-time collection percentage (82.4%), total outstanding, overdue breakdown, and monthly trajectory charts.
- **6-Dimension Student Directory:** Search across Name, Student ID, Email, Dept, Class/Year, Section, Semester, Fee Status, and Verification status. Includes manual student enrolment modal.
- **Bulk Cohort Fee Assignment:** Assign fees to targeted departments and cohorts with safety confirmation modal.
- **Excel/CSV AI Import Processor:** Batch upload student rosters with automated data quality checks and inline error correction matrix.
- **Partial Payment Review Queue:** Inspect student applications, view AI signature scores, and click **"Forward to Head"** for executive authorization.
- **Financial Intelligence Risk Suite:** AI risk flags for overdue fees, ignored reminders, and failed payment attempts with an integrated Admin Contact Suite (Email, SMS, Voice Call).
- **Automated Reminder Rule Engine:** Admin controls for `weekly`, `near_deadline`, `final_day`, and `missed_deadline` notification sweeps.

#### Tier 3: Executive Head Command & Approval Center
- **Executive Command Panel:** Solvency gauges, collection rates, and high-level institutional financial health overview tailored for executive authority.
- **10-Point Approval Center:** Comprehensive dossier modal displaying:
  1. Student Identity & CGPA Standing
  2. Institutional Jurisdiction
  3. Fee Category
  4. Total Fee Amount
  5. Requested Split Amount
  6. Hardship Reason & Declaration
  7. Uploaded NID & Signature Docs
  8. AI Verification Score
  9. Payment & Repayment History
  10. Admin Review Recommendation
- **Head Actions:** Executive Approve (unlocks custom installment amount & deadline for student), Reject (with reason), or Request Changes (with feedback).
- **Nationwide Impact Trophy:** Regional and national ranking position reports, top donor leaderboard, and department ranking matrix.

---

## 4. Cryptographic Audit Trail & Security Policy

All sensitive financial and administrative operations generate an immutable entry in the **6-Dimension Cryptographic Audit Ledger**:

1. **Performing Actor & Role** (e.g. `Head / Director (Prof. Dr. M. A. Karim)`)
2. **Action Type & Scope** (e.g. `Approved Partial Payment Application`)
3. **Student & Financial Target** (e.g. `Shelly Paul (DCC-2024-9042)`)
4. **Before Value vs. After Value Comparative Diff**
5. **Timestamp & Date**
6. **SHA-256 Verification Hash** (e.g. `SHA256: 8f92a10b42c98401e712a104`)

---

## 5. Notification & Email Service Abstraction

The platform supports **12 institutional notification event types**:
`login`, `fee_assigned`, `fee_reminder`, `payment_success`, `payment_failure`, `deadline_approaching`, `deadline_missed`, `partial_payment_submitted`, `admin_reviewed`, `head_approved`, `head_rejected`, `donation_completed`.

If an external email service (Supabase / SMTP) is unconfigured, the system logs emails to `demoEmailLogs` with status **`Demo Logged (Provider Not Connected)`**, ensuring complete demo transparency without false claims.

---

## 6. Implementation Timeline & Phase Milestones

```
Phases 1–7  : Student Auth, Passkeys, Multi-Gateway Wallet, Dues & Receipts
Phases 8–11 : Admin Escalations, Donation Points, Operations Center & Solvency
Phases 12–15: 6D Student Directory, Academic Structure, Bulk Fees, Excel AI Import
Phases 16–18: Admin Partial Queue, Risk Intelligence, Cryptographic Audit Ledger
Phases 19–21: Head Executive Command, 10-Point Approval Center, Impact Reports
Phases 22–24: Demo Controller System, 12-Event Notification Engine, Full Integration
Phase 25    : End-to-End QA Audit, Palette Compliance, Hydration & Stability Verification
```

---

## 7. Conclusion

Neo Cash AI provides educational institutions with a state-of-the-art, secure, and modern financial management suite. By empowering students with flexible partial payment options and equipping administrators and executive leaders with real-time auditability, Neo Cash AI sets a new standard for academic financial platforms.

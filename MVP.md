# MVP.md — Minimum Viable Product (MVP) Specification & Feature Matrix

## Overview

This document specifies the complete **Minimum Viable Product (MVP)** for **Neo Cash AI**, covering all 25 development phases, system workflows, data persistence schemas, role permission matrices, and quality assurance benchmarks.

---

## 1. MVP Feature Matrix by Role

### 1.1 Student Portal Features
- **Passkey / WebAuthn Biometric Authentication:** Fingerprint/FaceID login with fallback demo switcher.
- **Institution Discovery & Verification:** Institution selection with official verified badge (`Dhaka City College • Verified 🏛️`).
- **Digital Wallet:** Available & Wallet balance management with mobile banking top-ups (bKash, Nagad, Rocket) and credit card processing (Visa/Mastercard).
- **Fee Obligations Dashboard:** Itemized listing of tuition, lab, evaluation, library, and hostel dues with deadline alerts.
- **Partial Payment Application & AI Check:**
  - Guardian NID & Signature document upload.
  - Automated AI Signature Similarity Score calculation (96% match).
  - Unlocked Installment 1 payment action upon Head executive approval.
- **Digital Receipt Generator:** Modal receipt viewer featuring Reference ID, Receipt Number (`REC-XXXXXX`), timestamp, item breakdown, and print/download action.
- **Social Impact Welfare & Leaderboards:** ৳100 = 1 Point donation engine with live rankings across Class, Department, Institution, and Nationwide categories.
- **Neo AI Financial Assistant & Support Escalation:** Interactive chat assistant with human support ticket escalation to Admin controllers.

### 1.2 Admin Operations Portal Features
- **Operations Center Dashboard:** Financial solvency overview, collection rate gauge (82.4%), total outstanding (৳1.48M), and revenue collection trend trajectory.
- **6-Dimension Student Directory:**
  - Multi-field search (Name, Student ID, Email, Dept).
  - 6 Filter Dropdowns: Class/Year, Section, Department, Semester, Fee Status, Verification Status.
  - **Manual Student Enrolment Modal:** Add new student records into the reactive directory.
  - Administrative student profile editing & single-click semester promotion.
- **Bulk Cohort Fee Assignment:** Assign fees to targeted departments, classes, sections, and semesters with safety confirmation modal.
- **Excel/CSV AI Import Processor:** Batch upload student rosters with automated data quality validation and inline error correction matrix.
- **Partial Payment Review Queue:** Inspect student hardship applications, review AI signature score, and click **"Forward to Head"** for executive authorization.
- **Financial Intelligence Risk Suite:** AI risk flags for overdue fees, ignored reminders, and failed payment attempts with an integrated Admin Contact Suite (Email, SMS, Voice Call).
- **Automated Reminder Rule Engine:** Admin controls for `weekly`, `near_deadline`, `final_day`, and `missed_deadline` alerts with automated run execution.
- **Human Support Escalation Queue:** Review, reply to, and resolve student support tickets escalated from the AI Assistant.

### 1.3 Executive Head Portal Features
- **Executive Command Dashboard:** High-level institutional financial health, collection rate, pending decisions count, and financial overview designed for executive leadership.
- **10-Point Hardship Approval Center:** Comprehensive dossier modal displaying:
  1. Student Identity & CGPA Standing
  2. Institutional Jurisdiction
  3. Fee Item Name
  4. Total Fee Amount
  5. Requested Split Amount
  6. Hardship Reason & Declaration
  7. Uploaded Guardian NID & Signature Docs
  8. AI Verification Score (96% Match)
  9. Payment & Repayment History
  10. Admin Review Recommendation
- **Executive Actions:** Approve (unlocks custom installment amount & deadline for student), Reject (with reason), or Request Changes (with feedback).
- **Executive Read-Only Student Directory:** Audit view of enrolled student profiles and financial balances.
- **Nationwide Impact Trophy:** Regional and national ranking position reports, top donor leaderboard, and department ranking matrix.

---

## 2. End-to-End Workflow Lifecycles

### 2.1 Student Hardship & Partial Payment Lifecycle

```
[Student selects Fee (৳20,000 Dues)]
                 ↓
[Clicks "Apply Partial Payment"]
                 ↓
[Uploads Guardian NID & Signature Doc]
                 ↓
[AI Signature Check computes 96% Match]
                 ↓
[Status set to: pending_admin]
                 ↓
[Admin Queue Review -> Clicks "Forward to Head"]
                 ↓
[Status set to: forwarded_head]
                 ↓
[Head inspects 10-Point Dossier -> Approves ৳10,000 Installment 1]
                 ↓
[Status set to: approved_head]
                 ↓
[Real-Time Notification sent: head_approved]
                 ↓
[Student Fee unlocks "Pay Installment 1 (৳10,000)"]
                 ↓
[Student Pays ৳10,000 -> Status updated to "paid" -> Receipt #REC-XXXXXX generated]
```

### 2.2 Payment & Balance Deduction Lifecycle

```
[Student Clicks "Pay Fee" or "Pay Installment"]
                 ↓
[System verifies Available Wallet Balance / Gateway Choice]
                 ↓
[Deducts walletBalance & availableBalance in Store]
                 ↓
[Updates fee.status to "paid" & fee.amount to 0]
                 ↓
[Generates Transaction object with Ref ID & Receipt Number]
                 ↓
[Dispatches "payment_success" Notification]
                 ↓
[Logs entry to 6-Dimension Cryptographic Audit Ledger with SHA-256 Hash]
```

---

## 3. Data Reactivity & Consistency Contracts

All state mutations occur synchronously in `useNeoStore` (`src/lib/neo-cash-store.ts`) and persist to `localStorage` under key `neo_cash_state_v1`:

| Triggering Action | Mutated State Attributes | Target Role Impact |
| :--- | :--- | :--- |
| **Admin Fee Assignment** | `fees`, `students.totalDues`, `students.feeStatus`, `notifications`, `auditLogs` | Student sees new fee obligation & updated total due. |
| **Head Partial Approval** | `partialApplications.status`, `fees.status`, `fees.amount`, `notifications`, `auditLogs` | Student fee unlocks Installment 1 button. |
| **Fee Payment Execution** | `balances`, `fees`, `transactions`, `notifications`, `auditLogs` | Wallet balance updated, receipt created, fee marked paid. |
| **Welfare Donation** | `balances`, `donations`, `transactions`, `notifications`, `auditLogs` | Points awarded (1 pt / ৳100), leaderboard re-ranked. |
| **Student Profile Edit** | `students`, `studentProfile`, `auditLogs` | Admin directory & dossier updated instantly. |

---

## 4. Notification Event Catalog (12 Events)

| Event Type | Event Title | Default Target Role | Category |
| :--- | :--- | :--- | :--- |
| `login` | Security Alert: Login Detected | Student / Admin / Head | `institution` |
| `fee_assigned` | New Fee Assigned | Student | `fee` |
| `fee_reminder` | Weekly Fee Reminder | Student | `fee` |
| `payment_success` | Payment Successful Confirmation | Student | `payment` |
| `payment_failure` | Payment Attempt Failed | Student | `payment` |
| `deadline_approaching` | Near-Deadline Alert | Student | `fee` |
| `deadline_missed` | Missed Payment Deadline Notice | Student | `fee` |
| `partial_payment_submitted` | Application Received | Admin | `application` |
| `admin_reviewed` | Admin Review Completed | Head | `application` |
| `head_approved` | Head Approval Granted | Student | `application` |
| `head_rejected` | Partial Application Rejected | Student | `application` |
| `donation_completed` | Welfare Contribution Completed | Student | `payment` |

---

## 5. Quality Assurance & Compliance Benchmarks

- **TypeScript Compilation:** Zero errors (`npm run build` exit code 0).
- **Design System Palette Compliance:**
  - Primary: `#D35400` (Burnt Orange)
  - Secondary Accents: `#FF8C42`, `#F7B733`, `#C49A6C`
  - Backgrounds: `#FFF7E6` (Warm Ivory), `#FFFFFF` (Clean Surface), `#FDF9F3` (Beige)
  - High-Contrast Text: `#241A14` (Dark Charcoal), `#66564A` (Muted Charcoal)
- **Deployment Target:** Cloudflare Workers / Nitro SSR (`https://neo-cash-clone.sp2khb.workers.dev/`).
- **Safe Hydration:** Automatic fallback to `INITIAL_STATE` on invalid or stale `localStorage` data.

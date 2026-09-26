
export interface ImportLogRecord {
  id: string;
  fileName: string;
  adminName: string;
  timestamp: string;
  importedCount: number;
  rejectedCount: number;
  warningCount: number;
  status: "Completed" | "Partial Success" | "Failed";
}


export interface AcademicDepartment {
  id: string;
  code: string;
  name: string;
  headName: string;
  totalStudents: number;
}

export interface AcademicClass {
  id: string;
  name: string;
  department: string;
  year: string;
  semester: string;
  totalSections: number;
  totalStudents: number;
}

export interface AcademicSection {
  id: string;
  name: string;
  department: string;
  classYear: string;
  capacity: number;
  currentCount: number;
}

/**
 * Neo Cash AI — Central Reactive State Engine
 * 
 * Manages connected MVP demo state for Student, Admin, and Head / Authority panels,
 * including onboarding, wallet balances, fees & dues, partial payment workflows,
 * AI signature match results, donation point system (৳100 = 1 Point), transactions,
 * audit logging, and role-based permissions.
 */

import { useState, useEffect } from "react";

export type Role = "student" | "admin" | "head";

export interface Fee {
  id: string;
  title: string;
  amount: number;
  originalAmount: number;
  dueDate: string;
  issuedDate?: string;
  paidDate?: string;
  status: "due" | "paid" | "overdue" | "pending_partial" | "partial_approved";
  partialAllowed?: boolean;
  approvedPartialAmount?: number;
  description: string;
  category: "Tuition" | "Lab & Tech" | "Library" | "Exam" | "Hostel" | "Transport";
}

export interface PartialApplication {
  id: string;
  studentName: string;
  studentId: string;
  feeId: string;
  feeTitle: string;
  originalAmount: number;
  requestedAmount: number;
  approvedAmount?: number;
  remainingAmount?: number;
  newDeadline?: string;
  reason: string;
  statement?: string;
  guardianName: string;
  guardianPhone: string;
  guardianIdDocUrl: string;
  guardianSignatureDocUrl?: string;
  studentSignatureDocUrl?: string;
  signatureDocUrl: string;
  aiMatchScore: number; // e.g. 96 (%)
  aiMatchStatus: "Signature Match" | "Needs Review" | "Mismatch";
  status:
    | "draft"
    | "submitted"
    | "pending_admin"
    | "forwarded_head"
    | "approved_head"
    | "rejected_admin"
    | "rejected_head"
    | "changes_requested"
    | "paid";
  submittedAt: string;
  adminNotes?: string;
  headNotes?: string;
  rejectionReason?: string;
  changeRequestNotes?: string;
}

export interface Transaction {
  id: string;
  title: string;
  date: string;
  amount: number;
  type: "fee" | "donation" | "wallet" | "refund";
  status: "Success" | "Pending" | "Failed" | "Refunded";
  method: string;
  referenceId: string;
  receiptNumber: string;
  feeId?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  category?: "payment" | "fee" | "application" | "institution" | "system" | "email";
  emailAlert?: boolean;
}

export interface ReminderRules {
  weeklyReminderEnabled: boolean;
  nearDeadlineDays: number;
  finalDayAlertEnabled: boolean;
  overduePenaltyNotice: boolean;
}


export interface EscalationMessage {
  id: string;
  sender: "student" | "ai" | "admin";
  senderName: string;
  text: string;
  timestamp: string;
  actionType?: "apply_partial" | "pay_fee" | "view_receipt";
}

export interface EscalationTicket {
  id: string;
  studentName: string;
  studentId: string;
  institution: string;
  department: string;
  subject: string;
  status: "open" | "in_progress" | "resolved";
  messages: EscalationMessage[];
  createdAt: string;
  lastReplyAt: string;
}

export interface AuditLog {
  id: string;
  actor: string;
  role: "Student" | "Admin" | "Head" | "System";
  action: string;
  details: string;
  timestamp: string;
  actionType?: "fee_assignment" | "deadline_change" | "app_review" | "forward_head" | "section_change" | "student_import" | "head_approval" | "system";
  studentName?: string;
  studentId?: string;
  financialRecordTitle?: string;
  beforeValue?: string;
  afterValue?: string;
  hash?: string;
}

export interface StudentRecord {
  id: string;
  name: string;
  studentId: string;
  department: string;
  classYear: string;
  section: string;
  semester: string;
  classSection: string;
  session: string;
  email: string;
  phone: string;
  status: "Active" | "Promoted" | "Pending Dues" | "Overdue";
  feeStatus: "Paid" | "Pending" | "Overdue" | "Partial Approved";
  walletBalance: number;
  totalDues: number;
  verified: boolean;
  lastActivity: string;
}

export interface NeoState {
  role: Role;
  isOnboarded: boolean;
  onboardingStep: number; // 1: Search, 2: SSO Verify, 3: Profile, 4: Wallet, 5: Done
  selectedInstitution: {
    name: string;
    type: string;
    location: string;
    logo: string;
    verified: boolean;
  };
  studentProfile: {
    name: string;
    studentId: string;
    institution: string;
    department: string;
    classSection: string;
    session: string;
    email: string;
    phone: string;
    avatar: string;
    isVerified: boolean;
  };
  balances: {
    availableBalance: number;
    walletBalance: number;
    totalDue: number;
    paidThisMonth: number;
    pendingAmount: number;
  };
  paymentMethods: Array<{
    id: string;
    name: string;
    type: "bkash" | "rocket" | "nagad" | "visa" | "mastercard" | "card";
    account: string;
    isDefault?: boolean;
  }>;
  fees: Fee[];
  partialApplications: PartialApplication[];
  donations: {
    totalDonated: number;
    points: number; // ৳100 = 1 Point
    rankClass: number;
    rankDept: number;
    rankInstitution: number;
    rankNational: number;
  };
  transactions: Transaction[];
  notifications: NotificationItem[];
  auditLogs: AuditLog[];
  escalations: EscalationTicket[];
  students: StudentRecord[];

  academicStructure: {
    departments: AcademicDepartment[];
    classes: AcademicClass[];
    sections: AcademicSection[];
  };
  reminderRules: ReminderRules;
  importLogs: ImportLogRecord[];
}

const INITIAL_STATE: NeoState = {
  role: "student",
  isOnboarded: true,
  onboardingStep: 1,
  selectedInstitution: {
    name: "Dhaka City College",
    type: "Collegiate University",
    location: "Dhanmondi, Dhaka",
    logo: "🏛️",
    verified: true,
  },
  studentProfile: {
    name: "Ruhan Dash Dibya",
    studentId: "DCC-CSE-24-1024",
    institution: "Dhaka City College",
    department: "Computer Science & Engineering",
    classSection: "1st Year / 2nd Semester",
    session: "2024–2025",
    email: "student@neocash.ai",
    phone: "+880 1712-345678",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ruhan",
    isVerified: true,
  },
  balances: {
    availableBalance: 24580,
    walletBalance: 6500,
    totalDue: 8500,
    paidThisMonth: 12000,
    pendingAmount: 2000,
  },
  paymentMethods: [
    { id: "pm-1", name: "bKash Mobile Banking", type: "bkash", account: "+880 17****5678", isDefault: true },
    { id: "pm-2", name: "Dutch-Bangla Rocket", type: "rocket", account: "+880 18****1234" },
    { id: "pm-3", name: "City Bank Visa Debit", type: "visa", account: "**** **** **** 4821" },
    { id: "pm-4", name: "Mastercard Credit", type: "mastercard", account: "**** **** **** 9012" },
  ],
  fees: [
    {
      id: "fee-1",
      title: "Semester Tuition Fee (Fall 2026)",
      amount: 20000,
      originalAmount: 20000,
      dueDate: "2026-09-30",
      issuedDate: "2026-08-15",
      status: "due",
      category: "Tuition",
      description: "Core academic tuition for CSE 3rd Semester modules assigned by Administration.",
    },
    {
      id: "fee-2",
      title: "Library & Digital Resources Fee",
      amount: 1500,
      originalAmount: 1500,
      dueDate: "2026-10-05",
      issuedDate: "2026-08-20",
      status: "due",
      category: "Library",
      description: "Annual access to IEEE Xplore, ACM Digital Library & Campus Physical Library.",
    },
    {
      id: "fee-3",
      title: "Transport & Campus Shuttle Fee",
      amount: 3000,
      originalAmount: 3000,
      dueDate: "2026-09-12",
      issuedDate: "2026-08-01",
      paidDate: "2026-09-12",
      status: "paid",
      category: "Transport",
      description: "Semester-wise campus bus route pass for Mirpur - Dhanmondi route.",
    },
    {
      id: "fee-4",
      title: "Midterm Examination Assessment Fee",
      amount: 2500,
      originalAmount: 2500,
      dueDate: "2026-09-15",
      issuedDate: "2026-08-10",
      status: "overdue",
      category: "Exam",
      description: "Mid-semester examination admit card issuance & answer script grading.",
    },
    {
      id: "fee-5",
      title: "Advanced Computing Lab & Tech Charge",
      amount: 5000,
      originalAmount: 10000,
      approvedPartialAmount: 5000,
      dueDate: "2026-10-15",
      issuedDate: "2026-08-18",
      status: "partial_approved",
      category: "Lab & Tech",
      description: "High-performance AI GPU workstation allocation & Robotics lab usage.",
    },
    {
      id: "fee-6",
      title: "Hostel & Hall Utility Charge",
      amount: 4500,
      originalAmount: 4500,
      dueDate: "2026-10-25",
      issuedDate: "2026-09-01",
      status: "pending_partial",
      category: "Hostel",
      description: "Monthly hall dining & utility electricity allocation (Under Admin review).",
    },
  ],
  partialApplications: [
    {
      id: "APP-9042",
      studentName: "Shelly Paul",
      studentId: "DCC-2024-8842",
      feeId: "fee-1",
      feeTitle: "Semester Tuition Fee (Fall 2026)",
      originalAmount: 20000,
      requestedAmount: 10000,
      reason: "Family medical emergency causing temporary financial hardship.",
      statement: "I solemnly declare that the attached guardian NID and income declaration are true and authentic.",
      guardianName: "Robert Paul",
      guardianPhone: "+880 1711-998877",
      guardianIdDocUrl: "NID-7849302198.pdf",
      guardianSignatureDocUrl: "Guardian-Signature.png",
      studentSignatureDocUrl: "Student-Signature.png",
      signatureDocUrl: "Guardian-Signature.png",
      aiMatchScore: 96,
      aiMatchStatus: "Signature Match",
      status: "forwarded_head",
      submittedAt: "2026-09-24 10:30 AM",
      adminNotes: "Verified student profile and guardian NID against institute registry. Forwarded to Head for executive sign-off.",
    },
    {
      id: "APP-8812",
      studentName: "Ruhan Dash Dibya",
      studentId: "DCC-CSE-24-1024",
      feeId: "fee-5",
      feeTitle: "Advanced Computing Lab & Tech Charge",
      originalAmount: 10000,
      requestedAmount: 5000,
      approvedAmount: 5000,
      remainingAmount: 5000,
      newDeadline: "2026-11-15",
      reason: "Requesting split installment due to current semester project expenditures.",
      statement: "I promise to clear the remaining balance before final term examinations.",
      guardianName: "Manash Dash",
      guardianPhone: "+880 1819-223344",
      guardianIdDocUrl: "NID-884920194.pdf",
      guardianSignatureDocUrl: "Guardian-Sig-M.png",
      studentSignatureDocUrl: "Student-Sig-R.png",
      signatureDocUrl: "Guardian-Sig-M.png",
      aiMatchScore: 98,
      aiMatchStatus: "Signature Match",
      status: "approved_head",
      submittedAt: "2026-09-18 02:15 PM",
      adminNotes: "Academic standing excellent (CGPA 3.92). Forwarded with recommendation.",
      headNotes: "Approved 50% initial installment plan. Balance due Nov 15, 2026.",
    },
    {
      id: "APP-7741",
      studentName: "Nusrat Jahan",
      studentId: "DCC-2024-8844",
      feeId: "fee-6",
      feeTitle: "Hostel & Hall Utility Charge",
      originalAmount: 4500,
      requestedAmount: 2000,
      reason: "Delay in stipend disbursement from national scholarship fund.",
      statement: "Scholarship proof attached.",
      guardianName: "Jahanara Begum",
      guardianPhone: "+880 1912-887766",
      guardianIdDocUrl: "NID-192840192.pdf",
      guardianSignatureDocUrl: "Guardian-Sig-J.png",
      studentSignatureDocUrl: "Student-Sig-N.png",
      signatureDocUrl: "Guardian-Sig-J.png",
      aiMatchScore: 78,
      aiMatchStatus: "Needs Review",
      status: "pending_admin",
      submittedAt: "2026-09-25 11:00 AM",
    },
  ],
  donations: {
    totalDonated: 1200,
    points: 12, // ৳1,200 / 100 = 12 Points
    rankClass: 4,
    rankDept: 4,
    rankInstitution: 18,
    rankNational: 126,
  },
  transactions: [
    {
      id: "TXN-88410",
      title: "Library & Digital Resources Dues",
      date: "2026-09-01 02:15 PM",
      amount: 1000,
      type: "fee",
      status: "Success",
      method: "bKash Mobile Banking",
      referenceId: "BK-904821",
      receiptNumber: "REC-982104",
      feeId: "fee-4",
    },
    {
      id: "TXN-88405",
      title: "Wallet Top-Up via bKash",
      date: "2026-09-05 09:30 AM",
      amount: 5000,
      type: "wallet",
      status: "Success",
      method: "bKash Mobile Banking",
      referenceId: "BK-772019",
      receiptNumber: "REC-982103",
    },
    {
      id: "TXN-88392",
      title: "Student Welfare & Social Impact Donation",
      date: "2026-09-10 11:45 AM",
      amount: 500,
      type: "donation",
      status: "Success",
      method: "City Bank Visa Debit",
      referenceId: "VS-110294",
      receiptNumber: "REC-982102",
    },
    {
      id: "TXN-88380",
      title: "Duplicate Examination Fee Charge Refund",
      date: "2026-09-15 03:20 PM",
      amount: 1500,
      type: "refund",
      status: "Refunded",
      method: "Neo Digital Wallet",
      referenceId: "RF-401928",
      receiptNumber: "REC-982101",
    },
    {
      id: "TXN-88375",
      title: "Midterm Registration Fee Payment",
      date: "2026-09-22 04:00 PM",
      amount: 3000,
      type: "fee",
      status: "Pending",
      method: "Dutch-Bangla Rocket",
      referenceId: "RK-334910",
      receiptNumber: "REC-982100",
    },
    {
      id: "TXN-88360",
      title: "Campus Transport Pass Top-Up",
      date: "2026-09-24 08:15 AM",
      amount: 2000,
      type: "wallet",
      status: "Failed",
      method: "Mastercard Credit",
      referenceId: "MC-881029",
      receiptNumber: "REC-982099",
    },
    {
      id: "TXN-88350",
      title: "Hostel Utility Excess Adjustment",
      date: "2026-09-25 01:10 PM",
      amount: 800,
      type: "refund",
      status: "Refunded",
      method: "bKash Mobile Banking",
      referenceId: "RF-882910",
      receiptNumber: "REC-982098",
    },
  ],

  importLogs: [
    { id: "imp-1", fileName: "fall_2026_cse_enrollment.xlsx", adminName: "Refat Rahman (Admin)", timestamp: "2026-09-24 11:30 AM", importedCount: 42, rejectedCount: 2, warningCount: 5, status: "Partial Success" },
    { id: "imp-2", fileName: "eee_sec_a_freshers.csv", adminName: "Refat Rahman (Admin)", timestamp: "2026-09-20 02:15 PM", importedCount: 30, rejectedCount: 0, warningCount: 1, status: "Completed" },
  ],
  academicStructure: {
    departments: [
      { id: "dept-1", code: "CSE", name: "Computer Science & Engineering", headName: "Prof. Dr. A. K. Azad", totalStudents: 4 },
      { id: "dept-2", code: "EEE", name: "Electrical & Electronic Engineering", headName: "Dr. Syeda Nasrin", totalStudents: 1 },
      { id: "dept-3", code: "BBA", name: "Business Administration", headName: "Prof. M. Rahman", totalStudents: 1 },
      { id: "dept-4", code: "Civil", name: "Civil Engineering", headName: "Engr. Faisal Ahmed", totalStudents: 1 },
    ],
    classes: [
      { id: "cls-1", name: "CSE 1st Year", department: "CSE", year: "1st Year", semester: "1st Sem", totalSections: 2, totalStudents: 2 },
      { id: "cls-2", name: "CSE 2nd Year", department: "CSE", year: "2nd Year", semester: "3rd Sem", totalSections: 2, totalStudents: 2 },
      { id: "cls-3", name: "CSE 3rd Year", department: "CSE", year: "3rd Year", semester: "5th Sem", totalSections: 1, totalStudents: 1 },
      { id: "cls-4", name: "EEE 1st Year", department: "EEE", year: "1st Year", semester: "1st Sem", totalSections: 1, totalStudents: 1 },
      { id: "cls-5", name: "BBA 1st Year", department: "BBA", year: "1st Year", semester: "1st Sem", totalSections: 1, totalStudents: 1 },
    ],
    sections: [
      { id: "sec-1", name: "Sec A", department: "CSE", classYear: "1st Year", capacity: 50, currentCount: 2 },
      { id: "sec-2", name: "Sec B", department: "CSE", classYear: "1st Year", capacity: 50, currentCount: 1 },
      { id: "sec-3", name: "Sec A", department: "CSE", classYear: "2nd Year", capacity: 45, currentCount: 1 },
      { id: "sec-4", name: "Sec A", department: "EEE", classYear: "1st Year", capacity: 50, currentCount: 1 },
    ],
  },
  reminderRules: {
    weeklyReminderEnabled: true,
    nearDeadlineDays: 5,
    finalDayAlertEnabled: true,
    overduePenaltyNotice: true,
  },
  notifications: [
    {
      id: "notif-email-1",
      title: "Security Email Alert: New Login Detected",
      message: "New Neo Cash AI login detected from Chrome on Windows (Dhaka, BD).",
      date: "Just now",
      type: "info",
      read: false,
      category: "email",
      emailAlert: true,
    },
    {
      id: "notif-pay-1",
      title: "Payment Successful",
      message: "Semester Tuition Fee (৳20,000) cleared via bKash Mobile Banking. Receipt #REC-982104 generated.",
      date: "10 mins ago",
      type: "success",
      read: false,
      category: "payment",
    },
    {
      id: "notif-fee-1",
      title: "Weekly Fee Reminder",
      message: "Semester Tuition Fee (৳20,000) assigned by Dhaka City College is due on September 30, 2026.",
      date: "2 hours ago",
      type: "warning",
      read: false,
      category: "fee",
    },
    {
      id: "notif-fee-2",
      title: "Near-Deadline Alert",
      message: "Library & Digital Resources Fee (৳1,500) due in 3 days (October 05, 2026).",
      date: "5 hours ago",
      type: "warning",
      read: false,
      category: "fee",
    },
    {
      id: "notif-app-1",
      title: "Partial Payment Approved",
      message: "Application APP-9042 approved by Executive Director! 50% split unlocked.",
      date: "1 day ago",
      type: "success",
      read: true,
      category: "application",
    },
    {
      id: "notif-app-2",
      title: "Application Action Required",
      message: "Admin requested changes on application APP-7741. Please check feedback notes.",
      date: "2 days ago",
      type: "error",
      read: true,
      category: "application",
    },
    {
      id: "notif-inst-1",
      title: "Institution Notice: Examination Clearance",
      message: "Financial clearance deadline for Fall Midterm examinations set for October 20.",
      date: "3 days ago",
      type: "info",
      read: true,
      category: "institution",
    },
    {
      id: "notif-admin-1",
      title: "Support Thread Response",
      message: "Admin (Refat Rahman) replied to your support escalation ticket #ESC-9082.",
      date: "4 days ago",
      type: "info",
      read: true,
      category: "institution",
    },
  ],
    escalations: [
    {
      id: "ESC-9082",
      studentName: "Shelly Paul",
      studentId: "DCC-CSE-24-8842",
      institution: "Dhaka City College",
      department: "Computer Science & Engineering",
      subject: "Partial payment installment deadline inquiry",
      status: "open",
      createdAt: "2026-09-25 04:30 PM",
      lastReplyAt: "2026-09-25 04:30 PM",
      messages: [
        {
          id: "m-1",
          sender: "student",
          senderName: "Shelly Paul",
          text: "I applied for partial payment (APP-9042). Can Admin confirm if my second installment deadline can be set to Nov 30?",
          timestamp: "2026-09-25 04:30 PM",
        },
        {
          id: "m-2",
          sender: "ai",
          senderName: "Neo AI Assistant",
          text: "I have registered your inquiry and escalated this to Dhaka City College Admin Controllers. An admin representative will reply shortly.",
          timestamp: "2026-09-25 04:31 PM",
        },
      ],
    },
  ],
  auditLogs: [
    {
      id: "log-107",
      actor: "Executive Head (Dr. Anisur Rahman)",
      role: "Head",
      action: "Approved Partial Application",
      actionType: "head_approval",
      details: "Granted final executive authorization for ৳2,500 installment application",
      timestamp: "2026-09-26 05:45 PM",
      studentName: "Shelly Paul",
      studentId: "DCC-2024-9042",
      financialRecordTitle: "Semester Tuition Fee (Spring 2026)",
      beforeValue: "Status: Awaiting Head Approval (forwarded_head)",
      afterValue: "Status: Approved by Head (approved_head) • New Due: ৳2,500",
      hash: "SHA256: 8f92a10b42c98401e712a104",
    },
    {
      id: "log-106",
      actor: "Admin (Refat Rahman)",
      role: "Admin",
      action: "Forwarded Application to Head",
      actionType: "forward_head",
      details: "Application APP-9042 for Shelly Paul reviewed and forwarded to Head",
      timestamp: "2026-09-26 04:12 PM",
      studentName: "Shelly Paul",
      studentId: "DCC-2024-9042",
      financialRecordTitle: "Application APP-9042",
      beforeValue: "Status: Pending Admin Review (pending_admin)",
      afterValue: "Status: Forwarded to Executive Head (forwarded_head)",
      hash: "SHA256: 3c91e20d8841a029c7811d02",
    },
    {
      id: "log-105",
      actor: "Admin (Refat Rahman)",
      role: "Admin",
      action: "Reviewed Partial Application",
      actionType: "app_review",
      details: "Verified student profile, payment history, guardian NID & AI signature comparison (96.4% match)",
      timestamp: "2026-09-26 03:50 PM",
      studentName: "Shelly Paul",
      studentId: "DCC-2024-9042",
      financialRecordTitle: "Application APP-9042",
      beforeValue: "Status: Submitted (pending_admin)",
      afterValue: "Status: Verified & Signature Confirmed (96.4% Match)",
      hash: "SHA256: 7d10b991a02c4819e0129a01",
    },
    {
      id: "log-104",
      actor: "Admin (Refat Rahman)",
      role: "Admin",
      action: "Changed Student Section",
      actionType: "section_change",
      details: "Reassigned student section allocation based on capacity adjustment",
      timestamp: "2026-09-26 02:15 PM",
      studentName: "Ruhan Dash Dibya",
      studentId: "DCC-CSE-24-1024",
      financialRecordTitle: "Academic Placement Record",
      beforeValue: "Section: Sec A (CSE 1st Year)",
      afterValue: "Section: Sec B (CSE 1st Year)",
      hash: "SHA256: 1a89c00e12f4981a8123c909",
    },
    {
      id: "log-103",
      actor: "Admin (Refat Rahman)",
      role: "Admin",
      action: "Changed Payment Deadline",
      actionType: "deadline_change",
      details: "Extended payment deadline for Semester Tuition Fee for Ruhan Dash Dibya",
      timestamp: "2026-09-26 11:30 AM",
      studentName: "Ruhan Dash Dibya",
      studentId: "DCC-CSE-24-1024",
      financialRecordTitle: "Semester Tuition Fee (Fall 2026)",
      beforeValue: "Deadline: September 15, 2026",
      afterValue: "Deadline: September 30, 2026",
      hash: "SHA256: 9e02c118b77412e09124a817",
    },
    {
      id: "log-102",
      actor: "Admin (Refat Rahman)",
      role: "Admin",
      action: "Assigned Bulk Fee",
      actionType: "fee_assignment",
      details: "Assigned Semester Tuition Fee (৳6,500) to 42 students in CSE 1st Year (Sec A)",
      timestamp: "2026-09-26 09:15 AM",
      studentName: "Target Cohort (42 CSE Students)",
      studentId: "CSE-1ST-SEC-A",
      financialRecordTitle: "Semester Tuition Fee (Fall 2026)",
      beforeValue: "Unassigned / No Active Fee Obligation",
      afterValue: "৳6,500 Assigned (Deadline: 2026-09-30)",
      hash: "SHA256: 4b12a88190c128f91048123e",
    },
    {
      id: "log-101",
      actor: "Admin (Refat Rahman)",
      role: "Admin",
      action: "Imported Student Roster",
      actionType: "student_import",
      details: "Uploaded and validated batch file fall_2026_cse_freshers.csv via AI Data Processor",
      timestamp: "2026-09-25 04:12 PM",
      studentName: "Batch Import (42 Students)",
      studentId: "BATCH-2026-09",
      financialRecordTitle: "Institutional Directory Roster",
      beforeValue: "Directory Count: 2,078 Students",
      afterValue: "Directory Count: 2,120 Students (42 Imported, 2 Rejected)",
      hash: "SHA256: 6f78e901a238b901e81290a1",
    },
    {
      id: "log-100",
      actor: "Shelly Paul",
      role: "Student",
      action: "Submitted Partial Payment Request",
      actionType: "app_review",
      details: "Attached Guardian NID & Signature. AI Score: 96%",
      timestamp: "2026-09-24 10:30 AM",
      studentName: "Shelly Paul",
      studentId: "DCC-2024-9042",
      financialRecordTitle: "Application APP-9042",
      beforeValue: "No Active Hardship Application",
      afterValue: "Submitted ৳2,500 Installment Request (AI Match 96%)",
      hash: "SHA256: 2a91b8821901c82e7182910a",
    },
  ],
  students: [
    {
      id: "st-1",
      name: "Ruhan Dash Dibya",
      studentId: "DCC-CSE-24-1024",
      department: "CSE",
      classYear: "1st Year",
      section: "Sec A",
      semester: "2nd Sem",
      classSection: "CSE 1st Year (Sec A)",
      session: "2024-2025",
      email: "student@neocash.ai",
      phone: "+880 1712-345678",
      status: "Pending Dues",
      feeStatus: "Pending",
      walletBalance: 6500,
      totalDues: 8500,
      verified: true,
      lastActivity: "10 mins ago",
    },
    {
      id: "st-2",
      name: "Shelly Paul",
      studentId: "DCC-2024-8842",
      department: "CSE",
      classYear: "3rd Semester",
      section: "Sec A",
      semester: "3rd Sem",
      classSection: "CSE 3rd Sem (Sec A)",
      session: "2024-2025",
      email: "sp2khb@gmail.com",
      phone: "+880 1712-345678",
      status: "Pending Dues",
      feeStatus: "Partial Approved",
      walletBalance: 2400,
      totalDues: 3500,
      verified: true,
      lastActivity: "2 hours ago",
    },
    {
      id: "st-3",
      name: "Tanzim Hasan",
      studentId: "DCC-2024-8843",
      department: "CSE",
      classYear: "3rd Semester",
      section: "Sec A",
      semester: "3rd Sem",
      classSection: "CSE 3rd Sem (Sec A)",
      session: "2024-2025",
      email: "tanzim.h@dcc.edu.bd",
      phone: "+880 1819-112233",
      status: "Active",
      feeStatus: "Paid",
      walletBalance: 12500,
      totalDues: 0,
      verified: true,
      lastActivity: "1 day ago",
    },
    {
      id: "st-4",
      name: "Nusrat Jahan",
      studentId: "DCC-2024-8844",
      department: "BBA",
      classYear: "2nd Year",
      section: "Sec B",
      semester: "1st Sem",
      classSection: "Inter 2nd Year (Sec B)",
      session: "2024-2025",
      email: "nusrat.j@dcc.edu.bd",
      phone: "+880 1912-887766",
      status: "Overdue",
      feeStatus: "Overdue",
      walletBalance: 500,
      totalDues: 6000,
      verified: true,
      lastActivity: "3 days ago",
    },
    {
      id: "st-5",
      name: "Farhan Ahmed",
      studentId: "DCC-2024-8845",
      department: "EEE",
      classYear: "1st Semester",
      section: "Sec A",
      semester: "1st Sem",
      classSection: "EEE 1st Sem (Sec A)",
      session: "2025-2026",
      email: "farhan.a@dcc.edu.bd",
      phone: "+880 1611-445566",
      status: "Active",
      feeStatus: "Paid",
      walletBalance: 8200,
      totalDues: 0,
      verified: true,
      lastActivity: "4 days ago",
    },
    {
      id: "st-6",
      name: "Tanvir Rahman",
      studentId: "DCC-CSE-24-9001",
      department: "CSE",
      classYear: "3rd Semester",
      section: "Sec A",
      semester: "3rd Sem",
      classSection: "CSE 3rd Sem (Sec A)",
      session: "2024-2025",
      email: "tanvir.r@dcc.edu.bd",
      phone: "+880 1711-223344",
      status: "Active",
      feeStatus: "Paid",
      walletBalance: 15400,
      totalDues: 0,
      verified: true,
      lastActivity: "5 hours ago",
    },
    {
      id: "st-7",
      name: "Anika Tabassum",
      studentId: "DCC-BBA-24-9002",
      department: "BBA",
      classYear: "2nd Year",
      section: "Sec B",
      semester: "2nd Sem",
      classSection: "BBA 2nd Sem (Sec B)",
      session: "2024-2025",
      email: "anika.t@dcc.edu.bd",
      phone: "+880 1812-998877",
      status: "Active",
      feeStatus: "Paid",
      walletBalance: 9800,
      totalDues: 0,
      verified: true,
      lastActivity: "1 day ago",
    },
  ],
};

let listeners: Array<() => void> = [];
let currentState: NeoState = { ...INITIAL_STATE };

// Try loading saved state from localStorage if available
if (typeof window !== "undefined") {
  try {
    const saved = localStorage.getItem("neo_cash_state_v1");
    if (saved) {
      currentState = { ...INITIAL_STATE, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.warn("Failed to load local Neo state:", e);
  }
}

function saveState() {
  if (typeof window !== "undefined") {
    try {
      localStorage.setItem("neo_cash_state_v1", JSON.stringify(currentState));
    } catch (e) {
      console.warn("Failed to save Neo state:", e);
    }
  }
  listeners.forEach((listener) => listener());
}

export function useNeoStore(): [NeoState, typeof storeActions] {
  const [state, setState] = useState<NeoState>(currentState);

  useEffect(() => {
    const listener = () => setState({ ...currentState });
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  return [state, storeActions];
}

export interface DemoStudentProfile {
  id: string;
  name: string;
  studentId: string;
  institution: string;
  department: string;
  classSection: string;
  session: string;
  email: string;
  phone: string;
  avatar: string;
  balances: {
    availableBalance: number;
    walletBalance: number;
    totalDue: number;
    paidThisMonth: number;
    pendingAmount: number;
  };
  donations: {
    totalDonated: number;
    points: number;
    rankClass: number;
    rankDept: number;
    rankInstitution: number;
    rankNational: number;
  };
  fees?: Fee[];
  transactions?: Transaction[];
  notifications?: NotificationItem[];
  partialApplication?: PartialApplication;
}

export interface DemoAdminProfile {
  id: string;
  name: string;
  email: string;
  roleTitle: string;
  avatar: string;
}

export const DEMO_ADMINS_LIST: DemoAdminProfile[] = [
  {
    id: "admin-1",
    name: "Refat Rahman",
    email: "refat.admin@dcc.edu.bd",
    roleTitle: "Senior Financial Controller",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Refat",
  },
  {
    id: "admin-2",
    name: "Dr. Syeda Nasrin",
    email: "syeda.nasrin@dcc.edu.bd",
    roleTitle: "Student Welfare & Audit Officer",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nasrin",
  },
];

export interface DemoHeadProfile {
  id: string;
  name: string;
  email: string;
  title: string;
  institution: string;
  avatar: string;
}

export const DEMO_HEAD_PROFILE: DemoHeadProfile = {
  id: "head-1",
  name: "Prof. Dr. M. A. Karim",
  email: "director@dcc.edu.bd",
  title: "Director & Final Institutional Approval Authority",
  institution: "Dhaka City College",
  avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=DirectorKarim",
};

export const DEMO_STUDENTS_LIST: DemoStudentProfile[] = [
  {
    id: "st-1",
    name: "Ruhan Dash Dibya",
    studentId: "DCC-CSE-24-1024",
    institution: "Dhaka City College",
    department: "Computer Science & Engineering",
    classSection: "1st Year / 2nd Semester",
    session: "2024–2025",
    email: "student@neocash.ai",
    phone: "+880 1712-345678",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ruhan",
    balances: { availableBalance: 24580, walletBalance: 6500, totalDue: 8500, paidThisMonth: 12000, pendingAmount: 2000 },
    donations: { totalDonated: 1200, points: 12, rankClass: 4, rankDept: 4, rankInstitution: 18, rankNational: 126 },
    fees: [
      { id: "fee-r1", title: "Semester Tuition Fee (Fall 2026)", amount: 6500, originalAmount: 20000, dueDate: "2026-09-30", status: "due", category: "Tuition", description: "Standard tuition dues for Fall 2026 term." },
      { id: "fee-r2", title: "Computer Lab & Tech Resources Fee", amount: 2000, originalAmount: 2000, dueDate: "2026-10-05", status: "due", category: "Lab & Tech", description: "Access to high-performance AI lab servers." },
    ],
    transactions: [
      { id: "TXN-88401", title: "Semester Tuition Partial Installment", date: "2026-09-26 10:15 AM", amount: 12000, type: "fee_payment", status: "Success", method: "bKash Mobile Banking", referenceId: "BK-991042", receiptNumber: "REC-982104" },
      { id: "TXN-88390", title: "Neo Wallet Top-Up", date: "2026-09-24 02:45 PM", amount: 6500, type: "wallet", status: "Success", method: "City Bank Visa Debit", referenceId: "CB-441029", receiptNumber: "REC-982101" },
    ],
    notifications: [
      { id: "n-r1", title: "Security Alert: Login Detected", message: "New Neo Cash AI session started from Dhaka, BD.", date: "Just now", type: "info", read: false },
      { id: "n-r2", title: "Tuition Fee Due Soon", message: "Semester Tuition Fee (৳6,500) due on September 30.", date: "2 hours ago", type: "warning", read: false, category: "fee" },
    ],
  },
  {
    id: "st-2",
    name: "Shelly Paul",
    studentId: "DCC-CSE-24-8842",
    institution: "Dhaka City College",
    department: "Computer Science & Engineering",
    classSection: "2nd Year / 3rd Semester",
    session: "2024–2025",
    email: "sp2khb@gmail.com",
    phone: "+880 1712-998877",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Shelly",
    balances: { availableBalance: 14500, walletBalance: 4250, totalDue: 3500, paidThisMonth: 5000, pendingAmount: 2500 },
    donations: { totalDonated: 500, points: 5, rankClass: 3, rankDept: 7, rankInstitution: 14, rankNational: 42 },
    fees: [
      { id: "fee-s1", title: "Semester Tuition Fee (Spring 2026)", amount: 2500, originalAmount: 5000, dueDate: "2026-11-15", status: "partial_approved", partialAllowed: true, approvedPartialAmount: 2500, category: "Tuition", description: "Head approved 50% split. Installment 1 unlocked." },
    ],
    partialApplication: {
      id: "APP-9042",
      studentName: "Shelly Paul",
      studentId: "DCC-CSE-24-8842",
      feeId: "fee-s1",
      feeTitle: "Semester Tuition Fee (Spring 2026)",
      originalAmount: 5000,
      requestedAmount: 2500,
      approvedAmount: 2500,
      remainingAmount: 2500,
      newDeadline: "2026-11-15",
      reason: "Family medical emergency causing short-term liquidity constraint.",
      guardianName: "Robert Paul",
      guardianPhone: "+880 1711-889900",
      guardianIdDocUrl: "https://via.placeholder.com/600x380?text=Guardian+NID+Card",
      signatureDocUrl: "https://via.placeholder.com/400x160?text=Guardian+Signature",
      studentSignatureDocUrl: "https://via.placeholder.com/400x160?text=Student+Signature",
      aiMatchScore: 96,
      aiMatchStatus: "Signature Match",
      status: "approved_head",
      submittedAt: "2026-09-25 10:30 AM",
      adminNotes: "Profile & NID verified. 96% AI signature match score.",
      headNotes: "Executive sign-off granted. Installment 1 unlocked.",
    },
    transactions: [
      { id: "TXN-S901", title: "Partial Payment Authorization", date: "2026-09-26 04:30 PM", amount: 2500, type: "fee_payment", status: "Success", method: "bKash Mobile Wallet", referenceId: "APP-9042-AUTH", receiptNumber: "REC-S9042" },
    ],
    notifications: [
      { id: "n-s1", title: "Partial Payment Approved by Head!", message: "Head authorized your 50% split for APP-9042. Pay Installment 1 of ৳2,500 now.", date: "1 hour ago", type: "success", read: false, category: "application" },
    ],
  },
  {
    id: "st-3",
    name: "Tanzim Hasan",
    studentId: "DU-EEE-23-4012",
    institution: "University of Dhaka",
    department: "Electrical & Electronic Engineering",
    classSection: "3rd Year / 5th Semester",
    session: "2023–2024",
    email: "tanzim.h@du.ac.bd",
    phone: "+880 1819-112233",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Tanzim",
    balances: { availableBalance: 38200, walletBalance: 12000, totalDue: 0, paidThisMonth: 18500, pendingAmount: 0 },
    donations: { totalDonated: 2500, points: 25, rankClass: 1, rankDept: 1, rankInstitution: 5, rankNational: 12 },
    fees: [
      { id: "fee-t1", title: "Annual Academic & Lab Fee", amount: 18500, originalAmount: 18500, dueDate: "2026-09-20", paidDate: "2026-09-18", status: "paid", category: "Tuition", description: "Full academic dues cleared." },
    ],
    transactions: [
      { id: "TXN-T101", title: "Full Academic Dues Payment", date: "2026-09-18 11:20 AM", amount: 18500, type: "fee_payment", status: "Success", method: "City Bank Visa Debit", referenceId: "CB-99201", receiptNumber: "REC-T9901" },
      { id: "TXN-T102", title: "Welfare Fund Contribution", date: "2026-09-20 03:15 PM", amount: 2500, type: "donation", status: "Success", method: "bKash Mobile Wallet", referenceId: "DON-T2500", receiptNumber: "REC-DON-102" },
    ],
    notifications: [
      { id: "n-t1", title: "Full Financial Clearance Verified", message: "All academic dues are 100% paid. Examination admit card ready.", date: "3 days ago", type: "success", read: true, category: "payment" },
    ],
  },
  {
    id: "st-4",
    name: "Nusrat Jahan",
    studentId: "DC-BBA-24-9011",
    institution: "Dhaka College",
    department: "Business Administration",
    classSection: "1st Year / 1st Semester",
    session: "2024–2025",
    email: "nusrat.j@dc.edu.bd",
    phone: "+880 1912-887766",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nusrat",
    balances: { availableBalance: 12000, walletBalance: 3500, totalDue: 6000, paidThisMonth: 4000, pendingAmount: 1500 },
    donations: { totalDonated: 300, points: 3, rankClass: 12, rankDept: 12, rankInstitution: 45, rankNational: 310 },
    fees: [
      { id: "fee-n1", title: "Admission & Departmental Fee", amount: 6000, originalAmount: 6000, dueDate: "2026-09-10", status: "overdue", category: "Tuition", description: "Overdue since Sept 10." },
    ],
    partialApplication: {
      id: "APP-7741",
      studentName: "Nusrat Jahan",
      studentId: "DC-BBA-24-9011",
      feeId: "fee-n1",
      feeTitle: "Admission & Departmental Fee",
      originalAmount: 6000,
      requestedAmount: 3000,
      reason: "Small family business liquidity delay.",
      guardianName: "Kamrul Islam",
      guardianPhone: "+880 1911-001122",
      guardianIdDocUrl: "https://via.placeholder.com/600x380?text=Guardian+NID",
      signatureDocUrl: "https://via.placeholder.com/400x160?text=Blurry+Signature",
      aiMatchScore: 84,
      aiMatchStatus: "Needs Review",
      status: "changes_requested",
      submittedAt: "2026-09-22 09:00 AM",
      changeRequestNotes: "Please re-upload a clearer scan of guardian signature.",
    },
    transactions: [
      { id: "TXN-N401", title: "Partial Payment Submission Fee", date: "2026-09-22 09:05 AM", amount: 0, type: "fee_payment", status: "Pending", method: "bKash Mobile Wallet", referenceId: "APP-7741-SUB", receiptNumber: "REC-N7741" },
    ],
    notifications: [
      { id: "n-n1", title: "Emergency Overdue Alert", message: "Admission & Departmental Fee (৳6,000) is overdue!", date: "Yesterday", type: "error", read: false, category: "fee" },
      { id: "n-n2", title: "Action Required: Application Feedback", message: "Admin requested changes on APP-7741: 'Please re-upload clearer signature.'", date: "2 days ago", type: "warning", read: false, category: "application" },
    ],
  },
  {
    id: "st-5",
    name: "Farhan Ahmed",
    studentId: "SUST-SWE-22-1104",
    institution: "Shahjalal Univ of Sci & Tech",
    department: "Software Engineering",
    classSection: "4th Year / 7th Semester",
    session: "2022–2023",
    email: "farhan.a@sust.edu",
    phone: "+880 1611-445566",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Farhan",
    balances: { availableBalance: 45000, walletBalance: 15000, totalDue: 3500, paidThisMonth: 9000, pendingAmount: 0 },
    donations: { totalDonated: 1800, points: 18, rankClass: 2, rankDept: 2, rankInstitution: 10, rankNational: 64 },
    fees: [
      { id: "fee-f1", title: "Final Year Thesis Defense Fee", amount: 3500, originalAmount: 3500, dueDate: "2026-10-15", status: "pending_partial", category: "Exam", description: "Pending Head review for 50% split." },
    ],
    partialApplication: {
      id: "APP-5510",
      studentName: "Farhan Ahmed",
      studentId: "SUST-SWE-22-1104",
      feeId: "fee-f1",
      feeTitle: "Final Year Thesis Defense Fee",
      originalAmount: 3500,
      requestedAmount: 1750,
      reason: "Research GPU hardware expenses.",
      guardianName: "Nazmul Ahmed",
      guardianPhone: "+880 1611-998877",
      guardianIdDocUrl: "https://via.placeholder.com/600x380?text=Guardian+NID",
      signatureDocUrl: "https://via.placeholder.com/400x160?text=Guardian+Signature",
      aiMatchScore: 98,
      aiMatchStatus: "Signature Match",
      status: "forwarded_head",
      submittedAt: "2026-09-24 02:00 PM",
      adminNotes: "GPA 3.95 high standing. Verified and forwarded to Head.",
    },
    transactions: [
      { id: "TXN-F501", title: "Neo Wallet Balance Top-Up", date: "2026-09-24 01:45 PM", amount: 15000, type: "wallet", status: "Success", method: "bKash Mobile Wallet", referenceId: "BK-551029", receiptNumber: "REC-F5510" },
    ],
    notifications: [
      { id: "n-f1", title: "Application Forwarded to Head", message: "Admin forwarded your partial request APP-5510 to Executive Head.", date: "1 day ago", type: "info", read: false, category: "application" },
    ],
  },
  {
    id: "st-6",
    name: "Anika Tabassum",
    studentId: "BUET-ME-23-7721",
    institution: "BUET",
    department: "Mechanical Engineering",
    classSection: "2nd Year / 4th Semester",
    session: "2023–2024",
    email: "anika.t@buet.ac.bd",
    phone: "+880 1512-334455",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anika",
    balances: { availableBalance: 29400, walletBalance: 8200, totalDue: 1500, paidThisMonth: 15000, pendingAmount: 0 },
    donations: { totalDonated: 1500, points: 15, rankClass: 5, rankDept: 5, rankInstitution: 22, rankNational: 98 },
    fees: [
      { id: "fee-a1", title: "Digital Library & Journal License Fee", amount: 1500, originalAmount: 1500, dueDate: "2026-10-10", status: "due", category: "Library", description: "Access to IEEE & ScienceDirect journals." },
    ],
    transactions: [
      { id: "TXN-A601", title: "Semester Tuition Payment", date: "2026-09-15 10:00 AM", amount: 15000, type: "fee_payment", status: "Success", method: "Nagad Mobile Wallet", referenceId: "NG-772109", receiptNumber: "REC-A7721" },
      { id: "TXN-A602", title: "Welfare Contribution", date: "2026-09-20 04:00 PM", amount: 1500, type: "donation", status: "Success", method: "bKash Mobile Wallet", referenceId: "DON-A1500", receiptNumber: "REC-DON-A602" },
    ],
    notifications: [
      { id: "n-a1", title: "Upcoming Library Fee Due", message: "Digital Library Fee (৳1,500) due on October 10.", date: "4 days ago", type: "warning", read: true, category: "fee" },
    ],
  },
];

export const storeActions = {
  importStudentsValidated(payload: {
    students: Array<{
      name: string;
      studentId: string;
      roll?: string;
      department: string;
      classYear: string;
      section: string;
      semester: string;
      session?: string;
      email: string;
      phone?: string;
    }>;
    rejectedCount: number;
    warningCount: number;
    fileName: string;
  }) {
    let imported = 0;
    payload.students.forEach((item, index) => {
      const newStudent: StudentRecord = {
        id: "st-imp-" + Date.now() + "-" + index,
        name: item.name,
        studentId: item.studentId,
        department: item.department || "CSE",
        classYear: item.classYear || "1st Year",
        section: item.section || "Sec A",
        semester: item.semester || "1st Sem",
        classSection: `${item.department || "CSE"} ${item.classYear || "1st Year"} (${item.section || "Sec A"})`,
        session: item.session || "2024-2025",
        email: item.email || `${item.studentId.toLowerCase()}@dcc.edu.bd`,
        phone: item.phone || "+880 1700-000000",
        status: "Active",
        feeStatus: "Paid",
        walletBalance: 0,
        totalDues: 0,
        verified: true,
        lastActivity: "Just imported via CSV",
      };
      currentState.students.unshift(newStudent);
      imported++;
    });

    const newLog: ImportLogRecord = {
      id: "imp-log-" + Date.now(),
      fileName: payload.fileName || "students_batch_upload.csv",
      adminName: "Refat Rahman (Admin)",
      timestamp: new Date().toLocaleString(),
      importedCount: imported,
      rejectedCount: payload.rejectedCount,
      warningCount: payload.warningCount,
      status: payload.rejectedCount > 0 ? "Partial Success" : "Completed",
    };

    if (!currentState.importLogs) {
      currentState.importLogs = [];
    }
    currentState.importLogs.unshift(newLog);

    currentState.auditLogs.unshift({
      id: "log-" + Date.now(),
      actor: "Admin (Refat Rahman)",
      role: "Admin",
      action: "Executed Student Excel/CSV Import",
      details: `Imported ${imported} valid student records from ${payload.fileName}. Rejected: ${payload.rejectedCount}, Warnings: ${payload.warningCount}.`,
      timestamp: new Date().toLocaleString(),
    });

    saveState();
    return { ok: true, imported, log: newLog };
  },

  createDepartment(dept: { code: string; name: string; headName: string }) {
    const newDept: AcademicDepartment = {
      id: "dept-" + Date.now(),
      code: dept.code.toUpperCase(),
      name: dept.name,
      headName: dept.headName,
      totalStudents: 0,
    };
    if (!currentState.academicStructure) {
      currentState.academicStructure = { departments: [], classes: [], sections: [] };
    }
    currentState.academicStructure.departments.push(newDept);
    currentState.auditLogs.unshift({
      id: "log-" + Date.now(),
      actor: "Admin (Refat Rahman)",
      role: "Admin",
      action: "Created Department",
      details: `Created new department: ${dept.name} (${dept.code.toUpperCase()}), Head: ${dept.headName}.`,
      timestamp: new Date().toLocaleString(),
    });
    saveState();
    return { ok: true, department: newDept };
  },

  createClass(cls: { name: string; department: string; year: string; semester: string }) {
    const newClass: AcademicClass = {
      id: "cls-" + Date.now(),
      name: cls.name,
      department: cls.department,
      year: cls.year,
      semester: cls.semester,
      totalSections: 0,
      totalStudents: 0,
    };
    if (!currentState.academicStructure) {
      currentState.academicStructure = { departments: [], classes: [], sections: [] };
    }
    currentState.academicStructure.classes.push(newClass);
    currentState.auditLogs.unshift({
      id: "log-" + Date.now(),
      actor: "Admin (Refat Rahman)",
      role: "Admin",
      action: "Created Academic Class",
      details: `Created new class: ${cls.name} (${cls.department}, ${cls.year}, ${cls.semester}).`,
      timestamp: new Date().toLocaleString(),
    });
    saveState();
    return { ok: true, academicClass: newClass };
  },

  createSection(sec: { name: string; department: string; classYear: string; capacity: number }) {
    const newSec: AcademicSection = {
      id: "sec-" + Date.now(),
      name: sec.name,
      department: sec.department,
      classYear: sec.classYear,
      capacity: Number(sec.capacity) || 50,
      currentCount: 0,
    };
    if (!currentState.academicStructure) {
      currentState.academicStructure = { departments: [], classes: [], sections: [] };
    }
    currentState.academicStructure.sections.push(newSec);
    currentState.auditLogs.unshift({
      id: "log-" + Date.now(),
      actor: "Admin (Refat Rahman)",
      role: "Admin",
      action: "Created Academic Section",
      details: `Created new section ${sec.name} for ${sec.department} (${sec.classYear}) with capacity ${sec.capacity}.`,
      timestamp: new Date().toLocaleString(),
    });
    saveState();
    return { ok: true, section: newSec };
  },

  promoteCohort(payload: { sourceDept: string; sourceClassYear: string; sourceSemester: string; targetClassYear: string; targetSemester: string }) {
    let count = 0;
    currentState.students.forEach((s) => {
      const deptMatch = payload.sourceDept === "all" || s.department === payload.sourceDept;
      const classMatch = payload.sourceClassYear === "all" || s.classYear === payload.sourceClassYear;
      const semMatch = payload.sourceSemester === "all" || s.semester === payload.sourceSemester;

      if (deptMatch && classMatch && semMatch) {
        s.classYear = payload.targetClassYear;
        s.semester = payload.targetSemester;
        s.status = "Promoted";
        s.classSection = `${s.department} ${payload.targetClassYear} (${s.section})`;
        s.lastActivity = "Promoted by Admin";
        count++;
      }
    });

    currentState.auditLogs.unshift({
      id: "log-" + Date.now(),
      actor: "Admin (Refat Rahman)",
      role: "Admin",
      action: "Cohort Promotion Executed",
      details: `Promoted ${count} students from [${payload.sourceDept}, ${payload.sourceClassYear}, ${payload.sourceSemester}] -> [${payload.targetClassYear}, ${payload.targetSemester}]. Student identities, wallet balances, and transaction histories preserved.`,
      timestamp: new Date().toLocaleString(),
    });
    saveState();
    return { ok: true, count };
  },

  moveStudentSection(studentId: string, targetSection: string) {
    const student = currentState.students.find((s) => s.id === studentId || s.studentId === studentId);
    if (!student) return { ok: false, error: "Student record not found." };

    const oldSec = student.section;
    student.section = targetSection;
    student.classSection = `${student.department} ${student.classYear} (${targetSection})`;

    currentState.auditLogs.unshift({
      id: "log-" + Date.now(),
      actor: "Admin (Refat Rahman)",
      role: "Admin",
      action: "Moved Student Section",
      details: `Reassigned ${student.name} (${student.studentId}) section from ${oldSec} -> ${targetSection}.`,
      timestamp: new Date().toLocaleString(),
    });
    saveState();
    return { ok: true, student };
  },

  bulkAssignStudentsSection(studentIds: string[], targetSection: string) {
    let count = 0;
    studentIds.forEach((id) => {
      const student = currentState.students.find((s) => s.id === id || s.studentId === id);
      if (student) {
        student.section = targetSection;
        student.classSection = `${student.department} ${student.classYear} (${targetSection})`;
        count++;
      }
    });

    currentState.auditLogs.unshift({
      id: "log-" + Date.now(),
      actor: "Admin (Refat Rahman)",
      role: "Admin",
      action: "Bulk Section Reassignment",
      details: `Bulk reassigned ${count} students to section ${targetSection}.`,
      timestamp: new Date().toLocaleString(),
    });
    saveState();
    return { ok: true, count };
  },

  setRole(role: Role) {
    currentState.role = role;
    saveState();
  },

  switchDemoStudent(studentId: string) {
    const profile = DEMO_STUDENTS_LIST.find((s) => s.id === studentId || s.studentId === studentId);
    if (!profile) return;
    currentState.studentProfile = {
      name: profile.name,
      studentId: profile.studentId,
      institution: profile.institution,
      department: profile.department,
      classSection: profile.classSection,
      session: profile.session,
      email: profile.email,
      phone: profile.phone,
      avatar: profile.avatar,
      isVerified: true,
    };
    currentState.selectedInstitution = {
      name: profile.institution,
      type: "Academic Institution",
      location: "Bangladesh",
      logo: "🏛️",
      verified: true,
    };
    currentState.balances = { ...profile.balances };
    currentState.donations = { ...profile.donations };

    if (profile.fees) {
      currentState.fees = JSON.parse(JSON.stringify(profile.fees));
    }
    if (profile.transactions) {
      currentState.transactions = JSON.parse(JSON.stringify(profile.transactions));
    }
    if (profile.notifications) {
      currentState.notifications = JSON.parse(JSON.stringify(profile.notifications));
    }
    if (profile.partialApplication) {
      const existingIdx = currentState.partialApplications.findIndex((a) => a.studentId === profile.studentId);
      if (existingIdx >= 0) {
        currentState.partialApplications[existingIdx] = JSON.parse(JSON.stringify(profile.partialApplication));
      } else {
        currentState.partialApplications.unshift(JSON.parse(JSON.stringify(profile.partialApplication)));
      }
    }

    saveState();
  },

  setIsOnboarded(isOnboarded: boolean) {
    currentState.isOnboarded = isOnboarded;
    saveState();
  },

  setOnboardingStep(step: number) {
    currentState.onboardingStep = step;
    saveState();
  },

  setSelectedInstitution(inst: NeoState["selectedInstitution"]) {
    currentState.selectedInstitution = inst;
    currentState.studentProfile.institution = inst.name;
    saveState();
  },

  updateStudentProfile(dataOrStudentId: string | Partial<NeoState["studentProfile"]>, updates?: Partial<StudentRecord>) {
    if (typeof dataOrStudentId === "string") {
      const studentId = dataOrStudentId;
      const student = currentState.students.find((s) => s.id === studentId || s.studentId === studentId);
      if (!student) return { ok: false, error: "Student profile not found." };

      Object.assign(student, updates || {});
      if (updates?.department || updates?.classYear || updates?.section) {
        student.classSection = `${updates.department || student.department} ${updates.classYear || student.classYear} (${updates.section || student.section})`;
      }

      currentState.auditLogs.unshift({
        id: "log-" + Date.now(),
        actor: "Admin (Refat Rahman)",
        role: "Admin",
        action: "Updated Student Profile",
        details: `Updated administrative fields for ${student.name} (${student.studentId}): ${Object.keys(updates || {}).join(", ")}.`,
        timestamp: new Date().toLocaleString(),
      });

      saveState();
      return { ok: true, student };
    } else {
      currentState.studentProfile = { ...currentState.studentProfile, ...dataOrStudentId };
      saveState();
      return { ok: true };
    }
  },

  /** Process full or partial payment of a fee */
  payFee(feeId: string, method: string, customAmount?: number) {
    const feeIndex = currentState.fees.findIndex((f) => f.id === feeId);
    if (feeIndex === -1) return { ok: false, error: "Fee record not found." };

    const targetFee = currentState.fees[feeIndex];
    if (!targetFee) return { ok: false, error: "Fee record not found." };
    const payAmount = customAmount || targetFee.amount;

    if (currentState.balances.walletBalance < payAmount && method.includes("Wallet")) {
      return { ok: false, error: "Insufficient wallet balance." };
    }

    // Deduct balance
    if (method.includes("Wallet")) {
      currentState.balances.walletBalance -= payAmount;
    }
    currentState.balances.availableBalance -= payAmount;
    currentState.balances.totalDue = Math.max(0, currentState.balances.totalDue - payAmount);
    currentState.balances.paidThisMonth += payAmount;

    // Update fee status
    targetFee.status = "paid";
    targetFee.amount = 0;

    // Generate transaction record
    const refId = "REF-" + Math.floor(100000 + Math.random() * 900000);
    const receiptNo = "REC-" + Math.floor(100000 + Math.random() * 900000);
    const newTxn: Transaction = {
      id: "TXN-" + Math.floor(10000 + Math.random() * 90000),
      title: targetFee.title,
      date: new Date().toLocaleString("en-US", { dateStyle: "short", timeStyle: "short" }),
      amount: payAmount,
      type: "fee",
      status: "Success",
      method,
      referenceId: refId,
      receiptNumber: receiptNo,
      feeId,
    };
    currentState.transactions.unshift(newTxn);

    // Create Notification
    currentState.notifications.unshift({
      id: "notif-" + Date.now(),
      title: "Payment Successful",
      message: `Paid ৳${payAmount.toLocaleString()} for ${targetFee.title} via ${method}. Receipt #${receiptNo}.`,
      date: "Just now",
      type: "success",
      read: false,
    });

    // Add Audit Log
    currentState.auditLogs.unshift({
      id: "log-" + Date.now(),
      actor: currentState.studentProfile.name,
      role: "Student",
      action: "Fee Paid",
      details: `Paid ৳${payAmount.toLocaleString()} for ${targetFee.title}. Receipt #${receiptNo}.`,
      timestamp: new Date().toLocaleString(),
    });

    saveState();
    return { ok: true, transaction: newTxn };
  },

  /** Submit student application for partial payment */
  applyPartialPayment(data: {
    feeId: string;
    requestedAmount: number;
    reason: string;
    guardianName: string;
    guardianPhone: string;
    guardianIdDocUrl: string;
    signatureDocUrl: string;
  }) {
    const targetFee = currentState.fees.find((f) => f.id === data.feeId);
    if (!targetFee) return { ok: false, error: "Fee not found." };

    const appId = "APP-" + Math.floor(1000 + Math.random() * 9000);
    const newApp: PartialApplication = {
      id: appId,
      studentName: currentState.studentProfile.name,
      studentId: currentState.studentProfile.studentId,
      feeId: data.feeId,
      feeTitle: targetFee.title,
      originalAmount: targetFee.amount,
      requestedAmount: data.requestedAmount,
      reason: data.reason,
      guardianName: data.guardianName,
      guardianPhone: data.guardianPhone,
      guardianIdDocUrl: data.guardianIdDocUrl || "NID-Uploaded.pdf",
      signatureDocUrl: data.signatureDocUrl || "Signature-Doc.png",
      aiMatchScore: 96,
      aiMatchStatus: "Signature Match",
      status: "pending_admin",
      submittedAt: new Date().toLocaleString("en-US", { dateStyle: "short", timeStyle: "short" }),
    };

    currentState.partialApplications.unshift(newApp);
    targetFee.status = "pending_partial";

    currentState.notifications.unshift({
      id: "notif-" + Date.now(),
      title: "Partial Payment Submitted",
      message: `Your application ${appId} for ৳${data.requestedAmount.toLocaleString()} is under Admin review.`,
      date: "Just now",
      type: "info",
      read: false,
    });

    currentState.auditLogs.unshift({
      id: "log-" + Date.now(),
      actor: currentState.studentProfile.name,
      role: "Student",
      action: "Submitted Partial Payment Application",
      details: `App ${appId} for ${targetFee.title}. Requested: ৳${data.requestedAmount}. AI Similarity: 96%`,
      timestamp: new Date().toLocaleString(),
    });

    saveState();
    return { ok: true, application: newApp };
  },

  /** Admin forwards partial payment application to Head */
  adminForwardPartial(appId: string) {
    const app = currentState.partialApplications.find((a) => a.id === appId);
    if (!app) return;

    app.status = "forwarded_head";

    currentState.notifications.unshift({
      id: "notif-" + Date.now(),
      title: "Application Forwarded",
      message: `Admin reviewed and forwarded your application ${appId} to Head / Authority for final approval.`,
      date: "Just now",
      type: "info",
      read: false,
    });

    currentState.auditLogs.unshift({
      id: "log-" + Date.now(),
      actor: "Admin (Refat Rahman)",
      role: "Admin",
      action: "Forwarded Partial Application to Head",
      details: `App ${appId} for ${app.studentName}. Requested: ৳${app.requestedAmount}`,
      timestamp: new Date().toLocaleString(),
    });

    saveState();
  },

  /** Head approves partial payment application */
  headApprovePartial(
    appId: string,
    customApprovedAmount?: number,
    customNewDeadline?: string,
    headNotes?: string
  ) {
    const app = currentState.partialApplications.find((a) => a.id === appId);
    if (!app) return;

    const approvedAmount = customApprovedAmount || app.requestedAmount;
    const newDeadline = customNewDeadline || "2026-11-15";

    app.status = "approved_head";
    app.approvedAmount = approvedAmount;
    app.remainingAmount = app.originalAmount - approvedAmount;
    app.newDeadline = newDeadline;
    if (headNotes) app.headNotes = headNotes;

    const targetFee = currentState.fees.find((f) => f.id === app.feeId);
    if (targetFee) {
      targetFee.status = "partial_approved";
      targetFee.approvedPartialAmount = approvedAmount;
      targetFee.amount = approvedAmount;
    }

    currentState.notifications.unshift({
      id: "notif-" + Date.now(),
      title: "Partial Payment Approved!",
      message: `Head approved your application ${appId}! You can now pay Installment 1 of ৳${approvedAmount.toLocaleString()} (Remaining ৳${(app.originalAmount - approvedAmount).toLocaleString()} due on ${newDeadline}).`,
      date: "Just now",
      type: "success",
      read: false,
    });

    currentState.auditLogs.unshift({
      id: "log-" + Date.now(),
      actor: "Head / Director (Prof. Dr. M. A. Karim)",
      role: "Head",
      action: "Approved Partial Payment Application",
      details: `App ${appId} approved for ${app.studentName}. Approved: ৳${approvedAmount}, Remaining: ৳${app.originalAmount - approvedAmount}, Deadline: ${newDeadline}`,
      timestamp: new Date().toLocaleString(),
    });

    saveState();
  },

  /** Admin or Head requests changes from student */
  requestChangesPartial(appId: string, notes: string, requestedBy: "Admin" | "Head") {
    const app = currentState.partialApplications.find((a) => a.id === appId);
    if (!app) return;

    app.status = "changes_requested";
    app.changeRequestNotes = notes;

    const targetFee = currentState.fees.find((f) => f.id === app.feeId);
    if (targetFee) {
      targetFee.status = "pending_partial";
    }

    currentState.notifications.unshift({
      id: "notif-" + Date.now(),
      title: "Action Required: Application Feedback",
      message: `${requestedBy} requested changes on application ${appId}: "${notes}". Please update and resubmit.`,
      date: "Just now",
      type: "warning",
      read: false,
    });

    currentState.auditLogs.unshift({
      id: "log-" + Date.now(),
      actor: requestedBy === "Admin" ? "Admin (Refat Rahman)" : "Head / Director (Prof. Dr. M. A. Karim)",
      role: requestedBy,
      action: "Requested Application Changes",
      details: `App ${appId} for ${app.studentName}. Feedback: "${notes}"`,
      timestamp: new Date().toLocaleString(),
    });

    saveState();
  },

  /** Head or Admin rejects partial payment application */
  rejectPartial(appId: string, rejectionReason: string, rejectedBy: "Admin" | "Head") {
    const app = currentState.partialApplications.find((a) => a.id === appId);
    if (!app) return;

    app.status = rejectedBy === "Admin" ? "rejected_admin" : "rejected_head";
    app.rejectionReason = rejectionReason;

    const targetFee = currentState.fees.find((f) => f.id === app.feeId);
    if (targetFee) {
      targetFee.status = "due";
    }

    currentState.notifications.unshift({
      id: "notif-" + Date.now(),
      title: "Application Status Update",
      message: `Your partial payment request ${appId} was declined by ${rejectedBy}: "${rejectionReason}".`,
      date: "Just now",
      type: "warning",
      read: false,
    });

    currentState.auditLogs.unshift({
      id: "log-" + Date.now(),
      actor: rejectedBy === "Admin" ? "Admin (Refat Rahman)" : "Head / Director (Prof. Dr. M. A. Karim)",
      role: rejectedBy,
      action: "Rejected Partial Payment Application",
      details: `App ${appId} for ${app.studentName}. Reason: "${rejectionReason}"`,
      timestamp: new Date().toLocaleString(),
    });

    saveState();
  },

  /** Make a social impact / welfare donation (৳100 = 1 Point) */
  makeDonation(amount: number, method: string) {
    if (amount <= 0) return { ok: false, error: "Enter a valid donation amount." };

    if (method.includes("Wallet") && currentState.balances.walletBalance < amount) {
      return { ok: false, error: "Insufficient wallet balance." };
    }

    if (method.includes("Wallet")) {
      currentState.balances.walletBalance -= amount;
    }
    currentState.balances.availableBalance -= amount;

    // Point rule: ৳100 = 1 Point
    const earnedPoints = Math.floor(amount / 100);

    currentState.donations.totalDonated += amount;
    currentState.donations.points += earnedPoints;

    // Simulate rank improvements
    if (earnedPoints > 0) {
      currentState.donations.rankClass = Math.max(1, currentState.donations.rankClass - 1);
      currentState.donations.rankDept = Math.max(1, currentState.donations.rankDept - 1);
      currentState.donations.rankInstitution = Math.max(1, currentState.donations.rankInstitution - 2);
      currentState.donations.rankNational = Math.max(1, currentState.donations.rankNational - 5);
    }

    const refId = "DON-" + Math.floor(100000 + Math.random() * 900000);
    const receiptNo = "DON-REC-" + Math.floor(100000 + Math.random() * 900000);
    const newTxn: Transaction = {
      id: "TXN-" + Math.floor(10000 + Math.random() * 90000),
      title: "Student Welfare & Social Impact Donation",
      date: new Date().toLocaleString("en-US", { dateStyle: "short", timeStyle: "short" }),
      amount,
      type: "donation",
      status: "Success",
      method,
      referenceId: refId,
      receiptNumber: receiptNo,
    };

    currentState.transactions.unshift(newTxn);

    currentState.notifications.unshift({
      id: "notif-" + Date.now(),
      title: "Donation Successful!",
      message: `Donated ৳${amount.toLocaleString()} for student welfare! Earned ${earnedPoints} Donation Points. Rank in Class is now #${currentState.donations.rankClass}!`,
      date: "Just now",
      type: "success",
      read: false,
    });

    currentState.auditLogs.unshift({
      id: "log-" + Date.now(),
      actor: currentState.studentProfile.name,
      role: "Student",
      action: "Social Impact Donation",
      details: `Donated ৳${amount.toLocaleString()} via ${method}. Earned ${earnedPoints} pts.`,
      timestamp: new Date().toLocaleString(),
    });

    saveState();
    return { ok: true, transaction: newTxn, points: earnedPoints };
  },

  /** Top up wallet balance */
  topUpWallet(amount: number, method: string) {
    if (amount <= 0) return { ok: false, error: "Enter a valid top-up amount." };

    currentState.balances.walletBalance += amount;
    currentState.balances.availableBalance += amount;

    const refId = "TOP-" + Math.floor(100000 + Math.random() * 900000);
    const receiptNo = "REC-TOP-" + Math.floor(100000 + Math.random() * 900000);
    const newTxn: Transaction = {
      id: "TXN-" + Math.floor(10000 + Math.random() * 90000),
      title: "Neo Wallet Balance Top-Up",
      date: new Date().toLocaleString("en-US", { dateStyle: "short", timeStyle: "short" }),
      amount,
      type: "wallet",
      status: "Success",
      method,
      referenceId: refId,
      receiptNumber: receiptNo,
    };

    currentState.transactions.unshift(newTxn);

    currentState.notifications.unshift({
      id: "notif-" + Date.now(),
      title: "Wallet Top-Up Successful",
      message: `Added ৳${amount.toLocaleString()} to your Neo Wallet via ${method}.`,
      date: "Just now",
      type: "success",
      read: false,
    });

    currentState.auditLogs.unshift({
      id: "log-" + Date.now(),
      actor: currentState.studentProfile.name,
      role: "Student",
      action: "Wallet Top-Up",
      details: `Top-up ৳${amount.toLocaleString()} via ${method}.`,
      timestamp: new Date().toLocaleString(),
    });

    saveState();
    return { ok: true, transaction: newTxn };
  },

  /** Admin bulk fee assignment */
  bulkAssignFee(data: {
    title: string;
    amount: number;
    issueDate?: string;
    dueDate: string;
    category: Fee["category"];
    institution?: string;
    department?: string;
    classYear?: string;
    section?: string;
    semester?: string;
    targetClass?: string;
    targetSection?: string;
    targetStudentIds?: string[];
    description: string;
  }) {
    let issuedDateStr = new Date().toISOString().split("T")[0];
    if (data.issueDate && data.issueDate.trim() !== "") {
      issuedDateStr = data.issueDate;
    }
    const newFeeId = "fee-" + Date.now();
    const newFee: Fee = {
      id: newFeeId,
      title: data.title,
      amount: data.amount,
      originalAmount: data.amount,
      dueDate: data.dueDate,
      ...(issuedDateStr ? { issuedDate: issuedDateStr } : {}),
      status: "due",
      category: data.category,
      description: data.description,
    };

    currentState.fees.unshift(newFee);

    let count = 0;
    currentState.students.forEach((s) => {
      const matchId = !data.targetStudentIds || data.targetStudentIds.length === 0 || data.targetStudentIds.includes(s.id);
      const matchDept = !data.department || data.department === "all" || s.department === data.department;
      const matchClass = !data.classYear || data.classYear === "all" || s.classYear === data.classYear;
      const matchSection = !data.section || data.section === "all" || s.section === data.section;
      const matchSemester = !data.semester || data.semester === "all" || s.semester === data.semester;

      if (matchId && matchDept && matchClass && matchSection && matchSemester) {
        s.totalDues += data.amount;
        s.feeStatus = "Pending";
        count++;
      }
    });

    currentState.notifications.unshift({
      id: "notif-bulk-" + Date.now(),
      title: `New Fee Issued: ${data.title}`,
      message: `${data.title} of ৳${data.amount.toLocaleString()} has been assigned to your account. Due date: ${data.dueDate}.`,
      date: new Date().toLocaleDateString(),
      type: "warning",
      read: false,
      category: "fee",
    });

    currentState.auditLogs.unshift({
      id: "log-" + Date.now(),
      actor: "Admin (Refat Rahman)",
      role: "Admin",
      action: "Bulk Fee Assigned",
      details: `Assigned "${data.title}" (৳${data.amount.toLocaleString()}) to ${count} students. Due Date: ${data.dueDate}.`,
      timestamp: new Date().toLocaleString(),
    });

    saveState();
    return { ok: true, count, fee: newFee };
  },

  /** Bulk import students from Excel file preview */
  importStudents(list: Array<{ name: string; studentId: string; department: string; classSection: string; email: string }>) {
    list.forEach((item, index) => {
      currentState.students.unshift({
        id: "st-imp-" + Date.now() + "-" + index,
        name: item.name,
        studentId: item.studentId,
        department: item.department || "CSE",
        classYear: "1st Year",
        section: "Sec A",
        semester: "1st Sem",
        classSection: item.classSection || "CSE 1st Year (Sec A)",
        session: "2025-2026",
        email: item.email || `${item.studentId.toLowerCase()}@dcc.edu.bd`,
        phone: "+880 1700-000000",
        status: "Active",
        feeStatus: "Paid",
        walletBalance: 0,
        totalDues: 0,
        verified: true,
        lastActivity: "Just imported",
      });
    });

    currentState.auditLogs.unshift({
      id: "log-" + Date.now(),
      actor: "Admin (Refat Rahman)",
      role: "Admin",
      action: "Excel Student Import",
      details: `Imported ${list.length} student records into institutional directory.`,
      timestamp: new Date().toLocaleString(),
    });

    saveState();
  },

  markAllNotificationsRead() {
    currentState.notifications.forEach((n) => (n.read = true));
    saveState();
  },

    createEscalation(subject: string, initialUserMessage: string) {
    const ticketId = "ESC-" + Math.floor(1000 + Math.random() * 9000);
    const now = new Date().toLocaleString([], { dateStyle: "short", timeStyle: "short" });
    const newTicket: EscalationTicket = {
      id: ticketId,
      studentName: currentState.studentProfile.name,
      studentId: currentState.studentProfile.studentId,
      institution: currentState.studentProfile.institution,
      department: currentState.studentProfile.classSection,
      subject,
      status: "open",
      createdAt: now,
      lastReplyAt: now,
      messages: [
        {
          id: "m-" + Date.now(),
          sender: "student",
          senderName: currentState.studentProfile.name,
          text: initialUserMessage,
          timestamp: now,
        },
        {
          id: "m-ai-" + Date.now(),
          sender: "ai",
          senderName: "Neo AI Assistant",
          text: `Escalation ticket #${ticketId} opened. Your issue "${subject}" has been transmitted directly to ${currentState.studentProfile.institution} Financial Controllers. An admin controller will reply to your thread shortly.`,
          timestamp: now,
        },
      ],
    };

    if (!currentState.escalations) currentState.escalations = [];
    currentState.escalations.unshift(newTicket);
    currentState.notifications.unshift({
      id: "notif-" + Date.now(),
      title: "Support Ticket Escalated",
      message: `Escalation #${ticketId} submitted to Admin controllers.`,
      date: "Just now",
      type: "info",
      read: false,
    });
    currentState.auditLogs.unshift({
      id: "log-" + Date.now(),
      actor: currentState.studentProfile.name,
      role: "Student",
      action: "Escalated Support Ticket",
      details: `Created ticket #${ticketId}: "${subject}"`,
      timestamp: now,
    });

    saveState();
    return newTicket;
  },

  replyEscalation(ticketId: string, replyText: string, senderRole: "student" | "admin") {
    if (!currentState.escalations) currentState.escalations = [];
    const ticket = currentState.escalations.find((t) => t.id === ticketId);
    if (!ticket) return { ok: false, error: "Ticket not found." };

    const now = new Date().toLocaleString([], { dateStyle: "short", timeStyle: "short" });
    const senderName = senderRole === "admin" ? "Admin (Refat Rahman)" : currentState.studentProfile.name;

    ticket.messages.push({
      id: "m-" + Date.now(),
      sender: senderRole,
      senderName,
      text: replyText,
      timestamp: now,
    });

    ticket.lastReplyAt = now;
    ticket.status = senderRole === "admin" ? "in_progress" : "open";

    if (senderRole === "admin") {
      currentState.notifications.unshift({
        id: "notif-" + Date.now(),
        title: "Admin Replied to Escalation",
        message: `Admin replied on ticket #${ticketId}: "${replyText.substring(0, 45)}..."`,
        date: "Just now",
        type: "success",
        read: false,
      });
    }

    saveState();
    return { ok: true, ticket };
  },

  resolveEscalation(ticketId: string) {
    if (!currentState.escalations) currentState.escalations = [];
    const ticket = currentState.escalations.find((t) => t.id === ticketId);
    if (ticket) {
      ticket.status = "resolved";
      saveState();
    }
  },

  updateReminderRules(newRules: Partial<ReminderRules>) {
    currentState.reminderRules = { ...currentState.reminderRules, ...newRules };
    currentState.auditLogs.unshift({
      id: "log-" + Date.now(),
      actor: "Admin (Refat Rahman)",
      role: "Admin",
      action: "Updated Reminder Rules",
      details: `Near-deadline threshold set to ${currentState.reminderRules.nearDeadlineDays} days.`,
      timestamp: new Date().toLocaleString(),
    });
    saveState();
  },

  triggerRemindersRun() {
    const rules = currentState.reminderRules;
    const now = new Date();
    let generatedCount = 0;

    currentState.fees.forEach((fee) => {
      if (fee.status !== "paid") {
        const dueDate = new Date(fee.dueDate);
        const diffTime = dueDate.getTime() - now.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0 && rules.overduePenaltyNotice) {
          currentState.notifications.unshift({
            id: "notif-missed-" + Date.now() + "-" + Math.random(),
            title: "Missed Deadline / Overdue Alert",
            message: `Overdue Notice: ${fee.title} (${fee.amount.toLocaleString()} ৳) passed due date (${fee.dueDate}). Please settle immediately.`,
            date: "Just now",
            type: "error",
            read: false,
            category: "fee",
          });
          generatedCount++;
        } else if (diffDays === 0 && rules.finalDayAlertEnabled) {
          currentState.notifications.unshift({
            id: "notif-final-" + Date.now() + "-" + Math.random(),
            title: "Final-Day Deadline Notice",
            message: `Emergency Alert: Today is the final payment deadline for ${fee.title} (${fee.amount.toLocaleString()} ৳).`,
            date: "Just now",
            type: "error",
            read: false,
            category: "fee",
          });
          generatedCount++;
        } else if (diffDays > 0 && diffDays <= rules.nearDeadlineDays) {
          currentState.notifications.unshift({
            id: "notif-near-" + Date.now() + "-" + Math.random(),
            title: "Near-Deadline Alert",
            message: `Upcoming Deadline: ${fee.title} is due in ${diffDays} day(s) on ${fee.dueDate}.`,
            date: "Just now",
            type: "warning",
            read: false,
            category: "fee",
          });
          generatedCount++;
        } else if (rules.weeklyReminderEnabled) {
          currentState.notifications.unshift({
            id: "notif-weekly-" + Date.now() + "-" + Math.random(),
            title: "Weekly Fee Reminder",
            message: `Automated Weekly Reminder: ${fee.title} (${fee.amount.toLocaleString()} ৳) due on ${fee.dueDate}.`,
            date: "Just now",
            type: "info",
            read: false,
            category: "fee",
          });
          generatedCount++;
        }
      }
    });

    saveState();
    return { ok: true, count: generatedCount };
  },


    resetDemoState() {
    currentState = JSON.parse(JSON.stringify(INITIAL_STATE));
    saveState();
  },
};

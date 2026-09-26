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
  status: "due" | "paid" | "overdue" | "pending_partial" | "partial_approved";
  partialAllowed?: boolean;
  approvedPartialAmount?: number;
  description: string;
  category: "Tuition" | "Lab & Tech" | "Library" | "Exam" | "Hostel";
}

export interface PartialApplication {
  id: string;
  studentName: string;
  studentId: string;
  feeId: string;
  feeTitle: string;
  originalAmount: number;
  requestedAmount: number;
  reason: string;
  guardianName: string;
  guardianPhone: string;
  guardianIdDocUrl: string;
  signatureDocUrl: string;
  aiMatchScore: number; // e.g. 96 (%)
  aiMatchStatus: "High Similarity" | "Needs Review" | "Mismatch";
  status: "pending_admin" | "forwarded_head" | "approved_head" | "rejected_admin" | "rejected_head";
  submittedAt: string;
  rejectionReason?: string;
}

export interface Transaction {
  id: string;
  title: string;
  date: string;
  amount: number;
  type: "fee" | "donation" | "wallet" | "refund";
  status: "Success" | "Pending" | "Failed";
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
}

export interface AuditLog {
  id: string;
  actor: string;
  role: "Student" | "Admin" | "Head";
  action: string;
  details: string;
  timestamp: string;
}

export interface StudentRecord {
  id: string;
  name: string;
  studentId: string;
  department: string;
  classSection: string;
  session: string;
  email: string;
  phone: string;
  status: "Active" | "Promoted" | "Pending Dues";
  totalDues: number;
  verified: boolean;
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
    monthlySpending: number;
  };
  paymentMethods: Array<{
    id: string;
    name: string;
    type: "bkash" | "rocket" | "visa" | "mastercard" | "card";
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
  students: StudentRecord[];
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
    name: "Shelly Paul",
    studentId: "DCC-2024-8842",
    institution: "Dhaka City College",
    department: "Computer Science & Engineering",
    classSection: "CSE 3rd Semester (Sec A)",
    session: "2024-2025",
    email: "sp2khb@gmail.com",
    phone: "+880 1712-345678",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Shelly",
    isVerified: true,
  },
  balances: {
    availableBalance: 14500,
    walletBalance: 4250,
    totalDue: 8500,
    monthlySpending: 3800,
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
      amount: 6000,
      originalAmount: 6000,
      dueDate: "2026-10-15",
      status: "due",
      category: "Tuition",
      description: "Core academic tuition for CSE 3rd Semester modules.",
    },
    {
      id: "fee-2",
      title: "Lab & Technology Equipment Charge",
      amount: 1500,
      originalAmount: 1500,
      dueDate: "2026-10-20",
      status: "due",
      category: "Lab & Tech",
      description: "Access to High-Performance Computing & Robotics Labs.",
    },
    {
      id: "fee-3",
      title: "Midterm Exam & Assessment Fee",
      amount: 1000,
      originalAmount: 1000,
      dueDate: "2026-09-20",
      status: "overdue",
      category: "Exam",
      description: "Mid-semester examination hall ticket and answer script evaluation.",
    },
    {
      id: "fee-4",
      title: "Library & Digital Resources Dues",
      amount: 1000,
      originalAmount: 1000,
      dueDate: "2026-09-01",
      status: "paid",
      category: "Library",
      description: "Annual subscription to IEEE Xplore & ACM Digital Library.",
    },
  ],
  partialApplications: [
    {
      id: "APP-9042",
      studentName: "Shelly Paul",
      studentId: "DCC-2024-8842",
      feeId: "fee-1",
      feeTitle: "Semester Tuition Fee (Fall 2026)",
      originalAmount: 6000,
      requestedAmount: 2500,
      reason: "Family medical emergency causing temporary financial hardship.",
      guardianName: "Robert Paul",
      guardianPhone: "+880 1711-998877",
      guardianIdDocUrl: "NID-7849302198.pdf",
      signatureDocUrl: "Guardian-Signature.png",
      aiMatchScore: 96,
      aiMatchStatus: "High Similarity",
      status: "forwarded_head",
      submittedAt: "2026-09-24 10:30 AM",
    },
  ],
  donations: {
    totalDonated: 500,
    points: 5, // ৳500 / 100 = 5 Points
    rankClass: 3,
    rankDept: 7,
    rankInstitution: 14,
    rankNational: 42,
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
      id: "TXN-88392",
      title: "Student Welfare & Social Impact Donation",
      date: "2026-09-10 11:45 AM",
      amount: 500,
      type: "donation",
      status: "Success",
      method: "City Bank Visa Debit",
      referenceId: "VS-110294",
      receiptNumber: "DON-448201",
    },
  ],
  notifications: [
    {
      id: "notif-1",
      title: "Fee Payment Reminder",
      message: "Semester Tuition Fee (৳6,000) is due on October 15, 2026.",
      date: "2 hours ago",
      type: "warning",
      read: false,
    },
    {
      id: "notif-2",
      title: "Partial Payment Forwarded",
      message: "Admin reviewed your request APP-9042 and forwarded it to Head for final sign-off.",
      date: "1 day ago",
      type: "info",
      read: false,
    },
    {
      id: "notif-3",
      title: "Donation Points Awarded",
      message: "You earned 5 Donation Points! Rank in Class improved to #3.",
      date: "3 days ago",
      type: "success",
      read: true,
    },
  ],
  auditLogs: [
    {
      id: "log-101",
      actor: "Admin (Refat Rahman)",
      role: "Admin",
      action: "Forwarded Application to Head",
      details: "Application APP-9042 for Shelly Paul (Requested ৳2,500 / ৳6,000)",
      timestamp: "2026-09-25 04:12 PM",
    },
    {
      id: "log-100",
      actor: "Shelly Paul",
      role: "Student",
      action: "Submitted Partial Payment Request",
      details: "Attached Guardian NID & Signature. AI Score: 96%",
      timestamp: "2026-09-24 10:30 AM",
    },
    {
      id: "log-99",
      actor: "Shelly Paul",
      role: "Student",
      action: "Paid Library Fee",
      details: "Amount: ৳1,000 via bKash",
      timestamp: "2026-09-01 02:15 PM",
    },
  ],
  students: [
    {
      id: "st-1",
      name: "Shelly Paul",
      studentId: "DCC-2024-8842",
      department: "CSE",
      classSection: "CSE 3rd Sem (Sec A)",
      session: "2024-2025",
      email: "sp2khb@gmail.com",
      phone: "+880 1712-345678",
      status: "Pending Dues",
      totalDues: 8500,
      verified: true,
    },
    {
      id: "st-2",
      name: "Tanzim Hasan",
      studentId: "DCC-2024-8843",
      department: "CSE",
      classSection: "CSE 3rd Sem (Sec A)",
      session: "2024-2025",
      email: "tanzim.h@dcc.edu.bd",
      phone: "+880 1819-112233",
      status: "Active",
      totalDues: 0,
      verified: true,
    },
    {
      id: "st-3",
      name: "Nusrat Jahan",
      studentId: "DCC-2024-8844",
      department: "BBA",
      classSection: "Inter 2nd Year (Sec B)",
      session: "2024-2025",
      email: "nusrat.j@dcc.edu.bd",
      phone: "+880 1912-887766",
      status: "Pending Dues",
      totalDues: 6000,
      verified: true,
    },
    {
      id: "st-4",
      name: "Farhan Ahmed",
      studentId: "DCC-2024-8845",
      department: "EEE",
      classSection: "EEE 1st Sem (Sec A)",
      session: "2025-2026",
      email: "farhan.a@dcc.edu.bd",
      phone: "+880 1611-445566",
      status: "Active",
      totalDues: 0,
      verified: true,
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

export const storeActions = {
  setRole(role: Role) {
    currentState.role = role;
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

  updateStudentProfile(data: Partial<NeoState["studentProfile"]>) {
    currentState.studentProfile = { ...currentState.studentProfile, ...data };
    saveState();
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
    currentState.balances.monthlySpending += payAmount;

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
      aiMatchStatus: "High Similarity",
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
  headApprovePartial(appId: string) {
    const app = currentState.partialApplications.find((a) => a.id === appId);
    if (!app) return;

    app.status = "approved_head";

    const targetFee = currentState.fees.find((f) => f.id === app.feeId);
    if (targetFee) {
      targetFee.status = "partial_approved";
      targetFee.approvedPartialAmount = app.requestedAmount;
      targetFee.amount = app.requestedAmount;
    }

    currentState.notifications.unshift({
      id: "notif-" + Date.now(),
      title: "Partial Payment Approved!",
      message: `Head approved your application ${appId}! You can now pay ৳${app.requestedAmount.toLocaleString()} instead of ৳${app.originalAmount.toLocaleString()}.`,
      date: "Just now",
      type: "success",
      read: false,
    });

    currentState.auditLogs.unshift({
      id: "log-" + Date.now(),
      actor: "Head / Director (Prof. Dr. M. A. Karim)",
      role: "Head",
      action: "Approved Partial Payment Application",
      details: `App ${appId} approved for ${app.studentName}. Unlocked payment of ৳${app.requestedAmount}`,
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
    dueDate: string;
    category: Fee["category"];
    targetClass: string;
    targetSection: string;
    description: string;
  }) {
    const newFeeId = "fee-" + Date.now();
    const newFee: Fee = {
      id: newFeeId,
      title: data.title,
      amount: data.amount,
      originalAmount: data.amount,
      dueDate: data.dueDate,
      status: "due",
      category: data.category,
      description: data.description,
    };

    currentState.fees.unshift(newFee);
    currentState.balances.totalDue += data.amount;

    currentState.notifications.unshift({
      id: "notif-" + Date.now(),
      title: "New Fee Assigned",
      message: `New institutional fee "${data.title}" (৳${data.amount.toLocaleString()}) assigned to ${data.targetClass} (${data.targetSection}).`,
      date: "Just now",
      type: "warning",
      read: false,
    });

    currentState.auditLogs.unshift({
      id: "log-" + Date.now(),
      actor: "Admin (Refat Rahman)",
      role: "Admin",
      action: "Bulk Fee Assignment",
      details: `Assigned "${data.title}" (৳${data.amount}) to ${data.targetClass} ${data.targetSection}`,
      timestamp: new Date().toLocaleString(),
    });

    saveState();
    return { ok: true };
  },

  /** Bulk import students from Excel file preview */
  importStudents(list: Array<{ name: string; studentId: string; department: string; classSection: string; email: string }>) {
    list.forEach((item, index) => {
      currentState.students.unshift({
        id: "st-imp-" + Date.now() + "-" + index,
        name: item.name,
        studentId: item.studentId,
        department: item.department || "CSE",
        classSection: item.classSection || "Inter 1st Year",
        session: "2025-2026",
        email: item.email || `${item.studentId.toLowerCase()}@dcc.edu.bd`,
        phone: "+880 1700-000000",
        status: "Active",
        totalDues: 0,
        verified: true,
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

  resetDemoState() {
    currentState = JSON.parse(JSON.stringify(INITIAL_STATE));
    saveState();
  },
};

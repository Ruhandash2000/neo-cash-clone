/**
 * Admin Panel Component — Refined Institutional Operations Center
 * 
 * Visual System & Hierarchy Guidelines:
 * - Primary Text: #241A14 (Dark Warm Charcoal)
 * - Secondary Text: #66564A (Lighter Warm Charcoal)
 * - Muted Text: #8C7A6A (Timestamps & Metadata)
 * - Canvas Background: #FFF7E6 (Warm Ivory)
 * - Level 1 Surface: #FFFFFF (Clean White)
 * - Level 2 Subtle Surface: #FDF9F3 (Warm Beige)
 * - Primary Action: #D35400 (Burnt Orange)
 */

import { useState } from "react";
import { useNeoStore, StudentRecord, PartialApplication, EscalationTicket, NotificationItem } from "@/lib/neo-cash-store";
import { StatusBadge } from "@/components/design-system/status-badge";
import { formatTaka } from "@/components/design-system/tokens";
import {
  Users, DollarSign, FileSpreadsheet, ShieldCheck, AlertTriangle, ArrowRight,
  CheckCircle2, XCircle, Search, Filter, Plus, Upload, FileText, Check, Clock, RefreshCw, X, Sparkles, MessageSquare, Send, CornerDownRight, LifeBuoy, Bell, Zap,
  Eye, Edit3, UserCheck, CreditCard, History, Wallet, Calendar, Award, Mail, Phone, Shield, CheckSquare, Layers, Activity, UserX, ChevronRight, Download
} from "lucide-react";

export function AdminPanel({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const [store, actions] = useNeoStore();

  // Student directory search & 6-Dimension Multi-Filters (Phase 12)
  const [studentSearch, setStudentSearch] = useState("");
  const [filterClass, setFilterClass] = useState("all");
  const [filterSection, setFilterSection] = useState("all");
  const [filterDept, setFilterDept] = useState("all");
  const [filterSemester, setFilterSemester] = useState("all");
  const [filterPaymentStatus, setFilterPaymentStatus] = useState("all");
  const [filterVerification, setFilterVerification] = useState("all");

  // Selected Student Detail Dossier & Admin Edit Modal (Phase 12)
  const [selectedStudentDossier, setSelectedStudentDossier] = useState<StudentRecord | null>(null);
  const [isEditingAdminFields, setIsEditingAdminFields] = useState(false);
  const [activeDossierTab, setActiveDossierTab] = useState<"identity" | "academic" | "fees" | "transactions" | "wallet" | "partial" | "notifications" | "activity">("identity");

  // Admin Edit Form State
  const [editStatus, setEditStatus] = useState<StudentRecord["status"]>("Active");
  const [editClassYear, setEditClassYear] = useState("3rd Year");
  const [editSection, setEditSection] = useState("Sec A");
  const [editDepartment, setEditDepartment] = useState("CSE");
  const [editSemester, setEditSemester] = useState("3rd Sem");
  const [editVerified, setEditVerified] = useState(true);

  // Bulk Fee Assignment Form
  const [bulkTitle, setBulkTitle] = useState("Semester Tuition Fee (Spring 2027)");
  const [bulkAmount, setBulkAmount] = useState<number>(6500);
  const [bulkDueDate, setBulkDueDate] = useState("2027-01-15");
  const [bulkCategory, setBulkCategory] = useState<"Tuition" | "Lab & Tech" | "Exam">("Tuition");
  const [targetClass, setTargetClass] = useState("CSE 3rd Semester");
  const [targetSection, setTargetSection] = useState("Sec A");

  // Excel Import File State
  const [importFileName, setImportFileName] = useState<string | null>(null);
  const [importRows, setImportRows] = useState<Array<{ name: string; studentId: string; department: string; classSection: string; email: string }>>([
    { name: "Aria Rahman", studentId: "DCC-2024-9001", department: "CSE", classSection: "CSE 3rd Sem (Sec B)", email: "aria.r@dcc.edu.bd" },
    { name: "Siddique Hossain", studentId: "DCC-2024-9002", department: "EEE", classSection: "EEE 1st Sem (Sec A)", email: "siddique.h@dcc.edu.bd" },
    { name: "Mahmudul Hasan", studentId: "DCC-2024-9003", department: "BBA", classSection: "Inter 2nd Year (Sec A)", email: "mahmudul.h@dcc.edu.bd" },
  ]);

  // Selected Application for Review Modal
  const [reviewApp, setReviewApp] = useState<PartialApplication | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  // Human Support Escalations Queue State (Phase 8)
  const [selectedEscalation, setSelectedEscalation] = useState<EscalationTicket | null>(null);
  const [adminReplyInput, setAdminReplyInput] = useState("");
  const [escalationFilter, setEscalationFilter] = useState<"all" | "open" | "in_progress" | "resolved">("all");
  const [escalationSearch, setEscalationSearch] = useState("");

  const handleBulkAssign = (e: React.FormEvent) => {
    e.preventDefault();
    actions.bulkAssignFee({
      title: bulkTitle,
      amount: Number(bulkAmount),
      dueDate: bulkDueDate,
      category: bulkCategory,
      targetClass,
      targetSection,
      description: `Institutional fee assigned to ${targetClass} (${targetSection}).`,
    });
    alert(`Successfully assigned "${bulkTitle}" (${formatTaka(bulkAmount)}) to ${targetClass} (${targetSection})!`);
  };

  const handleExcelImportConfirm = () => {
    actions.importStudents(importRows);
    alert(`Successfully imported ${importRows.length} student records into the institutional directory!`);
    setImportFileName(null);
  };

  const handleForwardToHead = (appId: string) => {
    actions.adminForwardPartial(appId);
    setReviewApp(null);
    alert(`Application ${appId} forwarded to Head / Director for executive sign-off!`);
  };

  const handleRequestChangesByAdmin = (appId: string) => {
    if (!rejectionReason.trim()) return alert("Enter change request feedback notes.");
    actions.requestChangesPartial(appId, rejectionReason, "Admin");
    setReviewApp(null);
    setRejectionReason("");
    alert(`Change request sent to student for application ${appId}.`);
  };

  const handleRejectByAdmin = (appId: string) => {
    if (!rejectionReason.trim()) return alert("Enter rejection reason.");
    actions.rejectPartial(appId, rejectionReason, "Admin");
    setReviewApp(null);
    setRejectionReason("");
    alert(`Application ${appId} declined.`);
  };

  const handleSendAdminReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEscalation) return;
    if (!adminReplyInput.trim()) return alert("Enter your response for the student.");

    const res = actions.replyEscalation(selectedEscalation.id, adminReplyInput.trim(), "admin");
    if (res.ok && res.ticket) {
      setSelectedEscalation(res.ticket);
      setAdminReplyInput("");
      alert("Admin response transmitted to student chat thread!");
    } else {
      alert(res.error || "Failed to submit response.");
    }
  };

  const handleResolveTicket = (ticketId: string) => {
    actions.resolveEscalation(ticketId);
    if (selectedEscalation && selectedEscalation.id === ticketId) {
      setSelectedEscalation({ ...selectedEscalation, status: "resolved" });
    }
    alert(`Escalation ticket #${ticketId} marked as Resolved!`);
  };

    // Open Dossier & set up edit form defaults
  const handleOpenDossier = (student: StudentRecord, editMode = false) => {
    setSelectedStudentDossier(student);
    setIsEditingAdminFields(editMode);
    setActiveDossierTab("identity");
    setEditStatus(student.status);
    setEditClassYear(student.classYear || "3rd Year");
    setEditSection(student.section || "Sec A");
    setEditDepartment(student.department || "CSE");
    setEditSemester(student.semester || "3rd Sem");
    setEditVerified(student.verified ?? true);
  };

  const handleSaveAdminEdits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudentDossier) return;

    const res = actions.updateStudentProfile(selectedStudentDossier.id, {
      status: editStatus,
      classYear: editClassYear,
      section: editSection,
      department: editDepartment,
      semester: editSemester,
      verified: editVerified,
    });

    if (res.ok && res.student) {
      setSelectedStudentDossier(res.student);
      setIsEditingAdminFields(false);
      alert(`Successfully updated administrative profile for ${res.student.name} (${res.student.studentId})!`);
    } else {
      alert(res.error || "Failed to update student profile.");
    }
  };

  const handlePromoteStudent = (student: StudentRecord) => {
    const nextSem = student.semester.includes("1st") ? "2nd Sem" : student.semester.includes("2nd") ? "3rd Sem" : "4th Sem";
    const res = actions.updateStudentProfile(student.id, {
      semester: nextSem,
      status: "Promoted",
    });
    if (res.ok && res.student) {
      if (selectedStudentDossier && selectedStudentDossier.id === student.id) {
        setSelectedStudentDossier(res.student);
      }
      alert(`Promoted ${student.name} to ${nextSem}!`);
    }
  };

  // Multi-field search & 6-dimension filter calculation
  const filteredStudents = store.students.filter((s) => {
    const searchLower = studentSearch.toLowerCase();
    const matchesSearch =
      studentSearch === "" ||
      s.name.toLowerCase().includes(searchLower) ||
      s.studentId.toLowerCase().includes(searchLower) ||
      s.email.toLowerCase().includes(searchLower) ||
      s.department.toLowerCase().includes(searchLower) ||
      s.classYear.toLowerCase().includes(searchLower) ||
      s.section.toLowerCase().includes(searchLower);

    const matchesClass = filterClass === "all" || s.classYear === filterClass;
    const matchesSection = filterSection === "all" || s.section === filterSection;
    const matchesDept = filterDept === "all" || s.department === filterDept;
    const matchesSemester = filterSemester === "all" || s.semester === filterSemester;
    const matchesPayment = filterPaymentStatus === "all" || s.feeStatus === filterPaymentStatus;
    const matchesVerification =
      filterVerification === "all" ||
      (filterVerification === "verified" ? s.verified === true : s.verified === false);

    return (
      matchesSearch &&
      matchesClass &&
      matchesSection &&
      matchesDept &&
      matchesSemester &&
      matchesPayment &&
      matchesVerification
    );
  });

  const hasActiveFilters =
    studentSearch !== "" ||
    filterClass !== "all" ||
    filterSection !== "all" ||
    filterDept !== "all" ||
    filterSemester !== "all" ||
    filterPaymentStatus !== "all" ||
    filterVerification !== "all";

  const resetFilters = () => {
    setStudentSearch("");
    setFilterClass("all");
    setFilterSection("all");
    setFilterDept("all");
    setFilterSemester("all");
    setFilterPaymentStatus("all");
    setFilterVerification("all");
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* 1. PROFESSIONAL DATA-DRIVEN ADMIN DASHBOARD (PHASE 11) */}
      {activeTab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          
          {/* INSTITUTION DOSSIER BANNER & HEADER */}
          <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "18px", padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                <span style={{ fontSize: "0.74rem", background: "rgba(211, 84, 0, 0.12)", color: "#D35400", border: "1px solid rgba(211, 84, 0, 0.3)", padding: "3px 10px", borderRadius: "999px", fontWeight: 700 }}>
                  ● Operational Command Center
                </span>
                <span style={{ fontSize: "0.82rem", color: "#66564A", fontWeight: 600 }}>Dhaka City College (Dhanmondi, Dhaka)</span>
              </div>
              <h1 style={{ margin: 0, fontSize: "1.8rem", fontWeight: 800, color: "#241A14", letterSpacing: "-0.02em" }}>
                Institutional Financial Operations & Analytics
              </h1>
              <p style={{ margin: "4px 0 0", fontSize: "0.9rem", color: "#66564A" }}>
                Academic Period: <strong>Fall Semester 2026–2027</strong> • Financial Audit Period: <strong>Q3 2026 Window</strong>
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="button"
                className="ms-btn-primary"
                onClick={() => setActiveTab("bulk")}
                style={{ background: "#D35400", color: "#FFFFFF", padding: "10px 18px", borderRadius: "10px", fontSize: "0.88rem", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <Plus size={16} /> Bulk Fee Assignment
              </button>
            </div>
          </div>

          {/* SUMMARY METRICS GRID (6 OPERATIONAL KPIS) */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            
            {/* TOTAL STUDENTS */}
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "14px", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#66564A", textTransform: "uppercase" }}>Total Students</span>
              <div style={{ margin: "10px 0 4px" }}>
                <span style={{ fontSize: "2rem", fontWeight: 800, color: "#241A14" }}>2,120</span>
              </div>
              <span style={{ fontSize: "0.78rem", color: "#047857", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "4px" }}>
                <CheckCircle2 size={14} /> 98.4% Verified Cohort
              </span>
            </div>

            {/* TOTAL OUTSTANDING */}
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "14px", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#66564A", textTransform: "uppercase" }}>Total Outstanding</span>
              <div style={{ margin: "10px 0 4px" }}>
                <span style={{ fontSize: "1.8rem", fontWeight: 800, color: "#BE123C", fontFeatureSettings: "'tnum'" }}>
                  {formatTaka(1480000, false)}
                </span>
              </div>
              <span style={{ fontSize: "0.78rem", color: "#BE123C", fontWeight: 600 }}>
                Across 18 Overdue Profiles
              </span>
            </div>

            {/* TOTAL COLLECTED */}
            <div style={{ background: "#FFFFFF", border: "2px solid #D35400", borderRadius: "14px", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#D35400", textTransform: "uppercase" }}>Total Collected</span>
              <div style={{ margin: "10px 0 4px" }}>
                <span style={{ fontSize: "1.8rem", fontWeight: 800, color: "#241A14", fontFeatureSettings: "'tnum'" }}>
                  {formatTaka(4820000, false)}
                </span>
              </div>
              <span style={{ fontSize: "0.78rem", color: "#66564A", fontWeight: 600 }}>
                Spring & Fall Collections
              </span>
            </div>

            {/* COLLECTION RATE */}
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "14px", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#66564A", textTransform: "uppercase" }}>Collection Rate</span>
              <div style={{ margin: "10px 0 4px" }}>
                <span style={{ fontSize: "2rem", fontWeight: 800, color: "#047857" }}>82%</span>
              </div>
              <span style={{ fontSize: "0.78rem", color: "#047857", fontWeight: 600 }}>
                On-Time Settlement Rate
              </span>
            </div>

            {/* PENDING PARTIAL APPLICATIONS */}
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "14px", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#66564A", textTransform: "uppercase" }}>Pending Partial Apps</span>
              <div style={{ margin: "10px 0 4px" }}>
                <span style={{ fontSize: "2rem", fontWeight: 800, color: "#D35400" }}>
                  {store.partialApplications.filter((a) => a.status === "pending_admin").length}
                </span>
              </div>
              <span style={{ fontSize: "0.78rem", color: "#66564A", fontWeight: 600 }}>
                Requires Admin Review
              </span>
            </div>

            {/* OVERDUE STUDENTS */}
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "14px", padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#66564A", textTransform: "uppercase" }}>Overdue Students</span>
              <div style={{ margin: "10px 0 4px" }}>
                <span style={{ fontSize: "2rem", fontWeight: 800, color: "#BE123C" }}>18</span>
              </div>
              <span style={{ fontSize: "0.78rem", color: "#BE123C", fontWeight: 600 }}>
                3.2% Cohort Overdue Rate
              </span>
            </div>

          </div>

          {/* QUICK ACTIONS TOOLBAR */}
          <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "16px", padding: "18px 20px" }}>
            <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#241A14", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "12px" }}>
              Admin Quick Actions Toolbar
            </div>
            
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
              <button
                type="button"
                onClick={() => setActiveTab("bulk")}
                style={{ background: "#FDF9F3", color: "#D35400", border: "1px solid rgba(211, 84, 0, 0.3)", padding: "12px 16px", borderRadius: "10px", fontSize: "0.88rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
              >
                <FileSpreadsheet size={18} /> Bulk Fee Assignment ➕
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("students")}
                style={{ background: "#FDF9F3", color: "#241A14", border: "1px solid rgba(196, 154, 108, 0.3)", padding: "12px 16px", borderRadius: "10px", fontSize: "0.88rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Users size={18} /> Student Directory 👥
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("import")}
                style={{ background: "#FDF9F3", color: "#241A14", border: "1px solid rgba(196, 154, 108, 0.3)", padding: "12px 16px", borderRadius: "10px", fontSize: "0.88rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
              >
                <Upload size={18} /> Excel Roster Import 📥
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("applications")}
                style={{ background: "#FDF9F3", color: "#241A14", border: "1px solid rgba(196, 154, 108, 0.3)", padding: "12px 16px", borderRadius: "10px", fontSize: "0.88rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
              >
                <ShieldCheck size={18} /> Partial Payment Queue 📋
              </button>
            </div>
          </div>

          {/* OPERATIONAL ANALYTICS SECTION (DATA-DRIVEN VISUALIZATIONS) */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            
            {/* COLLECTION TREND & PAYMENT ACTIVITY */}
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#241A14" }}>
                  Fee Collection Trend & Payment Activity
                </h3>
                <p style={{ margin: "2px 0 0", fontSize: "0.84rem", color: "#66564A" }}>
                  Monthly revenue collection progress and payment gateway distribution.
                </p>
              </div>

              {/* Monthly Trend Progress */}
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#8C7A6A", textTransform: "uppercase" }}>Monthly Collection Trend</span>
                {[
                  { month: "July 2026", amount: 1250000, target: 1500000, pct: 84 },
                  { month: "August 2026", amount: 1820000, target: 2000000, pct: 92 },
                  { month: "September 2026", amount: 1750000, target: 2200000, pct: 78 },
                ].map((item, idx) => (
                  <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.84rem" }}>
                      <span style={{ fontWeight: 700, color: "#241A14" }}>{item.month}</span>
                      <span style={{ fontWeight: 800, color: "#D35400" }}>{formatTaka(item.amount, false)} ({item.pct}%)</span>
                    </div>
                    <div style={{ width: "100%", height: "8px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "999px", overflow: "hidden" }}>
                      <div style={{ width: `${item.pct}%`, height: "100%", background: item.pct > 85 ? "#047857" : "#D35400", borderRadius: "999px" }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Gateway Distribution */}
              <div style={{ borderTop: "1px solid rgba(196, 154, 108, 0.25)", paddingTop: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#8C7A6A", textTransform: "uppercase" }}>Payment Gateway Distribution</span>
                {[
                  { gateway: "bKash Mobile Banking", pct: 58, amount: "৳27,95,600", color: "#D35400" },
                  { gateway: "DBBL Rocket", pct: 22, amount: "৳10,60,400", color: "#9A6600" },
                  { gateway: "Visa / Mastercard Debit", pct: 14, amount: "৳6,74,800", color: "#1D4ED8" },
                  { gateway: "Neo Wallet Balance", pct: 6, amount: "৳2,89,200", color: "#047857" },
                ].map((gw, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.82rem" }}>
                    <span style={{ color: "#66564A", fontWeight: 600 }}>{gw.gateway}</span>
                    <strong style={{ color: gw.color, fontFeatureSettings: "'tnum'" }}>{gw.pct}% ({gw.amount})</strong>
                  </div>
                ))}
              </div>
            </div>

            {/* FEE STATUS & OVERDUE DEPARTMENTAL ANALYSIS */}
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#241A14" }}>
                  Fee Status & Overdue Departmental Analysis
                </h3>
                <p style={{ margin: "2px 0 0", fontSize: "0.84rem", color: "#66564A" }}>
                  Portfolio distribution and departmental risk breakdown.
                </p>
              </div>

              {/* Status Breakdown Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                <div style={{ background: "#FDF9F3", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "10px", padding: "12px" }}>
                  <span style={{ fontSize: "0.74rem", color: "#8C7A6A", fontWeight: 700, textTransform: "uppercase" }}>Settled & Paid</span>
                  <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#047857" }}>72%</div>
                  <span style={{ fontSize: "0.75rem", color: "#047857" }}>1,526 Students</span>
                </div>

                <div style={{ background: "#FDF9F3", border: "1px solid rgba(211, 84, 0, 0.3)", borderRadius: "10px", padding: "12px" }}>
                  <span style={{ fontSize: "0.74rem", color: "#8C7A6A", fontWeight: 700, textTransform: "uppercase" }}>Pending Due</span>
                  <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#D35400" }}>18%</div>
                  <span style={{ fontSize: "0.75rem", color: "#D35400" }}>382 Students</span>
                </div>

                <div style={{ background: "#FDF9F3", border: "1px solid rgba(190, 18, 60, 0.3)", borderRadius: "10px", padding: "12px" }}>
                  <span style={{ fontSize: "0.74rem", color: "#8C7A6A", fontWeight: 700, textTransform: "uppercase" }}>Overdue Risk</span>
                  <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#BE123C" }}>6%</div>
                  <span style={{ fontSize: "0.75rem", color: "#BE123C" }}>127 Students</span>
                </div>

                <div style={{ background: "#FDF9F3", border: "1px solid rgba(37, 99, 235, 0.3)", borderRadius: "10px", padding: "12px" }}>
                  <span style={{ fontSize: "0.74rem", color: "#8C7A6A", fontWeight: 700, textTransform: "uppercase" }}>Approved Installments</span>
                  <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#1D4ED8" }}>4%</div>
                  <span style={{ fontSize: "0.75rem", color: "#1D4ED8" }}>85 Students</span>
                </div>
              </div>

              {/* Departmental Overdue Analysis Table */}
              <div style={{ borderTop: "1px solid rgba(196, 154, 108, 0.25)", paddingTop: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#8C7A6A", textTransform: "uppercase" }}>Departmental Overdue Risk</span>
                {[
                  { dept: "Computer Science & Eng (CSE)", count: "8 Students", amount: "৳95,000", risk: "High" },
                  { dept: "Business Administration (BBA)", count: "6 Students", amount: "৳62,000", risk: "Medium" },
                  { dept: "Electrical & Electronic Eng (EEE)", count: "4 Students", amount: "৳38,000", risk: "Low" },
                ].map((row, idx) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", background: "#FDF9F3", borderRadius: "8px", fontSize: "0.82rem" }}>
                    <div>
                      <strong style={{ color: "#241A14", display: "block" }}>{row.dept}</strong>
                      <span style={{ fontSize: "0.75rem", color: "#8C7A6A" }}>{row.count}</span>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <strong style={{ color: "#BE123C" }}>{row.amount}</strong>
                      <span style={{ fontSize: "0.72rem", background: "rgba(190, 18, 60, 0.1)", color: "#BE123C", padding: "1px 6px", borderRadius: "4px", display: "block", marginTop: "2px", fontWeight: 700 }}>
                        {row.risk} Risk
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>

          </div>

          {/* ACTION CENTER & OPERATIONAL ALERTS */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            
            {/* PENDING PARTIAL PAYMENT REVIEW QUEUE */}
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#241A14" }}>
                  Pending Partial Applications
                </h3>
                <button
                  type="button"
                  onClick={() => setActiveTab("applications")}
                  style={{ background: "none", border: "none", color: "#D35400", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}
                >
                  Full Queue →
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {store.partialApplications.slice(0, 3).map((app) => (
                  <div key={app.id} style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.25)", borderRadius: "12px", padding: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <strong style={{ color: "#241A14", fontSize: "0.9rem" }}>{app.studentName} ({app.studentId})</strong>
                        <span style={{ fontSize: "0.76rem", color: "#66564A", display: "block" }}>{app.feeTitle}</span>
                      </div>
                      <StatusBadge status={app.status.startsWith("approved") ? "approved" : "under_review"} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px dashed rgba(196, 154, 108, 0.2)", paddingTop: "6px", fontSize: "0.8rem" }}>
                      <span>Requested: <strong style={{ color: "#D35400" }}>{formatTaka(app.requestedAmount, false)}</strong></span>
                      {app.status === "pending_admin" ? (
                        <button type="button" className="ms-btn-primary" onClick={() => setReviewApp(app)} style={{ background: "#D35400", color: "#FFFFFF", padding: "3px 10px", fontSize: "0.75rem", borderRadius: "6px" }}>
                          Review & Forward
                        </button>
                      ) : (
                        <span style={{ color: "#8C7A6A", fontSize: "0.75rem" }}>Reviewed</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* IMPORTANT OPERATIONAL ALERTS & SYSTEM EVENTS */}
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "16px", padding: "24px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#241A14" }}>
                Important Operational Alerts
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ padding: "12px 14px", background: "#FDF9F3", borderLeft: "4px solid #BE123C", borderRadius: "10px", fontSize: "0.82rem" }}>
                  <strong style={{ color: "#BE123C", display: "block", marginBottom: "2px" }}>🔴 OVERDUE NOTICE</strong>
                  18 students in CSE 3rd Semester have unpaid tuition fees passing deadline.
                </div>

                <div style={{ padding: "12px 14px", background: "#FDF9F3", borderLeft: "4px solid #D35400", borderRadius: "10px", fontSize: "0.82rem" }}>
                  <strong style={{ color: "#D35400", display: "block", marginBottom: "2px" }}>🟡 UPCOMING DEADLINE</strong>
                  Semester Tuition Fee deadline in 4 days (September 30, 2026).
                </div>

                <div style={{ padding: "12px 14px", background: "#FDF9F3", borderLeft: "4px solid #9A6600", borderRadius: "10px", fontSize: "0.82rem" }}>
                  <strong style={{ color: "#9A6600", display: "block", marginBottom: "2px" }}>🟠 FAILED GATEWAY TIMEOUT</strong>
                  1 Mastercard payment failure logged (Ref #MC-881029). Auto-retry enabled.
                </div>

                <div style={{ padding: "12px 14px", background: "#FDF9F3", borderLeft: "4px solid #047857", borderRadius: "10px", fontSize: "0.82rem" }}>
                  <strong style={{ color: "#047857", display: "block", marginBottom: "2px" }}>🟢 BIOMETRIC AUDIT</strong>
                  420 student digital wallets provisioned & WebAuthn signatures verified.
                </div>
              </div>
            </div>

          </div>

          {/* RECENT OPERATIONAL ACTIVITY FEED */}
          <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "16px", overflow: "hidden" }}>
            <div style={{ padding: "18px 22px", borderBottom: "1px solid rgba(196, 154, 108, 0.25)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#241A14" }}>
                  Recent Institutional Activity Log
                </h3>
                <p style={{ margin: "2px 0 0", fontSize: "0.82rem", color: "#66564A" }}>
                  Real-time feed tracking payments, fee assignments, student updates, approvals, and admin actions.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab("audit")}
                style={{ background: "none", border: "none", color: "#D35400", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}
              >
                Full Audit Trail →
              </button>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
                <thead>
                  <tr style={{ background: "#FDF9F3", textAlign: "left", color: "#66564A", borderBottom: "1px solid rgba(196, 154, 108, 0.3)" }}>
                    <th style={{ padding: "12px 18px", fontWeight: 700 }}>Activity Type</th>
                    <th style={{ padding: "12px 18px", fontWeight: 700 }}>Actor</th>
                    <th style={{ padding: "12px 18px", fontWeight: 700 }}>Action & Details</th>
                    <th style={{ padding: "12px 18px", fontWeight: 700 }}>Logged Time</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { type: "payment", actor: "Ruhan Dash Dibya (Student)", action: "Paid Semester Tuition Fee (৳20,000) via bKash", time: "10 mins ago", color: "#047857" },
                    { type: "fee assignment", actor: "Admin (Refat Rahman)", action: "Bulk assigned Spring 2027 Tuition Fee (৳6,500)", time: "1 hour ago", color: "#D35400" },
                    { type: "student update", actor: "Aria Rahman (Student)", action: "Updated NID guardian identity document & signature", time: "3 hours ago", color: "#1D4ED8" },
                    { type: "approval", actor: "Prof. Dr. M. A. Karim (Head)", action: "Approved partial application APP-9042 for Shelly Paul", time: "1 day ago", color: "#047857" },
                    { type: "admin action", actor: "Admin (Refat Rahman)", action: "Executed automated fee reminder engine run", time: "2 days ago", color: "#9A6600" },
                  ].map((act, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid rgba(196, 154, 108, 0.2)" }}>
                      <td style={{ padding: "12px 18px" }}>
                        <span style={{ background: `${act.color}15`, color: act.color, padding: "3px 10px", borderRadius: "6px", fontSize: "0.76rem", fontWeight: 800, textTransform: "uppercase" }}>
                          {act.type}
                        </span>
                      </td>
                      <td style={{ padding: "12px 18px", fontWeight: 700, color: "#241A14" }}>
                        {act.actor}
                      </td>
                      <td style={{ padding: "12px 18px", color: "#66564A" }}>
                        {act.action}
                      </td>
                      <td style={{ padding: "12px 18px", color: "#8C7A6A", fontSize: "0.82rem" }}>
                        {act.time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* 2. STUDENTS DIRECTORY TAB */}
      {activeTab === "students" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {/* HEADER BAR */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 800, color: "#241A14" }}>
                Institutional Student Directory
              </h2>
              <p style={{ margin: "4px 0 0", fontSize: "0.88rem", color: "#66564A" }}>
                Complete student management directory with administrative field editing and deep financial dossier context.
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <span style={{ fontSize: "0.82rem", background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.4)", padding: "6px 14px", borderRadius: "8px", fontWeight: 700, color: "#66564A" }}>
                Total Records: <strong style={{ color: "#D35400" }}>{filteredStudents.length}</strong> / {store.students.length}
              </span>
            </div>
          </div>

          {/* 6-DIMENSION FILTERS & SEARCH BAR (PHASE 12) */}
          <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "16px", padding: "18px", display: "flex", flexDirection: "column", gap: "14px" }}>
            {/* SEARCH ROW */}
            <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ flex: 1, minWidth: "260px", position: "relative" }}>
                <Search size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#8C7A6A" }} />
                <input
                  type="text"
                  placeholder="Search by student name, ID, email, or department..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  style={{ width: "100%", padding: "10px 14px 10px 40px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "10px", color: "#241A14", outline: "none", fontSize: "0.88rem", boxSizing: "border-box" }}
                />
                {studentSearch && (
                  <button
                    type="button"
                    onClick={() => setStudentSearch("")}
                    style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#8C7A6A", cursor: "pointer" }}
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={resetFilters}
                  style={{ background: "#FFF7E6", border: "1px solid rgba(196, 154, 108, 0.5)", color: "#D35400", padding: "9px 14px", borderRadius: "10px", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <RefreshCw size={13} /> Reset Filters
                </button>
              )}
            </div>

            {/* 6 FILTER DROPDOWNS */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "10px" }}>
              {/* 1. CLASS */}
              <div>
                <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, color: "#66564A", marginBottom: "4px" }}>
                  Class / Year
                </label>
                <select
                  value={filterClass}
                  onChange={(e) => setFilterClass(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", color: "#241A14", outline: "none", fontSize: "0.82rem", fontWeight: 600 }}
                >
                  <option value="all">All Classes</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>

              {/* 2. SECTION */}
              <div>
                <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, color: "#66564A", marginBottom: "4px" }}>
                  Section
                </label>
                <select
                  value={filterSection}
                  onChange={(e) => setFilterSection(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", color: "#241A14", outline: "none", fontSize: "0.82rem", fontWeight: 600 }}
                >
                  <option value="all">All Sections</option>
                  <option value="Sec A">Sec A</option>
                  <option value="Sec B">Sec B</option>
                  <option value="Sec C">Sec C</option>
                </select>
              </div>

              {/* 3. DEPARTMENT */}
              <div>
                <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, color: "#66564A", marginBottom: "4px" }}>
                  Department
                </label>
                <select
                  value={filterDept}
                  onChange={(e) => setFilterDept(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", color: "#241A14", outline: "none", fontSize: "0.82rem", fontWeight: 600 }}
                >
                  <option value="all">All Departments</option>
                  <option value="CSE">CSE</option>
                  <option value="EEE">EEE</option>
                  <option value="BBA">BBA</option>
                  <option value="Civil">Civil</option>
                </select>
              </div>

              {/* 4. SEMESTER */}
              <div>
                <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, color: "#66564A", marginBottom: "4px" }}>
                  Semester
                </label>
                <select
                  value={filterSemester}
                  onChange={(e) => setFilterSemester(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", color: "#241A14", outline: "none", fontSize: "0.82rem", fontWeight: 600 }}
                >
                  <option value="all">All Semesters</option>
                  <option value="1st Sem">1st Sem</option>
                  <option value="2nd Sem">2nd Sem</option>
                  <option value="3rd Sem">3rd Sem</option>
                  <option value="4th Sem">4th Sem</option>
                  <option value="5th Sem">5th Sem</option>
                  <option value="6th Sem">6th Sem</option>
                  <option value="7th Sem">7th Sem</option>
                  <option value="8th Sem">8th Sem</option>
                </select>
              </div>

              {/* 5. PAYMENT STATUS */}
              <div>
                <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, color: "#66564A", marginBottom: "4px" }}>
                  Payment Status
                </label>
                <select
                  value={filterPaymentStatus}
                  onChange={(e) => setFilterPaymentStatus(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", color: "#241A14", outline: "none", fontSize: "0.82rem", fontWeight: 600 }}
                >
                  <option value="all">All Fee Statuses</option>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Overdue">Overdue</option>
                  <option value="Partial Approved">Partial Approved</option>
                </select>
              </div>

              {/* 6. VERIFICATION STATUS */}
              <div>
                <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, color: "#66564A", marginBottom: "4px" }}>
                  Verification
                </label>
                <select
                  value={filterVerification}
                  onChange={(e) => setFilterVerification(e.target.value)}
                  style={{ width: "100%", padding: "8px 10px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", color: "#241A14", outline: "none", fontSize: "0.82rem", fontWeight: 600 }}
                >
                  <option value="all">All Verification</option>
                  <option value="verified">Verified</option>
                  <option value="unverified">Unverified / Pending</option>
                </select>
              </div>
            </div>
          </div>

          {/* DIRECTORY TABLE (PHASE 12 COLUMNS) */}
          <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "14px", overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
              <thead>
                <tr style={{ background: "#FDF9F3", textAlign: "left", color: "#66564A", borderBottom: "1px solid rgba(196, 154, 108, 0.3)" }}>
                  <th style={{ padding: "12px 16px", fontWeight: 700 }}>Student</th>
                  <th style={{ padding: "12px 16px", fontWeight: 700 }}>ID</th>
                  <th style={{ padding: "12px 16px", fontWeight: 700 }}>Department</th>
                  <th style={{ padding: "12px 16px", fontWeight: 700 }}>Class/Year</th>
                  <th style={{ padding: "12px 16px", fontWeight: 700 }}>Section</th>
                  <th style={{ padding: "12px 16px", fontWeight: 700 }}>Fee Status</th>
                  <th style={{ padding: "12px 16px", fontWeight: 700 }}>Wallet</th>
                  <th style={{ padding: "12px 16px", fontWeight: 700 }}>Last Activity</th>
                  <th style={{ padding: "12px 16px", fontWeight: 700, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ padding: "32px", textAlign: "center", color: "#8C7A6A" }}>
                      No student records found matching your active filters.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map((s) => (
                    <tr key={s.id} style={{ borderBottom: "1px solid rgba(196, 154, 108, 0.18)", transition: "background 0.15s ease" }}>
                      {/* 1. STUDENT */}
                      <td style={{ padding: "12px 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#FFF7E6", border: "1px solid rgba(196, 154, 108, 0.4)", color: "#D35400", fontWeight: 800, fontSize: "0.82rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                            {s.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                          </div>
                          <div>
                            <strong style={{ color: "#241A14", display: "block", fontSize: "0.88rem" }}>{s.name}</strong>
                            <span style={{ fontSize: "0.76rem", color: "#8C7A6A" }}>{s.email}</span>
                          </div>
                        </div>
                      </td>

                      {/* 2. ID */}
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ fontFamily: "monospace", fontWeight: 700, color: "#D35400", fontSize: "0.82rem", background: "rgba(211, 84, 0, 0.06)", padding: "3px 8px", borderRadius: "6px", border: "1px solid rgba(211, 84, 0, 0.15)" }}>
                          {s.studentId}
                        </span>
                      </td>

                      {/* 3. DEPARTMENT */}
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ background: "#FDF9F3", color: "#241A14", border: "1px solid rgba(196, 154, 108, 0.3)", padding: "3px 8px", borderRadius: "6px", fontSize: "0.78rem", fontWeight: 700 }}>
                          {s.department}
                        </span>
                      </td>

                      {/* 4. CLASS/YEAR */}
                      <td style={{ padding: "12px 16px", color: "#66564A", fontSize: "0.84rem", fontWeight: 600 }}>
                        {s.classYear}
                      </td>

                      {/* 5. SECTION */}
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ background: "rgba(4, 120, 87, 0.08)", color: "#047857", padding: "2px 7px", borderRadius: "4px", fontSize: "0.78rem", fontWeight: 700 }}>
                          {s.section}
                        </span>
                      </td>

                      {/* 6. FEE STATUS */}
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{
                          padding: "4px 10px",
                          borderRadius: "999px",
                          fontSize: "0.76rem",
                          fontWeight: 800,
                          background:
                            s.feeStatus === "Paid" ? "rgba(4, 120, 87, 0.12)" :
                            s.feeStatus === "Pending" ? "rgba(217, 119, 6, 0.12)" :
                            s.feeStatus === "Overdue" ? "rgba(190, 18, 60, 0.12)" :
                            "rgba(124, 58, 237, 0.12)",
                          color:
                            s.feeStatus === "Paid" ? "#047857" :
                            s.feeStatus === "Pending" ? "#D97706" :
                            s.feeStatus === "Overdue" ? "#BE123C" :
                            "#7C3AED",
                          border: `1px solid ${
                            s.feeStatus === "Paid" ? "rgba(4, 120, 87, 0.3)" :
                            s.feeStatus === "Pending" ? "rgba(217, 119, 6, 0.3)" :
                            s.feeStatus === "Overdue" ? "rgba(190, 18, 60, 0.3)" :
                            "rgba(124, 58, 237, 0.3)"
                          }`
                        }}>
                          {s.feeStatus}
                        </span>
                      </td>

                      {/* 7. WALLET */}
                      <td style={{ padding: "12px 16px", fontWeight: 800, color: "#241A14", fontFeatureSettings: "'tnum'" }}>
                        {formatTaka(s.walletBalance, false)}
                      </td>

                      {/* 8. LAST ACTIVITY */}
                      <td style={{ padding: "12px 16px", color: "#8C7A6A", fontSize: "0.8rem" }}>
                        {s.lastActivity}
                      </td>

                      {/* 9. ACTIONS */}
                      <td style={{ padding: "12px 16px", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "6px" }}>
                          <button
                            type="button"
                            onClick={() => handleOpenDossier(s, false)}
                            style={{ background: "#FFF7E6", color: "#D35400", border: "1px solid rgba(196, 154, 108, 0.4)", padding: "5px 10px", borderRadius: "6px", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" }}
                            title="View Financial Context & Full Dossier"
                          >
                            <Eye size={12} /> Dossier
                          </button>

                          <button
                            type="button"
                            onClick={() => handleOpenDossier(s, true)}
                            style={{ background: "#FDF9F3", color: "#66564A", border: "1px solid rgba(196, 154, 108, 0.3)", padding: "5px 10px", borderRadius: "6px", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" }}
                            title="Edit Allowed Administrative Fields"
                          >
                            <Edit3 size={12} /> Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handlePromoteStudent(s)}
                            style={{ background: "#FDF9F3", color: "#047857", border: "1px solid rgba(4, 120, 87, 0.3)", padding: "5px 8px", borderRadius: "6px", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" }}
                            title="Promote to Next Semester"
                          >
                            <RefreshCw size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* PHASE 9 — WELFARE & DONATIONS AUDIT LEDGER PRESERVED */}
          <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "16px", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px", flexWrap: "wrap", gap: "10px" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: "#241A14" }}>
                  Student Welfare & Impact Donations Audit Ledger
                </h3>
                <p style={{ margin: "2px 0 0", fontSize: "0.84rem", color: "#66564A" }}>
                  Real-time audit log of student welfare contributions, gateway methods, and earned impact points.
                </p>
              </div>

              <span style={{ fontSize: "0.78rem", background: "#FFF7E6", border: "1px solid rgba(196, 154, 108, 0.4)", padding: "4px 12px", borderRadius: "999px", fontWeight: 700, color: "#D35400" }}>
                Formula: ৳100 Donated = 1 Impact Point
              </span>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
                <thead>
                  <tr style={{ background: "#FDF9F3", textAlign: "left", color: "#66564A", borderBottom: "1px solid rgba(196, 154, 108, 0.3)" }}>
                    <th style={{ padding: "12px 16px", fontWeight: 700 }}>Student Dossier</th>
                    <th style={{ padding: "12px 16px", fontWeight: 700 }}>Amount Donated</th>
                    <th style={{ padding: "12px 16px", fontWeight: 700 }}>Points Earned</th>
                    <th style={{ padding: "12px 16px", fontWeight: 700 }}>Payment Source</th>
                    <th style={{ padding: "12px 16px", fontWeight: 700 }}>Logged Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { student: store.studentProfile.name, id: store.studentProfile.studentId, amount: store.donations.totalDonated, points: store.donations.points, method: "bKash Mobile Banking", date: "2026-09-25 10:15 AM" },
                    { student: "Tanvir Rahman", id: "DCC-CSE-24-9001", amount: 2500, points: 25, method: "bKash Mobile Banking", date: "2026-09-24 04:30 PM" },
                    { student: "Anika Tabassum", id: "DCC-CSE-24-9002", amount: 1200, points: 12, method: "City Bank Visa Debit", date: "2026-09-22 01:10 PM" },
                    { student: "Sajid Khan", id: "DCC-EEE-24-8840", amount: 400, points: 4, method: "Dutch-Bangla Rocket", date: "2026-09-20 09:45 AM" },
                    { student: "Aria Rahman", id: "DCC-2024-9001", amount: 200, points: 2, method: "bKash Mobile Banking", date: "2026-09-18 11:20 AM" },
                  ].map((record, index) => (
                    <tr key={index} style={{ borderBottom: "1px solid rgba(196, 154, 108, 0.2)" }}>
                      <td style={{ padding: "12px 16px" }}>
                        <strong style={{ color: "#241A14", display: "block" }}>{record.student}</strong>
                        <span style={{ fontSize: "0.76rem", color: "#8C7A6A" }}>ID: {record.id}</span>
                      </td>
                      <td style={{ padding: "12px 16px", fontWeight: 800, color: "#241A14", fontFeatureSettings: "'tnum'" }}>
                        {formatTaka(record.amount, false)}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ background: "rgba(211, 84, 0, 0.12)", color: "#D35400", padding: "3px 10px", borderRadius: "999px", fontSize: "0.78rem", fontWeight: 800 }}>
                          +{record.points} Impact Pts
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", color: "#66564A" }}>
                        {record.method}
                      </td>
                      <td style={{ padding: "12px 16px", color: "#8C7A6A", fontSize: "0.82rem" }}>
                        {record.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === "bulk" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 800, color: "#241A14" }}>
              Bulk Fee Assignment
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: "0.9rem", color: "#66564A" }}>
              Batch fee creation tool. Assign fees to entire cohorts, departments, or sections simultaneously.
            </p>
          </div>

          <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "14px", padding: "24px" }}>
            <form onSubmit={handleBulkAssign} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#241A14", display: "block", marginBottom: "4px" }}>Fee Title</label>
                  <input
                    type="text"
                    value={bulkTitle}
                    onChange={(e) => setBulkTitle(e.target.value)}
                    style={{ width: "100%", padding: "10px 12px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "10px", color: "#241A14", outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#241A14", display: "block", marginBottom: "4px" }}>Amount (৳)</label>
                  <input
                    type="number"
                    value={bulkAmount}
                    onChange={(e) => setBulkAmount(Number(e.target.value))}
                    style={{ width: "100%", padding: "10px 12px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "10px", color: "#241A14", outline: "none", fontWeight: 800 }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#241A14", display: "block", marginBottom: "4px" }}>Due Date</label>
                  <input
                    type="date"
                    value={bulkDueDate}
                    onChange={(e) => setBulkDueDate(e.target.value)}
                    style={{ width: "100%", padding: "10px 12px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "10px", color: "#241A14", outline: "none" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#241A14", display: "block", marginBottom: "4px" }}>Category</label>
                  <select
                    value={bulkCategory}
                    onChange={(e) => setBulkCategory(e.target.value as any)}
                    style={{ width: "100%", padding: "10px 12px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "10px", color: "#241A14", outline: "none" }}
                  >
                    <option value="Tuition">Tuition</option>
                    <option value="Lab & Tech">Lab & Tech</option>
                    <option value="Exam">Exam</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#241A14", display: "block", marginBottom: "4px" }}>Target Class / Year</label>
                  <select
                    value={targetClass}
                    onChange={(e) => setTargetClass(e.target.value)}
                    style={{ width: "100%", padding: "10px 12px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "10px", color: "#241A14", outline: "none" }}
                  >
                    <option value="CSE 3rd Semester">CSE 3rd Semester</option>
                    <option value="Inter 1st Year">Inter 1st Year</option>
                    <option value="Inter 2nd Year">Inter 2nd Year</option>
                    <option value="EEE 1st Semester">EEE 1st Semester</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#241A14", display: "block", marginBottom: "4px" }}>Target Section</label>
                  <select
                    value={targetSection}
                    onChange={(e) => setTargetSection(e.target.value)}
                    style={{ width: "100%", padding: "10px 12px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "10px", color: "#241A14", outline: "none" }}
                  >
                    <option value="Sec A">Sec A</option>
                    <option value="Sec B">Sec B</option>
                    <option value="All Sections">All Sections</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="ms-btn-primary" style={{ background: "#D35400", color: "#FFFFFF", padding: "12px 20px", borderRadius: "10px", fontWeight: 700, alignSelf: "flex-end", marginTop: "8px" }}>
                <CheckCircle2 size={18} /> Apply Fee Assignment to Selected Cohort
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. EXCEL IMPORT TAB */}
      {activeTab === "import" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 800, color: "#241A14" }}>
              Excel Student Roster Import
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: "0.9rem", color: "#66564A" }}>
              Upload Excel (.xlsx, .csv) student files with automated column validation.
            </p>
          </div>

          <div style={{ background: "#FFFFFF", border: "2px dashed rgba(196, 154, 108, 0.4)", borderRadius: "14px", padding: "40px", textAlign: "center" }}>
            <FileSpreadsheet size={48} style={{ color: "#D35400", margin: "0 auto 12px" }} />
            <h3 style={{ margin: "0 0 6px", color: "#241A14", fontSize: "1.2rem", fontWeight: 700 }}>Drag & Drop Excel Roster File Here</h3>
            <p style={{ color: "#66564A", fontSize: "0.85rem", margin: "0 0 16px" }}>
              Supported formats: .xlsx, .csv (Columns: Name, StudentID, Department, ClassSection, Email)
            </p>
            <button type="button" className="ms-btn-secondary" onClick={() => setImportFileName("DCC-CSE-2026-Roster.xlsx")} style={{ background: "#FDF9F3", color: "#241A14", border: "1px solid rgba(196, 154, 108, 0.3)", padding: "10px 18px", borderRadius: "10px", fontWeight: 600 }}>
              Select Sample Excel File
            </button>
          </div>

          {importFileName && (
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "14px", padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#241A14" }}>
                  File Preview: <span style={{ color: "#D35400" }}>{importFileName}</span> ({importRows.length} Records Validated)
                </h3>
                <StatusBadge status="verified" customLabel="Validation Passed" />
              </div>

              <div style={{ border: "1px solid rgba(196, 154, 108, 0.2)", borderRadius: "10px", overflow: "hidden", marginBottom: "16px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                  <thead>
                    <tr style={{ background: "#FDF9F3", color: "#66564A" }}>
                      <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700 }}>Name</th>
                      <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700 }}>Student ID</th>
                      <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700 }}>Department</th>
                      <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700 }}>Class & Section</th>
                      <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: 700 }}>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importRows.map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid rgba(196, 154, 108, 0.15)" }}>
                        <td style={{ padding: "10px 14px", fontWeight: 700, color: "#241A14" }}>{row.name}</td>
                        <td style={{ padding: "10px 14px", fontWeight: 700, color: "#D35400" }}>{row.studentId}</td>
                        <td style={{ padding: "10px 14px", color: "#66564A" }}>{row.department}</td>
                        <td style={{ padding: "10px 14px", color: "#66564A" }}>{row.classSection}</td>
                        <td style={{ padding: "10px 14px", color: "#66564A" }}>{row.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button type="button" className="ms-btn-secondary" onClick={() => setImportFileName(null)} style={{ background: "#FDF9F3", color: "#241A14", border: "1px solid rgba(196, 154, 108, 0.3)", padding: "10px 18px", borderRadius: "10px", fontWeight: 600 }}>
                  Cancel
                </button>
                <button type="button" className="ms-btn-primary" onClick={handleExcelImportConfirm} style={{ background: "#D35400", color: "#FFFFFF", padding: "10px 20px", borderRadius: "10px", fontWeight: 700 }}>
                  Confirm & Import All Records
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. AUDIT LOGS TAB */}
      {activeTab === "audit" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 800, color: "#241A14" }}>
              Institutional Audit Logs
            </h1>
            <p style={{ margin: "4px 0 0", fontSize: "0.9rem", color: "#66564A" }}>
              Immutable audit trail tracking all fee assignments, student approvals, and payment actions.
            </p>
          </div>

          <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "14px", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
              <thead>
                <tr style={{ background: "#FDF9F3", textAlign: "left", color: "#66564A", borderBottom: "1px solid rgba(196, 154, 108, 0.3)" }}>
                  <th style={{ padding: "12px 18px", fontWeight: 700 }}>Actor</th>
                  <th style={{ padding: "12px 18px", fontWeight: 700 }}>Role</th>
                  <th style={{ padding: "12px 18px", fontWeight: 700 }}>Action</th>
                  <th style={{ padding: "12px 18px", fontWeight: 700 }}>Details</th>
                  <th style={{ padding: "12px 18px", fontWeight: 700 }}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {store.auditLogs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: "1px solid rgba(196, 154, 108, 0.2)" }}>
                    <td style={{ padding: "12px 18px", fontWeight: 700, color: "#241A14" }}>{log.actor}</td>
                    <td style={{ padding: "12px 18px" }}>
                      <span style={{ padding: "3px 8px", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700, background: "rgba(211, 84, 0, 0.1)", color: "#D35400" }}>
                        {log.role}
                      </span>
                    </td>
                    <td style={{ padding: "12px 18px", fontWeight: 700, color: "#241A14" }}>{log.action}</td>
                    <td style={{ padding: "12px 18px", color: "#66564A" }}>{log.details}</td>
                    <td style={{ padding: "12px 18px", color: "#8C7A6A" }}>{log.timestamp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* PHASE 9 — STUDENT WELFARE & DONATIONS AUDIT LEDGER */}
          <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "16px", padding: "20px", marginTop: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#241A14" }}>
                  Student Welfare & Impact Donations Audit Ledger
                </h3>
                <p style={{ margin: "2px 0 0", fontSize: "0.84rem", color: "#66564A" }}>
                  Real-time audit log of student welfare contributions, gateway methods, and earned impact points.
                </p>
              </div>

              <span style={{ fontSize: "0.78rem", background: "#FFF7E6", border: "1px solid rgba(196, 154, 108, 0.4)", padding: "4px 12px", borderRadius: "999px", fontWeight: 700, color: "#D35400" }}>
                Formula: ৳100 Donated = 1 Impact Point
              </span>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
                <thead>
                  <tr style={{ background: "#FDF9F3", textAlign: "left", color: "#66564A", borderBottom: "1px solid rgba(196, 154, 108, 0.3)" }}>
                    <th style={{ padding: "12px 16px", fontWeight: 700 }}>Student Dossier</th>
                    <th style={{ padding: "12px 16px", fontWeight: 700 }}>Amount Donated</th>
                    <th style={{ padding: "12px 16px", fontWeight: 700 }}>Points Earned</th>
                    <th style={{ padding: "12px 16px", fontWeight: 700 }}>Payment Source</th>
                    <th style={{ padding: "12px 16px", fontWeight: 700 }}>Logged Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { student: store.studentProfile.name, id: store.studentProfile.studentId, amount: store.donations.totalDonated, points: store.donations.points, method: "bKash Mobile Banking", date: "2026-09-25 10:15 AM" },
                    { student: "Tanvir Rahman", id: "DCC-CSE-24-9001", amount: 2500, points: 25, method: "bKash Mobile Banking", date: "2026-09-24 04:30 PM" },
                    { student: "Anika Tabassum", id: "DCC-CSE-24-9002", amount: 1200, points: 12, method: "City Bank Visa Debit", date: "2026-09-22 01:10 PM" },
                    { student: "Sajid Khan", id: "DCC-EEE-24-8840", amount: 400, points: 4, method: "Dutch-Bangla Rocket", date: "2026-09-20 09:45 AM" },
                    { student: "Aria Rahman", id: "DCC-2024-9001", amount: 200, points: 2, method: "bKash Mobile Banking", date: "2026-09-18 11:20 AM" },
                  ].map((record, index) => (
                    <tr key={index} style={{ borderBottom: "1px solid rgba(196, 154, 108, 0.2)" }}>
                      <td style={{ padding: "12px 16px" }}>
                        <strong style={{ color: "#241A14", display: "block" }}>{record.student}</strong>
                        <span style={{ fontSize: "0.76rem", color: "#8C7A6A" }}>ID: {record.id}</span>
                      </td>
                      <td style={{ padding: "12px 16px", fontWeight: 800, color: "#241A14", fontFeatureSettings: "'tnum'" }}>
                        {formatTaka(record.amount, false)}
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ background: "rgba(211, 84, 0, 0.12)", color: "#D35400", padding: "3px 10px", borderRadius: "999px", fontSize: "0.78rem", fontWeight: 800 }}>
                          +{record.points} Impact Pts
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px", color: "#66564A" }}>
                        {record.method}
                      </td>
                      <td style={{ padding: "12px 16px", color: "#8C7A6A", fontSize: "0.82rem" }}>
                        {record.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

            {/* 6. HUMAN SUPPORT ESCALATION QUEUE (PHASE 8) */}
      {activeTab === "escalations" && (() => {
        const escalationsList = store.escalations || [];
        const openCount = escalationsList.filter(e => e.status === "open").length;
        const progressCount = escalationsList.filter(e => e.status === "in_progress").length;
        const resolvedCount = escalationsList.filter(e => e.status === "resolved").length;

        const filteredTickets = escalationsList.filter(t => {
          if (escalationFilter === "open" && t.status !== "open") return false;
          if (escalationFilter === "in_progress" && t.status !== "in_progress") return false;
          if (escalationFilter === "resolved" && t.status !== "resolved") return false;

          if (escalationSearch.trim()) {
            const q = escalationSearch.toLowerCase().trim();
            const matchId = t.id.toLowerCase().includes(q);
            const matchName = t.studentName.toLowerCase().includes(q);
            const matchIdNum = t.studentId.toLowerCase().includes(q);
            const matchSubject = t.subject.toLowerCase().includes(q);
            if (!matchId && !matchName && !matchIdNum && !matchSubject) return false;
          }
          return true;
        });

        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* PAGE HEADER */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <h1 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 800, color: "#241A14" }}>
                  Human Support Escalation Queue
                </h1>
                <p style={{ margin: "4px 0 0", fontSize: "0.9rem", color: "#66564A" }}>
                  Review and reply to student support inquiries escalated from the Neo AI Financial Assistant.
                </p>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <span style={{ fontSize: "0.78rem", background: "#FFF7E6", border: "1px solid rgba(196, 154, 108, 0.4)", padding: "6px 14px", borderRadius: "999px", fontWeight: 700, color: "#241A14", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <ShieldCheck size={14} style={{ color: "#047857" }} /> Institutional Support Desk
                </span>
              </div>
            </div>

            {/* METRIC SUMMARY CARDS */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px" }}>
              <div style={{ background: "#FFFFFF", border: openCount > 0 ? "2px solid #D35400" : "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "14px", padding: "20px" }}>
                <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#D35400", textTransform: "uppercase" }}>Open Pending Escalations</span>
                <h2 style={{ margin: "4px 0 0", fontSize: "2rem", fontWeight: 800, color: "#241A14" }}>{openCount} Ticket{openCount !== 1 ? "s" : ""}</h2>
              </div>

              <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "14px", padding: "20px" }}>
                <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#8C7A6A", textTransform: "uppercase" }}>In Progress (Under Review)</span>
                <h2 style={{ margin: "4px 0 0", fontSize: "2rem", fontWeight: 800, color: "#9A6600" }}>{progressCount} Ticket{progressCount !== 1 ? "s" : ""}</h2>
              </div>

              <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "14px", padding: "20px" }}>
                <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#8C7A6A", textTransform: "uppercase" }}>Resolved Support Tickets</span>
                <h2 style={{ margin: "4px 0 0", fontSize: "2rem", fontWeight: 800, color: "#047857" }}>{resolvedCount} Ticket{resolvedCount !== 1 ? "s" : ""}</h2>
              </div>
            </div>

            {/* FILTER TABS & SEARCH BAR */}
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "16px", padding: "18px 20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
                
                {/* Filter Tabs */}
                <div style={{ display: "flex", gap: "8px" }}>
                  {[
                    { id: "all", label: "All Support Tickets", count: escalationsList.length },
                    { id: "open", label: "Open", count: openCount },
                    { id: "in_progress", label: "In Progress", count: progressCount },
                    { id: "resolved", label: "Resolved", count: resolvedCount },
                  ].map((tab) => {
                    const isActive = escalationFilter === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => setEscalationFilter(tab.id as any)}
                        style={{
                          background: isActive ? "#D35400" : "#FDF9F3",
                          color: isActive ? "#FFFFFF" : "#241A14",
                          border: isActive ? "1px solid #D35400" : "1px solid rgba(196, 154, 108, 0.3)",
                          padding: "6px 14px",
                          borderRadius: "999px",
                          fontSize: "0.82rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                        }}
                      >
                        {tab.label}
                        <span style={{ background: isActive ? "rgba(255,255,255,0.25)" : "rgba(36,26,20,0.08)", padding: "2px 6px", borderRadius: "999px", fontSize: "0.74rem" }}>
                          {tab.count}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Search Bar */}
                <div style={{ position: "relative", minWidth: "260px", flex: "1 1 260px", maxWidth: "360px" }}>
                  <Search size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#8C7A6A" }} />
                  <input
                    type="text"
                    placeholder="Search by student name, ID, or subject..."
                    value={escalationSearch}
                    onChange={(e) => setEscalationSearch(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "8px 12px 8px 34px",
                      background: "#FDF9F3",
                      border: "1px solid rgba(196, 154, 108, 0.35)",
                      borderRadius: "10px",
                      color: "#241A14",
                      fontSize: "0.84rem",
                      outline: "none",
                    }}
                  />
                  {escalationSearch && (
                    <button type="button" onClick={() => setEscalationSearch("")} style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#8C7A6A", cursor: "pointer" }}>
                      <X size={14} />
                    </button>
                  )}
                </div>

              </div>
            </div>

            {/* TICKETS TABLE LISTING */}
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "16px", overflow: "hidden" }}>
              {filteredTickets.length === 0 ? (
                <div style={{ padding: "48px 20px", textAlign: "center", color: "#66564A" }}>
                  <MessageSquare size={42} style={{ color: "#8C7A6A", marginBottom: "12px" }} />
                  <h4 style={{ margin: "0 0 6px", color: "#241A14", fontSize: "1.1rem" }}>No support escalations found</h4>
                  <p style={{ margin: 0, fontSize: "0.86rem" }}>No student tickets match the selected filter or search terms.</p>
                </div>
              ) : (
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
                    <thead>
                      <tr style={{ background: "#FDF9F3", textAlign: "left", color: "#66564A", borderBottom: "1px solid rgba(196, 154, 108, 0.3)" }}>
                        <th style={{ padding: "14px 18px", fontWeight: 700 }}>Ticket ID</th>
                        <th style={{ padding: "14px 18px", fontWeight: 700 }}>Student Dossier</th>
                        <th style={{ padding: "14px 18px", fontWeight: 700 }}>Institution & Dept</th>
                        <th style={{ padding: "14px 18px", fontWeight: 700 }}>Subject</th>
                        <th style={{ padding: "14px 18px", fontWeight: 700 }}>Logged At</th>
                        <th style={{ padding: "14px 18px", fontWeight: 700 }}>Status</th>
                        <th style={{ padding: "14px 18px", fontWeight: 700, textAlign: "right" }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTickets.map((ticket) => (
                        <tr key={ticket.id} style={{ borderBottom: "1px solid rgba(196, 154, 108, 0.2)" }}>
                          <td style={{ padding: "14px 18px", fontWeight: 800, color: "#D35400" }}>
                            #{ticket.id}
                          </td>
                          <td style={{ padding: "14px 18px" }}>
                            <strong style={{ color: "#241A14", display: "block" }}>{ticket.studentName}</strong>
                            <span style={{ fontSize: "0.78rem", color: "#8C7A6A" }}>ID: {ticket.studentId}</span>
                          </td>
                          <td style={{ padding: "14px 18px", color: "#66564A" }}>
                            <div>{ticket.institution}</div>
                            <span style={{ fontSize: "0.76rem", color: "#8C7A6A" }}>{ticket.department}</span>
                          </td>
                          <td style={{ padding: "14px 18px", fontWeight: 600, color: "#241A14" }}>
                            {ticket.subject}
                            <span style={{ fontSize: "0.75rem", color: "#8C7A6A", display: "block", marginTop: "2px" }}>
                              {ticket.messages.length} message(s) in thread
                            </span>
                          </td>
                          <td style={{ padding: "14px 18px", color: "#66564A", fontSize: "0.82rem" }}>
                            {ticket.createdAt}
                          </td>
                          <td style={{ padding: "14px 18px" }}>
                            <StatusBadge
                              status={ticket.status === "resolved" ? "approved" : ticket.status === "in_progress" ? "pending" : "due"}
                              customLabel={ticket.status === "open" ? "Open Ticket" : ticket.status === "in_progress" ? "In Progress" : "Resolved"}
                            />
                          </td>
                          <td style={{ padding: "14px 18px", textAlign: "right" }}>
                            <button
                              type="button"
                              onClick={() => setSelectedEscalation(ticket)}
                              style={{
                                background: "#D35400",
                                color: "#FFFFFF",
                                border: "none",
                                padding: "6px 14px",
                                borderRadius: "8px",
                                fontSize: "0.8rem",
                                fontWeight: 700,
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              <MessageSquare size={14} /> Respond & View Thread 💬
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        );
      })()}

      {/* ESCALATION TICKET RESPONSE MODAL */}
      {selectedEscalation && (
        <div className="ms-modal-overlay">
          <div className="ms-modal" style={{ maxWidth: "680px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px", borderBottom: "1px solid rgba(196, 154, 108, 0.3)", paddingBottom: "12px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                  <h3 style={{ margin: 0, color: "#241A14", fontSize: "1.25rem", fontWeight: 800 }}>
                    Support Escalation #{selectedEscalation.id}
                  </h3>
                  <StatusBadge
                    status={selectedEscalation.status === "resolved" ? "approved" : selectedEscalation.status === "in_progress" ? "pending" : "due"}
                    customLabel={selectedEscalation.status}
                  />
                </div>
                <p style={{ margin: 0, color: "#66564A", fontSize: "0.84rem" }}>
                  Student: <strong>{selectedEscalation.studentName}</strong> ({selectedEscalation.studentId}) • {selectedEscalation.institution}
                </p>
              </div>

              <button type="button" onClick={() => setSelectedEscalation(null)} style={{ background: "none", border: "none", color: "#66564A", cursor: "pointer", padding: "4px" }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              
              {/* Subject Banner */}
              <div style={{ background: "#FFF7E6", border: "1px solid rgba(211, 84, 0, 0.3)", padding: "12px 16px", borderRadius: "10px", color: "#241A14", fontWeight: 700, fontSize: "0.92rem" }}>
                Topic: {selectedEscalation.subject}
              </div>

              {/* Conversation Thread */}
              <div style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "14px", padding: "16px", maxHeight: "280px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "12px" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#8C7A6A", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  Conversation Thread
                </span>
                
                {selectedEscalation.messages.map((msg) => (
                  <div
                    key={msg.id}
                    style={{
                      alignSelf: msg.sender === "admin" ? "flex-end" : "flex-start",
                      maxWidth: "85%",
                      background: msg.sender === "admin" ? "#D35400" : msg.sender === "ai" ? "#FFFFFF" : "#FFF7E6",
                      color: msg.sender === "admin" ? "#FFFFFF" : "#241A14",
                      padding: "12px 14px",
                      borderRadius: "12px",
                      border: msg.sender === "admin" ? "none" : "1px solid rgba(196, 154, 108, 0.3)",
                      fontSize: "0.88rem",
                      lineHeight: 1.5,
                    }}
                  >
                    <span style={{ fontSize: "0.72rem", fontWeight: 800, display: "block", marginBottom: "4px", color: msg.sender === "admin" ? "#FFF7E6" : "#D35400" }}>
                      {msg.senderName || msg.sender} • {msg.timestamp}
                    </span>
                    <div>{msg.text}</div>
                  </div>
                ))}
              </div>

              {/* Admin Response Form */}
              <form onSubmit={handleSendAdminReply} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#241A14", display: "block", marginBottom: "6px" }}>
                    Official Admin Response to Student Thread
                  </label>
                  <textarea
                    rows={3}
                    value={adminReplyInput}
                    onChange={(e) => setAdminReplyInput(e.target.value)}
                    placeholder="Type official institutional guidance or decision for the student..."
                    style={{ width: "100%", padding: "12px", background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "10px", color: "#241A14", outline: "none", fontSize: "0.9rem" }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "4px" }}>
                  <button
                    type="button"
                    onClick={() => handleResolveTicket(selectedEscalation.id)}
                    style={{ background: "#FDF9F3", color: "#047857", border: "1px solid rgba(16, 185, 129, 0.4)", padding: "8px 16px", borderRadius: "10px", fontSize: "0.84rem", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}
                  >
                    <CheckCircle2 size={16} /> Mark Ticket Resolved
                  </button>

                  <div style={{ display: "flex", gap: "8px" }}>
                    <button type="button" className="ms-btn-secondary" onClick={() => setSelectedEscalation(null)} style={{ background: "#FDF9F3", color: "#241A14", border: "1px solid rgba(196, 154, 108, 0.3)", padding: "8px 16px", borderRadius: "10px", fontWeight: 600, fontSize: "0.85rem" }}>
                      Close
                    </button>
                    <button type="submit" className="ms-btn-primary" style={{ background: "#D35400", color: "#FFFFFF", padding: "8px 18px", borderRadius: "10px", fontWeight: 700, fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                      <Send size={15} /> Send Admin Reply 🚀
                    </button>
                  </div>
                </div>
              </form>

            </div>
          </div>
        </div>
      )}


{/* 7. INSTITUTIONAL REMINDER RULES & ALERT ENGINE (PHASE 10) */}
      {activeTab === "reminders" && (() => {
        const rules = store.reminderRules || {
          weeklyReminderEnabled: true,
          nearDeadlineDays: 5,
          finalDayAlertEnabled: true,
          overduePenaltyNotice: true,
        };

        const handleToggleRule = (key: keyof typeof rules, value: any) => {
          actions.updateReminderRules({ [key]: value });
        };

        const handleRunReminders = () => {
          const res = actions.triggerRemindersRun();
          alert(`Automated Reminder Engine Executed! Successfully dispatched ${res.count} fee notification alert(s) across student profiles.`);
        };

        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* HEADER */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <h1 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 800, color: "#241A14" }}>
                  Institutional Reminder Rules & Automated Alert Engine
                </h1>
                <p style={{ margin: "4px 0 0", fontSize: "0.9rem", color: "#66564A" }}>
                  Configure automated fee reminder thresholds, near-deadline warnings, and trigger bulk notification dispatches.
                </p>
              </div>

              <button
                type="button"
                className="ms-btn-primary"
                onClick={handleRunReminders}
                style={{ background: "#D35400", color: "#FFFFFF", padding: "10px 20px", borderRadius: "10px", fontSize: "0.9rem", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <Zap size={16} /> Trigger Automated Reminders Run Now 🚀
              </button>
            </div>

            {/* REMINDER RULES CONFIGURATION GRID */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
              
              {/* RULE 1: WEEKLY REMINDERS */}
              <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "16px", padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <div style={{ fontWeight: 800, color: "#241A14", fontSize: "1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                    <Bell size={18} style={{ color: "#D35400" }} /> Weekly Automated Reminder
                  </div>
                  <input
                    type="checkbox"
                    checked={rules.weeklyReminderEnabled}
                    onChange={(e) => handleToggleRule("weeklyReminderEnabled", e.target.checked)}
                    style={{ width: "18px", height: "18px", accentColor: "#D35400", cursor: "pointer" }}
                  />
                </div>
                <p style={{ margin: 0, fontSize: "0.84rem", color: "#66564A", lineHeight: 1.4 }}>
                  Sends scheduled weekly summary notifications to students with active unpaid semester fees.
                </p>
                <span style={{ fontSize: "0.76rem", color: rules.weeklyReminderEnabled ? "#047857" : "#8C7A6A", fontWeight: 700, marginTop: "10px", display: "block" }}>
                  Status: {rules.weeklyReminderEnabled ? "● ACTIVE & RUNNING" : "○ DISABLED"}
                </span>
              </div>

              {/* RULE 2: NEAR-DEADLINE THRESHOLD */}
              <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "16px", padding: "20px" }}>
                <div style={{ fontWeight: 800, color: "#241A14", fontSize: "1rem", marginBottom: "8px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Clock size={18} style={{ color: "#D35400" }} /> Near-Deadline Alert Threshold
                </div>
                <p style={{ margin: "0 0 10px", fontSize: "0.84rem", color: "#66564A" }}>
                  Trigger high-priority alert when fee due date falls within selected threshold days.
                </p>
                <select
                  value={rules.nearDeadlineDays}
                  onChange={(e) => handleToggleRule("nearDeadlineDays", Number(e.target.value))}
                  style={{ width: "100%", padding: "8px 12px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", color: "#241A14", fontWeight: 700, outline: "none" }}
                >
                  <option value={3}>3 Days Prior to Due Date</option>
                  <option value={5}>5 Days Prior to Due Date (Recommended)</option>
                  <option value={7}>7 Days Prior to Due Date</option>
                  <option value={10}>10 Days Prior to Due Date</option>
                </select>
              </div>

              {/* RULE 3: FINAL-DAY EMERGENCY ALERT */}
              <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "16px", padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <div style={{ fontWeight: 800, color: "#241A14", fontSize: "1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                    <AlertTriangle size={18} style={{ color: "#BE123C" }} /> Final-Day Emergency Alert
                  </div>
                  <input
                    type="checkbox"
                    checked={rules.finalDayAlertEnabled}
                    onChange={(e) => handleToggleRule("finalDayAlertEnabled", e.target.checked)}
                    style={{ width: "18px", height: "18px", accentColor: "#D35400", cursor: "pointer" }}
                  />
                </div>
                <p style={{ margin: 0, fontSize: "0.84rem", color: "#66564A", lineHeight: 1.4 }}>
                  Dispatches emergency notifications on the exact deadline date warning of final payment window.
                </p>
                <span style={{ fontSize: "0.76rem", color: rules.finalDayAlertEnabled ? "#047857" : "#8C7A6A", fontWeight: 700, marginTop: "10px", display: "block" }}>
                  Status: {rules.finalDayAlertEnabled ? "● ACTIVE & RUNNING" : "○ DISABLED"}
                </span>
              </div>

              {/* RULE 4: MISSED DEADLINE LATE FEE NOTICE */}
              <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "16px", padding: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <div style={{ fontWeight: 800, color: "#241A14", fontSize: "1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                    <XCircle size={18} style={{ color: "#BE123C" }} /> Missed Deadline Overdue Alert
                  </div>
                  <input
                    type="checkbox"
                    checked={rules.overduePenaltyNotice}
                    onChange={(e) => handleToggleRule("overduePenaltyNotice", e.target.checked)}
                    style={{ width: "18px", height: "18px", accentColor: "#D35400", cursor: "pointer" }}
                  />
                </div>
                <p style={{ margin: 0, fontSize: "0.84rem", color: "#66564A", lineHeight: 1.4 }}>
                  Notifies students immediately upon passing due date with instructions for hardship waiver or split request.
                </p>
                <span style={{ fontSize: "0.76rem", color: rules.overduePenaltyNotice ? "#047857" : "#8C7A6A", fontWeight: 700, marginTop: "10px", display: "block" }}>
                  Status: {rules.overduePenaltyNotice ? "● ACTIVE & RUNNING" : "○ DISABLED"}
                </span>
              </div>

            </div>

            {/* AUDIT SUMMARY BOX */}
            <div style={{ background: "#FFF7E6", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "14px", padding: "16px", fontSize: "0.85rem", color: "#66564A", display: "flex", alignItems: "center", gap: "10px" }}>
              <ShieldCheck size={20} style={{ color: "#047857", flexShrink: 0 }} />
              <div>
                <strong>Administrative Control Policy:</strong> Reminder dispatches are logged to the institutional audit log. Clicking "Trigger Automated Reminders Run Now" scans active unpaid fees and pushes alerts to student notification trays instantly.
              </div>
            </div>

          </div>
        );
      })()}

      {/* REVIEW APPLICATION MODAL */}
      {reviewApp && (
        <div className="ms-modal-overlay">
          <div className="ms-modal" style={{ maxWidth: "620px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <h3 style={{ margin: 0, color: "#241A14", fontSize: "1.2rem", fontWeight: 700 }}>Admin Dossier Review — Partial Payment</h3>
              <button type="button" onClick={() => setReviewApp(null)} style={{ background: "none", border: "none", color: "#66564A", cursor: "pointer" }}>
                <X size={18} />
              </button>
            </div>

            <p style={{ margin: "0 0 16px", color: "#66564A", fontSize: "0.88rem" }}>
              Application ID: <strong style={{ color: "#D35400" }}>{reviewApp.id}</strong> • Submitted: {reviewApp.submittedAt}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", background: "#FDF9F3", padding: "16px", borderRadius: "12px", border: "1px solid rgba(196, 154, 108, 0.3)", fontSize: "0.88rem", marginBottom: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <span style={{ color: "#8C7A6A", fontSize: "0.78rem" }}>Student Profile</span>
                  <p style={{ margin: "2px 0 0", fontWeight: 700, color: "#241A14" }}>{reviewApp.studentName} ({reviewApp.studentId})</p>
                </div>
                <div>
                  <span style={{ color: "#8C7A6A", fontSize: "0.78rem" }}>Guardian Info</span>
                  <p style={{ margin: "2px 0 0", fontWeight: 700, color: "#241A14" }}>{reviewApp.guardianName} ({reviewApp.guardianPhone})</p>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <span style={{ color: "#8C7A6A", fontSize: "0.78rem" }}>Target Fee Item</span>
                  <p style={{ margin: "2px 0 0", fontWeight: 700, color: "#241A14" }}>{reviewApp.feeTitle}</p>
                </div>
                <div>
                  <span style={{ color: "#8C7A6A", fontSize: "0.78rem" }}>Financial Breakdown</span>
                  <p style={{ margin: "2px 0 0", fontWeight: 800, color: "#047857", fontSize: "1.05rem" }}>
                    Requested: {formatTaka(reviewApp.requestedAmount, false)} <span style={{ fontSize: "0.78rem", color: "#8C7A6A", textDecoration: "line-through" }}>Original {formatTaka(reviewApp.originalAmount, false)}</span>
                  </p>
                </div>
              </div>

              <div>
                <span style={{ color: "#8C7A6A", fontSize: "0.78rem" }}>Stated Hardship Reason</span>
                <p style={{ margin: "2px 0 0", color: "#241A14" }}>"{reviewApp.reason}"</p>
              </div>

              {reviewApp.statement && (
                <div>
                  <span style={{ color: "#8C7A6A", fontSize: "0.78rem" }}>Student Statement</span>
                  <p style={{ margin: "2px 0 0", color: "#66564A", fontStyle: "italic" }}>"{reviewApp.statement}"</p>
                </div>
              )}

              {/* Uploaded Documents & AI Verification Signal */}
              <div style={{ background: "#FFFFFF", padding: "12px", borderRadius: "10px", border: "1px solid rgba(196, 154, 108, 0.25)", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.82rem" }}>
                  <span>Attached Guardian Document: <strong style={{ color: "#241A14" }}>📄 {reviewApp.guardianIdDocUrl}</strong></span>
                  <span>Signature Doc: <strong style={{ color: "#241A14" }}>✍️ {reviewApp.signatureDocUrl}</strong></span>
                </div>
                <div style={{ background: "rgba(16, 185, 129, 0.12)", padding: "8px 12px", borderRadius: "6px", color: "#047857", fontSize: "0.82rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span><Sparkles size={14} style={{ display: "inline", verticalAlign: "middle", marginRight: "4px" }} /> AI Signature Match Signal:</span>
                  <strong>{reviewApp.aiMatchScore}% Score ({reviewApp.aiMatchStatus})</strong>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button type="button" className="ms-btn-primary" onClick={() => handleForwardToHead(reviewApp.id)} style={{ background: "#D35400", color: "#FFFFFF", padding: "10px 18px", borderRadius: "10px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                <CheckCircle2 size={16} /> Verify & Forward to Head / Director for Approval
              </button>

              <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                <input
                  type="text"
                  placeholder="Feedback notes (for change request or decline)..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  style={{ flex: 1, padding: "8px 12px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "10px", color: "#241A14", outline: "none", fontSize: "0.82rem" }}
                />
                <button type="button" onClick={() => handleRequestChangesByAdmin(reviewApp.id)} style={{ color: "#D35400", background: "#FDF9F3", border: "1px solid rgba(211, 84, 0, 0.3)", padding: "8px 12px", borderRadius: "10px", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer" }}>
                  Request Changes
                </button>
                <button type="button" className="ms-btn-secondary" style={{ color: "#BE123C", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", padding: "8px 14px", borderRadius: "10px", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer" }} onClick={() => handleRejectByAdmin(reviewApp.id)}>
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PHASE 12 — STUDENT FINANCIAL DOSSIER & ADMINISTRATIVE EDIT MODAL */}
      {selectedStudentDossier && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(36, 26, 20, 0.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "20px" }}>
          <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.4)", borderRadius: "20px", width: "100%", maxWidth: "950px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 24px 48px rgba(36, 26, 20, 0.25)", display: "flex", flexDirection: "column" }}>
            
            {/* MODAL HEADER */}
            <div style={{ padding: "20px 24px", background: "#FFF7E6", borderBottom: "1px solid rgba(196, 154, 108, 0.3)", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{ width: "48px", height: "48px", borderRadius: "50%", background: "#D35400", color: "#FFFFFF", fontWeight: 800, fontSize: "1.2rem", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 10px rgba(211, 84, 0, 0.3)" }}>
                  {selectedStudentDossier.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    <h2 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800, color: "#241A14" }}>
                      {selectedStudentDossier.name}
                    </h2>
                    <span style={{ fontFamily: "monospace", fontSize: "0.82rem", fontWeight: 700, color: "#D35400", background: "rgba(211, 84, 0, 0.1)", padding: "2px 8px", borderRadius: "6px" }}>
                      {selectedStudentDossier.studentId}
                    </span>
                    {selectedStudentDossier.verified && (
                      <span style={{ background: "rgba(4, 120, 87, 0.12)", color: "#047857", fontSize: "0.74rem", fontWeight: 800, padding: "2px 8px", borderRadius: "999px", display: "inline-flex", alignItems: "center", gap: "4px" }}>
                        <CheckCircle2 size={12} /> Verified
                      </span>
                    )}
                  </div>
                  <p style={{ margin: "2px 0 0", fontSize: "0.84rem", color: "#66564A" }}>
                    {selectedStudentDossier.department} • {selectedStudentDossier.classYear} ({selectedStudentDossier.section}) • {selectedStudentDossier.email}
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                <button
                  type="button"
                  onClick={() => setIsEditingAdminFields(!isEditingAdminFields)}
                  style={{ background: isEditingAdminFields ? "#D35400" : "#FFFFFF", color: isEditingAdminFields ? "#FFFFFF" : "#D35400", border: "1px solid #D35400", padding: "8px 14px", borderRadius: "10px", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  <Edit3 size={14} /> {isEditingAdminFields ? "Cancel Edit" : "Edit Admin Fields"}
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedStudentDossier(null)}
                  style={{ background: "none", border: "none", color: "#8C7A6A", cursor: "pointer", padding: "6px" }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* ADMIN EDITABLE FIELDS FORM (WHEN TOGGLED) */}
            {isEditingAdminFields && (
              <form onSubmit={handleSaveAdminEdits} style={{ padding: "18px 24px", background: "#FDF9F3", borderBottom: "1.5px solid rgba(211, 84, 0, 0.3)", display: "flex", flexDirection: "column", gap: "14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <ShieldCheck size={16} color="#D35400" />
                  <strong style={{ fontSize: "0.9rem", color: "#241A14" }}>
                    Edit Administrative & Enrolment Fields
                  </strong>
                  <span style={{ fontSize: "0.78rem", color: "#8C7A6A" }}>
                    (Allowed administrative modifications re-calculate institutional class section string)
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
                  {/* STATUS */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#66564A", marginBottom: "4px" }}>
                      Administrative Status
                    </label>
                    <select
                      value={editStatus}
                      onChange={(e) => setEditStatus(e.target.value as any)}
                      style={{ width: "100%", padding: "8px 10px", background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", color: "#241A14", outline: "none", fontSize: "0.84rem", fontWeight: 600 }}
                    >
                      <option value="Active">Active</option>
                      <option value="Promoted">Promoted</option>
                      <option value="Pending Dues">Pending Dues</option>
                      <option value="Overdue">Overdue</option>
                    </select>
                  </div>

                  {/* DEPARTMENT */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#66564A", marginBottom: "4px" }}>
                      Department
                    </label>
                    <select
                      value={editDepartment}
                      onChange={(e) => setEditDepartment(e.target.value)}
                      style={{ width: "100%", padding: "8px 10px", background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", color: "#241A14", outline: "none", fontSize: "0.84rem", fontWeight: 600 }}
                    >
                      <option value="CSE">CSE</option>
                      <option value="EEE">EEE</option>
                      <option value="BBA">BBA</option>
                      <option value="Civil">Civil</option>
                    </select>
                  </div>

                  {/* CLASS / YEAR */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#66564A", marginBottom: "4px" }}>
                      Class / Year
                    </label>
                    <input
                      type="text"
                      value={editClassYear}
                      onChange={(e) => setEditClassYear(e.target.value)}
                      placeholder="e.g. 3rd Year"
                      style={{ width: "100%", padding: "8px 10px", background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", color: "#241A14", outline: "none", fontSize: "0.84rem", fontWeight: 600, boxSizing: "border-box" }}
                    />
                  </div>

                  {/* SECTION */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#66564A", marginBottom: "4px" }}>
                      Section
                    </label>
                    <input
                      type="text"
                      value={editSection}
                      onChange={(e) => setEditSection(e.target.value)}
                      placeholder="e.g. Sec A"
                      style={{ width: "100%", padding: "8px 10px", background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", color: "#241A14", outline: "none", fontSize: "0.84rem", fontWeight: 600, boxSizing: "border-box" }}
                    />
                  </div>

                  {/* SEMESTER */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#66564A", marginBottom: "4px" }}>
                      Semester
                    </label>
                    <input
                      type="text"
                      value={editSemester}
                      onChange={(e) => setEditSemester(e.target.value)}
                      placeholder="e.g. 3rd Sem"
                      style={{ width: "100%", padding: "8px 10px", background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", color: "#241A14", outline: "none", fontSize: "0.84rem", fontWeight: 600, boxSizing: "border-box" }}
                    />
                  </div>

                  {/* VERIFICATION */}
                  <div>
                    <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#66564A", marginBottom: "4px" }}>
                      Verification Flag
                    </label>
                    <select
                      value={editVerified ? "true" : "false"}
                      onChange={(e) => setEditVerified(e.target.value === "true")}
                      style={{ width: "100%", padding: "8px 10px", background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", color: "#241A14", outline: "none", fontSize: "0.84rem", fontWeight: 600 }}
                    >
                      <option value="true">Verified Student</option>
                      <option value="false">Unverified / Pending Verification</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "4px" }}>
                  <button
                    type="button"
                    onClick={() => setIsEditingAdminFields(false)}
                    style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.4)", color: "#66564A", padding: "8px 14px", borderRadius: "8px", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{ background: "#D35400", color: "#FFFFFF", border: "none", padding: "8px 18px", borderRadius: "8px", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer" }}
                  >
                    Save Administrative Changes
                  </button>
                </div>
              </form>
            )}

            {/* FINANCIAL SUMMARY SCORECARDS BAR */}
            <div style={{ padding: "16px 24px", background: "#FFFFFF", borderBottom: "1px solid rgba(196, 154, 108, 0.2)", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
              {/* OUTSTANDING DUES */}
              <div style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "12px", padding: "12px" }}>
                <span style={{ fontSize: "0.76rem", fontWeight: 700, color: "#66564A", display: "block" }}>Outstanding Dues</span>
                <strong style={{ fontSize: "1.2rem", fontWeight: 800, color: selectedStudentDossier.totalDues > 0 ? "#BE123C" : "#047857", fontFeatureSettings: "'tnum'" }}>
                  {formatTaka(selectedStudentDossier.totalDues, false)}
                </strong>
              </div>

              {/* FEE STATUS */}
              <div style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "12px", padding: "12px" }}>
                <span style={{ fontSize: "0.76rem", fontWeight: 700, color: "#66564A", display: "block" }}>Current Fee Standing</span>
                <div style={{ marginTop: "4px" }}>
                  <span style={{
                    padding: "4px 10px",
                    borderRadius: "999px",
                    fontSize: "0.78rem",
                    fontWeight: 800,
                    background: selectedStudentDossier.feeStatus === "Paid" ? "rgba(4, 120, 87, 0.12)" : "rgba(217, 119, 6, 0.12)",
                    color: selectedStudentDossier.feeStatus === "Paid" ? "#047857" : "#D97706"
                  }}>
                    {selectedStudentDossier.feeStatus}
                  </span>
                </div>
              </div>

              {/* WALLET BALANCE */}
              <div style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "12px", padding: "12px" }}>
                <span style={{ fontSize: "0.76rem", fontWeight: 700, color: "#66564A", display: "block" }}>Neo Cash Wallet Balance</span>
                <strong style={{ fontSize: "1.2rem", fontWeight: 800, color: "#241A14", fontFeatureSettings: "'tnum'" }}>
                  {formatTaka(selectedStudentDossier.walletBalance, false)}
                </strong>
              </div>

              {/* WELFARE / IMPACT */}
              <div style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "12px", padding: "12px" }}>
                <span style={{ fontSize: "0.76rem", fontWeight: 700, color: "#66564A", display: "block" }}>Welfare & Impact Pts</span>
                <div style={{ display: "flex", alignItems: "baseline", gap: "6px", marginTop: "2px" }}>
                  <strong style={{ fontSize: "1.2rem", fontWeight: 800, color: "#D35400" }}>
                    {store.studentProfile.studentId === selectedStudentDossier.studentId ? store.donations.points : 12} Pts
                  </strong>
                  <span style={{ fontSize: "0.74rem", color: "#8C7A6A" }}>
                    ({formatTaka(store.studentProfile.studentId === selectedStudentDossier.studentId ? store.donations.totalDonated : 1200, false)})
                  </span>
                </div>
              </div>
            </div>

            {/* DOSSIER TABS NAVIGATION */}
            <div style={{ padding: "0 24px", background: "#FFF7E6", borderBottom: "1px solid rgba(196, 154, 108, 0.3)", display: "flex", gap: "4px", overflowX: "auto" }}>
              {[
                { id: "identity", label: "Identity", icon: UserCheck },
                { id: "academic", label: "Academic Info", icon: Award },
                { id: "fees", label: "Assigned Fees", icon: CreditCard },
                { id: "transactions", label: "Transactions", icon: FileText },
                { id: "wallet", label: "Wallet Context", icon: Wallet },
                { id: "partial", label: "Partial Applications", icon: ShieldCheck },
                { id: "notifications", label: "Notifications", icon: Bell },
                { id: "activity", label: "Activity Log", icon: Activity },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeDossierTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveDossierTab(tab.id as any)}
                    style={{
                      padding: "12px 14px",
                      background: "none",
                      border: "none",
                      borderBottom: isActive ? "3px solid #D35400" : "3px solid transparent",
                      color: isActive ? "#D35400" : "#66564A",
                      fontWeight: isActive ? 800 : 600,
                      fontSize: "0.82rem",
                      cursor: "pointer",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <Icon size={14} /> {tab.label}
                  </button>
                );
              })}
            </div>

            {/* DOSSIER TAB CONTENT BODY */}
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "20px" }}>
              
              {/* 1. IDENTITY TAB */}
              {activeDossierTab === "identity" && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
                  <div style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "12px", padding: "16px" }}>
                    <h4 style={{ margin: "0 0 12px", fontSize: "0.92rem", color: "#241A14", fontWeight: 800 }}>
                      Student Identity Details
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.84rem" }}>
                      <div><strong style={{ color: "#66564A" }}>Full Legal Name:</strong> <span style={{ color: "#241A14", fontWeight: 700 }}>{selectedStudentDossier.name}</span></div>
                      <div><strong style={{ color: "#66564A" }}>Institutional ID:</strong> <span style={{ color: "#D35400", fontWeight: 700 }}>{selectedStudentDossier.studentId}</span></div>
                      <div><strong style={{ color: "#66564A" }}>Email Address:</strong> <span style={{ color: "#241A14" }}>{selectedStudentDossier.email}</span></div>
                      <div><strong style={{ color: "#66564A" }}>Mobile Phone:</strong> <span style={{ color: "#241A14" }}>{selectedStudentDossier.phone}</span></div>
                      <div><strong style={{ color: "#66564A" }}>Account Status:</strong> <span style={{ color: "#047857", fontWeight: 700 }}>{selectedStudentDossier.status}</span></div>
                    </div>
                  </div>

                  <div style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "12px", padding: "16px" }}>
                    <h4 style={{ margin: "0 0 12px", fontSize: "0.92rem", color: "#241A14", fontWeight: 800 }}>
                      Verification & Security Context
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "0.84rem" }}>
                      <div><strong style={{ color: "#66564A" }}>SSO Verified:</strong> <span style={{ color: selectedStudentDossier.verified ? "#047857" : "#BE123C", fontWeight: 700 }}>{selectedStudentDossier.verified ? "Yes (Identity Confirmed)" : "Pending Review"}</span></div>
                      <div><strong style={{ color: "#66564A" }}>NID / Birth Certificate:</strong> <span style={{ color: "#241A14" }}>19982691048123904</span></div>
                      <div><strong style={{ color: "#66564A" }}>Guardian Contact:</strong> <span style={{ color: "#241A14" }}>Md. Rafiqul Islam (+880 1711-908234)</span></div>
                      <div><strong style={{ color: "#66564A" }}>Last Recorded Login:</strong> <span style={{ color: "#8C7A6A" }}>{selectedStudentDossier.lastActivity}</span></div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. ACADEMIC INFO TAB */}
              {activeDossierTab === "academic" && (
                <div style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "12px", padding: "16px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", fontSize: "0.86rem" }}>
                  <div><span style={{ fontSize: "0.76rem", color: "#8C7A6A", display: "block" }}>Department</span><strong style={{ color: "#241A14" }}>{selectedStudentDossier.department}</strong></div>
                  <div><span style={{ fontSize: "0.76rem", color: "#8C7A6A", display: "block" }}>Class & Year</span><strong style={{ color: "#241A14" }}>{selectedStudentDossier.classYear}</strong></div>
                  <div><span style={{ fontSize: "0.76rem", color: "#8C7A6A", display: "block" }}>Section</span><strong style={{ color: "#047857" }}>{selectedStudentDossier.section}</strong></div>
                  <div><span style={{ fontSize: "0.76rem", color: "#8C7A6A", display: "block" }}>Semester</span><strong style={{ color: "#241A14" }}>{selectedStudentDossier.semester}</strong></div>
                  <div><span style={{ fontSize: "0.76rem", color: "#8C7A6A", display: "block" }}>Academic Session</span><strong style={{ color: "#241A14" }}>{selectedStudentDossier.session}</strong></div>
                  <div><span style={{ fontSize: "0.76rem", color: "#8C7A6A", display: "block" }}>Combined Designation</span><strong style={{ color: "#D35400" }}>{selectedStudentDossier.classSection}</strong></div>
                </div>
              )}

              {/* 3. FEES TAB */}
              {activeDossierTab === "fees" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <h4 style={{ margin: 0, fontSize: "0.95rem", color: "#241A14", fontWeight: 800 }}>
                    Institutional Fee Obligations
                  </h4>
                  <div style={{ border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "10px", overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.84rem" }}>
                      <thead>
                        <tr style={{ background: "#FDF9F3", textAlign: "left", color: "#66564A" }}>
                          <th style={{ padding: "10px 14px" }}>Fee Title</th>
                          <th style={{ padding: "10px 14px" }}>Category</th>
                          <th style={{ padding: "10px 14px" }}>Due Date</th>
                          <th style={{ padding: "10px 14px" }}>Total Amount</th>
                          <th style={{ padding: "10px 14px" }}>Paid Standing</th>
                          <th style={{ padding: "10px 14px" }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {store.fees.map((f) => (
                          <tr key={f.id} style={{ borderTop: "1px solid rgba(196, 154, 108, 0.2)" }}>
                            <td style={{ padding: "10px 14px", fontWeight: 700, color: "#241A14" }}>{f.title}</td>
                            <td style={{ padding: "10px 14px", color: "#66564A" }}>{f.category}</td>
                            <td style={{ padding: "10px 14px", color: "#8C7A6A" }}>{f.dueDate}</td>
                            <td style={{ padding: "10px 14px", fontWeight: 700, fontFeatureSettings: "'tnum'" }}>{formatTaka(f.amount, false)}</td>
                            <td style={{ padding: "10px 14px", fontWeight: 700, color: f.status === "paid" ? "#047857" : "#D35400", fontFeatureSettings: "'tnum'" }}>
                              {f.status === "paid" ? formatTaka(f.amount, false) : formatTaka(f.approvedPartialAmount || 0, false)}
                            </td>
                            <td style={{ padding: "10px 14px" }}>
                              <span style={{ padding: "2px 8px", borderRadius: "999px", fontSize: "0.74rem", fontWeight: 800, background: f.status === "paid" ? "rgba(4, 120, 87, 0.12)" : "rgba(217, 119, 6, 0.12)", color: f.status === "paid" ? "#047857" : "#D97706" }}>
                                {f.status.toUpperCase()}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 4. TRANSACTIONS TAB */}
              {activeDossierTab === "transactions" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <h4 style={{ margin: 0, fontSize: "0.95rem", color: "#241A14", fontWeight: 800 }}>
                    Payment Ledger & Digital Receipts History
                  </h4>
                  <div style={{ border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "10px", overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.84rem" }}>
                      <thead>
                        <tr style={{ background: "#FDF9F3", textAlign: "left", color: "#66564A" }}>
                          <th style={{ padding: "10px 14px" }}>TXN ID</th>
                          <th style={{ padding: "10px 14px" }}>Date</th>
                          <th style={{ padding: "10px 14px" }}>Description</th>
                          <th style={{ padding: "10px 14px" }}>Method</th>
                          <th style={{ padding: "10px 14px" }}>Amount</th>
                          <th style={{ padding: "10px 14px" }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {store.transactions.map((t) => (
                          <tr key={t.id} style={{ borderTop: "1px solid rgba(196, 154, 108, 0.2)" }}>
                            <td style={{ padding: "10px 14px", fontFamily: "monospace", fontWeight: 700, color: "#D35400" }}>{t.id}</td>
                            <td style={{ padding: "10px 14px", color: "#8C7A6A" }}>{t.date}</td>
                            <td style={{ padding: "10px 14px", fontWeight: 600, color: "#241A14" }}>{t.title}</td>
                            <td style={{ padding: "10px 14px", color: "#66564A" }}>{t.method}</td>
                            <td style={{ padding: "10px 14px", fontWeight: 800, color: "#047857", fontFeatureSettings: "'tnum'" }}>{formatTaka(t.amount, false)}</td>
                            <td style={{ padding: "10px 14px" }}>
                              <span style={{ padding: "2px 8px", borderRadius: "999px", fontSize: "0.74rem", fontWeight: 800, background: "rgba(4, 120, 87, 0.12)", color: "#047857" }}>
                                {t.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 5. WALLET TAB */}
              {activeDossierTab === "wallet" && (
                <div style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: "0.95rem", color: "#241A14", fontWeight: 800 }}>
                        Student Digital Wallet Context
                      </h4>
                      <p style={{ margin: "2px 0 0", fontSize: "0.82rem", color: "#66564A" }}>
                        Digital wallet used for direct automated fee settlement and top-ups.
                      </p>
                    </div>
                    <strong style={{ fontSize: "1.25rem", color: "#D35400", fontFeatureSettings: "'tnum'" }}>
                      {formatTaka(selectedStudentDossier.walletBalance, false)}
                    </strong>
                  </div>
                  <div style={{ background: "#FFFFFF", padding: "12px", borderRadius: "8px", border: "1px solid rgba(196, 154, 108, 0.2)", fontSize: "0.84rem", color: "#66564A" }}>
                    Primary Linked Mobile Wallet: <strong>bKash Account (+880 1711-908234)</strong> • Status: <strong>Active & Verified</strong>
                  </div>
                </div>
              )}

              {/* 6. PARTIAL PAYMENT APPLICATIONS TAB */}
              {activeDossierTab === "partial" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  <h4 style={{ margin: 0, fontSize: "0.95rem", color: "#241A14", fontWeight: 800 }}>
                    Partial Payment Hardship Applications
                  </h4>
                  {store.partialApplications.length === 0 ? (
                    <p style={{ fontSize: "0.84rem", color: "#8C7A6A", margin: 0 }}>No partial payment applications on record.</p>
                  ) : (
                    store.partialApplications.map((app) => (
                      <div key={app.id} style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "12px", padding: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <strong style={{ color: "#241A14", fontSize: "0.9rem" }}>{app.feeTitle}</strong>
                          <span style={{ padding: "3px 10px", borderRadius: "999px", fontSize: "0.76rem", fontWeight: 800, background: (app.status === "approved_head" || app.status === "paid") ? "rgba(4, 120, 87, 0.12)" : "rgba(217, 119, 6, 0.12)", color: (app.status === "approved_head" || app.status === "paid") ? "#047857" : "#D97706" }}>
                            {app.status.replace("_", " ").toUpperCase()}
                          </span>
                        </div>
                        <div style={{ fontSize: "0.84rem", color: "#66564A" }}>
                          Total Fee: <strong>{formatTaka(app.originalAmount, false)}</strong> • Requested Instalment: <strong style={{ color: "#D35400" }}>{formatTaka(app.requestedAmount, false)}</strong>
                        </div>
                        <p style={{ margin: 0, fontSize: "0.82rem", color: "#241A14", fontStyle: "italic", background: "#FFFFFF", padding: "8px 12px", borderRadius: "6px", border: "1px solid rgba(196, 154, 108, 0.2)" }}>
                          "{app.reason}"
                        </p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* 7. NOTIFICATIONS TAB */}
              {activeDossierTab === "notifications" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <h4 style={{ margin: 0, fontSize: "0.95rem", color: "#241A14", fontWeight: 800 }}>
                    Transmitted Student Alerts & Notices
                  </h4>
                  {store.notifications.map((n: NotificationItem) => (
                    <div key={n.id} style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.25)", borderRadius: "10px", padding: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <strong style={{ color: "#241A14", fontSize: "0.86rem", display: "block" }}>{n.title}</strong>
                        <span style={{ fontSize: "0.8rem", color: "#66564A" }}>{n.message}</span>
                      </div>
                      <span style={{ fontSize: "0.76rem", color: "#8C7A6A", whiteSpace: "nowrap" }}>{n.date}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* 8. ACTIVITY TIMELINE TAB */}
              {activeDossierTab === "activity" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <h4 style={{ margin: 0, fontSize: "0.95rem", color: "#241A14", fontWeight: 800 }}>
                    Student Audit Log & Activity Feed
                  </h4>
                  {store.auditLogs.map((log) => (
                    <div key={log.id} style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.25)", borderRadius: "10px", padding: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <strong style={{ color: "#241A14", fontSize: "0.86rem", display: "block" }}>{log.action}</strong>
                        <span style={{ fontSize: "0.8rem", color: "#66564A" }}>{log.details}</span>
                      </div>
                      <span style={{ fontSize: "0.76rem", color: "#8C7A6A", whiteSpace: "nowrap" }}>{log.timestamp}</span>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}

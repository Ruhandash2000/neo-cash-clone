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
import { useNeoStore, PartialApplication } from "@/lib/neo-cash-store";
import { StatusBadge } from "@/components/design-system/status-badge";
import { formatTaka } from "@/components/design-system/tokens";
import {
  Users, DollarSign, FileSpreadsheet, ShieldCheck, AlertTriangle, ArrowRight,
  CheckCircle2, XCircle, Search, Filter, Plus, Upload, FileText, Check, Clock, RefreshCw, X, Sparkles
} from "lucide-react";

export function AdminPanel({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}) {
  const [store, actions] = useNeoStore();

  // Student directory search & filters
  const [studentSearch, setStudentSearch] = useState("");
  const [filterDept, setFilterDept] = useState("all");

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

  const filteredStudents = store.students.filter(
    (s) =>
      (s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.studentId.toLowerCase().includes(studentSearch.toLowerCase())) &&
      (filterDept === "all" || s.department === filterDept)
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
      {/* 1. ADMIN OVERVIEW */}
      {activeTab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          
          {/* LEVEL 1: OPEN OPERATIONS HERO (NO CARD CONTAINER) */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: "2rem", fontWeight: 800, color: "#241A14", letterSpacing: "-0.02em" }}>
                Institutional Financial Operations
              </h1>
              <p style={{ margin: "4px 0 0", fontSize: "0.95rem", color: "#66564A" }}>
                Dhaka City College Operations Center • Real-time fee collections & application tracking
              </p>
            </div>

            <button
              type="button"
              className="ms-btn-primary"
              onClick={() => setActiveTab("bulk")}
              style={{ background: "#D35400", color: "#FFFFFF", padding: "10px 18px", borderRadius: "10px", fontSize: "0.88rem", fontWeight: 700 }}
            >
              <Plus size={16} /> Bulk Fee Assignment
            </button>
          </div>

          {/* LEVEL 2: OPERATIONAL METRIC CARDS */}
          <div className="ms-grid-3">
            
            {/* TOTAL STUDENTS CARD */}
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(196, 154, 108, 0.3)",
                borderRadius: "14px",
                padding: "24px",
                boxShadow: "0 4px 14px rgba(36, 26, 20, 0.03)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#66564A", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                TOTAL STUDENTS ENROLLED
              </span>

              <div style={{ margin: "14px 0 8px" }}>
                <span style={{ fontSize: "2.25rem", fontWeight: 800, color: "#241A14", letterSpacing: "-0.03em" }}>
                  2,120
                </span>
              </div>

              <div style={{ fontSize: "0.8rem", color: "#047857", fontWeight: 600, display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckCircle2 size={14} />
                <span>98.4% Verified Student Profiles</span>
              </div>
            </div>

            {/* TOTAL COLLECTIONS CARD */}
            <div
              style={{
                background: "#FFFFFF",
                border: "2px solid #D35400",
                borderRadius: "14px",
                padding: "24px",
                boxShadow: "0 6px 20px rgba(211, 84, 0, 0.06)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#66564A", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                  TOTAL COLLECTIONS (SPRING 2027)
                </span>
                <span style={{ fontSize: "0.72rem", background: "rgba(211, 84, 0, 0.1)", color: "#D35400", padding: "3px 8px", borderRadius: "6px", fontWeight: 700 }}>
                  PRIMARY
                </span>
              </div>

              <div style={{ margin: "14px 0 8px" }}>
                <span style={{ fontSize: "2.25rem", fontWeight: 800, color: "#241A14", letterSpacing: "-0.03em", fontFeatureSettings: "'tnum'" }}>
                  {formatTaka(4820000, false)}
                </span>
              </div>

              <div style={{ fontSize: "0.8rem", color: "#66564A" }}>
                Collection Rate: <strong style={{ color: "#241A14" }}>82% On-Time</strong>
              </div>
            </div>

            {/* PENDING APPLICATIONS CARD */}
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(196, 154, 108, 0.3)",
                borderRadius: "14px",
                padding: "24px",
                boxShadow: "0 4px 14px rgba(36, 26, 20, 0.03)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#66564A", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                PENDING APPLICATIONS
              </span>

              <div style={{ margin: "14px 0 8px" }}>
                <span style={{ fontSize: "1.85rem", fontWeight: 800, color: "#D35400" }}>
                  {store.partialApplications.filter((a) => a.status === "pending_admin").length} Pending
                </span>
              </div>

              <div style={{ fontSize: "0.8rem", color: "#8C7A6A" }}>
                Requires Executive Sign-Off
              </div>
            </div>

          </div>

          {/* LEVEL 3: QUEUE & ALERTS SPLIT VIEW */}
          <div className="ms-grid-2">
            
            {/* PARTIAL PAYMENT REVIEW QUEUE */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "#241A14" }}>
                  Partial Payment Review Queue
                </h2>
                <button
                  type="button"
                  onClick={() => setActiveTab("applications")}
                  style={{ background: "none", border: "none", color: "#D35400", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}
                >
                  View Queue →
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {store.partialApplications.map((app) => (
                  <div
                    key={app.id}
                    style={{
                      background: "#FFFFFF",
                      border: "1px solid rgba(196, 154, 108, 0.25)",
                      borderRadius: "12px",
                      padding: "16px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <h4 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "#241A14" }}>
                          {app.studentName} ({app.studentId})
                        </h4>
                        <span style={{ fontSize: "0.78rem", color: "#66564A", marginTop: "2px", display: "block" }}>
                          Target Fee: {app.feeTitle}
                        </span>
                      </div>
                      <StatusBadge status={app.status.startsWith("approved") ? "approved" : "under_review"} />
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "8px", borderTop: "1px dashed rgba(196, 154, 108, 0.2)" }}>
                      <span style={{ fontSize: "0.82rem", color: "#66564A" }}>
                        Requested: <strong style={{ color: "#241A14" }}>{formatTaka(app.requestedAmount, false)}</strong> / {formatTaka(app.originalAmount, false)}
                      </span>
                      {app.status === "pending_admin" ? (
                        <button
                          type="button"
                          className="ms-btn-primary"
                          onClick={() => setReviewApp(app)}
                          style={{ background: "#D35400", color: "#FFFFFF", padding: "4px 12px", fontSize: "0.78rem", borderRadius: "8px" }}
                        >
                          Review & Forward
                        </button>
                      ) : (
                        <span style={{ fontSize: "0.78rem", color: "#8C7A6A" }}>Reviewed</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SOPHISTICATED SYSTEM OPERATIONAL ALERTS */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "#241A14" }}>
                System Operational Alerts
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ padding: "14px 16px", background: "#FDF9F3", borderLeft: "4px solid #BE123C", borderRadius: "10px", border: "1px solid rgba(196, 154, 108, 0.25)", borderLeftWidth: "4px" }}>
                  <h5 style={{ margin: "0 0 2px", color: "#BE123C", fontSize: "0.88rem", fontWeight: 700 }}>OVERDUE NOTICE</h5>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#66564A" }}>
                    23 students in CSE 3rd Semester have midterm exam fees overdue.
                  </p>
                </div>

                <div style={{ padding: "14px 16px", background: "#FDF9F3", borderLeft: "4px solid #D35400", borderRadius: "10px", border: "1px solid rgba(196, 154, 108, 0.25)", borderLeftWidth: "4px" }}>
                  <h5 style={{ margin: "0 0 2px", color: "#D35400", fontSize: "0.88rem", fontWeight: 700 }}>UPCOMING DEADLINE</h5>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#66564A" }}>
                    Semester Tuition Fee deadline in 19 days (Oct 15, 2026).
                  </p>
                </div>

                <div style={{ padding: "14px 16px", background: "#FDF9F3", borderLeft: "4px solid #047857", borderRadius: "10px", border: "1px solid rgba(196, 154, 108, 0.25)", borderLeftWidth: "4px" }}>
                  <h5 style={{ margin: "0 0 2px", color: "#047857", fontSize: "0.88rem", fontWeight: 700 }}>SYSTEM PROVISIONING</h5>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "#66564A" }}>
                    420 student digital wallets provisioned successfully.
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 2. STUDENTS DIRECTORY TAB */}
      {activeTab === "students" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "14px" }}>
            <div>
              <h1 style={{ margin: 0, fontSize: "1.6rem", fontWeight: 800, color: "#241A14" }}>
                Student Directory & Class Promotion
              </h1>
              <p style={{ margin: "4px 0 0", fontSize: "0.9rem", color: "#66564A" }}>
                Manage institutional student profiles, department rosters, and promotion queues.
              </p>
            </div>
            <button type="button" className="ms-btn-primary" onClick={() => setActiveTab("import")} style={{ background: "#D35400", color: "#FFFFFF", padding: "8px 16px", borderRadius: "10px" }}>
              <Upload size={16} /> Import Excel
            </button>
          </div>

          {/* SEARCH & FILTER BAR */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: "1 1 260px" }}>
              <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#8C7A6A" }} />
              <input
                type="text"
                placeholder="Search student name or ID..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                style={{ width: "100%", padding: "8px 12px 8px 36px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "10px", color: "#241A14", outline: "none", fontSize: "0.88rem" }}
              />
            </div>
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              style={{ padding: "8px 14px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "10px", color: "#241A14", outline: "none", fontSize: "0.88rem" }}
            >
              <option value="all">All Departments</option>
              <option value="CSE">CSE</option>
              <option value="EEE">EEE</option>
              <option value="BBA">BBA</option>
            </select>
          </div>

          {/* DIRECTORY TABLE */}
          <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "14px", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
              <thead>
                <tr style={{ background: "#FDF9F3", textAlign: "left", color: "#66564A", borderBottom: "1px solid rgba(196, 154, 108, 0.3)" }}>
                  <th style={{ padding: "12px 18px", fontWeight: 700 }}>Student Name</th>
                  <th style={{ padding: "12px 18px", fontWeight: 700 }}>Student ID</th>
                  <th style={{ padding: "12px 18px", fontWeight: 700 }}>Class & Section</th>
                  <th style={{ padding: "12px 18px", fontWeight: 700 }}>Email</th>
                  <th style={{ padding: "12px 18px", fontWeight: 700 }}>Status</th>
                  <th style={{ padding: "12px 18px", fontWeight: 700 }}>Dues</th>
                  <th style={{ padding: "12px 18px", fontWeight: 700 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s) => (
                  <tr key={s.id} style={{ borderBottom: "1px solid rgba(196, 154, 108, 0.2)" }}>
                    <td style={{ padding: "12px 18px", fontWeight: 700, color: "#241A14" }}>{s.name}</td>
                    <td style={{ padding: "12px 18px", fontWeight: 700, color: "#D35400" }}>{s.studentId}</td>
                    <td style={{ padding: "12px 18px", color: "#66564A" }}>{s.classSection}</td>
                    <td style={{ padding: "12px 18px", color: "#66564A" }}>{s.email}</td>
                    <td style={{ padding: "12px 18px" }}>
                      <StatusBadge status={s.status === "Active" ? "verified" : "overdue"} customLabel={s.status} />
                    </td>
                    <td style={{ padding: "12px 18px", fontWeight: 800, color: s.totalDues > 0 ? "#BE123C" : "#047857", fontFeatureSettings: "'tnum'" }}>
                      {formatTaka(s.totalDues, false)}
                    </td>
                    <td style={{ padding: "12px 18px" }}>
                      <button
                        type="button"
                        onClick={() => alert(`Promoting ${s.name} to next semester/year.`)}
                        style={{ background: "#FDF9F3", color: "#D35400", border: "1px solid rgba(196, 154, 108, 0.3)", padding: "4px 10px", borderRadius: "6px", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" }}
                      >
                        <RefreshCw size={12} /> Promote
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. BULK FEE ASSIGNMENT */}
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
        </div>
      )}

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
    </div>
  );
}

/**
 * Admin Panel Component — Professional Institutional Financial Operations Center
 * 
 * Features:
 * 1. Financial Operations Overview & Collection Analytics
 * 2. Student Directory, Search, Filter, & Class Promotion
 * 3. Class & Section Management
 * 4. Bulk Fee Assignment (Excel-like Grid)
 * 5. Excel Student Data Import Preview & Validation
 * 6. Partial Payment Application Review & Forwarding to Head
 * 7. Real-Time Audit Logs & Institutional System Alerts
 */

import { useState } from "react";
import { useNeoStore, PartialApplication } from "@/lib/neo-cash-store";
import {
  Users, DollarSign, FileSpreadsheet, ShieldCheck, AlertTriangle, ArrowRight,
  CheckCircle2, XCircle, Search, Filter, Plus, Upload, FileText, Check, Clock, RefreshCw
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
    alert(`Successfully assigned "${bulkTitle}" (৳${bulkAmount}) to ${targetClass} (${targetSection})!`);
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
    <div>
      {/* 1. ADMIN OVERVIEW */}
      {activeTab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Operations Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2 style={{ fontSize: "1.4rem", margin: 0, color: "#FFF" }}>Institutional Financial Operations</h2>
              <p style={{ margin: "4px 0 0", color: "var(--ms-text-muted)", fontSize: "0.88rem" }}>
                Dhaka City College Operations Center • Real-time fee collections & applications tracking
              </p>
            </div>
            <button type="button" className="ms-btn-primary" onClick={() => setActiveTab("bulk")}>
              <Plus size={16} /> Bulk Fee Assignment
            </button>
          </div>

          {/* Operational Metrics Cards */}
          <div className="ms-grid-3">
            <div className="ms-card" style={{ background: "linear-gradient(135deg, #1E3A8A 0%, #0D182A 100%)" }}>
              <span style={{ fontSize: "0.8rem", color: "var(--ms-text-muted)", textTransform: "uppercase" }}>Total Students Enrolled</span>
              <h3 style={{ fontSize: "1.8rem", color: "#FFF", margin: "8px 0 4px" }}>{store.students.length * 320 + 840}</h3>
              <p style={{ margin: 0, fontSize: "0.78rem", color: "#34D399" }}>98.4% Verified Profiles</p>
            </div>
            <div className="ms-card">
              <span style={{ fontSize: "0.8rem", color: "var(--ms-text-muted)", textTransform: "uppercase" }}>Total Collections (Fall 2026)</span>
              <h3 style={{ fontSize: "1.8rem", color: "#34D399", margin: "8px 0 4px" }}>৳4,820,000</h3>
              <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--ms-text-muted)" }}>82% Collection Rate</p>
            </div>
            <div className="ms-card">
              <span style={{ fontSize: "0.8rem", color: "var(--ms-text-muted)", textTransform: "uppercase" }}>Pending Partial Applications</span>
              <h3 style={{ fontSize: "1.8rem", color: "var(--ms-accent)", margin: "8px 0 4px" }}>
                {store.partialApplications.filter((a) => a.status === "pending_admin").length} Pending
              </h3>
              <p style={{ margin: 0, fontSize: "0.78rem", color: "var(--ms-lavender)" }}>Requires Admin & Head Review</p>
            </div>
          </div>

          {/* Pending Applications & Alerts Split View */}
          <div className="ms-grid-2">
            {/* Partial Applications Review Card */}
            <div className="ms-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#FFF" }}>Partial Payment Review Queue</h3>
                <button type="button" style={{ background: "none", border: "none", color: "var(--ms-accent)", cursor: "pointer", fontSize: "0.85rem", fontWeight: 600 }} onClick={() => setActiveTab("applications")}>
                  View Queue →
                </button>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {store.partialApplications.map((app) => (
                  <div key={app.id} style={{ padding: "14px", background: "rgba(30, 58, 138, 0.2)", borderRadius: "12px", border: "1px solid var(--ms-border)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <h4 style={{ margin: 0, fontSize: "0.92rem", color: "#FFF" }}>{app.studentName} ({app.studentId})</h4>
                        <span style={{ fontSize: "0.78rem", color: "var(--ms-text-muted)" }}>Fee: {app.feeTitle}</span>
                      </div>
                      <span className={`ms-badge ms-badge--${app.status.startsWith("approved") ? "paid" : "pending_partial"}`}>
                        {app.status.replace("_", " ")}
                      </span>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
                      <span style={{ fontSize: "0.8rem", color: "var(--ms-lavender)" }}>
                        Req: ৳{app.requestedAmount.toLocaleString()} / ৳{app.originalAmount.toLocaleString()}
                      </span>
                      {app.status === "pending_admin" ? (
                        <button type="button" className="ms-btn-primary" style={{ padding: "4px 12px", fontSize: "0.78rem" }} onClick={() => setReviewApp(app)}>
                          Review & Forward
                        </button>
                      ) : (
                        <span style={{ fontSize: "0.75rem", color: "var(--ms-text-dim)" }}>Already Reviewed</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Institutional System Alerts */}
            <div className="ms-card">
              <h3 style={{ margin: "0 0 16px", fontSize: "1.1rem", color: "#FFF" }}>System Operational Alerts</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ padding: "12px 14px", background: "rgba(245, 158, 11, 0.12)", border: "1px solid rgba(245, 158, 11, 0.3)", borderRadius: "10px", color: "#FBBF24", fontSize: "0.85rem" }}>
                  <strong>Overdue Warning:</strong> 23 students in CSE 3rd Semester have midterm exam fee overdue.
                </div>
                <div style={{ padding: "12px 14px", background: "rgba(59, 130, 246, 0.12)", border: "1px solid rgba(59, 130, 246, 0.3)", borderRadius: "10px", color: "#60A5FA", fontSize: "0.85rem" }}>
                  <strong>Upcoming Deadline:</strong> Semester Tuition Fee deadline is in 19 days (Oct 15, 2026).
                </div>
                <div style={{ padding: "12px 14px", background: "rgba(16, 185, 129, 0.12)", border: "1px solid rgba(16, 185, 129, 0.3)", borderRadius: "10px", color: "#34D399", fontSize: "0.85rem" }}>
                  <strong>Bulk Sync Complete:</strong> 420 student digital wallets provisioned successfully.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. STUDENTS DIRECTORY TAB */}
      {activeTab === "students" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <h2 style={{ fontSize: "1.4rem", margin: 0, color: "#FFF" }}>Student Directory & Class Promotion</h2>
              <p style={{ margin: "4px 0 0", color: "var(--ms-text-muted)", fontSize: "0.88rem" }}>
                Manage institutional student records, departments, sections, and annual promotion.
              </p>
            </div>
            <button type="button" className="ms-btn-primary" onClick={() => setActiveTab("import")}>
              <Upload size={16} /> Import Excel
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            <div style={{ position: "relative", flex: "1 1 260px" }}>
              <Search size={16} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--ms-text-muted)" }} />
              <input
                type="text"
                placeholder="Search by student name or ID..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
                style={{ width: "100%", padding: "8px 12px 8px 36px", background: "rgba(30, 58, 138, 0.3)", border: "1px solid var(--ms-border)", borderRadius: "10px", color: "#FFF", outline: "none", fontSize: "0.88rem" }}
              />
            </div>
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              style={{ padding: "8px 14px", background: "#132238", border: "1px solid var(--ms-border)", borderRadius: "10px", color: "#FFF", outline: "none", fontSize: "0.88rem" }}
            >
              <option value="all">All Departments</option>
              <option value="CSE">CSE</option>
              <option value="EEE">EEE</option>
              <option value="BBA">BBA</option>
            </select>
          </div>

          {/* Directory Table */}
          <div className="ms-card" style={{ padding: 0, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
              <thead>
                <tr style={{ background: "rgba(30, 58, 138, 0.3)", textAlign: "left", color: "var(--ms-text-muted)" }}>
                  <th style={{ padding: "12px 18px" }}>Student Name</th>
                  <th style={{ padding: "12px 18px" }}>Student ID</th>
                  <th style={{ padding: "12px 18px" }}>Class & Section</th>
                  <th style={{ padding: "12px 18px" }}>Email</th>
                  <th style={{ padding: "12px 18px" }}>Status</th>
                  <th style={{ padding: "12px 18px" }}>Dues</th>
                  <th style={{ padding: "12px 18px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((s) => (
                  <tr key={s.id} style={{ borderBottom: "1px solid rgba(30, 58, 138, 0.3)" }}>
                    <td style={{ padding: "12px 18px", fontWeight: "700", color: "#FFF" }}>{s.name}</td>
                    <td style={{ padding: "12px 18px", color: "var(--ms-accent)" }}>{s.studentId}</td>
                    <td style={{ padding: "12px 18px", color: "var(--ms-text-muted)" }}>{s.classSection}</td>
                    <td style={{ padding: "12px 18px", color: "var(--ms-lavender)" }}>{s.email}</td>
                    <td style={{ padding: "12px 18px" }}>
                      <span className={`ms-badge ms-badge--${s.status === "Active" ? "paid" : "overdue"}`}>{s.status}</span>
                    </td>
                    <td style={{ padding: "12px 18px", fontWeight: "700", color: s.totalDues > 0 ? "#F87171" : "#34D399" }}>
                      ৳{s.totalDues.toLocaleString()}
                    </td>
                    <td style={{ padding: "12px 18px" }}>
                      <button type="button" className="ms-btn-secondary" style={{ padding: "4px 10px", fontSize: "0.75rem" }} onClick={() => alert(`Promoting ${s.name} to next semester/year.`)}>
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

      {/* 3. BULK FEE ASSIGNMENT (EXCEL GRID INTERFACE) */}
      {activeTab === "bulk" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <h2 style={{ fontSize: "1.4rem", margin: 0, color: "#FFF" }}>Bulk Fee Assignment</h2>
            <p style={{ margin: "4px 0 0", color: "var(--ms-text-muted)", fontSize: "0.88rem" }}>
              Excel-like batch assignment tool. Assign fees to entire classes, departments, or sections simultaneously.
            </p>
          </div>

          <div className="ms-card">
            <form onSubmit={handleBulkAssign} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--ms-text-muted)", display: "block", marginBottom: "4px" }}>Fee Title</label>
                  <input
                    type="text"
                    value={bulkTitle}
                    onChange={(e) => setBulkTitle(e.target.value)}
                    style={{ width: "100%", padding: "10px 12px", background: "rgba(30, 58, 138, 0.3)", border: "1px solid var(--ms-border)", borderRadius: "10px", color: "#FFF", outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--ms-text-muted)", display: "block", marginBottom: "4px" }}>Amount (৳)</label>
                  <input
                    type="number"
                    value={bulkAmount}
                    onChange={(e) => setBulkAmount(Number(e.target.value))}
                    style={{ width: "100%", padding: "10px 12px", background: "rgba(30, 58, 138, 0.3)", border: "1px solid var(--ms-border)", borderRadius: "10px", color: "#FFF", outline: "none", fontWeight: "700" }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--ms-text-muted)", display: "block", marginBottom: "4px" }}>Due Date</label>
                  <input
                    type="date"
                    value={bulkDueDate}
                    onChange={(e) => setBulkDueDate(e.target.value)}
                    style={{ width: "100%", padding: "10px 12px", background: "#132238", border: "1px solid var(--ms-border)", borderRadius: "10px", color: "#FFF", outline: "none" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "14px" }}>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--ms-text-muted)", display: "block", marginBottom: "4px" }}>Category</label>
                  <select
                    value={bulkCategory}
                    onChange={(e) => setBulkCategory(e.target.value as any)}
                    style={{ width: "100%", padding: "10px 12px", background: "#132238", border: "1px solid var(--ms-border)", borderRadius: "10px", color: "#FFF", outline: "none" }}
                  >
                    <option value="Tuition">Tuition</option>
                    <option value="Lab & Tech">Lab & Tech</option>
                    <option value="Exam">Exam</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--ms-text-muted)", display: "block", marginBottom: "4px" }}>Target Class / Year</label>
                  <select
                    value={targetClass}
                    onChange={(e) => setTargetClass(e.target.value)}
                    style={{ width: "100%", padding: "10px 12px", background: "#132238", border: "1px solid var(--ms-border)", borderRadius: "10px", color: "#FFF", outline: "none" }}
                  >
                    <option value="CSE 3rd Semester">CSE 3rd Semester</option>
                    <option value="Inter 1st Year">Inter 1st Year</option>
                    <option value="Inter 2nd Year">Inter 2nd Year</option>
                    <option value="EEE 1st Semester">EEE 1st Semester</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: "0.8rem", color: "var(--ms-text-muted)", display: "block", marginBottom: "4px" }}>Target Section</label>
                  <select
                    value={targetSection}
                    onChange={(e) => setTargetSection(e.target.value)}
                    style={{ width: "100%", padding: "10px 12px", background: "#132238", border: "1px solid var(--ms-border)", borderRadius: "10px", color: "#FFF", outline: "none" }}
                  >
                    <option value="Sec A">Sec A</option>
                    <option value="Sec B">Sec B</option>
                    <option value="All Sections">All Sections</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="ms-btn-primary" style={{ alignSelf: "flex-end", marginTop: "10px" }}>
                <CheckCircle2 size={18} /> Apply Fee Assignment to Selected Cohort
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 4. EXCEL IMPORT TAB */}
      {activeTab === "import" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <h2 style={{ fontSize: "1.4rem", margin: 0, color: "#FFF" }}>Excel Student Roster Import</h2>
            <p style={{ margin: "4px 0 0", color: "var(--ms-text-muted)", fontSize: "0.88rem" }}>
              Upload Excel (.xlsx, .csv) student files with automated column validation and preview.
            </p>
          </div>

          <div className="ms-card" style={{ textAlign: "center", border: "2px dashed var(--ms-border)", padding: "40px" }}>
            <FileSpreadsheet size={48} style={{ color: "var(--ms-accent)", margin: "0 auto 12px" }} />
            <h3 style={{ margin: "0 0 6px", color: "#FFF" }}>Drag & Drop Excel Roster File Here</h3>
            <p style={{ color: "var(--ms-text-muted)", fontSize: "0.85rem", margin: "0 0 16px" }}>
              Supported formats: .xlsx, .xls, .csv (Columns: Name, StudentID, Department, ClassSection, Email)
            </p>
            <button type="button" className="ms-btn-secondary" onClick={() => setImportFileName("DCC-CSE-2026-Roster.xlsx")}>
              Select Sample Excel File
            </button>
          </div>

          {importFileName && (
            <div className="ms-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <h3 style={{ margin: 0, fontSize: "1.1rem", color: "#FFF" }}>
                  File Preview: <span style={{ color: "var(--ms-accent)" }}>{importFileName}</span> ({importRows.length} Records Validated)
                </h3>
                <span className="ms-badge ms-badge--paid">Validation Passed</span>
              </div>

              <div style={{ padding: 0, overflow: "hidden", marginBottom: "16px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                  <thead>
                    <tr style={{ background: "rgba(30, 58, 138, 0.3)", color: "var(--ms-text-muted)" }}>
                      <th style={{ padding: "8px 12px", textAlign: "left" }}>Name</th>
                      <th style={{ padding: "8px 12px", textAlign: "left" }}>Student ID</th>
                      <th style={{ padding: "8px 12px", textAlign: "left" }}>Department</th>
                      <th style={{ padding: "8px 12px", textAlign: "left" }}>Class & Section</th>
                      <th style={{ padding: "8px 12px", textAlign: "left" }}>Email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importRows.map((row, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid rgba(30, 58, 138, 0.3)" }}>
                        <td style={{ padding: "8px 12px", color: "#FFF" }}>{row.name}</td>
                        <td style={{ padding: "8px 12px", color: "var(--ms-accent)" }}>{row.studentId}</td>
                        <td style={{ padding: "8px 12px" }}>{row.department}</td>
                        <td style={{ padding: "8px 12px" }}>{row.classSection}</td>
                        <td style={{ padding: "8px 12px", color: "var(--ms-lavender)" }}>{row.email}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <button type="button" className="ms-btn-secondary" onClick={() => setImportFileName(null)}>Cancel</button>
                <button type="button" className="ms-btn-primary" onClick={handleExcelImportConfirm}>
                  Confirm & Import All Records
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. AUDIT LOGS TAB */}
      {activeTab === "audit" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <h2 style={{ fontSize: "1.4rem", margin: 0, color: "#FFF" }}>Institutional Audit Logs</h2>
            <p style={{ margin: "4px 0 0", color: "var(--ms-text-muted)", fontSize: "0.88rem" }}>
              Immutable audit trail tracking all fee assignments, student approvals, and payment actions.
            </p>
          </div>

          <div className="ms-card" style={{ padding: 0, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
              <thead>
                <tr style={{ background: "rgba(30, 58, 138, 0.3)", textAlign: "left", color: "var(--ms-text-muted)" }}>
                  <th style={{ padding: "12px 18px" }}>Actor</th>
                  <th style={{ padding: "12px 18px" }}>Role</th>
                  <th style={{ padding: "12px 18px" }}>Action</th>
                  <th style={{ padding: "12px 18px" }}>Details</th>
                  <th style={{ padding: "12px 18px" }}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {store.auditLogs.map((log) => (
                  <tr key={log.id} style={{ borderBottom: "1px solid rgba(30, 58, 138, 0.3)" }}>
                    <td style={{ padding: "12px 18px", fontWeight: "700", color: "#FFF" }}>{log.actor}</td>
                    <td style={{ padding: "12px 18px" }}>
                      <span className={`ms-badge ms-badge--${log.role === "Admin" ? "pending_partial" : log.role === "Head" ? "partial_approved" : "paid"}`}>
                        {log.role}
                      </span>
                    </td>
                    <td style={{ padding: "12px 18px", color: "var(--ms-lavender)" }}>{log.action}</td>
                    <td style={{ padding: "12px 18px", color: "var(--ms-text-muted)" }}>{log.details}</td>
                    <td style={{ padding: "12px 18px", color: "var(--ms-text-dim)" }}>{log.timestamp}</td>
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
          <div className="ms-modal" style={{ maxWidth: "600px" }}>
            <h3 style={{ margin: "0 0 6px", color: "#FFF" }}>Review Partial Payment Request</h3>
            <p style={{ margin: "0 0 16px", color: "var(--ms-text-muted)", fontSize: "0.85rem" }}>
              Application ID: <strong style={{ color: "var(--ms-accent)" }}>{reviewApp.id}</strong> • Submitted: {reviewApp.submittedAt}
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", background: "rgba(30, 58, 138, 0.25)", padding: "16px", borderRadius: "12px", border: "1px solid var(--ms-border)", fontSize: "0.88rem", marginBottom: "16px" }}>
              <div>
                <span style={{ color: "var(--ms-text-muted)", fontSize: "0.78rem" }}>Student Info</span>
                <p style={{ margin: "2px 0 0", fontWeight: "700", color: "#FFF" }}>{reviewApp.studentName} ({reviewApp.studentId})</p>
              </div>
              <div>
                <span style={{ color: "var(--ms-text-muted)", fontSize: "0.78rem" }}>Requested Amount</span>
                <p style={{ margin: "2px 0 0", fontWeight: "800", color: "#34D399", fontSize: "1.1rem" }}>
                  ৳{reviewApp.requestedAmount.toLocaleString()} <span style={{ fontSize: "0.8rem", color: "var(--ms-text-dim)", textDecoration: "line-through" }}>৳{reviewApp.originalAmount.toLocaleString()}</span>
                </p>
              </div>
              <div>
                <span style={{ color: "var(--ms-text-muted)", fontSize: "0.78rem" }}>Stated Reason</span>
                <p style={{ margin: "2px 0 0", color: "var(--ms-light)" }}>"{reviewApp.reason}"</p>
              </div>
              <div>
                <span style={{ color: "var(--ms-text-muted)", fontSize: "0.78rem" }}>AI Signature Verification Score</span>
                <p style={{ margin: "2px 0 0", color: "#34D399", fontWeight: "700" }}>{reviewApp.aiMatchScore}% Match (High Similarity)</p>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button type="button" className="ms-btn-primary" onClick={() => handleForwardToHead(reviewApp.id)}>
                <CheckCircle2 size={16} /> Approve & Forward to Head / Director
              </button>

              <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                <input
                  type="text"
                  placeholder="Reason for declining..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  style={{ flex: 1, padding: "8px 12px", background: "rgba(30, 58, 138, 0.3)", border: "1px solid var(--ms-border)", borderRadius: "10px", color: "#FFF", outline: "none", fontSize: "0.82rem" }}
                />
                <button type="button" className="ms-btn-secondary" style={{ color: "#F87171" }} onClick={() => handleRejectByAdmin(reviewApp.id)}>
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

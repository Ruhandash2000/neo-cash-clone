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
import { useNeoStore, StudentRecord, PartialApplication, EscalationTicket, NotificationItem, AuditLog } from "@/lib/neo-cash-store";
import { StatusBadge } from "@/components/design-system/status-badge";
import { formatTaka } from "@/components/design-system/tokens";
import {
  Users, DollarSign, FileSpreadsheet, ShieldCheck, AlertTriangle, ArrowRight,
  CheckCircle2, XCircle, Search, Filter, Plus, Upload, FileText, Check, Clock, RefreshCw, X, Sparkles, MessageSquare, Send, CornerDownRight, LifeBuoy, Bell, Zap,
  Eye, Edit3, UserCheck, CreditCard, History, Wallet, Calendar, Award, Mail, Phone, Shield, CheckSquare, Layers, Activity, UserX, ChevronRight, Download, PhoneCall, AlertCircle
} from "lucide-react";
import { AdminAnalyticsDashboard } from "@/components/dashboard/admin-analytics-dashboard";

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

  // Add New Student Modal State
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [addName, setAddName] = useState("");
  const [addStudentId, setAddStudentId] = useState("");
  const [addDept, setAddDept] = useState("CSE");
  const [addClassYear, setAddClassYear] = useState("1st Year");
  const [addSection, setAddSection] = useState("Sec A");
  const [addSemester, setAddSemester] = useState("1st Sem");
  const [addEmail, setAddEmail] = useState("");
  const [addPhone, setAddPhone] = useState("+880 1700-000000");
  const [addDues, setAddDues] = useState<number>(6500);

  // Bulk Fee Assignment Form
  const [bulkTitle, setBulkTitle] = useState("Semester Tuition Fee (Spring 2027)");
  const [bulkAmount, setBulkAmount] = useState<number>(6500);
  const [bulkDueDate, setBulkDueDate] = useState("2027-01-15");
  const [bulkCategory, setBulkCategory] = useState<"Tuition" | "Lab & Tech" | "Exam">("Tuition");
  const [targetClass, setTargetClass] = useState("CSE 3rd Semester");
  const [targetSection, setTargetSection] = useState("Sec A");


  const [importRows, setImportRows] = useState<Array<{ name: string; studentId: string; department: string; classSection: string; email: string }>>([
    { name: "Aria Rahman", studentId: "DCC-2024-9001", department: "CSE", classSection: "CSE 3rd Sem (Sec B)", email: "aria.r@dcc.edu.bd" },
    { name: "Siddique Hossain", studentId: "DCC-2024-9002", department: "EEE", classSection: "EEE 1st Sem (Sec A)", email: "siddique.h@dcc.edu.bd" },
    { name: "Mahmudul Hasan", studentId: "DCC-2024-9003", department: "BBA", classSection: "Inter 2nd Year (Sec A)", email: "mahmudul.h@dcc.edu.bd" },
  ]);

  // Selected Application for Review Modal
  const [reviewApp, setReviewApp] = useState<PartialApplication | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

        // Phase 16 — Partial Payment Admin Review Queue State
  const [appFilterTab, setAppFilterTab] = useState<"all" | "pending" | "under_review" | "forwarded" | "approved" | "rejected" | "changes">("all");

  // Phase 15 — Student Excel/CSV Import & AI Processor State
  const [importFileName, setImportFileName] = useState<string | null>("fall_2026_cse_freshers.csv");
  const [importFilterTab, setImportFilterTab] = useState<"all" | "valid" | "warning" | "error">("all");

  interface ImportRowItem {
    id: string;
    name: string;
    studentId: string;
    roll: string;
    department: string;
    classYear: string;
    section: string;
    semester: string;
    session: string;
    email: string;
    phone: string;
    status: "valid" | "warning" | "error";
    issue?: string;
  }

  const [importPreviewRows, setImportPreviewRows] = useState<ImportRowItem[]>([
    { id: "imp-row-1", name: "Aria Rahman", studentId: "DCC-2024-9001", roll: "2401", department: "CSE", classYear: "1st Year", section: "Sec A", semester: "1st Sem", session: "2024-2025", email: "aria.r@dcc.edu.bd", phone: "+880 1711-001122", status: "valid" },
    { id: "imp-row-2", name: "Siddique Hossain", studentId: "DCC-2024-9002", roll: "2402", department: "EEE", classYear: "1st Year", section: "Sec A", semester: "1st Sem", session: "2024-2025", email: "siddique.h@dcc.edu.bd", phone: "+880 1711-001123", status: "valid" },
    { id: "imp-row-3", name: "Mahmudul Hasan", studentId: "DCC-2024-9003", roll: "2403", department: "BBA", classYear: "2nd Year", section: "Sec B", semester: "3rd Sem", session: "2024-2025", email: "mahmudul.h@dcc.edu.bd", phone: "+880 1711-001124", status: "valid" },
    { id: "imp-row-4", name: "", studentId: "DCC-2024-9004", roll: "2404", department: "CSE", classYear: "1st Year", section: "Sec B", semester: "1st Sem", session: "2024-2025", email: "invalid.email.com", phone: "+880 1711-001125", status: "error", issue: "Missing Student Name & Invalid Email" },
    { id: "imp-row-5", name: "Ruhan Dash Dibya", studentId: "DCC-CSE-24-1024", roll: "1024", department: "CSE", classYear: "1st Year", section: "Sec A", semester: "2nd Sem", session: "2024-2025", email: "student@neocash.ai", phone: "+880 1712-345678", status: "error", issue: "Duplicate Student ID: DCC-CSE-24-1024" },
    { id: "imp-row-6", name: "Nabila Islam", studentId: "DCC-2024-9006", roll: "", department: "CSE", classYear: "1st Year", section: "Sec C", semester: "1st Sem", session: "", email: "nabila.i@dcc.edu.bd", phone: "", status: "warning", issue: "Missing optional roll/session (defaults applied)" },
  ]);

  // Re-evaluates validation live when inline editing row fields
  const validateRow = (row: ImportRowItem, allRows: ImportRowItem[]): { status: "valid" | "warning" | "error"; issue?: string } => {
    if (!row.name || !row.name.trim()) return { status: "error", issue: "Missing Student Name" };
    if (!row.email || !row.email.includes("@")) return { status: "error", issue: "Invalid Email Format" };
    if (!row.classYear || !row.classYear.trim()) return { status: "error", issue: "Missing Academic Class/Year" };
    if (!row.section || !row.section.trim()) return { status: "error", issue: "Missing Section" };

    // Duplicate check in existing store & file
    const existsInStore = store.students.some(s => s.studentId.toLowerCase() === row.studentId.toLowerCase());
    const countInFile = allRows.filter(r => r.studentId.toLowerCase() === row.studentId.toLowerCase()).length;

    if (existsInStore || countInFile > 1) {
      return { status: "error", issue: `Duplicate Student ID: ${row.studentId}` };
    }

    if (!row.roll || !row.session || !row.phone) {
      return { status: "warning", issue: "Missing optional roll/phone (defaults applied)" };
    }

    return { status: "valid" };
  };

  const handleUpdateRowCell = (id: string, field: keyof ImportRowItem, value: string) => {
    setImportPreviewRows(prev => {
      const updated = prev.map(r => r.id === id ? { ...r, [field]: value } : r);
      return updated.map(r => {
        const valRes = validateRow(r, updated);
        const { issue, ...rest } = r;
        return {
          ...rest,
          status: valRes.status,
          ...(valRes.issue ? { issue: valRes.issue } : {}),
        };
      });
    });
  };

  const handleLoadSampleBatch = () => {
    const sampleBatch: ImportRowItem[] = [
      { id: "imp-s-1", name: "Tariqul Islam", studentId: "DCC-2025-9101", roll: "2501", department: "CSE", classYear: "1st Year", section: "Sec A", semester: "1st Sem", session: "2025-2026", email: "tariqul.i@dcc.edu.bd", phone: "+880 1711-889900", status: "valid" },
      { id: "imp-s-2", name: "Farhana Yasmin", studentId: "DCC-2025-9102", roll: "2502", department: "CSE", classYear: "1st Year", section: "Sec A", semester: "1st Sem", session: "2025-2026", email: "farhana.y@dcc.edu.bd", phone: "+880 1711-889901", status: "valid" },
      { id: "imp-s-3", name: "Imtiaz Ahmed", studentId: "DCC-2025-9103", roll: "2503", department: "EEE", classYear: "1st Year", section: "Sec B", semester: "1st Sem", session: "2025-2026", email: "imtiaz.a@dcc.edu.bd", phone: "+880 1711-889902", status: "valid" },
      { id: "imp-s-4", name: "Kazi Nazrul", studentId: "DCC-CSE-24-1024", roll: "2504", department: "CSE", classYear: "1st Year", section: "Sec A", semester: "1st Sem", session: "2025-2026", email: "kazi.n@dcc.edu.bd", phone: "+880 1711-889903", status: "error", issue: "Duplicate Student ID: DCC-CSE-24-1024" },
      { id: "imp-s-5", name: "", studentId: "DCC-2025-9105", roll: "2505", department: "BBA", classYear: "1st Year", section: "Sec A", semester: "1st Sem", session: "2025-2026", email: "missing_name_domain.com", phone: "+880 1711-889904", status: "error", issue: "Missing Student Name & Invalid Email" },
    ];
    setImportFileName("sample_freshers_batch_2025.csv");
    setImportPreviewRows(sampleBatch);
    alert("Loaded sample batch file with valid rows, warnings, and deliberate errors for AI validation test!");
  };

  const handleConfirmFinalImport = () => {
    const validRows = importPreviewRows.filter(r => r.status === "valid" || r.status === "warning");
    const errorRows = importPreviewRows.filter(r => r.status === "error");

    if (validRows.length === 0) {
      return alert("No valid student records available to import. Please correct row errors inline in the preview matrix.");
    }

    const res = actions.importStudentsValidated({
      students: validRows,
      rejectedCount: errorRows.length,
      warningCount: importPreviewRows.filter(r => r.status === "warning").length,
      fileName: importFileName || "students_batch_upload.csv",
    });

    if (res && res.ok) {
      alert(`Successfully imported ${res.imported} student records into the directory! ${errorRows.length} bad rows rejected.`);
      setImportPreviewRows([]);
      setImportFileName(null);
    }
  };

  // Phase 14 — Excel-Like Bulk Fee Assignment State
  const [bulkInstitution, setBulkInstitution] = useState("Dhaka City College");
  const [bulkDept, setBulkDept] = useState("CSE");
  const [bulkClassYear, setBulkClassYear] = useState("1st Year");
  const [bulkSection, setBulkSection] = useState("Sec A");
  const [bulkSemester, setBulkSemester] = useState("1st Sem");
  const [bulkIssueDate, setBulkIssueDate] = useState("2026-09-26");
  const [showBulkConfirmModal, setShowBulkConfirmModal] = useState(false);
  const [selectedBulkStudentIds, setSelectedBulkStudentIds] = useState<string[]>([]);

  const handleOpenBulkConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkTitle.trim()) return alert("Please enter fee title.");
    if (bulkAmount <= 0) return alert("Please enter valid fee amount.");
    if (!bulkDueDate) return alert("Please enter deadline due date.");

    // Populate targeted students
    const targeted = store.students.filter((s) => {
      const matchDept = bulkDept === "all" || s.department === bulkDept;
      const matchClass = bulkClassYear === "all" || s.classYear === bulkClassYear;
      const matchSection = bulkSection === "all" || s.section === bulkSection;
      const matchSemester = bulkSemester === "all" || s.semester === bulkSemester;
      return matchDept && matchClass && matchSection && matchSemester;
    });

    if (targeted.length === 0) {
      return alert("No students found matching the selected Department, Class, Section, and Semester criteria.");
    }

    if (selectedBulkStudentIds.length === 0) {
      setSelectedBulkStudentIds(targeted.map(s => s.id));
    }

    setShowBulkConfirmModal(true);
  };

  const handleConfirmFinalBulkAssign = () => {
    const res = actions.bulkAssignFee({
      title: bulkTitle,
      amount: Number(bulkAmount),
      issueDate: bulkIssueDate,
      dueDate: bulkDueDate,
      category: bulkCategory,
      institution: bulkInstitution,
      department: bulkDept,
      classYear: bulkClassYear,
      section: bulkSection,
      semester: bulkSemester,
      targetStudentIds: selectedBulkStudentIds,
      description: `Institutional bulk fee assigned to ${bulkDept} ${bulkClassYear} (${bulkSection}) for ${bulkSemester}.`,
    });

    if (res && res.ok) {
      setShowBulkConfirmModal(false);
      alert(`Successfully assigned "${bulkTitle}" (${formatTaka(bulkAmount)}) to ${res.count} students! Deadline: ${bulkDueDate}.`);
    }
  };

  // Phase 13 — Academic Structure Management State
  
  // Phase 17 — Financial Intelligence & Admin Contact Operations State
  const [riskFilter, setRiskFilter] = useState<"all" | "overdue" | "ignored_reminders" | "failed_payment" | "repeated_delay">("all");
  const [contactModalStudent, setContactModalStudent] = useState<StudentRecord | null>(null);
  const [contactChannel, setContactChannel] = useState<"email" | "sms" | "call">("email");
  const [contactEmailSubject, setContactEmailSubject] = useState("");
  const [contactEmailBody, setContactEmailBody] = useState("");
  const [contactSmsBody, setContactSmsBody] = useState("");
  const [callState, setCallState] = useState<"idle" | "dialing" | "connected" | "ended">("idle");
  const [callNotes, setCallNotes] = useState("");

  const handleOpenContactModal = (student: StudentRecord, defaultChannel: "email" | "sms" | "call" = "email") => {
    setContactModalStudent(student);
    setContactChannel(defaultChannel);
    setContactEmailSubject(`[Notice] Financial Context & Payment Assistance — ${student.name} (${student.studentId})`);
    setContactEmailBody(`Dear ${student.name},\n\nWe are writing from the Dhaka City College Accounts Office regarding your outstanding tuition balance of ৳${(student.totalDues || 6500).toLocaleString()}.\n\nIf you are experiencing financial hardship, you can submit a Partial Payment Application directly through your Neo Cash portal or request a deadline extension.\n\nPlease contact us or reply to this notice.\n\nWarm regards,\nAccounts & Financial Services\nDhaka City College`);
    setContactSmsBody(`Dhaka City College Notice: Dear ${student.name}, your tuition balance of ৳${(student.totalDues || 6500).toLocaleString()} is pending. Submit a partial payment request via Neo Cash or call +880 2-9661234.`);
    setCallState("idle");
    setCallNotes("");
  };

  const handleSendDemoEmail = () => {
    if (!contactModalStudent) return;
    actions.dispatchNotificationEvent({
      eventType: "admin_reviewed",
      title: `Admin Contact (Email Sent)`,
      message: `Official notice emailed to ${contactModalStudent.name} (${contactModalStudent.email}): "${contactEmailSubject}"`,
      type: "info",
      category: "email",
    });
    alert(`Demo Email dispatched successfully to ${contactModalStudent.name} (${contactModalStudent.email})!\n\nLogged to activity audit trail.`);
    setContactModalStudent(null);
  };

  const handleSendDemoSms = () => {
    if (!contactModalStudent) return;
    actions.dispatchNotificationEvent({
      eventType: "admin_reviewed",
      title: `Admin Contact (SMS Sent)`,
      message: `SMS dispatched to ${contactModalStudent.name} (${contactModalStudent.phone}): "${contactSmsBody.slice(0, 60)}..."`,
      type: "info",
      category: "institution",
    });
    alert(`Demo SMS dispatched to ${contactModalStudent.phone}!\n\nLogged to activity audit trail.`);
    setContactModalStudent(null);
  };

  const handleStartDemoCall = () => {
    setCallState("dialing");
    setTimeout(() => {
      setCallState("connected");
    }, 1200);
  };

  const handleLogCallOutcome = () => {
    if (!contactModalStudent) return;
    const outcomeText = callNotes.trim() || "Discussed payment options and informed student regarding partial payment application.";
    actions.dispatchNotificationEvent({
      eventType: "admin_reviewed",
      title: `Admin Phone Call Logged`,
      message: `Voice call completed with ${contactModalStudent.name} (+880 ${contactModalStudent.phone}). Outcome: ${outcomeText}`,
      type: "success",
      category: "institution",
    });
    alert(`Call outcome logged for ${contactModalStudent.name}!\n\nDetails saved to institutional record.`);
    setContactModalStudent(null);
  };

  
  // Phase 18 — Admin Audit Trail Filter & Detail Modal State
  const [auditUserSearch, setAuditUserSearch] = useState("");
  const [auditRoleFilter, setAuditRoleFilter] = useState<"all" | "Admin" | "Head" | "Student" | "System">("all");
  const [auditActionFilter, setAuditActionFilter] = useState<string>("all");
  const [auditDateSearch, setAuditDateSearch] = useState("");
  const [auditStudentSearch, setAuditStudentSearch] = useState("");
  const [auditFinancialSearch, setAuditFinancialSearch] = useState("");
  const [selectedAuditLog, setSelectedAuditLog] = useState<AuditLog | null>(null);

  const handleResetAuditFilters = () => {
    setAuditUserSearch("");
    setAuditRoleFilter("all");
    setAuditActionFilter("all");
    setAuditDateSearch("");
    setAuditStudentSearch("");
    setAuditFinancialSearch("");
  };

  const [academicSubTab, setAcademicSubTab] = useState<"structure" | "promotion" | "sections">("structure");

  // Creation forms state
  const [newDeptCode, setNewDeptCode] = useState("");
  const [newDeptName, setNewDeptName] = useState("");
  const [newDeptHead, setNewDeptHead] = useState("");

  const [newClassName, setNewClassName] = useState("");
  const [newClassDept, setNewClassDept] = useState("CSE");
  const [newClassYear, setNewClassYear] = useState("1st Year");
  const [newClassSemester, setNewClassSemester] = useState("1st Sem");

  const [newSecName, setNewSecName] = useState("");
  const [newSecDept, setNewSecDept] = useState("CSE");
  const [newSecClassYear, setNewSecClassYear] = useState("1st Year");
  const [newSecCapacity, setNewSecCapacity] = useState<number>(50);

  // Promotion engine state
  const [promoSourceDept, setPromoSourceDept] = useState("CSE");
  const [promoSourceClassYear, setPromoSourceClassYear] = useState("1st Year");
  const [promoSourceSemester, setPromoSourceSemester] = useState("1st Sem");
  const [promoTargetClassYear, setPromoTargetClassYear] = useState("2nd Year");
  const [promoTargetSemester, setPromoTargetSemester] = useState("2nd Sem");

  // Section manager & bulk transfer state
  const [selectedStudentIdsForSection, setSelectedStudentIdsForSection] = useState<string[]>([]);
  const [bulkTargetSection, setBulkTargetSection] = useState("Sec B");

  // Phase 13 Handlers
  const handleCreateDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeptCode.trim() || !newDeptName.trim()) return alert("Please enter department code and name.");
    actions.createDepartment({ code: newDeptCode.trim(), name: newDeptName.trim(), headName: newDeptHead.trim() || "Unassigned" });
    setNewDeptCode("");
    setNewDeptName("");
    setNewDeptHead("");
    alert(`Department ${newDeptCode.toUpperCase()} created successfully!`);
  };

  const handleCreateClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return alert("Please enter class name.");
    actions.createClass({ name: newClassName.trim(), department: newClassDept, year: newClassYear, semester: newClassSemester });
    setNewClassName("");
    alert(`Class "${newClassName}" created successfully!`);
  };

  const handleCreateSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSecName.trim()) return alert("Please enter section name.");
    actions.createSection({ name: newSecName.trim(), department: newSecDept, classYear: newSecClassYear, capacity: newSecCapacity });
    setNewSecName("");
    alert(`Section "${newSecName}" created successfully!`);
  };

  const handleExecuteCohortPromotion = () => {
    const matchingCount = store.students.filter(s =>
      (promoSourceDept === "all" || s.department === promoSourceDept) &&
      (promoSourceClassYear === "all" || s.classYear === promoSourceClassYear) &&
      (promoSourceSemester === "all" || s.semester === promoSourceSemester)
    ).length;

    if (matchingCount === 0) {
      return alert("No students found matching the selected source department, class, and semester criteria.");
    }

    if (!confirm(`Are you sure you want to promote ${matchingCount} students from [${promoSourceDept} ${promoSourceClassYear} (${promoSourceSemester})] to [${promoTargetClassYear} (${promoTargetSemester})]?\n\nRule: Student identity, digital wallet, fee records, and transaction histories will be preserved.`)) {
      return;
    }

    const res = actions.promoteCohort({
      sourceDept: promoSourceDept,
      sourceClassYear: promoSourceClassYear,
      sourceSemester: promoSourceSemester,
      targetClassYear: promoTargetClassYear,
      targetSemester: promoTargetSemester,
    });

    if (res.ok) {
      alert(`Successfully promoted ${res.count} students to ${promoTargetClassYear} (${promoTargetSemester})! Audit log created.`);
    }
  };

  const handleToggleStudentSelectionForSection = (id: string) => {
    if (selectedStudentIdsForSection.includes(id)) {
      setSelectedStudentIdsForSection(selectedStudentIdsForSection.filter(x => x !== id));
    } else {
      setSelectedStudentIdsForSection([...selectedStudentIdsForSection, id]);
    }
  };

  const handleSelectAllStudentsForSection = () => {
    if (selectedStudentIdsForSection.length === store.students.length) {
      setSelectedStudentIdsForSection([]);
    } else {
      setSelectedStudentIdsForSection(store.students.map(s => s.id));
    }
  };

  const handleExecuteBulkSectionTransfer = () => {
    if (selectedStudentIdsForSection.length === 0) {
      return alert("Select at least one student for bulk section assignment.");
    }
    const res = actions.bulkAssignStudentsSection(selectedStudentIdsForSection, bulkTargetSection);
    if (res.ok) {
      alert(`Successfully reassigned ${res.count} students to ${bulkTargetSection}!`);
      setSelectedStudentIdsForSection([]);
    }
  };

  const handleSingleSectionTransfer = (studentId: string, targetSec: string) => {
    const res = actions.moveStudentSection(studentId, targetSec);
    if (res.ok && res.student) {
      alert(`Reassigned ${res.student.name} to section ${targetSec}!`);
    }
  };

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

  const handleCreateStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!addName.trim()) return alert("Enter student full name.");
    if (!addStudentId.trim()) return alert("Enter student ID.");

    const res = actions.addStudent({
      name: addName.trim(),
      studentId: addStudentId.trim(),
      department: addDept,
      classYear: addClassYear,
      section: addSection,
      semester: addSemester,
      email: addEmail.trim() || `${addStudentId.toLowerCase().trim()}@dcc.edu.bd`,
      phone: addPhone,
      totalDues: Number(addDues) || 0,
    });

    if (res.ok && res.student) {
      setShowAddStudentModal(false);
      alert(`Successfully enrolled ${res.student.name} (${res.student.studentId}) into ${res.student.classSection}!`);
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

  const renderEscalationsTab = () => {
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
      };

  const renderAnalyticsView = () => {
    return (
      <div style={{ padding: "24px" }}>
        <AdminAnalyticsDashboard />
      </div>
    );
  };

  const renderAuditView = () => {
        const filteredAuditLogs = store.auditLogs.filter((log) => {
          const matchesUser = !auditUserSearch || log.actor.toLowerCase().includes(auditUserSearch.toLowerCase());
          const matchesRole = auditRoleFilter === "all" || log.role === auditRoleFilter;
          const matchesAction = auditActionFilter === "all" || (log.actionType && log.actionType === auditActionFilter) || log.action.toLowerCase().includes(auditActionFilter.toLowerCase());
          const matchesDate = !auditDateSearch || log.timestamp.toLowerCase().includes(auditDateSearch.toLowerCase());
          const matchesStudent = !auditStudentSearch || (log.studentName && log.studentName.toLowerCase().includes(auditStudentSearch.toLowerCase())) || (log.studentId && log.studentId.toLowerCase().includes(auditStudentSearch.toLowerCase())) || log.details.toLowerCase().includes(auditStudentSearch.toLowerCase());
          const matchesFinancial = !auditFinancialSearch || (log.financialRecordTitle && log.financialRecordTitle.toLowerCase().includes(auditFinancialSearch.toLowerCase())) || log.details.toLowerCase().includes(auditFinancialSearch.toLowerCase());

          return matchesUser && matchesRole && matchesAction && matchesDate && matchesStudent && matchesFinancial;
        });

        const hasActiveAuditFilters = Boolean(
          auditUserSearch || auditRoleFilter !== "all" || auditActionFilter !== "all" || auditDateSearch || auditStudentSearch || auditFinancialSearch
        );

        return (
          <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
            
            {/* HEADER BANNER */}
            <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "18px", padding: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                  <span style={{ fontSize: "0.74rem", background: "rgba(211, 84, 0, 0.12)", color: "#D35400", border: "1px solid rgba(211, 84, 0, 0.3)", padding: "3px 10px", borderRadius: "999px", fontWeight: 700 }}>
                    🔒 Immutable Compliance Ledger
                  </span>
                  <span style={{ fontSize: "0.82rem", color: "#66564A", fontWeight: 600 }}>Dhaka City College</span>
                </div>
                <h1 style={{ margin: 0, fontSize: "1.8rem", fontWeight: 800, color: "#241A14", letterSpacing: "-0.02em" }}>
                  Institutional Operations Audit Trail
                </h1>
                <p style={{ margin: "4px 0 0", fontSize: "0.9rem", color: "#66564A" }}>
                  Read-only chronological audit trail tracking all fee assignments, deadline changes, application reviews, head approvals, section transfers, and student imports.
                </p>
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <span style={{ background: "#FFF7E6", border: "1px solid #D35400", color: "#D35400", padding: "8px 14px", borderRadius: "10px", fontSize: "0.82rem", fontWeight: 800, display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <ShieldCheck size={16} /> Strict Read-Only Audit History
                </span>
              </div>
            </div>

            {/* 6-DIMENSION MULTI-FILTER BAR */}
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "#241A14", textTransform: "uppercase", letterSpacing: "0.04em", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <Filter size={15} color="#D35400" /> 6-Dimension Audit Filters
                </span>
                {hasActiveAuditFilters && (
                  <button
                    type="button"
                    onClick={handleResetAuditFilters}
                    style={{ background: "none", border: "none", color: "#BE123C", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" }}
                  >
                    <RefreshCw size={13} /> Reset All Filters
                  </button>
                )}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px" }}>
                
                {/* 1. USER / ACTOR SEARCH */}
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#66564A", display: "block", marginBottom: "4px" }}>Actor / User</label>
                  <input
                    type="text"
                    placeholder="Search user name..."
                    value={auditUserSearch}
                    onChange={(e) => setAuditUserSearch(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "8px", fontSize: "0.82rem", color: "#241A14" }}
                  />
                </div>

                {/* 2. ROLE FILTER */}
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#66564A", display: "block", marginBottom: "4px" }}>User Role</label>
                  <select
                    value={auditRoleFilter}
                    onChange={(e) => setAuditRoleFilter(e.target.value as any)}
                    style={{ width: "100%", padding: "8px 12px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "8px", fontSize: "0.82rem", color: "#241A14", fontWeight: 600 }}
                  >
                    <option value="all">All Roles</option>
                    <option value="Admin">Admin Only</option>
                    <option value="Head">Executive Head Only</option>
                    <option value="Student">Student Only</option>
                    <option value="System">System AI Engine</option>
                  </select>
                </div>

                {/* 3. ACTION TYPE FILTER */}
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#66564A", display: "block", marginBottom: "4px" }}>Action Category</label>
                  <select
                    value={auditActionFilter}
                    onChange={(e) => setAuditActionFilter(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "8px", fontSize: "0.82rem", color: "#241A14", fontWeight: 600 }}
                  >
                    <option value="all">All Actions</option>
                    <option value="fee_assignment">Fee Assignment</option>
                    <option value="deadline_change">Deadline Change</option>
                    <option value="app_review">Application Review</option>
                    <option value="forward_head">Forwarded to Head</option>
                    <option value="section_change">Section Transfer</option>
                    <option value="student_import">Student Roster Import</option>
                    <option value="head_approval">Head Final Approval</option>
                  </select>
                </div>

                {/* 4. DATE SEARCH */}
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#66564A", display: "block", marginBottom: "4px" }}>Date / Timestamp</label>
                  <input
                    type="text"
                    placeholder="Search date (e.g. 2026-09-26)..."
                    value={auditDateSearch}
                    onChange={(e) => setAuditDateSearch(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "8px", fontSize: "0.82rem", color: "#241A14" }}
                  />
                </div>

                {/* 5. STUDENT SEARCH */}
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#66564A", display: "block", marginBottom: "4px" }}>Student Target</label>
                  <input
                    type="text"
                    placeholder="Student name or ID..."
                    value={auditStudentSearch}
                    onChange={(e) => setAuditStudentSearch(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "8px", fontSize: "0.82rem", color: "#241A14" }}
                  />
                </div>

                {/* 6. FINANCIAL RECORD SEARCH */}
                <div>
                  <label style={{ fontSize: "0.75rem", fontWeight: 700, color: "#66564A", display: "block", marginBottom: "4px" }}>Financial Record</label>
                  <input
                    type="text"
                    placeholder="Fee title or receipt..."
                    value={auditFinancialSearch}
                    onChange={(e) => setAuditFinancialSearch(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "8px", fontSize: "0.82rem", color: "#241A14" }}
                  />
                </div>

              </div>
            </div>

            {/* AUDIT LOG TABLE */}
            <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.35)", borderRadius: "18px", overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", background: "#FDF9F3", borderBottom: "1px solid rgba(196, 154, 108, 0.25)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.88rem", fontWeight: 800, color: "#241A14" }}>
                  Displaying {filteredAuditLogs.length} Immutable Audit Event Records
                </span>
                <span style={{ fontSize: "0.76rem", color: "#8C7A6A" }}>
                  Append-Only Log • Click any row for comparative diff dossier
                </span>
              </div>

              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
                  <thead>
                    <tr style={{ background: "#FFF7E6", textAlign: "left", color: "#66564A", borderBottom: "1px solid rgba(196, 154, 108, 0.3)" }}>
                      <th style={{ padding: "12px 18px", fontWeight: 700 }}>Log ID & Actor</th>
                      <th style={{ padding: "12px 18px", fontWeight: 700 }}>Role</th>
                      <th style={{ padding: "12px 18px", fontWeight: 700 }}>Action Title</th>
                      <th style={{ padding: "12px 18px", fontWeight: 700 }}>Target Entity & Scope</th>
                      <th style={{ padding: "12px 18px", fontWeight: 700 }}>Logged Time</th>
                      <th style={{ padding: "12px 18px", fontWeight: 700, textAlign: "right" }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAuditLogs.length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ padding: "32px", textAlign: "center", color: "#8C7A6A" }}>
                          No audit records match the selected multi-filter criteria.
                        </td>
                      </tr>
                    ) : (
                      filteredAuditLogs.map((log) => (
                        <tr
                          key={log.id}
                          onClick={() => setSelectedAuditLog(log)}
                          style={{ borderBottom: "1px solid rgba(196, 154, 108, 0.2)", cursor: "pointer", transition: "background 0.15s ease" }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = "#FDF9F3")}
                          onMouseLeave={(e) => (e.currentTarget.style.background = "#FFFFFF")}
                        >
                          {/* LOG ID & ACTOR */}
                          <td style={{ padding: "14px 18px" }}>
                            <strong style={{ color: "#241A14", display: "block" }}>{log.actor}</strong>
                            <span style={{ fontSize: "0.74rem", color: "#D35400", fontWeight: 700 }}>{log.id.toUpperCase()}</span>
                          </td>

                          {/* ROLE */}
                          <td style={{ padding: "14px 18px" }}>
                            <span style={{
                              padding: "3px 10px",
                              borderRadius: "6px",
                              fontSize: "0.75rem",
                              fontWeight: 800,
                              background: log.role === "Admin" ? "rgba(211, 84, 0, 0.12)" : log.role === "Head" ? "rgba(124, 58, 237, 0.12)" : "rgba(4, 120, 87, 0.12)",
                              color: log.role === "Admin" ? "#D35400" : log.role === "Head" ? "#7C3AED" : "#047857",
                            }}>
                              {log.role}
                            </span>
                          </td>

                          {/* ACTION TITLE */}
                          <td style={{ padding: "14px 18px" }}>
                            <strong style={{ color: "#241A14", display: "block" }}>{log.action}</strong>
                            <span style={{ fontSize: "0.76rem", color: "#66564A" }}>{log.details}</span>
                          </td>

                          {/* TARGET ENTITY */}
                          <td style={{ padding: "14px 18px" }}>
                            <span style={{ color: "#241A14", fontWeight: 700, display: "block" }}>
                              {log.studentName || log.studentId || "Institutional Scope"}
                            </span>
                            <span style={{ fontSize: "0.75rem", color: "#8C7A6A" }}>
                              {log.financialRecordTitle || "System Operation"}
                            </span>
                          </td>

                          {/* LOGGED TIME */}
                          <td style={{ padding: "14px 18px", color: "#8C7A6A", fontSize: "0.82rem", fontFeatureSettings: "'tnum'" }}>
                            {log.timestamp}
                          </td>

                          {/* ACTION */}
                          <td style={{ padding: "14px 18px", textAlign: "right" }}>
                            <button
                              type="button"
                              onClick={(e) => { e.stopPropagation(); setSelectedAuditLog(log); }}
                              style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", color: "#D35400", padding: "6px 12px", borderRadius: "8px", fontSize: "0.78rem", fontWeight: 800, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" }}
                            >
                              <Eye size={14} /> View Dossier
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
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
      );
    };

            {/* 6. HUMAN SUPPORT ESCALATION QUEUE (PHASE 8) */}
      

{/* 7. INSTITUTIONAL REMINDER RULES & ALERT ENGINE (PHASE 10) */}
  const renderRemindersTab = () => {
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
                <span className="institution-branding" style={{ fontSize: "0.82rem", color: "#66564A", fontWeight: 600 }}>
                  <img src="https://images.seeklogo.com/logo-png/48/1/dhaka-city-college-logo-png_seeklogo-487912.png" alt="Dhaka City College" />
                  <span>Dhaka City College (Dhanmondi, Dhaka)</span>
                </span>
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
              <button
                type="button"
                onClick={() => {
                  setAddName("");
                  setAddStudentId(`DCC-2026-${Math.floor(1000 + Math.random() * 9000)}`);
                  setAddEmail("");
                  setShowAddStudentModal(true);
                }}
                style={{ background: "#D35400", color: "#FFFFFF", border: "none", padding: "8px 16px", borderRadius: "8px", fontSize: "0.84rem", fontWeight: 800, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px", boxShadow: "0 2px 8px rgba(211, 84, 0, 0.25)" }}
              >
                <Plus size={15} /> Add New Student
              </button>
            </div>
          </div>

          {/* 6-DIMENSION FILTERS & SEARCH BAR (PHASE 12) */}
          <div className="student-directory-controls" style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "16px", padding: "18px", display: "flex", flexDirection: "column", gap: "14px" }}>
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
          <div className="mobile-directory-table student-directory-results" style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "14px", overflowX: "auto" }}>
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

      
      {/* 9. PHASE 13 — ACADEMIC STRUCTURE MANAGEMENT */}
      {activeTab === "academic" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* HEADER */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 800, color: "#241A14" }}>
                Academic Structure & Enrolment Management
              </h2>
              <p style={{ margin: "4px 0 0", fontSize: "0.88rem", color: "#66564A" }}>
                Manage institutional departments, classes, sections, years, semesters, seamless cohort promotions, and student transfers.
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <span style={{ fontSize: "0.82rem", background: "#FFF7E6", border: "1px solid rgba(196, 154, 108, 0.4)", padding: "6px 14px", borderRadius: "8px", fontWeight: 700, color: "#D35400" }}>
                Active Structure: {store.academicStructure?.departments?.length || 4} Depts • {store.academicStructure?.classes?.length || 5} Classes • {store.academicStructure?.sections?.length || 4} Sections
              </span>
            </div>
          </div>

          {/* TOP METRIC CARDS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px" }}>
            <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "14px", padding: "16px" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#66564A", display: "block" }}>Departments</span>
              <strong style={{ fontSize: "1.4rem", fontWeight: 800, color: "#241A14" }}>{store.academicStructure?.departments?.length || 4} Registered</strong>
              <p style={{ margin: "4px 0 0", fontSize: "0.76rem", color: "#8C7A6A" }}>CSE, EEE, BBA, Civil</p>
            </div>

            <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "14px", padding: "16px" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#66564A", display: "block" }}>Classes & Years</span>
              <strong style={{ fontSize: "1.4rem", fontWeight: 800, color: "#D35400" }}>{store.academicStructure?.classes?.length || 5} Active Cohorts</strong>
              <p style={{ margin: "4px 0 0", fontSize: "0.76rem", color: "#8C7A6A" }}>1st Year → 4th Year</p>
            </div>

            <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "14px", padding: "16px" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#66564A", display: "block" }}>Academic Sections</span>
              <strong style={{ fontSize: "1.4rem", fontWeight: 800, color: "#047857" }}>{store.academicStructure?.sections?.length || 4} Sections</strong>
              <p style={{ margin: "4px 0 0", fontSize: "0.76rem", color: "#8C7A6A" }}>Sec A, Sec B, Sec C</p>
            </div>

            <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "14px", padding: "16px" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#66564A", display: "block" }}>Total Enrolled</span>
              <strong style={{ fontSize: "1.4rem", fontWeight: 800, color: "#241A14" }}>{store.students.length} Students</strong>
              <p style={{ margin: "4px 0 0", fontSize: "0.76rem", color: "#8C7A6A" }}>Identities & Wallets Preserved</p>
            </div>
          </div>

          {/* SUB-TABS NAVIGATION */}
          <div style={{ background: "#FFF7E6", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "12px", padding: "6px", display: "flex", gap: "6px" }}>
            {[
              { id: "structure", label: "Departments, Classes & Sections", icon: Layers },
              { id: "promotion", label: "Cohort Promotion Engine", icon: RefreshCw },
              { id: "sections", label: "Section Manager & Bulk Transfer", icon: Users },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = academicSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setAcademicSubTab(tab.id as any)}
                  style={{
                    flex: 1,
                    padding: "10px 14px",
                    background: isActive ? "#FFFFFF" : "transparent",
                    border: isActive ? "1px solid rgba(196, 154, 108, 0.4)" : "none",
                    borderRadius: "8px",
                    color: isActive ? "#D35400" : "#66564A",
                    fontWeight: isActive ? 800 : 600,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    boxShadow: isActive ? "0 2px 6px rgba(36, 26, 20, 0.06)" : "none",
                  }}
                >
                  <Icon size={15} /> {tab.label}
                </button>
              );
            })}
          </div>

          {/* SUB-TAB 1: STRUCTURE REGISTRY & CREATION */}
          {academicSubTab === "structure" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* CREATION CARDS GRID */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
                {/* 1. CREATE DEPARTMENT */}
                <form onSubmit={handleCreateDept} style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "16px", padding: "18px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Plus size={16} color="#D35400" />
                    <h3 style={{ margin: 0, fontSize: "0.98rem", fontWeight: 800, color: "#241A14" }}>
                      Create New Department
                    </h3>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#66564A", marginBottom: "4px" }}>Department Code</label>
                    <input
                      type="text"
                      placeholder="e.g. ME, Arch, Law"
                      value={newDeptCode}
                      onChange={(e) => setNewDeptCode(e.target.value)}
                      style={{ width: "100%", padding: "8px 12px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", fontSize: "0.84rem", color: "#241A14", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#66564A", marginBottom: "4px" }}>Department Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Mechanical Engineering"
                      value={newDeptName}
                      onChange={(e) => setNewDeptName(e.target.value)}
                      style={{ width: "100%", padding: "8px 12px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", fontSize: "0.84rem", color: "#241A14", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#66564A", marginBottom: "4px" }}>Department Head Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Prof. Dr. M. Rahman"
                      value={newDeptHead}
                      onChange={(e) => setNewDeptHead(e.target.value)}
                      style={{ width: "100%", padding: "8px 12px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", fontSize: "0.84rem", color: "#241A14", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>

                  <button
                    type="submit"
                    style={{ marginTop: "4px", background: "#D35400", color: "#FFFFFF", border: "none", padding: "9px 14px", borderRadius: "8px", fontWeight: 700, fontSize: "0.84rem", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                  >
                    <Plus size={14} /> Create Department
                  </button>
                </form>

                {/* 2. CREATE CLASS */}
                <form onSubmit={handleCreateClass} style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "16px", padding: "18px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Plus size={16} color="#047857" />
                    <h3 style={{ margin: 0, fontSize: "0.98rem", fontWeight: 800, color: "#241A14" }}>
                      Create New Academic Class
                    </h3>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#66564A", marginBottom: "4px" }}>Class Name</label>
                    <input
                      type="text"
                      placeholder="e.g. CSE 4th Year"
                      value={newClassName}
                      onChange={(e) => setNewClassName(e.target.value)}
                      style={{ width: "100%", padding: "8px 12px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", fontSize: "0.84rem", color: "#241A14", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#66564A", marginBottom: "4px" }}>Department</label>
                      <select
                        value={newClassDept}
                        onChange={(e) => setNewClassDept(e.target.value)}
                        style={{ width: "100%", padding: "8px 10px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", fontSize: "0.82rem", fontWeight: 600, color: "#241A14", outline: "none" }}
                      >
                        <option value="CSE">CSE</option>
                        <option value="EEE">EEE</option>
                        <option value="BBA">BBA</option>
                        <option value="Civil">Civil</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#66564A", marginBottom: "4px" }}>Class / Year</label>
                      <select
                        value={newClassYear}
                        onChange={(e) => setNewClassYear(e.target.value)}
                        style={{ width: "100%", padding: "8px 10px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", fontSize: "0.82rem", fontWeight: 600, color: "#241A14", outline: "none" }}
                      >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#66564A", marginBottom: "4px" }}>Semester Placement</label>
                    <select
                      value={newClassSemester}
                      onChange={(e) => setNewClassSemester(e.target.value)}
                      style={{ width: "100%", padding: "8px 10px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", fontSize: "0.82rem", fontWeight: 600, color: "#241A14", outline: "none" }}
                    >
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

                  <button
                    type="submit"
                    style={{ marginTop: "4px", background: "#047857", color: "#FFFFFF", border: "none", padding: "9px 14px", borderRadius: "8px", fontWeight: 700, fontSize: "0.84rem", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                  >
                    <Plus size={14} /> Create Academic Class
                  </button>
                </form>

                {/* 3. CREATE SECTION */}
                <form onSubmit={handleCreateSection} style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "16px", padding: "18px", display: "flex", flexDirection: "column", gap: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Plus size={16} color="#7C3AED" />
                    <h3 style={{ margin: 0, fontSize: "0.98rem", fontWeight: 800, color: "#241A14" }}>
                      Create New Section
                    </h3>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#66564A", marginBottom: "4px" }}>Section Designation</label>
                    <input
                      type="text"
                      placeholder="e.g. Sec C, Sec D"
                      value={newSecName}
                      onChange={(e) => setNewSecName(e.target.value)}
                      style={{ width: "100%", padding: "8px 12px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", fontSize: "0.84rem", color: "#241A14", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#66564A", marginBottom: "4px" }}>Department</label>
                      <select
                        value={newSecDept}
                        onChange={(e) => setNewSecDept(e.target.value)}
                        style={{ width: "100%", padding: "8px 10px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", fontSize: "0.82rem", fontWeight: 600, color: "#241A14", outline: "none" }}
                      >
                        <option value="CSE">CSE</option>
                        <option value="EEE">EEE</option>
                        <option value="BBA">BBA</option>
                        <option value="Civil">Civil</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#66564A", marginBottom: "4px" }}>Max Capacity</label>
                      <input
                        type="number"
                        value={newSecCapacity}
                        onChange={(e) => setNewSecCapacity(Number(e.target.value))}
                        style={{ width: "100%", padding: "8px 10px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", fontSize: "0.84rem", fontWeight: 600, color: "#241A14", outline: "none", boxSizing: "border-box" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#66564A", marginBottom: "4px" }}>Target Class / Year</label>
                    <select
                      value={newSecClassYear}
                      onChange={(e) => setNewSecClassYear(e.target.value)}
                      style={{ width: "100%", padding: "8px 10px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", fontSize: "0.82rem", fontWeight: 600, color: "#241A14", outline: "none" }}
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    style={{ marginTop: "4px", background: "#7C3AED", color: "#FFFFFF", border: "none", padding: "9px 14px", borderRadius: "8px", fontWeight: 700, fontSize: "0.84rem", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "6px" }}
                  >
                    <Plus size={14} /> Create Section
                  </button>
                </form>
              </div>

              {/* CURRENT STRUCTURE TABLE */}
              <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "14px", padding: "18px", display: "flex", flexDirection: "column", gap: "14px" }}>
                <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: "#241A14" }}>
                  Institutional Department & Cohort Directory
                </h3>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
                    <thead>
                      <tr style={{ background: "#FDF9F3", textAlign: "left", color: "#66564A", borderBottom: "1px solid rgba(196, 154, 108, 0.3)" }}>
                        <th style={{ padding: "10px 14px", fontWeight: 700 }}>Dept Code</th>
                        <th style={{ padding: "10px 14px", fontWeight: 700 }}>Department Name</th>
                        <th style={{ padding: "10px 14px", fontWeight: 700 }}>Department Head</th>
                        <th style={{ padding: "10px 14px", fontWeight: 700 }}>Active Classes</th>
                        <th style={{ padding: "10px 14px", fontWeight: 700 }}>Active Sections</th>
                        <th style={{ padding: "10px 14px", fontWeight: 700 }}>Enrolled Students</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(store.academicStructure?.departments || [
                        { id: "d1", code: "CSE", name: "Computer Science & Engineering", headName: "Prof. Dr. A. K. Azad", totalStudents: 4 },
                        { id: "d2", code: "EEE", name: "Electrical & Electronic Engineering", headName: "Dr. Syeda Nasrin", totalStudents: 1 },
                        { id: "d3", code: "BBA", name: "Business Administration", headName: "Prof. M. Rahman", totalStudents: 1 },
                        { id: "d4", code: "Civil", name: "Civil Engineering", headName: "Engr. Faisal Ahmed", totalStudents: 1 },
                      ]).map((d) => {
                        const count = store.students.filter(s => s.department === d.code).length;
                        return (
                          <tr key={d.id} style={{ borderBottom: "1px solid rgba(196, 154, 108, 0.2)" }}>
                            <td style={{ padding: "10px 14px" }}>
                              <span style={{ fontWeight: 800, color: "#D35400", background: "#FFF7E6", padding: "3px 8px", borderRadius: "6px", border: "1px solid rgba(196, 154, 108, 0.3)" }}>
                                {d.code}
                              </span>
                            </td>
                            <td style={{ padding: "10px 14px", fontWeight: 700, color: "#241A14" }}>{d.name}</td>
                            <td style={{ padding: "10px 14px", color: "#66564A" }}>{d.headName}</td>
                            <td style={{ padding: "10px 14px", color: "#66564A" }}>1st Year, 2nd Year, 3rd Year</td>
                            <td style={{ padding: "10px 14px" }}>
                              <span style={{ background: "rgba(4, 120, 87, 0.08)", color: "#047857", padding: "2px 8px", borderRadius: "4px", fontWeight: 700, fontSize: "0.78rem" }}>
                                Sec A, Sec B
                              </span>
                            </td>
                            <td style={{ padding: "10px 14px", fontWeight: 800, color: "#241A14" }}>
                              {count} Students
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SUB-TAB 2: COHORT PROMOTION ENGINE */}
          {academicSubTab === "promotion" && (
            <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "16px", padding: "22px", display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#241A14" }}>
                  Institutional Cohort Promotion Engine
                </h3>
                <p style={{ margin: "3px 0 0", fontSize: "0.86rem", color: "#66564A" }}>
                  Promote entire student cohorts (Class 1 → Class 2, Year 1 → Year 2, Semester 1 → Semester 2) without re-entering student records.
                </p>
              </div>

              {/* PROMOTION SELECTORS */}
              <div style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "14px", padding: "18px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                {/* SOURCE SELECTOR */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "#BE123C", textTransform: "uppercase" }}>
                    From Source Cohort
                  </span>
                  <div>
                    <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#66564A", marginBottom: "4px" }}>Department</label>
                    <select
                      value={promoSourceDept}
                      onChange={(e) => setPromoSourceDept(e.target.value)}
                      style={{ width: "100%", padding: "9px 12px", background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", fontSize: "0.86rem", fontWeight: 600, color: "#241A14" }}
                    >
                      <option value="all">All Departments</option>
                      <option value="CSE">CSE</option>
                      <option value="EEE">EEE</option>
                      <option value="BBA">BBA</option>
                      <option value="Civil">Civil</option>
                    </select>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <div>
                      <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#66564A", marginBottom: "4px" }}>Class / Year</label>
                      <select
                        value={promoSourceClassYear}
                        onChange={(e) => setPromoSourceClassYear(e.target.value)}
                        style={{ width: "100%", padding: "9px 12px", background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", fontSize: "0.86rem", fontWeight: 600, color: "#241A14" }}
                      >
                        <option value="all">All Classes</option>
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#66564A", marginBottom: "4px" }}>Semester</label>
                      <select
                        value={promoSourceSemester}
                        onChange={(e) => setPromoSourceSemester(e.target.value)}
                        style={{ width: "100%", padding: "9px 12px", background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", fontSize: "0.86rem", fontWeight: 600, color: "#241A14" }}
                      >
                        <option value="all">All Semesters</option>
                        <option value="1st Sem">1st Sem</option>
                        <option value="2nd Sem">2nd Sem</option>
                        <option value="3rd Sem">3rd Sem</option>
                        <option value="4th Sem">4th Sem</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* TARGET SELECTOR */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <span style={{ fontSize: "0.82rem", fontWeight: 800, color: "#047857", textTransform: "uppercase" }}>
                    To Target Placement
                  </span>

                  <div>
                    <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#66564A", marginBottom: "4px" }}>Target Class / Year</label>
                    <select
                      value={promoTargetClassYear}
                      onChange={(e) => setPromoTargetClassYear(e.target.value)}
                      style={{ width: "100%", padding: "9px 12px", background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", fontSize: "0.86rem", fontWeight: 600, color: "#241A14" }}
                    >
                      <option value="1st Year">1st Year</option>
                      <option value="2nd Year">2nd Year</option>
                      <option value="3rd Year">3rd Year</option>
                      <option value="4th Year">4th Year</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#66564A", marginBottom: "4px" }}>Target Semester</label>
                    <select
                      value={promoTargetSemester}
                      onChange={(e) => setPromoTargetSemester(e.target.value)}
                      style={{ width: "100%", padding: "9px 12px", background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", fontSize: "0.86rem", fontWeight: 600, color: "#241A14" }}
                    >
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
                </div>
              </div>

              {/* DATA PRESERVATION GUARANTEE RULE NOTICE */}
              <div style={{ background: "rgba(4, 120, 87, 0.08)", border: "1px solid rgba(4, 120, 87, 0.3)", borderRadius: "12px", padding: "14px", display: "flex", alignItems: "center", gap: "12px" }}>
                <CheckCircle2 size={22} color="#047857" style={{ flexShrink: 0 }} />
                <div style={{ fontSize: "0.84rem", color: "#047857" }}>
                  <strong>Preservation Guarantee:</strong> Promotion updates academic placement tags (`classYear`, `semester`, `classSection`). Student legal identities, NID verification, Neo Cash digital wallet balances, payment ledgers, and transaction receipt histories remain <strong>100% preserved</strong> without re-entering student profiles.
                </div>
              </div>

              {/* PROMOTION PREVIEW LIST */}
              <div>
                <h4 style={{ margin: "0 0 10px", fontSize: "0.92rem", color: "#241A14", fontWeight: 800 }}>
                  Cohorts Eligible for Promotion Preview
                </h4>
                <div style={{ border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "10px", overflow: "hidden" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.84rem" }}>
                    <thead>
                      <tr style={{ background: "#FDF9F3", textAlign: "left", color: "#66564A" }}>
                        <th style={{ padding: "10px 14px" }}>Student Name</th>
                        <th style={{ padding: "10px 14px" }}>Student ID</th>
                        <th style={{ padding: "10px 14px" }}>Current Placement</th>
                        <th style={{ padding: "10px 14px" }}>Target Placement</th>
                        <th style={{ padding: "10px 14px" }}>Wallet Balance</th>
                        <th style={{ padding: "10px 14px" }}>Standing</th>
                      </tr>
                    </thead>
                    <tbody>
                      {store.students.filter(s =>
                        (promoSourceDept === "all" || s.department === promoSourceDept) &&
                        (promoSourceClassYear === "all" || s.classYear === promoSourceClassYear) &&
                        (promoSourceSemester === "all" || s.semester === promoSourceSemester)
                      ).length === 0 ? (
                        <tr>
                          <td colSpan={6} style={{ padding: "20px", textAlign: "center", color: "#8C7A6A" }}>
                            No students match the current source cohort criteria.
                          </td>
                        </tr>
                      ) : (
                        store.students.filter(s =>
                          (promoSourceDept === "all" || s.department === promoSourceDept) &&
                          (promoSourceClassYear === "all" || s.classYear === promoSourceClassYear) &&
                          (promoSourceSemester === "all" || s.semester === promoSourceSemester)
                        ).map((s) => (
                          <tr key={s.id} style={{ borderTop: "1px solid rgba(196, 154, 108, 0.2)" }}>
                            <td style={{ padding: "10px 14px", fontWeight: 700, color: "#241A14" }}>{s.name}</td>
                            <td style={{ padding: "10px 14px", fontFamily: "monospace", color: "#D35400", fontWeight: 700 }}>{s.studentId}</td>
                            <td style={{ padding: "10px 14px", color: "#66564A" }}>{s.department} {s.classYear} ({s.semester})</td>
                            <td style={{ padding: "10px 14px", fontWeight: 700, color: "#047857" }}>{s.department} {promoTargetClassYear} ({promoTargetSemester})</td>
                            <td style={{ padding: "10px 14px", fontWeight: 800, fontFeatureSettings: "'tnum'" }}>{formatTaka(s.walletBalance, false)}</td>
                            <td style={{ padding: "10px 14px" }}>
                              <span style={{ padding: "2px 8px", borderRadius: "999px", fontSize: "0.74rem", fontWeight: 800, background: "rgba(4, 120, 87, 0.12)", color: "#047857" }}>
                                {s.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* PROMOTION ACTION BUTTON */}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  type="button"
                  onClick={handleExecuteCohortPromotion}
                  style={{ background: "#D35400", color: "#FFFFFF", border: "none", padding: "12px 24px", borderRadius: "10px", fontWeight: 800, fontSize: "0.92rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px", boxShadow: "0 4px 12px rgba(211, 84, 0, 0.25)" }}
                >
                  <RefreshCw size={16} /> Execute Cohort Promotion
                </button>
              </div>
            </div>
          )}

          {/* SUB-TAB 3: SECTION MANAGER & BULK TRANSFER */}
          {academicSubTab === "sections" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              {/* SECTION CAPACITIES GRID */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}>
                {[
                  { name: "Sec A", dept: "CSE", year: "1st Year", count: 2, capacity: 50 },
                  { name: "Sec B", dept: "CSE", year: "1st Year", count: 1, capacity: 50 },
                  { name: "Sec A", dept: "CSE", year: "2nd Year", count: 1, capacity: 45 },
                  { name: "Sec A", dept: "EEE", year: "1st Year", count: 1, capacity: 50 },
                ].map((sec, idx) => (
                  <div key={idx} style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "14px", padding: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <strong style={{ color: "#241A14", fontSize: "0.95rem" }}>{sec.name}</strong>
                      <span style={{ fontSize: "0.76rem", background: "#FFF7E6", color: "#D35400", padding: "2px 6px", borderRadius: "4px", fontWeight: 700 }}>
                        {sec.dept} ({sec.year})
                      </span>
                    </div>
                    <div style={{ fontSize: "0.82rem", color: "#66564A" }}>
                      Capacity: <strong>{sec.count}</strong> / {sec.capacity} Students
                    </div>
                    <div style={{ height: "6px", width: "100%", background: "#FDF9F3", borderRadius: "999px", overflow: "hidden", border: "1px solid rgba(196, 154, 108, 0.2)" }}>
                      <div style={{ height: "100%", width: `${(sec.count / sec.capacity) * 100}%`, background: "#047857" }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* BULK TRANSFER CONTROL BAR */}
              <div style={{ background: "#FDF9F3", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "16px", padding: "16px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <Users size={18} color="#D35400" />
                  <div>
                    <strong style={{ fontSize: "0.92rem", color: "#241A14", display: "block" }}>
                      Bulk Section Transfer & Reassignment
                    </strong>
                    <span style={{ fontSize: "0.78rem", color: "#66564A" }}>
                      Selected Students: <strong style={{ color: "#D35400" }}>{selectedStudentIdsForSection.length}</strong> / {store.students.length}
                    </span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <label style={{ fontSize: "0.82rem", fontWeight: 700, color: "#66564A" }}>Move to Section:</label>
                  <select
                    value={bulkTargetSection}
                    onChange={(e) => setBulkTargetSection(e.target.value)}
                    style={{ padding: "8px 12px", background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", fontSize: "0.84rem", fontWeight: 600, color: "#241A14" }}
                  >
                    <option value="Sec A">Sec A</option>
                    <option value="Sec B">Sec B</option>
                    <option value="Sec C">Sec C</option>
                    <option value="Sec D">Sec D</option>
                  </select>

                  <button
                    type="button"
                    onClick={handleExecuteBulkSectionTransfer}
                    style={{ background: "#D35400", color: "#FFFFFF", border: "none", padding: "8px 16px", borderRadius: "8px", fontWeight: 700, fontSize: "0.84rem", cursor: "pointer" }}
                  >
                    Bulk Transfer Selected
                  </button>
                </div>
              </div>

              {/* STUDENT SECTION MANAGEMENT TABLE */}
              <div style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "14px", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.88rem" }}>
                  <thead>
                    <tr style={{ background: "#FDF9F3", textAlign: "left", color: "#66564A", borderBottom: "1px solid rgba(196, 154, 108, 0.3)" }}>
                      <th style={{ padding: "12px 16px", width: "40px" }}>
                        <input
                          type="checkbox"
                          checked={selectedStudentIdsForSection.length === store.students.length && store.students.length > 0}
                          onChange={handleSelectAllStudentsForSection}
                          style={{ cursor: "pointer" }}
                        />
                      </th>
                      <th style={{ padding: "12px 16px", fontWeight: 700 }}>Student Dossier</th>
                      <th style={{ padding: "12px 16px", fontWeight: 700 }}>Student ID</th>
                      <th style={{ padding: "12px 16px", fontWeight: 700 }}>Department</th>
                      <th style={{ padding: "12px 16px", fontWeight: 700 }}>Class / Year</th>
                      <th style={{ padding: "12px 16px", fontWeight: 700 }}>Current Section</th>
                      <th style={{ padding: "12px 16px", fontWeight: 700, textAlign: "right" }}>Single Transfer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {store.students.map((s) => {
                      const isSelected = selectedStudentIdsForSection.includes(s.id);
                      return (
                        <tr key={s.id} style={{ borderBottom: "1px solid rgba(196, 154, 108, 0.18)", background: isSelected ? "rgba(211, 84, 0, 0.04)" : "transparent" }}>
                          <td style={{ padding: "12px 16px" }}>
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => handleToggleStudentSelectionForSection(s.id)}
                              style={{ cursor: "pointer" }}
                            />
                          </td>
                          <td style={{ padding: "12px 16px" }}>
                            <strong style={{ color: "#241A14", display: "block" }}>{s.name}</strong>
                            <span style={{ fontSize: "0.76rem", color: "#8C7A6A" }}>{s.email}</span>
                          </td>
                          <td style={{ padding: "12px 16px", fontFamily: "monospace", fontWeight: 700, color: "#D35400" }}>
                            {s.studentId}
                          </td>
                          <td style={{ padding: "12px 16px" }}>{s.department}</td>
                          <td style={{ padding: "12px 16px" }}>{s.classYear}</td>
                          <td style={{ padding: "12px 16px" }}>
                            <span style={{ background: "rgba(4, 120, 87, 0.1)", color: "#047857", padding: "2px 8px", borderRadius: "4px", fontSize: "0.78rem", fontWeight: 700 }}>
                              {s.section}
                            </span>
                          </td>
                          <td style={{ padding: "12px 16px", textAlign: "right" }}>
                            <select
                              value={s.section}
                              onChange={(e) => handleSingleSectionTransfer(s.id, e.target.value)}
                              style={{ padding: "4px 8px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "6px", fontSize: "0.78rem", fontWeight: 600, color: "#241A14" }}
                            >
                              <option value="Sec A">Sec A</option>
                              <option value="Sec B">Sec B</option>
                              <option value="Sec C">Sec C</option>
                              <option value="Sec D">Sec D</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}


      {activeTab === "bulk" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* HEADER BAR */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 800, color: "#241A14" }}>
                Excel-Like Bulk Fee Assignment Interface
              </h2>
              <p style={{ margin: "4px 0 0", fontSize: "0.88rem", color: "#66564A" }}>
                Batch fee creation tool. Select target cohort, enter fee amount ONCE, preview matching students, and execute safe bulk assignment.
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <span style={{ fontSize: "0.82rem", background: "#FFF7E6", border: "1px solid rgba(196, 154, 108, 0.4)", padding: "6px 14px", borderRadius: "8px", fontWeight: 700, color: "#D35400" }}>
                Single Amount Rule: Admin Enters Amount ONCE
              </span>
            </div>
          </div>

          {/* EXCEL-LIKE FEE CONFIGURATION FORM */}
          <form onSubmit={handleOpenBulkConfirm} style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "16px", padding: "22px", display: "flex", flexDirection: "column", gap: "18px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <FileSpreadsheet size={18} color="#D35400" />
              <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: "#241A14" }}>
                1. Target Cohort & Fee Parameters
              </h3>
            </div>

            {/* ROW 1: SCOPE SELECTORS */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "14px" }}>
              {/* INSTITUTION */}
              <div>
                <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#66564A", marginBottom: "4px" }}>Institution</label>
                <select
                  value={bulkInstitution}
                  onChange={(e) => setBulkInstitution(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", fontSize: "0.84rem", fontWeight: 600, color: "#241A14", outline: "none" }}
                >
                  <option value="Dhaka City College">Dhaka City College</option>
                  <option value="Dhaka University">Dhaka University</option>
                  <option value="BUET">BUET</option>
                  <option value="NSU">NSU</option>
                </select>
              </div>

              {/* DEPARTMENT */}
              <div>
                <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#66564A", marginBottom: "4px" }}>Department</label>
                <select
                  value={bulkDept}
                  onChange={(e) => setBulkDept(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", fontSize: "0.84rem", fontWeight: 600, color: "#241A14", outline: "none" }}
                >
                  <option value="all">All Departments</option>
                  <option value="CSE">CSE</option>
                  <option value="EEE">EEE</option>
                  <option value="BBA">BBA</option>
                  <option value="Civil">Civil</option>
                </select>
              </div>

              {/* CLASS / YEAR */}
              <div>
                <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#66564A", marginBottom: "4px" }}>Class / Year</label>
                <select
                  value={bulkClassYear}
                  onChange={(e) => setBulkClassYear(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", fontSize: "0.84rem", fontWeight: 600, color: "#241A14", outline: "none" }}
                >
                  <option value="all">All Classes</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                </select>
              </div>

              {/* SECTION */}
              <div>
                <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#66564A", marginBottom: "4px" }}>Section</label>
                <select
                  value={bulkSection}
                  onChange={(e) => setBulkSection(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", fontSize: "0.84rem", fontWeight: 600, color: "#241A14", outline: "none" }}
                >
                  <option value="all">All Sections</option>
                  <option value="Sec A">Sec A</option>
                  <option value="Sec B">Sec B</option>
                  <option value="Sec C">Sec C</option>
                </select>
              </div>

              {/* SEMESTER */}
              <div>
                <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#66564A", marginBottom: "4px" }}>Semester</label>
                <select
                  value={bulkSemester}
                  onChange={(e) => setBulkSemester(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", fontSize: "0.84rem", fontWeight: 600, color: "#241A14", outline: "none" }}
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
            </div>

            {/* ROW 2: FEE DETAILS - ADMIN ENTERS AMOUNT ONCE */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "12px", padding: "16px" }}>
              {/* FEE CATEGORY */}
              <div>
                <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#66564A", marginBottom: "4px" }}>Fee Type / Category</label>
                <select
                  value={bulkCategory}
                  onChange={(e) => setBulkCategory(e.target.value as any)}
                  style={{ width: "100%", padding: "9px 12px", background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", fontSize: "0.84rem", fontWeight: 600, color: "#241A14", outline: "none" }}
                >
                  <option value="Tuition">Tuition</option>
                  <option value="Lab & Tech">Lab & Tech</option>
                  <option value="Exam">Exam</option>
                  <option value="Library">Library</option>
                  <option value="Welfare">Welfare</option>
                  <option value="Admission">Admission</option>
                </select>
              </div>

              {/* FEE TITLE */}
              <div>
                <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#66564A", marginBottom: "4px" }}>Fee Title</label>
                <input
                  type="text"
                  placeholder="e.g. Semester Tuition Fee"
                  value={bulkTitle}
                  onChange={(e) => setBulkTitle(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", fontSize: "0.84rem", fontWeight: 600, color: "#241A14", outline: "none", boxSizing: "border-box" }}
                />
              </div>

              {/* AMOUNT - ENTERED ONCE */}
              <div>
                <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#D35400", marginBottom: "4px" }}>
                  Fee Amount (৳) — Enters ONCE
                </label>
                <input
                  type="number"
                  placeholder="20000"
                  value={bulkAmount}
                  onChange={(e) => setBulkAmount(Number(e.target.value))}
                  style={{ width: "100%", padding: "9px 12px", background: "#FFF7E6", border: "1.5px solid #D35400", borderRadius: "8px", fontSize: "0.92rem", fontWeight: 800, color: "#D35400", outline: "none", boxSizing: "border-box" }}
                />
              </div>

              {/* ISSUE DATE */}
              <div>
                <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#66564A", marginBottom: "4px" }}>Issue Date</label>
                <input
                  type="date"
                  value={bulkIssueDate}
                  onChange={(e) => setBulkIssueDate(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", fontSize: "0.84rem", fontWeight: 600, color: "#241A14", outline: "none", boxSizing: "border-box" }}
                />
              </div>

              {/* DEADLINE */}
              <div>
                <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#BE123C", marginBottom: "4px" }}>Deadline (Due Date)</label>
                <input
                  type="date"
                  value={bulkDueDate}
                  onChange={(e) => setBulkDueDate(e.target.value)}
                  style={{ width: "100%", padding: "9px 12px", background: "#FFFFFF", border: "1.5px solid rgba(190, 18, 60, 0.4)", borderRadius: "8px", fontSize: "0.84rem", fontWeight: 700, color: "#BE123C", outline: "none", boxSizing: "border-box" }}
                />
              </div>
            </div>

            {/* EXCEL-LIKE PREVIEW STUDENT MATRIX */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: "#241A14" }}>
                  2. Targeted Student Preview Matrix
                </h3>
                <span style={{ fontSize: "0.8rem", color: "#66564A" }}>
                  Targeted Students: <strong style={{ color: "#D35400" }}>
                    {store.students.filter((s) => {
                      const matchDept = bulkDept === "all" || s.department === bulkDept;
                      const matchClass = bulkClassYear === "all" || s.classYear === bulkClassYear;
                      const matchSection = bulkSection === "all" || s.section === bulkSection;
                      const matchSemester = bulkSemester === "all" || s.semester === bulkSemester;
                      return matchDept && matchClass && matchSection && matchSemester;
                    }).length}
                  </strong>
                </span>
              </div>

              <div style={{ border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "12px", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.86rem" }}>
                  <thead>
                    <tr style={{ background: "#FDF9F3", textAlign: "left", color: "#66564A", borderBottom: "1px solid rgba(196, 154, 108, 0.3)" }}>
                      <th style={{ padding: "10px 14px", width: "40px" }}>
                        <input
                          type="checkbox"
                          checked={selectedBulkStudentIds.length > 0}
                          onChange={() => {
                            const targeted = store.students.filter((s) => {
                              const matchDept = bulkDept === "all" || s.department === bulkDept;
                              const matchClass = bulkClassYear === "all" || s.classYear === bulkClassYear;
                              const matchSection = bulkSection === "all" || s.section === bulkSection;
                              const matchSemester = bulkSemester === "all" || s.semester === bulkSemester;
                              return matchDept && matchClass && matchSection && matchSemester;
                            });
                            if (selectedBulkStudentIds.length === targeted.length) {
                              setSelectedBulkStudentIds([]);
                            } else {
                              setSelectedBulkStudentIds(targeted.map(s => s.id));
                            }
                          }}
                          style={{ cursor: "pointer" }}
                        />
                      </th>
                      <th style={{ padding: "10px 14px", fontWeight: 700 }}>Student</th>
                      <th style={{ padding: "10px 14px", fontWeight: 700 }}>ID</th>
                      <th style={{ padding: "10px 14px", fontWeight: 700 }}>Placement</th>
                      <th style={{ padding: "10px 14px", fontWeight: 700 }}>Current Status</th>
                      <th style={{ padding: "10px 14px", fontWeight: 700, textAlign: "right" }}>Fee Amount (Single Amount)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {store.students.filter((s) => {
                      const matchDept = bulkDept === "all" || s.department === bulkDept;
                      const matchClass = bulkClassYear === "all" || s.classYear === bulkClassYear;
                      const matchSection = bulkSection === "all" || s.section === bulkSection;
                      const matchSemester = bulkSemester === "all" || s.semester === bulkSemester;
                      return matchDept && matchClass && matchSection && matchSemester;
                    }).length === 0 ? (
                      <tr>
                        <td colSpan={6} style={{ padding: "24px", textAlign: "center", color: "#8C7A6A" }}>
                          No students match the selected target cohort criteria. Adjust department, class, section, or semester selectors.
                        </td>
                      </tr>
                    ) : (
                      store.students.filter((s) => {
                        const matchDept = bulkDept === "all" || s.department === bulkDept;
                        const matchClass = bulkClassYear === "all" || s.classYear === bulkClassYear;
                        const matchSection = bulkSection === "all" || s.section === bulkSection;
                        const matchSemester = bulkSemester === "all" || s.semester === bulkSemester;
                        return matchDept && matchClass && matchSection && matchSemester;
                      }).map((s) => (
                        <tr key={s.id} style={{ borderTop: "1px solid rgba(196, 154, 108, 0.2)" }}>
                          <td style={{ padding: "10px 14px" }}>
                            <input
                              type="checkbox"
                              checked={selectedBulkStudentIds.includes(s.id)}
                              onChange={() => {
                                if (selectedBulkStudentIds.includes(s.id)) {
                                  setSelectedBulkStudentIds(selectedBulkStudentIds.filter(id => id !== s.id));
                                } else {
                                  setSelectedBulkStudentIds([...selectedBulkStudentIds, s.id]);
                                }
                              }}
                              style={{ cursor: "pointer" }}
                            />
                          </td>
                          <td style={{ padding: "10px 14px" }}>
                            <strong style={{ color: "#241A14", display: "block" }}>{s.name}</strong>
                            <span style={{ fontSize: "0.76rem", color: "#8C7A6A" }}>{s.email}</span>
                          </td>
                          <td style={{ padding: "10px 14px", fontFamily: "monospace", fontWeight: 700, color: "#D35400" }}>
                            {s.studentId}
                          </td>
                          <td style={{ padding: "10px 14px", color: "#66564A" }}>
                            {s.department} {s.classYear} ({s.section})
                          </td>
                          <td style={{ padding: "10px 14px" }}>
                            <span style={{ padding: "2px 8px", borderRadius: "999px", fontSize: "0.74rem", fontWeight: 800, background: "rgba(4, 120, 87, 0.12)", color: "#047857" }}>
                              {s.status}
                            </span>
                          </td>
                          <td style={{ padding: "10px 14px", textAlign: "right", fontWeight: 800, color: "#D35400", fontFeatureSettings: "'tnum'" }}>
                            {formatTaka(bulkAmount, false)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SUBMIT BUTTON */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "8px" }}>
              <button
                type="submit"
                style={{ background: "#D35400", color: "#FFFFFF", border: "none", padding: "12px 28px", borderRadius: "10px", fontWeight: 800, fontSize: "0.92rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px", boxShadow: "0 4px 14px rgba(211, 84, 0, 0.3)" }}
              >
                <CheckCircle2 size={18} /> Preview & Assign Fee
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === "import" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* HEADER BAR */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 800, color: "#241A14" }}>
                AI Student Excel/CSV Import & Data Validation Processor
              </h2>
              <p style={{ margin: "4px 0 0", fontSize: "0.88rem", color: "#66564A" }}>
                Upload batch student files. AI validation detects duplicate IDs, missing names, invalid emails, and incorrect sections. Do not silently create bad records.
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <button
                type="button"
                onClick={handleLoadSampleBatch}
                style={{ background: "#FFF7E6", border: "1px solid rgba(196, 154, 108, 0.5)", color: "#D35400", padding: "8px 14px", borderRadius: "10px", fontSize: "0.82rem", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <Sparkles size={14} /> Load Demo Preset CSV
              </button>
            </div>
          </div>

          {/* UPLOAD & AI PROCESSOR BANNER */}
          <div style={{ background: "#FFFFFF", border: "1.5px dashed rgba(196, 154, 108, 0.5)", borderRadius: "16px", padding: "24px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "54px", height: "54px", borderRadius: "50%", background: "#FFF7E6", border: "1px solid rgba(196, 154, 108, 0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Upload size={24} color="#D35400" />
            </div>

            <div>
              <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: "#241A14" }}>
                {importFileName ? `File Selected: ${importFileName}` : "Drag and Drop CSV or Excel File Here"}
              </h3>
              <p style={{ margin: "4px 0 0", fontSize: "0.82rem", color: "#66564A" }}>
                Expected Fields: <strong>Name, Student ID, Roll, Department, Class, Section, Semester, Session, Email, Phone</strong>
              </p>
            </div>

            <div style={{ display: "flex", gap: "12px" }}>
              <label style={{ background: "#D35400", color: "#FFFFFF", padding: "9px 18px", borderRadius: "8px", fontSize: "0.84rem", fontWeight: 700, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <FileSpreadsheet size={15} /> Select File (.csv, .xlsx)
                <input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImportFileName(e.target.files[0].name);
                      alert(`Selected file "${e.target.files[0].name}". AI Validation processor active.`);
                    }
                  }}
                  style={{ display: "none" }}
                />
              </label>
            </div>
          </div>

          {/* AI VALIDATION SUMMARY SCORECARDS */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "14px" }}>
            <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(4, 120, 87, 0.35)", borderRadius: "14px", padding: "16px" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#047857", display: "block" }}>Valid Rows Ready</span>
              <strong style={{ fontSize: "1.4rem", fontWeight: 800, color: "#047857" }}>
                {importPreviewRows.filter(r => r.status === "valid").length} Rows
              </strong>
              <p style={{ margin: "4px 0 0", fontSize: "0.76rem", color: "#66564A" }}>Passed all validation checks</p>
            </div>

            <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(217, 119, 6, 0.35)", borderRadius: "14px", padding: "16px" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#D97706", display: "block" }}>Warnings / Defaults</span>
              <strong style={{ fontSize: "1.4rem", fontWeight: 800, color: "#D97706" }}>
                {importPreviewRows.filter(r => r.status === "warning").length} Rows
              </strong>
              <p style={{ margin: "4px 0 0", fontSize: "0.76rem", color: "#66564A" }}>Missing optional fields</p>
            </div>

            <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(190, 18, 60, 0.35)", borderRadius: "14px", padding: "16px" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#BE123C", display: "block" }}>Errors Detected</span>
              <strong style={{ fontSize: "1.4rem", fontWeight: 800, color: "#BE123C" }}>
                {importPreviewRows.filter(r => r.status === "error").length} Rows
              </strong>
              <p style={{ margin: "4px 0 0", fontSize: "0.76rem", color: "#BE123C" }}>Will be rejected if uncorrected</p>
            </div>
          </div>

          {/* PREVIEW MATRIX WITH INLINE EDITING */}
          <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 800, color: "#241A14" }}>
                  AI Validation Matrix & Inline Row Editor
                </h3>
                <p style={{ margin: "2px 0 0", fontSize: "0.82rem", color: "#66564A" }}>
                  Edit error cells directly in the preview matrix to fix duplicate IDs, invalid emails, or missing names before importing.
                </p>
              </div>

              {/* FILTER TABS */}
              <div style={{ display: "flex", gap: "6px" }}>
                {[
                  { id: "all", label: "All Rows" },
                  { id: "valid", label: "Valid Only" },
                  { id: "warning", label: "Warnings" },
                  { id: "error", label: "Errors" },
                ].map(tab => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setImportFilterTab(tab.id as any)}
                    style={{
                      padding: "6px 12px",
                      background: importFilterTab === tab.id ? "#FFF7E6" : "#FDF9F3",
                      border: "1px solid rgba(196, 154, 108, 0.4)",
                      color: importFilterTab === tab.id ? "#D35400" : "#66564A",
                      fontWeight: importFilterTab === tab.id ? 800 : 600,
                      borderRadius: "6px",
                      fontSize: "0.78rem",
                      cursor: "pointer",
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* MATRIX TABLE */}
            <div style={{ overflowX: "auto", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "12px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.84rem" }}>
                <thead>
                  <tr style={{ background: "#FDF9F3", textAlign: "left", color: "#66564A", borderBottom: "1px solid rgba(196, 154, 108, 0.3)" }}>
                    <th style={{ padding: "10px 12px", fontWeight: 700 }}>Status</th>
                    <th style={{ padding: "10px 12px", fontWeight: 700 }}>Name</th>
                    <th style={{ padding: "10px 12px", fontWeight: 700 }}>Student ID</th>
                    <th style={{ padding: "10px 12px", fontWeight: 700 }}>Dept</th>
                    <th style={{ padding: "10px 12px", fontWeight: 700 }}>Class</th>
                    <th style={{ padding: "10px 12px", fontWeight: 700 }}>Sec</th>
                    <th style={{ padding: "10px 12px", fontWeight: 700 }}>Sem</th>
                    <th style={{ padding: "10px 12px", fontWeight: 700 }}>Email (Editable)</th>
                    <th style={{ padding: "10px 12px", fontWeight: 700 }}>Validation Note</th>
                  </tr>
                </thead>
                <tbody>
                  {importPreviewRows.filter(r => importFilterTab === "all" || r.status === importFilterTab).length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ padding: "20px", textAlign: "center", color: "#8C7A6A" }}>
                        No records match the active filter tab.
                      </td>
                    </tr>
                  ) : (
                    importPreviewRows.filter(r => importFilterTab === "all" || r.status === importFilterTab).map((r) => (
                      <tr key={r.id} style={{ borderTop: "1px solid rgba(196, 154, 108, 0.2)", background: r.status === "error" ? "rgba(190, 18, 60, 0.04)" : r.status === "warning" ? "rgba(217, 119, 6, 0.04)" : "transparent" }}>
                        {/* STATUS */}
                        <td style={{ padding: "10px 12px" }}>
                          <span style={{
                            padding: "3px 8px",
                            borderRadius: "999px",
                            fontSize: "0.74rem",
                            fontWeight: 800,
                            background: r.status === "valid" ? "rgba(4, 120, 87, 0.12)" : r.status === "warning" ? "rgba(217, 119, 6, 0.12)" : "rgba(190, 18, 60, 0.12)",
                            color: r.status === "valid" ? "#047857" : r.status === "warning" ? "#D97706" : "#BE123C",
                          }}>
                            {r.status.toUpperCase()}
                          </span>
                        </td>

                        {/* NAME */}
                        <td style={{ padding: "10px 12px" }}>
                          <input
                            type="text"
                            value={r.name}
                            onChange={(e) => handleUpdateRowCell(r.id, "name", e.target.value)}
                            placeholder="Enter Name"
                            style={{ padding: "4px 8px", border: !r.name ? "1.5px solid #BE123C" : "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "6px", fontSize: "0.82rem", outline: "none", width: "100%", boxSizing: "border-box" }}
                          />
                        </td>

                        {/* ID */}
                        <td style={{ padding: "10px 12px" }}>
                          <input
                            type="text"
                            value={r.studentId}
                            onChange={(e) => handleUpdateRowCell(r.id, "studentId", e.target.value)}
                            style={{ padding: "4px 8px", fontFamily: "monospace", fontWeight: 700, border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "6px", fontSize: "0.82rem", outline: "none", width: "100%", color: "#D35400", boxSizing: "border-box" }}
                          />
                        </td>

                        {/* DEPT */}
                        <td style={{ padding: "10px 12px" }}>
                          <input
                            type="text"
                            value={r.department}
                            onChange={(e) => handleUpdateRowCell(r.id, "department", e.target.value)}
                            style={{ padding: "4px 8px", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "6px", fontSize: "0.82rem", outline: "none", width: "60px" }}
                          />
                        </td>

                        {/* CLASS */}
                        <td style={{ padding: "10px 12px" }}>
                          <input
                            type="text"
                            value={r.classYear}
                            onChange={(e) => handleUpdateRowCell(r.id, "classYear", e.target.value)}
                            style={{ padding: "4px 8px", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "6px", fontSize: "0.82rem", outline: "none", width: "80px" }}
                          />
                        </td>

                        {/* SEC */}
                        <td style={{ padding: "10px 12px" }}>
                          <input
                            type="text"
                            value={r.section}
                            onChange={(e) => handleUpdateRowCell(r.id, "section", e.target.value)}
                            style={{ padding: "4px 8px", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "6px", fontSize: "0.82rem", outline: "none", width: "60px" }}
                          />
                        </td>

                        {/* SEM */}
                        <td style={{ padding: "10px 12px" }}>
                          <input
                            type="text"
                            value={r.semester}
                            onChange={(e) => handleUpdateRowCell(r.id, "semester", e.target.value)}
                            style={{ padding: "4px 8px", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "6px", fontSize: "0.82rem", outline: "none", width: "70px" }}
                          />
                        </td>

                        {/* EMAIL */}
                        <td style={{ padding: "10px 12px" }}>
                          <input
                            type="text"
                            value={r.email}
                            onChange={(e) => handleUpdateRowCell(r.id, "email", e.target.value)}
                            placeholder="user@domain.com"
                            style={{ padding: "4px 8px", border: (!r.email || !r.email.includes("@")) ? "1.5px solid #BE123C" : "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "6px", fontSize: "0.82rem", outline: "none", width: "100%", boxSizing: "border-box" }}
                          />
                        </td>

                        {/* ISSUE NOTE */}
                        <td style={{ padding: "10px 12px", color: r.status === "error" ? "#BE123C" : r.status === "warning" ? "#D97706" : "#047857", fontWeight: 700, fontSize: "0.78rem" }}>
                          {r.issue || "Ready for import"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* CONFIRM BUTTON */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "6px" }}>
              <button
                type="button"
                onClick={handleConfirmFinalImport}
                style={{ background: "#D35400", color: "#FFFFFF", border: "none", padding: "12px 24px", borderRadius: "10px", fontWeight: 800, fontSize: "0.9rem", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px", boxShadow: "0 4px 12px rgba(211, 84, 0, 0.25)" }}
              >
                <CheckCircle2 size={16} /> Confirm & Create Students ({importPreviewRows.filter(r => r.status === "valid" || r.status === "warning").length} Valid)
              </button>
            </div>
          </div>

          {/* IMPORT HISTORY AUDIT LEDGER */}
          <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "16px", padding: "20px" }}>
            <h3 style={{ margin: "0 0 12px", fontSize: "1.05rem", fontWeight: 800, color: "#241A14" }}>
              Batch Import History & AI Validation Audit Log
            </h3>
            <div style={{ overflowX: "auto", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "12px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.86rem" }}>
                <thead>
                  <tr style={{ background: "#FDF9F3", textAlign: "left", color: "#66564A", borderBottom: "1px solid rgba(196, 154, 108, 0.3)" }}>
                    <th style={{ padding: "10px 14px", fontWeight: 700 }}>File Name</th>
                    <th style={{ padding: "10px 14px", fontWeight: 700 }}>Executed By</th>
                    <th style={{ padding: "10px 14px", fontWeight: 700 }}>Date & Time</th>
                    <th style={{ padding: "10px 14px", fontWeight: 700 }}>Imported</th>
                    <th style={{ padding: "10px 14px", fontWeight: 700 }}>Rejected</th>
                    <th style={{ padding: "10px 14px", fontWeight: 700 }}>Warnings</th>
                    <th style={{ padding: "10px 14px", fontWeight: 700 }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(store.importLogs || [
                    { id: "i1", fileName: "fall_2026_cse_enrollment.xlsx", adminName: "Refat Rahman (Admin)", timestamp: "2026-09-24 11:30 AM", importedCount: 42, rejectedCount: 2, warningCount: 5, status: "Partial Success" },
                    { id: "i2", fileName: "eee_sec_a_freshers.csv", adminName: "Refat Rahman (Admin)", timestamp: "2026-09-20 02:15 PM", importedCount: 30, rejectedCount: 0, warningCount: 1, status: "Completed" },
                  ]).map((log) => (
                    <tr key={log.id} style={{ borderTop: "1px solid rgba(196, 154, 108, 0.2)" }}>
                      <td style={{ padding: "10px 14px", fontWeight: 700, color: "#241A14" }}>{log.fileName}</td>
                      <td style={{ padding: "10px 14px", color: "#66564A" }}>{log.adminName}</td>
                      <td style={{ padding: "10px 14px", color: "#8C7A6A" }}>{log.timestamp}</td>
                      <td style={{ padding: "10px 14px", fontWeight: 800, color: "#047857" }}>{log.importedCount} Records</td>
                      <td style={{ padding: "10px 14px", fontWeight: 800, color: log.rejectedCount > 0 ? "#BE123C" : "#66564A" }}>{log.rejectedCount} Rejected</td>
                      <td style={{ padding: "10px 14px", color: "#D97706", fontWeight: 700 }}>{log.warningCount} Warnings</td>
                      <td style={{ padding: "10px 14px" }}>
                        <span style={{ padding: "3px 8px", borderRadius: "999px", fontSize: "0.74rem", fontWeight: 800, background: log.status === "Completed" ? "rgba(4, 120, 87, 0.12)" : "rgba(217, 119, 6, 0.12)", color: log.status === "Completed" ? "#047857" : "#D97706" }}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      
      {/* 10. PHASE 16 — ADMIN PARTIAL PAYMENT REVIEW QUEUE */}
      {activeTab === "applications" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* HEADER BAR */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }}>
            <div>
              <h2 style={{ margin: 0, fontSize: "1.35rem", fontWeight: 800, color: "#241A14" }}>
                Admin Partial Payment Review Queue
              </h2>
              <p style={{ margin: "4px 0 0", fontSize: "0.88rem", color: "#66564A" }}>
                Review student hardship applications, guardian documents, signature verification, and forward approved requests to Head for final sign-off.
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <span style={{ fontSize: "0.82rem", background: "#FFF7E6", border: "1px solid rgba(196, 154, 108, 0.4)", padding: "6px 14px", borderRadius: "8px", fontWeight: 700, color: "#D35400" }}>
                Pending Admin Review: <strong style={{ color: "#BE123C" }}>{store.partialApplications.filter(a => a.status === "pending_admin" || a.status === "submitted").length}</strong>
              </span>
            </div>
          </div>

          {/* METRIC CARDS SUMMARY */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "14px" }}>
            <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "14px", padding: "16px" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#66564A", display: "block" }}>Total Submitted</span>
              <strong style={{ fontSize: "1.4rem", fontWeight: 800, color: "#241A14" }}>{store.partialApplications.length} Requests</strong>
              <p style={{ margin: "4px 0 0", fontSize: "0.76rem", color: "#8C7A6A" }}>Institutional Hardship Queue</p>
            </div>

            <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(217, 119, 6, 0.35)", borderRadius: "14px", padding: "16px" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#D97706", display: "block" }}>Pending Admin</span>
              <strong style={{ fontSize: "1.4rem", fontWeight: 800, color: "#D97706" }}>
                {store.partialApplications.filter(a => a.status === "pending_admin" || a.status === "submitted").length}
              </strong>
              <p style={{ margin: "4px 0 0", fontSize: "0.76rem", color: "#8C7A6A" }}>Awaiting Admin Evaluation</p>
            </div>

            <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(124, 58, 237, 0.35)", borderRadius: "14px", padding: "16px" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#7C3AED", display: "block" }}>Forwarded to Head</span>
              <strong style={{ fontSize: "1.4rem", fontWeight: 800, color: "#7C3AED" }}>
                {store.partialApplications.filter(a => a.status === "forwarded_head").length}
              </strong>
              <p style={{ margin: "4px 0 0", fontSize: "0.76rem", color: "#7C3AED" }}>Awaiting Head Approval</p>
            </div>

            <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(4, 120, 87, 0.35)", borderRadius: "14px", padding: "16px" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#047857", display: "block" }}>Approved / Unlocked</span>
              <strong style={{ fontSize: "1.4rem", fontWeight: 800, color: "#047857" }}>
                {store.partialApplications.filter(a => a.status === "approved_head" || a.status === "paid").length}
              </strong>
              <p style={{ margin: "4px 0 0", fontSize: "0.76rem", color: "#047857" }}>Instalment Unlocked</p>
            </div>
          </div>

          {/* QUEUE FILTER TABS */}
          <div style={{ background: "#FFF7E6", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "12px", padding: "6px", display: "flex", gap: "6px", overflowX: "auto" }}>
            {[
              { id: "all", label: "All Requests" },
              { id: "pending", label: "Pending Admin" },
              { id: "under_review", label: "Under Review" },
              { id: "forwarded", label: "Awaiting Head Approval" },
              { id: "approved", label: "Approved" },
              { id: "rejected", label: "Rejected" },
              { id: "changes", label: "Changes Required" },
            ].map(tab => {
              const isActive = appFilterTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setAppFilterTab(tab.id as any)}
                  style={{
                    padding: "8px 14px",
                    background: isActive ? "#FFFFFF" : "transparent",
                    border: isActive ? "1px solid rgba(196, 154, 108, 0.4)" : "none",
                    borderRadius: "8px",
                    color: isActive ? "#D35400" : "#66564A",
                    fontWeight: isActive ? 800 : 600,
                    fontSize: "0.82rem",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* APPLICATIONS LIST TABLE */}
          <div className="mobile-partial-applications" style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.35)", borderRadius: "16px", padding: "20px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ overflowX: "auto", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "12px" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.86rem" }}>
                <thead>
                  <tr style={{ background: "#FDF9F3", textAlign: "left", color: "#66564A", borderBottom: "1px solid rgba(196, 154, 108, 0.3)" }}>
                    <th style={{ padding: "12px 14px", fontWeight: 700 }}>Student</th>
                    <th style={{ padding: "12px 14px", fontWeight: 700 }}>Fee Title</th>
                    <th style={{ padding: "12px 14px", fontWeight: 700 }}>Total Fee</th>
                    <th style={{ padding: "12px 14px", fontWeight: 700 }}>Requested Amount</th>
                    <th style={{ padding: "12px 14px", fontWeight: 700 }}>Submitted Date</th>
                    <th style={{ padding: "12px 14px", fontWeight: 700 }}>AI Match Score</th>
                    <th style={{ padding: "12px 14px", fontWeight: 700 }}>Current Status</th>
                    <th style={{ padding: "12px 14px", fontWeight: 700, textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {store.partialApplications.filter((a) => {
                    if (appFilterTab === "pending") return a.status === "pending_admin" || a.status === "submitted";
                    if (appFilterTab === "under_review") return a.status === "pending_admin";
                    if (appFilterTab === "forwarded") return a.status === "forwarded_head";
                    if (appFilterTab === "approved") return a.status === "approved_head" || a.status === "paid";
                    if (appFilterTab === "rejected") return a.status === "rejected_admin" || a.status === "rejected_head";
                    if (appFilterTab === "changes") return a.status === "changes_requested";
                    return true;
                  }).length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ padding: "28px", textAlign: "center", color: "#8C7A6A" }}>
                        No partial payment requests match the selected queue filter tab.
                      </td>
                    </tr>
                  ) : (
                    store.partialApplications.filter((a) => {
                      if (appFilterTab === "pending") return a.status === "pending_admin" || a.status === "submitted";
                      if (appFilterTab === "under_review") return a.status === "pending_admin";
                      if (appFilterTab === "forwarded") return a.status === "forwarded_head";
                      if (appFilterTab === "approved") return a.status === "approved_head" || a.status === "paid";
                      if (appFilterTab === "rejected") return a.status === "rejected_admin" || a.status === "rejected_head";
                      if (appFilterTab === "changes") return a.status === "changes_requested";
                      return true;
                    }).map((app) => (
                      <tr key={app.id} style={{ borderTop: "1px solid rgba(196, 154, 108, 0.2)" }}>
                        {/* 1. STUDENT */}
                        <td style={{ padding: "12px 14px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#FFF7E6", border: "1px solid rgba(196, 154, 108, 0.4)", color: "#D35400", fontWeight: 800, fontSize: "0.8rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              {app.studentName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                            </div>
                            <div>
                              <strong style={{ color: "#241A14", display: "block", fontSize: "0.88rem" }}>{app.studentName}</strong>
                              <span style={{ fontSize: "0.76rem", fontFamily: "monospace", color: "#D35400" }}>{app.studentId}</span>
                            </div>
                          </div>
                        </td>

                        {/* 2. FEE */}
                        <td style={{ padding: "12px 14px", fontWeight: 700, color: "#241A14" }}>
                          {app.feeTitle}
                        </td>

                        {/* 3. TOTAL AMOUNT */}
                        <td style={{ padding: "12px 14px", fontFeatureSettings: "'tnum'", color: "#66564A" }}>
                          {formatTaka(app.originalAmount, false)}
                        </td>

                        {/* 4. REQUESTED AMOUNT */}
                        <td style={{ padding: "12px 14px", fontWeight: 800, color: "#D35400", fontFeatureSettings: "'tnum'" }}>
                          {formatTaka(app.requestedAmount, false)}
                        </td>

                        {/* 5. SUBMITTED DATE */}
                        <td style={{ padding: "12px 14px", color: "#8C7A6A", fontSize: "0.8rem" }}>
                          {app.submittedAt || "Recent"}
                        </td>

                        {/* 6. AI MATCH SCORE */}
                        <td style={{ padding: "12px 14px" }}>
                          <span style={{ background: "rgba(4, 120, 87, 0.12)", color: "#047857", padding: "3px 8px", borderRadius: "999px", fontSize: "0.76rem", fontWeight: 800 }}>
                            {app.aiMatchScore || 96.4}% Score (PASS)
                          </span>
                        </td>

                        {/* 7. STATUS */}
                        <td style={{ padding: "12px 14px" }}>
                          <span style={{
                            padding: "4px 10px",
                            borderRadius: "999px",
                            fontSize: "0.76rem",
                            fontWeight: 800,
                            background:
                              app.status === "approved_head" || app.status === "paid" ? "rgba(4, 120, 87, 0.12)" :
                              app.status === "forwarded_head" ? "rgba(124, 58, 237, 0.12)" :
                              app.status === "changes_requested" ? "rgba(217, 119, 6, 0.12)" :
                              app.status.includes("rejected") ? "rgba(190, 18, 60, 0.12)" :
                              "rgba(211, 84, 0, 0.12)",
                            color:
                              app.status === "approved_head" || app.status === "paid" ? "#047857" :
                              app.status === "forwarded_head" ? "#7C3AED" :
                              app.status === "changes_requested" ? "#D97706" :
                              app.status.includes("rejected") ? "#BE123C" :
                              "#D35400",
                          }}>
                            {app.status === "forwarded_head" ? "Awaiting Head Approval" : app.status.replace("_", " ").toUpperCase()}
                          </span>
                        </td>

                        {/* 8. ACTIONS */}
                        <td style={{ padding: "12px 14px", textAlign: "right" }}>
                          <button
                            type="button"
                            onClick={() => setReviewApp(app)}
                            style={{ background: "#FFF7E6", border: "1px solid rgba(196, 154, 108, 0.4)", color: "#D35400", padding: "6px 12px", borderRadius: "8px", fontSize: "0.78rem", fontWeight: 800, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "4px" }}
                          >
                            <Eye size={13} /> Review Application
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      
      {/* PHASE 18 — IMMUTABLE INSTITUTIONAL AUDIT TRAIL */}
      

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


      {/* REVIEW APPLICATION MODAL */}
      {reviewApp && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(36, 26, 20, 0.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100, padding: "20px" }}>
          <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.4)", borderRadius: "20px", width: "100%", maxWidth: "800px", maxHeight: "90vh", overflowY: "auto", padding: "24px", boxShadow: "0 24px 48px rgba(36, 26, 20, 0.3)", display: "flex", flexDirection: "column", gap: "18px" }}>
            
            {/* HEADER */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(196, 154, 108, 0.25)", paddingBottom: "12px" }}>
              <div>
                <h3 style={{ margin: 0, color: "#241A14", fontSize: "1.2rem", fontWeight: 800 }}>
                  Admin Partial Payment Dossier Review
                </h3>
                <span style={{ fontSize: "0.8rem", color: "#66564A" }}>
                  Application ID: <strong style={{ color: "#D35400", fontFamily: "monospace" }}>{reviewApp.id}</strong> • Submitted: {reviewApp.submittedAt || "Recent"}
                </span>
              </div>
              <button type="button" onClick={() => setReviewApp(null)} style={{ background: "none", border: "none", color: "#8C7A6A", cursor: "pointer" }}>
                <X size={20} />
              </button>
            </div>

            {/* REVIEW PANELS GRID */}
            <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* STUDENT & GUARDIAN PROFILE */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "12px", padding: "14px" }}>
                  <span style={{ color: "#8C7A6A", fontSize: "0.76rem", fontWeight: 700, display: "block" }}>Student Identity Profile</span>
                  <strong style={{ color: "#241A14", fontSize: "0.92rem", display: "block", marginTop: "2px" }}>{reviewApp.studentName}</strong>
                  <span style={{ fontSize: "0.78rem", fontFamily: "monospace", color: "#D35400" }}>ID: {reviewApp.studentId}</span>
                  <div style={{ marginTop: "6px", fontSize: "0.78rem", color: "#66564A" }}>
                    Placement: CSE 1st Year (Sec A) • Status: <strong style={{ color: "#047857" }}>Active Verified</strong>
                  </div>
                </div>

                <div style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "12px", padding: "14px" }}>
                  <span style={{ color: "#8C7A6A", fontSize: "0.76rem", fontWeight: 700, display: "block" }}>Guardian Contact & NID Info</span>
                  <strong style={{ color: "#241A14", fontSize: "0.92rem", display: "block", marginTop: "2px" }}>{reviewApp.guardianName}</strong>
                  <span style={{ fontSize: "0.78rem", color: "#66564A" }}>Phone: {reviewApp.guardianPhone}</span>
                  <div style={{ marginTop: "6px", fontSize: "0.78rem", color: "#047857", fontWeight: 700 }}>
                    📄 NID Document: {reviewApp.guardianIdDocUrl || "NID-884920-VERIFIED.pdf"}
                  </div>
                </div>
              </div>

              {/* FEE & FINANCIAL BREAKDOWN */}
              <div style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "12px", padding: "14px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                <div>
                  <span style={{ color: "#8C7A6A", fontSize: "0.76rem", fontWeight: 700, display: "block" }}>Fee Item</span>
                  <strong style={{ color: "#241A14", fontSize: "0.95rem" }}>{reviewApp.feeTitle}</strong>
                </div>

                <div>
                  <span style={{ color: "#8C7A6A", fontSize: "0.76rem", fontWeight: 700, display: "block" }}>Financial Breakdown</span>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginTop: "2px" }}>
                    <strong style={{ color: "#D35400", fontSize: "1.1rem", fontFeatureSettings: "'tnum'" }}>
                      Requested: {formatTaka(reviewApp.requestedAmount, false)}
                    </strong>
                    <span style={{ fontSize: "0.78rem", color: "#8C7A6A", textDecoration: "line-through" }}>
                      Original: {formatTaka(reviewApp.originalAmount, false)}
                    </span>
                  </div>
                </div>
              </div>

              {/* HARDSHIP STATEMENT */}
              <div style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "12px", padding: "14px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ color: "#8C7A6A", fontSize: "0.76rem", fontWeight: 700 }}>Stated Hardship Reason & Statement</span>
                <p style={{ margin: 0, color: "#241A14", fontSize: "0.86rem", fontWeight: 600 }}>"{reviewApp.reason}"</p>
                {reviewApp.statement && (
                  <p style={{ margin: 0, color: "#66564A", fontSize: "0.82rem", fontStyle: "italic" }}>"{reviewApp.statement}"</p>
                )}
              </div>

              {/* SIGNATURES & AI COMPARISON RESULT */}
              <div style={{ background: "#FFFFFF", border: "1.5px solid rgba(4, 120, 87, 0.35)", borderRadius: "14px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Sparkles size={16} color="#047857" />
                    <strong style={{ fontSize: "0.9rem", color: "#047857" }}>
                      AI Signature Comparison Analysis
                    </strong>
                  </div>
                  <span style={{ background: "rgba(4, 120, 87, 0.12)", color: "#047857", padding: "3px 10px", borderRadius: "999px", fontSize: "0.78rem", fontWeight: 800 }}>
                    Match Score: {reviewApp.aiMatchScore || 96.4}% (VERIFIED PASS)
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <div style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.25)", borderRadius: "8px", padding: "10px", textAlign: "center" }}>
                    <span style={{ fontSize: "0.74rem", color: "#8C7A6A", display: "block" }}>Student Signature Canvas</span>
                    <strong style={{ fontFamily: "cursive", fontSize: "1rem", color: "#241A14", display: "block", marginTop: "4px" }}>
                      {reviewApp.studentName}
                    </strong>
                  </div>

                  <div style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.25)", borderRadius: "8px", padding: "10px", textAlign: "center" }}>
                    <span style={{ fontSize: "0.74rem", color: "#8C7A6A", display: "block" }}>Guardian Signature Canvas</span>
                    <strong style={{ fontFamily: "cursive", fontSize: "1rem", color: "#241A14", display: "block", marginTop: "4px" }}>
                      {reviewApp.guardianName}
                    </strong>
                  </div>
                </div>

                <p style={{ margin: 0, fontSize: "0.76rem", color: "#66564A" }}>
                  AI Verification: Biometric curvature match score <strong>96.4%</strong>. NID name string matches guardian signature record.
                </p>
              </div>

              {/* PREVIOUS APPLICATIONS HISTORY */}
              <div style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "12px", padding: "12px", fontSize: "0.8rem", color: "#66564A" }}>
                <strong>Prior Applications History:</strong> 1 previous application (APP-8910) approved by Executive Head on 2026-08-15. No defaults.
              </div>
            </div>

            {/* STRICT ADMINISTRATIVE ACTIONS PANEL */}
            <div style={{ background: "#FFF7E6", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "14px", padding: "16px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ fontSize: "0.8rem", color: "#D35400", fontWeight: 700 }}>
                Rule: Admin does NOT grant final approval. Admin reviews, verifies, and forwards to Executive Head for final sign-off.
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <input
                  type="text"
                  placeholder="Enter feedback notes or rejection reasons if requesting changes or declining..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  style={{ flex: 1, padding: "10px 14px", background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", color: "#241A14", outline: "none", fontSize: "0.84rem" }}
                />

                <button
                  type="button"
                  onClick={() => handleRequestChangesByAdmin(reviewApp.id)}
                  style={{ color: "#D35400", background: "#FFFFFF", border: "1px solid #D35400", padding: "9px 14px", borderRadius: "8px", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", whiteSpace: "nowrap" }}
                >
                  Request Changes
                </button>

                <button
                  type="button"
                  onClick={() => handleRejectByAdmin(reviewApp.id)}
                  style={{ color: "#FFFFFF", background: "#BE123C", border: "none", padding: "9px 14px", borderRadius: "8px", fontWeight: 700, fontSize: "0.82rem", cursor: "pointer", whiteSpace: "nowrap" }}
                >
                  Reject
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleForwardToHead(reviewApp.id)}
                style={{ background: "#D35400", color: "#FFFFFF", border: "none", padding: "12px 20px", borderRadius: "10px", fontWeight: 800, fontSize: "0.9rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", boxShadow: "0 4px 12px rgba(211, 84, 0, 0.25)" }}
              >
                <CheckCircle2 size={18} /> Verify & Forward to Executive Head (Awaiting Head Approval)
              </button>
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


      {/* PHASE 14 — SAFETY BULK ASSIGNMENT CONFIRMATION MODAL */}
      
      {/* PHASE 17 — ADMIN FINANCIAL INTELLIGENCE & ANALYTICS */}
      



      
      {/* DEMO CONTACT OPERATIONS CENTER MODAL (PHASE 17) */}
      {contactModalStudent && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(36, 26, 20, 0.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100, padding: "20px" }}>
          <div style={{ background: "#FFFFFF", border: "2px solid #D35400", borderRadius: "20px", width: "100%", maxWidth: "640px", padding: "24px", boxShadow: "0 24px 48px rgba(36, 26, 20, 0.3)", display: "flex", flexDirection: "column", gap: "18px" }}>
            
            {/* HEADER */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: "#D35400", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "1.1rem" }}>
                  {contactModalStudent.name.charAt(0)}
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, color: "#241A14" }}>
                    Admin Contact Operations — {contactModalStudent.name}
                  </h3>
                  <span style={{ fontSize: "0.82rem", color: "#8C7A6A" }}>
                    ID: {contactModalStudent.studentId} • {contactModalStudent.department} ({contactModalStudent.classYear})
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setContactModalStudent(null)}
                style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "50%", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <X size={16} />
              </button>
            </div>

            {/* CHANNEL SELECTION TABS */}
            <div style={{ display: "flex", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "10px", padding: "4px" }}>
              <button
                type="button"
                onClick={() => setContactChannel("email")}
                style={{ flex: 1, padding: "8px", border: "none", borderRadius: "8px", background: contactChannel === "email" ? "#FFFFFF" : "transparent", color: contactChannel === "email" ? "#D35400" : "#66564A", fontWeight: 700, fontSize: "0.84rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", boxShadow: contactChannel === "email" ? "0 2px 4px rgba(0,0,0,0.05)" : "none" }}
              >
                <Mail size={16} /> Email Channel
              </button>
              <button
                type="button"
                onClick={() => setContactChannel("sms")}
                style={{ flex: 1, padding: "8px", border: "none", borderRadius: "8px", background: contactChannel === "sms" ? "#FFFFFF" : "transparent", color: contactChannel === "sms" ? "#D35400" : "#66564A", fontWeight: 700, fontSize: "0.84rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", boxShadow: contactChannel === "sms" ? "0 2px 4px rgba(0,0,0,0.05)" : "none" }}
              >
                <Phone size={16} /> Phone / SMS
              </button>
              <button
                type="button"
                onClick={() => setContactChannel("call")}
                style={{ flex: 1, padding: "8px", border: "none", borderRadius: "8px", background: contactChannel === "call" ? "#FFFFFF" : "transparent", color: contactChannel === "call" ? "#047857" : "#66564A", fontWeight: 700, fontSize: "0.84rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", boxShadow: contactChannel === "call" ? "0 2px 4px rgba(0,0,0,0.05)" : "none" }}
              >
                <PhoneCall size={16} /> Voice Call Simulation
              </button>
            </div>

            {/* CHANNEL CONTENT */}
            {contactChannel === "email" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#66564A", display: "block", marginBottom: "4px" }}>
                    Recipient Email Address:
                  </label>
                  <input
                    type="text"
                    disabled
                    value={contactModalStudent.email || "student@dcc.edu.bd"}
                    style={{ width: "100%", padding: "10px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "8px", fontSize: "0.85rem", color: "#241A14" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#66564A", display: "block", marginBottom: "4px" }}>
                    Subject Line:
                  </label>
                  <input
                    type="text"
                    value={contactEmailSubject}
                    onChange={(e) => setContactEmailSubject(e.target.value)}
                    style={{ width: "100%", padding: "10px", background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", fontSize: "0.85rem", color: "#241A14", fontWeight: 600 }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#66564A", display: "block", marginBottom: "4px" }}>
                    Email Body Draft:
                  </label>
                  <textarea
                    rows={6}
                    value={contactEmailBody}
                    onChange={(e) => setContactEmailBody(e.target.value)}
                    style={{ width: "100%", padding: "10px", background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", fontSize: "0.85rem", color: "#241A14", resize: "vertical" }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "4px" }}>
                  <button
                    type="button"
                    onClick={() => setContactModalStudent(null)}
                    style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.4)", padding: "10px 16px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 700 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSendDemoEmail}
                    style={{ background: "#D35400", color: "#FFFFFF", border: "none", padding: "10px 20px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 800, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}
                  >
                    <Send size={16} /> Dispatch Demo Email
                  </button>
                </div>
              </div>
            )}

            {contactChannel === "sms" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#66564A", display: "block", marginBottom: "4px" }}>
                    Student Mobile Number:
                  </label>
                  <input
                    type="text"
                    disabled
                    value={contactModalStudent.phone || "+880 1712-345678"}
                    style={{ width: "100%", padding: "10px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "8px", fontSize: "0.85rem", color: "#241A14" }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#66564A", display: "block", marginBottom: "4px" }}>
                    SMS Notification Text:
                  </label>
                  <textarea
                    rows={4}
                    value={contactSmsBody}
                    onChange={(e) => setContactSmsBody(e.target.value)}
                    style={{ width: "100%", padding: "10px", background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", fontSize: "0.85rem", color: "#241A14" }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "4px" }}>
                  <button
                    type="button"
                    onClick={() => setContactModalStudent(null)}
                    style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.4)", padding: "10px 16px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 700 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleSendDemoSms}
                    style={{ background: "#D35400", color: "#FFFFFF", border: "none", padding: "10px 20px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 800, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}
                  >
                    <Send size={16} /> Dispatch Demo SMS
                  </button>
                </div>
              </div>
            )}

            {contactChannel === "call" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                
                {/* VOICE CALL SIMULATION DISPLAY */}
                <div style={{ background: "#FDF9F3", border: "2px solid #047857", borderRadius: "14px", padding: "20px", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "10px" }}>
                  <div style={{ width: "54px", height: "54px", borderRadius: "50%", background: callState === "connected" ? "#047857" : "#D35400", color: "#FFFFFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <PhoneCall size={26} />
                  </div>

                  <div>
                    <h4 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#241A14" }}>
                      {contactModalStudent.phone || "+880 1712-345678"}
                    </h4>
                    <span style={{ fontSize: "0.8rem", color: callState === "connected" ? "#047857" : "#66564A", fontWeight: 700 }}>
                      {callState === "idle" && "Ready to initiate call"}
                      {callState === "dialing" && "Dialing student line..."}
                      {callState === "connected" && `● Connected (Call Duration: 00:14)`}
                    </span>
                  </div>

                  {callState === "idle" ? (
                    <button
                      type="button"
                      onClick={handleStartDemoCall}
                      style={{ background: "#047857", color: "#FFFFFF", border: "none", padding: "8px 20px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 800, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}
                    >
                      <PhoneCall size={16} /> Start Demo Voice Call
                    </button>
                  ) : (
                    <span style={{ fontSize: "0.78rem", background: "rgba(4, 120, 87, 0.12)", color: "#047857", padding: "4px 12px", borderRadius: "999px", fontWeight: 700 }}>
                      Audio Stream Connected & Recording Active
                    </span>
                  )}
                </div>

                <div>
                  <label style={{ fontSize: "0.78rem", fontWeight: 700, color: "#66564A", display: "block", marginBottom: "4px" }}>
                    Admin Call Interaction Notes:
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter call outcome summary (e.g. Student requested 5-day extension due to family emergency)..."
                    value={callNotes}
                    onChange={(e) => setCallNotes(e.target.value)}
                    style={{ width: "100%", padding: "10px", background: "#FFFFFF", border: "1.5px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", fontSize: "0.85rem", color: "#241A14" }}
                  />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "4px" }}>
                  <button
                    type="button"
                    onClick={() => setContactModalStudent(null)}
                    style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.4)", padding: "10px 16px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 700 }}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleLogCallOutcome}
                    style={{ background: "#047857", color: "#FFFFFF", border: "none", padding: "10px 20px", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 800, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "6px" }}
                  >
                    <CheckCircle2 size={16} /> Log Call Outcome
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}


      
      {/* PHASE 18 — STRICT READ-ONLY AUDIT RECORD INSPECTION DOSSIER */}
      {selectedAuditLog && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(36, 26, 20, 0.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100, padding: "20px" }}>
          <div style={{ background: "#FFFFFF", border: "2px solid #D35400", borderRadius: "20px", width: "100%", maxWidth: "680px", padding: "26px", boxShadow: "0 24px 48px rgba(36, 26, 20, 0.3)", display: "flex", flexDirection: "column", gap: "20px" }}>
            
            {/* MODAL HEADER */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                  <span style={{ fontSize: "0.74rem", background: "rgba(211, 84, 0, 0.12)", color: "#D35400", border: "1px solid rgba(211, 84, 0, 0.3)", padding: "2px 8px", borderRadius: "6px", fontWeight: 800 }}>
                    EVENT DOSSIER #{selectedAuditLog.id.toUpperCase()}
                  </span>
                  <span style={{ fontSize: "0.78rem", color: "#8C7A6A", fontFeatureSettings: "'tnum'" }}>
                    {selectedAuditLog.timestamp}
                  </span>
                </div>
                <h3 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 800, color: "#241A14" }}>
                  {selectedAuditLog.action}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedAuditLog(null)}
                style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "50%", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <X size={16} />
              </button>
            </div>

            {/* MANDATE BANNER — STRICT READ ONLY */}
            <div style={{ background: "#FFF7E6", border: "1.5px solid #D35400", borderRadius: "12px", padding: "12px 16px", fontSize: "0.8rem", color: "#241A14", lineHeight: 1.4, display: "flex", alignItems: "flex-start", gap: "10px" }}>
              <ShieldCheck size={20} color="#D35400" style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <strong style={{ color: "#D35400", display: "block", marginBottom: "2px" }}>
                  IMMUTABLE AUDIT LOG — READ ONLY RECORD
                </strong>
                Audit trail entries are immutably logged for financial compliance. Editing, modifying, or deleting audit history is strictly prohibited by security policy.
              </div>
            </div>

            {/* ACTOR & METADATA GRID */}
            <div style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "14px", padding: "18px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", fontSize: "0.85rem" }}>
              <div>
                <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#8C7A6A", textTransform: "uppercase" }}>Performing Actor</span>
                <strong style={{ color: "#241A14", display: "block", fontSize: "0.95rem", marginTop: "2px" }}>{selectedAuditLog.actor}</strong>
                <span style={{ fontSize: "0.75rem", background: "rgba(211, 84, 0, 0.1)", color: "#D35400", padding: "1px 6px", borderRadius: "4px", fontWeight: 700, display: "inline-block", marginTop: "4px" }}>
                  Role: {selectedAuditLog.role}
                </span>
              </div>

              <div>
                <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#8C7A6A", textTransform: "uppercase" }}>Target Entity Scope</span>
                <strong style={{ color: "#241A14", display: "block", fontSize: "0.95rem", marginTop: "2px" }}>
                  {selectedAuditLog.studentName || selectedAuditLog.studentId || "Institutional Scope"}
                </strong>
                <span style={{ fontSize: "0.78rem", color: "#66564A", display: "block", marginTop: "2px" }}>
                  Record: {selectedAuditLog.financialRecordTitle || "System Operation"}
                </span>
              </div>
            </div>

            {/* BEFORE VALUE VS AFTER VALUE COMPARATIVE DIFF BOX */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              
              {/* BEFORE VALUE BOX */}
              <div style={{ background: "rgba(190, 18, 60, 0.04)", border: "1.5px solid rgba(190, 18, 60, 0.3)", borderRadius: "14px", padding: "16px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontSize: "0.74rem", fontWeight: 800, color: "#BE123C", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  [BEFORE VALUE]
                </span>
                <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#241A14", lineHeight: 1.4 }}>
                  {selectedAuditLog.beforeValue || "Unassigned / Initial State"}
                </div>
              </div>

              {/* AFTER VALUE BOX */}
              <div style={{ background: "rgba(4, 120, 87, 0.04)", border: "1.5px solid rgba(4, 120, 87, 0.3)", borderRadius: "14px", padding: "16px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <span style={{ fontSize: "0.74rem", fontWeight: 800, color: "#047857", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                  [AFTER VALUE]
                </span>
                <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#241A14", lineHeight: 1.4 }}>
                  {selectedAuditLog.afterValue || "Updated / Executed State"}
                </div>
              </div>

            </div>

            {/* EVENT DETAILS & NARRATIVE */}
            <div style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "12px", padding: "16px", display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontSize: "0.74rem", fontWeight: 700, color: "#8C7A6A", textTransform: "uppercase" }}>Event Action Details</span>
              <p style={{ margin: 0, fontSize: "0.88rem", color: "#241A14", lineHeight: 1.4 }}>
                {selectedAuditLog.details}
              </p>
            </div>

            {/* AUDIT HASH */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(196, 154, 108, 0.25)", paddingTop: "12px", fontSize: "0.75rem", color: "#8C7A6A" }}>
              <span>Verification Hash: <strong style={{ color: "#241A14" }}>{selectedAuditLog.hash || "SHA256: 8f92a10b42c98401e712a104"}</strong></span>
              <span style={{ color: "#047857", fontWeight: 700 }}>● Cryptographically Verified</span>
            </div>

            {/* FOOTER — READ ONLY CLOSE BUTTON ONLY */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "4px" }}>
              <button
                type="button"
                onClick={() => setSelectedAuditLog(null)}
                style={{ background: "#D35400", color: "#FFFFFF", border: "none", padding: "10px 22px", borderRadius: "10px", fontSize: "0.85rem", fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 12px rgba(211, 84, 0, 0.3)" }}
              >
                Close Audit Dossier
              </button>
            </div>

          </div>
        </div>
      )}


      {activeTab === "analytics" && renderAnalyticsView()}

      {activeTab === "audit" && renderAuditView()}

      {activeTab === "escalations" && renderEscalationsTab()}

      {activeTab === "reminders" && renderRemindersTab()}

      {/* ADD NEW STUDENT MODAL */}
      {showAddStudentModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(36, 26, 20, 0.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100, padding: "20px" }}>
          <div style={{ background: "#FFFFFF", border: "2px solid #D35400", borderRadius: "20px", width: "100%", maxWidth: "600px", padding: "24px", boxShadow: "0 24px 48px rgba(36, 26, 20, 0.3)", display: "flex", flexDirection: "column", gap: "16px" }}>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid rgba(196, 154, 108, 0.3)", paddingBottom: "12px" }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, color: "#241A14" }}>
                  Enrol New Student Record
                </h3>
                <span style={{ fontSize: "0.8rem", color: "#66564A" }}>
                  Manually register a new student profile into institutional directory.
                </span>
              </div>
              <button type="button" onClick={() => setShowAddStudentModal(false)} style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "50%", width: "32px", height: "32px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateStudentSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#66564A", marginBottom: "4px" }}>
                    Full Student Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mahfuzur Rahman"
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", color: "#241A14", fontWeight: 700, outline: "none", fontSize: "0.86rem" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#66564A", marginBottom: "4px" }}>
                    Student ID *
                  </label>
                  <input
                    type="text"
                    required
                    value={addStudentId}
                    onChange={(e) => setAddStudentId(e.target.value)}
                    style={{ width: "100%", padding: "8px 12px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", color: "#D35400", fontWeight: 800, fontFamily: "monospace", outline: "none", fontSize: "0.86rem" }}
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, color: "#66564A", marginBottom: "4px" }}>Department</label>
                  <select value={addDept} onChange={(e) => setAddDept(e.target.value)} style={{ width: "100%", padding: "8px 10px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", fontWeight: 700, fontSize: "0.82rem" }}>
                    <option value="CSE">CSE</option>
                    <option value="EEE">EEE</option>
                    <option value="BBA">BBA</option>
                    <option value="Civil">Civil</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, color: "#66564A", marginBottom: "4px" }}>Class / Year</label>
                  <select value={addClassYear} onChange={(e) => setAddClassYear(e.target.value)} style={{ width: "100%", padding: "8px 10px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", fontWeight: 700, fontSize: "0.82rem" }}>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, color: "#66564A", marginBottom: "4px" }}>Section</label>
                  <select value={addSection} onChange={(e) => setAddSection(e.target.value)} style={{ width: "100%", padding: "8px 10px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", fontWeight: 700, fontSize: "0.82rem" }}>
                    <option value="Sec A">Sec A</option>
                    <option value="Sec B">Sec B</option>
                    <option value="Sec C">Sec C</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#66564A", marginBottom: "4px" }}>Email Address</label>
                  <input type="email" placeholder="student@dcc.edu.bd" value={addEmail} onChange={(e) => setAddEmail(e.target.value)} style={{ width: "100%", padding: "8px 12px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", fontWeight: 600, fontSize: "0.84rem" }} />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.76rem", fontWeight: 700, color: "#66564A", marginBottom: "4px" }}>Initial Tuition Dues (৳)</label>
                  <input type="number" value={addDues} onChange={(e) => setAddDues(Number(e.target.value))} style={{ width: "100%", padding: "8px 12px", background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", borderRadius: "8px", fontWeight: 800, fontSize: "0.84rem" }} />
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px", marginTop: "10px" }}>
                <button type="button" onClick={() => setShowAddStudentModal(false)} style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.4)", color: "#66564A", padding: "8px 16px", borderRadius: "8px", fontWeight: 700, fontSize: "0.84rem", cursor: "pointer" }}>
                  Cancel
                </button>
                <button type="submit" style={{ background: "#D35400", color: "#FFFFFF", border: "none", padding: "8px 20px", borderRadius: "8px", fontWeight: 800, fontSize: "0.84rem", cursor: "pointer", boxShadow: "0 2px 8px rgba(211, 84, 0, 0.25)" }}>
                  Save & Enrol Student
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {showBulkConfirmModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(36, 26, 20, 0.65)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100, padding: "20px" }}>
          <div style={{ background: "#FFFFFF", border: "2px solid #D35400", borderRadius: "20px", width: "100%", maxWidth: "560px", padding: "24px", boxShadow: "0 24px 48px rgba(36, 26, 20, 0.3)", display: "flex", flexDirection: "column", gap: "18px" }}>
            
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ width: "42px", height: "42px", borderRadius: "50%", background: "#FFF7E6", border: "1.5px solid #D35400", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <AlertTriangle size={22} color="#D35400" />
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 800, color: "#241A14" }}>
                  Safety Assignment Confirmation
                </h3>
                <span style={{ fontSize: "0.8rem", color: "#8C7A6A" }}>
                  Please verify bulk assignment parameters before final commit.
                </span>
              </div>
            </div>

            <div style={{ background: "#FDF9F3", border: "1px solid rgba(196, 154, 108, 0.3)", borderRadius: "14px", padding: "18px", display: "flex", flexDirection: "column", gap: "10px", fontSize: "0.88rem" }}>
              <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#241A14" }}>
                You are about to assign: <strong style={{ color: "#D35400", fontFeatureSettings: "'tnum'" }}>{formatTaka(bulkAmount)}</strong>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px", color: "#66564A", borderTop: "1px solid rgba(196, 154, 108, 0.2)", paddingTop: "10px" }}>
                <div><strong>Fee Title:</strong> {bulkTitle} ({bulkCategory})</div>
                <div><strong>Target Cohort:</strong> {bulkDept} {bulkClassYear} ({bulkSection}) — {bulkSemester}</div>
                <div><strong>Targeted Students:</strong> <strong style={{ color: "#241A14" }}>{selectedBulkStudentIds.length} students</strong></div>
                <div><strong>Issue Date:</strong> {bulkIssueDate}</div>
                <div><strong>Deadline:</strong> <strong style={{ color: "#BE123C" }}>{bulkDueDate}</strong></div>
              </div>
            </div>

            <p style={{ margin: 0, fontSize: "0.78rem", color: "#8C7A6A", lineHeight: 1.4 }}>
              Confirming will generate fee obligations, update student balances, transmit real-time alerts, and log an official audit record.
            </p>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "4px" }}>
              <button
                type="button"
                onClick={() => setShowBulkConfirmModal(false)}
                style={{ background: "#FFFFFF", border: "1px solid rgba(196, 154, 108, 0.4)", color: "#66564A", padding: "10px 18px", borderRadius: "10px", fontSize: "0.85rem", fontWeight: 700, cursor: "pointer" }}
              >
                Cancel / Edit
              </button>

              <button
                type="button"
                onClick={handleConfirmFinalBulkAssign}
                style={{ background: "#D35400", color: "#FFFFFF", border: "none", padding: "10px 22px", borderRadius: "10px", fontSize: "0.85rem", fontWeight: 800, cursor: "pointer", boxShadow: "0 4px 12px rgba(211, 84, 0, 0.3)", display: "inline-flex", alignItems: "center", gap: "6px" }}
              >
                <CheckCircle2 size={16} /> Confirm Assignment
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

/**
 * Neo Cash AI — Admin: Student Roster Import Panel (Phase 2)
 *
 * Allows administrators to import student lists from CSV or Excel files.
 * Once imported, students can be verified via roster lookup during onboarding.
 *
 * Features:
 * - Drag-and-drop CSV/XLSX upload
 * - Live preview of parsed rows (first 10)
 * - Field mapping auto-detection (student_id, full_name, email, department, etc.)
 * - Upload progress with batch result summary
 * - Link to import history (import_logs table)
 */

import { useCallback, useRef, useState } from "react";
import {
  Upload, FileText, CheckCircle2, AlertCircle, X,
  Users, Download, Info, RefreshCw, Loader2,
} from "lucide-react";
import { importStudentRoster } from "@/lib/college-identity.functions";
import { useImportLogs } from "@/hooks/use-neo-data";
import type { RosterRow } from "@/lib/college-identity.functions";

// ─── Types ────────────────────────────────────────────────────────────────────
type UploadPhase = "idle" | "parsing" | "preview" | "uploading" | "done" | "error";

interface ParseResult {
  rows: RosterRow[];
  warnings: string[];
  fileName: string;
}

interface ImportResult {
  imported: number;
  rejected: number;
  errors: string[];
}

interface Props {
  institutionId: string;
  institutionName: string;
}

// ─── CSV / XLSX Parser ────────────────────────────────────────────────────────
async function parseFile(file: File): Promise<ParseResult> {
  const text = await file.text();
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) throw new Error("File appears empty or has only a header row.");

  const header = lines[0]!.split(",").map((h) => h.trim().toLowerCase().replace(/\s+/g, "_"));
  const warnings: string[] = [];

  // Map flexible column names to our expected fields
  const colMap = (candidates: string[]) =>
    candidates.find((c) => header.includes(c)) ?? null;

  const idCol     = colMap(["student_id", "id", "roll", "roll_no", "student_roll", "roll_number"]);
  const nameCol   = colMap(["full_name", "name", "student_name", "student name"]);
  const emailCol  = colMap(["email", "email_address", "institutional_email", "student_email"]);
  const deptCol   = colMap(["department", "dept", "faculty", "program"]);
  const yearCol   = colMap(["class_year", "year", "class", "batch"]);
  const secCol    = colMap(["section", "sec", "group"]);
  const semCol    = colMap(["semester", "sem", "term"]);

  if (!idCol)    warnings.push("Column 'student_id' not found — please ensure your file has a 'student_id' or 'roll' column.");
  if (!nameCol)  warnings.push("Column 'full_name' not found — please ensure a 'name' or 'full_name' column exists.");
  if (!emailCol) warnings.push("Column 'email' not found — email verification will not be available for these students.");

  const rows: RosterRow[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i]!.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
    const get  = (col: string | null) => (col ? cols[header.indexOf(col)] ?? "" : "");

    const row: RosterRow = {
      student_id: get(idCol),
      full_name:  get(nameCol),
      email:      get(emailCol),
      department: get(deptCol),
      ...(get(yearCol) ? { class_year: get(yearCol) } : {}),
      ...(get(secCol)  ? { section:    get(secCol)  } : {}),
      ...(get(semCol)  ? { semester:   get(semCol)  } : {}),
    };

    if (!row.student_id && !row.email) continue; // skip blank rows
    rows.push(row);
  }

  return { rows, warnings, fileName: file.name };
}

// ─── Template CSV Download ────────────────────────────────────────────────────
function downloadTemplate() {
  const csv = [
    "student_id,full_name,email,department,class_year,section,semester",
    "DCC-CSE-24-001,Rahim Uddin,rahim@dcc.ac.bd,Computer Science,1st Year,A,2nd",
    "DCC-CSE-24-002,Fatima Khanom,fatima@dcc.ac.bd,Computer Science,1st Year,B,2nd",
    "DCC-BBA-24-001,Karim Hossain,karim@dcc.ac.bd,Business Administration,1st Year,A,1st",
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href = url; a.download = "student_roster_template.csv"; a.click();
  URL.revokeObjectURL(url);
}

// ─────────────────────────────────────────────────────────────────────────────
export function AdminRosterImport({ institutionId, institutionName }: Props) {
  const [phase, setPhase]         = useState<UploadPhase>("idle");
  const [parsed, setParsed]       = useState<ParseResult | null>(null);
  const [result, setResult]       = useState<ImportResult | null>(null);
  const [errorMsg, setErrorMsg]   = useState("");
  const [isDragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: importLogs } = useImportLogs(institutionId);

  // ── File handling ──────────────────────────────────────────────────────────
  const handleFile = useCallback(async (file: File) => {
    if (!file.name.match(/\.(csv|txt)$/i)) {
      setErrorMsg("Only CSV files are supported. Excel files: save as CSV first.");
      setPhase("error");
      return;
    }
    setPhase("parsing");
    setErrorMsg("");
    try {
      const p = await parseFile(file);
      if (p.rows.length === 0) throw new Error("No valid student rows found in this file.");
      setParsed(p);
      setPhase("preview");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to parse file.");
      setPhase("error");
    }
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) void handleFile(file);
  }, [handleFile]);

  // ── Upload to Supabase ─────────────────────────────────────────────────────
  const handleUpload = async () => {
    if (!parsed) return;
    setPhase("uploading");
    try {
      const res = await importStudentRoster({
        data: {
          institutionId,
          rows: parsed.rows,
          fileName: parsed.fileName,
        },
      });
      setResult(res);
      setPhase("done");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Import failed.");
      setPhase("error");
    }
  };

  const reset = () => {
    setPhase("idle");
    setParsed(null);
    setResult(null);
    setErrorMsg("");
  };

  // ── Shared styles ──────────────────────────────────────────────────────────
  const sectionStyle = {
    background: "#FFFFFF",
    border: "1px solid rgba(196, 154, 108, 0.3)",
    borderRadius: "16px",
    padding: "24px",
    marginBottom: "16px",
  } as const;

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h2 style={{ margin: "0 0 6px", fontSize: "1.35rem", fontWeight: 800, color: "#241A14" }}>
            Student Roster Import
          </h2>
          <p style={{ margin: 0, fontSize: "0.88rem", color: "#66564A" }}>
            Upload a CSV file of enrolled students for <strong>{institutionName}</strong>.
            Once imported, students can verify their identity via roster lookup.
          </p>
        </div>
        <button
          type="button"
          onClick={downloadTemplate}
          style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            padding: "8px 16px", borderRadius: "10px",
            background: "var(--theme-color-50)", border: "1px solid rgba(196, 154, 108, 0.4)",
            color: "var(--theme-color-900)", fontSize: "0.83rem", fontWeight: 700, cursor: "pointer",
            whiteSpace: "nowrap",
          }}
        >
          <Download size={14} /> Download Template
        </button>
      </div>

      {/* Info banner */}
      <div style={{
        display: "flex", gap: "12px", alignItems: "flex-start",
        background: "rgba(2, 132, 199, 0.06)", border: "1px solid rgba(2, 132, 199, 0.25)",
        borderRadius: "12px", padding: "14px 18px", marginBottom: "20px",
      }}>
        <Info size={17} style={{ color: "#0284C7", flexShrink: 0, marginTop: "1px" }} />
        <div style={{ fontSize: "0.82rem", color: "#0C4A6E", lineHeight: 1.6 }}>
          <strong>Required columns:</strong> <code>student_id</code>, <code>full_name</code>, <code>email</code>, <code>department</code>
          <br />
          <strong>Optional:</strong> <code>class_year</code>, <code>section</code>, <code>semester</code>
          <br />
          Existing records are updated on re-import (upsert by student_id).
        </div>
      </div>

      {/* ── IDLE — Drop Zone ─────────────────────────────────── */}
      {phase === "idle" && (
        <div
          onDrop={onDrop}
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => fileRef.current?.click()}
          style={{
            border: `2px dashed ${isDragOver ? "var(--theme-color-900)" : "rgba(196, 154, 108, 0.5)"}`,
            borderRadius: "16px",
            padding: "52px 24px",
            textAlign: "center",
            cursor: "pointer",
            background: isDragOver ? "rgba(211, 84, 0, 0.04)" : "#FDFAF6",
            transition: "all 0.2s",
          }}
        >
          <Upload size={36} style={{ color: "var(--theme-color-900)", margin: "0 auto 16px", display: "block" }} />
          <h3 style={{ margin: "0 0 8px", fontSize: "1.05rem", fontWeight: 700, color: "#241A14" }}>
            {isDragOver ? "Drop your CSV here" : "Drag & drop your CSV file"}
          </h3>
          <p style={{ margin: "0 0 18px", fontSize: "0.85rem", color: "#8C7A6A" }}>
            Or click to browse · Supports CSV (.csv)
          </p>
          <input
            ref={fileRef}
            type="file"
            accept=".csv,.txt"
            style={{ display: "none" }}
            onChange={(e) => { const f = e.target.files?.[0]; if (f) void handleFile(f); }}
          />
          <span style={{
            display: "inline-block", padding: "9px 22px",
            background: "var(--theme-color-900)", color: "#FFF",
            borderRadius: "10px", fontSize: "0.85rem", fontWeight: 700,
          }}>
            Browse File
          </span>
        </div>
      )}

      {/* ── PARSING ──────────────────────────────────────────── */}
      {phase === "parsing" && (
        <div style={{ ...sectionStyle, textAlign: "center", padding: "48px" }}>
          <Loader2 size={36} style={{ color: "var(--theme-color-900)", animation: "spin 1s linear infinite", display: "block", margin: "0 auto 16px" }} />
          <p style={{ margin: 0, fontWeight: 700, color: "#241A14" }}>Parsing your CSV file…</p>
        </div>
      )}

      {/* ── UPLOADING ─────────────────────────────────────────── */}
      {phase === "uploading" && (
        <div style={{ ...sectionStyle, textAlign: "center", padding: "48px" }}>
          <Loader2 size={36} style={{ color: "var(--theme-color-900)", animation: "spin 1s linear infinite", display: "block", margin: "0 auto 16px" }} />
          <p style={{ margin: "0 0 6px", fontWeight: 700, color: "#241A14" }}>
            Importing {parsed?.rows.length.toLocaleString()} students…
          </p>
          <p style={{ margin: 0, fontSize: "0.83rem", color: "#66564A" }}>Processing in batches of 200. Please wait.</p>
        </div>
      )}

      {/* ── PREVIEW ───────────────────────────────────────────── */}
      {phase === "preview" && parsed && (
        <>
          {/* File info card */}
          <div style={{ ...sectionStyle, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{
                width: "44px", height: "44px", borderRadius: "10px",
                background: "rgba(211, 84, 0, 0.1)", display: "grid", placeItems: "center",
              }}>
                <FileText size={20} style={{ color: "var(--theme-color-900)" }} />
              </div>
              <div>
                <p style={{ margin: "0 0 3px", fontWeight: 700, color: "#241A14" }}>{parsed.fileName}</p>
                <p style={{ margin: 0, fontSize: "0.82rem", color: "#66564A" }}>
                  <strong style={{ color: "#047857" }}>{parsed.rows.length.toLocaleString()}</strong> students parsed
                </p>
              </div>
            </div>
            <button type="button" onClick={reset} style={{ background: "none", border: "none", color: "#8C7A6A", cursor: "pointer" }}>
              <X size={18} />
            </button>
          </div>

          {/* Warnings */}
          {parsed.warnings.length > 0 && (
            <div style={{
              ...sectionStyle, background: "rgba(234, 179, 8, 0.06)",
              border: "1px solid rgba(234, 179, 8, 0.35)",
            }}>
              <div style={{ display: "flex", gap: "10px", alignItems: "flex-start" }}>
                <AlertCircle size={16} style={{ color: "#92400E", flexShrink: 0 }} />
                <div>
                  <p style={{ margin: "0 0 6px", fontWeight: 700, fontSize: "0.85rem", color: "#92400E" }}>
                    Column warnings ({parsed.warnings.length})
                  </p>
                  {parsed.warnings.map((w, i) => (
                    <p key={i} style={{ margin: "3px 0", fontSize: "0.8rem", color: "#78350F" }}>{w}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Preview table */}
          <div style={sectionStyle}>
            <p style={{ margin: "0 0 14px", fontWeight: 700, color: "#241A14", fontSize: "0.88rem" }}>
              Preview — first {Math.min(parsed.rows.length, 5)} of {parsed.rows.length} rows
            </p>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem" }}>
                <thead>
                  <tr style={{ background: "var(--theme-color-50)" }}>
                    {["Student ID", "Full Name", "Email", "Department", "Year", "Section"].map((h) => (
                      <th key={h} style={{ padding: "9px 12px", textAlign: "left", color: "#66564A", fontWeight: 700, whiteSpace: "nowrap", border: "1px solid rgba(196, 154, 108, 0.2)" }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parsed.rows.slice(0, 5).map((row, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid rgba(196, 154, 108, 0.15)" }}>
                      <td style={{ padding: "9px 12px", color: "#241A14", fontFamily: "monospace", whiteSpace: "nowrap" }}>{row.student_id || "—"}</td>
                      <td style={{ padding: "9px 12px", color: "#241A14", whiteSpace: "nowrap" }}>{row.full_name || "—"}</td>
                      <td style={{ padding: "9px 12px", color: "#0284C7", whiteSpace: "nowrap" }}>{row.email || "—"}</td>
                      <td style={{ padding: "9px 12px", color: "#241A14" }}>{row.department || "—"}</td>
                      <td style={{ padding: "9px 12px", color: "#241A14" }}>{row.class_year || "—"}</td>
                      <td style={{ padding: "9px 12px", color: "#241A14" }}>{row.section || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <button type="button" onClick={reset} style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              background: "none", border: "1.5px solid rgba(196, 154, 108, 0.5)",
              color: "#66564A", borderRadius: "10px", padding: "10px 18px",
              fontSize: "0.85rem", fontWeight: 700, cursor: "pointer",
            }}>
              <RefreshCw size={14} /> Choose different file
            </button>
            <button
              type="button"
              onClick={() => void handleUpload()}
              style={{
                display: "inline-flex", alignItems: "center", gap: "8px",
                background: "var(--theme-color-900)", color: "#FFF", border: "none",
                borderRadius: "10px", padding: "11px 24px",
                fontSize: "0.88rem", fontWeight: 700, cursor: "pointer",
              }}
            >
              <Upload size={15} />
              Import {parsed.rows.length.toLocaleString()} Students
            </button>
          </div>
        </>
      )}

      {/* ── DONE ─────────────────────────────────────────────── */}
      {phase === "done" && result && (
        <div style={{ ...sectionStyle, textAlign: "center", padding: "40px" }}>
          <CheckCircle2 size={48} style={{ color: "#047857", display: "block", margin: "0 auto 16px" }} />
          <h3 style={{ margin: "0 0 8px", fontSize: "1.2rem", fontWeight: 700, color: "#047857" }}>
            Import Complete!
          </h3>
          <div style={{ display: "flex", justifyContent: "center", gap: "32px", margin: "20px 0 24px" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "#047857" }}>{result.imported}</div>
              <div style={{ fontSize: "0.78rem", color: "#66564A", fontWeight: 600 }}>Imported</div>
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: result.rejected > 0 ? "#B91C1C" : "#8C7A6A" }}>
                {result.rejected}
              </div>
              <div style={{ fontSize: "0.78rem", color: "#66564A", fontWeight: 600 }}>Rejected</div>
            </div>
          </div>
          {result.errors.length > 0 && (
            <div style={{
              background: "rgba(185, 28, 28, 0.06)", border: "1px solid rgba(185, 28, 28, 0.2)",
              borderRadius: "10px", padding: "12px 16px", marginBottom: "20px", textAlign: "left",
            }}>
              {result.errors.slice(0, 3).map((e, i) => (
                <p key={i} style={{ margin: "3px 0", fontSize: "0.8rem", color: "#B91C1C" }}>{e}</p>
              ))}
            </div>
          )}
          <button type="button" onClick={reset} style={{
            background: "var(--theme-color-900)", color: "#FFF", border: "none",
            borderRadius: "10px", padding: "10px 22px",
            fontSize: "0.85rem", fontWeight: 700, cursor: "pointer",
          }}>
            Import Another File
          </button>
        </div>
      )}

      {/* ── ERROR ─────────────────────────────────────────────── */}
      {phase === "error" && (
        <div style={{
          ...sectionStyle,
          background: "rgba(185, 28, 28, 0.05)",
          border: "1px solid rgba(185, 28, 28, 0.25)",
        }}>
          <div style={{ display: "flex", gap: "12px" }}>
            <AlertCircle size={20} style={{ color: "#B91C1C", flexShrink: 0 }} />
            <div>
              <p style={{ margin: "0 0 8px", fontWeight: 700, color: "#B91C1C" }}>Import Failed</p>
              <p style={{ margin: "0 0 16px", fontSize: "0.85rem", color: "#241A14" }}>{errorMsg}</p>
              <button type="button" onClick={reset} style={{
                display: "inline-flex", alignItems: "center", gap: "6px",
                background: "none", border: "1.5px solid rgba(185, 28, 28, 0.4)",
                color: "#B91C1C", borderRadius: "8px", padding: "8px 14px",
                fontSize: "0.82rem", fontWeight: 700, cursor: "pointer",
              }}>
                <RefreshCw size={13} /> Try again
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Import History ──────────────────────────────────────── */}
      {importLogs && importLogs.length > 0 && (
        <div style={{ marginTop: "28px" }}>
          <h3 style={{ margin: "0 0 14px", fontSize: "1rem", fontWeight: 700, color: "#241A14" }}>
            Recent Imports
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {importLogs.slice(0, 5).map((log: any) => (
              <div key={log.id} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 18px", borderRadius: "12px",
                background: "#FDFAF6", border: "1px solid rgba(196, 154, 108, 0.25)",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <Users size={16} style={{ color: "#8C7A6A" }} />
                  <div>
                    <p style={{ margin: 0, fontSize: "0.88rem", fontWeight: 700, color: "#241A14" }}>
                      {log.file_name}
                    </p>
                    <p style={{ margin: "2px 0 0", fontSize: "0.78rem", color: "#66564A" }}>
                      {log.admin_name} · {new Date(log.created_at).toLocaleDateString("en-BD", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "0.82rem" }}>
                  <span style={{ color: "#047857", fontWeight: 700 }}>+{log.imported_count}</span>
                  {log.rejected_count > 0 && (
                    <span style={{ color: "#B91C1C", fontWeight: 700 }}>−{log.rejected_count}</span>
                  )}
                  <span style={{
                    padding: "3px 10px", borderRadius: "999px", fontWeight: 700,
                    fontSize: "0.72rem",
                    background: log.status === "Completed" ? "rgba(4, 120, 87, 0.1)" : "rgba(234, 179, 8, 0.15)",
                    color: log.status === "Completed" ? "#047857" : "#92400E",
                    border: `1px solid ${log.status === "Completed" ? "rgba(4, 120, 87, 0.2)" : "rgba(234, 179, 8, 0.3)"}`,
                  }}>
                    {log.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}



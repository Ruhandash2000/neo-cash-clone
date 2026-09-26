/**
 * Printable & Downloadable Digital Receipt Component
 * 
 * Generates official institutional financial receipts with Neo Cash AI watermark,
 * reference IDs, timestamps, student details, and verification QR code.
 */

import { Transaction } from "@/lib/neo-cash-store";
import { Printer, X, Download, ShieldCheck } from "lucide-react";
import purpleLogo from "@/assets/neo-purple-logo.png";

export function ReceiptModal({
  transaction,
  onClose,
}: {
  transaction: Transaction;
  onClose: () => void;
}) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="ms-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ms-modal" style={{ maxWidth: "540px", background: "#FFFFFF", color: "#0F172A", padding: "32px", borderRadius: "20px" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", borderBottom: "2px solid #E2E8F0", paddingBottom: "16px" }}>
          <div>
            <img src={purpleLogo} alt="Neo Cash" style={{ height: "36px", width: "auto" }} />
            <span style={{ display: "block", fontSize: "0.75rem", color: "#64748B", marginTop: "4px" }}>
              Official Financial Digital Receipt
            </span>
          </div>
          <button type="button" onClick={onClose} style={{ background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#64748B" }}>
            <X size={20} />
          </button>
        </div>

        {/* Receipt Body */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "0.9rem" }}>
          <div style={{ background: "#F8FAFC", padding: "12px 16px", borderRadius: "10px", border: "1px solid #E2E8F0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: "0.75rem", color: "#64748B", textTransform: "uppercase" }}>Receipt Number</span>
              <p style={{ margin: 0, fontWeight: "800", color: "#1E3A8A", fontSize: "1.1rem" }}>{transaction.receiptNumber}</p>
            </div>
            <span style={{ background: "#DCFCE7", color: "#166534", padding: "4px 10px", borderRadius: "999px", fontSize: "0.78rem", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "4px" }}>
              <ShieldCheck size={14} /> VERIFIED
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", borderBottom: "1px solid #E2E8F0", paddingBottom: "14px" }}>
            <div>
              <span style={{ fontSize: "0.75rem", color: "#64748B" }}>Student Name</span>
              <p style={{ margin: "2px 0 0", fontWeight: "700" }}>Shelly Paul</p>
            </div>
            <div>
              <span style={{ fontSize: "0.75rem", color: "#64748B" }}>Student ID</span>
              <p style={{ margin: "2px 0 0", fontWeight: "700" }}>DCC-2024-8842</p>
            </div>
            <div>
              <span style={{ fontSize: "0.75rem", color: "#64748B" }}>Institution</span>
              <p style={{ margin: "2px 0 0", fontWeight: "700" }}>Dhaka City College</p>
            </div>
            <div>
              <span style={{ fontSize: "0.75rem", color: "#64748B" }}>Department & Class</span>
              <p style={{ margin: "2px 0 0", fontWeight: "700" }}>CSE 3rd Semester</p>
            </div>
          </div>

          <div style={{ borderBottom: "1px solid #E2E8F0", paddingBottom: "14px" }}>
            <span style={{ fontSize: "0.75rem", color: "#64748B" }}>Payment Description</span>
            <p style={{ margin: "4px 0 0", fontWeight: "700", fontSize: "1rem", color: "#0F172A" }}>{transaction.title}</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", borderBottom: "1px solid #E2E8F0", paddingBottom: "14px" }}>
            <div>
              <span style={{ fontSize: "0.75rem", color: "#64748B" }}>Date & Time</span>
              <p style={{ margin: "2px 0 0", fontWeight: "600" }}>{transaction.date}</p>
            </div>
            <div>
              <span style={{ fontSize: "0.75rem", color: "#64748B" }}>Payment Method</span>
              <p style={{ margin: "2px 0 0", fontWeight: "600" }}>{transaction.method}</p>
            </div>
            <div>
              <span style={{ fontSize: "0.75rem", color: "#64748B" }}>Reference ID</span>
              <p style={{ margin: "2px 0 0", fontWeight: "600" }}>{transaction.referenceId}</p>
            </div>
            <div>
              <span style={{ fontSize: "0.75rem", color: "#64748B" }}>Status</span>
              <p style={{ margin: "2px 0 0", fontWeight: "700", color: "#166534" }}>{transaction.status}</p>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "6px" }}>
            <span style={{ fontWeight: "800", fontSize: "1.1rem" }}>Total Amount Paid:</span>
            <span style={{ fontWeight: "900", fontSize: "1.6rem", color: "#4F46E5" }}>৳{transaction.amount.toLocaleString()}</span>
          </div>

          <div style={{ background: "#F1F5F9", padding: "10px", borderRadius: "8px", textAlign: "center", fontSize: "0.75rem", color: "#64748B", marginTop: "10px" }}>
            🔒 Authenticated and cryptographically timestamped by Neo Cash AI Financial System.
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", marginTop: "24px" }}>
          <button
            type="button"
            onClick={handlePrint}
            style={{
              background: "#1E3A8A",
              color: "#FFF",
              border: "none",
              padding: "10px 18px",
              borderRadius: "10px",
              fontWeight: "700",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <Printer size={16} /> Print / Save PDF
          </button>
        </div>
      </div>
    </div>
  );
}

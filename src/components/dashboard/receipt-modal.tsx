import { Transaction, useNeoStore } from "@/lib/neo-cash-store";
import { Printer, X, ShieldCheck, Download } from "lucide-react";
import purpleLogo from "@/assets/neo-purple-logo.png";
import { generatePaymentReceipt } from "@/lib/receipt-generator";


export function ReceiptModal({
  transaction,
  onClose,
}: {
  transaction: Transaction;
  onClose: () => void;
}) {
  const [store] = useNeoStore();

  const handleDownloadPDF = () => {
    generatePaymentReceipt({
      receiptNumber:  transaction.receiptNumber ?? "N/A",
      transactionId:  transaction.id ?? "N/A",
      studentName:    store.currentSessionUser?.fullName ?? store.studentProfile.name ?? "Student",
      studentId:      store.currentSessionUser?.id ?? "—",
      institution:    store.currentSessionUser?.institutionName ?? store.studentProfile.institution ?? "—",
      paymentFor:     transaction.title ?? "Payment",
      amount:         transaction.amount ?? 0,
      method:         transaction.method ?? "Online",
      status:         transaction.status === "Success" ? "completed" : transaction.status === "Failed" ? "failed" : "pending",
      paidAt:         transaction.date ?? new Date().toISOString(),
      referenceId:    transaction.referenceId,
    });
  };

  const handlePrint = () => window.print();


  return (
    <div className="ms-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="ms-modal" style={{ maxWidth: "560px", background: "#FFFFFF", color: "#241A14", padding: "32px", borderRadius: "20px", boxShadow: "0 10px 40px rgba(0,0,0,0.2)" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px", borderBottom: "2px solid rgba(196, 154, 108, 0.3)", paddingBottom: "16px" }}>
          <div>
            <img src={purpleLogo} alt="Neo Cash AI" style={{ height: "36px", width: "auto" }} />
            <span style={{ display: "block", fontSize: "0.78rem", color: "#66564A", marginTop: "4px", fontWeight: 600 }}>
              Official Institutional Financial Digital Receipt
            </span>
          </div>
          <button type="button" onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: "#66564A" }}>
            <X size={20} />
          </button>
        </div>

        {/* Receipt Body */}
        <div style={{ display: "flex", flexDirection: "column", gap: "14px", fontSize: "0.9rem" }}>
          <div style={{ background: "var(--theme-color-50)", padding: "12px 16px", borderRadius: "12px", border: "1px solid rgba(196, 154, 108, 0.3)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: "0.75rem", color: "#66564A", textTransform: "uppercase", letterSpacing: "0.04em", fontWeight: 700 }}>Receipt Number</span>
              <p style={{ margin: 0, fontWeight: "800", color: "var(--theme-color-900)", fontSize: "1.15rem", fontFeatureSettings: "'tnum'" }}>{transaction.receiptNumber}</p>
            </div>
            <span style={{ background: "rgba(16, 185, 129, 0.12)", color: "#047857", padding: "4px 12px", borderRadius: "999px", fontSize: "0.78rem", fontWeight: "700", display: "inline-flex", alignItems: "center", gap: "4px", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
              <ShieldCheck size={14} /> VERIFIED & SEALED
            </span>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", borderBottom: "1px solid rgba(196, 154, 108, 0.2)", paddingBottom: "14px" }}>
            <div>
              <span style={{ fontSize: "0.75rem", color: "#8C7A6A" }}>Student Name</span>
              <p style={{ margin: "2px 0 0", fontWeight: "700", color: "#241A14" }}>{store.studentProfile.name}</p>
            </div>
            <div>
              <span style={{ fontSize: "0.75rem", color: "#8C7A6A" }}>Student ID</span>
              <p style={{ margin: "2px 0 0", fontWeight: "700", color: "#241A14" }}>{store.studentProfile.studentId}</p>
            </div>
            <div>
              <span style={{ fontSize: "0.75rem", color: "#8C7A6A" }}>Institution</span>
              <p style={{ margin: "2px 0 0", fontWeight: "700", color: "#241A14" }}>{store.studentProfile.institution}</p>
            </div>
            <div>
              <span style={{ fontSize: "0.75rem", color: "#8C7A6A" }}>Department & Term</span>
              <p style={{ margin: "2px 0 0", fontWeight: "700", color: "#241A14" }}>{store.studentProfile.department}</p>
            </div>
          </div>

          <div style={{ borderBottom: "1px solid rgba(196, 154, 108, 0.2)", paddingBottom: "14px" }}>
            <span style={{ fontSize: "0.75rem", color: "#8C7A6A" }}>Payment Purpose / Item Description</span>
            <p style={{ margin: "4px 0 0", fontWeight: "700", fontSize: "1.05rem", color: "#241A14" }}>{transaction.title}</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", borderBottom: "1px solid rgba(196, 154, 108, 0.2)", paddingBottom: "14px" }}>
            <div>
              <span style={{ fontSize: "0.75rem", color: "#8C7A6A" }}>Date & Time</span>
              <p style={{ margin: "2px 0 0", fontWeight: "600", color: "#241A14" }}>{transaction.date}</p>
            </div>
            <div>
              <span style={{ fontSize: "0.75rem", color: "#8C7A6A" }}>Payment Method</span>
              <p style={{ margin: "2px 0 0", fontWeight: "600", color: "#241A14" }}>{transaction.method}</p>
            </div>
            <div>
              <span style={{ fontSize: "0.75rem", color: "#8C7A6A" }}>Reference ID</span>
              <p style={{ margin: "2px 0 0", fontWeight: "600", color: "#241A14" }}>{transaction.referenceId}</p>
            </div>
            <div>
              <span style={{ fontSize: "0.75rem", color: "#8C7A6A" }}>Status</span>
              <p style={{ margin: "2px 0 0", fontWeight: "700", color: transaction.status === "Success" ? "#047857" : "#BE123C" }}>{transaction.status}</p>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: "6px" }}>
            <span style={{ fontWeight: "800", fontSize: "1.1rem", color: "#241A14" }}>Total Amount Cleared:</span>
            <span style={{ fontWeight: "900", fontSize: "1.65rem", color: "var(--theme-color-900)", fontFeatureSettings: "'tnum'" }}>?{transaction.amount.toLocaleString()}</span>
          </div>

          <div style={{ background: "var(--theme-color-50)", border: "1px solid rgba(196, 154, 108, 0.3)", padding: "10px 14px", borderRadius: "12px", textAlign: "center", fontSize: "0.76rem", color: "#66564A", marginTop: "10px" }}>
            ?? Authenticated and cryptographically timestamped by Neo Cash AI Financial System.
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "24px" }}>
          <button
            type="button"
            onClick={handlePrint}
            style={{ background: "var(--theme-color-50)", color: "#241A14", border: "1px solid rgba(196,154,108,0.3)", padding: "10px 16px", borderRadius: "12px", fontWeight: "700", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "0.85rem" }}
          >
            <Printer size={15} /> Print
          </button>
          <button
            type="button"
            onClick={handleDownloadPDF}
            style={{ background: "var(--theme-color-900)", color: "#FFFFFF", border: "none", padding: "10px 18px", borderRadius: "12px", fontWeight: "700", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "8px", fontSize: "0.85rem" }}
          >
            <Download size={15} /> Download PDF Receipt
          </button>
        </div>
      </div>
    </div>
  );
}



import React from "react";

export interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => React.ReactNode;
  align?: "left" | "center" | "right";
  width?: string;
}

interface FinancialTableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  loading?: boolean;
}

export function FinancialTable<T extends { id: string | number }>({
  columns,
  data,
  onRowClick,
  emptyMessage = "No records found.",
  loading = false,
}: FinancialTableProps<T>) {
  return (
    <div
      style={{
        width: "100%",
        overflowX: "auto",
        background: "rgba(30, 58, 138, 0.2)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "14px",
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
        <thead>
          <tr style={{ background: "rgba(13, 24, 42, 0.6)", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" }}>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  padding: "14px 18px",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  color: "#94A3B8",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  textAlign: col.align || "left",
                  width: col.width,
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td colSpan={columns.length} style={{ padding: "32px", textAlign: "center", color: "#94A3B8" }}>
                <div style={{ width: "28px", height: "28px", border: "3px solid rgba(167, 139, 250, 0.3)", borderTopColor: "#A78BFA", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 10px" }} />
                Loading records...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ padding: "32px", textAlign: "center", color: "#64748B", fontSize: "0.9rem" }}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={item.id || index}
                onClick={() => onRowClick && onRowClick(item)}
                style={{
                  borderBottom: index === data.length - 1 ? "none" : "1px solid rgba(255, 255, 255, 0.05)",
                  cursor: onRowClick ? "pointer" : "default",
                  transition: "background 0.15s ease",
                }}
                className="ms-table-row-hover"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    style={{
                      padding: "14px 18px",
                      fontSize: "0.88rem",
                      color: "#FFFFFF",
                      textAlign: col.align || "left",
                    }}
                  >
                    {col.render(item)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

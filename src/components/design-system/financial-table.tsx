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
        background: "#FFFFFF",
        border: "1px solid rgba(196, 154, 108, 0.3)",
        borderRadius: "10px",
        boxShadow: "0 2px 8px rgba(196, 154, 108, 0.06)",
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
        <thead>
          <tr style={{ background: "#FDF9F3", borderBottom: "1px solid rgba(196, 154, 108, 0.25)" }}>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  padding: "14px 18px",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  color: "#7A685A",
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
              <td colSpan={columns.length} style={{ padding: "32px", textAlign: "center", color: "#7A685A" }}>
                <div style={{ width: "28px", height: "28px", border: "3px solid rgba(211, 84, 0, 0.2)", borderTopColor: "#D35400", borderRadius: "50%", animation: "spin 1s linear infinite", margin: "0 auto 10px" }} />
                Loading institutional records...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ padding: "32px", textAlign: "center", color: "#8A7667", fontSize: "0.9rem" }}>
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr
                key={item.id || index}
                onClick={() => onRowClick && onRowClick(item)}
                style={{
                  borderBottom: index === data.length - 1 ? "none" : "1px solid rgba(196, 154, 108, 0.15)",
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
                      color: "#1C140E",
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

/**
 * Phase 5: Notion Workspace Sync Engine
 *
 * Provides bidirectional sync capabilities with Notion databases:
 * 1. Fee & Transaction Ledger Database (notion_fees_db)
 * 2. Hardship Applications Database (notion_apps_db)
 */
"use server";

import { createServerFn } from "@tanstack/react-start";

function getNotionHeaders() {
  const apiKey = process.env["NOTION_API_KEY"] || (import.meta.env as any)?.NOTION_API_KEY;
  if (!apiKey) {
    throw new Error("NOTION_API_KEY is not configured in environment variables.");
  }
  return {
    "Authorization": `Bearer ${apiKey}`,
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json",
  };
}

function getDatabaseIds() {
  const feesDbId = process.env["NOTION_FEES_DATABASE_ID"] || (import.meta.env as any)?.VITE_NOTION_FEES_DATABASE_ID || "3eec884a-2955-814d-8954-c5050189e6fc";
  const appsDbId = process.env["NOTION_APPLICATIONS_DATABASE_ID"] || (import.meta.env as any)?.VITE_NOTION_APPLICATIONS_DATABASE_ID || "3eec884a-2955-813c-9732-d67d952f619a";
  return { feesDbId, appsDbId };
}

export interface NotionConnectionStatus {
  ok: boolean;
  workspaceName?: string;
  feesDbTitle?: string;
  appsDbTitle?: string;
  feesDbId?: string;
  appsDbId?: string;
  error?: string;
}

export interface SyncFeeInput {
  title: string;
  amount: number;
  status: string;
  dueDate: string;
  category: string;
  studentName: string;
  studentId: string;
  department?: string;
  paymentMethod?: string;
  receiptNumber?: string;
}

export interface SyncAppInput {
  id: string;
  studentName: string;
  studentId: string;
  feeTitle: string;
  requestedAmount: number;
  aiMatchScore: number;
  status: string;
  guardianName: string;
  guardianPhone?: string;
  reason: string;
}

// ─── Test Connection ─────────────────────────────────────────────────────────

export const testNotionConnection = createServerFn({ method: "POST" })
  .handler(async (): Promise<NotionConnectionStatus> => {
    try {
      const headers = getNotionHeaders();
      const { feesDbId, appsDbId } = getDatabaseIds();

      // Check bot user
      const userRes = await fetch("https://api.notion.com/v1/users/me", { headers });
      if (!userRes.ok) {
        return { ok: false, error: "Invalid Notion API key or authentication failed." };
      }
      const userData = await userRes.json();
      const workspaceName = userData.bot?.workspace_name || "Shelly Paul's Space";

      // Check fees DB
      const feesRes = await fetch(`https://api.notion.com/v1/databases/${feesDbId}`, { headers });
      let feesDbTitle = "Fee & Transaction Ledger";
      if (feesRes.ok) {
        const feesData = await feesRes.json();
        feesDbTitle = feesData.title?.[0]?.plain_text || feesDbTitle;
      }

      // Check apps DB
      const appsRes = await fetch(`https://api.notion.com/v1/databases/${appsDbId}`, { headers });
      let appsDbTitle = "Hardship Applications";
      if (appsRes.ok) {
        const appsData = await appsRes.json();
        appsDbTitle = appsData.title?.[0]?.plain_text || appsDbTitle;
      }

      return {
        ok: true,
        workspaceName,
        feesDbTitle,
        appsDbTitle,
        feesDbId,
        appsDbId,
      };
    } catch (err: any) {
      return { ok: false, error: err.message || "Failed to reach Notion API." };
    }
  });

// ─── Sync Single Fee ─────────────────────────────────────────────────────────

export const syncFeeToNotion = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as SyncFeeInput)
  .handler(async ({ data }) => {
    try {
      const headers = getNotionHeaders();
      const { feesDbId } = getDatabaseIds();

      const statusMap: Record<string, string> = {
        paid: "Paid",
        due: "Due",
        overdue: "Overdue",
        partial_approved: "Partial Approved",
        pending_partial: "Pending Partial",
      };

      const notionStatus = statusMap[data.status.toLowerCase()] || "Due";

      const res = await fetch("https://api.notion.com/v1/pages", {
        method: "POST",
        headers,
        body: JSON.stringify({
          parent: { database_id: feesDbId },
          properties: {
            "Fee Title": {
              title: [{ text: { content: data.title } }],
            },
            "Student Name": {
              rich_text: [{ text: { content: data.studentName } }],
            },
            "Student ID": {
              rich_text: [{ text: { content: data.studentId } }],
            },
            "Department": {
              select: { name: data.department || "CSE" },
            },
            "Amount (৳)": {
              number: data.amount,
            },
            "Status": {
              select: { name: notionStatus },
            },
            ...(data.paymentMethod ? {
              "Payment Method": {
                select: { name: data.paymentMethod },
              },
            } : {}),
            ...(data.dueDate ? {
              "Due Date": {
                date: { start: data.dueDate },
              },
            } : {}),
            ...(data.receiptNumber ? {
              "Receipt / Ref ID": {
                rich_text: [{ text: { content: data.receiptNumber } }],
              },
            } : {}),
            "Category": {
              select: { name: data.category || "Tuition" },
            },
          },
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        return { ok: false, error: resData.message || "Failed to push fee to Notion" };
      }
      return { ok: true, pageId: resData.id };
    } catch (err: any) {
      return { ok: false, error: err.message };
    }
  });

// ─── Sync Single Hardship Application ────────────────────────────────────────

export const syncApplicationToNotion = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as SyncAppInput)
  .handler(async ({ data }) => {
    try {
      const headers = getNotionHeaders();
      const { appsDbId } = getDatabaseIds();

      const statusMap: Record<string, string> = {
        approved_head: "Approved Head",
        forwarded_head: "Forwarded Head",
        pending_admin: "Pending Admin",
        changes_requested: "Changes Requested",
        rejected: "Rejected",
      };

      const notionStatus = statusMap[data.status] || (data.aiMatchScore >= 90 ? "Auto Approved" : "Pending Admin");

      const res = await fetch("https://api.notion.com/v1/pages", {
        method: "POST",
        headers,
        body: JSON.stringify({
          parent: { database_id: appsDbId },
          properties: {
            "Application ID": {
              title: [{ text: { content: data.id } }],
            },
            "Student Name": {
              rich_text: [{ text: { content: data.studentName } }],
            },
            "Student ID": {
              rich_text: [{ text: { content: data.studentId } }],
            },
            "Fee Title": {
              rich_text: [{ text: { content: data.feeTitle } }],
            },
            "Requested Amount (৳)": {
              number: data.requestedAmount,
            },
            "AI Signature Match": {
              number: data.aiMatchScore,
            },
            "Approval Status": {
              select: { name: notionStatus },
            },
            "Guardian Name": {
              rich_text: [{ text: { content: data.guardianName } }],
            },
            ...(data.guardianPhone ? {
              "Guardian Phone": {
                phone_number: data.guardianPhone,
              },
            } : {}),
            "Reason": {
              rich_text: [{ text: { content: data.reason.slice(0, 2000) } }],
            },
          },
        }),
      });

      const resData = await res.json();
      if (!res.ok) {
        return { ok: false, error: resData.message || "Failed to push application to Notion" };
      }
      return { ok: true, pageId: resData.id };
    } catch (err: any) {
      return { ok: false, error: err.message };
    }
  });

// ─── Bulk Sync Full Store to Notion ──────────────────────────────────────────

export const bulkSyncToNotion = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as {
    fees: Array<SyncFeeInput>;
    applications: Array<SyncAppInput>;
  })
  .handler(async ({ data }) => {
    try {
      let feesSynced = 0;
      let appsSynced = 0;
      const errors: string[] = [];

      for (const fee of data.fees) {
        const res = await syncFeeToNotion({ data: fee });
        if (res.ok) feesSynced++;
        else if (res.error) errors.push(`Fee "${fee.title}": ${res.error}`);
      }

      for (const app of data.applications) {
        const res = await syncApplicationToNotion({ data: app });
        if (res.ok) appsSynced++;
        else if (res.error) errors.push(`App "${app.id}": ${res.error}`);
      }

      return {
        ok: feesSynced > 0 || appsSynced > 0 || errors.length === 0,
        feesSynced,
        appsSynced,
        total: feesSynced + appsSynced,
        errors,
      };
    } catch (err: any) {
      return { ok: false, error: err.message };
    }
  });

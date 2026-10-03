/**
 * Notion Integration Functions — Neo Cash AI
 *
 * Implements real-time sync with Notion Database using Notion's official REST API v1.
 * Supports:
 *   1. Connection testing & database inspection
 *   2. Transaction / Ledger export & syncing
 *   3. Audit logs & compliance record export
 */

import { createServerFn } from "@tanstack/react-start";

export interface NotionConnectionInput {
  apiKey?: string;
  databaseId?: string;
}

export interface NotionConnectionResult {
  ok: boolean;
  databaseTitle?: string;
  databaseId?: string;
  workspaceName?: string;
  properties?: string[];
  error?: string;
}

export interface NotionSyncItem {
  id: string;
  title: string;
  amount: number;
  type: string;
  status: string;
  method: string;
  date: string;
  referenceId?: string;
  receiptNumber?: string;
  studentName?: string;
  studentId?: string;
}

export interface NotionSyncInput {
  apiKey?: string;
  databaseId?: string;
  items: NotionSyncItem[];
}

export interface NotionSyncResult {
  ok: boolean;
  syncedCount: number;
  failedCount: number;
  results: Array<{ id: string; success: boolean; notionPageId?: string; error?: string }>;
  error?: string;
}

const NOTION_API_VERSION = "2022-06-28";
const NOTION_BASE_URL = "https://api.notion.com/v1";

function resolveCredentials(inputKey?: string, inputDbId?: string) {
  const apiKey =
    inputKey?.trim() ||
    process.env["NOTION_API_KEY"] ||
    process.env["VITE_NOTION_API_KEY"] ||
    "";
  
  let databaseId =
    inputDbId?.trim() ||
    process.env["NOTION_DATABASE_ID"] ||
    process.env["VITE_NOTION_DATABASE_ID"] ||
    "";

  // Clean database ID (strip URL prefix if pasted as full link)
  if (databaseId.includes("/")) {
    const parts = databaseId.split("/");
    const lastPart = parts[parts.length - 1]?.split("?")[0] || "";
    databaseId = lastPart.replace(/-/g, "");
  }

  return { apiKey, databaseId };
}

// ─── 1. Test Notion Connection ────────────────────────────────────────────────

export const testNotionConnection = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as NotionConnectionInput)
  .handler(async ({ data }): Promise<NotionConnectionResult> => {
    const { apiKey, databaseId } = resolveCredentials(data.apiKey, data.databaseId);

    if (!apiKey) {
      return { ok: false, error: "Notion API Key (Internal Integration Token) is missing." };
    }
    if (!databaseId) {
      return { ok: false, error: "Notion Database ID is missing." };
    }

    try {
      const response = await fetch(`${NOTION_BASE_URL}/databases/${databaseId}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Notion-Version": NOTION_API_VERSION,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        const msg = (errJson as { message?: string })?.message || `HTTP ${response.status}: ${response.statusText}`;
        return {
          ok: false,
          error: `Notion Error: ${msg}. Make sure your integration has access to the database (Click '...' -> 'Add connections' in Notion).`,
        };
      }

      const db = await response.json() as {
        title?: Array<{ plain_text?: string }>;
        properties?: Record<string, unknown>;
      };

      const title = db.title?.[0]?.plain_text || "Neo Cash Ledger Database";
      const properties = Object.keys(db.properties || {});

      return {
        ok: true,
        databaseTitle: title,
        databaseId,
        properties,
      };
    } catch (e) {
      return {
        ok: false,
        error: e instanceof Error ? e.message : "Failed to connect to Notion API.",
      };
    }
  });

// ─── 2. Sync Transactions / Ledger to Notion ──────────────────────────────────

export const syncTransactionsToNotion = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as NotionSyncInput)
  .handler(async ({ data }): Promise<NotionSyncResult> => {
    const { apiKey, databaseId } = resolveCredentials(data.apiKey, data.databaseId);

    if (!apiKey || !databaseId) {
      return {
        ok: false,
        syncedCount: 0,
        failedCount: data.items.length,
        results: [],
        error: "Notion credentials (API Key & Database ID) are required.",
      };
    }

    const results: NotionSyncResult["results"] = [];
    let synced = 0;
    let failed = 0;

    for (const item of data.items) {
      try {
        const payload = {
          parent: { database_id: databaseId },
          properties: {
            "Transaction ID": {
              title: [
                {
                  text: { content: `${item.id}: ${item.title}` },
                },
              ],
            },
            "Amount (BDT)": {
              number: Number(item.amount) || 0,
            },
            "Type": {
              select: {
                name: item.type === "fee" ? "Fee Payment" : item.type === "wallet" ? "Wallet Top-Up" : item.type === "refund" ? "Refund" : "Donation",
              },
            },
            "Status": {
              select: {
                name: item.status || "Success",
              },
            },
            "Payment Method": {
              rich_text: [
                {
                  text: { content: item.method || "Digital Gateway" },
                },
              ],
            },
            "Student": {
              rich_text: [
                {
                  text: { content: `${item.studentName || "Student"} (${item.studentId || "ID"})` },
                },
              ],
            },
            "Reference": {
              rich_text: [
                {
                  text: { content: item.receiptNumber || item.referenceId || "N/A" },
                },
              ],
            },
            "Date": {
              rich_text: [
                {
                  text: { content: item.date || new Date().toISOString() },
                },
              ],
            },
          },
        };

        const res = await fetch(`${NOTION_BASE_URL}/pages`, {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${apiKey}`,
            "Notion-Version": NOTION_API_VERSION,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const resJson = await res.json() as { id?: string };
          results.push({
            id: item.id,
            success: true,
            ...(resJson.id ? { notionPageId: resJson.id } : {}),
          });
          synced++;
        } else {
          const errJson = await res.json().catch(() => ({}));
          const errMsg = (errJson as { message?: string })?.message || `HTTP ${res.status}`;
          results.push({ id: item.id, success: false, error: errMsg });
          failed++;
        }
      } catch (err) {
        results.push({
          id: item.id,
          success: false,
          error: err instanceof Error ? err.message : "Network error",
        });
        failed++;
      }
    }

    return {
      ok: synced > 0,
      syncedCount: synced,
      failedCount: failed,
      results,
    };
  });

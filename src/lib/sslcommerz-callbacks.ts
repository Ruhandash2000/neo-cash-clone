/**
 * SSLCommerz IPN Handler — POST /api/payment/ipn
 *
 * Uses TanStack Start's createServerFn with typed validator.
 * SSLCommerz POSTs form data to this endpoint. The route handler
 * extracts the body and passes it as a plain object to the server fn.
 *
 * Wire this into app.config.ts nitro.handlers if using SSR mode,
 * or register in the TanStack Start server plugin.
 *
 * For now: accessible as a POST-able server fn at /api/payment/ipn
 */
import { createServerFn } from "@tanstack/react-start";
import { handleIPNValidation } from "@/lib/sslcommerz.functions";

export const ipnHandler = createServerFn({ method: "POST" })
  .validator((data: unknown) => {
    // SSLCommerz sends form-urlencoded; TanStack Start deserializes it as an object
    return data as Record<string, string>;
  })
  .handler(async ({ data }) => {
    const result = await handleIPNValidation(data);
    // SSLCommerz expects a 200 text response
    return { settled: result.settled, error: result.error };
  });

export const successHandler = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as Record<string, string>)
  .handler(async ({ data }) => {
    await handleIPNValidation(data).catch(() => null);
    return {
      redirectTo: `/dashboard?payment=success&tran_id=${data["tran_id"] ?? ""}&purpose=${data["value_c"] ?? "wallet_topup"}`,
    };
  });

export const failHandler = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as Record<string, string>)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabaseAdmin as any;
    const tran_id = data["tran_id"] ?? "";
    if (tran_id) {
      await db
        .from("sslcommerz_sessions")
        .update({ status: "failed", ipn_raw: data, ipn_received_at: new Date().toISOString() })
        .eq("tran_id", tran_id)
        .catch(() => null);
    }
    return { redirectTo: `/dashboard?payment=failed&tran_id=${tran_id}` };
  });

export const cancelHandler = createServerFn({ method: "POST" })
  .validator((data: unknown) => data as Record<string, string>)
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabaseAdmin as any;
    const tran_id = data["tran_id"] ?? "";
    if (tran_id) {
      await db
        .from("sslcommerz_sessions")
        .update({ status: "cancelled", ipn_raw: data, ipn_received_at: new Date().toISOString() })
        .eq("tran_id", tran_id)
        .catch(() => null);
    }
    return { redirectTo: `/dashboard?payment=cancelled&tran_id=${tran_id}` };
  });

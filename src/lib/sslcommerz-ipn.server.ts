/**
 * Neo Cash AI — SSLCommerz IPN / Server-Only Functions
 *
 * This file is SERVER-ONLY. It must never be imported by client-side modules.
 * Only import from API route handlers (src/routes/api/**).
 *
 * Contains:
 *   - handleIPNValidation: Validates IPN payloads from SSLCommerz and settles transactions in DB
 */

import type { PaymentPurpose } from "./sslcommerz.functions";

const SSLCZ_VALIDATE_URL = "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php";

function getSslczConfig() {
  return {
    store_id:   process.env["SSLCOMMERZ_STORE_ID"]   ?? "testbox",
    store_pass: process.env["SSLCOMMERZ_STORE_PASS"] ?? "qwerty",
  };
}

/**
 * Validates the IPN payload against SSLCommerz's validation API,
 * then settles the transaction in the database.
 * This runs as service_role (no user session).
 *
 * MUST be called only from server-side API route handlers.
 */
export async function handleIPNValidation(
  body: Record<string, string>
): Promise<{ settled: boolean; error?: string }> {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const db = supabaseAdmin as any;
  const cfg = getSslczConfig();

  const { val_id, tran_id, status: ipnStatus } = body;

  if (!val_id || !tran_id) {
    return { settled: false, error: "Missing val_id or tran_id in IPN" };
  }

  // Only process VALID status from SSLCommerz
  if (ipnStatus !== "VALID" && ipnStatus !== "VALIDATED") {
    await db
      .from("sslcommerz_sessions")
      .update({
        status: ipnStatus === "CANCELLED" ? "cancelled" : "failed",
        ipn_received_at: new Date().toISOString(),
        ipn_raw: body,
      })
      .eq("tran_id", tran_id);
    return { settled: false, error: `IPN status: ${ipnStatus}` };
  }

  // Double-check with SSLCommerz validation API
  const validateUrl = new URL(SSLCZ_VALIDATE_URL);
  validateUrl.searchParams.set("val_id",     val_id);
  validateUrl.searchParams.set("store_id",   cfg.store_id);
  validateUrl.searchParams.set("store_pass", cfg.store_pass);
  validateUrl.searchParams.set("format",     "json");

  const validateRes = await fetch(validateUrl.toString());
  const validated = await validateRes.json() as {
    status: string;
    store_amount: string;
    card_type: string;
    value_a: string;  // user_id
    value_b: string;  // institution_id
    value_c: string;  // purpose
    value_d: string;  // fee_id
    tran_id: string;
  };

  if (validated.status !== "VALID" && validated.status !== "VALIDATED") {
    await db
      .from("sslcommerz_sessions")
      .update({ status: "failed", ipn_received_at: new Date().toISOString(), ipn_raw: body })
      .eq("tran_id", tran_id);
    return { settled: false, error: "Validation failed at SSLCommerz" };
  }

  // Retrieve our session record
  const { data: session } = await db
    .from("sslcommerz_sessions")
    .select("*")
    .eq("tran_id", tran_id)
    .single();

  if (!session) {
    return { settled: false, error: "Session not found in DB" };
  }
  if (session.status === "validated") {
    return { settled: true }; // already processed — idempotent
  }

  const userId        = session.user_id        as string;
  const institutionId = session.institution_id as string;
  const amount        = session.amount         as number;
  const purpose       = session.purpose        as PaymentPurpose;
  const feeId         = session.fee_id         as string | null;
  const storeAmount   = parseFloat(validated.store_amount);
  const cardType      = validated.card_type;

  let txnId: string | null = null;

  if (purpose === "wallet_topup") {
    const { data } = await db.rpc("credit_wallet_after_payment", {
      p_user_id:        userId,
      p_institution_id: institutionId,
      p_amount:         storeAmount || amount,
      p_tran_id:        tran_id,
      p_val_id:         val_id,
      p_card_type:      cardType,
    });
    txnId = data;
  } else if (purpose === "fee_payment" && feeId) {
    const { data } = await db.rpc("pay_fee_from_gateway", {
      p_user_id:        userId,
      p_fee_id:         feeId,
      p_institution_id: institutionId,
      p_amount:         storeAmount || amount,
      p_tran_id:        tran_id,
      p_val_id:         val_id,
      p_card_type:      cardType,
    });
    txnId = data;
  }

  // Mark session as validated
  await db
    .from("sslcommerz_sessions")
    .update({
      status:          "validated",
      val_id,
      bank_tran_id:    body["bank_tran_id"] ?? null,
      card_type:       cardType,
      store_amount:    storeAmount,
      ipn_received_at: new Date().toISOString(),
      ipn_raw:         body,
      transaction_id:  txnId,
    })
    .eq("tran_id", tran_id);

  // Push notification to user
  await db.from("notifications").insert({
    user_id:        userId,
    institution_id: institutionId,
    title:          purpose === "wallet_topup" ? "Wallet Topped Up" : "Fee Payment Confirmed",
    message:        purpose === "wallet_topup"
      ? `৳${amount.toLocaleString()} added to your Neo Cash wallet via ${cardType}.`
      : `Your fee payment of ৳${amount.toLocaleString()} was successful (Ref: ${tran_id}).`,
    type:         "payment",
    is_read:      false,
    event_type:   "payment_success",
    category:     "payment",
  });

  return { settled: true };
}

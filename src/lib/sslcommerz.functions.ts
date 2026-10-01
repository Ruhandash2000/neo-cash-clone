/**
 * Neo Cash AI — Phase 3: SSLCommerz Payment Gateway Integration
 *
 * Server-side functions for:
 *   A. Initiating a payment session (wallet top-up or fee payment)
 *   B. IPN (Instant Payment Notification) handler — validates & settles
 *   C. Refund initiation
 *
 * Uses SSLCommerz Sandbox (https://sandbox.sslcommerz.com).
 * Switch SSLCOMMERZ_STORE_ID / SSLCOMMERZ_STORE_PASS / BASE_URL
 * to production values before going live.
 *
 * API Reference: https://developer.sslcommerz.com/doc/v4/
 */

import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// ─── Config ──────────────────────────────────────────────────────────────────
const SSLCZ_SANDBOX_URL = "https://sandbox.sslcommerz.com/gwprocess/v4/api.php";
const SSLCZ_VALIDATE_URL = "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php";
const SSLCZ_REFUND_URL = "https://sandbox.sslcommerz.com/validator/api/merchantTransIDvalidationAPI.php";

function getSslczConfig() {
  return {
    store_id:   process.env["SSLCOMMERZ_STORE_ID"]   ?? "testbox",
    store_pass: process.env["SSLCOMMERZ_STORE_PASS"] ?? "qwerty",
    base_url:   process.env["PUBLIC_APP_URL"]        ?? "http://localhost:3000",
    sandbox:    (process.env["SSLCOMMERZ_SANDBOX"] ?? "true") === "true",
  };
}

// Unique 8-char transaction ID for SSLCommerz
function makeTranId(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
}

// ─── Types ────────────────────────────────────────────────────────────────────
export type PaymentPurpose = "wallet_topup" | "fee_payment";

export interface InitiatePaymentInput {
  purpose:       PaymentPurpose;
  amount:        number;                // BDT, e.g. 500
  institutionId: string;
  feeId?:        string;               // required when purpose === 'fee_payment'
  feeTitle?:     string;
}

export interface InitiatePaymentResult {
  ok:          true;
  gatewayUrl:  string;                 // redirect the browser here
  tranId:      string;
}

// ─────────────────────────────────────────────────────────────────────────────
// A. INITIATE PAYMENT
// ─────────────────────────────────────────────────────────────────────────────
export const initiatePayment = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => {
    const d = data as InitiatePaymentInput;
    if (!d?.purpose)  throw new Error("purpose is required");
    if (!d?.amount || d.amount <= 0) throw new Error("Invalid payment amount");
    if (!d?.institutionId) throw new Error("institutionId is required");
    if (d.purpose === "fee_payment" && !d.feeId) throw new Error("feeId required for fee_payment");
    return d;
  })
  .handler(async ({ context, data }): Promise<InitiatePaymentResult> => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabaseAdmin as any;
    const cfg = getSslczConfig();

    // Get user profile for customer fields
    const { data: profile } = await db
      .from("profiles")
      .select("full_name, email, phone")
      .eq("id", context.userId)
      .single();

    const tranId = makeTranId(data.purpose === "wallet_topup" ? "WLT" : "FEE");

    // Store session in DB before calling SSLCommerz
    await db.from("sslcommerz_sessions").insert({
      tran_id:        tranId,
      user_id:        context.userId,
      institution_id: data.institutionId,
      purpose:        data.purpose,
      fee_id:         data.feeId ?? null,
      amount:         data.amount,
      status:         "initiated",
    });

    // Build SSLCommerz POST body
    const params = new URLSearchParams({
      store_id:          cfg.store_id,
      store_passwd:      cfg.store_pass,
      total_amount:      data.amount.toFixed(2),
      currency:          "BDT",
      tran_id:           tranId,
      // Callback URLs — route handlers created below
      success_url:       `${cfg.base_url}/api/payment/success`,
      fail_url:          `${cfg.base_url}/api/payment/fail`,
      cancel_url:        `${cfg.base_url}/api/payment/cancel`,
      ipn_url:           `${cfg.base_url}/api/payment/ipn`,
      // Customer info
      cus_name:          profile?.full_name  ?? "Student",
      cus_email:         profile?.email      ?? "student@neo.cash",
      cus_phone:         profile?.phone      ?? "01700000000",
      cus_add1:          "Dhaka, Bangladesh",
      cus_city:          "Dhaka",
      cus_country:       "Bangladesh",
      // Shipment (required by SSLCommerz even for digital goods)
      shipping_method:   "NO",
      ship_name:         profile?.full_name ?? "Student",
      ship_add1:         "Dhaka",
      ship_city:         "Dhaka",
      ship_country:      "Bangladesh",
      // Product
      product_name:      data.purpose === "wallet_topup"
        ? "Neo Cash Wallet Top-Up"
        : (data.feeTitle ?? "College Fee Payment"),
      product_category:  "EdTech",
      product_profile:   "non-physical-goods",
      // Metadata for IPN reconciliation
      value_a:           context.userId,
      value_b:           data.institutionId,
      value_c:           data.purpose,
      value_d:           data.feeId ?? "",
    });

    const response = await fetch(SSLCZ_SANDBOX_URL, {
      method: "POST",
      body:   params,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    if (!response.ok) {
      throw new Error(`SSLCommerz init failed: ${response.statusText}`);
    }

    const result = await response.json() as {
      status: string;
      sessionkey: string;
      GatewayPageURL: string;
      failedreason?: string;
    };

    if (result.status !== "SUCCESS") {
      throw new Error(`Payment gateway error: ${result.failedreason ?? "Unknown error"}`);
    }

    // Store session key
    await db
      .from("sslcommerz_sessions")
      .update({ session_key: result.sessionkey })
      .eq("tran_id", tranId);

    return {
      ok:         true,
      gatewayUrl: result.GatewayPageURL,
      tranId,
    };
  });

// ─────────────────────────────────────────────────────────────────────────────
// B. IPN VALIDATION (called by SSLCommerz server POST)
// ─────────────────────────────────────────────────────────────────────────────
/**
 * Validates the IPN payload against SSLCommerz's validation API,
 * then settles the transaction in the database.
 * This runs as service_role (no user session).
 */
export async function handleIPNValidation(body: Record<string, string>): Promise<{ settled: boolean; error?: string }> {
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
    // Record failed/cancelled status
    await db
      .from("sslcommerz_sessions")
      .update({ status: ipnStatus === "CANCELLED" ? "cancelled" : "failed", ipn_received_at: new Date().toISOString(), ipn_raw: body })
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
    user_id:      userId,
    institution_id: institutionId,
    title:        purpose === "wallet_topup" ? "Wallet Topped Up" : "Fee Payment Confirmed",
    message:      purpose === "wallet_topup"
      ? `৳${amount.toLocaleString()} added to your Neo Cash wallet via ${cardType}.`
      : `Your fee payment of ৳${amount.toLocaleString()} was successful (Ref: ${tran_id}).`,
    type:         "payment",
    is_read:      false,
    event_type:   "payment_success",
    category:     "payment",
  });

  return { settled: true };
}

// ─────────────────────────────────────────────────────────────────────────────
// C. REFUND
// ─────────────────────────────────────────────────────────────────────────────
export const initiateRefund = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((data: unknown) => {
    const d = data as { tranId: string; refundAmount?: number; reason?: string };
    if (!d?.tranId) throw new Error("tranId is required");
    return d;
  })
  .handler(async ({ context, data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = supabaseAdmin as any;
    const cfg = getSslczConfig();

    // Verify ownership and status
    const { data: session } = await db
      .from("sslcommerz_sessions")
      .select("*")
      .eq("tran_id", data.tranId)
      .eq("user_id", context.userId)
      .single();

    if (!session) throw new Error("Transaction not found or access denied.");
    if (session.status !== "validated") throw new Error("Only validated transactions can be refunded.");
    if (session.refund_ref_id) throw new Error("Refund already initiated for this transaction.");

    const refundAmount = data.refundAmount ?? session.amount;

    // SSLCommerz refund API
    const refundUrl = new URL(SSLCZ_REFUND_URL);
    refundUrl.searchParams.set("bank_tran_id",   session.bank_tran_id);
    refundUrl.searchParams.set("store_id",        cfg.store_id);
    refundUrl.searchParams.set("store_passwd",    cfg.store_pass);
    refundUrl.searchParams.set("refund_amount",   refundAmount.toFixed(2));
    refundUrl.searchParams.set("refund_remarks",  data.reason ?? "Student requested refund");
    refundUrl.searchParams.set("format",          "json");

    const res = await fetch(refundUrl.toString());
    const refundResult = await res.json() as {
      APIConnect:     string;
      bank_tran_id:   string;
      trans_id:       string;
      initiated_on:   string;
      refund_ref_id?: string;
      errorReason?:   string;
    };

    if (refundResult.APIConnect !== "DONE") {
      throw new Error(`Refund failed: ${refundResult.errorReason ?? "Unknown error"}`);
    }

    // Mark session refunded
    await db
      .from("sslcommerz_sessions")
      .update({
        status:          "refunded",
        refund_ref_id:   refundResult.refund_ref_id ?? refundResult.trans_id,
        refunded_amount: refundAmount,
        refunded_at:     new Date().toISOString(),
      })
      .eq("tran_id", data.tranId);

    // Record a negative transaction
    await db.from("transactions").insert({
      user_id:        context.userId,
      institution_id: session.institution_id,
      amount:         -refundAmount,
      type:           "refund",
      reference_id:   refundResult.refund_ref_id,
      receipt_number: data.tranId,
      payment_method: session.card_type,
      gateway_session: data.tranId,
    });

    // Notify user
    await db.from("notifications").insert({
      user_id:       context.userId,
      institution_id: session.institution_id,
      title:         "Refund Initiated",
      message:       `৳${refundAmount.toLocaleString()} refund has been initiated. It will appear in 3–7 business days.`,
      type:          "payment",
      is_read:       false,
      event_type:    "payment_refunded",
      category:      "payment",
    });

    return { ok: true, refundRefId: refundResult.refund_ref_id };
  });

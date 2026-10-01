/**
 * SSLCommerz Payment Success Callback — /api/payment/success
 */
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/payment/success")({
  component: () => null,
  // SSLCommerz will POST to this URL; the server handles it via the server function
  // The route just needs to exist so TanStack registers the path.
  // Actual redirect logic is handled by middleware in server.ts or via a server function.
  ssr: false,
  head: () => ({
    meta: [{ name: "robots", content: "noindex" }],
  }),
  loader: async ({ location }) => {
    // When SSLCommerz redirects back (GET), forward to dashboard
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tranId  = params.get("tran_id") ?? "";
      const purpose = params.get("value_c") ?? "fee_payment";
      window.location.replace(`/dashboard?payment=success&tran_id=${tranId}&purpose=${purpose}`);
    }
    return null;
  },
});

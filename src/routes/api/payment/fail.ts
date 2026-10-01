import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/payment/fail")({
  component: () => null,
  ssr: false,
  loader: async () => {
    if (typeof window !== "undefined") {
      window.location.replace("/dashboard?payment=failed");
    }
    return null;
  },
});

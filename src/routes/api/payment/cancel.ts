import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/payment/cancel")({
  component: () => null,
  ssr: false,
  loader: async () => {
    if (typeof window !== "undefined") {
      window.location.replace("/dashboard?payment=cancelled");
    }
    return null;
  },
});

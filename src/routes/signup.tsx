import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { LoginModal } from "@/components/auth/login-modal";
import { HomeSections } from "@/components/home-sections";

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [
      { title: "Create your Neo Cashless account" },
      {
        name: "description",
        content:
          "Register with your e-mail to use Neo Cashless — AI-powered, paperless institutional finance.",
      },
      { property: "og:title", content: "Create your Neo Cashless account" },
      {
        property: "og:description",
        content: "Register in seconds and secure your account with device biometrics.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SignUpPage,
});

function SignUpPage() {
  const navigate = useNavigate();

  return (
    <div className="neo-page">
      <HomeSections />
      <LoginModal
        open={true}
        initialView="signup"
        onClose={() => void navigate({ to: "/" })}
      />
    </div>
  );
}

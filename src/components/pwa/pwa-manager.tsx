/**
 * Phase 7: PWA Install Prompt
 *
 * Shows a premium "Add to Home Screen" banner when:
 * - The app is running in browser (not already installed)
 * - The browser fires the `beforeinstallprompt` event (Chrome/Edge/Android)
 * - The user hasn't dismissed it in the last 7 days
 *
 * Also registers the service worker.
 */

import { useState, useEffect } from "react";
import { Download, X, Smartphone, Wifi } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAManager() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner]       = useState(false);
  const [isOffline, setIsOffline]         = useState(!navigator.onLine);
  const [swReady, setSwReady]             = useState(false);

  // ── Register Service Worker ────────────────────────────────────────────────
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((reg) => {
          setSwReady(true);
          console.info("[Neo Cashless] Service Worker registered:", reg.scope);
        })
        .catch((err) => {
          console.warn("[Neo Cashless] SW registration failed:", err);
        });
    }
  }, []);

  // ── Capture install prompt ─────────────────────────────────────────────────
  useEffect(() => {
    const dismissed = localStorage.getItem("pwa-install-dismissed");
    const tooSoon   = dismissed && Date.now() - Number(dismissed) < 7 * 24 * 60 * 60 * 1000;

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
      if (!tooSoon) setShowBanner(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  // ── Online / Offline ───────────────────────────────────────────────────────
  useEffect(() => {
    const goOnline  = () => setIsOffline(false);
    const goOffline = () => setIsOffline(true);
    window.addEventListener("online",  goOnline);
    window.addEventListener("offline", goOffline);
    return () => {
      window.removeEventListener("online",  goOnline);
      window.removeEventListener("offline", goOffline);
    };
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === "accepted") {
      setShowBanner(false);
      setInstallPrompt(null);
    }
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem("pwa-install-dismissed", String(Date.now()));
  };

  return (
    <>
      {/* Offline Toast */}
      {isOffline && (
        <div style={{
          position: "fixed", bottom: "20px", left: "50%", transform: "translateX(-50%)",
          zIndex: 99999, background: "#241A14", color: "#fff",
          padding: "10px 18px", borderRadius: "12px",
          display: "flex", alignItems: "center", gap: "8px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
          fontSize: "0.82rem", fontWeight: 700,
          border: "1px solid rgba(196,154,108,0.3)",
          animation: "slideUp 0.3s ease",
        }}>
          <Wifi size={15} style={{ color: "#D97706" }} />
          You're offline — cached data shown
        </div>
      )}

      {/* Install Banner */}
      {showBanner && !isOffline && (
        <div style={{
          position: "fixed", bottom: "20px", left: "50%", transform: "translateX(-50%)",
          zIndex: 99998, width: "min(400px, calc(100vw - 32px))",
          background: "linear-gradient(135deg, #241A14, #3D2A1E)",
          borderRadius: "18px", padding: "18px 20px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(211,84,0,0.3)",
          display: "flex", alignItems: "flex-start", gap: "14px",
          animation: "slideUp 0.35s cubic-bezier(.34,1.56,.64,1)",
        }}>
          {/* App Icon */}
          <img
            src="/icon-192.jpg"
            alt="Neo Cashless"
            style={{ width: 52, height: 52, borderRadius: "14px", flexShrink: 0 }}
          />

          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: "0.9rem", fontWeight: 900, color: "#FFFFFF" }}>
              Install Neo Cashless
            </p>
            <p style={{ margin: "4px 0 12px", fontSize: "0.76rem", color: "rgba(196,154,108,0.9)" }}>
              Add to your home screen for faster access, offline support, and push notifications.
            </p>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                onClick={() => void handleInstall()}
                style={{
                  flex: 1, padding: "9px 14px", borderRadius: "10px",
                  background: "#D35400", color: "#fff", border: "none",
                  fontWeight: 800, fontSize: "0.8rem", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "6px",
                }}
              >
                <Download size={14} /> Install App
              </button>
              <button
                type="button"
                onClick={handleDismiss}
                style={{
                  padding: "9px 12px", borderRadius: "10px",
                  background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  fontWeight: 700, fontSize: "0.8rem", cursor: "pointer",
                }}
              >
                Not now
              </button>
            </div>
          </div>

          {/* Dismiss X */}
          <button
            type="button"
            onClick={handleDismiss}
            style={{
              width: 26, height: 26, borderRadius: "8px",
              background: "rgba(255,255,255,0.08)", border: "none",
              cursor: "pointer", display: "flex", alignItems: "center",
              justifyContent: "center", flexShrink: 0,
            }}
          >
            <X size={13} style={{ color: "rgba(255,255,255,0.5)" }} />
          </button>
        </div>
      )}

      {/* iOS install hint (Safari doesn't support beforeinstallprompt) */}
      {!swReady && !showBanner && /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.matchMedia("(display-mode: standalone)").matches && (
        <div style={{
          position: "fixed", bottom: "20px", left: "50%", transform: "translateX(-50%)",
          zIndex: 99997, width: "min(360px, calc(100vw - 32px))",
          background: "#241A14", borderRadius: "16px", padding: "14px 16px",
          boxShadow: "0 16px 48px rgba(0,0,0,0.4)",
          border: "1px solid rgba(211,84,0,0.25)",
          fontSize: "0.78rem", color: "rgba(196,154,108,0.9)",
          display: "flex", alignItems: "center", gap: "10px",
          animation: "slideUp 0.3s ease",
        }}>
          <Smartphone size={20} style={{ color: "#D35400", flexShrink: 0 }} />
          <span>
            Tap <strong style={{ color: "#D35400" }}>Share ↑</strong> then{" "}
            <strong style={{ color: "#D35400" }}>Add to Home Screen</strong> to install Neo Cashless.
          </span>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateX(-50%) translateY(20px); opacity: 0; }
          to   { transform: translateX(-50%) translateY(0);    opacity: 1; }
        }
      `}</style>
    </>
  );
}

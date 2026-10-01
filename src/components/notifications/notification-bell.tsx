/**
 * Phase 6: Real-Time Notification Bell
 *
 * Displays a bell icon with unread count badge.
 * Opens a dropdown showing all notifications.
 * Updates in real-time via Supabase Realtime.
 *
 * Features:
 * - Live unread count badge
 * - Mark single / all as read
 * - Click to navigate to related entity
 * - Categorised with icons and colours
 */

import { useState, useEffect, useRef } from "react";
import { Bell, Check, CheckCheck, X, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Notification {
  id:          string;
  type:        string;
  title:       string;
  body:        string;
  icon:        string;
  action_url:  string | null;
  entity_type: string | null;
  entity_id:   string | null;
  is_read:     boolean;
  created_at:  string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function notifColor(type: string): string {
  if (type.includes("success") || type.includes("approved") || type.includes("topup") || type.includes("verified"))
    return "#047857";
  if (type.includes("failed") || type.includes("rejected"))
    return "#DC2626";
  if (type.includes("due") || type.includes("pending") || type.includes("review"))
    return "#D97706";
  return "#D35400";
}

// ─── Component ───────────────────────────────────────────────────────────────

interface Props {
  userId: string;
}

export function NotificationBell({ userId }: Props) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.is_read).length;

  // ── Fetch ────────────────────────────────────────────────────────────────────
  const fetchNotifications = async () => {
    setLoading(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (supabase as any)
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(30);
    if (data) setNotifications(data as Notification[]);
    setLoading(false);
  };

  useEffect(() => {
    void fetchNotifications();

    // Real-time subscription
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const channel = (supabase as any)
      .channel(`notif-${userId}`)
      .on("postgres_changes", {
        event: "INSERT", schema: "public", table: "notifications",
        filter: `user_id=eq.${userId}`,
      }, (payload: { new: Notification }) => {
        setNotifications(prev => [payload.new, ...prev.slice(0, 29)]);
        // Browser notification if supported and tab hidden
        if ("Notification" in window && window.Notification.permission === "granted" && document.hidden) {
          new window.Notification(payload.new.title, { body: payload.new.body, icon: "/favicon.ico" });
        }
      })
      .subscribe();

    return () => { void (supabase as any).removeChannel(channel); };
  }, [userId]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Request browser notification permission on open
  const handleOpen = () => {
    setOpen(prev => !prev);
    if ("Notification" in window && window.Notification.permission === "default") {
      void window.Notification.requestPermission();
    }
  };

  // ── Mark as read ─────────────────────────────────────────────────────────────
  const markRead = async (ids: string[] | null) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase as any).rpc("mark_notifications_read", {
      p_notification_ids: ids,
    });
    setNotifications(prev =>
      prev.map(n =>
        ids === null || ids.includes(n.id) ? { ...n, is_read: true } : n
      )
    );
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div ref={dropRef} style={{ position: "relative" }}>
      {/* Bell button */}
      <button
        type="button"
        onClick={handleOpen}
        style={{
          position: "relative", width: 38, height: 38,
          borderRadius: "10px", border: "none",
          background: open ? "rgba(211, 84, 0, 0.12)" : "rgba(196, 154, 108, 0.1)",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.15s",
        }}
        aria-label={`Notifications (${unreadCount} unread)`}
      >
        <Bell size={18} style={{ color: open ? "#D35400" : "#66564A" }} />
        {unreadCount > 0 && (
          <span style={{
            position: "absolute", top: 4, right: 4,
            width: 16, height: 16, borderRadius: "50%",
            background: "#D35400", color: "#fff",
            fontSize: "0.6rem", fontWeight: 800,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "2px solid #FFFFFF",
            animation: "pulse 2s infinite",
          }}>
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", right: 0,
          width: 360, maxHeight: 520,
          background: "#FFFFFF", borderRadius: "16px",
          boxShadow: "0 20px 60px rgba(36, 26, 20, 0.2)",
          border: "1px solid rgba(196, 154, 108, 0.3)",
          zIndex: 9999, overflow: "hidden",
          display: "flex", flexDirection: "column",
        }}>
          {/* Header */}
          <div style={{
            padding: "14px 16px", display: "flex",
            alignItems: "center", justifyContent: "space-between",
            borderBottom: "1px solid rgba(196, 154, 108, 0.2)",
            background: "#FDF9F3",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Bell size={15} style={{ color: "#D35400" }} />
              <span style={{ fontWeight: 800, fontSize: "0.88rem", color: "#241A14" }}>
                Notifications
              </span>
              {unreadCount > 0 && (
                <span style={{
                  background: "#D35400", color: "#fff",
                  borderRadius: "999px", padding: "1px 7px",
                  fontSize: "0.7rem", fontWeight: 700,
                }}>
                  {unreadCount} new
                </span>
              )}
            </div>
            <div style={{ display: "flex", gap: "6px" }}>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={() => void markRead(null)}
                  style={{
                    padding: "4px 10px", borderRadius: "8px",
                    background: "rgba(4, 120, 87, 0.1)", color: "#047857",
                    border: "none", fontWeight: 700, fontSize: "0.72rem", cursor: "pointer",
                    display: "flex", alignItems: "center", gap: "4px",
                  }}
                >
                  <CheckCheck size={12} /> Mark all read
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                style={{
                  width: 26, height: 26, borderRadius: "8px",
                  background: "rgba(196, 154, 108, 0.15)", border: "none",
                  cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                <X size={13} style={{ color: "#66564A" }} />
              </button>
            </div>
          </div>

          {/* List */}
          <div style={{ overflowY: "auto", flex: 1 }}>
            {loading ? (
              <div style={{ padding: "30px", textAlign: "center", color: "#8C7A6A", fontSize: "0.82rem" }}>
                Loading…
              </div>
            ) : notifications.length === 0 ? (
              <div style={{ padding: "40px 20px", textAlign: "center" }}>
                <Bell size={32} style={{ color: "rgba(196,154,108,0.4)", margin: "0 auto 10px", display: "block" }} />
                <p style={{ margin: 0, color: "#8C7A6A", fontSize: "0.82rem" }}>No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  style={{
                    padding: "12px 16px",
                    background: n.is_read ? "transparent" : "rgba(211,84,0,0.03)",
                    borderBottom: "1px solid rgba(196, 154, 108, 0.1)",
                    display: "flex", gap: "10px", alignItems: "flex-start",
                    cursor: "pointer", transition: "background 0.15s",
                  }}
                  onClick={() => { if (!n.is_read) void markRead([n.id]); }}
                >
                  {/* Icon */}
                  <div style={{
                    width: 36, height: 36, borderRadius: "10px",
                    background: `${notifColor(n.type)}15`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.1rem", flexShrink: 0,
                  }}>
                    {n.icon}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "6px" }}>
                      <p style={{
                        margin: 0, fontSize: "0.82rem", fontWeight: 700,
                        color: n.is_read ? "#66564A" : "#241A14",
                        overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>
                        {n.title}
                      </p>
                      <span style={{ fontSize: "0.68rem", color: "#8C7A6A", flexShrink: 0 }}>
                        {timeAgo(n.created_at)}
                      </span>
                    </div>
                    <p style={{
                      margin: "3px 0 0", fontSize: "0.75rem", color: "#8C7A6A",
                      overflow: "hidden", textOverflow: "ellipsis",
                      display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                    }}>
                      {n.body}
                    </p>
                    {n.action_url && (
                      <a href={n.action_url} style={{
                        fontSize: "0.7rem", color: "#D35400", fontWeight: 700,
                        textDecoration: "none", display: "flex", alignItems: "center", gap: "3px",
                        marginTop: "4px",
                      }}>
                        View <ExternalLink size={10} />
                      </a>
                    )}
                  </div>

                  {/* Unread dot */}
                  {!n.is_read && (
                    <div style={{
                      width: 8, height: 8, borderRadius: "50%",
                      background: "#D35400", flexShrink: 0, marginTop: "4px",
                    }} />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div style={{
              padding: "10px 16px", borderTop: "1px solid rgba(196, 154, 108, 0.2)",
              textAlign: "center", background: "#FDF9F3",
            }}>
              <button
                type="button"
                onClick={() => { void markRead(null); setOpen(false); }}
                style={{
                  background: "none", border: "none", color: "#8C7A6A",
                  fontSize: "0.75rem", cursor: "pointer", display: "flex",
                  alignItems: "center", gap: "4px", margin: "0 auto",
                }}
              >
                <Check size={12} /> Clear all notifications
              </button>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
}

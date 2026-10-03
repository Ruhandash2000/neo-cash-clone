/**
 * Notification Bell — uses local Neo store notifications as primary source
 * and enriches with Supabase real-time when a real userId is available.
 */

import { useState, useEffect, useRef } from "react";
import { Bell, Check, CheckCheck, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useNeoStore } from "@/lib/neo-cash-store";
import type { NotificationItem } from "@/lib/neo-cash-store";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SupabaseNotif {
  id:          string;
  type:        string;
  title:       string;
  body:        string;
  icon:        string;
  action_url:  string | null;
  is_read:     boolean;
  created_at:  string;
}

type UnifiedNotif = {
  id:       string;
  title:    string;
  body:     string;
  type:     string;
  is_read:  boolean;
  created_at: string;
  source:   "local" | "supabase";
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1)  return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function notifBg(type: string): string {
  if (type === "success" || type.includes("approved") || type.includes("topup")) return "rgba(4,120,87,0.08)";
  if (type === "error"   || type.includes("rejected")) return "rgba(220,38,38,0.07)";
  if (type === "warning" || type.includes("pending"))  return "rgba(217,119,6,0.08)";
  return "rgba(211,84,0,0.06)";
}

function notifDot(type: string): string {
  if (type === "success" || type.includes("approved")) return "#047857";
  if (type === "error"   || type.includes("rejected")) return "#DC2626";
  if (type === "warning" || type.includes("pending"))  return "#D97706";
  return "#D35400";
}

// Map local NotificationItem → UnifiedNotif
function fromLocal(n: NotificationItem): UnifiedNotif {
  return {
    id:         n.id,
    title:      n.title,
    body:       n.message,
    type:       n.type,
    is_read:    n.read,
    created_at: new Date().toISOString(), // local items don't have ISO stamp
    source:     "local",
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

interface Props { userId: string; }

export function NotificationBell({ userId }: Props) {
  const [store, actions] = useNeoStore();
  const [supabaseNotifs, setSupabaseNotifs] = useState<SupabaseNotif[]>([]);
  const [open, setOpen]     = useState(false);
  const [loading, setLoading] = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);

  // ── Merge local + supabase ─────────────────────────────────────────────────
  const localNotifs: UnifiedNotif[] = (store.notifications ?? []).map(fromLocal);

  const supabaseUnified: UnifiedNotif[] = supabaseNotifs.map(n => ({
    id:         `sb-${n.id}`,
    title:      n.title,
    body:       n.body,
    type:       n.type,
    is_read:    n.is_read,
    created_at: n.created_at,
    source:     "supabase",
  }));

  // Merge — deduplicate by id, local first, then supabase
  const all: UnifiedNotif[] = [
    ...localNotifs,
    ...supabaseUnified.filter(s => !localNotifs.find(l => l.title === s.title && l.body === s.body)),
  ].slice(0, 40);

  const unreadCount = all.filter(n => !n.is_read).length;

  // ── Fetch from Supabase if real userId ─────────────────────────────────────
  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase as any)
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(30)
      .then(({ data }: { data: SupabaseNotif[] | null }) => {
        if (data) setSupabaseNotifs(data);
        setLoading(false);
      });

    // Real-time subscription
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const channel = (supabase as any)
      .channel(`notif-bell-${userId}`)
      .on("postgres_changes", {
        event: "INSERT", schema: "public", table: "notifications",
        filter: `user_id=eq.${userId}`,
      }, (payload: { new: SupabaseNotif }) => {
        setSupabaseNotifs(prev => [payload.new, ...prev.slice(0, 29)]);
        if ("Notification" in window && window.Notification.permission === "granted" && document.hidden) {
          new window.Notification(payload.new.title, { body: payload.new.body, icon: "/favicon.ico" });
        }
      })
      .subscribe();

    return () => { void (supabase as any).removeChannel(channel); };
  }, [userId]);

  // ── Close on outside click ─────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleOpen = () => {
    setOpen(prev => !prev);
    if ("Notification" in window && window.Notification.permission === "default") {
      void window.Notification.requestPermission();
    }
  };

  // Mark local notifications as read
  const markAllRead = () => {
    actions.markAllNotificationsRead?.();
    // Also mark supabase ones
    if (userId) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      void (supabase as any).rpc("mark_notifications_read", { p_notification_ids: null });
    }
    setSupabaseNotifs(prev => prev.map(n => ({ ...n, is_read: true })));
  };

  const markOneRead = (notif: UnifiedNotif) => {
    if (notif.source === "local") {
      actions.markNotificationRead?.(notif.id);
    } else {
      const realId = notif.id.replace("sb-", "");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      void (supabase as any).rpc("mark_notifications_read", { p_notification_ids: [realId] });
      setSupabaseNotifs(prev => prev.map(n => n.id === realId ? { ...n, is_read: true } : n));
    }
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div ref={dropRef} style={{ position: "relative" }}>
      {/* Bell button */}
      <button
        type="button"
        onClick={handleOpen}
        style={{
          position: "relative", width: 38, height: 38,
          borderRadius: "10px", border: "none",
          background: open ? "rgba(211,84,0,0.12)" : "rgba(196,154,108,0.1)",
          cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          transition: "all 0.15s",
        }}
        aria-label={`Notifications (${unreadCount} unread)`}
      >
        <Bell size={18} style={{ color: open ? "#D35400" : "#66564A" }} />
        {unreadCount > 0 && (
          <span style={{
            position: "absolute", top: 4, right: 4,
            minWidth: 16, height: 16, borderRadius: "8px",
            background: "#D35400", color: "#fff",
            fontSize: "0.58rem", fontWeight: 800,
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "0 3px",
            border: "1.5px solid #fff",
            animation: "notifPulse 2s ease infinite",
          }}>
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", right: 0,
          width: "340px", maxHeight: "480px",
          background: "#FFFFFF",
          borderRadius: "16px",
          border: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
          zIndex: 9999,
          display: "flex", flexDirection: "column",
          overflow: "hidden",
          animation: "notifSlideIn 0.18s ease",
        }}>
          {/* Header */}
          <div style={{
            padding: "14px 16px 10px",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexShrink: 0,
          }}>
            <div>
              <span style={{ fontWeight: 800, fontSize: "0.95rem", color: "#1C140E" }}>Notifications</span>
              {unreadCount > 0 && (
                <span style={{
                  marginLeft: "8px", background: "#D35400", color: "#fff",
                  borderRadius: "999px", padding: "1px 7px",
                  fontSize: "0.65rem", fontWeight: 700,
                }}>{unreadCount} new</span>
              )}
            </div>
            <div style={{ display: "flex", gap: "4px" }}>
              {unreadCount > 0 && (
                <button type="button" onClick={markAllRead} title="Mark all as read"
                  style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", borderRadius: "6px", color: "#9CA3AF" }}>
                  <CheckCheck size={16} />
                </button>
              )}
              <button type="button" onClick={() => setOpen(false)} title="Close"
                style={{ background: "none", border: "none", cursor: "pointer", padding: "4px", borderRadius: "6px", color: "#9CA3AF" }}>
                <X size={16} />
              </button>
            </div>
          </div>

          {/* List */}
          <div style={{ overflowY: "auto", flex: 1 }}>
            {loading && all.length === 0 ? (
              <div style={{ padding: "32px 16px", textAlign: "center", color: "#9CA3AF", fontSize: "0.85rem" }}>
                Loading…
              </div>
            ) : all.length === 0 ? (
              <div style={{ padding: "40px 16px", textAlign: "center" }}>
                <Bell size={28} style={{ color: "#E5E7EB", margin: "0 auto 10px", display: "block" }} />
                <p style={{ margin: 0, color: "#9CA3AF", fontSize: "0.85rem" }}>No notifications yet</p>
              </div>
            ) : (
              all.map(n => (
                <div
                  key={n.id}
                  onClick={() => markOneRead(n)}
                  style={{
                    padding: "12px 16px",
                    background: n.is_read ? "transparent" : notifBg(n.type),
                    borderBottom: "1px solid rgba(0,0,0,0.04)",
                    cursor: "pointer",
                    display: "flex", gap: "10px", alignItems: "flex-start",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = "rgba(0,0,0,0.03)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = n.is_read ? "transparent" : notifBg(n.type); }}
                >
                  {/* Dot */}
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: n.is_read ? "#E5E7EB" : notifDot(n.type),
                    flexShrink: 0, marginTop: 5,
                    boxShadow: n.is_read ? "none" : `0 0 6px ${notifDot(n.type)}88`,
                  }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontWeight: n.is_read ? 500 : 700,
                      fontSize: "0.84rem", color: "#1C140E",
                      marginBottom: "2px",
                    }}>{n.title}</div>
                    <div style={{
                      fontSize: "0.76rem", color: "#6B7280",
                      lineHeight: 1.45,
                      display: "-webkit-box", WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical", overflow: "hidden",
                    }}>{n.body}</div>
                    <div style={{ fontSize: "0.68rem", color: "#9CA3AF", marginTop: "4px" }}>
                      {timeAgo(n.created_at)}
                    </div>
                  </div>
                  {!n.is_read && (
                    <button type="button"
                      onClick={ev => { ev.stopPropagation(); markOneRead(n); }}
                      title="Mark read"
                      style={{ background: "none", border: "none", cursor: "pointer", padding: "2px", color: "#9CA3AF", flexShrink: 0 }}>
                      <Check size={14} />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {all.length > 0 && (
            <div style={{
              padding: "10px 16px",
              borderTop: "1px solid rgba(0,0,0,0.06)",
              textAlign: "center", flexShrink: 0,
            }}>
              <span style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>
                {all.length} notification{all.length !== 1 ? "s" : ""}
              </span>
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes notifSlideIn { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes notifPulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.15)} }
      `}</style>
    </div>
  );
}

/**
 * Neo Cash AI — User Profile Page (/profile)
 *
 * Color theme: matches dashboard (white bg, #7C3AED purple student, #D35400 admin, #B45309 head)
 * - Banner: institute image / gradient
 * - Profile photo: auto-loaded from Google OAuth, uploadable
 * - Info: Name, Reg/Roll, Class/Dept, Section, Wallet balance
 * - Right: 3-dot menu (radial bubbles UP) + AI chat button (below)
 */
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNeoStore } from "@/lib/neo-cash-store";
import {
  LayoutDashboard, CreditCard, Wallet, FileText,
  HeartHandshake, Users, LogOut, X, MoreVertical,
  MessageSquare, Settings, UserCircle,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/profile")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "My Profile — Neo Cash AI" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ProfilePage,
});

const ROLE_COLORS: Record<string, string> = {
  student: "#7C3AED",
  admin: "#D35400",
  head: "#B45309",
  demo_controller: "#7C3AED",
};
const ROLE_BG: Record<string, string> = {
  student: "rgba(124,58,237,0.08)",
  admin: "rgba(211,84,0,0.08)",
  head: "rgba(180,83,9,0.08)",
  demo_controller: "rgba(124,58,237,0.08)",
};
const ROLE_LABEL: Record<string, string> = {
  student: "Student",
  admin: "Admin / Staff",
  head: "Head / Principal",
  demo_controller: "Demo",
};

// Nav bubbles for the 3-dot menu
const NAV_ITEMS = [
  { id: "overview", label: "Home", icon: <LayoutDashboard size={15} />, tab: "overview" },
  { id: "fees", label: "Fees & Dues", icon: <CreditCard size={15} />, tab: "fees" },
  { id: "wallet", label: "Wallet", icon: <Wallet size={15} />, tab: "wallet" },
  { id: "transactions", label: "History", icon: <FileText size={15} />, tab: "transactions" },
  { id: "donation", label: "Donate", icon: <HeartHandshake size={15} />, tab: "donation" },
];

function ProfilePage() {
  const navigate = useNavigate();
  const [store] = useNeoStore();
  const user = store.currentSessionUser;
  const roleColor = ROLE_COLORS[user?.role ?? "student"];

  const [menuOpen, setMenuOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [bannerUrl, setBannerUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const [profileData, setProfileData] = useState({
    fullName: user?.fullName ?? "",
    regRoll: "",
    classDept: "",
    section: "",
    phone: "",
  });

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Load Google OAuth profile photo + profile from DB
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) return;
      const meta = data.user.user_metadata;
      // Google profile picture - use bracket notation for index-signature access
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const googlePhoto = (meta as any)?.avatar_url || (meta as any)?.picture;
      if (googlePhoto && !avatarUrl) setAvatarUrl(String(googlePhoto));
    });

    if (!user) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (supabase.from("profiles") as any)
      .select("full_name, username, avatar_url, banner_url, phone")
      .eq("id", user.id)
      .single()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .then(({ data }: { data: any }) => {
        if (!data) return;
        setProfileData((p) => ({
          ...p,
          fullName: data.full_name || p.fullName,
          regRoll: data.username || p.regRoll,
          phone: data.phone || p.phone,
        }));
        // DB avatar overrides Google photo
        if (data.avatar_url) setAvatarUrl(data.avatar_url);
        if (data.banner_url) setBannerUrl(data.banner_url);
      });
  }, [user]);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    const objectUrl = URL.createObjectURL(file);
    setAvatarUrl(objectUrl); // instant preview
    const ext = file.name.split(".").pop();
    const path = `avatars/${user.id}.${ext}`;
    const { error } = await supabase.storage.from("profile-assets").upload(path, file, { upsert: true });
    if (!error) {
      const { data: urlData } = supabase.storage.from("profile-assets").getPublicUrl(path);
      setAvatarUrl(urlData.publicUrl);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from("profiles") as any).update({ avatar_url: urlData.publicUrl }).eq("id", user.id);
    }
    setUploading(false);
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    const objectUrl = URL.createObjectURL(file);
    setBannerUrl(objectUrl);
    const ext = file.name.split(".").pop();
    const path = `banners/${user.id}.${ext}`;
    const { error } = await supabase.storage.from("profile-assets").upload(path, file, { upsert: true });
    if (!error) {
      const { data: urlData } = supabase.storage.from("profile-assets").getPublicUrl(path);
      setBannerUrl(urlData.publicUrl);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase.from("profiles") as any).update({ banner_url: urlData.publicUrl }).eq("id", user.id);
    }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!user) return;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (supabase.from("profiles") as any).update({
      full_name: profileData.fullName,
      username: profileData.regRoll,
      phone: profileData.phone,
    }).eq("id", user.id);
    setEditMode(false);
  };

  const balance = store.balances?.walletBalance ?? 0;
  const displayBalance = user?.isDemoUser ? 12450 : balance;

  return (
    <div style={{
      minHeight: "100dvh",
      background: "#F9FAFB",
      fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      color: "#111827",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        @keyframes slide-up { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes bubble-in { from { opacity:0; transform:scale(0.7) translateX(10px); } to { opacity:1; transform:scale(1) translateX(0); } }
        @keyframes spin { to { transform: rotate(360deg); } }
        .upload-hover .overlay { opacity: 0; transition: opacity 0.2s; }
        .upload-hover:hover .overlay { opacity: 1; }
        .nav-bubble { transition: all 0.15s ease; }
        .nav-bubble:hover { background: #F5F3FF !important; border-color: ${roleColor} !important; color: ${roleColor} !important; }
        .profile-card { animation: slide-up 0.3s ease forwards; }
        .edit-input { width: 100%; padding: 7px 10px; border: 1.5px solid #D1D5DB; border-radius: 6px; font-size: 0.88rem; font-family: inherit; color: #111827; background: #fff; }
        .edit-input:focus { outline: none; border-color: ${roleColor}; box-shadow: 0 0 0 3px ${roleColor}22; }
        .back-link { color: #6B7280; font-size: 0.82rem; display: flex; align-items: center; gap: 5px; cursor: pointer; background: none; border: none; font-family: inherit; }
        .back-link:hover { color: #374151; }
      `}</style>

      {/* Hidden file inputs */}
      <input ref={avatarInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => void handleAvatarUpload(e)} />
      <input ref={bannerInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => void handleBannerUpload(e)} />

      {/* ── TOP NAV ── */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 20px",
        background: "#fff", borderBottom: "1px solid #E5E7EB",
        position: "sticky", top: 0, zIndex: 40,
      }}>
        <button className="back-link" onClick={() => void navigate({ to: "/dashboard", search: {} })}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Dashboard
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            width: "28px", height: "28px", borderRadius: "7px",
            background: "#7C3AED", display: "flex", alignItems: "center",
            justifyContent: "center", fontSize: "14px", fontWeight: 900, color: "#fff",
          }}>N</div>
          <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>Neo Cash AI</span>
        </div>
        <button
          onClick={() => setEditMode(!editMode)}
          style={{
            padding: "6px 14px", borderRadius: "6px",
            background: editMode ? ROLE_BG[user?.role ?? "student"] : "#F3F4F6",
            border: `1.5px solid ${editMode ? roleColor : "#E5E7EB"}`,
            color: editMode ? roleColor : "#374151",
            fontSize: "0.82rem", fontWeight: 600, cursor: "pointer",
            fontFamily: "inherit", transition: "all 0.15s",
          }}
        >
          {editMode ? "Cancel" : "Edit Profile"}
        </button>
      </div>

      <div style={{ maxWidth: "720px", margin: "0 auto", padding: "0 0 80px" }}>

        {/* ── BANNER ── */}
        <div
          className="upload-hover"
          onClick={() => bannerInputRef.current?.click()}
          style={{
            height: "160px", position: "relative", cursor: "pointer",
            background: bannerUrl
              ? `url(${bannerUrl}) center/cover`
              : `linear-gradient(135deg, ${roleColor}22 0%, ${roleColor}08 100%)`,
            borderBottom: "1px solid #E5E7EB",
          }}
        >
          {/* Neo logo top-left */}
          {!bannerUrl && (
            <div style={{
              position: "absolute", inset: 0, display: "flex",
              alignItems: "center", justifyContent: "center",
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "2rem", fontWeight: 900, color: `${roleColor}30`, letterSpacing: "-0.02em" }}>
                  {user?.institutionName ?? "Institution"}
                </div>
                <div style={{ fontSize: "0.75rem", color: `${roleColor}50`, marginTop: "4px" }}>Neo Cash AI</div>
              </div>
            </div>
          )}
          <div className="overlay" style={{
            position: "absolute", inset: 0,
            background: "rgba(0,0,0,0.35)", display: "flex",
            alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: "0.85rem", fontWeight: 500, gap: "8px",
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            Change banner photo
          </div>
          {uploading && (
            <div style={{
              position: "absolute", inset: 0, background: "rgba(255,255,255,0.7)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <div style={{
                width: "28px", height: "28px", border: "3px solid rgba(0,0,0,0.1)",
                borderTopColor: roleColor, borderRadius: "50%",
                animation: "spin 0.7s linear infinite",
              }} />
            </div>
          )}
        </div>

        {/* ── PROFILE PICTURE ROW ── */}
        <div style={{
          padding: "0 20px",
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginTop: "-44px",
        }}>
          {/* Avatar */}
          <div className="upload-hover" style={{ position: "relative", flexShrink: 0 }}>
            <div
              onClick={() => avatarInputRef.current?.click()}
              style={{
                width: "88px", height: "88px", borderRadius: "50%",
                border: "3px solid #fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                background: avatarUrl ? `url(${avatarUrl}) center/cover` : ROLE_BG[user?.role ?? "student"],
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", overflow: "hidden", position: "relative",
              }}
            >
              {!avatarUrl && (
                <UserCircle size={44} color={roleColor} />
              )}
              <div className="overlay" style={{
                position: "absolute", inset: 0, background: "rgba(0,0,0,0.45)",
                borderRadius: "50%", display: "flex", alignItems: "center",
                justifyContent: "center",
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </div>
            </div>
            {/* Role badge */}
            <div style={{
              position: "absolute", bottom: "2px", right: "-4px",
              background: roleColor, color: "#fff",
              borderRadius: "4px", padding: "1px 6px",
              fontSize: "0.6rem", fontWeight: 700,
              border: "2px solid #fff", letterSpacing: "0.04em",
            }}>
              {(user?.role ?? "student").toUpperCase()}
            </div>
          </div>

          {/* Right controls: 3-dot menu + AI chat */}
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "flex-end",
            gap: "8px", paddingBottom: "6px",
            position: "relative",
          }} ref={menuRef}>

            {/* Radial bubble menu — pops UP from 3-dot */}
            {menuOpen && (
              <div style={{
                position: "absolute", bottom: "48px", right: 0,
                display: "flex", flexDirection: "column", gap: "6px",
                alignItems: "flex-end", zIndex: 100,
              }}>
                {NAV_ITEMS.map((item, i) => (
                  <button
                    key={item.id}
                    className="nav-bubble"
                    onClick={() => {
                      setMenuOpen(false);
                      void navigate({ to: "/dashboard", search: {} });
                    }}
                    style={{
                      display: "flex", alignItems: "center", gap: "8px",
                      background: "#fff",
                      border: "1.5px solid #E5E7EB",
                      borderRadius: "20px", padding: "7px 14px 7px 10px",
                      color: "#374151", cursor: "pointer",
                      fontSize: "0.82rem", fontWeight: 500,
                      fontFamily: "inherit", whiteSpace: "nowrap",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                      animation: `bubble-in 0.2s ease ${i * 0.04}s both`,
                    }}
                  >
                    <span style={{
                      width: "26px", height: "26px", borderRadius: "50%",
                      background: ROLE_BG[user?.role ?? "student"],
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: roleColor,
                    }}>{item.icon}</span>
                    {item.label}
                  </button>
                ))}
                {/* Settings */}
                <button
                  className="nav-bubble"
                  onClick={() => setMenuOpen(false)}
                  style={{
                    display: "flex", alignItems: "center", gap: "8px",
                    background: "#fff", border: "1.5px solid #E5E7EB",
                    borderRadius: "20px", padding: "7px 14px 7px 10px",
                    color: "#374151", cursor: "pointer", fontSize: "0.82rem",
                    fontWeight: 500, fontFamily: "inherit",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                    animation: `bubble-in 0.2s ease ${NAV_ITEMS.length * 0.04}s both`,
                  }}
                >
                  <span style={{
                    width: "26px", height: "26px", borderRadius: "50%",
                    background: "#F3F4F6", display: "flex", alignItems: "center",
                    justifyContent: "center", color: "#6B7280",
                  }}><Settings size={14} /></span>
                  Settings
                </button>
              </div>
            )}

            {/* 3-dot button */}
            <button
              id="profile-menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                width: "36px", height: "36px", borderRadius: "50%",
                background: menuOpen ? ROLE_BG[user?.role ?? "student"] : "#F3F4F6",
                border: `1.5px solid ${menuOpen ? roleColor : "#E5E7EB"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", transition: "all 0.15s", color: menuOpen ? roleColor : "#374151",
              }}
            >
              {menuOpen ? <X size={16} /> : <MoreVertical size={16} />}
            </button>

            {/* AI Chat button — BELOW the 3-dot */}
            <button
              aria-label="Open AI Chat"
              onClick={() => void navigate({ to: "/dashboard", search: {} })}
              style={{
                width: "36px", height: "36px", borderRadius: "50%",
                background: "#F3F4F6", border: "1.5px solid #E5E7EB",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", transition: "all 0.15s", color: "#374151",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = ROLE_BG[user?.role ?? "student"] ?? "";
                e.currentTarget.style.borderColor = roleColor ?? "";
                e.currentTarget.style.color = roleColor ?? "";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "#F3F4F6";
                e.currentTarget.style.borderColor = "#E5E7EB";
                e.currentTarget.style.color = "#374151";
              }}
            >
              <MessageSquare size={16} />
            </button>
          </div>
        </div>

        {/* ── NAME & ROLE ── */}
        <div style={{ padding: "12px 20px 0" }}>
          {editMode ? (
            <input
              className="edit-input"
              value={profileData.fullName}
              onChange={(e) => setProfileData((p) => ({ ...p, fullName: e.target.value }))}
              style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "4px" }}
            />
          ) : (
            <h1 style={{ fontSize: "1.2rem", fontWeight: 800, margin: "0 0 4px", color: "#111827" }}>
              {profileData.fullName || user?.fullName || "Your Name"}
            </h1>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
            <span style={{
              fontSize: "0.72rem", fontWeight: 700, padding: "2px 8px",
              background: ROLE_BG[user?.role ?? "student"],
              color: roleColor, borderRadius: "4px", letterSpacing: "0.04em",
            }}>
              {ROLE_LABEL[user?.role ?? "student"]}
            </span>
            <span style={{ fontSize: "0.82rem", color: "#6B7280" }}>
              {user?.institutionName ?? "Institution"}
            </span>
          </div>
        </div>

        {/* ── INFO GRID ── */}
        <div style={{ padding: "20px" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "10px",
            marginBottom: "16px",
          }}>
            {([
              { label: "Reg / Roll No.", key: "regRoll", icon: "🪪" },
              { label: "Class / Department", key: "classDept", icon: "🏫" },
              { label: "Section", key: "section", icon: "📌" },
              { label: "Phone", key: "phone", icon: "📱" },
            ] as const).map(({ label, key, icon }) => (
              <div key={key} style={{
                background: "#fff", border: "1px solid #E5E7EB",
                borderRadius: "10px", padding: "14px",
              }}>
                <div style={{ fontSize: "0.72rem", color: "#9CA3AF", marginBottom: "5px", display: "flex", gap: "5px" }}>
                  <span>{icon}</span> {label}
                </div>
                {editMode ? (
                  <input
                    className="edit-input"
                    value={profileData[key]}
                    onChange={(e) => setProfileData((p) => ({ ...p, [key]: e.target.value }))}
                    placeholder={`Enter ${label}`}
                  />
                ) : (
                  <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "#111827" }}>
                    {profileData[key] || <span style={{ color: "#D1D5DB", fontWeight: 400 }}>Not set</span>}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* ── WALLET CARD ── */}
          <div style={{
            background: "#fff", border: "1px solid #E5E7EB",
            borderRadius: "12px", padding: "20px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: "12px", marginBottom: "12px",
          }}>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#9CA3AF", marginBottom: "6px", display: "flex", gap: "6px", alignItems: "center" }}>
                <Wallet size={13} /> Neo Cash Wallet
              </div>
              <div style={{
                fontSize: "2rem", fontWeight: 800, color: "#111827", letterSpacing: "-0.02em",
              }}>
                ৳{displayBalance.toLocaleString()}
              </div>
              <div style={{ fontSize: "0.72rem", color: "#9CA3AF", marginTop: "2px" }}>Available balance</div>
            </div>
            <button
              onClick={() => void navigate({ to: "/dashboard", search: {} })}
              style={{
                padding: "10px 18px", borderRadius: "8px",
                background: roleColor, color: "#fff",
                border: "none", fontSize: "0.85rem", fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit",
                transition: "opacity 0.15s",
              }}
              onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
              onMouseLeave={e => e.currentTarget.style.opacity = "1"}
            >
              + Top Up
            </button>
          </div>

          {/* ── ACCOUNT INFO ── */}
          <div style={{
            background: "#fff", border: "1px solid #E5E7EB",
            borderRadius: "12px", overflow: "hidden", marginBottom: "12px",
          }}>
            <div style={{ padding: "14px 16px", borderBottom: "1px solid #F3F4F6" }}>
              <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                Account Details
              </div>
            </div>
            {[
              { label: "Email", value: user?.email ?? "—", icon: "✉️" },
              { label: "Institution", value: user?.institutionName ?? "Not set", icon: "🏛️" },
              { label: "Status", value: "Active & Verified", icon: "✅" },
            ].map(({ label, value, icon }) => (
              <div key={label} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "12px 16px", borderBottom: "1px solid #F9FAFB",
              }}>
                <span style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "0.85rem", color: "#6B7280" }}>
                  {icon} {label}
                </span>
                <span style={{ fontSize: "0.85rem", fontWeight: 500, color: "#111827" }}>{value}</span>
              </div>
            ))}
          </div>

          {/* Save button */}
          {editMode && (
            <button
              onClick={() => void handleSave()}
              style={{
                width: "100%", padding: "12px", borderRadius: "8px",
                background: roleColor, color: "#fff",
                border: "none", fontSize: "0.9rem", fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit", marginBottom: "10px",
              }}
            >
              Save Changes
            </button>
          )}

          {/* Sign out */}
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              void navigate({ to: "/", search: {} });
            }}
            style={{
              width: "100%", padding: "11px", borderRadius: "8px",
              background: "transparent",
              border: "1px solid #FCA5A5",
              color: "#EF4444", fontSize: "0.88rem", fontWeight: 500,
              cursor: "pointer", fontFamily: "inherit",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              transition: "all 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#FEF2F2"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
          >
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

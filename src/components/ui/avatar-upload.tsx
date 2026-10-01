/**
 * AvatarUpload — Clickable profile picture with change capability
 */
import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";

interface Props {
  src: string;
  name: string;
  size?: number;
  onChanged?: (dataUrl: string) => void;
  editable?: boolean;
}

export function AvatarUpload({ src, name, size = 64, onChanged, editable = true }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onload = (evt) => {
      const dataUrl = evt.target?.result as string;
      setPreview(dataUrl);
      setLoading(false);
      onChanged?.(dataUrl);
      // Store in localStorage for persistence across sessions
      try { localStorage.setItem("neo_cash_avatar", dataUrl); } catch {}
    };
    reader.readAsDataURL(file);
  };

  const displaySrc = preview || src || localStorage.getItem("neo_cash_avatar") || undefined;

  return (
    <div
      style={{ position: "relative", width: size, height: size, flexShrink: 0 }}
      title={editable ? "Change profile photo" : name}
    >
      {/* AVATAR */}
      <div
        style={{
          width: size, height: size, borderRadius: "50%",
          background: displaySrc ? "transparent" : "linear-gradient(135deg, #7C3AED, #D35400)",
          border: "2.5px solid rgba(124,58,237,0.35)",
          overflow: "hidden",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: editable ? "pointer" : "default",
          boxShadow: "0 2px 12px rgba(124,58,237,0.25)",
        }}
        onClick={() => editable && inputRef.current?.click()}
      >
        {loading ? (
          <Loader2 size={size * 0.35} color="#FFF" style={{ animation: "spin 1s linear infinite" }} />
        ) : displaySrc ? (
          <img
            src={displaySrc}
            alt={name}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
        ) : (
          <span style={{ color: "#FFF", fontSize: size * 0.3, fontWeight: 800, letterSpacing: "-0.02em" }}>
            {initials}
          </span>
        )}
      </div>

      {/* CAMERA BADGE */}
      {editable && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          aria-label="Change photo"
          style={{
            position: "absolute", bottom: 0, right: 0,
            width: size * 0.34, height: size * 0.34,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #7C3AED, #D35400)",
            border: "2px solid #FFF",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
          }}
        >
          <Camera size={size * 0.18} color="#FFF" />
        </button>
      )}

      {/* HIDDEN FILE INPUT */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: "none" }}
        onChange={handleFile}
      />
    </div>
  );
}

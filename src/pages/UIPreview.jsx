import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Monitor, Moon, Sun, Bell, Search, ChevronRight, Star, Zap, Shield, BarChart3, ArrowRight } from "lucide-react";
import { generateColorScale, generateHarmony, getContrastRatio, getTextColor } from "../utils/colorUtils";

function buildPalette(base) {
  const analogous = generateHarmony(base, "analogous");
  const triadic = generateHarmony(base, "triadic");
  const scale = generateColorScale(base);
  return [...new Set([base, ...analogous, ...triadic, scale[1].hex, scale[5].hex, scale[8].hex, "#ffffff", "#0f172a"])];
}

const ROLE_LABELS = {
  primary: "Primary",
  secondary: "Secondary",
  accent: "Accent",
  background: "Background",
  surface: "Surface",
  text: "Text",
};

export default function UIPreview({ selectedColor = "#8b5cf6", onColorChange }) {
  const palette = useMemo(() => buildPalette(selectedColor), [selectedColor]);
  const [previewTheme, setPreviewTheme] = useState("dark");
  const [roles, setRoles] = useState({
    primary: selectedColor,
    secondary: "#6366f1",
    accent: "#ec4899",
    background: "#0f172a",
    surface: "#1e293b",
    text: "#f1f5f9",
  });

  useEffect(() => {
    const scale = generateColorScale(selectedColor);
    setRoles((prev) => ({
      ...prev,
      primary: selectedColor,
      secondary: palette[2] || prev.secondary,
      accent: palette[3] || prev.accent,
      background: previewTheme === "dark" ? (scale[9]?.hex || "#0f172a") : "#f8fafc",
      surface: previewTheme === "dark" ? (scale[8]?.hex || "#1e293b") : "#ffffff",
      text: previewTheme === "dark" ? "#f1f5f9" : "#0f172a",
    }));
  }, [selectedColor, palette, previewTheme]);

  const setRole = (role, color) => {
    setRoles((prev) => ({ ...prev, [role]: color }));
    if (role === "primary") onColorChange?.(color);
  };

  const ratio = getContrastRatio(roles.text, roles.background);

  const navTextColor = getTextColor(roles.background);

  return (
    <div className="grid gap-5 lg:grid-cols-5">
      {/* ── Controls panel ── */}
      <div className="flex flex-col gap-4 lg:col-span-2">

        {/* Theme toggle */}
        <div className="rounded-2xl border p-4" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="mb-3 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>
            Preview Theme
          </div>
          <div className="flex gap-2">
            {[
              { id: "dark", icon: <Moon size={14} />, label: "Dark" },
              { id: "light", icon: <Sun size={14} />, label: "Light" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setPreviewTheme(t.id)}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-semibold transition-all"
                style={{
                  backgroundColor: previewTheme === t.id ? roles.primary : "var(--surface)",
                  color: previewTheme === t.id ? getTextColor(roles.primary) : "var(--text-muted)",
                  border: `1px solid ${previewTheme === t.id ? "transparent" : "var(--border)"}`,
                }}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Role pickers */}
        <div className="rounded-2xl border p-4" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="mb-3 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>
            Palette Roles
          </div>
          <div className="space-y-2">
            {Object.entries(ROLE_LABELS).map(([role, label]) => (
              <div key={role} className="flex items-center gap-3 rounded-xl p-2.5" style={{ backgroundColor: "var(--surface)" }}>
                <div
                  className="h-8 w-8 shrink-0 rounded-lg border-2 shadow cursor-pointer"
                  style={{ backgroundColor: roles[role], borderColor: "rgba(255,255,255,0.15)" }}
                  onClick={() => {
                    const inp = document.getElementById(`role-input-${role}`);
                    inp?.click();
                  }}
                />
                <input
                  id={`role-input-${role}`}
                  type="color"
                  value={roles[role]}
                  onChange={(e) => setRole(role, e.target.value)}
                  className="sr-only"
                />
                <span className="flex-1 text-xs font-semibold" style={{ color: "var(--text)" }}>{label}</span>
                <select
                  value={roles[role]}
                  onChange={(e) => setRole(role, e.target.value)}
                  className="min-w-0 max-w-[110px] rounded-lg border px-2 py-1.5 font-mono text-xs outline-none"
                  style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border-md)", color: "var(--text)" }}
                >
                  {palette.map((color) => (
                    <option key={`${role}-${color}`} value={color}>{color.toUpperCase()}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>

        {/* Contrast badge */}
        <div className="rounded-2xl border p-4" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>
            Text / BG Contrast
          </div>
          <div className="flex items-end gap-1.5">
            <span className="text-3xl font-black" style={{ color: ratio >= 4.5 ? "#22c55e" : ratio >= 3 ? "#f59e0b" : "#ef4444" }}>
              {ratio.toFixed(2)}
            </span>
            <span className="pb-0.5 text-sm" style={{ color: "var(--text-muted)" }}>:1</span>
          </div>
          <div className="mt-1 text-xs" style={{ color: "var(--text-muted)" }}>
            {ratio >= 7 ? "✓ AAA ready" : ratio >= 4.5 ? "✓ AA ready" : "✗ Needs stronger contrast"}
          </div>
        </div>
      </div>

      {/* ── Live website mockup ── */}
      <div className="lg:col-span-3">
        {/* Browser chrome */}
        <div className="rounded-2xl border overflow-hidden shadow-2xl" style={{ borderColor: "var(--border)" }}>
          {/* Browser toolbar */}
          <div className="flex items-center gap-3 px-4 py-2.5 border-b" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}>
            <div className="flex gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
            </div>
            <div className="flex flex-1 items-center gap-2 rounded-lg border px-3 py-1" style={{ backgroundColor: "var(--bg)", borderColor: "var(--border-md)" }}>
              <Monitor size={10} style={{ color: "var(--text-faint)" }} />
              <span className="flex-1 text-center font-mono text-[10px]" style={{ color: "var(--text-muted)" }}>
                chromalab.app/preview
              </span>
            </div>
          </div>

          {/* Actual website */}
          <div style={{ backgroundColor: roles.background, color: roles.text, minHeight: 500 }}>

            {/* Site navbar */}
            <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: `${roles.text}18`, backgroundColor: `${roles.surface}` }}>
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-lg" style={{ backgroundColor: roles.primary }} />
                <span className="text-sm font-black" style={{ color: roles.text }}>Acme Inc</span>
              </div>
              <div className="hidden sm:flex items-center gap-6 text-xs" style={{ color: `${roles.text}99` }}>
                {["Products", "Solutions", "Pricing", "Blog"].map((l) => (
                  <span key={l} className="cursor-pointer hover:opacity-100 transition-opacity">{l}</span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button className="hidden sm:flex items-center gap-1.5 rounded-lg border px-3.5 py-1.5 text-xs font-semibold" style={{ borderColor: `${roles.text}30`, color: roles.text }}>
                  Sign in
                </button>
                <button className="rounded-lg px-3.5 py-1.5 text-xs font-bold" style={{ backgroundColor: roles.primary, color: getTextColor(roles.primary) }}>
                  Get started
                </button>
              </div>
            </div>

            {/* Hero */}
            <div className="px-6 py-10 text-center">
              <div
                className="mb-4 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold"
                style={{ borderColor: `${roles.primary}55`, backgroundColor: `${roles.primary}18`, color: roles.primary }}
              >
                <Zap size={11} /> New: AI-powered color matching
              </div>
              <h2 className="mb-4 text-3xl font-black leading-tight" style={{ color: roles.text, letterSpacing: "-0.025em" }}>
                Build stunning interfaces<br />
                <span style={{ color: roles.primary }}>in minutes.</span>
              </h2>
              <p className="mx-auto mb-7 max-w-md text-sm leading-relaxed" style={{ color: `${roles.text}99` }}>
                The all-in-one design platform for modern teams. Collaborate, prototype, and ship faster than ever before.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <button className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold shadow-lg" style={{ backgroundColor: roles.primary, color: getTextColor(roles.primary), boxShadow: `0 6px 20px ${roles.primary}44` }}>
                  Start for free <ArrowRight size={14} />
                </button>
                <button className="flex items-center gap-2 rounded-xl border px-5 py-2.5 text-sm font-semibold" style={{ borderColor: `${roles.text}30`, color: roles.text }}>
                  Watch demo
                </button>
              </div>

              {/* Social proof */}
              <div className="mt-6 flex items-center justify-center gap-3">
                <div className="flex -space-x-2">
                  {[roles.primary, roles.secondary, roles.accent].map((c, i) => (
                    <div key={i} className="h-6 w-6 rounded-full border-2" style={{ backgroundColor: c, borderColor: roles.background }} />
                  ))}
                </div>
                <span className="text-xs" style={{ color: `${roles.text}70` }}>
                  Trusted by <strong style={{ color: roles.text }}>12,000+</strong> designers
                </span>
              </div>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-3 gap-3 px-6 pb-6">
              {[
                { icon: <Zap size={16} />, title: "Fast", desc: "Ship in hours" },
                { icon: <Shield size={16} />, title: "Secure", desc: "SOC2 certified" },
                { icon: <BarChart3 size={16} />, title: "Analytics", desc: "Real-time data" },
              ].map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-xl border p-3 text-center"
                  style={{ backgroundColor: roles.surface, borderColor: `${roles.text}18` }}
                >
                  <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-lg" style={{ backgroundColor: `${roles.primary}25`, color: roles.primary }}>
                    {f.icon}
                  </div>
                  <div className="text-xs font-bold" style={{ color: roles.text }}>{f.title}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: `${roles.text}60` }}>{f.desc}</div>
                </motion.div>
              ))}
            </div>

            {/* CTA banner */}
            <div className="mx-6 mb-6 rounded-xl p-5 flex items-center justify-between" style={{ backgroundColor: roles.primary }}>
              <div>
                <div className="text-sm font-black" style={{ color: getTextColor(roles.primary) }}>Ready to transform your workflow?</div>
                <div className="text-xs mt-0.5" style={{ color: `${getTextColor(roles.primary)}99` }}>Join 12,000+ teams shipping faster</div>
              </div>
              <button className="shrink-0 rounded-lg px-4 py-2 text-xs font-bold" style={{ backgroundColor: getTextColor(roles.primary), color: roles.primary }}>
                Get started →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

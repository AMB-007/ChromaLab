import { useMemo } from "react";
import { Briefcase, Copy, Sparkles, Globe, Mail, MessageCircle } from "lucide-react";
import { generateColorScale, generateHarmony, getTextColor } from "../utils/colorUtils";

function buildBrand(base) {
  const triadic = generateHarmony(base, "triadic");
  const scale = generateColorScale(base);
  return {
    primary: base,
    secondary: triadic[1],
    accent: triadic[2],
    soft: scale[1].hex,
    mid: scale[4].hex,
    deep: scale[8].hex,
  };
}

export default function BrandMockup({ selectedColor = "#8b5cf6", showToast }) {
  const brand = useMemo(() => buildBrand(selectedColor), [selectedColor]);

  const copyPalette = () => {
    navigator.clipboard.writeText(JSON.stringify(brand, null, 2));
    showToast?.("Brand palette copied");
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header palette strip */}
      <div
        className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-4"
        style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>
            <Briefcase size={13} /> Brand System
          </div>
          <div className="flex overflow-hidden rounded-xl border" style={{ borderColor: "var(--border)" }}>
            {Object.values(brand).map((color) => (
              <div key={color} className="h-8 w-12" style={{ backgroundColor: color }} title={color} />
            ))}
          </div>
        </div>
        <button
          onClick={copyPalette}
          className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all hover:scale-105"
          style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)", color: "#fff" }}
        >
          <Copy size={12} /> Copy Tokens
        </button>
      </div>

      {/* 2×2 grid — all visible without scroll */}
      <div className="grid gap-4 sm:grid-cols-2">

        {/* App Icon */}
        <div className="rounded-2xl border p-4" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="mb-3 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>App Icon</div>
          <div className="flex items-center gap-4">
            {/* Large icon */}
            <div
              className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[20px] shadow-xl"
              style={{ background: `linear-gradient(135deg, ${brand.primary}, ${brand.accent})`, boxShadow: `0 8px 24px ${brand.primary}44` }}
            >
              <Sparkles size={36} color={getTextColor(brand.primary)} />
            </div>
            {/* Small icon variants */}
            <div className="flex flex-col gap-2">
              {[40, 28, 20].map((sz) => (
                <div
                  key={sz}
                  className="flex shrink-0 items-center justify-center rounded-lg"
                  style={{ width: sz, height: sz, background: `linear-gradient(135deg, ${brand.primary}, ${brand.accent})` }}
                >
                  <Sparkles size={sz * 0.45} color={getTextColor(brand.primary)} />
                </div>
              ))}
            </div>
            <div className="flex flex-col gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
              <div className="font-bold" style={{ color: "var(--text)" }}>ChromaLab</div>
              <div style={{ color: brand.primary }}>{brand.primary.toUpperCase()}</div>
              <div style={{ color: brand.accent }}>{brand.accent.toUpperCase()}</div>
            </div>
          </div>
        </div>

        {/* Business Card */}
        <div className="rounded-2xl border p-4" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="mb-3 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>Business Card</div>
          <div className="aspect-[1.8] rounded-xl p-4 shadow-xl flex flex-col justify-between relative overflow-hidden"
            style={{ backgroundColor: brand.deep }}>
            <div
              className="absolute -right-6 -top-6 h-24 w-24 rounded-full opacity-30"
              style={{ backgroundColor: brand.primary }}
            />
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg" style={{ backgroundColor: brand.primary }} />
              <span className="text-sm font-black" style={{ color: getTextColor(brand.deep) }}>ChromaLab</span>
            </div>
            <div>
              <div className="text-base font-black" style={{ color: getTextColor(brand.deep) }}>Alex Designer</div>
              <div className="text-[10px] opacity-60 mt-0.5" style={{ color: getTextColor(brand.deep) }}>Creative Director · hello@chromalab.dev</div>
            </div>
          </div>
        </div>

        {/* Social Banner */}
        <div className="rounded-2xl border p-4" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="mb-3 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>Social Banner</div>
          <div
            className="rounded-xl p-5 relative overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${brand.deep}, ${brand.primary} 60%, ${brand.accent})` }}
          >
            <div className="absolute -bottom-4 -right-4 h-24 w-24 rounded-full opacity-20" style={{ backgroundColor: "#fff" }} />
            <div className="mb-3 inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold" style={{ backgroundColor: "rgba(255,255,255,0.18)", color: "#fff" }}>
              New release
            </div>
            <h3 className="text-lg font-black leading-tight text-white">A complete visual identity<br />from one color.</h3>
            <div className="mt-3 flex gap-2">
              {[Globe, Mail, MessageCircle].map((Icon, i) => (
                <div key={i} className="h-7 w-7 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(255,255,255,0.15)" }}>
                  <Icon size={13} className="text-white" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Component buttons */}
        <div className="rounded-2xl border p-4" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="mb-3 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>Components</div>
          <div className="space-y-2">
            {[
              { label: "Primary Action", color: brand.primary },
              { label: "Secondary", color: brand.secondary },
              { label: "Accent", color: brand.accent },
            ].map(({ label, color }) => (
              <button
                key={label}
                className="w-full rounded-xl px-4 py-2.5 text-sm font-bold transition-all hover:scale-[1.01]"
                style={{ backgroundColor: color, color: getTextColor(color), boxShadow: `0 4px 14px ${color}44` }}
              >
                {label}
              </button>
            ))}
            <div className="mt-1 flex gap-2">
              <div className="flex-1 rounded-xl border px-3 py-2 text-xs font-semibold text-center" style={{ borderColor: brand.primary, color: brand.primary }}>
                Outlined
              </div>
              <div className="flex-1 rounded-xl px-3 py-2 text-xs font-semibold text-center" style={{ backgroundColor: `${brand.primary}18`, color: brand.primary }}>
                Ghost
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

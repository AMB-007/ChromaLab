import { useMemo, useState } from "react";
import { Check, Copy, Type } from "lucide-react";
import { generateColorScale, generateHarmony, getContrastRatio } from "../utils/colorUtils";

const FONTS = [
  { label: "Inter", value: "Inter, ui-sans-serif, system-ui, sans-serif" },
  { label: "Poppins", value: "Poppins, ui-sans-serif, system-ui, sans-serif" },
  { label: "Playfair Display", value: "Playfair Display, Georgia, serif" },
  { label: "Merriweather", value: "Merriweather, Georgia, serif" },
  { label: "JetBrains Mono", value: "JetBrains Mono, ui-monospace, SFMono-Regular, monospace" },
];

function buildPalette(base) {
  const scale = generateColorScale(base);
  return [...new Set([base, ...generateHarmony(base, "analogous"), ...generateHarmony(base, "triadic"), scale[2].hex, scale[7].hex])].slice(0, 8);
}

function Badge({ ratio }) {
  const label = ratio >= 7 ? "AAA" : ratio >= 4.5 ? "AA" : ratio >= 3 ? "Large" : "Fail";
  const color = ratio >= 4.5 ? "#22c55e" : ratio >= 3 ? "#f59e0b" : "#ef4444";
  return (
    <span className="rounded-full px-2 py-0.5 text-[10px] font-bold" style={{ backgroundColor: `${color}22`, color }}>
      {label}
    </span>
  );
}

export default function Typography({ selectedColor = "#8b5cf6", showToast }) {
  const [font, setFont] = useState(FONTS[0].value);
  const [fontLabel, setFontLabel] = useState(FONTS[0].label);
  const [background, setBackground] = useState("#0f172a");
  const [textColor, setTextColor] = useState("#f1f5f9");
  const [copied, setCopied] = useState(null);
  const palette = useMemo(() => buildPalette(selectedColor), [selectedColor]);

  const copyStyle = (color) => {
    const css = `font-family: ${font};\ncolor: ${color};`;
    navigator.clipboard.writeText(css);
    setCopied(color);
    setTimeout(() => setCopied(null), 1400);
    showToast?.("Text style copied");
  };

  return (
    <div className="grid gap-5 lg:grid-cols-5">
      {/* ── Controls left ── */}
      <div className="flex flex-col gap-4 lg:col-span-2">
        {/* Font + background */}
        <div className="rounded-2xl border p-4" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>
            <Type size={13} /> Controls
          </div>
          <div className="space-y-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--text-muted)" }}>Font family</label>
              <select
                value={font}
                onChange={(e) => {
                  setFont(e.target.value);
                  setFontLabel(FONTS.find(f => f.value === e.target.value)?.label || "");
                }}
                className="w-full rounded-xl border px-3 py-2 text-sm outline-none"
                style={{ backgroundColor: "var(--surface)", borderColor: "var(--border-md)", color: "var(--text)", fontFamily: font }}
              >
                {FONTS.map((item) => (
                  <option key={item.label} value={item.value} style={{ fontFamily: item.value }}>{item.label}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--text-muted)" }}>Background</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={background} onChange={(e) => setBackground(e.target.value)} className="h-9 w-9 rounded-lg cursor-pointer" />
                  <span className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>{background.toUpperCase()}</span>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold" style={{ color: "var(--text-muted)" }}>Text</label>
                <div className="flex items-center gap-2">
                  <input type="color" value={textColor} onChange={(e) => setTextColor(e.target.value)} className="h-9 w-9 rounded-lg cursor-pointer" />
                  <span className="font-mono text-xs" style={{ color: "var(--text-muted)" }}>{textColor.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contrast table */}
        <div className="rounded-2xl border p-4" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="mb-3 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>
            Contrast vs Background
          </div>
          <div className="space-y-1.5">
            {palette.map((color) => {
              const ratio = getContrastRatio(color, background);
              return (
                <button
                  key={color}
                  onClick={() => copyStyle(color)}
                  className="flex w-full items-center justify-between rounded-xl p-2 text-left transition-all"
                  style={{ backgroundColor: "var(--surface)" }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "var(--surface-hover)"}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "var(--surface)"}
                >
                  <span className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded-md border shadow-sm" style={{ backgroundColor: color, borderColor: "rgba(255,255,255,0.1)" }} />
                    <span className="font-mono text-xs" style={{ color: "var(--text-subtle)" }}>{color.toUpperCase()}</span>
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="font-mono text-xs" style={{ color: "var(--text-faint)" }}>{ratio.toFixed(1)}</span>
                    <Badge ratio={ratio} />
                    {copied === color ? <Check size={12} className="text-green-400" /> : <Copy size={11} style={{ color: "var(--text-faint)" }} />}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Live typography preview ── */}
      <div
        className="rounded-2xl border p-6 lg:col-span-3 overflow-hidden"
        style={{ backgroundColor: background, borderColor: "var(--border)", fontFamily: font }}
      >
        {/* Label */}
        <div className="mb-6 flex items-center justify-between">
          <span className="rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-widest"
            style={{ color: selectedColor, borderColor: `${selectedColor}55`, backgroundColor: `${selectedColor}18` }}>
            {fontLabel}
          </span>
          <span className="font-mono text-[10px]" style={{ color: `${textColor}50` }}>{background.toUpperCase()}</span>
        </div>

        {/* Type scale */}
        <div className="space-y-5">
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: `${textColor}50` }}>Display / H1</span>
            <div className="text-4xl font-black leading-tight" style={{ color: textColor }}>
              Color carries meaning.
            </div>
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: `${textColor}50` }}>Heading / H2</span>
            <div className="text-2xl font-bold" style={{ color: selectedColor }}>
              Typography shapes perception
            </div>
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: `${textColor}50` }}>Subheading / H3</span>
            <div className="text-lg font-semibold" style={{ color: textColor }}>
              Every typeface has a personality
            </div>
          </div>
          <div>
            <span className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: `${textColor}50` }}>Body / P</span>
            <p className="text-sm leading-relaxed" style={{ color: `${textColor}cc` }}>
              Test headings, body copy, captions, links, and labels against the current background before shipping a palette. Sufficient contrast ensures readability across devices and abilities.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2 border-t" style={{ borderColor: `${textColor}18` }}>
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: `${textColor}50` }}>Caption</span>
              <p className="text-xs" style={{ color: `${textColor}80` }}>Small supplemental text and metadata labels for supporting information.</p>
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: `${textColor}50` }}>Code / Mono</span>
              <code className="text-xs font-mono block" style={{ color: selectedColor, fontFamily: "JetBrains Mono, monospace" }}>
                color: {selectedColor};<br />
                font-family: "{fontLabel}";
              </code>
            </div>
          </div>

          {/* Swatches row */}
          <div className="flex gap-2 pt-1">
            {palette.slice(0, 6).map((color) => (
              <button
                key={color}
                onClick={() => copyStyle(color)}
                className="group relative flex-1 h-8 rounded-lg border transition-transform hover:scale-105"
                style={{ backgroundColor: color, borderColor: "rgba(255,255,255,0.1)" }}
                title={color}
              >
                <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  {copied === color ? <Check size={12} className="text-white" /> : <Copy size={10} className="text-white" />}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

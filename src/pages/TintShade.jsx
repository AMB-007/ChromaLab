import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, Check, Download } from "lucide-react";
import { generateColorScale, getTextColor } from "../utils/colorUtils";

const EXPORT_TABS = ["CSS Vars", "Tailwind", "SCSS", "JSON"];

function buildExport(scale, name, tab) {
  const safeName = name.replace(/\s+/g, "-").toLowerCase() || "color";
  switch (tab) {
    case "CSS Vars":
      return `:root {\n${scale.map((c) => `  --${safeName}-${c.step}: ${c.hex};`).join("\n")}\n}`;
    case "Tailwind":
      return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n        "${safeName}": {\n${scale.map((c) => `          ${c.step}: "${c.hex}",`).join("\n")}\n        },\n      },\n    },\n  },\n};`;
    case "SCSS":
      return scale.map((c) => `$${safeName}-${c.step}: ${c.hex};`).join("\n");
    case "JSON":
      return JSON.stringify(Object.fromEntries(scale.map((c) => [c.step, c.hex])), null, 2);
    default:
      return "";
  }
}

export default function TintShade({ selectedColor, showToast }) {
  const [baseColor, setBaseColor] = useState(selectedColor || "#8b5cf6");
  
  useEffect(() => {
    if (selectedColor) setBaseColor(selectedColor);
  }, [selectedColor]);

  const [colorName, setColorName] = useState("brand");
  const [tab, setTab] = useState("CSS Vars");
  const [copied, setCopied] = useState(null);

  const scale = useMemo(() => generateColorScale(baseColor), [baseColor]);
  const exportCode = useMemo(() => buildExport(scale, colorName, tab), [scale, colorName, tab]);

  function copyHex(hex) {
    navigator.clipboard.writeText(hex);
    setCopied(hex);
    setTimeout(() => setCopied(null), 1500);
    showToast?.(`Copied ${hex}`);
  }

  function copyAll() {
    navigator.clipboard.writeText(exportCode);
    showToast?.("Copied to clipboard!");
  }

  return (
    <div className="flex flex-col gap-5">

      {/* ── Input row ── */}
      <div
        className="flex flex-wrap items-end gap-4 rounded-2xl border p-4"
        style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
      >
        <div>
          <div className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>
            Base Color
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color" value={baseColor}
              onChange={(e) => setBaseColor(e.target.value)}
              className="h-10 w-10 cursor-pointer rounded-lg border-0"
            />
            <input
              type="text" value={baseColor.toUpperCase()}
              onChange={(e) => /^#[0-9A-Fa-f]{0,6}$/.test(e.target.value) && setBaseColor(e.target.value)}
              className="rounded-xl border px-3 py-2 font-mono text-sm w-28 outline-none"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--border-md)", color: "var(--text)" }}
            />
          </div>
        </div>

        <div>
          <div className="mb-2 text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>
            Scale Name
          </div>
          <input
            type="text" value={colorName} placeholder="brand"
            onChange={(e) => setColorName(e.target.value)}
            className="rounded-xl border px-3 py-2 text-sm w-28 outline-none"
            style={{ backgroundColor: "var(--surface)", borderColor: "var(--border-md)", color: "var(--text)" }}
          />
        </div>
      </div>

      {/* ── Scale swatches bar ── */}
      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
        <div className="flex">
          {scale.map((c, i) => (
            <motion.button
              key={c.step}
              initial={{ opacity: 0, scaleY: 0.7 }}
              animate={{ opacity: 1, scaleY: 1 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => copyHex(c.hex)}
              className="group flex-1 flex flex-col items-center justify-between pt-5 pb-2 cursor-pointer relative overflow-hidden"
              style={{ backgroundColor: c.hex, minHeight: 110 }}
              title={`${c.step}: ${c.hex} — click to copy`}
            >
              <span className="text-[9px] font-bold" style={{ color: getTextColor(c.hex), opacity: 0.7 }}>
                {c.step}
              </span>
              <div className="flex flex-col items-center gap-1">
                {copied === c.hex ? (
                  <Check size={12} style={{ color: getTextColor(c.hex) }} />
                ) : (
                  <Copy size={11} className="opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: getTextColor(c.hex) }} />
                )}
                <span className="font-mono text-[9px] opacity-0 group-hover:opacity-80 transition-opacity"
                  style={{ color: getTextColor(c.hex) }}>
                  {c.hex.slice(1)}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Details + Export side by side ── */}
      <div className="grid gap-5 lg:grid-cols-2">
        {/* Scale details */}
        <div className="rounded-2xl border" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="p-4 border-b" style={{ borderColor: "var(--border)" }}>
            <div className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>
              Scale Details
            </div>
          </div>
          <div className="p-3 space-y-1 max-h-72 overflow-y-auto custom-scrollbar">
            {scale.map((c) => (
              <div key={c.step} className="flex items-center gap-3 rounded-xl px-3 py-2"
                style={{ backgroundColor: "var(--surface)" }}>
                <div className="h-6 w-6 rounded-md border shadow-sm" style={{ backgroundColor: c.hex, borderColor: "var(--border-md)" }} />
                <span className="w-10 text-xs font-semibold" style={{ color: "var(--text-muted)" }}>{c.step}</span>
                <span className="flex-1 font-mono text-xs" style={{ color: "var(--text-subtle)" }}>{c.hex.toUpperCase()}</span>
                <button onClick={() => copyHex(c.hex)} className="p-1 rounded transition-colors hover:text-violet-400"
                  style={{ color: "var(--text-faint)" }}>
                  {copied === c.hex ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Export */}
        <div className="rounded-2xl border" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="border-b p-4" style={{ borderColor: "var(--border)" }}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex gap-1 flex-wrap">
                {EXPORT_TABS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className="rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all"
                    style={{
                      backgroundColor: tab === t ? "var(--btn-inv-bg)" : "var(--surface)",
                      color: tab === t ? "var(--btn-inv-text)" : "var(--text-muted)",
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <button
                onClick={copyAll}
                className="flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)", color: "#fff" }}
              >
                <Copy size={11} /> Copy
              </button>
            </div>
          </div>
          <pre
            className="overflow-x-auto p-4 font-mono text-xs max-h-72 overflow-y-auto custom-scrollbar"
            style={{ color: "var(--text-subtle)" }}
          >
            {exportCode}
          </pre>
        </div>
      </div>

    </div>
  );
}

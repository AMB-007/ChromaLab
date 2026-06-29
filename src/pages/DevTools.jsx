import { useMemo, useState } from "react";
import { Check, Code2, Copy } from "lucide-react";
import { generateColorScale, hexToAllFormats } from "../utils/colorUtils";

const TABS = ["CSS Variables", "Tailwind", "SCSS", "Snippets"];

function safeName(name) {
  return name.trim().replace(/[^a-zA-Z0-9]+/g, "-").replace(/^-|-$/g, "").toLowerCase() || "brand";
}

function formatCode(scale, colorName, hex, tab) {
  const name = safeName(colorName);
  const fmt = hexToAllFormats(hex);

  if (tab === "CSS Variables") {
    return `:root {\n${scale.map((c) => `  --${name}-${c.step}: ${c.hex};`).join("\n")}\n  --${name}: ${hex.toUpperCase()};\n}`;
  }

  if (tab === "Tailwind") {
    return `theme: {\n  extend: {\n    colors: {\n      ${name}: {\n${scale.map((c) => `        ${c.step}: "${c.hex}",`).join("\n")}\n      },\n    },\n  },\n}`;
  }

  if (tab === "SCSS") {
    return `$${name}: ${hex.toUpperCase()};\n${scale.map((c) => `$${name}-${c.step}: ${c.hex};`).join("\n")}`;
  }

  return [
    `HEX: ${fmt.hex}`,
    `RGB: rgb(${fmt.rgb.r}, ${fmt.rgb.g}, ${fmt.rgb.b})`,
    `HSL: hsl(${Math.round(fmt.hsl.h)}, ${Math.round(fmt.hsl.s)}%, ${Math.round(fmt.hsl.l)}%)`,
    `HSB: hsb(${Math.round(fmt.hsb.h)}, ${Math.round(fmt.hsb.s)}%, ${Math.round(fmt.hsb.v)}%)`,
    `CMYK: cmyk(${fmt.cmyk.c}%, ${fmt.cmyk.m}%, ${fmt.cmyk.y}%, ${fmt.cmyk.k}%)`,
    `LAB: lab(${fmt.lab.l} ${fmt.lab.a} ${fmt.lab.b})`,
    `CSS Var: var(--${name})`,
  ].join("\n");
}

export default function DevTools({ selectedColor = "#8b5cf6", onColorChange, showToast }) {
  const [tab, setTab] = useState(TABS[0]);
  const [name, setName] = useState("brand");
  const [copied, setCopied] = useState(false);
  const scale = useMemo(() => generateColorScale(selectedColor), [selectedColor]);
  const code = useMemo(() => formatCode(scale, name, selectedColor, tab), [scale, name, selectedColor, tab]);

  const copyAll = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
    showToast?.(`${tab} copied`);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="flex flex-col gap-4 lg:col-span-2">
        <div className="rounded-2xl border p-5" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-label)" }}>
            <Code2 size={14} />
            Token Source
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <input
              type="color"
              value={selectedColor}
              onChange={(e) => onColorChange?.(e.target.value)}
              className="h-12 w-12 rounded-xl"
            />
            <input
              value={selectedColor.toUpperCase()}
              onChange={(e) => /^#[0-9A-Fa-f]{6}$/.test(e.target.value) && onColorChange?.(e.target.value)}
              className="w-32 rounded-lg border px-3 py-2 font-mono text-sm outline-none"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--border-md)", color: "var(--text)" }}
            />
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm outline-none"
              style={{ backgroundColor: "var(--surface)", borderColor: "var(--border-md)", color: "var(--text)" }}
              placeholder="Token name"
            />
          </div>
        </div>

        <div className="rounded-2xl border p-5" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-label)" }}>
            Scale Preview
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 lg:grid-cols-3">
            {scale.map((color) => (
              <button
                key={color.step}
                onClick={() => {
                  navigator.clipboard.writeText(color.hex);
                  showToast?.(`Copied ${color.hex}`);
                }}
                className="overflow-hidden rounded-xl border text-left"
                style={{ borderColor: "var(--border)" }}
              >
                <div className="h-12" style={{ backgroundColor: color.hex }} />
                <div className="p-2" style={{ backgroundColor: "var(--surface)" }}>
                  <div className="text-xs font-bold" style={{ color: "var(--text)" }}>{color.step}</div>
                  <div className="font-mono text-[10px]" style={{ color: "var(--text-faint)" }}>{color.hex}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border lg:col-span-3" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
        <div className="flex flex-wrap items-center justify-between gap-3 border-b p-4" style={{ borderColor: "var(--border)" }}>
          <div className="flex flex-wrap gap-1">
            {TABS.map((item) => (
              <button
                key={item}
                onClick={() => setTab(item)}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold"
                style={{
                  backgroundColor: tab === item ? "var(--btn-inv-bg)" : "var(--surface)",
                  color: tab === item ? "var(--btn-inv-text)" : "var(--text-muted)",
                }}
              >
                {item}
              </button>
            ))}
          </div>
          <button
            onClick={copyAll}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-white"
            style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)" }}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
            Copy All
          </button>
        </div>
        <pre className="max-h-[560px] overflow-auto p-5 font-mono text-xs leading-relaxed" style={{ color: "var(--text-subtle)" }}>
          {code}
        </pre>
      </div>
    </div>
  );
}

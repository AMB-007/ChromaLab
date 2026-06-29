import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Link, FileText, Copy, Check, X, Plus, Image } from "lucide-react";

function extractHexColors(text) {
  const matches = text.match(/#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})\b/g) || [];
  const expanded = matches.map((hex) => {
    if (hex.length === 4) {
      // Expand shorthand #abc → #aabbcc
      return "#" + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    }
    return hex.toLowerCase();
  });
  return [...new Set(expanded)];
}

function extractRgbColors(text) {
  const matches = text.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/gi) || [];
  return matches.map((m) => {
    const [, r, g, b] = m.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
    return "#" + [r, g, b].map((v) => parseInt(v).toString(16).padStart(2, "0")).join("");
  });
}

function parseCoolorsUrl(url) {
  try {
    const match = url.match(/coolors\.co\/([0-9a-fA-F-]+)/);
    if (match) {
      return match[1].split("-").map((h) => "#" + h);
    }
  } catch {}
  return [];
}

function parseInput(text) {
  const coolorsColors = parseCoolorsUrl(text);
  if (coolorsColors.length > 0) return coolorsColors;
  const hexColors = extractHexColors(text);
  const rgbColors = extractRgbColors(text);
  return [...new Set([...hexColors, ...rgbColors])].filter((c) => /^#[0-9a-f]{6}$/.test(c));
}

const TABS = [
  { id: "text", label: "CSS / Text", icon: <FileText size={14} /> },
  { id: "url", label: "Coolors URL", icon: <Link size={14} /> },
  { id: "hex", label: "Hex List", icon: <Plus size={14} /> },
];

export default function PaletteImport({ onApplyColor, showToast }) {
  const [activeTab, setActiveTab] = useState("text");
  const [input, setInput] = useState("");
  const [colors, setColors] = useState([]);
  const [copied, setCopied] = useState(null);
  const [error, setError] = useState("");

  const parse = () => {
    setError("");
    const parsed = parseInput(input);
    if (parsed.length === 0) {
      setError("No valid colors found. Try pasting CSS, a Coolors URL, or hex codes.");
      return;
    }
    setColors(parsed);
  };

  const applyColor = (hex) => {
    onApplyColor?.(hex);
    showToast?.(`Applied ${hex}`);
  };

  const copyHex = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopied(hex);
    setTimeout(() => setCopied(null), 1200);
  };

  const examples = {
    text: `/* Example CSS */\ncolor: #8b5cf6;\nbackground: rgb(236, 72, 153);\nborder: 1px solid #0ea5e9;`,
    url: `https://coolors.co/8b5cf6-ec4899-06b6d4-22c55e-f59e0b`,
    hex: `#8b5cf6, #ec4899, #06b6d4\n#22c55e\n#f59e0b`,
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ background: "linear-gradient(135deg,#06b6d4,#8b5cf6)", boxShadow: "0 4px 14px rgba(6,182,212,0.35)" }}
        >
          <Upload size={18} className="text-white" />
        </div>
        <div>
          <div className="text-sm font-black" style={{ color: "var(--text)" }}>Palette Import</div>
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>Import from CSS, Coolors URL, or hex list</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 rounded-xl border p-1" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border-md)" }}>
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setColors([]); setError(""); setInput(""); }}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-all"
            style={{
              backgroundColor: activeTab === tab.id ? "var(--bg-card)" : "transparent",
              color: activeTab === tab.id ? "var(--text)" : "var(--text-muted)",
              boxShadow: activeTab === tab.id ? "0 1px 4px rgba(0,0,0,0.15)" : "none",
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Input area */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
            {activeTab === "text" ? "Paste CSS or any text with color values" :
             activeTab === "url" ? "Paste a Coolors.co share URL" :
             "Paste hex codes (comma or newline separated)"}
          </label>
          <button
            onClick={() => setInput(examples[activeTab])}
            className="text-[10px] font-semibold transition-colors"
            style={{ color: "var(--text-faint)" }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#8b5cf6"}
            onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-faint)"}
          >
            Load example
          </button>
        </div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={5}
          placeholder={examples[activeTab]}
          className="w-full resize-none rounded-xl border px-4 py-3 font-mono text-xs outline-none transition-all custom-scrollbar"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border-md)",
            color: "var(--text)",
            lineHeight: 1.6,
          }}
        />
        {error && (
          <div className="flex items-center gap-2 rounded-xl border px-3 py-2 text-xs" style={{ borderColor: "rgba(239,68,68,0.3)", backgroundColor: "rgba(239,68,68,0.05)", color: "#f87171" }}>
            <X size={13} /> {error}
          </div>
        )}
        <button
          onClick={parse}
          disabled={!input.trim()}
          className="rounded-xl py-2.5 text-sm font-semibold transition-all hover:scale-[1.01] disabled:opacity-50"
          style={{ background: "linear-gradient(135deg,#06b6d4,#8b5cf6)", color: "#fff" }}
        >
          Extract Colors
        </button>
      </div>

      {/* Results */}
      <AnimatePresence>
        {colors.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-4"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>
                {colors.length} color{colors.length !== 1 ? "s" : ""} found
              </span>
              <button
                onClick={() => { navigator.clipboard.writeText(JSON.stringify(colors)); showToast?.("All colors copied"); }}
                className="flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-all hover:scale-105"
                style={{ borderColor: "var(--border-md)", color: "var(--text-muted)", backgroundColor: "var(--surface)" }}
              >
                <Copy size={11} /> Copy All
              </button>
            </div>

            {/* Swatch strip */}
            <div className="flex gap-0 overflow-hidden rounded-2xl border" style={{ borderColor: "var(--border)" }}>
              {colors.map((hex) => (
                <div
                  key={hex}
                  className="flex-1"
                  style={{ backgroundColor: hex, minHeight: 64 }}
                />
              ))}
            </div>

            {/* Color list */}
            <div className="space-y-1.5">
              {colors.map((hex) => (
                <div
                  key={hex}
                  className="flex items-center gap-3 rounded-xl p-3"
                  style={{ backgroundColor: "var(--surface)" }}
                >
                  <div className="h-8 w-8 shrink-0 rounded-lg border shadow-sm" style={{ backgroundColor: hex, borderColor: "rgba(255,255,255,0.12)" }} />
                  <span className="flex-1 font-mono text-sm font-semibold" style={{ color: "var(--text)" }}>{hex.toUpperCase()}</span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => copyHex(hex)}
                      className="flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-all hover:scale-105"
                      style={{ borderColor: "var(--border-md)", color: "var(--text-muted)", backgroundColor: "var(--bg-card)" }}
                    >
                      {copied === hex ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
                    </button>
                    <button
                      onClick={() => applyColor(hex)}
                      className="rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-all hover:scale-105"
                      style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)", color: "#fff" }}
                    >
                      Apply
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

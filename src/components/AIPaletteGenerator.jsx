import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, RefreshCw, Copy, Check, ChevronRight, Wand2 } from "lucide-react";

/* ── Curated mood → palette dataset ─────────────────────────
   Each entry: { keywords[], palettes: string[][] }
   Multiple palettes per mood — one is picked at random.
   ──────────────────────────────────────────────────────── */
const MOOD_DB = [
  {
    keywords: ["ocean", "sea", "water", "wave", "marine", "aqua", "coastal"],
    palettes: [
      ["#0c4a6e", "#0369a1", "#0ea5e9", "#38bdf8", "#e0f2fe"],
      ["#164e63", "#0e7490", "#06b6d4", "#67e8f9", "#cffafe"],
      ["#134e4a", "#0f766e", "#14b8a6", "#5eead4", "#ccfbf1"],
    ],
  },
  {
    keywords: ["sunset", "dusk", "golden", "warm", "evening", "twilight"],
    palettes: [
      ["#7c2d12", "#ea580c", "#fb923c", "#fbbf24", "#fef3c7"],
      ["#881337", "#e11d48", "#fb7185", "#fb923c", "#fde68a"],
      ["#4c1d95", "#7c3aed", "#ec4899", "#f97316", "#fbbf24"],
    ],
  },
  {
    keywords: ["forest", "nature", "earth", "organic", "botanical", "green", "leaf"],
    palettes: [
      ["#14532d", "#15803d", "#4ade80", "#86efac", "#dcfce7"],
      ["#365314", "#4d7c0f", "#84cc16", "#bef264", "#f7fee7"],
      ["#1c1917", "#292524", "#57534e", "#78716c", "#d6d3d1"],
    ],
  },
  {
    keywords: ["tech", "startup", "digital", "corporate", "fintech", "saas", "modern"],
    palettes: [
      ["#1e3a8a", "#1d4ed8", "#3b82f6", "#93c5fd", "#eff6ff"],
      ["#312e81", "#4338ca", "#6366f1", "#a5b4fc", "#eef2ff"],
      ["#0f172a", "#1e293b", "#334155", "#64748b", "#f1f5f9"],
    ],
  },
  {
    keywords: ["luxury", "premium", "elegant", "gold", "sophisticated", "brand", "fashion"],
    palettes: [
      ["#1c1917", "#44403c", "#a8a29e", "#d4a843", "#fef3c7"],
      ["#0f172a", "#1e293b", "#475569", "#94a3b8", "#f8fafc"],
      ["#3b0764", "#6b21a8", "#a855f7", "#e9d5ff", "#fdf4ff"],
    ],
  },
  {
    keywords: ["candy", "pastel", "soft", "sweet", "gentle", "light", "girly", "cute"],
    palettes: [
      ["#fce7f3", "#fbcfe8", "#f9a8d4", "#f472b6", "#db2777"],
      ["#fdf4ff", "#f5d0fe", "#e879f9", "#c026d3", "#7e22ce"],
      ["#fff1f2", "#fecdd3", "#fda4af", "#fb7185", "#e11d48"],
    ],
  },
  {
    keywords: ["dark", "noir", "moody", "dramatic", "gothic", "shadow", "night", "deep"],
    palettes: [
      ["#09090b", "#18181b", "#27272a", "#71717a", "#a1a1aa"],
      ["#0a0a0a", "#171717", "#262626", "#525252", "#a3a3a3"],
      ["#0f172a", "#1e293b", "#334155", "#475569", "#94a3b8"],
    ],
  },
  {
    keywords: ["fire", "energy", "bold", "vibrant", "hot", "intense", "power"],
    palettes: [
      ["#7f1d1d", "#b91c1c", "#ef4444", "#f97316", "#fbbf24"],
      ["#4c1d95", "#7c3aed", "#ec4899", "#f43f5e", "#fb923c"],
      ["#1e3a8a", "#7c3aed", "#ec4899", "#f43f5e", "#fb923c"],
    ],
  },
  {
    keywords: ["minimal", "clean", "simple", "neutral", "white", "minimal", "pure"],
    palettes: [
      ["#fafafa", "#e4e4e7", "#a1a1aa", "#52525b", "#18181b"],
      ["#f9fafb", "#e5e7eb", "#9ca3af", "#4b5563", "#111827"],
      ["#f8fafc", "#e2e8f0", "#94a3b8", "#475569", "#0f172a"],
    ],
  },
  {
    keywords: ["retro", "vintage", "70s", "80s", "nostalgic", "old", "classic"],
    palettes: [
      ["#78350f", "#b45309", "#d97706", "#a16207", "#fef3c7"],
      ["#4a1942", "#7b2d8b", "#c44dff", "#ff6b9d", "#ffd93d"],
      ["#1a1a2e", "#16213e", "#0f3460", "#e94560", "#f5a623"],
    ],
  },
];

function findPaletteForMood(query) {
  const q = query.toLowerCase().trim();
  // Find best matching entry
  let bestEntry = null;
  let bestScore = 0;
  for (const entry of MOOD_DB) {
    const score = entry.keywords.filter((kw) => q.includes(kw) || kw.includes(q)).length;
    if (score > bestScore) {
      bestScore = score;
      bestEntry = entry;
    }
  }
  // Fallback: random entry
  if (!bestEntry || bestScore === 0) {
    bestEntry = MOOD_DB[Math.floor(Math.random() * MOOD_DB.length)];
  }
  // Pick random palette from matched entry
  const palettes = bestEntry.palettes;
  return palettes[Math.floor(Math.random() * palettes.length)];
}

/* ── Component ────────────────────────────────────────────── */
export default function AIPaletteGenerator({ onApplyColor, onClose, showToast }) {
  const [query, setQuery] = useState("");
  const [palette, setPalette] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(null);

  const SUGGESTIONS = ["ocean sunset", "tech startup", "forest morning", "luxury brand", "dark noir", "candy pastel", "fire energy", "minimal clean"];

  const generate = (q = query) => {
    if (!q.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setPalette(findPaletteForMood(q));
      setLoading(false);
    }, 600);
  };

  const copyHex = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopied(hex);
    setTimeout(() => setCopied(null), 1200);
    showToast?.(`Copied ${hex}`);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(JSON.stringify(palette));
    showToast?.("Palette copied as JSON");
  };

  const applyColor = (hex) => {
    onApplyColor?.(hex);
    showToast?.(`Applied ${hex} as primary color`);
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)", boxShadow: "0 4px 14px rgba(139,92,246,0.4)" }}
        >
          <Wand2 size={18} className="text-white" />
        </div>
        <div>
          <div className="text-sm font-black" style={{ color: "var(--text)" }}>AI Palette Generator</div>
          <div className="text-xs" style={{ color: "var(--text-muted)" }}>Describe a mood, scene, or brand</div>
        </div>
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && generate()}
          placeholder="e.g. ocean sunset, tech startup, forest morning..."
          className="flex-1 rounded-xl border px-4 py-2.5 text-sm outline-none transition-all"
          style={{
            backgroundColor: "var(--surface)",
            borderColor: "var(--border-md)",
            color: "var(--text)",
          }}
        />
        <button
          onClick={() => generate()}
          disabled={!query.trim() || loading}
          className="flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)", color: "#fff" }}
        >
          {loading ? <RefreshCw size={15} className="animate-spin" /> : <Sparkles size={15} />}
          Generate
        </button>
      </div>

      {/* Suggestions */}
      <div className="flex flex-wrap gap-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            onClick={() => { setQuery(s); generate(s); }}
            className="rounded-full border px-3 py-1 text-xs font-medium transition-all hover:scale-105"
            style={{ borderColor: "var(--border-md)", color: "var(--text-muted)", backgroundColor: "var(--surface)" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#8b5cf6";
              e.currentTarget.style.color = "#a78bfa";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--border-md)";
              e.currentTarget.style.color = "var(--text-muted)";
            }}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Result */}
      <AnimatePresence mode="wait">
        {palette && !loading && (
          <motion.div
            key={palette.join(",")}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-4"
          >
            {/* Swatches */}
            <div className="flex overflow-hidden rounded-2xl border" style={{ borderColor: "var(--border)" }}>
              {palette.map((hex) => (
                <motion.div
                  key={hex}
                  className="group flex-1 flex flex-col items-center justify-end gap-1 pb-3 pt-10 relative cursor-pointer"
                  style={{ backgroundColor: hex }}
                  initial={{ opacity: 0, scaleY: 0.5 }}
                  animate={{ opacity: 1, scaleY: 1 }}
                  transition={{ duration: 0.35 }}
                >
                  <span className="font-mono text-[9px] font-bold opacity-70 text-white">{hex.slice(1).toUpperCase()}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => copyHex(hex)}
                      className="rounded p-1 bg-black/20 hover:bg-black/40 transition-colors"
                      title="Copy hex"
                    >
                      {copied === hex ? <Check size={10} className="text-white" /> : <Copy size={10} className="text-white" />}
                    </button>
                    <button
                      onClick={() => applyColor(hex)}
                      className="rounded p-1 bg-black/20 hover:bg-black/40 transition-colors"
                      title="Apply as primary"
                    >
                      <ChevronRight size={10} className="text-white" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={copyAll}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-semibold transition-all hover:scale-105"
                style={{ borderColor: "var(--border-md)", color: "var(--text-muted)", backgroundColor: "var(--surface)" }}
              >
                <Copy size={13} /> Copy JSON
              </button>
              <button
                onClick={() => generate()}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-semibold transition-all hover:scale-105"
                style={{ borderColor: "var(--border-md)", color: "var(--text-muted)", backgroundColor: "var(--surface)" }}
              >
                <RefreshCw size={13} /> Regenerate
              </button>
              <button
                onClick={() => applyColor(palette[0])}
                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-semibold transition-all hover:scale-105"
                style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)", color: "#fff" }}
              >
                <Sparkles size={13} /> Apply All
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!palette && !loading && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border py-12 text-center" style={{ borderColor: "var(--border)", borderStyle: "dashed" }}>
          <div
            className="flex h-12 w-12 items-center justify-center rounded-2xl"
            style={{ background: "linear-gradient(135deg,rgba(139,92,246,0.15),rgba(236,72,153,0.15))" }}
          >
            <Wand2 size={22} style={{ color: "#8b5cf6" }} />
          </div>
          <div className="text-sm font-semibold" style={{ color: "var(--text-muted)" }}>
            Describe a vibe to generate a palette
          </div>
          <div className="text-xs" style={{ color: "var(--text-faint)" }}>
            Try "ocean sunset" or "tech startup"
          </div>
        </div>
      )}
    </div>
  );
}

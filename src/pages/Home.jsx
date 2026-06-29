import { useState } from "react";
import { motion } from "framer-motion";
import {
  CircleDot,
  Palette,
  Contrast,
  Eye,
  ArrowRight,
  Zap,
  Shield,
  Lightbulb,
  CheckCircle2,
  Layers,
  Blend,
  SlidersHorizontal,
  Pipette,
  Image as ImageIcon,
  Code2,
  LayoutTemplate,
  BarChart3,
  Type,
  Briefcase,
  Star,
  Sparkles,
  Wand2,
  Upload,
} from "lucide-react";

/* ─── Tool card data ─────────────────────────────────────────── */
const TOOLS = [
  {
    id: "wheel",
    icon: <CircleDot size={22} />,
    label: "Color Wheel",
    tagline: "Explore the HSL spectrum",
    description:
      "Click or drag on an interactive color wheel to pick any hue. Instantly see hex, RGB, and HSL breakdowns.",
    gradient: "linear-gradient(135deg, #8b5cf6, #6366f1)",
    glowColor: "rgba(139, 92, 246, 0.3)",
    accentColor: "#8b5cf6",
    swatch: ["#8b5cf6", "#6366f1", "#a78bfa", "#c4b5fd"],
    category: "Core",
  },
  {
    id: "harmony",
    icon: <Palette size={22} />,
    label: "Color Harmonies",
    tagline: "Build beautiful palettes",
    description:
      "Generate complementary, analogous, triadic, and 4 more harmony types from any base color.",
    gradient: "linear-gradient(135deg, #d946ef, #ec4899)",
    glowColor: "rgba(217, 70, 239, 0.3)",
    accentColor: "#d946ef",
    swatch: ["#d946ef", "#ec4899", "#f472b6", "#e879f9"],
    category: "Core",
  },
  {
    id: "contrast",
    icon: <Contrast size={22} />,
    label: "Contrast Checker",
    tagline: "WCAG accessibility",
    description:
      "Test foreground/background pairs against WCAG 2.1 AA and AAA standards with live preview.",
    gradient: "linear-gradient(135deg, #f59e0b, #f97316)",
    glowColor: "rgba(251, 191, 36, 0.3)",
    accentColor: "#f59e0b",
    swatch: ["#f59e0b", "#f97316", "#fbbf24", "#fb923c"],
    category: "Accessibility",
  },
  {
    id: "colorblind",
    icon: <Eye size={22} />,
    label: "Colorblind Sim",
    tagline: "Design inclusively",
    description:
      "Preview how your palette looks to people with protanopia, deuteranopia, tritanopia, or achromatopsia.",
    gradient: "linear-gradient(135deg, #06b6d4, #3b82f6)",
    glowColor: "rgba(6, 182, 212, 0.3)",
    accentColor: "#06b6d4",
    swatch: ["#06b6d4", "#3b82f6", "#22d3ee", "#60a5fa"],
    category: "Accessibility",
  },
  {
    id: "gradient",
    icon: <Layers size={22} />,
    label: "Gradient Generator",
    tagline: "Beautiful CSS Gradients",
    description:
      "Build linear, radial, and conic CSS gradients with adjustable stops, angles, and colors.",
    gradient: "linear-gradient(135deg, #f43f5e, #f97316)",
    glowColor: "rgba(244, 63, 94, 0.3)",
    accentColor: "#f43f5e",
    swatch: ["#f43f5e", "#fb7185", "#fda4af", "#ffe4e6"],
    category: "Create",
  },
  {
    id: "mixer",
    icon: <Blend size={22} />,
    label: "Color Mixer",
    tagline: "Blend colors easily",
    description:
      "Blend two colors and preview intermediate steps. Discover the perfect transition color.",
    gradient: "linear-gradient(135deg, #3b82f6, #6366f1)",
    glowColor: "rgba(59, 130, 246, 0.3)",
    accentColor: "#3b82f6",
    swatch: ["#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"],
    category: "Create",
  },
  {
    id: "scale",
    icon: <SlidersHorizontal size={22} />,
    label: "Tints & Shades",
    tagline: "Scale your colors",
    description:
      "Generate Tailwind-style 50–950 scales and export design tokens for your system.",
    gradient: "linear-gradient(135deg, #10b981, #06b6d4)",
    glowColor: "rgba(16, 185, 129, 0.3)",
    accentColor: "#10b981",
    swatch: ["#10b981", "#34d399", "#6ee7b7", "#a7f3d0"],
    category: "Create",
  },
  {
    id: "converter",
    icon: <Pipette size={22} />,
    label: "Color Converter",
    tagline: "Translate color spaces",
    description:
      "Edit and convert HEX, RGB, HSL, HSB, CMYK, and LAB values. Copy the exact format you need.",
    gradient: "linear-gradient(135deg, #fbbf24, #f59e0b)",
    glowColor: "rgba(251, 191, 36, 0.3)",
    accentColor: "#fbbf24",
    swatch: ["#fbbf24", "#fcd34d", "#fde68a", "#fef3c7"],
    category: "Create",
  },
  {
    id: "image",
    icon: <ImageIcon size={22} />,
    label: "Image Picker",
    tagline: "Extract from images",
    description:
      "Sample pixels and extract dominant colors from photos. Build palettes from real-world inspiration.",
    gradient: "linear-gradient(135deg, #ef4444, #f97316)",
    glowColor: "rgba(239, 68, 68, 0.3)",
    accentColor: "#ef4444",
    swatch: ["#ef4444", "#f87171", "#fca5a5", "#fecaca"],
    category: "Create",
  },
  {
    id: "devtools",
    icon: <Code2 size={22} />,
    label: "Dev Tools",
    tagline: "Export for code",
    description:
      "Export palettes as CSS variables, Tailwind config, SCSS variables, and ready-to-paste snippets.",
    gradient: "linear-gradient(135deg, #475569, #1e293b)",
    glowColor: "rgba(71, 85, 105, 0.3)",
    accentColor: "#64748b",
    swatch: ["#475569", "#64748b", "#94a3b8", "#cbd5e1"],
    category: "Export",
  },
  {
    id: "ui",
    icon: <LayoutTemplate size={22} />,
    label: "UI Preview",
    tagline: "See it in action",
    description:
      "Apply your palette to a live interface mockup. Validate colors on buttons, cards, and navbars.",
    gradient: "linear-gradient(135deg, #a855f7, #d946ef)",
    glowColor: "rgba(168, 85, 247, 0.3)",
    accentColor: "#a855f7",
    swatch: ["#a855f7", "#c084fc", "#d8b4fe", "#e9d5ff"],
    category: "Preview",
  },
  {
    id: "dataviz",
    icon: <BarChart3 size={22} />,
    label: "Data Viz",
    tagline: "Charts and graphs",
    description:
      "Test palette behavior on charts and legends. Ensure colors are distinct for data visualization.",
    gradient: "linear-gradient(135deg, #22d3ee, #3b82f6)",
    glowColor: "rgba(34, 211, 238, 0.3)",
    accentColor: "#22d3ee",
    swatch: ["#22d3ee", "#67e8f9", "#a5f3fc", "#cffafe"],
    category: "Preview",
  },
  {
    id: "typography",
    icon: <Type size={22} />,
    label: "Typography",
    tagline: "Text and contrast",
    description:
      "Preview type color, fonts, and contrast badges. Optimize readability across all text sizes.",
    gradient: "linear-gradient(135deg, #f97316, #ef4444)",
    glowColor: "rgba(249, 115, 22, 0.3)",
    accentColor: "#f97316",
    swatch: ["#f97316", "#fb923c", "#fdba74", "#fed7aa"],
    category: "Preview",
  },
  {
    id: "brand",
    icon: <Briefcase size={22} />,
    label: "Brand Mockup",
    tagline: "Visualize your brand",
    description:
      "Preview identity assets generated from your palette in a complete brand presentation.",
    gradient: "linear-gradient(135deg, #84cc16, #22c55e)",
    glowColor: "rgba(132, 204, 22, 0.3)",
    accentColor: "#84cc16",
    swatch: ["#a3e635", "#bef264", "#d9f99d", "#ecfccb"],
    category: "Preview",
  },
  {
    id: "ai-palette",
    icon: <Wand2 size={22} />,
    label: "AI Palette",
    tagline: "Generate from mood",
    description: "Type a mood like 'ocean sunset' or 'tech startup' to instantly generate a matching palette.",
    gradient: "linear-gradient(135deg, #f43f5e, #8b5cf6)",
    glowColor: "rgba(244, 63, 94, 0.3)",
    accentColor: "#f43f5e",
    swatch: ["#f43f5e", "#fb7185", "#fda4af", "#ffe4e6"],
    category: "Create",
  },
  {
    id: "import",
    icon: <Upload size={22} />,
    label: "Palette Import",
    tagline: "Extract from text",
    description: "Import colors from CSS, a Coolors URL, or a list of hex codes instantly.",
    gradient: "linear-gradient(135deg, #06b6d4, #3b82f6)",
    glowColor: "rgba(6, 182, 212, 0.3)",
    accentColor: "#06b6d4",
    swatch: ["#06b6d4", "#22d3ee", "#67e8f9", "#a5f3fc"],
    category: "Export",
  },
];

const CATEGORIES = ["Core", "Accessibility", "Create", "Export", "Preview"];

const CATEGORY_COLORS = {
  Core: { bg: "rgba(139,92,246,0.12)", text: "#a78bfa", border: "rgba(139,92,246,0.3)" },
  Accessibility: { bg: "rgba(16,185,129,0.12)", text: "#34d399", border: "rgba(16,185,129,0.3)" },
  Create: { bg: "rgba(59,130,246,0.12)", text: "#60a5fa", border: "rgba(59,130,246,0.3)" },
  Export: { bg: "rgba(100,116,139,0.12)", text: "#94a3b8", border: "rgba(100,116,139,0.3)" },
  Preview: { bg: "rgba(217,70,239,0.12)", text: "#e879f9", border: "rgba(217,70,239,0.3)" },
};

/* ─── Why section data ───────────────────────────────────────── */
const WHY = [
  {
    icon: <Zap size={20} />,
    title: "Design Faster",
    body: "Stop guessing. Color theory gives you a systematic framework to build palettes that feel intentional and polished every time.",
    gradient: "linear-gradient(135deg, #fbbf24, #f97316)",
    stat: "14 tools",
    statLabel: "in one place",
  },
  {
    icon: <Shield size={20} />,
    title: "Accessible by Default",
    body: "WCAG contrast guidelines ensure your text is readable for everyone. Build inclusively from the start — not as an afterthought.",
    gradient: "linear-gradient(135deg, #34d399, #06b6d4)",
    stat: "WCAG 2.1",
    statLabel: "AA & AAA",
  },
  {
    icon: <Lightbulb size={20} />,
    title: "Creative Confidence",
    body: "Understanding color relationships unlocks creativity. Know why combinations work — then break the rules intentionally.",
    gradient: "linear-gradient(135deg, #a855f7, #6366f1)",
    stat: "7 harmony",
    statLabel: "types",
  },
];

/* ─── Workflow steps ─────────────────────────────────────────── */
const STEPS = [
  {
    n: "01",
    title: "Pick a starting color",
    body: "Use the Color Wheel to find a hue that resonates with your brand or mood. Your selection syncs across every tool.",
    icon: <CircleDot size={16} />,
    color: "#8b5cf6",
  },
  {
    n: "02",
    title: "Build your palette",
    body: "Head to Harmonies to generate complementary, analogous, or triadic schemes instantly — then refine with Tints & Shades.",
    icon: <Palette size={16} />,
    color: "#d946ef",
  },
  {
    n: "03",
    title: "Verify accessibility",
    body: "Run Contrast Checker and Colorblind Simulator to ensure your design works beautifully for every user.",
    icon: <Eye size={16} />,
    color: "#06b6d4",
  },
  {
    n: "04",
    title: "Export & ship",
    body: "Use Dev Tools to export CSS variables, Tailwind colors, or SCSS — copy-paste ready for your codebase.",
    icon: <Code2 size={16} />,
    color: "#10b981",
  },
];

/* ─── Stats ──────────────────────────────────────────────────── */
const STATS = [
  { value: "14", label: "Interactive Tools" },
  { value: "7", label: "Harmony Types" },
  { value: "6", label: "Color Formats" },
  { value: "4", label: "Vision Modes" },
];

/* ─── Animation helpers ──────────────────────────────────────── */
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
});

const stagger = (index, base = 0) => ({
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.5, delay: base + index * 0.07, ease: [0.22, 1, 0.36, 1] },
});

/* ═══════════════════════════════════════════════════════════════
   HOME PAGE
   ═══════════════════════════════════════════════════════════════ */
export default function Home({ onNavigate }) {
  const [activeFilter, setActiveFilter] = useState("All");
  const filteredTools = activeFilter === "All" ? TOOLS : TOOLS.filter((t) => t.category === activeFilter);

  return (
    <div className="relative overflow-hidden" style={{ color: "var(--text)" }}>

      {/* ── Ambient background orbs ── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute -left-1/3 -top-1/4 h-[800px] w-[800px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 65%)" }}
        />
        <div
          className="absolute -bottom-1/3 -right-1/4 h-[800px] w-[800px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(217,70,239,0.07) 0%, transparent 65%)" }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, rgba(59,130,246,0.04) 0%, transparent 65%)" }}
        />
      </div>

      {/* ════════════════════════════════════
          HERO
          ════════════════════════════════════ */}
      <section className="relative z-10 mx-auto max-w-5xl px-4 pt-20 pb-16 sm:px-6 sm:pt-32 text-center">

        {/* Badge */}
        <motion.div {...fadeUp(0)} className="mb-6 flex justify-center">
          <span
            className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wide"
            style={{
              borderColor: "rgba(139,92,246,0.35)",
              backgroundColor: "rgba(139,92,246,0.08)",
              color: "#a78bfa",
            }}
          >
            <Sparkles size={11} />
            Free · No sign-up · Runs in your browser
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          {...fadeUp(0.05)}
          className="mb-5 text-5xl font-black leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl"
          style={{ letterSpacing: "-0.03em" }}
        >
          Master the&nbsp;
          <span className="gradient-text">Language<br />of Color</span>
        </motion.h1>

        {/* Subtext */}
        <motion.p
          {...fadeUp(0.14)}
          className="mx-auto mb-10 max-w-2xl text-base sm:text-lg leading-relaxed"
          style={{ color: "var(--text-muted)" }}
        >
          ChromaLab is a professional-grade, browser-native color toolkit for designers, developers,
          and anyone serious about color. 14 interactive tools — all connected, all free.
        </motion.p>

        {/* CTAs */}
        <motion.div {...fadeUp(0.2)} className="flex flex-wrap justify-center gap-3">
          <button
            id="hero-cta-explore"
            onClick={() => onNavigate("wheel")}
            className="group flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold shadow-xl transition-all hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #8b5cf6, #d946ef)",
              color: "#fff",
              boxShadow: "0 6px 28px rgba(139,92,246,0.45)",
            }}
          >
            Start Exploring
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>
          <button
            id="hero-cta-contrast"
            onClick={() => onNavigate("contrast")}
            className="flex items-center gap-2 rounded-xl border px-7 py-3.5 text-sm font-semibold transition-all hover:scale-105 active:scale-95"
            style={{
              borderColor: "var(--border-md)",
              backgroundColor: "var(--surface)",
              color: "var(--text-subtle)",
            }}
          >
            Check Contrast
            <Contrast size={15} />
          </button>
        </motion.div>

        {/* Animated color spectrum strip */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0.6 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-16 mx-auto flex max-w-lg overflow-hidden rounded-2xl shadow-2xl"
          style={{ boxShadow: "0 16px 64px rgba(139,92,246,0.25)" }}
        >
          {["#8b5cf6", "#a855f7", "#d946ef", "#ec4899", "#f43f5e", "#f97316", "#f59e0b", "#eab308", "#22c55e", "#06b6d4", "#3b82f6", "#6366f1"].map((c) => (
            <div key={c} className="h-12 flex-1" style={{ backgroundColor: c }} />
          ))}
        </motion.div>
      </section>

      {/* ════════════════════════════════════
          STATS STRIP
          ════════════════════════════════════ */}
      <section className="relative z-10 mx-auto max-w-4xl px-4 pb-16 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-px overflow-hidden rounded-2xl border"
          style={{ borderColor: "var(--border)", backgroundColor: "var(--border)" }}
        >
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center py-6 px-4 text-center"
              style={{ backgroundColor: "var(--bg-card)" }}
            >
              <span
                className="text-3xl font-black tracking-tight gradient-text"
                style={{ fontSize: "2rem" }}
              >
                {stat.value}
              </span>
              <span className="mt-1 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ════════════════════════════════════
          TOOL GRID
          ════════════════════════════════════ */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 py-10 sm:px-6">
        {/* Header */}
        <motion.div {...fadeUp(0)} className="mb-8 text-center">
          <h2 className="text-2xl font-black sm:text-3xl tracking-tight" style={{ letterSpacing: "-0.02em", color: "var(--text)" }}>
            Every tool you need
          </h2>
          <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
            Explore all 14 tools — pick a category or browse them all.
          </p>
        </motion.div>

        {/* Category filter */}
        <motion.div {...fadeUp(0.05)} className="mb-8 flex flex-wrap justify-center gap-2">
          {["All", ...CATEGORIES].map((cat) => {
            const isActive = activeFilter === cat;
            const catStyle = cat !== "All" ? CATEGORY_COLORS[cat] : null;
            return (
              <button
                key={cat}
                id={`filter-${cat.toLowerCase()}`}
                onClick={() => setActiveFilter(cat)}
                className="rounded-full border px-4 py-1.5 text-xs font-semibold transition-all hover:scale-105"
                style={
                  isActive && catStyle
                    ? { backgroundColor: catStyle.bg, color: catStyle.text, borderColor: catStyle.border }
                    : isActive
                    ? { backgroundColor: "rgba(139,92,246,0.12)", color: "#a78bfa", borderColor: "rgba(139,92,246,0.35)" }
                    : { backgroundColor: "var(--surface)", color: "var(--text-muted)", borderColor: "var(--border)" }
                }
              >
                {cat}
              </button>
            );
          })}
        </motion.div>

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTools.map((tool, i) => {
            const catStyle = CATEGORY_COLORS[tool.category];
            return (
              <motion.div key={tool.id} {...stagger(i)}>
                <button
                  id={`tool-card-${tool.id}`}
                  onClick={() => onNavigate(tool.id)}
                  className="tool-card group w-full rounded-2xl border p-5 text-left"
                  style={{
                    backgroundColor: "var(--bg-card)",
                    borderColor: "var(--border)",
                    boxShadow: "var(--shadow-card)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = tool.accentColor + "55";
                    e.currentTarget.style.boxShadow = `0 12px 48px ${tool.glowColor}`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                    e.currentTarget.style.boxShadow = "var(--shadow-card)";
                  }}
                >
                  {/* Top row: icon + category badge */}
                  <div className="mb-4 flex items-start justify-between">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-lg"
                      style={{ background: tool.gradient }}
                    >
                      {tool.icon}
                    </div>
                    <span
                      className="rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                      style={{ backgroundColor: catStyle.bg, color: catStyle.text, borderColor: catStyle.border }}
                    >
                      {tool.category}
                    </span>
                  </div>

                  {/* Tagline + title */}
                  <p className="mb-0.5 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>
                    {tool.tagline}
                  </p>
                  <h3 className="mb-2 text-base font-bold" style={{ color: "var(--text)" }}>
                    {tool.label}
                  </h3>
                  <p className="mb-4 text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    {tool.description}
                  </p>

                  {/* Swatch row + CTA */}
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-1.5">
                      {tool.swatch.map((c) => (
                        <div
                          key={c}
                          className="h-5 w-5 rounded-full border-2"
                          style={{ backgroundColor: c, borderColor: "var(--bg-card)" }}
                        />
                      ))}
                    </div>
                    <div
                      className="flex items-center gap-1 text-xs font-semibold transition-transform group-hover:translate-x-0.5"
                      style={{ color: tool.accentColor }}
                    >
                      Open
                      <ArrowRight size={12} />
                    </div>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ════════════════════════════════════
          WHY COLOR THEORY
          ════════════════════════════════════ */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-10 text-center"
        >
          <h2 className="text-2xl font-black sm:text-3xl tracking-tight" style={{ letterSpacing: "-0.02em", color: "var(--text)" }}>
            Why color theory matters
          </h2>
          <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
            Color is the first thing people notice. Here's why understanding it changes everything.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-3">
          {WHY.map((w, i) => (
            <motion.div
              key={w.title}
              {...stagger(i, 0)}
              className="relative overflow-hidden rounded-2xl border p-6"
              style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
            >
              {/* Glow accent */}
              <div
                className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full opacity-20"
                style={{ background: w.gradient }}
              />
              <div
                className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl text-white shadow-lg"
                style={{ background: w.gradient }}
              >
                {w.icon}
              </div>
              <div className="mb-3">
                <span className="gradient-text text-2xl font-black">{w.stat}</span>
                <span className="ml-1.5 text-xs font-medium" style={{ color: "var(--text-muted)" }}>{w.statLabel}</span>
              </div>
              <h3 className="mb-2 text-base font-bold" style={{ color: "var(--text)" }}>
                {w.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {w.body}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════
          HOW IT WORKS
          ════════════════════════════════════ */}
      <section className="relative z-10 mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="mb-10 text-center"
        >
          <h2 className="text-2xl font-black sm:text-3xl tracking-tight" style={{ letterSpacing: "-0.02em", color: "var(--text)" }}>
            How it works
          </h2>
          <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
            From first hue to production-ready palette in four steps.
          </p>
        </motion.div>

        <div className="relative">
          {/* Connector line (desktop) */}
          <div
            className="absolute top-8 left-0 right-0 hidden sm:block h-px mx-8"
            style={{ background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.25), rgba(217,70,239,0.25), rgba(16,185,129,0.25), transparent)" }}
          />

          <div className="grid gap-4 sm:grid-cols-4 sm:gap-6">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.n}
                {...stagger(i, 0)}
                className="relative flex flex-col items-center rounded-2xl border p-5 text-center sm:items-start sm:text-left"
                style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
              >
                {/* Step number bubble */}
                <div
                  className="mb-4 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-black text-white shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${step.color}, ${step.color}aa)` }}
                >
                  {step.n}
                </div>
                <h3 className="mb-1.5 text-sm font-bold" style={{ color: "var(--text)" }}>
                  {step.title}
                </h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {step.body}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          CTA BANNER
          ════════════════════════════════════ */}
      <section className="relative z-10 mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-3xl p-10 text-center"
          style={{
            background: "linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(217,70,239,0.1) 50%, rgba(99,102,241,0.12) 100%)",
            border: "1px solid rgba(139,92,246,0.22)",
          }}
        >
          {/* Inner glow */}
          <div
            className="pointer-events-none absolute inset-0 opacity-40"
            style={{ background: "radial-gradient(ellipse at center top, rgba(139,92,246,0.15) 0%, transparent 60%)" }}
          />

          <div className="relative z-10">
            {/* Color dot row */}
            <div className="mb-5 flex justify-center gap-2">
              {["#8b5cf6", "#ec4899", "#f97316", "#06b6d4", "#22c55e", "#f59e0b"].map((c) => (
                <div
                  key={c}
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: c, boxShadow: `0 2px 8px ${c}88` }}
                />
              ))}
            </div>

            <h2 className="mb-3 text-2xl font-black sm:text-3xl" style={{ color: "var(--text)", letterSpacing: "-0.02em" }}>
              Ready to see color differently?
            </h2>
            <p className="mb-8 text-sm" style={{ color: "var(--text-muted)" }}>
              Jump right in — no sign-up, no install, no cost. Your color stays in your browser.
            </p>

            {/* Quick-launch grid */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {TOOLS.map((t) => (
                <button
                  key={t.id}
                  id={`quick-launch-${t.id}`}
                  onClick={() => onNavigate(t.id)}
                  className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all hover:scale-105"
                  style={{
                    backgroundColor: "var(--surface)",
                    color: "var(--text-subtle)",
                    border: "1px solid var(--border-md)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = t.accentColor + "18";
                    e.currentTarget.style.borderColor = t.accentColor + "44";
                    e.currentTarget.style.color = t.accentColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "var(--surface)";
                    e.currentTarget.style.borderColor = "var(--border-md)";
                    e.currentTarget.style.color = "var(--text-subtle)";
                  }}
                >
                  <CheckCircle2 size={11} />
                  {t.label}
                </button>
              ))}
            </div>

            <button
              id="cta-start-now"
              onClick={() => onNavigate("wheel")}
              className="group inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-bold transition-all hover:scale-105 active:scale-95"
              style={{
                background: "linear-gradient(135deg, #8b5cf6, #d946ef)",
                color: "#fff",
                boxShadow: "0 6px 28px rgba(139,92,246,0.4)",
              }}
            >
              <Star size={15} />
              Start with Color Wheel
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>
      </section>

    </div>
  );
}

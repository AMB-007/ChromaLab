import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Blend,
  Briefcase,
  CircleDot,
  Code2,
  Contrast,
  Eye,
  Image as ImageIcon,
  Layers,
  LayoutTemplate,
  Palette,
  Pipette,
  SlidersHorizontal,
  Type,
  Wand2,
  Upload,
} from "lucide-react";

import Navbar from "./components/Navbar";
import KeyboardHelp from "./components/KeyboardHelp";
import { ToastContainer, useToast } from "./components/Toast";
import Home from "./pages/Home";
import ColorWheel from "./components/ColorWheel";
import HarmonyDemo from "./components/HarmonyDemo";
import ContrastChecker from "./components/ContrastChecker";
import ColorblindSimulator from "./components/ColorblindSimulator";
import GradientGenerator from "./pages/GradientGenerator";
import ColorMixer from "./pages/ColorMixer";
import TintShade from "./pages/TintShade";
import ColorConverter from "./pages/ColorConverter";
import ImageColorPicker from "./pages/ImageColorPicker";
import DevTools from "./pages/DevTools";
import UIPreview from "./pages/UIPreview";
import DataViz from "./pages/DataViz";
import Typography from "./pages/Typography";
import BrandMockup from "./pages/BrandMockup";
import AIPaletteGenerator from "./components/AIPaletteGenerator";
import PaletteImport from "./components/PaletteImport";
import OnboardingTour, { useOnboardingTour } from "./components/OnboardingTour";

const DEFAULT_COLOR = "#e63946";

const TOOLS = [
  {
    id: "wheel",
    label: "Color Wheel",
    icon: <CircleDot size={18} />,
    description: "Explore colors interactively on the wheel",
    useCase: "Find a starting hue that resonates with your brand. Instantly see HEX, RGB, and HSL values.",
  },
  {
    id: "harmony",
    label: "Harmonies",
    icon: <Palette size={18} />,
    description: "Discover color relationships and schemes",
    useCase: "Build harmonious color palettes (like complementary or analogous) to ensure your design's colors work well together.",
  },
  {
    id: "gradient",
    label: "Gradient Generator",
    icon: <Layers size={18} />,
    description: "Build linear, radial, and conic CSS gradients",
    useCase: "Create beautiful CSS backgrounds for your UI elements. Copy the code directly into your stylesheet.",
  },
  {
    id: "mixer",
    label: "Color Mixer",
    icon: <Blend size={18} />,
    description: "Blend two colors and preview intermediate steps",
    useCase: "Find the perfect intermediate color by blending two shades together, useful for creating smooth transitions.",
  },
  {
    id: "scale",
    label: "Tints and Shades",
    icon: <SlidersHorizontal size={18} />,
    description: "Generate Tailwind-style scales and export tokens",
    useCase: "Generate consistent lightness steps (like Tailwind's 50-900 scale) for creating buttons, borders, and backgrounds in a design system.",
  },
  {
    id: "converter",
    label: "Color Converter",
    icon: <Pipette size={18} />,
    description: "Edit HEX, RGB, HSL, HSB, CMYK, and LAB values",
    useCase: "Translate colors between different code formats seamlessly. Useful when jumping between design tools and code.",
  },
  {
    id: "image",
    label: "Image Picker",
    icon: <ImageIcon size={18} />,
    description: "Sample pixels and extract dominant colors from images",
    useCase: "Extract a cohesive color palette from an inspirational photograph or brand logo.",
  },
  {
    id: "contrast",
    label: "Contrast",
    icon: <Contrast size={18} />,
    description: "Check WCAG accessibility compliance",
    useCase: "Verify that your text is readable against your background, ensuring compliance with WCAG accessibility standards.",
  },
  {
    id: "colorblind",
    label: "Colorblind",
    icon: <Eye size={18} />,
    description: "Simulate different types of color vision",
    useCase: "Test your palette against various color vision deficiencies to make sure your design is inclusive and accessible to everyone.",
  },
  {
    id: "devtools",
    label: "Dev Tools",
    icon: <Code2 size={18} />,
    description: "Export CSS variables, Tailwind colors, SCSS, and snippets",
    useCase: "Export your final palettes as ready-to-use CSS variables, SCSS, or Tailwind configurations.",
  },
  {
    id: "ui",
    label: "UI Preview",
    icon: <LayoutTemplate size={18} />,
    description: "Apply palette roles to a live interface mockup",
    useCase: "Preview how your selected colors actually look when applied to realistic UI components like buttons and cards.",
  },
  {
    id: "dataviz",
    label: "Data Viz",
    icon: <BarChart3 size={18} />,
    description: "Test palette behavior on charts and legends",
    useCase: "Check if your colors are distinct enough to be used together in charts, graphs, and data dashboards.",
  },
  {
    id: "typography",
    label: "Typography",
    icon: <Type size={18} />,
    description: "Preview type color, fonts, and contrast badges",
    useCase: "See how your colors perform on text of various sizes and weights, ensuring maximum readability.",
  },
  {
    id: "brand",
    label: "Brand Mockup",
    icon: <Briefcase size={18} />,
    description: "Preview identity assets generated from the palette",
    useCase: "Visualize your palette applied to broader brand assets like logos, business cards, and marketing materials.",
  },
  {
    id: "ai-palette",
    label: "AI Palette",
    icon: <Wand2 size={18} />,
    description: "Generate palettes from mood or scene descriptions",
    useCase: "Type a mood like 'ocean sunset' or 'tech startup' and get an instant 5-color palette. Apply colors directly to the workspace.",
  },
  {
    id: "import",
    label: "Palette Import",
    icon: <Upload size={18} />,
    description: "Import colors from CSS, Coolors URLs, or hex lists",
    useCase: "Paste any CSS, a Coolors.co share link, or a list of hex codes to instantly extract and apply colors.",
  },
];

const NAV_GROUPS = [
  { label: "Color Tools", ids: ["wheel", "harmony", "gradient", "mixer", "scale", "converter", "image", "contrast", "colorblind"] },
  { label: "Dev Tools", ids: ["devtools", "import"] },
  { label: "Preview", ids: ["ui", "dataviz", "typography", "brand", "ai-palette"] },
];

const SHORTCUT_ORDER = ["wheel", "harmony", "gradient", "mixer", "scale", "converter", "image", "contrast", "colorblind"];
const TOOL_BY_ID = Object.fromEntries(TOOLS.map((tool) => [tool.id, tool]));
const VALID_PAGES = new Set(["home", ...TOOLS.map((tool) => tool.id)]);

const pageVariants = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2 } },
};

function normalizeHex(value) {
  if (typeof value !== "string") return null;
  const next = value.startsWith("#") ? value : `#${value}`;
  return /^#[0-9A-Fa-f]{6}$/.test(next) ? next.toLowerCase() : null;
}

function getInitialState() {
  const params = new URLSearchParams(window.location.search);
  const page = VALID_PAGES.has(params.get("page")) ? params.get("page") : "home";
  const color = normalizeHex(params.get("color") || DEFAULT_COLOR) || DEFAULT_COLOR;
  return { page, color };
}

function colorReducer(state, action) {
  switch (action.type) {
    case "set": {
      const color = normalizeHex(action.color);
      if (!color || state.colors[state.index]?.toLowerCase() === color) return state;
      const nextColors = [...state.colors.slice(0, state.index + 1), color].slice(-60);
      return { colors: nextColors, index: nextColors.length - 1 };
    }
    case "undo":
      return { ...state, index: Math.max(0, state.index - 1) };
    case "redo":
      return { ...state, index: Math.min(state.colors.length - 1, state.index + 1) };
    default:
      return state;
  }
}

function isTypingTarget(target) {
  const tag = target?.tagName?.toLowerCase();
  return tag === "input" || tag === "textarea" || tag === "select" || target?.isContentEditable;
}

export default function App() {
  const initial = useMemo(getInitialState, []);
  const [page, setPage] = useState(initial.page);
  const [theme, setTheme] = useState("dark");
  const [helpOpen, setHelpOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedColor2, setSelectedColor2] = useState("#ec4899");
  const [colorState, dispatchColor] = useReducer(colorReducer, initial.color, (color) => ({
    colors: [color],
    index: 0,
  }));
  const { toasts, showToast } = useToast();
  const { tourOpen, closeTour, startTour } = useOnboardingTour();

  const selectedColor = colorState.colors[colorState.index] || DEFAULT_COLOR;
  const activeTool = TOOL_BY_ID[page];

  const navGroups = useMemo(
    () => NAV_GROUPS.map((group) => ({ ...group, items: group.ids.map((id) => TOOL_BY_ID[id]) })),
    []
  );

  const navigateTo = useCallback((nextPage) => {
    if (!VALID_PAGES.has(nextPage)) return;
    setPage(nextPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const setSelectedColor = useCallback((next) => {
    const color = typeof next === "function" ? next(selectedColor) : next;
    dispatchColor({ type: "set", color });
  }, [selectedColor]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen?.();
    } else {
      await document.exitFullscreen?.();
    }
  }, []);

  const shareUrl = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    showToast("Share URL copied");
  }, [showToast]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (page !== "home") params.set("page", page);
    params.set("color", selectedColor.replace("#", ""));
    const query = params.toString();
    const nextUrl = `${window.location.pathname}${query ? `?${query}` : ""}`;
    window.history.replaceState(null, "", nextUrl);
  }, [page, selectedColor]);

  useEffect(() => {
    const onFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (isTypingTarget(event.target)) return;

      const key = event.key.toLowerCase();

      if ((event.ctrlKey || event.metaKey) && key === "z" && !event.shiftKey) {
        event.preventDefault();
        dispatchColor({ type: "undo" });
        return;
      }

      if ((event.ctrlKey || event.metaKey) && (key === "y" || (key === "z" && event.shiftKey))) {
        event.preventDefault();
        dispatchColor({ type: "redo" });
        return;
      }

      if (event.key === "?") {
        event.preventDefault();
        setHelpOpen(true);
        return;
      }

      if (event.key >= "1" && event.key <= "9") {
        const index = Number(event.key) - 1;
        const nextPage = SHORTCUT_ORDER[index];
        if (nextPage) navigateTo(nextPage);
        return;
      }

      if (key === "h") navigateTo("home");
      if (key === "d") navigateTo("devtools");
      if (key === "v") navigateTo("ui");
      if (key === "z") navigateTo("dataviz");
      if (key === "y") navigateTo("typography");
      if (key === "b") navigateTo("brand");
      if (key === "t") toggleTheme();
      if (key === "f") toggleFullscreen();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [navigateTo, toggleFullscreen, toggleTheme]);

  const renderTool = () => {
    switch (page) {
      case "wheel":
        return (
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border p-6" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-label)" }}>
                How to Use
              </h3>
              <ul className="space-y-3 text-sm" style={{ color: "var(--text-muted)" }}>
                {[
                  "Click or drag on the color wheel to select a color",
                  "The outer ring represents hue from 0 to 360 degrees",
                  "Distance from center controls saturation",
                  "Selected color syncs with the rest of the workspace",
                ].map((tip, i) => (
                  <li key={tip} className="flex items-start gap-3">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs" style={{ backgroundColor: "var(--surface)", color: "var(--text-faint)" }}>
                      {i + 1}
                    </span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border p-6" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
              <h3 className="mb-4 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-label)" }}>
                Quick Color Info
              </h3>
              <div className="flex items-center justify-between">
                <span className="text-sm" style={{ color: "var(--text-muted)" }}>Selected</span>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded border" style={{ backgroundColor: selectedColor, borderColor: "var(--border-md)" }} />
                  <span className="font-mono text-sm" style={{ color: "var(--text-subtle)" }}>{selectedColor.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>
        );
      case "harmony":
        return <HarmonyDemo baseColor={selectedColor} onColorChange={setSelectedColor} />;
      case "gradient":
        return <GradientGenerator selectedColor={selectedColor} selectedColor2={selectedColor2} showToast={showToast} />;
      case "mixer":
        return <ColorMixer selectedColor={selectedColor} selectedColor2={selectedColor2} showToast={showToast} />;
      case "scale":
        return <TintShade selectedColor={selectedColor} showToast={showToast} />;
      case "converter":
        return <ColorConverter selectedColor={selectedColor} showToast={showToast} />;
      case "image":
        return <ImageColorPicker selectedColor={selectedColor} onColorChange={setSelectedColor} showToast={showToast} />;
      case "contrast":
        return <ContrastChecker selectedColor={selectedColor} selectedColor2={selectedColor2} />;
      case "colorblind":
        return <ColorblindSimulator selectedColor={selectedColor} />;
      case "devtools":
        return <DevTools selectedColor={selectedColor} onColorChange={setSelectedColor} showToast={showToast} />;
      case "ui":
        return <UIPreview selectedColor={selectedColor} onColorChange={setSelectedColor} />;
      case "dataviz":
        return <DataViz selectedColor={selectedColor} showToast={showToast} />;
      case "typography":
        return <Typography selectedColor={selectedColor} showToast={showToast} />;
      case "brand":
        return <BrandMockup selectedColor={selectedColor} showToast={showToast} />;
      case "ai-palette":
        return <AIPaletteGenerator onApplyColor={setSelectedColor} showToast={showToast} />;
      case "import":
        return <PaletteImport onApplyColor={setSelectedColor} showToast={showToast} />;
      default:
        return null;
    }
  };

  /* Dual-color tools need a left + right wheel flanking the content */
  const isDualColor = page === "mixer" || page === "contrast" || page === "gradient";

  /* Compact wheel panel with label */
  const WheelPanel = ({ color, onSelect, label, accentColor = "#8b5cf6" }) => (
    <div className="flex flex-col items-center gap-3">
      <div
        className="w-full rounded-xl border px-3 py-2 text-center"
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border-md)" }}
      >
        <div className="text-[10px] font-bold uppercase tracking-[0.12em] mb-1" style={{ color: "var(--text-faint)" }}>
          {label}
        </div>
        <div className="flex items-center justify-center gap-2">
          <div className="h-4 w-4 rounded-md border shadow-sm" style={{ backgroundColor: color, borderColor: "rgba(255,255,255,0.15)" }} />
          <span className="font-mono text-xs font-semibold uppercase" style={{ color: "var(--text-subtle)" }}>
            {color.toUpperCase()}
          </span>
        </div>
      </div>
      <ColorWheel onColorSelect={onSelect} selectedColor={color} size={isDualColor ? 210 : 300} />
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "var(--bg)", color: "var(--text)" }}>
      <Navbar
        page={page}
        groups={navGroups}
        onNavigate={navigateTo}
        theme={theme}
        onToggleTheme={toggleTheme}
        onToggleHelp={() => setHelpOpen(true)}
        onToggleFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
        onShare={shareUrl}
        onUndo={() => dispatchColor({ type: "undo" })}
        onRedo={() => dispatchColor({ type: "redo" })}
      />

      <AnimatePresence mode="wait">
        <motion.div key={page} variants={pageVariants} initial="initial" animate="animate" exit="exit">
          {page === "home" && <Home onNavigate={navigateTo} />}

          {activeTool && (
            <main className="mx-auto max-w-screen-2xl px-5 py-8 sm:px-8">
              {/* ── Tool header ── */}
              <div className="mb-6">
                <div className="mb-1 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-faint)" }}>
                  {activeTool.icon}
                  <span>{activeTool.label}</span>
                </div>
                <h1 className="text-2xl font-black tracking-tight" style={{ color: "var(--text)", letterSpacing: "-0.02em" }}>
                  {activeTool.label}
                </h1>
                <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
                  {activeTool.description}
                </p>
                {activeTool.useCase && (
                  <div className="mt-3 rounded-xl border px-4 py-3 text-sm" style={{ backgroundColor: "var(--surface)", borderColor: "var(--border-md)" }}>
                    <p style={{ color: "var(--text-subtle)" }}>
                      <strong style={{ color: "var(--text)" }}>Tip:</strong> {activeTool.useCase}
                    </p>
                  </div>
                )}
              </div>
              <div className="mb-6 h-px" style={{ backgroundColor: "var(--border)" }} />

              {/* ════════════════════════════════════════
                  DUAL-COLOR LAYOUT  (mixer / contrast)
                  Left wheel | Content | Right wheel
                  ════════════════════════════════════════ */}
              {isDualColor ? (
                <div className="flex flex-col xl:flex-row gap-6 items-start">
                  {/* Left: Color 1 wheel */}
                  <div className="xl:w-[240px] shrink-0 sticky top-16 hidden xl:block">
                    <div
                      className="rounded-2xl border p-4"
                      style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
                    >
                      <WheelPanel
                        color={selectedColor}
                        onSelect={setSelectedColor}
                        label="Color 1"
                        accentColor="#8b5cf6"
                      />
                    </div>
                  </div>

                  {/* Center: Tool content */}
                  <div className="w-full min-w-0 flex-1">
                    {/* Mobile wheels (stacked on small screens) */}
                    <div className="flex gap-4 mb-6 xl:hidden">
                      <div className="flex-1 rounded-2xl border p-3" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
                        <WheelPanel color={selectedColor} onSelect={setSelectedColor} label="Color 1" />
                      </div>
                      <div className="flex-1 rounded-2xl border p-3" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
                        <WheelPanel color={selectedColor2} onSelect={setSelectedColor2} label="Color 2" />
                      </div>
                    </div>
                    {renderTool()}
                  </div>

                  {/* Right: Color 2 wheel */}
                  <div className="xl:w-[240px] shrink-0 sticky top-16 hidden xl:block">
                    <div
                      className="rounded-2xl border p-4"
                      style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
                    >
                      <WheelPanel
                        color={selectedColor2}
                        onSelect={setSelectedColor2}
                        label="Color 2"
                        accentColor="#ec4899"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* ════════════════════════════════════════
                   SINGLE-COLOR LAYOUT
                   Left wheel | Content
                   ════════════════════════════════════════ */
                <div className="flex flex-col lg:flex-row gap-6 items-start">
                  {/* Left: Color wheel */}
                  <div className="lg:w-[260px] xl:w-[300px] shrink-0 sticky top-16">
                    <div
                      className="rounded-2xl border p-4"
                      style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
                    >
                      <WheelPanel
                        color={selectedColor}
                        onSelect={setSelectedColor}
                        label="Active Color"
                      />
                    </div>
                  </div>

                  {/* Right: Tool content */}
                  <div className="w-full min-w-0 flex-1">
                    {renderTool()}
                  </div>
                </div>
              )}
            </main>
          )}
        </motion.div>
      </AnimatePresence>

      <footer className="mt-12 border-t py-8" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <p className="text-sm" style={{ color: "var(--text-faint)" }}>
            ChromaLab — Explore, learn, and apply color theory
          </p>
        </div>
      </footer>

      <OnboardingTour open={tourOpen} onClose={closeTour} />
      <KeyboardHelp open={helpOpen} onClose={() => setHelpOpen(false)} />
      <ToastContainer toasts={toasts} />
    </div>
  );
}

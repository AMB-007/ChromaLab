import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  generateHarmony,
  getTextColor,
  hexToHsl,
} from "../utils/colorUtils";
import { Copy, RefreshCw } from "lucide-react";
import { useCopyFormat } from "./CopyFormatMenu";

const harmonyTypes = [
  {
    type: "complementary",
    label: "Complementary",
    description: "Colors opposite each other on the wheel. High contrast.",
  },
  {
    type: "analogous",
    label: "Analogous",
    description: "Colors adjacent on the wheel. Harmonious and natural.",
  },
  {
    type: "triadic",
    label: "Triadic",
    description: "Three colors evenly spaced. Vibrant and balanced.",
  },
  {
    type: "split-complementary",
    label: "Split Complementary",
    description: "Base color plus two adjacent to its complement.",
  },
  {
    type: "tetradic",
    label: "Tetradic",
    description: "Four colors in a rectangle. Rich and complex.",
  },
  {
    type: "square",
    label: "Square",
    description: "Four colors evenly spaced. Bold and dynamic.",
  },
  {
    type: "monochromatic",
    label: "Monochromatic",
    description: "Variations of a single hue. Clean and elegant.",
  },
];

export default function HarmonyDemo({ baseColor = "#e63946", onColorChange }) {
  const [selectedType, setSelectedType] = useState("complementary");
  const [localColor, setLocalColor] = useState(baseColor);
  const { openMenu, CopyMenu } = useCopyFormat();

  useEffect(() => {
    if (baseColor) setLocalColor(baseColor);
  }, [baseColor]);

  const effectiveColor = onColorChange ? baseColor : localColor;

  const colors = generateHarmony(effectiveColor, selectedType);

  const handleColorChange = (hex) => {
    setLocalColor(hex);
    onColorChange?.(hex);
  };

  const randomize = () => {
    const hex = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
    handleColorChange(hex);
  };

  const currentHarmony = harmonyTypes.find((h) => h.type === selectedType);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-3">
          <input
            type="color"
            value={effectiveColor}
            onChange={(e) => handleColorChange(e.target.value)}
            className="h-10 w-10 cursor-pointer rounded-lg border border-white/10 bg-transparent"
          />
          <input
            type="text"
            value={effectiveColor.toUpperCase()}
            onChange={(e) => {
              const val = e.target.value;
              if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) handleColorChange(val);
            }}
            className="w-28 rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-sm text-white outline-none focus:border-white/30"
          />
        </div>
        <button
          onClick={randomize}
          className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <RefreshCw size={14} />
          Random
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 p-4" style={{ backgroundColor: "var(--bg-card)" }}>
        <p className="text-sm text-white/70">{currentHarmony?.description}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {harmonyTypes.map((harmony) => (
          <button
            key={harmony.type}
            onClick={() => setSelectedType(harmony.type)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
              selectedType === harmony.type
                ? "bg-white text-black"
                : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            {harmony.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedType + baseColor}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="flex flex-wrap gap-3"
        >
          {colors.map((color, index) => {
            const textColor = getTextColor(color);
            const hsl = hexToHsl(color);
            return (
              <motion.div
                key={`${color}-${index}`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.08 }}
                className="group relative flex flex-col items-center gap-2"
              >
                <div
                  className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-2xl border-2 border-white/10 shadow-lg transition-transform hover:scale-105"
                  style={{ backgroundColor: color }}
                  onClick={(e) => openMenu(color, e.currentTarget, e)}
                >
                  <Copy
                    size={16}
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                    style={{ color: textColor }}
                  />
                </div>
                <div className="text-center">
                  <div className="font-mono text-xs font-medium text-white/80">
                    {color.toUpperCase()}
                  </div>
                  <div className="text-xs text-white/40">
                    H{Math.round(hsl.h)} S{Math.round(hsl.s)} L{Math.round(hsl.l)}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Harmony preview cards */}
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <HarmonyPreviewCard colors={colors} type="buttons" />
        <HarmonyPreviewCard colors={colors} type="gradient" />
        <HarmonyPreviewCard colors={colors} type="text" />
        <HarmonyPreviewCard colors={colors} type="cards" />
      </div>

      <CopyMenu />
    </div>
  );
}

function HarmonyPreviewCard({ colors, type }) {
  if (type === "buttons") {
    return (
      <div
        className="rounded-xl border border-white/10 p-4"
        style={{ backgroundColor: "var(--bg-card)" }}
      >
        <div className="mb-3 text-xs font-medium uppercase tracking-wider text-white/40">
          Button Styles
        </div>
        <div className="flex flex-wrap gap-2">
          {colors.map((color, i) => (
            <button
              key={i}
              className="rounded-lg px-3 py-1.5 text-xs font-medium transition-transform hover:scale-105"
              style={{
                backgroundColor: color,
                color: getTextColor(color),
              }}
            >
              Action {i + 1}
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (type === "gradient") {
    return (
      <div
        className="rounded-xl border border-white/10 p-4"
        style={{ backgroundColor: "var(--bg-card)" }}
      >
        <div className="mb-3 text-xs font-medium uppercase tracking-wider text-white/40">
          Gradient
        </div>
        <div
          className="h-12 w-full rounded-lg"
          style={{
            background: `linear-gradient(90deg, ${colors.join(", ")})`,
          }}
        />
      </div>
    );
  }

  if (type === "text") {
    return (
      <div
        className="rounded-xl border border-white/10 p-4"
        style={{ backgroundColor: "var(--bg-card)" }}
      >
        <div className="mb-3 text-xs font-medium uppercase tracking-wider text-white/40">
          Text Colors
        </div>
        <div className="space-y-1">
          {colors.slice(0, 4).map((color, i) => (
            <div key={i} className="text-sm font-medium" style={{ color }}>
              Sample heading text
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl border border-white/10 p-4"
      style={{ backgroundColor: "var(--bg-card)" }}
    >
      <div className="mb-3 text-xs font-medium uppercase tracking-wider text-white/40">
        Card Variants
      </div>
      <div className="flex gap-2">
        {colors.slice(0, 4).map((color, i) => (
          <div
            key={i}
            className="flex h-12 flex-1 items-center justify-center rounded-lg text-xs font-medium"
            style={{
              backgroundColor: color,
              color: getTextColor(color),
            }}
          >
            Card
          </div>
        ))}
      </div>
    </div>
  );
}

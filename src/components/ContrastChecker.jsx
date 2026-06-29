import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import {
  getContrastRatio,
  getContrastGrade,
  hexToRgb,
} from "../utils/colorUtils";
import { RefreshCw, Copy, Check } from "lucide-react";

function ColorInput({ label, color, onChange }) {
  const rgb = hexToRgb(color);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(color);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium uppercase tracking-wider text-white/40">
        {label}
      </label>
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="color"
            value={color}
            onChange={(e) => onChange(e.target.value)}
            className="h-12 w-12 cursor-pointer rounded-lg border-2 border-white/10 bg-transparent p-0.5"
          />
        </div>
        <div className="flex-1">
          <input
            type="text"
            value={color.toUpperCase()}
            onChange={(e) => {
              const val = e.target.value;
              if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) {
                onChange(val);
              }
            }}
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-sm text-white outline-none focus:border-white/30"
          />
        </div>
        <button
          onClick={handleCopy}
          className="rounded-lg border border-white/10 bg-white/5 p-2.5 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
        >
          {copied ? <Check size={16} /> : <Copy size={16} />}
        </button>
      </div>
      <div className="flex gap-3 text-xs text-white/30">
        <span>RGB({rgb.r}, {rgb.g}, {rgb.b})</span>
      </div>
    </div>
  );
}

export default function ContrastChecker({ selectedColor, selectedColor2 }) {
  const [fgColor, setFgColor] = useState(selectedColor2 || "#ffffff");
  const [bgColor, setBgColor] = useState(selectedColor || "#1a1a2e");
  
  useEffect(() => {
    if (selectedColor) setBgColor(selectedColor);
  }, [selectedColor]);

  useEffect(() => {
    if (selectedColor2) setFgColor(selectedColor2);
  }, [selectedColor2]);

  const [sampleText, setSampleText] = useState(
    "The quick brown fox jumps over the lazy dog."
  );

  const ratio = getContrastRatio(fgColor, bgColor);
  const grade = getContrastGrade(ratio);

  const swapColors = useCallback(() => {
    setFgColor(bgColor);
    setBgColor(fgColor);
  }, [fgColor, bgColor]);

  const randomize = useCallback(() => {
    const randomColor = () =>
      "#" +
      Math.floor(Math.random() * 16777215)
        .toString(16)
        .padStart(6, "0");
    setFgColor(randomColor());
    setBgColor(randomColor());
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 md:grid-cols-2">
        <ColorInput label="Foreground" color={fgColor} onChange={setFgColor} />
        <ColorInput label="Background" color={bgColor} onChange={setBgColor} />
      </div>

      <div className="flex gap-3">
        <button
          onClick={swapColors}
          className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          <RefreshCw size={14} />
          Swap
        </button>
        <button
          onClick={randomize}
          className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/70 transition-colors hover:bg-white/10 hover:text-white"
        >
          Randomize
        </button>
      </div>

      {/* Preview */}
      <motion.div
        className="rounded-2xl border-2 border-white/10 p-8 transition-colors"
        style={{ backgroundColor: bgColor }}
        animate={{ backgroundColor: bgColor }}
      >
        <div className="space-y-4">
          <input
            type="text"
            value={sampleText}
            onChange={(e) => setSampleText(e.target.value)}
            className="w-full bg-transparent text-center text-2xl font-bold outline-none"
            style={{ color: fgColor }}
          />
          <p
            className="text-center text-base"
            style={{ color: fgColor, opacity: 0.8 }}
          >
            {sampleText}
          </p>
          <p
            className="text-center text-sm"
            style={{ color: fgColor, opacity: 0.6 }}
          >
            {sampleText}
          </p>
        </div>
      </motion.div>

      {/* Contrast Score */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div
          className="rounded-2xl border border-white/10 p-6"
          style={{ backgroundColor: "var(--bg-card)" }}
        >
          <div className="mb-2 text-xs font-medium uppercase tracking-wider text-white/40">
            Contrast Ratio
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className="text-5xl font-bold"
              style={{
                color:
                  ratio >= 7
                    ? "#4ade80"
                    : ratio >= 4.5
                    ? "#fbbf24"
                    : ratio >= 3
                    ? "#fb923c"
                    : "#f87171",
              }}
            >
              {ratio.toFixed(2)}
            </span>
            <span className="text-lg text-white/40">:1</span>
          </div>
          <div className="mt-2 text-sm text-white/50">
            {ratio >= 7
              ? "Excellent contrast"
              : ratio >= 4.5
              ? "Good contrast"
              : ratio >= 3
              ? "Fair contrast"
              : "Poor contrast"}
          </div>
        </div>

        <div
          className="rounded-2xl border border-white/10 p-6"
          style={{ backgroundColor: "var(--bg-card)" }}
        >
          <div className="mb-3 text-xs font-medium uppercase tracking-wider text-white/40">
            WCAG 2.1 Compliance
          </div>
          <div className="space-y-2">
            <ComplianceRow
              label="AA Normal Text"
              pass={grade.aa}
              ratio={ratio}
              threshold={4.5}
            />
            <ComplianceRow
              label="AAA Normal Text"
              pass={grade.aaa}
              ratio={ratio}
              threshold={7}
            />
            <ComplianceRow
              label="AA Large Text"
              pass={grade.aaLarge}
              ratio={ratio}
              threshold={3}
            />
            <ComplianceRow
              label="AAA Large Text"
              pass={grade.aaaLarge}
              ratio={ratio}
              threshold={4.5}
            />
          </div>
        </div>
      </div>

      {/* Scale preview */}
      <div
        className="rounded-2xl border border-white/10 p-6"
        style={{ backgroundColor: "var(--bg-card)" }}
      >
        <div className="mb-4 text-xs font-medium uppercase tracking-wider text-white/40">
          Text Size Preview
        </div>
        <div className="space-y-3">
          {[12, 14, 16, 18, 20, 24, 32].map((size) => (
            <div key={size} className="flex items-center gap-4">
              <span className="w-12 text-xs text-white/30">{size}px</span>
              <span
                style={{ color: fgColor, fontSize: size, backgroundColor: bgColor, padding: "4px 8px", borderRadius: 4 }}
              >
                Sample text
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ComplianceRow({ label, pass, ratio, threshold }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-white/70">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-xs text-white/30">
          {ratio >= threshold ? "≥" : "<"} {threshold}
        </span>
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            pass
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {pass ? "PASS" : "FAIL"}
        </span>
      </div>
    </div>
  );
}

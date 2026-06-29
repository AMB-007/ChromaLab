import { useState, useMemo, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy } from "lucide-react";
import {
  hexToRgb, rgbToHex, rgbToHsl, hslToRgb,
  rgbToHsv, hsvToRgb, rgbToCmyk, cmykToRgb,
  rgbToLab, labToRgb,
} from "../utils/colorUtils";

const FORMATS = ["HEX", "RGB", "HSL", "HSB", "CMYK", "LAB"];

function parseHex(str) {
  const m = str.replace(/^#/, "");
  if (/^[0-9A-Fa-f]{6}$/.test(m)) return rgbToHex(hexToRgb(`#${m}`));
  if (/^[0-9A-Fa-f]{3}$/.test(m)) {
    return rgbToHex(hexToRgb(`#${m[0]+m[0]+m[1]+m[1]+m[2]+m[2]}`));
  }
  return null;
}

function parseRgb(str) {
  const m = str.match(/(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
  if (!m) return null;
  const r = Math.min(255, parseInt(m[1])), g = Math.min(255, parseInt(m[2])), b = Math.min(255, parseInt(m[3]));
  return rgbToHex({ r, g, b });
}

function parseHsl(str) {
  const m = str.match(/([\d.]+)[,\s]+([\d.]+)%?[,\s]+([\d.]+)%?/);
  if (!m) return null;
  const h = parseFloat(m[1]), s = parseFloat(m[2]), l = parseFloat(m[3]);
  if (h < 0 || h > 360 || s < 0 || s > 100 || l < 0 || l > 100) return null;
  return rgbToHex(hslToRgb({ h, s, l }));
}

function parseHsb(str) {
  const m = str.match(/([\d.]+)[,\s]+([\d.]+)%?[,\s]+([\d.]+)%?/);
  if (!m) return null;
  const h = parseFloat(m[1]), s = parseFloat(m[2]), v = parseFloat(m[3]);
  if (h < 0 || h > 360 || s < 0 || s > 100 || v < 0 || v > 100) return null;
  return rgbToHex(hsvToRgb({ h, s, v }));
}

function parseCmyk(str) {
  const m = str.match(/([\d.]+)%?[,\s]+([\d.]+)%?[,\s]+([\d.]+)%?[,\s]+([\d.]+)%?/);
  if (!m) return null;
  const c = parseFloat(m[1]), mo = parseFloat(m[2]), y = parseFloat(m[3]), k = parseFloat(m[4]);
  if ([c, mo, y, k].some(v => v < 0 || v > 100)) return null;
  return rgbToHex(cmykToRgb({ c, m: mo, y, k }));
}

function parseLab(str) {
  const m = str.match(/([\d.]+)[,\s]+([-\d.]+)[,\s]+([-\d.]+)/);
  if (!m) return null;
  const l = parseFloat(m[1]), a = parseFloat(m[2]), b = parseFloat(m[3]);
  if (l < 0 || l > 100) return null;
  return rgbToHex(labToRgb({ l, a, b }));
}

const PARSERS = { HEX: parseHex, RGB: parseRgb, HSL: parseHsl, HSB: parseHsb, CMYK: parseCmyk, LAB: parseLab };

function formatValue(hex, fmt) {
  const rgb = hexToRgb(hex);
  switch (fmt) {
    case "HEX":  return hex.toUpperCase();
    case "RGB":  return `${rgb.r}, ${rgb.g}, ${rgb.b}`;
    case "HSL":  { const h = rgbToHsl(rgb); return `${Math.round(h.h)}°, ${Math.round(h.s)}%, ${Math.round(h.l)}%`; }
    case "HSB":  { const v = rgbToHsv(rgb); return `${Math.round(v.h)}°, ${Math.round(v.s)}%, ${Math.round(v.v)}%`; }
    case "CMYK": { const c = rgbToCmyk(rgb); return `${c.c}%, ${c.m}%, ${c.y}%, ${c.k}%`; }
    case "LAB":  { const l = rgbToLab(rgb); return `${l.l}, ${l.a}, ${l.b}`; }
    default: return "";
  }
}

function formatCSS(hex, fmt) {
  const rgb = hexToRgb(hex);
  switch (fmt) {
    case "HEX":  return hex.toUpperCase();
    case "RGB":  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    case "HSL":  { const h = rgbToHsl(rgb); return `hsl(${Math.round(h.h)}, ${Math.round(h.s)}%, ${Math.round(h.l)}%)`; }
    case "HSB":  { const v = rgbToHsv(rgb); return `hsb(${Math.round(v.h)}, ${Math.round(v.s)}%, ${Math.round(v.v)}%)`; }
    case "CMYK": { const c = rgbToCmyk(rgb); return `cmyk(${c.c}%, ${c.m}%, ${c.y}%, ${c.k}%)`; }
    case "LAB":  { const l = rgbToLab(rgb); return `lab(${l.l} ${l.a} ${l.b})`; }
    default: return "";
  }
}

const FORMAT_LABELS = {
  HEX:  "Hexadecimal",
  RGB:  "Red Green Blue",
  HSL:  "Hue Saturation Lightness",
  HSB:  "Hue Saturation Brightness",
  CMYK: "Cyan Magenta Yellow Key",
  LAB:  "CIELAB Perceptual",
};

export default function ColorConverter({ selectedColor, showToast }) {
  const [hex, setHex] = useState(selectedColor || "#8b5cf6");
  
  useEffect(() => {
    if (selectedColor) setHex(selectedColor);
  }, [selectedColor]);

  const [inputs, setInputs] = useState({});
  const [activeFormat, setActiveFormat] = useState(null);

  function handleColorInput(e) {
    const v = e.target.value;
    setHex(v);
    setInputs({});
    setActiveFormat(null);
  }

  function handleFormatInput(fmt, value) {
    setInputs((prev) => ({ ...prev, [fmt]: value }));
    const parsed = PARSERS[fmt]?.(value);
    if (parsed) {
      setHex(parsed);
      setActiveFormat(fmt);
    }
  }

  function copy(fmt) {
    const val = formatCSS(hex, fmt);
    navigator.clipboard.writeText(val);
    showToast?.(`Copied ${val}`);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">

      {/* ── Color preview ── */}
      <div className="lg:col-span-2 flex flex-col gap-4">
        <div
          className="flex h-48 items-center justify-center rounded-2xl border"
          style={{ backgroundColor: hex, borderColor: "var(--border)" }}
        >
          <span className="rounded-full bg-black/30 px-3 py-1 font-mono text-sm text-white backdrop-blur-sm">
            {hex.toUpperCase()}
          </span>
        </div>

        <div className="rounded-2xl border p-5" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-label)" }}>
            Pick a Color
          </div>
          <div className="flex items-center gap-3">
            <input
              type="color" value={hex}
              onChange={handleColorInput}
              className="h-12 w-12 cursor-pointer rounded-xl border-0"
            />
            <input
              type="text" value={hex.toUpperCase()}
              onChange={(e) => {
                const v = e.target.value;
                if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) {
                  setHex(v);
                  if (v.length === 7) setInputs({});
                }
              }}
              className="flex-1 rounded-lg border px-3 py-2 font-mono text-sm outline-none"
              style={{ backgroundColor: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--text)" }}
            />
          </div>
        </div>

        {/* Visual bands */}
        <div className="overflow-hidden rounded-2xl border" style={{ borderColor: "var(--border)" }}>
          <div className="h-8" style={{ backgroundColor: hex }} />
          <div className="h-8" style={{ backgroundColor: hex, filter: "brightness(1.3)" }} />
          <div className="h-8" style={{ backgroundColor: hex, filter: "brightness(0.7)" }} />
          <div className="h-8" style={{ backgroundColor: hex, filter: "saturate(0)" }} />
        </div>
      </div>

      {/* ── Format inputs ── */}
      <div className="lg:col-span-3 flex flex-col gap-3">
        <div className="mb-1 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-label)" }}>
          Edit any format — all others update instantly
        </div>
        {FORMATS.map((fmt) => {
          const displayVal = inputs[fmt] !== undefined && activeFormat === fmt
            ? inputs[fmt]
            : formatValue(hex, fmt);
          return (
            <div
              key={fmt}
              className="flex items-center gap-3 rounded-2xl border p-4"
              style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
            >
              <div className="w-12 shrink-0">
                <div className="text-xs font-bold" style={{ color: "var(--text)" }}>{fmt}</div>
                <div className="text-[10px] leading-tight" style={{ color: "var(--text-faint)" }}>
                  {FORMAT_LABELS[fmt]}
                </div>
              </div>
              <input
                type="text"
                value={displayVal}
                onChange={(e) => handleFormatInput(fmt, e.target.value)}
                onFocus={() => setActiveFormat(fmt)}
                className="flex-1 rounded-lg border px-3 py-2 font-mono text-sm outline-none focus:border-violet-500/60"
                style={{ backgroundColor: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--text)" }}
              />
              <button
                onClick={() => copy(fmt)}
                className="shrink-0 rounded-lg p-2 transition-colors hover:text-violet-400"
                style={{ color: "var(--text-faint)", backgroundColor: "var(--surface)" }}
                title={`Copy ${fmt}`}
              >
                <Copy size={14} />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

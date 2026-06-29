import { useState, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Copy, ArrowLeftRight } from "lucide-react";
import { mixColors, hexToAllFormats } from "../utils/colorUtils";

function Card({ children, className = "" }) {
  return (
    <div className={`rounded-2xl border p-5 ${className}`}
      style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
      {children}
    </div>
  );
}
function Label({ children }) {
  return <div className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-label)" }}>{children}</div>;
}

const STEPS = [0, 15, 30, 50, 70, 85, 100];

export default function ColorMixer({ selectedColor, selectedColor2, showToast }) {
  const [color1, setColor1] = useState(selectedColor || "#8b5cf6");
  
  useEffect(() => {
    if (selectedColor) setColor1(selectedColor);
  }, [selectedColor]);

  const [color2, setColor2] = useState(selectedColor2 || "#ec4899");
  
  useEffect(() => {
    if (selectedColor2) setColor2(selectedColor2);
  }, [selectedColor2]);
  const [ratio, setRatio] = useState(50);

  const blended = useMemo(() => mixColors(color1, color2, ratio / 100), [color1, color2, ratio]);
  const fmt = useMemo(() => hexToAllFormats(blended), [blended]);

  function swap() {
    setColor1(color2);
    setColor2(color1);
  }

  function copy(text) {
    navigator.clipboard.writeText(text);
    showToast?.(`Copied ${text}`);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">

      {/* ── Inputs ── */}
      <div className="flex flex-col gap-4">
        <Card>
          <Label>Color 1</Label>
          <div className="flex items-center gap-3">
            <input
              type="color" value={color1}
              onChange={(e) => setColor1(e.target.value)}
              className="h-14 w-14 cursor-pointer rounded-xl border-0"
            />
            <div>
              <input
                type="text" value={color1.toUpperCase()}
                onChange={(e) => /^#[0-9A-Fa-f]{0,6}$/.test(e.target.value) && setColor1(e.target.value)}
                className="rounded-lg border px-3 py-2 font-mono text-sm outline-none focus:border-violet-500/60"
                style={{ backgroundColor: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--text)" }}
              />
            </div>
          </div>
        </Card>

        {/* Swap button */}
        <div className="flex justify-center">
          <button
            onClick={swap}
            className="flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-medium transition-all hover:scale-105"
            style={{ borderColor: "var(--border-md)", backgroundColor: "var(--surface)", color: "var(--text-muted)" }}
          >
            <ArrowLeftRight size={14} /> Swap Colors
          </button>
        </div>

        <Card>
          <Label>Color 2</Label>
          <div className="flex items-center gap-3">
            <input
              type="color" value={color2}
              onChange={(e) => setColor2(e.target.value)}
              className="h-14 w-14 cursor-pointer rounded-xl border-0"
            />
            <div>
              <input
                type="text" value={color2.toUpperCase()}
                onChange={(e) => /^#[0-9A-Fa-f]{0,6}$/.test(e.target.value) && setColor2(e.target.value)}
                className="rounded-lg border px-3 py-2 font-mono text-sm outline-none focus:border-violet-500/60"
                style={{ backgroundColor: "var(--input-bg)", borderColor: "var(--input-border)", color: "var(--text)" }}
              />
            </div>
          </div>
        </Card>

        {/* Ratio */}
        <Card>
          <div className="mb-2 flex items-center justify-between">
            <Label>Mix Ratio</Label>
            <span className="font-mono text-xs" style={{ color: "var(--text-subtle)" }}>
              {ratio}% Color 2
            </span>
          </div>
          <input
            type="range" min="0" max="100" value={ratio}
            onChange={(e) => setRatio(Number(e.target.value))}
            className="w-full accent-violet-500"
          />
          <div className="mt-2 flex justify-between text-[10px]" style={{ color: "var(--text-faint)" }}>
            <span>Pure C1</span>
            <span>50/50</span>
            <span>Pure C2</span>
          </div>
        </Card>
      </div>

      {/* ── Preview ── */}
      <div className="flex flex-col gap-4">

        {/* Step swatches */}
        <Card>
          <Label>Mix Steps</Label>
          <div className="flex overflow-hidden rounded-xl">
            {STEPS.map((pct) => {
              const c = mixColors(color1, color2, pct / 100);
              return (
                <div
                  key={pct}
                  className="flex-1 flex flex-col items-center justify-end pb-2 pt-16 cursor-pointer transition-transform hover:scale-y-110 origin-bottom"
                  style={{ backgroundColor: c }}
                  onClick={() => copy(c.toUpperCase())}
                  title={`${c.toUpperCase()} — click to copy`}
                >
                  <span className="text-[10px] font-mono opacity-70 mix-blend-difference text-white">
                    {pct}%
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Result */}
        <Card>
          <Label>Result at {ratio}%</Label>

          <motion.div
            className="mb-4 h-24 w-full rounded-xl border"
            style={{ backgroundColor: blended, borderColor: "var(--border)" }}
            animate={{ backgroundColor: blended }}
            transition={{ duration: 0.2 }}
          />

          <div className="space-y-2">
            {[
              { label: "HEX", value: fmt.hex },
              { label: "RGB", value: `rgb(${fmt.rgb.r}, ${fmt.rgb.g}, ${fmt.rgb.b})` },
              { label: "HSL", value: `hsl(${Math.round(fmt.hsl.h)}°, ${Math.round(fmt.hsl.s)}%, ${Math.round(fmt.hsl.l)}%)` },
            ].map(({ label, value }) => (
              <div key={label} className="flex items-center justify-between rounded-lg p-2"
                style={{ backgroundColor: "var(--surface)" }}>
                <span className="text-xs font-semibold" style={{ color: "var(--text-label)" }}>{label}</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm" style={{ color: "var(--text-subtle)" }}>{value}</span>
                  <button onClick={() => copy(value)} className="p-1 rounded transition-colors hover:text-violet-400"
                    style={{ color: "var(--text-faint)" }}>
                    <Copy size={12} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Side-by-side comparison */}
        <div className="overflow-hidden rounded-2xl border" style={{ borderColor: "var(--border)" }}>
          <div className="flex h-16">
            <div className="flex-1 flex items-center justify-center text-xs font-bold"
              style={{ backgroundColor: color1, color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
              Color 1
            </div>
            <div className="flex-1 flex items-center justify-center text-xs font-bold"
              style={{ backgroundColor: blended, color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
              Blend
            </div>
            <div className="flex-1 flex items-center justify-center text-xs font-bold"
              style={{ backgroundColor: color2, color: "#fff", textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
              Color 2
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

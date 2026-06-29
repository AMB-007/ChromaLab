import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, Copy, RotateCcw } from "lucide-react";

let stopId = 3;

const DEFAULT_STOPS = [
  { id: 1, color: "#8b5cf6", position: 0 },
  { id: 2, color: "#ec4899", position: 100 },
];

function buildCSS(stops, type, angle) {
  const sorted = [...stops].sort((a, b) => a.position - b.position);
  const stopStr = sorted.map((s) => `${s.color} ${s.position}%`).join(", ");
  switch (type) {
    case "radial":  return `background: radial-gradient(circle, ${stopStr});`;
    case "conic":   return `background: conic-gradient(from ${angle}deg, ${stopStr});`;
    default:        return `background: linear-gradient(${angle}deg, ${stopStr});`;
  }
}

function buildInlineStyle(stops, type, angle) {
  const sorted = [...stops].sort((a, b) => a.position - b.position);
  const stopStr = sorted.map((s) => `${s.color} ${s.position}%`).join(", ");
  switch (type) {
    case "radial":  return { background: `radial-gradient(circle, ${stopStr})` };
    case "conic":   return { background: `conic-gradient(from ${angle}deg, ${stopStr})` };
    default:        return { background: `linear-gradient(${angle}deg, ${stopStr})` };
  }
}

function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-2xl border p-5 ${className}`}
      style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
    >
      {children}
    </div>
  );
}

function Label({ children }) {
  return (
    <div className="mb-3 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-label)" }}>
      {children}
    </div>
  );
}

export default function GradientGenerator({ selectedColor, selectedColor2, showToast }) {
  const [stops, setStops] = useState(DEFAULT_STOPS);
  
  useEffect(() => {
    if (selectedColor) {
      setStops((prev) => prev.map((s, i) => i === 0 ? { ...s, color: selectedColor } : s));
    }
  }, [selectedColor]);

  useEffect(() => {
    if (selectedColor2) {
      setStops((prev) => prev.map((s, i) => i === 1 ? { ...s, color: selectedColor2 } : s));
    }
  }, [selectedColor2]);

  const [type, setType] = useState("linear");
  const [angle, setAngle] = useState(135);
  const [selectedStop, setSelectedStop] = useState(1);

  const cssCode = buildCSS(stops, type, angle);

  function addStop() {
    const newPos = stops.length > 0
      ? Math.round(stops.reduce((a, s) => a + s.position, 0) / stops.length)
      : 50;
    const id = stopId++;
    setStops((prev) => [...prev, { id, color: "#a855f7", position: newPos }]);
    setSelectedStop(id);
  }

  function removeStop(id) {
    if (stops.length <= 2) return;
    setStops((prev) => prev.filter((s) => s.id !== id));
    setSelectedStop(stops[0]?.id);
  }

  function updateStop(id, field, value) {
    setStops((prev) => prev.map((s) => s.id === id ? { ...s, [field]: value } : s));
  }

  function copyCSS() {
    navigator.clipboard.writeText(cssCode);
    showToast?.("CSS copied!");
  }

  function reset() {
    setStops(DEFAULT_STOPS);
    setType("linear");
    setAngle(135);
    setSelectedStop(1);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* ── Controls (left) ── */}
      <div className="flex flex-col gap-4 lg:col-span-2">

        {/* Type selector */}
        <Card>
          <Label>Gradient Type</Label>
          <div className="flex gap-2">
            {["linear", "radial", "conic"].map((t) => (
              <button
                key={t}
                onClick={() => setType(t)}
                className="flex-1 rounded-lg py-2 text-xs font-medium capitalize transition-all"
                style={{
                  backgroundColor: type === t ? "var(--btn-inv-bg)" : "var(--surface)",
                  color: type === t ? "var(--btn-inv-text)" : "var(--text-muted)",
                  border: `1px solid ${type === t ? "transparent" : "var(--border)"}`,
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {(type === "linear" || type === "conic") && (
            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>Angle</span>
                <span className="font-mono text-xs" style={{ color: "var(--text-subtle)" }}>{angle}°</span>
              </div>
              <input
                type="range" min="0" max="360" value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
                className="w-full accent-violet-500"
              />
            </div>
          )}
        </Card>

        {/* Stops list */}
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <Label>Color Stops</Label>
            <button
              onClick={addStop}
              className="flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors"
              style={{ backgroundColor: "var(--surface)", color: "var(--text-muted)", border: "1px solid var(--border)" }}
            >
              <Plus size={12} /> Add
            </button>
          </div>

          <div className="space-y-2">
            {stops
              .sort((a, b) => a.position - b.position)
              .map((stop) => (
                <div
                  key={stop.id}
                  onClick={() => setSelectedStop(stop.id)}
                  className="flex items-center gap-3 rounded-xl p-3 cursor-pointer transition-colors"
                  style={{
                    backgroundColor: selectedStop === stop.id ? "var(--surface-hover)" : "var(--surface)",
                    border: `1px solid ${selectedStop === stop.id ? "var(--border-hover)" : "var(--border)"}`,
                  }}
                >
                  <input
                    type="color"
                    value={stop.color}
                    onChange={(e) => updateStop(stop.id, "color", e.target.value)}
                    className="h-8 w-8 cursor-pointer rounded-lg border-0"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-mono text-xs" style={{ color: "var(--text)" }}>
                      {stop.color.toUpperCase()}
                    </div>
                    <input
                      type="range" min="0" max="100" value={stop.position}
                      onChange={(e) => updateStop(stop.id, "position", Number(e.target.value))}
                      onClick={(e) => e.stopPropagation()}
                      className="mt-1 w-full accent-violet-500"
                    />
                    <div className="text-[10px]" style={{ color: "var(--text-faint)" }}>
                      {stop.position}%
                    </div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); removeStop(stop.id); }}
                    className="p-1 rounded transition-colors hover:text-red-400"
                    style={{ color: "var(--text-faint)" }}
                    title="Remove stop"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
          </div>
        </Card>

        <div className="flex gap-2">
          <button
            onClick={reset}
            className="flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-medium transition-colors"
            style={{ borderColor: "var(--border)", color: "var(--text-muted)", backgroundColor: "var(--surface)" }}
          >
            <RotateCcw size={13} /> Reset
          </button>
        </div>
      </div>

      {/* ── Preview (right) ── */}
      <div className="flex flex-col gap-4 lg:col-span-3">

        {/* Big gradient preview */}
        <motion.div
          className="h-64 w-full rounded-2xl border"
          style={{ ...buildInlineStyle(stops, type, angle), borderColor: "var(--border)" }}
          animate={buildInlineStyle(stops, type, angle)}
          transition={{ duration: 0.3 }}
        />

        {/* Gradient strip with stops */}
        <Card>
          <Label>Stop Positions</Label>
          <div className="relative h-10 rounded-xl overflow-hidden" style={buildInlineStyle(stops, type, angle)}>
            {stops.map((stop) => (
              <div
                key={stop.id}
                className="absolute top-1/2 -translate-y-1/2 h-6 w-6 -translate-x-1/2 rounded-full border-2 border-white shadow-md cursor-pointer transition-transform hover:scale-110"
                style={{ left: `${stop.position}%`, backgroundColor: stop.color, boxShadow: "0 2px 8px rgba(0,0,0,0.3)" }}
                onClick={() => setSelectedStop(stop.id)}
              />
            ))}
          </div>
        </Card>

        {/* CSS code */}
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <Label>Generated CSS</Label>
            <button
              onClick={copyCSS}
              className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)", color: "#fff" }}
            >
              <Copy size={12} /> Copy CSS
            </button>
          </div>
          <pre
            className="overflow-x-auto rounded-xl p-4 font-mono text-sm"
            style={{ backgroundColor: "var(--surface)", color: "var(--text-subtle)" }}
          >
            {`.element {`}{"\n"}{"  "}{cssCode}{"\n"}{`}`}
          </pre>

          {/* Usage previews */}
          <div className="mt-4 flex gap-3">
            <div className="flex-1 rounded-xl p-4 text-center text-sm font-semibold text-white" style={buildInlineStyle(stops, type, angle)}>
              Button
            </div>
            <div className="flex-1 rounded-xl p-3" style={buildInlineStyle(stops, type, angle)}>
              <div className="h-2 w-3/4 rounded bg-white/40 mb-1.5" />
              <div className="h-2 w-1/2 rounded bg-white/30" />
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}

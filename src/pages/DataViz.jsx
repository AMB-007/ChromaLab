import { useMemo } from "react";
import { ChartBar, ChartPie, Copy } from "lucide-react";
import { generateColorScale, generateHarmony, getTextColor } from "../utils/colorUtils";

const DATA = [
  { label: "A", value: 42 },
  { label: "B", value: 68 },
  { label: "C", value: 54 },
  { label: "D", value: 88 },
  { label: "E", value: 35 },
  { label: "F", value: 72 },
];

function buildPalette(base) {
  const triadic = generateHarmony(base, "triadic");
  const analogous = generateHarmony(base, "analogous");
  const scale = generateColorScale(base);
  return [...new Set([...triadic, ...analogous, scale[2].hex, scale[4].hex, scale[6].hex])].slice(0, 6);
}

export default function DataViz({ selectedColor = "#8b5cf6", showToast }) {
  const palette = useMemo(() => buildPalette(selectedColor), [selectedColor]);
  const max = Math.max(...DATA.map((d) => d.value));
  const total = DATA.reduce((sum, d) => sum + d.value, 0);
  const pie = DATA.reduce((parts, item, index) => {
    const start = parts.length ? parts[parts.length - 1].end : 0;
    const end = start + (item.value / total) * 360;
    return [...parts, { ...item, start, end, color: palette[index % palette.length] }];
  }, []);
  const pieGradient = `conic-gradient(${pie.map((p) => `${p.color} ${p.start}deg ${p.end}deg`).join(", ")})`;
  const points = DATA.map((d, i) => `${20 + i * 52},${130 - (d.value / max) * 100}`).join(" ");

  const copyPalette = () => {
    navigator.clipboard.writeText(palette.join(", "));
    showToast?.("Chart palette copied");
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border p-5" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-label)" }}>
            <ChartBar size={14} />
            Data Palette
          </div>
          <div className="mt-3 flex overflow-hidden rounded-xl border" style={{ borderColor: "var(--border)" }}>
            {palette.map((color) => (
              <div key={color} className="h-10 w-16" style={{ backgroundColor: color }} />
            ))}
          </div>
        </div>
        <button
          onClick={copyPalette}
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold"
          style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-subtle)" }}
        >
          <Copy size={13} />
          Copy Palette
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border p-5" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="mb-4 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-label)" }}>
            Bar Chart
          </div>
          <div className="flex h-64 items-end gap-3 rounded-xl p-4" style={{ backgroundColor: "var(--surface)" }}>
            {DATA.map((item, index) => {
              const color = palette[index % palette.length];
              return (
                <div key={item.label} className="flex flex-1 flex-col items-center gap-2">
                  <div className="flex w-full items-end justify-center rounded-t-lg transition-all" style={{ height: `${(item.value / max) * 190}px`, backgroundColor: color, color: getTextColor(color) }}>
                    <span className="pb-2 text-xs font-bold">{item.value}</span>
                  </div>
                  <span className="text-xs" style={{ color: "var(--text-faint)" }}>{item.label}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border p-5" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-label)" }}>
            <ChartPie size={14} />
            Pie Chart
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="aspect-square rounded-full border shadow-xl" style={{ background: pieGradient, borderColor: "var(--border)" }} />
            <div className="space-y-2">
              {pie.map((item) => (
                <div key={item.label} className="flex items-center justify-between rounded-lg p-2" style={{ backgroundColor: "var(--surface)" }}>
                  <span className="flex items-center gap-2 text-sm" style={{ color: "var(--text-subtle)" }}>
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
                    Segment {item.label}
                  </span>
                  <span className="font-mono text-xs" style={{ color: "var(--text-faint)" }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border p-5 lg:col-span-2" style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}>
          <div className="mb-4 text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--text-label)" }}>
            Line Chart
          </div>
          <div className="rounded-xl p-4" style={{ backgroundColor: "var(--surface)" }}>
            <svg viewBox="0 0 310 150" className="h-64 w-full overflow-visible">
              {[30, 60, 90, 120].map((y) => (
                <line key={y} x1="16" y1={y} x2="294" y2={y} stroke="currentColor" strokeOpacity="0.12" />
              ))}
              <polyline fill="none" stroke={selectedColor} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" points={points} />
              {DATA.map((item, index) => {
                const [x, y] = points.split(" ")[index].split(",").map(Number);
                return <circle key={item.label} cx={x} cy={y} r="6" fill={palette[index % palette.length]} stroke="var(--bg-card)" strokeWidth="3" />;
              })}
            </svg>
          </div>
        </section>
      </div>
    </div>
  );
}

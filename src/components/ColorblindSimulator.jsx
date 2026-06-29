import { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { simulateColorblind, hexToRgb } from "../utils/colorUtils";
import { X, Palette } from "lucide-react";

const colorblindTypes = [
  { type: "normal", label: "Normal Vision", description: "Full color perception" },
  { type: "protanopia", label: "Protanopia", description: "Red-blind: difficulty distinguishing red from green" },
  { type: "deuteranopia", label: "Deuteranopia", description: "Green-blind: difficulty distinguishing green from red" },
  { type: "tritanopia", label: "Tritanopia", description: "Blue-blind: difficulty distinguishing blue from yellow" },
  { type: "achromatopsia", label: "Achromatopsia", description: "Complete color blindness: sees only grayscale" },
];

const demoPalettes = [
  {
    name: "Traffic Light",
    colors: ["#ff0000", "#ffff00", "#00ff00"],
  },
  {
    name: "Ocean",
    colors: ["#006994", "#009dc4", "#48cae4", "#90e0ef", "#caf0f8"],
  },
  {
    name: "Sunset",
    colors: ["#ff006e", "#fb5607", "#ffbe0b", "#8338ec", "#3a86ff"],
  },
  {
    name: "Forest",
    colors: ["#2d6a4f", "#40916c", "#52b788", "#74c69d", "#95d5b2"],
  },
  {
    name: "Berry",
    colors: ["#590d22", "#800f2f", "#a4133c", "#c9184a", "#ff4d6d"],
  },
];

export default function ColorblindSimulator({ selectedColor }) {
  const [selectedPalette, setSelectedPalette] = useState(0);
  const [customColors, setCustomColors] = useState([]);
  const [showCustom, setShowCustom] = useState(false);
  const [newColor, setNewColor] = useState(selectedColor || "#ff6b6b");
  
  useEffect(() => {
    if (selectedColor) setNewColor(selectedColor);
  }, [selectedColor]);

  const [selectedType, setSelectedType] = useState("normal");

  const currentColors = showCustom
    ? customColors.length > 0
      ? customColors
      : ["#cccccc"]
    : demoPalettes[selectedPalette].colors;

  const addCustomColor = useCallback(() => {
    setCustomColors((prev) => [...prev, newColor]);
  }, [newColor]);

  const removeCustomColor = useCallback((index) => {
    setCustomColors((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const simulatedColors = currentColors.map((color) =>
    selectedType === "normal" ? color : simulateColorblind(color, selectedType)
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Mode toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowCustom(false)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            !showCustom
              ? "bg-white text-black"
              : "bg-white/5 text-white/70 hover:bg-white/10"
          }`}
        >
          Demo Palettes
        </button>
        <button
          onClick={() => setShowCustom(true)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            showCustom
              ? "bg-white text-black"
              : "bg-white/5 text-white/70 hover:bg-white/10"
          }`}
        >
          Custom Palette
        </button>
      </div>

      {/* Palette selector or custom input */}
      {!showCustom ? (
        <div className="flex flex-wrap gap-2">
          {demoPalettes.map((palette, index) => (
            <button
              key={index}
              onClick={() => setSelectedPalette(index)}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all ${
                selectedPalette === index
                  ? "border-white/30 bg-white/10 text-white"
                  : "border-white/5 bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              <div className="flex -space-x-1">
                {palette.colors.slice(0, 3).map((c, i) => (
                  <div
                    key={i}
                    className="h-4 w-4 rounded-full border border-white/20"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              {palette.name}
            </button>
          ))}
        </div>
      ) : (
        <div
          className="rounded-2xl border border-white/10 p-4"
          style={{ backgroundColor: "var(--bg-card)" }}
        >
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="h-10 w-10 cursor-pointer rounded-lg border border-white/10 bg-transparent"
            />
            <input
              type="text"
              value={newColor.toUpperCase()}
              onChange={(e) => {
                const val = e.target.value;
                if (/^#[0-9A-Fa-f]{0,6}$/.test(val)) setNewColor(val);
              }}
              className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-sm text-white outline-none focus:border-white/30"
            />
            <button
              onClick={addCustomColor}
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-white/90"
            >
              Add
            </button>
          </div>
          {customColors.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {customColors.map((color, index) => (
                <div
                  key={index}
                  className="group flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-2 py-1"
                >
                  <div
                    className="h-5 w-5 rounded"
                    style={{ backgroundColor: color }}
                  />
                  <span className="font-mono text-xs text-white/60">
                    {color.toUpperCase()}
                  </span>
                  <button
                    onClick={() => removeCustomColor(index)}
                    className="text-white/30 hover:text-white/70"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Colorblind type selector */}
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {colorblindTypes.map((type) => (
          <button
            key={type.type}
            onClick={() => setSelectedType(type.type)}
            className={`rounded-xl border p-4 text-left transition-all ${
              selectedType === type.type
                ? "border-white/30 bg-white/10"
                : "border-white/5 bg-white/5 hover:bg-white/10"
            }`}
          >
            <div className="text-sm font-medium text-white">{type.label}</div>
            <div className="mt-1 text-xs text-white/50">{type.description}</div>
          </button>
        ))}
      </div>

      {/* Color comparison */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Original */}
        <div
          className="rounded-2xl border border-white/10 p-6"
          style={{ backgroundColor: "var(--bg-card)" }}
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-white/40">
              Original Colors
            </span>
            <Palette size={14} className="text-white/30" />
          </div>
          <div className="space-y-3">
            {currentColors.map((color, index) => (
              <ColorBar
                key={`orig-${index}`}
                color={color}
                label={color.toUpperCase()}
              />
            ))}
          </div>
        </div>

        {/* Simulated */}
        <motion.div
          className="rounded-2xl border border-white/10 p-6"
          style={{ backgroundColor: "var(--bg-card)" }}
          key={selectedType}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-white/40">
              {colorblindTypes.find((t) => t.type === selectedType)?.label}
            </span>
            <Palette size={14} className="text-white/30" />
          </div>
          <div className="space-y-3">
            {simulatedColors.map((color, index) => (
              <ColorBar
                key={`sim-${index}`}
                color={color}
                label={color.toUpperCase()}
                originalColor={currentColors[index]}
              />
            ))}
          </div>
        </motion.div>
      </div>

      {/* Visual preview */}
      <div
        className="rounded-2xl border border-white/10 p-6"
        style={{ backgroundColor: "var(--bg-card)" }}
      >
        <div className="mb-4 text-xs font-medium uppercase tracking-wider text-white/40">
          Visual Preview
        </div>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          {simulatedColors.map((color, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center gap-2"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
            >
              <div
                className="h-20 w-full rounded-xl border border-white/10 shadow-lg"
                style={{ backgroundColor: color }}
              />
              <span className="font-mono text-xs text-white/50">
                {color.toUpperCase()}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Info box */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
        <div className="text-sm text-amber-200/80">
          <strong className="text-amber-200">Tip:</strong> When designing for
          accessibility, avoid relying solely on color to convey information.
          Use patterns, labels, or icons alongside color coding.
        </div>
      </div>
    </div>
  );
}

function ColorBar({ color, label, originalColor }) {
  const rgb = hexToRgb(color);
  return (
    <div className="flex items-center gap-3">
      <div
        className="h-10 w-10 shrink-0 rounded-lg border border-white/10 shadow-sm"
        style={{ backgroundColor: color }}
      />
      <div className="flex-1 min-w-0">
        <div className="font-mono text-sm text-white/80">{label}</div>
        <div className="text-xs text-white/40">
          RGB({rgb.r}, {rgb.g}, {rgb.b})
        </div>
      </div>
      {originalColor && originalColor !== color && (
        <div className="flex items-center gap-1">
          <div
            className="h-4 w-4 rounded border border-white/10"
            style={{ backgroundColor: originalColor }}
          />
          <span className="text-xs text-white/30">→</span>
          <div
            className="h-4 w-4 rounded border border-white/10"
            style={{ backgroundColor: color }}
          />
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Sparkles, Palette, Eye, Code2, Home } from "lucide-react";

const STEPS = [
  {
    id: "welcome",
    icon: <Sparkles size={28} className="text-white" />,
    title: "Welcome to ChromaLab! 🎨",
    description: "Your all-in-one color theory workspace. Let's take a quick tour so you can get the most out of every tool.",
    highlight: null,
    nav: null,
  },
  {
    id: "wheel",
    icon: <Palette size={24} />,
    title: "Pick Your Color",
    description: "Start with the Color Wheel — click or drag anywhere on it to select a hue. Your picked color syncs instantly across every tool in the workspace.",
    highlight: "nav-link-wheel",
    nav: null,
  },
  {
    id: "harmony",
    icon: <Eye size={24} />,
    title: "Build a Palette",
    description: "Use Color Harmonies to generate complementary, analogous, triadic, or split-complement palettes from your base color. Click any swatch to copy it.",
    highlight: null,
    nav: null,
  },
  {
    id: "contrast",
    icon: <Eye size={24} />,
    title: "Check Accessibility",
    description: "The Contrast Checker verifies WCAG AA/AAA compliance. Use the two color wheels to pick foreground and background — the ratio updates live.",
    highlight: null,
    nav: null,
  },
  {
    id: "devtools",
    icon: <Code2 size={24} />,
    title: "Export for Development",
    description: "Dev Tools generates ready-to-paste CSS variables, Tailwind config, SCSS tokens, and more — just pick your format and copy.",
    highlight: null,
    nav: null,
  },
  {
    id: "done",
    icon: <Sparkles size={28} className="text-white" />,
    title: "You're ready!",
    description: "Explore all 14 tools from the navigation bar above. Use Ctrl+Z to undo any color change, and press '?' to see all keyboard shortcuts.",
    highlight: null,
    nav: null,
  },
];

const STORAGE_KEY = "chromalab_tour_done";

export function useOnboardingTour() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const done = localStorage.getItem(STORAGE_KEY);
    if (!done) {
      setTimeout(() => setOpen(true), 800);
    }
  }, []);

  const startTour = () => setOpen(true);
  const closeTour = () => {
    setOpen(false);
    localStorage.setItem(STORAGE_KEY, "1");
  };

  return { tourOpen: open, startTour, closeTour };
}

export default function OnboardingTour({ open, onClose }) {
  const [step, setStep] = useState(0);
  const current = STEPS[step];
  const isFirst = step === 0;
  const isLast = step === STEPS.length - 1;

  useEffect(() => {
    if (open) setStep(0);
  }, [open]);

  const next = () => {
    if (isLast) {
      onClose();
    } else {
      setStep((s) => s + 1);
    }
  };

  const skip = () => onClose();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[400] bg-black/60 backdrop-blur-sm"
            onClick={skip}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[401] flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="relative w-full max-w-md overflow-hidden rounded-3xl border shadow-2xl"
              style={{
                backgroundColor: "var(--bg)",
                borderColor: "var(--border-md)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.5)",
              }}
            >
              {/* Top gradient bar */}
              <div className="h-1 w-full" style={{ background: "linear-gradient(90deg,#8b5cf6,#d946ef,#06b6d4)" }} />

              {/* Close */}
              <button
                onClick={skip}
                className="absolute right-4 top-4 rounded-lg p-1.5 transition-colors"
                style={{ color: "var(--text-faint)" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "var(--text)"}
                onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-faint)"}
              >
                <X size={16} />
              </button>

              {/* Step indicator dots */}
              <div className="flex justify-center gap-1.5 pt-5">
                {STEPS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setStep(i)}
                    className="rounded-full transition-all"
                    style={{
                      width: i === step ? 20 : 7,
                      height: 7,
                      backgroundColor: i === step ? "#8b5cf6" : "var(--border-md)",
                    }}
                  />
                ))}
              </div>

              {/* Step content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.22 }}
                  className="px-8 py-6 text-center"
                >
                  {/* Icon */}
                  <div
                    className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl shadow-xl"
                    style={{
                      background: isFirst || isLast
                        ? "linear-gradient(135deg,#8b5cf6,#d946ef)"
                        : "var(--surface)",
                      color: isFirst || isLast ? "white" : "#8b5cf6",
                      boxShadow: isFirst || isLast ? "0 8px 24px rgba(139,92,246,0.4)" : "none",
                    }}
                  >
                    {current.icon}
                  </div>

                  {/* Text */}
                  <h3 className="mb-3 text-xl font-black tracking-tight" style={{ color: "var(--text)", letterSpacing: "-0.02em" }}>
                    {current.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    {current.description}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Actions */}
              <div className="flex items-center justify-between gap-3 px-8 pb-8">
                <button
                  onClick={skip}
                  className="text-xs font-semibold transition-colors"
                  style={{ color: "var(--text-faint)" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-faint)"}
                >
                  Skip tour
                </button>

                <div className="flex items-center gap-1 text-xs" style={{ color: "var(--text-faint)" }}>
                  {step + 1} / {STEPS.length}
                </div>

                <motion.button
                  onClick={next}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold"
                  style={{ background: "linear-gradient(135deg,#8b5cf6,#d946ef)", color: "#fff", boxShadow: "0 4px 16px rgba(139,92,246,0.4)" }}
                >
                  {isLast ? (
                    <>Let's go! <Sparkles size={14} /></>
                  ) : (
                    <>Next <ArrowRight size={14} /></>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

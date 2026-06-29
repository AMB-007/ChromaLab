import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Keyboard, X } from "lucide-react";

const SHORTCUTS = [
  { group: "Navigation" },
  { key: "H", action: "Home" },
  { key: "1", action: "Color Wheel" },
  { key: "2", action: "Harmonies" },
  { key: "3", action: "Gradient Generator" },
  { key: "4", action: "Color Mixer" },
  { key: "5", action: "Tints and Shades" },
  { key: "6", action: "Color Converter" },
  { key: "7", action: "Image Picker" },
  { key: "8", action: "Contrast Checker" },
  { key: "9", action: "Colorblind Simulator" },
  { key: "D", action: "Dev Tools" },
  { key: "V", action: "UI Preview" },
  { key: "Z", action: "Data Viz" },
  { key: "Y", action: "Typography" },
  { key: "B", action: "Brand Mockup" },
  { group: "Actions" },
  { key: "Ctrl+Z", action: "Undo color change" },
  { key: "Ctrl+Y", action: "Redo color change" },
  { key: "T", action: "Toggle theme" },
  { key: "F", action: "Toggle fullscreen" },
  { key: "?", action: "Show shortcuts" },
  { key: "Esc", action: "Close this panel" },
];

export default function KeyboardHelp({ open, onClose }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-[90] bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed left-1/2 top-1/2 z-[100] w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl border p-6 shadow-2xl"
            style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Keyboard size={18} style={{ color: "var(--text-muted)" }} />
                <h2 className="font-bold" style={{ color: "var(--text)" }}>
                  Keyboard Shortcuts
                </h2>
              </div>
              <button
                onClick={onClose}
                className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors hover:bg-white/10"
                style={{ color: "var(--text-muted)" }}
                title="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto pr-1">
              {SHORTCUTS.map((shortcut, index) =>
                shortcut.group ? (
                  <div
                    key={`${shortcut.group}-${index}`}
                    className="mb-2 mt-4 text-[10px] font-semibold uppercase tracking-widest first:mt-0"
                    style={{ color: "var(--text-faint)" }}
                  >
                    {shortcut.group}
                  </div>
                ) : (
                  <div
                    key={`${shortcut.key}-${shortcut.action}`}
                    className="flex items-center justify-between gap-4 py-1.5"
                    style={{ borderBottom: "1px solid var(--border)" }}
                  >
                    <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                      {shortcut.action}
                    </span>
                    <kbd
                      className="shrink-0 rounded-md border px-2 py-0.5 font-mono text-xs"
                      style={{
                        backgroundColor: "var(--surface)",
                        borderColor: "var(--border-md)",
                        color: "var(--text-subtle)",
                      }}
                    >
                      {shortcut.key}
                    </kbd>
                  </div>
                )
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

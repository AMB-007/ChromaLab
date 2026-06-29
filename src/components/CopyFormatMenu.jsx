import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Copy, X } from "lucide-react";
import { hexToRgb, rgbToHsl } from "../utils/colorUtils";
import { formatColor } from "../utils/tailwindColorMatch";

const FORMATS = ["HEX", "rgb()", "hsl()", "Tailwind", "CSS Var"];

/**
 * CopyFormatMenu — context-aware copy picker.
 * Usage: Pass `color` (hex string) and `onClose` callback.
 * The menu appears near the `anchorRef` element.
 */
export default function CopyFormatMenu({ color, onClose, anchorEl }) {
  const [copied, setCopied] = useState(null);
  const menuRef = useRef(null);
  const rgb = hexToRgb(color);
  const hsl = rgbToHsl(rgb);

  // Click-outside close
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target) &&
          anchorEl && !anchorEl.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [anchorEl, onClose]);

  const handleCopy = (format) => {
    const text = formatColor(color, format, rgb, hsl);
    navigator.clipboard.writeText(text);
    setCopied(format);
    setTimeout(() => {
      setCopied(null);
      onClose();
    }, 900);
  };

  return (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, scale: 0.94, y: 6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: 6 }}
      transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
      className="fixed z-[300] rounded-2xl border shadow-2xl overflow-hidden"
      style={{
        backgroundColor: "var(--bg)",
        borderColor: "var(--border-md)",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px var(--border)",
        minWidth: 200,
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: "var(--border-md)", backgroundColor: "var(--surface)" }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="h-5 w-5 rounded-md border shadow-sm"
            style={{ backgroundColor: color, borderColor: "rgba(255,255,255,0.15)" }}
          />
          <span className="font-mono text-xs font-semibold" style={{ color: "var(--text)" }}>
            {color.toUpperCase()}
          </span>
        </div>
        <button onClick={onClose} className="rounded-lg p-1 transition-colors" style={{ color: "var(--text-faint)" }}
          onMouseEnter={(e) => e.currentTarget.style.color = "var(--text)"}
          onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-faint)"}
        >
          <X size={13} />
        </button>
      </div>

      {/* Format list */}
      <div className="p-2">
        <div className="mb-1.5 px-2 text-[9px] font-black uppercase tracking-[0.14em]" style={{ color: "var(--text-faint)" }}>
          Copy as
        </div>
        {FORMATS.map((format) => {
          const preview = formatColor(color, format, rgb, hsl);
          const isCopied = copied === format;
          return (
            <button
              key={format}
              onClick={() => handleCopy(format)}
              className="flex w-full items-center justify-between rounded-xl px-3 py-2 transition-all"
              style={{ backgroundColor: isCopied ? "rgba(139,92,246,0.1)" : "transparent" }}
              onMouseEnter={(e) => { if (!isCopied) e.currentTarget.style.backgroundColor = "var(--surface)"; }}
              onMouseLeave={(e) => { if (!isCopied) e.currentTarget.style.backgroundColor = "transparent"; }}
            >
              <div className="flex flex-col items-start gap-0.5">
                <span className="text-xs font-semibold" style={{ color: isCopied ? "#a78bfa" : "var(--text)" }}>
                  {format}
                </span>
                <span className="font-mono text-[10px]" style={{ color: "var(--text-faint)" }}>
                  {preview}
                </span>
              </div>
              {isCopied
                ? <Check size={13} className="shrink-0 text-violet-400" />
                : <Copy size={12} className="shrink-0" style={{ color: "var(--text-faint)" }} />
              }
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}

/**
 * useCopyFormat — hook that manages the copy menu state.
 * Returns: { openMenu, menuProps }
 * 
 * Usage:
 *   const { openMenu, CopyMenu } = useCopyFormat();
 *   <div onClick={(e) => openMenu("#ff0000", e.currentTarget)}>swatch</div>
 *   <CopyMenu />
 */
export function useCopyFormat() {
  const [state, setState] = useState(null); // { color, el, x, y }

  const openMenu = (color, anchorEl, event) => {
    if (event) event.stopPropagation();
    const rect = anchorEl?.getBoundingClientRect?.();
    setState({ color, anchorEl, x: rect ? rect.left : 0, y: rect ? rect.bottom + 6 : 0 });
  };

  const closeMenu = () => setState(null);

  const CopyMenu = () => (
    <AnimatePresence>
      {state && (
        <div
          className="fixed z-[300]"
          style={{ top: Math.min(state.y, window.innerHeight - 260), left: Math.min(state.x, window.innerWidth - 220) }}
        >
          <CopyFormatMenu
            color={state.color}
            onClose={closeMenu}
            anchorEl={state.anchorEl}
          />
        </div>
      )}
    </AnimatePresence>
  );

  return { openMenu, closeMenu, CopyMenu };
}

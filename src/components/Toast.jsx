import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";

/* ─── Hook ──────────────────────────────────────────────────── */
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = "success") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2200);
  }, []);

  return { toasts, showToast };
}

/* ─── Container ─────────────────────────────────────────────── */
export function ToastContainer({ toasts }) {
  return (
    <div className="pointer-events-none fixed bottom-5 right-5 z-[200] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium shadow-xl"
            style={{
              backgroundColor: "var(--bg-card)",
              borderColor: "var(--border-md)",
              color: "var(--text)",
              backdropFilter: "blur(12px)",
            }}
          >
            <CheckCircle2 size={15} className="shrink-0 text-green-400" />
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

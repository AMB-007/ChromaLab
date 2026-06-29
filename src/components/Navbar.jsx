import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ChevronRight,
  Home,
  Keyboard,
  Maximize2,
  Minimize2,
  Moon,
  Redo2,
  Share2,
  Sparkles,
  Sun,
  Undo2,
  Menu,
  X,
} from "lucide-react";

/* ─── Tooltip ──────────────────────────────────────────────── */
function Tooltip({ label, children }) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative flex" onMouseEnter={() => setShow(true)} onMouseLeave={() => setShow(false)}>
      {children}
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.12 }}
            className="pointer-events-none absolute left-1/2 top-full z-[200] mt-2 -translate-x-1/2 whitespace-nowrap rounded-lg px-2.5 py-1 text-[11px] font-semibold shadow-xl"
            style={{ backgroundColor: "var(--text)", color: "var(--bg)" }}
          >
            {label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── Icon button ──────────────────────────────────────────── */
function IconButton({ children, onClick, title, active = false }) {
  return (
    <Tooltip label={title}>
      <button
        onClick={onClick}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition-all"
        style={{
          borderColor: active ? "rgba(139,92,246,0.45)" : "var(--border-md)",
          backgroundColor: active ? "rgba(139,92,246,0.1)" : "transparent",
          color: active ? "#a78bfa" : "var(--text-muted)",
        }}
        onMouseEnter={(e) => {
          if (!active) {
            e.currentTarget.style.backgroundColor = "var(--surface)";
            e.currentTarget.style.color = "var(--text)";
            e.currentTarget.style.borderColor = "var(--border-hover)";
          }
        }}
        onMouseLeave={(e) => {
          if (!active) {
            e.currentTarget.style.backgroundColor = "transparent";
            e.currentTarget.style.color = "var(--text-muted)";
            e.currentTarget.style.borderColor = "var(--border-md)";
          }
        }}
      >
        {children}
      </button>
    </Tooltip>
  );
}

/* ─── Divider ──────────────────────────────────────────────── */
function Divider() {
  return <div className="h-5 w-px mx-1 shrink-0" style={{ backgroundColor: "var(--border-md)" }} />;
}

/* ─── Dropdown group ───────────────────────────────────────── */
function GroupMenu({ group, page, onNavigate }) {
  const [open, setOpen] = useState(false);
  const active = group.items.some((item) => item.id === page);
  const activeItem = group.items.find((item) => item.id === page);

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className="relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all"
        style={{
          color: active ? "var(--text)" : "var(--text-muted)",
          backgroundColor: active ? "var(--surface)" : "transparent",
        }}
        onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = "var(--text)"; }}
        onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = "var(--text-muted)"; }}
      >
        <span>{group.label}</span>
        {active && activeItem && (
          <span className="text-[10px] opacity-50">· {activeItem.label}</span>
        )}
        <ChevronDown
          size={11}
          style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }}
        />
        {active && (
          <motion.div
            layoutId={`nav-underline-${group.label}`}
            className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
            style={{ background: "linear-gradient(90deg, #8b5cf6, #d946ef)" }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
          />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.16, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-0 top-full z-[100] pt-3 min-w-72"
          >
            <div
              className="rounded-2xl border p-1.5 shadow-2xl"
              style={{
                backgroundColor: "var(--bg)",
                borderColor: "var(--border-md)",
                boxShadow: "0 24px 64px rgba(0,0,0,0.45), 0 0 0 1px var(--border)",
              }}
            >
              <div className="px-3 pt-2 pb-1 text-[9px] font-black uppercase tracking-[0.14em]" style={{ color: "var(--text-faint)" }}>
                {group.label}
              </div>
              {group.items.map((item) => {
                const isActive = page === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { onNavigate(item.id); setOpen(false); }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-all"
                    style={{
                      backgroundColor: isActive ? "rgba(139,92,246,0.1)" : "transparent",
                    }}
                    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = "var(--surface)"; }}
                    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.backgroundColor = "transparent"; }}
                  >
                    <span
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                      style={{
                        backgroundColor: isActive ? "rgba(139,92,246,0.15)" : "var(--surface)",
                        color: isActive ? "#a78bfa" : "var(--text-muted)",
                      }}
                    >
                      {item.icon}
                    </span>
                    <span className="flex-1 min-w-0">
                      <span className="block text-xs font-semibold" style={{ color: isActive ? "#a78bfa" : "var(--text)" }}>
                        {item.label}
                      </span>
                      <span className="block truncate text-[10px] leading-snug mt-0.5" style={{ color: "var(--text-faint)" }}>
                        {item.description}
                      </span>
                    </span>
                    {isActive && <ChevronRight size={12} className="shrink-0" style={{ color: "#a78bfa" }} />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   NAVBAR
   ═══════════════════════════════════════════════════════════ */
export default function Navbar({
  page,
  groups = [],
  onNavigate,
  theme,
  onToggleTheme,
  onToggleHelp,
  onToggleFullscreen,
  isFullscreen,
  onShare,
  onUndo,
  onRedo,
}) {
  const homeActive = page === "home";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="sticky top-0 z-50 w-full">
      <header
        className="w-full border-b relative"
        style={{
          backgroundColor: "var(--bg-nav)",
          borderColor: "var(--border-md)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
        }}
      >
        {/* Top gradient accent */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent 5%, #8b5cf6 30%, #d946ef 70%, transparent 95%)" }}
        />

        <div className="flex w-full items-center justify-between px-5 py-2.5">

          {/* ── Logo ── */}
          <button
            id="nav-logo"
            onClick={() => onNavigate("home")}
            className="group flex shrink-0 items-center gap-2.5 mr-6"
          >
            <div
              className="flex h-8 w-8 items-center justify-center rounded-xl transition-transform group-hover:scale-105"
              style={{ background: "linear-gradient(135deg,#8b5cf6,#d946ef)", boxShadow: "0 4px 14px rgba(139,92,246,0.4)" }}
            >
              <Sparkles size={15} className="text-white" />
            </div>
            <div className="hidden sm:block leading-tight">
              <div className="text-sm font-black tracking-tight" style={{ color: "var(--text)", letterSpacing: "-0.02em" }}>
                ChromaLab
              </div>
              <div className="text-[9px] font-medium" style={{ color: "var(--text-faint)" }}>
                Color Theory Explorer
              </div>
            </div>
          </button>

          {/* ── Desktop Nav ── */}
          <nav className="hidden md:flex flex-1 items-center gap-0.5">
            <button
              id="nav-home"
              onClick={() => onNavigate("home")}
              className="relative flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all"
              style={{
                color: homeActive ? "var(--text)" : "var(--text-muted)",
                backgroundColor: homeActive ? "var(--surface)" : "transparent",
              }}
              onMouseEnter={(e) => { if (!homeActive) e.currentTarget.style.color = "var(--text)"; }}
              onMouseLeave={(e) => { if (!homeActive) e.currentTarget.style.color = "var(--text-muted)"; }}
            >
              <Home size={13} />
              <span>Home</span>
              {homeActive && (
                <motion.div
                  layoutId="nav-underline-home"
                  className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full"
                  style={{ background: "linear-gradient(90deg, #8b5cf6, #d946ef)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 35 }}
                />
              )}
            </button>

            {groups.map((group) => (
              <GroupMenu key={group.label} group={group} page={page} onNavigate={onNavigate} />
            ))}
          </nav>

          {/* ── Desktop Right Actions ── */}
          <div className="hidden md:flex items-center gap-1">
            <IconButton onClick={onUndo} title="Undo (Ctrl+Z)"><Undo2 size={14} /></IconButton>
            <IconButton onClick={onRedo} title="Redo (Ctrl+Y)"><Redo2 size={14} /></IconButton>
            <Divider />
            <IconButton onClick={onShare} title="Copy share URL"><Share2 size={14} /></IconButton>
            <IconButton onClick={onToggleHelp} title="Keyboard shortcuts (?)"><Keyboard size={14} /></IconButton>
            <IconButton onClick={onToggleFullscreen} title={isFullscreen ? "Exit fullscreen (F)" : "Fullscreen (F)"}>
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </IconButton>
            <Divider />
            <IconButton onClick={onToggleTheme} title={theme === "dark" ? "Light mode (T)" : "Dark mode (T)"}>
              <motion.div
                key={theme}
                initial={{ scale: 0.4, rotate: -90, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ duration: 0.22 }}
              >
                {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
              </motion.div>
            </IconButton>
          </div>

          {/* ── Mobile toggle ── */}
          <button
            className="flex md:hidden h-8 w-8 items-center justify-center rounded-lg border transition-all"
            style={{ borderColor: "var(--border-md)", color: "var(--text-muted)", backgroundColor: "var(--surface)" }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
          </button>
        </div>

        {/* ── Mobile Menu ── */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden border-t md:hidden"
              style={{ borderColor: "var(--border-md)" }}
            >
              <div className="flex flex-col gap-4 p-4">
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => { onNavigate("home"); setMobileMenuOpen(false); }}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold"
                    style={{
                      backgroundColor: homeActive ? "rgba(139,92,246,0.1)" : "transparent",
                      color: homeActive ? "#a78bfa" : "var(--text-muted)",
                    }}
                  >
                    <Home size={16} /> Home
                  </button>
                  {groups.map((g) => (
                    <div key={g.label} className="mt-3">
                      <div className="mb-1 px-3 text-[9px] font-black uppercase tracking-[0.14em]" style={{ color: "var(--text-faint)" }}>
                        {g.label}
                      </div>
                      {g.items.map((item) => (
                        <button
                          key={item.id}
                          onClick={() => { onNavigate(item.id); setMobileMenuOpen(false); }}
                          className="flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm"
                          style={{
                            backgroundColor: page === item.id ? "rgba(139,92,246,0.08)" : "transparent",
                            color: page === item.id ? "#a78bfa" : "var(--text-muted)",
                          }}
                        >
                          <span>{item.icon}</span>
                          <span className="font-medium">{item.label}</span>
                        </button>
                      ))}
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-2 pt-3 border-t" style={{ borderColor: "var(--border-md)" }}>
                  <IconButton onClick={onUndo} title="Undo"><Undo2 size={15} /></IconButton>
                  <IconButton onClick={onRedo} title="Redo"><Redo2 size={15} /></IconButton>
                  <IconButton onClick={onShare} title="Share"><Share2 size={15} /></IconButton>
                  <IconButton onClick={onToggleHelp} title="Help"><Keyboard size={15} /></IconButton>
                  <IconButton onClick={onToggleTheme} title="Theme">
                    {theme === "dark" ? <Sun size={15} /> : <Moon size={15} />}
                  </IconButton>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </div>
  );
}

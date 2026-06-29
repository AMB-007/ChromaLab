import { useState, useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import {
  hexToRgb,
  rgbToHsl,
  hslToHex,
  getColorName,
  getTextColor,
} from "../utils/colorUtils";

function hslToWheelPosition(h, s, radius, center) {
  const angleRad = (h * Math.PI) / 180;
  const dist = (s / 100) * radius;
  return {
    x: center + dist * Math.cos(angleRad),
    y: center + dist * Math.sin(angleRad),
  };
}

export default function ColorWheel({
  onColorSelect,
  selectedColor = "#ff0000",
  size = 320,
}) {
  const canvasRef = useRef(null);
  const isDraggingRef = useRef(false);
  const [currentColor, setCurrentColor] = useState(selectedColor);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const center = size / 2;
  const radius = size / 2 - 10;

  // Sync position from selectedColor prop
  useEffect(() => {
    const hsl = rgbToHsl(hexToRgb(selectedColor));
    const pos = hslToWheelPosition(hsl.h, hsl.s, radius, center);
    setPosition(pos);
    setCurrentColor(selectedColor);
  }, [selectedColor, radius, center]);

  // Draw the color wheel
  const drawWheel = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = size * 2;
    canvas.height = size * 2;
    ctx.scale(2, 2);

    // Outer hue ring
    for (let angle = 0; angle < 360; angle++) {
      const startAngle = ((angle - 1) * Math.PI) / 180;
      const endAngle = (angle * Math.PI) / 180;
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = `hsl(${angle}, 100%, 50%)`;
      ctx.fill();
    }

    // Inner saturation gradient
    const innerRadius = radius * 0.65;
    const gradient = ctx.createRadialGradient(center, center, 0, center, center, innerRadius);
    gradient.addColorStop(0, "white");
    gradient.addColorStop(1, "transparent");
    ctx.beginPath();
    ctx.arc(center, center, innerRadius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Subtle border
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }, [size, center, radius]);

  useEffect(() => {
    drawWheel();
  }, [drawWheel]);

  const getColorAtPosition = useCallback(
    (clientX, clientY) => {
      const canvas = canvasRef.current;
      if (!canvas) return null;
      const rect = canvas.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const dx = x - center;
      const dy = y - center;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance > radius) return null;
      let angle = Math.atan2(dy, dx) * (180 / Math.PI);
      angle = (angle + 360) % 360;
      const saturation = Math.min(100, (distance / radius) * 100);
      return { hex: hslToHex({ h: angle, s: saturation, l: 50 }), x, y };
    },
    [center, radius]
  );

  const handleInteraction = useCallback(
    (clientX, clientY) => {
      const result = getColorAtPosition(clientX, clientY);
      if (result) {
        setCurrentColor(result.hex);
        setPosition({ x: result.x, y: result.y });
        onColorSelect?.(result.hex);
      }
    },
    [getColorAtPosition, onColorSelect]
  );

  // Mouse handlers
  const handleMouseDown = useCallback((e) => {
    isDraggingRef.current = true;
    handleInteraction(e.clientX, e.clientY);
  }, [handleInteraction]);

  // Attach touchmove imperatively with { passive: false } so we can preventDefault
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onTouchStart = (e) => {
      isDraggingRef.current = true;
      const touch = e.touches[0];
      handleInteraction(touch.clientX, touch.clientY);
    };

    const onTouchMove = (e) => {
      if (!isDraggingRef.current) return;
      e.preventDefault(); // prevent page scroll while dragging
      const touch = e.touches[0];
      handleInteraction(touch.clientX, touch.clientY);
    };

    const onTouchEnd = () => {
      isDraggingRef.current = false;
    };

    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove", onTouchMove, { passive: false });
    canvas.addEventListener("touchend", onTouchEnd);

    return () => {
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove", onTouchMove);
      canvas.removeEventListener("touchend", onTouchEnd);
    };
  }, [handleInteraction]);

  // Global mouse move + up for smooth drag outside canvas bounds
  useEffect(() => {
    const onMouseMove = (e) => {
      if (isDraggingRef.current) handleInteraction(e.clientX, e.clientY);
    };
    const onMouseUp = () => {
      isDraggingRef.current = false;
    };
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [handleInteraction]);

  const rgb = hexToRgb(currentColor);
  const hsl = rgbToHsl(rgb);
  const textColor = getTextColor(currentColor);

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Wheel canvas */}
      <div className="relative select-none">
        <canvas
          ref={canvasRef}
          width={size}
          height={size}
          className="cursor-crosshair rounded-full"
          style={{ width: size, height: size, touchAction: "none" }}
          onMouseDown={handleMouseDown}
        />
        {/* Crosshair indicator */}
        {position.x > 0 && position.y > 0 && (
          <motion.div
            className="pointer-events-none absolute"
            style={{
              left: position.x - 10,
              top: position.y - 10,
              width: 20,
              height: 20,
              borderRadius: "50%",
              border: `3px solid ${textColor}`,
              backgroundColor: currentColor,
              boxShadow: `0 0 0 1.5px rgba(0,0,0,0.3), 0 4px 12px rgba(0,0,0,0.4)`,
            }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          />
        )}
      </div>

      {/* Color info card */}
      <motion.div
        className="w-full rounded-2xl border p-4"
        style={{ backgroundColor: "var(--bg-card)", borderColor: "var(--border)" }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="h-12 w-12 shrink-0 rounded-xl border-2 shadow-lg"
            style={{ backgroundColor: currentColor, borderColor: "var(--border-md)" }}
            animate={{ backgroundColor: currentColor }}
            transition={{ duration: 0.12 }}
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold truncate" style={{ color: "var(--text)" }}>
              {getColorName(hsl.h)}
            </div>
            <div className="font-mono text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              {currentColor.toUpperCase()}
            </div>
            <div className="mt-1 flex gap-2 text-[10px]" style={{ color: "var(--text-faint)" }}>
              <span>H {Math.round(hsl.h)}°</span>
              <span>S {Math.round(hsl.s)}%</span>
              <span>L {Math.round(hsl.l)}%</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

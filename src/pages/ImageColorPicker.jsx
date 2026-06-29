import { useCallback, useRef, useState, useEffect } from "react";
import { Check, Copy, Image as ImageIcon, Palette, Pipette, Upload } from "lucide-react";
import { extractDominantColors, getTextColor, hexToRgb, rgbToHex } from "../utils/colorUtils";

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

export default function ImageColorPicker({ selectedColor = "#8b5cf6", onColorChange, showToast }) {
  const canvasRef = useRef(null);
  const fileRef = useRef(null);
  const [imageName, setImageName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [pickedColor, setPickedColor] = useState(selectedColor || "#8b5cf6");
  
  useEffect(() => {
    if (selectedColor) setPickedColor(selectedColor);
  }, [selectedColor]);

  const [palette, setPalette] = useState([]);
  const [copied, setCopied] = useState(null);

  const drawImage = useCallback((file) => {
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const maxWidth = 900;
        const scale = Math.min(1, maxWidth / img.width);
        canvas.width = Math.max(1, Math.round(img.width * scale));
        canvas.height = Math.max(1, Math.round(img.height * scale));
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setImageName(file.name);
        const colors = extractDominantColors(canvas, 6);
        setPalette(colors);
        if (colors[0]) {
          setPickedColor(colors[0]);
          onColorChange?.(colors[0]);
        }
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  }, [onColorChange]);

  const handleFiles = (files) => {
    const [file] = files || [];
    drawImage(file);
  };

  const handleCanvasClick = (event) => {
    const canvas = canvasRef.current;
    if (!canvas || !canvas.width || !canvas.height) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) * (canvas.width / rect.width));
    const y = Math.floor((event.clientY - rect.top) * (canvas.height / rect.height));
    const pixel = canvas.getContext("2d").getImageData(x, y, 1, 1).data;
    const color = rgbToHex({ r: pixel[0], g: pixel[1], b: pixel[2] });
    setPickedColor(color);
    onColorChange?.(color);
  };

  const copyColor = (hex) => {
    navigator.clipboard.writeText(hex.toUpperCase());
    setCopied(hex);
    setTimeout(() => setCopied(null), 1400);
    showToast?.(`Copied ${hex.toUpperCase()}`);
  };

  const rgb = hexToRgb(pickedColor);

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="flex flex-col gap-4 lg:col-span-2">
        <Card>
          <Label>Upload Image</Label>
          <button
            onClick={() => fileRef.current?.click()}
            onDragEnter={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragOver={(e) => e.preventDefault()}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              handleFiles(e.dataTransfer.files);
            }}
            className="flex min-h-44 w-full flex-col items-center justify-center gap-3 rounded-2xl border border-dashed p-6 text-center transition-colors"
            style={{
              borderColor: isDragging ? "var(--border-hover)" : "var(--border-md)",
              backgroundColor: isDragging ? "var(--surface-hover)" : "var(--surface)",
              color: "var(--text-muted)",
            }}
          >
            <Upload size={28} />
            <span className="text-sm font-semibold" style={{ color: "var(--text)" }}>
              Drop an image or click to browse
            </span>
            <span className="text-xs">PNG, JPG, and WebP work locally in the browser.</span>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          {imageName && (
            <div className="mt-3 flex items-center gap-2 text-xs" style={{ color: "var(--text-faint)" }}>
              <ImageIcon size={13} />
              {imageName}
            </div>
          )}
        </Card>

        <Card>
          <Label>Picked Color</Label>
          <div className="flex items-center gap-4">
            <div
              className="flex h-20 w-20 items-center justify-center rounded-2xl border"
              style={{
                backgroundColor: pickedColor,
                borderColor: "var(--border-md)",
                color: getTextColor(pickedColor),
              }}
            >
              <Pipette size={22} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-mono text-lg font-bold" style={{ color: "var(--text)" }}>
                {pickedColor.toUpperCase()}
              </div>
              <div className="text-sm" style={{ color: "var(--text-muted)" }}>
                RGB({rgb.r}, {rgb.g}, {rgb.b})
              </div>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={() => copyColor(pickedColor)}
                  className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold"
                  style={{ backgroundColor: "var(--surface-hover)", color: "var(--text-subtle)" }}
                >
                  {copied === pickedColor ? <Check size={13} /> : <Copy size={13} />}
                  Copy
                </button>
                <button
                  onClick={() => onColorChange?.(pickedColor)}
                  className="rounded-lg px-3 py-2 text-xs font-semibold text-white"
                  style={{ background: "linear-gradient(135deg,#8b5cf6,#ec4899)" }}
                >
                  Use Globally
                </button>
              </div>
            </div>
          </div>
        </Card>

        <Card>
          <Label>Extracted Palette</Label>
          <div className="grid grid-cols-2 gap-2">
            {(palette.length ? palette : [selectedColor]).map((color) => (
              <button
                key={color}
                onClick={() => {
                  setPickedColor(color);
                  onColorChange?.(color);
                  copyColor(color);
                }}
                className="flex items-center gap-2 rounded-xl border p-2 text-left"
                style={{ backgroundColor: "var(--surface)", borderColor: "var(--border)" }}
              >
                <span className="h-9 w-9 rounded-lg border" style={{ backgroundColor: color, borderColor: "var(--border-md)" }} />
                <span className="font-mono text-xs" style={{ color: "var(--text-subtle)" }}>{color.toUpperCase()}</span>
              </button>
            ))}
          </div>
        </Card>
      </div>

      <div className="lg:col-span-3">
        <Card className="h-full">
          <div className="mb-3 flex items-center justify-between">
            <Label>Canvas Picker</Label>
            <Palette size={15} style={{ color: "var(--text-faint)" }} />
          </div>
          <div className="overflow-hidden rounded-2xl border" style={{ borderColor: "var(--border)" }}>
            <canvas
              ref={canvasRef}
              onClick={handleCanvasClick}
              className="block min-h-64 w-full cursor-crosshair"
              style={{ backgroundColor: "var(--surface)" }}
            />
          </div>
          <div className="mt-3 text-xs" style={{ color: "var(--text-faint)" }}>
            Click any pixel in the image to sample its exact color.
          </div>
        </Card>
      </div>
    </div>
  );
}

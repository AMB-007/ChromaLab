// Color conversion utilities

export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

export function rgbToHex({ r, g, b }) {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = Math.round(x).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

export function rgbToHsl({ r, g, b }) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      case b:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }

  return { h: h * 360, s: s * 100, l: l * 100 };
}

export function hslToRgb({ h, s, l }) {
  h /= 360;
  s /= 100;
  l /= 100;
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

export function rgbToHsv({ r, g, b }) {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  const v = max;
  const d = max - min;
  const s = max === 0 ? 0 : d / max;

  if (max !== min) {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return { h: h * 360, s: s * 100, v: v * 100 };
}

export function hsvToRgb({ h, s, v }) {
  h /= 360;
  s /= 100;
  v /= 100;
  let r = 0,
    g = 0,
    b = 0;

  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

export function hexToHsl(hex) {
  return rgbToHsl(hexToRgb(hex));
}

export function rgbToHsb(rgb) {
  const hsv = rgbToHsv(rgb);
  return { h: hsv.h, s: hsv.s, b: hsv.v };
}

export function hsbToRgb({ h, s, b, v }) {
  return hsvToRgb({ h, s, v: b ?? v ?? 0 });
}

export function hslToHex(hsl) {
  return rgbToHex(hslToRgb(hsl));
}

// Relative luminance for WCAG contrast
export function getLuminance({ r, g, b }) {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function getContrastRatio(color1, color2) {
  const lum1 = getLuminance(hexToRgb(color1));
  const lum2 = getLuminance(hexToRgb(color2));
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

export function getContrastGrade(ratio) {
  return {
    aa: ratio >= 4.5,
    aaa: ratio >= 7,
    aaLarge: ratio >= 3,
    aaaLarge: ratio >= 4.5,
  };
}

// Colorblind simulation matrices
const colorblindMatrices = {
  protanopia: [
    [0.567, 0.433, 0],
    [0.558, 0.442, 0],
    [0, 0.242, 0.758],
  ],
  deuteranopia: [
    [0.625, 0.375, 0],
    [0.7, 0.3, 0],
    [0, 0.3, 0.7],
  ],
  tritanopia: [
    [0.95, 0.05, 0],
    [0, 0.433, 0.567],
    [0, 0.475, 0.525],
  ],
  achromatopsia: [
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
    [0.299, 0.587, 0.114],
  ],
};

export function simulateColorblind(hex, type) {
  const rgb = hexToRgb(hex);
  const matrix = colorblindMatrices[type];
  if (!matrix) return hex;

  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const newR = r * matrix[0][0] + g * matrix[0][1] + b * matrix[0][2];
  const newG = r * matrix[1][0] + g * matrix[1][1] + b * matrix[1][2];
  const newB = r * matrix[2][0] + g * matrix[2][1] + b * matrix[2][2];

  return rgbToHex({
    r: Math.min(255, Math.max(0, Math.round(newR * 255))),
    g: Math.min(255, Math.max(0, Math.round(newG * 255))),
    b: Math.min(255, Math.max(0, Math.round(newB * 255))),
  });
}

// Harmony generation
export function generateHarmony(baseHex, type) {
  const hsl = hexToHsl(baseHex);

  switch (type) {
    case "complementary":
      return [baseHex, hslToHex({ ...hsl, h: (hsl.h + 180) % 360 })];
    case "analogous":
      return [
        hslToHex({ ...hsl, h: (hsl.h - 30 + 360) % 360 }),
        baseHex,
        hslToHex({ ...hsl, h: (hsl.h + 30) % 360 }),
      ];
    case "triadic":
      return [
        baseHex,
        hslToHex({ ...hsl, h: (hsl.h + 120) % 360 }),
        hslToHex({ ...hsl, h: (hsl.h + 240) % 360 }),
      ];
    case "split-complementary":
      return [
        baseHex,
        hslToHex({ ...hsl, h: (hsl.h + 150) % 360 }),
        hslToHex({ ...hsl, h: (hsl.h + 210) % 360 }),
      ];
    case "tetradic":
      return [
        baseHex,
        hslToHex({ ...hsl, h: (hsl.h + 90) % 360 }),
        hslToHex({ ...hsl, h: (hsl.h + 180) % 360 }),
        hslToHex({ ...hsl, h: (hsl.h + 270) % 360 }),
      ];
    case "square":
      return [
        baseHex,
        hslToHex({ ...hsl, h: (hsl.h + 90) % 360 }),
        hslToHex({ ...hsl, h: (hsl.h + 180) % 360 }),
        hslToHex({ ...hsl, h: (hsl.h + 270) % 360 }),
      ];
    case "monochromatic":
      return [
        hslToHex({ ...hsl, l: Math.max(10, hsl.l - 30) }),
        hslToHex({ ...hsl, l: Math.max(10, hsl.l - 15) }),
        baseHex,
        hslToHex({ ...hsl, l: Math.min(95, hsl.l + 15) }),
        hslToHex({ ...hsl, l: Math.min(95, hsl.l + 30) }),
      ];
    default:
      return [baseHex];
  }
}

export function getColorName(h) {
  const names = [
    { min: 345, max: 360, name: "Red" },
    { min: 0, max: 15, name: "Red" },
    { min: 15, max: 45, name: "Orange" },
    { min: 45, max: 75, name: "Yellow" },
    { min: 75, max: 105, name: "Yellow-Green" },
    { min: 105, max: 150, name: "Green" },
    { min: 150, max: 195, name: "Cyan" },
    { min: 195, max: 240, name: "Blue" },
    { min: 240, max: 285, name: "Violet" },
    { min: 285, max: 315, name: "Magenta" },
    { min: 315, max: 345, name: "Rose" },
  ];

  for (const range of names) {
    if (h >= range.min && h < range.max) return range.name;
  }
  return "Unknown";
}

export function getTextColor(bgHex) {
  const lum = getLuminance(hexToRgb(bgHex));
  return lum > 0.5 ? "#000000" : "#ffffff";
}

// Generate a color from wheel position
export function getColorFromWheelPosition(cx, cy, x, y, radius) {
  const dx = x - cx;
  const dy = y - cy;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance > radius) return null;

  let angle = Math.atan2(dy, dx) * (180 / Math.PI);
  angle = (angle + 360) % 360;
  const hue = angle;
  const saturation = Math.min(100, (distance / radius) * 100);

  return hslToHex({ h: hue, s: saturation, l: 50 });
}

// ─── CMYK ──────────────────────────────────────────────────────
export function rgbToCmyk({ r, g, b }) {
  const r1 = r / 255, g1 = g / 255, b1 = b / 255;
  const k = 1 - Math.max(r1, g1, b1);
  if (k >= 1) return { c: 0, m: 0, y: 0, k: 100 };
  return {
    c: Math.round(((1 - r1 - k) / (1 - k)) * 100),
    m: Math.round(((1 - g1 - k) / (1 - k)) * 100),
    y: Math.round(((1 - b1 - k) / (1 - k)) * 100),
    k: Math.round(k * 100),
  };
}

export function cmykToRgb({ c, m, y, k }) {
  const c1 = c / 100, m1 = m / 100, y1 = y / 100, k1 = k / 100;
  return {
    r: Math.round(255 * (1 - c1) * (1 - k1)),
    g: Math.round(255 * (1 - m1) * (1 - k1)),
    b: Math.round(255 * (1 - y1) * (1 - k1)),
  };
}

// ─── LAB (XYZ, D65 illuminant) ────────────────────────────────
function _lin(c) { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
function _delin(c) { return c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055; }
function _xf(t) { const d = 6/29; return t > d**3 ? Math.cbrt(t) : t/(3*d**2)+4/29; }
function _xi(t) { const d = 6/29; return t > d ? t**3 : 3*d**2*(t - 4/29); }

export function rgbToLab({ r, g, b }) {
  const lr = _lin(r), lg = _lin(g), lb = _lin(b);
  const x = (lr*0.4124564+lg*0.3575761+lb*0.1804375)/0.95047;
  const y = (lr*0.2126729+lg*0.7151522+lb*0.0721750)/1.00000;
  const z = (lr*0.0193339+lg*0.1191920+lb*0.9503041)/1.08883;
  const fx=_xf(x), fy=_xf(y), fz=_xf(z);
  return {
    l: Math.round((116*fy-16)*10)/10,
    a: Math.round(500*(fx-fy)*10)/10,
    b: Math.round(200*(fy-fz)*10)/10,
  };
}

export function labToRgb({ l, a, b: bv }) {
  const fy = (l+16)/116;
  const x = 0.95047*_xi(a/500+fy), y = 1.00000*_xi(fy), z = 1.08883*_xi(fy-bv/200);
  const lr=x*3.2404542-y*1.5371385-z*0.4985314;
  const lg=-x*0.9692660+y*1.8760108+z*0.0415560;
  const lb=x*0.0556434-y*0.2040259+z*1.0572252;
  return {
    r: Math.round(Math.min(255,Math.max(0,_delin(lr)*255))),
    g: Math.round(Math.min(255,Math.max(0,_delin(lg)*255))),
    b: Math.round(Math.min(255,Math.max(0,_delin(lb)*255))),
  };
}

// ─── All formats at once ───────────────────────────────────────
export function hexToAllFormats(hex) {
  const h = hex.startsWith('#') ? hex : `#${hex}`;
  const rgb = hexToRgb(h);
  return { hex: h.toUpperCase(), rgb, hsl: rgbToHsl(rgb), hsb: rgbToHsv(rgb), cmyk: rgbToCmyk(rgb), lab: rgbToLab(rgb) };
}

// ─── Mix two colors ────────────────────────────────────────────
export function mixColors(hex1, hex2, ratio = 0.5) {
  const c1 = hexToRgb(hex1), c2 = hexToRgb(hex2);
  return rgbToHex({
    r: Math.round(c1.r + (c2.r - c1.r) * ratio),
    g: Math.round(c1.g + (c2.g - c1.g) * ratio),
    b: Math.round(c1.b + (c2.b - c1.b) * ratio),
  });
}

// ─── 11-step Tailwind-style color scale ───────────────────────
export function generateTints(hex, steps = 6) {
  const total = Math.max(2, steps);
  return Array.from({ length: total }, (_, i) => mixColors(hex, "#ffffff", i / (total - 1)));
}

export function generateShades(hex, steps = 6) {
  const total = Math.max(2, steps);
  return Array.from({ length: total }, (_, i) => mixColors(hex, "#000000", i / (total - 1)));
}

export function generateColorScale(hex) {
  const STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
  const hsl = rgbToHsl(hexToRgb(hex));
  const L  = [96, 92, 84, 72, 56, 43, 33, 24, 16, 10, 6];
  const SF = [0.20, 0.35, 0.50, 0.70, 0.88, 1.0, 0.95, 0.88, 0.78, 0.68, 0.58];
  return STEPS.map((step, i) => ({
    step,
    hex: hslToHex({ h: hsl.h, s: Math.min(100, Math.max(4, hsl.s * SF[i])), l: L[i] }),
  }));
}

// ─── Extract dominant colors from canvas ──────────────────────
export function extractDominantColors(canvas, count = 6) {
  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;
  const data = ctx.getImageData(0, 0, width, height).data;
  const colorMap = new Map();
  const step = 5;
  for (let i = 0; i < data.length; i += 4 * step) {
    if (data[i+3] < 128) continue;
    const r = Math.round(data[i]   / 20) * 20;
    const g = Math.round(data[i+1] / 20) * 20;
    const b = Math.round(data[i+2] / 20) * 20;
    // Skip near-white and near-black
    if (r > 230 && g > 230 && b > 230) continue;
    if (r < 25 && g < 25 && b < 25) continue;
    const key = `${r},${g},${b}`;
    colorMap.set(key, (colorMap.get(key) || 0) + 1);
  }
  const sorted = [...colorMap.entries()].sort((a, b) => b[1] - a[1]);
  const selected = [];
  for (const [key] of sorted) {
    if (selected.length >= count) break;
    const [r, g, b] = key.split(',').map(Number);
    const different = selected.every(([sr, sg, sb]) => {
      const d = Math.sqrt((r-sr)**2 + (g-sg)**2 + (b-sb)**2);
      return d > 55;
    });
    if (different || selected.length === 0) selected.push([r, g, b]);
  }
  return selected.map(([r, g, b]) => rgbToHex({ r, g, b }));
}

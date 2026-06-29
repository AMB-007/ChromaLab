<div align="center">

# 🎨 ChromaLab

### Interactive Color Theory Explorer for Designers & Developers

[![License: MIT](https://img.shields.io/badge/License-MIT-8b5cf6.svg?style=flat-square)](LICENSE)
[![Built with React](https://img.shields.io/badge/React-19-61dafb?style=flat-square&logo=react)](https://react.dev)
[![Powered by Vite](https://img.shields.io/badge/Vite-7-646cff?style=flat-square&logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06b6d4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)

**ChromaLab** is a free, professional-grade, browser-native color toolkit with 14 interactive tools — all connected, all client-side, no sign-up required.

[**→ Open ChromaLab**](https://chromalab.app) · [Report a Bug](https://github.com/your-username/color-theory/issues) · [Request a Feature](https://github.com/your-username/color-theory/issues)

</div>

---

## ✨ Features

ChromaLab ships **14 fully-integrated tools** that share a global color state — pick a color once, see it everywhere.

| Category | Tool | Description |
|---|---|---|
| 🟣 **Core** | Color Wheel | Interactive HSL wheel — click or drag to pick any hue |
| 🟣 **Core** | Color Harmonies | Generate 7 harmony types: complementary, analogous, triadic, and more |
| 🟢 **Accessibility** | Contrast Checker | WCAG 2.1 AA & AAA compliance with live text preview |
| 🟢 **Accessibility** | Colorblind Simulator | Protanopia, deuteranopia, tritanopia, and achromatopsia simulation |
| 🔵 **Create** | Gradient Generator | Linear, radial, and conic CSS gradients with stop editor |
| 🔵 **Create** | Color Mixer | Blend two colors with configurable intermediate steps |
| 🔵 **Create** | Tints & Shades | Tailwind-style 50–950 scales with design token export |
| 🔵 **Create** | Color Converter | Convert between HEX, RGB, HSL, HSB, CMYK, and LAB |
| 🔵 **Create** | Image Color Picker | Extract dominant colors from any photo or graphic |
| ⬜ **Export** | Dev Tools | CSS variables, Tailwind config, SCSS variables, copy-ready snippets |
| 🟣 **Preview** | UI Preview | Apply palette to realistic buttons, cards, and navigation |
| 🟣 **Preview** | Data Viz | Validate palette distinctiveness on charts and legends |
| 🟣 **Preview** | Typography | Readability and contrast across font sizes and weights |
| 🟣 **Preview** | Brand Mockup | Full brand asset preview — logos, cards, marketing |

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- npm >= 9

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/color-theory.git
cd color-theory

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open http://localhost:5173 in your browser.

### Production Build

```bash
npm run build    # outputs to /dist
npm run preview  # locally preview the production build
```

---

## 🗂️ Project Structure

```
color-theory/
├── index.html              # App entry point (SEO, meta tags, fonts)
├── vite.config.js          # Vite + Tailwind configuration
├── package.json
└── src/
    ├── main.jsx            # React entry point
    ├── App.jsx             # Root layout, routing, global state, keyboard shortcuts
    ├── index.css           # Design system tokens (CSS vars), global styles
    ├── components/
    │   ├── ColorWheel.jsx          # Interactive HSL color picker canvas
    │   ├── ColorblindSimulator.jsx # Vision deficiency simulation
    │   ├── ContrastChecker.jsx     # WCAG contrast analysis
    │   ├── HarmonyDemo.jsx         # Color harmony generator
    │   ├── KeyboardHelp.jsx        # Keyboard shortcut modal
    │   ├── Navbar.jsx              # Top navigation + color input
    │   └── Toast.jsx               # Toast notification system
    └── pages/
        ├── Home.jsx               # Landing page
        ├── BrandMockup.jsx
        ├── ColorConverter.jsx
        ├── ColorMixer.jsx
        ├── DataViz.jsx
        ├── DevTools.jsx
        ├── GradientGenerator.jsx
        ├── ImageColorPicker.jsx
        ├── TintShade.jsx
        ├── Typography.jsx
        └── UIPreview.jsx
```

---

## ⌨️ Keyboard Shortcuts

ChromaLab is fully keyboard-navigable:

| Key | Action |
|---|---|
| `H` | Go to Home |
| `1` – `9` | Jump to tool (Color Wheel → Colorblind) |
| `D` | Dev Tools |
| `V` | UI Preview |
| `Z` | Data Viz |
| `Y` | Typography |
| `B` | Brand Mockup |
| `T` | Toggle dark/light theme |
| `F` | Toggle fullscreen |
| `Ctrl + Z` | Undo color change |
| `Ctrl + Y` | Redo color change |
| `?` | Open keyboard shortcut help |

---

## 🎨 Design System

ChromaLab uses a CSS custom property design token system for full dark/light mode support. All tokens are defined in `src/index.css`:

```css
:root {
  --bg:           #0f0f13;   /* Page background */
  --bg-card:      rgba(30,30,35,0.85);
  --text:         #f2f2ff;
  --text-muted:   rgba(242,242,255,0.5);
  --border:       rgba(255,255,255,0.08);
  --surface:      rgba(255,255,255,0.05);
  --glow-1:       rgba(139,92,246,0.06);  /* Purple ambient glow */
  --glow-2:       rgba(217,70,239,0.06);  /* Pink ambient glow */
}
```

Switching to light mode is done via the `[data-theme="light"]` attribute on `<html>`.

---

## 🔗 URL State

ChromaLab syncs the current page and color to the URL query string, making it easy to share exact tool states:

```
https://chromalab.app/?page=harmony&color=8b5cf6
```

| Parameter | Values | Default |
|---|---|---|
| `page` | `wheel`, `harmony`, `gradient`, `mixer`, `scale`, `converter`, `image`, `contrast`, `colorblind`, `devtools`, `ui`, `dataviz`, `typography`, `brand` | `home` |
| `color` | 6-digit hex (no `#`) | `e63946` |

---

## 🛠️ Tech Stack

| Technology | Role |
|---|---|
| [React 19](https://react.dev) | UI framework |
| [Vite 7](https://vitejs.dev) | Build tool & dev server |
| [Tailwind CSS 4](https://tailwindcss.com) | Utility-first styling |
| [Framer Motion](https://www.framer.com/motion/) | Animations & transitions |
| [Lucide React](https://lucide.dev) | Icon library |
| [Inter](https://rsms.me/inter/) | Display & body font |
| [JetBrains Mono](https://www.jetbrains.com/lp/mono/) | Monospace / code font |

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-new-tool`
3. Make your changes and commit: `git commit -m 'feat: add my new tool'`
4. Push to your fork: `git push origin feat/my-new-tool`
5. Open a Pull Request

### Development Guidelines

- **One tool, one file** — each page tool lives in `src/pages/`
- **Shared components** go in `src/components/`
- **Always use CSS tokens** (`var(--text)`, `var(--border)`) — never hardcode dark-mode colors
- **Respect the color state** — tools receive `selectedColor` and `onColorChange` props
- **Export dev snippets** — if your tool generates code, add a copy button with `showToast`

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<div align="center">

Built with ♥ and a lot of color theory · [chromalab.app](https://chromalab.app)

</div>

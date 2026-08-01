# Link Page Website

A modern, elegant, responsive static website for personal bio links inspired by Linktree, Carrd, Bento.me, and Beacons. Built using pure **HTML5**, **CSS3**, and **Vanilla JavaScript**.

## 🌟 Key Features

- **Public Profile Page (`index.html`)**:
  - Glassmorphism UI card layout with custom typography and backdrop blur.
  - Verified profile badge & status pill indicator.
  - Unlimited social media & platform links.
  - Interactive click ripple effects & micro-animations.
  - Quick Action Toolbar: Copy Link, Share Page (Web Share API), and QR Code Generator Modal with PNG download.
  - Full Light/Dark theme switching and RTL (Right-to-Left) support.

- **Customization Editor Webpage (`edit.html`)**:
  - **Split-Screen Layout**: Left settings control panel + Right sticky live smartphone device frame.
  - **Real-Time Live Updates**: Form modifications update the live preview frame instantly without page refreshes.
  - **Brand & Media**: Upload custom profile photo and brand logo (compressed client-side).
  - **Theme Presets**: Dark Luxury, Minimal Glass, Ocean Breeze, Sunset Glow, Emerald Forest, Clean Paper, or Custom colors.
  - **Typography Selector**: Google Fonts integration (Plus Jakarta Sans, Inter, Outfit, Playfair Display, Space Grotesk, Poppins, Montserrat, JetBrains Mono).
  - **Link Manager**: Add unlimited links with automatic platform icon detection, drag & drop sorting, enable/disable switches, copy/duplicate, and highlight tags.
  - **Configuration Persistence**: LocalStorage management with Export JSON and Import JSON options.

- **Zero Backend / 100% Static**: Runs cleanly on GitHub Pages, Vercel, Netlify, Cloud Run, or any static hosting service.

## 📂 Project Architecture

```text
/
├── index.html                 # Public profile landing webpage
├── edit.html                  # Separate editor webpage with split live preview
├── 404.html                   # Static 404 error webpage
├── assets/
│   ├── css/
│   │   ├── variables.css      # CSS design tokens, color variables, theme presets
│   │   ├── style.css          # Base CSS reset, typography, hero card layout
│   │   ├── components.css     # Buttons, form controls, toasts, modals, tabs
│   │   ├── animations.css     # Micro-animations, ripples, keyframe transitions
│   │   ├── edit.css           # Editor layout, split panel, link manager cards
│   │   └── responsive.css     # Media queries for tablet, laptop, and mobile devices
│   └── js/
│       ├── app.js             # Public page entry point (index.html)
│       ├── edit.js            # Editor webpage entry point (edit.html)
│       ├── storage.js         # LocalStorage persistence, export/import
│       ├── preview.js         # Real-time preview rendering engine
│       ├── icons.js           # SVG platform icons & interface symbols
│       └── utils.js           # Toast system, modal dialogs, QR generator, compressImage
└── README.md                  # Project documentation
```

## 🚀 Running locally

1. Clone or open the repository.
2. Run `npm run dev` to launch the Vite dev server on port `3000`.
3. Open `http://localhost:3000/index.html` to view the public profile or `http://localhost:3000/edit.html` to customize settings.

## 🛡️ License

Apache 2.0

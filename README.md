# Benjamin Ching — Portfolio

Single-page portfolio built with React 19, Vite, Tailwind CSS 4, Motion and React Three Fiber.
A night-sky planet hero that dawns into a Greek garden: marble bust, stoa, pear tree of skills,
and a museum gallery of projects, all drawn in code with CC0 antiquities from The Met.

## Stack

| Layer | Library |
|---|---|
| UI | React 19, Vite 5 |
| Styling | Tailwind CSS 4 (`@theme` tokens in `src/index.css`), self-hosted fonts via Fontsource |
| Motion | [Motion](https://motion.dev) (`motion/react`) for all UI animation, Lenis for inertial scroll |
| 3D | three.js + React Three Fiber, Drei, `@react-three/postprocessing`, `three-custom-shader-material` |
| Art | SVG ornaments in `src/components/ornaments/`; CC0 images from The Met Open Access (`npm run art:fetch`) |
| Backend | Netlify Functions (`netlify/functions`) for an email-verified contact form (currently not wired to the UI) |

## Getting started

```bash
npm install
npm run dev          # http://localhost:5173
npm run dev:netlify  # with the contact-form functions on :8888
npm run build
npm run preview
```

`npm run art:fetch` re-downloads the pinned Met artworks listed in `scripts/met-objects.json` into `public/art/`
and regenerates `src/data/art.json` (attribution manifest). Behind a TLS-intercepting proxy, set `NODE_EXTRA_CA_CERTS`.

## Project structure

```
src/
├── components/
│   ├── Section.jsx, SectionHeading.jsx     # layout primitives
│   ├── Backdrop.jsx, Grain.jsx             # night nebula + day cobalt sky (cross-faded by `dawn`), film grain
│   ├── Reveal.jsx                          # scroll-reveal primitives (Reveal, RevealGroup, RevealItem)
│   ├── HeroTitle.jsx, RotatingWord.jsx     # hero text motion
│   ├── Sidebar.jsx, MenuButton.jsx         # navigation
│   ├── MarbleBust.jsx                      # About: photo → marble bust via SVG filters, on a Pedestal
│   ├── Stoa.jsx                            # Experience: Doric colonnade with a scroll-drawn stylobate
│   ├── PearTree.jsx, StackGrove.jsx        # Stack: SVG orchard (desktop) / steles (mobile)
│   ├── Gallery.jsx, Artwork.jsx            # Projects: pinned horizontal museum / vertical wall
│   ├── Footer.jsx                          # brass plaque colophon with contact links + attributions
│   ├── TiltCard.jsx, Cursor.jsx, ScrollProgress.jsx, SmoothScroll.jsx
│   ├── PlanetPoster.jsx, SceneErrorBoundary.jsx
│   └── ornaments/                          # Meander, Laurel, DoricColumn, Amphora, HalftoneCloud, DottedRings, Pedestal, Stele
├── three/                                  # React Three Fiber planet scene (lazy-loaded)
├── pages/                                  # one component per section
├── data/                                   # nav, projects, experience, stack, tree geometry, contact, art.json
├── hooks/                                  # useDawn, useMagnetic, useActiveSection, useMediaQuery
├── motion/                                 # presets.js (easing/springs), dawn.js (night→day motion value)
└── index.css                               # Tailwind 4 theme tokens, garden/paper scopes, utilities
scripts/fetch-met-art.mjs                   # downloads CC0 Met objects → public/art + src/data/art.json
```

## Design tokens

All colours are OKLCH and defined once in `src/index.css` under `@theme`:
surfaces `bg-0…bg-3`, text `fg / fg-2 / fg-3`, accents `coral / coral-hot / peach / violet`, hairlines `line / line-strong`,
plus garden names (`sky`, `paper`, `cream`, `ink`, `gold-300/500/700`, `sash`, `laurel`, `olive`).

Two scopes re-skin the same variables so every utility flips automatically:
`.garden` (everything below the hero: cream text and gold accents on cobalt sky) and
`.garden .paper` (marble/paper surfaces: ink text). The hero's scroll progress drives the `dawn`
motion value (`src/motion/dawn.js`), which cross-fades the Backdrop and sets `data-dawn` on `<html>`.

Utilities: `glass`, `label`, `spotlight`, `inscription`, `engraved`, `gold`, `gold-leaf`, `marble`, `parchment`, `meander`, `plaque`, `halftone`.

## Accessibility and performance

- `prefers-reduced-motion` swaps the WebGL planet for a CSS poster, disables Lenis, and collapses motion to fades.
- The 3D scene is lazy-loaded, renders at a clamped device pixel ratio, and pauses its render loop when scrolled off-screen.
- Keyboard: the sidebar is a modal dialog (Escape closes, focus is managed); all interactive elements have a visible focus ring.

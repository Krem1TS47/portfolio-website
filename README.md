# Benjamin Ching — Portfolio

Single-page portfolio built with React 19, Vite, Tailwind CSS 4, Motion and React Three Fiber.
Dark-only, OKLCH design tokens, and a procedurally textured planet on the hero.

## Stack

| Layer | Library |
|---|---|
| UI | React 19, Vite 5 |
| Styling | Tailwind CSS 4 (`@theme` tokens in `src/index.css`), self-hosted fonts via Fontsource |
| Motion | [Motion](https://motion.dev) (`motion/react`) for all UI animation, Lenis for inertial scroll |
| 3D | three.js + React Three Fiber, Drei, `@react-three/postprocessing`, `three-custom-shader-material` |
| Backend | Netlify Functions (`netlify/functions`) for the email-verified contact form |

## Getting started

```bash
npm install
npm run dev          # http://localhost:5173
npm run dev:netlify  # with the contact-form functions on :8888
npm run build
npm run preview
```

Copy `.env.example` to `.env` for the contact form (Resend API key, owner email, JWT secret).

## Project structure

```
src/
├── components/
│   ├── Section.jsx, SectionHeading.jsx   # layout primitives
│   ├── Backdrop.jsx, Grain.jsx           # page backdrop + film grain
│   ├── Reveal.jsx                        # scroll-reveal primitives (Reveal, RevealGroup, RevealItem)
│   ├── HeroTitle.jsx, RotatingWord.jsx   # hero text motion
│   ├── Sidebar.jsx, MenuButton.jsx       # navigation
│   ├── TiltCard.jsx, ChipField.jsx       # interactive cards / throwable skill chips
│   ├── Timeline.jsx, MagneticTile.jsx    # experience rail, contact tiles
│   ├── ContactForm.jsx                   # verified contact flow (talks to netlify/functions)
│   ├── Cursor.jsx, ScrollProgress.jsx, SmoothScroll.jsx
│   └── PlanetPoster.jsx, SceneErrorBoundary.jsx
├── three/                                # React Three Fiber planet scene (lazy-loaded)
│   ├── PlanetScene.jsx, Scene.jsx, Planet.jsx, DustRing.jsx, Moons.jsx, Effects.jsx
│   ├── shaders/                          # atmosphere Fresnel + night-lights GLSL
│   └── textures/procedural.js            # canvas-generated planet textures (no assets shipped)
├── pages/                                # one component per section
├── data/                                 # nav, projects, experience, stack content
├── hooks/                                # useMagnetic, useActiveSection, useMediaQuery
├── motion/presets.js                     # shared easing / spring vocabulary
└── index.css                             # Tailwind 4 theme tokens + utilities
```

## Design tokens

All colours are OKLCH and defined once in `src/index.css` under `@theme`:
surfaces `bg-0…bg-3`, text `fg / fg-2 / fg-3`, accents `coral / coral-hot / peach / violet`, hairlines `line / line-strong`.
Utilities: `glass`, `glass-hover`, `label`, `spotlight`, `gradient-border`.

## Accessibility and performance

- `prefers-reduced-motion` swaps the WebGL planet for a CSS poster, disables Lenis, and collapses motion to fades.
- The 3D scene is lazy-loaded, renders at a clamped device pixel ratio, and pauses its render loop when scrolled off-screen.
- Keyboard: the sidebar is a modal dialog (Escape closes, focus is managed); all interactive elements have a visible focus ring.

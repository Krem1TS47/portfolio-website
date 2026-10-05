# Benjamin Ching — Portfolio

A single-page planetary portfolio built with React 19, Vite, Tailwind CSS 4, Motion, Lenis and React Three Fiber. The interactive 3D hero leads into an orbital About map, connected employer planets, four skill constellations and a horizontal project journey.

## Getting started

```bash
npm install
npm run dev          # http://localhost:5173
npm run dev:netlify  # with the contact-form functions on :8888
npm run build
npm run preview
```

## Layout and interaction

- **Home:** lazy WebGL planet with dragging and pointer parallax; CSS poster when WebGL is unavailable or reduced motion is enabled.
- **About:** five labeled interest buttons select intersecting orbits around a CSS planet. The biography and volleyball link remain in HTML.
- **Experience:** one connected planet per employer, with every role and description visible. A curved desktop route becomes a vertical route on phones.
- **Skills:** all 29 skills in the existing four categories are linked in SVG constellations. Hover, focus or touch highlights a group; skill and group buttons preserve selection until cleared. Small screens use readable star-linked lists.
- **Projects:** five SVG/CSS worlds preserve the project data and links. Fine-pointer screens at least 1024px wide and 620px tall use a sticky horizontal gallery driven by document scroll. Other devices and reduced-motion users get a vertical gallery. Previous/next controls and keyboard focus map to measured project stops.
- **Navigation/contact:** section anchors remain `#home`, `#about`, `#experience`, `#stack` and `#projects`. The menu traps focus, closes with Escape and restores focus. Large screens also have a waypoint rail. Contact links are in the footer.

## Design and source

`src/index.css` contains the shared dark surfaces, warm text, coral/peach/violet/moon accents, typography and section styles. The palette follows `src/three/constants.js`. Fontsource serves Inter, Instrument Serif and Geist Mono locally.

`OrbitalPlanet.jsx` supplies lightweight decorative planets below the hero. `ConstellationMap.jsx` contains the skill map; `Gallery.jsx` measures horizontal travel and controls document scroll; `ProjectWorld.jsx` draws the project illustrations. Content remains in `src/data/`.

Lenis supplies smooth wheel scrolling. Motion supplies reveals, orbit movement, path drawing and horizontal translation. Reduced-motion preferences are observed reactively: wheel smoothing stops, the gallery becomes vertical, orbit/parallax transforms stop and content stays sharp. Initial hash navigation runs once so preference changes do not jump back to an earlier destination.

The hero is the only WebGL canvas. It is lazy-loaded, caps pixel ratio and pauses rendering offscreen. The sections below use CSS, SVG and semantic HTML controls.

The optional Netlify contact functions are retained but the visible contact link uses email directly. The earlier museum components, art data and `art:fetch` script remain as unused source assets.

## Validation

Run `npm run build`, then check desktop, tablet, phone, short viewports, keyboard navigation and both reduced-motion settings in a browser. In particular, verify all gallery stops, direct anchors, resize during the horizontal gallery, and preference changes without reloading. No automated test runner is currently configured.

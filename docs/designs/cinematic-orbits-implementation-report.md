# Cinematic orbits implementation

Implemented on 2026-10-04 (Vancouver) in the existing `revamp/ui-2026` working tree.
Preview: http://127.0.0.1:5174/

## Delivered behavior

- About: planet arc rise, ring arrival, and independent biography slide. Interest buttons stay fixed.
- Experience: alternating destination arrivals and opposing text slides. The connection draws with the next employer and stays complete. All three roles remain expanded.
- Skills: independent constellation assembly, 650ms star travel with 45ms spacing, and completed line drawing. All 29 labels and hit areas stay fixed; mobile uses the existing readable list.
- Projects: one native horizontal rail at every viewport, natural card height, next-card peek, measured navigation, actual-position count/progress, and decorative planet arrivals gated by both page and rail visibility.
- Shared entrances: measured visible-height cap, once-only consumption, focus completion, live reduced-motion cancellation on every leaf, and readable observer fallback.

Original data files, five interests, two employers, three roles, 29 skills, five projects, biography, and existing links were preserved. No dependency or test framework was added.

## Implementation adjustments

Eight production files changed for this motion pass. The seventh-file plan also required a small change to `src/pages/Stack.jsx`: remove its old whole-map Reveal so it cannot hide or delay the new local constellation arrivals. Existing heading/footer Reveal defaults remain, with added focus completion and missing-observer fallback.

Programmatic rail commands use the existing Motion numeric animator with instant native position updates. Browser testing found that native smooth scroll retained a compositor frame after cancellation. The owned animator fixes that while wheel, swipe, and scrollbar scrolling remain native. Pending commands and completion callbacks retain their identity guards.

Measured card centers use relative card geometry plus rail padding, independently of current scrollLeft. Redundant measurements cancel pending commands without snapping a partial position to another card; changed horizontal geometry preserves the focused/current project.

## Verification evidence

Vite production build and `git diff --check` passed. Chromium ran the production app, plus temporary isolated fixtures using the installed React/Motion components. Fixtures were unmounted and browser media/layout overrides restored.

| Checks | Evidence |
| --- | --- |
| ENT01, ENT03 | A 3500px wrapper in a 500px window stayed pending at 74px visible height, including resize; 76px started entry against the 75px cap. Strict Mode onEnter count was one. |
| ENT02, ENT09, E01 | Section navigation reached About, Experience, Skills, and Projects; all four constellation regions settled independently. The next-employer connection reached stroke-dashoffset 0; all three roles and the footer remained accessible. Menu open/Escape close worked. |
| ENT04, ENT07 | Focus settled About planet/biography, employer planet/roles/connection, skill stars, and footer content. Interest and skill button rectangles were unchanged during decoration/pointer/focus changes. |
| ENT05, ENT06, G10 | Initial reduced loading consumed offscreen entrances; turning it off did not replay them. A five-second delayed leaf settled immediately and stayed final past its original delay. Live reduced motion stopped rail travel at 1163px and held 1163px after 650ms. All stars/cards settled. |
| ENT08, G01 | 320, 390, 768, 1024, and 1440px widths, including a 500px window: document width matched viewport; 5 interests/3 roles/29 skills/5 projects remained. Selections survived every size. Mobile next-card peek was 38–48px. Skill controls were at least 44px tall. |
| ENT10 | Missing IntersectionObserver fixture settled both shared entrance and legacy Reveal, with opacity 1. Footer focus remained readable. 200% CSS layout scaling retained all content with no document X overflow. Actual browser zoom is a separate manual check below. |
| G02–G04, G08 | Endpoint tolerance and earlier midpoint tie, three rapid Next requests → project 4, Next/Next/Previous → project 2. Hidden last-link focus reached project 5 with zero page-Y correction. Link ArrowLeft was not prevented. Browser Home/End keys were exercised on the rail. |
| G05 | Wheel interruption held 245 → 245 → 245 after 600ms. PageDown from an arrow control held 223px. A subsequent native horizontal wheel branch restored snap. |
| G06, G07 | Synthetic Shift-wheel moved once: pixel +40, negative −15, line +54, page +72, already-horizontal +25. Ctrl+Shift-wheel moved 0 and was not prevented. These assert adapter branches, not browser-default physical gestures. |
| G09 | Geometry resizing kept a focused project link visible. Unchanged font measurement preserved 1163 → 1163. No implementation path calls document scrolling to correct rail focus. |
| G11, G12 | Empty state readable; empty/single/no-overflow controls hidden. Strict Mode unmount during travel/font work and remount produced exactly one 40px Shift-wheel movement. No unexpected runtime errors; Motion's expected reduced-motion warning appeared during emulation. |

The existing large Three.js build chunk warning remains; this pass did not change hero geometry or add another WebGL scene.

## Remaining manual coverage

Safari, Firefox, real touch hardware, physical scrollbar dragging, browser-native 200% zoom, and physical Ctrl/Shift wheel or pinch zoom were not verified through the Chromium automation setup. The automated portions above do not claim all 23 test-plan cases are fully covered. Scrollend/idle fallback and stale-command protection were also reviewed in source; hardware timing can still be spot-checked.

Local QA artifacts and fixture scripts are in `/Users/b.ching/Documents/ChatGPT/personal/planetary-redesign/implementation/`, including desktop/mobile screenshots, responsive-results.json, and reduced-results.json. No commit, push, or deployment was performed.

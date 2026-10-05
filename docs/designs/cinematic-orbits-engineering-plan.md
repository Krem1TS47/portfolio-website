# Cinematic orbits implementation plan

Reviewed with /plan-eng-review on 2026-10-04, Vancouver time.  
Branch: revamp/ui-2026  
Repository: Krem1TS47/portfolio-website  
Status: IMPLEMENTED — see cinematic-orbits-implementation-report.md

The lower sections will arrive through distinct planetary movements, and Ideas in orbit will become a directly horizontal gallery at every screen size. This plan implements the approved [motion design](cinematic-orbits.md), using the existing artwork, content, palette, Motion, and Lenis.

This file preserves the approved review. Production implementation is complete; verification evidence and remaining manual targets are recorded in [the implementation report](cinematic-orbits-implementation-report.md). The [storyboard](cinematic-orbits-storyboard.html) demonstrates the selected direction with simplified content.

## Scope challenge and what already exists

Seven existing production files suffice. No new service, global choreography controller, or animation dependency is needed.

| Existing code | Reuse and proposed change |
| --- | --- |
| src/components/Reveal.jsx and src/motion/presets.js | Keep existing callers and presets; add shared local entrance state and guarded observation inside Reveal.jsx. |
| src/pages/About.jsx | Preserve interest selection, biography, and separate pointer/scroll movement; add artwork and text arrivals. |
| src/pages/Experience.jsx | Preserve both employers and all three expanded roles; add independent destination arrivals and completed connections. |
| src/components/ConstellationMap.jsx | Preserve coordinates, skill data, and hover/focus/touch selection; assemble decorative stars and lines locally. |
| src/components/ProjectWorld.jsx | Reuse unchanged. Its cardRef and existing decorative project-world-planet element allow Gallery to own entrance gates without moving labels. |
| src/components/Gallery.jsx | Replace the pinned desktop gallery and vertical fallback with one native rail and its controls. Reuse measurement and font-listener patterns. |
| src/components/SmoothScroll.jsx | Keep the document provider; add the stable rail-scoped Shift-wheel bypass. |
| src/index.css | Keep the palette and artwork rules; add wrapper, native rail, focus, and reduced-motion styles. |
| src/hooks/useMediaQuery.js | Reuse live preference and breakpoint subscriptions. |
| src/three/PlanetScene.jsx | Retain the existing offscreen render-loop pause; this plan adds no WebGL scenes. |

The current Netlify build uses npm run build and publishes dist. No new artifact type or distribution pipeline is introduced. No TODOS.md or repository testing instructions were found. Recent commits are earlier visual/content changes, rather than a recorded review cycle for this motion design.

Prior learning applied: lenis_sidebar_scroll_timing, confidence 9/10, observed 2026-10-05. Sidebar navigation already closes the menu before starting section travel in the next animation frame. Preserve that behavior and include it in journey verification.

## Accepted engineering findings

1. **Gallery interruption lifecycle, P2, confidence 8/10.** The design says rapid presses use the “last requested destination,” while focus and resize may independently reposition the rail. A stale request could make the following button jump from the wrong project. User selected 1A: one cancellation rule for direct input, scrollbar dragging, focus, remeasurement, and reduced motion, with command identity protecting newer requests.
2. **Measured entrance trigger, P2, confidence 9/10.** The design requires visibility of at least the smaller of 20% of the local wrapper and 15% of viewport height. Installed Motion's viewport callback tests isIntersecting before consuming entry, so its numeric amount alone cannot enforce the initial visibility guard. User selected 2A: verify actual visible height before latching and recalculate when dimensions change. Source: node_modules/framer-motion/dist/es/render/dom/viewport/index.mjs, line 17.
3. **Browser zoom guard, P2, confidence 8/10.** The proposed Shift-wheel adapter could consume a zoom event carrying both Ctrl and Shift. Installed Lenis explicitly returns for event.ctrlKey at node_modules/lenis/dist/lenis.mjs, line 586. User selected 3A: preserve that exclusion in the rail handler and document bypass. [MDN documents Ctrl-modified wheel/trackpad zoom](https://developer.mozilla.org/en-US/docs/Web/API/Element/wheel_event).

All three findings are future integration risks, rather than regressions observed in an implemented native gallery.

## Shared entrance architecture

Export a local useEntrance helper from Reveal.jsx. It owns an untransformed observation ref, persistent local phase, and idempotent finish operation. Selection state stays in its existing section component.

    pending -- measured visibility passes --> arriving -- completed --> settled
       |                                      |
       +-------- focus / reduced motion ------+
                                              |
                                              v
                                           settled

    settled -- leave / return / resize / preference off --> settled
    unmount --> disconnect observers, cancel queued callbacks and animation

Check actual visible height before consuming the observer's first callback. While a pending wrapper intersects but remains below the cap, coalesce candidate geometry checks in an animation frame so crossing the cap is detected. Stop observation and candidate checks once consumed. Resize observation updates the required height. A missing observer or failed measurement must reveal readable final content rather than leave it hidden.

Keep entrance, ambient drift, and hover transforms on separate elements. Moving decorative stars must not overwrite each list item's positioning transform or the inner star's hover scale. Remove drift from the Skills plot containing labels and controls; apply it only to decoration.

Focus completion is associated with the local region, even when the control is a sibling of decorative artwork. The region's focus handler finishes its entrance and preserves the existing selection handler. Reduced motion immediately consumes offscreen entrances too. Every animated leaf must receive a distinct immediate final state with delay and stagger removed; completion does not depend on an interrupted animation promise.

About uses its arc rise and opposing biography slide. Each CareerStop owns its local arrival; Experience retains the small completion flags needed to draw a connection when the next employer arrives. Each constellation region owns assembly. Gallery owns per-card completion, and animates only the existing decorative planet inside its scoped card ref.

## Native gallery architecture

Use one native overflow rail with proximity snapping, natural card heights, and a next-card preview. Keep the rail and interactive elements in their final layout; only decorative framing and artwork enter. Use the approved responsive card widths as tuning points.

    native swipe / horizontal trackpad --> rail scrollLeft
    rail buttons / Left Right Home End --> requested rail destination
    scoped Shift-wheel adapter --------> rail horizontal movement
                                              |
                                              v
                                      actual scrollLeft
                                              |
                                   nearest card / progress

    ordinary vertical input --> existing document scrolling
    Ctrl-modified zoom ------> browser default behavior

Measured card stops, actual active index, pending destination, and command identity have separate purposes. Actual scrollLeft drives count and progress. Pending destination supports rapid commands and button availability only.

    idle -- goTo --> travelling(command, destination)
                     |
                     +-- rapid command --> newer command and destination
                     +-- matching settlement --> idle at actual position
                     +-- focus / resize / direct input / reduced --> cancel --> idle
                     +-- stale completion --> ignore

Centralize cancellation before correction or remeasurement. Interrupt old smooth travel, clear pending state, invalidate old callbacks, and use actual position for the next command. Feature-detect native scroll completion and provide an idle-scroll fallback; immediate or unchanged destinations clear pending state without waiting for an event that may not fire. Clean up both mechanisms on unmount.

Measure on initial layout, resize, and font changes. Preserve the focused project when present, otherwise the actual current project, then clamp. Progress is a Motion value; React state changes when active or requested project changes. Do not read all card bounds in every scroll callback.

The document's stable virtualScroll predicate bypasses only rail-scoped, non-zoom Shift-wheel events. The rail has data-lenis-prevent-horizontal for native horizontally dominant gestures. Register one scoped non-passive wheel handler, normalize pixel/line/page units, handle already-horizontal deltas once, and leave ordinary vertical input available. Do not create another Lenis instance.

Keep the ReactLenis provider mounted. The installed provider may recreate its Lenis instance when smoothWheel changes; preserve page position and section state during that preference transition. The new bypass callback must not introduce additional recreation or stale captured gallery state.

Keyboard navigation belongs to the focused rail; links keep their normal keys. Focus correction explicitly adjusts only rail X. Empty collections show text; single/no-overflow collections hide unusable controls and avoid division by zero. Missing card refs are ignored safely until measurement can run.

Inline ASCII comments belong beside the local phase lifecycle in Reveal.jsx and pending-command lifecycle in Gallery.jsx. Existing explanatory gallery comments must describe native scrolling after the rewrite.

## Build order

1. Implement the shared local entrance lifecycle in Reveal.jsx, retaining the public Reveal, RevealGroup, and RevealItem defaults. Verify the measured trigger and forced completion first.
2. Wire About, Experience, and each constellation region to that lifecycle. Add separate motion wrappers and retain all original text and selection interactions.
3. Rewrite Gallery around native overflow. Add measurement, actual-position progress, rapid commands, cancellation, focus, per-card artwork gates, and the coordinated SmoothScroll input bypass.
4. Finish responsive CSS, remove obsolete pinned/column gallery rules, run npm run build, and execute the browser checklist. Restore any temporary data or size fixtures.

## Execution and coverage map

No test script, test framework configuration, or source tests are present. Follow the skill's no-framework branch: generate the browser plan rather than adding a framework. The map below covers proposed behavior groups; implementation must refine it if new branches appear.

    Reveal.jsx / useEntrance                         USER FLOWS
      observe(ref)                                   [planned ->E2E E01]
        missing ref -> wait for mount                  Hero -> all sections -> footer -> return
        missing observer -> final readable state     [planned ->E2E ENT04, G08]
        below cap -> remain pending                    keyboard selection and hidden-card focus
        meets cap -> arrive once                     [planned ->E2E ENT05-06, G10]
        resize -> recalculate pending cap              live reduced motion with preserved selections
      finish(focus / reduced)
        pending or arriving -> every leaf final      ENT01-06, ENT10
        already settled -> no-op
      cleanup -> disconnect / cancel callbacks       G12

    About.jsx                                        ENT02, ENT04, ENT06-08, ENT10
      local entry -> artwork and biography
      pointer mouse / touch / reduced -> existing branches
      interest focus / click / hover -> select + finish local entrance

    Experience.jsx / CareerStop                      ENT02, ENT04, ENT06-10
      per-destination entry -> local arrival
      next employer entry -> connection complete
      focus -> existing employer selection + finish
      final destination -> no outgoing connection

    ConstellationMap.jsx / local region              ENT02, ENT04-08, ENT10
      wide -> decorative inward-to-outward assembly
      narrow -> list and short decorative entrance
      hover / focus / touch / reset -> existing selection branches
      reduced or focus during delayed leaves -> immediate final state

    Gallery.jsx                                      G01-12, E01
      empty / one / no overflow / multiple -> readable rail states
      measureStops -> endpoints / middle / missing refs / resize / fonts
      syncPosition -> nearest / tie / endpoint tolerance / zero distance
      goTo -> idle / rapid pending / clamped / immediate / unchanged
      settlement -> current command / stale command / fallback
      cancelTravel -> direct input / scrollbar / focus / resize / reduced
      wheel -> vertical default / native horizontal / Shift delta modes / zoom
      keys -> focused rail navigation / link default
      focus -> visible card / hidden card / in-flight correction
      artwork gate -> offscreen gallery / visible card / consumed card
      cleanup -> observers / listeners / font promises / timers / RAF

    SmoothScroll.jsx                                 G05-07, G10, G12, E01
      bypass -> inside rail Shift / outside rail / zoom / ordinary wheel
      preference -> provider retained, smooth behavior changed

    index.css                                        ENT07-08, ENT10, G01, G11
      wide / narrow / reduced / focus / overflow / natural card height

Verification map: 23 numbered browser cases, all pending production implementation. Existing automated coverage: none. New unmapped requirement groups: 0. Prototype checks are not counted as production test coverage. No LLM/evaluation paths are introduced.

See [browser test plan](cinematic-orbits-test-plan.md) for case inputs and expected results.

## Failure modes

| Path | Possible failure | Planned handling and verification | Visitor effect if missed |
| --- | --- | --- | --- |
| Initial observation and resizing | Initial sliver consumes arrival or tall wrapper never enters | Explicit visible-height guard and recalculation; ENT01-03 | Early or missing entrance |
| Completion, focus, and delayed stars | An old delayed animation resumes after forced completion | Immediate final state on every leaf, persistent consumption; ENT04-06 | Hidden or moving content after preference change |
| Section transform composition | Entrance overrides positioning or hover | Separate wrappers, stationary hit areas; ENT07-09 | Misaligned controls or broken feedback |
| Rail layout and measurements | Font/resize leaves stale stops or clips long copy | Recompute, natural heights, preserve focused/current card; G01, G09 | Unreachable text or wrong destination |
| Count, progress, and collection edges | Zero overflow divides by zero or pending target becomes displayed count | Actual-position source, empty/single guards; G02, G11 | Incorrect controls or invalid progress |
| Commands and interruptions | Older completion clears a newer request | Shared cancellation and command identity; G03-05, G08-10 | Unexpected gallery jump |
| Input routing | Duplicate Shift movement, blocked vertical exit, or swallowed zoom | One scoped handler and matching exclusions; G05-07 | Trapped page or lost browser gesture |
| Lifecycle and preferences | Late font callback or duplicate Strict Mode listener | Cleanup and alive/command guards; G10, G12 | Repeated movement or console errors |
| Full journey | Menu unlock interrupts section navigation, or a card enters offscreen | Preserve existing navigation timing and combined visibility gate; E01 | Wrong section position or missed artwork entrance |

Each path has planned handling and a browser case. No uncovered critical gap remains in the plan; execution evidence is still pending.

## Performance review

No additional issue found. Data is local and small: two employers, four skill groups, 29 skills, and five projects. No database or network path changes.

Restrict candidate geometry work to pending intersecting wrappers, coalesce resize/scroll checks, and disconnect after entry. Rail scroll updates use cached stops and Motion values; avoid per-frame React state updates and repeated layout reads. Release temporary animation hints after settling and clean up observers, timers, and callbacks. Verify smooth travel and no duplicate movement in G12 and E01; this review makes no measured frame-rate claim.

## Worktree strategy

Sequential implementation, no parallelization opportunity at the module level. Shared components and src/index.css overlap across the entrance and gallery workstreams. Build the shared helper, then section integration, then the rail, then combined checks.

Continue from the current revamp/ui-2026 working tree so the existing uncommitted redesign is included. A new managed worktree would not copy those changes automatically. No worktree is needed for this documentation review.

## NOT in scope

- A continuous global flight-path guide: rejected because it adds artwork and coordination beyond local arrivals.
- Independent duplicated section animation systems: rejected in favor of the shared entrance lifecycle.
- New animation dependencies or additional WebGL scenes: existing Motion, Lenis, and artwork cover the requested behavior.
- Hero geometry changes or content rewrites: the current hero and preserved information remain the design reference.
- A new test framework: no framework is configured; this plan provides the existing build and browser checks.
- Deployment: the requested deliverable is the reviewed motion plan; publication is a separate action.

No new follow-up TODO was identified; all accepted fixes belong in this implementation. Zero TODOS.md items proposed.

## Implementation Tasks

These tasks derive from the three accepted review findings. The approved feature build order is above. Estimates are rough; no repository effort-calibration table exists.

- [x] **T1 (P2, human: ~30min / Codex: ~5min)** — Gallery — centralize interrupted travel and stale-command protection.
  - Surfaced by Architecture: finding 1, accepted as 1A.
  - Files: src/components/Gallery.jsx.
  - Verify: G03-05, G08-10, G12; next navigation follows actual position after interruption.
- [x] **T2 (P2, human: ~30min / Codex: ~5min)** — Shared entrances — enforce measured visibility before consumption.
  - Surfaced by Architecture: finding 2, accepted as 2A.
  - Files: src/components/Reveal.jsx and its existing section integration files.
  - Verify: ENT01-03; initial slivers wait and a five-viewport wrapper enters at the capped height.
- [x] **T3 (P2, human: ~5min / Codex: ~1min)** — Input routing — exclude browser zoom from both Shift-wheel handlers.
  - Surfaced by Code Quality: finding 3, accepted as 3A.
  - Files: src/components/Gallery.jsx, src/components/SmoothScroll.jsx.
  - Verify: G06-07 with real wheel/pinch input as well as synthetic handler checks.

No new tasks from Test Review or Performance Review beyond the approved verification requirements.

## Suppressed findings

A hypothetical parent animation-controls stop/set sequence might leave inherited child delays running. Confidence 4/10 as a finding against this plan: that algorithm is not proposed. It is not promoted as an additional issue. ENT06 still verifies the approved immediate completion rule on every leaf.

## Completion summary

- Step 0: scope accepted as-is, seven existing production files.
- Architecture: 2 issues, both accepted and incorporated.
- Code Quality: 1 issue, accepted and incorporated.
- Test Review: execution diagram and 23 browser cases; 0 unmapped requirements, execution pending.
- Performance: 0 additional issues.
- NOT in scope and existing-code reuse: written.
- TODOS.md: 0 items proposed.
- Failure modes: 0 uncovered critical gaps in the plan.
- Outside voice: skipped under Codex; scoped subagent audits are not an outside model.
- Parallelization: 1 sequential lane.
- Complete-option choices: 3/3.

## GSTACK REVIEW REPORT

| Review | Runs | Status | Findings |
| --- | --- | --- | --- |
| Eng Review, plan scope | 1 | CLEAR | 3 accepted fixes; 0 unresolved decisions |
| Design document review | 2 | PASS | 3 ambiguities resolved; score 9/10; storyboard approved |
| Outside model | 0 | SKIPPED | Nested Codex review skipped in this Codex host |

VERDICT: Plan ready to implement. Build and production browser verification remain pending.

NO UNRESOLVED DECISIONS

## Implementation outcome

The approved implementation is complete. Eight production files were needed: Stack.jsx also lost its conflicting whole-map Reveal wrapper. Programmatic rail travel uses cancellable Motion numeric updates after native smooth-scroll interruption testing, and center measurements are independent of scrollLeft. Build and Chromium automation passed; hardware/cross-browser portions remain manual coverage, not claimed passes. See [implementation report](cinematic-orbits-implementation-report.md) for evidence and adjustments. Historical review statements above describe the pre-implementation plan.

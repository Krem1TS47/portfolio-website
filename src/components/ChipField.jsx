import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { EASE, SPRING } from '../motion/presets'

const DOT = ['bg-coral', 'bg-violet', 'bg-peach', 'bg-fg-2']
const FIELD_H = 520
const CHIP_W = 150
const CHIP_H = 40
const PAD = 20

/** Deterministic jittered-grid scatter inside a w×h box. */
function scatter(n, w, h, seed) {
    let s = seed * 9301 + 49297
    const rnd = () => { s = (s * 16807) % 2147483647; return s / 2147483647 }
    const cols = Math.max(2, Math.floor((w - PAD * 2) / (CHIP_W + 12)))
    const rows = Math.max(1, Math.ceil(n / cols))
    const cellW = (w - PAD * 2) / cols
    const cellH = (h - PAD * 2 - 24) / rows
    const order = Array.from({ length: cols * rows }, (_, i) => i)
    for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [order[i], order[j]] = [order[j], order[i]] }
    return Array.from({ length: n }, (_, i) => {
        const cell = order[i]
        const cx = PAD + (cell % cols) * cellW
        const cy = PAD + 24 + Math.floor(cell / cols) * cellH
        return {
            x: Math.min(w - CHIP_W - PAD, cx + rnd() * Math.max(0, cellW - CHIP_W)),
            y: Math.min(h - CHIP_H - PAD, cy + rnd() * Math.max(0, cellH - CHIP_H)),
            rotate: (rnd() - 0.5) * 10,
        }
    })
}

const Chip = ({ chip, pos, containerRef }) => (
    <motion.div
        role="listitem"
        layout="position"
        drag
        dragConstraints={containerRef}
        dragElastic={0.18}
        dragMomentum
        dragTransition={{ power: 0.35, timeConstant: 220, bounceStiffness: 320, bounceDamping: 22 }}
        whileDrag={{ scale: 1.08, zIndex: 10, cursor: 'grabbing' }}
        whileHover={{ scale: 1.04 }}
        initial={{ opacity: 0, scale: 0.6, x: pos.x, y: pos.y, rotate: pos.rotate }}
        animate={{ opacity: 1, scale: 1, x: pos.x, y: pos.y, rotate: pos.rotate }}
        exit={{ opacity: 0, scale: 0.6, transition: { duration: 0.2 } }}
        transition={SPRING.soft}
        data-cursor="drag"
        className="absolute left-0 top-0 select-none cursor-grab touch-none inline-flex items-center gap-2 px-4 h-10 rounded-full glass text-sm text-fg whitespace-nowrap shadow-glass"
    >
        <span aria-hidden="true" className={`w-1.5 h-1.5 rounded-full ${chip.dot}`} />
        {chip.label}
    </motion.div>
)

/** Static fallback for touch / narrow screens. */
const ChipGrid = ({ categories }) => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category, i) => (
            <div key={category.title} className="glass rounded-lg p-6">
                <h3 className="font-display text-h3 text-fg mb-5 flex items-center gap-3">
                    <span aria-hidden="true" className={`w-2 h-2 rounded-full ${DOT[i % DOT.length]}`} />
                    {category.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                        <span key={skill} className="px-3 py-1.5 text-sm rounded-full border border-line bg-fg/5 text-fg-2">
                            {skill}
                        </span>
                    ))}
                </div>
            </div>
        ))}
    </div>
)

/**
 * Throwable skill chips. Motion drag + inertia inside a bounded glass field;
 * a legend filters categories, Shuffle re-scatters.
 */
const ChipField = ({ categories }) => {
    const desktop = useMediaQuery('(min-width: 768px) and (pointer: fine)')
    const containerRef = useRef(null)
    const [width, setWidth] = useState(0)
    const [seed, setSeed] = useState(1)
    const [enabled, setEnabled] = useState(() => new Set(categories.map((c) => c.title)))

    useEffect(() => {
        const el = containerRef.current
        if (!el) return
        const ro = new ResizeObserver(([entry]) => setWidth(entry.contentRect.width))
        ro.observe(el)
        return () => ro.disconnect()
    }, [desktop])

    const chips = useMemo(
        () => categories.flatMap((c, ci) => c.skills.map((s) => ({ id: `${c.title}:${s}`, label: s, cat: c.title, dot: DOT[ci % DOT.length] }))),
        [categories]
    )
    const positions = useMemo(
        () => (width ? scatter(chips.length, width, FIELD_H, seed) : null),
        [chips.length, width, seed]
    )

    if (!desktop) return <ChipGrid categories={categories} />

    const toggle = (title) =>
        setEnabled((prev) => {
            const next = new Set(prev)
            if (next.has(title)) { if (next.size > 1) next.delete(title) } else next.add(title)
            return next
        })

    return (
        <div>
            <div className="flex flex-wrap items-center gap-2 mb-5">
                {categories.map((c, i) => {
                    const on = enabled.has(c.title)
                    return (
                        <button
                            key={c.title}
                            type="button"
                            aria-pressed={on}
                            onClick={() => toggle(c.title)}
                            data-cursor="link"
                            className={`label flex items-center gap-2 px-3.5 py-2.5 rounded-full border transition-colors duration-300 ${
                                on ? 'border-line-strong text-fg bg-fg/5' : 'border-line text-fg-3 hover:text-fg-2'
                            }`}
                        >
                            <span aria-hidden="true" className={`w-1.5 h-1.5 rounded-full ${DOT[i % DOT.length]} ${on ? '' : 'opacity-40'}`} />
                            {c.title}
                        </button>
                    )
                })}
                <button
                    type="button"
                    onClick={() => setSeed((s) => s + 1)}
                    data-cursor="link"
                    className="label ml-auto px-3.5 py-2.5 rounded-full glass glass-hover text-fg-2 hover:text-fg"
                >
                    Shuffle
                </button>
            </div>

            <div
                ref={containerRef}
                role="list"
                aria-label="Skills"
                className="relative glass rounded-2xl overflow-hidden"
                style={{ height: FIELD_H }}
            >
                <p className="absolute left-5 top-4 label text-fg-3/70 pointer-events-none">Drag · throw · catch</p>
                <AnimatePresence>
                    {positions &&
                        chips.map((chip, i) =>
                            enabled.has(chip.cat) ? (
                                <Chip key={chip.id} chip={chip} pos={positions[i]} containerRef={containerRef} />
                            ) : null
                        )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default ChipField

import { useId, useLayoutEffect, useRef, useState } from 'react'
import { motion, useInView, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import { TREE, HANG_LEVELS } from '../data/tree'
import { SPRING } from '../motion/presets'
import DottedRings from './ornaments/DottedRings'

const BARK = 'oklch(36% 0.05 60)'
const BARK_LIGHT = 'oklch(48% 0.06 65)'
const PEAR_PATH =
    'M0 -17 C 8 -17 11 -9 10 -4 C 15 3 16 12 12 17 C 8 22 -8 22 -12 17 C -16 12 -15 3 -10 -4 C -11 -9 -8 -17 0 -17 Z'
const LEAF_PATH = 'M0 0 Q 9 -9 19 0 Q 9 9 0 0 Z'
const LABEL_W = 74

if (import.meta.env.DEV) {
    import('../data/stack').then(({ stackCategories }) => {
        if (stackCategories.length !== TREE.branches.length)
            console.warn(`[PearTree] ${stackCategories.length} categories but ${TREE.branches.length} branches`)
    })
}

const labelWidth = (text) => Math.max(40, text.length * 7.4)

/** Evenly space `n` pears along a branch path, hanging down, labels de-collided by estimated width. */
function placePears(path, skills, [t0, t1]) {
    const n = skills.length
    const L = path.getTotalLength()
    const pts = skills.map((skill, i) => {
        const t = n === 1 ? (t0 + t1) / 2 : t0 + ((t1 - t0) * i) / (n - 1)
        const p = path.getPointAtLength(t * L)
        return { ax: p.x, ay: p.y, hang: HANG_LEVELS[i % HANG_LEVELS.length], t, w: labelWidth(skill) }
    })
    const sorted = [...pts].sort((a, b) => a.ax - b.ax)
    // push a pear down a level when its label would overlap a neighbour on the same level
    for (let pass = 0; pass < 3; pass++) {
        for (let i = 0; i < sorted.length; i++) {
            for (let j = 0; j < i; j++) {
                const a = sorted[j], b = sorted[i]
                const overlapX = Math.abs(b.ax - a.ax) < (a.w + b.w) / 2 + 6
                const sameLevel = Math.abs(b.hang - a.hang) < 22
                if (overlapX && sameLevel) b.hang += 24
            }
        }
    }
    return pts.map((q) => ({ ...q, x: q.ax, y: q.ay + q.hang }))
}

const Pear = ({ skill, pos, delay, popped, gradientId, index }) => (
    <g transform={`translate(${pos.x} ${pos.ay})`}>
        <g
            className="pear-sway"
            style={{
                transformBox: 'fill-box',
                transformOrigin: '50% 0%',
                '--dur': `${3.6 + (index % 5) * 0.45}s`,
                '--delay': `${-(index % 7) * 0.6}s`,
            }}
        >
            <motion.g
                className="pear cursor-default outline-none"
                role="listitem"
                tabIndex={0}
                aria-label={skill}
                data-cursor="link"
                style={{ transformBox: 'fill-box', transformOrigin: '50% 0%' }}
                initial="hidden"
                animate={popped ? 'show' : 'hidden'}
                whileHover="hover"
                whileFocus="hover"
                variants={{
                    hidden: { scale: 0, opacity: 0 },
                    show: { scale: 1, opacity: 1, transition: { ...SPRING.soft, delay } },
                    hover: { scale: 1.14, transition: SPRING.snappy },
                }}
            >
                <title>{skill}</title>
                {/* stem */}
                <line x1="0" y1="0" x2="0" y2={pos.hang - 20} stroke={BARK} strokeWidth="2.2" strokeLinecap="round" />
                <g transform={`translate(0 ${pos.hang})`}>
                    <g transform="scale(1.25)">
                        <path d={PEAR_PATH} fill={`url(#${gradientId})`} stroke="oklch(55% 0.09 80 / 0.6)" strokeWidth="0.8" />
                        <ellipse cx="-4" cy="-6" rx="3" ry="5" fill="oklch(100% 0 0 / 0.45)" />
                        <path d={LEAF_PATH} transform="translate(1 -17) rotate(-28) scale(0.7)" fill="oklch(48% 0.07 120)" />
                    </g>
                    <text
                        className="pear-label"
                        y="42"
                        textAnchor="middle"
                        style={{ fontFamily: 'var(--font-inscription)', fontSize: 11, letterSpacing: 1, fontWeight: 600 }}
                        fill="oklch(98% 0.02 95)"
                    >
                        {skill}
                    </text>
                </g>
            </motion.g>
        </g>
    </g>
)

/**
 * The orchard: trunk + four branches (categories) with gold-leaf pears
 * (skills). Branches draw in on scroll, pears pop in with a stagger, then sway.
 */
const PearTree = ({ categories }) => {
    const id = useId().replace(/:/g, '')
    const svgRef = useRef(null)
    const branchRefs = useRef([])
    const [placed, setPlaced] = useState(null)
    const reduced = useReducedMotion()

    useLayoutEffect(() => {
        const result = categories.map((c, i) => {
            const path = branchRefs.current[i]
            return path ? placePears(path, c.skills, TREE.branches[i].pearRange) : []
        })
        setPlaced(result)
    }, [categories])

    const { scrollYProgress } = useScroll({ target: svgRef, offset: ['start 0.85', 'end 0.6'] })
    const spring = useSpring(scrollYProgress, { stiffness: 80, damping: 22, mass: 0.7 })
    const progress = useTransform(spring, (v) => (reduced ? 1 : v))
    const trunkOpacity = useTransform(progress, [0, 0.2], [0, 1])
    const branchLengths = TREE.branches.map((_, i) =>
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useTransform(progress, [0.15 + i * 0.1, 0.55 + i * 0.1], [0, 1])
    )

    const popped = useInView(svgRef, { once: true, amount: 0.35 }) || reduced
    const live = useInView(svgRef, { amount: 0.2 })

    const endPoint = (i) => {
        const path = branchRefs.current[i]
        if (!path) return { x: 0, y: 0 }
        return path.getPointAtLength(path.getTotalLength())
    }

    return (
        <div className={`relative ${live ? 'is-live' : ''}`}>
            <DottedRings size={520} className="absolute left-1/2 top-[34%] -translate-x-1/2 -translate-y-1/2 text-cream opacity-35 pointer-events-none" />
            <svg
                ref={svgRef}
                viewBox={TREE.viewBox}
                role="list"
                aria-label="Skills by category"
                className="relative w-full h-auto overflow-visible"
            >
                <defs>
                    <radialGradient id={`${id}-gold`} cx="38%" cy="32%" r="75%">
                        <stop offset="0" stopColor="oklch(94% 0.06 90)" />
                        <stop offset="0.35" stopColor="oklch(80% 0.09 85)" />
                        <stop offset="0.75" stopColor="oklch(68% 0.1 80)" />
                        <stop offset="1" stopColor="oklch(56% 0.1 75)" />
                    </radialGradient>
                    <linearGradient id={`${id}-trunk`} x1="0" x2="1">
                        <stop offset="0" stopColor={BARK_LIGHT} />
                        <stop offset="0.5" stopColor={BARK} />
                        <stop offset="1" stopColor="oklch(28% 0.04 55)" />
                    </linearGradient>
                </defs>

                {/* ground */}
                <path d={TREE.ground} fill="none" stroke="oklch(96% 0.02 95 / 0.5)" strokeWidth="2" strokeLinecap="round" />

                {/* trunk */}
                <motion.path d={TREE.trunk} fill={`url(#${id}-trunk)`} style={{ opacity: trunkOpacity }} />

                {/* branches */}
                {TREE.branches.map((b, i) => (
                    <g key={i} role="group" aria-label={categories[i]?.title}>
                        <motion.path
                            ref={(el) => (branchRefs.current[i] = el)}
                            d={b.d}
                            fill="none"
                            stroke={BARK}
                            strokeWidth="8"
                            strokeLinecap="round"
                            style={{ pathLength: branchLengths[i] }}
                        />
                        <motion.path
                            d={b.d}
                            fill="none"
                            stroke={BARK_LIGHT}
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            style={{ pathLength: branchLengths[i], opacity: 0.6 }}
                        />
                        {/* leaves along the branch */}
                        {placed &&
                            TREE.leaves
                                .filter(([bi]) => bi === i)
                                .map(([, t, side], li) => {
                                    const path = branchRefs.current[i]
                                    const p = path.getPointAtLength(t * path.getTotalLength())
                                    const q = path.getPointAtLength(Math.min(1, t + 0.01) * path.getTotalLength())
                                    const ang = (Math.atan2(q.y - p.y, q.x - p.x) * 180) / Math.PI
                                    return (
                                        <motion.path
                                            key={li}
                                            d={LEAF_PATH}
                                            fill="oklch(48% 0.07 120)"
                                            transform={`translate(${p.x} ${p.y}) rotate(${ang + side * 55}) scale(1.3)`}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: popped ? 0.95 : 0 }}
                                            transition={{ duration: 0.6, delay: 0.3 + i * 0.25 + li * 0.08 }}
                                        />
                                    )
                                })}
                        {/* branch label */}
                        {placed && (
                            <motion.text
                                x={endPoint(i).x + b.label.dx}
                                y={endPoint(i).y + b.label.dy}
                                textAnchor={b.label.anchor}
                                fill="oklch(98% 0.02 95)"
                                style={{ fontFamily: 'var(--font-inscription)', fontSize: 15, letterSpacing: 3.2, fontWeight: 600, textTransform: 'uppercase' }}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: popped ? 1 : 0 }}
                                transition={{ duration: 0.6, delay: 0.5 + i * 0.25 }}
                            >
                                {categories[i]?.title}
                            </motion.text>
                        )}
                        {/* pears */}
                        {placed &&
                            categories[i].skills.map((skill, j) => (
                                <Pear
                                    key={skill}
                                    skill={skill}
                                    pos={placed[i][j]}
                                    delay={0.35 + i * 0.25 + j * 0.05}
                                    popped={popped}
                                    gradientId={`${id}-gold`}
                                    index={i * 9 + j}
                                />
                            ))}
                    </g>
                ))}
            </svg>
        </div>
    )
}

export default PearTree

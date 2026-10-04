import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'motion/react'

const RoleCard = ({ role }) => (
    <div className="glass glass-hover rounded-lg p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
            <h3 className="text-lg font-medium text-fg">{role.title}</h3>
            <span className="label whitespace-nowrap">{role.period}</span>
        </div>
        <p className="text-fg-2 leading-relaxed">{role.description}</p>
    </div>
)

/** One company. Lights up as the drawn rail reaches its node. */
const Entry = ({ entry, isLast, progress, listRef, railHeight }) => {
    const nodeRef = useRef(null)
    const [t, setT] = useState(0)

    useEffect(() => {
        const node = nodeRef.current, list = listRef.current
        if (!node || !list || !railHeight) return
        const top = node.getBoundingClientRect().top - list.getBoundingClientRect().top + 6
        setT(Math.min(1, Math.max(0, top / railHeight)))
    }, [railHeight, listRef])

    const lit = useTransform(progress, [Math.max(0, t - 0.05), t + 0.01], [0, 1])
    const scale = useTransform(lit, [0, 1], [0.6, 1])
    const glow = useTransform(lit, (v) => `0 0 ${24 * v}px oklch(74% 0.16 30 / ${0.65 * v}), 0 0 0 ${4 * v}px oklch(74% 0.16 30 / ${0.2 * v})`)
    const nodeColor = useTransform(lit, [0, 1], ['oklch(58% 0.015 290)', 'oklch(74% 0.16 30)'])
    const connectorOpacity = useTransform(lit, [0, 1], [0.25, 1])

    const hasMultipleRoles = entry.roles.length > 1

    return (
        <div className="relative flex gap-6">
            <div className="flex flex-col items-center shrink-0 w-6">
                <motion.div
                    ref={nodeRef}
                    className="w-3 h-3 rounded-full mt-1.5 shrink-0 relative z-10"
                    style={{ scale, boxShadow: glow, backgroundColor: nodeColor }}
                />
            </div>

            <div className={`flex-1 ${isLast ? 'pb-0' : 'pb-12'}`}>
                <div className="mb-4">
                    <h2 className="font-display text-3xl md:text-4xl text-fg">{entry.company}</h2>
                    <p className="label mt-2">{entry.location}</p>
                </div>

                {hasMultipleRoles ? (
                    <div className="relative ml-2">
                        <motion.div style={{ opacity: connectorOpacity }} className="absolute left-0 top-0 bottom-0 w-px bg-line-strong" />
                        <div className="space-y-4">
                            {entry.roles.map((role) => (
                                <div key={role.title} className="relative pl-6">
                                    <motion.div style={{ opacity: connectorOpacity }} className="absolute left-0 top-6 w-4 h-px bg-line-strong" />
                                    <motion.div style={{ opacity: connectorOpacity }} className="absolute left-[-3px] top-[21px] w-1.5 h-1.5 rounded-full bg-coral/70" />
                                    <RoleCard role={role} />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <RoleCard role={entry.roles[0]} />
                )}
            </div>
        </div>
    )
}

/**
 * Experience timeline whose rail draws itself as you scroll; each company
 * node glows when the line reaches it.
 */
const Timeline = ({ entries }) => {
    const listRef = useRef(null)
    const [h, setH] = useState(0)

    useEffect(() => {
        const el = listRef.current
        if (!el) return
        const measure = () => setH(el.offsetHeight)
        const ro = new ResizeObserver(measure)
        ro.observe(el)
        document.fonts?.ready.then(measure)
        return () => ro.disconnect()
    }, [])

    const { scrollYProgress } = useScroll({ target: listRef, offset: ['start 0.78', 'end 0.55'] })
    const progress = useSpring(scrollYProgress, { stiffness: 90, damping: 22, mass: 0.6 })

    return (
        <div ref={listRef} className="relative">
            {h > 0 && (
                <svg
                    aria-hidden="true"
                    className="absolute left-[11px] top-2 overflow-visible pointer-events-none"
                    width="2"
                    height={h}
                    viewBox={`0 0 2 ${h}`}
                    fill="none"
                >
                    <defs>
                        <linearGradient id="timeline-grad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0" style={{ stopColor: 'var(--color-coral)' }} />
                            <stop offset="1" style={{ stopColor: 'var(--color-violet)' }} />
                        </linearGradient>
                    </defs>
                    <line x1="1" y1="0" x2="1" y2={h} stroke="var(--color-line)" strokeWidth="2" />
                    <motion.line
                        x1="1" y1="0" x2="1" y2={h}
                        stroke="url(#timeline-grad)"
                        strokeWidth="2"
                        strokeLinecap="round"
                        style={{ pathLength: progress }}
                    />
                </svg>
            )}
            {entries.map((entry, index) => (
                <Entry
                    key={entry.company}
                    entry={entry}
                    isLast={index === entries.length - 1}
                    progress={progress}
                    listRef={listRef}
                    railHeight={h}
                />
            ))}
        </div>
    )
}

export default Timeline

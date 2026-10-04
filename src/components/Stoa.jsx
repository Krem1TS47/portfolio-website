import { Fragment, useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import DoricColumn from './ornaments/DoricColumn'
import Stele from './ornaments/Stele'
import { useMediaQuery } from '../hooks/useMediaQuery'

const COL_W = 64
const TRIGLYPHS =
    'repeating-linear-gradient(90deg, oklch(30% 0.02 60 / 0.55) 0 3px, transparent 3px 6px, oklch(30% 0.02 60 / 0.55) 6px 9px, transparent 9px 12px, oklch(30% 0.02 60 / 0.55) 12px 15px, transparent 15px 54px)'

const RoleCard = ({ role }) => (
    <Stele arch={false} className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-2">
            <h3 className="text-lg font-medium text-fg">{role.title}</h3>
            <span className="inscription text-[0.6rem] tracking-[0.2em] whitespace-nowrap">{role.period}</span>
        </div>
        <p className="text-fg-2 leading-relaxed">{role.description}</p>
    </Stele>
)

/** Measures its own centre along the rail and lights up when the rail reaches it. */
const useLit = (progress, t) => useTransform(progress, [Math.max(0, t - 0.06), Math.min(1, t + 0.01)], [0, 1])

const Column = ({ progress, t, height }) => {
    const lit = useLit(progress, t)
    return <DoricColumn height={height} width={COL_W} lit={lit} className="block" />
}

const Bay = ({ entry, progress, t }) => {
    const lit = useLit(progress, t)
    const opacity = useTransform(lit, [0, 1], [0.72, 1])
    const y = useTransform(lit, [0, 1], [10, 0])
    return (
        <motion.div style={{ opacity, y }} className="flex flex-col gap-4 px-4 pb-6 self-end">
            {entry.roles.map((role) => <RoleCard key={role.title} role={role} />)}
        </motion.div>
    )
}

/**
 * Experience as a stoa: one Doric column per employer against the sky, roles
 * as marble steles in the bays, company names inscribed on the architrave.
 * The stylobate (floor) draws itself as you scroll and lights each column.
 */
const Stoa = ({ entries }) => {
    const desktop = useMediaQuery('(min-width: 768px)')
    const wrap = useRef(null)
    const row = useRef(null)
    const [dims, setDims] = useState({ w: 0, h: 0 })
    const reduced = useReducedMotion()

    useEffect(() => {
        const el = row.current
        if (!el) return
        const measure = () => setDims({ w: el.clientWidth, h: el.clientHeight })
        const ro = new ResizeObserver(measure)
        ro.observe(el)
        document.fonts?.ready.then(measure)
        return () => ro.disconnect()
    }, [desktop])

    const { scrollYProgress } = useScroll({ target: wrap, offset: ['start 0.78', 'end 0.55'] })
    const spring = useSpring(scrollYProgress, { stiffness: 90, damping: 22, mass: 0.6 })
    const progress = useTransform(spring, (v) => (reduced ? 1 : v))

    const n = entries.length
    const bayW = dims.w ? (dims.w - (n + 1) * COL_W) / n : 0
    const colT = (i) => (dims.w ? (i * (bayW + COL_W) + COL_W / 2) / dims.w : 0)
    const bayT = (i) => (dims.w ? ((i + 1) * COL_W + i * bayW + bayW / 2) / dims.w : 0)

    if (!desktop) {
        return (
            <div ref={wrap} className="relative pl-12">
                {/* pilaster + vertical rail */}
                <div ref={row} className="absolute left-0 top-0 bottom-0 w-8 flex justify-center">
                    <div className="absolute inset-y-0 w-px bg-line-strong" />
                    <motion.div
                        className="absolute top-0 w-px gold-leaf origin-top"
                        style={{ height: '100%', scaleY: progress }}
                    />
                </div>
                <div className="space-y-12">
                    {entries.map((entry, i) => (
                        <div key={entry.company} className="relative">
                            <div className="absolute -left-12 top-2 w-8 flex justify-center">
                                <span className="w-3 h-3 rounded-full gold-leaf ring-4 ring-sky-deep/40" />
                            </div>
                            <h2 className="font-display text-3xl text-fg">{entry.company}</h2>
                            <p className="inscription text-[0.62rem] mt-1 mb-4">{entry.location}</p>
                            <div className="space-y-4">
                                {entry.roles.map((role) => <RoleCard key={role.title} role={role} />)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )
    }

    const gridCols = `${COL_W}px ${Array.from({ length: n }, () => `minmax(0, 1fr) ${COL_W}px`).join(' ')}`

    return (
        <div ref={wrap} className="relative">
            {/* Entablature: architrave with company names, frieze of triglyphs */}
            <div className="paper marble relative rounded-t-sm" style={{ boxShadow: '0 10px 24px -14px oklch(0% 0 0 / 0.45)' }}>
                <div className="h-3 w-full" style={{ backgroundImage: TRIGLYPHS, backgroundSize: '54px 100%' }} />
                <div className="grid items-center" style={{ gridTemplateColumns: gridCols }}>
                    <span />
                    {entries.map((entry) => (
                        <Fragment key={entry.company}>
                            <div className="px-4 py-4 text-center">
                                <h2 className="inscription engraved-deep text-[0.9rem] md:text-base tracking-[0.26em]">{entry.company}</h2>
                                <p className="inscription engraved text-[0.6rem] tracking-[0.3em] mt-1.5 opacity-80">{entry.location}</p>
                            </div>
                            <span />
                        </Fragment>
                    ))}
                </div>
                <div className="h-3 w-full" style={{ backgroundImage: TRIGLYPHS, backgroundSize: '54px 100%', backgroundPosition: '27px 0' }} />
            </div>

            {/* Colonnade */}
            <div ref={row} className="grid pt-6" style={{ gridTemplateColumns: gridCols }}>
                {entries.map((entry, i) => (
                    <Fragment key={entry.company}>
                        <div className="self-end flex justify-center">
                            {dims.h > 0 && <Column progress={progress} t={colT(i)} height={Math.max(260, dims.h - 24)} />}
                        </div>
                        <Bay entry={entry} progress={progress} t={bayT(i)} />
                    </Fragment>
                ))}
                <div className="self-end flex justify-center">
                    {dims.h > 0 && <Column progress={progress} t={colT(n)} height={Math.max(260, dims.h - 24)} />}
                </div>
            </div>

            {/* Stylobate with the drawn rail */}
            <div className="paper marble-dark relative h-7 rounded-b-sm" style={{ boxShadow: 'inset 0 6px 10px -8px oklch(0% 0 0 / 0.4), 0 26px 40px -24px oklch(0% 0 0 / 0.55)' }}>
                <div className="absolute inset-x-0 top-0 h-px bg-line-strong" />
                <motion.div className="absolute left-0 top-0 h-[3px] w-full gold-leaf origin-left" style={{ scaleX: progress }} />
            </div>
        </div>
    )
}

export default Stoa

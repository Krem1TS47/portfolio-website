import { Fragment, useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'
import Artwork from './Artwork'
import DoricColumn from './ornaments/DoricColumn'
import Amphora from './ornaments/Amphora'
import { useMediaQuery } from '../hooks/useMediaQuery'
import art from '../data/art.json'

const exitPiece = art.find((a) => a.role === 'gallery-exit')
const decor = art.filter((a) => a.role === 'gallery-decor')

/** A CC0 antiquity on a pedestal, with its museum credit. */
const WallPiece = ({ piece, size = 'md' }) => (
    <figure className={`shrink-0 flex flex-col items-center ${size === 'lg' ? 'w-[min(60vw,320px)]' : 'w-[min(44vw,220px)]'}`}>
        <div className="relative w-full aspect-[4/5] flex items-end justify-center">
            {piece ? (
                <img
                    src={piece.src}
                    alt={piece.title}
                    className="max-h-full w-auto object-contain drop-shadow-[0_26px_24px_oklch(0%_0_0/0.35)]"
                    loading="lazy"
                    decoding="async"
                />
            ) : (
                <Amphora className="h-[80%] drop-shadow-[0_26px_24px_oklch(0%_0_0/0.35)]" />
            )}
        </div>
        <div className="paper marble w-[80%] h-8 mt-2 rounded-[2px]" style={{ boxShadow: 'inset 0 -8px 12px -8px oklch(0% 0 0 / 0.35), 0 18px 30px -18px oklch(0% 0 0 / 0.45)' }} />
        <figcaption className="mt-3 text-center text-[0.65rem] leading-snug text-fg-3 max-w-[22ch]">
            {piece ? `${piece.title}, ${piece.date}. The Met, CC0.` : 'Amphora (vector).'}
        </figcaption>
    </figure>
)

const Pieces = ({ projects, columnHeight }) => (
    <>
        {projects.map((p, i) => (
            <Fragment key={p.title}>
                <Artwork project={p} index={i} />
                {i === 1 && <WallPiece piece={decor[0]} />}
                {i < projects.length - 1 && (
                    <DoricColumn height={520} width={56} className="shrink-0 hidden lg:block" style={{ height: columnHeight, width: 'auto' }} />
                )}
            </Fragment>
        ))}
        <WallPiece piece={exitPiece} size="lg" />
    </>
)

/** Pinned horizontal walk-through (desktop, motion allowed). */
const PinnedGallery = ({ projects }) => {
    const track = useRef(null)
    const row = useRef(null)
    const [over, setOver] = useState(0)

    useEffect(() => {
        const el = row.current
        if (!el) return
        const measure = () => setOver(Math.max(0, el.scrollWidth - el.clientWidth))
        const ro = new ResizeObserver(measure)
        ro.observe(el)
        window.addEventListener('resize', measure)
        document.fonts?.ready.then(measure)
        return () => { ro.disconnect(); window.removeEventListener('resize', measure) }
    }, [])

    const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] })
    const x = useTransform(scrollYProgress, [0, 1], [0, -over])

    return (
        <div ref={track} style={{ height: `calc(100svh + ${over}px)` }}>
            <div className="paper marble parchment sticky top-0 h-[100svh] overflow-hidden">
                {/* floor */}
                <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[16%] marble-dark" style={{ boxShadow: 'inset 0 1px 0 oklch(100% 0 0 / 0.7), inset 0 12px 20px -14px oklch(0% 0 0 / 0.35)' }} />
                <motion.div
                    ref={row}
                    style={{ x }}
                    className="relative flex h-full items-end gap-[6vw] px-[10vw] pb-[13vh] will-change-transform"
                >
                    <Pieces projects={projects} columnHeight="62vh" />
                </motion.div>
                <p className="absolute left-6 top-6 inscription engraved text-[0.6rem] tracking-[0.3em] pointer-events-none">Gallery · scroll to walk</p>
            </div>
        </div>
    )
}

/** Vertical wall for touch devices, narrow screens and reduced motion. */
const GalleryWall = ({ projects }) => (
    <div className="paper marble parchment relative px-6 md:px-8 py-16">
        <div className="mx-auto max-w-6xl flex flex-col items-center gap-16 md:grid md:grid-cols-2 md:items-end md:justify-items-center">
            {projects.map((p, i) => <Artwork key={p.title} project={p} index={i} className="w-full max-w-[460px]" />)}
            <WallPiece piece={exitPiece} size="lg" />
        </div>
    </div>
)

const Gallery = ({ projects }) => {
    const wide = useMediaQuery('(min-width: 1024px) and (pointer: fine)')
    const reduced = useReducedMotion()
    return wide && !reduced ? <PinnedGallery projects={projects} /> : <GalleryWall projects={projects} />
}

export default Gallery

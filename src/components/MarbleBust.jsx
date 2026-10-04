import { useId, useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import profilePhoto from '../data/benphoto.webp'
import Pedestal from './ornaments/Pedestal'
import DottedRings from './ornaments/DottedRings'
import { LaurelBranch } from './ornaments/Laurel'

/* Bust silhouette: head, neck, shoulders, concave chest cut. viewBox 0 0 100 120. */
const BUST_PATH =
    'M50 3 C 72 3 79 25 77 42 C 76 56 67 65 61 69 L 61 77 C 79 81 95 93 99 113 L 99 120 Q 50 110 1 120 L 1 113 C 5 93 21 81 39 77 L 39 69 C 33 65 24 56 23 42 C 21 25 28 3 50 3 Z'
const MASK = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 120' preserveAspectRatio='none'%3E%3Cpath d='${BUST_PATH}' fill='%23000'/%3E%3C/svg%3E")`

const finePointer = () =>
    window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * Turns a photo into a marble bust with an SVG filter chain (desaturate →
 * contrast → lift → stone displacement → cream duotone), a bust mask, vein
 * and sheen overlays, and a stepped pedestal. Pass `image` to swap in a
 * rendered statue later; the mask and pedestal stay.
 */
const MarbleBust = ({
    image = profilePhoto,
    alt = 'Benjamin Ching, rendered as a marble bust',
    name = 'Benjamin Ching',
    sub = 'Honours CS · UBC',
    /** Face centre as % of the photo box when the photo is top-aligned, and how much to zoom so the face fills the head. */
    focus = { x: 47, y: 39 },
    zoom = 2.3,
    displace = true,
    className = '',
}) => {
    const id = useId().replace(/:/g, '')
    const figure = useRef(null)
    const reduced = useReducedMotion()

    const { scrollYProgress } = useScroll({ target: figure, offset: ['start end', 'end start'] })
    const y = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [28, -28])
    const rotateZ = useTransform(scrollYProgress, [0, 1], reduced ? [0, 0] : [-1.2, 1.2])

    const px = useMotionValue(0.5)
    const sx = useSpring(px, { stiffness: 120, damping: 20 })
    const rotateY = useTransform(sx, [0, 1], [-4, 4])

    const onPointerMove = (e) => {
        if (!finePointer() || !figure.current) return
        const r = figure.current.getBoundingClientRect()
        px.set((e.clientX - r.left) / r.width)
    }

    return (
        <figure
            ref={figure}
            onPointerMove={onPointerMove}
            onPointerLeave={() => px.set(0.5)}
            className={`relative flex flex-col items-center ${className}`}
        >
            <svg width="0" height="0" aria-hidden="true" className="absolute">
                <defs>
                    <filter id={`${id}-marble`} colorInterpolationFilters="sRGB">
                        <feColorMatrix type="saturate" values="0" />
                        <feComponentTransfer>
                            <feFuncR type="linear" slope="1.28" intercept="-0.06" />
                            <feFuncG type="linear" slope="1.28" intercept="-0.06" />
                            <feFuncB type="linear" slope="1.28" intercept="-0.06" />
                        </feComponentTransfer>
                        <feComponentTransfer result="lifted">
                            <feFuncR type="gamma" exponent="0.82" amplitude="1" />
                            <feFuncG type="gamma" exponent="0.82" amplitude="1" />
                            <feFuncB type="gamma" exponent="0.82" amplitude="1" />
                        </feComponentTransfer>
                        {displace && (
                            <>
                                <feTurbulence type="fractalNoise" baseFrequency="0.012 0.028" numOctaves="2" seed="7" result="noise" />
                                <feDisplacementMap in="lifted" in2="noise" scale="3.5" xChannelSelector="R" yChannelSelector="G" />
                            </>
                        )}
                        <feComponentTransfer>
                            <feFuncR type="table" tableValues="0.52 0.965" />
                            <feFuncG type="table" tableValues="0.49 0.94" />
                            <feFuncB type="table" tableValues="0.45 0.895" />
                        </feComponentTransfer>
                    </filter>
                </defs>
            </svg>

            {/* signal rings behind the bust */}
            <DottedRings
                size={560}
                className="absolute left-1/2 top-[38%] -translate-x-1/2 -translate-y-1/2 text-cream opacity-45 pointer-events-none"
            />

            <motion.div
                style={{ y, rotateZ, rotateY, transformPerspective: 900 }}
                className="relative z-10 will-change-transform w-[min(78vw,24rem)]"
            >
                <div
                    className="relative aspect-[5/6] overflow-hidden"
                    style={{
                        WebkitMaskImage: MASK,
                        maskImage: MASK,
                        WebkitMaskSize: '100% 100%',
                        maskSize: '100% 100%',
                        WebkitMaskRepeat: 'no-repeat',
                        maskRepeat: 'no-repeat',
                    }}
                >
                    <img
                        src={image}
                        alt={alt}
                        className="absolute inset-0 w-full h-full object-cover"
                        style={{
                            filter: `url(#${id}-marble)`,
                            objectPosition: `${focus.x}% 0%`,
                            transformOrigin: `${focus.x}% ${focus.y}%`,
                            translate: `${50 - focus.x}% ${36 - focus.y}%`,
                            scale: String(zoom),
                        }}
                        loading="lazy"
                        decoding="async"
                    />
                    {/* soften the photo background into stone toward the mask edge */}
                    <div
                        aria-hidden="true"
                        className="absolute inset-0"
                        style={{ background: 'radial-gradient(ellipse 48% 42% at 50% 34%, transparent 55%, oklch(94% 0.012 90 / 0.55) 85%, oklch(93% 0.012 90 / 0.8) 100%), linear-gradient(180deg, transparent 62%, oklch(94% 0.012 90 / 0.75) 92%)' }}
                    />
                    <div aria-hidden="true" className="marble absolute inset-0 mix-blend-multiply opacity-55" />
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 mix-blend-screen opacity-35"
                        style={{ background: 'linear-gradient(125deg, oklch(100% 0 0 / 0.9) 0%, transparent 45%, oklch(0% 0 0 / 0.25) 100%)' }}
                    />
                </div>
                {/* daylight shadow on the pedestal cap */}
                <div
                    aria-hidden="true"
                    className="absolute left-1/2 -bottom-2 h-6 w-[70%] -translate-x-1/2 translate-x-3 rounded-[100%] blur-md"
                    style={{ background: 'oklch(20% 0.05 260 / 0.35)' }}
                />
            </motion.div>

            <div className="relative z-20 w-[min(84vw,26rem)] -mt-1">
                <Pedestal label={name} sub={sub} />
                <LaurelBranch
                    length={120}
                    leaves={8}
                    className="absolute -left-10 bottom-10 text-laurel opacity-90 hidden sm:block"
                    style={{ transform: 'rotate(-28deg)' }}
                />
            </div>
            <figcaption className="sr-only">{alt}</figcaption>
        </figure>
    )
}

export default MarbleBust

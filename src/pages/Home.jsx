import { Suspense, lazy, useCallback, useRef } from 'react'
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react'
import Section from '../components/Section'
import HeroTitle from '../components/HeroTitle'
import RotatingWord from '../components/RotatingWord'
import { EASE } from '../motion/presets'
import PlanetPoster from '../components/PlanetPoster'
import SceneErrorBoundary from '../components/SceneErrorBoundary'
import { useWebGL } from '../three/useWebGL'
import { useDawn } from '../hooks/useDawn'
import { dawn } from '../motion/dawn'

const PlanetScene = lazy(() => import('../three/PlanetScene'))

const phrases = [
    'Data Engineering',
    'Software Development',
    'Data Analytics',
    'AI/Machine Learning'
]

/* Nebula wash over the canvas, in the original card's colours. */
const GLOW =
    'radial-gradient(circle at 25% 30%, rgba(255,173,208,0.35), transparent 55%), ' +
    'radial-gradient(circle at 75% 25%, rgba(144,181,255,0.25), transparent 50%), ' +
    'radial-gradient(circle at 60% 85%, rgba(255,203,159,0.25), transparent 60%)'

const Home = () => {
    const heroRef = useRef(null)
    const reducedMotion = useReducedMotion()
    const webgl = useWebGL()
    const showScene = webgl && !reducedMotion

    // Pointer parallax, smoothed. Read by the scene inside useFrame.
    const rawX = useMotionValue(0)
    const rawY = useMotionValue(0)
    const px = useSpring(rawX, { stiffness: 60, damping: 20 })
    const py = useSpring(rawY, { stiffness: 60, damping: 20 })

    // 0 → 1 as the hero scrolls out of view.
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
    useDawn(scrollYProgress)
    const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
    const textY = useTransform(scrollYProgress, [0, 1], [0, -80])
    const hintOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])

    const onPointerMove = useCallback((e) => {
        const el = heroRef.current
        if (!el) return
        const r = el.getBoundingClientRect()
        rawX.set(((e.clientX - r.left) / r.width) * 2 - 1)
        rawY.set(((e.clientY - r.top) / r.height) * 2 - 1)
    }, [rawX, rawY])

    const onPointerLeave = useCallback(() => {
        rawX.set(0)
        rawY.set(0)
    }, [rawX, rawY])

    return (
        <div ref={heroRef} onPointerMove={onPointerMove} onPointerLeave={onPointerLeave}>
            <Section
                id="home"
                className="min-h-[100svh] flex items-stretch overflow-hidden !py-0"
                innerClassName="pointer-events-none select-none flex flex-col justify-start pt-32 pb-[52svh] md:justify-center md:py-0"
                background={
                    <>
                        {showScene ? (
                            <SceneErrorBoundary fallback={<PlanetPoster />}>
                                <Suspense fallback={<PlanetPoster />}>
                                    <PlanetScene pointer={{ x: px, y: py }} progress={scrollYProgress} />
                                </Suspense>
                            </SceneErrorBoundary>
                        ) : (
                            <PlanetPoster />
                        )}
                        <div
                            aria-hidden="true"
                            className="absolute inset-0 pointer-events-none mix-blend-screen opacity-60 blur-3xl"
                            style={{ background: GLOW }}
                        />
                        <div
                            aria-hidden="true"
                            className="absolute inset-x-0 bottom-0 h-48 pointer-events-none bg-linear-to-t from-bg-0 to-transparent"
                        />
                        {/* Sunrise: warms the night→sky seam as the garden dawns */}
                        <motion.div
                            aria-hidden="true"
                            style={{ opacity: dawn }}
                            className="absolute inset-x-0 bottom-0 h-72 pointer-events-none mix-blend-screen bg-[linear-gradient(180deg,transparent_0%,oklch(38%_0.12_255_/_0.55)_45%,oklch(72%_0.09_85_/_0.55)_100%)]"
                        />
                    </>
                }
            >
                <motion.div style={{ opacity: textOpacity, y: textY }} className="md:max-w-[55%]">
                    <motion.p
                        className="label mb-6 flex items-center gap-3"
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, ease: EASE, delay: 0.05 }}
                    >
                        <span className="text-coral">Portfolio</span>
                        <span aria-hidden="true" className="h-px w-6 bg-line-strong" />
                        <span>Vancouver, BC</span>
                    </motion.p>
                    <HeroTitle className="font-display text-display text-fg" />
                    <motion.div
                        className="mt-6 text-xl md:text-2xl text-fg-2 min-h-[2rem] flex items-center gap-3"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: EASE, delay: 0.9 }}
                    >
                        <span className="text-fg-3">I work in</span>
                        <RotatingWord words={phrases} className="text-fg" />
                    </motion.div>
                </motion.div>

                <motion.div
                    style={{ opacity: hintOpacity }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.6 }}
                    className="absolute bottom-8 left-6 md:left-8 label flex items-center gap-3"
                >
                    <span aria-hidden="true" className="block h-8 w-px bg-linear-to-b from-coral to-transparent" />
                    <span>Scroll</span>
                    {showScene && <span className="hidden md:inline text-fg-3/70">· drag the planet</span>}
                </motion.div>
            </Section>
        </div>
    )
}

export default Home

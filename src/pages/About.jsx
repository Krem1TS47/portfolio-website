import { Suspense, lazy, useMemo } from 'react'
import { motion, useScroll } from 'motion/react'
import Section from '../components/Section'
import SectionHeading from '../components/SectionHeading'
import SceneErrorBoundary from '../components/SceneErrorBoundary'
import { entranceVariants, useEntrance } from '../components/Reveal'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useWebGL } from '../three/useWebGL'
import { ROSE_STEPS, rosePath } from '../three/roseMath'
import { EASE } from '../motion/presets'
import { sectionIndex } from '../data/nav'

const OrbitRose = lazy(() => import('../three/OrbitRose'))

const ROSE_SCALE = 240
const ROSE_PATH = rosePath(ROSE_STEPS, ROSE_SCALE)

/** Static rose for reduced motion, no WebGL, or while the canvas loads. */
const RoseDiagram = () => (
    <svg className="about-rose-svg" viewBox="-260 -260 520 520" aria-hidden="true">
        <circle r={ROSE_SCALE} className="about-rose-orbit" />
        <circle r={ROSE_SCALE * 0.7233} className="about-rose-orbit" />
        <path d={ROSE_PATH} className="about-rose-lines" />
        <circle r="9" className="about-rose-sun" />
    </svg>
)

const About = () => {
    const artwork = useEntrance()
    const biography = useEntrance()
    const reduced = useMediaQuery('(prefers-reduced-motion: reduce)', true)
    const compact = useMediaQuery('(max-width: 700px)')
    const webgl = useWebGL()
    const showScene = webgl && !reduced
    const { scrollYProgress } = useScroll({ target: artwork.ref, offset: ['start end', 'end start'] })
    const roseArrival = useMemo(() => entranceVariants(
        { opacity: 0, scale: 0.88 },
        { duration: 0.8, ease: EASE },
    ), [])
    const textArrival = useMemo(() => entranceVariants(
        { opacity: 0, x: compact ? 20 : 32 },
        { duration: 0.45, delay: 0.1, ease: EASE },
    ), [compact])

    const finishAbout = () => {
        artwork.finish()
        biography.finish()
    }

    return (
        <Section id="about" className="orbital-about">
            <SectionHeading index={sectionIndex('about')} eyebrow="About" title="About Me" />

            <div className="about-orbit-layout" onFocusCapture={finishAbout}>
                <figure ref={artwork.ref} className="about-orbit-figure">
                    <motion.div
                        className="about-orbit-map"
                        initial={artwork.reduced ? false : 'hidden'}
                        animate={artwork.variant}
                        variants={roseArrival}
                        onAnimationComplete={(definition) => { if (definition === 'show') artwork.complete() }}
                    >
                        <div aria-hidden="true" className="about-orbit-haze" />
                        {showScene ? (
                            <SceneErrorBoundary fallback={<RoseDiagram />}>
                                <Suspense fallback={<RoseDiagram />}>
                                    <OrbitRose progress={scrollYProgress} />
                                </Suspense>
                            </SceneErrorBoundary>
                        ) : (
                            <RoseDiagram />
                        )}
                    </motion.div>
                    <figcaption className="about-orbit-caption">
                        <span className="about-orbit-caption-line" aria-hidden="true" />
                        Earth · Venus — 13 : 8 resonance over 8 years
                    </figcaption>
                </figure>

                <div ref={biography.ref} className="about-orbit-story">
                    <motion.div
                        className="about-orbit-copy"
                        initial={biography.reduced ? false : 'hidden'}
                        animate={biography.variant}
                        variants={textArrival}
                        onAnimationComplete={(definition) => { if (definition === 'show') biography.complete() }}
                    >
                        <p className="label about-orbit-location"><span aria-hidden="true" />Vancouver, BC <span className="about-orbit-year">2026</span></p>
                        <p className="about-orbit-intro">
                            Hello! I'm <span className="text-coral">Ben</span>, an honours CS student at the University of British Columbia. I'm deeply interested in topics related to software development, data analytics, and machine learning/artificial intelligence.
                        </p>
                        <p className="about-orbit-volleyball">
                            Outside of school, you can definitely find me doing something related to volleyball. Whether it is coaching, playing in a tournament, or just watching a game, I have always been passionate about the sport and love being involved in it.
                        </p>
                    </motion.div>
                    <a
                        href="https://www.youtube.com/playlist?list=PLEXApHNWlv1qZ1Ec31SyigL9a6jZVVLAK"
                        target="_blank"
                        rel="noopener noreferrer"
                        data-cursor="link"
                        className="space-link about-volleyball-link"
                    >
                        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="2" y="5" width="20" height="14" rx="4" stroke="currentColor" strokeWidth="1.4" /><path d="m10 9 5 3-5 3V9Z" fill="currentColor" /></svg>
                        <span>Watch my volleyball highlights</span>
                        <span aria-hidden="true">↗</span>
                    </a>
                </div>
            </div>
        </Section>
    )
}

export default About

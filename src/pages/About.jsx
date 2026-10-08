import { useEffect, useId, useMemo, useState } from 'react'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'motion/react'
import Section from '../components/Section'
import SectionHeading from '../components/SectionHeading'
import OrbitalPlanet from '../components/OrbitalPlanet'
import { entranceVariants, useEntrance } from '../components/Reveal'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { EASE, SPRING } from '../motion/presets'
import { sectionIndex } from '../data/nav'

const interests = [
    { label: 'Data Engineering', x: 31, y: 14, rotation: -34 },
    { label: 'Web Development', x: 79, y: 29, rotation: 27 },
    { label: 'Data Analytics', x: 76, y: 71, rotation: -8 },
    { label: 'Machine Learning/Models', x: 30, y: 86, rotation: 52 },
    { label: 'Software Engineering', x: 19, y: 49, rotation: -65 },
]

const About = () => {
    const artwork = useEntrance()
    const biography = useEntrance()
    const orbit = artwork.ref
    const [selected, setSelected] = useState(0)
    const reduced = useMediaQuery('(prefers-reduced-motion: reduce)', true)
    const compact = useMediaQuery('(max-width: 700px)')
    const id = useId()
    const pointerX = useMotionValue(0)
    const pointerY = useMotionValue(0)
    const x = useSpring(pointerX, { stiffness: 75, damping: 24 })
    const y = useSpring(pointerY, { stiffness: 75, damping: 24 })
    const { scrollYProgress } = useScroll({ target: orbit, offset: ['start end', 'end start'] })
    const rotation = useTransform(scrollYProgress, [0, 1], [-5, 5])
    const drift = useTransform(scrollYProgress, [0, 1], [9, -9])
    const planetArrival = useMemo(() => entranceVariants(
        { opacity: 0, x: compact ? -12 : -22, y: compact ? 32 : 64, scale: 0.8 },
        { ...SPRING.soft, x: { duration: 0.85, ease: EASE }, opacity: { duration: 0.35, ease: EASE } },
    ), [compact])
    const ringArrival = useMemo(() => entranceVariants(
        { opacity: 0, scale: 0.9 },
        { duration: 0.7, delay: 0.05, ease: EASE },
    ), [])
    const textArrival = useMemo(() => entranceVariants(
        { opacity: 0, x: compact ? 20 : 32 },
        { duration: 0.45, delay: 0.1, ease: EASE },
    ), [compact])

    useEffect(() => {
        if (reduced) {
            pointerX.set(0)
            pointerY.set(0)
        }
    }, [reduced, pointerX, pointerY])

    const moveOrbit = (event) => {
        if (reduced || event.pointerType === 'touch') return
        const bounds = event.currentTarget.getBoundingClientRect()
        pointerX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 12)
        pointerY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 12)
    }

    const resetOrbit = () => {
        pointerX.set(0)
        pointerY.set(0)
    }

    const finishAbout = () => {
        artwork.finish()
        biography.finish()
    }

    return (
        <Section id="about" className="orbital-about">
            <SectionHeading index={sectionIndex('about')} eyebrow="About" title="About Me" />

            <div className="about-orbit-layout" onFocusCapture={finishAbout}>
                <figure className="about-orbit-figure">
                    <div
                        ref={orbit}
                        className="about-orbit-map"
                        onPointerMove={reduced ? undefined : moveOrbit}
                        onPointerLeave={reduced ? undefined : resetOrbit}
                    >
                        <div aria-hidden="true" className="about-orbit-haze" />
                        <motion.div aria-hidden="true" className="about-orbit-motion" style={{ x: reduced ? 0 : x, y: reduced ? 0 : y }}>
                            <motion.div
                                className="about-orbit-ring-arrival"
                                initial={artwork.reduced ? false : 'hidden'}
                                animate={artwork.variant}
                                variants={ringArrival}
                            >
                                <motion.svg className="about-orbit-paths" viewBox="0 0 560 560" style={{ rotate: reduced ? 0 : rotation }}>
                                    <defs>
                                        <radialGradient id={`${id}-orbit-glow`}>
                                            <stop offset="0" stopColor="#ffd9b8" stopOpacity="0.45" />
                                            <stop offset="1" stopColor="#9b7bff" stopOpacity="0.06" />
                                        </radialGradient>
                                    </defs>
                                    <circle cx="280" cy="274" r="235" className="about-orbit-boundary" />
                                    {interests.map((interest, index) => (
                                        <ellipse
                                            key={interest.label}
                                            cx="280"
                                            cy="274"
                                            rx={178 + index * 9}
                                            ry={83 + index * 5}
                                            transform={`rotate(${interest.rotation} 280 274)`}
                                            className={`about-orbit-path ${selected === index ? 'is-selected' : ''}`}
                                        />
                                    ))}
                                    <circle cx="280" cy="274" r="111" fill={`url(#${id}-orbit-glow)`} />
                                    <circle cx="372" cy="93" r="2" fill="#c8dcff" />
                                    <circle cx="427" cy="422" r="2" fill="#ffd9b8" />
                                    <circle cx="91" cy="365" r="1.5" fill="#9b7bff" />
                                </motion.svg>
                            </motion.div>
                            <motion.div className="about-orbit-core" style={{ y: reduced ? 0 : drift }}>
                                <motion.div
                                    className="about-planet-arrival"
                                    initial={artwork.reduced ? false : 'hidden'}
                                    animate={artwork.variant}
                                    variants={planetArrival}
                                    onAnimationComplete={(definition) => { if (definition === 'show') artwork.complete() }}
                                >
                                    <OrbitalPlanet tone="coral" ring />
                                </motion.div>
                            </motion.div>
                        </motion.div>
                        <p className="about-orbit-centre" aria-hidden="true">A curious mind</p>
                        <ul className="about-interest-orbits" aria-label="My interests">
                            {interests.map((interest, index) => (
                                <li key={interest.label} style={{ '--orbit-x': `${interest.x}%`, '--orbit-y': `${interest.y}%` }}>
                                    <button
                                        type="button"
                                        className={`about-interest ${selected === index ? 'is-selected' : ''}`}
                                        aria-pressed={selected === index}
                                        aria-describedby={`${id}-orbit-hint`}
                                        onClick={() => setSelected(index)}
                                        onFocus={() => setSelected(index)}
                                        onPointerEnter={(event) => { if (event.pointerType === 'mouse') setSelected(index) }}
                                    >
                                        <span className="about-interest-dot" aria-hidden="true" />
                                        <span>{interest.label}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                        <span aria-hidden="true" className="about-orbit-coordinate about-orbit-coordinate-top">49°16′ N</span>
                        <span aria-hidden="true" className="about-orbit-coordinate about-orbit-coordinate-bottom">123°07′ W</span>
                    </div>
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

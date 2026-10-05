import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { motion, useScroll, useSpring, useTransform } from 'motion/react'
import Section from '../components/Section'
import SectionHeading from '../components/SectionHeading'
import OrbitalPlanet from '../components/OrbitalPlanet'
import { entranceVariants, useEntrance } from '../components/Reveal'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { EASE, SPRING } from '../motion/presets'
import { sectionIndex } from '../data/nav'
import { experiences } from '../data/experience'

const connectionArrival = entranceVariants(
    { opacity: 1, pathLength: 0 },
    { duration: 0.7, delay: 0.05, ease: EASE },
)

const CareerStop = ({ entry, index, active, onActivate, onArrival, nextArrival, progress, reduced, last }) => {
    const recordArrival = useCallback(() => onArrival(index, 'arriving'), [index, onArrival])
    const artwork = useEntrance({ onEnter: recordArrival })
    const roles = useEntrance()
    const compact = useMediaQuery('(max-width: 700px)')
    const direction = index % 2 === 0 ? -1 : 1
    const drift = useTransform(progress, [0, 1], [6, -6])
    const planetArrival = useMemo(() => entranceVariants(
        { opacity: 0, x: direction * (compact ? 24 : 48), y: compact ? 20 : 32, scale: 0.82 },
        { ...SPRING.soft, x: { duration: 0.8, ease: EASE }, opacity: { duration: 0.3, ease: EASE } },
    ), [compact, direction])
    const companyArrival = useMemo(() => entranceVariants(
        { opacity: 0, x: -direction * (compact ? 16 : 24) },
        { duration: 0.45, delay: 0.1, ease: EASE },
    ), [compact, direction])
    const roleArrival = useMemo(() => entranceVariants(
        { opacity: 0, x: direction * (compact ? 16 : 24) },
        { duration: 0.45, delay: 0.14, ease: EASE },
    ), [compact, direction])
    const nextPhase = reduced ? 'settled' : nextArrival
    const connectionVariant = nextPhase === 'pending' ? 'hidden' : nextPhase === 'settled' ? 'settled' : 'show'

    useEffect(() => {
        if (artwork.phase === 'settled') onArrival(index, 'settled')
    }, [artwork.phase, index, onArrival])

    const finishStop = () => {
        artwork.finish()
        roles.finish()
        onArrival(index, 'settled')
    }

    return (
        <article
            className={`career-stop ${active ? 'is-active' : ''}`}
            aria-labelledby={`career-company-${index}`}
            data-next-arrival={last ? undefined : nextPhase}
            onFocusCapture={finishStop}
        >
            <div className="career-visual">
                {!last && (
                    <svg className="career-connection" viewBox="0 0 140 100" preserveAspectRatio="none" aria-hidden="true">
                        <path d="M70 0 C145 28 -5 70 70 100" className="career-connection-base" />
                        <motion.path
                            d="M70 0 C145 28 -5 70 70 100"
                            className="career-connection-lit"
                            initial={reduced ? false : 'hidden'}
                            animate={connectionVariant}
                            variants={connectionArrival}
                        />
                    </svg>
                )}
                <button
                    ref={artwork.ref}
                    type="button"
                    className="career-planet-button"
                    aria-pressed={active}
                    aria-label={`Highlight ${entry.company} in my career journey`}
                    onClick={onActivate}
                    onFocus={onActivate}
                >
                    <span className="career-planet-orbit" aria-hidden="true" />
                    <motion.span className="career-planet-body" style={{ y: reduced ? 0 : drift }}>
                        <motion.span
                            className="career-planet-arrival"
                            initial={artwork.reduced ? false : 'hidden'}
                            animate={artwork.variant}
                            variants={planetArrival}
                            onAnimationComplete={(definition) => { if (definition === 'show') artwork.complete() }}
                        >
                            <OrbitalPlanet tone={index === 0 ? 'moon' : 'violet'} ring={index === 1} />
                        </motion.span>
                    </motion.span>
                    <span className="career-planet-number" aria-hidden="true">0{index + 1}</span>
                </button>
                <div className="career-company">
                    <motion.div
                        className="career-company-copy"
                        initial={artwork.reduced ? false : 'hidden'}
                        animate={artwork.variant}
                        variants={companyArrival}
                    >
                        <h3 id={`career-company-${index}`}>{entry.company}</h3>
                        <p className="label">{entry.location}</p>
                    </motion.div>
                </div>
            </div>
            <div ref={roles.ref} className="career-role-list">
                <motion.div
                    className="career-role-copy"
                    initial={roles.reduced ? false : 'hidden'}
                    animate={roles.variant}
                    variants={roleArrival}
                    onAnimationComplete={(definition) => { if (definition === 'show') roles.complete() }}
                >
                    {entry.roles.map((role) => (
                        <div className="career-role" key={role.title}>
                            <p className="career-role-period">{role.period}</p>
                            <h4>{role.title}</h4>
                            <p className="career-role-description">{role.description}</p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </article>
    )
}

const Experience = () => {
    const route = useRef(null)
    const [active, setActive] = useState(0)
    const [arrivals, setArrivals] = useState(() => experiences.map(() => 'pending'))
    const reduced = useMediaQuery('(prefers-reduced-motion: reduce)', true)
    const { scrollYProgress } = useScroll({ target: route, offset: ['start 0.8', 'end 0.65'] })
    const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 24 })
    const recordArrival = useCallback((index, phase) => {
        setArrivals((current) => {
            if (current[index] === phase || current[index] === 'settled') return current
            return current.map((value, item) => item === index ? phase : value)
        })
    }, [])

    return (
        <Section id="experience" className="orbital-experience">
            <SectionHeading index={sectionIndex('experience')} eyebrow="Experience" title="Experience" />
            <div className="career-journey-meta">
                <span className="label">A connected journey</span>
                <span className="career-journey-count">02 destinations · 03 roles</span>
            </div>
            <div ref={route} className="career-route">
                {experiences.map((entry, index) => (
                    <CareerStop
                        key={entry.company}
                        entry={entry}
                        index={index}
                        active={active === index}
                        onActivate={() => setActive(index)}
                        onArrival={recordArrival}
                        nextArrival={arrivals[index + 1] ?? 'pending'}
                        progress={progress}
                        reduced={reduced}
                        last={index === experiences.length - 1}
                    />
                ))}
            </div>
        </Section>
    )
}

export default Experience

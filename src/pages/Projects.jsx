import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import { motion, useMotionValueEvent, useScroll, useTransform } from 'motion/react'
import { useLenis } from 'lenis/react'
import SectionHeading from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'
import ProjectWorld from '../components/ProjectWorld'
import Footer from '../components/Footer'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { sectionIndex } from '../data/nav'
import { projects } from '../data/projects'

const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(value, max))
const pad = (n) => String(n).padStart(2, '0')

const Heading = () => (
    <Reveal>
        <SectionHeading index={sectionIndex('projects')} eyebrow="Projects" title="Ideas in orbit." className="projects-heading" />
    </Reveal>
)

/** Reduced motion: the same cards in document order, then the contact footer. */
const ProjectsStack = () => (
    <>
        <section id="projects" className="project-section">
            <div className="project-section-heading"><Heading /></div>
            <div className="projects-stack">
                {projects.map((project, index) => <ProjectWorld key={project.title} project={project} index={index} />)}
            </div>
        </section>
        <Footer />
    </>
)

/**
 * The section pins for its full height. The first `travel` pixels of scroll
 * slide the cards sideways 1:1; the last viewport-height of scroll pulls the
 * camera back from the gallery and brings the contact footer forward.
 */
const ProjectsJourney = () => {
    const lenis = useLenis()
    const track = useRef(null)
    const pin = useRef(null)
    const row = useRef(null)
    const geometry = useRef({ travel: 0, zoom: 1, stops: [] })
    const [size, setSize] = useState(() => ({ travel: 0, zoom: typeof window === 'undefined' ? 800 : window.innerHeight }))
    const [current, setCurrent] = useState(0)
    const [outroActive, setOutroActive] = useState(false)

    useLayoutEffect(() => {
        const measure = () => {
            if (!pin.current || !row.current) return
            const width = pin.current.clientWidth
            const zoom = pin.current.clientHeight
            const travel = Math.max(0, row.current.scrollWidth - width)
            const stops = [...row.current.children].map((card) => (
                clamp(card.offsetLeft + card.offsetWidth / 2 - width / 2, 0, travel)
            ))
            geometry.current = { travel, zoom, stops }
            setSize((prev) => (prev.travel === travel && prev.zoom === zoom ? prev : { travel, zoom }))
        }
        measure()
        const observer = new ResizeObserver(measure)
        observer.observe(pin.current)
        observer.observe(row.current)
        document.fonts?.ready.then(measure)
        return () => observer.disconnect()
    }, [])

    const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] })
    // Transformers read the latest measurements from a ref, so a resize never
    // has to rebuild the motion graph.
    const scrolled = useTransform(scrollYProgress, (p) => p * (geometry.current.travel + geometry.current.zoom))
    const x = useTransform(scrolled, (s) => -Math.min(s, geometry.current.travel))
    const rail = useTransform(scrolled, (s) => geometry.current.travel ? clamp(s / geometry.current.travel) : 1)
    const zoom = useTransform(scrolled, (s) => clamp((s - geometry.current.travel) / geometry.current.zoom))
    const stageScale = useTransform(zoom, (z) => 1 - z * 0.5)
    const stageRadius = useTransform(zoom, (z) => z * 32)
    // Sequential, not a crossfade: the gallery is gone before the contact
    // layer is legible, so the two never read as a double exposure.
    const stageOpacity = useTransform(zoom, (z) => 1 - clamp((z - 0.15) / 0.35))
    const outroScale = useTransform(zoom, (z) => 1.2 - z * 0.2)
    const outroOpacity = useTransform(zoom, (z) => clamp((z - 0.45) / 0.45))

    useMotionValueEvent(scrolled, 'change', (s) => {
        const { stops, travel } = geometry.current
        const left = Math.min(s, travel)
        setCurrent(stops.reduce((best, stop, i) => (Math.abs(stop - left) < Math.abs(stops[best] - left) ? i : best), 0))
    })
    useMotionValueEvent(zoom, 'change', (z) => setOutroActive(z > 0.75))

    const scrollToOffset = useCallback((offset, immediate = false) => {
        if (!track.current) return
        const top = track.current.getBoundingClientRect().top + window.scrollY + offset
        if (lenis) lenis.scrollTo(top, { immediate, force: true, duration: 1.1 })
        else window.scrollTo({ top, behavior: immediate ? 'instant' : 'smooth' })
    }, [lenis])

    const goTo = (index) => scrollToOffset(geometry.current.stops[clamp(index, 0, projects.length - 1)] ?? 0)

    // Keyboard focus inside a card brings that card to the centre of the stage.
    const onCardFocus = (event) => {
        const card = event.target.closest('[data-project-index]')
        if (card) scrollToOffset(geometry.current.stops[Number(card.dataset.projectIndex)] ?? 0, true)
    }
    // Tabbing past the last card jumps to the end of the zoom so the links are visible.
    const onOutroFocus = () => {
        if (!outroActive) scrollToOffset(geometry.current.travel + geometry.current.zoom, true)
    }

    return (
        <section id="projects" ref={track} className="projects-track" style={{ height: `${size.zoom * 2 + size.travel}px` }}>
            <div ref={pin} className="projects-pin">
                <motion.div className="projects-stage" style={{ scale: stageScale, borderRadius: stageRadius, opacity: stageOpacity }}>
                    <div className="project-section-heading"><Heading /></div>
                    <motion.div ref={row} className="projects-row" style={{ x }} onFocusCapture={onCardFocus}>
                        {projects.map((project, index) => (
                            <div key={project.title} className="projects-card">
                                <ProjectWorld project={project} index={index} />
                            </div>
                        ))}
                    </motion.div>
                    <div className="project-gallery-controls">
                        <div className="project-gallery-position" aria-label={`Project ${current + 1} of ${projects.length}`}>
                            <span className="project-gallery-current">{pad(current + 1)}</span>
                            <span className="project-gallery-progress" aria-hidden="true"><motion.span style={{ scaleX: rail }} /></span>
                            <span>{pad(projects.length)}</span>
                        </div>
                        <div className="project-gallery-buttons">
                            <button type="button" onClick={() => goTo(current - 1)} disabled={current === 0} aria-label="Previous project"><span aria-hidden="true">←</span></button>
                            <button type="button" onClick={() => goTo(current + 1)} disabled={current === projects.length - 1} aria-label="Next project"><span aria-hidden="true">→</span></button>
                        </div>
                    </div>
                </motion.div>
                <motion.div
                    className="projects-outro"
                    data-active={outroActive}
                    style={{ scale: outroScale, opacity: outroOpacity }}
                    onFocusCapture={onOutroFocus}
                >
                    <Footer />
                </motion.div>
            </div>
        </section>
    )
}

const Projects = () => {
    const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
    return reduced ? <ProjectsStack /> : <ProjectsJourney />
}

export default Projects

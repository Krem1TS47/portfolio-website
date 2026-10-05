import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { animate, motion, useMotionValue } from 'motion/react'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { EASE, SPRING } from '../motion/presets'
import { entranceVariants, useEntrance } from './Reveal'
import ProjectWorld from './ProjectWorld'

const clamp = (value, min, max) => Math.max(min, Math.min(value, max))
const END_TOLERANCE = 2

/** The stationary card owns visibility; only its existing planet wrapper moves. */
const ProjectCard = ({ project, index, railRef, registerCard, lift }) => {
    const entrance = useEntrance({ clipRef: railRef })
    const assignRef = useCallback((element) => {
        entrance.ref.current = element
        registerCard(index, element)
    }, [entrance.ref, index, registerCard])

    useLayoutEffect(() => {
        const planet = entrance.ref.current?.querySelector('.project-world-planet')
        if (!planet) return
        const arriving = entrance.phase === 'arriving' && !entrance.reduced
        const pending = entrance.phase === 'pending' && !entrance.reduced
        // Preserve the scene's CSS opacity and the labels outside this wrapper.
        const controls = animate(planet, { y: pending ? lift : 0, scale: pending ? 0.84 : 1 }, {
            ...(arriving ? SPRING.soft : { duration: 0 }),
            onComplete: arriving ? entrance.complete : undefined,
        })
        return () => controls.stop()
    }, [entrance.ref, entrance.phase, entrance.reduced, entrance.complete, lift])

    return (
        <div ref={assignRef} className="project-rail-card" data-project-card={index} data-entrance={entrance.phase} onFocusCapture={entrance.finish}>
            <ProjectWorld project={project} index={index} />
        </div>
    )
}

/** Native sideways travel, with actual scrollLeft as the display's only source. */
const Gallery = ({ projects = [] }) => {
    const frameEntrance = useEntrance()
    const narrow = useMediaQuery('(max-width: 767px)')
    const rail = useRef(null)
    const cards = useRef([])
    const stops = useRef([])
    const overflowRef = useRef(0)
    const currentRef = useRef(0)
    const countRef = useRef(projects.length)
    const reducedRef = useRef(frameEntrance.reduced)
    const pending = useRef(null)
    const travelControls = useRef(null)
    const command = useRef(0)
    const settleTimer = useRef(null)
    const measureFrame = useRef(null)
    const measureRef = useRef(null)
    const measuredSize = useRef({ width: 0, scrollWidth: 0 })
    const suspendedSnap = useRef(null)
    const wheelTimer = useRef(null)
    const progress = useMotionValue(0)
    const [overflow, setOverflow] = useState(0)
    const [current, setCurrent] = useState(0)
    const [pendingIndex, setPendingIndex] = useState(null)
    const [ready, setReady] = useState(false)
    countRef.current = projects.length
    reducedRef.current = frameEntrance.reduced

    const registerCard = useCallback((index, element) => { cards.current[index] = element }, [])
    const nearestIndex = useCallback((position) => {
        const maximum = overflowRef.current
        if (!stops.current.length || maximum <= END_TOLERANCE) return 0
        const left = clamp(position, 0, maximum)
        if (left <= END_TOLERANCE) return 0
        if (maximum - left <= END_TOLERANCE) return stops.current.length - 1
        return stops.current.reduce((best, stop, index) => (
            Math.abs(stop - left) < Math.abs(stops.current[best] - left) ? index : best
        ), 0)
    }, [])

    const syncPosition = useCallback(() => {
        if (!rail.current) return
        const left = clamp(rail.current.scrollLeft, 0, overflowRef.current)
        progress.set(overflowRef.current > 0 ? left / overflowRef.current : 0)
        const index = nearestIndex(left)
        if (index !== currentRef.current) {
            currentRef.current = index
            setCurrent(index)
        }
    }, [nearestIndex, progress])

    const restoreSnap = useCallback(() => {
        clearTimeout(wheelTimer.current)
        if (suspendedSnap.current === null) return
        if (rail.current) rail.current.style.scrollSnapType = suspendedSnap.current
        suspendedSnap.current = null
    }, [])

    const suspendSnap = useCallback(() => {
        if (!rail.current) return
        if (suspendedSnap.current === null) suspendedSnap.current = rail.current.style.scrollSnapType
        rail.current.style.scrollSnapType = 'none'
    }, [])

    const cancelTravel = useCallback(({ freeze = true } = {}) => {
        const travelling = pending.current !== null
        command.current += 1
        travelControls.current?.stop()
        travelControls.current = null
        clearTimeout(settleTimer.current)
        clearTimeout(wheelTimer.current)
        pending.current = null
        setPendingIndex(null)
        if (freeze && travelling && rail.current) {
            // Snap must remain suspended at an interrupted partial position.
            // Restoring it here would move the rail before the next user intent.
            suspendSnap()
            rail.current.scrollTo({ left: rail.current.scrollLeft, behavior: 'instant' })
        }
        syncPosition()
    }, [suspendSnap, syncPosition])

    const settleTravel = useCallback((id) => {
        if (!pending.current || pending.current.id !== id || command.current !== id) return
        const destination = pending.current.left
        clearTimeout(settleTimer.current)
        pending.current = null
        travelControls.current?.stop()
        travelControls.current = null
        setPendingIndex(null)
        if (rail.current && Math.abs(rail.current.scrollLeft - destination) <= END_TOLERANCE) {
            rail.current.scrollTo({ left: destination, behavior: 'instant' })
            restoreSnap()
        }
        syncPosition()
    }, [restoreSnap, syncPosition])

    const scheduleSettlement = useCallback((id, delay = 180) => {
        clearTimeout(settleTimer.current)
        // The quiet-scroll fallback also handles interrupted or unavailable scrollend.
        settleTimer.current = setTimeout(() => settleTravel(id), delay)
    }, [settleTravel])

    const scheduleMeasure = useCallback(() => {
        if (measureFrame.current !== null) return
        measureFrame.current = requestAnimationFrame(() => {
            measureFrame.current = null
            measureRef.current?.()
        })
    }, [])

    const goTo = useCallback((index) => {
        const element = rail.current
        if (!element || !countRef.current || overflowRef.current <= END_TOLERANCE) return
        const destination = clamp(index, 0, countRef.current - 1)
        const left = stops.current[destination] ?? 0
        cancelTravel({ freeze: false })
        const id = command.current
        if (reducedRef.current || Math.abs(element.scrollLeft - left) <= END_TOLERANCE) {
            element.scrollTo({ left, behavior: 'instant' })
            restoreSnap()
            syncPosition()
            return
        }
        suspendSnap()
        pending.current = { id, index: destination, left }
        setPendingIndex(destination)
        // Owned numeric travel makes interruption deterministic. Native smooth
        // scrolling can keep a compositor frame alive after scrollTo(current).
        travelControls.current = animate(element.scrollLeft, left, {
            duration: 0.75,
            ease: EASE,
            onUpdate: (position) => {
                if (command.current !== id || pending.current?.id !== id) return
                element.scrollTo({ left: position, behavior: 'instant' })
                syncPosition()
            },
            onComplete: () => settleTravel(id),
        })
        scheduleSettlement(id, 300)
    }, [cancelTravel, restoreSnap, scheduleSettlement, settleTravel, suspendSnap, syncPosition])

    const advance = useCallback((direction) => {
        const base = pending.current?.index ?? nearestIndex(rail.current?.scrollLeft ?? 0)
        goTo(base + direction)
    }, [goTo, nearestIndex])

    useLayoutEffect(() => {
        const element = rail.current
        if (!element) return
        let alive = true
        const measure = () => {
            if (!alive) return
            const focused = document.activeElement?.closest('[data-project-index]')
            const preserve = focused && element.contains(focused)
                ? Number(focused.dataset.projectIndex) : currentRef.current
            cancelTravel()
            const maximum = Math.max(0, element.scrollWidth - element.clientWidth)
            const firstBounds = cards.current[0]?.getBoundingClientRect()
            const paddingLeft = parseFloat(getComputedStyle(element).paddingLeft) || 0
            const nextStops = cards.current.slice(0, projects.length).map((card, index) => {
                if (index === 0 || !card) return 0
                if (index === projects.length - 1) return maximum
                const cardBounds = card.getBoundingClientRect()
                // Relative card positions share the same camera offset. Adding
                // scrollLeft to viewport rectangles can mix compositor frames.
                const center = cardBounds.left - firstBounds.left + paddingLeft + cardBounds.width / 2
                return clamp(center - element.clientWidth / 2, 0, maximum)
            })
            const geometryChanged = element.clientWidth !== measuredSize.current.width
                || maximum !== overflowRef.current || nextStops.length !== stops.current.length
                || nextStops.some((stop, index) => Math.abs(stop - stops.current[index]) > END_TOLERANCE)
            stops.current = nextStops
            overflowRef.current = maximum
            measuredSize.current = { width: element.clientWidth, scrollWidth: element.scrollWidth }
            setOverflow(maximum)
            setReady(true)
            if (geometryChanged) {
                element.scrollTo({ left: nextStops[clamp(preserve, 0, Math.max(0, projects.length - 1))] ?? 0, behavior: 'instant' })
                restoreSnap()
            }
            syncPosition()
        }
        measureRef.current = measure
        measure()
        const observer = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(scheduleMeasure) : null
        observer?.observe(element)
        cards.current.slice(0, projects.length).forEach((card) => { if (card) observer?.observe(card) })
        window.addEventListener('resize', scheduleMeasure)
        window.visualViewport?.addEventListener('resize', scheduleMeasure)
        document.fonts?.ready.then(() => { if (alive) scheduleMeasure() })
        document.fonts?.addEventListener('loadingdone', scheduleMeasure)
        return () => {
            alive = false
            measureRef.current = null
            observer?.disconnect()
            window.removeEventListener('resize', scheduleMeasure)
            window.visualViewport?.removeEventListener('resize', scheduleMeasure)
            document.fonts?.removeEventListener('loadingdone', scheduleMeasure)
            cancelAnimationFrame(measureFrame.current)
            measureFrame.current = null
            command.current += 1
            pending.current = null
            travelControls.current?.stop()
            travelControls.current = null
            clearTimeout(settleTimer.current)
            restoreSnap()
        }
    }, [projects, cancelTravel, restoreSnap, scheduleMeasure, syncPosition])

    useLayoutEffect(() => {
        if (frameEntrance.reduced) cancelTravel()
    }, [frameEntrance.reduced, cancelTravel])

    useEffect(() => {
        const element = rail.current
        if (!element) return
        let touchOrigin = null
        const handleScroll = () => {
            // A resize can clamp scrollLeft before RO runs. Preserve the prior card.
            if (element.clientWidth !== measuredSize.current.width || element.scrollWidth !== measuredSize.current.scrollWidth) {
                scheduleMeasure()
                return
            }
            syncPosition()
            if (pending.current) scheduleSettlement(pending.current.id)
        }
        const handleScrollEnd = () => {
            const request = pending.current
            // A superseded smooth scroll can emit scrollend before its successor moves.
            if (request && Math.abs(element.scrollLeft - request.left) <= END_TOLERANCE) settleTravel(request.id)
        }
        const handleWheel = (event) => {
            if (event.ctrlKey) return
            cancelTravel()
            if (!event.shiftKey) {
                if (event.deltaX !== 0 && Math.abs(event.deltaX) >= Math.abs(event.deltaY)) restoreSnap()
                return
            }
            if (!event.cancelable || element.scrollWidth <= element.clientWidth) return
            const delta = Math.abs(event.deltaX) >= Math.abs(event.deltaY) && event.deltaX !== 0 ? event.deltaX : event.deltaY
            if (!delta) return
            const style = getComputedStyle(element)
            const line = parseFloat(style.lineHeight) || (parseFloat(style.fontSize) || 16) * 1.2
            const multiplier = event.deltaMode === 1 ? line : event.deltaMode === 2 ? element.clientWidth : 1
            event.preventDefault()
            suspendSnap()
            element.scrollTo({ left: element.scrollLeft + delta * multiplier, behavior: 'instant' })
            syncPosition()
            clearTimeout(wheelTimer.current)
            wheelTimer.current = setTimeout(restoreSnap, 140)
        }
        const handleTouchStart = (event) => {
            const touch = event.touches[0]
            touchOrigin = touch ? { x: touch.clientX, y: touch.clientY } : null
            cancelTravel()
        }
        const handleTouchMove = (event) => {
            const touch = event.touches[0]
            if (!touch || !touchOrigin) return
            if (Math.abs(touch.clientX - touchOrigin.x) > Math.abs(touch.clientY - touchOrigin.y)) {
                restoreSnap()
                touchOrigin = null
            }
        }
        const handlePageKey = (event) => {
            const ownsKey = event.target === element && !event.ctrlKey && !event.metaKey && !event.altKey
                && ['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)
            if (ownsKey || !['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) return
            const target = event.target instanceof Element ? event.target : null
            if (target?.isContentEditable || target?.closest('input, textarea, select')) return
            // Space activates a button rather than scrolling the page. Retain its
            // pending destination so rapid keyboard button presses can advance.
            if (event.key === ' ' && target?.closest('button, summary')) return
            cancelTravel()
        }
        const handleDocumentWheel = (event) => {
            if (!event.ctrlKey && !event.composedPath().includes(element)) cancelTravel()
        }
        const handleDocumentTouch = (event) => {
            if (event.composedPath().includes(element) || event.target.closest?.('.project-gallery-buttons')) return
            cancelTravel()
        }
        const supportsScrollEnd = 'onscrollend' in element
        element.addEventListener('scroll', handleScroll, { passive: true })
        if (supportsScrollEnd) element.addEventListener('scrollend', handleScrollEnd)
        element.addEventListener('wheel', handleWheel, { passive: false })
        element.addEventListener('touchstart', handleTouchStart, { passive: true })
        element.addEventListener('touchmove', handleTouchMove, { passive: true })
        window.addEventListener('keydown', handlePageKey, { capture: true })
        window.addEventListener('wheel', handleDocumentWheel, { passive: true })
        window.addEventListener('touchstart', handleDocumentTouch, { passive: true })
        return () => {
            element.removeEventListener('scroll', handleScroll)
            if (supportsScrollEnd) element.removeEventListener('scrollend', handleScrollEnd)
            element.removeEventListener('wheel', handleWheel)
            element.removeEventListener('touchstart', handleTouchStart)
            element.removeEventListener('touchmove', handleTouchMove)
            window.removeEventListener('keydown', handlePageKey, true)
            window.removeEventListener('wheel', handleDocumentWheel)
            window.removeEventListener('touchstart', handleDocumentTouch)
        }
    }, [cancelTravel, restoreSnap, scheduleMeasure, scheduleSettlement, settleTravel, suspendSnap, syncPosition])

    const handleFocus = (event) => {
        const card = event.target.closest('[data-project-index]')
        if (!card || !rail.current?.contains(card)) return
        cancelTravel()
        const left = stops.current[Number(card.dataset.projectIndex)] ?? 0
        rail.current.scrollTo({ left, behavior: 'instant' })
        restoreSnap()
        syncPosition()
    }

    const handleKeyDown = (event) => {
        if (event.target !== event.currentTarget || event.ctrlKey || event.metaKey || event.altKey) return
        if (event.key === 'ArrowRight') { event.preventDefault(); advance(1) }
        else if (event.key === 'ArrowLeft') { event.preventDefault(); advance(-1) }
        else if (event.key === 'Home') { event.preventDefault(); goTo(0) }
        else if (event.key === 'End') { event.preventDefault(); goTo(projects.length - 1) }
    }

    const canNavigate = ready && projects.length > 1 && overflow > END_TOLERANCE
    const navigationIndex = pendingIndex ?? current
    return (
        <div ref={frameEntrance.ref} className="project-gallery-native" onFocusCapture={frameEntrance.finish}>
            <motion.div className="project-gallery-frame" aria-hidden="true"
                initial="hidden" animate={frameEntrance.reduced ? 'settled' : frameEntrance.variant}
                variants={entranceVariants({ opacity: 0, x: narrow ? 24 : 48 }, { duration: 0.7, ease: EASE })}
                onAnimationComplete={(definition) => { if (definition === 'show') frameEntrance.complete() }} />
            <p className="project-gallery-hint" id="project-rail-hint">Swipe sideways, use your trackpad, or browse with the arrows.</p>
            <div ref={rail} className="project-rail" data-project-rail data-lenis-prevent-horizontal
                tabIndex={projects.length ? 0 : undefined} role="region" aria-label="Project gallery"
                aria-describedby="project-rail-hint" onKeyDown={handleKeyDown} onFocusCapture={handleFocus}
                onPointerDown={() => cancelTravel()}>
                {projects.length ? projects.map((project, index) => (
                    <ProjectCard key={project.title} project={project} index={index} railRef={rail}
                        registerCard={registerCard} lift={narrow ? 24 : 40} />
                )) : <p className="project-gallery-empty">No projects to explore yet.</p>}
            </div>
            <div className="project-gallery-controls" hidden={!projects.length}>
                <div className="project-gallery-position" aria-label={`Project ${current + 1} of ${projects.length}`}>
                    <span className="project-gallery-current">{String(current + 1).padStart(2, '0')}</span>
                    <span className="project-gallery-progress" aria-hidden="true" hidden={!canNavigate}><motion.span style={{ scaleX: progress }} /></span>
                    <span>{String(projects.length).padStart(2, '0')}</span>
                </div>
                <div className="project-gallery-buttons" hidden={!canNavigate}>
                    <button type="button" onClick={() => advance(-1)} disabled={navigationIndex === 0} aria-label="Previous project"><span aria-hidden="true">←</span></button>
                    <button type="button" onClick={() => advance(1)} disabled={navigationIndex === projects.length - 1} aria-label="Next project"><span aria-hidden="true">→</span></button>
                </div>
            </div>
        </div>
    )
}

export default Gallery

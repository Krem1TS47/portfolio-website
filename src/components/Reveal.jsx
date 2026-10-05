import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { EASE, VIEWPORT } from '../motion/presets'

/**
 * Reveal: fade + lift (+ optional blur) when the element scrolls into view.
 * RevealGroup / RevealItem: the same, staggered across children.
 * Under prefers-reduced-motion, MotionConfig collapses these to opacity only.
 */
export function Reveal({
    as = 'div',
    children,
    className,
    delay = 0,
    y = 24,
    blur = true,
    amount = VIEWPORT.amount,
    once = VIEWPORT.once,
    onFocusCapture,
    ...rest
}) {
    const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
    const [forced, setForced] = useState(reduced)
    useEffect(() => { if (reduced) setForced(true) }, [reduced])
    const observable = typeof IntersectionObserver !== 'undefined'
    const settled = reduced || forced || !observable
    const Tag = motion[as]
    const hidden = { opacity: 0, y: reduced ? 0 : y, ...(!reduced && blur ? { filter: 'blur(6px)' } : {}) }
    const shown = { opacity: 1, y: 0, filter: 'blur(0px)' }
    const final = { opacity: [1, 1], y: [0, 0], filter: ['blur(0px)', 'blur(0px)'], transition: { type: 'tween', duration: 0, delay: 0 } }
    return (
        <Tag
            className={className}
            initial={reduced ? false : hidden}
            animate={settled ? final : undefined}
            whileInView={observable ? (settled ? final : shown) : undefined}
            viewport={{ once, amount, margin: VIEWPORT.margin }}
            transition={{ duration: settled ? 0 : 0.75, ease: EASE, delay: settled ? 0 : delay }}
            {...rest}
            onFocusCapture={(event) => { setForced(true); onFocusCapture?.(event) }}
        >
            {children}
        </Tag>
    )
}

export function RevealGroup({
    as = 'div',
    children,
    className,
    stagger = 0.07,
    delay = 0.05,
    amount = VIEWPORT.amount,
    once = VIEWPORT.once,
    ...rest
}) {
    const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
    const Tag = motion[as]
    return (
        <Tag
            className={className}
            initial={reduced ? false : "hidden"}
            animate={reduced ? "show" : undefined}
            whileInView="show"
            viewport={{ once, amount, margin: VIEWPORT.margin }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: reduced ? 0 : stagger, delayChildren: reduced ? 0 : delay } } }}
            {...rest}
        >
            {children}
        </Tag>
    )
}

export function RevealItem({ as = 'div', children, className, y = 20, ...rest }) {
    const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
    const Tag = motion[as]
    return (
        <Tag
            className={className}
            animate={reduced ? "show" : undefined}
            variants={{
                hidden: { opacity: 0, y: reduced ? 0 : y },
                show: { opacity: 1, y: 0, transition: { duration: reduced ? 0 : 0.6, ease: EASE } },
            }}
            {...rest}
        >
            {children}
        </Tag>
    )
}

/** Once-only arrival measured against a stationary local wrapper. */
export function useEntrance({ enabled = true, clipRef, onEnter } = {}) {
    const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
    const ref = useRef(null)
    const [phase, setPhase] = useState(() => reduced ? 'settled' : 'pending')
    const phaseRef = useRef(phase)
    const onEnterRef = useRef(onEnter)
    const notified = useRef(false)
    const mounted = useRef(true)
    onEnterRef.current = onEnter

    const notify = useCallback(() => {
        if (notified.current) return
        notified.current = true
        onEnterRef.current?.()
    }, [])

    const finish = useCallback(() => {
        if (!mounted.current) return
        phaseRef.current = 'settled'
        setPhase('settled')
        notify()
    }, [notify])

    const complete = useCallback(() => {
        if (!mounted.current || phaseRef.current !== 'arriving') return
        phaseRef.current = 'settled'
        setPhase('settled')
    }, [])

    useEffect(() => {
        mounted.current = true
        return () => { mounted.current = false }
    }, [])

    // Consume even offscreen arrivals. Turning motion back on cannot replay them.
    useEffect(() => {
        if (reduced) finish()
    }, [reduced, finish])

    useEffect(() => {
        if (!enabled || phaseRef.current !== 'pending') return
        const element = ref.current
        if (!element) return
        if (typeof IntersectionObserver === 'undefined') {
            finish()
            return
        }

        let alive = true
        let candidate = false
        let frame = 0
        const check = () => {
            frame = 0
            if (!alive || !candidate || phaseRef.current !== 'pending') return
            const bounds = element.getBoundingClientRect()
            const viewportHeight = window.innerHeight
            const viewportWidth = document.documentElement.clientWidth
            if (![bounds.top, bounds.bottom, bounds.left, bounds.right, bounds.height].every(Number.isFinite)) {
                finish()
                return
            }
            if (bounds.height <= 0 || viewportHeight <= 0) return
            const clip = clipRef?.current?.getBoundingClientRect()
            const visibleHeight = Math.max(0, Math.min(bounds.bottom, viewportHeight, clip?.bottom ?? Infinity) - Math.max(bounds.top, 0, clip?.top ?? -Infinity))
            const visibleWidth = Math.max(0, Math.min(bounds.right, viewportWidth, clip?.right ?? Infinity) - Math.max(bounds.left, 0, clip?.left ?? -Infinity))
            const requiredHeight = Math.min(bounds.height * 0.2, viewportHeight * 0.15)
            if (visibleWidth <= 0 || visibleHeight + 0.5 < requiredHeight) return
            phaseRef.current = 'arriving'
            setPhase('arriving')
            notify()
        }
        const schedule = () => {
            if (alive && candidate && !frame && phaseRef.current === 'pending') frame = requestAnimationFrame(check)
        }
        const observer = new IntersectionObserver(([entry]) => {
            candidate = entry.isIntersecting
            schedule()
        }, { threshold: [0, 0.2, 1] })
        observer.observe(element)
        const resize = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(schedule) : null
        resize?.observe(element)
        if (clipRef?.current) resize?.observe(clipRef.current)
        // A tall wrapper may remain intersecting below the cap without another
        // IO threshold callback. Only pending candidates need these measurements.
        window.addEventListener('scroll', schedule, { passive: true, capture: true })
        window.addEventListener('resize', schedule, { passive: true })
        window.visualViewport?.addEventListener('resize', schedule)
        document.fonts?.ready.then(schedule)
        document.fonts?.addEventListener('loadingdone', schedule)
        return () => {
            alive = false
            observer.disconnect()
            resize?.disconnect()
            cancelAnimationFrame(frame)
            window.removeEventListener('scroll', schedule, true)
            window.removeEventListener('resize', schedule)
            window.visualViewport?.removeEventListener('resize', schedule)
            document.fonts?.removeEventListener('loadingdone', schedule)
        }
    }, [enabled, phase, clipRef, finish, notify])

    return {
        ref,
        phase,
        variant: phase === 'pending' ? 'hidden' : phase === 'arriving' ? 'show' : 'settled',
        reduced,
        consumed: phase !== 'pending',
        finish,
        complete,
    }
}

/** A distinct terminal target cancels Motion's delayed and running leaves. */
export function entranceVariants(from, transition = {}) {
    const target = Object.fromEntries(Object.keys(from).map((key) => [key,
        key === 'opacity' || key === 'scale' || key === 'scaleX' || key === 'scaleY' || key === 'pathLength'
            ? 1 : key === 'filter' ? 'blur(0px)' : 0,
    ]))
    return {
        hidden: from,
        show: { ...target, transition: { duration: 0.7, ease: EASE, ...transition } },
        // Scalar show -> keyframe settled deliberately changes the resolved
        // target. A transition-only change can leave an old animation running.
        settled: {
            ...Object.fromEntries(Object.entries(target).map(([key, value]) => [key, [value, value]])),
            transition: { type: 'tween', duration: 0, delay: 0 },
        },
    }
}

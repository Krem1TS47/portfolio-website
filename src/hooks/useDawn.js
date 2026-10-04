import { useEffect, useRef } from 'react'
import { useMotionValueEvent, useReducedMotion, useTransform } from 'motion/react'
import { dawn, DAWN_BAND, THEME_COLOR } from '../motion/dawn'

/**
 * Drives the night→day transition from the hero's scrollYProgress.
 * Reduced motion collapses the band to a step at 50%.
 */
export function useDawn(scrollYProgress) {
    const reduced = useReducedMotion()
    const phase = useRef('night')
    // Deterministic initial state before the first scroll event.
    useEffect(() => {
        if (!document.documentElement.dataset.dawn) document.documentElement.dataset.dawn = 'night'
    }, [])

    const t = useTransform(scrollYProgress, reduced ? [0.5, 0.5001] : DAWN_BAND, [0, 1], { clamp: true })

    useMotionValueEvent(t, 'change', (v) => {
        dawn.set(v)
        const root = document.documentElement
        root.style.setProperty('--dawn', v.toFixed(3))
        const next = v > 0.5 ? 'day' : 'night'
        if (next !== phase.current) {
            phase.current = next
            root.dataset.dawn = next
            document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLOR[next])
        }
    })
}

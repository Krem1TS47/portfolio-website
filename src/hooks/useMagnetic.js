import { useCallback, useEffect, useRef } from 'react'
import { useMotionValue, useSpring } from 'motion/react'
import { useMediaQuery } from './useMediaQuery'

/**
 * Magnetic pull towards the pointer. Returns spring-smoothed x/y motion
 * values plus pointer handlers to spread on the element. Inert on touch
 * devices and under prefers-reduced-motion.
 */
export function useMagnetic({ strength = 0.3, spring = { stiffness: 300, damping: 20, mass: 0.5 } } = {}) {
    const ref = useRef(null)
    const fine = useMediaQuery('(pointer: fine)')
    const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
    const enabled = useRef(false)
    const rawX = useMotionValue(0)
    const rawY = useMotionValue(0)
    const x = useSpring(rawX, spring)
    const y = useSpring(rawY, spring)

    useEffect(() => {
        enabled.current = fine && !reduced
        if (!enabled.current) { rawX.set(0); rawY.set(0) }
    }, [fine, reduced, rawX, rawY])

    const onPointerMove = useCallback((e) => {
        const el = ref.current
        if (!enabled.current || !el) return
        const r = el.getBoundingClientRect()
        rawX.set((e.clientX - (r.left + r.width / 2)) * strength)
        rawY.set((e.clientY - (r.top + r.height / 2)) * strength)
    }, [rawX, rawY, strength])

    const onPointerLeave = useCallback(() => {
        rawX.set(0)
        rawY.set(0)
    }, [rawX, rawY])

    return { ref, x, y, handlers: { onPointerMove, onPointerLeave } }
}

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react'
import { SPRING } from '../motion/presets'

const SIZE = { default: 28, link: 44, drag: 72, hidden: 0 }

/**
 * Custom cursor: a crisp dot that tracks the pointer and a lagging ring that
 * grows over links and becomes a "drag" badge over the planet / chips.
 * Mounted only for fine pointers without reduced-motion.
 */
const Cursor = () => {
    const [enabled, setEnabled] = useState(false)
    const [variant, setVariant] = useState('default')
    const [visible, setVisible] = useState(false)
    const variantRef = useRef('default')
    const x = useMotionValue(-100)
    const y = useMotionValue(-100)
    const rx = useSpring(x, { stiffness: 260, damping: 24, mass: 0.5 })
    const ry = useSpring(y, { stiffness: 260, damping: 24, mass: 0.5 })

    useEffect(() => {
        const ok =
            window.matchMedia('(pointer: fine)').matches &&
            !window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (!ok) return
        setEnabled(true)
        document.documentElement.classList.add('has-cursor')

        const resolve = (target) => {
            if (!(target instanceof Element)) return 'default'
            if (target.closest('input, textarea, select, [contenteditable]')) return 'hidden'
            const tagged = target.closest('[data-cursor]')
            if (tagged) return tagged.dataset.cursor
            if (target.closest('a, button, [role="button"], label')) return 'link'
            return 'default'
        }
        const onMove = (e) => {
            x.set(e.clientX)
            y.set(e.clientY)
            setVisible(true)
            const v = resolve(e.target)
            if (v !== variantRef.current) { variantRef.current = v; setVariant(v) }
        }
        const onLeave = () => setVisible(false)
        const onDown = () => document.documentElement.classList.add('cursor-down')
        const onUp = () => document.documentElement.classList.remove('cursor-down')
        window.addEventListener('pointermove', onMove, { passive: true })
        window.addEventListener('pointerdown', onDown, { passive: true })
        window.addEventListener('pointerup', onUp, { passive: true })
        document.documentElement.addEventListener('mouseleave', onLeave)
        return () => {
            window.removeEventListener('pointermove', onMove)
            window.removeEventListener('pointerdown', onDown)
            window.removeEventListener('pointerup', onUp)
            document.documentElement.removeEventListener('mouseleave', onLeave)
            document.documentElement.classList.remove('has-cursor')
        }
    }, [x, y])

    if (!enabled) return null
    const size = SIZE[variant] ?? SIZE.default
    const shown = visible && variant !== 'hidden'

    return (
        <>
            <motion.div
                aria-hidden="true"
                className="pointer-events-none fixed top-0 left-0 z-[70] w-1.5 h-1.5 -ml-[3px] -mt-[3px] rounded-full bg-fg mix-blend-difference"
                style={{ x, y, opacity: shown && variant !== 'drag' ? 1 : 0 }}
            />
            <motion.div
                aria-hidden="true"
                className="pointer-events-none fixed top-0 left-0 z-[70] rounded-full border border-fg/80 mix-blend-difference flex items-center justify-center overflow-hidden"
                style={{ x: rx, y: ry, translateX: '-50%', translateY: '-50%' }}
                animate={{
                    width: size,
                    height: size,
                    opacity: shown ? 1 : 0,
                    backgroundColor: variant === 'drag' ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0)',
                }}
                transition={SPRING.snappy}
            >
                <AnimatePresence>
                    {variant === 'drag' && (
                        <motion.span
                            key="drag"
                            className="font-mono text-[10px] uppercase tracking-[0.18em] text-fg"
                            initial={{ opacity: 0, scale: 0.7 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.7 }}
                            transition={{ duration: 0.18 }}
                        >
                            drag
                        </motion.span>
                    )}
                </AnimatePresence>
            </motion.div>
        </>
    )
}

export default Cursor

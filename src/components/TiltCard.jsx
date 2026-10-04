import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'

const finePointer = () =>
    window.matchMedia('(pointer: fine)').matches &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches

/**
 * 3D tilt + pointer spotlight. The spotlight is driven by CSS variables set
 * directly on the element (no React state per pointer move).
 */
const TiltCard = ({ as = 'article', children, className = '', maxTilt = 7, ...rest }) => {
    const ref = useRef(null)
    const mx = useMotionValue(0.5)
    const my = useMotionValue(0.5)
    const sx = useSpring(mx, { stiffness: 200, damping: 24, mass: 0.6 })
    const sy = useSpring(my, { stiffness: 200, damping: 24, mass: 0.6 })
    const rotateX = useTransform(sy, [0, 1], [maxTilt, -maxTilt])
    const rotateY = useTransform(sx, [0, 1], [-maxTilt * 1.2, maxTilt * 1.2])

    const onPointerMove = (e) => {
        const el = ref.current
        if (!el) return
        const r = el.getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width
        const y = (e.clientY - r.top) / r.height
        el.style.setProperty('--mx', `${x * 100}%`)
        el.style.setProperty('--my', `${y * 100}%`)
        if (!finePointer()) return
        mx.set(x)
        my.set(y)
    }

    const onPointerLeave = () => {
        mx.set(0.5)
        my.set(0.5)
    }

    const Tag = motion[as]
    return (
        <Tag
            ref={ref}
            onPointerMove={onPointerMove}
            onPointerLeave={onPointerLeave}
            style={{ rotateX, rotateY, transformPerspective: 1000 }}
            whileHover={{ scale: 1.015 }}
            transition={{ scale: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } }}
            className={`spotlight ${className}`}
            {...rest}
        >
            {children}
        </Tag>
    )
}

export default TiltCard

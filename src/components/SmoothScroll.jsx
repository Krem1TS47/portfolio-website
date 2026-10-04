import { useState } from 'react'
import { ReactLenis } from 'lenis/react'

const prefersReducedMotion = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Lenis inertial scrolling, skipped entirely for reduced-motion users. */
const SmoothScroll = ({ children }) => {
    const [reduced] = useState(prefersReducedMotion)
    if (reduced) return children
    return (
        <ReactLenis root options={{ lerp: 0.1, smoothWheel: true, anchors: false }}>
            {children}
        </ReactLenis>
    )
}

export default SmoothScroll

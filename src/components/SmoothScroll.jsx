import { ReactLenis } from 'lenis/react'
import { useMediaQuery } from '../hooks/useMediaQuery'

/** One document provider; the pinned Projects section reads the page scroll directly. */
const SmoothScroll = ({ children }) => {
    const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
    return (
        <ReactLenis root options={{ lerp: 0.1, smoothWheel: !reduced, anchors: false }}>
            {children}
        </ReactLenis>
    )
}

export default SmoothScroll

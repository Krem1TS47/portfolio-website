import { ReactLenis } from 'lenis/react'
import { useMediaQuery } from '../hooks/useMediaQuery'

// The rail adapter consumes only non-zoom Shift-wheel. Keep this predicate stable
// so the document engine never captures a render-specific gallery closure.
const allowDocumentWheel = ({ event }) => !(
    event.type === 'wheel' && event.shiftKey && !event.ctrlKey &&
    event.composedPath().some((node) => node instanceof HTMLElement && node.hasAttribute('data-project-rail'))
)

/** One document provider; native horizontal rails handle their own gestures. */
const SmoothScroll = ({ children }) => {
    const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
    return (
        <ReactLenis root options={{ lerp: 0.1, smoothWheel: !reduced, anchors: false, virtualScroll: allowDocumentWheel }}>
            {children}
        </ReactLenis>
    )
}

export default SmoothScroll

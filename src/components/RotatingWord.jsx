import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { EASE } from '../motion/presets'

/**
 * Cycles through `words`, blurring each one in and out. All words are laid
 * out invisibly in the same grid cell so the container never changes width.
 */
const RotatingWord = ({ words, interval = 2600, className = '' }) => {
    const [i, setI] = useState(0)

    useEffect(() => {
        const t = setInterval(() => setI((n) => (n + 1) % words.length), interval)
        return () => clearInterval(t)
    }, [words.length, interval])

    return (
        <span className={`relative inline-grid justify-items-start ${className}`} aria-live="polite">
            {words.map((w) => (
                <span key={w} aria-hidden="true" className="invisible [grid-area:1/1] whitespace-nowrap">
                    {w}
                </span>
            ))}
            <AnimatePresence mode="wait" initial={false}>
                <motion.span
                    key={words[i]}
                    className="[grid-area:1/1] whitespace-nowrap will-change-transform"
                    initial={{ opacity: 0, y: 14, filter: 'blur(8px)' }}
                    animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, y: -14, filter: 'blur(8px)' }}
                    transition={{ duration: 0.45, ease: EASE }}
                >
                    {words[i]}
                </motion.span>
            </AnimatePresence>
        </span>
    )
}

export default RotatingWord

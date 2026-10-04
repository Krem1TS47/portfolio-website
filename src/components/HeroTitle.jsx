import { useEffect, useState } from 'react'
import { motion } from 'motion/react'
import { EASE } from '../motion/presets'

const LINES = ['Benjamin', 'Ching']

/**
 * Letter-by-letter clip reveal of the name. Waits for the display font so
 * the glyphs don't swap mid-animation.
 */
const HeroTitle = ({ className = '' }) => {
    const [ready, setReady] = useState(false)

    useEffect(() => {
        let alive = true
        const fontsReady = document.fonts?.ready ?? Promise.resolve()
        fontsReady.then(() => alive && setReady(true))
        const fallback = setTimeout(() => alive && setReady(true), 1200)
        return () => { alive = false; clearTimeout(fallback) }
    }, [])

    let index = 0
    return (
        <h1 aria-label="Benjamin Ching" className={className}>
            {LINES.map((line) => (
                <span key={line} className="block overflow-hidden pb-[0.1em] -mb-[0.1em]">
                    {line.split('').map((ch, j) => {
                        const delay = 0.15 + index++ * 0.035
                        return (
                            <motion.span
                                key={j}
                                aria-hidden="true"
                                className="inline-block will-change-transform"
                                initial={{ y: '115%', rotate: 6 }}
                                animate={ready ? { y: 0, rotate: 0 } : undefined}
                                transition={{ duration: 0.95, ease: EASE, delay }}
                            >
                                {ch}
                            </motion.span>
                        )
                    })}
                </span>
            ))}
        </h1>
    )
}

export default HeroTitle

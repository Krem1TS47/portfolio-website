import { motion, useScroll, useSpring } from 'motion/react'

/** 2px page-progress bar along the top edge. */
const ScrollProgress = () => {
    const { scrollYProgress } = useScroll()
    const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 })
    return (
        <motion.div
            aria-hidden="true"
            style={{ scaleX }}
            className="chrome fixed top-0 left-0 right-0 h-0.5 origin-left z-50 bg-linear-to-r from-coral via-peach to-violet"
        />
    )
}

export default ScrollProgress

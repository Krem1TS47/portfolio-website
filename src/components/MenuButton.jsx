import { motion } from 'motion/react'
import { useMagnetic } from '../hooks/useMagnetic'
import { SPRING } from '../motion/presets'

const LINE = 'block h-0.5 w-6 rounded-full bg-fg origin-center'

/** Magnetic glass hamburger that morphs into a close icon. Floats above the sidebar. */
const MenuButton = ({ onClick, isOpen, buttonRef }) => {
    const { ref, x, y, handlers } = useMagnetic({ strength: 0.35 })

    const setRefs = (el) => {
        ref.current = el
        if (buttonRef) buttonRef.current = el
    }

    return (
        <motion.button
            ref={setRefs}
            style={{ x, y }}
            {...handlers}
            onClick={onClick}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            data-cursor="link"
            whileTap={{ scale: 0.92 }}
            className="chrome fixed top-5 left-5 md:top-7 md:left-7 z-[55] w-14 h-14 rounded-full glass glass-hover flex flex-col items-center justify-center gap-[6px]"
        >
            <motion.span
                className={LINE}
                animate={isOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                transition={SPRING.snappy}
            />
            <motion.span
                className={LINE}
                animate={{ opacity: isOpen ? 0 : 1, scaleX: isOpen ? 0.3 : 1 }}
                transition={{ duration: 0.2 }}
            />
            <motion.span
                className={LINE}
                animate={isOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                transition={SPRING.snappy}
            />
        </motion.button>
    )
}

export default MenuButton

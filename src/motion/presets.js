/** Shared motion vocabulary so every animation on the site feels related. */
export const EASE = [0.16, 1, 0.3, 1] // ease-out-expo

export const DUR = { fast: 0.35, base: 0.7, slow: 1.1 }

export const SPRING = {
    soft: { type: 'spring', stiffness: 120, damping: 20, mass: 0.8 },
    snappy: { type: 'spring', stiffness: 320, damping: 24 },
    panel: { type: 'spring', stiffness: 260, damping: 30 },
}

export const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0, transition: { duration: DUR.base, ease: EASE } },
}

export const stagger = (staggerChildren = 0.07, delayChildren = 0.05) => ({
    hidden: {},
    show: { transition: { staggerChildren, delayChildren } },
})

export const VIEWPORT = { once: true, amount: 0.2, margin: '0px 0px -10% 0px' }

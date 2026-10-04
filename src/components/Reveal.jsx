import { motion } from 'motion/react'
import { EASE, VIEWPORT } from '../motion/presets'

/**
 * Reveal: fade + lift (+ optional blur) when the element scrolls into view.
 * RevealGroup / RevealItem: the same, staggered across children.
 * Under prefers-reduced-motion, MotionConfig collapses these to opacity only.
 */
export function Reveal({
    as = 'div',
    children,
    className,
    delay = 0,
    y = 24,
    blur = true,
    amount = VIEWPORT.amount,
    once = VIEWPORT.once,
    ...rest
}) {
    const Tag = motion[as]
    const hidden = { opacity: 0, y, ...(blur ? { filter: 'blur(6px)' } : {}) }
    const shown = { opacity: 1, y: 0, ...(blur ? { filter: 'blur(0px)' } : {}) }
    return (
        <Tag
            className={className}
            initial={hidden}
            whileInView={shown}
            viewport={{ once, amount, margin: VIEWPORT.margin }}
            transition={{ duration: 0.75, ease: EASE, delay }}
            {...rest}
        >
            {children}
        </Tag>
    )
}

export function RevealGroup({
    as = 'div',
    children,
    className,
    stagger = 0.07,
    delay = 0.05,
    amount = VIEWPORT.amount,
    once = VIEWPORT.once,
    ...rest
}) {
    const Tag = motion[as]
    return (
        <Tag
            className={className}
            initial="hidden"
            whileInView="show"
            viewport={{ once, amount, margin: VIEWPORT.margin }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
            {...rest}
        >
            {children}
        </Tag>
    )
}

export function RevealItem({ as = 'div', children, className, y = 20, ...rest }) {
    const Tag = motion[as]
    return (
        <Tag
            className={className}
            variants={{
                hidden: { opacity: 0, y },
                show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
            }}
            {...rest}
        >
            {children}
        </Tag>
    )
}

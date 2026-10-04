import { motion, useTransform } from 'motion/react'
import { useMagnetic } from '../hooks/useMagnetic'

/** Glass link tile that leans toward the pointer; the icon leans a bit more. */
const MagneticTile = ({ href, external = false, label, value, icon, className = '' }) => {
    const { ref, x, y, handlers } = useMagnetic({ strength: 0.16 })
    const iconX = useTransform(x, (v) => v * 1.8)
    const iconY = useTransform(y, (v) => v * 1.8)

    return (
        <motion.a
            ref={ref}
            style={{ x, y }}
            {...handlers}
            href={href}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            whileTap={{ scale: 0.98 }}
            data-cursor="link"
            className={`glass glass-hover rounded-lg p-5 group block ${className}`}
        >
            <div className="flex items-center gap-4">
                <motion.span style={{ x: iconX, y: iconY }} className="text-coral">
                    {icon}
                </motion.span>
                <div className="min-w-0">
                    <p className="label mb-1.5 group-hover:text-coral transition-colors">{label}</p>
                    <span className="text-fg truncate block">{value}</span>
                </div>
                <svg
                    className="ml-auto w-4 h-4 text-fg-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                    fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-10 10M9 7h8v8" />
                </svg>
            </div>
        </motion.a>
    )
}

export default MagneticTile

import { useId } from 'react'
import { motion } from 'motion/react'

/**
 * Doric column: fluted shaft with slight entasis, echinus + abacus capital,
 * stylobate block. `lit` (MotionValue 0→1) fades in a gold-leaf overlay.
 * Scales uniformly with CSS height; width/height props define the viewBox.
 */
const DoricColumn = ({ height = 420, width = 64, flutes = 7, lit, className = '', style }) => {
    const id = useId()
    const capH = width * 0.42
    const baseH = width * 0.34
    const shaftTop = capH
    const shaftBottom = height - baseH
    const topW = width * 0.74
    const bottomW = width * 0.86
    const cx = width / 2
    const shaft = `M${cx - topW / 2} ${shaftTop} L${cx + topW / 2} ${shaftTop} L${cx + bottomW / 2} ${shaftBottom} L${cx - bottomW / 2} ${shaftBottom} Z`

    return (
        <svg
            aria-hidden="true"
            viewBox={`0 0 ${width} ${height}`}
            width={width}
            height={height}
            className={className}
            style={style}
            preserveAspectRatio="xMidYMax meet"
        >
            <defs>
                <linearGradient id={`${id}-shade`} x1="0" x2="1">
                    <stop offset="0" stopColor="oklch(97% 0.015 92)" />
                    <stop offset="0.35" stopColor="oklch(93% 0.012 90)" />
                    <stop offset="1" stopColor="oklch(78% 0.016 85)" />
                </linearGradient>
                <linearGradient id={`${id}-gold`} x1="0" x2="1">
                    <stop offset="0" stopColor="oklch(80% 0.08 85)" />
                    <stop offset="0.5" stopColor="oklch(92% 0.06 90)" />
                    <stop offset="1" stopColor="oklch(63% 0.09 85)" />
                </linearGradient>
            </defs>

            {/* stylobate */}
            <rect x={0} y={height - baseH} width={width} height={baseH} fill="oklch(90% 0.012 88)" />
            <rect x={0} y={height - baseH} width={width} height={baseH * 0.35} fill="oklch(95% 0.012 92)" />

            {/* shaft */}
            <path d={shaft} fill={`url(#${id}-shade)`} />
            {Array.from({ length: flutes }, (_, i) => {
                const t = (i + 0.5) / flutes
                const xTop = cx - topW / 2 + topW * t
                const xBot = cx - bottomW / 2 + bottomW * t
                return (
                    <g key={i}>
                        <line x1={xTop} y1={shaftTop + 2} x2={xBot} y2={shaftBottom - 2} stroke="oklch(70% 0.016 85 / 0.55)" strokeWidth={1.6} />
                        <line x1={xTop + 1.4} y1={shaftTop + 2} x2={xBot + 1.4} y2={shaftBottom - 2} stroke="oklch(100% 0 0 / 0.55)" strokeWidth={0.9} />
                    </g>
                )
            })}

            {/* capital: necking, echinus, abacus */}
            <rect x={cx - topW / 2} y={capH * 0.7} width={topW} height={capH * 0.08} fill="oklch(84% 0.014 86)" />
            <path
                d={`M${cx - topW / 2} ${capH * 0.7} Q ${cx - width / 2} ${capH * 0.62} ${cx - width / 2 + 1} ${capH * 0.34} L ${cx + width / 2 - 1} ${capH * 0.34} Q ${cx + width / 2} ${capH * 0.62} ${cx + topW / 2} ${capH * 0.7} Z`}
                fill="oklch(94% 0.012 90)"
            />
            <rect x={0} y={0} width={width} height={capH * 0.34} fill="oklch(96% 0.012 92)" />
            <rect x={0} y={capH * 0.3} width={width} height={capH * 0.05} fill="oklch(78% 0.016 85)" />

            {/* gold-leaf glow when lit */}
            {lit && (
                <motion.g style={{ opacity: lit }}>
                    <path d={shaft} fill={`url(#${id}-gold)`} opacity="0.55" />
                    <rect x={0} y={0} width={width} height={capH * 0.34} fill={`url(#${id}-gold)`} opacity="0.75" />
                </motion.g>
            )}
        </svg>
    )
}

export default DoricColumn

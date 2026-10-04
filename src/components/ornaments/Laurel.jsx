/** Point and tangent on a quadratic Bézier. */
const quad = (p0, p1, p2, t) => {
    const mt = 1 - t
    const x = mt * mt * p0[0] + 2 * mt * t * p1[0] + t * t * p2[0]
    const y = mt * mt * p0[1] + 2 * mt * t * p1[1] + t * t * p2[1]
    const dx = 2 * mt * (p1[0] - p0[0]) + 2 * t * (p2[0] - p1[0])
    const dy = 2 * mt * (p1[1] - p0[1]) + 2 * t * (p2[1] - p1[1])
    return { x, y, angle: (Math.atan2(dy, dx) * 180) / Math.PI }
}

/**
 * Procedural laurel branch: leaves alternate along a gentle arc.
 * Uses currentColor; set `text-laurel` / `text-gold-500` on it.
 */
export const LaurelBranch = ({ length = 160, leaves = 9, flip = false, className = '', style }) => {
    const p0 = [0, 40], p1 = [length * 0.5, -10], p2 = [length, 24]
    const stem = `M${p0} Q${p1} ${p2}`
    return (
        <svg
            aria-hidden="true"
            viewBox={`-6 -24 ${length + 12} 80`}
            width={length + 12}
            height={80}
            className={className}
            style={{ ...(flip ? { transform: 'scaleX(-1)' } : null), ...style }}
        >
            <path d={stem} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.85" />
            {Array.from({ length: leaves }, (_, i) => {
                const t = 0.08 + (0.88 * i) / (leaves - 1)
                const { x, y, angle } = quad(p0, p1, p2, t)
                const side = i % 2 === 0 ? -1 : 1
                const size = 14 + 6 * Math.sin(Math.PI * t)
                return (
                    <g key={i} transform={`translate(${x} ${y}) rotate(${angle + side * 48})`}>
                        <path
                            d={`M0 0 Q ${size * 0.45} ${-size * 0.5} ${size} 0 Q ${size * 0.45} ${size * 0.5} 0 0 Z`}
                            fill="currentColor"
                            opacity={0.92 - 0.02 * i}
                        />
                        <path d={`M0 0 L ${size} 0`} stroke="oklch(100% 0 0 / 0.35)" strokeWidth="0.8" />
                    </g>
                )
            })}
        </svg>
    )
}

export const LaurelWreath = ({ size = 220, className = '' }) => (
    <div aria-hidden="true" className={`inline-flex items-end justify-center gap-0 ${className}`} style={{ width: size }}>
        <LaurelBranch length={size * 0.46} leaves={8} style={{ transform: 'rotate(-20deg)' }} />
        <LaurelBranch length={size * 0.46} leaves={8} flip style={{ transform: 'scaleX(-1) rotate(-20deg)' }} />
    </div>
)

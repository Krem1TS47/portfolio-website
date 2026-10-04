/**
 * Concentric dotted "signal" rings, as behind the golden pear in the reference.
 */
const DottedRings = ({ size = 480, rings = 7, className = '', style }) => {
    const r0 = size / 2
    return (
        <svg aria-hidden="true" viewBox={`0 0 ${size} ${size}`} width={size} height={size} className={className} style={style}>
            {Array.from({ length: rings }, (_, i) => {
                const r = r0 * (0.28 + (0.7 * i) / (rings - 1))
                const dots = Math.round((2 * Math.PI * r) / 11)
                const dash = (2 * Math.PI * r) / dots
                return (
                    <circle
                        key={i}
                        cx={r0}
                        cy={r0}
                        r={r}
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.4 - i * 0.15}
                        strokeLinecap="round"
                        strokeDasharray={`0 ${dash}`}
                        opacity={0.9 - i * 0.09}
                    />
                )
            })}
        </svg>
    )
}

export default DottedRings

import { useId } from 'react'

const SHAPES = [
    'M30 120 C 10 120 0 100 12 86 C 4 66 24 50 44 58 C 50 30 92 22 108 48 C 126 36 160 44 164 70 C 190 70 200 100 184 116 C 180 128 160 130 150 122 C 130 136 90 134 74 122 C 60 132 36 132 30 120 Z',
    'M20 110 C 0 108 2 84 20 80 C 18 58 44 46 62 58 C 72 30 118 26 132 52 C 150 42 176 54 174 76 C 194 78 196 104 178 110 C 168 124 140 122 128 114 C 108 126 72 126 56 114 C 44 122 26 120 20 110 Z',
]

/**
 * Ben-Day / halftone cloud, as in the reference: a cloud blob filled with a
 * dot screen that thins toward the edges. Pure SVG; one per instance.
 */
const HalftoneCloud = ({ width = 240, variant = 0, className = '', style }) => {
    const id = useId()
    const d = SHAPES[variant % SHAPES.length]
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 200 140"
            width={width}
            height={(width * 140) / 200}
            className={className}
            style={style}
        >
            <defs>
                <pattern id={`${id}-dots`} patternUnits="userSpaceOnUse" width="5" height="5">
                    <circle cx="2.5" cy="2.5" r="1.35" fill="currentColor" />
                </pattern>
                <radialGradient id={`${id}-fade`} cx="50%" cy="55%" r="55%">
                    <stop offset="0.45" stopColor="#fff" stopOpacity="1" />
                    <stop offset="1" stopColor="#fff" stopOpacity="0.15" />
                </radialGradient>
                <mask id={`${id}-mask`}>
                    <rect width="200" height="140" fill={`url(#${id}-fade)`} />
                </mask>
            </defs>
            <path d={d} fill="currentColor" opacity="0.18" />
            <path d={d} fill={`url(#${id}-dots)`} mask={`url(#${id}-mask)`} />
        </svg>
    )
}

export default HalftoneCloud

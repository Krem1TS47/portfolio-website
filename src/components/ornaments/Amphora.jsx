import { useId } from 'react'
import MeanderStrip from './Meander'

const BODY =
    'M70 30 L80 36 L80 70 C60 80 30 100 28 150 C26 200 60 240 78 268 L70 285 L130 285 L122 268 C140 240 174 200 172 150 C170 100 140 80 120 70 L120 36 L130 30 Z'

/**
 * Black-figure amphora silhouette (viewBox 0 0 200 300). `children` are
 * clipped to the figure band on the belly. `variant="outline"` for hairlines.
 */
const Amphora = ({ variant = 'solid', className = '', style, children }) => {
    const id = useId()
    if (variant === 'outline') {
        return (
            <svg aria-hidden="true" viewBox="0 0 200 300" className={className} style={style}>
                <path d={BODY} fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M80 44 C50 44 40 70 56 104" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                <path d="M120 44 C150 44 160 70 144 104" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
            </svg>
        )
    }
    return (
        <svg viewBox="0 0 200 300" className={className} style={style}>
            <defs>
                <linearGradient id={`${id}-clay`} x1="0" x2="1">
                    <stop offset="0" stopColor="oklch(62% 0.12 45)" />
                    <stop offset="0.45" stopColor="oklch(56% 0.13 40)" />
                    <stop offset="1" stopColor="oklch(40% 0.1 35)" />
                </linearGradient>
                <clipPath id={`${id}-body`}>
                    <path d={BODY} />
                </clipPath>
                <clipPath id={`${id}-band`}>
                    <rect x="20" y="112" width="160" height="96" />
                </clipPath>
            </defs>
            {/* handles */}
            <path d="M80 44 C50 44 40 70 56 104" fill="none" stroke="oklch(24% 0.02 40)" strokeWidth="9" strokeLinecap="round" />
            <path d="M120 44 C150 44 160 70 144 104" fill="none" stroke="oklch(24% 0.02 40)" strokeWidth="9" strokeLinecap="round" />
            {/* body */}
            <path d={BODY} fill={`url(#${id}-clay)`} />
            <g clipPath={`url(#${id}-body)`}>
                {/* black glaze: neck, foot */}
                <rect x="0" y="30" width="200" height="42" fill="oklch(22% 0.02 40)" />
                <rect x="0" y="236" width="200" height="60" fill="oklch(22% 0.02 40)" />
                {/* figure band */}
                <rect x="0" y="108" width="200" height="104" fill="oklch(22% 0.02 40)" />
                <foreignObject x="0" y="96" width="200" height="12">
                    <div xmlns="http://www.w3.org/1999/xhtml" style={{ color: 'oklch(22% 0.02 40)' }}>
                        <MeanderStrip height={12} />
                    </div>
                </foreignObject>
                <foreignObject x="0" y="212" width="200" height="12">
                    <div xmlns="http://www.w3.org/1999/xhtml" style={{ color: 'oklch(22% 0.02 40)' }}>
                        <MeanderStrip height={12} />
                    </div>
                </foreignObject>
                <g clipPath={`url(#${id}-band)`} style={{ color: 'oklch(62% 0.12 45)' }}>
                    {children}
                </g>
                {/* highlight */}
                <path d={BODY} fill="url(#none)" />
                <ellipse cx="74" cy="150" rx="18" ry="70" fill="oklch(100% 0 0 / 0.12)" />
            </g>
            <path d={BODY} fill="none" stroke="oklch(18% 0.02 40 / 0.5)" strokeWidth="1.5" />
        </svg>
    )
}

export default Amphora

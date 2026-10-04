import { useId } from 'react'

/** Horizontal Greek-key strip that repeats across its width. */
const MeanderStrip = ({ height = 12, className = '', style }) => {
    const id = useId()
    return (
        <svg aria-hidden="true" width="100%" height={height} className={className} style={style}>
            <defs>
                <pattern id={id} patternUnits="userSpaceOnUse" width={height} height={height} viewBox="0 0 12 12">
                    <path d="M1.5 10.5 V1.5 H10.5 V7.5 H5.5 V5.5 H8.5 V3.5 H3.5 V10.5 H10.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill={`url(#${id})`} />
        </svg>
    )
}

export default MeanderStrip

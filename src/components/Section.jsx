const WIDTHS = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
}

/**
 * Page section with its own scroll anchor and a centred content column.
 * Sections size to their content; vertical rhythm comes from `py-section`.
 * `background` renders full-bleed behind the content column.
 */
const Section = ({ id, size = 'lg', className = '', innerClassName = '', background = null, children }) => (
    <section id={id} className={`relative scroll-mt-8 px-6 md:px-8 py-section ${className}`}>
        {background}
        <div className={`relative z-10 mx-auto w-full ${WIDTHS[size]} ${innerClassName}`}>
            {children}
        </div>
    </section>
)

export default Section

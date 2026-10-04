/**
 * Mono eyebrow + serif title + optional lede, finished with a fading hairline.
 */
const SectionHeading = ({ index, eyebrow, title, lede, className = '' }) => (
    <header className={`mb-12 md:mb-16 ${className}`}>
        {(index || eyebrow) && (
            <p className="label mb-5 flex items-center gap-3">
                {index && <span className="text-coral">{index}</span>}
                {index && eyebrow && <span aria-hidden="true" className="h-px w-6 bg-line-strong" />}
                {eyebrow && <span>{eyebrow}</span>}
            </p>
        )}
        <h2 className="font-display text-h2 text-fg">{title}</h2>
        {lede && <p className="mt-5 max-w-2xl text-lg text-fg-2">{lede}</p>}
        <div aria-hidden="true" className="mt-8 h-px w-full bg-linear-to-r from-line-strong via-line to-transparent" />
    </header>
)

export default SectionHeading

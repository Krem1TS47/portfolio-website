import TiltCard from './TiltCard'
import Amphora from './ornaments/Amphora'

/**
 * One project as a museum piece: a Greek-key frame around a recessed, lit
 * panel holding an amphora (or a supplied image), with a placard below.
 */
const Artwork = ({ project, index, className = '' }) => {
    const accession = `${project.year}.${String(index + 1).padStart(2, '0')}`
    const initial = project.title.trim().charAt(0).toUpperCase()

    return (
        <TiltCard
            maxTilt={4}
            className={`relative shrink-0 w-[min(88vw,460px)] rounded-[6px] ${className}`}
            aria-labelledby={`art-${index}-title`}
        >
            {/* frame */}
            <div className="meander marble-dark rounded-[6px] p-3" style={{ boxShadow: '0 30px 60px -30px oklch(20% 0.03 60 / 0.6), inset 0 1px 0 oklch(100% 0 0 / 0.6)' }}>
                <div
                    className="relative aspect-[4/5] overflow-hidden rounded-[2px]"
                    style={{
                        background: 'linear-gradient(180deg, oklch(90% 0.012 88) 0%, oklch(86% 0.014 85) 100%)',
                        boxShadow: 'inset 0 10px 30px -10px oklch(0% 0 0 / 0.45), inset 0 -6px 16px -10px oklch(0% 0 0 / 0.25)',
                    }}
                >
                    {/* spotlight from above */}
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 pointer-events-none"
                        style={{ background: 'radial-gradient(60% 58% at 50% -6%, color-mix(in oklch, var(--color-gold-300) 55%, transparent), transparent 70%)' }}
                    />
                    {/* subject */}
                    {project.art?.src ? (
                        <img
                            src={project.art.src}
                            alt={project.art.alt ?? `${project.title} artwork`}
                            className="absolute inset-x-[10%] bottom-[12%] h-[76%] w-[80%] object-contain drop-shadow-[0_24px_24px_oklch(0%_0_0/0.35)]"
                            loading="lazy"
                            decoding="async"
                        />
                    ) : (
                        <Amphora className="absolute left-1/2 bottom-[11%] h-[76%] -translate-x-1/2 drop-shadow-[0_26px_22px_oklch(0%_0_0/0.4)]">
                            <text
                                x="100"
                                y="178"
                                textAnchor="middle"
                                fill="currentColor"
                                style={{ fontFamily: 'var(--font-inscription)', fontSize: 64, fontWeight: 700 }}
                            >
                                {initial}
                            </text>
                        </Amphora>
                    )}
                    {/* floor */}
                    <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[12%]" style={{ background: 'linear-gradient(180deg, oklch(80% 0.016 85), oklch(74% 0.018 80))', boxShadow: 'inset 0 1px 0 oklch(100% 0 0 / 0.5)' }} />
                    <div aria-hidden="true" className="absolute left-1/2 bottom-[9%] h-3 w-[46%] -translate-x-1/2 rounded-[100%] blur-md" style={{ background: 'oklch(0% 0 0 / 0.35)' }} />
                </div>
            </div>

            {/* placard */}
            <div className="paper marble parchment relative mt-4 rounded-[3px] border border-line-strong px-5 py-4" style={{ boxShadow: 'inset 0 1px 0 oklch(100% 0 0 / 0.8), 0 14px 30px -20px oklch(25% 0.04 80 / 0.5)' }}>
                <div className="flex items-baseline justify-between gap-3">
                    <h3 id={`art-${index}-title`} className="font-display text-3xl text-fg">{project.title}</h3>
                    <span className="font-mono text-[0.65rem] tracking-wider text-fg-3">{accession}</span>
                </div>
                <p className="inscription engraved text-[0.62rem] tracking-[0.24em] mt-1.5">
                    {project.year} · {project.organization}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-fg-2">{project.description}</p>
                <p className="mt-3 text-[0.75rem] text-fg-3">
                    <span className="inscription text-[0.58rem] tracking-[0.22em] mr-2">Materials</span>
                    {project.highlights.join(' · ')}
                </p>
                <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cursor="link"
                    className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-coral hover:text-coral-hot transition-colors group/link"
                >
                    View the piece
                    <svg className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-10 10M9 7h8v8" />
                    </svg>
                </a>
            </div>
        </TiltCard>
    )
}

export default Artwork

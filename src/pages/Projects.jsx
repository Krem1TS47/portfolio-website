import Section from '../components/Section'
import SectionHeading from '../components/SectionHeading'
import { Reveal, RevealGroup, RevealItem } from '../components/Reveal'
import TiltCard from '../components/TiltCard'
import { projects } from '../data/projects'

const Projects = () => (
    <Section id="projects">
        <Reveal><SectionHeading index="06" eyebrow="Projects" title="Projects" /></Reveal>

        <RevealGroup className="grid gap-8 lg:grid-cols-2" stagger={0.1}>
            {projects.map((project, i) => (
                <RevealItem key={project.title} y={32}>
                <TiltCard className={`relative overflow-hidden glass glass-hover rounded-2xl p-8 md:p-10 h-full ${i === 0 ? 'gradient-border' : ''}`}>
                    {/* Nebula wash */}
                    <div
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-0 opacity-40 mix-blend-screen blur-3xl bg-[radial-gradient(circle_at_25%_25%,oklch(74%_0.16_30_/_0.25),transparent_55%),radial-gradient(circle_at_70%_0%,oklch(70%_0.14_300_/_0.3),transparent_55%),radial-gradient(circle_at_50%_90%,oklch(86%_0.08_60_/_0.25),transparent_65%)]"
                    />
                    <div className="relative space-y-5">
                        <div className="flex items-center justify-between label">
                            <span>/{project.year}</span>
                            <span className="normal-case italic font-display text-sm tracking-normal text-fg-3">
                                {project.organization}
                            </span>
                        </div>
                        <h3 className="font-display text-4xl md:text-5xl text-fg">
                            {project.title}
                        </h3>
                        <p className="text-fg-2 leading-relaxed">
                            {project.description}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {project.highlights.map((highlight) => (
                                <span
                                    key={highlight}
                                    className="px-3 py-1.5 label rounded-full border border-line bg-fg/5 text-fg-2"
                                >
                                    {highlight}
                                </span>
                            ))}
                        </div>
                        <a
                            href={project.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-cursor="link"
                            className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-full border border-line-strong bg-fg/5 text-fg hover:bg-fg/10 hover:border-coral/60 transition-colors duration-300"
                        >
                            View Repository
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-10 10M9 7h8v8" />
                            </svg>
                        </a>
                    </div>
                </TiltCard>
                </RevealItem>
            ))}
        </RevealGroup>
    </Section>
)

export default Projects

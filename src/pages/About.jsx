import Section from '../components/Section'
import SectionHeading from '../components/SectionHeading'
import { Reveal, RevealGroup, RevealItem } from '../components/Reveal'
import MarbleBust from '../components/MarbleBust'
import Stele from '../components/ornaments/Stele'
import { sectionIndex } from '../data/nav'
import profilePhoto from '../data/benphoto.webp'

const interests = [
    'Data Engineering',
    'Web Development',
    'Data Analytics',
    'Machine Learning/Models',
    'Software Engineering'
]

const About = () => (
    <Section id="about">
        <Reveal><SectionHeading index={sectionIndex('about')} eyebrow="About" title="About Me" /></Reveal>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Statue */}
            <Reveal y={40} className="order-2 md:order-1 flex justify-center">
                <MarbleBust image={profilePhoto} alt="Benjamin Ching, rendered as a marble bust" />
            </Reveal>

            {/* Museum label */}
            <RevealGroup className="order-1 md:order-2" stagger={0.1}>
                <RevealItem>
                    <Stele className="px-7 py-8 md:px-9 md:py-10 space-y-6">
                        <p className="inscription engraved text-[0.68rem] flex items-center gap-3">
                            <span>Portrait</span>
                            <span aria-hidden="true" className="h-px w-5 bg-gold-700/60" />
                            <span>Vancouver, BC</span>
                            <span aria-hidden="true" className="h-px w-5 bg-gold-700/60" />
                            <span>2026</span>
                        </p>

                        <p className="text-lg md:text-xl text-fg leading-relaxed">
                            Hello! I'm <span className="text-coral font-medium">Ben</span>, an honours CS student at UBC.
                            I'm deeply interested about a few things, so here's a list:
                        </p>

                        <ul className="space-y-2">
                            {interests.map((item) => (
                                <li key={item} className="flex items-center gap-3 text-lg text-fg-2">
                                    <span aria-hidden="true" className="w-1.5 h-1.5 rotate-45 gold-leaf shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <p className="text-lg md:text-xl text-fg-2 leading-relaxed">
                            Outside of school, you can definitely find me doing something related to volleyball. Whether it is coaching, playing in a tournament, or just watching a game, I have always been passionate about the sport and love being involved in it.
                        </p>

                        <a
                            href="https://www.youtube.com/playlist?list=PLEXApHNWlv1qZ1Ec31SyigL9a6jZVVLAK"
                            target="_blank"
                            rel="noopener noreferrer"
                            data-cursor="link"
                            className="inline-flex items-center gap-2 text-coral hover:text-coral-hot transition-colors duration-200 group"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                            <span className="text-lg group-hover:underline underline-offset-4">
                                Watch my volleyball highlights
                            </span>
                            <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </a>
                    </Stele>
                </RevealItem>
            </RevealGroup>
        </div>
    </Section>
)

export default About

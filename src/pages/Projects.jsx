import Section from '../components/Section'
import SectionHeading from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'
import Gallery from '../components/Gallery'
import { sectionIndex } from '../data/nav'
import { projects } from '../data/projects'

const Projects = () => (
    <>
        <Section id="projects" className="!pb-6">
            <Reveal>
                <SectionHeading
                    index={sectionIndex('projects')}
                    eyebrow="Projects"
                    title="Projects"
                    lede="A small museum of things I've built. Each piece has its placard."
                />
            </Reveal>
        </Section>
        <Gallery projects={projects} />
    </>
)

export default Projects

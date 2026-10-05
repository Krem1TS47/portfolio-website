import SectionHeading from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'
import Gallery from '../components/Gallery'
import { sectionIndex } from '../data/nav'
import { projects } from '../data/projects'

const Projects = () => (
    <section id="projects" className="project-section">
        <div className="project-section-heading">
            <Reveal>
                <SectionHeading
                    index={sectionIndex('projects')}
                    eyebrow="Projects"
                    title="Ideas in orbit."
                    lede="Five projects, each a different world. A journey through the things I've built."
                />
            </Reveal>
        </div>
        <Gallery projects={projects} />
    </section>
)

export default Projects

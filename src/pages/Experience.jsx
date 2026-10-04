import Section from '../components/Section'
import SectionHeading from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'
import Stoa from '../components/Stoa'
import { sectionIndex } from '../data/nav'
import { experiences } from '../data/experience'

const Experience = () => (
    <Section id="experience" size="md">
        <Reveal><SectionHeading index={sectionIndex('experience')} eyebrow="Experience" title="Experience" /></Reveal>
        <Reveal blur={false} y={32} amount={0.1}>
            <Stoa entries={experiences} />
        </Reveal>
    </Section>
)

export default Experience

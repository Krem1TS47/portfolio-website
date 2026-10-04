import Section from '../components/Section'
import SectionHeading from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'
import Timeline from '../components/Timeline'
import { experiences } from '../data/experience'

const Experience = () => (
    <Section id="experience" size="md">
        <Reveal><SectionHeading index="04" eyebrow="Experience" title="Experience" /></Reveal>
        <Reveal blur={false} y={32} amount={0.1}>
            <Timeline entries={experiences} />
        </Reveal>
    </Section>
)

export default Experience

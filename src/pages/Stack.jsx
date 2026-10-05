import Section from '../components/Section'
import SectionHeading from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'
import ConstellationMap from '../components/ConstellationMap'
import { sectionIndex } from '../data/nav'
import { stackCategories } from '../data/stack'

const Stack = () => (
    <Section id="stack" className="constellation-section">
        <Reveal>
            <SectionHeading
                index={sectionIndex('stack')}
                eyebrow="The constellation"
                title="A connected skillset."
                lede="Languages, frameworks, data, and tools. Twenty-nine points in a connected sky."
            />
        </Reveal>
        <ConstellationMap categories={stackCategories} />
    </Section>
)

export default Stack

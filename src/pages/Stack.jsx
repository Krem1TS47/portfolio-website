import Section from '../components/Section'
import SectionHeading from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'
import ChipField from '../components/ChipField'
import { stackCategories } from '../data/stack'

const Stack = () => (
    <Section id="stack">
        <Reveal>
            <SectionHeading
                index="05"
                eyebrow="Stack"
                title="My Stack"
                lede="Languages, frameworks and tools I reach for. On desktop, grab a chip and throw it."
            />
        </Reveal>
        <Reveal blur={false} y={32}>
            <ChipField categories={stackCategories} />
        </Reveal>
    </Section>
)

export default Stack

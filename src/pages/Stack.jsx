import Section from '../components/Section'
import SectionHeading from '../components/SectionHeading'
import { Reveal } from '../components/Reveal'
import PearTree from '../components/PearTree'
import StackGrove from '../components/StackGrove'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { sectionIndex } from '../data/nav'
import { stackCategories } from '../data/stack'

const Stack = () => {
    const wide = useMediaQuery('(min-width: 768px)')
    return (
        <Section id="stack">
            <Reveal>
                <SectionHeading
                    index={sectionIndex('stack')}
                    eyebrow="Stack"
                    title="My Stack"
                    lede="Four branches, twenty-nine pears. Hover or tab through the orchard."
                />
            </Reveal>
            {wide ? <PearTree categories={stackCategories} /> : <Reveal blur={false}><StackGrove categories={stackCategories} /></Reveal>}
        </Section>
    )
}

export default Stack

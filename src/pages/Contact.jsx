import Section from '../components/Section'
import SectionHeading from '../components/SectionHeading'
import ContactForm from '../components/ContactForm'
import { Reveal } from '../components/Reveal'

const Contact = () => (
    <Section id="contact" size="sm">
        <Reveal><SectionHeading index="03" eyebrow="Contact" title="Send a Message" /></Reveal>
        <Reveal delay={0.1} blur={false}><ContactForm /></Reveal>
    </Section>
)

export default Contact

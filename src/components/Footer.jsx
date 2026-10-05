import { useLenis } from 'lenis/react'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { contactLinks } from '../data/contact'
import { Reveal } from './Reveal'
import OrbitalPlanet from './OrbitalPlanet'

const Footer = () => {
    const lenis = useLenis()
    const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
    const backToTop = (event) => {
        event.preventDefault()
        if (lenis) lenis.scrollTo('#home', { duration: 1.6, immediate: reduced, force: true })
        else document.querySelector('#home')?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth' })
        window.history.replaceState(null, '', '#home')
    }

    return (
        <footer id="colophon" className="space-footer">
            <div className="mx-auto max-w-6xl relative">
                <Reveal blur={false}>
                    <p className="label mb-8">Keep in touch</p>
                    <h2 className="font-display text-h2 text-fg">Let’s connect.</h2>
                    <p className="mt-5 max-w-xl text-fg-2">Honours Computer Science · University of British Columbia</p>
                    <ul className="space-footer__links">
                        {contactLinks.map((link) => (
                            <li key={link.id}>
                                <a href={link.href} {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} data-cursor="link" className="space-link">
                                    <span className="label">{link.label}</span>
                                    <span>{link.value}</span><span aria-hidden="true">↗</span>
                                </a>
                            </li>
                        ))}
                    </ul>
                </Reveal>
                <div className="space-footer__planet"><OrbitalPlanet tone="moon" /></div>
                <div className="space-footer__colophon">
                    <p>© {new Date().getFullYear()} Benjamin Ching</p>
                    <a href="#home" onClick={backToTop} data-cursor="link" className="space-link">Back to the beginning <span aria-hidden="true">↑</span></a>
                </div>
            </div>
        </footer>
    )
}

export default Footer

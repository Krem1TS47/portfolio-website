import { navItems } from '../data/nav'
import { useActiveSection } from '../hooks/useActiveSection'
import { useLenis } from 'lenis/react'
import { useMediaQuery } from '../hooks/useMediaQuery'

const IDS = navItems.map((item) => item.path.slice(1))

const JourneyNav = () => {
    const active = useActiveSection(IDS)
    const lenis = useLenis()
    const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
    return (
        <nav className="journey-nav" aria-label="Journey sections">
            {navItems.map((item) => (
                <a key={item.path} href={item.path} aria-label={item.name}
                    aria-current={active === item.path.slice(1) ? 'location' : undefined}
                    data-cursor="link"
                    onClick={(event) => {
                        event.preventDefault()
                        if (lenis) lenis.scrollTo(item.path, { immediate: reduced, duration: 1.2, offset: -16 })
                        else document.querySelector(item.path)?.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth' })
                        window.history.replaceState(null, '', item.path)
                    }}>
                    <span className="journey-nav__name">{item.name}</span>
                    <span className="journey-nav__dot" />
                </a>
            ))}
        </nav>
    )
}

export default JourneyNav

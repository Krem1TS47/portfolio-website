import { useLenis } from 'lenis/react'
import { contactLinks } from '../data/contact'
import art from '../data/art.json'
import { LaurelBranch } from './ornaments/Laurel'

const ICONS = {
    email: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
    ),
    linkedin: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
    ),
    github: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
        </svg>
    ),
}

const ROMAN = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]
const toRoman = (n) => ROMAN.reduce((out, [v, s]) => { while (n >= v) { out += s; n -= v } return out }, '')

/** Museum plaque colophon with the contact links and CC0 attributions. */
const Footer = () => {
    const lenis = useLenis()
    const year = new Date().getFullYear()

    const backToTop = (e) => {
        e.preventDefault()
        if (lenis) lenis.scrollTo('#home', { duration: 1.6, force: true })
        else document.querySelector('#home')?.scrollIntoView({ behavior: 'smooth' })
        window.history.replaceState(null, '', '#home')
    }

    return (
        <footer id="colophon" className="relative px-6 md:px-8 pb-20 pt-10">
            <div className="mx-auto max-w-3xl">
                <div className="paper plaque meander rounded-[3px] px-6 py-8 md:px-12 md:py-10 text-center">
                    <div className="flex items-center justify-center gap-4 text-gold-700 mb-5">
                        <LaurelBranch length={110} leaves={7} className="hidden sm:block opacity-80" />
                        <p className="inscription engraved-deep text-sm md:text-base tracking-[0.3em] whitespace-nowrap">
                            Benjamin Ching · {toRoman(year)}
                        </p>
                        <LaurelBranch length={110} leaves={7} flip className="hidden sm:block opacity-80" />
                    </div>
                    <p className="inscription engraved text-[0.65rem] tracking-[0.28em] opacity-80 mb-8">
                        Honours Computer Science · University of British Columbia
                    </p>

                    <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
                        {contactLinks.map((link) => (
                            <li key={link.id}>
                                <a
                                    href={link.href}
                                    {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                                    data-cursor="link"
                                    className="group inline-flex items-center gap-2 engraved text-sm font-medium hover:text-umber transition-colors"
                                >
                                    <span className="text-gold-700 group-hover:text-umber transition-colors">{ICONS[link.id]}</span>
                                    <span className="inscription text-[0.62rem] tracking-[0.24em] opacity-70 group-hover:opacity-100">{link.label}</span>
                                    <span>{link.value}</span>
                                </a>
                            </li>
                        ))}
                    </ul>

                    <div className="mt-8 h-px w-24 mx-auto gold-leaf opacity-80" />

                    <p className="mt-6 text-[0.7rem] leading-relaxed text-fg-3">
                        Antiquities shown are from The Metropolitan Museum of Art's Open Access collection (CC0).{' '}
                        {art.map((a, i) => (
                            <span key={a.id}>
                                <a href={a.objectURL} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-fg">
                                    {a.title}
                                </a>
                                {i < art.length - 1 ? ' · ' : '.'}
                            </span>
                        ))}
                    </p>
                </div>

                <p className="mt-10 text-center">
                    <a href="#home" onClick={backToTop} data-cursor="link" className="inscription text-fg hover:text-coral transition-colors">
                        Return to the night sky ↑
                    </a>
                </p>
            </div>
        </footer>
    )
}

export default Footer

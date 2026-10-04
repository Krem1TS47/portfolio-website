import { useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useLenis } from 'lenis/react'
import { navItems } from '../data/nav'
import { useActiveSection } from '../hooks/useActiveSection'
import { EASE, SPRING } from '../motion/presets'

const IDS = navItems.map((item) => item.path.slice(1))

const listVariants = { hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.12 } } }
const itemVariants = {
    hidden: { opacity: 0, x: -18 },
    show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE } },
}

const easeOutQuart = (t) => 1 - Math.pow(1 - t, 4)

const Sidebar = ({ isOpen, onClose, returnFocusRef }) => {
    const lenis = useLenis()
    const active = useActiveSection(IDS)
    const firstLink = useRef(null)

    // Escape to close, scroll lock while open, focus management.
    useEffect(() => {
        if (!isOpen) return
        const onKey = (e) => e.key === 'Escape' && onClose()
        window.addEventListener('keydown', onKey)
        lenis?.stop()
        document.documentElement.style.overflow = 'hidden'
        const focusTimer = setTimeout(() => firstLink.current?.focus(), 150)
        return () => {
            window.removeEventListener('keydown', onKey)
            clearTimeout(focusTimer)
            lenis?.start()
            document.documentElement.style.overflow = ''
            returnFocusRef?.current?.focus?.()
        }
    }, [isOpen, onClose, lenis, returnFocusRef])

    const go = (e, path) => {
        e.preventDefault()
        onClose()
        if (lenis) {
            lenis.scrollTo(path, { duration: 1.2, easing: easeOutQuart, offset: -16, force: true })
        } else {
            document.querySelector(path)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
        window.history.replaceState(null, '', path)
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        key="overlay"
                        className="chrome fixed inset-0 z-40 bg-bg-0/70 backdrop-blur-xs"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={onClose}
                    />
                    <motion.nav
                        key="panel"
                        role="dialog"
                        aria-modal="true"
                        aria-label="Site navigation"
                        className="chrome fixed top-0 left-0 h-full w-[min(20rem,86vw)] z-50 bg-bg-1/95 backdrop-blur-xl border-r border-line flex flex-col"
                        initial={{ x: '-100%' }}
                        animate={{ x: 0, transition: SPRING.panel }}
                        exit={{ x: '-100%', transition: { duration: 0.32, ease: EASE } }}
                    >
                        <div className="pt-28 px-8 pb-6">
                            <p className="label">Navigate</p>
                        </div>

                        <motion.ul
                            className="flex-1 px-8"
                            variants={listVariants}
                            initial="hidden"
                            animate="show"
                        >
                            {navItems.map((item, i) => {
                                const id = item.path.slice(1)
                                const isActive = active === id
                                return (
                                    <motion.li key={item.path} variants={itemVariants} className="relative">
                                        {isActive && (
                                            <motion.span
                                                layoutId="nav-active"
                                                aria-hidden="true"
                                                className="absolute -left-4 top-[calc(50%-0.75rem)] h-6 w-px bg-coral"
                                                transition={SPRING.snappy}
                                            />
                                        )}
                                        <a
                                            ref={i === 0 ? firstLink : undefined}
                                            href={item.path}
                                            onClick={(e) => go(e, item.path)}
                                            aria-current={isActive ? 'location' : undefined}
                                            data-cursor="link"
                                            className={`group flex items-baseline justify-between py-3.5 border-b border-line transition-colors duration-200 hover:text-coral ${
                                                isActive ? 'text-fg' : 'text-fg-2'
                                            }`}
                                        >
                                            <span className="font-display text-2xl">{item.name}</span>
                                            <span className="label text-fg-3 group-hover:text-coral transition-colors">
                                                {item.index ?? '—'}
                                            </span>
                                        </a>
                                    </motion.li>
                                )
                            })}
                        </motion.ul>

                        <div className="p-8 label">
                            <p>&copy; {new Date().getFullYear()} Benjamin Ching</p>
                        </div>
                    </motion.nav>
                </>
            )}
        </AnimatePresence>
    )
}

export default Sidebar

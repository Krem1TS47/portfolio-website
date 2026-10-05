import { useCallback, useEffect, useRef, useState } from 'react'
import { useLenis } from 'lenis/react'
import Backdrop from './components/Backdrop'
import Grain from './components/Grain'
import ScrollProgress from './components/ScrollProgress'
import Cursor from './components/Cursor'
import Sidebar from './components/Sidebar'
import MenuButton from './components/MenuButton'
import Footer from './components/Footer'
import JourneyNav from './components/JourneyNav'
import Home from './pages/Home'
import About from './pages/About'
import Experience from './pages/Experience'
import Stack from './pages/Stack'
import Projects from './pages/Projects'

function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const menuButtonRef = useRef(null)
    const handledInitialHash = useRef(false)
    const lenis = useLenis()

    const toggleSidebar = useCallback(() => setIsSidebarOpen((open) => !open), [])
    const closeSidebar = useCallback(() => setIsSidebarOpen(false), [])

    // Deep links such as /#about (older emails may still carry a ?query suffix).
    useEffect(() => {
        if (handledInitialHash.current) return
        const [anchor] = window.location.hash.split('?')
        if (!anchor || anchor === '#') { handledInitialHash.current = true; return }
        const target = document.querySelector(anchor)
        if (!target) return
        const id = requestAnimationFrame(() => {
            handledInitialHash.current = true;
            if (lenis) lenis.scrollTo(target, { immediate: true, force: true })
            else target.scrollIntoView()
        })
        return () => cancelAnimationFrame(id)
    }, [lenis])

    return (
        <div className="min-h-screen relative">
            <a href="#main-content" className="skip-link">Skip to content</a>
            <Backdrop />
            <Grain />
            <ScrollProgress />
            <Cursor />

            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} returnFocusRef={menuButtonRef} />
            <MenuButton onClick={toggleSidebar} isOpen={isSidebarOpen} buttonRef={menuButtonRef} />

            <JourneyNav />
            <main id="main-content" tabIndex={-1}>
                <Home />
                {/* A single palette carries the journey from the hero to contact. */}
                <div className="space-journey">
                    <About />
                    <Experience />
                    <Stack />
                    <Projects />
                    <Footer />
                </div>
            </main>
        </div>
    )
}

export default App

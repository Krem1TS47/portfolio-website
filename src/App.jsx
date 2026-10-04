import { useCallback, useEffect, useRef, useState } from 'react'
import { useLenis } from 'lenis/react'
import Backdrop from './components/Backdrop'
import Grain from './components/Grain'
import ScrollProgress from './components/ScrollProgress'
import Cursor from './components/Cursor'
import Sidebar from './components/Sidebar'
import MenuButton from './components/MenuButton'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Experience from './pages/Experience'
import Stack from './pages/Stack'
import Projects from './pages/Projects'

function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const menuButtonRef = useRef(null)
    const lenis = useLenis()

    const toggleSidebar = useCallback(() => setIsSidebarOpen((open) => !open), [])
    const closeSidebar = useCallback(() => setIsSidebarOpen(false), [])

    // Deep links such as /#about (older emails may still carry a ?query suffix).
    useEffect(() => {
        const [anchor] = window.location.hash.split('?')
        if (!anchor || anchor === '#') return
        const target = document.querySelector(anchor)
        if (!target) return
        const id = requestAnimationFrame(() => {
            if (lenis) lenis.scrollTo(target, { immediate: true, force: true })
            else target.scrollIntoView()
        })
        return () => cancelAnimationFrame(id)
    }, [lenis])

    return (
        <div className="min-h-screen relative">
            <Backdrop />
            <Grain />
            <ScrollProgress />
            <Cursor />

            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} returnFocusRef={menuButtonRef} />
            <MenuButton onClick={toggleSidebar} isOpen={isSidebarOpen} buttonRef={menuButtonRef} />

            <main>
                <Home />
                {/* Everything below the hero lives in the daylight garden palette. */}
                <div className="garden">
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

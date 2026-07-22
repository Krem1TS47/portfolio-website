import { useState } from 'react'
import Sidebar from './components/Sidebar'
import MenuButton from './components/MenuButton'
import ThemeToggle from './components/ThemeToggle'
import Home from './pages/Home'
import Resume from './pages/Resume'
import Stack from './pages/Stack'
import Projects from './pages/Projects'
import About from './pages/About'
import Experience from './pages/Experience'

function App() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen)
    }

    const closeSidebar = () => {
        setIsSidebarOpen(false)
    }

    return (
        <div className="min-h-screen scroll-smooth relative">
            {/* Unified Gradient Background */}
            <div className="fixed inset-0 -z-10 gradient-bg"></div>

            <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
            <MenuButton onClick={toggleSidebar} isOpen={isSidebarOpen} />
            <ThemeToggle />

            {/* All sections on one page */}
            <div id="home">
                <Home />
            </div>
            <div id="about">
                <About />
            </div>
            <div id="resume">
                <Resume />
            </div>
            <div id="experience">
                <Experience />
            </div>
            <div id="stack">
                <Stack />
            </div>
            <div id="projects">
                <Projects />
            </div>
        </div>
    )
}

export default App


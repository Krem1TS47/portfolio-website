import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import Sidebar from './components/Sidebar'
import MenuButton from './components/MenuButton'
import Home from './pages/Home'
import About from './pages/About'
import Writing from './pages/Writing'
import Projects from './pages/Projects'
import Contact from './pages/Contact'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  return (
    <Router>
      <div className="min-h-screen bg-primary-bg">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
        <MenuButton onClick={toggleSidebar} isOpen={isSidebarOpen} />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/writing" element={<Writing />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App


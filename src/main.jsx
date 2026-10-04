import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MotionConfig } from 'motion/react'
import '@fontsource-variable/inter'
import '@fontsource/instrument-serif/400.css'
import '@fontsource/instrument-serif/400-italic.css'
import '@fontsource-variable/geist-mono'
import '@fontsource-variable/cinzel'
import 'lenis/dist/lenis.css'
import './index.css'
import SmoothScroll from './components/SmoothScroll'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <App />
      </SmoothScroll>
    </MotionConfig>
  </StrictMode>,
)

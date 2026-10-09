import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import OrbitRoseScene from './OrbitRoseScene'

/** Lazy-loaded canvas for the About figure. Pauses while scrolled out of view. */
const OrbitRose = ({ progress }) => {
    const wrapper = useRef()
    const [visible, setVisible] = useState(true)

    useEffect(() => {
        const el = wrapper.current
        if (!el || typeof IntersectionObserver === 'undefined') return
        const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0 })
        io.observe(el)
        return () => io.disconnect()
    }, [])

    return (
        <div ref={wrapper} className="about-rose-canvas" aria-hidden="true">
            <Canvas
                dpr={[1, 1.5]}
                camera={{ fov: 35, position: [0, 0, 3.6], near: 0.1, far: 20 }}
                gl={{ antialias: true, alpha: true, stencil: false }}
                frameloop={visible ? 'always' : 'never'}
            >
                <Suspense fallback={null}>
                    <OrbitRoseScene progress={progress} />
                </Suspense>
            </Canvas>
        </div>
    )
}

export default OrbitRose

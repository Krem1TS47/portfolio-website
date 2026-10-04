import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import Scene from './Scene'

/**
 * Lazy-loaded wrapper around the R3F canvas. Pauses the render loop while the
 * hero is scrolled out of view.
 */
const PlanetScene = ({ pointer, progress }) => {
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
        <div ref={wrapper} className="absolute inset-0" aria-hidden="true" data-cursor="drag">
            <Canvas
                dpr={[1, 1.5]}
                camera={{ fov: 35, position: [0, 0, 9], near: 0.1, far: 200 }}
                gl={{ antialias: false, powerPreference: 'high-performance', alpha: false, stencil: false }}
                frameloop={visible ? 'always' : 'demand'}
                style={{ touchAction: 'pan-y' }}
            >
                <Suspense fallback={null}>
                    <Scene pointer={pointer} progress={progress} />
                </Suspense>
            </Canvas>
        </div>
    )
}

export default PlanetScene

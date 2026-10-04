import { useRef } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, PresentationControls, Stars } from '@react-three/drei'
import { damp } from 'maath/easing'
import { SUN_DIR, PALETTE } from './constants'
import Planet from './Planet'
import DustRing from './DustRing'
import Moons from './Moons'
import Effects from './Effects'

const CAMERA_Z = 9

/**
 * Composition root. `pointer` and `progress` are Motion values owned by the
 * hero; we only ever read them inside useFrame so React never re-renders the
 * canvas for pointer or scroll movement.
 */
const Scene = ({ pointer, progress }) => {
    const parallax = useRef()
    const planetGroup = useRef()
    const { size } = useThree()
    const compact = size.width < 768

    // Desktop: planet sits right of the name. Mobile: below it.
    const targetX = compact ? 0 : 1.75
    const targetY = compact ? -1.35 : 0
    const targetScale = compact ? 0.78 : 1

    useFrame((state, dt) => {
        const p = progress ? progress.get() : 0
        const px = pointer ? pointer.x.get() : 0
        const py = pointer ? pointer.y.get() : 0

        if (parallax.current) {
            damp(parallax.current.rotation, 'y', px * 0.22, 0.35, dt)
            damp(parallax.current.rotation, 'x', py * 0.12, 0.35, dt)
        }
        if (planetGroup.current) {
            damp(planetGroup.current.position, 'x', targetX, 0.4, dt)
            damp(planetGroup.current.position, 'y', targetY - p * 1.6, 0.25, dt)
            damp(planetGroup.current.scale, 'x', targetScale, 0.4, dt)
            damp(planetGroup.current.scale, 'y', targetScale, 0.4, dt)
            damp(planetGroup.current.scale, 'z', targetScale, 0.4, dt)
        }
        // Recede as the hero scrolls away
        damp(state.camera.position, 'z', CAMERA_Z + p * 5, 0.25, dt)
    })

    return (
        <>
            <color attach="background" args={[PALETTE.bg]} />

            <directionalLight
                position={[SUN_DIR.x * 10, SUN_DIR.y * 10, SUN_DIR.z * 10]}
                intensity={2.6}
                color={PALETTE.sun}
            />
            <ambientLight intensity={0.06} />
            <Environment resolution={64} frames={1}>
                <Lightformer form="ring" color="#ff9aa8" intensity={2} position={[-4, 2, -4]} scale={6} />
                <Lightformer form="rect" color="#8f7bff" intensity={1} position={[3, -3, -5]} scale={[6, 3, 1]} />
            </Environment>

            <Stars radius={60} depth={40} count={2200} factor={3} saturation={0.4} fade speed={0.3} />

            <group ref={parallax}>
                <PresentationControls
                    global
                    snap
                    cursor={false}
                    speed={1.1}
                    polar={[-0.35, 0.35]}
                    azimuth={[-0.7, 0.7]}
                >
                    <group ref={planetGroup} position={[targetX, targetY, 0]}>
                        <Planet />
                        <DustRing />
                        <Moons />
                    </group>
                </PresentationControls>
            </group>

            <Effects />
        </>
    )
}

export default Scene

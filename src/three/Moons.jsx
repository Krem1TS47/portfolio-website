import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { PLANET_RADIUS as R, PALETTE } from './constants'

const MOONS = [
    { radius: R * 2.95, speed: 0.22, inclination: 0.28, size: 0.16, phase: 1.1 },
    { radius: R * 3.6, speed: -0.14, inclination: -0.18, size: 0.11, phase: 3.9 },
]

const AXIS = new THREE.Vector3(1, 0, 0)

const Moon = ({ config }) => {
    const mesh = useRef()
    const angle = useRef(config.phase)

    useFrame((_, dt) => {
        angle.current += config.speed * dt
        const m = mesh.current
        if (!m) return
        m.position.set(
            Math.cos(angle.current) * config.radius,
            Math.sin(angle.current * 2) * 0.12,
            Math.sin(angle.current) * config.radius
        )
        m.position.applyAxisAngle(AXIS, config.inclination)
        m.rotation.y += dt * 0.3
    })

    return (
        <mesh ref={mesh}>
            <sphereGeometry args={[config.size, 32, 32]} />
            <meshStandardMaterial color={PALETTE.moon} roughness={0.9} metalness={0.05} />
        </mesh>
    )
}

const Moons = () => MOONS.map((m, i) => <Moon key={i} config={m} />)

export default Moons

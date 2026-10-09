import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { damp } from 'maath/easing'
import { PALETTE } from './constants'
import { CYCLE, R_EARTH, R_VENUS, ROSE_STEPS as STEPS, positions, roseSegments } from './roseMath'

const CYCLE_SECONDS = 24
const HOLD_SECONDS = 2.5
const FADE_SECONDS = 1.2
const ROSE_OPACITY = 0.16

const circle = (radius, segments = 160) => {
    const points = []
    for (let i = 0; i < segments; i++) {
        const a = (i / segments) * Math.PI * 2
        points.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius))
    }
    return new THREE.BufferGeometry().setFromPoints(points)
}

const glowTexture = () => {
    const canvas = document.createElement('canvas')
    canvas.width = canvas.height = 128
    const ctx = canvas.getContext('2d')
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
    gradient.addColorStop(0, 'rgba(255,231,214,1)')
    gradient.addColorStop(0.25, 'rgba(255,179,155,0.45)')
    gradient.addColorStop(1, 'rgba(240,138,122,0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 128, 128)
    const texture = new THREE.CanvasTexture(canvas)
    texture.colorSpace = THREE.SRGBColorSpace
    return texture
}

/**
 * Earth and Venus orbit the Sun while their connecting line, sampled at even
 * intervals, draws the 13:8 rose. `progress` is a Motion value read only inside
 * useFrame, so scrolling never re-renders React.
 */
const OrbitRoseScene = ({ progress }) => {
    const system = useRef()
    const earth = useRef()
    const venus = useRef()
    const rose = useRef()
    const connector = useRef()
    const clock = useRef({ day: 0, hold: 0 })

    const geometry = useMemo(() => {
        const g = new THREE.BufferGeometry()
        g.setAttribute('position', new THREE.BufferAttribute(roseSegments(STEPS), 3))
        g.setDrawRange(0, 0)
        return g
    }, [])
    const connectorGeometry = useMemo(() => {
        const g = new THREE.BufferGeometry()
        g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(6), 3))
        return g
    }, [])
    const orbits = useMemo(() => [circle(R_EARTH), circle(R_VENUS)], [])
    const glow = useMemo(glowTexture, [])

    useFrame((_, dt) => {
        const delta = Math.min(dt, 0.1)
        const state = clock.current
        const material = rose.current.material

        if (state.day < CYCLE) {
            state.day = Math.min(CYCLE, state.day + (CYCLE / CYCLE_SECONDS) * delta)
            material.opacity = ROSE_OPACITY
        } else {
            state.hold += delta
            const fade = Math.max(0, state.hold - HOLD_SECONDS) / FADE_SECONDS
            material.opacity = ROSE_OPACITY * Math.max(0, 1 - fade)
            if (fade >= 1) { state.day = 0; state.hold = 0 }
        }
        geometry.setDrawRange(0, Math.floor((state.day / CYCLE) * STEPS) * 2)

        const { earth: e, venus: v } = positions(state.day)
        earth.current.position.set(e[0], 0, e[1])
        venus.current.position.set(v[0], 0, v[1])
        const line = connectorGeometry.attributes.position
        line.setXYZ(0, e[0], 0, e[1])
        line.setXYZ(1, v[0], 0, v[1])
        line.needsUpdate = true

        // Tilt toward face-on as the section scrolls through; drift slowly in yaw.
        const p = progress ? progress.get() : 0.5
        damp(system.current.rotation, 'x', 0.7 + p * 0.45, 0.4, delta)
        system.current.rotation.y += delta * 0.04
    })

    return (
        <group ref={system} rotation={[0.9, 0, 0]}>
            <sprite scale={0.9}>
                <spriteMaterial map={glow} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
            </sprite>
            <mesh>
                <sphereGeometry args={[0.07, 32, 32]} />
                <meshBasicMaterial color={PALETTE.sun} />
            </mesh>

            {orbits.map((orbit, index) => (
                <lineLoop key={index} geometry={orbit}>
                    <lineBasicMaterial color={PALETTE.moon} transparent opacity={0.18} depthWrite={false} />
                </lineLoop>
            ))}

            <lineSegments ref={rose} geometry={geometry}>
                <lineBasicMaterial color={PALETTE.coral} transparent opacity={ROSE_OPACITY} depthWrite={false} blending={THREE.AdditiveBlending} />
            </lineSegments>
            <line ref={connector} geometry={connectorGeometry}>
                <lineBasicMaterial color={PALETTE.peach} transparent opacity={0.9} depthWrite={false} />
            </line>

            <mesh ref={earth}>
                <sphereGeometry args={[0.035, 24, 24]} />
                <meshBasicMaterial color={PALETTE.moon} />
            </mesh>
            <mesh ref={venus}>
                <sphereGeometry args={[0.03, 24, 24]} />
                <meshBasicMaterial color={PALETTE.gold} />
            </mesh>
        </group>
    )
}

export default OrbitRoseScene

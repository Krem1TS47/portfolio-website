import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { PLANET_RADIUS as R, PALETTE } from './constants'
import { makeSprite } from './textures/procedural'

const COUNT = 6000
const INNER = R * 1.7
const OUTER = R * 2.75
const GAP = R * 2.18
const GAP_HALF = R * 0.07

/** Particle ring with a Cassini-style gap, tilted and slowly spinning. */
const DustRing = () => {
    const group = useRef()
    const sprite = useMemo(() => makeSprite(), [])

    const geometry = useMemo(() => {
        const pos = new Float32Array(COUNT * 3)
        const col = new Float32Array(COUNT * 3)
        const a = new THREE.Color(PALETTE.coral)
        const b = new THREE.Color(PALETTE.violet)
        const c = new THREE.Color()
        let seed = 42
        const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 }

        let i = 0
        while (i < COUNT) {
            // sqrt for even areal density
            const r = Math.sqrt(rnd()) * (OUTER - INNER) + INNER
            if (Math.abs(r - GAP) < GAP_HALF && rnd() < 0.92) continue
            const theta = rnd() * Math.PI * 2
            const y = (rnd() - 0.5) * R * 0.06 * (rnd() < 0.1 ? 3 : 1)
            pos[i * 3] = Math.cos(theta) * r
            pos[i * 3 + 1] = y
            pos[i * 3 + 2] = Math.sin(theta) * r
            const t = (r - INNER) / (OUTER - INNER)
            c.copy(a).lerp(b, t).multiplyScalar(0.55 + rnd() * 0.6)
            col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b
            i++
        }
        const g = new THREE.BufferGeometry()
        g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
        g.setAttribute('color', new THREE.BufferAttribute(col, 3))
        return g
    }, [])

    useFrame((_, dt) => {
        if (group.current) group.current.rotation.y += dt * 0.02
    })

    return (
        <group rotation={[0.42, 0, 0.12]}>
            <group ref={group}>
                <points geometry={geometry}>
                    <pointsMaterial
                        size={0.045}
                        sizeAttenuation
                        map={sprite}
                        alphaMap={sprite}
                        vertexColors
                        transparent
                        depthWrite={false}
                        blending={THREE.AdditiveBlending}
                        opacity={0.9}
                    />
                </points>
            </group>
        </group>
    )
}

export default DustRing

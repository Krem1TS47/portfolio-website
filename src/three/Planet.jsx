import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import CustomShaderMaterial from 'three-custom-shader-material'
import { PLANET_RADIUS as R, SUN_DIR, PALETTE } from './constants'
import { makeAlbedo, makeLights, makeClouds } from './textures/procedural'
import { surfaceVertex, surfaceFragment } from './shaders/surface'
import { atmosphereVertex, rimFragment, haloFragment } from './shaders/atmosphere'

const HALO_SCALE = 1.16
const HALO_EDGE = Math.sqrt(1 - 1 / (HALO_SCALE * HALO_SCALE))

const Planet = () => {
    const surface = useRef()
    const clouds = useRef()

    const albedo = useMemo(() => makeAlbedo(), [])
    const lights = useMemo(() => makeLights(), [])
    const cloudMap = useMemo(() => makeClouds(), [])

    const surfaceUniforms = useMemo(() => ({
        uLights: { value: lights },
        uSunDir: { value: SUN_DIR.clone() },
        uLightColor: { value: new THREE.Color(PALETTE.cityLights) },
    }), [lights])

    const rimUniforms = useMemo(() => ({
        uInner: { value: new THREE.Color(PALETTE.coralHot) },
        uOuter: { value: new THREE.Color(PALETTE.violet) },
        uSunDir: { value: SUN_DIR.clone() },
        uPower: { value: 3.2 },
        uIntensity: { value: 1.9 },
    }), [])

    const haloUniforms = useMemo(() => ({
        uInner: { value: new THREE.Color(PALETTE.coralHot) },
        uOuter: { value: new THREE.Color(PALETTE.violet) },
        uSunDir: { value: SUN_DIR.clone() },
        uEdge: { value: HALO_EDGE },
        uIntensity: { value: 1.5 },
    }), [])

    useFrame((_, dt) => {
        if (surface.current) surface.current.rotation.y += dt * 0.05
        if (clouds.current) clouds.current.rotation.y += dt * 0.085
    })

    return (
        <group>
            {/* Surface */}
            <mesh ref={surface} rotation={[0.15, 0, 0.08]}>
                <sphereGeometry args={[R, 96, 96]} />
                <CustomShaderMaterial
                    baseMaterial={THREE.MeshStandardMaterial}
                    map={albedo}
                    bumpMap={albedo}
                    bumpScale={0.012}
                    roughness={0.82}
                    metalness={0}
                    uniforms={surfaceUniforms}
                    vertexShader={surfaceVertex}
                    fragmentShader={surfaceFragment}
                />
            </mesh>

            {/* Clouds */}
            <mesh ref={clouds} rotation={[0.15, 0.6, 0.08]}>
                <sphereGeometry args={[R * 1.014, 72, 72]} />
                <meshStandardMaterial
                    color={PALETTE.cloud}
                    alphaMap={cloudMap}
                    transparent
                    opacity={0.78}
                    depthWrite={false}
                    roughness={1}
                />
            </mesh>

            {/* Fresnel rim on the limb */}
            <mesh>
                <sphereGeometry args={[R * 1.025, 72, 72]} />
                <shaderMaterial
                    vertexShader={atmosphereVertex}
                    fragmentShader={rimFragment}
                    uniforms={rimUniforms}
                    transparent
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* Outer halo */}
            <mesh>
                <sphereGeometry args={[R * HALO_SCALE, 72, 72]} />
                <shaderMaterial
                    vertexShader={atmosphereVertex}
                    fragmentShader={haloFragment}
                    uniforms={haloUniforms}
                    transparent
                    depthWrite={false}
                    side={THREE.BackSide}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>
        </group>
    )
}

export default Planet

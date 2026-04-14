import { useEffect, useRef } from 'react'
import * as THREE from 'three'

const InteractiveModel = () => {
    const containerRef = useRef(null)

    useEffect(() => {
        const container = containerRef.current
        if (!container) return

        const scene = new THREE.Scene()
        scene.background = null

        const camera = new THREE.PerspectiveCamera(
            45,
            container.clientWidth / container.clientHeight,
            0.1,
            200
        )
        camera.position.z = 12

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setSize(container.clientWidth, container.clientHeight)
        container.appendChild(renderer.domElement)

        const galaxyGroup = new THREE.Group()
        scene.add(galaxyGroup)

        const coreGeometry = new THREE.SphereGeometry(1.2, 64, 64)
        const coreMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uColorA: { value: new THREE.Color('#ffd8eb') },
                uColorB: { value: new THREE.Color('#ffc76f') }
            },
            vertexShader: `
                varying vec3 vPos;
                void main() {
                    vPos = position;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform vec3 uColorA;
                uniform vec3 uColorB;
                varying vec3 vPos;
                void main() {
                    float intensity = pow(1.0 - length(vPos) / 1.2, 2.2);
                    vec3 color = mix(uColorB, uColorA, intensity);
                    gl_FragColor = vec4(color, intensity + 0.2);
                }
            `,
            transparent: true,
            side: THREE.DoubleSide
        })
        const core = new THREE.Mesh(coreGeometry, coreMaterial)
        galaxyGroup.add(core)

        const orbitBands = []
        const bandMaterial = new THREE.MeshBasicMaterial({
            color: 0xffd6fb,
            transparent: true,
            opacity: 0.3,
            side: THREE.DoubleSide
        })

        for (let i = 0; i < 3; i += 1) {
            const innerRadius = 2.5 + i * 0.9
            const outerRadius = innerRadius + 0.2
            const ringGeometry = new THREE.RingGeometry(innerRadius, outerRadius, 180)
            const ring = new THREE.Mesh(ringGeometry, bandMaterial.clone())
            ring.rotation.x = Math.PI / 2.2 + i * 0.08
            ring.rotation.z = i * 0.3
            galaxyGroup.add(ring)
            orbitBands.push(ringGeometry)
        }

        const satellites = []
        const satelliteGeometry = new THREE.SphereGeometry(0.22, 24, 24)
        const satelliteMaterial = new THREE.MeshStandardMaterial({
            color: 0xc8dcff,
            emissive: 0x8bc6ff,
            emissiveIntensity: 0.4,
            roughness: 0.2,
            metalness: 0.3
        })

        const satelliteConfigs = [
            { radius: 3.2, speed: 0.4, inclination: 0.25 },
            { radius: 4.1, speed: -0.25, inclination: -0.15 },
            { radius: 5, speed: 0.18, inclination: 0.35 }
        ]

        satelliteConfigs.forEach(({ radius, speed, inclination }) => {
            const satellite = new THREE.Mesh(satelliteGeometry, satelliteMaterial.clone())
            satellite.userData = { radius, speed, inclination, angle: Math.random() * Math.PI * 2 }
            satellites.push(satellite)
            galaxyGroup.add(satellite)
        })

        const starGeometry = new THREE.BufferGeometry()
        const starCount = 1200
        const positions = new Float32Array(starCount * 3)
        const colors = new Float32Array(starCount * 3)
        for (let i = 0; i < starCount; i += 1) {
            const radius = THREE.MathUtils.randFloat(4, 10)
            const angle = Math.random() * Math.PI * 2
            const y = THREE.MathUtils.randFloatSpread(2)
            positions[i * 3] = Math.cos(angle) * radius
            positions[i * 3 + 1] = y
            positions[i * 3 + 2] = Math.sin(angle) * radius

            const color = new THREE.Color().setHSL(0.97 + Math.random() * 0.08, 0.6, 0.6 + Math.random() * 0.2)
            colors[i * 3] = color.r
            colors[i * 3 + 1] = color.g
            colors[i * 3 + 2] = color.b
        }
        starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
        starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

        const starMaterial = new THREE.PointsMaterial({
            size: 0.04,
            vertexColors: true,
            transparent: true,
            opacity: 0.85,
            depthWrite: false
        })
        const stars = new THREE.Points(starGeometry, starMaterial)
        scene.add(stars)

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
        const warmLight = new THREE.PointLight(0xff99aa, 1.2)
        warmLight.position.set(6, 5, 4)
        const coolLight = new THREE.PointLight(0x7ecbff, 0.9)
        coolLight.position.set(-5, -3, -6)
        scene.add(ambientLight, warmLight, coolLight)

        const targetRotation = new THREE.Vector2(0, 0)
        const pointer = new THREE.Vector2(0, 0)

        const handlePointerMove = event => {
            const rect = container.getBoundingClientRect()
            pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
            pointer.y = ((event.clientY - rect.top) / rect.height) * 2 - 1
        }

        const handlePointerLeave = () => {
            pointer.set(0, 0)
        }

        container.addEventListener('pointermove', handlePointerMove)
        container.addEventListener('pointerleave', handlePointerLeave)

        const handleResize = () => {
            const { clientWidth, clientHeight } = container
            camera.aspect = clientWidth / clientHeight
            camera.updateProjectionMatrix()
            renderer.setSize(clientWidth, clientHeight)
        }

        window.addEventListener('resize', handleResize)

        let animationFrameId
        const clock = new THREE.Clock()

        const animate = () => {
            const elapsed = clock.getElapsedTime()
            coreMaterial.uniforms.uTime.value = elapsed

            targetRotation.x += (pointer.y - targetRotation.x) * 0.04
            targetRotation.y += (pointer.x - targetRotation.y) * 0.04

            galaxyGroup.rotation.x += (targetRotation.x - galaxyGroup.rotation.x) * 0.06
            galaxyGroup.rotation.y += (targetRotation.y - galaxyGroup.rotation.y) * 0.06
            stars.rotation.z += 0.0005

            satellites.forEach(satellite => {
                const { radius, speed, inclination } = satellite.userData
                satellite.userData.angle += speed * 0.01
                satellite.position.set(
                    Math.cos(satellite.userData.angle) * radius,
                    Math.sin(satellite.userData.angle * 2) * 0.3 + Math.sin(inclination) * 0.2,
                    Math.sin(satellite.userData.angle) * radius
                )
                satellite.position.applyAxisAngle(new THREE.Vector3(1, 0, 0), inclination)
            })

            renderer.render(scene, camera)
            animationFrameId = requestAnimationFrame(animate)
        }
        animate()

        return () => {
            cancelAnimationFrame(animationFrameId)
            window.removeEventListener('resize', handleResize)
            container.removeEventListener('pointermove', handlePointerMove)
            container.removeEventListener('pointerleave', handlePointerLeave)
            container.removeChild(renderer.domElement)
            coreGeometry.dispose()
            coreMaterial.dispose()
            orbitBands.forEach(geometry => geometry.dispose())
            satelliteGeometry.dispose()
            satelliteMaterial.dispose()
            starGeometry.dispose()
            starMaterial.dispose()
            renderer.dispose()
        }
    }, [])

    return (
        <div
            ref={containerRef}
            className="relative w-full max-w-xl aspect-square rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-[#120512] via-[#18081a] to-[#1e0a20] shadow-[0_25px_70px_rgba(0,0,0,0.55)] overflow-hidden"
        >
            <div className="pointer-events-none absolute inset-0 opacity-70 mix-blend-screen blur-3xl bg-[radial-gradient(circle_at_25%_30%,rgba(255,173,208,0.45),transparent_60%),radial-gradient(circle_at_70%_20%,rgba(144,181,255,0.35),transparent_55%),radial-gradient(circle_at_30%_80%,rgba(255,203,159,0.35),transparent_65%)]" />
        </div>
    )
}

export default InteractiveModel



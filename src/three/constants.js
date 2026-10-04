import * as THREE from 'three'

/** World-space direction *towards* the sun. Shared by lights and shaders. */
export const SUN_DIR = new THREE.Vector3(5, 2, 4).normalize()

export const PLANET_RADIUS = 1.2

/** Palette, mirrored from the CSS tokens in index.css (sRGB hex for three). */
export const PALETTE = {
    coral: '#f08a7a',
    coralHot: '#ffb39b',
    peach: '#ffd9b8',
    violet: '#9b7bff',
    pink: '#ffd8eb',
    gold: '#ffc76f',
    sun: '#ffe7d6',
    cityLights: '#ffb98a',
    cloud: '#fff1e6',
    moon: '#c8dcff',
    bg: '#13111d',
}

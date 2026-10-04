import * as THREE from 'three'

/*
 * Procedural planet textures, drawn once into canvases on the main thread.
 * Zero bytes shipped; ~150 ms on first use; results are cached per key.
 *
 * Noise is sampled on the unit sphere (lat/long → xyz), so features are
 * seamless across the texture's horizontal wrap and uniform at the poles.
 */

// ---------- 3D value noise ----------
const PERM = new Uint8Array(512)
;(() => {
    let seed = 1337
    const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 }
    const p = Array.from({ length: 256 }, (_, i) => i)
    for (let i = 255; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [p[i], p[j]] = [p[j], p[i]] }
    for (let i = 0; i < 512; i++) PERM[i] = p[i & 255]
})()

const hash3 = (x, y, z) => PERM[(PERM[(PERM[x & 255] + y) & 255] + z) & 255] / 255
const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10)
const lerp = (a, b, t) => a + (b - a) * t

function noise3(x, y, z) {
    const xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z)
    const xf = x - xi, yf = y - yi, zf = z - zi
    const u = fade(xf), v = fade(yf), w = fade(zf)
    const x0 = lerp(hash3(xi, yi, zi), hash3(xi + 1, yi, zi), u)
    const x1 = lerp(hash3(xi, yi + 1, zi), hash3(xi + 1, yi + 1, zi), u)
    const x2 = lerp(hash3(xi, yi, zi + 1), hash3(xi + 1, yi, zi + 1), u)
    const x3 = lerp(hash3(xi, yi + 1, zi + 1), hash3(xi + 1, yi + 1, zi + 1), u)
    return lerp(lerp(x0, x1, v), lerp(x2, x3, v), w)
}

function fbm(x, y, z, octaves = 4, lacunarity = 2.1, gain = 0.5) {
    let amp = 0.5, sum = 0, norm = 0
    for (let i = 0; i < octaves; i++) {
        sum += amp * noise3(x, y, z)
        norm += amp
        x *= lacunarity; y *= lacunarity; z *= lacunarity
        amp *= gain
    }
    return sum / norm
}

/** Ridged variant: sharp bright filaments, good for clouds. */
function ridged(x, y, z, octaves = 4) {
    let amp = 0.5, sum = 0, norm = 0
    for (let i = 0; i < octaves; i++) {
        const n = 1 - Math.abs(noise3(x, y, z) * 2 - 1)
        sum += amp * n * n
        norm += amp
        x *= 2.2; y *= 2.2; z *= 2.2
        amp *= 0.5
    }
    return sum / norm
}

// ---------- colour ramp ----------
const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)]
const RAMP = [
    [0.00, hex('#1a1230')],   // deep violet shadow
    [0.28, hex('#4b2f63')],   // muted violet
    [0.48, hex('#b86b84')],   // dusty rose
    [0.66, hex('#ffd8eb')],   // pale pink (original core colour)
    [0.82, hex('#ffc76f')],   // peach gold (original core colour)
    [1.00, hex('#fff3e0')],   // cream highlight
]
function ramp(t) {
    t = Math.min(1, Math.max(0, t))
    for (let i = 1; i < RAMP.length; i++) {
        if (t <= RAMP[i][0]) {
            const [t0, c0] = RAMP[i - 1], [t1, c1] = RAMP[i]
            const k = (t - t0) / (t1 - t0)
            return [lerp(c0[0], c1[0], k), lerp(c0[1], c1[1], k), lerp(c0[2], c1[2], k)]
        }
    }
    return RAMP[RAMP.length - 1][1]
}

// ---------- canvas helpers ----------
function makeCanvas(w, h) {
    const c = document.createElement('canvas')
    c.width = w; c.height = h
    return c
}

/** Iterate every texel, giving the unit-sphere point for its lat/long. */
function forEachTexel(w, h, fn) {
    for (let j = 0; j < h; j++) {
        const v = (j + 0.5) / h
        const lat = (0.5 - v) * Math.PI
        const cl = Math.cos(lat), sl = Math.sin(lat)
        for (let i = 0; i < w; i++) {
            const u = (i + 0.5) / w
            const lon = u * Math.PI * 2
            fn((j * w + i) * 4, cl * Math.cos(lon), sl, cl * Math.sin(lon), lat)
        }
    }
}

const cache = new Map()
const memo = (key, make) => { if (!cache.has(key)) cache.set(key, make()); return cache.get(key) }

/** Albedo: warped fbm continents blended with soft latitude bands. */
export const makeAlbedo = (w = 768, h = 384) => memo(`albedo:${w}x${h}`, () => {
    const c = makeCanvas(w, h), ctx = c.getContext('2d'), img = ctx.createImageData(w, h), d = img.data
    forEachTexel(w, h, (o, x, y, z, lat) => {
        // domain warp
        const wx = fbm(x * 1.6 + 7.1, y * 1.6, z * 1.6, 3) - 0.5
        const wy = fbm(x * 1.6, y * 1.6 + 3.3, z * 1.6, 3) - 0.5
        const n = fbm((x + wx * 0.6) * 2.4, (y + wy * 0.6) * 2.4, (z + wx * 0.3) * 2.4, 5)
        const bands = 0.5 + 0.5 * Math.sin(lat * 7.0 + (n - 0.5) * 4.0)
        const t = n * 0.72 + bands * 0.28
        const [r, g, b] = ramp((t - 0.22) * 1.55)
        d[o] = r; d[o + 1] = g; d[o + 2] = b; d[o + 3] = 255
    })
    ctx.putImageData(img, 0, 0)
    const tex = new THREE.CanvasTexture(c)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 4
    tex.wrapS = THREE.RepeatWrapping
    return tex
})

/** Night lights mask (red channel): clustered settlements on the darker terrain. */
export const makeLights = (w = 512, h = 256) => memo(`lights:${w}x${h}`, () => {
    const c = makeCanvas(w, h), ctx = c.getContext('2d'), img = ctx.createImageData(w, h), d = img.data
    forEachTexel(w, h, (o, x, y, z) => {
        const region = fbm(x * 2.4 + 11.3, y * 2.4, z * 2.4, 4)              // where people live
        const detail = fbm(x * 14 + 2.2, y * 14, z * 14, 2)                   // street-level clumping
        const sparkle = hash3(Math.floor(x * 900) & 255, Math.floor(y * 900) & 255, Math.floor(z * 900) & 255)
        const mask = Math.min(1, Math.max(0, (region - 0.48) * 6))            // soft region threshold
        const v = mask * (detail > 0.55 ? 1 : 0.25) * (sparkle > 0.6 ? 1 : 0.15)
        const px = Math.round(v * 255)
        d[o] = px; d[o + 1] = px; d[o + 2] = px; d[o + 3] = 255
    })
    ctx.putImageData(img, 0, 0)
    const tex = new THREE.CanvasTexture(c)
    tex.wrapS = THREE.RepeatWrapping
    return tex
})

/** Cloud alpha (white, alpha in all channels): ridged, horizontally streaked. */
export const makeClouds = (w = 512, h = 256) => memo(`clouds:${w}x${h}`, () => {
    const c = makeCanvas(w, h), ctx = c.getContext('2d'), img = ctx.createImageData(w, h), d = img.data
    forEachTexel(w, h, (o, x, y, z) => {
        // stretch along latitude for banded, wind-torn clouds
        const n = ridged(x * 2.0 + 5.5, y * 5.5, z * 2.0, 4)
        const soft = fbm(x * 3.0, y * 3.0 + 9.1, z * 3.0, 3)
        const a = Math.min(1, Math.max(0, (n * 0.7 + soft * 0.3 - 0.42) * 2.6))
        const px = Math.round(a * a * 255)
        d[o] = 255; d[o + 1] = 255; d[o + 2] = 255; d[o + 3] = px
    })
    ctx.putImageData(img, 0, 0)
    const tex = new THREE.CanvasTexture(c)
    tex.wrapS = THREE.RepeatWrapping
    return tex
})

/** Soft round particle sprite for the dust ring. */
export const makeSprite = (size = 32) => memo(`sprite:${size}`, () => {
    const c = makeCanvas(size, size), ctx = c.getContext('2d')
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
    g.addColorStop(0, 'rgba(255,255,255,1)')
    g.addColorStop(0.4, 'rgba(255,255,255,0.6)')
    g.addColorStop(1, 'rgba(255,255,255,0)')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, size, size)
    return new THREE.CanvasTexture(c)
})

/**
 * Earth–Venus "rose". Venus completes 13 orbits for every 8 of Earth's, so the
 * line joining the two planets, sampled over eight years, traces a five-fold
 * rose around the Sun. Circular, coplanar orbits; units are Earth's orbit (AU).
 */
export const R_EARTH = 1
export const R_VENUS = 0.7233
export const T_EARTH = 365.256
export const T_VENUS = 224.701
export const CYCLE = 8 * T_EARTH

const TAU = Math.PI * 2

/** Planet positions in the ecliptic plane on `day`, as [x, z]. */
export const positions = (day) => {
    const e = (TAU * day) / T_EARTH
    const v = (TAU * day) / T_VENUS
    return {
        earth: [R_EARTH * Math.cos(e), R_EARTH * Math.sin(e)],
        venus: [R_VENUS * Math.cos(v), R_VENUS * Math.sin(v)],
    }
}

/** Earth→Venus segments sampled evenly over one cycle: [ex, 0, ez, vx, 0, vz] per line. */
export const roseSegments = (steps) => {
    const out = new Float32Array(steps * 6)
    for (let i = 0; i < steps; i++) {
        const { earth, venus } = positions((i * CYCLE) / steps)
        out.set([earth[0], 0, earth[1], venus[0], 0, venus[1]], i * 6)
    }
    return out
}

/** The same rose as an SVG path centred on (0, 0), for the static fallback. */
export const rosePath = (steps, scale = 1) => {
    const round = (n) => Math.round(n * scale * 100) / 100
    let d = ''
    for (let i = 0; i < steps; i++) {
        const { earth, venus } = positions((i * CYCLE) / steps)
        d += `M${round(earth[0])} ${round(earth[1])}L${round(venus[0])} ${round(venus[1])}`
    }
    return d
}

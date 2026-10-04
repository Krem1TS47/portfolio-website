import { useState } from 'react'

function detect() {
    if (typeof document === 'undefined') return false
    try {
        const canvas = document.createElement('canvas')
        return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'))
    } catch {
        return false
    }
}

/** True when the browser can create a WebGL context. Evaluated once. */
export function useWebGL() {
    const [ok] = useState(detect)
    return ok
}

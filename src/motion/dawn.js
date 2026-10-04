import { motionValue } from 'motion/react'

/**
 * 0 = night (hero), 1 = day (garden). Written once per frame by the hero's
 * scroll progress (see useDawn) and read by the Backdrop and chrome. A plain
 * motion value so no React re-render happens while scrolling.
 */
export const dawn = motionValue(0)

/** Band of hero scroll progress over which the sky brightens. */
export const DAWN_BAND = [0.18, 0.62]

export const THEME_COLOR = { night: '#13111d', day: '#2d63c7' }

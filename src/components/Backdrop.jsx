import { motion } from 'motion/react'
import { dawn } from '../motion/dawn'
import HalftoneCloud from './ornaments/HalftoneCloud'

/**
 * Fixed page backdrop with two layers:
 *  - night: blue-black base, nebula washes, star tile (the hero's world)
 *  - day:   flat cobalt sky with drifting halftone clouds (the garden)
 * Only the day layer's opacity animates, driven by the `dawn` motion value.
 */
const NEBULA = [
    'radial-gradient(60% 50% at 12% 8%, oklch(74% 0.16 30 / 0.13), transparent 70%)',
    'radial-gradient(50% 45% at 88% 92%, oklch(70% 0.14 300 / 0.13), transparent 70%)',
    'radial-gradient(40% 30% at 72% 18%, oklch(86% 0.08 60 / 0.07), transparent 70%)',
].join(', ')

const STARS = [
    'radial-gradient(1px 1px at 20px 30px, oklch(96% 0.01 80 / 0.9), transparent)',
    'radial-gradient(1px 1px at 90px 120px, oklch(96% 0.01 80 / 0.7), transparent)',
    'radial-gradient(1.5px 1.5px at 160px 60px, oklch(90% 0.03 300 / 0.8), transparent)',
    'radial-gradient(1px 1px at 230px 200px, oklch(96% 0.01 80 / 0.6), transparent)',
    'radial-gradient(1px 1px at 60px 240px, oklch(92% 0.04 40 / 0.7), transparent)',
    'radial-gradient(1.5px 1.5px at 200px 150px, oklch(96% 0.01 80 / 0.5), transparent)',
    'radial-gradient(1px 1px at 120px 20px, oklch(96% 0.01 80 / 0.6), transparent)',
].join(', ')

const SKY = [
    'linear-gradient(180deg, oklch(38% 0.12 255) 0%, oklch(50% 0.185 258) 22%, oklch(53% 0.19 258) 60%, oklch(56% 0.17 256) 100%)',
].join(', ')

const CLOUDS = [
    { top: '12%', width: 260, variant: 0, dur: 160, delay: -40 },
    { top: '34%', width: 180, variant: 1, dur: 210, delay: -130 },
    { top: '58%', width: 220, variant: 0, dur: 185, delay: -90 },
    { top: '78%', width: 150, variant: 1, dur: 240, delay: -20 },
]

const Backdrop = () => (
    <div aria-hidden="true" className="fixed inset-0 -z-10 bg-bg-0 overflow-hidden">
        {/* Night */}
        <div className="absolute inset-0" style={{ background: NEBULA }} />
        <div className="absolute inset-0 opacity-35" style={{ backgroundImage: STARS, backgroundSize: '280px 280px' }} />

        {/* Day */}
        <motion.div className="absolute inset-0 will-change-[opacity]" style={{ opacity: dawn, background: SKY }}>
            {CLOUDS.map((c, i) => (
                <HalftoneCloud
                    key={i}
                    width={c.width}
                    variant={c.variant}
                    className="cloud-drift absolute text-cream"
                    style={{ top: c.top, '--dur': `${c.dur}s`, '--delay': `${c.delay}s` }}
                />
            ))}
            {/* faint horizon haze */}
            <div className="absolute inset-x-0 bottom-0 h-[30vh]" style={{ background: 'linear-gradient(180deg, transparent, oklch(80% 0.06 80 / 0.14))' }} />
        </motion.div>
    </div>
)

export default Backdrop

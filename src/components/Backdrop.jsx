/**
 * Fixed page backdrop: blue-black base, two soft nebula washes in the accent
 * hues, and a static star tile. Purely decorative; sits behind everything.
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

const Backdrop = () => (
    <div aria-hidden="true" className="fixed inset-0 -z-10 bg-bg-0 overflow-hidden">
        <div className="absolute inset-0" style={{ background: NEBULA }} />
        <div
            className="absolute inset-0 opacity-35"
            style={{ backgroundImage: STARS, backgroundSize: '280px 280px' }}
        />
    </div>
)

export default Backdrop

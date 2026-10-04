/**
 * Film-grain overlay. A data-URI SVG noise tile (rasterised once by the
 * browser) blended over the whole page. The difference between glass and
 * plastic is grain.
 */
const NOISE =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")"

const Grain = () => (
    <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-60 opacity-[0.07] mix-blend-overlay"
        style={{ backgroundImage: NOISE, backgroundSize: '240px 240px' }}
    />
)

export default Grain

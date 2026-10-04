/**
 * Static stand-in for the WebGL planet: used as the Suspense fallback, for
 * reduced-motion users, and when WebGL is unavailable. Pure CSS.
 */
const PlanetPoster = () => (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute left-1/2 top-[62%] md:left-[68%] md:top-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(70vw,22rem)] md:w-[26rem] aspect-square">
            {/* halo */}
            <div
                className="absolute -inset-[18%] rounded-full blur-2xl opacity-70"
                style={{ background: 'radial-gradient(circle, oklch(82% 0.14 36 / 0.55) 30%, oklch(70% 0.14 300 / 0.25) 55%, transparent 70%)' }}
            />
            {/* body */}
            <div
                className="absolute inset-0 rounded-full"
                style={{
                    background:
                        'radial-gradient(circle at 32% 30%, #fff3e0 0%, #ffd8eb 18%, #c97b8a 42%, #4b2f63 70%, #1a1230 100%)',
                    boxShadow: 'inset -40px -30px 80px oklch(10% 0.02 290 / 0.9), 0 0 60px oklch(74% 0.16 30 / 0.25)',
                }}
            />
            {/* ring */}
            <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[190%] h-[38%] rounded-[100%] border border-coral/40 rotate-[-12deg]"
                style={{ boxShadow: '0 0 0 10px oklch(74% 0.16 30 / 0.06), 0 0 0 22px oklch(70% 0.14 300 / 0.05)' }}
            />
        </div>
    </div>
)

export default PlanetPoster

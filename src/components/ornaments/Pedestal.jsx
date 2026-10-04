/**
 * Stepped marble pedestal with an engraved inscription. HTML so the text is
 * real, selectable, and accessible.
 */
const Pedestal = ({ label, sub, className = '' }) => (
    <div className={`paper relative flex flex-col items-center ${className}`}>
        {/* cap */}
        <div className="marble h-4 w-[82%] rounded-[2px]" style={{ boxShadow: 'inset 0 -6px 10px -6px oklch(0% 0 0 / 0.3), 0 1px 0 oklch(100% 0 0 / 0.8)' }} />
        {/* dado */}
        <div
            className="marble parchment w-[74%] px-6 py-5 text-center"
            style={{ boxShadow: 'inset 0 10px 18px -12px oklch(0% 0 0 / 0.32), inset 0 -8px 14px -10px oklch(0% 0 0 / 0.2)' }}
        >
            <p className="inscription engraved-deep text-[0.95rem] md:text-base tracking-[0.26em]">{label}</p>
            {sub && <p className="inscription engraved mt-2 text-[0.62rem] tracking-[0.3em] opacity-80">{sub}</p>}
        </div>
        {/* plinth */}
        <div className="marble h-5 w-[92%] rounded-[2px]" style={{ boxShadow: 'inset 0 -8px 12px -8px oklch(0% 0 0 / 0.35), 0 18px 30px -18px oklch(0% 0 0 / 0.45)' }} />
        <div className="marble-dark h-3 w-full rounded-[2px]" style={{ boxShadow: '0 24px 40px -20px oklch(0% 0 0 / 0.5)' }} />
    </div>
)

export default Pedestal

/**
 * Marble tablet with an arched top: the garden's reading surface.
 * Adds the `.paper` scope so text inside becomes ink.
 */
const Stele = ({ as: Tag = 'div', className = '', arch = true, children, ...rest }) => (
    <Tag
        className={`paper marble parchment relative border border-line-strong ${className}`}
        style={{
            borderRadius: arch ? '40% 40% 8px 8px / 10% 10% 8px 8px' : '8px',
            boxShadow: 'inset 0 1px 0 oklch(100% 0 0 / 0.8), 0 24px 50px -28px oklch(25% 0.04 80 / 0.45)',
        }}
        {...rest}
    >
        {children}
    </Tag>
)

export default Stele

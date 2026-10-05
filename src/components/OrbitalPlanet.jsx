/** Lightweight planet artwork shared by the sections below the WebGL hero. */
const OrbitalPlanet = ({ tone = 'coral', ring = false, className = '', style }) => (
    <div aria-hidden="true" className={`orbital-planet orbital-planet--${tone} ${ring ? 'orbital-planet--ringed' : ''} ${className}`} style={style}>
        <span className="orbital-planet__halo" />
        {ring && <span className="orbital-planet__ring orbital-planet__ring--back" />}
        <span className="orbital-planet__body"><span className="orbital-planet__texture" /></span>
        {ring && <span className="orbital-planet__ring orbital-planet__ring--front" />}
    </div>
)

export default OrbitalPlanet

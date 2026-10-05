const STARS = [
    'radial-gradient(1px 1px at 20px 30px, #fff1e6a6, transparent)',
    'radial-gradient(1px 1px at 90px 120px, #fff1e673, transparent)',
    'radial-gradient(1.5px 1.5px at 160px 60px, #c8dcff80, transparent)',
    'radial-gradient(1px 1px at 230px 200px, #ffd9b866, transparent)',
    'radial-gradient(1px 1px at 60px 240px, #fff1e659, transparent)',
    'radial-gradient(1px 1px at 200px 150px, #9b7bff80, transparent)',
].join(', ')

const Backdrop = () => (
    <div aria-hidden="true" className="space-backdrop fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 10% 20%, #f08a7a0c, transparent 55%), radial-gradient(ellipse at 90% 70%, #9b7bff12, transparent 60%)' }} />
        <div className="absolute inset-0 opacity-50" style={{ backgroundImage: STARS, backgroundSize: '310px 310px' }} />
    </div>
)

export default Backdrop

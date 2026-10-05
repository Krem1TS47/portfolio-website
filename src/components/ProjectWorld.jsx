import OrbitalPlanet from './OrbitalPlanet'

const scenes = [
    { tone: 'coral', label: 'Cloud intelligence', name: 'cloud' },
    { tone: 'gold', label: 'Connected conversations', name: 'graph' },
    { tone: 'moon', label: 'Athletic intelligence', name: 'flight' },
    { tone: 'violet', label: 'Learning in motion', name: 'quiz' },
    { tone: 'coral', label: 'A clearer view of performance', name: 'stats' },
]

const Graph = () => (
    <>
        <path d="M95 88 175 126 255 64 338 126 384 210 301 243 230 179 162 243 83 205 175 126 230 179 255 64 M162 243 301 243 M338 126 230 179 M95 88 83 205" />
        {[[95,88],[175,126],[255,64],[338,126],[384,210],[301,243],[230,179],[162,243],[83,205]].map(([x,y], i) => (
            <g key={i}>
                <circle cx={x} cy={y} r={i === 6 ? 13 : 6} className="world-node" />
                <circle cx={x} cy={y} r={i === 6 ? 23 : 12} className="world-node-halo" />
            </g>
        ))}
    </>
)

const Cloud = () => (
    <>
        <ellipse cx="240" cy="162" rx="179" ry="101" transform="rotate(-17 240 162)" />
        <path d="M78 178 148 106 M340 81 388 191 M240 248 382 192" strokeDasharray="3 6" />
        {[[78,178],[148,106],[340,81],[388,191],[240,248]].map(([x,y], i) => (
            <g key={i}>
                <circle cx={x} cy={y} r="8" className="world-node" />
                <path d={`M${x-16} ${y+24} h32 M${x-11} ${y+30} h22`} />
            </g>
        ))}
        <path d="M137 265 h35 l7-12 9 23 12-37 10 26 h43" className="world-signal" />
    </>
)

const Flight = () => (
    <>
        <path d="M57 247 Q146 20 342 92 T424 215" strokeDasharray="4 7" />
        <path d="M89 264 Q188 37 359 105" />
        <circle cx="359" cy="105" r="15" className="world-ball" />
        <path d="M345 104 Q359 109 369 95 M350 93 Q357 106 357 120" />
        <path d="M86 270 h116 M88 270 v-84 M115 253 143 232 171 242 197 195" />
        {[115,143,171,197].map((x, i) => <circle key={x} cx={x} cy={[253,232,242,195][i]} r="3" className="world-node" />)}
        <circle cx="304" cy="209" r="38" />
        <path d="M304 171 v76 M266 209 h76" />
    </>
)

const Quiz = () => (
    <>
        <circle cx="240" cy="157" r="113" strokeDasharray="2 11" />
        <path d="M155 82 A113 113 0 0 1 341 207" className="world-progress-arc" />
        {[[155,82],[351,134],[272,265],[133,197]].map(([x,y], i) => (
            <g key={i}>
                <circle cx={x} cy={y} r="17" className="world-check-circle" />
                <path d={`M${x-6} ${y} l4 4 8-9`} className="world-check" />
            </g>
        ))}
        <path d="M62 49 h49 M62 57 h32 M372 267 h43 M372 275 h25" />
    </>
)

const Stats = () => (
    <>
        <ellipse cx="238" cy="153" rx="162" ry="111" transform="rotate(23 238 153)" />
        <path d="M79 246 h304 M103 246 v-56 M147 246 v-86 M191 246 v-67 M235 246 v-113 M279 246 v-142 M323 246 v-125 M367 246 v-170" className="world-stat-bars" />
        <path d="M103 174 147 144 191 157 235 116 279 89 323 101 367 61" />
        {[[103,174],[147,144],[191,157],[235,116],[279,89],[323,101],[367,61]].map(([x,y], i) => <circle key={i} cx={x} cy={y} r="4" className="world-node" />)}
    </>
)

const drawings = { cloud: Cloud, graph: Graph, flight: Flight, quiz: Quiz, stats: Stats }

/** Each illustration is decorative; all project information stays in the article. */
const ProjectIllustration = ({ index }) => {
    const scene = scenes[index % scenes.length]
    const Drawing = drawings[scene.name]
    return (
        <div className={`project-world project-world--${scene.name}`} aria-hidden="true">
            <div className="project-world-stars" />
            <div className="project-world-planet">
                <OrbitalPlanet tone={scene.tone} ring={scene.name === 'graph' || scene.name === 'quiz'} />
            </div>
            <svg viewBox="0 0 480 320" className="project-world-map" fill="none" stroke="currentColor" strokeWidth="1">
                <Drawing />
                <path d="M28 31 h11 M33.5 25.5 v11 M442 289 h10 M447 284 v10" />
            </svg>
            <span className="project-world-label label">{scene.label}</span>
            <span className="project-world-coordinate">{String(index + 1).padStart(2, '0')} / 05</span>
        </div>
    )
}

const ProjectWorld = ({ project, index, cardRef }) => (
    <article className="project-entry" data-project-index={index} ref={cardRef} aria-labelledby={`project-${index}-title`}>
        <ProjectIllustration index={index} />
        <div className="project-entry-content">
            <p className="project-entry-meta label"><span>{project.year}</span><span>{project.organization}</span></p>
            <div className="project-entry-title-row">
                <h3 id={`project-${index}-title`}>{project.title}</h3>
                <span className="project-entry-number" aria-hidden="true">0{index + 1}</span>
            </div>
            <p className="project-entry-description">{project.description}</p>
            <ul className="project-entry-stack" aria-label="Technologies">
                {project.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
            </ul>
            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="space-link project-entry-link" data-cursor="link">
                Explore {project.title}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M7 17 17 7 M7 7 h10 v10" /></svg>
            </a>
        </div>
    </article>
)

export default ProjectWorld

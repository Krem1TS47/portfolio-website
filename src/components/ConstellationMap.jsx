import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { entranceVariants, useEntrance } from './Reveal'
import { EASE } from '../motion/presets'

// Coordinates align the decorative SVG links with the semantic HTML buttons.
// Keep the source skill labels and category order in data/stack.js unchanged.
const CONSTELLATIONS = [
    {
        color: '#f08a7a', code: 'LNG',
        points: [[16, 14], [53, 10], [87, 30], [52, 39], [13, 48], [31, 72], [67, 75], [88, 60]],
        edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 2], [3, 6], [1, 3]],
    },
    {
        color: '#9b7bff', code: 'FRM',
        points: [[15, 18], [51, 12], [82, 29], [68, 55], [31, 53], [43, 80]],
        edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [4, 5], [5, 3], [1, 4]],
    },
    {
        color: '#ffd9b8', code: 'DTA',
        points: [[15, 14], [47, 9], [82, 19], [28, 39], [67, 43], [14, 65], [45, 68], [83, 65], [66, 86]],
        edges: [[0, 1], [1, 2], [0, 3], [1, 3], [3, 4], [4, 2], [3, 5], [5, 6], [6, 4], [4, 7], [6, 8], [8, 7]],
    },
    {
        color: '#c8dcff', code: 'TLS',
        points: [[17, 17], [55, 12], [82, 34], [68, 66], [28, 72], [24, 43]],
        edges: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0], [1, 5], [5, 3]],
    },
]

const getPath = ({ points, edges }) => edges.map(([from, to]) => {
    const a = points[from]
    const b = points[to]
    return `M ${a[0]} ${a[1]} L ${b[0]} ${b[1]}`
}).join(' ')

// Keep the entrance on a separate decorative wrapper: the inner star still
// owns CSS hover/focus feedback and the button's position never changes.
const starOffset = ([x, y]) => {
    const dx = 50 - x
    const dy = 48 - y
    const distance = Math.hypot(dx, dy) || 1
    const travel = Math.min(30, Math.max(15, distance * 0.7))
    return { x: dx / distance * travel, y: dy / distance * travel }
}

const lineVariants = entranceVariants({ pathLength: 0 }, { duration: 0.65, delay: 0.22, ease: EASE })
// The line's opacity belongs to the existing group highlight CSS.
const pathVariants = Object.fromEntries(Object.entries(lineVariants).map(([name, target]) => {
    const { opacity: _opacity, ...pathTarget } = target
    return [name, pathTarget]
}))

function ConstellationRegion({ category, index, wide, active, selectedGroup, selectedSkill, onSelectGroup, onSelectSkill, onHover, onFocus }) {
    const map = CONSTELLATIONS[index]
    const entrance = useEntrance()
    const finishedLeaves = useRef(new Set())

    const leafComplete = (leaf) => (definition) => {
        if (definition !== 'show') return
        finishedLeaves.current.add(leaf)
        if (category.skills.every((skill) => finishedLeaves.current.has(skill)) && (!wide || finishedLeaves.current.has('line'))) entrance.complete()
    }

    return (
        <article
            className="constellation-region"
            style={{ '--constellation-color': map.color }}
            data-active={active}
            data-entrance={entrance.phase}
            onPointerEnter={(event) => { if (event.pointerType !== 'touch') onHover(index) }}
            onPointerLeave={() => onHover(null)}
            onFocusCapture={() => { entrance.finish(); onFocus(index) }}
            onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) onFocus(null) }}
            aria-labelledby={`constellation-heading-${index}`}
        >
            <div className="constellation-region-heading">
                <h3 id={`constellation-heading-${index}`}>
                    <button type="button" className="constellation-group-button" onClick={() => onSelectGroup(index)} aria-pressed={selectedGroup === index}>
                        <span className="constellation-group-number" aria-hidden="true">0{index + 1}</span>
                        <span>{category.title}</span>
                        <span className="constellation-group-arrow" aria-hidden="true">↗</span>
                    </button>
                </h3>
                <span className="constellation-coordinate" aria-hidden="true">{map.code} · {String(category.skills.length).padStart(2, '0')}</span>
            </div>

            <div ref={entrance.ref} className="constellation-plot">
                <svg className="constellation-links" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                    <ellipse className="constellation-orbit-guide" cx="50" cy="48" rx="44" ry="39" />
                    <path className="constellation-link-track" d={getPath(map)} vectorEffect="non-scaling-stroke" />
                    <motion.path
                        className="constellation-link-draw"
                        d={getPath(map)}
                        vectorEffect="non-scaling-stroke"
                        variants={pathVariants}
                        initial={entrance.reduced || !wide ? false : 'hidden'}
                        animate={!wide ? 'settled' : entrance.variant}
                        onAnimationComplete={leafComplete('line')}
                    />
                </svg>

                <ul className="constellation-skills" aria-label={`${category.title} skills`}>
                    {category.skills.map((skill, skillIndex) => {
                        const point = map.points[skillIndex]
                        const [x, y] = point
                        const selected = selectedGroup === index && selectedSkill === skill
                        const from = wide ? { ...starOffset(point), opacity: 0.3, scale: 0.55 } : { x: 0, y: 0, opacity: 0.4, scale: 0.8 }
                        const transition = wide
                            ? { duration: 0.65, ease: EASE, delay: skillIndex * 0.045 }
                            : { duration: 0.35, ease: EASE, delay: skillIndex * 0.025 }
                        return (
                            <li key={skill} className="constellation-skill-position" style={{ '--star-x': `${x}%`, '--star-y': `${y}%` }}>
                                <button
                                    type="button"
                                    className="constellation-skill"
                                    aria-pressed={selected}
                                    onClick={() => onSelectSkill(index, skill)}
                                >
                                    <motion.span
                                        className="constellation-star-entrance"
                                        aria-hidden="true"
                                        variants={entranceVariants(from, transition)}
                                        initial={entrance.reduced ? false : 'hidden'}
                                        animate={entrance.variant}
                                        onAnimationComplete={leafComplete(skill)}
                                    >
                                        <span className="constellation-star" />
                                    </motion.span>
                                    <span className="constellation-skill-name">{skill}</span>
                                </button>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </article>
    )
}

function ConstellationMap({ categories }) {
    const wide = useMediaQuery('(min-width: 700px)')
    const [selectedGroup, setSelectedGroup] = useState(null)
    const [selectedSkill, setSelectedSkill] = useState(null)
    const [hoveredGroup, setHoveredGroup] = useState(null)
    const [focusedGroup, setFocusedGroup] = useState(null)
    const activeGroup = focusedGroup ?? hoveredGroup ?? selectedGroup

    const selectGroup = (index) => {
        setSelectedGroup((current) => current === index ? null : index)
        setSelectedSkill(null)
    }

    const selectSkill = (groupIndex, skill) => {
        const clearing = selectedGroup === groupIndex && selectedSkill === skill
        setSelectedGroup(clearing ? null : groupIndex)
        setSelectedSkill(clearing ? null : skill)
    }

    return (
        <div className="constellation-map" data-has-active={activeGroup !== null}>
            <p className="constellation-instructions" id="constellation-instructions">
                Trace a constellation. Hover, focus, or select any star to see its related skills.
            </p>

            <div className="constellation-grid" aria-describedby="constellation-instructions">
                {categories.map((category, index) => (
                    <ConstellationRegion
                        key={category.title}
                        category={category}
                        index={index}
                        wide={wide}
                        active={activeGroup === index}
                        selectedGroup={selectedGroup}
                        selectedSkill={selectedSkill}
                        onSelectGroup={selectGroup}
                        onSelectSkill={selectSkill}
                        onHover={setHoveredGroup}
                        onFocus={setFocusedGroup}
                    />
                ))}
            </div>

            <div className="constellation-map-footer">
                <span className="constellation-footer-label">A toolkit for turning ideas into working systems.</span>
                <p className="constellation-selection" role="status" aria-live="polite" aria-atomic="true">
                    {selectedSkill ? `${selectedSkill} / ${categories[selectedGroup].title}` : selectedGroup !== null ? `${categories[selectedGroup].title} selected` : 'Explore the connections'}
                </p>
            </div>
        </div>
    )
}

export default ConstellationMap

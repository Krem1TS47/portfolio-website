import Stele from './ornaments/Stele'

const PEAR = (
    <svg viewBox="-16 -18 32 42" className="w-3 h-4" aria-hidden="true">
        <path d="M0 -17 C 8 -17 11 -9 10 -4 C 15 3 16 12 12 17 C 8 22 -8 22 -12 17 C -16 12 -15 3 -10 -4 C -11 -9 -8 -17 0 -17 Z" fill="oklch(72% 0.09 85)" />
        <path d="M0 -17 Q 6 -24 12 -18 Q 6 -12 0 -17 Z" fill="oklch(48% 0.07 120)" />
    </svg>
)

/** Mobile / narrow fallback for the pear tree: one stele per category. */
const StackGrove = ({ categories }) => (
    <div className="grid gap-6 sm:grid-cols-2">
        {categories.map((category) => (
            <Stele key={category.title} className="p-6">
                <h3 className="inscription engraved-deep text-[0.8rem] mb-4">{category.title}</h3>
                <ul className="flex flex-wrap gap-2">
                    {category.skills.map((skill) => (
                        <li key={skill} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-full border border-line-strong bg-cream/60 text-fg">
                            {PEAR}
                            {skill}
                        </li>
                    ))}
                </ul>
            </Stele>
        ))}
    </div>
)

export default StackGrove

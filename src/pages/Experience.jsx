const experiences = [
    {
        company: 'Wistron',
        location: 'Vancouver, BC',
        roles: [
            {
                title: 'Software Engineer Intern',
                period: 'May 2025 – Present',
                description: 'Placeholder description for current role at Wistron.',
            },
            {
                title: 'Research Assistant',
                period: 'Jan 2024 – Apr 2025',
                description: 'Placeholder description for previous role at Wistron.',
            },
        ],
    },
    {
        company: 'Samsung',
        location: 'Seoul, South Korea',
        roles: [
            {
                title: 'Software Developer Intern',
                period: 'May 2023 – Aug 2023',
                description: 'Placeholder description for internship at Samsung.',
            },
        ],
    },
]

const RoleCard = ({ role }) => (
    <div className="p-5 rounded-xl border border-border-color bg-secondary-bg/20 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-2">
            <h3 className="text-lg font-normal text-text-primary">{role.title}</h3>
            <span className="text-sm text-text-secondary font-light whitespace-nowrap">{role.period}</span>
        </div>
        <p className="text-text-secondary font-light leading-relaxed">{role.description}</p>
    </div>
)

const ExperienceEntry = ({ entry, isLast }) => {
    const hasMultipleRoles = entry.roles.length > 1

    return (
        <div className="relative flex gap-6">
            {/* Timeline column */}
            <div className="flex flex-col items-center flex-shrink-0 w-6">
                <div className="w-3 h-3 rounded-full bg-accent ring-4 ring-accent/20 flex-shrink-0 mt-1.5" />
                {!isLast && <div className="w-px flex-1 bg-border-color mt-2" />}
            </div>

            {/* Content */}
            <div className={`flex-1 pb-12 ${isLast ? 'pb-0' : ''}`}>
                <div className="mb-4">
                    <h2 className="text-2xl md:text-3xl font-light text-text-primary">{entry.company}</h2>
                    <p className="text-sm text-text-secondary font-light mt-1">{entry.location}</p>
                </div>

                {hasMultipleRoles ? (
                    <div className="relative ml-2">
                        {/* Branch connector */}
                        <div className="absolute left-0 top-0 bottom-0 w-px bg-border-color" />

                        <div className="space-y-4">
                            {entry.roles.map((role, index) => (
                                <div key={role.title} className="relative pl-6">
                                    {/* Horizontal branch line */}
                                    <div className="absolute left-0 top-6 w-4 h-px bg-border-color" />
                                    {/* Branch node */}
                                    <div className="absolute left-[-3px] top-[21px] w-1.5 h-1.5 rounded-full bg-accent/60" />
                                    <RoleCard role={role} />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <RoleCard role={entry.roles[0]} />
                )}
            </div>
        </div>
    )
}

const Experience = () => {
    return (
        <section className="min-h-[85vh] flex items-center justify-center px-8 py-16 page-transition relative">
            <div className="max-w-4xl w-full relative z-10">
                <h1 className="text-5xl md:text-7xl font-light text-text-primary mb-8 tracking-tight">
                    Experience
                </h1>
                <div className="h-px w-24 bg-accent mb-16"></div>

                <div>
                    {experiences.map((entry, index) => (
                        <ExperienceEntry
                            key={entry.company}
                            entry={entry}
                            isLast={index === experiences.length - 1}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Experience

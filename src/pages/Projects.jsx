const Projects = () => {
    const projects = [
        {
            year: '2026',
            organization: 'NwHacks 2026',
            title: 'Nephos',
            description: 'full-stack dashboard that provides real-time health checks and preventative AI summaries for distributed cloud services',
            githubUrl: 'https://github.com/yanxue06/Helios',
            highlights: ['AWS Lamdba + EventBridge', 'SnowflakeCortexAI', 'Vultr']
        },
        {
            year: '2025',
            organization: 'CalHacks 2025',
            title: 'Helios',
            description: 'web application producing conversation knowledge graphs live from meeting recordings.',
            githubUrl: 'https://github.com/yanxue06/Helios',
            highlights: ['VAPI', 'GeminiAPI', 'ReactFlow']
        },
        {
            year: '2025',
            organization: 'Personal Project',
            title: '1nsight',
            description: 'AI-powered volleyball analytics platform helping athletes track progress and receive tailored recommendations.',
            githubUrl: 'https://github.com/Krem1TS47/1nsight',
            highlights: ['shadcn', 'DyanmoDB', 'Supabase storage']
        },
        {
            year: '2025',
            title: 'Quizzio',
            organization: 'BCS Hacks 2025',
            description: 'Web application that gamifies student learning through quizzes and completion progress.',
            githubUrl: 'https://github.com/Kem1TS47/Quizio',
            highlights: ['React+TailwindCSS', 'Socket.io']
        },
        {
            year: '2024',
            title: 'VBStat210',
            organization: 'University of British Columbia',
            description: 'Statistics tracker for volleyball coaches to visualize team performance and players to track their progress.',
            githubUrl: 'https://github.com/Krem1TS47/VBStat210',
            highlights: ['Java', 'JSON', 'java.awt']
        }
    ]

    return (
        <section className="min-h-[85vh] flex items-center justify-center px-8 py-16 page-transition relative">
            <div className="max-w-6xl w-full relative z-10">
                <h1 className="text-5xl md:text-7xl font-light text-text-primary mb-8 tracking-tight">
                    Projects
                </h1>
                <div className="h-px w-24 bg-accent mb-16"></div>

                <div className="grid gap-10 lg:grid-cols-2">
                    {projects.map((project) => (
                        <div
                            key={project.title}
                            className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0b0813]/80 backdrop-blur-xl p-8 md:p-10 shadow-[0_25px_70px_rgba(0,0,0,0.45)]"
                        >
                            <div className="pointer-events-none absolute inset-0 opacity-60 mix-blend-screen blur-3xl bg-[radial-gradient(circle_at_25%_25%,rgba(255,173,208,0.25),transparent_55%),radial-gradient(circle_at_70%_0%,rgba(138,180,255,0.3),transparent_55%),radial-gradient(circle_at_50%_90%,rgba(255,214,164,0.3),transparent_65%)]" />
                            <div className="relative space-y-5">
                                <div className="flex items-center justify-between text-sm tracking-widest uppercase text-white/60">
                                    <span>/{project.year}</span>
                                    <span className="italic">&lt;{project.organization}&gt;</span>
                                    </div>
                                <h2 className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
                                    {project.title}
                                </h2>
                                <p className="text-white/80 font-light leading-relaxed">
                                        {project.description}
                                    </p>
                                <div className="flex flex-wrap gap-2">
                                    {project.highlights.map((highlight) => (
                                        <span
                                            key={highlight}
                                            className="px-3 py-1.5 text-xs font-medium uppercase tracking-wide rounded-full border border-white/20 text-white/90 bg-white/5"
                                        >
                                            {highlight}
                                        </span>
                                    ))}
                                </div>
                                        <a
                                            href={project.githubUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-5 py-3 text-sm font-medium text-white bg-white/10 rounded-full border border-white/30 hover:bg-white/20 hover:scale-105 transition-all duration-300"
                                >
                                    View Repository
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 7l-10 10M9 7h8v8" />
                                            </svg>
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Projects


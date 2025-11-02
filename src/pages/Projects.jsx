const Projects = () => {
    const projects = [
        {
            year: "2025",
            organization: "CalHacks 2025",
            title: "Helios",
            description: "AI fullstack application that produces conversation knowledge graphs live from meeting recordings.",
            githubUrl: "", // Add your GitHub URL here
        },
        {
            year: "2025",
            organization: "Personal Project",
            title: "1nsight",
            description: "AI fullstack application helping volleyball players improve their performance and track their progress. My continuation of VBStat210!",
            githubUrl: "", // Add your GitHub URL here
        },
        {
            year: "2025",
            title: "Quizzio",
            organization: "BCS Hacks 2025",
            description: "Web application that gamifies student learning through quizzes and rewards.",
            githubUrl: "", // Add your GitHub URL here
        },
        {
            year: "2024",
            title: "VBStat210",
            organization: "University of British Columbia",
            description: "Statistics tracker for volleyball coaches to visualize team performance and players to track their progress.",
            githubUrl: "", // Add your GitHub URL here
        },
    ]

    return (
        <section className="min-h-screen flex items-center justify-center px-8 py-20 page-transition relative">
            <div className="max-w-6xl w-full relative z-10">
                <h1 className="text-5xl md:text-7xl font-light text-text-primary mb-8 tracking-tight">
                    Projects
                </h1>
                <div className="h-px w-24 bg-accent mb-16"></div>

                {/* Projects Grid */}
                <div className="space-y-12">
                    {projects.map((project, index) => (
                        <div
                            key={index}
                            className="border border-border-color rounded-xl p-8 bg-secondary-bg/20 backdrop-blur-sm hover:border-accent/50 transition-all duration-300 hover:transform hover:scale-[1.01]"
                        >
                            <div className="grid md:grid-cols-2 gap-8">
                                {/* Project Info */}
                                <div className="space-y-4">
                                    <div className="text-accent font-light text-lg">
                                        /{project.year}
                                    </div>
                                    <div className="text-text-secondary font-light italic">
                                        &lt;{project.organization}&gt;
                                    </div>
                                    <h2 className="text-3xl md:text-4xl font-semibold text-text-primary tracking-tight">
                                        {project.title}
                                    </h2>
                                    <p className="text-text-secondary font-light text-lg leading-relaxed">
                                        {project.description}
                                    </p>
                                </div>

                                {/* GitHub Link Card */}
                                <div className="w-full h-64 md:h-full min-h-[250px] border border-border-color rounded-lg flex items-center justify-center bg-secondary-bg/30 backdrop-blur-sm overflow-hidden">
                                    {project.githubUrl ? (
                                        <a
                                            href={project.githubUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex flex-col items-center justify-center space-y-4 p-8 w-full h-full hover:bg-secondary-bg/50 transition-all duration-300 group"
                                        >
                                            <svg
                                                className="w-16 h-16 text-text-secondary group-hover:text-accent transition-colors duration-300" 
                                                fill="currentColor"
                                                viewBox="0 0 24 24"
                                                aria-label="GitHub"
                                            >
                                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                            </svg>
                                            <span className="text-text-secondary group-hover:text-accent font-light text-lg transition-colors duration-300">
                                                View on GitHub
                                            </span>
                                            <span className="text-text-secondary group-hover:text-accent font-light text-sm transition-colors duration-300 opacity-75">
                                                →
                                            </span>
                                        </a>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center space-y-4 text-text-secondary">
                                            <svg 
                                                className="w-16 h-16 opacity-50" 
                                                fill="currentColor" 
                                                viewBox="0 0 24 24"
                                            >
                                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                            </svg>
                                            <span className="font-light text-sm">
                                                GitHub link coming soon
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Projects


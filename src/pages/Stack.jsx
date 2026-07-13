const Stack = () => {
    const stackCategories = [
        {
            title: 'Languages',
            skills: ['Python', 'Javascript/Typescript', 'SQL', 'Java', 'C/C++', 'C', 'R', 'HTML/CSS']
        },
        {
            title: 'Frameworks',
            skills: ['React', 'Node.js', 'Next.js', 'Express.js', 'FastAPI', 'RestAPI']
        },
        {
            title: 'Data/ML',
            skills: ['PyTorch', 'sklearn', 'RAG', 'JupyterHub', 'Pandas', 'NumPy', 'matplotlib', 'PowerBI', 'NLP']
        },
        {
            title: 'Tools & Other',
            skills: ['Git', 'Github/Gitflow', 'AWS', 'Linux/bash', 'Docker', 'Microsoft365']
        }
    ]

    return (
        <section className="min-h-[85vh] flex items-center justify-center px-8 py-16 page-transition relative">
            <div className="max-w-6xl w-full relative z-10">
                <h1 className="text-5xl md:text-7xl font-light text-text-primary mb-8 tracking-tight">
                    My Stack
                </h1>
                <div className="h-px w-24 bg-accent mb-16"></div>

                {/* Stack Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {stackCategories.map((category, index) => (
                        <div
                            key={category.title}
                            className="p-6 rounded-xl border border-border-color bg-secondary-bg/20 backdrop-blur-sm hover:border-accent/50 transition-all duration-300"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <h3 className="text-2xl font-normal text-text-primary mb-4 tracking-tight">
                                {category.title}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {category.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className="px-3 py-1.5 text-sm font-light bg-accent/10 text-accent rounded-full border border-accent/30 hover:bg-accent/20 transition-colors duration-200"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default Stack


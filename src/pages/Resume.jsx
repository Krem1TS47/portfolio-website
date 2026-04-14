const Resume = () => {
    return (
        <section className="min-h-[50vh] flex items-center justify-center px-8 py-20 page-transition relative">
            <div className="max-w-4xl w-full relative z-10">
                <div className="flex flex-col lg:flex-row lg:items-start gap-10">
                    {/* Contact Info */}
                    <div className="space-y-6 flex-1">
                        <h2 className="text-3xl md:text-4xl font-light text-text-primary tracking-tight">
                            Let's Connect!
                        </h2>
                        <div className="grid sm:grid-cols-2 gap-4 text-text-secondary font-light">
                            <a
                                href="mailto:benbenching@gmail.com"
                                className="p-5 rounded-xl border border-border-color bg-secondary-bg/20 backdrop-blur-sm hover:border-accent transition-all duration-300 hover:scale-105 group"
                            >
                                <div className="flex items-center gap-3">
                                    <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm uppercase tracking-wide text-text-secondary/70 group-hover:text-accent">Email</p>
                                        <span className="text-text-primary">benbenching@gmail.com</span>
                                    </div>
                                </div>
                            </a>
                            <a
                                href="https://www.linkedin.com/in/benjamin-ching-926264300/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-5 rounded-xl border border-border-color bg-secondary-bg/20 backdrop-blur-sm hover:border-accent transition-all duration-300 hover:scale-105 group"
                            >
                                <div className="flex items-center gap-3">
                                    <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <div>
                                        <p className="text-sm uppercase tracking-wide text-text-secondary/70 group-hover:text-accent">LinkedIn</p>
                                        <span className="text-text-primary">/benjamin-ching</span>
                                    </div>
                                </div>
                            </a>
                            <a
                                href="https://github.com/Krem1TS47"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-5 rounded-xl border border-border-color bg-secondary-bg/20 backdrop-blur-sm hover:border-accent transition-all duration-300 hover:scale-105 group sm:col-span-2"
                            >
                                <div className="flex items-center gap-3">
                                    <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 24 24">
                                        <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                                    </svg>
                                    <div>
                                        <p className="text-sm uppercase tracking-wide text-text-secondary/70 group-hover:text-accent">GitHub</p>
                                        <span className="text-text-primary">github.com/Kem1TS47</span>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default Resume


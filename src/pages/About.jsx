import profilePhoto from '../data/benphoto.jpg'

const About = () => {
    return (
        <section className="min-h-[85vh] flex items-center justify-center px-8 py-16 page-transition relative">
            <div className="max-w-6xl w-full relative z-10">
                <h1 className="text-5xl md:text-7xl font-light text-text-primary mb-8 tracking-tight">
                    About Me
                </h1>
                <div className="h-px w-24 bg-accent mb-16"></div>

                <div className="grid md:grid-cols-2 gap-12 items-center">
                    {/* Photo Section */}
                    <div className="order-2 md:order-1">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl transform rotate-3"></div>
                            <img
                                src={profilePhoto}
                                alt="Benjamin Ching"
                                className="relative rounded-2xl shadow-2xl w-full object-cover aspect-square"
                            />
                        </div>
                    </div>

                    {/* Text Section */}
                    <div className="order-1 md:order-2 space-y-6">
                        <p className="text-lg md:text-xl font-light text-text-primary leading-relaxed">
                            Hello! I'm <span className="text-accent font-normal">Ben</span>, a computer science student at the University of British Columbia.
                            I'm deeply interested about a few things, so here's a list:
                        </p>

                        {/* Studies Bullet Points */}
                        <ul className="space-y-2">
                            {[
                                "Neural Networks and NLP",
                                "Probabilistic Models",
                                "Web Development",
                                "Data Analytics and Statistical Inference",
                                "Algorithms and Data Structures"
                            ].map((item) => (
                                <li key={item} className="flex items-center gap-3 text-lg font-light text-text-secondary">
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>

                        <p className="text-lg md:text-xl font-light text-text-secondary leading-relaxed">
                            Outside of school, you can definitely find me doing something related to volleyball. Whether it is coaching, playing in a tournament, or just watching a game, I have always been passionate about the sport and love being involved in it.
                        </p>

                        {/* YouTube Highlights Link */}
                        <a
                            href="https://www.youtube.com/watch?v=YOUR_VIDEO_ID"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 text-accent hover:text-accent/80 transition-colors duration-200 group"
                        >
                            {/* YouTube Icon */}
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                            </svg>
                            <span className="text-lg font-light group-hover:underline underline-offset-4">
                                Watch my volleyball highlights
                            </span>
                            {/* Arrow that nudges on hover */}
                            <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </section >
    )
}

export default About


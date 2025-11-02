import profilePhoto from '../data/benphoto.jpg'

const About = () => {
    return (
        <section className="min-h-screen flex items-center justify-center px-8 py-20 page-transition relative">
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
                            I'm passionate about fullstack development and software engineering, with a keen interest in creating user-friendly applications that solve real-world problems. 
                            I'm also reading up about AI/ML and data analytics.
                        </p>

                        <p className="text-lg md:text-xl font-light text-text-secondary leading-relaxed">
                            Outside of school, you can definitely find me doing something related to volleyball. Whether it is coaching, playing in a tournament, or just watching a game, I have always been passionate about the sport and love being involved in it.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default About


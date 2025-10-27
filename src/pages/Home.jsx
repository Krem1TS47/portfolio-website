import TypingAnimation from '../components/TypingAnimation'

const Home = () => {
    const phrases = [
        'AI/ML',
        'Software Engineering',
        'Fullstack Development',
        'Data Analytics'
    ]

    return (
        <main className="min-h-screen flex items-center justify-center px-8 page-transition relative overflow-hidden">
            {/* Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-gray-950 to-zinc-950"></div>
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-950/30 via-transparent to-purple-950/30"></div>
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/8 via-transparent to-transparent"></div>

            <div className="max-w-6xl w-full relative z-10">
                {/* Hero Section */}
                <div className="text-center mb-16">
                    <h1 className="text-6xl md:text-8xl font-light text-text-primary mb-6 tracking-tight">
                        Benjamin Ching
                    </h1>
                    <div className="text-xl md:text-2xl font-light text-text-secondary min-h-[2rem] flex items-center justify-center">
                        <TypingAnimation phrases={phrases} typingSpeed={100} deletingSpeed={50} pauseDuration={2000} />
                    </div>
                </div>

                {/* Placeholder for future 3D design */}
                <div className="w-full h-96 border border-gray-800 rounded-lg flex items-center justify-center bg-secondary-bg/30 backdrop-blur-sm">
                    <p className="text-text-secondary text-lg font-light">
                        Your 3D design will go here
                    </p>
                </div>

            </div>
        </main>
    )
}

export default Home


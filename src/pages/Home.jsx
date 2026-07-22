import TypingAnimation from '../components/TypingAnimation'
import InteractiveModel from '../components/InteractiveModel'

const Home = () => {
    const phrases = [
        'AI/ML',
        'Software Engineering',
        'Fullstack Development',
        'Data Analytics'
    ]

    return (
        <section className="min-h-[85vh] flex items-center justify-center px-8 pt-24 md:pt-32 page-transition relative">
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

                {/* Interactive 3D Model */}
                <div className="flex flex-col justify-center items-center space-y-6">
                    <InteractiveModel />
                </div>

            </div>
        </section>
    )
}

export default Home


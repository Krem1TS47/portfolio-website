import TypingAnimation from '../components/TypingAnimation'
import sunburnCover from '../data/sunburnCover.jpg'

const Home = () => {
    const phrases = [
        'AI/ML',
        'Software Engineering',
        'Fullstack Development',
        'Data Analytics'
    ]

    return (
        <section className="min-h-screen flex items-center justify-center px-8 page-transition relative">
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

                {/* Sunburn Cover Image */}
                <div className="flex flex-col justify-center items-center">
                    <img
                        src={sunburnCover}
                        alt="Sunburn Cover"
                        className="rounded-lg shadow-2xl max-w-md w-full object-cover mb-4"
                    />
                    <p className="text-text-secondary font-light text-sm md:text-base text-center italic">
                        Favorite song: Mona Lisa from Dominic Fike's Sunburn Album
                    </p>
                </div>

            </div>
        </section>
    )
}

export default Home


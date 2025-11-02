import { useState, useEffect } from 'react'

const FloatingSkills = () => {
    const [isDark, setIsDark] = useState(false)

    useEffect(() => {
        // Check initial theme
        setIsDark(document.documentElement.classList.contains('dark'))

        // Listen for theme changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    setIsDark(document.documentElement.classList.contains('dark'))
                }
            })
        })

        observer.observe(document.documentElement, { attributes: true })

        return () => observer.disconnect()
    }, [])

    const skills = [
        'React', 'Python', 'JavaScript', 'TypeScript', 'Node.js',
        'TailwindCSS', 'Git', 'MongoDB', 'PostgreSQL', 'Docker'
    ]

    const getGradientColor = (index) => {
        const colorIndex = index / (skills.length - 1)
        
        if (isDark) {
            // Dark mode: Light grey to light purplish pink
            const r = 200 + colorIndex * 20
            const g = 200 - colorIndex * 20
            const b = 200 + colorIndex * 10
            return `rgb(${r}, ${g}, ${b})`
        } else {
            // Light mode: Darker colors for better visibility
            const r = 100 + colorIndex * 50
            const g = 80 - colorIndex * 20
            const b = 120 + colorIndex * 40
            return `rgb(${r}, ${g}, ${b})`
        }
    }

    // Calculate Fibonacci spiral positions
    const getFibonacciPosition = (index, total) => {
        // Golden angle in radians
        const goldenAngle = Math.PI * (3 - Math.sqrt(5))
        
        // Angle for this point
        const angle = index * goldenAngle
        
        // Radius grows with square root for even spacing (Fermat's spiral)
        const radius = 15 * Math.sqrt(index + 1)
        
        // Convert polar to cartesian coordinates
        const x = radius * Math.cos(angle)
        const y = radius * Math.sin(angle)
        
        return { x, y, angle: (angle * 180 / Math.PI) % 360 }
    }

    // Calculate text size based on position in spiral (smaller as we go out)
    const getTextSize = (index) => {
        if (index < 3) return 'text-4xl'
        if (index < 6) return 'text-3xl'
        return 'text-2xl'
    }

    return (
        <div className="w-full h-96 relative overflow-hidden rounded-lg flex items-center justify-center">
            {/* Fibonacci Spiral Pattern */}
            <div className="relative w-full h-full flex items-center justify-center">
                {skills.map((skill, index) => {
                    const { x, y, angle } = getFibonacciPosition(index, skills.length)
                    const textSize = getTextSize(index)

                    return (
                        <div
                            key={skill}
                            className={`absolute ${textSize} font-light select-none transition-all duration-500 hover:scale-110 hover:font-normal`}
                            style={{
                                left: '50%',
                                top: '50%',
                                transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${(angle % 30) - 15}deg)`,
                                color: getGradientColor(index),
                                textShadow: `0 0 40px ${getGradientColor(index)}60`,
                                opacity: 0.9,
                                animation: `float-${index} ${4 + (index % 3)}s ease-in-out infinite`,
                                animationDelay: `${index * 0.1}s`,
                            }}
                        >
                            {skill}
                        </div>
                    )
                })}
            </div>

            <style>{`
                ${skills.map((_, index) => {
                    const { x, y, angle } = getFibonacciPosition(index, skills.length)
                    
                    return `
                        @keyframes float-${index} {
                            0%, 100% { 
                                transform: translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${(angle % 30) - 15}deg) translateY(0px);
                            }
                            50% { 
                                transform: translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${(angle % 30) - 15}deg) translateY(-12px);
                            }
                        }
                    `
                }).join('')}
            `}</style>
        </div>
    )
}

export default FloatingSkills


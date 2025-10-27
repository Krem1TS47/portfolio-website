import { useState, useEffect } from 'react'

const TypingAnimation = ({ phrases, typingSpeed = 100, deletingSpeed = 50, pauseDuration = 2000 }) => {
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [currentText, setCurrentText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    const currentPhrase = phrases[currentPhraseIndex]

    if (isPaused) {
      const pauseTimer = setTimeout(() => {
        setIsPaused(false)
        setIsDeleting(true)
      }, pauseDuration)
      return () => clearTimeout(pauseTimer)
    }

    if (!isDeleting && currentText === currentPhrase) {
      // Finished typing, pause before deleting
      setIsPaused(true)
      return
    }

    if (isDeleting && currentText === '') {
      // Finished deleting, move to next phrase
      setIsDeleting(false)
      setCurrentPhraseIndex((prev) => (prev + 1) % phrases.length)
      return
    }

    const timer = setTimeout(
      () => {
        if (!isDeleting) {
          // Typing
          setCurrentText(currentPhrase.substring(0, currentText.length + 1))
        } else {
          // Deleting
          setCurrentText(currentPhrase.substring(0, currentText.length - 1))
        }
      },
      isDeleting ? deletingSpeed : typingSpeed
    )

    return () => clearTimeout(timer)
  }, [currentText, isDeleting, isPaused, currentPhraseIndex, phrases, typingSpeed, deletingSpeed, pauseDuration])

  return (
    <span className="inline-flex items-center">
      {currentText}
      <span className="ml-1 w-0.5 h-8 bg-accent animate-pulse"></span>
    </span>
  )
}

export default TypingAnimation


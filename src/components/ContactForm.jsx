import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { EASE } from '../motion/presets'

const SUBMIT_URL = '/api/contact/submit'
const VERIFY_URL = '/api/contact/verify'

const inputClass =
    'w-full px-4 py-3 rounded-md glass text-fg placeholder:text-fg-3 focus:outline-hidden focus:border-coral/70 focus:bg-bg-2/70 transition-colors'

const primaryButton =
    'gradient-border inline-flex items-center justify-center px-6 py-3 rounded-full bg-coral text-bg-0 font-medium hover:bg-coral-hot transition-colors disabled:opacity-50 disabled:cursor-not-allowed'

const secondaryButton = 'px-6 py-3 rounded-full glass glass-hover text-fg-2 hover:text-fg'

const stepMotion = {
    initial: { opacity: 0, y: 16, filter: 'blur(4px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.45, ease: EASE } },
    exit: { opacity: 0, y: -12, filter: 'blur(4px)', transition: { duration: 0.25, ease: EASE } },
}

const ErrorMessage = ({ error }) => (
    <AnimatePresence initial={false}>
        {error && (
            <motion.p
                key="error"
                role="alert"
                className="text-sm text-danger"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
            >
                {error}
            </motion.p>
        )}
    </AnimatePresence>
)

const SubmitButton = ({ loading, idle, busy, disabled }) => (
    <motion.button
        type="submit"
        disabled={disabled}
        whileTap={disabled ? undefined : { scale: 0.97 }}
        data-cursor="link"
        className={primaryButton}
    >
        <span className="relative inline-grid">
            <span className="invisible [grid-area:1/1]">{idle.length > busy.length ? idle : busy}</span>
            <AnimatePresence mode="wait" initial={false}>
                <motion.span
                    key={loading ? 'busy' : 'idle'}
                    className="[grid-area:1/1]"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                >
                    {loading ? busy : idle}
                </motion.span>
            </AnimatePresence>
        </span>
    </motion.button>
)

const ContactForm = () => {
    const [step, setStep] = useState('form')
    const [formData, setFormData] = useState({ name: '', email: '', message: '' })
    const [otp, setOtp] = useState('')
    const [token, setToken] = useState('')
    const [statusMessage, setStatusMessage] = useState('')
    const [error, setError] = useState('')
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        const hash = window.location.hash
        if (hash.includes('contact=verified')) {
            setStep('success')
            setStatusMessage('Your message has been verified and sent.')
            window.history.replaceState(null, '', '#contact')
        } else if (hash.includes('contact=expired')) {
            setError('Verification link expired. Please submit the form again.')
            window.history.replaceState(null, '', '#contact')
        }
    }, [])

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            const response = await fetch(SUBMIT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Unable to submit form.')
            }

            setToken(data.token)
            setStep('verify')
            setStatusMessage(data.message)
        } catch (submitError) {
            setError(submitError.message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleVerify = async (event) => {
        event.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            const response = await fetch(VERIFY_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, otp }),
            })
            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Verification failed.')
            }

            setStep('success')
            setStatusMessage(data.message)
            setOtp('')
        } catch (verifyError) {
            setError(verifyError.message)
        } finally {
            setIsLoading(false)
        }
    }

    const resetForm = () => {
        setStep('form')
        setFormData({ name: '', email: '', message: '' })
        setOtp('')
        setToken('')
        setStatusMessage('')
        setError('')
    }

    return (
        <AnimatePresence mode="wait" initial={false}>
            {step === 'success' && (
                <motion.div key="success" {...stepMotion} className="glass rounded-lg p-6 space-y-4">
                    <div className="flex items-start gap-4">
                        <span className="shrink-0 w-10 h-10 rounded-full border border-coral/50 flex items-center justify-center text-coral">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden="true">
                                <motion.path
                                    d="M5 12.5l4.5 4.5L19 7.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ duration: 0.6, ease: EASE, delay: 0.2 }}
                                />
                            </svg>
                        </span>
                        <div className="space-y-3">
                            <p className="text-fg">{statusMessage}</p>
                            <button
                                type="button"
                                onClick={resetForm}
                                data-cursor="link"
                                className="text-coral hover:text-coral-hot transition-colors"
                            >
                                Send another message
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {step === 'verify' && (
                <motion.div key="verify" {...stepMotion} className="space-y-6">
                    <p className="text-fg-2">{statusMessage}</p>
                    <form onSubmit={handleVerify} className="space-y-4">
                        <div>
                            <label htmlFor="otp" className="label mb-2.5 block">
                                Verification code
                            </label>
                            <input
                                id="otp"
                                name="otp"
                                type="text"
                                inputMode="numeric"
                                autoComplete="one-time-code"
                                maxLength={6}
                                required
                                value={otp}
                                onChange={(event) => setOtp(event.target.value.replace(/\D/g, ''))}
                                className={`${inputClass} font-mono tracking-[0.4em]`}
                                placeholder="••••••"
                            />
                        </div>
                        <ErrorMessage error={error} />
                        <div className="flex flex-wrap gap-4">
                            <SubmitButton
                                loading={isLoading}
                                idle="Verify & Send"
                                busy="Verifying..."
                                disabled={isLoading || otp.length !== 6}
                            />
                            <button type="button" onClick={resetForm} data-cursor="link" className={secondaryButton}>
                                Start over
                            </button>
                        </div>
                        <p className="text-sm text-fg-3">
                            You can also verify by clicking the link in your email.
                        </p>
                    </form>
                </motion.div>
            )}

            {step === 'form' && (
                <motion.form key="form" {...stepMotion} onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="name" className="label mb-2.5 block">
                                Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={handleChange}
                                className={inputClass}
                                placeholder="Your name"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="label mb-2.5 block">
                                Email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                value={formData.email}
                                onChange={handleChange}
                                className={inputClass}
                                placeholder="you@example.com"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="message" className="label mb-2.5 block">
                            Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            required
                            rows={5}
                            value={formData.message}
                            onChange={handleChange}
                            className={`${inputClass} resize-y min-h-[120px]`}
                            placeholder="What would you like to discuss?"
                        />
                    </div>
                    <ErrorMessage error={error} />
                    <div className="flex flex-wrap items-center gap-4 pt-2">
                        <SubmitButton loading={isLoading} idle="Send Message" busy="Sending code..." disabled={isLoading} />
                        <p className="text-sm text-fg-3">
                            A verification code will be sent to your email before the message reaches my inbox.
                        </p>
                    </div>
                </motion.form>
            )}
        </AnimatePresence>
    )
}

export default ContactForm

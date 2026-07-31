import { useEffect, useState } from 'react'

const SUBMIT_URL = '/api/contact/submit'
const VERIFY_URL = '/api/contact/verify'

const inputClass =
    'w-full px-4 py-3 rounded-xl border border-border-color bg-secondary-bg/20 backdrop-blur-sm text-text-primary font-light placeholder:text-text-secondary/60 focus:outline-none focus:border-accent transition-colors'

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

    if (step === 'success') {
        return (
            <div className="p-6 rounded-xl border border-border-color bg-secondary-bg/20 backdrop-blur-sm space-y-4">
                <p className="text-text-primary font-light">{statusMessage}</p>
                <button
                    type="button"
                    onClick={resetForm}
                    className="text-accent hover:text-accent/80 transition-colors font-light"
                >
                    Send another message
                </button>
            </div>
        )
    }

    if (step === 'verify') {
        return (
            <div className="space-y-6">
                <p className="text-text-secondary font-light">{statusMessage}</p>
                <form onSubmit={handleVerify} className="space-y-4">
                    <div>
                        <label htmlFor="otp" className="block text-sm text-text-secondary font-light mb-2">
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
                            className={inputClass}
                            placeholder="Enter 6-digit code"
                        />
                    </div>
                    {error && <p className="text-sm text-red-500 font-light">{error}</p>}
                    <div className="flex flex-wrap gap-4">
                        <button
                            type="submit"
                            disabled={isLoading || otp.length !== 6}
                            className="px-6 py-3 rounded-xl border border-accent bg-accent/10 text-text-primary font-light hover:bg-accent/20 transition-colors disabled:opacity-50"
                        >
                            {isLoading ? 'Verifying...' : 'Verify & Send'}
                        </button>
                        <button
                            type="button"
                            onClick={resetForm}
                            className="px-6 py-3 rounded-xl border border-border-color text-text-secondary font-light hover:border-accent transition-colors"
                        >
                            Start over
                        </button>
                    </div>
                    <p className="text-sm text-text-secondary font-light">
                        You can also verify by clicking the link in your email.
                    </p>
                </form>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label htmlFor="name" className="block text-sm text-text-secondary font-light mb-2">
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
                <label htmlFor="email" className="block text-sm text-text-secondary font-light mb-2">
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
            <div>
                <label htmlFor="message" className="block text-sm text-text-secondary font-light mb-2">
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
            {error && <p className="text-sm text-red-500 font-light">{error}</p>}
            <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3 rounded-xl border border-accent bg-accent/10 text-text-primary font-light hover:bg-accent/20 transition-colors disabled:opacity-50"
            >
                {isLoading ? 'Sending code...' : 'Send Message'}
            </button>
            <p className="text-sm text-text-secondary font-light">
                A verification code will be sent to your email before the message reaches my inbox.
            </p>
        </form>
    )
}

export default ContactForm

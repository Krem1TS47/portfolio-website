import {
    buildSubmissionPayload,
    createSubmissionToken,
    generateOTP,
    getEnv,
    getFromEmail,
    jsonResponse,
    sendVerificationEmail,
} from './_shared.mjs'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function handler(event) {
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
            },
            body: '',
        }
    }

    if (event.httpMethod !== 'POST') {
        return jsonResponse(405, { error: 'Method not allowed' })
    }

    try {
        const { resendApiKey, jwtSecret, siteUrl } = getEnv()
        const { name, email, message } = JSON.parse(event.body || '{}')

        const trimmedName = name?.trim()
        const trimmedEmail = email?.trim().toLowerCase()
        const trimmedMessage = message?.trim()

        if (!trimmedName || !trimmedEmail || !trimmedMessage) {
            return jsonResponse(400, { error: 'Name, email, and message are required.' })
        }

        if (!EMAIL_REGEX.test(trimmedEmail)) {
            return jsonResponse(400, { error: 'Please enter a valid email address.' })
        }

        if (trimmedMessage.length > 5000) {
            return jsonResponse(400, { error: 'Message must be 5000 characters or fewer.' })
        }

        const otp = generateOTP()
        const payload = buildSubmissionPayload({
            name: trimmedName,
            email: trimmedEmail,
            message: trimmedMessage,
            otp,
        })
        const token = createSubmissionToken(payload, jwtSecret)
        const magicLink = `${siteUrl}/api/contact/verify?token=${encodeURIComponent(token)}`

        await sendVerificationEmail({
            resendApiKey,
            fromEmail: getFromEmail(),
            to: trimmedEmail,
            otp,
            magicLink,
        })

        return jsonResponse(200, {
            status: 'pending',
            token,
            message: 'Verification code sent. Check your email to confirm.',
        })
    } catch (error) {
        console.error('submit-contact error:', error)
        const message = error.message === 'Missing required environment variables'
            ? 'Contact form is not configured yet.'
            : 'Unable to send verification email. Please try again later.'

        return jsonResponse(500, { error: message })
    }
}

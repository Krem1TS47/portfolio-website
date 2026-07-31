import {
    forwardMessageToInbox,
    getEnv,
    getFromEmail,
    hashOTP,
    isExpired,
    jsonResponse,
    verifySubmissionToken,
} from './_shared.mjs'

async function deliverMessage(payload, env) {
    await forwardMessageToInbox({
        resendApiKey: env.resendApiKey,
        fromEmail: getFromEmail(),
        ownerEmail: env.ownerEmail,
        submission: {
            name: payload.name,
            email: payload.email,
            message: payload.message,
        },
    })
}

export async function handler(event) {
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            },
            body: '',
        }
    }

    try {
        const env = getEnv()

        if (event.httpMethod === 'GET') {
            const token = event.queryStringParameters?.token
            if (!token) {
                return jsonResponse(400, { error: 'Missing verification token.' })
            }

            const payload = verifySubmissionToken(token, env.jwtSecret)
            if (!payload || isExpired(payload)) {
                return {
                    statusCode: 302,
                    headers: { Location: '/#resume?contact=expired' },
                    body: '',
                }
            }

            await deliverMessage(payload, env)

            return {
                statusCode: 302,
                headers: { Location: '/#resume?contact=verified' },
                body: '',
            }
        }

        if (event.httpMethod !== 'POST') {
            return jsonResponse(405, { error: 'Method not allowed' })
        }

        const { token, otp } = JSON.parse(event.body || '{}')
        if (!token || !otp) {
            return jsonResponse(400, { error: 'Token and verification code are required.' })
        }

        const payload = verifySubmissionToken(token, env.jwtSecret)
        if (!payload || isExpired(payload)) {
            return jsonResponse(400, { error: 'Verification code expired. Please submit again.' })
        }

        if (hashOTP(String(otp).trim()) !== payload.otpHash) {
            return jsonResponse(400, { error: 'Invalid verification code.' })
        }

        await deliverMessage(payload, env)

        return jsonResponse(200, {
            status: 'verified',
            message: 'Message sent successfully.',
        })
    } catch (error) {
        console.error('verify-contact error:', error)
        const message = error.message === 'Missing required environment variables'
            ? 'Contact form is not configured yet.'
            : 'Unable to verify message. Please try again later.'

        return jsonResponse(500, { error: message })
    }
}

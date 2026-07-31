import crypto from 'crypto'

const TOKEN_TTL_MS = 15 * 60 * 1000
const RESEND_API_URL = 'https://api.resend.com/emails'

export function jsonResponse(statusCode, body) {
    return {
        statusCode,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify(body),
    }
}

export function getEnv() {
    const resendApiKey = process.env.RESEND_API_KEY
    const ownerEmail = process.env.CONTACT_OWNER_EMAIL
    const jwtSecret = process.env.CONTACT_JWT_SECRET
    const siteUrl = process.env.URL || process.env.SITE_URL || 'http://localhost:8888'

    if (!resendApiKey || !ownerEmail || !jwtSecret) {
        throw new Error('Missing required environment variables')
    }

    return { resendApiKey, ownerEmail, jwtSecret, siteUrl }
}

export function generateOTP() {
    return String(crypto.randomInt(100000, 999999))
}

export function hashOTP(otp) {
    return crypto.createHash('sha256').update(otp).digest('hex')
}

export function createSubmissionToken(payload, secret) {
    const data = Buffer.from(JSON.stringify(payload)).toString('base64url')
    const signature = crypto.createHmac('sha256', secret).update(data).digest('base64url')
    return `${data}.${signature}`
}

export function verifySubmissionToken(token, secret) {
    const [data, signature] = token.split('.')
    if (!data || !signature) return null

    const expected = crypto.createHmac('sha256', secret).update(data).digest('base64url')
    const sigBuffer = Buffer.from(signature)
    const expectedBuffer = Buffer.from(expected)

    if (sigBuffer.length !== expectedBuffer.length) return null
    if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) return null

    try {
        return JSON.parse(Buffer.from(data, 'base64url').toString())
    } catch {
        return null
    }
}

export function buildSubmissionPayload({ name, email, message, otp }) {
    return {
        name,
        email,
        message,
        otpHash: hashOTP(otp),
        exp: Date.now() + TOKEN_TTL_MS,
    }
}

export function isExpired(payload) {
    return !payload?.exp || Date.now() > payload.exp
}

async function sendEmail({ resendApiKey, fromEmail, to, subject, html, replyTo }) {
    const response = await fetch(RESEND_API_URL, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            from: fromEmail,
            to,
            subject,
            html,
            ...(replyTo ? { reply_to: replyTo } : {}),
        }),
    })

    if (!response.ok) {
        const errorBody = await response.text()
        throw new Error(`Resend API error: ${errorBody}`)
    }
}

export async function sendVerificationEmail({ resendApiKey, fromEmail, to, otp, magicLink }) {
    await sendEmail({
        resendApiKey,
        fromEmail,
        to,
        subject: 'Verify your message to Benjamin Ching',
        html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #1a1a1a;">
                <h2 style="font-weight: 400;">Verify your email</h2>
                <p>Enter this code on the contact form to send your message:</p>
                <p style="font-size: 32px; letter-spacing: 6px; font-weight: 600; color: #8b5cf6;">${otp}</p>
                <p style="color: #666;">This code expires in 15 minutes.</p>
                <p>Or verify instantly by clicking the link below:</p>
                <p><a href="${magicLink}" style="color: #8b5cf6;">Verify and send message</a></p>
            </div>
        `,
    })
}

export async function forwardMessageToInbox({ resendApiKey, fromEmail, ownerEmail, submission }) {
    await sendEmail({
        resendApiKey,
        fromEmail,
        to: ownerEmail,
        replyTo: submission.email,
        subject: `Portfolio contact from ${submission.name}`,
        html: `
            <div style="font-family: sans-serif; max-width: 560px; color: #1a1a1a;">
                <h2 style="font-weight: 400;">New verified contact message</h2>
                <p><strong>From:</strong> ${escapeHtml(submission.name)} &lt;${escapeHtml(submission.email)}&gt;</p>
                <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 16px 0;" />
                <p style="white-space: pre-wrap;">${escapeHtml(submission.message)}</p>
            </div>
        `,
    })
}

export function getFromEmail() {
    return process.env.CONTACT_FROM_EMAIL || 'Portfolio Contact <onboarding@resend.dev>'
}

export function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;')
}

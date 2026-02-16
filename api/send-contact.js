// api/send-contact.js – sends contact form via Resend from contact@openbusinessrecord.org
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
// Resend: use email only to avoid "string did not match the expected pattern" on display-name format
const FROM = 'contact@openbusinessrecord.org';
const DEFAULT_TO = 'contact@openbusinessrecord.org';
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
    const origin = req.headers.origin || '';
    const allowed = ['https://openbusinessrecord.github.io', 'https://openbusinessrecord.org', 'http://localhost:3000', 'http://127.0.0.1:5500'];
    if (allowed.some(o => origin === o || origin.startsWith('http://localhost') || origin.startsWith('http://127.0.0.1')))
        res.setHeader('Access-Control-Allow-Origin', origin);
    else
        res.setHeader('Access-Control-Allow-Origin', 'https://openbusinessrecord.org');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS')
        return res.status(200).end();
    if (req.method !== 'POST')
        return res.status(405).json({ error: 'Method Not Allowed' });

    if (!process.env.RESEND_API_KEY)
        return res.status(500).json({ error: 'Contact form is not configured (RESEND_API_KEY). Please email contact@openbusinessrecord.org directly.' });

    let body = req.body;
    if (typeof body === 'string') {
        try { body = JSON.parse(body); } catch (_) { return res.status(400).json({ error: 'Invalid request body.' }); }
    }
    const { name, email, message } = body || {};
    if (!email || !message) {
        return res.status(400).json({ error: 'Email and message are required.' });
    }

    const replyTo = String(email).trim().toLowerCase();
    if (!EMAIL_REGEX.test(replyTo)) {
        return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    const toAddress = (process.env.CONTACT_TO_EMAIL || DEFAULT_TO).trim().toLowerCase();
    if (!EMAIL_REGEX.test(toAddress)) {
        return res.status(500).json({ error: 'Server contact address is misconfigured. Please email contact@openbusinessrecord.org directly.' });
    }

    const subjectSnippet = String(message).replace(/\s+/g, ' ').trim().slice(0, 50);
    const subject = 'OBR Contact: ' + (name ? String(name).trim() + ' – ' : '') + subjectSnippet + (message.length > 50 ? '…' : '');

    const html = [
        '<p><strong>From:</strong> ' + (name ? escapeHtml(name) + ' &lt;' + escapeHtml(replyTo) + '&gt;' : escapeHtml(replyTo)) + '</p>',
        '<p><strong>Message:</strong></p>',
        '<pre style="white-space:pre-wrap;font-family:inherit;">' + escapeHtml(message) + '</pre>'
    ].join('');

    try {
        const { data, error } = await resend.emails.send({
            from: FROM,
            to: [toAddress],
            replyTo,
            subject,
            html
        });
        if (error) {
            const msg = (error && (error.message || (typeof error === 'string' ? error : null))) || 'Failed to send email';
            return res.status(400).json({ error: msg });
        }
        return res.status(200).json({ ok: true, id: data?.id });
    } catch (e) {
        return res.status(500).json({ error: e.message || 'Failed to send email' });
    }
}

function escapeHtml(s) {
    if (typeof s !== 'string') return '';
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

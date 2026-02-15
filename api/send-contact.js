// api/send-contact.js – sends contact form via Resend from contact@mail.openbusinessrecord.org
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = 'Open Business Record <contact@mail.openbusinessrecord.org>';
const TO = process.env.CONTACT_TO_EMAIL || 'contact@mail.openbusinessrecord.org';

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
        return res.status(500).json({ error: 'Contact form is not configured (RESEND_API_KEY). Please email contact@mail.openbusinessrecord.org directly.' });

    const { name, email, message } = req.body || {};
    if (!email || !message) {
        return res.status(400).json({ error: 'Email and message are required.' });
    }

    const html = [
        '<p><strong>From:</strong> ' + (name ? escapeHtml(name) + ' &lt;' + escapeHtml(email) + '&gt;' : escapeHtml(email)) + '</p>',
        '<p><strong>Message:</strong></p>',
        '<pre style="white-space:pre-wrap;font-family:inherit;">' + escapeHtml(message) + '</pre>'
    ].join('');

    try {
        const { data, error } = await resend.emails.send({
            from: FROM,
            to: [TO],
            replyTo: email,
            subject: 'OBR Contact: ' + (name ? name + ' – ' : '') + (message.slice(0, 50) + (message.length > 50 ? '…' : '')),
            html
        });
        if (error)
            return res.status(400).json({ error: error.message || 'Failed to send email' });
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

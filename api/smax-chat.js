/**
 * Vercel Serverless Function — Smax AI Chat Proxy
 *
 * POST /api/smax-chat
 * Proxies to https://smaxai.cdp.vn/api/chat to avoid CORS issues in browser.
 * Collects full response and returns as JSON { text }.
 *
 * Request body: { query: string, lang: string, history: array }
 */

const SMAX_API_URL = 'https://smaxai.cdp.vn/api/chat';
const SMAX_API_KEY = process.env.SMAX_API_KEY || '3a914320759947da9124f10b1b7d53df';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    // Collect body
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const body = chunks.join('');
    const payload = JSON.parse(body);

    const upstream = await fetch(SMAX_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': SMAX_API_KEY,
      },
      body: JSON.stringify({
        query: payload.query,
        lang: payload.lang || 'vi',
        history: payload.history || [],
      }),
    });

    if (!upstream.ok) {
      const errText = await upstream.text();
      return res.status(upstream.status).json({ error: errText });
    }

    // Read as plain text (not SSE)
    const text = await upstream.text();

    return res.status(200).json({ text });

  } catch (err) {
    console.error('[smax-chat] Error:', err);
    return res.status(500).json({ error: 'Proxy error: ' + err.message });
  }
}

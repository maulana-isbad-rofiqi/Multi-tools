const axios = require('axios');
const cheerio = require('cheerio');
const crypto = require('crypto');

// --- Helper Functions ---
const k = { "enc": "GJvE5RZIxrl9SuNrAtgsvCfWha3M7NGC", "dec": "H3quWdWoHLX5bZSlyCYAnvDFara25FIu" };
const cryptoProc = (type, data) => {
    const key = Buffer.from(k[type]);
    const iv = Buffer.from(k[type].slice(0, 16));
    const cipher = (type === 'enc' ? crypto.createCipheriv : crypto.createDecipheriv)('aes-256-cbc', key, iv);
    let rchipher = cipher.update(data, ...(type === 'enc' ? ['utf8', 'base64'] : ['base64', 'utf8']));
    rchipher += cipher.final(type === 'enc' ? 'base64' : 'utf8');
    return rchipher;
};

// --- Logic Tools ---
async function tiktokDl(url) {
    // Logic Savetik
    const { data } = await axios.post('https://savetik.app/requests', { bdata: cryptoProc('enc', url) }, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Android 15; Mobile; SM-D639N)', 'Content-Type': 'application/json' }
    });
    if (!data || data.status !== 'success') throw new Error('TikTok fetch failed.');
    return { author: data.username, thumbnail: data.thumbnailUrl, video: cryptoProc('dec', data.data), audio: data.mp3 };
}

async function spotifyDl(url) {
    // Logic Spotdown
    const { data: s } = await axios.get(`https://spotdown.org/api/song-details?url=${encodeURIComponent(url)}`, {
        headers: { origin: 'https://spotdown.org', referer: 'https://spotdown.org/' }
    });
    const song = s.songs[0];
    const { data } = await axios.post('https://spotdown.org/api/download', { url: song.url }, {
        headers: { origin: 'https://spotdown.org', referer: 'https://spotdown.org/' }, responseType: 'arraybuffer'
    });
    // Return base64 audio for frontend playback
    return {
        title: song.title, artist: song.artist, cover: song.thumbnail,
        audioBase64: Buffer.from(data).toString('base64')
    };
}

async function teradl(url) {
    const { data } = await axios.get('https://tera2.sylyt93.workers.dev/info', {
        params: { s: url.match(/surl=([a-zA-Z0-9_-]+)/)?.[1] || url.split('/s/')[1] }
    });
    return data;
}

// --- API Handler ---
export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    if (req.method === 'OPTIONS') return res.status(200).end();

    const { type, url } = req.body || {};
    if (!url) return res.status(400).json({ error: 'URL required' });

    try {
        let result;
        if (type === 'tiktok') result = await tiktokDl(url);
        else if (type === 'spotify') result = await spotifyDl(url);
        else if (type === 'terabox') result = await teradl(url);
        else return res.status(400).json({ error: 'Invalid type' });

        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

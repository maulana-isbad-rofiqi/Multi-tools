const axios = require('axios');
const cheerio = require('cheerio');
const crypto = require('crypto');

async function unrestrictedai(prompt, style = 'anime') {
    const { data: html } = await axios.get('https://unrestrictedaiimagegenerator.com/');
    const $ = cheerio.load(html);
    const nonce = $('input[name="_wpnonce"]').attr('value');
    
    const { data } = await axios.post('https://unrestrictedaiimagegenerator.com/', new URLSearchParams({
        generate_image: true, image_description: prompt, image_style: style, _wpnonce: nonce
    }).toString());
    
    const img = cheerio.load(data)('img#resultImage').attr('src');
    if (!img) throw new Error('AI Image Failed');
    return img;
}

class ElevenLabs {
    constructor() { this.ins = axios.create({ baseURL: "https://tts1.squinty.art/api/v1" }); }
    async generate(text) {
        // Simple login logic simulation or hardcoded token fetch if needed
        // For brevity, using the provided logic condensed
        const randHex = l => crypto.randomUUID().replace(/-/g,'').slice(0,l);
        const loginData = { build: '14', deviceId: randHex(16), email: `user${randHex(6)}@gmail.com`, platform: 'android', version: '1.1.4' };
        const z = await this.ins.post("/login/login", loginData);
        this.ins.defaults.headers.common.authorization = "Bearer " + z.data.token;
        return this.ins.post("/generate/generate", { 
            text: text, voiceId: "2EiwWnXFnvU5JabPnv8n", modelId: "eleven_turbo_v2_5" 
        }).then(i => i.data);
    }
}

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { type, prompt } = req.body || {};

    try {
        if (type === 'image') {
            const url = await unrestrictedai(prompt);
            return res.status(200).json({ success: true, url });
        } else if (type === 'tts') {
            const tts = new ElevenLabs();
            const audioData = await tts.generate(prompt);
            return res.status(200).json({ success: true, audio: audioData });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

export default async function handler(req, res) {
    // Setup CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') return res.status(200).end();
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method error' });

    try {
        const { image } = req.body;
        if (!image) return res.status(400).json({ error: 'No Image' });

        // 1. Upload ke Telegra (Function didalam)
        const imageUrl = await uploadToTelegraph(image);

        // 2. Panggil API RemoveBG
        const apiUrl = `https://api.ootaizumi.web.id/tools/removebg?imageUrl=${encodeURIComponent(imageUrl)}`;
        const apiRes = await fetch(apiUrl);
        const data = await apiRes.json();

        if (!data.status) throw new Error('API RemoveBG Error');

        return res.status(200).json({
            success: true,
            result: data.result,
            creator: "Itsbad"
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// Fungsi Upload Sakti (Tanpa FormData Library yg ribet)
async function uploadToTelegraph(base64Data) {
    const base64Content = base64Data.split(',')[1];
    const buffer = Buffer.from(base64Content, 'base64');

    // Buat body request manual (Boundary)
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
    const start = `--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="blob"\r\nContent-Type: image/jpeg\r\n\r\n`;
    const end = `\r\n--${boundary}--`;

    const body = Buffer.concat([
        Buffer.from(start, 'utf-8'),
        buffer,
        Buffer.from(end, 'utf-8')
    ]);

    const response = await fetch('https://telegra.ph/upload', {
        method: 'POST',
        headers: {
            'Content-Type': `multipart/form-data; boundary=${boundary}`,
            'Content-Length': body.length
        },
        body: body
    });

    const result = await response.json();
    if (result && result[0] && result[0].src) {
        return 'https://telegra.ph' + result[0].src;
    }
    throw new Error('Gagal upload ke Telegra.ph');
}

// api/removebg.js

// Fungsi helper untuk upload ke Telegra.ph (Server Side Upload)
async function uploadToTelegraph(base64Data) {
    // 1. Convert Base64 ke Blob/Buffer
    const base64Content = base64Data.split(',')[1];
    const mimeType = base64Data.split(';')[0].split(':')[1];
    const buffer = Buffer.from(base64Content, 'base64');
    
    // 2. Buat FormData
    const formData = new FormData();
    const blob = new Blob([buffer], { type: mimeType });
    formData.append('file', blob, 'image.jpg');

    // 3. Upload ke Telegra.ph
    const response = await fetch('https://telegra.ph/upload', {
        method: 'POST',
        body: formData
    });
    
    const result = await response.json();
    if (result && result[0] && result[0].src) {
        return 'https://telegra.ph' + result[0].src;
    } else {
        throw new Error('Gagal upload ke server sementara.');
    }
}

export default async function handler(req, res) {
    // Setup CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Pastikan method POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { image } = req.body;

        if (!image) {
            return res.status(400).json({ error: 'Gambar tidak ditemukan' });
        }

        // 1. Upload gambar dari User ke Telegra.ph via Server Vercel
        const publicUrl = await uploadToTelegraph(image);
        
        // 2. Panggil API Ootaizumi RemoveBG
        const endpoint = `https://api.ootaizumi.web.id/tools/removebg?imageUrl=${encodeURIComponent(publicUrl)}`;
        const apiRes = await fetch(endpoint);
        const data = await apiRes.json();

        if (!data || !data.status) {
            return res.status(500).json({ error: 'API RemoveBG gagal memproses gambar.' });
        }

        // 3. Sukses
        return res.status(200).json({ 
            success: true, 
            result: data.result,
            creator: "Itsbad"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: error.message || 'Internal Server Error' });
    }
}

// api/removebg.js
export default async function handler(req, res) {
    // Mengizinkan CORS agar bisa diakses dari frontend
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
    );

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    const { imageUrl } = req.query;

    if (!imageUrl) {
        return res.status(400).json({ error: 'Parameter imageUrl diperlukan' });
    }

    try {
        // Logika sesuai script bot kamu, tapi diadaptasi untuk web
        const endpoint = `https://api.ootaizumi.web.id/tools/removebg?imageUrl=${encodeURIComponent(imageUrl)}`;
        const response = await fetch(endpoint);
        const data = await response.json();

        if (!data || !data.status) {
            return res.status(500).json({ error: 'Gagal menghapus background dari API pusat.' });
        }

        // Mengembalikan URL hasil gambar
        return res.status(200).json({ 
            success: true, 
            result: data.result,
            creator: "Itsbad"
        });

    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}

// api/remove.js (Versi Aman / CommonJS)

// Kita gunakan module.exports agar Vercel langsung paham tanpa error
module.exports = async (req, res) => {
    // 1. Setup Header agar tidak kena blokir (CORS)
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle pre-flight request
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Hanya terima method POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { image } = req.body;
        
        if (!image) {
            return res.status(400).json({ error: 'No image provided' });
        }

        // 2. Proses Gambar (Menggunakan Global Fetch Node 18+)
        // Ambil data base64 setelah tanda koma
        const base64Data = image.split(',')[1]; 
        const buffer = Buffer.from(base64Data, 'base64');
        
        // Buat Blob manual dari buffer
        const blob = new Blob([buffer], { type: 'image/jpeg' });

        // 3. Upload ke Catbox (Jembatan)
        const formData = new FormData();
        formData.append('reqtype', 'fileupload');
        formData.append('fileToUpload', blob, 'image.jpg');

        const uploadRes = await fetch('https://catbox.moe/user/api.php', {
            method: 'POST',
            body: formData
        });

        if (!uploadRes.ok) throw new Error('Gagal upload ke server perantara');
        const uploadedUrl = await uploadRes.text();

        // 4. Kirim URL ke API Penghapus Background
        const apiUrl = `https://api.ootaizumi.web.id/tools/removebg?imageUrl=${encodeURIComponent(uploadedUrl)}`;
        const apiRes = await fetch(apiUrl);
        const apiJson = await apiRes.json();

        if (!apiJson.status) throw new Error('Gagal menghapus background dari API pusat');

        // 5. Sukses
        return res.status(200).json({ 
            success: true, 
            result: apiJson.result 
        });

    } catch (error) {
        console.error("Server Error:", error);
        return res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
};

export const config = {
    api: {
        bodyParser: {
            sizeLimit: '4mb', // Batas ukuran file
        },
    },
};

export default async function handler(request, response) {
    // Izinkan akses dari mana saja
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (request.method === 'OPTIONS') {
        return response.status(200).end();
    }

    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { image } = request.body;
        
        if (!image) {
            return response.status(400).json({ error: 'No image provided' });
        }

        // 1. Convert Base64 ke Blob untuk diupload ke Catbox
        // Kita buang prefix "data:image/jpeg;base64," kalau ada
        const base64Data = image.split(',')[1]; 
        const buffer = Buffer.from(base64Data, 'base64');
        const blob = new Blob([buffer], { type: 'image/jpeg' });

        // 2. Upload ke Catbox (Server to Server)
        const formData = new FormData();
        formData.append('reqtype', 'fileupload');
        formData.append('fileToUpload', blob, 'image.jpg');

        const uploadRes = await fetch('https://catbox.moe/user/api.php', {
            method: 'POST',
            body: formData
        });

        if (!uploadRes.ok) throw new Error('Gagal upload ke server perantara');
        const uploadedUrl = await uploadRes.text();
        
        console.log('File uploaded to:', uploadedUrl);

        // 3. Kirim ke API RemoveBG
        const apiUrl = `https://api.ootaizumi.web.id/tools/removebg?imageUrl=${encodeURIComponent(uploadedUrl)}`;
        const apiRes = await fetch(apiUrl);
        const apiJson = await apiRes.json();

        if (!apiJson.status) throw new Error('Gagal menghapus background dari API pusat');

        // 4. Kirim hasil balik ke frontend
        return response.status(200).json({ 
            success: true, 
            result: apiJson.result 
        });

    } catch (error) {
        console.error(error);
        return response.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
}

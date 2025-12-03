const axios = require('axios');

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    const { query } = req.query;

    if (!query) return res.status(400).json({ error: 'Query required' });

    try {
        const u = 'https://v8.kuramanime.tel';
        const { data } = await axios.get(`${u}/anime`, {
            params: { search: query, order_by: 'latest', page: 1, need_json: true },
            headers: { 'user-agent': 'Mozilla/5.0 (Linux; Android 16)', 'origin': u, 'referer': u }
        });
        
        const result = data.animes.data.map(p => ({
            title: p.title,
            score: p.score,
            img: p.image_url,
            url: `${u}/anime/${p.id}/${p.slug}`
        }));

        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

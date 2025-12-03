const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');
const FormData = require('form-data');
const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Multi Tools Dashboard API', status: 'running' });
});

// ==================== TIKTOK DOWNLOADER ====================
const tiktok_k = { 
  "enc": "GJvE5RZIxrl9SuNrAtgsvCfWha3M7NGC", 
  "dec": "H3quWdWoHLX5bZSlyCYAnvDFara25FIu" 
};

const cryptoProc = (type, data) => {
  const key = Buffer.from(tiktok_k[type]);
  const iv = Buffer.from(tiktok_k[type].slice(0, 16));
  const cipher = (type === 'enc' ? crypto.createCipheriv : crypto.createDecipheriv)('aes-256-cbc', key, iv);
  let rchipher = cipher.update(data, ...(type === 'enc' ? ['utf8', 'base64'] : ['base64', 'utf8']));
  rchipher += cipher.final(type === 'enc' ? 'base64' : 'utf8');
  return rchipher;
};

async function tiktokDl(url) {
  try {
    const encryptedUrl = cryptoProc('enc', url);
    const response = await axios.get(`https://savetik.app/api/ajaxSearch?q=${encodeURIComponent(encryptedUrl)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    if (response.data.status) {
      const decrypted = cryptoProc('dec', response.data.data);
      return JSON.parse(decrypted);
    }
    throw new Error('TikTok download failed');
  } catch (error) {
    console.error('TikTok Error:', error);
    throw error;
  }
}

app.post('/api/tiktok', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });
    
    const result = await tiktokDl(url);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== SPOTIFY DOWNLOADER ====================
app.post('/api/spotify', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    // Get song details
    const detailRes = await axios.post('https://spotdown.org/api/song-details', { url }, {
      timeout: 30000
    });
    
    if (!detailRes.data.success) {
      throw new Error('Failed to get song details');
    }

    // Get download URL
    const downloadRes = await axios.post('https://spotdown.org/api/download', {
      id: detailRes.data.id,
      quality: '320'
    }, {
      timeout: 30000
    });

    if (!downloadRes.data.success) {
      throw new Error('Failed to get download URL');
    }

    // Fetch audio as buffer
    const audioRes = await axios.get(downloadRes.data.downloadUrl, {
      responseType: 'arraybuffer',
      timeout: 60000
    });

    const base64Audio = Buffer.from(audioRes.data).toString('base64');
    res.json({
      success: true,
      data: {
        title: detailRes.data.title,
        artist: detailRes.data.artist,
        duration: detailRes.data.duration,
        cover: detailRes.data.cover,
        audio: `data:audio/mpeg;base64,${base64Audio}`
      }
    });
  } catch (error) {
    console.error('Spotify Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== ANIME (KURAMA CLASS) ====================
class Kurama {
  constructor() {
    this.baseUrl = 'https://v8.kuramanime.tel';
    this.headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Referer': 'https://v8.kuramanime.tel/'
    };
  }

  async search(query) {
    try {
      const response = await axios.get(`${this.baseUrl}/search?q=${encodeURIComponent(query)}`, {
        headers: this.headers,
        timeout: 30000
      });
      
      const $ = cheerio.load(response.data);
      const results = [];
      
      $('.listupd .anime').each((i, el) => {
        const title = $(el).find('.tt').text().trim();
        const url = $(el).find('a').attr('href');
        const image = $(el).find('img').attr('src');
        const episode = $(el).find('.epx').text().trim();
        
        if (title && url) {
          results.push({ title, url, image, episode });
        }
      });
      
      return results;
    } catch (error) {
      console.error('Kurama Search Error:', error);
      throw error;
    }
  }

  async detail(url) {
    try {
      const response = await axios.get(url, { 
        headers: this.headers,
        timeout: 30000
      });
      const $ = cheerio.load(response.data);
      
      const title = $('.entry-title').text().trim();
      const image = $('.thumb img').attr('src');
      const synopsis = $('.entry-content p').first().text().trim();
      
      const episodes = [];
      $('#episodeList li').each((i, el) => {
        const episodeTitle = $(el).find('.name').text().trim();
        const episodeUrl = $(el).find('a').attr('href');
        if (episodeTitle && episodeUrl) {
          episodes.push({ title: episodeTitle, url: episodeUrl });
        }
      });
      
      return {
        title,
        image,
        synopsis,
        episodes
      };
    } catch (error) {
      console.error('Kurama Detail Error:', error);
      throw error;
    }
  }
}

const kurama = new Kurama();

app.get('/api/anime/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ error: 'Query is required' });
    
    const results = await kurama.search(q);
    res.json({ success: true, data: results });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/api/anime/detail', async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: 'URL is required' });
    
    const detail = await kurama.detail(url);
    res.json({ success: true, data: detail });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== TTS (ELEVENLABS CLASS) ====================
class ElevenLabs {
  constructor() {
    this.baseUrl = 'https://tts1.squinty.art/api/v1';
    this.apiKey = null;
  }

  async login() {
    try {
      const response = await axios.post(`${this.baseUrl}/user`, {
        email: `user${Date.now()}@temp.com`,
        password: 'temp123'
      }, {
        timeout: 30000
      });
      
      this.apiKey = response.data.api_key;
      return this.apiKey;
    } catch (error) {
      console.error('ElevenLabs Login Error:', error);
      throw error;
    }
  }

  async generate(text, voiceId = '21m00Tcm4TlvDq8ikWAM') {
    try {
      if (!this.apiKey) {
        await this.login();
      }

      const response = await axios.post(`${this.baseUrl}/text-to-speech/${voiceId}`, {
        text: text,
        model_id: 'eleven_monolingual_v1',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.5
        }
      }, {
        headers: {
          'xi-api-key': this.apiKey,
          'Content-Type': 'application/json'
        },
        responseType: 'arraybuffer',
        timeout: 60000
      });

      const base64Audio = Buffer.from(response.data).toString('base64');
      return `data:audio/mpeg;base64,${base64Audio}`;
    } catch (error) {
      console.error('ElevenLabs Generate Error:', error);
      throw error;
    }
  }
}

const elevenLabs = new ElevenLabs();

app.post('/api/tts', async (req, res) => {
  try {
    const { text, voice } = req.body;
    if (!text) return res.status(400).json({ error: 'Text is required' });
    
    // Limit text length for serverless
    if (text.length > 1000) {
      return res.status(400).json({ error: 'Text too long. Maximum 1000 characters.' });
    }
    
    const audio = await elevenLabs.generate(text, voice);
    res.json({ success: true, data: { audio } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== AI IMAGE GENERATOR ====================
app.post('/api/ai-image', async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: 'Prompt is required' });

    // First get the page to obtain wpnonce
    const pageRes = await axios.get('https://unrestrictedaiimagegenerator.com/', {
      timeout: 30000
    });
    const $ = cheerio.load(pageRes.data);
    const wpnonce = $('#wpnonce').val();

    if (!wpnonce) {
      throw new Error('Failed to get security token');
    }

    // Submit the prompt
    const generateRes = await axios.post('https://unrestrictedaiimagegenerator.com/wp-admin/admin-ajax.php', new URLSearchParams({
      action: 'generate_image',
      prompt: prompt,
      wpnonce: wpnonce
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 60000
    });

    if (generateRes.data.success) {
      res.json({
        success: true,
        data: {
          image: generateRes.data.data.image_url,
          prompt: prompt
        }
      });
    } else {
      throw new Error(generateRes.data.data?.message || 'Generation failed');
    }
  } catch (error) {
    console.error('AI Image Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== TERABOX DOWNLOADER ====================
app.post('/api/terabox', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });

    // Extract surl from URL
    const surlMatch = url.match(/surl=([^&]+)/);
    if (!surlMatch) {
      throw new Error('Invalid Terabox URL');
    }

    const surl = surlMatch[1];
    const infoRes = await axios.get(`https://tera2.sylyt93.workers.dev/info?surl=${surl}`, {
      timeout: 30000
    });

    if (infoRes.data.ok) {
      res.json({
        success: true,
        data: {
          filename: infoRes.data.filename,
          size: infoRes.data.size,
          downloadUrl: infoRes.data.download,
          thumbnail: infoRes.data.thumbnail
        }
      });
    } else {
      throw new Error('Failed to get file info');
    }
  } catch (error) {
    console.error('Terabox Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// ==================== YOUTUBE DOWNLOADER ====================
class YTDL {
  constructor() {
    this.baseUrl = 'https://api.10downloader.com';
  }

  async getInfo(url) {
    try {
      const response = await axios.post(`${this.baseUrl}/api/info`, {
        url: url,
        format: 'mp4'
      }, {
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        },
        timeout: 30000
      });

      return response.data;
    } catch (error) {
      console.error('YouTube Info Error:', error);
      throw error;
    }
  }

  async download(url, quality = '720p') {
    try {
      const info = await this.getInfo(url);
      
      // Find the requested quality
      const format = info.formats?.find(f => f.quality === quality) || 
                    info.formats?.[0] ||
                    info.url;

      return {
        title: info.title,
        thumbnail: info.thumbnail,
        duration: info.duration,
        downloadUrl: format.url || format,
        quality: format.quality || quality
      };
    } catch (error) {
      console.error('YouTube Download Error:', error);
      throw error;
    }
  }
}

const ytdl = new YTDL();

app.post('/api/youtube', async (req, res) => {
  try {
    const { url, quality } = req.body;
    if (!url) return res.status(400).json({ error: 'URL is required' });
    
    const result = await ytdl.download(url, quality || '720p');
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== STATIC FILES ====================
app.use(express.static('public'));

// ==================== ERROR HANDLER ====================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// ==================== EXPORT FOR VERCEL ====================
module.exports = app;

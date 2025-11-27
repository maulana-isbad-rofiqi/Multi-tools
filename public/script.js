// Navigasi & UI
const welcomeScreen = document.getElementById('welcome-screen');
const enterBtn = document.getElementById('enter-btn');
const dashboard = document.getElementById('dashboard');
const sidebar = document.getElementById('sidebar');
const openSidebar = document.getElementById('open-sidebar');
const closeSidebar = document.getElementById('close-sidebar');

enterBtn.addEventListener('click', () => {
    welcomeScreen.style.opacity = '0';
    setTimeout(() => {
        welcomeScreen.classList.add('hidden');
        dashboard.classList.remove('hidden');
    }, 500);
});

openSidebar.addEventListener('click', () => sidebar.classList.add('active'));
closeSidebar.addEventListener('click', () => sidebar.classList.remove('active'));

function showPage(pageId) {
    document.querySelectorAll('.page-section').forEach(sec => sec.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');
    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
    if(window.innerWidth < 768) sidebar.classList.remove('active');
}

// === LOGIKA BARU DENGAN KOMPRESI ===
const imageInput = document.getElementById('imageInput');
const processBtn = document.getElementById('processBtn');
const previewContainer = document.getElementById('preview-container');
const resultArea = document.getElementById('result-area');
const resultImage = document.getElementById('resultImage');
const downloadBtn = document.getElementById('downloadBtn');
const loading = document.getElementById('loading');

let selectedFile = null;

imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        selectedFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            previewContainer.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
        resultArea.classList.add('hidden');
    }
});

// Fungsi Kompres Gambar (Agar lolos limit Vercel)
const compressImage = async (file) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target.result;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                // Kecilkan resolusi jika terlalu besar (max width 1080px)
                const scale = Math.min(1080 / img.width, 1); 
                canvas.width = img.width * scale;
                canvas.height = img.height * scale;
                
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                
                // Ubah ke JPEG kualitas 70%
                const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                resolve(dataUrl);
            }
        }
    });
}

processBtn.addEventListener('click', async () => {
    if (!selectedFile) {
        alert("Pilih gambar dulu!");
        return;
    }

    loading.classList.remove('hidden');
    processBtn.disabled = true;
    resultArea.classList.add('hidden');

    try {
        // 1. Kompres dulu sebelum kirim
        const base64Image = await compressImage(selectedFile);

        // 2. Kirim ke Backend
        const res = await fetch('/api/removebg', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: base64Image })
        });

        const data = await res.json();

        if (data.success && data.result) {
            resultImage.src = data.result;
            downloadBtn.href = data.result;
            resultArea.classList.remove('hidden');
        } else {
            throw new Error(data.error || "Gagal memproses.");
        }

    } catch (error) {
        alert("Gagal: " + error.message);
    } finally {
        loading.classList.add('hidden');
        processBtn.disabled = false;
    }
});

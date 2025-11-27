// Navigasi & UI Logic
const welcomeScreen = document.getElementById('welcome-screen');
const enterBtn = document.getElementById('enter-btn');
const dashboard = document.getElementById('dashboard');
const sidebar = document.getElementById('sidebar');
const openSidebar = document.getElementById('open-sidebar');
const closeSidebar = document.getElementById('close-sidebar');

// Masuk Dashboard
enterBtn.addEventListener('click', () => {
    welcomeScreen.style.opacity = '0';
    setTimeout(() => {
        welcomeScreen.classList.add('hidden');
        dashboard.classList.remove('hidden');
    }, 500);
});

// Sidebar Mobile
openSidebar.addEventListener('click', () => sidebar.classList.add('active'));
closeSidebar.addEventListener('click', () => sidebar.classList.remove('active'));

// Switch Pages
function showPage(pageId) {
    document.querySelectorAll('.page-section').forEach(sec => sec.classList.add('hidden'));
    document.getElementById(pageId).classList.remove('hidden');
    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
    if(window.innerWidth < 768) {
        sidebar.classList.remove('active');
    }
}

// === LOGIKA REMOVE BG (FIXED) ===
const imageInput = document.getElementById('imageInput');
const processBtn = document.getElementById('processBtn');
const previewContainer = document.getElementById('preview-container');
const resultArea = document.getElementById('result-area');
const resultImage = document.getElementById('resultImage');
const downloadBtn = document.getElementById('downloadBtn');
const loading = document.getElementById('loading');

let selectedFile = null;

// Preview Gambar
imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        // Cek ukuran file (Max 4MB agar Vercel tidak error)
        if (file.size > 4 * 1024 * 1024) {
            alert("Ukuran gambar terlalu besar! Maksimal 4MB.");
            return;
        }
        selectedFile = file;
        const reader = new FileReader();
        reader.onload = (e) => {
            previewContainer.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
        };
        reader.readAsDataURL(file);
        resultArea.classList.add('hidden');
    }
});

// Fungsi mengubah File menjadi Base64
const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

// Proses Gambar
processBtn.addEventListener('click', async () => {
    if (!selectedFile) {
        alert("Pilih gambar dulu bos!");
        return;
    }

    loading.classList.remove('hidden');
    processBtn.disabled = true;
    resultArea.classList.add('hidden');

    try {
        // 1. Ubah gambar jadi text Base64
        const base64Image = await toBase64(selectedFile);

        // 2. Kirim ke API Vercel kita (menggunakan POST)
        const res = await fetch('/api/removebg', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ image: base64Image })
        });

        const data = await res.json();

        if (data.success && data.result) {
            resultImage.src = data.result;
            downloadBtn.href = data.result;
            resultArea.classList.remove('hidden');
        } else {
            throw new Error(data.error || "Gagal memproses gambar.");
        }

    } catch (error) {
        alert("Terjadi kesalahan: " + error.message);
        console.error(error);
    } finally {
        loading.classList.add('hidden');
        processBtn.disabled = false;
    }
});

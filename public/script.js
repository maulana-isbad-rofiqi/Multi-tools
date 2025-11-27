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
    // Sembunyikan semua section
    document.querySelectorAll('.page-section').forEach(sec => sec.classList.add('hidden'));
    // Tampilkan yang dipilih
    document.getElementById(pageId).classList.remove('hidden');
    // Update active state menu
    document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
    // Jika mobile, tutup sidebar setelah klik
    if(window.innerWidth < 768) {
        sidebar.classList.remove('active');
    }
}

// === LOGIKA REMOVE BG ===
const imageInput = document.getElementById('imageInput');
const processBtn = document.getElementById('processBtn');
const previewContainer = document.getElementById('preview-container');
const resultArea = document.getElementById('result-area');
const resultImage = document.getElementById('resultImage');
const downloadBtn = document.getElementById('downloadBtn');
const loading = document.getElementById('loading');

let selectedFile = null;

// Preview Gambar saat dipilih
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

// Helper: Upload File ke Host Sementara (Karena API butuh URL, bukan File)
// Kita gunakan catbox.moe atau host gratis lainnya yang mendukung upload tanpa key ribet
async function uploadToTemporaryHost(file) {
    const formData = new FormData();
    formData.append('fileToUpload', file);
    formData.append('reqtype', 'fileupload');

    // Menggunakan Catbox.moe sebagai perantara (public upload)
    try {
        const response = await fetch('https://catbox.moe/user/api.php', {
            method: 'POST',
            body: formData
        });
        const url = await response.text();
        return url;
    } catch (e) {
        console.error("Gagal upload temp:", e);
        return null;
    }
}

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
        // 1. Upload gambar lokal ke temporary host agar dapat URL
        const tempUrl = await uploadToTemporaryHost(selectedFile);
        
        if (!tempUrl) throw new Error("Gagal mengupload gambar ke server sementara.");

        // 2. Kirim URL ke API Vercel kita
        const apiUrl = `/api/removebg?imageUrl=${encodeURIComponent(tempUrl)}`;
        const res = await fetch(apiUrl);
        const data = await res.json();

        if (data.success && data.result) {
            resultImage.src = data.result;
            downloadBtn.href = data.result;
            resultArea.classList.remove('hidden');
        } else {
            alert("Gagal memproses gambar: " + (data.error || "Unknown error"));
        }

    } catch (error) {
        alert("Terjadi kesalahan: " + error.message);
    } finally {
        loading.classList.add('hidden');
        processBtn.disabled = false;
    }
});

// assets/app.js

// ===== THEME & MODE =====
const THEME_KEY = "mt_theme";
const MODE_KEY = "mt_mode";

function applyTheme(theme) {
  const html = document.documentElement;
  const valid = ["blue", "purple", "minimal"];
  const t = valid.includes(theme) ? theme : "blue";
  html.setAttribute("data-theme", t);
  try {
    localStorage.setItem(THEME_KEY, t);
  } catch {}
}

function applyMode(mode) {
  const body = document.body;
  if (mode === "light") {
    body.classList.remove("mode-dark");
    body.classList.add("mode-light");
  } else {
    body.classList.remove("mode-light");
    body.classList.add("mode-dark");
    mode = "dark";
  }
  try {
    localStorage.setItem(MODE_KEY, mode);
  } catch {}
}

function initThemeControls() {
  // Load saved
  let savedTheme = "blue";
  let savedMode = "dark";
  try {
    savedTheme = localStorage.getItem(THEME_KEY) || "blue";
    savedMode = localStorage.getItem(MODE_KEY) || "dark";
  } catch {}
  applyTheme(savedTheme);
  applyMode(savedMode);

  // Front page theme radios
  const frontThemeRadios = document.querySelectorAll(
    'input[name="theme"]'
  );
  frontThemeRadios.forEach((radio) => {
    if (radio.value === savedTheme) radio.checked = true;
    radio.addEventListener("change", () => applyTheme(radio.value));
  });

  // Dashboard theme radios
  const dashThemeRadios = document.querySelectorAll(
    'input[name="themeDash"]'
  );
  dashThemeRadios.forEach((radio) => {
    if (radio.value === savedTheme) radio.checked = true;
    radio.addEventListener("change", () => applyTheme(radio.value));
  });

  // Mode toggle front (index)
  const modeToggleFront = document.getElementById("modeToggleFront");
  if (modeToggleFront) {
    modeToggleFront.textContent = savedMode === "light" ? "☀️" : "🌙";
    modeToggleFront.addEventListener("click", () => {
      const newMode =
        document.body.classList.contains("mode-dark") ? "light" : "dark";
      applyMode(newMode);
      modeToggleFront.textContent = newMode === "light" ? "☀️" : "🌙";
    });
  }

  // Mode toggle dashboard
  const modeToggleDash = document.getElementById("modeToggleDash");
  if (modeToggleDash) {
    modeToggleDash.textContent = savedMode === "light" ? "☀️" : "🌙";
    modeToggleDash.addEventListener("click", () => {
      const newMode =
        document.body.classList.contains("mode-dark") ? "light" : "dark";
      applyMode(newMode);
      modeToggleDash.textContent = newMode === "light" ? "☀️" : "🌙";
    });
  }
}

// ===== DASHBOARD NAV =====
function initDashboardNav() {
  const navItems = document.querySelectorAll(".nav-item");
  const panels = document.querySelectorAll(".tool-panel");
  if (!navItems.length || !panels.length) return;

  navItems.forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetId = btn.getAttribute("data-target");

      navItems.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      panels.forEach((p) => {
        p.classList.toggle("active", p.id === targetId);
      });

      // auto-close sidebar on mobile
      const sidebar = document.getElementById("sidebar");
      if (sidebar && sidebar.classList.contains("open")) {
        sidebar.classList.remove("open");
      }
    });
  });

  const menuToggle = document.getElementById("menuToggle");
  const sidebar = document.getElementById("sidebar");
  if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });
  }
}

// ===== TOOLS: REMINI / UPSCALE =====
function initUpscale() {
  const urlInput = document.getElementById("upscaleUrl");
  const btn = document.getElementById("upscaleBtn");
  const statusEl = document.getElementById("upscaleStatus");
  const resultCard = document.getElementById("upscaleResult");
  const imgOriginal = document.getElementById("upscaleOriginal");
  const imgOut = document.getElementById("upscaleOutput");
  const sizeSpan = document.getElementById("upscaleSize");
  const copyBtn = document.getElementById("upscaleCopy");
  const openLink = document.getElementById("upscaleOpen");

  if (!btn) return;

  function setStatus(msg, type) {
    if (!statusEl) return;
    statusEl.textContent = msg || "";
    statusEl.className = "status" + (type ? " " + type : "");
  }

  async function handle() {
    const url = (urlInput?.value || "").trim();
    if (!url) {
      setStatus("Masukkan dulu URL gambar yang mau di-HD-in.", "err");
      return;
    }
    try {
      new URL(url);
    } catch {
      setStatus("URL tidak valid. Harus diawali http:// atau https://", "err");
      return;
    }

    btn.disabled = true;
    btn.textContent = "Memproses...";
    setStatus("Lagi diproses di server, sabar sebentar…", "ok");
    if (resultCard) resultCard.classList.add("hidden");

    try {
      const result = await window.Api.upscale(url);
      // result: { imageUrl, size }
      if (imgOriginal) imgOriginal.src = url;
      if (imgOut) imgOut.src = result.imageUrl;
      if (sizeSpan) sizeSpan.textContent = result.size || "-";
      if (openLink) openLink.href = result.imageUrl;

      if (copyBtn) {
        copyBtn.onclick = async () => {
          try {
            await navigator.clipboard.writeText(result.imageUrl);
            setStatus("Link hasil sudah disalin ke clipboard ✅", "ok");
          } catch {
            setStatus("Gagal menyalin ke clipboard. Salin manual dari URL bar.", "err");
          }
        };
      }

      if (resultCard) resultCard.classList.remove("hidden");
      setStatus("Berhasil di-HD-in! 🎉", "ok");
    } catch (e) {
      console.error(e);
      setStatus(
        "Gagal memproses. Bisa karena limit, URL tidak bisa diakses, atau CORS.",
        "err"
      );
    } finally {
      btn.disabled = false;
      btn.textContent = "Proses Remini HD";
    }
  }

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    handle();
  });

  if (urlInput) {
    urlInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handle();
      }
    });
  }
}

// ===== TOOLS: REMOVE BACKGROUND =====
function initRemoveBg() {
  const urlInput = document.getElementById("removeBgUrl");
  const btn = document.getElementById("removeBgBtn");
  const statusEl = document.getElementById("removeBgStatus");
  const resultCard = document.getElementById("removeBgResult");
  const imgOriginal = document.getElementById("removeBgOriginal");
  const imgOut = document.getElementById("removeBgOutput");
  const copyBtn = document.getElementById("removeBgCopy");
  const openLink = document.getElementById("removeBgOpen");

  if (!btn) return;

  function setStatus(msg, type) {
    if (!statusEl) return;
    statusEl.textContent = msg || "";
    statusEl.className = "status" + (type ? " " + type : "");
  }

  async function handle() {
    const url = (urlInput?.value || "").trim();
    if (!url) {
      setStatus("Masukkan dulu URL gambar yang mau dihapus background-nya.", "err");
      return;
    }
    try {
      new URL(url);
    } catch {
      setStatus("URL tidak valid. Harus diawali http:// atau https://", "err");
      return;
    }

    btn.disabled = true;
    btn.textContent = "Memproses...";
    setStatus("Lagi diproses di server, sabar sebentar…", "ok");
    if (resultCard) resultCard.classList.add("hidden");

    try {
      const result = await window.Api.removeBg(url);
      // result: { imageUrl }
      if (imgOriginal) imgOriginal.src = url;
      if (imgOut) imgOut.src = result.imageUrl;
      if (openLink) openLink.href = result.imageUrl;

      if (copyBtn) {
        copyBtn.onclick = async () => {
          try {
            await navigator.clipboard.writeText(result.imageUrl);
            setStatus("Link hasil sudah disalin ke clipboard ✅", "ok");
          } catch {
            setStatus("Gagal menyalin ke clipboard. Salin manual dari URL bar.", "err");
          }
        };
      }

      if (resultCard) resultCard.classList.remove("hidden");
      setStatus("Background berhasil dihapus ✨", "ok");
    } catch (e) {
      console.error(e);
      setStatus(
        "Gagal memproses. Bisa karena limit, URL tidak bisa diakses, atau CORS.",
        "err"
      );
    } finally {
      btn.disabled = false;
      btn.textContent = "Hapus Background";
    }
  }

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    handle();
  });

  if (urlInput) {
    urlInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handle();
      }
    });
  }
}

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {
  initThemeControls();
  initDashboardNav();
  initUpscale();
  initRemoveBg();
});

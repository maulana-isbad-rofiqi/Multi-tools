// assets/app.js

const THEME_KEY = "mt_theme";
const MODE_KEY = "mt_mode";
const LANG_KEY = "mt_lang";

// === TRANSLATIONS (ID / EN / JA / AR / KO) ===
const translations = {
  id: {
    welcome_title: "Multi Tools Panel",
    welcome_subtitle: "Menyiapkan dashboard Remini & RemoveBG untukmu...",
    sidebar_title: "Multi Tools",
    sidebar_theme_label: "Tema cepat",
    dashboard_title: "Dashboard Tools",
    dashboard_subtitle: "Kelola gambar via Remini & RemoveBG.",
    nav_upscale: "Remini Upscale",
    nav_removebg: "Remove Background",
    nav_settings: "Pengaturan",
    nav_about: "About & Developer",
    tool_upscale_title: "⚡ Remini Upscale",
    tool_upscale_desc:
      "Hdiin foto blur jadi tajam, langsung dari device kamu.",
    tool_removebg_title: "🖼️ Remove Background",
    tool_removebg_desc: "Hapus background gambar jadi transparan.",
    label_select_image: "Pilih gambar dari perangkat",
    hint_file_only:
      "Format disarankan: JPG atau PNG. Gambar tidak disimpan di web, hanya diteruskan ke API.",
    summary_optional_url: "Opsi lanjutan: pakai URL gambar",
    btn_upscale: "Proses Remini HD",
    btn_removebg: "Hapus Background",
    result_original: "Asli",
    result_hd: "Hasil HD",
    result_nobg: "Tanpa background",
    tag_before: "Before",
    tag_after: "After",
    btn_copy_link: "Salin link hasil",
    btn_open_download: "Buka / download",
    settings_title: "⚙️ Pengaturan",
    settings_desc: "Atur bahasa, tema, dan preferensi tampilan.",
    settings_language_label: "Bahasa / Language",
    settings_language_hint:
      "Hanya teks utama yang berubah bahasa, konten lain tetap bisa campuran.",
    settings_theme_label: "Tema utama",
    settings_other_label: "Pengaturan lainnya",
    settings_compact: "Mode tampilan ringkas",
    settings_animations: "Aktifkan animasi ringan",
    settings_note:
      "Beberapa pengaturan ini hanya kosmetik (UI), tidak mempengaruhi proses API.",
    about_title: "ℹ️ About & Developer",
    about_app_title: "Multi Tools Panel",
    about_app_desc:
      "Web dashboard ringan untuk mengakses beberapa tools gambar berbasis API dari https://api.ootaizumi.web.id.",
    about_item_upscale: "⚡ Remini Upscale – Hdiin foto blur.",
    about_item_removebg:
      "🖼️ Remove Background – Hapus background jadi transparan.",
    about_item_future:
      "🧩 Siap ditambah tools lain (cartoon, colorize, dll).",
    about_dev_title: "Developer",
    about_dev_desc:
      "Script ini dibuat supaya bot / API yang kamu punya bisa dipakai dengan tampilan web yang rapih dan enak dipakai di HP maupun desktop.",
    about_dev_hint:
      "Silakan kembangkan lagi: tambah auth, limit user, halaman changelog, dll.",
  },
  en: {
    welcome_title: "Multi Tools Panel",
    welcome_subtitle: "Preparing your Remini & RemoveBG dashboard...",
    sidebar_title: "Multi Tools",
    sidebar_theme_label: "Quick theme",
    dashboard_title: "Dashboard Tools",
    dashboard_subtitle: "Manage images via Remini & RemoveBG.",
    nav_upscale: "Remini Upscale",
    nav_removebg: "Remove Background",
    nav_settings: "Settings",
    nav_about: "About & Developer",
    tool_upscale_title: "⚡ Remini Upscale",
    tool_upscale_desc: "Upscale blurry photos directly from your device.",
    tool_removebg_title: "🖼️ Remove Background",
    tool_removebg_desc: "Remove image background to transparent.",
    label_select_image: "Choose image from device",
    hint_file_only:
      "Recommended formats: JPG or PNG. Image is not stored here, only sent to the API.",
    summary_optional_url: "Advanced option: use image URL",
    btn_upscale: "Process Remini HD",
    btn_removebg: "Remove Background",
    result_original: "Original",
    result_hd: "HD Result",
    result_nobg: "No background",
    tag_before: "Before",
    tag_after: "After",
    btn_copy_link: "Copy result link",
    btn_open_download: "Open / download",
    settings_title: "⚙️ Settings",
    settings_desc: "Configure language, theme, and display preferences.",
    settings_language_label: "Language",
    settings_language_hint:
      "Only main text is translated. Other content may stay mixed.",
    settings_theme_label: "Main theme",
    settings_other_label: "Other settings",
    settings_compact: "Compact layout mode",
    settings_animations: "Enable subtle animations",
    settings_note:
      "These options are cosmetic (UI only), they don't affect the API.",
    about_title: "ℹ️ About & Developer",
    about_app_title: "Multi Tools Panel",
    about_app_desc:
      "Lightweight web dashboard to access multiple image tools powered by https://api.ootaizumi.web.id.",
    about_item_upscale: "⚡ Remini Upscale – Make blurry photos sharp.",
    about_item_removebg:
      "🖼️ Remove Background – Remove background to transparent.",
    about_item_future:
      "🧩 Ready for more tools (cartoon, colorize, etc.).",
    about_dev_title: "Developer",
    about_dev_desc:
      "Built so that your bot / API can be used with a clean, mobile-friendly web UI.",
    about_dev_hint:
      "Extend it with auth, user limits, changelog pages, and more.",
  },
  ja: {
    welcome_title: "マルチツールパネル",
    welcome_subtitle: "Remini と RemoveBG ダッシュボードを読み込み中...",
    sidebar_title: "マルチツール",
    sidebar_theme_label: "クイックテーマ",
    dashboard_title: "ダッシュボードツール",
    dashboard_subtitle: "Remini と RemoveBG で画像を管理。",
    nav_upscale: "Remini アップスケール",
    nav_removebg: "背景削除",
    nav_settings: "設定",
    nav_about: "概要 & 開発者",
    tool_upscale_title: "⚡ Remini アップスケール",
    tool_upscale_desc: "端末から選んだぼやけた画像を高画質にします。",
    tool_removebg_title: "🖼️ 背景削除",
    tool_removebg_desc: "画像の背景を透過にします。",
    label_select_image: "端末から画像を選択",
    hint_file_only:
      "推奨形式: JPG / PNG。画像は保存されず、API に送信されるだけです。",
    summary_optional_url: "高度な設定: 画像URLを使用",
    btn_upscale: "Remini HD を実行",
    btn_removebg: "背景を削除",
    result_original: "元画像",
    result_hd: "HD結果",
    result_nobg: "背景なし",
    tag_before: "Before",
    tag_after: "After",
    btn_copy_link: "結果リンクをコピー",
    btn_open_download: "開く / ダウンロード",
    settings_title: "⚙️ 設定",
    settings_desc: "言語、テーマ、表示設定を変更します。",
    settings_language_label: "言語",
    settings_language_hint:
      "メインテキストのみ翻訳されます。他の部分は混在する場合があります。",
    settings_theme_label: "メインテーマ",
    settings_other_label: "その他の設定",
    settings_compact: "コンパクト表示モード",
    settings_animations: "アニメーションを有効にする",
    settings_note:
      "これらは見た目のみの設定で、API には影響しません。",
    about_title: "ℹ️ 概要 & 開発者",
    about_app_title: "マルチツールパネル",
    about_app_desc:
      "https://api.ootaizumi.web.id を利用した画像ツール用の軽量ダッシュボードです。",
    about_item_upscale: "⚡ Remini アップスケール – ぼやけた写真を鮮明に。",
    about_item_removebg:
      "🖼️ 背景削除 – 背景を透過にします。",
    about_item_future:
      "🧩 カートゥーン化や色付けなど、機能追加も可能です。",
    about_dev_title: "開発者",
    about_dev_desc:
      "あなたのボット / API を、スマホでも使いやすいWeb UIで利用できるようにするためのスクリプトです。",
    about_dev_hint:
      "認証、ユーザー制限、変更履歴ページなども追加できます。",
  },
  ar: {
    welcome_title: "لوحة الأدوات المتعددة",
    welcome_subtitle: "جارٍ تحميل لوحة Remini و RemoveBG...",
    sidebar_title: "أدوات متعددة",
    sidebar_theme_label: "سمة سريعة",
    dashboard_title: "أدوات لوحة التحكم",
    dashboard_subtitle: "إدارة الصور عبر Remini و RemoveBG.",
    nav_upscale: "تحسين Remini",
    nav_removebg: "إزالة الخلفية",
    nav_settings: "الإعدادات",
    nav_about: "حول المطوّر",
    tool_upscale_title: "⚡ تحسين Remini",
    tool_upscale_desc: "تحسين الصور غير الواضحة مباشرة من جهازك.",
    tool_removebg_title: "🖼️ إزالة الخلفية",
    tool_removebg_desc: "إزالة خلفية الصورة وجعلها شفافة.",
    label_select_image: "اختر صورة من جهازك",
    hint_file_only:
      "الصيغ الموصى بها: JPG أو PNG. لا يتم حفظ الصورة هنا، بل تُرسل فقط إلى الـ API.",
    summary_optional_url: "خيارات متقدمة: استخدام رابط الصورة",
    btn_upscale: "تشغيل Remini HD",
    btn_removebg: "إزالة الخلفية",
    result_original: "الأصلية",
    result_hd: "نتيجة HD",
    result_nobg: "بدون خلفية",
    tag_before: "قبل",
    tag_after: "بعد",
    btn_copy_link: "نسخ رابط النتيجة",
    btn_open_download: "فتح / تنزيل",
    settings_title: "⚙️ الإعدادات",
    settings_desc: "ضبط اللغة، السمة، وتفضيلات العرض.",
    settings_language_label: "اللغة",
    settings_language_hint:
      "يتم ترجمة النصوص الأساسية فقط، وقد تبقى أجزاء أخرى مختلطة.",
    settings_theme_label: "السمة الرئيسية",
    settings_other_label: "إعدادات أخرى",
    settings_compact: "وضع العرض المدمج",
    settings_animations: "تفعيل الحركات الخفيفة",
    settings_note:
      "هذه الخيارات جمالية فقط ولا تؤثر على الـ API.",
    about_title: "ℹ️ حول & المطوّر",
    about_app_title: "لوحة الأدوات المتعددة",
    about_app_desc:
      "لوحة ويب خفيفة للوصول إلى أدوات الصور باستخدام https://api.ootaizumi.web.id.",
    about_item_upscale:
      "⚡ تحسين Remini – جعل الصور غير الواضحة حادة.",
    about_item_removebg:
      "🖼️ إزالة الخلفية – جعل الخلفية شفافة.",
    about_item_future:
      "🧩 جاهزة لإضافة أدوات أخرى (رسم كرتوني، تلوين، وغيرها).",
    about_dev_title: "المطوّر",
    about_dev_desc:
      "تم إنشاء هذه الواجهة لتسهيل استخدام البوت / الـ API بواجهة ويب أنيقة ومتوافقة مع الجوال.",
    about_dev_hint:
      "يمكنك إضافة تسجيل الدخول، حدود للمستخدمين، وصفحات للتحديثات، وغير ذلك.",
  },
  ko: {
    welcome_title: "멀티 툴 패널",
    welcome_subtitle: "Remini & RemoveBG 대시보드를 불러오는 중...",
    sidebar_title: "멀티 툴",
    sidebar_theme_label: "빠른 테마",
    dashboard_title: "대시보드 도구",
    dashboard_subtitle: "Remini와 RemoveBG로 이미지를 관리하세요.",
    nav_upscale: "Remini 업스케일",
    nav_removebg: "배경 제거",
    nav_settings: "설정",
    nav_about: "정보 & 개발자",
    tool_upscale_title: "⚡ Remini 업스케일",
    tool_upscale_desc: "기기에서 선택한 흐릿한 사진을 선명하게 만듭니다.",
    tool_removebg_title: "🖼️ 배경 제거",
    tool_removebg_desc: "이미지 배경을 투명하게 제거합니다.",
    label_select_image: "기기에서 이미지 선택",
    hint_file_only:
      "권장 형식: JPG 또는 PNG. 이미지는 이 웹에 저장되지 않고 API로만 전송됩니다.",
    summary_optional_url: "고급 옵션: 이미지 URL 사용",
    btn_upscale: "Remini HD 실행",
    btn_removebg: "배경 제거",
    result_original: "원본",
    result_hd: "HD 결과",
    result_nobg: "배경 없음",
    tag_before: "Before",
    tag_after: "After",
    btn_copy_link: "결과 링크 복사",
    btn_open_download: "열기 / 다운로드",
    settings_title: "⚙️ 설정",
    settings_desc: "언어, 테마 및 화면 설정을 변경합니다.",
    settings_language_label: "언어",
    settings_language_hint:
      "주요 텍스트만 번역되며, 다른 부분은 섞여 있을 수 있습니다.",
    settings_theme_label: "메인 테마",
    settings_other_label: "기타 설정",
    settings_compact: "컴팩트 레이아웃 모드",
    settings_animations: "부드러운 애니메이션 활성화",
    settings_note:
      "이 옵션들은 UI만 변경하며 API 동작에는 영향을 주지 않습니다.",
    about_title: "ℹ️ 정보 & 개발자",
    about_app_title: "멀티 툴 패널",
    about_app_desc:
      "https://api.ootaizumi.web.id 기반 이미지 도구를 위한 가벼운 웹 대시보드입니다.",
    about_item_upscale: "⚡ Remini 업스케일 – 흐릿한 사진을 선명하게.",
    about_item_removebg:
      "🖼️ 배경 제거 – 배경을 투명하게 만듭니다.",
    about_item_future:
      "🧩 만화, 컬러라이즈 등 도구를 추가할 수 있습니다.",
    about_dev_title: "개발자",
    about_dev_desc:
      "당신의 봇 / API를 모바일 친화적인 깔끔한 웹 UI로 사용할 수 있도록 만든 스크립트입니다.",
    about_dev_hint:
      "인증, 사용자 제한, 변경 로그 페이지 등을 추가해 보세요.",
  },
};

// === THEME & MODE ===
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

// === LANGUAGE ===
function applyLanguage(lang) {
  const supported = ["id", "en", "ja", "ar", "ko"];
  if (!supported.includes(lang)) lang = "id";
  const dict = translations[lang] || translations.id;

  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";

  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {}

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });
}

function initThemeAndMode() {
  let savedTheme = "blue";
  let savedMode = "dark";
  let savedLang = "id";
  try {
    savedTheme = localStorage.getItem(THEME_KEY) || "blue";
    savedMode = localStorage.getItem(MODE_KEY) || "dark";
    savedLang = localStorage.getItem(LANG_KEY) || "id";
  } catch {}

  applyTheme(savedTheme);
  applyMode(savedMode);
  applyLanguage(savedLang);

  // Sidebar theme radios
  const dashThemeRadios = document.querySelectorAll(
    'input[name="themeDash"]'
  );
  dashThemeRadios.forEach((radio) => {
    if (radio.value === savedTheme) radio.checked = true;
    radio.addEventListener("change", () => applyTheme(radio.value));
  });

  // Settings theme radios
  const settingsThemeRadios = document.querySelectorAll(
    'input[name="themeSettings"]'
  );
  settingsThemeRadios.forEach((radio) => {
    if (radio.value === savedTheme) radio.checked = true;
    radio.addEventListener("change", () => {
      applyTheme(radio.value);
      // sinkron ke sidebar juga
      dashThemeRadios.forEach((r) => {
        r.checked = r.value === radio.value;
      });
    });
  });

  // Language select
  const langSelect = document.getElementById("languageSelect");
  if (langSelect) {
    langSelect.value = savedLang;
    langSelect.addEventListener("change", () => {
      applyLanguage(langSelect.value);
    });
  }

  // Mode toggle dashboard
  const modeToggleDash = document.getElementById("modeToggleDash");
  if (modeToggleDash) {
    modeToggleDash.textContent = savedMode === "light" ? "☀️" : "🌙";
    modeToggleDash.addEventListener("click", () => {
      const newMode = document.body.classList.contains("mode-dark")
        ? "light"
        : "dark";
      applyMode(newMode);
      modeToggleDash.textContent = newMode === "light" ? "☀️" : "🌙";
    });
  }
}

// Welcome overlay
function initWelcomeOverlay() {
  const overlay = document.getElementById("welcomeOverlay");
  if (!overlay) return;
  setTimeout(() => {
    overlay.classList.add("hide");
  }, 1200);
}

// Sidebar nav
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

// Upscale tool
function initUpscale() {
  const fileInput = document.getElementById("upscaleFile");
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

  function getSource() {
    const file = fileInput?.files?.[0];
    if (file) return file;

    const url = (urlInput?.value || "").trim();
    if (url) {
      try {
        new URL(url);
        return url;
      } catch {
        throw new Error(
          "URL tidak valid. Harus diawali http:// atau https://"
        );
      }
    }
    throw new Error(
      "Pilih file gambar atau isi URL gambar terlebih dahulu."
    );
  }

  async function handle() {
    let source;
    try {
      source = getSource();
    } catch (e) {
      setStatus(e.message, "err");
      return;
    }

    btn.disabled = true;
    btn.textContent = "Memproses...";
    setStatus("Lagi diproses di server, sabar sebentar…", "ok");
    if (resultCard) resultCard.classList.add("hidden");

    try {
      // Preview original
      if (source instanceof File) {
        if (imgOriginal) {
          imgOriginal.src = URL.createObjectURL(source);
        }
      } else {
        if (imgOriginal) imgOriginal.src = source;
      }

      const result = await window.Api.upscale(source);
      if (imgOut) imgOut.src = result.imageUrl;
      if (sizeSpan) sizeSpan.textContent = result.size || "-";
      if (openLink) openLink.href = result.imageUrl;

      if (copyBtn) {
        copyBtn.onclick = async () => {
          try {
            await navigator.clipboard.writeText(result.imageUrl);
            setStatus("Link hasil sudah disalin ke clipboard ✅", "ok");
          } catch {
            setStatus(
              "Gagal menyalin ke clipboard. Salin manual dari URL bar.",
              "err"
            );
          }
        };
      }

      if (resultCard) resultCard.classList.remove("hidden");
      setStatus("Berhasil di-HD-in! 🎉", "ok");
    } catch (e) {
      console.error(e);
      setStatus(
        "Gagal memproses. Bisa karena limit, URL/file tidak bisa diakses, atau CORS.",
        "err"
      );
    } finally {
      btn.disabled = false;
      btn.textContent = translations[localStorage.getItem(LANG_KEY) || "id"]
        ?.btn_upscale || "Proses Remini HD";
    }
  }

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    handle();
  });
}

// RemoveBG tool
function initRemoveBg() {
  const fileInput = document.getElementById("removeBgFile");
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

  function getSource() {
    const file = fileInput?.files?.[0];
    if (file) return file;

    const url = (urlInput?.value || "").trim();
    if (url) {
      try {
        new URL(url);
        return url;
      } catch {
        throw new Error(
          "URL tidak valid. Harus diawali http:// atau https://"
        );
      }
    }
    throw new Error(
      "Pilih file gambar atau isi URL gambar terlebih dahulu."
    );
  }

  async function handle() {
    let source;
    try {
      source = getSource();
    } catch (e) {
      setStatus(e.message, "err");
      return;
    }

    btn.disabled = true;
    btn.textContent = "Memproses...";
    setStatus("Lagi diproses di server, sabar sebentar…", "ok");
    if (resultCard) resultCard.classList.add("hidden");

    try {
      if (source instanceof File) {
        if (imgOriginal) imgOriginal.src = URL.createObjectURL(source);
      } else {
        if (imgOriginal) imgOriginal.src = source;
      }

      const result = await window.Api.removeBg(source);
      if (imgOut) imgOut.src = result.imageUrl;
      if (openLink) openLink.href = result.imageUrl;

      if (copyBtn) {
        copyBtn.onclick = async () => {
          try {
            await navigator.clipboard.writeText(result.imageUrl);
            setStatus("Link hasil sudah disalin ke clipboard ✅", "ok");
          } catch {
            setStatus(
              "Gagal menyalin ke clipboard. Salin manual dari URL bar.",
              "err"
            );
          }
        };
      }

      if (resultCard) resultCard.classList.remove("hidden");
      setStatus("Background berhasil dihapus ✨", "ok");
    } catch (e) {
      console.error(e);
      setStatus(
        "Gagal memproses. Bisa karena limit, URL/file tidak bisa diakses, atau CORS.",
        "err"
      );
    } finally {
      btn.disabled = false;
      btn.textContent = translations[localStorage.getItem(LANG_KEY) || "id"]
        ?.btn_removebg || "Hapus Background";
    }
  }

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    handle();
  });
}

// Init
document.addEventListener("DOMContentLoaded", () => {
  initThemeAndMode();
  initWelcomeOverlay();
  initDashboardNav();
  initUpscale();
  initRemoveBg();
});

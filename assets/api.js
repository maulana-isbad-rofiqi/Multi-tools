// assets/api.js
// Wrapper API untuk upscale & removebg.
// Bisa terima File (upload dari device) atau URL string.

(function () {
  const BASE = "https://api.ootaizumi.web.id";

  async function upscale(source) {
    let res;
    if (source instanceof File) {
      const fd = new FormData();
      fd.append("image", source); // SESUAIKAN field name jika API berbeda
      res = await fetch(`${BASE}/tools/upscale`, {
        method: "POST",
        body: fd,
      });
    } else {
      // fallback: pakai URL
      res = await fetch(
        `${BASE}/tools/upscale?imageUrl=${encodeURIComponent(source)}`
      );
    }

    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();

    if (!data || !data.result || !data.result.imageUrl) {
      throw new Error("Response upscale tidak sesuai.");
    }
    return data.result; // { imageUrl, size }
  }

  async function removeBg(source) {
    let res;
    if (source instanceof File) {
      const fd = new FormData();
      fd.append("image", source); // SESUAIKAN field name jika API berbeda
      res = await fetch(`${BASE}/tools/removebg`, {
        method: "POST",
        body: fd,
      });
    } else {
      res = await fetch(
        `${BASE}/tools/removebg?imageUrl=${encodeURIComponent(source)}`
      );
    }

    if (!res.ok) throw new Error("HTTP " + res.status);
    const data = await res.json();

    if (!data || !data.status || !data.result) {
      throw new Error("Response removebg tidak sesuai.");
    }
    return { imageUrl: data.result };
  }

  window.Api = { upscale, removeBg };
})();

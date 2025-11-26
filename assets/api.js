// assets/api.js
// Pisahkan logic API di sini biar rapi.
(function () {
  const BASE = "https://api.ootaizumi.web.id";

  async function upscale(imageUrl) {
    const endpoint = `${BASE}/tools/upscale?imageUrl=${encodeURIComponent(
      imageUrl
    )}`;
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error("HTTP " + res.status);

    const data = await res.json();
    // Perkiraan struktur: { result: { imageUrl, size } }
    if (!data || !data.result || !data.result.imageUrl) {
      throw new Error("Response upscale tidak sesuai.");
    }
    return data.result; // { imageUrl, size }
  }

  async function removeBg(imageUrl) {
    const endpoint = `${BASE}/tools/removebg?imageUrl=${encodeURIComponent(
      imageUrl
    )}`;
    const res = await fetch(endpoint);
    if (!res.ok) throw new Error("HTTP " + res.status);

    const data = await res.json();
    // Perkiraan struktur: { status: true, result: "url" }
    if (!data || !data.status || !data.result) {
      throw new Error("Response removebg tidak sesuai.");
    }
    return { imageUrl: data.result };
  }

  window.Api = { upscale, removeBg };
})();

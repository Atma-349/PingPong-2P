// ============================================================
//  controls.js — Input Keyboard + Sentuh + Skala Canvas
// ============================================================

export const keys = {};

export function initControls() {
    _initKeyboard();
    _initTouch();
    _scaleCanvas();
    window.addEventListener("resize", _scaleCanvas);
    // Jalankan lagi setelah font/layout selesai render
    requestAnimationFrame(_scaleCanvas);
}

// ─── Keyboard ───────────────────────────────────────────────

function _initKeyboard() {
    window.addEventListener("keydown", (e) => {
        keys[e.key.toLowerCase()] = true;
        if (["arrowup","arrowdown"].includes(e.key.toLowerCase())) e.preventDefault();
    });
    window.addEventListener("keyup", (e) => {
        keys[e.key.toLowerCase()] = false;
    });
}

// ─── Tombol Sentuh ──────────────────────────────────────────

const TOUCH_MAP = {
    "btn-p1-up"  : "w",
    "btn-p1-down": "s",
    "btn-p2-up"  : "arrowup",
    "btn-p2-down": "arrowdown",
};

function _initTouch() {
    for (const [id, key] of Object.entries(TOUCH_MAP)) {
        const btn = document.getElementById(id);
        if (!btn) continue;

        const press   = (e) => { e.preventDefault(); keys[key] = true;  btn.classList.add("pressed"); };
        const release = (e) => { e.preventDefault(); keys[key] = false; btn.classList.remove("pressed"); };

        btn.addEventListener("touchstart",  press,   { passive: false });
        btn.addEventListener("touchend",    release, { passive: false });
        btn.addEventListener("touchcancel", release, { passive: false });

        // Fallback mouse (untuk test di PC)
        btn.addEventListener("mousedown",  () => { keys[key] = true;  btn.classList.add("pressed"); });
        btn.addEventListener("mouseup",    () => { keys[key] = false; btn.classList.remove("pressed"); });
        btn.addEventListener("mouseleave", () => { keys[key] = false; btn.classList.remove("pressed"); });
    }
}

// ─── Skala Canvas ───────────────────────────────────────────
// CSS transform tidak mengubah ruang layout, jadi wrapper
// perlu di-set tingginya manual = 500 * scale
// agar tidak ada gap kosong di bawah canvas.

function _scaleCanvas() {
    const container    = document.getElementById("canvas-container");
    const wrapper      = document.getElementById("canvas-wrapper");
    const mobileCtrl   = document.getElementById("mobile-controls");
    if (!container || !wrapper) return;

    const GAME_W = 800;
    const GAME_H = 500;

    // Hitung tinggi yang tersedia untuk canvas
    // = tinggi layar - header - mobile controls - sedikit padding
    const headerH  = (document.querySelector("h1")?.offsetHeight          || 0)
                   + (document.querySelector(".kontrol-info")?.offsetHeight || 0)
                   + 20; // margin/padding
    const ctrlH    = (mobileCtrl?.offsetHeight || 0) + 16;
    const availH   = window.innerHeight - headerH - ctrlH - 16;

    // Skala berdasarkan lebar DAN tinggi yang tersedia, ambil yang lebih kecil
    const scaleW = (window.innerWidth - 16) / GAME_W;
    const scaleH = availH / GAME_H;
    const scale  = Math.min(1, scaleW, scaleH);

    container.style.transform = `scale(${scale})`;

    // Set tinggi wrapper = tinggi canvas setelah di-scale
    // Ini yang mencegah gap kosong
    wrapper.style.height = Math.ceil(GAME_H * scale) + "px";
}

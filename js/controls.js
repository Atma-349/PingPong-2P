// ============================================================
//  controls.js — Penanganan Input (Keyboard + Sentuh)
//  Tanggung jawab: mencatat tombol/sentuh yang aktif ke `keys`.
//  Modul lain cukup baca `keys`, tidak perlu tahu sumbernya.
// ============================================================

export const keys = {};

export function initControls() {
    _initKeyboard();
    _initTouch();
    _initCanvasScale();
}

// ─── Keyboard ───────────────────────────────────────────────

function _initKeyboard() {
    window.addEventListener("keydown", (e) => {
        keys[e.key.toLowerCase()] = true;
        if (["arrowup", "arrowdown"].includes(e.key.toLowerCase())) {
            e.preventDefault();
        }
    });

    window.addEventListener("keyup", (e) => {
        keys[e.key.toLowerCase()] = false;
    });
}

// ─── Tombol Sentuh Mobile ───────────────────────────────────
//  Setiap tombol memetakan ke key keyboard yang sama,
//  sehingga gameLogic.js tidak perlu berubah sama sekali.

const TOUCH_MAP = {
    "btn-p1-up"   : "w",
    "btn-p1-down" : "s",
    "btn-p2-up"   : "arrowup",
    "btn-p2-down" : "arrowdown",
};

function _initTouch() {
    for (const [id, key] of Object.entries(TOUCH_MAP)) {
        const btn = document.getElementById(id);
        if (!btn) continue;

        // touchstart → tekan
        btn.addEventListener("touchstart", (e) => {
            e.preventDefault();
            keys[key] = true;
            btn.classList.add("pressed");
        }, { passive: false });

        // touchend / touchcancel → lepas
        const release = (e) => {
            e.preventDefault();
            keys[key] = false;
            btn.classList.remove("pressed");
        };
        btn.addEventListener("touchend",    release, { passive: false });
        btn.addEventListener("touchcancel", release, { passive: false });

        // Fallback mousedown/mouseup untuk testing di browser PC
        btn.addEventListener("mousedown", () => { keys[key] = true;  btn.classList.add("pressed"); });
        btn.addEventListener("mouseup",   () => { keys[key] = false; btn.classList.remove("pressed"); });
        btn.addEventListener("mouseleave",() => { keys[key] = false; btn.classList.remove("pressed"); });
    }
}

// ─── Skala Canvas Otomatis ──────────────────────────────────
//  Canvas asli 800x500; di layar sempit kita scale-down pakai
//  CSS transform agar game logic tidak berubah.

function _scaleCanvas() {
    const container = document.getElementById("canvas-container");
    if (!container) return;

    const GAME_W   = 800;
    const padding  = 20; // sedikit jarak kiri-kanan
    const maxW     = window.innerWidth - padding;
    const scale    = Math.min(1, maxW / GAME_W);

    container.style.transform = `scale(${scale})`;

    // Sesuaikan tinggi wrapper agar tidak ada gap
    const wrapper = document.getElementById("canvas-wrapper");
    if (wrapper) {
        wrapper.style.height = (500 * scale) + "px";
    }
}

function _initCanvasScale() {
    _scaleCanvas();
    window.addEventListener("resize", _scaleCanvas);
}
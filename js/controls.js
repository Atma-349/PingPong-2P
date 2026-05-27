// ============================================================
//  controls.js — Penanganan Input Keyboard
//  Tanggung jawab: mencatat tombol mana yang sedang ditekan.
//  Modul lain membaca `keys` untuk menggerakkan objek game.
// ============================================================

/**
 * Peta tombol yang sedang ditekan.
 * key   = nama tombol (lowercase), misal "w", "s", "arrowup"
 * value = true  → sedang ditekan
 *         false → tidak ditekan / sudah dilepas
 * @type {Record<string, boolean>}
 */
export const keys = {};

/** Daftarkan listener keyboard ke window. Panggil sekali di main.js. */
export function initControls() {
    window.addEventListener("keydown", (e) => {
        keys[e.key.toLowerCase()] = true;

        // Cegah halaman scroll saat tombol panah dipakai
        if (["arrowup", "arrowdown"].includes(e.key.toLowerCase())) {
            e.preventDefault();
        }
    });

    window.addEventListener("keyup", (e) => {
        keys[e.key.toLowerCase()] = false;
    });
}

/*
 * Referensi tombol yang dipakai di tempat lain:
 *   Pemain 1  →  "w"       (naik)  |  "s"        (turun)
 *   Pemain 2  →  "arrowup" (naik)  |  "arrowdown" (turun)
 */

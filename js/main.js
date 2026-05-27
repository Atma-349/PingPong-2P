// ============================================================
//  main.js — Titik Masuk Aplikasi
//  Tanggung jawab: inisialisasi semua modul, menghubungkan
//  tombol UI, dan menjalankan game loop utama.
//
//  Alur:
//    main.js
//      ├── initControls()   ← controls.js
//      ├── btnStart.onclick ← gameLogic.js (mulaiGame)
//      └── gameLoop()
//            ├── update()   ← gameLogic.js
//            └── draw()     ← renderer.js
// ============================================================

import { initControls }       from "./controls.js";
import { mulaiGame, update }  from "./gameLogic.js";
import { draw }               from "./renderer.js";
import { btnStart }           from "./config.js";

// ─── Inisialisasi ────────────────────────────────────────────

initControls();

// Hubungkan tombol menu ke fungsi mulai game
btnStart.addEventListener("click", mulaiGame);

// ─── Game Loop ───────────────────────────────────────────────

/**
 * Loop utama — dijalankan sekali tiap frame (~60fps).
 * update() mengurus fisika & logika; draw() mengurus grafis.
 */
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();

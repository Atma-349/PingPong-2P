// ============================================================
//  powerup.js — Sistem Power-Up
//  Tanggung jawab: spawn power-up di lapangan, menerapkan efek
//  ke objek game, dan membersihkan efek setelah habis waktu.
// ============================================================

import {
    canvas, statusText,
    BASE_PADDLE_HEIGHT, BALL_BASE_SPEED,
    POWER_UP_TYPES,
    ball, p1, p2,
    powerUpState, state,
} from "./config.js";

import { playSound } from "./audio.js";

// ─── Spawn ──────────────────────────────────────────────────

/** Muncculkan power-up di posisi acak jika belum ada. */
export function spawnPowerUp() {
    if (powerUpState.current || !state.gameBerjalan) return;

    const marginX   = 150;
    const marginY   = 50;
    const randomType = POWER_UP_TYPES[Math.floor(Math.random() * POWER_UP_TYPES.length)];

    powerUpState.current = {
        x   : marginX + Math.random() * (canvas.width  - marginX * 2),
        y   : marginY + Math.random() * (canvas.height - marginY * 2),
        size: 25,
        ...randomType,
    };
}

// ─── Clear Efek ─────────────────────────────────────────────

/** Kembalikan semua nilai yang terpengaruh power-up ke normal. */
export function clearEffects() {
    ball.speed = BALL_BASE_SPEED;
    p1.height  = BASE_PADDLE_HEIGHT;
    p2.height  = BASE_PADDLE_HEIGHT;

    statusText.innerText = state.gameBerjalan
        ? `Target: ${state.targetPoin} Poin`
        : "Menunggu Permainan...";
    statusText.style.color = "#ccc";
}

// ─── Terapkan Efek ──────────────────────────────────────────

/**
 * Terapkan efek power-up yang diambil bola ke state game.
 * @param {{ type: string, name: string, color: string }} powerUp
 */
export function applyPowerUp(powerUp) {
    // Batalkan efek sebelumnya yang masih berjalan
    clearTimeout(powerUpState.activeEffectTimer);
    clearEffects();
    playSound('powerup');

    statusText.innerText   = `EFEK: ${powerUp.name}`;
    statusText.style.color = powerUp.color;

    switch (powerUp.type) {
        case "speed":
            ball.dx = (ball.dx > 0 ? 1 : -1) * 11;
            ball.dy = (ball.dy > 0 ? 1 : -1) * 7;
            powerUpState.activeEffectTimer = setTimeout(clearEffects, 5000);
            break;

        case "slow":
            ball.dx = (ball.dx > 0 ? 1 : -1) * 3;
            ball.dy = (ball.dy > 0 ? 1 : -1) * 1.5;
            powerUpState.activeEffectTimer = setTimeout(clearEffects, 5000);
            break;

        case "teleport":
            ball.x  = 200 + Math.random() * (canvas.width - 400);
            ball.y  = 100 + Math.random() * (canvas.height - 200);
            ball.dx = (Math.random() > 0.5 ? 1 : -1) * ball.speed;
            ball.dy = (Math.random() > 0.5 ? 4 : -4);
            // Efek teleport sekali pakai — kembalikan label setelah 1 detik
            setTimeout(() => {
                if (state.gameBerjalan) {
                    statusText.innerText = `Target: ${state.targetPoin} Poin`;
                }
            }, 1000);
            break;

        case "big":
            if      (ball.lastHit === "p1") p1.height = BASE_PADDLE_HEIGHT * 2;
            else if (ball.lastHit === "p2") p2.height = BASE_PADDLE_HEIGHT * 2;
            powerUpState.activeEffectTimer = setTimeout(clearEffects, 7000);
            break;
    }

    powerUpState.current = null;
}

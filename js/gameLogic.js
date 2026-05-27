// ============================================================
//  gameLogic.js — Logika Inti Game (Update per Frame)
//  Tanggung jawab: pergerakan objek, deteksi tabrakan, skor,
//  reset bola, serta transisi state mulai / game over.
// ============================================================

import {
    canvas,
    PADDLE_WIDTH, PADDLE_SPEED, BASE_PADDLE_HEIGHT, BALL_BASE_SPEED,
    ball, p1, p2,
    powerUpState, state,
    menuUtama, judulMenu, pemenangTeks, btnStart, maxScoreInput, statusText,
} from "./config.js";

import { keys }                          from "./controls.js";
import { playSound, inisialisasiAudio }  from "./audio.js";
import { spawnPowerUp, applyPowerUp, clearEffects } from "./powerup.js";

const POWER_UP_SPAWN_INTERVAL = 400; // frame

// ─── Transisi State ─────────────────────────────────────────

/** Mulai / restart game. Dipanggil dari tombol menu. */
export function mulaiGame() {
    inisialisasiAudio();

    state.targetPoin  = parseInt(maxScoreInput.value) || 5;
    state.gameBerjalan = true;

    p1.score = 0;
    p2.score = 0;

    menuUtama.style.display = "none";

    resetBall(Math.random() > 0.5 ? 1 : -1);
}

/** Akhiri game dan tampilkan layar kemenangan. */
function gameOver(nomorPemenang) {
    state.gameBerjalan = false;
    clearTimeout(powerUpState.activeEffectTimer);
    playSound('gameover');

    judulMenu.innerText        = "PERMAINAN SELESAI";
    pemenangTeks.innerText     = `🏆 PEMAIN ${nomorPemenang} MENANG! 🏆`;
    pemenangTeks.style.display = "block";
    btnStart.innerText         = "MAIN LAGI";
    menuUtama.style.display    = "flex";
}

// ─── Reset ──────────────────────────────────────────────────

/**
 * Kembalikan bola ke tengah dan beri arah awal.
 * @param {1|-1} direction — ke kanan (+1) atau kiri (-1)
 */
export function resetBall(direction) {
    clearEffects();

    ball.x      = canvas.width  / 2;
    ball.y      = canvas.height / 2;
    ball.dx     = direction * BALL_BASE_SPEED;
    ball.dy     = Math.random() > 0.5 ? 3 : -3; // selalu miring, tidak pernah 0
    ball.lastHit = null;

    powerUpState.current    = null;
    powerUpState.spawnTimer = 0;
}

// ─── Update Utama ───────────────────────────────────────────

/** Dipanggil sekali tiap frame oleh game loop. */
export function update() {
    if (!state.gameBerjalan) return;

    _movePaddles();
    _clampPaddles();
    _moveBall();
    _handleWallBounce();
    _handlePaddleCollision();
    _handlePowerUpSpawn();
    _handlePowerUpPickup();
    _handleScoring();
}

// ─── Fungsi Privat (konvensi _prefix) ───────────────────────

function _movePaddles() {
    if (keys['w'] && p1.y > 0)                          p1.y -= PADDLE_SPEED;
    if (keys['s'] && p1.y < canvas.height - p1.height)  p1.y += PADDLE_SPEED;

    if (keys['arrowup']   && p2.y > 0)                  p2.y -= PADDLE_SPEED;
    if (keys['arrowdown'] && p2.y < canvas.height - p2.height) p2.y += PADDLE_SPEED;
}

/** Pastikan paddle tidak keluar area bawah layar setelah height berubah. */
function _clampPaddles() {
    if (p1.y + p1.height > canvas.height) p1.y = canvas.height - p1.height;
    if (p2.y + p2.height > canvas.height) p2.y = canvas.height - p2.height;
}

function _moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
}

function _handleWallBounce() {
    if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
        ball.dy *= -1;
    }
}

function _handlePaddleCollision() {
    // Tabrakan dengan raket P1 (sisi kiri)
    if (
        ball.x - ball.radius < p1.x + PADDLE_WIDTH &&
        ball.y > p1.y && ball.y < p1.y + p1.height
    ) {
        ball.dx = Math.abs(ball.dx); // pastikan bola ke kanan
        ball.dy = (ball.y - (p1.y + p1.height / 2)) * 0.15;
        if (Math.abs(ball.dy) < 0.5) ball.dy = Math.random() > 0.5 ? 1.5 : -1.5; // anti-glitch
        ball.lastHit = "p1";
        playSound('hit');
    }

    // Tabrakan dengan raket P2 (sisi kanan)
    if (
        ball.x + ball.radius > p2.x &&
        ball.y > p2.y && ball.y < p2.y + p2.height
    ) {
        ball.dx = -Math.abs(ball.dx); // pastikan bola ke kiri
        ball.dy = (ball.y - (p2.y + p2.height / 2)) * 0.15;
        if (Math.abs(ball.dy) < 0.5) ball.dy = Math.random() > 0.5 ? 1.5 : -1.5; // anti-glitch
        ball.lastHit = "p2";
        playSound('hit');
    }
}

function _handlePowerUpSpawn() {
    if (!powerUpState.current) {
        powerUpState.spawnTimer++;
        if (powerUpState.spawnTimer > POWER_UP_SPAWN_INTERVAL) {
            spawnPowerUp();
            powerUpState.spawnTimer = 0;
        }
    }
}

function _handlePowerUpPickup() {
    const pUp = powerUpState.current;
    if (!pUp) return;

    const hit =
        ball.x + ball.radius  > pUp.x         &&
        ball.x - ball.radius  < pUp.x + pUp.size &&
        ball.y + ball.radius  > pUp.y         &&
        ball.y - ball.radius  < pUp.y + pUp.size;

    if (hit) applyPowerUp(pUp);
}

function _handleScoring() {
    // Bola keluar kiri → P2 skor
    if (ball.x < 0) {
        p2.score++;
        playSound('score');
        if (p2.score >= state.targetPoin) gameOver("2 (KANAN)");
        else resetBall(-1);
        return;
    }

    // Bola keluar kanan → P1 skor
    if (ball.x > canvas.width) {
        p1.score++;
        playSound('score');
        if (p1.score >= state.targetPoin) gameOver("1 (KIRI)");
        else resetBall(1);
    }
}

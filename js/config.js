// ============================================================
//  config.js — Konfigurasi & State Global
//  Berisi semua konstanta dan variabel state yang dibagi pakai
//  antar modul. Tidak ada logika di sini.
// ============================================================

// --- Referensi DOM ---
const canvas     = document.getElementById("pongCanvas");
const ctx        = canvas.getContext("2d");
const statusText = document.getElementById("status-efek");
const menuUtama  = document.getElementById("menu-utama");
const judulMenu  = document.getElementById("judul-menu");
const pemenangTeks = document.getElementById("pemenang-teks");
const maxScoreInput = document.getElementById("maxScore");
const btnStart   = document.getElementById("btn-start");

// --- Konstanta Fisika ---
export const PADDLE_WIDTH       = 10;
export const BASE_PADDLE_HEIGHT = 100;
export const PADDLE_SPEED       = 8;
export const BALL_BASE_SPEED    = 5;
export const BALL_RADIUS        = 8;

// --- State Game ---
export const state = {
    gameBerjalan : false,
    targetPoin   : 5,
};

// --- Objek Pemain ---
export const p1 = {
    x: 10,
    y: canvas.height / 2 - BASE_PADDLE_HEIGHT / 2,
    height: BASE_PADDLE_HEIGHT,
    score: 0,
};

export const p2 = {
    x: canvas.width - 10 - PADDLE_WIDTH,
    y: canvas.height / 2 - BASE_PADDLE_HEIGHT / 2,
    height: BASE_PADDLE_HEIGHT,
    score: 0,
};

// --- Objek Bola ---
export const ball = {
    x       : canvas.width  / 2,
    y       : canvas.height / 2,
    radius  : BALL_RADIUS,
    baseSpeed: BALL_BASE_SPEED,
    speed   : BALL_BASE_SPEED,
    dx      : BALL_BASE_SPEED,
    dy      : 3,
    lastHit : null,          // "p1" | "p2" | null
};

// --- Definisi Jenis Power-Up ---
export const POWER_UP_TYPES = [
    { name: "CEPAT ⚡",    color: "#ff3333", type: "speed"    },
    { name: "LAMBAT 🐢",   color: "#33ffff", type: "slow"     },
    { name: "TELEPORT 🌀", color: "#cc33ff", type: "teleport" },
    { name: "RAKSASA 🎈",  color: "#33ff33", type: "big"      },
];

// --- State Power-Up ---
export const powerUpState = {
    current           : null,   // objek power-up aktif di lapangan (null = tidak ada)
    spawnTimer        : 0,
    activeEffectTimer : null,   // ID setTimeout efek aktif
};

// --- Ekspor DOM refs agar modul lain bisa pakai tanpa query ulang ---
export { canvas, ctx, statusText, menuUtama, judulMenu, pemenangTeks, maxScoreInput, btnStart };

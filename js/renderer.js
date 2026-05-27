// ============================================================
//  renderer.js — Rendering (Grafis Canvas)
//  Tanggung jawab: menggambar semua objek ke canvas setiap frame.
//  Tidak mengubah state game sama sekali; hanya membaca dan menampilkan.
// ============================================================

import {
    canvas, ctx,
    PADDLE_WIDTH,
    ball, p1, p2,
    powerUpState, state,
} from "./config.js";

/**
 * Render satu frame penuh ke canvas.
 * Dipanggil oleh game loop setelah update().
 */
export function draw() {
    _drawBackground();
    _drawCenterLine();
    _drawPaddles();
    _drawPowerUp();
    _drawBall();
    _drawScores();
}

// ─── Fungsi Privat ───────────────────────────────────────────

function _drawBackground() {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function _drawCenterLine() {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
    ctx.lineWidth   = 4;
    ctx.setLineDash([10, 10]);

    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();

    ctx.setLineDash([]); // reset ke solid
}

function _drawPaddles() {
    ctx.fillStyle = "#fff";
    ctx.fillRect(p1.x, p1.y, PADDLE_WIDTH, p1.height);
    ctx.fillRect(p2.x, p2.y, PADDLE_WIDTH, p2.height);
}

function _drawPowerUp() {
    const pUp = powerUpState.current;
    if (!pUp) return;

    // Kotak berwarna
    ctx.fillStyle = pUp.color;
    ctx.fillRect(pUp.x, pUp.y, pUp.size, pUp.size);

    // Label "?" di tengah kotak
    ctx.fillStyle  = "#000";
    ctx.font       = "bold 16px sans-serif";
    ctx.fillText("?", pUp.x + 8, pUp.y + 18);
}

function _drawBall() {
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();
}

function _drawScores() {
    ctx.font      = "48px 'Courier New'";
    ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
    ctx.fillText(p1.score, canvas.width / 4,            60);
    ctx.fillText(p2.score, (canvas.width / 4) * 3 - 30, 60);
}

export function confettiBurst(opts = {}) {
  try {
    const duration = 900;
    const colors = ["#A78BFA", "#60A5FA", "#34D399", "#FBBF24", "#FB7185"];
    const particles = 120;

    const canvas = document.createElement("canvas");
    canvas.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:9999";
    document.body.appendChild(canvas);
    const ctx = canvas.getContext("2d");
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const resize = () => { canvas.width = window.innerWidth * dpr; canvas.height = window.innerHeight * dpr; };
    resize();
    const onResize = () => resize();
    window.addEventListener("resize", onResize);

    const P = [];
    for (let i = 0; i < particles; i++) {
      const startX = Number.isFinite(opts.originX) ? opts.originX * dpr : Math.random() * canvas.width;
      const startY = Number.isFinite(opts.originY) ? opts.originY * dpr : -20 * dpr;
      P.push({
        x: startX + (Math.random() - 0.5) * 40 * dpr,
        y: startY,
        r: 2 + Math.random() * 4,
        c: colors[(Math.random() * colors.length) | 0],
        vx: (Math.random() - 0.5) * 6 * dpr,
        vy: (2 + Math.random() * 6) * dpr,
        g: 0.15 * dpr,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.2,
      });
    }

    const start = performance.now();
    const tick = (t) => {
      const elapsed = t - start;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalAlpha = Math.max(0, 1 - elapsed / duration);
      for (const p of P) {
        p.vy += p.g; p.x += p.vx; p.y += p.vy; p.rot += p.vr;
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c;
        ctx.fillRect(-p.r, -p.r, p.r * 2, p.r * 2);
        ctx.restore();
      }
      if (elapsed < duration) requestAnimationFrame(tick); else { window.removeEventListener("resize", onResize); canvas.remove(); }
    };
    requestAnimationFrame(tick);
  } catch {}
}

export function playChime() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99];
    notes.forEach((f, i) => {
      const o = ctx.createOscillator(); const g = ctx.createGain();
      o.type = "sine"; o.frequency.value = f; o.connect(g); g.connect(ctx.destination);
      const t0 = now + i * 0.05; g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.2, t0 + 0.01); o.start(t0);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.35); o.stop(t0 + 0.36);
    });
  } catch {}
}

export const MOTIVATION_QUOTES = [
  "Tuyệt vời! Thêm một bước gần tới mục tiêu!",
  "Bạn làm rất tốt! Tiếp tục phong độ này nhé!",
  "Hoàn hảo! Sức mạnh đến từ thói quen nhỏ!",
  "Good job! Tập trung thêm một Pomodoro nữa?",
  "Xuất sắc! Thành công là cộng dồn những nỗ lực nhỏ.",
];


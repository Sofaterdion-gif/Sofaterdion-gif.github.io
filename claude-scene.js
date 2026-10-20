/* Claude × Open Bell：動態立繪與會動的 Clawd。
 * 立繪是遊戲內首頁（home_scene.gd）的 Canvas 版本：Claude 少女捧書、牽著 Clawd 在流動的 K 線上散步。
 * 另有一隻固定在頁面底部散步的小 Clawd，點牠會跳。尊重 prefers-reduced-motion。 */
(function () {
  "use strict";
  var TERRA = "#d97757", TERRA_DARK = "#b4573a", TERRA_LIGHT = "#eea184";
  var CREAM = "#f4efe6", CREAM_SHADE = "#e2d8c8", INK = "#1f1b19";
  var SKIN = "#f8dcc8", SKIN_SHADE = "#eec4aa", HAIR = "#c2603f", HAIR_HI = "#e58a68";
  var UP = [64, 209, 143], DOWN = [240, 97, 102];
  var W = 640, H = 560, GROUND = 452;
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function rgba(c, a) { return "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + a + ")"; }
  function hexA(hex, a) {
    var n = parseInt(hex.slice(1), 16);
    return "rgba(" + (n >> 16) + "," + ((n >> 8) & 255) + "," + (n & 255) + "," + a + ")";
  }
  function price(i) { return Math.sin(i * 0.37) * 0.55 + Math.sin(i * 0.11 + 1.3) * 0.9 + Math.sin(i * 0.83) * 0.18; }
  function fmod(a, b) { return a - Math.floor(a / b) * b; }

  function poly(c, pts, color) {
    c.beginPath();
    c.moveTo(pts[0][0], pts[0][1]);
    for (var i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]);
    c.closePath();
    c.fillStyle = color; c.fill();
  }
  function line(c, pts, color, width) {
    c.beginPath();
    c.moveTo(pts[0][0], pts[0][1]);
    for (var i = 1; i < pts.length; i++) c.lineTo(pts[i][0], pts[i][1]);
    c.strokeStyle = color; c.lineWidth = width; c.lineCap = "round"; c.lineJoin = "round"; c.stroke();
  }
  function dot(c, x, y, r, color) { c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fillStyle = color; c.fill(); }
  function rect(c, x, y, w, h, color) { c.fillStyle = color; c.fillRect(x, y, w, h); }
  function ellipse(c, cx, cy, rx, ry, color) {
    c.beginPath(); c.ellipse(cx, cy, Math.max(rx, 0.01), Math.max(ry, 0.01), 0, 0, Math.PI * 2);
    c.fillStyle = color; c.fill();
  }
  function limb(c, a, j, b, w, color, shade) {
    line(c, [a, j, b], shade, w + 2);
    line(c, [a, j, b], color, w);
    dot(c, a[0], a[1], w / 2, color); dot(c, j[0], j[1], w / 2, color); dot(c, b[0], b[1], w / 2, color);
  }

  /* ---------- 背景與地面 ---------- */
  function backdrop(c, t) {
    var scroll = t * 0.9, n, i, x;
    for (n = -1; n < 13; n++) {
      i = n + Math.floor(scroll);
      x = (n - fmod(scroll, 1)) * 58 + 20;
      var a = price(i * 0.5), b = price(i * 0.5 + 0.5);
      var topY = 250 - Math.max(a, b) * 70, botY = 250 - Math.min(a, b) * 70;
      var col = rgba(b >= a ? UP : DOWN, 0.09);
      rect(c, x - 14, topY, 28, Math.max(botY - topY, 6), col);
      line(c, [[x, topY - 26], [x, botY + 26]], col, 2);
    }
    var pts = [];
    for (var s = 0; s <= 32; s++) pts.push([s * 20, 190 - price(s * 0.55 + t * 0.7) * 38]);
    line(c, pts, hexA(TERRA, 0.25), 1.5);
    for (var k = 0; k < 14; k++) {
      var sx = fmod(k * 97 + 40 - t * (6 + (k % 4) * 3), W + 40) - 20;
      var sy = 70 + fmod(k * 53, 260) + Math.sin(t * 0.8 + k) * 8;
      dot(c, sx, sy, 1.6 + (k % 3), hexA(CREAM, (0.35 + 0.35 * Math.sin(t * 1.7 + k * 1.9)) * 0.5));
    }
  }

  function ground(c, t) {
    var slot = 26, speed = 3.2 * 26 / (Math.PI * 2) * 2, scroll = t * speed;
    var base = Math.floor(scroll / slot), off = fmod(scroll, slot);
    for (var k = 0; k < 12; k++) {
      var seg = W / 12;
      line(c, [[k * seg, GROUND], [(k + 1) * seg, GROUND]], hexA(TERRA, 0.55 * Math.min(Math.max((k + 1) / 5, 0), 1)), 2);
    }
    for (var row = 1; row < 4; row++) line(c, [[0, GROUND + row * 26], [W, GROUND + row * 26]], hexA(CREAM, 0.05), 1);
    var closes = [];
    for (var n = -1; n < Math.floor(W / slot) + 3; n++) {
      var i = base + n, x = n * slot - off + slot / 2;
      var o = price(i), cl = price(i + 1), col = rgba(cl >= o ? UP : DOWN, 0.72);
      var mid = GROUND + 62 - (o + cl) * 11;
      var bt = mid - Math.abs(cl - o) * 16 - 5, bb = mid + Math.abs(cl - o) * 16 + 5;
      var wt = bt - 10 - Math.abs(Math.sin(i * 1.7)) * 16, wb = bb + 8 + Math.abs(Math.sin(i * 2.3)) * 18;
      line(c, [[x, wt], [x, wb]], col, 1.6);
      rect(c, x - 7, bt, 14, bb - bt, col);
      closes.push([x, bt - 6]);
    }
    line(c, closes, hexA(CREAM, 0.35), 1.4);
  }

  /* ---------- 少女 ---------- */
  function spark(c, x, y, r, t) {
    var spin = Math.sin(t * 1.2) * 0.12;
    for (var k = 0; k < 12; k++) {
      var a = k / 12 * Math.PI * 2 + spin, len = r * (k % 2 === 0 ? 1 : 0.62);
      line(c, [[x, y], [x + Math.cos(a) * len, y + Math.sin(a) * len]], CREAM, 2.2);
    }
    dot(c, x, y, 2.4, TERRA);
  }

  function eye(c, x, y, h, side) {
    ellipse(c, x, y, 9.5, h, "#fffaf3");
    if (h > 3) {
      var ih = Math.min(h, 10);
      ellipse(c, x, y + 0.5, 7, ih * 0.95, "#7a3a28");
      ellipse(c, x, y + 1, 4.2, ih * 0.55, "#2a1410");
      dot(c, x - 2.6, y - h * 0.35, 2.4, "#fff");
      dot(c, x + 2.4, y + h * 0.35, 1.2, "rgba(255,255,255,.8)");
    }
    c.beginPath(); c.arc(x, y, h * 0.95 + 0.5, Math.PI * 1.08, Math.PI * 1.92);
    c.strokeStyle = INK; c.lineWidth = 2.4; c.lineCap = "round"; c.stroke();
    line(c, [[x + side * 10, y - 2], [x + side * 14, y - 6]], INK, 2);
  }

  function head(c, hx, hy, t, phase) {
    var tilt = Math.sin(phase * 0.5) * 0.015;
    c.save(); c.translate(hx, hy); c.rotate(tilt); c.translate(-hx, -hy);
    var face = [];
    for (var k = 0; k <= 32; k++) {
      var a = k / 32 * Math.PI * 2, px = Math.cos(a) * 44, py = Math.sin(a) * 44 * 1.02;
      if (Math.sin(a) > 0) px *= 1 - Math.sin(a) * 0.3;
      face.push([hx + px, hy + py]);
    }
    poly(c, face, SKIN);
    var flick = Math.sin(phase * 0.5) * 3;
    poly(c, [[hx - 46, hy - 2], [hx - 50, hy + 52], [hx - 36, hy + 60], [hx - 34, hy + 20]], HAIR);
    poly(c, [[hx + 46, hy - 2], [hx + 50, hy + 56 + flick], [hx + 38, hy + 60 + flick], [hx + 35, hy + 20]], HAIR);
    poly(c, [[hx - 50, hy], [hx - 48, hy - 34], [hx - 28, hy - 54], [hx, hy - 60], [hx + 28, hy - 54], [hx + 48, hy - 34],
      [hx + 50, hy], [hx + 40, hy - 14], [hx + 30, hy + 4], [hx + 16, hy - 16], [hx + 4, hy + 8], [hx - 8, hy - 16],
      [hx - 22, hy + 2], [hx - 38, hy - 14]], HAIR);
    line(c, [[hx - 30, hy - 48], [hx - 10, hy - 54], [hx + 14, hy - 52]], HAIR_HI, 3);
    var ah = [];
    for (var j = 0; j < 9; j++) { var u = j / 8; ah.push([hx + 2 + Math.sin(u * 3 + phase) * 6 * u + u * 8, hy - 58 - u * 34]); }
    line(c, ah, HAIR, 4);
    spark(c, hx - 34, hy - 38, 11, t);
    var bc = fmod(t, 4.2), open = bc > 0.14 ? 1 : Math.abs(bc / 0.14 - 0.5) * 2;
    var eh = 11 * Math.max(open, 0.08);
    eye(c, hx - 17, hy + 12, eh, -1); eye(c, hx + 17, hy + 12, eh, 1);
    dot(c, hx - 27, hy + 26, 5, hexA(TERRA_LIGHT, 0.45)); dot(c, hx + 27, hy + 26, 5, hexA(TERRA_LIGHT, 0.45));
    c.beginPath(); c.arc(hx, hy + 28, 6, 0.25, Math.PI - 0.25);
    c.strokeStyle = TERRA_DARK; c.lineWidth = 1.6; c.lineCap = "round"; c.stroke();
    c.restore();
  }

  function book(c, cx, cy) {
    var hx = 34, hy = 26, x = cx - hx, y = cy - hy;
    rect(c, x + 3, y + 4, hx * 2, hy * 2, "rgba(0,0,0,.18)");
    rect(c, x, y, hx * 2, hy * 2, TERRA_DARK);
    rect(c, x, y + 2, hx * 2 - 3, hy * 2 - 5, TERRA);
    rect(c, x + hx * 2 - 4, y + 4, 4, hy * 2 - 8, CREAM);
    rect(c, x, y, 6, hy * 2, TERRA_DARK);
    for (var k = 0; k < 3; k++) {
      var bx = cx - 10 + k * 12, bh = 8 + ((k * 5) % 9);
      line(c, [[bx, cy - bh - 3], [bx, cy + bh * 0.5 + 6]], "#f6d6a8", 1.2);
      rect(c, bx - 3, cy - bh * 0.5, 6, bh, "#f6d6a8");
    }
  }

  function girl(c, t, phase, bob) {
    var cx = 238, sway = Math.sin(phase) * 0.5, hip = [cx, 336 - bob];
    [-1, 1].forEach(function (side) {
      var swing = Math.sin(phase + (side < 0 ? 0 : Math.PI));
      var foot = [cx + side * 12 + swing * 26, GROUND - Math.max(0, -swing) * 14];
      var knee = [hip[0] + side * 10 + swing * 10, hip[1] + 50];
      limb(c, [hip[0] + side * 10, hip[1] + 6], knee, foot, 10, SKIN, SKIN_SHADE);
      poly(c, [[foot[0] - 9, foot[1] - 16], [foot[0] + 9, foot[1] - 16], [foot[0] + 15 + Math.max(swing, 0) * 4, foot[1] + 2], [foot[0] - 9, foot[1] + 2]], INK);
      rect(c, foot[0] - 9, foot[1] - 18, 18, 5, TERRA_DARK);
    });
    var hx = cx + 4, hy = 236 - bob, bs = Math.sin(phase - 0.9) * 10 - 6;
    poly(c, [[hx - 52, hy - 20], [hx - 58, hy + 40], [hx - 70 + bs, hy + 120], [hx - 48 + bs * 1.3, hy + 168], [hx - 26 + bs, hy + 128],
      [hx - 6, hy + 70], [hx + 30, hy + 30], [hx + 44, hy - 26]], HAIR);
    line(c, [[hx - 44, hy + 10], [hx - 52 + bs * 0.6, hy + 92], [hx - 42 + bs, hy + 150]], HAIR_HI, 2);
    var hy2 = 410 - bob * 0.3;
    var hl = [cx - 48 + sway * 8, hy2], hr = [cx + 52 + sway * 8, hy2];
    var m1 = [cx - 12 + sway * 12, hy2 + 4], m2 = [cx + 20 + sway * 12, hy2 + 8];
    poly(c, [[hip[0] - 24, hip[1] - 8], [hip[0] + 24, hip[1] - 8], hr, m2, m1, hl], CREAM);
    line(c, [hl, m1, m2, hr], TERRA, 4);
    [-0.5, 0, 0.5].forEach(function (f) { line(c, [[hip[0] + f * 30, hip[1] + 4], [hip[0] + f * 80 + sway * 8, hip[1] + 70]], CREAM_SHADE, 1.5); });
    var ch = [cx, 292 - bob];
    poly(c, [[ch[0] - 30, ch[1] - 26], [ch[0] + 30, ch[1] - 26], [ch[0] + 26, ch[1] + 44], [ch[0] - 26, ch[1] + 44]], CREAM);
    poly(c, [[ch[0] - 20, ch[1] - 8], [ch[0] + 20, ch[1] - 8], [ch[0] + 25, ch[1] + 44], [ch[0] - 25, ch[1] + 44]], TERRA);
    line(c, [[ch[0], ch[1] - 8], [ch[0], ch[1] + 44]], TERRA_DARK, 1.5);
    var bw = [ch[0], ch[1] - 20];
    poly(c, [bw, [bw[0] - 16, bw[1] - 9], [bw[0] - 16, bw[1] + 9]], TERRA_DARK);
    poly(c, [bw, [bw[0] + 16, bw[1] - 9], [bw[0] + 16, bw[1] + 9]], TERRA_DARK);
    dot(c, bw[0], bw[1], 4, TERRA_LIGHT);
    rect(c, hx - 7, hy + 36, 14, 22, SKIN_SHADE);
    head(c, hx, hy, t, phase);
    var bc = [ch[0] - 2, ch[1] + 18 + Math.sin(phase * 2) * 1.5];
    book(c, bc[0], bc[1]);
    dot(c, bc[0] - 26, bc[1] + 22, 8, SKIN); dot(c, bc[0] + 28, bc[1] + 14, 8, SKIN);
    limb(c, [ch[0] - 26, ch[1] - 14], [ch[0] - 38, ch[1] + 16], [bc[0] - 26, bc[1] + 22], 8, CREAM, CREAM_SHADE);
    var sf = [ch[0] + 28, ch[1] - 14];
    var hand = [cx + 112, 360 - bob * 0.6 + Math.sin(phase + 0.5) * 3];
    limb(c, sf, [sf[0] + 40, sf[1] + 22], hand, 8, CREAM, CREAM_SHADE);
    dot(c, hand[0], hand[1], 8.5, SKIN);
    return hand;
  }

  /* ---------- Clawd ---------- */
  // 畫 Clawd 本體：(x, groundY) 為腳底中心，unit 為像素單位，gait 為步伐相位。
  function clawdBody(c, x, gy, unit, gait, bob, t, blinkOffset) {
    var bw = unit * 8, bh = unit * 5, leg = unit * 2.6;
    var left = x - bw / 2, top = gy - leg - bh - bob;
    var sh = [];
    for (var k = 0; k <= 24; k++) { var a = k / 24 * Math.PI * 2; sh.push([x + Math.cos(a) * unit * 5, gy + 6 + Math.sin(a) * 6]); }
    poly(c, sh, "rgba(0,0,0,.22)");
    for (var l = 0; l < 4; l++) {
      var lift = Math.max(0, Math.sin(gait + l * Math.PI * 0.5 + 0.8)) * unit * 0.8;
      rect(c, left + unit * (0.6 + l * 2) + 1, top + bh - 4, unit * 1.4, leg + 4 - lift, TERRA_DARK);
    }
    rect(c, left, top, bw, bh, TERRA);
    rect(c, left, top, bw, unit * 0.6, TERRA_LIGHT);
    var arm = Math.sin(gait) * unit * 0.45;
    rect(c, left - unit * 1.6, top + unit * 1.6 + arm, unit * 1.6, unit * 1.4, TERRA);
    rect(c, left + bw, top + unit * 1.6 - arm, unit * 1.6, unit * 1.4, TERRA);
    var blink = fmod(t + (blinkOffset || 1.3), 3.6) < 0.12, eh = blink ? unit / 3 : unit * 1.3;
    [1.9, 5.1].forEach(function (ex) { rect(c, left + unit * ex, top + unit * 1.5 + (unit * 1.3 - eh) / 2, unit, eh, INK); });
    return { collar: [left + unit * 0.6, top + unit * 3.2], top: top };
  }

  function leash(c, a, b, phase) {
    var sag = 18 + Math.sin(phase * 1.5) * 5, mid = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2 + sag], pts = [];
    for (var k = 0; k <= 16; k++) {
      var u = k / 16;
      var p1 = [a[0] + (mid[0] - a[0]) * u, a[1] + (mid[1] - a[1]) * u];
      var p2 = [mid[0] + (b[0] - mid[0]) * u, mid[1] + (b[1] - mid[1]) * u];
      pts.push([p1[0] + (p2[0] - p1[0]) * u, p1[1] + (p2[1] - p1[1]) * u]);
    }
    line(c, pts, CREAM, 2.4);
  }

  /* ---------- 立繪 canvas ---------- */
  function initScene(canvas) {
    var c = canvas.getContext("2d"), start = performance.now(), visible = true, raf = 0;
    function resize() {
      var r = canvas.getBoundingClientRect(), dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(r.width * dpr); canvas.height = Math.round(r.height * dpr);
    }
    function frame(now) {
      var t = reduced ? 0.6 : (now - start) / 1000, phase = t * 3.2;
      var sc = Math.min(canvas.width / W, canvas.height / H);
      c.setTransform(1, 0, 0, 1, 0, 0);
      c.clearRect(0, 0, canvas.width, canvas.height);
      c.setTransform(sc, 0, 0, sc, (canvas.width - W * sc) / 2, canvas.height - H * sc);
      backdrop(c, t); ground(c, t);
      var bob = Math.abs(Math.sin(phase)) * 5;
      var hand = girl(c, t, phase, bob);
      var cb = Math.abs(Math.sin(phase * 1.5 + 0.8)) * 4;
      var info = clawdBody(c, 470, GROUND, 9, phase * 1.5, cb, t);
      leash(c, hand, [info.collar[0] - 4, info.collar[1]], phase);
      if (!reduced && visible) raf = requestAnimationFrame(frame);
    }
    resize();
    window.addEventListener("resize", function () { resize(); if (reduced) frame(0); });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) {
        var was = visible; visible = es[0].isIntersecting;
        if (visible && !was && !reduced) raf = requestAnimationFrame(frame);
      }).observe(canvas);
    }
    raf = requestAnimationFrame(frame);
  }

  /* ---------- 底部散步的小 Clawd ---------- */
  function initWalker(canvas, bubble) {
    var c = canvas.getContext("2d"), dpr = Math.min(window.devicePixelRatio || 1, 2);
    var CW = 120, CH = 90;
    canvas.width = CW * dpr; canvas.height = CH * dpr;
    var x = 40, dir = 1, jump = 0, start = performance.now(), last = start, said = 0;
    var lines = ["嗨！我是 Clawd", "今天也別追高喔", "要看看復盤嗎？", "停損設好了嗎？", "一局行情，一次復盤"];
    function say(text) {
      bubble.textContent = text; bubble.classList.add("show");
      clearTimeout(say.timer); say.timer = setTimeout(function () { bubble.classList.remove("show"); }, 2400);
    }
    canvas.addEventListener("click", function () { jump = 1; say(lines[said++ % lines.length]); });
    function place() {
      var el = canvas.parentNode;
      el.style.transform = "translateX(" + Math.round(x) + "px)";
      canvas.style.transform = dir < 0 ? "scaleX(-1)" : "none";
    }
    function frame(now) {
      var dt = Math.min((now - last) / 1000, 0.05), t = (now - start) / 1000; last = now;
      var max = window.innerWidth - CW - 12;
      if (!reduced) {
        x += dir * 34 * dt;
        if (x > max) { x = max; dir = -1; } else if (x < 8) { x = 8; dir = 1; }
      }
      if (jump > 0) jump = Math.max(0, jump - dt * 2.2);
      var hop = Math.sin(jump * Math.PI) * 26;
      c.setTransform(dpr, 0, 0, dpr, 0, 0); c.clearRect(0, 0, CW, CH);
      clawdBody(c, CW / 2 - 4, CH - 14 - hop, 5.2, reduced ? 0.5 : t * 8, reduced ? 0 : Math.abs(Math.sin(t * 8)) * 2, t, 0.4);
      place();
      if (!reduced) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    setTimeout(function () { say(lines[0]); }, 2500);
  }

  function ready() {
    var scene = document.querySelector("[data-claude-scene]");
    if (scene) initScene(scene);
    var walker = document.querySelector("[data-clawd-walker]");
    var bubble = document.querySelector("[data-clawd-bubble]");
    if (walker && bubble) initWalker(walker, bubble);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ready); else ready();
})();

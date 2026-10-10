(() => {
  "use strict";
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canvas = document.querySelector("[data-background-canvas]");
  if (!canvas || reduced) { window.OpenBellBackgroundMotion = true; return; }
  const context = canvas.getContext("2d");
  let particles = [], frame = 0, resizeTimer = 0, idleTimer = 0, idle = false;
  const resize = () => {
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = innerWidth * ratio; canvas.height = innerHeight * ratio;
    canvas.style.width = `${innerWidth}px`; canvas.style.height = `${innerHeight}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    const count = innerWidth < 768 ? 25 : 60;
    particles = Array.from({ length: count }, () => ({ x: Math.random() * innerWidth, y: Math.random() * innerHeight, speed: .12 + Math.random() * .2, size: .5 + Math.random() * 1.5 }));
  };
  const wake = () => {
    idle = false; document.body.classList.remove("idle-mode"); clearTimeout(idleTimer);
    idleTimer = setTimeout(() => { idle = true; document.body.classList.add("idle-mode"); }, 5000);
  };
  const render = () => {
    if (document.hidden) return;
    context.clearRect(0, 0, innerWidth, innerHeight); context.fillStyle = "rgba(0,217,255,.6)";
    particles.forEach((particle) => { particle.y -= particle.speed * (idle ? .7 : 1); if (particle.y < -4) particle.y = innerHeight + 4; context.fillRect(particle.x, particle.y, particle.size, particle.size); });
    frame = requestAnimationFrame(render);
  };
  const grid = document.querySelector(".bg-layer-grid"); let pointerFrame = 0;
  addEventListener("pointermove", (event) => {
    if (!grid || innerWidth < 768 || pointerFrame) return;
    pointerFrame = requestAnimationFrame(() => { grid.style.setProperty("--grid-x", `${((event.clientX / innerWidth) - .5) * 16}px`); grid.style.setProperty("--grid-y", `${((event.clientY / innerHeight) - .5) * 10}px`); pointerFrame = 0; });
  }, { passive: true });
  addEventListener("resize", () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(resize, 160); }, { passive: true });
  ["pointermove", "pointerdown", "wheel", "touchstart"].forEach((event) => addEventListener(event, wake, { passive: true }));
  document.addEventListener("visibilitychange", () => { if (document.hidden) cancelAnimationFrame(frame); else { wake(); frame = requestAnimationFrame(render); } });
  resize(); wake(); frame = requestAnimationFrame(render); window.OpenBellBackgroundMotion = true;
})();

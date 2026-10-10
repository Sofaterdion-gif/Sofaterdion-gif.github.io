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
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      speed: .12 + Math.random() * .2,
      size: innerWidth < 768 ? 1.1 + Math.random() * 1.1 : 1.2 + Math.random() * 1.8,
      alpha: .42 + Math.random() * .42,
      hue: Math.random() > .72 ? "violet" : "cyan"
    }));
  };
  const wake = () => {
    idle = false; document.body.classList.remove("idle-mode"); clearTimeout(idleTimer);
    idleTimer = setTimeout(() => { idle = true; document.body.classList.add("idle-mode"); }, 5000);
  };
  const render = () => {
    if (document.hidden) return;
    context.clearRect(0, 0, innerWidth, innerHeight);
    particles.forEach((particle) => {
      particle.y -= particle.speed * (idle ? .7 : 1);
      if (particle.y < -6) particle.y = innerHeight + 6;
      context.globalAlpha = particle.alpha * (idle ? .7 : 1);
      context.fillStyle = particle.hue === "violet" ? "#c4b5fd" : "#8fffe4";
      context.shadowBlur = 9;
      context.shadowColor = particle.hue === "violet" ? "rgba(167,139,250,.85)" : "rgba(0,217,255,.9)";
      context.beginPath();
      context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      context.fill();
    });
    context.globalAlpha = 1;
    context.shadowBlur = 0;
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

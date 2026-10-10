(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  const root = document.documentElement;
  const layers = [...document.querySelectorAll("[data-3d-layer]")];
  const cards = [...document.querySelectorAll(".explore-card, .home-market-card, .app-section-visual, .learning-card")];
  if (reduceMotion || (!finePointer && !layers.length && !cards.length)) return;

  let frame = 0;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  const strength = window.innerWidth < 768 ? .35 : 1;

  function render() {
    frame = 0;
    currentX += (targetX - currentX) * .075;
    currentY += (targetY - currentY) * .075;
    root.style.setProperty("--scene-x", `${currentX}px`);
    root.style.setProperty("--scene-y", `${currentY}px`);
    cards.forEach((card, index) => {
      const depth = index % 3 === 0 ? 1 : index % 3 === 1 ? .65 : .4;
      card.style.setProperty("--tilt-x", `${currentY * depth * -.35}deg`);
      card.style.setProperty("--tilt-y", `${currentX * depth * .35}deg`);
    });
  }

  window.addEventListener("pointermove", (event) => {
    targetX = (event.clientX / window.innerWidth - .5) * 14 * strength;
    targetY = (event.clientY / window.innerHeight - .5) * 10 * strength;
    if (!frame) frame = window.requestAnimationFrame(render);
  }, { passive: true });
  window.addEventListener("pointerleave", () => {
    targetX = 0;
    targetY = 0;
    if (!frame) frame = window.requestAnimationFrame(render);
  }, { passive: true });
  render();
  window.OpenBell3D = true;
})();

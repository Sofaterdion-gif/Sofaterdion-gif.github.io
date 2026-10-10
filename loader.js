(() => {
  const loader = document.querySelector(".site-loader");
  if (!loader || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const status = loader.querySelector("span");
  const states = ["SYSTEM INIT", "LOADING MARKET DATA", "CALIBRATING INTERFACE", "SIGNAL READY"];
  let index = 0;
  const timer = window.setInterval(() => {
    index = Math.min(index + 1, states.length - 1);
    if (status) status.textContent = `${states[index]} · ${Math.min(100, (index + 1) * 25)}%`;
    if (index === states.length - 1) window.clearInterval(timer);
  }, 360);
  window.addEventListener("beforeunload", () => window.clearInterval(timer), { once: true });
})();

(() => {
  const loader = document.querySelector(".site-loader");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!loader) return;
  const status = loader.querySelector("span");
  const states = ["SYSTEM INIT", "LOADING MARKET DATA", "CALIBRATING INTERFACE", "SIGNAL READY"];
  let index = 0;
  const particles = document.createDocumentFragment();
  for (let particleIndex = 0; particleIndex < 14; particleIndex += 1) {
    const particle = document.createElement("i");
    particle.className = "loader-particle";
    particle.style.setProperty("--particle-x", `${Math.random() * 100}%`);
    particle.style.setProperty("--particle-y", `${Math.random() * 100}%`);
    particle.style.setProperty("--particle-delay", `${Math.random() * -2.4}s`);
    particles.appendChild(particle);
  }
  loader.appendChild(particles);
  const burst = document.createElement("div");
  burst.className = "loader-burst";
  for (let lineIndex = 0; lineIndex < 22; lineIndex += 1) {
    const line = document.createElement("i");
    line.className = "loader-burst-line";
    line.style.setProperty("--burst-angle", `${lineIndex * (360 / 22)}deg`);
    line.style.setProperty("--burst-distance", `${120 + Math.random() * 130}px`);
    line.style.setProperty("--burst-delay", `${Math.random() * 120}ms`);
    burst.appendChild(line);
  }
  loader.appendChild(burst);

  let timer = 0;
  const updateStatus = () => {
    index = Math.min(index + 1, states.length - 1);
    loader.style.setProperty("--loader-progress", `${((index + 1) / states.length) * 100}%`);
    if (status) status.textContent = `${states[index]} · ${Math.min(100, (index + 1) * 25)}%`;
    if (index === states.length - 1) window.clearInterval(timer);
  };
  if (!reduced) timer = window.setInterval(updateStatus, 360);

  const typingTargets = [
    ...document.querySelectorAll(".home-hero-copy h1, .home-subtitle, .home-modes-intro h2, .home-modes-intro > p:last-child, .home-mode-card strong, .home-mode-card p")
  ];
  const wrapText = (element) => {
    if (element.dataset.typed) return;
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    let offset = 0;
    nodes.forEach((node) => {
      const fragment = document.createDocumentFragment();
      [...node.nodeValue].forEach((character) => {
        const span = document.createElement("span");
        span.className = "typing-char";
        span.style.setProperty("--char-delay", `${offset * 24}ms`);
        span.textContent = character === " " ? "\u00a0" : character;
        fragment.appendChild(span);
        offset += 1;
      });
      node.parentNode.replaceChild(fragment, node);
    });
    element.dataset.typed = "true";
  };
  typingTargets.forEach(wrapText);
  const markTypingReady = () => document.body.classList.add("typing-ready");
  if (reduced) markTypingReady();
  else {
    const observer = new MutationObserver(() => {
      if (!document.body.classList.contains("is-loading")) {
        markTypingReady();
        observer.disconnect();
      }
    });
    observer.observe(document.body, { attributes: true, attributeFilter: ["class"] });
  }
  window.OpenBellLoader = {
    released: false,
    complete() {
      if (this.released) return;
      loader.classList.add("is-complete");
      const release = () => {
        if (this.released) return;
        this.released = true;
        loader.classList.add("is-exiting");
        document.body.classList.remove("is-loading", "boot-black");
        document.body.classList.add("typing-ready");
      };
      const burstLine = loader.querySelector(".loader-burst-line");
      if (burstLine) {
        burstLine.addEventListener("animationend", release, { once: true });
        window.setTimeout(release, reduced ? 1200 : 1800);
      } else {
        release();
      }
    }
  };
  window.setTimeout(() => window.OpenBellLoader.complete(), reduced ? 1800 : 7200);
  window.addEventListener("beforeunload", () => window.clearInterval(timer), { once: true });
})();

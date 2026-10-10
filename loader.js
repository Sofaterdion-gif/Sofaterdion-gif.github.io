(() => {
  const loader = document.querySelector(".site-loader");
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!loader) return;
  const status = loader.querySelector("span");
  const states = ["SYSTEM INIT", "LOADING MARKET DATA", "CALIBRATING INTERFACE", "SIGNAL READY"];
  let index = 0;
  const particles = document.createDocumentFragment();
  for (let particleIndex = 0; particleIndex < 60; particleIndex += 1) {
    const particle = document.createElement("i");
    particle.className = "loader-particle";
    particle.style.setProperty("--particle-x", `${Math.random() * 100}%`);
    particle.style.setProperty("--particle-y", `${Math.random() * 100}%`);
    particle.style.setProperty("--particle-delay", `${Math.random() * -2.4}s`);
    particles.appendChild(particle);
  }
  loader.appendChild(particles);
  const taiwan = document.createElement("div");
  taiwan.className = "loader-taiwan";
  taiwan.innerHTML = '<svg viewBox="0 0 120 240" aria-hidden="true"><path d="M72 5 85 18 82 35 94 52 88 70 98 88 91 103 97 121 84 137 86 153 73 168 76 185 63 198 61 218 49 235 39 224 42 207 33 193 39 176 30 160 38 143 31 126 41 110 36 94 47 77 43 60 56 45 54 28 65 17Z"/></svg>';
  loader.appendChild(taiwan);
  const burst = document.createElement("div");
  burst.className = "loader-burst";
  for (let lineIndex = 0; lineIndex < 22; lineIndex += 1) {
    const line = document.createElement("i");
    line.className = "loader-burst-line";
    line.style.setProperty("--burst-angle", `${lineIndex * (360 / 22)}deg`);
    line.style.setProperty("--burst-hue", `${(lineIndex * 360) / 22}`);
    line.style.setProperty("--burst-distance", `${120 + Math.random() * 130}px`);
    line.style.setProperty("--burst-delay", `${lineIndex * 12}ms`);
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
      const burstLines = loader.querySelectorAll(".loader-burst-line");
      const finalBurstLine = burstLines[burstLines.length - 1];
      if (finalBurstLine) {
        finalBurstLine.addEventListener("animationend", release, { once: true });
      } else {
        release();
      }
    }
  };
  window.setTimeout(() => window.OpenBellLoader.complete(), 8800);
  window.addEventListener("beforeunload", () => window.clearInterval(timer), { once: true });
})();

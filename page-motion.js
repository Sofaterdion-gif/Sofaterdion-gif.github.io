(() => {
  "use strict";
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const items = [...document.querySelectorAll("[data-reveal]")];
  if (reduced || !("IntersectionObserver" in window)) items.forEach((item) => item.classList.add("is-visible"));
  else {
    const observer = new IntersectionObserver((entries, observerInstance) => entries.forEach((entry) => { if (!entry.isIntersecting) return; entry.target.classList.add("is-visible"); observerInstance.unobserve(entry.target); }), { threshold: .15 });
    items.forEach((item) => observer.observe(item));
  }
  const homeHero = document.querySelector(".home-hero");
  if (homeHero && !reduced) {
    let scrollFrame = 0;
    const updateHomeScroll = () => {
      scrollFrame = 0;
      const progress = Math.min(1, Math.max(0, window.scrollY / Math.max(1, homeHero.offsetHeight * .72)));
      homeHero.style.setProperty("--scroll-y", `${progress * -96}px`);
      homeHero.style.setProperty("--scroll-opacity", String(1 - progress * .72));
    };
    window.addEventListener("scroll", () => {
      if (!scrollFrame) scrollFrame = requestAnimationFrame(updateHomeScroll);
    }, { passive: true });
    updateHomeScroll();
  }
  const syncOverlayDepth = () => document.body.classList.toggle("overlay-depth", Boolean(document.querySelector(".is-open, .open")));
  new MutationObserver(syncOverlayDepth).observe(document.body, { subtree: true, attributes: true, attributeFilter: ["class", "aria-hidden"] });
  window.OpenBellPageMotion = true;
})();

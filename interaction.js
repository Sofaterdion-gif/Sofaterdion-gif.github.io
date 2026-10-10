(() => {
  "use strict";
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cards = [...document.querySelectorAll("[data-mode]")];
  const modal = document.querySelector("[data-mode-modal]");
  if (!cards.length || !modal) return;

  const closeButtons = [...modal.querySelectorAll("[data-mode-close]")];
  const modalTitle = modal.querySelector("[data-modal-title]");
  const modalKicker = modal.querySelector("[data-modal-kicker]");
  const modalDescription = modal.querySelector("[data-modal-description]");
  const modalPoints = modal.querySelector("[data-modal-points]");
  const modalEnter = modal.querySelector("[data-modal-enter]");
  let hoveredCard = null;
  let activeCard = null;
  let pointer = { x: 0, y: 0 };
  let frame = 0;

  cards.forEach((card, index) => {
    card.style.setProperty("--cluster-index", index);
    card.addEventListener("pointerenter", () => { hoveredCard = card; });
    card.addEventListener("pointermove", (event) => {
      pointer = { x: event.clientX, y: event.clientY };
      if (!frame) frame = requestAnimationFrame(updateCluster);
    }, { passive: true });
    card.addEventListener("pointerleave", () => {
      if (hoveredCard === card) hoveredCard = null;
      card.style.setProperty("--look-x", "0deg");
      card.style.setProperty("--look-y", "0deg");
    });
    card.addEventListener("click", (event) => {
      event.preventDefault();
      openMode(card);
    });
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openMode(card);
      }
    });
  });

  function updateCluster() {
    frame = 0;
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = pointer.x - centerX;
      const dy = pointer.y - centerY;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const proximity = Math.max(0, 1 - distance / 330);
      const direction = distance ? 1 / distance : 0;
      const repel = card === hoveredCard ? 0 : proximity * 12;
      const currentX = parseFloat(card.dataset.springX || "0");
      const currentY = parseFloat(card.dataset.springY || "0");
      const targetX = card === hoveredCard ? 0 : -dx * direction * repel;
      const targetY = card === hoveredCard ? 0 : -dy * direction * repel;
      const nextX = currentX + (targetX - currentX) * .18;
      const nextY = currentY + (targetY - currentY) * .18;
      card.dataset.springX = String(nextX);
      card.dataset.springY = String(nextY);
      card.style.setProperty("--collision-x", `${nextX}px`);
      card.style.setProperty("--collision-y", `${nextY}px`);
      if (card === hoveredCard) {
        card.style.setProperty("--look-x", `${Math.max(-7, Math.min(7, dy / 24))}deg`);
        card.style.setProperty("--look-y", `${Math.max(-7, Math.min(7, -dx / 24))}deg`);
      }
    });
    if (hoveredCard || cards.some((card) => Math.abs(Number(card.dataset.springX || 0)) > .3)) frame = requestAnimationFrame(updateCluster);
  }

  function openMode(card) {
    activeCard = card;
    const points = (card.dataset.modePoints || "").split("|").filter(Boolean);
    modalKicker.textContent = `OPEN BELL / ${card.dataset.modeKicker}`;
    modalTitle.textContent = card.dataset.modeTitle;
    modalDescription.textContent = card.dataset.modeDescription;
    modalPoints.innerHTML = points.map((point) => `<li>${point}</li>`).join("");
    modalEnter.href = card.getAttribute("href");
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("mode-modal-open");
    modal.querySelector(".mode-modal-close").focus();
  }

  function closeMode() {
    if (!activeCard) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("mode-modal-open");
    activeCard.focus();
    activeCard = null;
  }
  closeButtons.forEach((button) => button.addEventListener("click", closeMode));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && activeCard) closeMode();
  });
  if (!reduced) window.addEventListener("pointermove", (event) => {
    pointer = { x: event.clientX, y: event.clientY };
    if (!frame) frame = requestAnimationFrame(updateCluster);
  }, { passive: true });
})();

// Open Bell 首頁：開場動畫、星空背景、捲動出現、截圖放大。
(function () {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 開場動畫：同一次瀏覽只播一次；點一下或按任意鍵可略過。
  const intro = document.querySelector("[data-intro]");
  if (intro) {
    let seen = false;
    try { seen = sessionStorage.getItem("ob-intro") === "1"; } catch (e) {}
    if (location.search.indexOf("intro") >= 0) seen = false;   // ?intro 可強制重播
    const finish = () => {
      intro.classList.add("done");
      try { sessionStorage.setItem("ob-intro", "1"); } catch (e) {}
      document.removeEventListener("keydown", finish);
    };
    const at = new URLSearchParams(location.search).get("introAt");   // 檢查用：停在第幾秒
    if (at !== null) {
      requestAnimationFrame(() => document.getAnimations().forEach((a) => { a.pause(); a.currentTime = parseFloat(at) * 1000; }));
    } else if (seen || reduce) {
      intro.classList.add("done");
    } else {
      setTimeout(finish, 2700);
      intro.addEventListener("click", finish);
      intro.querySelector(".skip").addEventListener("click", finish);
      document.addEventListener("keydown", finish);
    }
  }

  // 星空：會閃爍的星星＋偶爾一顆流星。
  const canvas = document.querySelector("[data-sky]");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let stars = [];
    let meteor = null;
    let w = 0, h = 0, dpr = 1;
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round((w * h) / 5200);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h, r: Math.random() * 1.2 + 0.2,
        p: Math.random() * Math.PI * 2, s: 0.6 + Math.random() * 1.6, gold: Math.random() < 0.12
      }));
    };
    resize();
    window.addEventListener("resize", resize);
    const draw = (t) => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        const a = reduce ? 0.7 : 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(t / 1000 * s.s + s.p));
        ctx.fillStyle = s.gold ? `rgba(255, 220, 150, ${a})` : `rgba(220, 210, 255, ${a})`;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
      }
      if (!reduce) {
        if (!meteor && Math.random() < 0.004) {
          meteor = { x: Math.random() * w * 0.8 + w * 0.2, y: Math.random() * h * 0.3, life: 0 };
        }
        if (meteor) {
          meteor.life += 1;
          const len = 120, k = meteor.life * 9;
          const x = meteor.x - k, y = meteor.y + k * 0.45;
          const g = ctx.createLinearGradient(x, y, x + len, y - len * 0.45);
          g.addColorStop(0, "rgba(255, 236, 190, 0.9)"); g.addColorStop(1, "rgba(255, 236, 190, 0)");
          ctx.strokeStyle = g; ctx.lineWidth = 1.4;
          ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + len, y - len * 0.45); ctx.stroke();
          if (meteor.life > 50) meteor = null;
        }
        requestAnimationFrame(draw);
      }
    };
    requestAnimationFrame(draw);
  }

  // 捲動出現。
  const items = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && !reduce) {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      }
    }, { rootMargin: "0px 0px -8% 0px" });
    items.forEach((el) => io.observe(el));
  } else {
    items.forEach((el) => el.classList.add("in"));
  }

  // 截圖放大。
  const box = document.querySelector("[data-lightbox]");
  if (box) {
    const big = box.querySelector("img");
    document.querySelectorAll("[data-zoom]").forEach((img) => {
      img.addEventListener("click", () => { big.src = img.currentSrc || img.src; big.alt = img.alt; box.classList.add("open"); });
    });
    box.addEventListener("click", () => box.classList.remove("open"));
  }
})();

// 偏好減少動態的人：小克影片停在海報畫面。
(function () {
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      document.querySelectorAll(".hero-live").forEach(function (v) { v.removeAttribute("autoplay"); v.pause(); });
    }
  } catch (e) {}
})();

// 角色卡：點開看這位角色的檔案與故事章節（資料來自 stories.json，由遊戲的 tools/export_site_stories.gd 匯出；只放第一章開場，不劇透後面）。
(function () {
  var cards = document.querySelectorAll(".person");
  if (!cards.length) return;
  var data = null;
  var dialog = document.createElement("dialog");
  dialog.className = "story-dialog";
  dialog.setAttribute("aria-label", "角色故事");
  document.body.appendChild(dialog);
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function render(id, img) {
    var c = data[id];
    var name = c.name.zh.replace(/\s*[A-Za-z].*$/, "") || c.name.zh;
    var chapters = c.chapters.map(function (ch, i) {
      return "<li><span>" + String(i + 1).padStart(2, "0") + "</span>" + esc(ch.zh) + "</li>";
    }).join("");
    var teaser = c.teaser.map(function (l) { return "<p>" + esc(l.zh.replace(/\{n\}/g, name)) + "</p>"; }).join("");
    dialog.innerHTML =
      '<button class="story-close" aria-label="關閉">×</button>' +
      '<div class="story-grid"><figure><img src="' + esc(img) + '" alt="' + esc(name) + '"></figure><div class="story-body">' +
      '<h3>' + esc(name) + '</h3><div class="story-role">' + esc(c.role.zh) + " · " + c.age + " 歲</div>" +
      '<dl><dt>出身</dt><dd>' + esc(c.home.zh) + '</dd><dt>喜歡</dt><dd>' + esc(c.likes.zh) + "</dd></dl>" +
      "<p class=\"story-bio\">" + esc(c.bio.zh) + "</p>" +
      (teaser ? '<div class="story-teaser"><b>第一章 · ' + esc(c.chapters[0].zh) + "</b>" + teaser + "</div>" : "") +
      '<div class="story-chapters"><b>' + c.chapters.length + " 章故事</b><ol>" + chapters + "</ol></div>" +
      '<div class="story-note">完整劇情與多重結局請在遊戲裡體驗。</div></div></div>';
    dialog.querySelector(".story-close").addEventListener("click", function () { dialog.close(); });
    if (!dialog.open) dialog.showModal();
  }
  function open(card) {
    var img = card.querySelector("img");
    var match = img && img.getAttribute("src").match(/cast_(\w+)\.webp/);
    if (!match) return;
    var show = function () { if (data[match[1]]) render(match[1], img.getAttribute("src")); };
    if (data) return show();
    fetch("stories.json").then(function (r) { return r.json(); }).then(function (json) { data = json; show(); }).catch(function () {});
  }
  dialog.addEventListener("click", function (e) { if (e.target === dialog) dialog.close(); });
  cards.forEach(function (card) {
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.style.cursor = "pointer";
    card.addEventListener("click", function () { open(card); });
    card.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(card); } });
  });
})();

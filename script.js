document.body.classList.add("is-loading");
window.addEventListener("load", () => {
  window.setTimeout(() => document.body.classList.remove("is-loading"), 1300);
});

const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });
  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }));
}

const dropdown = document.querySelector(".nav-dropdown");
const dropdownToggle = document.querySelector(".nav-dropdown-toggle");
if (dropdown && dropdownToggle) {
  dropdownToggle.addEventListener("click", () => {
    const open = dropdown.classList.toggle("open");
    dropdownToggle.setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("click", (event) => {
    if (!dropdown.contains(event.target)) {
      dropdown.classList.remove("open");
      dropdownToggle.setAttribute("aria-expanded", "false");
    }
  });
  dropdown.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    dropdown.classList.remove("open");
    dropdownToggle.setAttribute("aria-expanded", "false");
  }));
}

const transition = document.querySelector(".page-transition");
const pageLinks = document.querySelectorAll(".page-link");
pageLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = link.getAttribute("href");
    if (!target || !target.startsWith("#") || !transition) return;
    const section = document.querySelector(target);
    if (!section) return;
    event.preventDefault();
    transition.classList.add("active");
    window.setTimeout(() => {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => transition.classList.remove("active"), 360);
    }, 230);
    history.replaceState(null, "", target);
  });
});

const revealItems = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-visible");
    observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });
revealItems.forEach((item) => revealObserver.observe(item));

document.querySelectorAll(".market-list button").forEach((market) => {
  market.addEventListener("click", () => {
    document.querySelectorAll(".market-list button").forEach((item) => item.classList.remove("selected"));
    market.classList.add("selected");
  });

  const languageSelect = document.querySelector("#language-select");
  const translations = {
    zh: {
      aboutEyebrow: "ABOUT OPEN BELL",
      aboutTitle: "把市場變成<br><em>可以反覆閱讀的日子。</em>",
      aboutText: "Open Bell 不是即時投資工具，而是一款以決策、節奏與回放為核心的交易模擬遊戲。你可以在安全的遊戲世界裡試錯、觀察，再重新走一次。"
    },
    en: {
      aboutEyebrow: "ABOUT OPEN BELL",
      aboutTitle: "Turn the market into<br><em>a day you can replay.</em>",
      aboutText: "Open Bell is not a live investment tool. It is a simulation built around decisions, rhythm, and replay, where you can experiment, observe, and try again in a safe game world."
    }
  };
  function setLanguage(language) {
    const copy = translations[language] || translations.zh;
    document.documentElement.lang = language === "en" ? "en" : "zh-Hant";
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      element.innerHTML = copy[element.dataset.i18n];
    });
    localStorage.setItem("open-bell-language", language);
  }
  if (languageSelect) {
    const savedLanguage = localStorage.getItem("open-bell-language") || "zh";
    languageSelect.value = savedLanguage;
    setLanguage(savedLanguage);
    languageSelect.addEventListener("change", (event) => {
      const nextLanguage = event.target.value;
      document.body.classList.add("language-changing");
      window.setTimeout(() => {
        setLanguage(nextLanguage);
        document.body.classList.remove("language-changing");
      }, 220);
    });
  }
});

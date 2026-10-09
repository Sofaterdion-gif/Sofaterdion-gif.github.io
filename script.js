document.documentElement.classList.add("js");
document.body.classList.add("is-loading");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const transition = document.querySelector(".page-transition");
const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
const dropdown = document.querySelector(".nav-dropdown");
const dropdownToggle = document.querySelector(".nav-dropdown-toggle");

const closeNav = () => {
  if (!toggle || !nav) return;
  nav.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
};

const closeDropdown = () => {
  if (!dropdown || !dropdownToggle) return;
  dropdown.classList.remove("open");
  dropdownToggle.setAttribute("aria-expanded", "false");
};

window.addEventListener("load", () => {
  window.setTimeout(() => document.body.classList.remove("is-loading"), prefersReducedMotion ? 0 : 900);
}, { once: true });

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.classList.toggle("is-pressed", open);
  });
  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeNav));
}

if (dropdown && dropdownToggle) {
  dropdownToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const open = dropdown.classList.toggle("open");
    dropdownToggle.setAttribute("aria-expanded", String(open));
  });
  dropdown.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeDropdown));
  document.addEventListener("click", (event) => {
    if (!dropdown.contains(event.target)) closeDropdown();
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  closeDropdown();
  closeNav();
});

const showTransition = (callback) => {
  if (!transition || prefersReducedMotion) {
    callback();
    return;
  }
  transition.classList.add("active");
  window.setTimeout(callback, 180);
  window.setTimeout(() => transition.classList.remove("active"), 620);
};

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = link.getAttribute("href");
    const section = target && document.querySelector(target);
    if (!section) return;
    event.preventDefault();
    closeDropdown();
    closeNav();
    history.pushState(null, "", target);
    showTransition(() => section.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" }));
  });
});

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window && !prefersReducedMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

document.querySelectorAll(".market-list button").forEach((market) => {
  market.addEventListener("click", () => {
    document.querySelectorAll(".market-list button").forEach((item) => item.classList.remove("selected"));
    market.classList.add("selected");
  });
});

document.querySelectorAll("button, .button, .text-link, .nav-link").forEach((element) => {
  element.addEventListener("pointerdown", () => element.classList.add("is-pressed"));
  ["pointerup", "pointercancel", "blur"].forEach((eventName) => {
    element.addEventListener(eventName, () => element.classList.remove("is-pressed"));
  });
});

document.querySelectorAll(".button-primary[href*='.exe'], a[href*='OpenBell-Playtest.exe']").forEach((link) => {
  link.classList.add("download-link");
  link.addEventListener("click", () => {
    document.body.classList.add("download-started");
    window.setTimeout(() => document.body.classList.remove("download-started"), 900);
  });
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

const setLanguage = (language) => {
  const selectedLanguage = translations[language] ? language : "zh";
  const copy = translations[selectedLanguage];
  document.documentElement.lang = selectedLanguage === "en" ? "en" : "zh-Hant";
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    element.innerHTML = copy[element.dataset.i18n] || element.innerHTML;
  });
  try {
    localStorage.setItem("open-bell-language", selectedLanguage);
  } catch (_) {
    // Private browsing may block storage; the current selection still applies.
  }
};

if (languageSelect) {
  let savedLanguage = "zh";
  try {
    savedLanguage = localStorage.getItem("open-bell-language") || "zh";
  } catch (_) {
    // Keep the default language when storage is unavailable.
  }
  languageSelect.value = savedLanguage;
  setLanguage(savedLanguage);
  languageSelect.addEventListener("change", (event) => {
    const nextLanguage = event.target.value;
    document.body.classList.add("language-changing");
    window.setTimeout(() => {
      setLanguage(nextLanguage);
      document.body.classList.remove("language-changing");
    }, prefersReducedMotion ? 0 : 220);
  });
}

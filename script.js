document.body.classList.add("is-loading");
window.addEventListener("load", () => {
  window.setTimeout(() => document.body.classList.remove("is-loading"), 900);
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
  dropdownToggle.addEventListener("click", (event) => {
    event.stopPropagation();
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
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
document.querySelectorAll(".page-link").forEach((link) => {
  link.addEventListener("click", (event) => {
    const target = link.getAttribute("href");
    if (!target || !target.startsWith("#") || !transition || reduceMotion) return;
    const section = document.querySelector(target);
    if (!section) return;
    event.preventDefault();
    transition.classList.add("active");
    window.setTimeout(() => {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => transition.classList.remove("active"), 180);
    }, 140);
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

const translations = {
  zh: {
    explore: "探索",
    navAbout: "理念",
    navGame: "玩法",
    navScreens: "實機畫面",
    navMarkets: "市場",
    navUpdates: "開發日誌",
    navDownload: "下載",
    getOpenBell: "取得 Open Bell",
    heroText: "一款把交易、回放與生涯選擇放在同一張桌上的模擬遊戲。選擇市場，推進每一根 K 線，留下自己的決策紀錄。",
    aboutEyebrow: "ABOUT OPEN BELL",
    aboutTitle: "把市場變成<br><em>可以反覆閱讀的日子。</em>",
    aboutText: "Open Bell 不是即時投資工具，而是一款以決策、節奏與回放為核心的交易模擬遊戲。你可以在安全的遊戲世界裡試錯、觀察，再重新走一次。",
    mktUs: "美股",
    mktTw: "台股",
    mktHk: "港股",
    mktCrypto: "加密",
    mktFunds: "基金",
    mktFutures: "期貨",
    downloadBtn: "取得目前版本",
    madeIn: "台灣製造（中華民國） · 為了把市場再讀一次。",
    backTop: "回到頂部 ↑"
  },
  en: {
    explore: "Explore",
    navAbout: "Philosophy",
    navGame: "Game",
    navScreens: "Screens",
    navMarkets: "Markets",
    navUpdates: "Dev log",
    navDownload: "Download",
    getOpenBell: "Get Open Bell",
    heroText: "A simulation that puts trading, replay, and a career on the same desk. Pick a market, step through each candle, and keep your own decision log.",
    aboutEyebrow: "ABOUT OPEN BELL",
    aboutTitle: "Turn the market into<br><em>a day you can replay.</em>",
    aboutText: "Open Bell is not a live investment tool. It is a simulation built around decisions, rhythm, and replay, where you can experiment, observe, and try again in a safe game world.",
    mktUs: "US equities",
    mktTw: "Taiwan",
    mktHk: "Hong Kong",
    mktCrypto: "Crypto",
    mktFunds: "Funds",
    mktFutures: "Futures",
    downloadBtn: "Get current build",
    madeIn: "Made in Taiwan (Republic of China) · Made for replaying the market.",
    backTop: "Back to top ↑"
  }
};

const markets = {
  zh: {
    us: ["US", "美股", "常規時段、財報與隔夜跳空。用回放看開盤那一段怎麼走完。"],
    tw: ["TW", "台股", "13:30 開盤、漲跌幅限制、權值股帶動。適合練等待，而不是追第一根。"],
    hk: ["HK", "港股", "上午盤與午後盤切開。波動比台股大，假突破比較多。"],
    crypto: ["CRYPTO", "加密", "沒有收盤。24 小時都在走，回放時用倍速看一整段節奏。"],
    funds: ["FUNDS", "基金", "慢、配置、再平衡。這裡不是猜明天，是看你能不能拿住。"],
    futures: ["FUTURES", "期貨", "槓桿與保證金。同樣一根 K 線，部位錯了就先出局。"]
  },
  en: {
    us: ["US", "US equities", "Regular hours, earnings, and overnight gaps. Replay the open and see how the first stretch finishes."],
    tw: ["TW", "Taiwan", "Opens 13:30, with a daily limit and heavyweight names. Practice waiting, not chasing the first candle."],
    hk: ["HK", "Hong Kong", "Morning and afternoon sessions are split. Wider than Taiwan, with more fake breaks."],
    crypto: ["CRYPTO", "Crypto", "No close. It runs all day, so use speed to read a whole stretch."],
    funds: ["FUNDS", "Funds", "Slow, allocation, rebalance. This is not guessing tomorrow. It is whether you can hold."],
    futures: ["FUTURES", "Futures", "Leverage and margin. The same candle knocks you out if the size is wrong."]
  }
};

let currentLanguage = "zh";
let currentMarket = "us";

function renderMarket() {
  const copy = (markets[currentLanguage] || markets.zh)[currentMarket] || markets.zh.us;
  const kicker = document.getElementById("market-detail-kicker");
  const title = document.getElementById("market-detail-title");
  const text = document.getElementById("market-detail-text");
  if (kicker) kicker.textContent = copy[0];
  if (title) title.textContent = copy[1];
  if (text) text.textContent = copy[2];
}

function setLanguage(language) {
  currentLanguage = translations[language] ? language : "zh";
  const copy = translations[currentLanguage];
  document.documentElement.lang = currentLanguage === "en" ? "en" : "zh-Hant";
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (copy[key] != null) element.innerHTML = copy[key];
  });
  localStorage.setItem("open-bell-language", currentLanguage);
  renderMarket();
}

const languageSelect = document.querySelector("#language-select");
if (languageSelect) {
  const savedLanguage = localStorage.getItem("open-bell-language") || "zh";
  languageSelect.value = savedLanguage;
  setLanguage(savedLanguage);
  languageSelect.addEventListener("change", (event) => {
    document.body.classList.add("language-changing");
    window.setTimeout(() => {
      setLanguage(event.target.value);
      document.body.classList.remove("language-changing");
    }, 160);
  });
}

document.querySelectorAll(".market-list button").forEach((market) => {
  market.addEventListener("click", () => {
    document.querySelectorAll(".market-list button").forEach((item) => item.classList.remove("selected"));
    market.classList.add("selected");
    currentMarket = market.dataset.market || "us";
    renderMarket();
  });
});

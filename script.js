document.documentElement.classList.add("js");
document.body.classList.add("is-loading");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const loaderCode = document.querySelector("#loader-code-text");
const loaderCodeText = [
  "boot.openbell({ mode: 'replay' });",
  "market.connect('BTC/USDT');",
  "engine.ready();"
].join("\n");
let pageLoaded = document.readyState === "complete";
let codeComplete = !loaderCode;
let loadingFinished = false;
const maybeFinishLoading = () => {
  if (!pageLoaded || !codeComplete || loadingFinished) return;
  loadingFinished = true;
  window.setTimeout(() => {
    document.body.classList.add("boot-black");
    document.querySelector(".site-loader")?.classList.add("is-exiting");
  }, reduceMotion ? 900 : 500);
  window.setTimeout(() => {
    document.body.classList.remove("is-loading");
    window.setTimeout(() => document.body.classList.remove("boot-black"), 180);
  }, reduceMotion ? 1400 : 850);
};
if (loaderCode) {
  let codeIndex = 0;
  const typeCode = () => {
    loaderCode.textContent = loaderCodeText.slice(0, codeIndex);
    if (codeIndex < loaderCodeText.length) {
      codeIndex += 1;
      window.setTimeout(typeCode, codeIndex % 6 === 0 ? 42 : 20);
    } else {
      codeComplete = true;
      maybeFinishLoading();
    }
  };
  typeCode();
  window.setTimeout(() => {
    if (codeComplete) return;
    loaderCode.textContent = loaderCodeText;
    codeComplete = true;
    maybeFinishLoading();
  }, 4500);
}
const finishLoading = () => {
  pageLoaded = true;
  maybeFinishLoading();
};
if (document.readyState === "complete") finishLoading();
else window.addEventListener("load", finishLoading, { once: true });

const nav = document.querySelector(".site-nav");
const dropdown = document.querySelector(".nav-dropdown");
const dropdownToggle = document.querySelector(".nav-dropdown-toggle");
const closeNav = () => {
  nav?.classList.remove("open");
};
const closeDropdown = ({ returnFocus = false } = {}) => {
  if (!dropdown || !dropdownToggle) return;
  dropdown.classList.remove("open");
  dropdownToggle.setAttribute("aria-expanded", "false");
  if (returnFocus) dropdownToggle.focus();
};

if (dropdown && dropdownToggle) {
  dropdownToggle.addEventListener("click", (event) => {
    event.stopPropagation();
    const open = dropdown.classList.toggle("open");
    dropdownToggle.setAttribute("aria-expanded", String(open));
  });
  dropdown.addEventListener("focusin", (event) => {
    if (event.target === dropdownToggle) return;
    dropdown.classList.add("open");
    dropdownToggle.setAttribute("aria-expanded", "true");
  });
  dropdown.addEventListener("focusout", () => {
    window.setTimeout(() => {
      if (!dropdown.contains(document.activeElement)) closeDropdown();
    }, 0);
  });
  document.addEventListener("click", (event) => {
    if (!dropdown.contains(event.target)) closeDropdown();
  });
  dropdown.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => closeDropdown()));
  dropdownToggle.addEventListener("wheel", (event) => {
    event.preventDefault();
    const open = event.deltaY < 0;
    dropdown.classList.toggle("open", open);
    dropdownToggle.setAttribute("aria-expanded", String(open));
  }, { passive: false });
}

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  const dropdownWasOpen = dropdown?.classList.contains("open");
  closeDropdown({ returnFocus: dropdownWasOpen });
  closeNav();
});

document.querySelectorAll('a[href$=".html"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (link.origin !== location.origin || link.pathname === location.pathname) return;
    const pageTransition = document.querySelector(".page-transition");
    if (!pageTransition) return;
    event.preventDefault();
    pageTransition.classList.add("active");
    window.setTimeout(() => { location.href = link.href; }, 260);
  });
});

const transition = document.querySelector(".page-transition");
const heroPriceElement = document.querySelector("#hero-price");
const heroChangeElement = document.querySelector("#hero-change");
const heroLine = document.querySelector("#hero-chart-line");
const heroArea = document.querySelector("#hero-chart-area");
let heroPrice = 42680.4;
let heroStartPrice = heroPrice;
let heroPoints = [190, 177, 184, 140, 153, 111, 128, 89, 103, 67, 88, 50, 66, 26, 39];
const updateHeroChart = () => {
  if (!heroLine || !heroArea) return;
  const direction = Math.random() < 0.5 ? -1 : 1;
  heroPrice = Math.max(100, heroPrice + direction * (60 + Math.random() * 220));
  heroPoints = heroPoints.slice(1);
  const next = Math.max(24, Math.min(196, heroPoints.at(-1) - direction * (8 + Math.random() * 28)));
  heroPoints.push(next);
  const points = heroPoints.map((y, index) => `${Math.round(index * (520 / (heroPoints.length - 1)))} ${Math.round(y)}`).join(" L");
  heroLine.setAttribute("d", `M${points}`);
  heroArea.setAttribute("d", `M${points} L520 230 L0 230Z`);
  if (heroPriceElement) heroPriceElement.textContent = heroPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (heroChangeElement) {
    const change = ((heroPrice - heroStartPrice) / heroStartPrice) * 100;
    heroChangeElement.textContent = `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;
    heroChangeElement.classList.toggle("negative", change < 0);
  }
};
window.setInterval(updateHeroChart, 1100);
const screenPrice = document.querySelector("#screen-price");
const screenChange = document.querySelector("#screen-change");
const screenDay = document.querySelector("#screen-day");
const screenChart = document.querySelector("#screen-chart");
let screenValue = 42680.4;
let screenStart = screenValue;
let screenDayValue = 42;
let screenCandle = 0;
const updateScreen = () => {
  const direction = screenCandle++ % 2 === 0 ? 1 : -1;
  screenValue = Math.max(100, screenValue + direction * (55 + Math.random() * 230));
  const change = ((screenValue - screenStart) / screenStart) * 100;
  if (screenPrice) screenPrice.textContent = screenValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (screenChange) {
    screenChange.textContent = `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;
    screenChange.classList.toggle("negative", change < 0);
  }
  if (screenDay) screenDay.textContent = `DAY ${String(Math.min(180, ++screenDayValue)).padStart(3, "0")} / 180`;
  if (screenChart) {
    const candle = document.createElement("i");
    candle.className = direction > 0 ? "up" : "down";
    candle.style.setProperty("--candle-height", `${24 + Math.random() * 42}%`);
    candle.style.setProperty("--candle-offset", `${10 + Math.random() * 46}%`);
    screenChart.appendChild(candle);
    while (screenChart.children.length > 18) screenChart.firstElementChild.remove();
  }
};
window.setInterval(updateScreen, 1050);
document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const target = link.getAttribute("href");
    if (!target || target.length < 2) return;
    const section = document.querySelector(target);
    if (!section) return;
    event.preventDefault();
    if (location.hash !== target) history.pushState(null, "", target);
    if (!transition || reduceMotion) {
      section.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      return;
    }
    transition.classList.add("active");
    window.setTimeout(() => {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => transition.classList.remove("active"), 360);
    }, 140);
  });
});

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
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

document.querySelectorAll("button, .button, .text-link, .nav-link").forEach((element) => {
  element.addEventListener("pointerdown", () => element.classList.add("is-pressed"));
  ["pointerup", "pointercancel", "blur"].forEach((eventName) => {
    element.addEventListener(eventName, () => element.classList.remove("is-pressed"));
  });
});

document.querySelectorAll("a[href*='OpenBell-Playtest.exe']").forEach((link) => {
  link.classList.add("download-link");
  link.addEventListener("click", () => {
    document.body.classList.add("download-started");
    window.setTimeout(() => document.body.classList.remove("download-started"), 900);
  });
});

{
  const playtest = document.querySelector("#web-playtest");
  const playtestOpeners = document.querySelectorAll("[data-web-playtest], .phone-screen button");
  const playtestClose = document.querySelector(".web-playtest-close");
  const priceElement = document.querySelector("#web-price");
  const changeElement = document.querySelector("#web-change");
  const dayElement = document.querySelector("#web-day");
  const chartElement = document.querySelector("#web-chart");
  const playToggle = document.querySelector("#web-play-toggle");
  const stepButton = document.querySelector("#web-step");
  const quantityInput = document.querySelector("#web-quantity");
  const positionElement = document.querySelector("#web-position");
  const statusElement = document.querySelector("#web-trade-status");
  let playtestTimer = null;
  let playtestPrice = 42680.4;
  let playtestStartPrice = playtestPrice;
  let playtestDay = 42;
  let playtestCash = 100000;
  let playtestUnits = 0;
  let playtestRunning = true;
  let candleCount = 0;
  let playtestLeverage = 1;
  let averageEntry = 0;
  let realizedPnl = 0;
  const leverageInput = document.querySelector("#web-leverage");
  const leverageValue = document.querySelector("#web-leverage-value");
  const unrealizedElement = document.querySelector("#web-unrealized");
  const realizedElement = document.querySelector("#web-realized");

  const renderPlaytest = () => {
    const change = ((playtestPrice - playtestStartPrice) / playtestStartPrice) * 100;
    if (priceElement) priceElement.textContent = playtestPrice.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (changeElement) {
      changeElement.textContent = `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;
      changeElement.classList.toggle("negative", change < 0);
    }
    if (dayElement) dayElement.textContent = `DAY ${String(playtestDay).padStart(3, "0")} / 180`;
    if (positionElement) positionElement.textContent = `POSITION: ${playtestUnits ? `${playtestUnits} BTC` : "FLAT"} · CASH: $${playtestCash.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
    const unrealized = playtestUnits * (playtestPrice - averageEntry) * playtestLeverage;
    if (leverageValue) leverageValue.textContent = `${playtestLeverage}x`;
    if (unrealizedElement) {
      unrealizedElement.textContent = `${unrealized >= 0 ? "+" : ""}$${unrealized.toFixed(2)}`;
      unrealizedElement.classList.toggle("negative", unrealized < 0);
    }
    if (realizedElement) {
      realizedElement.textContent = `${realizedPnl >= 0 ? "+" : ""}$${realizedPnl.toFixed(2)}`;
      realizedElement.classList.toggle("negative", realizedPnl < 0);
    }
    if (chartElement) {
      const candle = document.createElement("i");
      const direction = candleCount++ % 2 === 0 ? 1 : -1;
      const bodyHeight = 18 + Math.random() * 30;
      const wickHeight = bodyHeight + 18 + Math.random() * 24;
      const bodyOffset = 10 + Math.random() * Math.max(8, 78 - bodyHeight);
      candle.style.setProperty("--body-height", `${bodyHeight}%`);
      candle.style.setProperty("--wick-height", `${wickHeight}%`);
      candle.style.setProperty("--body-offset", `${bodyOffset}%`);
      candle.className = direction > 0 ? "up" : "down";
      chartElement.appendChild(candle);
      while (chartElement.children.length > 28) chartElement.firstElementChild.remove();
    }
  };

  const stepPlaytest = () => {
    const direction = candleCount % 2 === 0 ? 1 : -1;
    const move = 80 + Math.random() * 260;
    playtestPrice = Math.max(100, playtestPrice + direction * move);
    playtestDay = Math.min(180, playtestDay + 1);
    renderPlaytest();
  };
  const startPlaytest = () => {
    if (playtestTimer || !playtestRunning) return;
    playtestTimer = window.setInterval(stepPlaytest, 850);
  };
  const stopPlaytest = () => {
    window.clearInterval(playtestTimer);
    playtestTimer = null;
  };
  const closePlaytest = () => {
    stopPlaytest();
    if (!playtest) return;
    playtest.hidden = true;
    playtest.setAttribute("aria-hidden", "true");
    document.body.classList.remove("playtest-open");
  };
  const openPlaytest = () => {
    if (!playtest) return;
    playtest.hidden = false;
    playtest.setAttribute("aria-hidden", "false");
    document.body.classList.add("playtest-open");
    playtestRunning = true;
    startPlaytest();
    window.setTimeout(() => playtestClose?.focus(), 0);
  };
  playtestOpeners.forEach((opener) => opener.addEventListener("click", openPlaytest));
  playtestClose?.addEventListener("click", closePlaytest);
  playtest?.addEventListener("click", (event) => { if (event.target === playtest) closePlaytest(); });
  playToggle?.addEventListener("click", () => {
    playtestRunning = !playtestRunning;
    playToggle.textContent = playtestRunning ? "Ⅱ PAUSE" : "▶ PLAY";
    statusElement.textContent = playtestRunning ? "MARKET OPEN · AUTO PLAY" : "MARKET PAUSED · STEP READY";
    playtestRunning ? startPlaytest() : stopPlaytest();
  });
  stepButton?.addEventListener("click", stepPlaytest);
  leverageInput?.addEventListener("change", () => {
    playtestLeverage = Number(leverageInput.value) || 1;
    renderPlaytest();
  });
  document.querySelector("#web-buy")?.addEventListener("click", () => {
    const quantity = Math.max(1, Number(quantityInput?.value) || 1);
    const cost = quantity * playtestPrice / playtestLeverage;
    if (cost > playtestCash) {
      statusElement.textContent = "ORDER REJECTED · NOT ENOUGH CASH";
      return;
    }
    playtestCash -= cost;
    averageEntry = playtestUnits ? ((averageEntry * playtestUnits) + (playtestPrice * quantity)) / (playtestUnits + quantity) : playtestPrice;
    playtestUnits += quantity;
    statusElement.textContent = `BUY FILLED · ${quantity} BTC @ $${playtestPrice.toFixed(2)}`;
    renderPlaytest();
  });
  document.querySelector("#web-sell")?.addEventListener("click", () => {
    const quantity = Math.max(1, Number(quantityInput?.value) || 1);
    if (quantity > playtestUnits) {
      statusElement.textContent = "ORDER REJECTED · POSITION TOO SMALL";
      return;
    }
    playtestCash += quantity * playtestPrice / playtestLeverage;
    realizedPnl += quantity * (playtestPrice - averageEntry) * playtestLeverage;
    playtestUnits -= quantity;
    if (!playtestUnits) averageEntry = 0;
    statusElement.textContent = `SELL FILLED · ${quantity} BTC @ $${playtestPrice.toFixed(2)}`;
    renderPlaytest();
  });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && playtest && !playtest.hidden) closePlaytest(); });
  renderPlaytest();
}

const translations = {
  zh: {
    explore: "探索",
    menu: "選單",
    mainNav: "主要導覽",
    languageLabel: "語言",
    navAbout: "理念",
    navGame: "玩法",
    navScreens: "介面示意",
    navMarkets: "市場",
    navUpdates: "開發日誌",
    navDownload: "下載",
    navLearning: "學習",
    mktUs: "美股",
    mktTw: "台股",
    mktHk: "港股",
    mktCrypto: "加密",
    mktFunds: "基金",
    mktFutures: "期貨",
    getOpenBell: "取得 Open Bell",
    exploreGame: "探索玩法",
    heroText: "一款把交易、回放與生涯選擇放在同一張桌上的模擬遊戲。選擇市場，推進每一根 K 線，留下自己的決策紀錄。",
    aboutEyebrow: "ABOUT OPEN BELL",
    aboutTitle: "把市場變成<br><em>可以反覆閱讀的日子。</em>",
    aboutText: "Open Bell 不是即時投資工具，而是一款以決策、節奏與回放為核心的交易模擬遊戲。你可以在安全的遊戲世界裡試錯、觀察，再重新走一次。",
    point1Title: "看懂每一根 K 線",
    point1Text: "用回放重新理解市場節奏。",
    point2Title: "建立自己的交易習慣",
    point2Text: "數量、百分比與不同市場規則。",
    point3Title: "走自己的散戶人生",
    point3Text: "工作、研究、移動與管理生活。",
    gameTitle: "每一天，都有一個選擇。",
    gameText: "從第一筆下單到最後一次復盤，Open Bell 把市場變成一段可以反覆閱讀的旅程。",
    tradeTitle: "讓每一次決策，都有價值。",
    tradeText: "以部位、槓桿與風險邊界建立可重複的交易流程。你不是在追逐價格，而是在訓練判斷、執行與承擔結果的能力。<br><em>「紀律，是自由最可靠的起點。」</em>",
    replayTitle: "把時間，變成你的優勢。",
    replayText: "用播放、暫停、單步與 0.5x 到 4x 倍速拆解市場節奏。每一次回放都讓模糊的直覺變成可驗證、可修正的策略。<br><em>「經驗不是記得發生過什麼，而是看懂為什麼。」</em>",
    careerTitle: "你管理的，不只是資金。",
    careerText: "在研究、工作、移動與生活之間配置注意力，建立屬於自己的長期路線。真正的成長，是讓每個選擇都更接近你想成為的人。<br><em>「先選擇方向，再讓時間證明你。」</em>",
    screensTitle: "市場正在呼吸。",
    screensText: "把市場帶回你的桌面：即時行情、清晰決策與可重播的交易節奏，讓每一次觀察都成為下一次進步的起點。",
    pcStatus: "LIVE REPLAY",
    mobilePlatform: "行動版概念",
    mobileStatus: "LIVE MARKET",
    mobileCareer: "散戶人生",
    mobileCareerText: "移動 · 研究 · 交易",
    mobileStart: "開始測試",
    coverAlt: "Open Bell 開發中試玩版封面",
    marketTitle: "一張桌，六個市場。",
    marketText: "從熟悉的股票到高波動的加密市場，每個市場都有不同的節奏與風險。",
    playtestBadge: "目前可玩試玩版 · 開發中",
    downloadTitle: "把市場帶回桌面。",
    downloadText: "目前版本仍在開發中，內容、平衡與介面都可能變動；這不是最終版本。",
    downloadBtn: "取得目前版本",
    playtestNote: "試玩版狀態：Windows / PC 優先 · 行動版仍為測試階段 · 請以開發日誌為準",
    updatesTitle: "正在建造。",
    updateWebTitle: "Open Bell 網頁基礎頁",
    updateWebText: "官網首頁、遊戲特色、下載入口",
    updateReplayText: "播放、單步與 0.5x — 4x 倍速",
    updateDlcTitle: "DLC 資料夾",
    updateDlcText: "官方 DLC 目錄自動辨識與安裝",
    madeIn: "台灣製造（中華民國） · 為了把市場再讀一次。",
    creatorNotice: "Tirde Studio · Copyright © 2026 Tirde Studio · Open Bell™",
    backTop: "回到頂部 ↑"
  },
  en: {
    explore: "Explore",
    menu: "Menu",
    mainNav: "Main navigation",
    languageLabel: "Language",
    navAbout: "Philosophy",
    navGame: "Game",
    navScreens: "UI mockups",
    navMarkets: "Markets",
    navUpdates: "Dev log",
    navDownload: "Download",
    navLearning: "Learn",
    mktUs: "US equities",
    mktTw: "Taiwan",
    mktHk: "Hong Kong",
    mktCrypto: "Crypto",
    mktFunds: "Funds",
    mktFutures: "Futures",
    getOpenBell: "Get Open Bell",
    exploreGame: "Explore the game",
    heroText: "A simulation that puts trading, replay, and a career on the same desk. Pick a market, step through each candle, and keep your own decision log.",
    aboutEyebrow: "ABOUT OPEN BELL",
    aboutTitle: "Turn the market into<br><em>a day you can replay.</em>",
    aboutText: "Open Bell is not a live investment tool. It is a simulation built around decisions, rhythm, and replay, where you can experiment, observe, and try again in a safe game world.",
    point1Title: "Read every candle",
    point1Text: "Use replay to understand the rhythm of a market.",
    point2Title: "Build your trading habits",
    point2Text: "Practice sizing, percentages, and different market rules.",
    point3Title: "Shape your own career",
    point3Text: "Work, research, travel, and manage everyday life.",
    gameTitle: "Every day brings a choice.",
    gameText: "From the first order to the final review, Open Bell turns the market into a journey you can revisit.",
    tradeTitle: "Make every decision count.",
    tradeText: "Build a repeatable process around position size, leverage, and risk limits. You are not chasing price; you are training judgment, execution, and ownership of the result.<br><em>“Discipline is the most reliable beginning of freedom.”</em>",
    replayTitle: "Turn time into your edge.",
    replayText: "Use play, pause, step, and 0.5x to 4x speed to unpack market rhythm. Every replay turns a vague instinct into a strategy you can test and refine.<br><em>“Experience is not remembering what happened; it is understanding why.”</em>",
    careerTitle: "You manage more than money.",
    careerText: "Allocate attention across research, work, movement, and life to build a long-term path of your own. Growth is bringing every choice closer to who you want to become.<br><em>“Choose the direction first, then let time prove you.”</em>",
    screensTitle: "The market is breathing.",
    screensText: "Bring the market to your desk: live movement, clear decisions, and a replayable rhythm that turns every observation into your next advantage.",
    pcStatus: "LIVE REPLAY",
    mobilePlatform: "Mobile concept",
    mobileStatus: "LIVE MARKET",
    mobileCareer: "Retail trader path",
    mobileCareerText: "Travel · Research · Trade",
    mobileStart: "Start test",
    coverAlt: "Open Bell work-in-progress playtest cover",
    marketTitle: "One desk. Six markets.",
    marketText: "From familiar equities to volatile crypto, each market has its own rhythm and risks.",
    playtestBadge: "Playable build · In development",
    downloadTitle: "Bring the market to your desktop.",
    downloadText: "This build is still in development. Content, balance, and interface may change; this is not the final release.",
    downloadBtn: "Get current build",
    playtestNote: "Playtest status: Windows / PC first · Mobile remains experimental · See the dev log for updates.",
    updatesTitle: "In progress.",
    updateWebTitle: "Open Bell website foundation",
    updateWebText: "Homepage, game overview, and download entry point",
    updateReplayText: "Play, step, and 0.5x–4x replay speed",
    updateDlcTitle: "DLC folders",
    updateDlcText: "Automatic detection and installation of official DLC folders",
    madeIn: "Made in Taiwan (Republic of China) · Made for replaying the market.",
    creatorNotice: "Tirde Studio · Copyright © 2026 Tirde Studio · Open Bell™",
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
    tw: ["TW", "Taiwan", "Opens at 13:30, with a daily price limit and heavyweight names. Practice waiting instead of chasing the first candle."],
    hk: ["HK", "Hong Kong", "Morning and afternoon sessions are split. Volatility is higher than Taiwan, with more false breakouts."],
    crypto: ["CRYPTO", "Crypto", "No closing bell. Markets run 24/7, so use replay speed to read a full stretch."],
    funds: ["FUNDS", "Funds", "A slower focus on allocation and rebalancing. The challenge is holding a plan, not guessing tomorrow."],
    futures: ["FUTURES", "Futures", "Leverage and margin matter. The wrong position size can take you out on the same candle."]
  }
};

let currentLanguage = "zh";
let currentMarket = "us";
const languageSelect = document.querySelector("#language-select");

function renderMarket() {
  const copy = (markets[currentLanguage] || markets.zh)[currentMarket] || markets.zh.us;
  const [kicker, title, text] = copy;
  const kickerElement = document.getElementById("market-detail-kicker");
  const titleElement = document.getElementById("market-detail-title");
  const textElement = document.getElementById("market-detail-text");
  if (kickerElement) kickerElement.textContent = kicker;
  if (titleElement) titleElement.textContent = title;
  if (textElement) textElement.textContent = text;
}

function setLanguage(language) {
  currentLanguage = translations[language] ? language : "zh";
  const copy = translations[currentLanguage];
  document.documentElement.lang = currentLanguage === "en" ? "en" : "zh-Hant";
  document.querySelectorAll("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (copy[key] != null) element.innerHTML = copy[key];
  });
  document.querySelectorAll("[data-i18n-alt]").forEach((element) => {
    const key = element.dataset.i18nAlt;
    if (copy[key] != null) element.setAttribute("alt", copy[key]);
  });
  document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
    const key = element.dataset.i18nAriaLabel;
    if (copy[key] != null) element.setAttribute("aria-label", copy[key]);
  });
  try { localStorage.setItem("open-bell-language", currentLanguage); } catch (_) { /* Storage can be blocked in private browsing. */ }
  if (languageSelect) languageSelect.value = currentLanguage;
  if (toggle) toggle.setAttribute("aria-label", copy.menu);
  renderMarket();
}

if (languageSelect) {
  let savedLanguage = "zh";
  try { savedLanguage = localStorage.getItem("open-bell-language") || "zh"; } catch (_) { /* Keep the default language. */ }
  setLanguage(savedLanguage);
  languageSelect.addEventListener("change", (event) => {
    document.body.classList.add("language-changing");
    window.setTimeout(() => {
      setLanguage(event.target.value);
      document.body.classList.remove("language-changing");
    }, 100);
  });
}

document.querySelectorAll(".market-list button").forEach((market) => {
  market.addEventListener("click", () => {
    document.querySelectorAll(".market-list button").forEach((item) => {
      item.classList.remove("selected");
      item.setAttribute("aria-pressed", "false");
    });
    market.classList.add("selected");
    market.setAttribute("aria-pressed", "true");
    currentMarket = market.dataset.market || "us";
    renderMarket();
  });
});

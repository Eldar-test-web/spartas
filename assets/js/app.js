/* SPARTANS — sayt nüvəsi: naviqasiya, saxlama, köməkçilər */

window.SP = window.SP || {};

SP.icon = (name, cls = "") =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"
    stroke-linecap="butt" stroke-linejoin="miter" aria-hidden="true">${SP.ICONS[name] || SP.ICONS.info}</svg>`;

SP.esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---------- saxlama ---------- */
const KEY = "spartans.v1";
const DEFAULTS = {
  user: null,
  points: 0,
  history: [],
  badges: []
};

SP.load = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "{}");
    return { ...structuredClone(DEFAULTS), ...raw };
  } catch {
    return structuredClone(DEFAULTS);
  }
};
SP.save = (state) => localStorage.setItem(KEY, JSON.stringify(state));

SP.addResult = (game, score, meta = {}) => {
  const st = SP.load();
  st.points += score;
  st.history.unshift({ game, score, date: new Date().toISOString(), ...meta });
  st.history = st.history.slice(0, 60);
  st.badges = SP.badgesFor(st);
  SP.save(st);
  return st;
};

/* Nəticə açarları SP.GAMES-dəki `key` dəyərləridir: wordle, krossvord, olcu, fermi, mini, viktorina. */
SP.badgesFor = (st) => {
  const b = [];
  if (st.history.some((h) => h.game === "wordle")) b.push("wordle-ilk");
  if (st.points >= 100) b.push("yuz-xal");
  if (st.points >= 500) b.push("bes-yuz");
  if (st.history.length >= 10) b.push("on-tur");
  if (st.history.some((h) => h.game === "olcu" && h.score >= 80)) b.push("olcu-usta");
  if (st.history.some((h) => h.game === "viktorina" && h.score >= 80)) b.push("viktorina-usta");
  if (st.history.some((h) => h.game === "krossvord")) b.push("krossvord-bitdi");
  return b;
};

/* ---------- istifadəçi ---------- */
SP.user = () => SP.load().user;
SP.login = (name, team) => {
  const st = SP.load();
  st.user = { name, team, since: new Date().toISOString() };
  SP.save(st);
};
SP.logout = () => {
  const st = SP.load();
  st.user = null;
  SP.save(st);
};

/* ---------- rəqəmlər ---------- */
SP.NUM_UNITS = [[1e12, "trilyon"], [1e9, "milyard"], [1e6, "milyon"], [1e3, "min"]];
SP.fmtBig = (v) => {
  for (const [k, lab] of SP.NUM_UNITS) {
    if (v >= k) {
      const n = v / k;
      return `${(Math.round(n * 10) / 10).toString().replace(".", ",")} ${lab}`;
    }
  }
  return String(v).replace(".", ",");
};
SP.fmt = (n, digits = 1) => `${+n.toFixed(digits)}`.replace(".", ",");

/* ---------- gündəlik seçim ---------- */
SP.dayKey = (d = new Date()) => d.toISOString().slice(0, 10);
SP.dayIndex = (salt = "") => {
  const [y, m, d] = SP.dayKey().split("-").map(Number);
  let h = 2166136261 ^ (y * 10000 + m * 100 + d);
  for (const ch of salt) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
  return Math.abs(h >>> 0);
};
SP.pickDaily = (list, salt = "") => list[SP.dayIndex(salt) % list.length];

/* ---------- naviqasiya quruluşu ---------- */
SP.NAV = [
  { group: "Əsas" },
  { href: "index.html", label: "Ana səhifə", icon: "home", key: "index" },
  { href: "oyunlar.html", label: "Oyunlar", icon: "games", key: "oyunlar" },
  { href: "suallar.html", label: "Suallar", icon: "questions", key: "suallar" },
  { href: "liderler.html", label: "Liderlər", icon: "trophy", key: "liderler" },
  { href: "komandalar.html", label: "Komandalar", icon: "teams", key: "komandalar" },
  { href: "profil.html", label: "Profil", icon: "user", key: "profil" },
  { group: "Oyunlar" },
  { href: "wordle.html", label: "Söz Təxmini", icon: "wordle", key: "wordle" },
  { href: "krossvord.html", label: "Krossvord", icon: "cross", key: "krossvord" },
  { href: "olcu-tahmini.html", label: "Ölçü Tahmini", icon: "ruler", key: "olcu" },
  { href: "olcu-qalereya.html", label: "Ölçü Qalereyası", icon: "ruler", key: "olcu-qalereya" },
  { href: "fermi-tahmini.html", label: "Fermi Tahmini", icon: "calc", key: "fermi" },
  { href: "mini-oyunlar.html", label: "Mini Oyunlar", icon: "dice", key: "mini" },
  { href: "viktorina.html", label: "Klassik Suallar", icon: "scroll", key: "viktorina" }
];

SP.renderShell = () => {
  const page = document.body.dataset.page || "index";
  const st = SP.load();
  const u = st.user;

  const navHtml = SP.NAV.map((n) =>
    n.group
      ? `<div class="nav-sep">${n.group}</div>`
      : `<a class="nav-link ${n.key === page ? "is-active" : ""}" href="${n.href}">${SP.icon(n.icon)}<span>${n.label}</span></a>`
  ).join("");

  const sidebar = document.getElementById("sidebar");
  if (sidebar) {
    sidebar.innerHTML = `
      <a class="brand" href="index.html">
        <img src="assets/img/logo-mark-mint.png" alt="SPARTANS emblem — Spartan dəyənəyi" width="74" height="74">
        <span class="brand-name">SPARTANS</span>
        <span class="brand-sub">İntellektual oyunlar klubu</span>
      </a>
      <nav class="nav" aria-label="Əsas naviqasiya">${navHtml}</nav>
      <div class="side-foot">
        <p class="motto">Daha çox düşün, daha irəli get.</p>
        <p class="copyright">© 2026 SPARTANS klubu</p>
      </div>`;
  }

  const topbar = document.getElementById("topbar");
  if (topbar) {
    topbar.innerHTML = `
      <button class="icon-btn menu-btn" id="menuBtn" aria-label="Menyunu aç">${SP.icon("games")}</button>
      <form class="search" role="search" action="suallar.html">
        ${SP.icon("search")}
        <input name="q" type="search" placeholder="Sual, komanda və ya oyun axtar..." aria-label="Axtarış"
          value="${SP.esc(new URLSearchParams(location.search).get("q") || "")}">
      </form>
      <div class="top-actions">
        <span class="chip" title="Ümumi xalın">${SP.icon("trophy")} ${st.points} xal</span>
        <a class="user-chip" href="${u ? "profil.html" : "girish.html"}">
          <span class="avatar">${u ? SP.esc(u.name.slice(0, 1).toUpperCase()) : "?"}</span>
          <span>${u ? SP.esc(u.name) : "Giriş et"}</span>
        </a>
      </div>`;
    topbar.querySelector("#menuBtn")?.addEventListener("click", () => document.body.classList.toggle("nav-open"));
  }

  const foot = document.getElementById("site-foot");
  if (foot) {
    foot.innerHTML = `
      <span>© 2026 SPARTANS — İntellektual Oyunlar Klubu</span>
      <a href="haqqinda.html">Haqqında</a>
      <a href="haqqinda.html#qaydalar">Oyun qaydaları</a>
      <a href="haqqinda.html#elaqe">Əlaqə</a>
      <span class="dim">Bütün nəticələr brauzerin yerli yaddaşında saxlanılır.</span>`;
  }
};

/* ---------- köməkçilər ---------- */
SP.toast = (msg, ms = 1900) => {
  let t = document.querySelector(".toast");
  if (!t) { t = document.createElement("div"); t.className = "toast"; document.body.appendChild(t); }
  t.textContent = msg;
  requestAnimationFrame(() => t.classList.add("show"));
  clearTimeout(SP._toastTimer);
  SP._toastTimer = setTimeout(() => t.classList.remove("show"), ms);
};

SP.countdownTarget = () => {
  const now = new Date();
  const t = new Date(now);
  const add = (6 - now.getDay() + 7) % 7 || 7;
  t.setDate(now.getDate() + add);
  t.setHours(19, 0, 0, 0);
  return t;
};

SP.startCountdown = (el) => {
  const tick = () => {
    const ms = SP.countdownTarget() - new Date();
    const s = Math.max(0, Math.floor(ms / 1000));
    const parts = [Math.floor(s / 86400), Math.floor(s / 3600) % 24, Math.floor(s / 60) % 60, s % 60];
    el.innerHTML = parts.map((v, i) =>
      `<div class="cd-box"><div class="cd-num">${String(v).padStart(2, "0")}</div><div class="cd-lab">${["gün", "saat", "daq", "san"][i]}</div></div>`
    ).join("");
  };
  tick();
  setInterval(tick, 1000);
};

/* liderlər: nümunə komandalar + lokal nəticələr */
SP.leaderboard = () => {
  const st = SP.load();
  const teams = SP.TEAMS.map((t) => ({ ...t }));
  if (st.user && teams.some((t) => t.name === st.user.team)) {
    const mine = teams.find((t) => t.name === st.user.team);
    mine.score += st.points;
    mine.you = true;
  }
  return teams.sort((a, b) => b.score - a.score);
};

SP.rankEmblem = (name) => {
  const t = SP.TEAMS.find((x) => x.name === name);
  return SP.icon(t ? t.emblem : "star");
};

SP.qs = new URLSearchParams(location.search);

document.addEventListener("DOMContentLoaded", () => {
  SP.renderShell();
  document.querySelectorAll("[data-icon]").forEach((el) => { el.innerHTML = SP.icon(el.dataset.icon); });
  document.querySelectorAll("[data-countdown]").forEach((el) => SP.startCountdown(el));
  document.body.addEventListener("click", (e) => {
    if (e.target.closest("#sidebar")) document.body.classList.remove("nav-open");
  });
});

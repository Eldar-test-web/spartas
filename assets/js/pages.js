/* SPARTANS — statik səhifələrin renderinqi (oyunlar, suallar, liderlər, komandalar, profil, giriş) */

const BADGES = {
  "wordle-ilk": { t: "İlk Söz Təxmini", i: "wordle", d: "İlk Söz Təxmini oyununu başa çatdır" },
  "yuz-xal": { t: "100 xal", i: "trophy", d: "Ümumi 100 xala çat" },
  "bes-yuz": { t: "500 xal", i: "medal", d: "Ümumi 500 xala çat" },
  "on-tur": { t: "10 tur", i: "flag", d: "10 oyun nəticəsi topla" },
  "olcu-usta": { t: "Ölçü ustası", i: "ruler", d: "Ölçü Tahminində 80+ xal al" },
  "viktorina-usta": { t: "Viktorina ustası", i: "scroll", d: "Klassik Suallarda 80+ xal al" },
  "krossvord-bitdi": { t: "Krossvordçu", i: "cross", d: "Krossvord şəbəkəsini tamamla" }
};

const GAME_SCORE_RULES = [
  ["Söz Təxmini", "Hər təsadə cəhd azaldıqca xal artır: 6 cəhdlə tapılan söz 10, birinci cəhdlə tapılan 60 xal."],
  ["Krossvord", "Tamamlanmış şəbəkə 100 xaldan başlayır: açılan hər hücrə −10, işlədilən hər dəqiqə −1 (ən çoxu −30)."],
  ["Ölçü Tahmini", "5 raund, hər raundda ən çoxu 100 xal. Klub cədvəlinə orta nəticə yazılır (ən çoxu 100)."],
  ["Fermi Tahmini", "Hər doğru variant 10 xal — 8 sualdən ən çoxu 80 xal."],
  ["Mini Oyunlar", "2048: xalın onda biri · Tetris: hər sıra 10 xal · Yaddaş: 100-ə qədər · Dos-crossa: qələbə 30 xal."],
  ["Klassik Suallar", "Doğru cavab başına 10 xal — 10 sualdan ən çoxu 100 xal."]
];

/* ---------- oyunlar.html ---------- */
function pageOyunlar() {
  const st = SP.load();
  const grid = document.getElementById("gameGrid");
  if (grid) {
    grid.innerHTML = SP.GAMES.map((g) => `
      <a class="game-card" href="${g.href}">
        <span class="game-icon">${SP.icon(g.icon)}</span>
        <div>
          <h3>${SP.esc(g.title)}</h3>
          <p>${SP.esc(g.desc)}</p>
          <span class="game-meta">
            ${g.tag ? `<span class="tag-new">${SP.esc(g.tag)}</span>` : ""}
            <span class="chip chip-neutral">${st.history.filter((h) => h.game === g.key).length} tur</span>
          </span>
        </div>
        <span class="game-go">Oyna ${SP.icon("arrow")}</span>
      </a>`).join("");
  }

  const rules = document.getElementById("rulesTable");
  if (rules) {
    rules.innerHTML = `<table class="tbl"><thead><tr><th>Oyun</th><th>Xal qaydası</th></tr></thead><tbody>
      ${GAME_SCORE_RULES.map(([n, r]) => `<tr><td><b>${n}</b></td><td class="muted">${r}</td></tr>`).join("")}
    </tbody></table>`;
  }

  const statWrap = document.getElementById("gameStats");
  if (statWrap) {
    const played = new Set(st.history.map((h) => h.game));
    statWrap.innerHTML = [
      ["Aktiv oyunlar", played.size],
      ["Oyun turu", st.history.length],
      ["Ümumi xal", st.points],
      ["Nişanlar", st.badges.length]
    ].map(([l, v]) => `<div class="stat"><b>${v}</b><span>${l}</span></div>`).join("");
  }
}

/* ---------- suallar.html ---------- */
function pageSuallar() {
  const listEl = document.getElementById("qList");
  const countEl = document.getElementById("qCount");
  const catEl = document.getElementById("catChips");
  if (!listEl) return;

  let term = (SP.qs.get("q") || "").trim();
  let cat = "";
  let diff = "";

  const search = document.getElementById("qSearch");
  if (search) search.value = term;

  if (catEl) {
    catEl.innerHTML = ["Hamısı", ...SP.CATEGORIES]
      .map((c, i) => `<button class="chip ${i === 0 ? "" : "chip-neutral"}" type="button" data-cat="${i === 0 ? "" : SP.esc(c)}">${c}</button>`)
      .join("");
    catEl.addEventListener("click", (e) => {
      const b = e.target.closest("[data-cat]");
      if (!b) return;
      cat = b.dataset.cat;
      catEl.querySelectorAll("[data-cat]").forEach((x) => {
        x.classList.toggle("chip-neutral", x !== b);
      });
      draw();
    });
  }

  const diffSel = document.getElementById("diffSel");
  const norm = (s) => s.toLocaleLowerCase("az").replace(/[\s.?!,;:]+/g, "");

  function draw() {
    const t = norm(term);
    const rows = SP.QUESTIONS.filter((q) => {
      if (cat && q.c !== cat) return false;
      if (diff && q.d !== diff) return false;
      if (!t) return true;
      return norm(q.q).includes(t) || q.o.some((o) => norm(o).includes(t)) || norm(q.c).includes(t);
    });
    countEl.textContent = `${rows.length} sual tapıldı`;
    listEl.innerHTML = rows.length
      ? rows.map((q, i) => `
        <article class="card q-card-col">
          <div class="row between" style="gap:12px">
            <span class="row" style="gap:8px">
              <span class="chip">${SP.esc(q.c)}</span>
              <span class="chip chip-neutral">${SP.esc(q.d)}</span>
            </span>
            <span class="small dim">#${SP.QUESTIONS.indexOf(q) + 1}</span>
          </div>
          <h3 class="q-title">${SP.esc(q.q)}</h3>
          <ol class="q-opts">
            ${q.o.map((o, j) => `<li data-right="${j === q.a ? "1" : ""}">${SP.esc(o)}</li>`).join("")}
          </ol>
          <div class="row" style="gap:10px">
            <button class="btn btn-sm btn-ghost" type="button" data-reveal>Cavabı aç</button>
            <details class="q-note"><summary>İzah</summary><p>${SP.esc(q.x)}</p></details>
          </div>
        </article>`).join("")
      : `<div class="card center"><p class="lead">Uyğun sual tapılmadı. Axtarış sözünü dəyiş və ya kateqoriyanı “Hamısı” qoy.</p></div>`;
    listEl.querySelectorAll("[data-reveal]").forEach((b) => {
      b.addEventListener("click", () => {
        const card = b.closest(".q-card-col");
        const li = card.querySelector('[data-right="1"]');
        li.classList.add("is-right");
        li.insertAdjacentHTML("beforeend", '<span class="small dim"> — düzgün</span>');
        b.remove();
      });
    });
  }

  search?.addEventListener("input", (e) => { term = e.target.value; draw(); });
  diffSel?.addEventListener("change", (e) => { diff = e.target.value; draw(); });
  draw();
}

/* ---------- liderler.html ---------- */
function pageLiderler() {
  const tbody = document.getElementById("lbBody");
  const st = SP.load();
  if (tbody) {
    const rows = SP.leaderboard();
    const top = rows[0] ? rows[0].score : 1;
    tbody.innerHTML = rows.map((t, i) => `
      <tr${t.you ? ' class="is-you"' : ""}>
        <td class="num">${i + 1}</td>
        <td><span class="lb-team">${SP.rankEmblem(t.name)}<b>${SP.esc(t.name)}</b>${t.you ? '<span class="tag-new">sən</span>' : ""}</span></td>
        <td class="muted">${t.members.length}</td>
        <td class="num">${t.score}</td>
        <td><span class="progress" title="%${Math.round((t.score / top) * 100)}"><i style="width:${Math.max(4, (t.score / top) * 100)}%"></i></span></td>
      </tr>`).join("");
  }

  const my = document.getElementById("myHistory");
  if (my) {
    my.innerHTML = st.history.length
      ? st.history.slice(0, 12).map((h) => `
        <tr><td>${SP.esc((SP.GAMES.find((g) => g.key === h.game) || { title: h.game }).title)}</td>
        <td class="muted">${new Date(h.date).toLocaleString("az", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}</td>
        <td class="num">${h.score}</td></tr>`).join("")
      : `<tr><td colspan="3" class="muted">Hələ nəticən yoxdur — <a href="oyunlar.html">bir oyuna başla</a>.</td></tr>`;
  }

  const sum = document.getElementById("lbSummary");
  if (sum) {
    const byGame = {};
    st.history.forEach((h) => { byGame[h.game] = (byGame[h.game] || 0) + h.score; });
    sum.innerHTML = Object.entries(byGame).length
      ? Object.entries(byGame).map(([g, v]) => `<div class="stat"><b>${v}</b><span>${SP.esc((SP.GAMES.find((x) => x.key === g) || { title: g }).title)}</span></div>`).join("")
      : `<p class="muted">Şəxsi xalların brauzerinin yerli yaddaşında saxlanılır — serverə göndərilmir.</p>`;
  }
}

/* ---------- komandalar.html ---------- */
function pageKomandalar() {
  const grid = document.getElementById("teamGrid");
  if (!grid) return;
  const rows = SP.leaderboard();
  const top = rows[0] ? rows[0].score : 1;
  grid.innerHTML = rows.map((t, i) => `
    <article class="card team-card">
      <div class="row between">
        <span class="team-mark">${SP.rankEmblem(t.name)}</span>
        <span class="chip ${i === 0 ? "" : "chip-neutral"}">${i + 1}-ci yer</span>
      </div>
      <h3>${SP.esc(t.name)}</h3>
      <p class="muted small">${t.members.length} üzv · ${t.score} xal</p>
      <span class="progress"><i style="width:${Math.max(4, (t.score / top) * 100)}%"></i></span>
      <div class="team-people">${t.members.map((m) => `<span class="avatar avatar-sm">${SP.esc(m.slice(0, 1).toUpperCase())}</span>`).join("")}</div>
      <p class="small dim">${t.members.map((m) => SP.esc(m)).join(", ")}</p>
    </article>`).join("");

  const note = document.getElementById("teamNote");
  if (note) {
    const st = SP.load();
    note.textContent = st.user
      ? `Hazırda “${st.user.name}” kimi ${st.points} xalın var. Komandan ${st.user.team || "seçilməyib"}.`
      : "Komandaya yazılmaq üçün giriş et — xalların seçdiyin komandanın ümumi nəticəsinə əlavə olunur.";
  }
}

/* ---------- profil.html ---------- */
function pageProfil() {
  const st = SP.load();
  const box = document.getElementById("profileBox");
  if (!box) return;

  if (!st.user) {
    box.innerHTML = `
      <div class="card center">
        <span class="game-icon">${SP.icon("user")}</span>
        <h2>Hesab tapılmadı</h2>
        <p class="muted">Xalların, nişanların və oyun tarixçən brauzerinin yerli yaddaşında saxlanılır. Adını yaz, komanda seç — davam et.</p>
        <a class="btn btn-mint" href="girish.html">Giriş et</a>
      </div>`;
    return;
  }

  const byGame = {};
  st.history.forEach((h) => { byGame[h.game] = (byGame[h.game] || 0) + h.score; });
  box.innerHTML = `
    <div class="card profile-head">
      <span class="avatar avatar-lg">${SP.esc(st.user.name.slice(0, 1).toUpperCase())}</span>
      <div>
        <h2 style="margin:0">${SP.esc(st.user.name)}</h2>
        <p class="muted">${SP.esc(st.user.team || "Komandasız")} · ${new Date(st.user.since).toLocaleDateString("az")} tarixindən bəri</p>
      </div>
      <span class="chip chip-big">${SP.icon("trophy")} ${st.points} xal</span>
    </div>

    <div class="section-head"><span class="ico">${SP.icon("medal")}</span><h2>Nişanlar</h2></div>
    <div class="badges">
      ${Object.entries(BADGES).map(([k, b]) => `<div class="badge ${st.badges.includes(k) ? "on" : ""}" title="${b.d}">${SP.icon(b.i)}<span>${b.t}</span></div>`).join("")}
    </div>

    <div class="section-head"><span class="ico">${SP.icon("clock")}</span><h2>İlk 12 tur</h2></div>
    <div class="card">
      <table class="tbl"><thead><tr><th>Oyun</th><th>Nəticə</th><th>Təfərrüat</th><th class="num">Xal</th></tr></thead>
      <tbody>
        ${st.history.length
          ? st.history.slice(0, 12).map((h) => `<tr>
              <td>${SP.esc((SP.GAMES.find((g) => g.key === h.game) || { title: h.game }).title)}</td>
              <td class="muted">${new Date(h.date).toLocaleString("az", { day: "2-digit", month: "2-digit", year: "2-digit", hour: "2-digit", minute: "2-digit" })}</td>
              <td class="muted small">${SP.esc(h.detail || h.mode || h.rounds || "—")}</td>
              <td class="num">${h.score}</td></tr>`).join("")
          : `<tr><td colspan="4" class="muted">Hələ heç nə oynamayıbsan.</td></tr>`}
      </tbody></table>
    </div>

    <div class="row mt" style="gap:10px">
      ${Object.entries(byGame).map(([g, v]) => `<span class="chip chip-neutral">${SP.esc((SP.GAMES.find((x) => x.key === g) || { title: g }).title)} · ${v}</span>`).join("")}
    </div>

    <div class="card mt danger-zone">
      <div class="row between" style="gap:12px;flex-wrap:wrap">
        <p class="muted small" style="margin:0">Sıfırlama yalnız bu brauzerdəki yerli məlumatları silir — geri qaytarmaq mümkün deyil.</p>
        <span class="row" style="gap:10px">
          <button class="btn btn-sm btn-ghost" id="logoutBtn" type="button">Hesabdan çıx</button>
          <button class="btn btn-sm btn-warn" id="resetBtn" type="button">Məlumatları sıfırla</button>
        </span>
      </div>
    </div>`;

  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    SP.logout();
    SP.toast("Hesabdan çıxıldı.");
    location.href = "index.html";
  });
  document.getElementById("resetBtn")?.addEventListener("click", () => {
    if (!confirm("Bütün xallar, nişanlar və tarixçə silinsin?")) return;
    localStorage.removeItem("spartans.v1");
    location.reload();
  });
}

/* ---------- girish.html ---------- */
function pageGirish() {
  const form = document.getElementById("loginForm");
  const sel = document.getElementById("teamSel");
  if (sel) {
    sel.innerHTML = SP.TEAMS.map((t) => `<option value="${SP.esc(t.name)}">${SP.esc(t.name)} (${t.members.length} üzv)</option>`).join("");
  }
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("nameInput").value.trim();
    if (name.length < 2) {
      SP.toast("Ad ən azı 2 simvol olmalıdır.");
      return;
    }
    SP.login(name, sel.value);
    location.href = "profil.html";
  });
}

/* ---------- haqqinda.html ---------- */
function pageHaqqinda() {
  const games = document.getElementById("aboutGames");
  if (games) {
    games.innerHTML = `<table class="tbl"><thead><tr><th>Oyun</th><th>Nədir</th></tr></thead><tbody>
      ${SP.GAMES.map((g) => `<tr><td><b>${SP.esc(g.title)}</b></td><td class="muted">${SP.esc(g.desc)}</td></tr>`).join("")}
    </tbody></table>`;
  }
  const teams = document.getElementById("aboutTeams");
  if (teams) {
    teams.innerHTML = SP.TEAMS.map((t) => `<li><b>${SP.esc(t.name)}</b> — ${t.members.length} üzv, ${t.score} xal</li>`).join("");
  }
}

/* ---------- 404 ---------- */
function page404() {}

const ROUTER = {
  oyunlar: pageOyunlar,
  suallar: pageSuallar,
  liderler: pageLiderler,
  komandalar: pageKomandalar,
  profil: pageProfil,
  girish: pageGirish,
  haqqinda: pageHaqqinda,
  "404": page404
};

document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  ROUTER[page]?.();
});

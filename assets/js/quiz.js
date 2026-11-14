/* Klassik Suallar — viktorina mühərriki */
(() => {
  const TIME = 20;
  const panel = document.getElementById("panel");
  const statsBox = document.getElementById("vStats");
  const streakText = document.getElementById("streakText");
  const streakBar = document.getElementById("streakBar");

  let cat = "Hamısı";
  let count = 10;
  let qs = [], i = 0, score = 0, streak = 0, best = 0, timer = null, left = TIME, picked = null, done = [];

  const shuffle = (a) => { const r = [...a]; for (let k = r.length - 1; k > 0; k--) { const j = Math.floor(Math.random() * (k + 1)); [r[k], r[j]] = [r[j], r[k]]; } return r; };

  function setup() {
    const cats = ["Hamısı", ...SP.CATEGORIES];
    panel.innerHTML = `
      <h2>Turu quraşdır</h2>
      <p class="small muted">Kateqoriya və sual sayını seç. Suallar bankdan təsadüfi seçilir, cavablar izahla birlikdə göstərilir.</p>
      <div class="len-tabs mt" id="catTabs" style="justify-content:flex-start">
        ${cats.map((c) => `<button class="len-tab ${c === cat ? "is-active" : ""}" data-cat="${c}" type="button">${c}</button>`).join("")}
      </div>
      <div class="len-tabs mt" id="countTabs" style="justify-content:flex-start">
        ${[5, 10, 15].map((n) => `<button class="len-tab ${n === count ? "is-active" : ""}" data-count="${n}" type="button">${n} sual</button>`).join("")}
      </div>
      <div class="row mt"><button class="btn btn-mint" id="startBtn" type="button">Oyuna başla →</button>
        <span class="small dim">Bankda ${SP.QUESTIONS.length} sual var.</span></div>`;
    panel.querySelector("#catTabs").addEventListener("click", (e) => {
      const b = e.target.closest("[data-cat]"); if (!b) return;
      cat = b.dataset.cat;
      panel.querySelectorAll("[data-cat]").forEach((x) => x.classList.toggle("is-active", x.dataset.cat === cat));
    });
    panel.querySelector("#countTabs").addEventListener("click", (e) => {
      const b = e.target.closest("[data-count]"); if (!b) return;
      count = +b.dataset.count;
      panel.querySelectorAll("[data-count]").forEach((x) => x.classList.toggle("is-active", +x.dataset.count === count));
    });
    panel.querySelector("#startBtn").addEventListener("click", start);
    renderStats();
  }

  function start() {
    const pool = SP.QUESTIONS.filter((q) => cat === "Hamısı" || q.c === cat);
    if (pool.length < 1) return SP.toast("Bu kateqoriyada sual yoxdur");
    qs = shuffle(pool).slice(0, Math.min(count, pool.length));
    i = 0; score = 0; streak = 0; done = [];
    draw();
  }

  function draw() {
    clearInterval(timer);
    left = TIME;
    picked = null;
    const q = qs[i];
    panel.innerHTML = `
      <div class="row between" style="margin-bottom:12px">
        <span class="chip">${i + 1} / ${qs.length}</span>
        <span class="chip chip-neutral">${SP.esc(q.c)} · ${SP.esc(q.d)}</span>
        <span class="chip" id="timeChip">${TIME} san</span>
      </div>
      <div class="timer-bar"><i id="tbar" style="width:100%"></i></div>
      <h2 style="font-size:21px">${SP.esc(q.q)}</h2>
      <div id="opts" style="margin-top:16px">
        ${q.o.map((o, k) => `<button class="opt" data-k="${k}" type="button"><span class="k">${"ABCD"[k]}</span>${SP.esc(o)}</button>`).join("")}
      </div>
      <div id="expl" class="card small" style="display:none;margin-top:12px;background:var(--deep-3);border-color:var(--line-2)"></div>
      <div class="row mt"><button class="btn btn-primary" id="nextBtn" style="display:none" type="button">${i === qs.length - 1 ? "Nəticə →" : "Növbəti sual →"}</button></div>`;
    panel.querySelector("#opts").addEventListener("click", (e) => {
      const b = e.target.closest("[data-k]");
      if (b && picked === null) answer(+b.dataset.k);
    });
    panel.querySelector("#nextBtn").addEventListener("click", () => {
      if (i < qs.length - 1) { i++; draw(); } else finish();
    });
    timer = setInterval(tick, 1000);
    renderStats();
  }

  function tick() {
    left--;
    const chip = panel.querySelector("#timeChip"), bar = panel.querySelector("#tbar");
    if (chip) chip.textContent = `${Math.max(0, left)} san`;
    if (bar) bar.style.width = `${(left / TIME) * 100}%`;
    if (left <= 0) { clearInterval(timer); if (picked === null) answer(-1); }
  }

  function answer(k) {
    clearInterval(timer);
    picked = k;
    const q = qs[i];
    const ok = k === q.a;
    const bonus = ok ? Math.round((5 * left) / TIME) : 0;
    if (ok) { score += 10 + bonus; streak++; best = Math.max(best, streak); } else streak = 0;
    done.push({ q: q.q, your: k < 0 ? "vaxt bitdi" : q.o[k], right: q.o[q.a], ok });
    [...panel.querySelector("#opts").children].forEach((c, j) => {
      c.disabled = true;
      if (j === q.a) c.classList.add("right");
      else if (j === k) c.classList.add("wrong");
    });
    const expl = panel.querySelector("#expl");
    expl.style.display = "";
    expl.innerHTML = `<b style="color:${ok ? "var(--mint)" : "var(--bad)"}">${ok ? `+${10 + bonus} xal` : k < 0 ? "Vaxt bitdi" : "Səhv"}</b> · ${SP.esc(q.x)}`;
    panel.querySelector("#nextBtn").style.display = "";
    renderStats();
  }

  function finish() {
    const pts = score;
    SP.addResult("quiz", pts, { correct: done.filter((d) => d.ok).length, cat });
    const right = done.filter((d) => d.ok).length;
    panel.innerHTML = `
      <h2>Tur bitdi</h2>
      <div class="grid g3" style="margin-bottom:18px">
        <div class="stat"><b>${pts}</b><span>xal</span></div>
        <div class="stat"><b>${right}/${done.length}</b><span>doğru</span></div>
        <div class="stat"><b>${best}</b><span>ən uzun seriya</span></div>
      </div>
      <table class="tbl"><thead><tr><th>Sual</th><th>Sənin cavabın</th><th>Düzgün</th></tr></thead>
      <tbody>${done.map((d) => `<tr><td>${SP.esc(d.q)}</td>
        <td style="color:${d.ok ? "var(--mint)" : "var(--bad)"}">${SP.esc(d.your)}</td>
        <td>${SP.esc(d.right)}</td></tr>`).join("")}</tbody></table>
      <div class="row mt"><button class="btn btn-mint" id="again" type="button">Yeni tur</button>
        <a class="btn btn-ghost" href="suallar.html">Bütün suallar →</a>
        <a class="btn btn-ghost" href="liderler.html">Liderlər →</a></div>`;
    panel.querySelector("#again").addEventListener("click", start);
    renderStats();
  }

  function renderStats() {
    const st = SP.load();
    const games = st.history.filter((h) => h.game === "quiz");
    statsBox.innerHTML = [
      ["Xal", score],
      ["Sual", `${done.length}/${qs.length || count}`],
      ["Oyun sayı", games.length],
      ["Ümumi klub xalı", st.points]
    ].map(([l, v]) => `<div class="stat"><b>${v}</b><span>${l}</span></div>`).join("");
    streakText.textContent = streak ? `${streak} ardıcıl doğru · rekord turda ${best}` : "Ardıcıl doğru seriya yoxdur.";
    streakBar.style.width = `${Math.min(100, streak * 20)}%`;
  }

  document.getElementById("otherGames").innerHTML = SP.GAMES.filter((g) => g.key !== "viktorina")
    .map((g) => `<a class="btn btn-sm btn-ghost" href="${g.href}">${SP.icon(g.icon)} ${g.title}</a>`).join("");

  setup();
})();

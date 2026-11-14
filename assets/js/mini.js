/* Mini Oyunlar: yaddaş · zər · reaksiya · tapmaca */
(() => {
  const tabs = document.getElementById("miniTabs");
  const panel = document.getElementById("miniPanel");
  const statsBox = document.getElementById("miniStats");
  let current = "memory";
  let lastPoints = 0;

  const GAMES = [
    { k: "memory", label: "Yaddaş" },
    { k: "dice", label: "Zər" },
    { k: "reaction", label: "Reaksiya" },
    { k: "riddle", label: "Tapmaca" }
  ];

  tabs.innerHTML = GAMES.map((g) =>
    `<button class="len-tab ${g.k === current ? "is-active" : ""}" data-k="${g.k}" type="button">${g.label}</button>`).join("");
  tabs.addEventListener("click", (e) => {
    const b = e.target.closest("[data-k]");
    if (!b) return;
    current = b.dataset.k;
    tabs.querySelectorAll(".len-tab").forEach((x) => x.classList.toggle("is-active", x.dataset.k === current));
    start();
  });

  function award(pts, meta) {
    lastPoints = Math.max(0, Math.round(pts));
    SP.addResult("mini", lastPoints, { game: current, ...meta });
    renderStats();
  }

  function renderStats() {
    const st = SP.load();
    const games = st.history.filter((h) => h.game === "mini");
    statsBox.innerHTML = [
      ["Son tur", lastPoints],
      ["Mini turlar", games.length],
      ["Klub xalı", st.points],
      ["Rekord", Math.max(0, ...games.map((g) => g.score))]
    ].map(([l, v]) => `<div class="stat"><b>${v}</b><span>${l}</span></div>`).join("");
  }

  /* ---------------- Yaddaş ---------------- */
  const SYMBOLS = ["⚑", "☾", "♠", "♥", "♦", "♣", "★", "✦"];
  let mem = null;

  function memoryStart() {
    const deck = [...SYMBOLS, ...SYMBOLS].sort(() => Math.random() - 0.5);
    mem = { cards: deck, open: [], matched: new Set(), moves: 0, lock: false };
    panel.innerHTML = `<h2>Yaddaş</h2><p class="small muted">Bütün cütləri tap. Hər açılış bir gediş sayılır.</p>
      <div class="memory-grid mt" id="mgrid"></div>
      <div class="row mt"><span class="chip" id="mMoves">0 gediş</span><span class="chip chip-neutral" id="mPairs">0 / 8 cüt</span>
        <button class="btn btn-sm btn-ghost" id="mNew" type="button">Yeni qarışdırma</button></div>`;
    const grid = panel.querySelector("#mgrid");
    grid.innerHTML = mem.cards.map((s, i) => `<button class="mcard" data-i="${i}" type="button" aria-label="kart ${i + 1}">${s}</button>`).join("");
    grid.addEventListener("click", (e) => {
      const b = e.target.closest("[data-i]");
      if (!b || mem.lock) return;
      const i = +b.dataset.i;
      if (mem.matched.has(i) || mem.open.includes(i)) return;
      b.classList.add("up");
      mem.open.push(i);
      if (mem.open.length === 2) {
        mem.moves++;
        panel.querySelector("#mMoves").textContent = `${mem.moves} gediş`;
        const [a, c] = mem.open;
        mem.open = [];
        if (mem.cards[a] === mem.cards[c]) {
          mem.matched.add(a); mem.matched.add(c);
          grid.children[a].classList.add("pair");
          grid.children[c].classList.add("pair");
          panel.querySelector("#mPairs").textContent = `${mem.matched.size / 2} / 8 cüt`;
          if (mem.matched.size === 16) {
            const pts = Math.max(20, 100 - (mem.moves - 16) * 4);
            award(pts, { moves: mem.moves });
            SP.toast(`Bütün cütlər tapıldı · ${mem.moves} gediş · +${pts} xal`, 3200);
          }
        } else {
          mem.lock = true;
          setTimeout(() => {
            grid.children[a].classList.remove("up");
            grid.children[c].classList.remove("up");
            mem.lock = false;
          }, 620);
        }
      }
    });
    panel.querySelector("#mNew").addEventListener("click", memoryStart);
  }

  /* ---------------- Zər ---------------- */
  let dice = null;

  function diceStart() {
    dice = { round: 0, total: 10, score: 0, rolls: [] };
    panel.innerHTML = `<h2>Zər</h2><p class="small muted">İki zər atılır. Cəmin 7-dən böyük, bərabər və ya kiçik olacağını seç.</p>
      <div class="center mt"><div id="diceFace" style="font-size:56px;letter-spacing:12px">⚀ ⚀</div>
        <p class="small dim" id="diceSum">Cəm: —</p></div>
      <div class="row mt" style="justify-content:center">
        <button class="btn btn-primary" data-bet="low" type="button">7-dən kiçik</button>
        <button class="btn btn-ghost" data-bet="eq" type="button">Dəqiq 7</button>
        <button class="btn btn-primary" data-bet="high" type="button">7-dən böyük</button>
      </div>
      <div class="row between mt"><span class="chip" id="dRound">Tur 1 / 10</span><span class="chip chip-neutral" id="dScore">0 xal</span></div>
      <p class="small dim">Ehtimal: kiçik 15/36 · bərabər 6/36 · böyük 15/36. "Dəqiq 7" daha az ehtimallıdır, ona görə daha çox xal verir.</p>`;
    panel.addEventListener("click", (e) => {
      const b = e.target.closest("[data-bet]");
      if (!b || dice.round >= dice.total) return;
      const d1 = 1 + Math.floor(Math.random() * 6), d2 = 1 + Math.floor(Math.random() * 6);
      const sum = d1 + d2;
      const face = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];
      panel.querySelector("#diceFace").textContent = `${face[d1 - 1]} ${face[d2 - 1]}`;
      panel.querySelector("#diceSum").textContent = `Cəm: ${sum}`;
      const outcome = sum < 7 ? "low" : sum > 7 ? "high" : "eq";
      const gain = outcome === b.dataset.bet ? (outcome === "eq" ? 20 : 10) : 0;
      dice.score += gain;
      dice.round++;
      dice.rolls.push({ sum, bet: b.dataset.bet, gain });
      panel.querySelector("#dRound").textContent = `Tur ${Math.min(dice.round + 1, dice.total)} / ${dice.total}`;
      panel.querySelector("#dScore").textContent = `${dice.score} xal`;
      if (dice.round >= dice.total) {
        award(dice.score, { rolls: dice.rolls.length });
        SP.toast(`Zər turu bitdi · ${dice.score} xal`, 3000);
      }
    });
  }

  /* ---------------- Reaksiya ---------------- */
  let rx = null;

  function reactionStart() {
    rx = { tries: [], armed: false, waiting: false, t0: 0, timer: null };
    panel.innerHTML = `<h2>Reaksiya</h2><p class="small muted">Panel yaşıl olanan kimi vur. Erken vursan — yanlış başlanğıc.</p>
      <div id="rxBox" class="center mt" role="button" tabindex="0"
        style="height:220px;border-radius:var(--radius);border:1px solid var(--line);background:var(--panel);display:grid;place-items:center;cursor:pointer;font-size:20px;font-weight:700">
        Başlamaq üçün vur
      </div>
      <div class="row mt"><span class="chip" id="rxLast">—</span><span class="chip chip-neutral" id="rxAvg">orta: —</span>
        <span class="chip chip-neutral" id="rxCount">0 / 5 cəhd</span></div>`;
    const box = panel.querySelector("#rxBox");
    const setStyle = (bg, txt, color = "#04120c") => { box.style.background = bg; box.textContent = txt; box.style.color = color; };

    const arm = () => {
      setStyle("var(--deep-3)", "Gözlə...", "var(--mint)");
      rx.waiting = true;
      rx.timer = setTimeout(() => {
        rx.waiting = false;
        rx.armed = true;
        rx.t0 = performance.now();
        setStyle("var(--mint)", "VUR!");
      }, 900 + Math.random() * 2600);
    };

    const hit = () => {
      if (rx.tries.length >= 5) return;
      if (rx.waiting) {
        clearTimeout(rx.timer);
        rx.waiting = false;
        setStyle("#3a1414", "Erken vurdun — yenidən gözlə", "#ffd9d3");
        setTimeout(arm, 900);
        return;
      }
      if (!rx.armed) { arm(); return; }
      const ms = Math.round(performance.now() - rx.t0);
      rx.armed = false;
      rx.tries.push(ms);
      panel.querySelector("#rxLast").textContent = `${ms} ms`;
      const avg = Math.round(rx.tries.reduce((a, b) => a + b, 0) / rx.tries.length);
      panel.querySelector("#rxAvg").textContent = `orta: ${avg} ms`;
      panel.querySelector("#rxCount").textContent = `${rx.tries.length} / 5 cəhd`;
      setStyle("var(--deep)", `${ms} ms — növbəti cəhd üçün vur`, "#eafff5");
      if (rx.tries.length === 5) {
        const pts = Math.max(0, Math.round(100 - (avg - 180) / 4));
        award(pts, { avg });
        SP.toast(`Orta ${avg} ms · +${pts} xal`, 3200);
      }
    };

    box.addEventListener("click", hit);
    box.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); hit(); } });
  }

  /* ---------------- Tapmaca ---------------- */
  let rd = null;
  const norm = (s) => s.toLocaleLowerCase("az").replace(/[.,;:!?"“”'`\s-]+/g, "").replace(/ı/g, "i").replace(/ə/g, "e");

  function riddleStart() {
    const start = SP.dayIndex("riddle");
    rd = { list: Array.from({ length: 5 }, (_, i) => SP.RIDDLES[(start + i) % SP.RIDDLES.length]), i: 0, score: 0, wrong: 0 };
    drawRiddle();
  }

  function drawRiddle() {
    const r = rd.list[rd.i];
    panel.innerHTML = `<h2>Tapmaca</h2><p class="small muted">Cavabı yaz — kiçik/böyük hərf və nöqtə əhəmiyyət daşımır.</p>
      <div class="card mt" style="background:var(--deep-3);border-color:var(--line-2)">
        <p style="font-size:19px;margin:0;font-style:italic">“${SP.esc(r.q)}”</p>
      </div>
      <div class="row mt"><input id="rIn" placeholder="Cavabın..." style="flex:1 1 240px;background:var(--bg-soft);border:1px solid var(--line);border-radius:10px;padding:11px 13px">
        <button class="btn btn-primary" id="rGo" type="button">Yoxla</button></div>
      <p id="rOut" class="small" style="margin-top:12px"></p>
      <div class="row"><span class="chip" id="rCount">Tapmaca ${rd.i + 1} / 5</span><span class="chip chip-neutral">${rd.score} xal</span>
        <button class="btn btn-sm btn-ghost" id="rSkip" type="button">Cavabı göstər (0 xal)</button></div>`;
    const input = panel.querySelector("#rIn"), out = panel.querySelector("#rOut");
    const check = () => {
      if (!input.value.trim()) return;
      const ok = norm(input.value) === norm(r.a);
      if (ok) { rd.score += 20; out.innerHTML = `<b style="color:var(--mint)">Doğrudur!</b> ${SP.esc(r.x)}`; }
      else { rd.wrong++; out.innerHTML = `<b style="color:var(--bad)">Səhv.</b> Yenidən cəhd et, ya da cavabı göstər.`; }
      panel.querySelectorAll(".chip")[1].textContent = `${rd.score} xal`;
      if (ok) next();
    };
    const next = () => {
      if (rd.i < 4) { rd.i++; drawRiddle(); return; }
      award(rd.score, { wrong: rd.wrong });
      panel.innerHTML = `<h2>Tapmaca turu bitdi</h2>
        <p class="lead">${rd.score} xal topladın · ${rd.wrong} səhv cəhd.</p>
        <div class="row"><button class="btn btn-mint" id="rAgain" type="button">Yeni tur</button>
          <a class="btn btn-ghost" href="liderler.html">Liderlər →</a></div>`;
      panel.querySelector("#rAgain").addEventListener("click", riddleStart);
      renderStats();
    };
    panel.querySelector("#rGo").addEventListener("click", check);
    input.addEventListener("keydown", (e) => { if (e.key === "Enter") check(); });
    panel.querySelector("#rSkip").addEventListener("click", () => {
      out.innerHTML = `Cavab: <b style="color:var(--mint)">${SP.esc(r.a)}</b> · ${SP.esc(r.x)}`;
      next();
    });
    input.focus();
  }

  function start() {
    ({ memory: memoryStart, dice: diceStart, reaction: reactionStart, riddle: riddleStart })[current]();
    renderStats();
  }

  document.getElementById("otherGames").innerHTML = SP.GAMES.filter((g) => g.key !== "mini")
    .map((g) => `<a class="btn btn-sm btn-ghost" href="${g.href}">${SP.icon(g.icon)} ${g.title}</a>`).join("");

  start();
})();

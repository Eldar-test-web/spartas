/* İntellektual Wordle — 4..8 hərfli Azərbaycan sözləri */
(() => {
  const MAX_TRIES = 6;
  const AZ = new Set(SP.ALPHABET);
  const KNOWN = new Set(Object.values(SP.WORDS).flat());

  const el = {
    tabs: document.getElementById("lenTabs"),
    board: document.getElementById("board"),
    kbd: document.getElementById("keyboard"),
    stats: document.getElementById("stats"),
    hint: document.getElementById("hint"),
    daily: document.getElementById("modeDaily"),
    free: document.getElementById("modeFree"),
    share: document.getElementById("shareBtn"),
    neu: document.getElementById("newBtn"),
    others: document.getElementById("otherGames")
  };

  let len = 5;
  let mode = "daily";
  let game;

  const storageKey = () => `${mode}-${len}`;

  function answer() {
    if (mode === "daily") return SP.pickDaily(SP.WORDS[len], "w" + len);
    const pool = SP.WORDS[len].filter((w) => !game || w !== game.answer);
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function load() {
    const st = SP.load();
    const saved = st.wordle[storageKey()];
    if (mode === "daily" && saved && saved.day === SP.dayKey()) { game = saved; return; }
    game = { day: SP.dayKey(), answer: answer(), guesses: [], solved: false, lost: false };
    if (mode === "daily") persist();
  }

  function persist() {
    const st = SP.load();
    st.wordle[storageKey()] = game;
    SP.save(st);
  }

  function score(guess, answer) {
    const res = Array(guess.length).fill("absent");
    const left = [];
    for (let i = 0; i < answer.length; i++) {
      if (guess[i] === answer[i]) res[i] = "correct";
      else left.push(answer[i]);
    }
    for (let i = 0; i < guess.length; i++) {
      if (res[i] === "correct") continue;
      const k = left.indexOf(guess[i]);
      if (k >= 0) { res[i] = "present"; left.splice(k, 1); }
    }
    return res;
  }

  function renderBoard(reveal = false) {
    el.board.style.setProperty("--wl", len);
    const rows = [];
    for (let r = 0; r < MAX_TRIES; r++) {
      const g = game.guesses[r];
      const cells = [];
      for (let c = 0; c < len; c++) {
        if (g) {
          const st = score(g, game.answer)[c];
          cells.push(`<div class="tile flip state-${st}" style="animation-delay:${c * 60}ms">${g[c]}</div>`);
        } else if (reveal && r === game.guesses.length) {
          cells.push(`<div class="tile flip state-correct" style="animation-delay:${c * 60}ms">${game.answer[c]}</div>`);
        } else {
          const typed = r === game.guesses.length ? (typing[c] || "") : "";
          cells.push(`<div class="tile ${typed ? "filled" : ""}">${typed}</div>`);
        }
      }
      rows.push(`<div class="line">${cells.join("")}</div>`);
    }
    el.board.innerHTML = rows.join("");
  }

  function renderKbd() {
    const used = {};
    game.guesses.forEach((g) => score(g, game.answer).forEach((s, i) => {
      const rank = { absent: 1, present: 2, correct: 3 };
      if (rank[s] > (used[g[i]] || 0)) used[g[i]] = rank[s];
    }));
    const rows = [
      ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
      ["A", "S", "D", "F", "G", "H", "J", "K", "L", "Ə"],
      ["Z", "X", "C", "V", "B", "N", "M", "Ş", "Ğ", "Ü", "Ö", "Ç", "İ"]
    ];
    el.kbd.innerHTML =
      rows.slice(0, 2).map((r) => `<div class="line">${r.map((k) => keyHtml(k, used)).join("")}</div>`).join("") +
      `<div class="line"><button class="key wide" data-k="ENTER">GÖNDƏR</button>` +
      rows[2].map((k) => keyHtml(k, used)).join("") +
      `<button class="key wide" data-k="BACK">SİL</button></div>`;
  }

  function keyHtml(k, used) {
    const cls = used[k] === 3 ? "k-correct" : used[k] === 2 ? "k-present" : used[k] === 1 ? "k-absent" : "";
    return `<button class="key ${cls}" data-k="${k}">${k}</button>`;
  }

  let typing = "";

  function renderStats() {
    const st = SP.load();
    const games = st.history.filter((h) => h.game === "wordle");
    const wins = games.filter((h) => h.score > 0);
    const rec = (st.stats.wordle || {})[storageKey()] || {};
    el.stats.innerHTML = [
      ["Oyun", games.length],
      ["Qazanma %", games.length ? Math.round((wins.length / games.length) * 100) : 0],
      ["Seriya", rec.streak || 0],
      ["Xal", st.points]
    ].map(([l, v]) => `<div class="stat"><b>${v}</b><span>${l}</span></div>`).join("");
  }

  function bumpStats(won, attempts) {
    const st = SP.load();
    const s = st.stats.wordle || (st.stats.wordle = {});
    const rec = s[storageKey()] || { streak: 0 };
    rec.streak = won ? (rec.streak || 0) + 1 : 0;
    rec.attempts = attempts;
    s[storageKey()] = rec;
    SP.save(st);
  }

  function submit() {
    if (game.solved || game.lost) return;
    const w = typing.toUpperCase();
    if (w.length !== len) return SP.toast(`Söz ${len} hərfdən ibarət olmalıdır`);
    if (![...w].every((c) => AZ.has(c))) return SP.toast("Yalnız Azərbaycan əlifbası hərfləri");
    if (!KNOWN.has(w)) return SP.toast("Belə söz lüğətdə yoxdur");
    game.guesses.push(w);
    typing = "";
    if (w === game.answer) {
      game.solved = true;
      const pts = (MAX_TRIES - game.guesses.length + 1) * 10;
      bumpStats(true, game.guesses.length);
      persist();
      renderAll(true);
      SP.addResult("wordle", pts, { len });
      SP.toast(`Düzgündür! +${pts} xal`, 2600);
      return;
    }
    if (game.guesses.length === MAX_TRIES) {
      game.lost = true;
      bumpStats(false, MAX_TRIES);
      persist();
      renderAll(true);
      SP.addResult("wordle", 0, { len });
      SP.toast(`Cavab: ${game.answer}`, 3200);
      return;
    }
    persist();
    renderAll();
  }

  function key(k) {
    if (game.solved || game.lost) return;
    if (k === "ENTER") return submit();
    if (k === "BACK") { typing = typing.slice(0, -1); return renderBoard(); }
    if (typing.length < len && AZ.has(k)) { typing += k; renderBoard(); }
  }

  function renderAll(reveal = false) {
    renderBoard(reveal);
    renderKbd();
    renderStats();
    el.hint.textContent = `${len} hərfli söz · ${MAX_TRIES - game.guesses.length} cəhd qalıb · ${mode === "daily" ? "bu günün sözü" : "sərbəst rejim"}`;
  }

  function setLen(l) {
    len = l;
    typing = "";
    load();
    el.tabs.querySelectorAll(".len-tab").forEach((b) => b.classList.toggle("is-active", +b.dataset.len === l));
    renderAll(game.solved || game.lost);
  }

  el.tabs.innerHTML = Object.keys(SP.WORDS).map((l) => `<button class="len-tab" type="button" role="tab" data-len="${l}">${l} hərf</button>`).join("");
  el.tabs.addEventListener("click", (e) => {
    const b = e.target.closest("[data-len]");
    if (b) setLen(+b.dataset.len);
  });
  el.kbd.addEventListener("click", (e) => {
    const b = e.target.closest("[data-k]");
    if (b) key(b.dataset.k);
  });
  document.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.key === "Enter") return key("ENTER");
    if (e.key === "Backspace") return key("BACK");
    const k = e.key.toLocaleUpperCase("az");
    if (AZ.has(k)) key(k);
  });
  el.daily.addEventListener("click", () => { mode = "daily"; el.daily.classList.add("is-active"); el.free.classList.remove("is-active"); setLen(len); });
  el.free.addEventListener("click", () => { mode = "free"; el.free.classList.add("is-active"); el.daily.classList.remove("is-active"); setLen(len); });
  el.neu.addEventListener("click", () => {
    mode = "free";
    el.free.classList.add("is-active");
    el.daily.classList.remove("is-active");
    typing = "";
    game = { day: SP.dayKey(), answer: answer(), guesses: [], solved: false, lost: false };
    renderAll();
  });
  el.share.addEventListener("click", async () => {
    const marks = game.guesses.map((g) =>
      score(g, game.answer).map((s) => (s === "correct" ? "🟩" : s === "present" ? "🟨" : "⬛")).join(""));
    const head = `SPARTANS Wordle · ${len} hərf · ${game.guesses.length}/${MAX_TRIES} ${game.solved ? "✅" : "❌"}`;
    const text = [head, "", ...marks].join("\n");
    try {
      await navigator.clipboard.writeText(text);
      SP.toast("Nəticə buferə köçürüldü");
    } catch {
      SP.toast("Buferə yazmaq alınmadı — mətni əl ilə seç");
    }
  });

  el.others.innerHTML = SP.GAMES.filter((g) => g.key !== "wordle")
    .map((g) => `<a class="btn btn-sm btn-ghost" href="${g.href}">${SP.icon(g.icon)} ${g.title}</a>`).join("");

  setLen(5);
})();

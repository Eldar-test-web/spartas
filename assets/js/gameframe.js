/* vendor/ oyunlarını iframe ilə səhifəyə mindirir və klub xal cədvəlinə bağlayır.
   Səhifədə yalnız <div class="game-frame-card" data-frame ...> qalır. */
(() => {
  const UPSTREAM_KEY = {
    wordle: "wordle", crossword: "krossvord", quiz: "viktorina",
    memory: "mini", "2048": "mini", tetris: "mini", tictactoe: "mini"
  };

  const CONTROLS = {
    len: { param: "len", def: "5", lab: "Söz uzunluğu", options: [4, 5, 6, 7, 8].map((n) => [String(n), `${n} hərf`]) },
    mode: { param: "mode", def: "daily", lab: "Rejim", options: [["daily", "Gündəlik"], ["free", "Sərbəst"]] },
    cat: {
      param: "cat", def: "Hamısı", lab: "Kateqoriya",
      options: () => [["Hamısı", "Hamısı"], ...(SP.CATEGORIES || []).map((c) => [c, c])]
    },
    n: { param: "n", def: "10", lab: "Sual sayı", options: [["5", "5 sual"], ["10", "10 sual"], ["15", "15 sual"]] }
  };

  function tabs(host, items, active, onPick, label) {
    const bar = document.createElement("div");
    bar.className = "len-tabs";
    bar.setAttribute("role", "tablist");
    bar.setAttribute("aria-label", label || "Oyun parametrləri");
    bar.innerHTML = items.map(([val, text]) =>
      `<button class="len-tab ${val === active ? "is-active" : ""}" type="button" role="tab" aria-selected="${val === active}" data-val="${SP.esc(val)}">${SP.esc(text)}</button>`).join("");
    bar.addEventListener("click", (e) => {
      const b = e.target.closest("[data-val]");
      if (!b) return;
      bar.querySelectorAll(".len-tab").forEach((x) => {
        x.classList.toggle("is-active", x === b);
        x.setAttribute("aria-selected", x === b);
      });
      onPick(b.dataset.val);
    });
    if (!label) return bar;
    const wrap = document.createElement("div");
    wrap.className = "ctl-group";
    wrap.innerHTML = `<span class="ctl-lab">${SP.esc(label)}</span>`;
    wrap.appendChild(bar);
    return wrap;
  }

  function metrics(clubKey) {
    const st = SP.load();
    const rows = st.history.filter((h) => h.game === clubKey);
    const sum = rows.reduce((a, h) => a + h.score, 0);
    const won = rows.filter((h) => h.won).length;
    let streak = 0;
    for (const h of rows) { if (h.won) streak++; else break; }
    return [
      ["Tur", rows.length],
      ["Xal", sum],
      ["Ən yaxşı", rows.reduce((a, h) => Math.max(a, h.score), 0)],
      ["Qazanma", rows.length ? `${Math.round((won / rows.length) * 100)}%` : "—"],
      ["Seriya", streak]
    ];
  }

  function paintStats(box, clubKey) {
    if (!box) return;
    const n = Math.min(5, Math.max(1, +(box.dataset.frameStats || 4)));
    box.innerHTML = metrics(clubKey).slice(0, n)
      .map(([l, v]) => `<div class="stat"><span>${l}</span><b>${SP.esc(v)}</b></div>`).join("");
  }

  function paintOthers(box, clubKey) {
    if (!box) return;
    box.innerHTML = SP.GAMES.filter((g) => g.key !== clubKey).map((g) =>
      `<a class="btn btn-sm btn-ghost" href="${g.href}">${SP.icon(g.icon)}${SP.esc(g.title)}</a>`).join("");
  }

  document.addEventListener("DOMContentLoaded", () => {
    const card = document.querySelector("[data-frame]");
    if (!card) return;

    const clubKey = card.dataset.game;
    const frame = document.createElement("iframe");
    frame.className = "game-frame";
    if (card.dataset.frameSize) frame.classList.add(`game-frame--${card.dataset.frameSize}`);
    frame.title = card.dataset.title || "Oyun";
    frame.setAttribute("loading", "lazy");

    const status = card.querySelector("[data-frame-status]");
    const slot = card.querySelector("[data-frame-slot]");
    slot.appendChild(frame);

    let params = {};
    let base = card.dataset.frameSrc;

    function load() {
      const qs = new URLSearchParams(
        Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== ""))).toString();
      frame.src = base + (qs ? `?${qs}` : "");
      if (status) status.textContent = "Oyun yüklənir…";
    }

    if (card.dataset.frameTabs) {
      const list = JSON.parse(card.dataset.frameTabs);
      base = list[0].src;
      card.querySelector("[data-frame-controls]").appendChild(
        tabs(card, list.map((t) => [t.src, t.label]), list[0].src, (v) => { base = v; load(); }, "Oyun"));
    } else {
      const ctlBox = card.querySelector("[data-frame-controls]");
      (card.dataset.frameControls || "").split(",").filter(Boolean).forEach((name) => {
        const c = CONTROLS[name];
        if (!c) return;
        const items = typeof c.options === "function" ? c.options() : c.options;
        params[c.param] = c.def;
        ctlBox.appendChild(tabs(card, items, c.def, (v) => { params[c.param] = v; load(); }, c.lab));
      });
    }

    frame.addEventListener("load", () => { if (status) status.textContent = "Oyun hazırdır"; });

    window.addEventListener("message", (e) => {
      const d = e.data;
      if (!d || d.type !== "spartans:result") return;
      if (UPSTREAM_KEY[d.game] !== clubKey) return;
      const pts = Math.max(0, Math.round(+d.points || 0));
      SP.addResult(clubKey, pts, {
        won: !!d.won, upstream: d.game,
        ...(d.attempts ? { attempts: d.attempts } : {}),
        ...(d.len ? { len: d.len } : {}),
        ...(d.minutes ? { minutes: d.minutes } : {}),
        ...(d.moves ? { moves: d.moves } : {}),
        ...(d.category ? { category: d.category } : {}),
        ...(d.count ? { count: d.count } : {}),
        ...(d.kind ? { kind: d.kind } : {}),
        ...(d.lines ? { lines: d.lines } : {})
      });
      paintStats(document.querySelector("[data-frame-stats]"), clubKey);
      if (status) status.textContent = d.won ? `Tur bitdi · +${pts} xal` : `Tur bitdi · ${pts} xal`;
      SP.toast(d.won ? `+${pts} xal — nəticə klub cədvəlinə yazıldı` : `Bu tur: ${pts} xal`);
    });

    const restart = card.querySelector("[data-frame-restart]");
    if (restart) restart.addEventListener("click", load);

    load();
    paintStats(document.querySelector("[data-frame-stats]"), clubKey);
    paintOthers(document.querySelector("[data-frame-others]"), clubKey);
  });
})();

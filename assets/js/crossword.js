/* Krossvord — şəbəkə, klaviatura naviqasiyası, avtomatik yaddaş */
(() => {
  const CW = SP.CROSSWORD;
  const { w, h } = CW;
  const isBlock = (r, c) => CW.grid[r][c] === ".";
  const idx = (r, c) => r * w + c;
  const cells = CW.clues.map((cl) => {
    const [dr, dc] = cl.dir === "across" ? [0, 1] : [1, 0];
    return Array.from({ length: cl.len }, (_, i) => idx(cl.r + dr * i, cl.c + dc * i));
  });

  const el = {
    grid: document.getElementById("grid"),
    across: document.getElementById("acrossList"),
    down: document.getElementById("downList"),
    time: document.getElementById("timeOut"),
    done: document.getElementById("doneOut"),
    active: document.getElementById("activeClue"),
    check: document.getElementById("checkBtn"),
    hint: document.getElementById("hintBtn"),
    clear: document.getElementById("clearBtn")
  };

  let st = SP.load();
  let letters = (st.crossword && st.crossword.letters) || Array(w * h).fill("");
  let seconds = (st.crossword && st.crossword.seconds) || 0;
  let hints = (st.crossword && st.crossword.hints) || 0;
  let finished = !!(st.crossword && st.crossword.finished);
  let sel = { r: CW.clues[0].r, c: CW.clues[0].c, dir: CW.clues[0].dir };

  el.grid.style.setProperty("--cw", w);
  const inputs = [];
  const frag = document.createDocumentFragment();
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      const d = document.createElement("div");
      d.className = "cc-cell" + (isBlock(r, c) ? " black" : "");
      d.dataset.r = r; d.dataset.c = c;
      if (!isBlock(r, c)) {
        const num = CW.clues.filter((cl) => cl.r === r && cl.c === c);
        if (num.length) {
          const s = document.createElement("span");
          s.className = "n";
          s.textContent = num[0].n;
          d.appendChild(s);
        }
        const inp = document.createElement("input");
        inp.maxLength = 1;
        inp.autocomplete = "off";
        inp.spellcheck = false;
        inp.setAttribute("aria-label", `hücrə ${r + 1}-${c + 1}`);
        inp.value = letters[idx(r, c)];
        d.appendChild(inp);
        inputs[idx(r, c)] = inp;
      }
      frag.appendChild(d);
    }
  }
  el.grid.appendChild(frag);

  const clueAt = (r, c, dir) => CW.clues.findIndex((cl) => cl.dir === dir &&
    (dir === "across" ? cl.r === r && c >= cl.c && c < cl.c + cl.len : cl.c === c && r >= cl.r && r < cl.r + cl.len));
  const currentClue = () => clueAt(sel.r, sel.c, sel.dir);

  function save() {
    const s = SP.load();
    s.crossword = { letters, seconds, hints, finished };
    SP.save(s);
  }

  function render() {
    const doneIdx = new Set();
    CW.clues.forEach((cl, i) => {
      if (cells[i].every((k, j) => letters[k] === cl.answer[j])) doneIdx.add(i);
    });
    const active = currentClue();
    const peers = active >= 0 ? new Set(cells[active]) : new Set();

    for (let r = 0; r < h; r++) for (let c = 0; c < w; c++) {
      if (isBlock(r, c)) continue;
      const k = idx(r, c), inp = inputs[k], cell = inp.parentElement;
      if (inp.value !== letters[k]) inp.value = letters[k];
      cell.classList.toggle("active", r === sel.r && c === sel.c);
      cell.classList.toggle("peer", peers.has(k) && !(r === sel.r && c === sel.c));
      inp.classList.toggle("solved", peers.has(k) && doneIdx.has(active));
    }

    const done = doneIdx.size;
    el.done.textContent = `${done}/${CW.clues.length}`;
    el.active.textContent = active >= 0 ? `${CW.clues[active].n} ${CW.clues[active].dir === "across" ? "Üfüqi" : "Şaquli"}: ${CW.clues[active].clue}` : "";

    [["across", el.across], ["down", el.down]].forEach(([dir, box]) => {
      box.innerHTML = CW.clues.map((cl, i) => cl.dir !== dir ? "" :
        `<div class="cc-clue ${active === i ? "is-active" : ""} ${doneIdx.has(i) ? "done" : ""}" data-i="${i}">
           <b>${cl.n}</b><span>${SP.esc(cl.clue)}</span><span class="len">${cl.len}</span>
         </div>`).join("");
    });
    document.getElementById("acrossCount").textContent = CW.clues.filter((c) => c.dir === "across").length + " sual";
    document.getElementById("downCount").textContent = CW.clues.filter((c) => c.dir === "down").length + " sual";

    if (done === CW.clues.length && !finished) {
      finished = true;
      const pts = Math.max(40, 100 - hints * 5 - Math.floor(seconds / 90));
      SP.addResult("cross", pts, { time: seconds });
      save();
      SP.toast(`Şəbəkə tamamlandı! +${pts} xal`, 3600);
    }
  }

  function move(dr, dc) {
    let r = sel.r + dr, c = sel.c + dc;
    while (r >= 0 && c >= 0 && r < h && c < w && isBlock(r, c)) { r += dr; c += dc; }
    if (r < 0 || c < 0 || r >= h || c >= w) return;
    sel.r = r; sel.c = c;
    focus();
  }

  function advance(step = 1) {
    const i = currentClue();
    if (i < 0) return focus();
    const cl = CW.clues[i];
    const [dr, dc] = cl.dir === "across" ? [0, 1] : [1, 0];
    let pos = cells[i].indexOf(idx(sel.r, sel.c));
    if (pos < 0) return focus();
    pos = Math.max(0, Math.min(cl.len - 1, pos + step));
    sel.r = cl.r + dr * pos;
    sel.c = cl.c + dc * pos;
    focus();
  }

  function focus() { inputs[idx(sel.r, sel.c)].focus(); render(); }

  el.grid.addEventListener("click", (e) => {
    const cell = e.target.closest(".cc-cell");
    if (!cell || cell.classList.contains("black")) return;
    const r = +cell.dataset.r, c = +cell.dataset.c;
    if (r === sel.r && c === sel.c && currentClue() < 0) return;
    if (r === sel.r && c === sel.c) sel.dir = sel.dir === "across" ? "down" : "across";
    else { sel.r = r; sel.c = c; if (clueAt(r, c, sel.dir) < 0) sel.dir = clueAt(r, c, "across") >= 0 ? "across" : "down"; }
    focus();
  });

  el.grid.addEventListener("input", (e) => {
    const inp = e.target.closest("input");
    if (!inp) return;
    const r = +inp.parentElement.dataset.r, c = +inp.parentElement.dataset.c;
    const v = inp.value.toUpperCase();
    if (!v) { letters[idx(r, c)] = ""; save(); render(); return; }
    sel.r = r; sel.c = c;
    letters[idx(r, c)] = v;
    save();
    advance();
  });

  el.grid.addEventListener("keydown", (e) => {
    const k = e.key;
    if (k === "ArrowRight") { e.preventDefault(); sel.dir = "across"; move(0, 1); }
    else if (k === "ArrowLeft") { e.preventDefault(); sel.dir = "across"; move(0, -1); }
    else if (k === "ArrowDown") { e.preventDefault(); sel.dir = "down"; move(1, 0); }
    else if (k === "ArrowUp") { e.preventDefault(); sel.dir = "down"; move(-1, 0); }
    else if (k === "Backspace") {
      const i = idx(sel.r, sel.c);
      if (letters[i]) { letters[i] = ""; save(); render(); }
      else advance(-1);
      e.preventDefault();
    } else if (k === "Tab") {
      e.preventDefault();
      const order = CW.clues.map((_, i) => i);
      const cur = currentClue();
      const next = order[(order.indexOf(cur) + 1 + order.length) % order.length];
      sel = { r: CW.clues[next].r, c: CW.clues[next].c, dir: CW.clues[next].dir };
      focus();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" && e.target.closest(".cc-grid")) return;
    const up = e.key.toUpperCase();
    if (/^[A-ZƏŞÇĞÜÖİQX]$/.test(up) || SP.ALPHABET.includes(up)) {
      const i = idx(sel.r, sel.c);
      letters[i] = up;
      save();
      advance();
    }
  });

  el.across.addEventListener("click", (e) => pickClue(e));
  el.down.addEventListener("click", (e) => pickClue(e));
  function pickClue(e) {
    const b = e.target.closest("[data-i]");
    if (!b) return;
    const cl = CW.clues[+b.dataset.i];
    sel = { r: cl.r, c: cl.c, dir: cl.dir };
    focus();
  }

  el.check.addEventListener("click", () => {
    let wrong = 0;
    CW.clues.forEach((cl, i) => cells[i].forEach((k, j) => {
      if (letters[k] && letters[k] !== cl.answer[j]) { wrong++; flash(k); }
    }));
    SP.toast(wrong ? `${wrong} hücrədə səhv var` : "Hazırkı hərflərin hamısı doğrudur");
  });

  function flash(k) {
    const inp = inputs[k];
    inp.style.borderColor = "var(--bad)";
    inp.style.color = "var(--bad)";
    setTimeout(() => { inp.style.borderColor = ""; inp.style.color = ""; }, 1200);
  }

  el.hint.addEventListener("click", () => {
    const i = currentClue();
    if (i < 0) return;
    const j = cells[i].findIndex((k, p) => letters[k] !== CW.clues[i].answer[p]);
    if (j < 0) return SP.toast("Bu söz artıq düzgündür");
    const k = cells[i][j];
    letters[k] = CW.clues[i].answer[j];
    hints++;
    save();
    render();
    SP.toast(`Hərf açıldı · ${hints} dəfə istifadə (−${hints * 5} xal)`);
  });

  el.clear.addEventListener("click", () => {
    letters = Array(w * h).fill("");
    seconds = 0; hints = 0; finished = false;
    inputs.forEach((inp) => { if (inp) inp.value = ""; });
    save();
    render();
    SP.toast("Şəbəkə təmizləndi");
  });

  setInterval(() => {
    if (finished) return;
    seconds++;
    const m = Math.floor(seconds / 60), s = seconds % 60;
    el.time.textContent = `${m}:${String(s).padStart(2, "0")}`;
    if (seconds % 15 === 0) save();
  }, 1000);

  const m0 = Math.floor(seconds / 60), s0 = seconds % 60;
  el.time.textContent = `${m0}:${String(s0).padStart(2, "0")}`;
  render();
})();

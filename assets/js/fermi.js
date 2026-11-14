/* Fermi Tahmini — tərtib seçmə oyunu */
(() => {
  const N = 8;
  const el = {
    counter: document.getElementById("qCounter"),
    score: document.getElementById("qScore"),
    text: document.getElementById("qText"),
    unit: document.getElementById("qUnit"),
    options: document.getElementById("qOptions"),
    explain: document.getElementById("qExplain"),
    next: document.getElementById("qNext"),
    restart: document.getElementById("qRestart"),
    stats: document.getElementById("fStats"),
    others: document.getElementById("otherGames")
  };

  let qs, i, correct, answered;

  function start() {
    const start = SP.dayIndex("fermi");
    qs = Array.from({ length: N }, (_, k) => SP.FERMI[(start + k) % SP.FERMI.length]);
    i = 0; correct = 0; answered = false;
    draw();
  }

  function draw() {
    const q = qs[i];
    answered = false;
    el.counter.textContent = `${i + 1} / ${N}`;
    el.score.textContent = `${correct * 10} xal`;
    el.text.textContent = q.q;
    el.unit.textContent = `Vahid: ${q.unit}`;
    el.explain.style.display = "none";
    el.next.style.display = "none";
    el.options.innerHTML = q.o.map((v, k) =>
      `<button class="opt" data-k="${k}" type="button"><span class="k">${"ABCD"[k]}</span>${SP.fmtBig(v)}</button>`).join("");
    stats();
  }

  function stats() {
    el.stats.innerHTML = [
      ["Doğru", `${correct}/${N}`],
      ["Xal", correct * 10]
    ].map(([l, v]) => `<div class="stat"><b>${v}</b><span>${l}</span></div>`).join("");
  }

  el.options.addEventListener("click", (e) => {
    const b = e.target.closest("[data-k]");
    if (!b || answered) return;
    answered = true;
    const q = qs[i];
    const k = +b.dataset.k;
    const ok = k === q.a;
    if (ok) correct++;
    [...el.options.children].forEach((c, j) => {
      c.disabled = true;
      if (j === q.a) c.classList.add("right");
      else if (j === k) c.classList.add("wrong");
    });
    el.explain.style.display = "";
    el.explain.innerHTML = `<b style="color:${ok ? "var(--mint)" : "var(--bad)"}">${ok ? "Düzgün tərtib" : "Səhv tərtib"}</b> ·
      Düzgün cavab: <b>${SP.fmtBig(q.o[q.a])}</b> ${SP.esc(q.unit)}<br>${SP.esc(q.x)}`;
    el.next.style.display = "";
    el.next.textContent = i === N - 1 ? "Yekun nəticə →" : "Növbəti sual →";
    stats();
  });

  el.next.addEventListener("click", () => {
    if (i < N - 1) { i++; draw(); return; }
    const pts = correct * 10;
    SP.addResult("fermi", pts, { correct });
    el.text.textContent = `Yekun: ${correct} / ${N} doğru`;
    el.unit.textContent = `Komanda cədvəlinə +${pts} xal əlavə olundu.`;
    el.options.innerHTML = `<div class="row" style="gap:12px">
      <button class="btn btn-mint" id="fAgain" type="button">Yeni tur</button>
      <a class="btn btn-ghost" href="liderler.html">Liderlər →</a></div>`;
    el.explain.style.display = "none";
    el.next.style.display = "none";
    el.score.textContent = `${pts} xal`;
    document.getElementById("fAgain").addEventListener("click", start);
    stats();
  });

  el.restart.addEventListener("click", start);
  el.others.innerHTML = SP.GAMES.filter((g) => g.key !== "fermi")
    .map((g) => `<a class="btn btn-sm btn-ghost" href="${g.href}">${SP.icon(g.icon)} ${g.title}</a>`).join("");

  start();
})();

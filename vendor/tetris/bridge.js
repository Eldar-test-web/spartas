/* SPARTANS körpüsü — canvas-tetris
   Upstream-də xal sayğacı YOXDUR (sadəcə texniki demo). Klub cədvəli üçün:
     1. js/tetris.js-dəki clearLines() içinə bir sətir əlavə edildi — silinən hər
        sətir `window.SP_LINES`-də sayılır.
     2. `lose` qlobal bayrağı izlənir; oyun bitəndə nəticə postMessage ilə göndərilir.
   Hərəkət/fırlanma/render məntiqi dəyişdirilməyib. */
(function () {
  let started = Date.now();
  let reported = false;

  const hud = document.createElement("div");
  hud.id = "spartans-hud";
  hud.innerHTML = `<span id="sp-lines">0 sıra</span><span id="sp-score">0 xal</span>`;
  document.body.appendChild(hud);

  const linesOf = () => window.SP_LINES || 0;
  const paint = () => {
    document.getElementById("sp-lines").textContent = `${linesOf()} sıra`;
    document.getElementById("sp-score").textContent = `${linesOf() * 10} xal`;
  };

  function report() {
    if (reported) return;
    reported = true;
    const lines = linesOf();
    const score = lines * 10;
    const seconds = Math.round((Date.now() - started) / 1000);
    try {
      window.parent.postMessage({
        type: "spartans:result", game: "tetris", won: lines > 0,
        points: score, lines, seconds
      }, "*");
    } catch (_) { /* birbaşa açılanda səssiz */ }
    const over = document.createElement("div");
    over.id = "sp-over";
    over.innerHTML = `<b>Oyun bitdi</b><span>${lines} sıra · ${score} xal</span>
      <button onclick="location.reload()">Yenidən başla</button>`;
    document.body.appendChild(over);
  }

  setInterval(() => { paint(); if (window.lose) report(); }, 400);
  paint();
})();


/* Ana səhifə */
document.addEventListener("DOMContentLoaded", () => {
  const st = SP.load();

  document.getElementById("gameGrid").innerHTML = SP.GAMES.map((g, i) => `
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

  const latest = [
    { t: "Söz Təxmini", s: "5 hərfli söz. Təxmin et: _ _ _ _ _", h: "wordle.html", i: "wordle", tag: "Gündəlik" },
    { t: "Krossvord", s: "26 sual, 17×17 şəbəkə — bu gün şəbəkəni tamamla.", h: "krossvord.html", i: "cross", tag: "Yeni" },
    { t: "Ölçü Tahmini", s: `${SP.pickDaily(SP.SIZES, "sz").name} neçə metr hündürlükdədir?`, h: "olcu-tahmini.html", i: "ruler", tag: "Yeni" },
    { t: "Fermi Tahmini", s: SP.pickDaily(SP.FERMI, "fe").q, h: "fermi-tahmini.html", i: "calc", tag: "" },
    { t: "Klassik Sual", s: SP.pickDaily(SP.QUESTIONS, "kl").q, h: "viktorina.html", i: "scroll", tag: "" }
  ];
  document.getElementById("latestQuestions").innerHTML = latest.map((q) => `
    <a class="q-card" href="${q.h}">
      <span class="q-thumb">${SP.icon(q.i)}</span>
      <div class="q-body">
        <h3>${SP.esc(q.t)}${q.tag ? ` <span class="tag-new">${q.tag}</span>` : ""}</h3>
        <p>${SP.esc(q.s)}</p>
      </div>
      <span class="game-go">Cavab ver ${SP.icon("arrow")}</span>
    </a>`).join("");

  document.getElementById("leaderboard").innerHTML = SP.leaderboard().slice(0, 5).map((t, i) => `
    <div class="rank-row">
      <span class="rank-num">${i + 1}</span>
      ${SP.rankEmblem(t.name)}
      <span class="rank-name">${SP.esc(t.name)}${t.you ? ' <span class="chip">sən</span>' : ""}</span>
      <span class="rank-score">${t.score}</span>
    </div>`).join("");

  const task = SP.pickDaily(SP.RIDDLES, "task");
  document.getElementById("dailyTask").textContent = `“${task.q}”`;
});

/* SPARTANS körpüsü — 2048
   Upstream oyunun daxili API-si yoxdur, ona görə nəticəni DOM-dan izləyirik:
   .game-message elementi "game-over" və ya "game-won" sinfi alanda xal göndərilir. */
(function () {
  const message = document.querySelector(".game-message");
  const scoreBox = document.querySelector(".score-container");
  if (!message || !scoreBox) return;

  let reported = false;

  function currentScore() {
    return parseInt(scoreBox.textContent, 10) || 0;
  }

  function post(kind) {
    const score = currentScore();
    /* Klub xalı: 2048-in xalı böyükdür, cədvələ 1/10 hissəsi yazılır. */
    const points = Math.max(kind === "game-won" ? 60 : 0, Math.round(score / 10));
    try {
      window.parent.postMessage({
        type: "spartans:result", game: "2048", kind, score, points, won: kind === "game-won",
        reported
      }, "*");
    } catch (_) { /* birbaşa açılanda səssiz */ }
    reported = true;
  }

  new MutationObserver(() => {
    if (message.classList.contains("game-over")) post("game-over");
    else if (message.classList.contains("game-won")) post("game-won");
    if (!message.classList.contains("game-over") && !message.classList.contains("game-won")) reported = false;
  }).observe(message, { attributes: true, attributeFilter: ["class"] });

  document.querySelector(".restart-button")?.addEventListener("click", () => { reported = false; });
})();

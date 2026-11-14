/**
 * SPARTANS — viktorina nəticə səhifəsi
 * upstream: jamesqquick (MIT) end.js. Düzəlişlər:
 *  1. `highScores.sort((a,b) => b.score - a.score)` səhv idi — score sətr (string)
 *     olaraq saxlanılırdı və "100" < "20" sıralanırdı. İndi ədədə çevrilir.
 *  2. `highScores.splice(5)` sabit əvəzinə MAX_HIGH_SCORES istifadə edir.
 *  3. `window.location.assign('/')` mütləq yolu layiq qovluğunda 404 verirdi → nisbi yol.
 *  4. Nəticə ana səhifəyə postMessage ilə göndərilir.
 */

const username = document.getElementById("username");
const saveScoreBtn = document.getElementById("saveScoreBtn");
const finalScore = document.getElementById("finalScore");
const mostRecentScore = Number(localStorage.getItem("mostRecentScore")) || 0;

const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
const MAX_HIGH_SCORES = 5;

finalScore.innerText = `${mostRecentScore} xal`;

username.addEventListener("keyup", () => {
  saveScoreBtn.disabled = !username.value;
});

saveHighScore = (e) => {
  e.preventDefault();

  highScores.push({ score: mostRecentScore, name: username.value });
  highScores.sort((a, b) => Number(b.score) - Number(a.score));
  highScores.splice(MAX_HIGH_SCORES);

  localStorage.setItem("highScores", JSON.stringify(highScores));

  try {
    window.parent.postMessage(
      { type: "spartans:result", game: "quiz", won: mostRecentScore > 0, points: mostRecentScore },
      "*"
    );
  } catch (_) { /* birbaşa açılanda səssiz */ }

  window.location.assign("index.html");
};

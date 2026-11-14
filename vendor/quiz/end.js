/**
 * SPARTANS — viktorina nəticə səhifəsi
 * upstream: jamesqquick (MIT) end.js. Dəyişikliklər:
 *  1. `window.location.assign('/')` mütləq yolu layiq qovluğunda 404 verirdi → nisbi yol.
 *  2. Nəticə ana səhifəyə postMessage ilə göndərilir (klub xal cədvəli üçün).
 *  3. "Ad yaz — rekord saxla" forması silindi: saytın öz liderlər cədvəli var
 *     (liderler.html), iframe içində ikinci bir saxlama qatı lazımsız idi.
 *  4. Eyni xal iki dəfə yazılmasın deyə nəticə artıq game.js tərəfindən göndərilir.
 */

const mostRecentScore = Number(localStorage.getItem("mostRecentScore")) || 0;

document.getElementById("finalScore").textContent = `${mostRecentScore} xal`;
document.getElementById("endNote").textContent =
  mostRecentScore > 0 ? "Nəticə klub cədvəlinə yazıldı." : "Bu tura xal yazılmadı.";

/* "?cat=…&n=…" parametrini saxlayaraq yenidən başlat */
document.getElementById("againBtn").href = "game.html" + location.search;

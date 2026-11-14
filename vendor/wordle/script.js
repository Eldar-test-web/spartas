/**
 * SPARTANS Wordle — uyğunlaşdırılmış versiya
 *
 * Əsas (upstream): WebDevSimplified/wordle-clone (MIT) — https://github.com/WebDevSimplified/wordle-clone
 * Dəyişikliklər (bu faylda):
 *  1. İngilis söz siyahıları (15.000 sətir) silindi; Azərbaycan sözləri words.js-dən gəlir.
 *  2. Sözün uzunluğu ?len=4..8 parametri ilə dəyişdirilir (şəbəkə dinamik qurulur).
 *  3. ?mode=free — gündəlik söz əvəzinə təsadüfi söz.
 *  4. Klaviatura məhdudiyyəti Azərbaycan əlifbasına genişləndirildi (ə, ı, ğ, ş, ç, ö, ü, İ).
 *  5. İnzar mesajları Azərbaycan dilinə çevrildi.
 *  6. Nəticə valideh səhifəyə postMessage ilə göndərilir (klub xal cədvəli üçün).
 * Yuxarıdakılar dışında axın (pressKey / submitGuess / flipTile / checkWinLose) upstream ilə eynidir.
 */

const AZ_LETTERS = ["a", "b", "c", "ç", "d", "e", "ə", "f", "g", "ğ", "h", "x", "ı", "i",
  "j", "k", "q", "l", "m", "n", "o", "ö", "p", "r", "s", "ş", "t", "u", "ü", "v", "y", "z"];
const AZ_KEY_RE = new RegExp(`^[${AZ_LETTERS.join("")}]$`);

const params = new URLSearchParams(location.search);
const WORD_LENGTH = Math.min(8, Math.max(4, parseInt(params.get("len") || "5", 10)));
const MODE = params.get("mode") === "free" ? "free" : "daily";

const ALL_WORDS = Object.values(window.SP_WORDS).flat();
const WORDS_BY_LEN = window.SP_WORDS[WORD_LENGTH] || [];

const FLIP_ANIMATION_DURATION = 500;
const DANCE_ANIMATION_DURATION = 500;
const MAX_ROWS = 6;

const keyboard = document.querySelector("[data-keyboard]");
const alertContainer = document.querySelector("[data-alert-container]");
const guessGrid = document.querySelector("[data-guess-grid]");

const offsetFromDate = new Date(2022, 0, 1);
const dayOffset = (Date.now() - offsetFromDate) / 1000 / 60 / 60 / 24;
const targetWord = MODE === "daily"
  ? WORDS_BY_LEN[Math.floor(dayOffset) % WORDS_BY_LEN.length]
  : WORDS_BY_LEN[Math.floor(Math.random() * WORDS_BY_LEN.length)];

buildGrid();
startInteraction();

function buildGrid() {
  guessGrid.style.setProperty("--word-length", WORD_LENGTH);
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < MAX_ROWS * WORD_LENGTH; i++) {
    const tile = document.createElement("div");
    tile.classList.add("tile");
    fragment.appendChild(tile);
  }
  guessGrid.appendChild(fragment);
  document.querySelector("[data-title]").textContent = `${WORD_LENGTH} hərfli söz · ${MODE === "daily" ? "gündəlik" : "sərbəst"}`;
}

function startInteraction() {
  document.addEventListener("click", handleMouseClick);
  document.addEventListener("keydown", handleKeyPress);
}

function stopInteraction() {
  document.removeEventListener("click", handleMouseClick);
  document.removeEventListener("keydown", handleKeyPress);
}

function handleMouseClick(e) {
  if (e.target.matches("[data-key]")) {
    pressKey(e.target.dataset.key);
    return;
  }
  if (e.target.matches("[data-enter]")) {
    submitGuess();
    return;
  }
  if (e.target.matches("[data-delete]")) {
    deleteKey();
    return;
  }
}

function handleKeyPress(e) {
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.key === "Enter") {
    submitGuess();
    return;
  }
  if (e.key === "Backspace" || e.key === "Delete") {
    deleteKey();
    return;
  }
  const key = e.key.toLocaleLowerCase("az");
  if (AZ_KEY_RE.test(key)) {
    pressKey(key);
    return;
  }
}

function pressKey(key) {
  const activeTiles = getActiveTiles();
  if (activeTiles.length >= WORD_LENGTH) return;
  const nextTile = guessGrid.querySelector(":not([data-letter])");
  if (!nextTile) return;
  nextTile.dataset.letter = key;
  nextTile.textContent = key;
  nextTile.dataset.state = "active";
}

function deleteKey() {
  const activeTiles = getActiveTiles();
  const lastTile = activeTiles[activeTiles.length - 1];
  if (lastTile == null) return;
  lastTile.textContent = "";
  delete lastTile.dataset.state;
  delete lastTile.dataset.letter;
}

function submitGuess() {
  const activeTiles = [...getActiveTiles()];
  if (activeTiles.length !== WORD_LENGTH) {
    showAlert("Söz tam deyil");
    shakeTiles(activeTiles);
    return;
  }

  const guess = activeTiles.reduce((word, tile) => word + tile.dataset.letter, "");

  if (!ALL_WORDS.includes(guess)) {
    showAlert("Belə söz lüğətdə yoxdur");
    shakeTiles(activeTiles);
    return;
  }

  stopInteraction();
  activeTiles.forEach((...args) => flipTile(...args, guess));
}

function flipTile(tile, index, array, guess) {
  const letter = tile.dataset.letter;
  const key = keyboard.querySelector(`[data-key="${letter}"i]`);
  setTimeout(() => {
    tile.classList.add("flip");
  }, (index * FLIP_ANIMATION_DURATION) / 2);

  tile.addEventListener("transitionend", () => {
    tile.classList.remove("flip");
    if (targetWord[index] === letter) {
      tile.dataset.state = "correct";
      key?.classList.add("correct");
    } else if (targetWord.includes(letter)) {
      tile.dataset.state = "wrong-location";
      key?.classList.add("wrong-location");
    } else {
      tile.dataset.state = "wrong";
      key?.classList.add("wrong");
    }

    if (index === array.length - 1) {
      tile.addEventListener("transitionend", () => {
        startInteraction();
        checkWinLose(guess, array);
      }, { once: true });
    }
  }, { once: true });
}

function getActiveTiles() {
  return guessGrid.querySelectorAll('[data-state="active"]');
}

function showAlert(message, duration = 1000) {
  const alert = document.createElement("div");
  alert.textContent = message;
  alert.classList.add("alert");
  alertContainer.prepend(alert);
  if (duration == null) return;

  setTimeout(() => {
    alert.classList.add("hide");
    alert.addEventListener("transitionend", () => alert.remove());
  }, duration);
}

function shakeTiles(tiles) {
  tiles.forEach((tile) => {
    tile.classList.add("shake");
    tile.addEventListener("animationend", () => tile.classList.remove("shake"), { once: true });
  });
}

function checkWinLose(guess, tiles) {
  if (guess === targetWord) {
    const row = Math.ceil([...guessGrid.querySelectorAll("[data-letter]")].length / WORD_LENGTH);
    const points = (MAX_ROWS - row + 1) * 10;
    showAlert("Qazandın!", 5000);
    danceTiles(tiles);
    stopInteraction();
    report(true, points, row);
    return;
  }

  const remainingTiles = guessGrid.querySelectorAll(":not([data-letter])");
  if (remainingTiles.length === 0) {
    showAlert(targetWord.toLocaleUpperCase("az"), null);
    stopInteraction();
    report(false, 0, MAX_ROWS);
  }
}

function danceTiles(tiles) {
  tiles.forEach((tile, index) => {
    setTimeout(() => {
      tile.classList.add("dance");
      tile.addEventListener("animationend", () => tile.classList.remove("dance"), { once: true });
    }, (index * DANCE_ANIMATION_DURATION) / 5);
  });
}

/* Nəticəni ana səhifəyə ötürür (iframe içindən) */
function report(won, points, attempts) {
  const payload = { type: "spartans:result", game: "wordle", won, points, attempts, len: WORD_LENGTH, mode: MODE };
  try { window.parent.postMessage(payload, "*"); } catch (_) { /* birbaşa açılsa səssiz keçir */ }
  document.title = won ? `Wordle +${points}` : "Wordle bitdi";
}

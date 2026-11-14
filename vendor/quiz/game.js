/**
 * SPARTANS viktorinası — uyğunlaşdırılmış versiya
 *
 * Əsas (upstream): jamesqquick/Build-A-Quiz-App-With-HTML-CSS-and-JavaScript (MIT)
 * "Quiz App Master" qovluğu. Dəyişikliklər:
 *  1. Open Trivia DB (ingilis) sorğusu silindi — suallar lokal questions.json-dan gəlir
 *     (Azərbaycan dilində + izah + kateqoriya + çətinlik).
 *  2. YOL XƏTASI ARADAN QALDIRILDI: upstream '/game.html', '/end.html', '/' kimi mütləq
 *     yollardan istifadə edirdi — layiq səhifə (project site) qovluğunda 404 verirdi.
 *     İndi bütün keçidlər nisbidir.
 *  3. MAX_QUESTIONS sabit 3 idi, 10 sual yüklənirdi — ?n= parametri ilə idarə olunur.
 *  4. ?cat= ilə kateqoriya filtri.
 *  5. Cavabdan sonra izah göstərilir (upstream-də yox idi).
 *  6. Nəticə postMessage ilə ana səhifəyə göndərilir.
 */

const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const progressText = document.getElementById("progressText");
const scoreText = document.getElementById("score");
const progressBarFull = document.getElementById("progressBarFull");
const loader = document.getElementById("loader");
const game = document.getElementById("game");
const explainBox = document.getElementById("explain");

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];

const CORRECT_BONUS = 10;
const params = new URLSearchParams(location.search);
const MAX_QUESTIONS = Math.min(20, Math.max(3, parseInt(params.get("n") || "10", 10)));
const CATEGORY = params.get("cat") || "Hamısı";

/* upstream-də `window.location.assign('/end.html')` idi — nisbi yola dəyişildi */
const go = (page) => window.location.assign(page);

loadQuestions = async () => {
  try {
    const res = await fetch("questions.json", { cache: "no-store" });
    const all = await res.json();
    return CATEGORY === "Hamısı" ? all : all.filter((q) => q.category === CATEGORY);
  } catch (err) {
    console.error(err);
    return [];
  }
};

startGame = async () => {
  const pool = await loadQuestions();
  if (!pool.length) {
    loader.classList.add("hidden");
    game.classList.remove("hidden");
    question.textContent = "Bu kateqoriyada sual tapılmadı.";
    choices.forEach((c) => (c.parentElement.style.display = "none"));
    return;
  }
  questionCounter = 0;
  score = 0;
  availableQuestions = [...pool];
  getNewQuestion();
  game.classList.remove("hidden");
  loader.classList.add("hidden");
};

getNewQuestion = () => {
  if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    localStorage.setItem("mostRecentScore", score);
    report();
    return go("end.html");
  }

  questionCounter++;
  progressText.innerText = `Sual ${questionCounter}/${Math.min(MAX_QUESTIONS, availableQuestions.length + 1)}`;
  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.innerHTML = currentQuestion.question;
  if (explainBox) {
    explainBox.style.display = "none";
    explainBox.textContent = "";
  }

  choices.forEach((choice) => {
    const number = choice.dataset["number"];
    choice.innerHTML = currentQuestion["choice" + number];
    choice.parentElement.classList.remove("correct", "incorrect");
    choice.parentElement.style.display = "";
  });

  availableQuestions.splice(questionIndex, 1);
  acceptingAnswers = true;
};

choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];
    const classToApply =
      selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

    if (classToApply === "correct") incrementScore(CORRECT_BONUS);

    selectedChoice.parentElement.classList.add(classToApply);

    if (explainBox) {
      explainBox.textContent = currentQuestion.explanation || "";
      explainBox.style.display = currentQuestion.explanation ? "" : "none";
    }

    setTimeout(() => {
      getNewQuestion();
    }, currentQuestion.explanation ? 2200 : 1000);
  });
});

incrementScore = (num) => {
  score += num;
  scoreText.innerText = score;
};

function report() {
  try {
    window.parent.postMessage(
      { type: "spartans:result", game: "quiz", won: score > 0, points: score, category: CATEGORY, count: questionCounter },
      "*"
    );
  } catch (_) { /* birbaşa açılanda səssiz */ }
}

startGame();

/**
 * assets/js/data.js (SP.QUESTIONS) → vendor/quiz/questions.json
 * Upstream format: { question, choice1..4, answer } — answer is 1-based.
 * SPARTANS əlavəsi: category, difficulty, explanation sahələri.
 * Run: node tools/gen-quiz-questions.js
 */
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const src = fs.readFileSync(path.join(root, "assets", "js", "data.js"), "utf8");
const ctx = { console };
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(src, ctx);

const questions = ctx.SP.QUESTIONS.map((q) => ({
  question: q.q,
  choice1: q.o[0],
  choice2: q.o[1],
  choice3: q.o[2],
  choice4: q.o[3],
  answer: q.a + 1,
  category: q.c,
  difficulty: q.d,
  explanation: q.x
}));

const out = path.join(root, "vendor", "quiz", "questions.json");
fs.writeFileSync(out, JSON.stringify(questions, null, 2) + "\n");
console.log(`${out} — ${questions.length} sual, kateqoriyalar: ${[...new Set(questions.map((q) => q.category))].join(", ")}`);

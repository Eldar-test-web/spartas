/**
 * tools/crossword.json (gen-crossword.js) → vendor/crosswords/puzzle.json (crosswords-js format)
 * Run: node tools/gen-crossword-puzzle.js
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const src = JSON.parse(fs.readFileSync(path.join(root, "tools", "crossword.json"), "utf8"));

const azUpper = (s) => Array.from(s, (ch) => (ch === "i" ? "İ" : ch.toUpperCase())).join("");

const toClue = (c) => ({
  x: c.c + 1,
  y: c.r + 1,
  clue: `${c.n}. ${c.clue} (${c.len})`,
  solution: azUpper(c.answer)
});

const puzzle = {
  document: {
    title: "SPARTANS krossvord",
    date: new Date().toISOString().slice(0, 10),
    notes: `Azərbaycan dilində avtomatik qurulmuş şəbəkə — ${src.clues.length} sual, ${src.w}×${src.h}.`
  },
  source: { title: "SPARTANS", url: "https://github.com/Eldar-test-web/spartas" },
  setter: { title: "SPARTANS klubu", url: "https://github.com/Eldar-test-web/spartas" },
  width: src.w,
  height: src.h,
  acrossClues: src.clues.filter((c) => c.dir === "across").map(toClue).sort((a, b) => a.clue.localeCompare(b.clue, "az")),
  downClues: src.clues.filter((c) => c.dir === "down").map(toClue).sort((a, b) => a.clue.localeCompare(b.clue, "az"))
};

const out = path.join(root, "vendor", "crosswords", "puzzle.js");
fs.writeFileSync(out, `/* SPARTANS krossvord şəbəkəsi — tools/gen-crossword-puzzle.js ilə yaradılıb.
   Format: crosswords-js CrosswordSource (MIT, dwmkerr/crosswords-js). */\nwindow.SP_PUZZLE = ${JSON.stringify(puzzle, null, 2)};\n`);
console.log(`${out} — ${puzzle.acrossClues.length} üfüqi + ${puzzle.downClues.length} şaquli sual, ${puzzle.width}×${puzzle.height}`);
console.log("nümunə:", JSON.stringify(puzzle.acrossClues[0]));

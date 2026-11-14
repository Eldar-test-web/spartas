/**
 * tools/crossword.json (gen-crossword.js) → vendor/crosswords/puzzle.json (crosswords-js format)
 * Run: node tools/gen-crossword-puzzle.js
 */
const fs = require("fs");
const path = require("path");

const root = path.join(__dirname, "..");
const src = JSON.parse(fs.readFileSync(path.join(root, "tools", "crossword.json"), "utf8"));

const azUpper = (s) => Array.from(s, (ch) => (ch === "i" ? "İ" : ch.toUpperCase())).join("");

// crosswords-js parses a clue as  <number>. <text> (<lengths>)  — text must stay free of
// parentheses and stray dots, otherwise the label/length split goes wrong.
const cleanText = (s) => s.replace(/[()]/g, ",").replace(/\.(?!\s)/g, "").replace(/\s+/g, " ").trim();

const toClue = (c) => ({
  x: c.c + 1,
  y: c.r + 1,
  clue: `${c.n}. ${cleanText(c.clue)} (${c.len})`,
  solution: azUpper(c.answer),
  _n: c.n,
  _pos: (c.r + 1) * 1000 + (c.c + 1)
});

const cmp = (a, b) => a._n - b._n || a._pos - b._pos;
const strip = ({ _n, _pos, ...c }) => c;

const clues = (dir) => src.clues.filter((c) => c.dir === dir).map(toClue).sort(cmp).map(strip);

const puzzle = {
  document: {
    mimetype: "application/vnd.js-crossword",
    version: "1.0",
    title: "SPARTANS krossvord",
    date: new Date().toISOString().slice(0, 10),
    description: `Azərbaycan dilində avtomatik qurulmuş şəbəkə — ${src.clues.length} sual, ${src.w}×${src.h}.`,
    author: { name: "SPARTANS klubu", url: "https://github.com/Eldar-test-web/spartas" },
    publisher: { name: "SPARTANS", url: "https://github.com/Eldar-test-web/spartas" }
  },
  width: src.w,
  height: src.h,
  acrossClues: clues("across"),
  downClues: clues("down")
};

for (const list of [puzzle.acrossClues, puzzle.downClues]) {
  for (const c of list) {
    const len = +/\((\d+)\)$/.exec(c.clue)[1];
    if (c.solution.length !== len) throw new Error(`"${c.solution}" (${c.solution.length}) uyğun deyil: ${c.clue}`);
  }
}

const out = path.join(root, "vendor", "crosswords", "puzzle.js");
fs.writeFileSync(out, `/* SPARTANS krossvord şəbəkəsi — tools/gen-crossword-puzzle.js ilə yaradılıb.
   Format: crosswords-js CrosswordSource (MIT, dwmkerr/crosswords-js). */\nwindow.SP_PUZZLE = ${JSON.stringify(puzzle, null, 2)};\n`);
console.log(`${out} — ${puzzle.acrossClues.length} üfüqi + ${puzzle.downClues.length} şaquli sual, ${puzzle.width}×${puzzle.height}`);
console.log("nümunə:", JSON.stringify(puzzle.acrossClues[0]));

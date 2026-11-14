// Generates vendor/wordle/words.js from assets/js/data.js so the two stay in sync.
// Run: node tools/gen-wordle-words.js
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const src = fs.readFileSync(path.join(root, "assets", "js", "data.js"), "utf8");
const ctx = { console };
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(src, ctx);

const byLen = {};
for (const [len, list] of Object.entries(ctx.SP.WORDS)) byLen[len] = list.map((w) => w.toLowerCase());

const out = `/* Azərbaycan dilinin söz bazası — tools/gen-wordle-words.js ilə avtomatik yaradılıb.
   Mənbə: assets/js/data.js (SP.WORDS). Aşağı registrdə saxlanılır, çünki
   vendor/wordle/script.js təxminləri kiçik hərflərlə müqayisə edir. */
window.SP_WORDS = ${JSON.stringify(byLen, null, 0)};
`;
const target = path.join(root, "vendor", "wordle", "words.js");
fs.writeFileSync(target, out);
console.log(`${target} yazıldı — uzunluqlar: ${Object.entries(byLen).map(([l, w]) => `${l}:${w.length}`).join(", ")}`);

/**
 * vendor/crosswords/dist/crosswords.js — Azərbaycan əlifbası yaması
 * Upstream: dwmkerr/crosswords-js (MIT). Bunu yenidən tətbiq etmək: node tools/patch-crosswords.js
 *
 * Problem: bundle yalnız [a-z] hərflərini qəbul edir və həll sözlərini
 * `toUpperCase().replaceAll(/[^A-Z]/g,"")` ilə təmizləyir — yəni ə, ı, ğ, ş, ç, ö, ü, İ
 * hərfləri ya yazıla bilməz, ya da həll sözündən atılar.
 * Həll: AZ hərflərini qəbul edən regexlər + AZ-ə uyğun registr çevirisi.
 */
const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "..", "vendor", "crosswords", "dist", "crosswords.js");
let src = fs.readFileSync(file, "utf8");

const HELPERS = `const AZ_LOW = /^[a-z\\u0259\\u015F\\u00E7\\u011F\\u00F6\\u00FC\\u0131\\u0069]$/;
const AZ_UPPER_CHARS = "A-Z\\u018F\\u015E\\u00C7\\u011E\\u00D6\\u00DC\\u0130\\u0049";
const AZ_CASE_DOWN = { "\\u0130": "i", "I": "\\u0131", "\\u018F": "\\u0259", "\\u015E": "\\u015F", "\\u00C7": "\\u00E7", "\\u011E": "\\u011F", "\\u00D6": "\\u00F6", "\\u00DC": "\\u00FC" };
const AZ_CASE_UP = { "i": "\\u0130", "\\u0131": "I", "\\u0259": "\\u018F", "\\u015F": "\\u015E", "\\u00E7": "\\u00C7", "\\u011F": "\\u011E", "\\u00F6": "\\u00D6", "\\u00FC": "\\u00DC" };
function azLower(ch) { const c = String(ch); return AZ_CASE_DOWN[c] !== undefined ? AZ_CASE_DOWN[c] : c.toLowerCase(); }
function azUpper(ch) { const c = String(ch); return AZ_CASE_UP[c] !== undefined ? AZ_CASE_UP[c] : c.toUpperCase(); }
function azUpperStr(s) { return Array.from(String(s || ""), azUpper).join(""); }
`;

const REPLACEMENTS = [
  {
    name: "həll sözünün təmizlənməsi (solution)",
    from: "e.solution.toUpperCase().replaceAll(/[^A-Z]/g, \"\")",
    to: "azUpperStr(e.solution).replaceAll(new RegExp(\"[^\" + AZ_UPPER_CHARS + \"]\", \"g\"), \"\")"
  },
  {
    name: "cavab sətirinin təmizlənməsi (answer)",
    from: "e.answer.toUpperCase().replaceAll(/[^ A-Z]/g, \" \")",
    to: "azUpperStr(e.answer).replaceAll(new RegExp(\"[^ \" + AZ_UPPER_CHARS + \"]\", \"g\"), \" \")"
  },
  {
    name: "açılmış hərflər (revealed)",
    from: "e.revealed.toUpperCase()",
    to: "azUpperStr(e.revealed)"
  },
  {
    name: "claviatura hərflərinin yoxunu (so, co)",
    from: "const so = /^[a-z]$/, co = /^[a-z]$/, ao = 5;",
    to: "const so = AZ_LOW, co = AZ_LOW, ao = 5;"
  },
  {
    name: "keypress registr çevirisi",
    from: /const \[l, t\] = \[r\.cell\(i\.target\), i\.key\], \[o, u\] = \[\r?\n\s*t\.toLowerCase\(\),\r?\n\s*t\.toUpperCase\(\)\r?\n\s*\];/,
    to: "const [l, t] = [r.cell(i.target), i.key], [o, u] = [azLower(t), azUpper(t)];"
  },
  {
    name: 'açmaz başlıqları ("Across"/"Down" → "Üfüqi"/"Şaquli")',
    from: 'r("crossword-across-clues", "Across")',
    to: 'r("crossword-across-clues", "Üfüqi")'
  },
  {
    name: 'açmaz başlıqları ("Across"/"Down" → "Üfüqi"/"Şaquli")',
    from: 'r("crossword-down-clues", "Down")',
    to: 'r("crossword-down-clues", "Şaquli")'
  }
];

let count = 0;
for (const { name, from, to } of REPLACEMENTS) {
  const hit = from instanceof RegExp ? from.test(src) : src.includes(from);
  if (!hit) {
    console.error(`XəTA: tapılmadı — ${name}`);
    process.exit(1);
  }
  src = from instanceof RegExp ? src.replace(from, to) : src.split(from).join(to);
  count++;
  console.log(`✓ ${name}`);
}

const anchor = "const so = AZ_LOW";
if (!src.includes("function azUpperStr")) {
  src = src.replace(anchor, HELPERS + anchor);
  console.log("✓ AZ köməkçi funksiyaları əlavə edildi");
}

fs.writeFileSync(file, src);
console.log(`${count} dəyişiklik yazıldı: ${path.relative(process.cwd(), file)}`);

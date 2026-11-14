// Data integrity checks for SPARTANS content. Run: node tools/validate-data.js
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const src = fs.readFileSync(path.join(__dirname, "..", "assets", "js", "data.js"), "utf8");
const ctx = { window: null, console };
ctx.window = ctx;
vm.createContext(ctx);
vm.runInContext(src, ctx);
const SP = ctx.SP;

const AZ = new Set(SP.ALPHABET);
const errs = [];
const seen = new Map();

function checkList(kind, len, list) {
  for (const w of list) {
    if (w.length !== Number(len)) errs.push(`${kind}[${len}] "${w}" uzunluq ${w.length} ≠ ${len}`);
    for (const ch of w) if (!AZ.has(ch)) errs.push(`${kind}[${len}] "${w}" tərkibində əlifbada olmayan "${ch}" hərfi var`);
    const key = kind === "WORDS" ? w : "";
    if (key) {
      if (seen.has(w)) errs.push(`WORDS təkrar: "${w}" həm ${seen.get(w)} həm ${len}`);
      else seen.set(w, len);
    }
  }
}

for (const [len, list] of Object.entries(SP.WORDS)) checkList("WORDS", len, list);
for (const [len, list] of Object.entries(SP.EXTRA || {})) checkList("EXTRA", len, list);

// guesses must never collide with an answer of another length
for (const [len, list] of Object.entries(SP.EXTRA || {})) {
  for (const w of list) if (seen.has(w)) errs.push(`EXTRA "${w}" artıq WORDS[${seen.get(w)}] siyahısındadır`);
}

SP.QUESTIONS.forEach((q, i) => {
  if (q.o.length !== 4) errs.push(`Sual #${i} ("${q.q}") 4 variantdan fərqlidir`);
  if (!(q.a >= 0 && q.a < q.o.length)) errs.push(`Sual #${i} cavab indeksi yoxdur`);
  if (!SP.CATEGORIES.includes(q.c)) errs.push(`Sual #${i} kateqoriyası naməlum: ${q.c}`);
  if (!SP.DIFFS.includes(q.d)) errs.push(`Sual #${i} çətinliyi naməlum: ${q.d}`);
});

SP.FERMI.forEach((f, i) => {
  if (!(f.a >= 0 && f.a < f.o.length)) errs.push(`Fermi #${i} cavab indeksi səhv`);
  if (new Set(f.o).size !== f.o.length) errs.push(`Fermi #${i} variantlar təkrardır`);
});

SP.SIZES.forEach((s) => {
  if (!(s.h > 1.7 && s.h < 1000)) errs.push(`Ölçü "${s.name}" hündürlüyü qəbuledilməz: ${s.h}`);
  if (seen.has("size:" + s.id)) errs.push(`Ölçü id təkrar: ${s.id}`);
  seen.set("size:" + s.id, 1);
});

SP.GAMES.forEach((g) => {
  if (!fs.existsSync(path.join(__dirname, "..", g.href))) errs.push(`Oyun səhifəsi mövcud deyil: ${g.href}`);
  if (!SP.ICONS[g.icon]) errs.push(`Oyun ikonu yoxdur: ${g.icon}`);
});

const counts = Object.entries(SP.WORDS).map(([l, w]) => `${l}:${w.length}`).join(" ");
console.log(`söz sayı ${counts}`);
console.log(`sual ${SP.QUESTIONS.length} | fermi ${SP.FERMI.length} | ölçü ${SP.SIZES.length} | tapmaca ${SP.RIDDLES.length} | komanda ${SP.TEAMS.length}`);
if (errs.length) {
  console.error("\nXƏTALAR:");
  errs.forEach((e) => console.error(" - " + e));
  process.exit(1);
}
console.log("OK — bütün siyahalar təmizdir.");

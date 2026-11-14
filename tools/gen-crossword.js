// Builds a valid interlocking Azerbaijani crossword layout and prints JSON for assets/js/data.js
// Run: node tools/gen-crossword.js

const WORDS = [
  ["TƏŞKİLAT", "Ortaq məqsəd üçün birləşmiş insan qrupu"],
  ["VƏTƏNDAŞ", "Ölkənin rəsmi üzvü"],
  ["SUALNAMƏ", "Sorğu üçün hazırlanmış sual siyahısı"],
  ["MÜSTƏQİL", "Kimsədən asılı olmayan"],
  ["MÜSAHİBƏ", "Söhbət, intervyu"],
  ["MEMARLIQ", "Bina qurma sənəti"],
  ["DANIŞIQ", "Nitq, danışmaq qabiliyyəti"],
  ["MÜHASİBƏ", "Xərclərin yoxlanışı"],
  ["İQTİSAD", "İstehsal və bölüşdürmə elmi"],
  ["HESABAT", "Görülən işin izahı"],
  ["VALYUTA", "Ölkənin pul vahidi"],
  ["DEPOZİT", "Banka yatırılan pul"],
  ["KREDİT", "Bankdan götürülən pul"],
  ["BİLANÇ", "Aktiv və passiv cədvəli"],
  ["MÜŞTERİ", "Alıcı, xidmət alan şəxs"],
  ["REKLAM", "Məhsulu tanıtma fəaliyyəti"],
  ["SATIŞ", "Məhsulun alıcıya ötürülməsi"],
  ["FAİZ", "Pulun gətirdiyi gəlir"],
  ["HİSSƏ", "Pay"],
  ["DASTAN", "Qəhrəmanlıq hekayəsi"],
  ["QƏZƏL", "Lyrik şeir janrı"],
  ["ŞEİR", "Misralardan qurulmuş əsər"],
  ["BƏYİT", "İki misralı şeir vahidi"],
  ["MİSRA", "Şeirin sətiri"],
  ["ROMAN", "Böyük həcmli nəsr əsəri"],
  ["MÜƏLLİM", "Dərs deyən şəxs"],
  ["ŞAGİRD", "Dərs alan şagird"],
  ["MƏKTƏB", "Təhsil ocağı"],
  ["KİTAB", "Vərəqlənən bilik mənbəyi"],
  ["QƏLƏM", "Yazı aləti"],
  ["DƏFTƏR", "Sətir-sətir yazı səhifəsi"],
  ["İMTHAN", "Bilik yoxlaması"],
  ["ULDUZ", "Gecə göydə parlayan nöqtə"],
  ["GÜNƏŞ", "Gündüzün işıq mənbəyi"],
  ["KÜLƏK", "Hərəkət edən hava"],
  ["YAĞIŞ", "Buludlardan düşən su"],
  ["DUMAN", "Görünüşü bağlayan bulud"],
  ["TƏBİƏT", "Dağ, çay, meşə — bütün aləm"],
  ["ÇAYIR", "Otlu düzənlik"],
  ["DƏNİZ", "Duzlu su hövzəsi"],
  ["QARDAŞ", "Eyni valideyndən oğlan"],
  ["GƏLİN", "Toydan sonrakı qadın"],
  ["BİLİK", "Öyrənilmiş doğru məlumat"],
  ["COMƏRD", "Əli açıq, səxavətli adam"],
  ["VƏTƏN", "Doğulub boya başa düşdüyün yer"],
  ["SALON", "Geniş ziyalı otağı"],
  ["TİYATR", "Səhnə sənəti"],
  ["MUSİQİ", "Səs sənəti"],
  ["NAĞMƏ", "Melodiya"],
  ["İŞARƏ", "Tanınma nişanı"],
];

const DIRS = { A: [0, 1], D: [1, 0] };

function makeGrid(w, h) {
  return Array.from({ length: h }, () => Array(w).fill(null));
}

function fits(grid, word, r, c, dir) {
  const [dr, dc] = DIRS[dir];
  const rows = grid.length, cols = grid[0].length;
  const er = r + dr * (word.length - 1), ec = c + dc * (word.length - 1);
  if (r < 0 || c < 0 || er >= rows || ec >= cols) return -1;
  const beforeR = r - dr, beforeC = c - dc, afterR = er + dr, afterC = ec + dc;
  if (beforeR >= 0 && beforeC >= 0 && grid[beforeR][beforeC]) return -1;
  if (afterR < rows && afterC < cols && grid[afterR][afterC]) return -1;
  let crossings = 0;
  for (let i = 0; i < word.length; i++) {
    const rr = r + dr * i, cc = c + dc * i, cell = grid[rr][cc];
    if (cell) {
      if (cell !== word[i]) return -1;
      crossings++;
    } else {
      // cells parallel to (not along) the new word must stay empty
      const n1 = [rr - dc, cc - dr], n2 = [rr + dc, cc + dr];
      for (const [nr, nc] of [n1, n2]) {
        if (nr >= 0 && nc >= 0 && nr < rows && nc < cols && grid[nr][nc]) return -1;
      }
    }
  }
  return crossings;
}

function place(grid, word, r, c, dir) {
  const [dr, dc] = DIRS[dir];
  for (let i = 0; i < word.length; i++) grid[r + dr * i][c + dc * i] = word[i];
}

function build(seed) {
  const SIZE = 17;
  const grid = makeGrid(SIZE, SIZE);
  const entries = [];
  const list = [...WORDS].sort((a, b) => b[0].length - a[0].length || a[0].localeCompare(b[0]));
  let rng = seed;
  const rnd = () => ((rng = (rng * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);

  const first = list[0];
  const r0 = Math.floor(SIZE / 2), c0 = Math.floor((SIZE - first[0].length) / 2);
  place(grid, first[0], r0, c0, "A");
  entries.push({ word: first[0], clue: first[1], r: r0, c: c0, dir: "A" });

  for (const [word, clue] of list.slice(1)) {
    const options = [];
    for (let i = 0; i < word.length; i++) {
      for (const e of entries) {
        const [dr, dc] = DIRS[e.dir];
        for (let j = 0; j < e.word.length; j++) {
          if (e.word[j] !== word[i]) continue;
          const er = e.r + dr * j, ec = e.c + dc * j;
          const nd = e.dir === "A" ? "D" : "A";
          const [nr, nc] = DIRS[nd];
          const startR = er - nr * i, startC = ec - nc * i;
          const score = fits(grid, word, startR, startC, nd);
          if (score > 0) options.push({ word, clue, r: startR, c: startC, dir: nd, score });
        }
      }
    }
    if (!options.length) continue;
    options.sort((a, b) => b.score - a.score || rnd() - 0.5);
    const pick = options[0];
    place(grid, pick.word, pick.r, pick.c, pick.dir);
    entries.push({ word: pick.word, clue: pick.clue, r: pick.r, c: pick.c, dir: pick.dir });
  }

  // compact
  const cells = [];
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) if (grid[r][c]) cells.push([r, c]);
  const minR = Math.min(...cells.map((x) => x[0])), maxR = Math.max(...cells.map((x) => x[0]));
  const minC = Math.min(...cells.map((x) => x[1])), maxC = Math.max(...cells.map((x) => x[1]));
  const h = maxR - minR + 1, w = maxC - minC + 1;
  const out = makeGrid(w, h);
  for (let r = 0; r < h; r++) for (let c = 0; c < w; c++) out[r][c] = grid[r + minR][c + minC] || "";

  // numbering
  const clues = [];
  let n = 0;
  const starts = entries.map((e) => ({ ...e, r: e.r - minR, c: e.c - minC }));
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      if (!out[r][c]) continue;
      const across = (c === 0 || !out[r][c - 1]) && c + 1 < w && out[r][c + 1];
      const down = (r === 0 || !out[r - 1][c]) && r + 1 < h && out[r + 1][c];
      const match = (!across && !down) ? [] : starts.filter((e) => e.r === r && e.c === c);
      if (!match.length) continue;
      n++;
      for (const e of match) {
        clues.push({ n, dir: e.dir === "A" ? "across" : "down", clue: e.clue, answer: e.word, r, c, len: e.word.length });
      }
    }
  }
  // every letter cell must belong to a run of length >= 2 in at least one direction
  for (let r = 0; r < h; r++) {
    for (let c = 0; c < w; c++) {
      if (!out[r][c]) continue;
      const inAcross = (c > 0 && out[r][c - 1]) || (c < w - 1 && out[r][c + 1]);
      const inDown = (r > 0 && out[r - 1][c]) || (r < h - 1 && out[r + 1][c]);
      if (!inAcross && !inDown) return null;
    }
  }
  return { w, h, grid: out.map((row) => row.map((ch) => ch || ".").join("")), clues };
}

let best = null;
for (let s = 1; s <= 600; s++) {
  const res = build(s);
  if (!res) continue;
  const span = Math.max(res.w, res.h);
  const score = res.clues.length * 10 - span * 2;
  if (!best || score > best.score) best = { ...res, score, seed: s };
}
console.log(JSON.stringify({ seed: best.seed, w: best.w, h: best.h, grid: best.grid, clues: best.clues }, null, 1));
console.error(`seed=${best.seed} size=${best.w}x${best.h} clues=${best.clues.length}`);

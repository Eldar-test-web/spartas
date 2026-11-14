/* Ölçü Tahmini (Size It Up formatı) — siluetlər həqiqi ölçəklə çəkilir */
(() => {
  /* Hər siluetin eni metrə — viewBox 0 0 (W) 100 koordinatlarında çəkilir, W = en/hündürlük nisbəti * 100 */
  const SHAPES = {
    fil: { w: 6.5, svg: `<ellipse cx="78" cy="52" rx="52" ry="28"/><ellipse cx="140" cy="60" rx="26" ry="24"/>
      <path d="M158 66 q17 7 14 32 l-9 0 q2-21 -9-26 z"/><ellipse cx="126" cy="56" rx="15" ry="19"/>
      <rect x="40" y="72" width="17" height="28"/><rect x="64" y="74" width="17" height="26"/>
      <rect x="102" y="74" width="17" height="26"/><rect x="126" y="72" width="15" height="28"/>
      <path d="M26 50 q-13 -5 -17 5 l15 6 z"/><rect x="150" y="82" width="4" height="13"/>` },
    avtobus: { w: 11, svg: `<rect x="4" y="2" width="242" height="82" rx="12"/><rect x="0" y="14" width="8" height="52" rx="4"/>
      <circle cx="52" cy="90" r="12"/><circle cx="198" cy="90" r="12"/><rect x="60" y="84" width="130" height="8"/>` },
    zurafe: { w: 4.5, svg: `<ellipse cx="30" cy="62" rx="26" ry="16"/><rect x="12" y="72" width="6" height="28"/>
      <rect x="26" y="72" width="6" height="28"/><rect x="42" y="72" width="6" height="28"/><rect x="52" y="74" width="6" height="26"/>
      <path d="M46 56 L60 8 L70 10 L58 60 Z"/><ellipse cx="70" cy="9" rx="11" ry="7"/>
      <rect x="65" y="0" width="2" height="7"/><rect x="73" y="0" width="2" height="7"/>` },
    teyyare: { w: 70, svg: `<rect x="14" y="66" width="336" height="26" rx="13"/><path d="M18 0 L44 66 L66 66 L34 6 Z"/>
      <path d="M150 74 L214 96 L172 96 L118 78 Z"/><rect x="126" y="88" width="72" height="11" rx="5"/>
      <path d="M40 70 L74 84 L44 88 L28 76 Z"/><ellipse cx="348" cy="79" rx="14" ry="13"/>` },
    sfinqs: { w: 73, svg: `<path d="M0 100 L0 72 Q46 56 96 58 L296 58 Q342 60 365 74 L365 100 Z"/>
      <path d="M286 22 L348 22 L338 62 L296 62 Z"/><rect x="300" y="16" width="34" height="40"/>
      <rect x="312" y="66" width="14" height="34"/><rect x="340" y="66" width="14" height="34"/>` },
    pisa: { w: 16, svg: `<path d="M3 100 L9 8 L21 8 L27 100 Z"/><rect x="10" y="0" width="10" height="9"/>
      <path d="M6 40 L24 40 L24 44 L6 44 Z"/><path d="M5 66 L25 66 L25 70 L5 70 Z"/>` },
    kolizey: { w: 189, svg: `<path d="M0 100 L0 30 Q120 4 250 18 L394 46 L394 100 Z"/>
      <path d="M0 58 L394 74 L394 82 L0 66 Z"/>` },
    tacmahal: { w: 70, svg: `<rect x="6" y="72" width="84" height="28"/><rect x="30" y="44" width="36" height="30"/>
      <path d="M30 46 C30 20 46 12 48 3 C50 12 66 20 66 46 Z"/><rect x="46" y="0" width="3" height="6"/>
      <rect x="1" y="28" width="5" height="72"/><rect x="90" y="28" width="5" height="72"/>
      <path d="M1 28 l2.5 -9 l2.5 9 z"/><path d="M90 28 l2.5 -9 l2.5 9 z"/>` },
    azadliq: { w: 40, svg: `<path d="M6 100 L11 70 L33 70 L38 100 Z"/><rect x="15" y="58" width="14" height="13"/>
      <path d="M17 58 L15 26 L30 26 L28 58 Z"/><path d="M25 26 L31 8 L36 10 L30 28 Z"/>
      <path d="M30 2 L38 7 L30 12 Z"/><path d="M11 30 L21 34 L13 46 Z"/>` },
    bigben: { w: 12, svg: `<rect x="0.4" y="94" width="11.7" height="6"/>
      <rect x="1.9" y="30" width="8.7" height="64"/>
      <circle cx="6.25" cy="39" r="2.7" fill="#08201a"/>
      <path d="M1.2 30 L6.25 17 L11.3 30 Z"/><rect x="4.6" y="11" width="3.3" height="6"/>
      <path d="M4.6 11 L6.25 2.4 L7.9 11 Z"/><rect x="6" y="0" width="0.5" height="3"/>` },
    piramida: { w: 230, svg: `<path d="M0 100 L82 4 L165 100 Z"/><path d="M82 4 L60 100 L0 100 Z" opacity=".55"/>` },
    eyfel: { w: 125, svg: `<path d="M0 100 L9 58 L31 58 L40 100 L31 100 L25 72 L15 72 L9 100 Z"/>
      <rect x="5" y="54" width="30" height="6"/><rect x="10" y="28" width="20" height="5"/>
      <path d="M14 54 L17 28 L25 28 L28 54 Z"/><path d="M17 28 L20 4 L23 28 Z"/><rect x="19" y="0" width="2.4" height="7"/>` },
    burc: { w: 90, svg: `<path d="M1 100 L3 56 L7 56 L9 22 L12 56 L16 56 L18 100 Z"/>
      <rect x="8.4" y="0" width="1.8" height="24"/><path d="M3 78 L16 78 L16 82 L3 82 Z"/>` }
  };

  const HUMAN = { w: 0.55, svg: `<circle cx="50" cy="12" r="12"/><path d="M38 30 q12 -8 24 0 l4 34 l-8 0 l-3 36 l-14 0 l-3 -36 l-8 0 z"/>` };

  const el = {
    stage: document.getElementById("stage"),
    slider: document.getElementById("slider"),
    readout: document.getElementById("readout"),
    lock: document.getElementById("lockBtn"),
    next: document.getElementById("nextBtn"),
    rounds: document.getElementById("rounds"),
    reveal: document.getElementById("reveal"),
    feedback: document.getElementById("feedback"),
    score: document.getElementById("scoreBox"),
    others: document.getElementById("otherGames")
  };

  const ROUNDS = 5;
  const LOG_MIN = Math.log10(1), LOG_MAX = Math.log10(900);
  let items, round, results, locked;

  const sliderToM = (v) => Math.pow(10, LOG_MIN + (v / 1000) * (LOG_MAX - LOG_MIN));
  const mToSlider = (m) => Math.round(((Math.log10(m) - LOG_MIN) / (LOG_MAX - LOG_MIN)) * 1000);

  function newGame() {
    const start = SP.dayIndex("olcu");
    items = Array.from({ length: ROUNDS }, (_, i) => SP.SIZES[(start + i * 3) % SP.SIZES.length]);
    round = 0;
    results = [];
    draw();
  }

  function scoreOf(est, real) {
    const err = Math.abs(Math.log10(est / real));
    return Math.max(0, Math.round(100 * (1 - err / 0.35)));
  }

  function draw() {
    const base = items[round];
    const sh = SHAPES[base.id];
    const it = { ...base, w: sh.w };
    locked = false;
    el.reveal.innerHTML = "";
    el.next.style.display = "none";
    el.lock.style.display = "";
    el.lock.disabled = false;
    el.feedback.textContent = "";
    el.slider.disabled = false;
    el.slider.value = 400;
    updateReadout();

    const k = Math.min(240 / it.h, 300 / it.w);
    const objH = it.h * k, objW = it.w * k;
    const humH = Math.max(6, SP.HUMAN_H * k), humW = (HUMAN.w / SP.HUMAN_H) * humH;
    const vbw = (it.w / it.h) * 100;

    el.stage.innerHTML = `<div class="ground"></div>
      <div class="size-human" title="İnsan rəqəmi — 1,7 m">
        <svg viewBox="0 0 100 100" width="${humW.toFixed(1)}" height="${humH.toFixed(1)}" preserveAspectRatio="none">${HUMAN.svg}</svg>
        <div class="lab">1,7 m</div>
      </div>
      <div class="size-obj">
        <svg viewBox="0 0 ${vbw.toFixed(1)} 100" width="${objW.toFixed(1)}" height="${objH.toFixed(1)}"
          preserveAspectRatio="none" role="img" aria-label="${SP.esc(it.name)} silueti">${sh.svg}</svg>
        <div class="lab">${SP.esc(it.name)}</div>
      </div>`;

    el.rounds.innerHTML = Array.from({ length: ROUNDS }, (_, i) =>
      `<div class="round-dot ${i === round ? "now" : i < results.length ? "done" : ""}">${i < results.length ? results[i] : i + 1}</div>`).join("");
    renderScore();
  }

  function updateReadout() {
    const m = sliderToM(+el.slider.value);
    el.readout.textContent = m >= 10 ? `${Math.round(m)} m` : `${SP.fmt(m, 1)} m`;
  }

  function renderScore() {
    const total = results.reduce((a, b) => a + b, 0);
    el.score.innerHTML = [
      ["Xal", `${total}/${ROUNDS * 100}`],
      ["Raund", `${Math.min(round + 1, ROUNDS)}/${ROUNDS}`]
    ].map(([l, v]) => `<div class="stat"><b>${v}</b><span>${l}</span></div>`).join("");
  }

  el.slider.addEventListener("input", updateReadout);

  el.lock.addEventListener("click", () => {
    if (locked) return;
    locked = true;
    const it = items[round];
    const est = sliderToM(+el.slider.value);
    const pts = scoreOf(est, it.h);
    results[round] = pts;
    el.lock.style.display = "none";
    el.slider.disabled = true;

    const pos = (m) => ((Math.log10(m) - LOG_MIN) / (LOG_MAX - LOG_MIN)) * 100;
    el.reveal.innerHTML = `
      <div class="reveal-bar">
        <div class="row between small"><span class="muted">Sənin təxminin: <b style="color:var(--warn)">${SP.fmt(est, est < 10 ? 1 : 0)} m</b></span>
          <span class="muted">Real hündürlük: <b style="color:var(--mint)">${SP.fmt(it.h, it.h < 10 ? 1 : 0)} m</b></span></div>
        <div class="bar-track">
          <i class="bar-fill" style="width:${pos(est)}%"></i>
          <i class="bar-mark" style="left:${pos(it.h)}%"></i>
        </div>
        <p class="small dim" style="margin:0">${SP.esc(it.note)} · Miqyas xətti loqarifmikdir (1 m – 900 m).</p>
        <p class="small" style="margin:8px 0 0">Raund xalı: <b style="color:var(--mint)">${pts}/100</b></p>
      </div>`;
    el.next.style.display = "";
    el.next.textContent = round === ROUNDS - 1 ? "Nəticə →" : "Növbəti raund →";
    renderScore();
  });

  el.next.addEventListener("click", () => {
    if (round < ROUNDS - 1) { round++; draw(); return; }
    const total = results.reduce((a, b) => a + b, 0);
    const pts = Math.round(total / 5);
    SP.addResult("olcu", pts, { total });
    el.stage.innerHTML = `<div class="ground"></div><div class="center" style="position:relative;z-index:2;margin:auto">
      <h2 style="color:var(--mint)">${total} / 500 xal</h2>
      <p class="muted small">Komanda cədvəlinə +${pts} xal əlavə olundu.</p>
      <div class="row" style="justify-content:center">
        <button class="btn btn-mint" id="againBtn" type="button">Yenidən oyna</button>
        <a class="btn btn-ghost" href="liderler.html">Liderlərə bax →</a>
      </div></div>`;
    document.getElementById("againBtn").addEventListener("click", newGame);
    el.reveal.innerHTML = "";
    el.lock.style.display = "none";
    el.next.style.display = "none";
  });

  el.others.innerHTML = SP.GAMES.filter((g) => g.key !== "olcu")
    .map((g) => `<a class="btn btn-sm btn-ghost" href="${g.href}">${SP.icon(g.icon)} ${g.title}</a>`).join("");

  newGame();
})();

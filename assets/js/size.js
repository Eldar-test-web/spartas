/* Ölçü Tahmini (Size It Up formatı)
   - hər siluet həqiqi miqyasda çəkilir: viewBox-də 100 vahid = obyektin hündürlüyü,
     en isə vb/100 * hündürlük kimi avtomatik çıxır (x0 = çəkimin sol boşluğu)
   - slider təxminin "kölgə" nüsxəsini canlı böyüdür: obyektin eyni forması,
     yalnız təxminə bərabər hündürlükdə. Beləliklə hər hərəkət görünür.
   - kamera obyekt və kölgəni birlikdə çərçivəyə salır */
(() => {
  const SHAPES = {
    fil: { x0: 9, vb: 163, svg: `<ellipse cx="78" cy="52" rx="52" ry="28"/><ellipse cx="140" cy="60" rx="26" ry="24"/>
      <path d="M158 66 q17 7 14 32 l-9 0 q2-21 -9-26 z"/><ellipse cx="126" cy="56" rx="15" ry="19"/>
      <rect x="40" y="72" width="17" height="28"/><rect x="64" y="74" width="17" height="26"/>
      <rect x="102" y="74" width="17" height="26"/><rect x="126" y="72" width="15" height="28"/>
      <path d="M26 50 q-13 -5 -17 5 l15 6 z"/><rect x="150" y="82" width="4" height="13"/>` },
    avtobus: { vb: 246, svg: `<rect x="4" y="2" width="242" height="82" rx="12"/><rect x="0" y="14" width="8" height="52" rx="4"/>
      <circle cx="52" cy="90" r="12"/><circle cx="198" cy="90" r="12"/><rect x="60" y="84" width="130" height="8"/>` },
    zurafe: { x0: 4, vb: 77, svg: `<ellipse cx="30" cy="62" rx="26" ry="16"/><rect x="12" y="72" width="6" height="28"/>
      <rect x="26" y="72" width="6" height="28"/><rect x="42" y="72" width="6" height="28"/><rect x="52" y="74" width="6" height="26"/>
      <path d="M46 56 L60 8 L70 10 L58 60 Z"/><ellipse cx="70" cy="9" rx="11" ry="7"/>
      <rect x="65" y="0" width="2" height="7"/><rect x="73" y="0" width="2" height="7"/>` },
    teyyare: { x0: 14, vb: 348, svg: `<rect x="14" y="66" width="336" height="26" rx="13"/><path d="M18 0 L44 66 L66 66 L34 6 Z"/>
      <path d="M150 74 L214 96 L172 96 L118 78 Z"/><rect x="126" y="88" width="72" height="11" rx="5"/>
      <path d="M40 70 L74 84 L44 88 L28 76 Z"/><ellipse cx="348" cy="79" rx="14" ry="13"/>` },
    sfinqs: { vb: 365, svg: `<path d="M0 100 L0 72 Q46 56 96 58 L296 58 Q342 60 365 74 L365 100 Z"/>
      <path d="M0 58 L394 74 L394 82 L0 66 Z"/>` },
    pisa: { x0: 3, vb: 24, svg: `<path d="M3 100 L9 8 L21 8 L27 100 Z"/><rect x="10" y="0" width="10" height="9"/>
      <path d="M6 40 L24 40 L24 44 L6 44 Z"/><path d="M5 66 L25 66 L25 70 L5 70 Z"/>` },
    kolizey: { vb: 394, svg: `<path d="M0 100 L0 30 Q120 4 250 18 L394 46 L394 100 Z"/>
      <path d="M0 58 L394 74 L394 82 L0 66 Z"/>` },
    tacmahal: { x0: 1, vb: 94, svg: `<rect x="6" y="72" width="84" height="28"/><rect x="30" y="44" width="36" height="30"/>
      <path d="M30 46 C30 20 46 12 48 3 C50 12 66 20 66 46 Z"/><rect x="46" y="0" width="3" height="6"/>
      <rect x="1" y="28" width="5" height="72"/><rect x="90" y="28" width="5" height="72"/>
      <path d="M1 28 l2.5 -9 l2.5 9 z"/><path d="M90 28 l2.5 -9 l2.5 9 z"/>` },
    azadliq: { x0: 6, vb: 32, svg: `<path d="M6 100 L11 70 L33 70 L38 100 Z"/><rect x="15" y="58" width="14" height="13"/>
      <path d="M17 58 L15 26 L30 26 L28 58 Z"/><path d="M25 26 L31 8 L36 10 L30 28 Z"/>
      <path d="M30 2 L38 7 L30 12 Z"/><path d="M11 30 L21 34 L13 46 Z"/>` },
    bigben: { vb: 12.1, svg: `<rect x="0" y="94" width="12.1" height="6"/>
      <path d="M1.3 94 L1.9 35 L10.2 35 L10.8 94 Z"/>
      <rect x="0.9" y="28" width="10.3" height="7.5"/>
      <circle cx="6.05" cy="31.7" r="2.7" fill="#08201a"/>
      <path d="M1.2 28 L2.05 19.5 L2.9 28 Z"/><path d="M9.2 28 L10.05 19.5 L10.9 28 Z"/>
      <path d="M1.7 28 L6.05 15 L10.4 28 Z"/>
      <rect x="4.7" y="9" width="2.7" height="6.5"/>
      <path d="M4.7 9 L6.05 2.6 L7.4 9 Z"/>
      <rect x="5.85" y="0" width="0.4" height="3"/>` },
    piramida: { vb: 165, svg: `<path d="M0 100 L82 4 L165 100 Z"/><path d="M82 4 L60 100 L0 100 Z" opacity=".55"/>` },
    eyfel: { vb: 40, svg: `<path d="M0 100 L9 58 L31 58 L40 100 L31 100 L25 72 L15 72 L9 100 Z"/>
      <rect x="5" y="54" width="30" height="6"/><rect x="10" y="28" width="20" height="5"/>
      <path d="M14 54 L17 28 L25 28 L28 54 Z"/><path d="M17 28 L20 4 L23 28 Z"/><rect x="19" y="0" width="2.4" height="7"/>` },
    burc: { vb: 7.2, svg: `<path d="M0.2 100 L0.8 78 L1.6 78 L2 60 L2.6 60 L2.9 42 L3.3 42
      L3.45 22 L3.6 8 L3.7 0 L3.8 8 L3.95 22 L4.1 42 L4.5 42 L4.8 60 L5.4 60
      L5.8 78 L6.6 78 L7 100 Z"/>` }
  };

  /* rəqəm: 100 vahid hündürlük = 1,7 m, en 28 vahid = 0,48 m (çiyin eni) */
  const PERSON_VB = 28;
  const PERSON_SVG = `<circle cx="14" cy="8" r="7.5"/>
    <path d="M3 24 Q14 15 25 24 L23 55 L5 55 Z"/>
    <path d="M6 55 h6 l-1 45 h-5 z"/><path d="M16 55 h6 l-1 45 h-5 z"/>`;

  const el = {
    stage: document.getElementById("stage"),
    slider: document.getElementById("slider"),
    sliderTicks: document.getElementById("sliderTicks"),
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
  const GROUND = 34, RULER = 66, TOP = 20, RIGHT = 30, MIN_W = 26;
  let items, round, results, locked, scene, tickKey = "";

  const sliderToM = (v) => Math.pow(10, LOG_MIN + (v / 1000) * (LOG_MAX - LOG_MIN));
  const mToSlider = (m) => Math.round(((Math.log10(m) - LOG_MIN) / (LOG_MAX - LOG_MIN)) * 1000);
  const fmtM = (m) => (m >= 10 ? `${Math.round(m)} m` : `${SP.fmt(m, 1)} m`);

  /* şkala addımları: 5-7 ədəd həmişə "gözəl" rəqəmlərlə (1, 2, 2.5, 5, 10 × 10^n) */
  function niceStep(range) {
    const raw = range / 6;
    const pow = Math.pow(10, Math.floor(Math.log10(raw)));
    for (const m of [1, 2, 2.5, 5, 10]) if (m * pow >= raw) return m * pow;
    return 10 * pow;
  }

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
    const it = items[round], sh = SHAPES[it.id];
    locked = false;
    el.reveal.innerHTML = "";
    el.next.style.display = "none";
    el.lock.style.display = "";
    el.lock.disabled = false;
    el.feedback.textContent = "";
    el.slider.disabled = false;
    el.slider.value = 400;
    el.stage.classList.remove("is-revealed");

    const body = `<g transform="translate(${-(sh.x0 || 0)} 0)">${sh.svg}</g>`;
    el.stage.innerHTML = `
      <div class="sz-grid" data-grid></div>
      <div class="sz-ruler" data-ruler></div>
      <div class="sz-obj" data-obj>
        <svg viewBox="0 0 ${sh.vb} 100" preserveAspectRatio="none" role="img"
          aria-label="${SP.esc(it.name)} silueti">${body}</svg>
      </div>
      <div class="sz-ghost" data-ghost>
        <svg viewBox="0 0 ${sh.vb} 100" preserveAspectRatio="none" aria-hidden="true">${body}</svg>
      </div>
      <div class="sz-dim" data-dim><b data-dimlab>?</b></div>
      <div class="sz-person" data-person>
        <svg viewBox="0 0 ${PERSON_VB} 100" preserveAspectRatio="none" aria-hidden="true">${PERSON_SVG}</svg>
        <span>1,7 m</span>
      </div>
      <div class="sz-guess" data-guess><span data-guesslab></span></div>
      <div class="sz-name" data-name>${SP.esc(it.name)}</div>
      <div class="ground"></div>`;

    scene = {
      it, sh,
      grid: el.stage.querySelector("[data-grid]"),
      ruler: el.stage.querySelector("[data-ruler]"),
      ghost: el.stage.querySelector("[data-ghost]"),
      obj: el.stage.querySelector("[data-obj]"),
      dim: el.stage.querySelector("[data-dim]"),
      dimlab: el.stage.querySelector("[data-dimlab]"),
      person: el.stage.querySelector("[data-person]"),
      guess: el.stage.querySelector("[data-guess]"),
      guesslab: el.stage.querySelector("[data-guesslab]"),
      name: el.stage.querySelector("[data-name]")
    };
    tickKey = "";
    layout();
    updateReadout();
    paintRounds();
    renderScore();
  }

  function layout() {
    if (!scene) return;
    const rect = el.stage.getBoundingClientRect();
    const { it, sh } = scene;
    const est = sliderToM(+el.slider.value);
    const usableH = Math.max(60, rect.height - GROUND - TOP);
    const usableW = Math.max(60, rect.width - RULER - RIGHT);

    const wM = (sh.vb / 100) * it.h;                       /* obyektin real eni, metr */
    const gr = est / it.h;
    /* kamera: hündürlük və en birlikdə təxminə görə uzaqlaşır —
       kiçik təxmin yerinə böyük təxmin səhnəni kiçildir */
    const sceneMax = Math.max(it.h, est) * 1.14;
    const k = Math.min(usableH / sceneMax, usableW / Math.max(wM * Math.max(gr, 1), 0.2));
    const yOf = (m) => GROUND + m * k;

    const objH = it.h * k;
    const objW = Math.max(wM * k, MIN_W);
    const objLeft = RULER + (usableW - objW) / 2;
    scene.obj.style.cssText = `left:${objLeft.toFixed(1)}px;width:${objW.toFixed(1)}px;height:${objH.toFixed(1)}px`;
    scene.dim.style.cssText = `left:${(objLeft + objW + 14).toFixed(1)}px;height:${objH.toFixed(1)}px`;
    scene.name.style.left = `${(objLeft + objW / 2).toFixed(1)}px`;

    /* kölgə = obyektin təxminə görə miqyaslanmış nüsxəsi, eyni mərkəzdə */
    const gW = Math.max(objW * gr, 6), gH = Math.max(objH * gr, 6);
    scene.ghost.style.cssText =
      `left:${(objLeft + (objW - gW) / 2).toFixed(1)}px;width:${gW.toFixed(1)}px;height:${gH.toFixed(1)}px`;

    scene.guess.style.bottom = `${yOf(est).toFixed(1)}px`;
    scene.guesslab.textContent = `Təxminin · ${fmtM(est)}`;

    /* insan rəqəmi eyni miqyasda, obyektin solunda dayanır; 6 px-dən kiçik
       rəqəmlər görünmür — o zaman minimuma çəkilir və "clamped" işarələnir */
    const humTrue = SP.HUMAN_H * k;
    const hum = Math.max(6, humTrue);
    const humLeft = Math.max(RULER + 6, objLeft - hum * 0.28 - 12);
    scene.person.style.cssText = `left:${humLeft.toFixed(1)}px;width:${(hum * 0.28).toFixed(1)}px;height:${hum.toFixed(1)}px`;
    scene.person.classList.toggle("is-clamped", humTrue < 6);

    const step = niceStep(usableH / k);
    const vals = [];
    for (let v = step; v <= usableH / k; v += step) vals.push(+v.toFixed(2));
    const key = vals.join(",");
    if (key !== tickKey) {
      tickKey = key;
      scene.ruler.innerHTML = vals.map((v) =>
        `<div class="sz-tick" style="bottom:${yOf(v).toFixed(1)}px"><span>${fmtM(v)}</span></div>`).join("");
      scene.grid.innerHTML = vals.map((v) =>
        `<i style="bottom:${yOf(v).toFixed(1)}px"></i>`).join("");
    } else {
      [...scene.ruler.children].forEach((t, i) => { t.style.bottom = `${yOf(vals[i]).toFixed(1)}px`; });
      [...scene.grid.children].forEach((t, i) => { t.style.bottom = `${yOf(vals[i]).toFixed(1)}px`; });
    }
  }

  function paintRounds() {
    el.rounds.innerHTML = Array.from({ length: ROUNDS }, (_, i) =>
      `<div class="round-dot ${i === round ? "now" : i < results.length ? "done" : ""}">${i < results.length ? results[i] : i + 1}</div>`).join("");
  }

  function updateReadout() {
    el.readout.textContent = fmtM(sliderToM(+el.slider.value));
  }

  function renderScore() {
    const total = results.reduce((a, b) => a + b, 0);
    el.score.innerHTML = [
      ["Xal", `${total}/${ROUNDS * 100}`],
      ["Raund", `${Math.min(round + 1, ROUNDS)}/${ROUNDS}`]
    ].map(([l, v]) => `<div class="stat"><b>${v}</b><span>${l}</span></div>`).join("");
  }

  el.slider.addEventListener("input", () => { updateReadout(); if (!locked) layout(); });
  if (window.ResizeObserver) new ResizeObserver(() => layout()).observe(el.stage);
  else window.addEventListener("resize", layout);

  el.lock.addEventListener("click", () => {
    if (locked) return;
    locked = true;
    const it = items[round];
    const est = sliderToM(+el.slider.value);
    const pts = scoreOf(est, it.h);
    results[round] = pts;
    el.lock.style.display = "none";
    el.slider.disabled = true;
    el.stage.classList.add("is-revealed");
    scene.dimlab.textContent = fmtM(it.h);
    layout();
    paintRounds();

    const ratio = est / it.h;
    const dir = ratio > 1 ? "uzun" : "qısa";
    el.feedback.textContent = `Real: ${fmtM(it.h)} — təxminin ${(ratio > 1 ? ratio : 1 / ratio).toFixed(2)} dəfə ${dir}.`;

    const pos = (m) => ((Math.log10(m) - LOG_MIN) / (LOG_MAX - LOG_MIN)) * 100;
    el.reveal.innerHTML = `
      <div class="reveal-bar">
        <div class="row between small">
          <span class="muted">Sənin təxminin <b class="rv-est">${fmtM(est)}</b></span>
          <span class="muted">Real hündürlük <b class="rv-real">${fmtM(it.h)}</b></span>
          <span class="muted">Raund xalı <b class="rv-pts">${pts}/100</b></span>
        </div>
        <div class="bar-track">
          <i class="bar-fill" style="width:${pos(est)}%"></i>
          <i class="bar-mark" style="left:${pos(it.h)}%"></i>
        </div>
        <p class="small dim" style="margin:0">${SP.esc(it.note)} Şkala loqarifmikdir: 1 m – 900 m.</p>
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
    scene = null;
    el.stage.innerHTML = `<div class="ground"></div><div class="sz-end">
      <p class="eyebrow">5 raund bitdi</p>
      <h2>${total} <small>/ 500 xal</small></h2>
      <p class="muted small">Komanda cədvəlinə +${pts} xal əlavə olundu.</p>
      <div class="row" style="justify-content:center">
        <button class="btn btn-mint" id="againBtn" type="button">Yenidən oyna</button>
        <a class="btn btn-ghost" href="liderler.html">Liderlərə bax →</a>
      </div></div>`;
    document.getElementById("againBtn").addEventListener("click", newGame);
    el.reveal.innerHTML = "";
    el.lock.style.display = "none";
    el.next.style.display = "none";
    el.feedback.textContent = "";
    paintRounds();
    renderScore();
  });

  el.sliderTicks.innerHTML = [1, 3, 10, 30, 100, 300, 900]
    .map((m) => `<i style="left:${mToSlider(m) / 10}%">${m >= 1000 ? "1 km" : `${m} m`}</i>`).join("");

  el.others.innerHTML = SP.GAMES.filter((g) => g.key !== "olcu")
    .map((g) => `<a class="btn btn-sm btn-ghost" href="${g.href}">${SP.icon(g.icon)} ${g.title}</a>`).join("");

  newGame();
})();

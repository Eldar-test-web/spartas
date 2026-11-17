/* Ölçü Tahmini (Size It Up formatı)
   - cismin özü təxminindir: çubuğu sürüşdürəndə (və ya səhnəyə toxunanda)
     siluet real miqyasda böyüyür-kiçilir, şkala isə yerdəyişmir
   - çərçivə raund üçün sabitdir: tavan = real hündürlüyün 2,2 qatı, yəni
     sıfır xal həddi. Cisim tavana çatanda artıq heç nə almırsan.
   - təsdiqdən sonra siluet real hündürlüyünə animasiya ilə qayıdır */
(() => {
  const SHAPES = {
    fil: { x0: 9, vb: 163, svg: `<ellipse cx="78" cy="52" rx="52" ry="28"/><ellipse cx="140" cy="60" rx="26" ry="24"/>
      <path d="M158 66 q17 7 14 32 l-9 0 q2-21 -9-26 z"/><ellipse cx="126" cy="56" rx="15" ry="19"/>
      <rect x="40" y="72" width="17" height="28"/><rect x="64" y="74" width="17" height="26"/>
      <rect x="102" y="74" width="17" height="26"/><rect x="126" y="72" width="15" height="28"/>
      <path d="M31 47 q-10 9 -11 21 l3 1 q2-11 11-19 z"/><path d="M20 67 l4.5 12 l-7.5 -2 z"/>
      <rect x="150" y="82" width="4" height="13"/>` },
    avtobus: { vb: 246, svg: `<rect x="4" y="2" width="242" height="82" rx="12"/><rect x="0" y="14" width="8" height="52" rx="4"/>
      <circle cx="52" cy="90" r="12"/><circle cx="198" cy="90" r="12"/><rect x="60" y="84" width="130" height="8"/>` },
    zurafe: { x0: 4, vb: 77, svg: `<ellipse cx="30" cy="62" rx="26" ry="16"/><rect x="12" y="72" width="6" height="28"/>
      <rect x="26" y="72" width="6" height="28"/><rect x="42" y="72" width="6" height="28"/><rect x="52" y="74" width="6" height="26"/>
      <path d="M46 56 L60 8 L70 10 L58 60 Z"/><ellipse cx="70" cy="9" rx="11" ry="7"/>
      <rect x="65" y="0" width="2" height="7"/><rect x="73" y="0" width="2" height="7"/>` },
    teyyare: { x0: 14, vb: 348, svg: `<rect x="14" y="66" width="336" height="26" rx="13"/><path d="M18 0 L44 66 L66 66 L34 6 Z"/>
      <path d="M150 74 L214 96 L172 96 L118 78 Z"/><rect x="126" y="88" width="72" height="11" rx="5"/>
      <path d="M40 70 L74 84 L44 88 L28 76 Z"/><ellipse cx="348" cy="79" rx="14" ry="13"/>` },
    sfinqs: { vb: 365, svg: `<path d="M0 100 L0 60 Q6 44 30 42 L120 46 L200 52 L246 50 L252 24 L268 8 L302 14 L300 46 L312 72 L365 84 L365 100 Z"/>
      <path d="M246 50 L300 46 L300 54 L248 58 Z" opacity=".45"/>` },
    pisa: { x0: 3, vb: 24, svg: `<path d="M3 100 L9 8 L21 8 L27 100 Z"/><rect x="10" y="0" width="10" height="9"/>
      <path d="M6 40 L24 40 L24 44 L6 44 Z"/><path d="M5 66 L25 66 L25 70 L5 70 Z"/>` },
    kolizey: { vb: 394, svg: `<path d="M0 100 L0 30 Q120 4 250 18 L394 46 L394 100 Z"/>
      <path d="M0 58 L394 74 L394 82 L0 66 Z"/>` },
    tacmahal: { x0: 1, vb: 94, svg: `<rect x="6" y="72" width="84" height="28"/><rect x="30" y="44" width="36" height="30"/>
      <path d="M30 46 C30 20 46 12 48 3 C50 12 66 20 66 46 Z"/><rect x="46" y="0" width="3" height="6"/>
      <rect x="1" y="28" width="5" height="72"/><rect x="90" y="28" width="5" height="72"/>
      <path d="M1 28 l2.5 -9 l2.5 9 z"/><path d="M90 28 l2.5 -9 l2.5 9 z"/>` },
    azadliq: { x0: 6, vb: 33, svg: `<path d="M6 100 L11 60 L34 60 L39 100 Z"/>
      <rect x="12" y="54" width="21" height="7"/>
      <path d="M15 54 L18 26 L27 26 L31 54 Z"/>
      <circle cx="22.5" cy="21" r="4"/>
      <path d="M18.5 18 L14.5 12 L19.5 16 Z"/><path d="M22.5 16 L22.5 8 L25 15 Z"/><path d="M26.5 18 L30.5 12 L27 16.5 Z"/>
      <path d="M26 27 L33 10 L36.5 11.5 L29.5 29 Z"/>
      <path d="M33 10 L34.5 3 L37.5 8.5 L36.5 11.5 Z"/>
      <path d="M17 28 L11.5 34 L14 37.5 L19.5 31.5 Z"/>` },
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
      L5.8 78 L6.6 78 L7 100 Z"/>` },
    qizqalasi: { vb: 84, svg: `<path d="M18 100 L24 16 L60 16 L66 100 Z"/>
      <path d="M22 16 L24 8 L30 8 L31 16 Z M38 16 L39 6 L45 6 L46 16 Z M54 16 L55 8 L61 8 L62 16 Z"/>
      <path d="M30 58 L54 58 L54 62 L30 62 Z" opacity=".5"/>` },
    alov: { vb: 120, svg: `<path d="M4 100 L14 40 Q20 26 26 42 L36 100 Z"/>
      <path d="M44 100 L52 22 Q60 4 68 22 L76 100 Z"/>
      <path d="M84 100 L92 46 Q98 30 104 46 L114 100 Z"/>` }
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
  const GROUND = 34, RULER = 66, TOP = 20, RIGHT = 30, MIN_W = 10, CEIL = 1000;
  let items, round, results, locked, dragging = false, scene, tickKey = "", seed = 0;

  const sliderToM = (v) => Math.pow(10, LOG_MIN + (v / 1000) * (LOG_MAX - LOG_MIN));
  const mToSlider = (m) => Math.round(((Math.log10(m) - LOG_MIN) / (LOG_MAX - LOG_MIN)) * 1000);
  const fmtM = (m) => (m >= 10 ? `${Math.round(m)} m` : `${SP.fmt(m, 1)} m`);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  /* çərçivənin tavanı: real hündürlüyün 2,2 qatı, kələ-kötür "gözəl" ədədə
     yuvarlaqlaşdırılır — tavana baxıb doğru cavabı tapmaq mümkün olmasın */
  function frameTop(h) {
    const x = Math.min(CEIL, h * 2.2);
    const pow = Math.pow(10, Math.floor(Math.log10(x)));
    for (const m of [1, 2, 4, 8]) if (m * pow >= x) return m * pow;
    return 10 * pow;
  }

  /* şkala addımları: 5-6 ədəd həmişə "gözəl" rəqəmlərlə (1, 2, 2.5, 5, 10 × 10^n) */
  function niceStep(range) {
    const raw = range / 6;
    const pow = Math.pow(10, Math.floor(Math.log10(raw)));
    for (const m of [1, 2, 2.5, 5, 10]) if (m * pow >= raw) return m * pow;
    return 10 * pow;
  }

  function newGame() {
    const start = SP.dayIndex("olcu");
    items = Array.from({ length: ROUNDS }, (_, i) => SP.SIZES[(start + i * 3) % SP.SIZES.length]);
    seed = start;
    round = 0;
    results = [];
    draw();
  }

  /* raundun əvvəlində tutacağın mövqeyi: çərçivənin 30-58%-i. Gün üzrə sabit,
     amma real hündürlükdən asılı deyil — yəni start cavabı "salam" vermir */
  function startFrac(i) {
    const x = Math.sin((seed + 1) * 12.9898 + (i + 3) * 78.233) * 43758.5453;
    return 0.3 + 0.28 * (x - Math.floor(x));
  }

  function scoreOf(est, real) {
    const err = Math.abs(Math.log10(est / real));
    return Math.max(0, Math.round(100 * (1 - err / 0.35)));
  }

  function draw() {
    const it = items[round], sh = SHAPES[it.id];
    locked = false;
    dragging = false;
    el.reveal.innerHTML = "";
    el.next.style.display = "none";
    el.lock.style.display = "";
    el.lock.disabled = false;
    el.feedback.textContent = "";
    el.slider.disabled = false;
    el.stage.classList.remove("is-revealed");

    const top = frameTop(it.h);
    el.slider.value = clamp(mToSlider(Math.min(900, top * startFrac(round))), 0, 1000);

    const body = `<g transform="translate(${-(sh.x0 || 0)} 0)">${sh.svg}</g>`;
    el.stage.innerHTML = `
      <div class="sz-grid" data-grid></div>
      <div class="sz-ruler" data-ruler></div>
      <div class="sz-obj" data-obj>
        <svg viewBox="0 0 ${sh.vb} 100" preserveAspectRatio="none" role="img"
          aria-label="${SP.esc(it.name)} silueti">${body}</svg>
      </div>
      <div class="sz-dim" data-dim><b data-dimlab>?</b></div>
      <div class="sz-person" data-person>
        <svg viewBox="0 0 ${PERSON_VB} 100" preserveAspectRatio="none" aria-hidden="true">${PERSON_SVG}</svg>
        <span>1,7 m</span>
      </div>
      <div class="sz-guess" data-guess><span data-guesslab></span></div>
      <div class="sz-handle" data-handle><i></i><i></i><i></i><b data-hlab></b></div>
      <div class="sz-ceiling" data-ceiling><span>0 xal həddi</span></div>
      <div class="sz-name" data-name>${SP.esc(it.name)}</div>
      <div class="ground"></div>`;

    scene = {
      it, sh, top,
      grid: el.stage.querySelector("[data-grid]"),
      ruler: el.stage.querySelector("[data-ruler]"),
      obj: el.stage.querySelector("[data-obj]"),
      dim: el.stage.querySelector("[data-dim]"),
      dimlab: el.stage.querySelector("[data-dimlab]"),
      person: el.stage.querySelector("[data-person]"),
      guess: el.stage.querySelector("[data-guess]"),
      guesslab: el.stage.querySelector("[data-guesslab]"),
      handle: el.stage.querySelector("[data-handle]"),
      hlab: el.stage.querySelector("[data-hlab]"),
      ceiling: el.stage.querySelector("[data-ceiling]"),
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
    const { it, sh, top } = scene;
    const est = sliderToM(+el.slider.value);
    const usableH = Math.max(60, rect.height - GROUND - TOP);
    const usableW = Math.max(60, rect.width - RULER - RIGHT);

    /* çərçivə sabit: k yalnız raunddan və səhnə ölçüsündən asılıdır */
    const k = usableH / top;
    const yOf = (m) => GROUND + m * k;
    const centerX = RULER + usableW / 2;

    /* görünən hündürlük: kiliddən əvvəl təxmin, sonra həqiqət */
    const shown = locked ? it.h : est;
    const sc = shown / it.h;
    const objH = Math.min(shown * k, usableH);
    /* eni səhnədən daşmasın: hündürlük şkalaya sadiq qalır, uzunu sıxılır */
    const objW = clamp((sh.vb / 100) * it.h * k * sc, MIN_W, usableW - 4);
    const objLeft = centerX - objW / 2;
    scene.obj.style.cssText = `left:${objLeft.toFixed(1)}px;width:${objW.toFixed(1)}px;height:${objH.toFixed(1)}px`;
    scene.name.style.left = `${centerX.toFixed(1)}px`;

    /* ölçü xətti: yalnız təsdiqdən sonra real hündürlüyü göstərir */
    const realH = Math.min(it.h * k, usableH);
    scene.dim.style.cssText = `left:${(centerX + Math.max(objW, (sh.vb / 100) * it.h * k) / 2 + 16).toFixed(1)}px;height:${realH.toFixed(1)}px`;

    /* təxmin xətti + tutacaqlar */
    scene.guess.style.bottom = `${yOf(clamp(est, 0, top)).toFixed(1)}px`;
    scene.handle.style.bottom = `${(yOf(clamp(est, 0, top)) - 9).toFixed(1)}px`;
    scene.handle.classList.toggle("is-capped", est > top);
    scene.hlab.textContent = fmtM(est);
    scene.guesslab.textContent = `Təxminin · ${fmtM(est)}`;
    scene.ceiling.style.bottom = `${(GROUND + top * k).toFixed(1)}px`;

    /* insan rəqəmi həmişə eyni miqyasda durur — 6 px-dən kiçik rəqəm görünmür,
       o zaman minimuma çəkilir və "clamped" işarələnir */
    const humTrue = SP.HUMAN_H * k;
    const hum = Math.max(6, humTrue);
    const humLeft = Math.max(RULER + 6, centerX - objW / 2 - hum * 0.28 - 14);
    scene.person.style.cssText = `left:${humLeft.toFixed(1)}px;width:${(hum * 0.28).toFixed(1)}px;height:${hum.toFixed(1)}px`;
    scene.person.classList.toggle("is-clamped", humTrue < 6);

    const step = niceStep(top);
    const vals = [];
    for (let v = step; v < top; v += step) vals.push(+v.toFixed(2));
    const key = vals.join(",");
    if (key !== tickKey) {
      tickKey = key;
      scene.ruler.innerHTML = vals.map((v) =>
        `<div class="sz-tick" style="bottom:${yOf(v).toFixed(1)}px"><span>${fmtM(v)}</span></div>`).join("");
      scene.grid.innerHTML = vals.map((v) =>
        `<i style="bottom:${yOf(v).toFixed(1)}px"></i>`).join("");
    }
  }

  function paintRounds() {
    el.rounds.innerHTML = Array.from({ length: ROUNDS }, (_, i) =>
      `<div class="round-dot ${i === round ? "now" : i < results.length ? "done" : ""}">${i < results.length ? results[i] : i + 1}</div>`).join("");
  }

  function updateReadout() {
    el.readout.textContent = fmtM(sliderToM(+el.slider.value));
  }

  function setEst(m) {
    el.slider.value = clamp(mToSlider(clamp(m, 1, 900)), 0, 1000);
    updateReadout();
    layout();
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

  /* birbaşa tənzimləmə: səhnədə sürüşdür, cisim barmağının altında böyüyür */
  const pointerToM = (clientY) => {
    const rect = el.stage.getBoundingClientRect();
    const usableH = Math.max(60, rect.height - GROUND - TOP);
    return (rect.bottom - GROUND - clientY) / (usableH / scene.top);
  };
  el.stage.addEventListener("pointerdown", (e) => {
    if (locked || !scene) return;
    dragging = true;
    el.stage.classList.add("is-dragging");
    el.stage.setPointerCapture(e.pointerId);
    setEst(pointerToM(e.clientY));
    e.preventDefault();
  });
  el.stage.addEventListener("pointermove", (e) => {
    if (dragging && !locked) setEst(pointerToM(e.clientY));
  });
  ["pointerup", "pointercancel"].forEach((t) => el.stage.addEventListener(t, () => {
    dragging = false;
    el.stage.classList.remove("is-dragging");
  }));

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

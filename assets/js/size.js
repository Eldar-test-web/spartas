/* Ölçü Tahmini: kamera ilə 129 siluetli, 20 km-ə qədər oyun. */
(() => {
  const SHAPES = SP.SIZE_SHAPES;
  const LIMIT = SP.SIZE_LIMIT;
  const PERSON_VB = 28;
  const PERSON_SVG = `<circle cx="14" cy="7" r="6.4"/>
    <rect x="12.2" y="12" width="3.6" height="4"/>
    <path d="M6.5 19 Q14 14 21.5 19 L20 44 L8 44 Z"/>
    <path d="M6.5 19 L3 38 L5.4 39 L9 24 Z"/><path d="M21.5 19 L25 38 L22.6 39 L19 24 Z"/>
    <path d="M8.4 44 L12.6 44 L11.6 70 L8.6 70 Z"/><path d="M15.4 44 L19.6 44 L19.4 70 L16.4 70 Z"/>
    <path d="M8.2 70 L12 70 L11.6 100 L7.6 100 Z"/><path d="M16 70 L19.8 70 L20.4 100 L16.4 100 Z"/>`;

  const ROUNDS = 5, LOG_MIN = Math.log10(1), LOG_MAX = Math.log10(LIMIT);
  let items, round, results, locked, scene, seed = 0;

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

  const sliderToM = (v) => Math.pow(10, LOG_MIN + (v / 1000) * (LOG_MAX - LOG_MIN));
  const mToSlider = (m) => Math.round(((Math.log10(m) - LOG_MIN) / (LOG_MAX - LOG_MIN)) * 1000);
  const fmtM = (m) => m >= 1000
    ? `${SP.fmt(m / 1000, m < 10000 ? 2 : 1)} km`
    : (m >= 10 ? `${Math.round(m)} m` : `${SP.fmt(m, 1)} m`);
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  function frameTop(h) {
    const x = Math.min(LIMIT, h * 2.2);
    const pow = Math.pow(10, Math.floor(Math.log10(x)));
    for (const m of [1, 2, 4, 8]) if (m * pow >= x) return m * pow;
    return 10 * pow;
  }

  function niceStep(range) {
    const raw = range / 6, pow = Math.pow(10, Math.floor(Math.log10(raw)));
    for (const m of [1, 2, 2.5, 5, 10]) if (m * pow >= raw) return m * pow;
    return 10 * pow;
  }

  function scoreOf(est, real) {
    const err = Math.abs(Math.log10(est / real));
    return Math.max(0, Math.round(100 * (1 - err / 0.35)));
  }

  function shuffledDaily() {
    const list = [...SP.SIZES];
    let a = seed >>> 0;
    const random = () => {
      a += 0x6D2B79F5;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    for (let i = list.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [list[i], list[j]] = [list[j], list[i]];
    }
    return list;
  }

  function newGame() {
    seed = SP.dayIndex("olcu-129");
    const requested = new URLSearchParams(location.search).get("obyekt");
    const first = SP.SIZES.find((it) => it.id === requested && SHAPES[it.id]);
    const pool = shuffledDaily();
    items = first
      ? [first, ...pool.filter((it) => it.id !== first.id).slice(0, ROUNDS - 1)]
      : pool.slice(0, ROUNDS);
    round = 0;
    results = [];
    draw();
  }

  function draw() {
    locked = false;
    const it = items[round], sh = SHAPES[it.id], top = frameTop(it.h);
    const ratio = sh.vb / 100;
    const body = `<g transform="translate(${-(sh.x0 || 0)} 0)">${sh.svg}</g>`;

    el.stage.innerHTML = `
      <svg class="sz-scene" id="szScene" viewBox="0 0 240 100" preserveAspectRatio="none" aria-hidden="true">
        <g class="sz-cam" data-cam>
          <ellipse class="sz-glow" data-glow cx="120" cy="76" rx="52" ry="30"/>
          <line class="sz-groundline" x1="0" y1="100" x2="240" y2="100"/>
          <rect class="sz-plinth" data-plinth x="100" y="98" width="40" height="2"/>
          <g class="sz-personx" data-person></g>
          <text class="sz-personlab" data-personlab x="0" y="0" text-anchor="middle">1,7 m</text>
          <g class="sz-figure" data-figure>${body}</g>
        </g>
        <g class="sz-hud" data-hud>
          <g data-grid></g>
          <g data-ruler></g>
          <g data-guess>
            <line class="sz-gline" x1="18" x2="238" y1="0" y2="0"/>
            <text class="sz-glabel" data-glab x="20" y="0"></text>
          </g>
          <line class="sz-cline" x1="18" x2="238" y1="3" y2="3"/>
          <text class="sz-clabel" x="236" y="8" text-anchor="end">0 XAL HƏDDİ</text>
          <g data-dim style="opacity:0">
            <line class="sz-dline" x1="0" y1="0" x2="0" y2="0"/>
            <text class="sz-dlabel" data-dlab x="0" y="0"></text>
          </g>
          <path class="sz-corner" d="M18 14 V10 H26 M232 14 V10 H224 M18 94 V98 H26 M232 94 V98 H224"/>
          <text class="sz-name" data-name x="120" y="94" text-anchor="middle">${SP.esc(it.name)}</text>
        </g>
      </svg>
      <div class="sz-cat" data-cat>${SP.esc(it.cat)}</div>
      <div class="sz-zoom" data-zoomlab>🔍 1.0×</div>`;

    scene = {
      it, sh, top, ratio,
      svg: el.stage.querySelector("#szScene"),
      cam: el.stage.querySelector("[data-cam]"),
      hud: el.stage.querySelector("[data-hud]"),
      grid: el.stage.querySelector("[data-grid]"),
      ruler: el.stage.querySelector("[data-ruler]"),
      person: el.stage.querySelector("[data-person]"),
      personlab: el.stage.querySelector("[data-personlab]"),
      glow: el.stage.querySelector("[data-glow]"),
      plinth: el.stage.querySelector("[data-plinth]"),
      figure: el.stage.querySelector("[data-figure]"),
      gline: el.stage.querySelector("[data-guess] line"),
      glab: el.stage.querySelector("[data-glab]"),
      dimg: el.stage.querySelector("[data-dim]"),
      dline: el.stage.querySelector("[data-dim] line"),
      dlab: el.stage.querySelector("[data-dlab]"),
      name: el.stage.querySelector("[data-name]"),
      zoomlab: el.stage.querySelector("[data-zoomlab]"),
      tickKey: ""
    };
    scene.person.innerHTML = PERSON_SVG;

    el.reveal.innerHTML = "";
    el.next.style.display = "none";
    el.lock.style.display = "";
    el.lock.disabled = false;
    el.feedback.textContent = "";
    el.slider.disabled = false;
    el.stage.classList.remove("is-revealed", "is-dragging", "is-zoomed-off");
    el.slider.value = mToSlider(top * (0.8 + 0.15 * ((seed % 97) / 97)));
    layout();
    paintRounds();
    renderScore();
  }

  function layout() {
    if (!scene) return;
    const rect = el.stage.getBoundingClientRect();
    const VW = 100 * rect.width / Math.max(1, rect.height);
    const { it, sh, top, ratio } = scene;
    /* Geniş siluetləri insan rəqəmi üçün yer açacaq şəkildə kadra sığdırırıq. */
    const OH = Math.min(48, 70 / ratio, (VW - 20) / ratio);
    const U = OH / it.h;
    const OW = OH * ratio;
    const est = sliderToM(+el.slider.value);

    const zMax = clamp(90 / OH, 1.8, 3.6);
    const z = locked ? 1 : clamp(top / Math.max(est, 0.01), 1, zMax);
    const ox = VW / 2;
    const tx = ox - z * ox, ty = 96 - z * 100;

    scene.svg.setAttribute("viewBox", `0 0 ${VW.toFixed(2)} 100`);
    scene.cam.setAttribute("transform", `translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${z.toFixed(4)})`);
    scene.zoomlab.textContent = `🔍 ${z.toFixed(1)}×`;
    el.stage.style.setProperty("--detail", locked ? "1" : clamp((z - 1) / (zMax - 1), 0, 1).toFixed(3));
    scene.cam.classList.toggle("is-zoomed", z > (zMax * 0.7) && !locked);

    scene.figure.setAttribute("transform", `translate(${(ox - OW / 2).toFixed(2)} ${(100 - OH).toFixed(2)}) scale(${(OW / sh.vb).toFixed(4)} ${(OH / 100).toFixed(4)})`);
    scene.glow.setAttribute("cx", ox.toFixed(2));
    scene.glow.setAttribute("rx", (OW / 2 + 14).toFixed(2));
    scene.plinth.setAttribute("x", (ox - OW / 2 - 3).toFixed(2));
    scene.plinth.setAttribute("width", (OW + 6).toFixed(2));

    const PH = clamp(SP.HUMAN_H * U, 7, 30), PW = PH * (PERSON_VB / 100);
    const px = Math.max(4, ox - OW / 2 - PW - 6);
    scene.person.setAttribute("transform", `translate(${px.toFixed(2)} ${(100 - PH).toFixed(2)}) scale(${(PH / 100).toFixed(4)} ${(PH / 100).toFixed(4)})`);
    scene.personlab.setAttribute("x", (px + PW / 2).toFixed(2));
    scene.personlab.setAttribute("y", (100 - PH - 2).toFixed(2));

    const step = niceStep(top), vals = [];
    for (let v = step; v < top; v += step) vals.push(+v.toFixed(2));
    const key = vals.join(",");
    if (key !== scene.tickKey || scene.hudW !== VW) {
      scene.tickKey = key;
      scene.hudW = VW;
      scene.ruler.innerHTML = `<line class="sz-rulerline" x1="16" y1="8" x2="16" y2="100"/>` +
        vals.map((v) => {
          const y = 100 - (v / top) * 92;
          return `<line class="sz-rtick" x1="11" y1="${y.toFixed(2)}" x2="16" y2="${y.toFixed(2)}"/>` +
            `<text class="sz-rlabel" x="9" y="${(y + 1.3).toFixed(2)}" text-anchor="end">${fmtM(v)}</text>`;
        }).join("");
      scene.grid.innerHTML = vals.map((v) =>
        `<line class="sz-gline2" x1="18" y1="${(100 - (v / top) * 92).toFixed(2)}" x2="${(VW - 2).toFixed(2)}" y2="${(100 - (v / top) * 92).toFixed(2)}"/>`).join("");
    }

    const gy = 100 - (clamp(est, 0, top) / top) * 92;
    scene.gline.setAttribute("y1", gy.toFixed(2));
    scene.gline.setAttribute("y2", gy.toFixed(2));
    scene.gline.setAttribute("x2", (VW - 2).toFixed(2));
    scene.glab.setAttribute("y", (gy - 2).toFixed(2));
    scene.glab.textContent = `Təxminin · ${fmtM(est)}`;

    if (locked) {
      const dy = 100 - (it.h / top) * 92;
      scene.dimg.style.opacity = "1";
      scene.dline.setAttribute("x1", (ox + OW / 2 + 6).toFixed(2));
      scene.dline.setAttribute("x2", (ox + OW / 2 + 6).toFixed(2));
      scene.dline.setAttribute("y1", "100");
      scene.dline.setAttribute("y2", dy.toFixed(2));
      scene.dlab.setAttribute("x", (ox + OW / 2 + 9).toFixed(2));
      scene.dlab.setAttribute("y", (dy + 2).toFixed(2));
      scene.dlab.textContent = fmtM(it.h);
    }
    el.readout.textContent = fmtM(est);
  }

  function paintRounds() {
    el.rounds.innerHTML = Array.from({ length: ROUNDS }, (_, i) =>
      `<div class="round-dot ${i === round ? "now" : i < results.length ? "done" : ""}">${i < results.length ? results[i] : i + 1}</div>`).join("");
  }

  function renderScore() {
    const total = results.reduce((a, b) => a + b, 0);
    el.score.innerHTML = [
      ["Xal", `${total}/${ROUNDS * 100}`],
      ["Raund", `${Math.min(round + 1, ROUNDS)}/${ROUNDS}`]
    ].map(([l, v]) => `<div class="stat"><b>${v}</b><span>${l}</span></div>`).join("");
  }

  el.slider.addEventListener("input", () => { if (!locked) layout(); });
  if (window.ResizeObserver) new ResizeObserver(() => layout()).observe(el.stage);
  else window.addEventListener("resize", layout);

  let dragY = 0, dragV = 0, dragging = false;
  el.stage.addEventListener("pointerdown", (e) => {
    if (locked || !scene) return;
    dragging = true;
    dragY = e.clientY;
    dragV = +el.slider.value;
    el.stage.classList.add("is-dragging");
    el.stage.setPointerCapture(e.pointerId);
    e.preventDefault();
  });
  el.stage.addEventListener("pointermove", (e) => {
    if (!dragging || locked) return;
    el.slider.value = clamp(dragV + (dragY - e.clientY) * 1.6, 0, 1000);
    layout();
  });
  ["pointerup", "pointercancel"].forEach((t) => el.stage.addEventListener(t, () => {
    dragging = false;
    el.stage.classList.remove("is-dragging");
  }));

  el.lock.addEventListener("click", () => {
    if (locked || !scene) return;
    const it = scene.it;
    locked = true;
    const est = sliderToM(+el.slider.value), pts = scoreOf(est, it.h);
    results[round] = pts;
    el.lock.style.display = "none";
    el.slider.disabled = true;
    el.stage.classList.add("is-revealed", "is-zoomed-off");
    layout();
    paintRounds();
    const ratio = est / it.h;
    el.feedback.textContent = Math.abs(ratio - 1) < .01
      ? `Real: ${fmtM(it.h)} — təxminin çox yaxındır.`
      : `Real: ${fmtM(it.h)} — təxminin ${(ratio > 1 ? ratio : 1 / ratio).toFixed(2)} dəfə ${ratio > 1 ? "uzun" : "qısa"}.`;
    const pos = (m) => ((Math.log10(m) - LOG_MIN) / (LOG_MAX - LOG_MIN)) * 100;
    el.reveal.innerHTML = `<div class="reveal-bar">
      <div class="row between small">
        <span class="muted">Sənin təxminin <b class="rv-est">${fmtM(est)}</b></span>
        <span class="muted">Real hündürlük <b class="rv-real">${fmtM(it.h)}</b></span>
        <span class="muted">Raund xalı <b class="rv-pts">${pts}/100</b></span>
      </div>
      <div class="bar-track"><i class="bar-fill" style="width:${pos(est)}%"></i><i class="bar-mark" style="left:${pos(it.h)}%"></i></div>
      <p class="small dim" style="margin:0">${SP.esc(it.note)} Şkala loqarifmikdir: 1 m – 20 km.</p></div>`;
    el.next.style.display = "";
    el.next.textContent = round === ROUNDS - 1 ? "Nəticə →" : "Növbəti raund →";
    renderScore();
  });

  el.next.addEventListener("click", () => {
    if (round < ROUNDS - 1) {
      round++;
      draw();
      return;
    }
    const total = results.reduce((a, b) => a + b, 0);
    SP.addResult("olcu", Math.round(total / 5), { total });
    scene = null;
    el.stage.innerHTML = `<div class="sz-end">
      <p class="eyebrow">5 raund bitdi</p>
      <h2>${total} <small>/ 500 xal</small></h2>
      <p class="muted small">Komanda cədvəlinə +${Math.round(total / 5)} xal əlavə olundu.</p>
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

  el.sliderTicks.innerHTML = [1, 10, 100, 1000, 3000, 10000, LIMIT]
    .map((m) => `<i style="left:${mToSlider(m) / 10}%">${fmtM(m)}</i>`).join("");
  el.others.innerHTML = SP.GAMES.filter((g) => g.key !== "olcu")
    .map((g) => `<a class="btn btn-sm btn-ghost" href="${g.href}">${SP.icon(g.icon)} ${g.title}</a>`).join("");

  newGame();
})();

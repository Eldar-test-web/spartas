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

  /* rəqəm: 100 vahid hündürlük = 1,7 m, en 28 vahid = 0,48 m (çiyin eni).
     Anatomik nisbətlər: baş ≈ 13 vahid, gövdə ≈ 32, ayaqlar ≈ 50. */
  const PERSON_VB = 28;
  const PERSON_SVG = `<circle cx="14" cy="7" r="6.4"/>
    <rect x="12.2" y="12" width="3.6" height="4"/>
    <path d="M6.5 19 Q14 14 21.5 19 L20 44 L8 44 Z"/>
    <path d="M6.5 19 L3 38 L5.4 39 L9 24 Z"/><path d="M21.5 19 L25 38 L22.6 39 L19 24 Z"/>
    <path d="M8.4 44 L12.6 44 L11.6 70 L8.6 70 Z"/><path d="M15.4 44 L19.6 44 L19.4 70 L16.4 70 Z"/>
    <path d="M8.2 70 L12 70 L11.6 100 L7.6 100 Z"/><path d="M16 70 L19.8 70 L20.4 100 L16.4 100 Z"/>
    <circle class="fine" cx="11.6" cy="6.4" r=".8" fill="#03110a"/><circle class="fine" cx="16.4" cy="6.4" r=".8" fill="#03110a"/>`;

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

  /* ============================================================
     PROSEDURAL OBYEKT GENERATORU
     Hər oyun üçün yeni təsadüfi toxum (seed) → milyonlarla kombinasiya.
     10 kateqoriya × parametrik siluet × loqarifmik hündürlük.
     Real abidələr də qorunur (təxminən 35% ehtimalla qarışır).
     ============================================================ */
  function rng(a) {
    a = a >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const CATALOG = [
    /* 1 — Göydələn: pilləli korpus, sıx pəncərə şəbəkəsi, giriş və şpill */
    { id: "goydelen", name: "Göydələn", min: 40, max: 450, make(r) {
      const w = 26 + r() * 18, tx = 28 + r() * 22;
      const bx = (100 - w) / 2, t0 = (100 - tx) / 2;
      const s1 = 36 + r() * 12, s2 = 18 + r() * 10, sp = 4 + r() * 8;
      const cols = 4 + Math.floor(r() * 3);
      let win = "";
      const band = (x0, x1, y0, y1, step, n) => {
        for (let y = y0; y < y1; y += step) for (let c = 0; c < n; c++) {
          const wx = x0 + c * ((x1 - x0) / n);
          win += `<rect class="fine" x="${wx.toFixed(1)}" y="${y.toFixed(1)}" width="${((x1 - x0) / n * 0.58).toFixed(1)}" height="${(step * 0.52).toFixed(1)}" fill="#03110a"/>`;
        }
      };
      band(t0 + 1, t0 + tx - 1, sp + 5, s2 - 2, 3.2, cols);
      band(t0 - 2, t0 + tx + 2, s2 + 3, s1 - 2, 3.5, cols + 1);
      band(bx + 1.5, bx + w - 1.5, s1 + 3, 97, 4.2, cols + 2);
      const body = `M${bx.toFixed(1)} 100 L${bx.toFixed(1)} ${s1.toFixed(1)} ` +
        `L${(t0 - 2).toFixed(1)} ${s1.toFixed(1)} L${(t0 - 2).toFixed(1)} ${s2.toFixed(1)} ` +
        `L${t0.toFixed(1)} ${s2.toFixed(1)} L${t0.toFixed(1)} ${(sp + 4).toFixed(1)} ` +
        `L${(50 - 2).toFixed(1)} ${(sp + 4).toFixed(1)} L50 ${sp.toFixed(1)} L${(50 + 2).toFixed(1)} ${(sp + 4).toFixed(1)} ` +
        `L${(t0 + tx).toFixed(1)} ${(sp + 4).toFixed(1)} L${(t0 + tx).toFixed(1)} ${s2.toFixed(1)} ` +
        `L${(t0 + tx + 2).toFixed(1)} ${s2.toFixed(1)} L${(t0 + tx + 2).toFixed(1)} ${s1.toFixed(1)} ` +
        `L${(bx + w).toFixed(1)} ${s1.toFixed(1)} L${(bx + w).toFixed(1)} 100 Z`;
      return { vb: 100, svg: `<path d="${body}"/>${win}` +
        `<rect class="fine" x="49" y="91" width="2" height="9" fill="#03110a"/>` +
        `<path class="fine" d="M${bx.toFixed(1)} ${s1.toFixed(1)} h${w.toFixed(1)}" stroke="#03110a" stroke-width=".7" fill="none"/>` };
    } },

    /* 2 — Müşahidə qülləsi: kafes konstruksiya, iki meydançalı, anten */
    { id: "qulle", name: "Müşahidə qülləsi", min: 25, max: 380, make(r) {
      const foot = 34 + r() * 22, neck = 8 + r() * 8;
      const d1 = 30 + r() * 12, d2 = 14 + r() * 10;
      const f0 = 50 - foot / 2, f1 = 50 + foot / 2, n0 = 50 - neck / 2, n1 = 50 + neck / 2;
      let braces = "";
      for (let y = 96; y > d1; y -= 8) {
        const t = (y - d1) / (96 - d1);
        const l = f0 + t * (n0 - f0), rr = f1 + t * (n1 - f1);
        braces += `<path class="fine" d="M${l.toFixed(1)} ${y} L${rr.toFixed(1)} ${(y - 8).toFixed(1)} M${rr.toFixed(1)} ${y} L${l.toFixed(1)} ${(y - 8).toFixed(1)}" stroke="#03110a" stroke-width=".8" fill="none"/>`;
      }
      const rail = (y, x0, x1) => `<rect x="${(x0 - 3).toFixed(1)}" y="${y}" width="${(x1 - x0 + 6).toFixed(1)}" height="2.4"/>` +
        `<path class="fine" d="M${(x0 - 2).toFixed(1)} ${y + 4} h${(x1 - x0 + 4).toFixed(1)}" stroke="currentColor" stroke-width=".7" fill="none"/>`;
      return { vb: 100, svg:
        `<path d="M${f0.toFixed(1)} 100 L${n0.toFixed(1)} ${d2.toFixed(1)} L${n1.toFixed(1)} ${d2.toFixed(1)} L${f1.toFixed(1)} 100 Z"/>` +
        braces + rail(d1, n0, n1) + rail(d2, n0 - 2, n1 + 2) +
        `<rect x="${(50 - 1).toFixed(1)}" y="2" width="2" height="${(d2 - 2).toFixed(1)}"/>` +
        `<path class="fine" d="M50 0 L${(50 + 4).toFixed(1)} 6 L${(50 - 4).toFixed(1)} 6 Z"/>` };
    } },

    /* 3 — Nəhəng ağac: köklər, gövdə, budaqlar, 12 tac topası, yarpaq detalları */
    { id: "agac", name: "Nəhəng ağac", min: 8, max: 95, make(r) {
      const tw = 3 + r() * 3, cw = 40 + r() * 36, ch = 46 + r() * 26;
      const cx = 50 + (r() - 0.5) * 6, cy = 100 - ch;
      const roots = `<path d="M${(cx - tw / 2).toFixed(1)} 100 L${(cx - tw).toFixed(1)} 96 L${(cx - tw / 2).toFixed(1)} 98 L${(cx + tw / 2).toFixed(1)} 98 L${(cx + tw).toFixed(1)} 96 L${(cx + tw / 2).toFixed(1)} 100 Z"/>`;
      let branch = "", canopy = "", leaf = "";
      const arms = 4 + Math.floor(r() * 3);
      for (let i = 0; i < arms; i++) {
        const a = (i / arms) * Math.PI * 2 + r() * 0.4;
        const ex = cx + Math.cos(a) * cw * 0.34, ey = cy + ch * 0.38 + Math.sin(a) * ch * 0.16;
        branch += `<path class="fine" d="M${cx.toFixed(1)} ${(cy + ch * 0.62).toFixed(1)} Q${((cx + ex) / 2).toFixed(1)} ${(ey - 6).toFixed(1)} ${ex.toFixed(1)} ${ey.toFixed(1)}" stroke="#03110a" stroke-width="${(0.9 + r()).toFixed(1)}" fill="none"/>`;
      }
      const lobes = 10 + Math.floor(r() * 5);
      for (let i = 0; i < lobes; i++) {
        const a = (i / lobes) * Math.PI * 2;
        const lx = cx + Math.cos(a) * cw * 0.3 + (r() - 0.5) * 6;
        const ly = cy + ch * 0.4 + Math.sin(a) * ch * 0.22;
        const lr = cw * (0.14 + r() * 0.12);
        canopy += `<ellipse cx="${lx.toFixed(1)}" cy="${ly.toFixed(1)}" rx="${lr.toFixed(1)}" ry="${(lr * 0.8).toFixed(1)}"/>`;
        for (let k = 0; k < 3; k++)
          leaf += `<circle class="fine" cx="${(lx + (r() - 0.5) * lr).toFixed(1)}" cy="${(ly + (r() - 0.5) * lr * 0.7).toFixed(1)}" r="${(0.5 + r() * 0.7).toFixed(1)}" fill="#03110a"/>`;
      }
      return { vb: 100, svg:
        roots + `<path d="M${(cx - tw / 2).toFixed(1)} 100 L${(cx - tw * 0.32).toFixed(1)} ${(cy + ch * 0.5).toFixed(1)} L${(cx + tw * 0.32).toFixed(1)} ${(cy + ch * 0.5).toFixed(1)} L${(cx + tw / 2).toFixed(1)} 100 Z"/>` +
        branch + canopy + leaf };
    } },

    /* 4 — Dağ: üç zirvə, qar xətti (tək-tük dişli), qaya cizgiləri */
    { id: "dag", name: "Dağ zirvəsi", min: 30, max: 480, make(r) {
      const p = 20 + r() * 60, py = 6 + r() * 20, p2 = 8 + r() * 20, py2 = 26 + r() * 22;
      const snow = `M${(p - 8).toFixed(1)} ${(py + 11).toFixed(1)} l3 -2 l2 3 l3 -3 l2 3 l3 -2 l2 3 l3 -2 l2 3 l3 -2 L${(p + 9).toFixed(1)} ${(py + 11).toFixed(1)} Z`;
      let rock = "";
      for (let i = 0; i < 5; i++) {
        const x = p - 12 + r() * 24, y = py + 16 + r() * 40;
        rock += `<path class="fine" d="M${x.toFixed(1)} ${y.toFixed(1)} l${(-3 - r() * 5).toFixed(1)} ${(6 + r() * 8).toFixed(1)}" stroke="#03110a" stroke-width=".7" fill="none"/>`;
      }
      return { vb: 100, svg:
        `<path d="M0 100 L${p2.toFixed(1)} ${py2.toFixed(1)} L${((p2 + p) / 2).toFixed(1)} ${(py2 + 16).toFixed(1)} L${p.toFixed(1)} ${py.toFixed(1)} L${(p + 12 + r() * 16).toFixed(1)} 100 Z"/>` +
        `<path class="fine" d="${snow}" fill="#dff3e8" opacity=".85"/>` + rock +
        `<path d="M0 100 L${(18 + r() * 12).toFixed(1)} ${(68 + r() * 12).toFixed(1)} L${(38 + r() * 10).toFixed(1)} 100 Z" opacity=".5"/>` };
    } },

    /* 5 — Viyadük: dairəvi tağlar, dayaqlar, korkuluq dirəkləri */
    { id: "viyaduk", name: "Viyadük körpüsü", min: 12, max: 130, make(r) {
      const n = 3 + Math.floor(r() * 5), aw = 90 / n, deck = 24 + r() * 16, arch = deck + aw * 0.45;
      let a = "";
      for (let i = 0; i < n; i++) {
        const x0 = 5 + i * aw;
        a += `<path d="M${x0.toFixed(1)} 100 L${x0.toFixed(1)} ${arch.toFixed(1)} ` +
          `A ${(aw / 2).toFixed(1)} ${(aw / 2).toFixed(1)} 0 0 1 ${(x0 + aw).toFixed(1)} ${arch.toFixed(1)} L${(x0 + aw).toFixed(1)} 100 Z"/>`;
        a += `<path class="fine" d="M${x0.toFixed(1)} ${arch.toFixed(1)} A ${(aw / 2 - 1.5).toFixed(1)} ${(aw / 2 - 1.5).toFixed(1)} 0 0 1 ${(x0 + aw).toFixed(1)} ${arch.toFixed(1)}" stroke="#03110a" stroke-width=".8" fill="none"/>`;
      }
      let posts = "";
      for (let x = 6; x < 96; x += 5) posts += `<rect class="fine" x="${x.toFixed(1)}" y="${(deck - 6).toFixed(1)}" width=".9" height="5"/>`;
      return { vb: 100, svg:
        `<rect x="3" y="${deck.toFixed(1)}" width="94" height="${(arch - deck + 2).toFixed(1)}"/>` +
        `<rect x="3" y="${(deck - 7).toFixed(1)}" width="94" height="2"/>` + posts + a };
    } },

    /* 6 — Yelkənli gəmi: əyri gövdə, 3 dor, dolmuş yelkənlər, takelaj, bayraq */
    { id: "gemi", name: "Yelkənli gəmi", min: 10, max: 80, make(r) {
      const m = 2 + Math.floor(r() * 2), hullY = 74 + r() * 6;
      let mast = "", sail = "", rig = "";
      for (let i = 0; i < m; i++) {
        const x = 26 + i * (48 / Math.max(1, m - 1)), top = 14 + r() * 12;
        mast += `<rect x="${(x - 0.8).toFixed(1)}" y="${top.toFixed(1)}" width="1.6" height="${(hullY - top).toFixed(1)}"/>` +
          `<path class="fine" d="M${(x - 8).toFixed(1)} ${(top + 6).toFixed(1)} h16" stroke="currentColor" stroke-width="1" fill="none"/>`;
        const sw = 12 + r() * 8;
        sail += `<path d="M${(x + 1).toFixed(1)} ${(top + 7).toFixed(1)} Q${(x + sw).toFixed(1)} ${((top + hullY) / 2).toFixed(1)} ${(x + 1).toFixed(1)} ${(hullY - 8).toFixed(1)} Z" opacity=".9"/>` +
          `<path class="fine" d="M${(x + 1).toFixed(1)} ${(top + 7).toFixed(1)} Q${(x + sw * 0.55).toFixed(1)} ${((top + hullY) / 2).toFixed(1)} ${(x + 1).toFixed(1)} ${(hullY - 8).toFixed(1)}" stroke="#03110a" stroke-width=".6" fill="none"/>`;
        rig += `<path class="fine" d="M${(x + 1).toFixed(1)} ${top.toFixed(1)} L${(x + 16).toFixed(1)} ${hullY.toFixed(1)} M${(x + 1).toFixed(1)} ${top.toFixed(1)} L${(x - 12).toFixed(1)} ${hullY.toFixed(1)}" stroke="#03110a" stroke-width=".5" fill="none"/>`;
      }
      let ports = "";
      for (let x = 18; x < 84; x += 9) ports += `<circle class="fine" cx="${x}" cy="${(hullY + 8).toFixed(1)}" r="1"/>`;
      return { vb: 100, svg:
        `<path d="M6 ${hullY.toFixed(1)} Q50 ${(hullY + 6).toFixed(1)} 94 ${hullY.toFixed(1)} L84 ${(hullY + 20).toFixed(1)} Q50 ${(hullY + 26).toFixed(1)} 16 ${(hullY + 20).toFixed(1)} Z"/>` +
        sail + mast + rig + ports +
        `<path class="fine" d="M${(26).toFixed(1)} 14 l8 3 l-8 3 Z"/>` };
    } },

    /* 7 — Villa: dam plitkaları, 4 pəncərə (çərçivə+şüşə), giriş, baca */
    { id: "ev", name: "Villa", min: 5, max: 28, make(r) {
      const w = 46 + r() * 32, bx = (100 - w) / 2, rh = 16 + r() * 16, wy = 30 + rh;
      let tiles = "", win = "";
      const slope = (w / 2 + 4) / rh;
      for (let i = 1; i < 6; i++) {
        const y = 30 + (rh / 6) * i, hw = slope * (y - 30);
        tiles += `<path class="fine" d="M${(50 - hw).toFixed(1)} ${y.toFixed(1)} h${(hw * 2).toFixed(1)}" stroke="#03110a" stroke-width=".5" fill="none"/>`;
      }
      for (let c = 0; c < 4; c++) {
        const wx = bx + 4 + c * ((w - 8) / 4);
        win += `<rect x="${wx.toFixed(1)}" y="${(wy + 8).toFixed(1)}" width="${((w - 8) / 4 * 0.6).toFixed(1)}" height="11" fill="#03110a"/>` +
          `<path class="fine" d="M${(wx + (w - 8) / 4 * 0.3).toFixed(1)} ${(wy + 8).toFixed(1)} v11 M${wx.toFixed(1)} ${(wy + 13.5).toFixed(1)} h${((w - 8) / 4 * 0.6).toFixed(1)}" stroke="#9ad9b8" stroke-width=".45" fill="none"/>`;
      }
      return { vb: 100, svg:
        `<rect x="${bx.toFixed(1)}" y="${wy.toFixed(1)}" width="${w.toFixed(1)}" height="${(100 - wy).toFixed(1)}"/>` +
        `<path d="M${(bx - 4).toFixed(1)} ${wy.toFixed(1)} L50 30 L${(bx + w + 4).toFixed(1)} ${wy.toFixed(1)} Z"/>` + tiles + win +
        `<rect x="${(bx + 6).toFixed(1)}" y="26" width="5" height="${(rh - 2).toFixed(1)}"/>` +
        `<rect x="48" y="82" width="7" height="18" fill="#03110a"/>` +
        `<path class="fine" d="M46 100 h11" stroke="#9ad9b8" stroke-width="1" fill="none"/>` };
    } },

    /* 8 — Abidə: pilləli postament, lövhə, insan fiquru (baş, gövdə, əl, paltar) */
    { id: "heykel", name: "Abidə heykəli", min: 4, max: 65, make(r) {
      const raised = r() > 0.5;
      return { vb: 100, svg:
        `<rect x="24" y="94" width="52" height="6"/><rect x="28" y="86" width="44" height="8"/>` +
        `<rect x="33" y="80" width="34" height="6"/>` +
        `<rect class="fine" x="38" y="86" width="24" height="4" rx=".5" fill="#03110a"/>` +
        `<path d="M42 80 Q40 64 43 52 L57 52 Q60 64 58 80 Z"/>` +
        `<path class="fine" d="M50 54 L50 78 M44 62 Q50 66 56 62" stroke="#03110a" stroke-width=".8" fill="none"/>` +
        `<path d="M43 52 Q46 46 44 40 L56 40 Q54 46 57 52 Z"/>` +
        `<circle cx="50" cy="34" r="7"/>` +
        `<path class="fine" d="M46 32 q4 -3 8 0 M48 37 q2 1 4 0" stroke="#03110a" stroke-width=".6" fill="none"/>` +
        (raised
          ? `<path d="M57 44 L70 28 L73 31 L60 48 Z"/><path d="M70 28 l4 -2 l-1 5 Z"/>`
          : `<path d="M43 44 L32 56 L35 59 L46 48 Z"/>`) +
        `<path d="M43 52 L38 64 L42 66 L46 56 Z"/>` };
    } },

    /* 9 — Minarə: çoxbucaqlı gövdə, kəmər naxışları, tağ pəncərələr, şərəfələr, hilal */
    { id: "minare", name: "Minarə", min: 15, max: 140, make(r) {
      const w = 12 + r() * 8, bx = 50 - w / 2, bal = 2 + Math.floor(r() * 2);
      let b = "";
      for (let i = 0; i < bal; i++) {
        const y = 30 + i * ((52 - 14) / bal);
        b += `<rect x="${(bx - 4).toFixed(1)}" y="${y.toFixed(1)}" width="${(w + 8).toFixed(1)}" height="2.6"/>` +
          `<path class="fine" d="M${(bx - 3).toFixed(1)} ${(y + 5).toFixed(1)} h${(w + 6).toFixed(1)}" stroke="#03110a" stroke-width=".6" fill="none"/>`;
      }
      let bands = "";
      for (let y = 60; y < 96; y += 9) bands += `<path class="fine" d="M${bx.toFixed(1)} ${y} h${w.toFixed(1)}" stroke="#03110a" stroke-width=".6" fill="none"/>`;
      let archwin = "";
      for (let y = 64; y < 92; y += 14) archwin += `<path class="fine" d="M${(50 - 1.6).toFixed(1)} ${y + 5} v-3 a1.6 1.6 0 0 1 3.2 0 v3 Z" fill="#03110a"/>`;
      return { vb: 100, svg:
        `<rect x="${(bx - 3).toFixed(1)}" y="94" width="${(w + 6).toFixed(1)}" height="6"/>` +
        `<path d="M${bx.toFixed(1)} 94 L${bx.toFixed(1)} 14 L${(bx + w).toFixed(1)} 14 L${(bx + w).toFixed(1)} 94 Z"/>` +
        bands + archwin + b +
        `<path d="M${(bx - 5).toFixed(1)} 14 L50 2 L${(bx + w + 5).toFixed(1)} 14 Z"/>` +
        `<path class="fine" d="M50 2 v-2 M50 0 a2 2 0 0 1 0 4 a2 2 0 0 0 0 -4 Z" fill="#03110a" stroke="none"/>` };
    } },

    /* 10 — Zavod: dişli dam, 3 baca (zolaqlı), pəncərə cərgəsi, su çəni */
    { id: "fabrika", name: "Sənaye zavodu", min: 12, max: 110, make(r) {
      const w = 54 + r() * 28, bx = 50 - w / 2, hall = 52 + r() * 10;
      let teeth = "";
      for (let x = bx; x < bx + w - 6; x += 12)
        teeth += `<path d="M${x.toFixed(1)} ${hall.toFixed(1)} L${(x + 6).toFixed(1)} ${(hall - 9).toFixed(1)} L${(x + 12).toFixed(1)} ${hall.toFixed(1)} Z"/>`;
      let chim = "";
      for (let i = 0; i < 3; i++) {
        const x = bx + 8 + i * ((w - 16) / 2), y = 8 + r() * 16;
        chim += `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="7" height="${(hall - y).toFixed(1)}"/>` +
          `<path class="fine" d="M${x.toFixed(1)} ${(y + 8).toFixed(1)} h7 M${x.toFixed(1)} ${(y + 16).toFixed(1)} h7" stroke="#03110a" stroke-width=".8" fill="none"/>`;
      }
      let win = "";
      for (let x = bx + 4; x < bx + w - 4; x += 8)
        win += `<rect class="fine" x="${x.toFixed(1)}" y="${(hall + 8).toFixed(1)}" width="4" height="10" fill="#03110a"/>`;
      return { vb: 100, svg:
        chim + `<rect x="${bx.toFixed(1)}" y="${hall.toFixed(1)}" width="${w.toFixed(1)}" height="${(100 - hall).toFixed(1)}"/>` +
        teeth + win +
        `<path class="fine" d="M${(bx + w * 0.6).toFixed(1)} ${(hall - 9).toFixed(1)} h16 v-10 h-16 Z" fill="none" stroke="currentColor" stroke-width=".8"/>` +
        `<path class="fine" d="M${(bx + w * 0.6 + 8).toFixed(1)} ${(hall - 19).toFixed(1)} v-8" stroke="currentColor" stroke-width=".8"/>` };
    } }
  ];

  const EPITHETS = ["Böyük", "Qədim", "Yeni", "Şərq", "Qərb", "Zirvə", "Dəniz", "Günəş", "Ulduz",
    "Səhər", "Zəfər", "Abad", "Müqəddəs", "Məşhur", "Yüksək", "Səssiz", "Əfsanəvi", "Möhtəşəm"];

  function makeItem(seed, i) {
    const r = rng((seed + i * 2654435761) >>> 0);
    /* təxminən 35% real abidə, 65% prosedural obyekt */
    if (r() < 0.35 && SP.SIZES.length) {
      const real = SP.SIZES[Math.floor(r() * SP.SIZES.length)];
      if (SHAPES[real.id]) {
        const base = SHAPES[real.id];
        /* real abidənin üzərinə yaxınlaşmada görünən memarlıq xətləri */
        let detail = "";
        const w = base.vb, sw = Math.max(0.15, w / 140).toFixed(2);
        for (let y = 16; y < 96; y += 11)
          detail += `<path class="fine" d="M0 ${y} H${w}" stroke="#03110a" stroke-width="${sw}" fill="none" opacity=".55"/>`;
        for (let x = 12; x < w; x += Math.max(12, w / 6))
          detail += `<path class="fine" d="M${x.toFixed(1)} 0 V100" stroke="#03110a" stroke-width="${sw}" fill="none" opacity=".35"/>`;
        return { ...real, id: `real_${seed}_${i}`, shape: { ...base, svg: base.svg + detail } };
      }
    }
    const cat = CATALOG[Math.floor(r() * CATALOG.length)];
    const h = Math.round(cat.min * Math.pow(cat.max / cat.min, r()) * 10) / 10;
    const name = EPITHETS[Math.floor(r() * EPITHETS.length)] + " " + cat.name;
    return { id: `gen_${seed}_${i}`, name, h, note: `${name} — təqribən ${fmtM(h)} hündürlükdə.`, shape: cat.make(r, h) };
  }

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
    /* hər oyun üçün tam yeni, təsadüfi toxum — eyni obyektləri bir daha görməyəcəksən */
    seed = (Date.now() ^ Math.floor(Math.random() * 0x7fffffff)) >>> 0;
    items = Array.from({ length: ROUNDS }, (_, i) => makeItem(seed, i));
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
    const it = items[round], sh = it.shape || SHAPES[it.id];
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

    const body = `<g data-zoom transform="translate(${-(sh.x0 || 0)} 0)">${sh.svg}</g>`;
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
      <div class="sz-zoom" data-zoomlab>🔍 1.0×</div>
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
      zoomlab: el.stage.querySelector("[data-zoomlab]"),
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

    /* KAMERA EFFEKTİ: obyekt real miqyasda durur, təxmini kiçiltdikcə
       kamera ona yaxınlaşır və ekranda 10×-ə qədər böyüyür.
       Pəncərə, kərpic, yarpaq və qaya cizgiləri yalnız yaxınlıqda görünür. */
    const z = clamp(est / top, 0, 1);
    const zoom = locked ? 1 : 1 + Math.pow(1 - z, 1.25) * 9;   // 1× … 10×
    const objH = Math.min(it.h * k * zoom, usableH);
    const objW = clamp((sh.vb / 100) * it.h * k * zoom, MIN_W, usableW - 4);
    const objLeft = centerX - objW / 2;
    scene.obj.style.cssText = `left:${objLeft.toFixed(1)}px;width:${objW.toFixed(1)}px;height:${objH.toFixed(1)}px`;

    const g = scene.obj.querySelector("[data-zoom]");
    if (g) g.setAttribute("transform", `translate(${-(sh.x0 || 0)} 0)`);
    el.stage.style.setProperty("--detail", locked ? "1" : clamp((zoom - 1) / 9, 0, 1).toFixed(3));
    if (scene.zoomlab) scene.zoomlab.textContent = `🔍 ${zoom.toFixed(1)}×`;
    scene.obj.classList.toggle("is-zoomed", zoom > 3 && !locked);
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

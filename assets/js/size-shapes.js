/* Ölçü Tahmini üçün ortaq siluet kitabxanası.
   Hər SVG 100 vahid hündürlüyə malikdir; vb enin hündürlüyə nisbətidir.
   Bütün formalar currentColor ilə doldurulur, kiçik detallar eyni rəngin
   şəffaf təbəqələridir. Oyun və qalereya eyni mənbəni istifadə edir. */
(() => {
  const S = (vb, svg, x0 = 0) => {
    /* Brauzer hər siluetin real sərhədlərini ölçüb 100 vahid hündürlüyə
       normallaşdırır. Beləliklə antena, boynuz və qanad kənarları kəsilmir. */
    if (typeof document !== "undefined" && document.body) {
      /* Ayıq SVG-də getBBox boş qayıdır; ölçmə üçün onu ekrandan kənarda
         render edir, sonra dərhal silirik. Stroke hüdudları da nəzərə alınır. */
      const probe = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      probe.innerHTML = svg;
      probe.style.cssText = "position:absolute;left:-10000px;top:0;width:1000px;height:1000px;overflow:visible;opacity:0;pointer-events:none";
      document.body.appendChild(probe);
      try {
        const box = probe.getBBox({ stroke: true });
        if (box.width > 0 && box.height > 0) {
          const pad = 2, scale = 100 / (box.height + pad * 2);
          const width = (box.width + pad * 2) * scale;
          const tx = -box.x * scale + pad * scale, ty = -box.y * scale + pad * scale;
          return { vb: +width.toFixed(3), x0: 0, svg: `<g transform="translate(${tx.toFixed(3)} ${ty.toFixed(3)}) scale(${scale.toFixed(5)})">${svg}</g>` };
        }
      } finally {
        probe.remove();
      }
    }
    return { vb, svg, x0 };
  };
  const win = (x, y, w, h, o = .3) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" opacity="${o}"/>`;
  const circ = (x, y, r, o = .3) => `<circle cx="${x}" y="${y}" r="${r}" opacity="${o}"/>`;
  const legs = (xs, y = 72, h = 28, w = 5) => xs.map(x => `<path d="M${x} ${y} h${w} l${x > 50 ? -1 : 1} ${h} h-${w + 1} z"/>`).join("");
  const tower = (vb, base, shaft, top = "", bands = 0, x = 0, y = 0) => {
    let rows = "";
    for (let i = 0; i < bands; i++) rows += win(vb * .22, 66 - i * 12, vb * .56, 2, .22);
    return S(vb, `<path d="${base}"/>${shaft ? `<path d="${shaft}"/>` : ""}${top}${rows}`);
  };

  /* Quşlar: ayaq uzunluğu, baş və boyun xətti hər növ üçün fərqlidir. */
  const flightless = (vb, neck, head, extras = "", body = "ellipse") => S(vb,
    `${body === "round" ? `<ellipse cx="${vb * .43}" cy="61" rx="${vb * .25}" ry="18"/>` : `<path d="M${vb * .12} 61 Q${vb * .35} 38 ${vb * .64} 52 L${vb * .84} 68 L${vb * .55} 77 L${vb * .19} 73 Z"/>`}
     <path d="${neck}"/>${head}${extras}<path d="M${vb * .35} 76 l-2 24 h4 l3-24 z"/><path d="M${vb * .51} 76 l3 24 h4 l-4-24 z"/>
     <path d="M${vb * .28} 100 h${vb * .2} l-3 -4 h-${vb * .16} z"/>`);

  /* Yer heyvanları: ayrıca bədən, boyun, baş, quyruq və ayaqlar. */
  const beast = (vb, body, neck, head, extra = "", lxs = [.26, .36, .65, .76], opts = {}) => {
    const y = opts.legY || 72, h = opts.legH || 28, w = opts.legW || 5;
    const ls = lxs.map(x => `<path d="M${(vb * x).toFixed(1)} ${y} h${w} l${opts.bend || 0} ${h} h-${w + 1} z"/>`).join("");
    const bodySvg = body.startsWith("<") ? body : `<path d="${body}"/>`;
    return S(vb, `${bodySvg}${neck ? `<path d="${neck}"/>` : ""}${head}${extra}${ls}${opts.tail || ""}`);
  };

  const highrise = (vb, shaft, crown = "", step = 12, x = .16, w = .68) => {
    let rows = "";
    for (let y = 88; y > 22; y -= step) {
      const t = y / 100, inset = x + Math.max(0, t - .15) * .06;
      rows += win(vb * inset, y, vb * w * Math.max(.45, 1 - t * .4), 1.5, .24);
    }
    return S(vb, `<path d="${shaft}"/>${crown}${rows}`);
  };

  const mountain = (peaks, snow = "") => S(120,
    `<path d="M0 100 L${peaks} L120 100 Z"/>${snow ? `<path d="${snow}" opacity=".28"/>` : ""}`);

  const airliner = (vb, { upper = "none", twinTail = false, engines = 4, highWing = false } = {}) => {
    const positions = engines === 6 ? [.17, .28, .39, .61, .72, .83] : [.27, .39, .62, .74];
    const eng = positions.map(x => `<path d="M${vb * x} 75 v8"/><ellipse cx="${vb * x}" cy="87" rx="${vb * .028}" ry="7"/>`).join("");
    const deck = upper === "hump"
      ? `<path d="M${vb * .06} 57 Q${vb * .1} 42 ${vb * .23} 40 H${vb * .34} Q${vb * .4} 43 ${vb * .42} 55 Z"/>`
      : upper === "full" ? `<path d="M${vb * .1} 57 Q${vb * .16} 41 ${vb * .31} 40 H${vb * .7} Q${vb * .81} 42 ${vb * .88} 56 Z"/>` : "";
    const tail = twinTail
      ? `<path d="M${vb * .79} 60 L${vb * .84} 19 L${vb * .88} 19 L${vb * .93} 60 Z"/><path d="M${vb * .86} 60 L${vb * .91} 23 L${vb * .95} 23 L${vb} 61 Z"/>`
      : `<path d="M${vb * .78} 60 L${vb * .87} 16 L${vb * .92} 16 L${vb * .96} 60 Z"/>`;
    const windows = Math.max(8, Math.floor(vb / 23));
    return S(vb, `<path d="M${vb * .07} 56 Q${vb * .01} 63 ${vb * .07} 70 H${vb * .9} Q${vb * .96} 68 ${vb} 61 L${vb * .97} 55 H${vb * .43} Q${vb * .25} 50 ${vb * .07} 56 Z"/>
      ${deck}${tail}<path d="M${vb * .77} 66 L${vb * .91} 80 H${vb * .84} L${vb * .69} 69 Z"/>
      <path d="M${vb * .27} ${highWing ? 56 : 69} L${vb * .48} ${highWing ? 38 : 43} L${vb * .62} ${highWing ? 40 : 45} L${vb * .43} ${highWing ? 58 : 70} Z"/>
      <path d="M${vb * .34} 71 L${vb * .61} 97 H${vb * .54} L${vb * .23} 73 Z"/>${eng}
      <path d="M${vb * .1} 59 l7 -3 4 3 -7 3 Z" opacity=".55"/>
      ${Array.from({ length: windows }, (_, i) => win(vb * .25 + i * vb * .55 / Math.max(1, windows - 1), 62, Math.max(2, vb * .009), 2, .32)).join("")}`);
  };

  const rocket = (vb, { nose = "cone", boosters = 0, stages = 3, shuttle = false, starship = false, variant = "" } = {}) => {
    const stacks = {
      saturn: `<path d="M${vb * .22} 100 V65 H${vb * .78} V100 Z"/><path d="M${vb * .31} 65 V35 H${vb * .69} V65 Z"/><path d="M${vb * .35} 35 V22 H${vb * .65} V35 Z"/><path d="M${vb * .39} 22 V10 H${vb * .61} V22 Z"/><path d="M${vb * .46} 10 V2 H${vb * .54} V10 Z M${vb * .5} 2 V0" stroke="currentColor" stroke-width="1.2"/>
        <path d="M${vb * .22} 88 L${vb * .1} 100 H${vb * .22} Z M${vb * .78} 88 L${vb * .9} 100 H${vb * .78} Z"/>
        ${[.27, .38, .5, .62, .73].map(x => `<path d="M${vb * (x - .035)} 96 h${vb * .07} l-${vb * .015} 4 h-${vb * .04} Z"/>`).join("")}
        <path d="M${vb * .22} 64 H${vb * .78} M${vb * .31} 35 H${vb * .69} M${vb * .35} 22 H${vb * .65}" stroke="currentColor" stroke-width="2" opacity=".4"/>`,
      falcon: `<path d="M${vb * .28} 100 V29 Q${vb * .28} 23 ${vb * .34} 19 L${vb * .43} 6 Q${vb * .45} 1 ${vb * .5} 0 Q${vb * .55} 1 ${vb * .57} 6 L${vb * .66} 19 Q${vb * .72} 23 ${vb * .72} 29 V100 Z"/>
        <path d="M${vb * .28} 53 H${vb * .72} V60 H${vb * .28} Z" opacity=".45"/><path d="M${vb * .28} 76 L${vb * .16} 94 L${vb * .24} 96 L${vb * .34} 80 M${vb * .72} 76 L${vb * .84} 94 L${vb * .76} 96 L${vb * .66} 80" opacity=".7"/>
        <path d="M${vb * .25} 29 h${vb * .1} M${vb * .65} 29 h${vb * .1} M${vb * .36} 96 H${vb * .64} L${vb * .6} 100 H${vb * .4} Z"/>`,
      soyuz: `<path d="M${vb * .4} 100 V26 Q${vb * .42} 17 ${vb * .47} 13 Q${vb * .5} 4 ${vb * .53} 13 Q${vb * .58} 17 ${vb * .6} 26 V100 Z"/><path d="M${vb * .12} 100 V47 Q${vb * .12} 35 ${vb * .2} 35 Q${vb * .28} 35 ${vb * .28} 47 V100 Z"/><path d="M${vb * .72} 100 V47 Q${vb * .72} 35 ${vb * .8} 35 Q${vb * .88} 35 ${vb * .88} 47 V100 Z"/>
        <path d="M${vb * .12} 88 L${vb * .07} 100 H${vb * .12} Z M${vb * .28} 88 L${vb * .33} 100 H${vb * .28} Z M${vb * .72} 88 L${vb * .67} 100 H${vb * .72} Z M${vb * .88} 88 L${vb * .93} 100 H${vb * .88} Z"/><path d="M${vb * .12} 62 H${vb * .28} M${vb * .72} 62 H${vb * .88} M${vb * .4} 42 H${vb * .6}" stroke="currentColor" stroke-width="2" opacity=".4"/>`,
      ariane: `<path d="M${vb * .38} 100 V16 Q${vb * .5} 3 ${vb * .62} 16 V100 Z"/><path d="M${vb * .1} 100 V45 Q${vb * .1} 34 ${vb * .19} 34 Q${vb * .28} 34 ${vb * .28} 45 V100 Z"/><path d="M${vb * .72} 100 V45 Q${vb * .72} 34 ${vb * .81} 34 Q${vb * .9} 34 ${vb * .9} 45 V100 Z"/>
        <path d="M${vb * .38} 56 H${vb * .62} M${vb * .1} 70 H${vb * .28} M${vb * .72} 70 H${vb * .9}" stroke="currentColor" stroke-width="2" opacity=".4"/><path d="M${vb * .1} 45 Q${vb * .19} 29 ${vb * .28} 45 M${vb * .72} 45 Q${vb * .81} 29 ${vb * .9} 45" opacity=".55"/>`,
      shuttleStack: `<path d="M${vb * .4} 100 V25 Q${vb * .5} 15 ${vb * .6} 25 V100 Z"/><path d="M${vb * .13} 100 V42 L${vb * .19} 29 L${vb * .25} 42 V100 Z"/><path d="M${vb * .75} 100 V42 L${vb * .81} 29 L${vb * .87} 42 V100 Z"/>
        <path d="M${vb * .57} 83 V21 L${vb * .64} 10 L${vb * .72} 8 L${vb * .85} 14 L${vb * .9} 24 L${vb * .82} 32 L${vb * .76} 72 L${vb * .65} 78 Z" opacity=".85"/><path d="M${vb * .66} 70 L${vb * .5} 91 L${vb * .64} 88 L${vb * .81} 70 Z"/><path d="M${vb * .77} 22 L${vb * .82} 3 L${vb * .87} 22 Z"/>
        <path d="M${vb * .13} 58 H${vb * .25} M${vb * .75} 58 H${vb * .87} M${vb * .4} 47 H${vb * .6}" stroke="currentColor" stroke-width="2" opacity=".4"/>`,
      starshipStack: `<path d="M${vb * .18} 100 V44 H${vb * .82} V100 Z"/><path d="M${vb * .28} 44 V14 Q${vb * .3} 7 ${vb * .38} 5 H${vb * .62} Q${vb * .7} 7 ${vb * .72} 14 V44 Z"/>
        <path d="M${vb * .18} 53 L${vb * .05} 61 L${vb * .18} 66 M${vb * .82} 53 L${vb * .95} 61 L${vb * .82} 66 M${vb * .28} 27 L${vb * .16} 34 L${vb * .28} 38 M${vb * .72} 27 L${vb * .84} 34 L${vb * .72} 38" opacity=".8"/>
        <path d="M${vb * .18} 76 H${vb * .82} M${vb * .28} 44 H${vb * .72}" stroke="currentColor" stroke-width="2" opacity=".35"/>`
    };
    if (stacks[variant]) return S(vb, stacks[variant]);
    let s = `<path d="M${vb * .35} 100 L${vb * .38} 29 Q${vb * .5} ${nose === "round" ? 8 : 3} ${vb * .62} 29 L${vb * .65} 100 Z"/>`;
    for (let i = 1; i <= stages; i++) s += `<path d="M${vb * .36} ${100 - i * 20} h${vb * .28} v3 h-${vb * .28} z" opacity=".28"/>`;
    s += `<path d="M${vb * .38} 88 L${vb * .26} 100 H${vb * .38} Z"/><path d="M${vb * .62} 88 L${vb * .74} 100 H${vb * .62} Z"/>`;
    if (boosters) s += `<path d="M${vb * .28} 46 H${vb * .36} L${vb * .34} 100 H${vb * .24} Z"/><path d="M${vb * .64} 46 H${vb * .72} L${vb * .76} 100 H${vb * .66} Z"/><path d="M${vb * .28} 46 L${vb * .32} 35 L${vb * .36} 46 Z"/><path d="M${vb * .64} 46 L${vb * .68} 35 L${vb * .72} 46 Z"/>`;
    if (shuttle) s += `<path d="M${vb * .37} 42 L${vb * .43} 10 L${vb * .58} 10 L${vb * .63} 42 Z"/><path d="M${vb * .43} 30 h${vb * .15} v4 h-${vb * .15} z" opacity=".4"/>`;
    if (starship) s += `<path d="M${vb * .35} 100 L${vb * .38} 30 Q${vb * .5} 20 ${vb * .62} 30 L${vb * .65} 100 Z"/><path d="M${vb * .36} 76 h${vb * .28} v3 h-${vb * .28} z" opacity=".4"/>`;
    return S(vb, s);
  };

  const helicopter = (vb, { twin = false, heavy = false } = {}) => S(vb,
    `<path d="M${vb * .08} 64 L${vb * .38} 55 Q${vb * .53} 44 ${vb * .7} 55 L${vb * .78} 67 L${vb * .55} 76 H${vb * .26} Z"/>
     <path d="M${vb * .69} 63 L${vb * .95} 46 L${vb} 49 L${vb * .82} 70 Z"/><path d="M${vb * .93} 37 v25 M${vb * .86} 49 h14"/>
     <path d="M${vb * .02} 25 H${vb * .65}"/><path d="M${vb * .32} 25 v9"/>${twin ? `<path d="M${vb * .43} 15 H${vb * .9}"/><path d="M${vb * .68} 15 v9"/><path d="M${vb * .82} 60 L${vb * .97} 38 L${vb} 40 L${vb * .9} 66 Z"/>` : ""}
     <path d="M${vb * .23} 76 v12 h${vb * .48} V76 M${vb * .14} 89 h${vb * .66}"/>${heavy ? `<circle cx="${vb * .52}" cy="55" r="11"/><circle cx="${vb * .52}" cy="55" r="4" opacity=".35"/>` : win(vb * .49, 54, vb * .13, 9, .3)}
     <path d="M${vb * .22} 100 h${vb * .55}" opacity=".4"/>`);

  const buddha = (vb, seated = false, halo = false) => {
    const base = `<path d="M${vb * .08} 100 H${vb * .92} V92 H${vb * .08} Z"/><path d="M${vb * .16} 92 H${vb * .84} V85 H${vb * .16} Z"/><path d="M${vb * .2} 85 Q${vb * .5} 76 ${vb * .8} 85 Z"/>`;
    const aura = halo ? `<circle cx="${vb * .5}" cy="26" r="${vb * .17}" opacity=".2"/><circle cx="${vb * .5}" cy="26" r="${vb * .13}" fill="none" stroke="currentColor" stroke-width="2" opacity=".45"/>` : "";
    return S(vb, `${aura}${base}` + (seated
      ? `<path d="M${vb * .3} 84 Q${vb * .18} 74 ${vb * .36} 77 L${vb * .64} 77 Q${vb * .82} 74 ${vb * .7} 84 Z"/><path d="M${vb * .37} 79 Q${vb * .35} 54 ${vb * .5} 51 Q${vb * .65} 54 ${vb * .63} 79 Z"/><circle cx="${vb * .5}" cy="38" r="${vb * .1}"/><path d="M${vb * .45} 29 Q${vb * .5} 14 ${vb * .55} 29 Z"/><path d="M${vb * .4} 61 h${vb * .2} v5 h-${vb * .2} z" opacity=".35"/>`
      : `<path d="M${vb * .39} 85 Q${vb * .32} 65 ${vb * .38} 45 L${vb * .46} 35 H${vb * .54} L${vb * .62} 45 Q${vb * .68} 65 ${vb * .61} 85 Z"/><path d="M${vb * .39} 46 L${vb * .29} 68 L${vb * .35} 71 L${vb * .46} 51 Z"/><path d="M${vb * .61} 46 L${vb * .71} 68 L${vb * .65} 71 L${vb * .54} 51 Z"/><circle cx="${vb * .5}" cy="26" r="${vb * .085}"/><path d="M${vb * .45} 18 Q${vb * .5} 5 ${vb * .55} 18 Z"/><path d="M${vb * .45} 36 H${vb * .55} V43 H${vb * .45} Z"/><path d="M${vb * .43} 53 Q${vb * .5} 58 ${vb * .57} 53 M${vb * .45} 63 V82 M${vb * .55} 63 V82" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".35"/>`));
  };

  const SHAPES = {
    /* Canlılar */
    fil: S(190, `<ellipse cx="89" cy="57" rx="62" ry="33"/><ellipse cx="158" cy="56" rx="29" ry="31"/>
      <path d="M183 68 Q206 84 195 113 L184 111 Q191 89 173 81 Z"/><path d="M169 90 Q184 99 179 111 L170 106 Z" opacity=".75"/>
      <path d="M143 48 Q167 20 185 45 L179 73 L150 72 Z"/><circle cx="174" cy="48" r="2" opacity=".45"/>
      ${legs([47, 75, 115, 145], 78, 22, 14)}<path d="M27 51 Q12 64 15 82 L22 82 Q17 67 34 59 Z"/>
      <path d="M15 82 l5 14 -10 -3 z"/><path d="M41 41 Q29 30 25 37" fill="none" stroke="currentColor" stroke-width="3"/>`),
    zurafe: S(76, `<ellipse cx="28" cy="69" rx="23" ry="14"/><path d="M43 65 L57 9 L68 11 L54 70 Z"/>
      <ellipse cx="68" cy="10" rx="11" ry="7"/><path d="M61 4 L63 0 L66 5 Z"/><path d="M71 4 L75 0 L76 6 Z"/>
      <circle cx="72" cy="9" r="1.4" opacity=".4"/>${legs([14, 27, 41, 50], 78, 22, 4)}<path d="M5 68 Q0 62 3 56 L9 61 Z"/>
      ${[55, 64, 39, 47].map((x, i) => circ(x, 48 + i * 5, 2.2, .24)).join("")}`),
    qutbayisi: beast(112, `M20 73 Q17 43 40 32 L73 30 Q89 24 101 38 L109 71 L90 81 H36 Z`, `M77 37 Q93 14 107 22 L115 47 L103 55 Z`, `<ellipse cx="108" cy="29" rx="15" ry="12"/><circle cx="119" cy="30" r="6"/><circle cx="120" cy="28" r="1" opacity=".4"/><path d="M98 20 q-3 -10 5 -12 q3 9 -5 12 Z"/>`, `<path d="M92 48 Q75 59 73 77 L82 80 Q89 63 101 56 Z"/>`, [.25, .38, .69, .8], { tail: `<path d="M22 52 Q5 43 1 55 Z"/>` }),
    kodiakayi: beast(118, `M17 76 Q13 40 40 31 L78 31 Q103 32 108 52 L105 79 L86 85 H34 Z`, `M81 37 Q101 12 115 27 L122 57 L108 62 Z`, `<ellipse cx="116" cy="35" rx="17" ry="15"/><circle cx="128" cy="40" r="7"/><circle cx="124" cy="33" r="1.2" opacity=".4"/><circle cx="104" cy="22" r="5"/>`, `<path d="M84 51 Q71 66 76 81 L85 80 Q85 65 95 57 Z"/>`, [.23, .36, .68, .81], { tail: `<path d="M20 49 Q4 39 0 52 Z"/>` }),
    afrikabugasi: flightless(55, `M27 70 Q37 48 38 26 Q42 16 48 21 L48 29 Q43 48 42 70 Z`, `<ellipse cx="47" cy="20" rx="7" ry="6"/><path d="M53 18 l10 4 -10 3 Z"/>`, `<path d="M13 62 Q3 50 0 58 L10 71 Z"/>`),
    agtur: beast(140, `M9 73 Q12 38 43 33 L96 37 L116 52 L112 79 L90 83 H32 Z`, `M97 43 L111 21 L123 26 L117 59 Z`, `<ellipse cx="120" cy="29" rx="16" ry="12"/><path d="M111 18 Q105 -1 113 0 Q123 5 122 19 Z"/><path d="M126 19 Q137 0 141 7 Q142 17 132 23 Z"/>`, `<path d="M25 42 Q0 31 0 51 L12 67 L22 63 L11 53 L30 56 Z"/>`, [.22, .35, .71, .84]),
    rinoceros: beast(167, `M7 75 Q11 39 44 34 L112 39 L136 58 L132 82 L104 84 H28 Z`, `M117 48 L132 25 L148 35 L143 67 Z`, `<path d="M133 28 L137 2 L143 17 L151 6 L151 34 Z"/><path d="M143 42 Q164 41 167 31 L169 34 Q164 53 145 52 Z"/>`, `<path d="M23 43 Q3 32 0 46 L11 60 L22 57 L10 49 L29 52 Z"/>`, [.18, .32, .7, .84], { tail: `<path d="M8 61 Q0 70 1 82"/>` }),
    subugasi: beast(154, `M7 76 Q12 43 39 35 L112 42 L134 63 L128 83 L103 84 H29 Z`, `M116 51 L133 25 L150 39 L142 70 Z`, `<ellipse cx="143" cy="37" rx="18" ry="13"/><circle cx="149" cy="29" r="4"/><circle cx="159" cy="35" r="2" opacity=".35"/>`, `<path d="M22 48 Q5 35 0 49 L13 63 L23 60 L12 51 L32 56 Z"/>`, [.18, .32, .68, .82]),
    gaur: beast(151, `M9 74 Q12 43 39 35 L100 38 L126 58 L123 82 L100 84 H30 Z`, `M107 49 L121 23 L138 32 L133 67 Z`, `<path d="M117 24 Q107 5 116 0 Q126 5 127 24 Z"/><path d="M133 28 Q142 8 151 14 Q154 24 140 36 Z"/>`, `<path d="M101 52 Q84 75 88 85 L100 81 Q96 69 113 59 Z"/><path d="M29 39 Q19 58 27 74 L38 71 L35 51 Z"/>`, [.2, .34, .69, .82]),
    yak: beast(143, `<path d="M5 84 Q8 39 41 32 L106 38 L130 59 L124 100 L13 100 Z"/><path d="M16 69 l8 -14 8 11 9 -18 8 15 11 -16 8 15 11 -15 8 14 10 -15 8 18 11 -13 7 24 Z"/>`, `M109 47 L123 23 L138 34 L132 69 Z`, `<ellipse cx="137" cy="34" rx="17" ry="13"/><path d="M124 26 Q102 16 106 2 Q121 8 132 20 Z"/><path d="M139 22 Q147 0 158 5 Q162 18 147 29 Z"/>`, `<path d="M21 45 Q3 35 0 50 L11 66 L22 62 L10 52 L31 57 Z"/>`, [.2, .35, .7, .84]),
    ikihoruzludeve: beast(180, `M10 78 Q16 48 47 46 L95 47 L124 57 L137 80 L121 86 H27 Z`, `M121 61 Q134 24 151 23 L164 44 L153 73 Z`, `<ellipse cx="157" cy="31" rx="17" ry="11"/><path d="M148 21 q-3 -13 5 -14 q5 11 -5 14 Z"/><circle cx="165" cy="29" r="1.5" opacity=".4"/>`, `<path d="M61 48 Q48 17 72 19 Q93 22 91 49 Z"/><path d="M91 49 Q89 14 111 20 Q128 26 118 52 Z"/>`, [.2, .34, .69, .84], { tail: `<path d="M13 61 Q0 69 4 86"/>` }),
    deve: beast(169, `M9 78 Q16 48 47 46 L99 47 L126 57 L138 80 L121 86 H27 Z`, `M120 61 Q134 24 151 23 L164 44 L153 73 Z`, `<ellipse cx="157" cy="31" rx="17" ry="11"/><path d="M148 21 q-3 -13 5 -14 q5 11 -5 14 Z"/><circle cx="165" cy="29" r="1.5" opacity=".4"/>`, `<path d="M58 48 Q45 17 69 19 Q91 21 87 49 Z"/>`, [.2, .34, .69, .84], { tail: `<path d="M13 61 Q0 69 4 86"/>` }),
    irlandiyamarali: beast(143, `M15 77 Q18 48 46 45 L105 49 L129 67 L124 84 L103 84 H36 Z`, `M111 55 L126 27 L143 36 L134 72 Z`, `<ellipse cx="139" cy="35" rx="16" ry="11"/><path d="M131 27 L125 12 L132 14 Z"/><path d="M146 26 L151 11 L155 28 Z"/>`, `<path d="M132 29 Q108 23 107 5 L119 0 L117 11 L130 14 L139 1 L145 0 L143 15 L154 9 L160 13 L145 23 L151 34 L137 33 L128 45 L124 39 L128 30 Z"/>`, [.22, .36, .69, .83]),
    los: beast(157, `M12 78 Q18 47 47 42 L105 46 L133 63 L130 84 L106 86 H34 Z`, `M113 55 Q126 25 145 29 L159 50 L148 73 Z`, `<path d="M130 29 Q143 11 165 25 L174 42 Q164 58 143 54 L131 42 Z"/><path d="M135 32 Q112 29 107 7 L118 0 L116 10 L130 15 L138 0 L145 0 L142 15 L155 7 L162 11 L147 25 L153 39 L139 38 L129 50 L124 43 L129 33 Z"/>`, `<path d="M126 57 Q109 72 111 85 L121 84 Q119 71 135 64 Z"/>`, [.21, .35, .69, .83]),
    kenguru: S(98, `<path d="M31 84 Q41 48 62 40 Q82 31 88 50 L81 66 Q75 73 75 84 L67 100 H50 L54 77 L42 100 H27 Q19 75 31 84 Z"/>
      <path d="M73 64 Q91 43 104 32 L113 38 Q99 57 86 75 Z"/><ellipse cx="110" cy="30" rx="13" ry="9"/><path d="M104 23 L105 9 L111 21 Z"/><path d="M117 23 L122 11 L122 27 Z"/>
      <path d="M69 69 Q98 79 97 100 L85 100 Q87 83 65 81 Z"/><path d="M52 59 Q65 70 69 82 L61 85 Q54 73 43 70 Z" opacity=".65"/><circle cx="115" cy="29" r="1.5" opacity=".4"/>`),
    panda: beast(105, `<ellipse cx="51" cy="68" rx="39" ry="28"/>`, `M75 52 Q91 29 105 40 L108 66 L92 72 Z`, `<circle cx="104" cy="38" r="20"/><circle cx="88" cy="20" r="8"/><circle cx="117" cy="21" r="8"/>`, `<ellipse cx="98" cy="38" rx="6" ry="8" opacity=".45"/><ellipse cx="111" cy="38" rx="6" ry="8" opacity=".45"/><ellipse cx="104" cy="49" rx="5" ry="3" opacity=".5"/><ellipse cx="34" cy="62" rx="16" ry="21" opacity=".5"/><ellipse cx="72" cy="68" rx="15" ry="22" opacity=".5"/>`, [.24, .39, .66, .8]),
    goril: S(102, `<ellipse cx="48" cy="63" rx="30" ry="28"/><path d="M28 42 Q40 24 61 34 L72 55 L65 84 L31 85 L20 64 Z"/>
      <circle cx="53" cy="27" r="18"/><path d="M36 18 Q38 3 54 5 Q69 5 72 20 L63 16 L51 13 L43 21 Z"/><ellipse cx="49" cy="30" rx="12" ry="9" opacity=".4"/>
      <path d="M22 51 Q3 64 10 91 L24 97 L34 91 L28 75 L40 66 Z"/><path d="M71 52 Q89 62 86 91 L75 97 L64 91 L71 76 L59 65 Z"/>
      <path d="M29 82 L21 100 H38 L45 84 Z"/><path d="M57 83 L56 100 H74 L68 81 Z"/><path d="M10 91 h14 M72 91 h14" opacity=".5"/>`),
    kasuariya: flightless(69, `M31 72 Q43 49 41 25 Q45 13 52 20 L51 31 Q47 50 46 72 Z`, `<ellipse cx="52" cy="18" rx="9" ry="8"/><path d="M48 11 Q48 -3 59 3 L61 13 Z"/><path d="M60 17 l9 4 -9 3 Z"/>`, `<path d="M12 63 Q0 49 2 66 L14 77 Z"/><path d="M38 43 Q23 32 15 43 L24 57 Z" opacity=".5"/>`, "round"),
    emu: flightless(59, `M28 72 Q39 49 38 24 Q42 13 48 20 L47 31 Q44 51 43 72 Z`, `<ellipse cx="47" cy="19" rx="9" ry="7"/><path d="M54 17 l11 4 -11 3 Z"/>`, `<path d="M11 63 Q0 53 0 65 L12 75 Z"/>`, "round"),
    mamut: S(205, `<ellipse cx="91" cy="60" rx="65" ry="35"/><path d="M141 43 Q180 18 183 52 L177 85 L154 89 L140 68 Z"/><circle cx="168" cy="43" r="2" opacity=".4"/>
      <path d="M159 78 Q183 75 199 48 Q200 81 176 99 Q166 104 157 97 Z"/><path d="M166 85 Q180 81 191 61" fill="none" stroke="currentColor" stroke-width="3" opacity=".7"/>
      <path d="M145 30 Q162 8 181 24 L175 38 L154 45 Z"/><path d="M26 51 Q10 58 12 80 L20 79 Q16 65 34 59 Z"/>
      ${legs([48, 76, 116, 145], 82, 18, 13)}<path d="M31 39 l7 -12 7 10 9 -14 8 12 10 -13 8 12 11 -10 7 15 Z" opacity=".6"/>`),
    mastodon: S(191, `<ellipse cx="85" cy="61" rx="60" ry="33"/><path d="M133 42 Q169 20 175 51 L170 85 L149 89 L135 68 Z"/><circle cx="163" cy="42" r="2" opacity=".4"/>
      <path d="M151 80 Q166 82 180 62 L178 94 Q168 108 153 98 Z"/><path d="M139 31 Q154 10 171 23 L167 41 L146 45 Z"/>
      ${legs([44, 72, 109, 137], 80, 20, 12)}<path d="M24 51 Q8 58 10 80 L17 79 Q14 65 32 59 Z"/><path d="M35 38 l6 -10 7 8 9 -11 7 10 10 -8 7 12 Z" opacity=".55"/>`),
    tiranosaur: S(224, `<path d="M42 75 Q66 44 116 48 L143 34 Q154 15 177 18 L211 27 L219 38 L195 44 L172 42 L157 57 L145 77 L113 83 L67 87 L34 100 L27 87 Z"/>
      <path d="M139 50 Q154 74 184 82 L193 88 L145 83 L119 75 Z"/><path d="M102 78 L96 100 H115 L123 83 Z"/><path d="M133 75 L144 100 H160 L151 69 Z"/>
      <path d="M52 69 Q18 61 3 75 L13 81 L38 80 Z"/><path d="M184 30 l7 -3 7 3 -6 3 Z" opacity=".5"/><path d="M192 41 l19 3 -17 5 Z"/>
      ${[62, 77, 93].map(x => `<path d="M${x} 50 l4 -8 4 9 Z"/>`).join("")}`),
    trikeratops: S(214, `<path d="M27 83 Q36 49 78 44 L143 48 L173 70 L166 91 L133 91 H57 Z"/>
      <path d="M147 54 Q159 25 191 31 L215 45 L209 69 L182 76 L163 67 Z"/><path d="M181 40 Q186 15 199 24 L201 43 Z"/><path d="M206 44 Q231 28 237 43 L224 57 Z"/>
      <path d="M184 68 Q203 74 213 62 L218 68 Q208 86 183 80 Z"/><path d="M160 42 Q147 20 135 34 L141 51 Z"/>
      <path d="M177 67 Q194 52 207 60 L201 70 Z" opacity=".4"/>${legs([55, 82, 127, 151], 82, 18, 12)}<path d="M31 68 Q10 65 4 80 L16 84 Z"/>`),
    stegosaur: S(233, `<path d="M35 79 Q51 52 91 53 L145 58 L175 73 L166 91 L109 88 L65 92 L31 100 Z"/>
      <path d="M164 73 Q188 61 211 71 L229 80 L220 88 L191 83 L173 87 Z"/><path d="M33 70 L12 56 L20 75 Z"/>
      ${[54, 71, 89, 108, 127, 146].map((x, i) => `<path d="M${x} ${55 - i % 2 * 3} l${7 + i % 3} -${20 + i % 2 * 9} l8 ${20 + i % 2 * 9} Z"/>`).join("")}
      ${legs([52, 77, 130, 153], 82, 18, 11)}<path d="M219 82 l10 -8 3 9 -9 6 Z"/>`),
    ankilosavr: S(224, `<path d="M20 83 Q22 49 55 43 L143 46 L178 67 L190 83 L171 96 L38 96 Z"/><path d="M48 49 l9 -11 11 6 10 -13 12 8 12 -13 11 9 12 -12 11 12 11 -8 10 14 Z"/>
      <path d="M170 68 Q198 55 220 75 L216 87 L189 83 Z"/><path d="M215 74 Q236 62 239 79 Q235 95 216 91 Z"/>
      ${legs([48, 74, 139, 163], 84, 16, 12)}${[68, 95, 121, 147].map(x => circ(x, 61, 6, .25)).join("")}<path d="M29 66 L9 57 L16 75 Z"/>`),
    brahiosavr: S(169, `<ellipse cx="68" cy="74" rx="53" ry="24"/><path d="M102 68 Q121 35 126 5 L141 3 Q143 43 122 79 Z"/>
      <ellipse cx="137" cy="8" rx="14" ry="9"/><circle cx="145" cy="6" r="1.5" opacity=".4"/>${legs([34, 56, 85, 105], 87, 13, 14)}
      <path d="M19 69 Q0 64 0 82 L12 84 Z"/><path d="M44 51 Q58 37 80 40" fill="none" stroke="currentColor" stroke-width="4" opacity=".25"/>`),
    ketsalkoatlus: S(154, `<path d="M70 91 L57 62 L42 26 L65 39 L79 70 L94 39 L119 24 L103 63 L89 92 Z"/>
      <path d="M79 68 Q110 60 139 33 L152 40 Q130 82 88 82 Z"/><path d="M79 70 L130 39 L151 46 L94 82 Z" opacity=".6"/>
      <path d="M71 68 L37 34 L20 39 L52 72 Z"/><path d="M47 41 L150 30 L166 35 L52 52 Z"/><path d="M92 62 Q119 66 145 51 L160 54 L103 72 Z"/>
      <path d="M78 89 L65 100 H78 L87 92 Z"/><path d="M87 90 L95 100 H107 L96 88 Z"/>`),

    /* Abidələr */
    sfinxs: S(365, `<path d="M0 100 V65 Q9 45 35 45 L117 49 L200 54 L247 51 L253 25 L272 7 L306 14 L302 47 L315 74 L365 88 V100 Z"/>
      <path d="M251 53 L301 47 L301 56 L250 62 Z" opacity=".35"/><path d="M282 15 L294 20 L282 27 Z" opacity=".4"/><path d="M315 84 h50 v16 h-65 Z"/>`),
    pisa: S(25, `<path d="M4 100 L10 9 L21 9 L26 100 Z"/><rect x="10" y="0" width="11" height="10"/>${[35, 58, 79].map(y => `<path d="M${5 + y * .04} ${y} h${21 - y * .08} v3 h-${21 - y * .08} z" opacity=".35"/>`).join("")}`),
    kolizey: S(394, `<path d="M0 100 V34 Q95 3 194 12 L310 24 L394 51 V100 Z"/><path d="M0 62 L394 80 V88 L0 70 Z" opacity=".35"/>
      ${[20, 38, 56, 74].map((x, i) => `<path d="M${x} ${44 + i * 3} q12 -17 24 0 v25 h-24 Z" opacity=".24"/>`).join("")}${[125, 160, 195, 230, 265, 300, 335].map((x, i) => `<path d="M${x} ${32 + i * 2} q12 -15 24 0 v29 h-24 Z" opacity=".24"/>`).join("")}`),
    tacmahal: S(98, `<rect x="13" y="70" width="72" height="30"/><rect x="34" y="42" width="31" height="30"/><path d="M34 44 C34 23 45 13 49 3 C53 13 64 23 64 44 Z"/><rect x="47" y="0" width="3" height="6"/>
      ${[1, 93].map(x => `<rect x="${x}" y="27" width="4" height="73"/><path d="M${x} 28 l2 -9 2 9 Z"/><path d="M${x} 67 h4 v3 h-4 Z" opacity=".4"/>`).join("")}
      <path d="M41 70 v30 h16 V70 Z" opacity=".35"/><path d="M29 100 v-8 q20 -16 40 0 v8 Z" opacity=".35"/>`),
    piramida: S(166, `<path d="M0 100 L83 4 L166 100 Z"/><path d="M83 4 L58 100 H0 Z" opacity=".4"/><path d="M47 69 L83 30 L109 69 Z" opacity=".2"/>`),
    petra: S(115, `<path d="M0 100 V27 H20 V15 H95 V27 H115 V100 Z"/><path d="M8 100 V38 H107 V100 Z" opacity=".3"/>
      <path d="M22 15 L57 0 L93 15 Z"/>${[29, 47, 65, 83].map(x => `<rect x="${x}" y="34" width="6" height="66"/>`).join("")}<path d="M48 100 V66 q9 -13 18 0 v34 Z" opacity=".5"/>`),
    angkor: S(102, `<path d="M4 100 V70 H98 V100 Z"/><path d="M17 70 V51 H85 V70 Z"/><path d="M28 51 V34 H74 V51 Z"/>
      ${[23, 40, 58, 75].map((x, i) => `<path d="M${x} 35 l5 -${18 + i % 2 * 4} 5 ${18 + i % 2 * 4} Z"/><path d="M${x + 2} 51 v19 h6 V51 Z"/>`).join("")}
      <path d="M47 35 Q51 11 55 35 Z"/><path d="M0 88 Q51 70 102 88 V100 H0 Z" opacity=".35"/>`),
    borobudur: S(112, `<path d="M0 100 V84 H112 V100 Z"/><path d="M8 84 V72 H104 V84 Z"/><path d="M17 72 V59 H95 V72 Z"/><path d="M27 59 V45 H85 V59 Z"/><path d="M36 45 V35 H76 V45 Z"/>
      <rect x="49" y="16" width="14" height="19"/><path d="M49 17 Q56 -1 63 17 Z"/>${[23, 43, 70, 90].map(x => circ(x, 76, 5, .35)).join("")}${[31, 56, 80].map(x => circ(x, 63, 5, .35)).join("")}`),
    chichen: S(112, `<path d="M0 100 V86 H112 V100 Z"/><path d="M7 86 V72 H105 V86 Z"/><path d="M14 72 V58 H98 V72 Z"/><path d="M21 58 V44 H91 V58 Z"/><path d="M28 44 V30 H84 V44 Z"/>
      <rect x="44" y="14" width="24" height="16"/><path d="M47 100 L56 17 H59 L68 100 Z" opacity=".35"/>${[91, 79, 67, 55, 43].map(y => `<path d="M0 ${y} H112" stroke="currentColor" stroke-width="2" opacity=".2"/>`).join("")}`),
    teotihuacan: S(116, `<path d="M0 100 V82 H116 V100 Z"/><path d="M8 82 V65 H108 V82 Z"/><path d="M16 65 V48 H100 V65 Z"/><path d="M24 48 V31 H92 V48 Z"/>
      <rect x="47" y="13" width="22" height="18"/><path d="M49 100 L58 16 L61 100 Z" opacity=".35"/>${[77, 60, 43].map(y => `<path d="M0 ${y} H116" stroke="currentColor" stroke-width="2" opacity=".22"/>`).join("")}`),
    vashington: S(25, `<path d="M0 100 V91 H25 V100 Z"/><path d="M4 91 L8 12 L17 12 L21 91 Z"/><path d="M8 12 L12.5 0 L17 12 Z"/>${[76, 62, 48, 34].map(y => win(6, y, 13, 1.5, .3)).join("")}`),
    brandenburq: S(137, `<path d="M3 100 V28 H134 V100 Z"/><path d="M0 28 H137 V18 H0 Z"/>${[15, 34, 96, 115].map(x => `<rect x="${x}" y="20" width="12" height="80"/>`).join("")}
      ${[33, 52, 71, 90].map(x => `<path d="M${x} 88 V58 q7 -13 14 0 v30 Z" opacity=".35"/>`).join("")}<path d="M48 18 V8 H89 V18 Z"/><circle cx="65" cy="10" r="5"/><path d="M82 9 L99 0 L103 4 L90 14 Z"/>`),
    "zəfertagi": S(115, `<path d="M0 100 V29 H24 V17 H91 V29 H115 V100 Z"/><path d="M39 100 V66 Q57 32 76 66 V100 Z" opacity=".55"/><path d="M0 29 H115" stroke="currentColor" stroke-width="4" opacity=".4"/>
      <path d="M30 22 H85 V13 H30 Z"/>${[33, 80].map(x => `<path d="M${x} 20 v80" stroke="currentColor" stroke-width="3" opacity=".35"/>`).join("")}`),
    gateway: S(102, `<path d="M2 100 V70 Q3 0 51 0 Q99 0 100 70 V100 H82 V68 Q80 19 51 19 Q22 19 20 68 V100 Z"/><path d="M19 73 H83" stroke="currentColor" stroke-width="3" opacity=".3"/>`),
    saqrada: S(79, `<path d="M4 100 V66 H75 V100 Z"/><path d="M14 66 V47 H65 V66 Z"/>${[15, 31, 48, 62].map((x, i) => `<path d="M${x} 48 L${x + 5} ${10 + i % 2 * 7} L${x + 10} 48 Z"/><circle cx="${x + 5}" cy="${16 + i % 2 * 7}" r="3"/>`).join("")}
      <path d="M39 47 V16 L44 0 L49 16 V47 Z"/>${[24, 40, 56].map(x => win(x, 76, 6, 24, .3)).join("")}`),
    ayasofya: S(132, `<path d="M3 100 V75 H129 V100 Z"/><path d="M25 75 V53 Q49 14 76 42 L107 53 V75 Z"/><path d="M49 28 Q60 0 76 19 Q88 8 96 29" opacity=".45"/>
      <rect x="7" y="25" width="7" height="75"/><path d="M7 26 L10.5 8 L14 26 Z"/><rect x="117" y="19" width="7" height="81"/><path d="M117 20 L120.5 2 L124 20 Z"/>`),
    stpeter: S(155, `<path d="M0 100 V79 H155 V100 Z"/><path d="M25 79 V57 H130 V79 Z"/><path d="M46 57 Q49 20 78 9 Q108 20 111 57 Z"/>
      <rect x="74" y="0" width="8" height="10"/><circle cx="78" cy="5" r="3"/><rect x="35" y="42" width="6" height="58"/><path d="M35 43 L38 25 L41 43 Z"/><rect x="114" y="42" width="6" height="58"/><path d="M114 43 L117 25 L120 43 Z"/>`),
    stpaul: S(108, `<path d="M0 100 V75 H108 V100 Z"/><path d="M14 75 V57 H94 V75 Z"/><rect x="34" y="40" width="40" height="20"/><path d="M34 42 Q35 15 54 6 Q73 15 74 42 Z"/>
      <rect x="51" y="0" width="6" height="8"/><circle cx="54" cy="4" r="3"/>${[22, 78].map(x => `<rect x="${x}" y="35" width="8" height="65"/><path d="M${x} 36 l4 -17 4 17 Z"/>`).join("")}`),
    akshardham: S(113, `<path d="M0 100 V76 H113 V100 Z"/><path d="M13 76 V58 H100 V76 Z"/><path d="M27 58 V43 H86 V58 Z"/>
      ${[25, 47, 70, 87].map((x, i) => `<path d="M${x} 44 l6 -${24 + i % 2 * 7} 6 ${24 + i % 2 * 7} Z"/><path d="M${x + 2} 50 h8" stroke="currentColor" stroke-width="2" opacity=".4"/>`).join("")}
      <path d="M48 44 Q56 11 64 44 Z"/>`),
    lotus: S(126, `<path d="M5 100 V84 H121 V100 Z"/><path d="M12 84 Q19 48 63 27 Q107 48 114 84 Z"/><path d="M63 30 Q43 11 28 31 Q43 26 54 43 Z"/><path d="M63 30 Q83 11 98 31 Q83 26 72 43 Z"/>
      <path d="M28 84 Q16 61 7 60 Q18 39 41 38 Z"/><path d="M98 84 Q110 61 119 60 Q108 39 85 38 Z" opacity=".6"/><path d="M44 100 Q45 65 63 49 Q81 65 82 100 Z" opacity=".35"/>`),
    qutub: S(30, `<path d="M0 100 V91 H30 V100 Z"/><path d="M5 91 L9 17 L21 17 L25 91 Z"/><path d="M9 17 Q15 1 21 17 Z"/>
      ${[78, 61, 44, 29].map(y => `<path d="M${3 + y * .04} ${y} h${28 - y * .08} v3 h-${28 - y * .08} z" opacity=".4"/>`).join("")}`),
    hindistangapisi: S(112, `<path d="M0 100 V30 H28 V19 H84 V30 H112 V100 Z"/><path d="M31 100 V60 Q56 25 81 60 V100 Z" opacity=".45"/><path d="M0 31 H112" stroke="currentColor" stroke-width="4" opacity=".4"/>
      <path d="M22 19 Q56 -3 90 19 Z"/>${[19, 35, 75, 91].map(x => win(x, 40, 6, 60, .3)).join("")}`),
    partenon: S(137, `<path d="M0 100 V92 H137 V100 Z"/><path d="M8 91 V39 H129 V91 Z"/><path d="M0 39 L68 5 L137 39 Z"/>
      ${[20, 37, 54, 71, 88, 105].map(x => `<rect x="${x}" y="43" width="9" height="48"/>`).join("")}<path d="M8 89 H129" stroke="currentColor" stroke-width="5" opacity=".4"/>`),
    ateshgah: S(136, `<path d="M0 100 V54 H136 V100 Z"/><path d="M9 54 V42 Q72 4 127 42 V54 Z"/><rect x="57" y="23" width="22" height="16"/><path d="M62 23 V12 H74 V23 Z"/>
      ${[21, 45, 83, 107].map(x => `<path d="M${x} 100 V71 q7 -16 14 0 v29 Z" opacity=".4"/>`).join("")}<path d="M64 100 V74 q4 -10 8 0 v26 Z" opacity=".55"/>`),
    qizqalasi: S(42, `<path d="M2 100 V77 Q2 53 10 37 L20 0 L30 37 Q40 54 40 77 V100 Z"/><path d="M7 78 Q20 65 35 78" fill="none" stroke="currentColor" stroke-width="3" opacity=".4"/>
      ${[54, 74, 89].map(y => win(13, y, 5, 5, .4)).join("")}<path d="M20 0 l4 -7 3 8 Z"/>`),

    /* Binalar */
    bigben: S(15, `<rect x="0" y="94" width="15" height="6"/><path d="M2 94 L3 36 L12 36 L13 94 Z"/><rect x="1.5" y="28" width="12" height="8"/>
      <circle cx="7.5" cy="32" r="3.4" opacity=".35"/><path d="M1.5 28 L3 19 L5 28 Z M10 28 L12 19 L13.5 28 Z"/><path d="M1.5 28 L7.5 14 L13.5 28 Z"/>
      <rect x="5.7" y="8" width="3.6" height="7"/><path d="M5.7 8 L7.5 1 L9.3 8 Z"/><rect x="7.3" y="0" width=".4" height="3"/>
      ${[44, 55, 67, 79].map(y => win(5.3, y, 1.2, 7, .32)).join("")}${[44, 55, 67, 79].map(y => win(8.5, y, 1.2, 7, .32)).join("")}`),
    burc: S(9, `<path d="M.2 100 L.8 78 L1.6 78 L2 60 L2.7 60 L3 42 L3.4 42 L3.5 22 L3.7 8 L3.8 0 L4 8 L4.2 22 L4.5 42 L4.9 42 L5.2 60 L5.9 60 L6.2 78 L7.2 78 L7.6 100 Z"/>`),
    empirestate: highrise(17, `M0 100 V75 H3 V61 H6 V46 H9 V25 H13 V10 H17 V0 H10 V7 H6 V25 H3 V46 H0 Z`, `<path d="M12.5 0 V-6" stroke="currentColor" stroke-width="1"/>`, 10),
    chrysler: highrise(18, `M0 100 V73 H3 V56 H6 V34 H8 V21 H11 V13 H18 V100 Z`, `<path d="M8 21 Q11 3 14 21 Z M9 13 Q11 -4 13 13 Z M10 6 Q11 -9 12 6 Z"/>`, 11),
    onewtc: highrise(15, `M0 100 L1 31 L7.5 0 L14 31 L15 100 Z`, `<path d="M7.5 0 V-7" stroke="currentColor" stroke-width="1"/>`, 10),
    willis: highrise(17, `M0 100 V84 H2 V15 H5 V2 H12 V15 H15 V84 H17 V100 Z`, `<path d="M5 2 V0 M12 2 V0" stroke="currentColor" stroke-width="1.4"/>`, 11),
    santay: S(20, `<path d="M2 100 Q3 54 6 33 Q9 4 14 0 Q19 14 18 44 L17 100 Z"/><path d="M14 0 V-5" stroke="currentColor" stroke-width="1"/>${Array.from({ length: 9 }, (_, i) => `<path d="M${5 + i % 2} ${22 + i * 8} Q11 ${17 + i * 8} ${17 - i % 2} ${22 + i * 8}" fill="none" stroke="currentColor" stroke-width="1" opacity=".24"/>`).join("")}`),
    pingan: highrise(15, `M0 100 L2 31 L6 10 L7.5 0 L9 10 L13 31 L15 100 Z`, `<path d="M7.5 0 V-5" stroke="currentColor" stroke-width="1"/>`, 10),
    merdeka: S(22, `<path d="M0 100 L2 30 L7 4 L11 0 L15 4 L20 30 L22 100 Z"/><path d="M7 4 L11 28 L15 4 Z" opacity=".32"/><path d="M3 35 L11 25 L19 35 M2 50 L11 39 L20 50 M1 65 L11 53 L21 65 M1 80 L11 67 L21 80" fill="none" stroke="currentColor" stroke-width="1" opacity=".35"/><path d="M11 0 V-5" stroke="currentColor"/>`),
    lotte: highrise(19, `M0 100 L2 32 Q5 16 9.5 0 Q14 16 17 32 L19 100 Z`, `<path d="M9.5 0 V-6" stroke="currentColor" stroke-width="1"/>`, 10),
    taipei: S(20, `<path d="M0 100 V88 H20 V100 Z"/><path d="M2 88 V75 H18 V88 Z"/><path d="M4 75 V62 H16 V75 Z"/><path d="M5 62 V50 H15 V62 Z"/><path d="M6 50 V38 H14 V50 Z"/><path d="M7 38 V27 H13 V38 Z"/>
      <rect x="8" y="12" width="4" height="15"/><path d="M10 0 V12" stroke="currentColor"/>${[69, 56, 44].map(y => win(5, y, 10, 1.3, .3)).join("")}`),
    petronas: S(27, `<path d="M0 100 V86 H4 V58 L9 38 L13 20 L15 0 L17 20 L21 38 L26 58 L27 100 Z"/><path d="M3 58 H24" stroke="currentColor" stroke-width="4" opacity=".55"/>
      <path d="M15 0 V-5" stroke="currentColor"/>${[46, 38].map(y => `<circle cx="15" cy="${y}" r="2.5" opacity=".35"/>`).join("")}`),
    guangzhou: highrise(18, `M0 100 V82 H3 V65 H6 V49 H9 V33 H12 V17 H15 V6 H18 V0 H12 V4 H9 V17 H6 V33 H3 V49 H0 Z`, `<path d="M15 0 V-4" stroke="currentColor"/>`, 11),
    shanghaifc: S(22, `<path d="M0 100 V27 L10 0 H16 L22 27 V100 Z"/><path d="M7 27 Q11 14 16 27 Z" opacity=".65"/><path d="M4 31 H20 M2 43 H21 M1 56 H21 M0 70 H22" stroke="currentColor" stroke-width="1" opacity=".3"/>`),
    icc: highrise(21, `M0 100 Q1 35 5 14 Q10 3 15 0 Q19 11 20 35 L21 100 Z`, `<path d="M15 0 V-4" stroke="currentColor"/>`, 11),
    abraj: S(19, `<path d="M0 100 V65 H3 V38 L7 13 H14 L16 38 V65 H19 V100 Z"/><path d="M7 13 Q10.5 0 14 13 Z"/><circle cx="10.5" cy="34" r="4" opacity=".35"/><path d="M10.5 29 v10 M6.5 34 h8" stroke="currentColor" opacity=".45"/><path d="M10.5 0 V-5" stroke="currentColor"/>`),
    skytree: S(15, `<path d="M0 100 L4 53 L6.5 22 H8.5 L11 53 L15 100 Z"/><rect x="5.5" y="29" width="4" height="11" rx="1"/><rect x="5" y="44" width="5" height="8" rx="1"/><path d="M7.5 0 V29" stroke="currentColor"/><path d="M5.5 23 H9.5" stroke="currentColor" opacity=".5"/>`),
    tokyotower: S(34, `<path d="M0 100 L12 55 L15 35 L17 18 L19 35 L22 55 L34 100 H25 L19 68 L13 100 Z"/><path d="M2 76 H32 M6 58 H28 M11 42 H23" stroke="currentColor" stroke-width="3"/><rect x="13" y="33" width="8" height="8"/><path d="M17 0 V33" stroke="currentColor"/><path d="M12 66 H26 L24 75 H14 Z" opacity=".45"/>`),
    cntower: S(27, `<path d="M0 100 L7 63 L10 58 H17 L20 63 L27 100 Z"/><ellipse cx="13.5" cy="51" rx="11" ry="7"/><ellipse cx="13.5" cy="28" rx="6" ry="4"/><path d="M13.5 0 V24" stroke="currentColor"/><path d="M10 4 h7" stroke="currentColor" opacity=".45"/><path d="M5 83 H22" stroke="currentColor" stroke-width="2" opacity=".3"/>`),
    ostankino: S(20, `<path d="M1 100 Q8 64 9.5 38 H10.5 Q12 64 19 100 Z"/><ellipse cx="10" cy="34" rx="7" ry="4"/><ellipse cx="10" cy="24" rx="4" ry="2.5"/><path d="M10 0 V21" stroke="currentColor"/><path d="M7 66 H13 M5 79 H15" stroke="currentColor" opacity=".4"/>`),
    shard: S(21, `<path d="M0 100 V82 L3 41 L9 0 L15 19 L18 62 L21 100 Z"/><path d="M9 0 L15 19 L18 62" fill="none" stroke="currentColor" stroke-width="1" opacity=".35"/><path d="M5 70 H18" stroke="currentColor" opacity=".25"/>`),
    lahta: S(20, `<path d="M0 100 Q2 34 7 8 L12 0 L17 11 Q19 42 20 100 Z"/><path d="M12 0 Q9 35 6 100 M12 0 Q15 35 18 100" fill="none" stroke="currentColor" stroke-width="1" opacity=".3"/>`),
    burjalarab: S(34, `<path d="M0 100 V72 Q7 54 13 38 L18 13 L22 0 Q24 43 29 64 Q33 82 34 100 Z"/><path d="M7 82 Q18 48 22 0" fill="none" stroke="currentColor" stroke-width="2" opacity=".35"/><path d="M5 71 H30" stroke="currentColor" opacity=".4"/>`),
    emirattowers: S(30, `<path d="M0 100 L3 36 L8 0 L13 36 L16 100 Z"/><path d="M14 100 L17 36 L22 0 L27 36 L30 100 Z"/><path d="M2 70 H28" stroke="currentColor" stroke-width="3" opacity=".5"/><path d="M8 0 V-4 M22 0 V-4" stroke="currentColor"/>`),
    bakutv: S(63, `<path d="M8 100 L24 49 H28 L38 100 Z M31 100 L35 37 H40 L54 100 Z M22 100 L31 30 H37 L43 100 Z"/><ellipse cx="32" cy="27" rx="17" ry="11"/><rect x="29" y="7" width="6" height="12"/><path d="M32 0 V7" stroke="currentColor"/><path d="M19 100 H46" stroke="currentColor" stroke-width="2" opacity=".35"/>`),
    alov: S(88, `<path d="M1 100 Q9 62 17 29 Q22 3 28 28 Q30 60 32 100 Z"/><path d="M30 100 Q36 51 43 0 Q50 35 54 70 Q55 87 57 100 Z"/><path d="M55 100 Q61 69 69 38 Q75 12 80 39 Q85 70 87 100 Z"/>`),
    socar: S(70, `<path d="M0 100 V85 Q11 64 27 37 Q32 25 38 36 L35 72 Q35 84 39 100 Z"/><path d="M30 100 Q37 55 47 22 Q52 11 58 22 L68 62 Q70 80 70 100 Z"/><path d="M7 79 Q25 51 31 41 M37 75 Q51 44 56 29" fill="none" stroke="currentColor" stroke-width="2" opacity=".3"/>`),
    heydar: S(180, `<path d="M0 100 V89 Q28 91 46 76 Q75 53 87 27 Q92 14 98 24 L104 40 Q112 30 119 35 Q149 70 180 91 V100 Z"/><path d="M17 100 Q48 85 71 58 Q89 37 97 28 M104 46 Q138 75 163 90" fill="none" stroke="currentColor" stroke-width="2" opacity=".28"/>`),
    eyfel: S(40, `<path d="M0 100 L9 58 L31 58 L40 100 L31 100 L25 72 L15 72 L9 100 Z"/><rect x="5" y="54" width="30" height="6"/><rect x="10" y="28" width="20" height="5"/><path d="M14 54 L17 28 L25 28 L28 54 Z"/><path d="M17 28 L20 4 L23 28 Z"/><rect x="19" y="0" width="2.4" height="7"/><path d="M8 82 H32 M5 92 H35" stroke="currentColor" stroke-width="2" opacity=".4"/>`),

    /* Texnika */
    avtobus: S(250, `<rect x="5" y="2" width="238" height="82" rx="11"/><path d="M5 42 H243" stroke="currentColor" stroke-width="3" opacity=".35"/>${Array.from({ length: 8 }, (_, i) => win(19 + i * 28, 11, 20, 20, .3)).join("")}${Array.from({ length: 7 }, (_, i) => win(26 + i * 29, 51, 20, 19, .3)).join("")}<circle cx="55" cy="89" r="12"/><circle cx="199" cy="89" r="12"/><rect x="62" y="83" width="130" height="8"/>`),
    teyyare: airliner(370, { upper: "hump", engines: 4 }),
    a380: airliner(320, { upper: "full", engines: 4 }),
    an225: airliner(470, { twinTail: true, engines: 6, highWing: true }),
    concorde: S(322, `<path d="M0 78 L46 66 L255 69 L322 75 L322 82 L259 80 L185 82 L103 99 L71 99 L139 80 L47 83 L0 87 Z"/><path d="M51 68 L112 17 L136 18 L121 69 Z"/><path d="M126 73 L222 56 L262 76 Z"/>${[2, 3, 4, 5].map(i => `<ellipse cx="${i * 39}" cy="91" rx="12" ry="7"/>`).join("")}<path d="M271 74 l8 -12 6 1 -4 14 Z"/>`),
    cessna: S(147, `<path d="M0 71 Q22 57 51 57 H112 Q128 58 147 70 V79 H119 L104 76 L63 76 L35 99 H16 L36 76 H0 Z"/><path d="M32 58 V38 H115 V59 Z"/><path d="M31 38 L73 21 L115 38 Z"/><circle cx="72" cy="51" r="17"/><path d="M72 30 v42 M51 51 h42"/><path d="M39 78 l-5 20 h12 l9 -19 M100 78 l11 20 h12 l-7 -20"/><path d="M127 67 l14 -12 6 4 -9 16 Z"/>`),
    hindenburg: S(271, `<ellipse cx="135" cy="48" rx="135" ry="38"/><path d="M18 66 L82 84 H178 L252 66 L221 84 H55 Z"/><path d="M122 82 v14 h28 V82 Z"/><path d="M117 97 h38 l6 3 h-50 Z"/><path d="M244 59 l27 7 -25 8 Z"/>`),
    stratolaunch: S(613, `<path d="M0 73 Q34 61 102 61 H511 Q579 61 613 73 V80 H512 L477 73 H137 L103 80 H0 Z"/><rect x="78" y="62" width="84" height="10" rx="5"/><rect x="451" y="62" width="84" height="10" rx="5"/><path d="M131 64 L188 22 H207 L196 64 Z"/><path d="M418 64 L407 22 H426 L483 64 Z"/><path d="M291 73 L364 99 H325 L259 76 Z"/>${[124, 158, 455, 489].map(x => `<circle cx="${x}" cy="83" r="8"/>`).join("")}`),
    uh60: helicopter(188),
    ch47: helicopter(239, { twin: true }),
    mi26: helicopter(278, { heavy: true }),
    saturn: rocket(17, { variant: "saturn" }),
    falcon: rocket(12, { variant: "falcon" }),
    soyuz: rocket(13, { variant: "soyuz" }),
    ariane: rocket(17, { variant: "ariane" }),
    shuttle: rocket(25, { variant: "shuttleStack" }),
    starship: rocket(16, { variant: "starshipStack" }),
    iss: S(328, `<path d="M15 46 H313 V54 H15 Z"/><rect x="126" y="35" width="51" height="30" rx="6"/><rect x="183" y="39" width="38" height="22" rx="4"/>
      ${[2, 62, 221, 279].map((x, i) => `<path d="M${x} ${26 + i % 2 * 4} h53 v${45 - i % 2 * 8} h-53 Z"/><path d="M${x + 18} ${26 + i % 2 * 4} v${45 - i % 2 * 8} M${x + 36} ${26 + i % 2 * 4} v${45 - i % 2 * 8}" stroke="currentColor" opacity=".35"/>`).join("")}
      <path d="M201 50 H221 M218 50 V38 M218 38 h21" stroke="currentColor" stroke-width="3"/><path d="M126 35 V13 H140 V35 Z"/>`),
    jwebb: S(128, `<path d="M0 79 L25 31 L103 31 L128 79 Z"/><path d="M18 57 H110 M34 40 H94" stroke="currentColor" stroke-width="2" opacity=".35"/>
      ${[27, 50, 73, 96].map(x => `<path d="M${x} 40 v32" stroke="currentColor" opacity=".35"/>`).join("")}<path d="M64 31 V7 H68 V31 Z"/><path d="M42 17 H90 V5 H42 Z"/><path d="M37 7 h58" stroke="currentColor" stroke-width="3"/><circle cx="66" cy="20" r="6"/>`),
    voyager: S(83, `<path d="M24 93 Q31 42 62 23 Q72 34 72 66 L86 90 L78 95 L66 73 L59 94 Z"/><path d="M8 32 Q42 8 73 35 Q42 57 8 32 Z"/><path d="M42 11 V55 M17 22 L66 44 M65 23 L18 42" stroke="currentColor" stroke-width="2" opacity=".4"/><path d="M42 10 V0 M74 61 L82 54 M28 89 L18 100" stroke="currentColor" stroke-width="3"/>`),
    curiosity: S(196, `<path d="M16 76 H180 V88 H16 Z"/><path d="M34 88 L22 100 H46 L55 88 Z M145 88 L135 100 H160 L168 88 Z"/><rect x="65" y="49" width="61" height="27" rx="3"/><rect x="80" y="26" width="10" height="25"/><rect x="84" y="10" width="24" height="18" rx="2"/>
      ${[27, 61, 128, 160].map(x => `<circle cx="${x}" cy="94" r="13"/><circle cx="${x}" cy="94" r="5" opacity=".35"/>`).join("")}<path d="M16 71 H42 V80 H16 Z M145 68 H174 V80 H145 Z"/><path d="M116 74 L159 46 H173 L137 78 Z"/>`),
    titanik: S(431, `<path d="M0 80 L35 83 H395 L431 78 L419 92 H55 Z"/><path d="M30 83 V65 H326 V83 Z M52 65 V57 H303 V65 Z M76 57 V49 H279 V57 Z"/>
      <path d="M91 66 V35 H111 V66 Z M151 66 V31 H171 V66 Z M221 66 V35 H241 V66 Z M286 66 V37 H306 V66 Z"/>
      ${[91, 151, 221, 286].map(x => `<path d="M${x} 35 h20 v7 h-20 Z" opacity=".65"/>`).join("")}
      <path d="M56 66 V34 H60 V66 Z M344 66 V29 H348 V66 Z M51 39 H65 M337 35 H355" stroke="currentColor" stroke-width="2"/>
      <path d="M60 36 L100 58 M344 32 L306 57 M28 68 V47 H42 V68 M313 68 V45 H329 V68" opacity=".75"/>
      ${Array.from({ length: 22 }, (_, i) => circ(66 + i * 14, 78, 1.7, .3)).join("")}<path d="M388 82 V62 H402 V82 Z"/>`),
    queenmary: S(358, `<path d="M0 81 Q20 72 45 78 H330 L358 75 L344 93 H48 Z"/><path d="M35 81 V59 H283 V81 Z M58 59 V51 H263 V59 Z"/>
      <rect x="199" y="38" width="29" height="20"/><path d="M201 38 Q213 20 225 38 Z"/><path d="M102 59 V31 H124 V59 Z M157 59 V25 H181 V59 Z M268 59 V35 H290 V59 Z"/>
      <path d="M71 59 V37 H75 V59 Z M307 59 V31 H311 V59 Z M65 42 H81 M301 36 H317" stroke="currentColor" stroke-width="2"/>
      ${Array.from({ length: 19 }, (_, i) => circ(62 + i * 14, 78, 1.8, .32)).join("")}<path d="M337 81 V63 H349 V81 Z"/>`),
    belaz: S(303, `<path d="M12 74 H56 L74 48 H232 L263 76 H291 V88 H12 Z"/><path d="M91 49 H144 V74 H79 Z"/><path d="M151 49 H170 V74 H151 Z"/><path d="M219 51 H231 L249 75 H219 Z"/>
      <circle cx="78" cy="88" r="37"/><circle cx="230" cy="88" r="37"/><circle cx="78" cy="88" r="18" opacity=".4"/><circle cx="230" cy="88" r="18" opacity=".4"/><path d="M10 63 H49 V75 H10 Z"/>`),
    actros: S(267, `<path d="M0 83 V55 H41 L59 29 H150 L176 57 H267 V85 H0 Z"/><rect x="49" y="52" width="96" height="27"/><path d="M62 34 H146 L163 55 H62 Z"/><path d="M156 61 H267 V83 H156 Z"/>
      <circle cx="57" cy="88" r="19"/><circle cx="205" cy="88" r="19"/><circle cx="231" cy="88" r="19"/><circle cx="57" cy="88" r="7" opacity=".4"/><circle cx="205" cy="88" r="7" opacity=".4"/><circle cx="231" cy="88" r="7" opacity=".4"/><path d="M262 57 V27 H267 V57 Z"/>`),
    bakumetro: S(199, `<path d="M4 89 V29 Q4 9 25 9 H174 Q195 9 195 29 V89 Z"/><path d="M34 22 H165 V50 H34 Z M34 58 H165 V76 H34 Z" opacity=".32"/><path d="M99 10 V88" stroke="currentColor" stroke-width="3" opacity=".35"/><circle cx="41" cy="88" r="10"/><circle cx="158" cy="88" r="10"/><path d="M73 9 V0 H126 V9 M99 0 V-7" stroke="currentColor" stroke-width="3"/><circle cx="22" cy="66" r="4"/><circle cx="177" cy="66" r="4"/>`),

    /* Təbiət */
    everest: mountain(`0 100 L13 76 L25 81 L44 50 L55 60 L68 18 L78 38 L88 6 L101 39 L109 29 L120 53 L120 100`, `M68 18 L78 38 L88 6 L91 32 L85 29 L81 35 L76 27 Z M44 50 L55 60 L51 56 L48 59 Z`),
    k2: mountain(`0 100 L22 70 L39 79 L55 34 L63 53 L77 1 L86 25 L94 41 L107 30 L120 64 L120 100`, `M77 1 L86 25 L80 19 L76 23 L71 14 Z`),
    kilimanjaro: S(132, `<path d="M0 100 L10 90 L24 75 L36 58 L45 40 L50 24 L54 16 L59 13 L64 17 L68 25 L74 44 L82 29 L87 13 L92 22 L96 36 L103 53 L115 78 L126 92 L132 100 Z"/><path d="M50 24 L54 16 L59 13 L64 17 L61 25 L56 22 L53 27 Z" opacity=".3"/>`),
    denali: mountain(`0 100 L14 69 L27 79 L43 42 L53 57 L64 12 L73 34 L82 19 L94 49 L105 37 L120 70 L120 100`, `M64 12 L73 34 L67 25 L61 31 L56 24 Z M82 19 L90 38 L85 32 L81 36 Z`),
    elbrus: mountain(`0 100 L18 78 L32 69 L44 47 L54 54 L66 22 L74 34 L82 9 L91 32 L101 28 L111 55 L120 72 L120 100`, `M82 9 L91 32 L85 24 L81 29 L77 20 Z M66 22 L74 34 L70 29 L66 33 Z`),
    montblanc: mountain(`0 100 L16 77 L29 82 L45 45 L56 56 L68 17 L78 37 L88 26 L101 53 L112 68 L120 74 L120 100`, `M68 17 L78 37 L73 29 L68 34 L64 27 Z`),
    matterhorn: mountain(`0 100 L12 81 L31 75 L50 56 L61 2 L72 37 L83 54 L100 71 L120 83 L120 100`, `M61 2 L72 37 L66 28 L62 32 L57 22 Z`),
    akonqva: mountain(`0 100 L19 76 L34 69 L49 42 L58 52 L70 15 L80 35 L88 23 L98 46 L109 59 L120 72 L120 100`, `M70 15 L80 35 L75 27 L70 31 L66 23 Z`),
    fuji: S(142, `<path d="M0 100 L13 88 Q36 67 49 35 L54 18 L59 15 Q62 12 66 15 L72 20 L78 39 Q92 67 114 87 L129 96 L142 100 Z"/><path d="M54 18 L59 15 Q62 12 66 15 L72 20 L69 25 L63 22 L58 26 Z" opacity=".32"/>`),
    ararat: mountain(`0 100 L14 79 L27 84 L43 60 L54 67 L65 26 L73 38 L83 15 L91 36 L100 32 L111 62 L120 79 L120 100`, `M83 15 L91 36 L86 28 L82 33 L78 24 Z`),
    bazarduzu: mountain(`0 100 L14 76 L28 83 L43 57 L54 66 L66 32 L74 43 L84 19 L92 38 L101 31 L111 62 L120 78 L120 100`, `M84 19 L92 38 L87 30 L84 35 L79 27 Z`),
    uluru: S(188, `<path d="M0 100 V86 Q12 67 36 50 Q56 34 80 27 Q101 16 123 18 Q145 20 163 44 Q177 65 188 85 V100 Z"/><path d="M37 65 Q68 36 103 30 M56 83 Q86 52 120 27 M119 79 Q143 49 164 48" fill="none" stroke="currentColor" stroke-width="3" opacity=".28"/><path d="M0 88 Q53 80 102 87 Q149 92 188 86 V100 H0 Z" opacity=".35"/>`),
    melek: S(84, `<path d="M0 100 V0 H31 L50 100 Z"/><path d="M17 100 V22 Q33 30 45 100 Z" opacity=".35"/><path d="M30 0 Q40 33 47 100" fill="none" stroke="currentColor" stroke-width="3" opacity=".35"/><path d="M22 100 Q36 83 58 100 Z"/><path d="M48 63 Q67 58 84 72 V86 Q62 79 48 82 Z" opacity=".7"/>`),
    iguazu: S(208, `<path d="M0 100 V72 Q20 64 38 72 Q52 59 69 72 Q86 61 102 72 Q121 58 139 72 Q157 64 175 73 Q191 65 208 72 V100 Z"/><path d="M9 74 V100 M31 70 V100 M55 72 V100 M80 70 V100 M106 73 V100 M131 71 V100 M157 72 V100 M183 71 V100" stroke="currentColor" stroke-width="7" opacity=".65"/><path d="M0 94 Q50 88 101 95 Q155 87 208 94 V100 H0 Z" opacity=".45"/>`),
    niagara: S(201, `<path d="M0 100 V72 Q25 65 51 73 Q72 61 94 72 Q117 62 143 72 Q171 65 201 72 V100 Z"/><path d="M0 73 Q35 53 83 72 Q44 84 0 79 Z"/><path d="M93 72 Q134 51 201 72 Q150 83 94 78 Z"/><path d="M20 79 V100 M48 79 V100 M75 78 V100 M119 78 V100 M147 78 V100 M175 78 V100" stroke="currentColor" stroke-width="5" opacity=".6"/><path d="M0 94 Q57 86 101 94 Q151 86 201 94 V100 H0 Z" opacity=".5"/>`),

    /* Fiqurlar */
    azadliq: S(34, `<path d="M5 100 L10 60 H32 L38 100 Z"/><rect x="11" y="53" width="21" height="8"/><path d="M14 54 L18 27 H28 L32 54 Z"/><circle cx="23" cy="21" r="5"/>
      <path d="M17 18 L11 10 L18 15 Z M23 16 L23 6 L27 15 Z M29 18 L35 10 L31 17 Z"/><path d="M28 28 L37 8 L41 11 L32 31 Z"/><path d="M37 8 L38 0 L42 7 L41 11 Z"/><path d="M17 29 L10 38 L14 42 L20 33 Z"/><path d="M15 54 L11 45 L18 49 Z M30 54 L35 44 L28 49 Z"/>`),
    veten: S(50, `<path d="M2 100 L8 71 H42 L48 100 Z"/><path d="M10 72 L18 20 L30 22 L40 72 Z"/><circle cx="25" cy="15" r="5"/><path d="M19 23 L4 0 L8 30 L14 46 Z"/><path d="M31 24 L46 0 L41 30 L35 47 Z"/><path d="M19 40 L8 56 L12 63 L24 49 Z"/><path d="M31 40 L43 56 L38 63 L27 49 Z"/><path d="M21 72 L20 100 H29 L30 72 Z" opacity=".5"/>`),
    birlik: S(54, `<path d="M2 100 V88 H52 V100 Z"/><path d="M8 88 V78 H46 V88 Z"/><path d="M15 78 L19 32 H35 L39 78 Z"/><circle cx="27" cy="23" r="7"/><path d="M18 35 L8 50 L14 58 L23 43 Z"/><path d="M36 35 L48 50 L42 58 L32 43 Z"/><path d="M20 78 L18 100 H24 L28 79 Z M33 78 L36 100 H30 L27 79 Z"/><path d="M23 16 Q27 5 31 16 Z"/>`),
    bahar: buddha(47),
    isamasix: S(38, `<path d="M3 100 V82 H35 V100 Z"/><rect x="11" y="75" width="16" height="8"/><path d="M14 76 L17 21 H25 L28 76 Z"/><circle cx="21" cy="15" r="5"/><path d="M16 23 L2 4 L6 26 L12 39 Z"/><path d="M26 23 L37 3 L33 27 L27 40 Z"/><path d="M14 47 H28" stroke="currentColor" stroke-width="5"/><path d="M17 76 L17 100 H25 L25 76 Z" opacity=".5"/>`),
    usiku: buddha(45, false, true),
    cingiz: S(101, `<path d="M0 100 V94 H101 V100 Z"/>
      <path d="M25 58 Q45 45 72 52 L79 67 Q60 78 30 72 Z"/><path d="M68 58 L77 31 L85 26 L91 37 L83 66 Z"/><path d="M79 28 Q91 20 98 28 L94 36 L82 38 Z"/><path d="M82 24 L80 14 L87 23 Z"/>
      <path d="M27 57 Q10 48 4 62 Q13 59 15 75 L22 69 Z"/>
      <path d="M31 69 L27 82 L34 94 H41 L42 80 L47 72 Z M45 72 L43 85 L50 94 H57 L54 78 L57 69 Z M69 70 L67 84 L74 94 H81 L77 79 L77 65 Z"/>
      <path d="M47 54 L48 32 Q54 25 60 32 L65 55 Z"/><circle cx="54" cy="22" r="6"/><path d="M48 18 L53 7 L59 18 Z"/><path d="M47 33 L35 55 L45 58 L51 39 Z"/>
      <path d="M60 34 L72 25 L77 29 L64 42 Z"/><path d="M75 28 L87 8 L90 10 L79 31 Z"/>
      <path d="M31 62 Q52 68 75 59 M78 34 L86 38" fill="none" stroke="currentColor" stroke-width="2" opacity=".4"/>`)
  };

  window.SP = window.SP || {};
  SP.SIZE_SHAPES = SHAPES;
  SP.SIZE_LIMIT = 20000;
})();

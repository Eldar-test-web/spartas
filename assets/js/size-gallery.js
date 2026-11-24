/* Ölçü Qalereyası: oyunla eyni siluet mənbəyi, ümumi loqarifmik miqyas. */
(() => {
  const root = document.getElementById("gallery");
  const human = SP.HUMAN_H, max = SP.SIZE_LIMIT;
  const span = Math.log10(max / human);
  const fmt = (m) => m >= 1000
    ? `${SP.fmt(m / 1000, m < 10000 ? 2 : 1)} km`
    : (m >= 10 ? `${Math.round(m)} m` : `${SP.fmt(m, 1)} m`);
  const slug = { "Canlılar": "canlilar", "Abidələr": "abideler", "Binalar": "binalar", "Texnika": "texnika", "Təbiət": "tebiyet", "Fiqurlar": "fiqurlar" };
  const person = `<svg viewBox="0 0 28 100" aria-hidden="true"><circle cx="14" cy="8" r="7.5"/><path d="M3 24 Q14 15 25 24 L23 55 L5 55 Z"/><path d="M6 55 h6 l-1 45 h-5 z"/><path d="M16 55 h6 l-1 45 h-5 z"/></svg>`;
  const missing = SP.SIZES.filter((it) => !SP.SIZE_SHAPES[it.id]);
  if (missing.length) {
    root.innerHTML = `<section class="card"><h2>Siluetlər tam deyil</h2><p>${missing.map((it) => SP.esc(it.name)).join(", ")}</p></section>`;
    return;
  }

  root.innerHTML = SP.SIZE_CATS.map((cat) => {
    const list = SP.SIZES.filter((it) => it.cat === cat).sort((a, b) => a.h - b.h);
    return `<section class="gallery-group" id="${slug[cat]}" data-cat="${SP.esc(cat)}">
      <div class="gallery-head"><h2>${SP.esc(cat)}</h2><span>${list.length} obyekt</span></div>
      <div class="gallery-grid">
        ${list.map((it) => {
          const sh = SP.SIZE_SHAPES[it.id];
          /* Loqarifmik fərq birbaşa piksel hündürlüyünə çevrilir: insan 10 px, 20 km 64 px. */
          const fraction = Math.log10(it.h / human) / span;
          const h = 10 + 54 * fraction;
          const ratio = sh.vb / 100;
          const w = h * ratio;
          const wide = w > 250 ? " is-wide" : "";
          return `<article class="gallery-card${wide}" data-id="${it.id}" data-h="${it.h}">
            <div class="gallery-visual">
              <div class="gallery-human" style="height:10px;width:3px">${person}</div>
              <div class="gallery-scale" style="height:${h.toFixed(2)}px;width:${w.toFixed(2)}px">
                <svg viewBox="0 0 ${sh.vb} 100" preserveAspectRatio="xMidYMax meet" role="img" aria-label="${SP.esc(it.name)} silueti">
                  <g transform="translate(${-(sh.x0 || 0)} 0)">${sh.svg}</g>
                </svg>
              </div>
              <span class="gallery-ground"></span>
            </div>
            <div class="gallery-info">
              <div class="gallery-title"><h3>${SP.esc(it.name)}</h3><b>${fmt(it.h)}</b></div>
              <p class="gallery-geo">${SP.esc(it.geo)}</p>
              <p class="gallery-note">${SP.esc(it.note)}</p>
              <a href="olcu-tahmini.html?obyekt=${encodeURIComponent(it.id)}">Bu obyekti təxmin et →</a>
            </div>
          </article>`;
        }).join("")}
      </div>
    </section>`;
  }).join("");

  document.getElementById("sizeSources").innerHTML = SP.SIZE_SOURCES
    .map((s) => `<a class="btn btn-sm btn-ghost" href="${s.url}" target="_blank" rel="noopener noreferrer">${SP.esc(s.label)} ↗</a>`).join("");
})();

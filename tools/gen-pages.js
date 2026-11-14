/* Bir dəfəlik generator: naviqasiya səhifələrini eyni şablonla yazır. */
const fs = require("fs");
const path = require("path");
const root = path.join(__dirname, "..");

const head = (title, desc, page) => `<!doctype html>
<html lang="az">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<meta name="description" content="${desc}">
<meta name="theme-color" content="#0D6940">
<link rel="icon" href="assets/img/favicon.png" sizes="48x48" type="image/png">
<link rel="icon" href="assets/img/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="assets/img/apple-touch-icon.png">
<link rel="manifest" href="site.webmanifest">
<meta property="og:title" content="${title}">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="assets/img/og-image.png">
<link rel="stylesheet" href="assets/css/main.css">
<link rel="stylesheet" href="assets/css/pages.css">
</head>
<body data-page="${page}">
<a class="skip-link" href="#main">Əsas mətnə keç</a>
<div class="layout">
  <aside class="sidebar" id="sidebar"></aside>
  <div class="main-col">
    <header class="topbar" id="topbar"></header>
    <main id="main">
${""}`;

const tail = (withPages) => `    </main>
    <footer class="site-foot" id="site-foot"></footer>
  </div>
</div>
<script src="assets/js/data.js"></script>
<script src="assets/js/app.js"></script>${withPages ? `
<script src="assets/js/pages.js"></script>` : ""}
</body>
</html>`;

const P = {};

P["oyunlar.html"] = {
  title: "Oyunlar — SPARTANS",
  desc: "SPARTANS klubunun altı intellektual oyunu: Wordle, krossvord, ölçü təxmini, Fermi təxmini, mini oyunlar və klassik suallar.",
  page: "oyunlar",
  body: `      <div class="page-head">
        <p class="eyebrow">Klubun oyun dəsti</p>
        <h1>Oyunlar</h1>
        <p class="lead">Altı oyun, altı ayrı düşünmə məşqi. Hər biri ayrıca səhifədə açılır — yarıda qoysan, nəticən itmir.</p>
        <div class="row stats-row" id="gameStats"></div>
      </div>

      <div class="game-list" id="gameGrid"></div>

      <div class="section-head"><h2>Xal necə toplanır</h2></div>
      <div class="card" id="rulesTable"></div>

      <div class="card mt note-card">
        <h2>Bir dəfə oxu</h2>
        <ul class="tick-list">
          <li>Bütün nəticələr yalnız bu brauzerin yerli yaddaşında saxlanılır; heç nə serverə göndərilmir.</li>
          <li>Gündəlik rejimdə söz, siluet və ya tapmaca gün boyu dəyişmir — hamı eyni suala cavab verir.</li>
          <li>Oyunların bir hissəsi açıq lisenziyalı hazırdır, Azərbaycan əlifbasına və klubun rənglərinə uyğunlaşdırılıb. Mənbə siyahısı: <a href="CREDITS.md">CREDITS</a>.</li>
        </ul>
      </div>`
};

P["suallar.html"] = {
  title: "Suallar bankı — SPARTANS",
  desc: "Tarix, coğrafiya, elm, mədəniyyət, idman və məntiq üzrə klassik sual bankı — axtarış və kateqoriya filtri ilə.",
  page: "suallar",
  body: `      <div class="page-head">
        <p class="eyebrow">Viktorina bankı</p>
        <h1>Suallar</h1>
        <p class="lead">Oyunda çıxacaq sualların tam siyahısı — dörd variant, düzgün cavab və izahı ilə. Təkrar oxumaq üçün bank, oynamaq üçün <a href="viktorina.html">Klassik Suallar</a>.</p>
      </div>

      <div class="card filter-card">
        <div class="row between" style="gap:14px;flex-wrap:wrap">
          <label class="field" style="margin:0;flex:1 1 260px">
            <span>Axtar</span>
            <input id="qSearch" type="search" placeholder="məsələn: Cümhuriyyət, Nizami, planet">
          </label>
          <label class="field" style="margin:0">
            <span>Çətinlik</span>
            <select id="diffSel">
              <option value="">İstənilən</option>
              <option>Asan</option><option>Orta</option><option>Çətin</option>
            </select>
          </label>
        </div>
        <div class="row chip-row" id="catChips"></div>
        <p class="small dim" id="qCount"></p>
      </div>

      <div class="grid g2" id="qList"></div>`
};

P["liderler.html"] = {
  title: "Liderlər — SPARTANS",
  desc: "Komanda reytinqi və şəxsi nəticə cədvəli — SPARTANS intellektual oyunlar klubu.",
  page: "liderler",
  body: `      <div class="page-head">
        <p class="eyebrow">Reytinq</p>
        <h1>Liderlər</h1>
        <p class="lead">Komanda xalları və sənin şəxsi tur nəticələrin. Lokal oyun: cədvəl brauzerindəki məlumatlardan qurulur.</p>
      </div>

      <div class="row stats-row" id="lbSummary"></div>

      <div class="section-head"><h2>Komanda cədvəli</h2></div>
      <div class="card">
        <table class="tbl">
          <thead><tr><th class="num">#</th><th>Komanda</th><th>Üzv</th><th class="num">Xal</th><th>Nisbət</th></tr></thead>
          <tbody id="lbBody"></tbody>
        </table>
      </div>

      <div class="section-head"><h2>Son nəticələrim</h2></div>
      <div class="card">
        <table class="tbl"><thead><tr><th>Oyun</th><th>Vaxt</th><th class="num">Xal</th></tr></thead><tbody id="myHistory"></tbody></table>
      </div>`
};

P["komandalar.html"] = {
  title: "Komandalar — SPARTANS",
  desc: "SPARTANS klubunun komandaları: üzvlər, xallar və yerləşmə.",
  page: "komandalar",
  body: `      <div class="page-head">
        <p class="eyebrow">Klub strukturu</p>
        <h1>Komandalar</h1>
        <p class="lead">Hər oyunda topladığın xal seçdiyin komandanın cəminə yazılır. Giriş edəndən sonra komutanı dəyişə bilərsən.</p>
      </div>

      <div class="card note-card"><p id="teamNote" style="margin:0"></p></div>

      <div class="grid g4" id="teamGrid"></div>`
};

P["profil.html"] = {
  title: "Profil — SPARTANS",
  desc: "Şəxsi xallar, nişanlar və oyun tarixçəsi — SPARTANS profili.",
  page: "profil",
  body: `      <div class="page-head">
        <p class="eyebrow">Şəxsi kabinet</p>
        <h1>Profil</h1>
        <p class="lead">Xallar, nişanlar və son turlar. Sıfırlama butonu yalnız bu brauzerdəki məlumatları silir.</p>
      </div>

      <div id="profileBox"></div>`
};

P["girish.html"] = {
  title: "Giriş — SPARTANS",
  desc: "SPARTANS klubunda adını yaz, komanda seç — məlumatlar brauzerinin yerli yaddaşında saxlanılır.",
  page: "girish",
  body: `      <div class="page-head">
        <p class="eyebrow">Hesab yoxdur</p>
        <h1>Giriş</h1>
        <p class="lead">Parol, e-poçt və serverə göndərilən heç nə yoxdur. Sadə bir ad və komanda seçimi kifayətdir.</p>
      </div>

      <div class="login-wrap">
        <form class="card" id="loginForm">
          <label class="field">
            <span>Adın</span>
            <input id="nameInput" name="name" type="text" maxlength="24" autocomplete="nickname" placeholder="məsələn: Elxan" required>
          </label>
          <label class="field">
            <span>Komanda</span>
            <select id="teamSel" name="team"></select>
          </label>
          <button class="btn btn-mint" type="submit">Daxil ol</button>
          <p class="small dim mt">Məlumat <code>localStorage</code>-da saxlanılır. Cihazı dəyişsən, tarixçə köçmür.</p>
        </form>
        <aside class="card why-card">
          <h2>Niyə lazımdır</h2>
          <ul class="tick-list">
            <li>Xalların bir yerə yığılsın — oyunlar arasında ümumi nəticə görürsən.</li>
            <li>Nişanlar açılsın: ilk Wordle, 100 xal, 500 xal, krossvord şəbəkəsi.</li>
            <li>Komanda cədvəlində öz payını “sən” işarəsi ilə görə bilsən.</li>
          </ul>
        </aside>
      </div>`
};

P["haqqinda.html"] = {
  title: "Haqqında — SPARTANS",
  desc: "SPARTANS intellektual oyunlar klubu haqqında, oyun qaydaları və mənbə siyahısı.",
  page: "haqqinda",
  body: `      <div class="page-head">
        <p class="eyebrow">Klub haqqında</p>
        <h1>Haqqında</h1>
        <p class="lead">SPARTANS — tələbələr üçün açıq intellektual oyunlar məkanı: söz, şəbəkə, təxmin, bilik və strategiya üzərində işləyən altı oyun.</p>
      </div>

      <div class="grid g2">
        <section class="card">
          <h2>Nə edirik</h2>
          <p>Hər həftə altı oyunda individual və komanda nəticələri yığılır. Sayt tamamilə statisdir: hosting, veritabanı və ya hesablama serveri tələb etmir.</p>
          <ul class="tick-list">
            <li>Söz məntiqi — Wordle və krossvord Azərbaycan əlifbası üzərində işləyir (ə, ı, İ, ğ, ş, ç, ö, ü daxil).</li>
            <li>Təxmin məntiqi — ölçü və Fermi sualları tərtib (logarifmik) xallanır, yəni yaxın təxmin uzaq təxminə üstünlük qazanır.</li>
            <li>Bilik məntiqi — klassik sual bankı altı kateqoriyaya bölünür.</li>
          </ul>
        </section>
        <section class="card" id="qaydalar">
          <h2>Oyun qaydaları</h2>
          <ul class="rule-list">
            <li><b>Bir nəticə, bir tur.</b> Eyni turu təkrar oynasañ, yeni nəticə ayrıca yazılır — ən yaxşısilər deyil.</li>
            <li><b>Gündəlik rejim.</b> Wordle və Ölçü Tahmini gün boyu eyni sualı verir; “sərbəst” rejimdə isə təsadüfi.</li>
            <li><b>Köməkçi xalı azaldır.</b> Açıq hərflər, təkrar cəhdlər və uzun vaxat nəticədən silinir.</li>
            <li><b>Məhdit yoxdur.</b> Heç bir oyun pul, qeydiyyat və ya məlumat toplamaq tələb etmir.</li>
          </ul>
        </section>
      </div>

      <div class="section-head"><h2>Oyunların siyahısı</h2></div>
      <div class="card" id="aboutGames"></div>

      <div class="section-head"><h2>Komandalar</h2></div>
      <div class="card"><ul class="team-list" id="aboutTeams"></ul></div>

      <div class="grid g2">
        <section class="card" id="menba">
          <h2>Mənbə və lisenziya</h2>
          <p>Oyunların çoxu açıq lisenziyalı (MIT) layihələrdən götürülüb, Azərbaycan əlifbasına, klubun rənglərinə (<code>#0D6940</code> / <code>#6FFFBE</code>) və xal sisteminə uyğunlaşdırılıb. Hər layihənin adı, yazarı, lisenziyası və dəyişikliklər <a href="CREDITS.md">CREDITS.md</a> faylında qeyd olunub.</p>
          <p class="small muted">Ölçü Tahmini və Fermi Tahmini üçün açıq lisenziyalı hazır layihə tapılmadı — bu iki oyun klub tərəfindən yazılıb və heç bir üçüncü tərəfin rəsmi, mətni və ya məlumat bazası kopyalanmayıb.</p>
        </section>
        <section class="card" id="elaqe">
          <h2>Əlaqə</h2>
          <p>Bu sayt tədris məqsədli açıq layihədir. Kod, xəta hesabatı və təkliflər repository üzərindən aparılır: <b>Eldar-test-web/spartas</b> (GitHub).</p>
          <ul class="tick-list">
            <li>Lisenziya: saytın öz kodu — MIT; üçüncü tərəf oyunlarının lisenziyaları <code>vendor/</code> qovluqlarında saxlanılır.</li>
            <li>Fərdi məlumat toplanmır: ad və nəticələr yalnız istifadəçinin brauzerində qalır.</li>
          </ul>
        </section>
      </div>`
};

P["404.html"] = {
  title: "Səhifə tapılmadı — SPARTANS",
  desc: "404 — istənilən səhifə mövcud deyil.",
  page: "404",
  body: `      <div class="card center error-card">
        <span class="game-icon">${'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="12" cy="12" r="9"/><path d="M12 11v5"/><circle cx="12" cy="8" r=".9" fill="currentColor"/></svg>'}
        </span>
        <h1>404</h1>
        <p class="lead">Bu ünvan klubda mövcud deyil. Bəlkə oyun köçürülüb ya da ünvanda bir simvol səhvdir.</p>
        <div class="row" style="gap:10px;justify-content:center">
          <a class="btn btn-mint" href="index.html">Ana səhifə</a>
          <a class="btn btn-ghost" href="oyunlar.html">Oyunlar</a>
        </div>
      </div>`
};

let n = 0;
for (const [file, p] of Object.entries(P)) {
  fs.writeFileSync(path.join(root, file), head(p.title, p.desc, p.page) + p.body + "\n" + tail(true), "utf8");
  n++;
}
console.log(`yazıldı: ${n} səhifə`);

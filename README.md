# SPARTANS — İntellektual Oyunlar Klubu

Azərbaycan dilində, tam statis, çox səhifəli oyun saytı. Build addımı, framework,
veritabanı və ya backend yoxdur — HTML + CSS + vanilla JS. Rəqəmsal imza: `#0D6940`
(dərind yaşıl) və `#6FFFBE` (nanə yaşılı).

## Yeridə işlətmək

```sh
python -m http.server 8080
# və ya, cache-siz (daha yaxşı):
python tools/noserve.py 8792
```

`http://localhost:8792/` ünvanını aç. `file://` ilə açma — iframe-lər və `fetch`
buna icazə vermir. `vendor/` oyunlarının CSS/JS-i iframe-də cachingə girir;
`noserve.py` `Cache-Control: no-store` göndərdiyi üçün headless Chrome ilə
yenidən-yükləmələrdə köhnə kopya görünmür.

## Quruluş

```
index.html            ana səhifə
oyunlar.html          oyun dəsti və xal qaydaları
suallar.html          sual bankı (axtarış + filtr)
liderler.html         komanda reytinqi + şəxsi nəticələr
komandalar.html       komanda kartları
profil.html           xal, nişan, tarixçə, sıfırlama
girish.html           ad + komanda seçimi (yalnız localStorage)
haqqinda.html         klub, qaydalar, mənbə/lisenziya
wordle.html           İntellektual Wordle
krossvord.html        Krossvord
olcu-tahmini.html     Ölçü Tahmini
fermi-tahmini.html    Fermi Tahmini
mini-oyunlar.html     Mini Oyunlar
viktorina.html        Klassik Suallar
404.html

assets/css/   main.css (dizayn sistemi) · pages.css (naviqasiya) · frame.css (iframe bazası)
assets/js/    data.js (bütün məzmun) · app.js (nüvə) · gameframe.js (iframe körpüsü)
              pages.js · home.js · size.js · fermi.js
assets/fonts/ self-hosted Oswald + Bitter (OFL), CDN yoxdur
assets/img/   loqolar, faviconlar, hero, og-image (tools/make_icons.py ilə yaranır)
vendor/       açıq lisenziyalı oyunlar — hər qovluqda LICENSE + UPSTREAM.md
tools/        generatorlar və yoxlayıcılar (aşağıda)
```

## Oyun arxitekturası

Oyunların heç biri bu repo üçün sıfırdan yazılmayıb: hamısı GitHub-dan götürülüb,
düzəldilib və `vendor/<oyun>/` altında iframe ilə saytın içinə qoyulub.

```
səhifə (viktorina.html)
  └─ <div class="game-frame-card" data-frame data-game="viktorina" data-frame-controls="cat,n">
       └─ assets/js/gameframe.js  →  <iframe class="game-frame" src="vendor/quiz/?cat=…&n=…">
            ├─ vendor/quiz/app.css        (upstream)
            ├─ assets/css/frame.css       (brend tokenləri + şriftlər, eyni paket)
            └─ vendor/quiz/adapt.css      (palitra override — sonra gəlir, qalib gəlir)
       ↓ oyun bitəndə:  postMessage({type:"spartans:result", game, points, won, …})
       ↓ gameframe.js:  UPSTREAM_KEY uyğunluğu → SP.addResult(clubKey, points, meta)
       → klub cədvəli, profil, liderler səhifələri yenidən rənglənir
```

`frame.css` həmişə upstream-in öz CSS-i ilə `adapt.css` arasında yüklenir: upstream
faylları dəyişdirilmir, rəng yalnız kaskadın sonu ilə dəyişdirilir.

`data-frame-controls` seçimləri (`len`, `mode`, `cat`, `n`) `gameframe.js`-dəki
`CONTROLS` cədvəlindən gəlir — yeni oyun əlavə etmək üçün `UPSTREAM_KEY`-ə bir
sətir və iframe src-i bəsdir.

## Tools (Node, build yoxdur — yalnız generator/yoxlayıcı)

```sh
node tools/validate-data.js        # məzmun bütövlüyü: söz uzunluqları, cavab indeksləri, bağlantılar
node tools/gen-wordle-words.js     # data.js → vendor/wordle/words.js
node tools/gen-crossword.js        # Azərbaycan sözlərindən 17×17 şəbəkə qurur
node tools/gen-crossword-puzzle.js # şəbəkə → vendor/crosswords/puzzle.js (validator formatı + uzunluq yoxunu)
node tools/patch-crosswords.js     # crosswords-js bundle-inə AZ əlifba və başlıq yaması
node tools/gen-quiz-questions.js   # data.js → vendor/quiz/questions.json
node tools/gen-pages.js            # naviqasiya səhifələrini şablondan yazır
python tools/make_icons.py         # Downloads/loqolarından icon/ favicon/ og-image
python tools/make_fonts.py         # Google Fonts-anbarından AZ subsetli woff2-ləri endirir
python tools/noserve.py 8792       # `Cache-Control: no-store` göndərən dev-server
```

## Məlumatların harada saxlandığı

Bütün nəticələr brauzerin `localStorage` açarında (`spartans.v1`) qalır. Serverə,
API-yə və ya üçüncü tərəfə heç bir sorğu göndərilmir. Üçüncü tərəf oyunlarının
xalları `postMessage` ilə ana səhifəyə verilir və elə orada saxlanılır.

## Lisenziya

Saytın öz kodu — MIT. `vendor/` altındakı oyunlar öz yazarlarının lisenziyaları ilə
gəlir (hamısı MIT); tam siyahı, commit ünvanları və edilən dəyişikliklər:
**[CREDITS.md](CREDITS.md)**.

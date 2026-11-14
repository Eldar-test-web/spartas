# SPARTANS — İntellektual Oyunlar Klubu

Azərbaycan dilində, tam statis, çox səhifəli oyun saytı. Build addımı, framework,
veritabanı və ya backend yoxdur — HTML + CSS + vanilla JS. Rəqəmsal imza: `#0D6940`
(dərind yaşıl) və `#6FFFBE` (nanə yaşılı).

## Yeridə işlətmək

```sh
python -m http.server 8080
# və ya: npx serve .
```

`http://localhost:8080/` ünvanını aç. `file://` ilə açma — iframe-lər və `fetch`
buna icazə vermir.

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

assets/css/   main.css (dizayn sistemi) + pages.css (naviqasiya komponentləri)
assets/js/    data.js (bütün məzmun) · app.js (nüvə) · pages.js · oyun scriptləri
assets/img/   loqolar, faviconlar, hero, og-image (tools/make_icons.py ilə yaranır)
vendor/       açıq lisenziyalı oyunlar — hər qovluqda LICENSE + UPSTREAM.md
tools/        generatorlar və yoxlayıcılar (aşağıda)
```

## Tools (Node, build yoxdur — yalnız generator/yoxlayıcı)

```sh
node tools/validate-data.js        # məzmun bütövlüyü: söz uzunluqları, cavab indeksləri, bağlantılar
node tools/gen-wordle-words.js     # data.js → vendor/wordle/words.js
node tools/gen-crossword.js        # Azərbaycan sözlərindən 17×17 şəbəkə qurur
node tools/gen-crossword-puzzle.js # şəbəkə → vendor/crosswords/puzzle.js
node tools/patch-crosswords.js     # crosswords-js bundle-inə AZ əlifba yaması
node tools/gen-quiz-questions.js   # data.js → vendor/quiz/questions.json
node tools/gen-pages.js            # naviqasiya səhifələrini şablondan yazır
python tools/make_icons.py         # Downloads/loqolarından icon/ favicon/ og-image
```

## Məlumatların harada saxlandığı

Bütün nəticələr brauzerin `localStorage` açarında (`spartans.v1`) qalır. Serverə,
API-yə və ya üçüncü tərəfə heç bir sorğu göndərilmir. Üçüncü tərəf oyunlarının
xalları `postMessage` ilə ana səhifəyə verilir və elə orada saxlanılır.

## Lisenziya

Saytın öz kodu — MIT. `vendor/` altındakı oyunlar öz yazarlarının lisenziyaları ilə
gəlir (hamısı MIT); tam siyahı, commit ünvanları və edilən dəyişikliklər:
**[CREDITS.md](CREDITS.md)**.

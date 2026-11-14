# quiz — yuxarı layihə məlumatı

| | |
|---|---|
| **Mənbə** | https://github.com/jamesqquick/Build-A-Quiz-App-With-HTML-CSS-and-JavaScript |
| **Lisenziya** | MIT (bax: `LICENSE`) |
| **İstifadə olunan commit** | `ef07bc7c4baa51bad8eb44727895a5dd667e41dc` (2023-03-02) |
| **Qovluq** | repo-nun `Quiz App Master` buraxılışı |
| **Müəllif** | James Quick |

## SPARTANS üçün edilən dəyişikliklər

### Tapılıb düzəldilən xətalar
1. **Mütləq yollar** — upstream `window.location.assign('/end.html')`, `href="/game.html"`,
   `assign('/')` kimi kök-yollardan istifadə edirdi. Layiq qovluğunda (məs.
   `/spartas/vendor/quiz/`) bu əlaqələr 404 verirdi. Bütün yollar nisbiyə çevrildi.
2. **Rekord ekranı ləğv edildi** — upstream nəticə səhifəsində istifadəçidən ad
   sorulur və `localStorage`-də "şəxsi rekordlar" saxlanılırdı. Nəticələr artıq
   klub cədvəlinə (`postMessage` → `SP.addResult`) yazıldığı üçün ad forması və
   `highscores.html` / `highscores.js` / `highscores.css` silindi, `index.html`-dəki
   "Rekordlar" düyməsi götürüldü.
3. **Sabit uyğunsuzluğu** — `MAX_QUESTIONS = 3` idi, amma API 10 sual gətirirdi;
   proqres zolağı da buna görə səhv dolurdu. `?n=` parametri (3–20) əlavə edildi.
4. **Sözdüzəldi** — `availableQuesions` → `availableQuestions`.

### Uyğunlaşdırmalar
5. **Mənbə dəyişdirildi** — Open Trivia DB (ingilis, xarici API) əvəzinə lokal
   `questions.json` işlədilir; fayl `tools/gen-quiz-questions.js` ilə
   `assets/js/data.js`-dakı Azərbaycan suallarından yaradılır.
6. **İzah** — hər cavabdan sonra `explanation` sətri göstərilir (upstream-də belə sahə yox idi).
7. **Kateqoriya seçimi** — `index.html`-də kateqoriya + sual sayı seçimi, `?cat=` ilə ötürülür.
8. **Dil** — bütün interfeys mətnləri Azərbaycan dilinə çevrildi.
9. **Xal körpüsü** — tur bitəndə nəticə `postMessage` ilə ana səhifəyə göndərilir.
   `end.html` yalnız `mostRecentScore`-u göstərir (xal iki dəfə yazılmasın) və
   "Yenidən oyna" linki seçilmiş kateqoriya/sual sayını (`?cat=&n=`) saxlayır.
10. **Rəng** — `adapt.css` upstream-in `app.css`/`game.css` üstünə yazılır:
    `#0D6940` + `#6FFFBE`.

Oyunun axışı (sual göstərmək, cavab yoxlamaq, xal artırmaq, proqres zolağı) upstream
məntiqi ilə eynidir; yalnız mənbə, yollar və yuxarıdakı xətalar dəyişdirilib.

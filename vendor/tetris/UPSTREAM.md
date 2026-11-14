# tetris — yuxarı layihə məlumatı

| | |
|---|---|
| **Mənbə** | https://github.com/dionyziz/canvas-tetris |
| **Lisenziya** | MIT (bax: `LICENSE.md`) |
| **Müəllif** | Dionyziz |
| **Fayllar** | `index.html`, `js/{tetris,controller,render}.js`, `style.css`, `sound/pop.ogg` |

## Niyə bu oyun seçildi
Mini oyunlar bölməsi üçün kiçik (ümumi 20 KB), çixarış-tələb etməyən (build-siz),
vanilla JS kanvas oyunu axtarıldı. `npm`/React variantları (vue-tetris, flatris,
blockrain.js) və build tələb edən `patorjk/JavaScript-Snake` kənara atıldı.

## SPARTANS üçün edilən dəyişikliklər

1. **Xal sayğacı əlavə edildi** — upstream təmiz demodur, xal yoxdur.
   `js/tetris.js` → `clearLines()` içinə bir sətir yazıldı:
   `window.SP_LINES = (window.SP_LINES || 0) + 1;`
   Bu dəyər `bridge.js` tərəfindən 100 xal/sətir kimi qiymətləndirilir.
2. **`bridge.js`** — HUD (sətir/xal) yaradır, `window.lose` bayrağını izləyir,
   nəticəni `postMessage` ilə ana səhifəyə göndərir və "Oyun bitdi" pəncərəsi göstərir.
3. **Rənglər** — `js/tetris.js`-dəki `colors` massivi (`cyan, orange, blue, yellow,
   red, green, purple`) klub palitrası ilə əvəz olundu: `#0D6940 → #6FFFBE` aralığında
   7 ton. Üstəgəl `adapt.css` fonu, kənarlıqı və düymələri yenidən rəngləyir.
4. **Dil** — titr, "Play" düyməsi ("Başla") və təlimat sətiri Azərbaycan dilinə çevrildi;
   `lang="az"` və viewport meta əlavə edildi.
5. **Təmizlik** — `README.md` və `.quadnix/` build təsviri silindi.

Fırlanma, hərəkət, sətir təmizləmə və çəkmə məntiqi upstream-dakı kimidir.

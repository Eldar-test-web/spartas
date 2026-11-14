# wordle — yuxarı layihə məlumatı

| | |
|---|---|
| **Mənbə** | https://github.com/WebDevSimplified/wordle-clone |
| **Lisenziya** | MIT (bax: `LICENSE`) |
| **İstifadə olunan commit** | `b12c2df422d2393b156600d2536a20f4c824af32` (2022-03-17) |
| **Müəllif** | Web Dev Simplified |

## SPARTANS üçün edilən dəyişikliklər

1. **Söz bazası** — upstream-dəki 15.000 sətirlik ingilis `targetWords` / `dictionary`
   massivləri silindi. Sözlar artıq `words.js`-dən gəlir və `assets/js/data.js`
   içindəki Azərbaycan siyahısından `tools/gen-wordle-words.js` ilə avtomatik yaradılır.
2. **Çoxölçülü rejim** — `?len=4..8` sorğu parametri ilə sözün uzunluğu dəyişdirilir;
   şəbəkə (`buildGrid()`) dinamik qurulur. Upstream yalnız 5 hərfli sabit şəbəkə idi.
3. **Rejim seçimi** — `?mode=daily` (istifadəyə açılmamış) / `?mode=free` (təsadüfi söz).
4. **Azərbaycan əlifbası** — klaviatura yoxunu `/^[a-z]$/` əvəzinə 32 hərfli AZ çoxluğudur;
   `ə, ı, ğ, ş, ç, ö, ü, İ` hərfləri daxil edildi; klaviatura düzülüşi AZ Q-klaviaturasına
   uyğun yenidən yazıldı.
5. **Dil** — bütün istifadəçi mesajları Azərbaycan dilinə çevrildi ("Belə söz lüğətdə yoxdur").
6. **Xal körpüsü** — `report()` funksiyası nəticəni `postMessage` ilə ana səhifəyə göndərir;
   klub xal cədvəli elə bu mesajı dinləyir.
7. **Rəng** — `adapt.css` upstream-in `styles.css`-ini əvəz etmir, yalnız üzərinə yazır:
   palette `#0D6940` + `#6FFFBE`.

`pressKey / deleteKey / submitGuess / flipTile / shakeTiles / danceTiles / checkWinLose`
funksiyalarının axışı upstream ilə eynidir.

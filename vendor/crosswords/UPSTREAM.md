# crosswords — yuxarı layihə məlumatı

| | |
|---|---|
| **Mənbə** | https://github.com/dwmkerr/crosswords-js |
| **Lisenziya** | MIT (bax: `LICENSE`) |
| **İstifadə olunan commit** | `803d31f548e57f3e34e0cdc45aaa6baccc6ee826` (2026-09-10) |
| **Versiya** | 0.1.14 (`dist/crosswords.js`, ESM bundle) |
| **Müəllif** | Dave Kerr və töhfəçilər |

## SPARTANS üçün edilən dəyişikliklər

### 1. Azərbaycan əlifbası yaması (`dist/crosswords.js`)
Bundle yalnız `[a-z]` hərflərini qəbul edirdi və həll sözlərini
`toUpperCase().replaceAll(/[^A-Z]/g,"")` ilə təmizləyirdi — yəni **ə, ı, ğ, ş, ç, ö, ü, İ**
hərfləri ya yazıla bilmirdi, ya da həll sözündən silinirdi.
`tools/patch-crosswords.js` beş nöqtəni yamayır:

| Yer | Əvvəl | Sonra |
|---|---|---|
| həll sözü | `e.solution.toUpperCase().replaceAll(/[^A-Z]/g,"")` | `azUpperStr(...)` + AZ hərflərini saxlayan regex |
| cavab sətiri | `e.answer.toUpperCase().replaceAll(/[^ A-Z]/g," ")` | eyni məntiq AZ ilə |
| açılmış hərflər | `e.revealed.toUpperCase()` | `azUpperStr(e.revealed)` |
| klaviatura yoxunu | `const so = /^[a-z]$/, co = /^[a-z]$/` | `AZ_LOW` (32 AZ hərfi) |
| keypress | `t.toLowerCase(), t.toUpperCase()` | `azLower(t), azUpper(t)` |

Yamanı təkrarlamaq: `node tools/patch-crosswords.js`.

### 2. Şəbəkə məlumatı (`puzzle.js`)
`tools/gen-crossword.js` Azərbaycan sözləri ilə şəbəkə qurur (26 kəsişən sual, 17×17),
`tools/gen-crossword-puzzle.js` onu crosswords-js-in `CrosswordSource` formatına çevirir
(`<n>. <sual> (<uzunluq>)` şablonu və böyük AZ hərfli həll sözləri).

### 3. Səhifə qatı (`index.html`, `adapt.css`)
Alət paneli, status sətri və `#0D6940`/`#6FFFBE` rəqəmləri əlavə edilib;
`crosswordSolved` hadisəsi `postMessage` ilə ana səhifəyə xal göndərir.
Upstream-in MVC məntiqinə (grid, clue, keyboard naviqasiyası) toxunulmayıb.

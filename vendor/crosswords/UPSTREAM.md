# crosswords — yuxarı layihə məlumatı

| | |
|---|---|
| **Mənbə** | https://github.com/dwmkerr/crosswords-js |
| **Lisenziya** | MIT (bax: `LICENSE`) |
| **İstifadə olunan commit** | `803d31f548e57f3e34e0cdc45aaa6baccc6ee826` (2026-09-10) |
| **Versiya** | 0.1.14 (`dist/crosswords.js`, ESM bundle) |
| **Müəllif** | Dave Kerr və töhfəçilər |

## SPARTANS üçün edilən dəyişikliklər

### 1. Bundle yaması (`dist/crosswords.js`)
Bundle yalnız `[a-z]` hərflərini qəbul edirdi və həll sözlərini
`toUpperCase().replaceAll(/[^A-Z]/g,"")` ilə təmizləyirdi — yəni **ə, ı, ğ, ş, ç, ö, ü, İ**
hərfləri ya yazıla bilmirdi, ya da həll sözündən silinirdi.
`tools/patch-crosswords.js` yeddi nöqtəni yamayır (aşağıdakı son iki sətir sadəcə mətn
çevirsisidir):

| Yer | Əvvəl | Sonra |
|---|---|---|
| həll sözü | `e.solution.toUpperCase().replaceAll(/[^A-Z]/g,"")` | `azUpperStr(...)` + AZ hərflərini saxlayan regex |
| cavab sətiri | `e.answer.toUpperCase().replaceAll(/[^ A-Z]/g," ")` | eyni məntiq AZ ilə |
| açılmış hərflər | `e.revealed.toUpperCase()` | `azUpperStr(e.revealed)` |
| klaviatura yoxunu | `const so = /^[a-z]$/, co = /^[a-z]$/` | `AZ_LOW` (32 AZ hərfi) |
| keypress | `t.toLowerCase(), t.toUpperCase()` | `azLower(t), azUpper(t)` |
| açmaz başlığı | `r("crossword-across-clues", "Across")` | `… "Üfüqi")` |
| açmaz başlığı | `r("crossword-down-clues", "Down")` | `… "Şaquli")` |

Yamanı təkrarlamaq: `node tools/patch-crosswords.js`.

### 2. Şəbəkə məlumatı (`puzzle.js`)
`tools/gen-crossword.js` Azərbaycan sözləri ilə şəbəkə qurur (26 kəsişən sual, 17×17),
`tools/gen-crossword-puzzle.js` onu crosswords-js-in `CrosswordSource` formatına çevirir.

### Tapılıb düzəldilən xəta — şəbəkə heç vaxt yüklənmirdi
Kitabxananın validatori (`Dr(e)`) `document.mimetype === "application/vnd.js-crossword"`
və `document.version === "1.0"` tələb edir. Bu sahələr olmadan `newCrosswordController()`
`səhv` qaytarır və səhifə "Şəbəkə yüklənmədi" yazısı ilə qalırdı. Generator artıq
`title/date/description/author/publisher` ilə yanaşı bu iki sahəni də yazır.

### Açmazların (`clue`) formatı
Kitabxana hər açmazı `<n>. <mətn> (<uzunluq>)` şablonu ilə iki regex-ə parçalayır.
Mətndə mötərizə və ya nöqtə olarsa parçalanma pozulur, uzunluq səhv düşür.
Buna görə generator:
1. `cleanText()` — mötərizələri vergüllə, tək nöqtələri silir;
2. açmazları **ədəccə** nöqtələnmiş mövqeyə görə sıralayır (ləğvicə sıralama "10."-u
   "2."-dən əvvəl qoyurdu);
3. hazırlandıqdan sonra hər açmazın həll sözünün uzunluğunu `<uzunluq>` ilə yoxlayır və
   uyğunsuzlukda **seans etmədən xəta verir** (əvvəllər səhv səssizcə şəbəkəyə düşürdü).

### 3. Səhifə qatı (`index.html`, `adapt.css`)
Alət paneli qruplara bölündü (**Yoxla / Sil / Kömək**), status sətri panelin sağına
köçürüldü, `reset-crossword` (bütövlükdə sıfırlama) düyməsi götürüldü — klub oyunu
"kömək" xallarından saydığı üçün tam təmizləmə düyməsi əlverişsiz idi.
`#0D6940`/`#6FFFBE` rəqəmləri kitabxananın `--dark-color`, `--light-color`,
`--grid-cell-size` kimi tokenlərini üstün yazmaqla verilir; `crosswordSolved`
hadisəsi `postMessage` ilə ana səhifəyə xal göndərir.
Upstream-in MVC məntiqinə (grid, clue, keyboard naviqasiyası) toxunulmayıb.

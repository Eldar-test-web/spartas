# Dos-crossa — yuxarı layihə məlumatı

| | |
|---|---|
| **Mənbə** | https://github.com/ramazancetinkaya/tic-tac-toe |
| **Lisenziya** | MIT (bax: `LICENSE`, © 2025 Ramazan Çetinkaya) |
| **Müəllif** | Ramazan Çetinkaya |

İki nəfərlik dos-crossa (X / O) — kompüterə qarşı üç çətinlik səviyyəsi.
Minimax əsaslı süni intellekt upstream-dədir və dəyişdirilməyib.

## SPARTANS üçün edilən dəyişikliklər

1. **XARICI CDN SİLİNDİ** — upstream ikonları jsdelivr üzərindən `bootstrap-icons`
   şrifti ilə yükləyirdi. GitHub Pages-də işləməsi və saytın heç bir üçüncü tərəf
   resursundan asılı qalmaması üçün X / O və yenidən başlatma işarələri yerli
   inline SVG ilə əvəz olundu (`script.js`-dəki `MARK_SVG`).
2. **DİL** — bütün interfeys mətnləri Azərbaycanca: menyu, çətinlik düymələri,
   növbə göstəricisi, nəticə pəncərələri, `aria-label`-lar.
3. **RƏNG / ŞRİFT** — `adapt.css`: upstream-in tünd göy + sarı palitrası əvəzinə
   `#0D6940` + `#6FFFBE`; şriftlər `assets/css/frame.css`-dən (Oswald + Bitter).
   upstream `styles.css` dəyişdirilməyib, yalnız onun `:root` dəyişənlərinin
   üzərinə yazılır.
4. **XAL KÖRPÜSÜ** — hər turun sonunda `script.js`-ə əlavə olunan `reportRound()`
   nəticəni `postMessage` ilə klub səhifəsinə göndərir: qələbə 30, heç-heçə 10,
   məğlubiyyət 0 xal.

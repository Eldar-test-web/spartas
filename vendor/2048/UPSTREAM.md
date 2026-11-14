# 2048 — yuxarı layihə məlumatı

| | |
|---|---|
| **Mənbə** | https://github.com/gabrielecirulli/2048 |
| **Lisenziya** | MIT (bax: `LICENSE.txt`) |
| **İstifadə olunan commit** | `478b6ec346e3787f589e4af751378d06ded4cbbc` (2024-10-24) |
| **Müəllif** | Gabriele Cirulli |

## SPARTANS üçün edilən dəyişikliklər

1. **Dil** — `index.html` daxilindəki bütün mətnlər (titr, təlimat, düymələr) Azərbaycan
   dilinə çevrildi; `js/html_actuator.js`-dəki `"You win!" / "Game over!"` sətirləri
   `"Qazandın!" / "Oyun bitdi!"` ilə əvəz olundu.
2. **Rəng** — `adapt.css` əlavə edildi: upstream-in bej/narıncı palitrası əvəzinə
   `#0D6940` + `#6FFFBE` (2048 → ağ-yaşıl). Upstream `style/main.css` dəyişdirilməyib,
   yalnız üzərinə yazılır.
3. **Xal körpüsü** — `bridge.js` əlavə edildi. Upstream-in nəticə API-si olmadığı üçün
   `.game-message` elementindəki `game-over` / `game-won` sinif dəyişikliyi izlənilir və
   xal `postMessage` ilə ana səhifəyə göndərilir (klub cədvəli üçün 1/10 miqyas).
4. **Təmizlik** — `meta/apple-touch-startup-image-*.png` (112 KB) silindi və ona aid
   `<link>`ar aradan qaldırıldı; favicon valideyn qovluqdan götürüldü.
5. **Qeyd** — upstream-in "rəsmi sayt" barədə qeyzi əvəzinə lisenziya tələb olunan
   mənbə göstərişi yazıldı.

Oyun məntiqi (`game_manager.js`, `grid.js`, `tile.js`, `keyboard_input_manager.js`)
olduğu kimi saxlanılıb.

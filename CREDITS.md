# Mənbə və lisenziyalar (CREDITS)

Saytın oyunlarının əksəriyyəti açıq lisenziyalı layihələrdən götürülüb. Hər oyunun
`vendor/<ad>/` qovluğunda öz `LICENSE` (və ya `LICENSE.txt` / `LICENSE.md`) faylı və
`tərif → dəyişiklik` siyahısı (`UPSTREAM.md`) saxlanılır. Aşağıdakı cədvəl ümumi
siyahıdır; ətraflı hər qovluqdakı `UPSTREAM.md`-dədir.

## Üçüncü tərəf oyunlar

| Oyun | Mənbə | Müəllif | Lisenziya | İstifadə olunan commit | Uyğunlaşdırma vəziyyəti |
|---|---|---|---|---|---|
| İntellektual Wordle | [WebDevSimplified/wordle-clone](https://github.com/WebDevSimplified/wordle-clone) | Web Dev Simplified | MIT | `b12c2df422d2393b156600d2536a20f4c824af32` | bitdi — AZ əlifba, 4–8 hərf, lokal söz bazası, xal körpüsü |
| Krossvord | [dwmkerr/crosswords-js](https://github.com/dwmkerr/crosswords-js) | Dave Kerr və töhfəçilər | MIT | `803d31f548e57f3e34e0cdc45aaa6baccc6ee826` (v0.1.14) | bitdi — AZ əlifba yaması, 26 suallıq Azərbaycan şəbəkəsi |
| Klassik Suallar (viktorina) | [jamesqquick/Build-A-Quiz-App-With-HTML-CSS-and-JavaScript](https://github.com/jamesqquick/Build-A-Quiz-App-With-HTML-CSS-and-JavaScript) | James Quick | MIT | `ef07bc7c4baa51bad8eb44727895a5dd667e41dc` | bitdi — Open Trivia DB əvəzinə lokal AZ sual bankı, yol və sıralama xətaları düzəldildi |
| 2048 | [gabrielecirulli/2048](https://github.com/gabrielecirulli/2048) | Gabriele Cirulli | MIT | `478b6ec346e3787f589e4af751378d06ded4cbbc` | bitdi — AZ mətnlər, klub palitrası, xal körpüsü |
| Tetris | [dionyziz/canvas-tetris](https://github.com/dionyziz/canvas-tetris) | Dionysis Zindros | MIT | upstream-də tag yoxdur; klonlanan ağac | bitdi — AZ interfeys, yaşıl palitra, sətir sayğacı + xal körpüsü |
| Yaddaş (memory) | [taniarascia/memory](https://github.com/taniarascia/memory) | Tania Rascia | MIT | 2018 buraxılışı | davam edir — **Nintendo sprite qrafikası (`img/*.png`) lisenziyasız olduğu üçün tamamilə silindi**, əvəzinə klubun own SVG ikonları qoyuldu; karışdırma (shuffle) xətası Fisher–Yates ilə düzəldildi |
| Tic-tac-toe | [ramazancetinkaya/tictactoe](https://github.com/ramazancetinkaya/tictactoe) | Ramazan Çetinkaya | MIT | `main`, 2025-08-29 | davam edir — AZ mətnlər və rəng qatı; bootstrap-icons CDN asılılığı lokal SVG ilə əvəz olunur |

## Klubun öz yazdığı oyunlar

Bu ikisi üçün açıq lisenziyalı, build-tələb etməyən və Azərbaycan dilinə uyğunlaşdırıla
bilən hazır layihə tapılmadı (axtarış nöqtələri: "fermi estimation game", "order of
magnitude game", "guess the size of", "size comparison", "bigger or smaller"). Ona görə
`assets/js/size.js` və `assets/js/fermi.js` klub tərəfindən yazılıb.

| Oyun | Nəyə əsaslanır | Nə kopyalanmayıb |
|---|---|---|
| Ölçü Tahmini | Magnitudle saytındakı "Size It Up" oyununun **mexanikası** (5 raund, hər raundda ən çox 100 xal, tərtib yaxınlığına görə xal). Oyun mexanikası müəllif hüququ ilə qorunmur. | Magnitudle-un heç bir rəsmi, mətni, siyahısı və ya məlumat bazası istifadə olunmayıb. Siluetlər klubun own SVG-ləridir, hündürlüklər ictimai mənbələrdən yoxlanılmış real rəqəmlərdir. |
| Fermi Tahmini | Enrico Fermi-nin təxmini metodunun ümumi məntiqi (dərslik məzmunu). | Suallar və variantlar klub tərəfindən yazılıb. |

## Qrafika

- Loqolar və emblem: klubun öz SPARTANS loqosundan `tools/make_icons.py` ilə generasiya
  olunub (favicon, apple-touch-icon, 192/512 PWA ikonları, 1200×630 og-image) və yalnız
  `#0D6940` / `#6FFFBE` palitrasına çevrilib.
- `assets/img/hero-spartan.jpg`: sayt üçün istifadə olunan foto — istinad mənbəyi
  `vendor/` lisenziyalarından asılı deyil, yalnız klub brendinqi üçün emalı edilib.

## Rəng palitrası

Bütün uyğunlaşdırmalarda yalnız iki brend rəngi işlədilir: **`#0D6940`** (dərind yaşıl)
və **`#6FFFBE`** (nanə yaşılı). Upstream-in öz palitrası `adapt.css` ilə üzərinə yazılaraq
dəyişdirilir — upstream-in `style.css` / `app.css` faylları olduğu kimi qalır.

## Səlahiyyət

Saytın öz kodu (assets, tools, səhifələr) MIT lisenziyası ilə yayımlanır. Yuxarıdakı
layihələrin kodu öz müəlliflərinin MIT lisenziyaları ilə gəlir — hər qovluqda ayrıca
`LICENSE` faylı var və heç biri silinməyib.

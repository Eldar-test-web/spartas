# Yaddaş oyunu — yuxarı layihə məlumatı

| | |
|---|---|
| **Mənbə** | https://github.com/taniarascia/memory |
| **Lisenziya** | MIT (bax: `LICENSE`) |
| **Müəllif** | Tania Rascia |

## SPARTANS üçün edilən dəyişikliklər

1. **QRAFİKANIN TAMAMEN SİLİNMƏSİ** — upstream Super Mario kartlarından istifadə
   edirdi (mario, luigi, peach, goomba, bobomb, thwomp və s.). Bunlar Nintendo-nun
   müəllif hüquqlu obrazlarıdır və klonlanıb paylana bilməz. `js/script.js`-dəki
   kart siyahısı klubun öz 12 SVG ikonuna (qalqan, mizrək, bayquş, amfore, disk,
   dəfn dəstəsi, üçdişli, sutun, ulduz, tomar, məşəl, burc) əvəz olundu — hamısı
   `data:image/svg+xml` kimi daxildədir, heç bir xarici fayl və ya CDN istifadə edilmir.
2. **QARIŞDIRMA XƏTASI** — `array.sort(() => 0.5 - Math.random())` düzgün qarışdırma
   deyil; Fisher–Yates ilə əvəz olundu.
3. **XAL KÖRPÜSÜ** — kartlar tapılanda nəticə (`gediş` sayı və xal) `postMessage` ilə
   klub səhifəsinə göndərilir: 12 gedişdə bitsə 100 xal, hər əlavə gediş −2, minimum 20.
4. **DİL / RƏNG** — mətnlər Azərbaycanca; `adapt.css` ilə mavi-narıncı palitra
   əvəzinə `#0D6940` + `#6FFFBE`, şriftlər `assets/css/frame.css`-dən (Oswald + Bitter).
5. **TƏMİZLİK** — `img/` qovluğu (Nintendo PNG-ləri və `question.gif`) silindi;
   sual işarəsi `adapt.css`-də daxili SVG-dir. `console.log` zəbli təmizləndi.

Oyun məntiqi — cüt müqayisəsi və `delay` ilə kartların geri çevrilməsi — olduğu kimi saxlanılıb.

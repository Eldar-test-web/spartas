/* SPARTANS — bütün məzmun (sözlər, suallar, oyunlar, komandalar)
   Mənbə: Azərbaycan dilinin gündəlik lüğəti, ümumi məlum faktlar. */

window.SP = window.SP || {};

/* ---------- Azərbaycan əlifbası (Wordle klaviaturası) ---------- */
SP.ALPHABET = ["A", "B", "C", "Ç", "D", "E", "Ə", "F", "G", "Ğ", "H", "X", "I", "İ",
  "J", "K", "Q", "L", "M", "N", "O", "Ö", "P", "R", "S", "Ş", "T", "U", "Ü", "V", "Y", "Z"];

/* ---------- Wordle: cavab sözləri (uzunluq + əlifba yoxunu: node tools/validate-data.js) ---------- */
SP.WORDS = {
  4: ["QAPI", "DƏRƏ", "ALMA", "UŞAQ", "XALA", "BACI", "DAYI", "OĞUL", "ŞEİR", "ƏSƏR",
    "FAİZ", "İSTİ", "ODUN", "DOST", "QARA", "SARI", "KƏRƏ", "EVLİ", "QUZU", "DANA",
    "ADAM", "GECƏ", "HAVA", "ÖLÇÜ", "RƏNG", "İŞIQ", "DÖVR", "VƏXT", "SAAT", "İLAN",
    "GƏNC", "DİŞİ", "OYUN", "QƏSR", "KƏND", "TƏRƏ", "ÜZÜK", "QƏND", "ƏZİZ", "QAYA",
    "QALA", "SUAL", "DƏRİ", "ARXA", "ÜSTÜ", "QURU", "UZUN", "QISA", "DƏVƏ", "ÜMİD",
    "ARZU", "ALƏM", "MƏTN", "ARAM", "ABRU", "ELMİ", "ÜZÜM", "GƏMİ", "ƏSİR", "XALQ",
    "ƏMƏK", "DƏFN", "SÜBH", "QƏFL"],
  5: ["KİTAB", "BAHAR", "DƏNİZ", "ÇÖRƏK", "ŞƏKƏR", "SOYUQ", "GƏLİN", "KÜLƏK", "YAĞIŞ", "DUMAN",
    "ULDUZ", "GÜNƏŞ", "VƏTƏN", "BİLİK", "QƏZƏL", "ROMAN", "MİSRA", "BƏYİT", "NAĞMƏ", "SALON",
    "QƏLƏM", "YAŞIL", "QIZIL", "TOYUQ", "BALIQ", "QOYUN", "NÖMRƏ", "CAVAB", "HƏYAT", "QORXU",
    "SEVGİ", "GÜNAH", "AXŞAM", "SƏHƏR", "ÇİÇƏK", "MEYVƏ", "DOLMA", "PİLAF", "GÖZƏL", "YAXŞI",
    "SARAY", "QANAD", "SÜMÜK", "DİRƏK", "PƏRDƏ", "HÜQÜQ", "QANUN", "VƏKİL", "NÜFUZ", "DÜNYA",
    "SƏBƏB", "ƏLAVƏ", "ƏSASİ", "MÖVZU", "SƏFƏR", "ŞƏKİL", "QOVUN", "KƏLMƏ", "ÜNVAN", "XƏBƏR",
    "NƏZƏR", "QƏDİM", "SALAM", "DƏYƏR", "ARXİV", "BAĞIŞ", "ORQAN", "SƏNƏD", "GÜMAN", "SƏRAB",
    "YALAN", "DOĞRU", "NÖVBƏ", "ÜMUMİ", "İNSAF", "MƏSUM", "KƏÇƏL", "ƏDƏBİ", "SÜBUT", "VƏZİR",
    "İCAZƏ", "RADİO"],
  6: ["GÜNDÜZ", "QARDAŞ", "TƏBİƏT", "DƏFTƏR", "MƏKTƏB", "ŞAGİRD", "DASTAN", "BİLANÇ", "KREDİT", "REKLAM",
    "NÜMUNƏ", "İMTHAN", "MƏQALƏ", "JURNAL", "CƏDVƏL", "BOYNUZ", "TORPAQ", "DÜŞMƏN", "VƏZİFƏ", "HƏMRAH",
    "MAARİF", "TƏHSİL", "SÖHBƏT", "MUSİQİ", "RƏSSAM", "TƏRƏVƏ", "GÜNLÜK", "ŞƏBƏKƏ", "AVRUPA", "QAFQAS",
    "ƏDALƏT", "NƏTİCƏ", "DÖVLƏT", "MƏNZİL", "SƏMİMİ", "DİQQƏT", "BİRLİK", "KAINAT", "YOLDAŞ", "MÜSAVİ",
    "MƏSCİD", "KİLİSƏ", "TƏRTİL", "DƏRGƏH", "MƏKTUB", "RƏFİQƏ", "VİCDAN", "MEYDAN", "ZƏNGİN", "TƏKLİF",
    "MƏHSUL", "QƏRİBƏ", "MƏDƏNİ", "BAĞBAN", "HƏSSAS", "RÜSXƏT", "MÜASİR", "TİYATR"],
  7: ["MÜƏLLİM", "DANIŞIQ", "MÜŞTERİ", "HESABAT", "VALYUTA", "DEPOZİT", "İQTİSAD", "PƏNCƏRƏ", "YUMURTA", "MƏDRESƏ",
    "CIRTDAN", "SUALLAR", "İMTİHAN", "ƏLYAZMA", "TAPMACA", "SİYASƏT", "PARALEL", "MƏNZƏRƏ", "MAHKAMƏ", "AZADLIQ",
    "TƏCRÜBƏ", "KARYERA", "İMTİTAZ", "İNQİLAB", "ƏHVALAT", "DƏYƏRLİ", "HƏYECAN", "ÜMİDSİZ", "NÜFUZLU", "MİSAFİR",
    "TALİMAT", "ƏMRNAMƏ", "MÜŞAVİR", "SİFARİŞ", "RƏQABƏT", "İNKİŞAF", "ƏMƏKDAŞ", "DOSTLUQ", "BƏDİAHİ", "SESSİYA",
    "KONSERT"],
  8: ["TƏŞKİLAT", "MÜSTƏQİL", "VƏTƏNDAŞ", "SUALNAMƏ", "MEMARLIQ", "MÜSAHİBƏ", "İNTERNET", "KOMPÜTER", "İCTİMAYİ", "İQTİSADİ",
    "CƏMİYYƏT", "HƏMVƏTƏN", "MÜKƏMMƏL", "VƏZİYYƏT", "TƏŞƏKKÜR", "QARŞILIQ", "HÜRRİYƏT", "MÜŞAHİDƏ", "TƏRƏDDÜD", "MƏHSULAT",
    "ARQUMENT", "MÜZAKİRƏ", "MİLLƏTÇİ", "SƏBƏBSİZ", "TƏSADÜFİ", "MÜNAZİRƏ", "MİQYASLI", "ORQANİZM", "MÜHTƏŞƏM", "MƏŞĞULƏT",
    "QƏHRƏMAN", "SEÇİMLƏR"]
};


SP.WORD_HINTS = {
  4: "Qısa, gündəlik söz. Diqqətli ol — hər hərfin yeri vacibdir.",
  5: "Klassik Wordle ölçüsü: 5 hərf.",
  6: "Altı hərf — iki-üç cəhddən sonra ritmi tapacaqsan.",
  7: "Yeddi hərfli söz adətən bir anlayışı ifadə edir.",
  8: "Səkkiz hərf — ən çətin rejim. Səbirlə hərəkət et."
};

/* ---------- Klassik sual bankı (viktorina) ---------- */
SP.QUESTIONS = [
  { c: "Tarix", d: "Asan", q: "Azərbaycan Xalq Cümhuriyyəti hansı ildə elan olundu?", o: ["1905", "1918", "1920", "1991"], a: 1, x: "28 may 1918-ci ildə elan olundu." },
  { c: "Tarix", d: "Asan", q: "İkinci Dünya müharibəsi hansı ildə başa çatdı?", o: ["1943", "1945", "1948", "1950"], a: 1, x: "1945-ci ildə bitdi." },
  { c: "Tarix", d: "Orta", q: "Azərbaycan Respublikasının ilk Konstitusiyası hansı ildə qəbul olundu?", o: ["1991", "1993", "1995", "1998"], a: 2, x: "Konstitusiya 12 noyabr 1995-ci ildə referendumla qəbul olundu." },
  { c: "Tarix", d: "Orta", q: "Azərbaycan BMT-yə hansı ildə üzv oldu?", o: ["1991", "1992", "1993", "1994"], a: 1, x: "2 mart 1992-ci ildə BMT-nin üzvü oldu." },
  { c: "Tarix", d: "Orta", q: "Nizami Gəncəvi hansı əsrdə yaşamış şairdir?", o: ["XII əsr", "XIV əsr", "XVI əsr", "XVIII əsr"], a: 0, x: "Nizami təqribən 1141–1209-cu illərdə, yəni XII–XIII əsrlərdə yaşayıb." },
  { c: "Tarix", d: "Çətin", q: "Bakı neft sənayesi sənaye miqyasında hansı əsrdə inkişaf etməyə başladı?", o: ["XVIII əsr", "XIX əsr", "XX əsrin ortaları", "XVII əsr"], a: 1, x: "Bakı neft bumu XIX əsrin sonundan başladı — 1848-ci ildə ilk mexaniki quyusu qazıldı." },
  { c: "Coğrafiya", d: "Asan", q: "Azərbaycanın paytaxtı hansı şəhərdir?", o: ["Gəncə", "Sumqayıt", "Bakı", "Naxçıvan"], a: 2, x: "Paytaxt Bakıdır." },
  { c: "Coğrafiya", d: "Asan", q: "Dünyanın ən böyük gölü hansıdır?", o: ["Aral dənizi", "Xəzər dənizi", "Superior", "Baykal"], a: 1, x: "Səthinə görə ən böyük göl Xəzəridir (təqribən 371 000 km²)." },
  { c: "Coğrafiya", d: "Orta", q: "Azərbaycan ərazisindən keçən ən uzun çay hansıdır?", o: ["Araz", "Kür", "Tərtər", "Qanıx"], a: 1, x: "Kür çayının ümumi uzunluğu ≈1515 km, Azərbaycan ərazisindən keçən hissəsi ≈448 km-dir." },
  { c: "Coğrafiya", d: "Orta", q: "Azərbaycanın ən hündür nöqtəsi hansıdır?", o: ["Şahdağ", "Bazardüzü", "Tufandağ", "Gızılqaya"], a: 1, x: "Bazardüzü dağı 4466 m ilə ən hündür nöqtədir." },
  { c: "Coğrafiya", d: "Orta", q: "Dünyanın ən hündür dağı hansıdır?", o: ["K2", "Akonqqua", "Everest", "Denali"], a: 2, x: "Everest — 8849 m." },
  { c: "Coğrafiya", d: "Çətin", q: "Afrikanın ən hündür nöqtəsi hansı dağdır?", o: ["Kirimanjaro", "Kenya", "Rwenzori", "Tebti"], a: 0, x: "Kirimanjaro — 5895 m." },
  { c: "Coğrafiya", d: "Çətin", q: "Dünyanın ən dərin gölü hansıdır?", o: ["Tanqanyika", "Kaspi", "Baykal", "Mikovı"], a: 2, x: "Baykal gölü — 1642 m dərinlik." },
  { c: "Coğrafiya", d: "Çətin", q: "Azərbaycanın quru sərhədi olmayan ölkə hansıdır?", o: ["Gürcüstan", "Ermənistan", "Türkiyə", "Rusiya"], a: 2, x: "Türkiyə ilə yalnız dəniz sərhədi var, quru sərhəd yoxdur." },
  { c: "Elm", d: "Asan", q: "Suyun qaynama temperaturu normal təzyiqdə nə qədərdir?", o: ["90 °C", "100 °C", "110 °C", "120 °C"], a: 1, x: "100 °C (273,15 K)." },
  { c: "Elm", d: "Asan", q: "İşıq sürəti vakuumda təqribən nə qədərdir?", o: ["30 000 km/s", "300 000 km/s", "3 000 000 km/s", "30 000 000 km/s"], a: 1, x: "Təqribən 299 792 km/s." },
  { c: "Elm", d: "Orta", q: "İnsan bədənində orta hesabla neçə sümük var?", o: ["186", "206", "226", "246"], a: 1, x: "Yetkin insanda 206 sümük var." },
  { c: "Elm", d: "Orta", q: "Günəş sisteminde neçə planet rəsmən qəbul edilib?", o: ["7", "8", "9", "10"], a: 1, x: "8 planet — Pluton 2006-cı ildə cüce planetə çevrildi." },
  { c: "Elm", d: "Orta", q: "Kimyada H₂O hansı maddənin düsturudur?", o: ["Duz", "Su", "Hidrogen peroksid", "Qələvi"], a: 1, x: "H₂O — su." },
  { c: "Elm", d: "Orta", q: "İrsiyyət məlumatını daşıyan molekula necə adlanır?", o: ["DNT", "ATF", "Hemoglobin", "Xlorofil"], a: 0, x: "DNT (dezoksiribonuklein turşusu)." },
  { c: "Elm", d: "Asan", q: "Ən yüngül kimyəvi element hansıdır?", o: ["Helium", "Hidrogen", "Liti", "Kislorod"], a: 1, x: "Hidrogen — atom nömrəsi 1." },
  { c: "Elm", d: "Çətin", q: "Səs sürəti havada (20 °C) təqribən nə qədərdir?", o: ["120 m/s", "340 m/s", "760 m/s", "1400 m/s"], a: 1, x: "Təqribən 343 m/s." },
  { c: "Mədəniyyət", d: "Asan", q: "Azərbaycanın milli simli musiqi aləti hansıdır?", o: ["Tar", "Skripka", "Gitara", "Akkordeon"], a: 0, x: "Tar — Azərbaycan musiqisinin əsas alətlərindən biridir." },
  { c: "Mədəniyyət", d: "Orta", q: "Nizami Gəncəvinin 'Xamsə' əsəri neçə poemadan ibarətdir?", o: ["3", "5", "7", "9"], a: 1, x: "'Xamsə' sözünə görə 'beşlik' deməkdir — beş poemadan ibarətdir." },
  { c: "Mədəniyyət", d: "Orta", q: "'Kitabi-Dədə Qorqud' dastanının ayrı-ayrı hekayələri necə adlanır?", o: ["Boy", "Dastan", "Rivayət", "Əfsanə"], a: 0, x: "Hər bir hekayə 'boy' adlanır." },
  { c: "Mədəniyyət", d: "Orta", q: "Şərq poeziyasında 'qəzəl' hansı janrdır?", o: ["Dastan", "Lyrik şeir", "Nəsr", "Təmsil"], a: 1, x: "Qəzəl — lyrik şeir janrıdır, əsasən məhəbbət mövzusundadır." },
  { c: "Mədəniyyət", d: "Çətin", q: "İstanbulda memar Sinanın tikdiyi məşhur məscid hansıdır?", o: ["Süleymaniyyə", "Sultanəhməd", "Fatih", "Beyazid"], a: 0, x: "Süleymaniyyə məscidi (1557) memar Sinanın əsəridir." },
  { c: "Mədəniyyət", d: "Çətin", q: "Van Qoq hansı ölkənin rəssamı sayılır?", o: ["Fransa", "Niderland", "İspaniya", "Belçika"], a: 1, x: "Vincent van Gogh niderlandlı rəssamdır (1853–1890)." },
  { c: "İdman", d: "Asan", q: "Futbolda komanda meydanda neçə oyunçu ilə çıxış edir?", o: ["9", "10", "11", "12"], a: 2, x: "11 oyunçu (qapıçı daxil)." },
  { c: "İdman", d: "Asan", q: "Yay Olimpiya oyunları neçə ildən bir keçirilir?", o: ["2", "3", "4", "5"], a: 2, x: "Dört ildən bir." },
  { c: "İdman", d: "Orta", q: "Basketbolda komandanın neçə oyunçusu eyni vaxtda meydanda olur?", o: ["5", "6", "7", "11"], a: 0, x: "Beş oyunçu." },
  { c: "İdman", d: "Orta", q: "Voleybolda komanda meydanda neçə oyunçu ilə çıxır?", o: ["5", "6", "7", "11"], a: 1, x: "Altı oyunçu." },
  { c: "İdman", d: "Orta", q: "Marafon məsafəsi nə qədərdir?", o: ["32,195 km", "42,195 km", "48,195 km", "50,195 km"], a: 1, x: "42,195 km." },
  { c: "İdman", d: "Çətin", q: "Şahmatda hər tərəfin neçə piyadası var?", o: ["6", "8", "10", "12"], a: 1, x: "Hər tərəfdə 8 piyada var." },
  { c: "İdman", d: "Orta", q: "Bakı ilk Avropa Oyunlarına hansı ildə ev sahibliyi etdi?", o: ["2013", "2015", "2017", "2019"], a: 1, x: "I Avropa Oyunları 2015-ci ildə Bakıda keçirildi." },
  { c: "Məntiq", d: "Asan", q: "2 + 2 × 2 ifadəsinin qiyməti neçədir?", o: ["4", "6", "8", "10"], a: 1, x: "Əvvəlcə vurma: 2 × 2 = 4, sonra 2 + 4 = 6." },
  { c: "Məntiq", d: "Orta", q: "Bir həftədə 3 gün keçsə, həftənin neçə günü qalır?", o: ["3", "4", "5", "6"], a: 1, x: "7 − 3 = 4 gün." },
  { c: "Məntiq", d: "Çətin", q: "100 ədədinin 12%-i neçədir?", o: ["8", "10", "12", "14"], a: 2, x: "100 × 0,12 = 12." },
  { c: "Məntiq", d: "Çətin", q: "5 nəfər bir-biri ilə əl sıxsa, neçə əl sıxma olur?", o: ["10", "15", "20", "25"], a: 0, x: "C(5,2) = 5 × 4 / 2 = 10 əl sıxma." }
];

/* ---------- Fermi təxminləri ---------- */
SP.FERMI = [
  { q: "Google gündə təqribən neçə axtarış sorğusu alır?", unit: "sorğu/gün", o: [8.5e7, 8.5e8, 8.5e9, 8.5e10], a: 2, x: "Təqribən 8,5 milyard sorğu — gündəlik sifariş trilyon dəfəyə yaxın deyil." },
  { q: "Yetkin insan ürəyi ömrü boyuncu təqribən neçə dəfə döyünür?", unit: "döyüntü", o: [3e7, 3e8, 3e9, 3e10], a: 2, x: "≈80 döyüntü/dəqiqə × 525 600 dəqiqə/il × 70 il ≈ 3 milyard." },
  { q: "Orta insan il ərzində təqribən neçə söz deyir?", unit: "söz/il", o: [5.8e5, 5.8e6, 5.8e7, 5.8e8], a: 1, x: "Gündə ≈16 000 söz × 365 gün ≈ 5,8 milyon." },
  { q: "Ay Yer nə qədər uzaqlıqdadır?", unit: "km", o: [3.84e4, 3.844e5, 3.844e6, 3.844e7], a: 1, x: "Orta məsafə ≈384 400 km." },
  { q: "İnsan bədənində təqribən neçə hüceyrə var?", unit: "hüceyrə", o: [3e7, 3e10, 3e13, 3e16], a: 2, x: "Müasir qiymətləndirmə ≈30–40 trilyon hüceyrə." },
  { q: "Dünyada təqribən neçə dil mövcuddur?", unit: "dil", o: [700, 2000, 7000, 20000], a: 2, x: "Ethnologue siyahısında ≈7000 dil qeyd olunur." },
  { q: "Yetkin insan bir dəqiqədə orta hesabla neçə dəfə nəfəs alır?", unit: "nəfəs/dəq", o: [4, 16, 60, 120], a: 1, x: "Sakit halda 12–20 nəfəs; orta ≈16." },
  { q: "Azərbaycan əhalisi təqribən neçə nəfərdir?", unit: "nəfər", o: [5e6, 1e7, 2e7, 4e7], a: 1, x: "Son rəqəmlərə görə ≈10 milyon nəfər." },
  { q: "Başda təqribən neçə saç teli var?", unit: "tel", o: [1e4, 1e5, 1e6, 1e7], a: 1, x: "Orta hesabla 100 000 tel." },
  { q: "Yer planeti təqribən neçə ildir mövcuddur?", unit: "il", o: [4.5e8, 4.5e9, 4.5e10, 4.5e11], a: 1, x: "≈4,5 milyard il." },
  { q: "Bir işıq ili təqribən neçə kilometr edir?", unit: "km", o: [9.5e6, 9.5e9, 9.5e12, 9.5e15], a: 2, x: "≈9,5 trilyon km (işıq sürəti × bir ildəki saniyə sayı)." }
];

/* ---------- Ölçü Tahmini (Size It Up) obyektləri ---------- */
/* Hündürlüklər metrə — açıq mənbələrdən verilən orta qiymətlər. */
SP.SIZES = [
  { id: "fil", name: "Afrika filı", h: 3.5, note: "Yetkin erkək filin çiynə qədər hündürlüyü." },
  { id: "avtobus", name: "İki mərtəbəli avtobus", h: 4.4, note: "Klassik iki mərtəbəli şəhər avtobusu." },
  { id: "zurafe", name: "Zürafə", h: 5.5, note: "Erkək zürafənin orta hündürlüyü." },
  { id: "teyyare", name: "Boeing 747", h: 19.4, note: "Quyruq hissəsinə qədər tam hündürlük." },
  { id: "sfinqs", name: "Böyük Sfinqs", h: 20, note: "Giza sfinksi — təqribən 20 m hündürlük." },
  { id: "pisa", name: "Pisa qülləsi", h: 56, note: "Maili qüllə — alçaq tərəfi təqribən 55,8 m." },
  { id: "kolizey", name: "Kolizey", h: 48, note: "Rimdəki amfiteatrın xarici divarı." },
  { id: "tacmahal", name: "Tac Mahal", h: 73, note: "Günbəzin ucuna qədər hündürlük." },
  { id: "azadliq", name: "Azadlıq heykəli", h: 93, note: "Postamentlə birlikdə tam hündürlük." },
  { id: "bigben", name: "Elizabet qülləsi", h: 96, note: "Westminster sarayının saat qülləsi (Big Ben)." },
  { id: "piramida", name: "Keops piramidası", h: 139, note: "Giza böyük piramidasının indiki hündürlüyü." },
  { id: "eyfel", name: "Eyfel qülləsi", h: 330, note: "Antennalarla birlikdə tam hündürlük." },
  { id: "burc", name: "Burc Xəlifə", h: 828, note: "Dünyanın ən hündür binası." }
];
SP.HUMAN_H = 1.7;

/* ---------- Tapmacalar ---------- */
SP.RIDDLES = [
  { q: "Səhər dörd ayaqlı, günorta iki ayaqlı, axşam üç ayaqlı — nədir?", a: "İnsan", x: "Sfinqs tapmacası: uşaqlıqda sürünür, yetkinlikdə iki ayaq üstə gəzir, qocalığında əsaya söykənir." },
  { q: "Nə qədər çox olsa, o qədər az görürsən?", a: "Qaranlıq", x: "İşıq azaldıqca görmə də azalır." },
  { q: "Nə qədər götürsən, o qədər böyüyür?", a: "Çuxur", x: "Torpaq götürülcə çuxur dərinləşir." },
  { q: "Səni tələffüz edən kimi sınırsan — nəsan?", a: "Səssizlik", x: "Adını çəkən kimi artıq mövcud deyil." },
  { q: "Sənə aiddir, amma hamı ondan istifadə edir. Nədir?", a: "Adın", x: "Öz adını ən çox başqaları işlədir." },
  { q: "Hansı ilin hər ayının 28-ci günü var?", a: "Bütün aylar", x: "Hər ayda ən azı 28 gün olur." },
  { q: "Nə qədər çox paylasan, o qədər çox olar?", a: "Bilik", x: "Təcrübədə: öyrətdikcə özün də bərkiyirsən." },
  { q: "Sınılmadan işinə yaramayan nədir?", a: "Yumurta", x: "Yemək üçün yumurtanı qırmaq lazımdır." },
  { q: "Həmişə gəlir, amma heç vaxt çatmır. Nədir?", a: "Gələcək", x: "Sabah həmişə bir gün sonra qalır." },
  { q: "Dörd ayağı var, gəzə bilmir — nədir?", a: "Stol", x: "Ayaqları var, amma yeriniyə qalır." },
  { q: "Hansı su içilmir?", a: "Göz yaşı", x: "Su kimi axır, amma içilən deyil." },
  { q: "Sən getdikcə arxada qalır, amma heç vaxt çatmır — nədir?", a: "Üfüq", x: "Nə qədər yaxınlaşsan da, eyni məsafədə qalır." }
];

/* ---------- Komandalar və liderlər ---------- */
SP.TEAMS = [
  { name: "Spartans", emblem: "helmet", score: 1250, members: ["Elxan", "Aygün", "Tural", "Nigar", "Kamran"] },
  { name: "Phoenix", emblem: "phoenix", score: 1180, members: ["Səbinə", "Orxan", "Lalə"] },
  { name: "Leonidas", emblem: "shield", score: 1120, members: ["Cavid", "Elnur", "Zeynəb", "Rəşad"] },
  { name: "Nexus", emblem: "star", score: 980, members: ["Fərid", "Kənan"] },
  { name: "Horizon", emblem: "sun", score: 915, members: ["Nida", "Ülviyyə", "Bəhram"] },
  { name: "Argos", emblem: "eye", score: 870, members: ["Murad", "Şəbnəm"] },
  { name: "Titanlar", emblem: "bolt", score: 805, members: ["Emin", "Yeganə", "Nərmin"] }
];

SP.CATEGORIES = ["Tarix", "Coğrafiya", "Elm", "Mədəniyyət", "İdman", "Məntiq"];
SP.DIFFS = ["Asan", "Orta", "Çətin"];

/* ---------- Oyun siyahısı (Oyunlar bölməsi üçün) ---------- */
SP.GAMES = [
  { key: "wordle", href: "wordle.html", title: "İntellektual Wordle", icon: "wordle", desc: "4, 5, 6, 7, 8 hərfli Azərbaycan sözlərini 6 cəhddə tap.", tag: "Gündəlik" },
  { key: "krossvord", href: "krossvord.html", title: "Krossvord", icon: "cross", desc: "26 şaquli və üfüqi sualdən ibarət klassik şəbəkə.", tag: "" },
  { key: "olcu", href: "olcu-tahmini.html", title: "Ölçü Tahmini", icon: "ruler", desc: "Siluetə bax, hündürlüyü təxmin et — 5 raund, 500 xal.", tag: "" },
  { key: "fermi", href: "fermi-tahmini.html", title: "Fermi Tahmini", icon: "calc", desc: "Raqəmi təxmin etməyi tələb edən suallar.", tag: "" },
  { key: "mini", href: "mini-oyunlar.html", title: "Mini Oyunlar", icon: "dice", desc: "2048, Tetris, yaddaş və dos-crossa — qısa turlar.", tag: "" },
  { key: "viktorina", href: "viktorina.html", title: "Klassik Suallar", icon: "scroll", desc: "Kateqoriya və sual sayını seç, 4 variantdan düzgün cavabı tap.", tag: "" }
];

/* ---------- İkonlar ---------- */
SP.ICONS = {
  home: '<path d="M3 11 12 4l9 7"/><path d="M5.5 9.4V20h13V9.4"/><path d="M10 20v-5.5h4V20"/>',
  games: '<path d="M12 3.2 19.4 7.6v8.8L12 20.8 4.6 16.4V7.6z"/><path d="M12 3.2V12l7.4-4.4M12 12 4.6 7.6M12 12v8.8"/><circle cx="8.6" cy="14.4" r=".9" fill="currentColor" stroke="none"/>',
  questions: '<circle cx="12" cy="12" r="8.8"/><path d="M9.7 9.5a2.4 2.4 0 1 1 4.5 1c-.8.8-2.2 1.2-2.2 2.6"/><circle cx="12" cy="16.6" r=".95" fill="currentColor" stroke="none"/>',
  trophy: '<path d="M8.5 4h7v4.2a3.5 3.5 0 0 1-7 0z"/><path d="M8.5 5.4H5.8a2.4 2.4 0 0 0 2.7 2.6M15.5 5.4h2.7a2.4 2.4 0 0 1-2.7 2.6"/><path d="M12 11.7V15"/><path d="M9.4 19.8h5.2l.6-4.8H8.8z"/>',
  teams: '<circle cx="9.2" cy="8.4" r="3"/><path d="M3.8 19.6a5.4 5.4 0 0 1 10.8 0"/><path d="M16.4 6.6a2.6 2.6 0 0 1 0 5.2"/><path d="M15.6 19.6a4.6 4.6 0 0 1 4.6-4.4"/>',
  user: '<circle cx="12" cy="8" r="3.6"/><path d="M5.2 20a6.8 6.8 0 0 1 13.6 0"/>',
  search: '<circle cx="11" cy="11" r="6.4"/><path d="m15.8 15.8 4.4 4.4"/>',
  bell: '<path d="M18 15V9.4A6 6 0 0 0 6 9.4V15l-1.6 3h15.2z"/><path d="M10 21h4"/>',
  arrow: '<path d="M4 12h15"/><path d="m14 7 5 5-5 5"/>',
  wordle: '<path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z"/>',
  cross: '<path d="M4 4h16v16H4z"/><path d="M12 4v16M4 12h16"/><path d="M6.5 6.5h2M15.5 15.5h2"/>',
  ruler: '<path d="M3 9.4h18v5.2H3z"/><path d="M7 9.4v2.6M11 9.4v3.6M15 9.4v2.6M19 9.4v3.6"/>',
  calc: '<path d="M5.4 3h13.2v18H5.4z"/><path d="M8 6.6h8"/><path d="M8.6 11h.01M12 11h.01M15.4 11h.01M8.6 14.6h.01M12 14.6h.01M15.4 14.6h.01M8.6 18h3.4"/>',
  dice: '<path d="M12 3.2 19.4 7.6v8.8L12 20.8 4.6 16.4V7.6z"/><circle cx="9.4" cy="10.4" r=".95" fill="currentColor" stroke="none"/><circle cx="14.6" cy="13.6" r=".95" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r=".95" fill="currentColor" stroke="none"/>',
  scroll: '<path d="M7 4h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z"/><path d="M8.6 8.4h6.8M8.6 12h6.8M8.6 15.6h4.4"/>',
  bulb: '<path d="M9.4 17.6h5.2"/><path d="M10.4 20.4h3.2"/><path d="M12 3.4a5.8 5.8 0 0 0-3.4 10.5c.6.5.9 1.2.9 2h5c0-.8.3-1.5.9-2A5.8 5.8 0 0 0 12 3.4z"/>',
  calendar: '<path d="M3.6 5.4h16.8v15.2H3.6z"/><path d="M3.6 10.4h16.8M8 3v4M16 3v4"/>',
  check: '<path d="m5 12.4 4.6 4.6L19 7"/>',
  close: '<path d="M6 6 18 18M18 6 6 18"/>',
  share: '<path d="M12 3.4v12"/><path d="m7.2 8.2 4.8-4.8 4.8 4.8"/><path d="M5 14.6v6h14v-6"/>',
  refresh: '<path d="M20 12a8 8 0 1 1-2.4-5.7"/><path d="M20 3.6V8h-4.4"/>',
  eye: '<path d="M2.6 12S6.2 6.2 12 6.2 21.4 12 21.4 12 17.8 17.8 12 17.8 2.6 12 2.6 12z"/><circle cx="12" cy="12" r="2.8"/>',
  helmet: '<path d="M7 20V9.6A5 5 0 0 1 12 4.6a5 5 0 0 1 5 5V20"/><path d="M12 4.6V20"/><path d="M7 10.6h10"/><path d="M9.4 20v-4.6M14.6 20v-4.6"/>',
  shield: '<path d="M12 3.2 19.6 6v5.8c0 4.4-3.3 7.4-7.6 8.9-4.3-1.5-7.6-4.5-7.6-8.9V6z"/><path d="m9.4 11.6 2 2.4 3.2-4"/>',
  phoenix: '<path d="M12 20.6c-3.8-2-6.6-4.8-6.6-8.6 0-2.8 1.8-4.8 3.2-5.8 1.4 1.4 3 2 4.4 1.6-.8-2.8.6-5 3-6.4-.4 2.4.2 4 1.6 5.4 2 1.6 2.8 4 2 6.8-.8 3.4-3.6 5.6-7.6 7z"/>',
  star: '<path d="m12 3.4 2.7 5.6 6.2.8-4.5 4.3 1.1 6.2L12 17.5l-5.5 2.8 1.1-6.2-4.5-4.3 6.2-.8z"/>',
  sun: '<circle cx="12" cy="12" r="4.4"/><path d="M12 2.6v3M12 18.4v3M2.6 12h3M18.4 12h3M5.2 5.2l2.1 2.1M16.7 16.7l2.1 2.1M18.8 5.2l-2.1 2.1M7.3 16.7l-2.1 2.1"/>',
  bolt: '<path d="M13.4 2.6 4.6 14h5.6l-1 7.4L18.4 10h-5.6z"/>',
  medal: '<circle cx="12" cy="15" r="5"/><path d="M9 3h6l-2.2 7.4M9 3l2.2 7.4"/>',
  clock: '<circle cx="12" cy="12" r="8.8"/><path d="M12 6.8V12l3.6 2.2"/>',
  flag: '<path d="M5.4 20.6V3.6h13.2l-2.6 5 2.6 5H5.4"/>',
  info: '<circle cx="12" cy="12" r="8.8"/><path d="M12 11.2v5.4"/><circle cx="12" cy="8.2" r=".95" fill="currentColor" stroke="none"/>'
};

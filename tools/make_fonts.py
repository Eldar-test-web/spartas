"""Oswald (display) + Bitter (body) — Azərbaycan charsetinə subsetlənmiş woff2.

Mənbə: Google Fonts anbarı (SIL Open Font License 1.1), lisenziya: assets/fonts/OFL.txt
Yenidən generasiya: python tools/make_fonts.py
"""
import io, sys, urllib.request, pathlib, tempfile
sys.stdout.reconfigure(encoding="utf-8")
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools.subset import Subsetter, Options

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "fonts"
OUT.mkdir(parents=True, exist_ok=True)

CHARSET = (
    "".join(chr(c) for c in range(0x20, 0x7F))
    + "".join(chr(c) for c in range(0xA0, 0x180))
    + "ƏəİıĞğŞşÇçÖöÜü"
    + "–—‘’“”…«»•→"
)

FONTS = {
    "Oswald": ("ofl/oswald/Oswald[wght].ttf", [500, 600, 700]),
    "Bitter": ("ofl/bitter/Bitter[wght].ttf", [400, 600]),
}


def fetch(rel):
    url = "https://raw.githubusercontent.com/google/fonts/main/" + rel.replace("[", "%5B").replace("]", "%5D").replace(" ", "%20")
    return urllib.request.urlopen(url, timeout=90).read()


total = 0
for name, (src, weights) in FONTS.items():
    raw = fetch(src)
    tmp = pathlib.Path(tempfile.gettempdir()) / f"{name}.src.ttf"
    tmp.write_bytes(raw)
    for w in weights:
        var = TTFont(tmp)
        stat = instancer.instantiateVariableFont(var, {"wght": w}, inplace=False)
        buf = io.BytesIO()
        stat.saveXML if False else stat.save(buf)
        buf.seek(0)
        stat = TTFont(buf, lazy=False)

        opts = Options()
        opts.flavor = "woff2"
        opts.layout_features = ["kern", "liga", "calt", "tnum"]
        opts.name_IDs = ["*"]
        opts.notdef_outline = True
        opts.hinting = False
        opts.desubroutinize = True
        s = Subsetter(options=opts)
        s.populate(text=CHARSET)
        s.subset(stat)

        dest = OUT / f"{name}-{w}.woff2"
        stat.save(dest)
        total += dest.stat().st_size
        print(f"{dest.name}  {dest.stat().st_size // 1024} KB")

    (OUT / f"OFL-{name}.txt").write_bytes(fetch(src.split("/")[0] + "/" + src.split("/")[1] + "/OFL.txt"))

print(f"cəmi: {total // 1024} KB")

from PIL import Image, ImageDraw, ImageOps
import os

SRC = {
    "green": r"C:\Users\User\Downloads\WhatsApp Image 2026-11-14 at 9.07ds.13 PM.jpeg",
    "black": r"C:\Users\User\Downloads\WhatsApp Image 2026-11-14 at 9.07.13 PM.jpeg",
    "mark":  r"C:\Users\User\Downloads\WhatsApp Image 2026-11-14 asdat 9.07.14 PM.jpeg",
}
OUT = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "assets", "img")
os.makedirs(OUT, exist_ok=True)

MINT = (111, 255, 190)
DEEP = (13, 105, 64)


def recolored(path, color, size=512):
    """White artwork on a dark background -> transparent PNG in `color`."""
    im = Image.open(path).convert("L")
    im = ImageOps.fit(im, (size, size), Image.LANCZOS)
    alpha = im.point(lambda v: min(255, int(v * 1.35)))
    out = Image.new("RGBA", (size, size), color + (0,))
    solid = Image.new("RGBA", (size, size), color + (255,))
    return Image.composite(solid, out, alpha)


def rounded(im, radius_ratio=0.18):
    size = im.size[0]
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, size, size], radius=int(size * radius_ratio), fill=255)
    out = im.convert("RGBA")
    out.putalpha(mask)
    return out


def save(im, name):
    im.save(os.path.join(OUT, name))
    print(f"{name:28} {im.size[0]}x{im.size[1]}")


mark_mint = recolored(SRC["mark"], MINT)
mark_deep = recolored(SRC["mark"], DEEP)

save(mark_mint, "logo-mark-mint.png")
save(mark_deep, "logo-mark-deep.png")
save(rounded(Image.open(SRC["green"]).convert("RGB").resize((512, 512), Image.LANCZOS)), "logo-full.png")
save(rounded(Image.open(SRC["black"]).convert("RGB").resize((512, 512), Image.LANCZOS)), "logo-full-dark.png")

for px, fname in ((48, "favicon.png"), (32, "favicon-32.png"), (180, "apple-touch-icon.png"), (512, "icon-512.png"), (192, "icon-192.png")):
    icon = ImageOps.fit(mark_mint.convert("RGBA"), (px, px), Image.LANCZOS)
    if px <= 48:
        icon.save(os.path.join(OUT, fname))
    else:
        icon.save(os.path.join(OUT, fname))
    print(f"{fname:28} {px}x{px}")

lockup = Image.open(SRC["green"]).convert("RGB").resize((560, 560), Image.LANCZOS)
og = Image.new("RGB", (1200, 630), DEEP)
og.paste(ImageOps.contain(lockup, (1120, 590), Image.LANCZOS), ((1200 - 590) // 2, 20))
og.save(os.path.join(OUT, "og-image.png"))
print("og-image.png                 1200x630 (placeholder text layer)")

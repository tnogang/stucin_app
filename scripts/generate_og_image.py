"""Generate a branded 1200x630 Open Graph image for avtovleka-stucin.si."""
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src" / "assets" / "tow-trucks-fleet.jpg"
LOGO = ROOT / "src" / "assets" / "logo-stucin.jpg"
OUT = ROOT / "public" / "og-image.jpg"

W, H = 1200, 630

FONT_CANDIDATES = [
    r"C:\Windows\Fonts\arialbd.ttf",
    r"C:\Windows\Fonts\calibrib.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
]

font_path = next((p for p in FONT_CANDIDATES if Path(p).exists()), None)
if font_path is None:
    raise SystemExit("No bold font found")

title_font = ImageFont.truetype(font_path, 72)
sub_font = ImageFont.truetype(font_path, 38)

# Background: crop hero image to 1200x630
img = Image.open(SRC).convert("RGB")
ratio = max(W / img.width, H / img.height)
img = img.resize((int(img.width * ratio), int(img.height * ratio)), Image.LANCZOS)
left = (img.width - W) // 2
top = (img.height - H) // 2
img = img.crop((left, top, left + W, top + H))

# Dark gradient overlay (stronger on the left where text goes)
overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
od = ImageDraw.Draw(overlay)
for x in range(W):
    alpha = int(200 * (1 - x / W) ** 1.5) + 40
    od.line([(x, 0), (x, H)], fill=(8, 8, 12, min(alpha, 235)))
img = Image.alpha_composite(img.convert("RGBA"), overlay)

draw = ImageDraw.Draw(img)

# Accent bar
draw.rectangle([60, 175, 68, 455], fill=(245, 158, 11, 255))

# Text
draw.text((100, 190), "AVTOVLEKA ŠTUCIN", font=title_font, fill=(255, 255, 255, 255))
draw.text((100, 300), "24/7 Pomoč na cesti", font=sub_font, fill=(245, 158, 11, 255))
draw.text((100, 360), "Servis vozil · Vulkanizerstvo · Vipava", font=sub_font, fill=(230, 230, 230, 255))
draw.text((100, 430), "+386 51 200 404", font=sub_font, fill=(255, 255, 255, 255))

img.convert("RGB").save(OUT, "JPEG", quality=85, optimize=True)
print(f"Saved {OUT} ({OUT.stat().st_size} bytes)")

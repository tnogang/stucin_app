"""Convert src/assets JPGs to optimized WebP (max width 1920, q80)."""
from pathlib import Path

from PIL import Image

ASSETS = Path(__file__).resolve().parent.parent / "src" / "assets"
MAX_WIDTH = 1920
QUALITY = 80

total_before = total_after = 0
for jpg in sorted(ASSETS.glob("*.jpg")):
    webp = jpg.with_suffix(".webp")
    img = Image.open(jpg).convert("RGB")
    if img.width > MAX_WIDTH:
        img = img.resize(
            (MAX_WIDTH, int(img.height * MAX_WIDTH / img.width)), Image.LANCZOS
        )
    img.save(webp, "WEBP", quality=QUALITY, method=6)
    before, after = jpg.stat().st_size, webp.stat().st_size
    total_before += before
    total_after += after
    print(f"{jpg.name}: {before // 1024} KB -> {webp.name}: {after // 1024} KB")

print(f"\nTotal: {total_before // 1024} KB -> {total_after // 1024} KB")

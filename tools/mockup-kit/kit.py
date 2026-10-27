# Build the inline before/after image for an outreach email: kit.py old.png new.png out.jpg bg_hex
import sys
from PIL import Image, ImageDraw, ImageFont
old, new, out, bg = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 30)
a = Image.open(old).convert('RGB'); a = a.crop((0, 0, a.width, int(a.width * 844 / 390))).resize((390, 844))
b = Image.open(new).convert('RGB'); b = b.crop((0, 0, b.width, int(b.width * 844 / 390))).resize((390, 844))
pad, top = 40, 80
o = Image.new('RGB', (390 * 2 + pad * 3, 844 + top + pad), bg); d = ImageDraw.Draw(o)
d.text((pad, 24), 'Idag', fill='#c9d3d6', font=F); d.text((pad * 2 + 390, 24), 'Förslag', fill='#ffffff', font=F)
for x, im in [(pad, a), (pad * 2 + 390, b)]:
    m = Image.new('L', im.size, 0); ImageDraw.Draw(m).rounded_rectangle((0, 0, 389, 843), 28, fill=255); o.paste(im, (x, top), m)
o.save(out, quality=82, optimize=True, progressive=True)

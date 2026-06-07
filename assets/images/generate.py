import os
from PIL import Image, ImageDraw, ImageFont
import math

OUTPUT_DIR = os.path.expanduser("~/Desktop/Irfan-bot/assets/images")
os.makedirs(OUTPUT_DIR, exist_ok=True)

FONT_PATH = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_PATH_LIGHT = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"

def get_font(size, bold=True):
    try:
        return ImageFont.truetype(FONT_PATH if bold else FONT_PATH_LIGHT, size)
    except:
        return ImageFont.load_default()

def create_gradient(width, height, color1, color2):
    img = Image.new("RGB", (width, height))
    draw = ImageDraw.Draw(img)
    for y in range(height):
        r = int(color1[0] + (color2[0] - color1[0]) * y / height)
        g = int(color1[1] + (color2[1] - color1[1]) * y / height)
        b = int(color1[2] + (color2[2] - color1[2]) * y / height)
        draw.line([(0, y), (width, y)], fill=(r, g, b))
    return img

def draw_centered_text(draw, text, y, font, fill="white", img_width=800):
    bbox = draw.textbbox((0, 0), text, font=font)
    w = bbox[2] - bbox[0]
    x = (img_width - w) // 2
    draw.text((x, y), text, font=font, fill=fill)

def draw_emoji_circle(draw, cx, cy, radius, emoji_text, bg_color, font_size=80):
    draw.ellipse([cx-radius, cy-radius, cx+radius, cy+radius], fill=bg_color)
    font = get_font(font_size)
    bbox = draw.textbbox((0, 0), emoji_text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    draw.text((cx - tw//2, cy - th//2 - 5), emoji_text, font=font, fill="white")

# 1. BRO
img = create_gradient(800, 600, (30, 30, 60), (60, 20, 80))
draw = ImageDraw.Draw(img)
draw_emoji_circle(draw, 400, 200, 120, "BRO", (40, 100, 200))
draw_centered_text(draw, "BEST BROTHER", 370, get_font(48))
draw_centered_text(draw, "Forever & Always", 430, get_font(28, False), (200, 200, 255))
draw.ellipse([100, 500, 130, 530], fill=(80, 180, 255))
draw.ellipse([670, 500, 700, 530], fill=(80, 180, 255))
img.save(os.path.join(OUTPUT_DIR, "bro.png"))
print("bro.png done")

# 2. BRO2
img = create_gradient(800, 600, (20, 40, 20), (40, 80, 40))
draw = ImageDraw.Draw(img)
draw_emoji_circle(draw, 400, 200, 120, "FAM", (30, 120, 50))
draw_centered_text(draw, "BROTHERHOOD", 370, get_font(48))
draw_centered_text(draw, "Unbreakable Bond", 430, get_font(28, False), (180, 255, 180))
img.save(os.path.join(OUTPUT_DIR, "bro2.png"))
print("bro2.png done")

# 3. GORU
img = create_gradient(800, 600, (139, 90, 43), (80, 50, 20))
draw = ImageDraw.Draw(img)
draw_emoji_circle(draw, 400, 200, 120, "COW", (120, 80, 30))
draw_centered_text(draw, "GORU CHAABA", 370, get_font(48))
draw_centered_text(draw, "Desi Style!", 430, get_font(28, False), (255, 220, 150))
draw.rectangle([350, 490, 450, 530], fill=(100, 60, 20), outline=(180, 120, 60))
draw_centered_text(draw, "Mooo!", 495, get_font(20), (200, 160, 100))
img.save(os.path.join(OUTPUT_DIR, "goru.png"))
print("goru.png done")

# 4. MURGI
img = create_gradient(800, 600, (200, 50, 50), (120, 30, 30))
draw = ImageDraw.Draw(img)
draw_emoji_circle(draw, 400, 200, 120, "EGG", (200, 60, 30))
draw_centered_text(draw, "MURGI BIRYANI", 370, get_font(48))
draw_centered_text(draw, "Khao, Maja Karo!", 430, get_font(28, False), (255, 200, 180))
draw.ellipse([370, 490, 430, 540], fill=(255, 240, 200), outline=(200, 180, 100))
img.save(os.path.join(OUTPUT_DIR, "murgi.png"))
print("murgi.png done")

# 5. PUNCH
img = create_gradient(800, 600, (180, 20, 20), (60, 0, 0))
draw = ImageDraw.Draw(img)
draw_emoji_circle(draw, 400, 200, 120, "POW", (220, 30, 30))
draw_centered_text(draw, "POWERFUL PUNCH", 370, get_font(48))
draw_centered_text(draw, "BOOM!", 430, get_font(36), (255, 100, 50))
for angle in range(0, 360, 30):
    x1 = 400 + 160 * math.cos(math.radians(angle))
    y1 = 200 + 160 * math.sin(math.radians(angle))
    x2 = 400 + 200 * math.cos(math.radians(angle))
    y2 = 200 + 200 * math.sin(math.radians(angle))
    draw.line([(x1, y1), (x2, y2)], fill=(255, 200, 50), width=3)
img.save(os.path.join(OUTPUT_DIR, "punch.png"))
print("punch.png done")

# 6. SANDA
img = create_gradient(800, 600, (100, 20, 20), (50, 10, 10))
draw = ImageDraw.Draw(img)
draw_emoji_circle(draw, 400, 200, 120, "BULL", (150, 30, 30))
draw_centered_text(draw, "SANDA FIGHT", 370, get_font(48))
draw_centered_text(draw, "Maind Bal Ka Khel", 430, get_font(28, False), (255, 180, 150))
draw.polygon([(350, 480), (320, 440), (340, 480)], fill=(200, 180, 140))
draw.polygon([(450, 480), (480, 440), (460, 480)], fill=(200, 180, 140))
draw.ellipse([370, 470, 430, 520], fill=(160, 80, 40))
img.save(os.path.join(OUTPUT_DIR, "sanda.png"))
print("sanda.png done")

# 7. SPANK
img = create_gradient(800, 600, (150, 50, 100), (80, 20, 50))
draw = ImageDraw.Draw(img)
draw_emoji_circle(draw, 400, 200, 120, "SLAP", (180, 60, 100))
draw_centered_text(draw, "SPANK TIME", 370, get_font(48))
draw_centered_text(draw, "Ouch!", 430, get_font(36), (255, 180, 200))
draw.ellipse([360, 470, 440, 540], fill=(220, 180, 150))
draw.rectangle([390, 440, 410, 480], fill=(220, 180, 150))
img.save(os.path.join(OUTPUT_DIR, "spank.png"))
print("spank.png done")

# 8. KISS2
img = create_gradient(800, 600, (180, 30, 80), (100, 10, 50))
draw = ImageDraw.Draw(img)
draw_emoji_circle(draw, 400, 200, 120, "KISS", (200, 40, 80))
draw_centered_text(draw, "LOVE KISS", 370, get_font(48))
draw_centered_text(draw, "XOXO", 430, get_font(36), (255, 180, 200))
for x, y in [(200, 480), (350, 510), (500, 490), (620, 500)]:
    draw.text((x, y), chr(9829), font=get_font(24), fill=(255, 100, 150))
img.save(os.path.join(OUTPUT_DIR, "kiss2.png"))
print("kiss2.png done")

# 9. RANK AVATAR
img = create_gradient(200, 200, (50, 50, 80), (30, 30, 60))
draw = ImageDraw.Draw(img)
draw.ellipse([40, 30, 160, 150], fill=(80, 80, 120))
draw.ellipse([70, 50, 130, 100], fill=(200, 180, 160))
draw.ellipse([60, 100, 140, 160], fill=(80, 80, 120))
draw.polygon([(100, 160), (105, 175), (120, 175), (108, 185), (113, 200), (100, 190), (87, 200), (92, 185), (80, 175), (95, 175)], fill=(255, 200, 50))
img.save(os.path.join(OUTPUT_DIR, "rank_avatar.png"))
print("rank_avatar.png done")

# 10. GUIDE: Custom Rank Card
img = create_gradient(800, 400, (30, 60, 120), (20, 40, 80))
draw = ImageDraw.Draw(img)
draw_centered_text(draw, "CUSTOM RANK CARD", 50, get_font(40))
draw_centered_text(draw, "Guide: Use .customrankcard", 110, get_font(24, False), (180, 200, 255))
draw.rectangle([100, 170, 700, 350], fill=(20, 40, 70), outline=(60, 100, 180), width=2)
draw_centered_text(draw, "Your Custom Card Preview", 200, get_font(28), (150, 200, 255))
draw.rectangle([150, 260, 650, 320], fill=(40, 60, 100), outline=(80, 120, 200))
draw_centered_text(draw, "Name | Level | XP", 275, get_font(20), (120, 160, 220))
img.save(os.path.join(OUTPUT_DIR, "guide_customrankcard.png"))
print("guide_customrankcard.png done")

# 11. GUIDE: Set Leave
img = create_gradient(800, 400, (120, 30, 30), (80, 20, 20))
draw = ImageDraw.Draw(img)
draw_centered_text(draw, "SET LEAVE", 50, get_font(40))
draw_centered_text(draw, "Goodbye Message Setup", 110, get_font(24, False), (255, 200, 200))
draw.rectangle([100, 170, 700, 350], fill=(60, 20, 20), outline=(150, 50, 50), width=2)
draw_centered_text(draw, "Example Leave Message:", 200, get_font(24), (255, 180, 180))
draw_centered_text(draw, "{member} has left the group!", 250, get_font(20, False), (200, 150, 150))
draw_centered_text(draw, "Use .setleave to configure", 310, get_font(20), (180, 100, 100))
img.save(os.path.join(OUTPUT_DIR, "guide_setleave.png"))
print("guide_setleave.png done")

# 12. GUIDE: Set Name
img = create_gradient(800, 400, (30, 100, 60), (20, 70, 40))
draw = ImageDraw.Draw(img)
draw_centered_text(draw, "SET NAME", 50, get_font(40))
draw_centered_text(draw, "Bot Nickname Setup", 110, get_font(24, False), (180, 255, 200))
draw.rectangle([100, 170, 700, 350], fill=(20, 60, 30), outline=(50, 150, 80), width=2)
draw_centered_text(draw, "Change bot nickname in group", 210, get_font(24), (150, 230, 170))
draw_centered_text(draw, ".setname [new name]", 260, get_font(28), (100, 255, 130))
draw_centered_text(draw, "Example: .setname IRFBOT", 310, get_font(20, False), (130, 200, 150))
img.save(os.path.join(OUTPUT_DIR, "guide_setname.png"))
print("guide_setname.png done")

# 13. GUIDE: Set Welcome
img = create_gradient(800, 400, (30, 60, 120), (20, 40, 80))
draw = ImageDraw.Draw(img)
draw_centered_text(draw, "SET WELCOME", 50, get_font(40))
draw_centered_text(draw, "Welcome Message Setup", 110, get_font(24, False), (180, 200, 255))
draw.rectangle([100, 170, 700, 350], fill=(20, 40, 70), outline=(60, 100, 180), width=2)
draw_centered_text(draw, "Example Welcome Message:", 200, get_font(24), (150, 200, 255))
draw_centered_text(draw, "Welcome {member}!", 250, get_font(28), (100, 180, 255))
draw_centered_text(draw, "Use .setwelcome to configure", 310, get_font(20), (120, 160, 220))
img.save(os.path.join(OUTPUT_DIR, "guide_setwelcome.png"))
print("guide_setwelcome.png done")

print("\nAll 13 images generated!")

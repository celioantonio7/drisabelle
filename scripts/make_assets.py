from PIL import Image
import shutil, os

U = "/home/celio/.gemini/antigravity/brain/0a0bee40-3bb0-4651-9cb7-8d76b495f7d5/.user_uploaded/"
B = "/home/celio/.gemini/antigravity/brain/0a0bee40-3bb0-4651-9cb7-8d76b495f7d5/"
O = "/home/celio/drisabelle/public/img/"
os.makedirs(O, exist_ok=True)

def crop(src, box, name, scale=3, q=92):
    im = Image.open(U + src).convert("RGB").crop(box)
    im = im.resize((im.width * scale, im.height * scale), Image.LANCZOS)
    im.save(O + name, quality=q)
    print(name, im.size)

# Mockup 2 = especialidades, 3 = experiencia, 1 = hero
crop("media_1793405309657.jpg", (46, 364, 271, 617), "resina.jpg")
crop("media_1793405309657.jpg", (530, 364, 736, 617), "porcelana.jpg")
crop("media_1793405309728.jpg", (484, 138, 1024, 552), "experiencia.jpg", 2)
crop("media_1793405309648.jpg", (386, 540, 491, 676), "sorrisos.jpg", 3)

# Fotos geradas (fundo de clinica) e originais enviadas
import glob
hero = sorted(glob.glob(B + "hero_scene_*.jpg"))[-1]
about = sorted(glob.glob(B + "about_portrait_*.jpg"))[-1]
Image.open(hero).convert("RGB").save(O + "hero.jpg", quality=92)
Image.open(about).convert("RGB").save(O + "sobre.jpg", quality=92)
shutil.copy(U + "media_1793405481840.jpg", O + "dra-original.jpg")

# Resultados reais (Instagram)
for src, name in [("media_1793405659839.png", "resultado-1.jpg"),
                  ("media_1793405659944.png", "resultado-2.jpg"),
                  ("media_1793405659950.jpg", "resultado-3.jpg")]:
    Image.open(U + src).convert("RGB").save(O + name, quality=90)
print("ok")

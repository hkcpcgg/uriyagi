# 261120 「사랑흐름 우리 이야기」 방 — 활용·강점 그림 카드 9장 (원고 v1 · 대표 14:54 OK)
# python3 build_story.py <출력 폴더>  → pNN_1.jpg(1080x1350) · pNN_1_t.jpg(작은 그림)
import sys, os, math, random
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUT = sys.argv[1] if len(sys.argv) > 1 else '/tmp/story'
os.makedirs(OUT, exist_ok=True)
HERE = os.path.dirname(os.path.abspath(__file__))
RUN = os.path.join(HERE, '..', '..', 'seed', 'run')
W, H = 1080, 1350
CREAM, NAVY, ORANGE, GRAPE, GOLD, INK, SOFT = '#FFFCF7', '#1E4A76', '#E87722', '#7B4BB8', '#C8A96B', '#22303F', '#6B7785'
FD = '/usr/share/fonts/opentype/noto/'
def F(w, s, serif=False):
    return ImageFont.truetype(FD + ('NotoSerifCJK-%s.ttc' % w if serif else 'NotoSansCJK-%s.ttc' % w), s, index=1)

def base(no):
    im = Image.new('RGB', (W, H), CREAM); d = ImageDraw.Draw(im)
    d.text((80, 70), '우리 이야기 · 이렇게 씁니다', font=F('Bold', 30), fill=GOLD)
    d.text((W - 80, 70), '%d / 9' % no, font=F('Medium', 30), fill=SOFT, anchor='ra')
    return im, d

def title(d, y, t, size=64):
    for i, line in enumerate(t.split('\n')):
        d.text((80, y + i * int(size * 1.35)), line, font=F('Bold', size, True), fill=NAVY)
    return y + len(t.split('\n')) * int(size * 1.35)

def body(d, y, lines, size=36, gap=1.62, color=INK):
    for ln in lines:
        if ln.startswith('**'):
            d.text((80, y), ln.strip('*'), font=F('Bold', size), fill=NAVY)
        else:
            d.text((80, y), ln, font=F('Regular', size), fill=color)
        y += int(size * gap)
    return y

def net(d, cx, cy, R, rings=3, seed=7, lit=None, pics=None, im=None):
    """인드라망 — 구슬 그물. 구슬마다 서로 이어짐."""
    random.seed(seed); pts = [(cx, cy)]
    for r in range(1, rings + 1):
        n = 6 * r
        for k in range(n):
            a = 2 * math.pi * k / n + r * 0.3
            pts.append((cx + math.cos(a) * R * r / rings, cy + math.sin(a) * R * r / rings * 0.82))
    for i, p in enumerate(pts):
        for j, q in enumerate(pts):
            if j <= i: continue
            dd = math.dist(p, q)
            if dd < R / rings * 1.25:
                d.line([p, q], fill='#D9CDB8', width=3)
    cols = [GRAPE, ORANGE, NAVY, '#3E8E7E', '#C0567A', GOLD]
    for i, (x, y) in enumerate(pts):
        r = 30 if i == 0 else 22
        c = cols[i % len(cols)]
        d.ellipse([x - r - 6, y - r - 6, x + r + 6, y + r + 6], fill='#FFFFFF', outline='#E6DCCB', width=3)
        d.ellipse([x - r, y - r, x + r, y + r], fill=c)
        d.ellipse([x - r * 0.45, y - r * 0.55, x - r * 0.05, y - r * 0.15], fill='#FFFFFF')   # 구슬 빛
    return pts

def photo(im, path, box, rad=36):
    x0, y0, x1, y1 = box; w, h = x1 - x0, y1 - y0
    p = Image.open(path).convert('RGB'); s = max(w / p.width, h / p.height)
    p = p.resize((int(p.width * s) + 1, int(p.height * s) + 1)); l = (p.width - w) // 2; t = (p.height - h) // 2
    p = p.crop((l, t, l + w, t + h)); m = Image.new('L', (w, h), 0); ImageDraw.Draw(m).rounded_rectangle([0, 0, w, h], rad, fill=255)
    im.paste(p, (x0, y0), m)

def save(im, k):
    im.save(os.path.join(OUT, 'p%02d_1.jpg' % k), quality=84, optimize=True)
    t = im.copy(); t.thumbnail((360, 450)); t.save(os.path.join(OUT, 'p%02d_1_t.jpg' % k), quality=62, optimize=True)

# 1 표지 — 인드라망
im, d = base(1)
y = title(d, 150, '방 하나가\n다른 방을 비춥니다', 76)
net(d, W // 2, 760, 400, rings=3)
body(d, 1120, ['그물코마다 달린 구슬이 서로를 비추듯,', '우리 이야기의 방 하나하나가 그 구슬입니다.'], 36, 1.55, SOFT)
save(im, 1)

# 2 잘하는 것 여섯
im, d = base(2)
title(d, 150, '우리 이야기가\n잘하는 것', 70)
tiles = [('쌓입니다', '오늘이 모여\n우리의 역사가 됩니다'), ('이어집니다', '방과 방이\n손을 잡습니다'), ('열고 닫습니다', '나눌 것은 활짝\n간직할 것은 살며시'),
         ('링크 하나면', '누르면 바로\n그 방입니다'), ('마당에서 만납니다', '몰랐던 이웃의\n하루를 만납니다'), ('소중히 지킵니다', '우리 사진은\n우리나라 안에')]
cols = [GRAPE, NAVY, ORANGE, '#3E8E7E', '#C0567A', GOLD]
for i, (a, b) in enumerate(tiles):
    cx, cy = 80 + (i % 2) * 470, 420 + (i // 2) * 290
    d.rounded_rectangle([cx, cy, cx + 450, cy + 265], 28, fill='#FFFFFF', outline='#E6DCCB', width=3)
    d.ellipse([cx + 28, cy + 30, cx + 78, cy + 80], fill=cols[i])
    d.text((cx + 96, cy + 30), a, font=F('Bold', 36), fill=NAVY)
    for j, ln in enumerate(b.split('\n')):
        d.text((cx + 30, cy + 112 + j * 52), ln, font=F('Regular', 32), fill=INK)
save(im, 2)

# 3~7 쓰임새
def use(k, head, lines, art):
    im, d = base(k)
    y = title(d, 150, head, 66)
    art(im, d)
    body(d, 860, lines, 36, 1.6)
    save(im, k)

def art_me(im, d):   # 나 — 구슬 하나에서 하루하루가 뻗어 나감
    cx, cy = W // 2, 560
    for i in range(14):
        a = 2 * math.pi * i / 14; r1, r2 = 90, 230 + (i % 3) * 30
        d.line([(cx + math.cos(a) * r1, cy + math.sin(a) * r1 * .8), (cx + math.cos(a) * r2, cy + math.sin(a) * r2 * .8)], fill='#E6DCCB', width=4)
        x, y = cx + math.cos(a) * r2, cy + math.sin(a) * r2 * .8; d.ellipse([x - 16, y - 16, x + 16, y + 16], fill=[GRAPE, ORANGE, GOLD][i % 3])
    d.ellipse([cx - 80, cy - 80, cx + 80, cy + 80], fill=NAVY); d.text((cx, cy), '나', font=F('Bold', 64), fill='#FFFFFF', anchor='mm')
use(3, '나의 하루가\n나의 역사가 됩니다', ['오늘 걸은 길, 오늘 먹은 밥, 오늘 만난 하늘.', '닫아 두면 나만의 일기, 열어 두면 마당의 이야기.', '몇 해 뒤 돌아보면 내가 걸어온 길이', '한눈에 보입니다.'], art_me)

def art_fam(im, d):   # 가족 — 한 지붕 아래 구슬들(멀리 있는 것도 이어짐)
    cx, cy = W // 2, 600
    d.polygon([(cx - 260, cy - 20), (cx, cy - 230), (cx + 260, cy - 20)], fill=NAVY)
    d.rounded_rectangle([cx - 220, cy - 20, cx + 220, cy + 190], 18, fill='#FFFFFF', outline='#E6DCCB', width=4)
    for i, (x, r, c) in enumerate([(-130, 46, GRAPE), (-30, 40, ORANGE), (60, 30, GOLD), (140, 24, '#3E8E7E')]):
        d.ellipse([cx + x - r, cy + 90 - r, cx + x + r, cy + 90 + r], fill=c)
    for (x, y) in [(150, 470), (930, 500)]:
        d.line([(x, y), (cx + (-220 if x < cx else 220), cy + 60)], fill='#D9CDB8', width=4)
        d.ellipse([x - 30, y - 30, x + 30, y + 30], fill='#C0567A'); d.ellipse([x - 40, y - 40, x + 40, y + 40], outline='#E6DCCB', width=3)
use(4, '멀리 있어도\n한 지붕 아래', ['아이가 처음 걸은 날, 할머니 생신, 이사 가던 날.', '우리끼리만 보는 방이라 마음 놓고 올립니다.', '멀리 사는 가족도 같은 방에서 같은 날을 봅니다.', '손주가 자라 이 방을 열면, 집안 이야기가 거기에.'], art_fam)

def art_club(im, d):
    photo(im, os.path.join(RUN, 'r1.jpg'), (80, 420, 560, 820)); photo(im, os.path.join(RUN, 'r3.jpg'), (580, 420, 1000, 620), 28); photo(im, os.path.join(RUN, 'r5.jpg'), (580, 640, 1000, 820), 28)
use(5, '함께한 날이 쌓이면\n우리의 자랑이 됩니다', ['수영 · 자전거 · 산행 · 러닝 · 사진 · 독서 · 합창…', '방을 열어 두면 그 자체가 우리 모임 소개 —', '새 친구가 찾아옵니다.', '다른 동네 같은 취미 모임과도 서로 응원합니다.'], art_club)

def art_school(im, d):   # 동창 → 동문 → 학교 — 고리가 넓어짐
    cx, cy = W // 2, 610
    for i, (r, c) in enumerate([(250, '#F1E9DC'), (175, '#E9DCC6'), (100, '#DCCBAE')]):
        d.ellipse([cx - r, cy - r * .78, cx + r, cy + r * .78], fill=c)
    for k in range(7):
        a = 2 * math.pi * k / 7; x, y = cx + math.cos(a) * 140, cy + math.sin(a) * 110
        d.ellipse([x - 18, y - 18, x + 18, y + 18], fill=[GRAPE, ORANGE, NAVY, GOLD][k % 4])
    d.text((cx, cy), '우리 학교', font=F('Bold', 40), fill=NAVY, anchor='mm')
    d.text((cx - 255, cy - 215), '그때 그 친구들', font=F('Medium', 30), fill=SOFT)
    d.text((cx + 120, cy + 175), '동문 모두의 이야기', font=F('Medium', 30), fill=SOFT)
use(6, '그때 그 친구들,\n그리고 우리 학교', ['흩어진 친구들이 한 방에 다시 모입니다.', '기수마다의 이야기가 모이면 동문의 이야기가 되고,', '운동장의 옛 사진과 오늘의 사진이 나란히 —', '학교의 어제와 오늘, 그렇게 역사가 쌓입니다.'], art_school)

def art_town(im, d):   # 헤이리 — 저마다의 방이 모여 마을 이야기책
    cx, cy = W // 2, 550
    d.ellipse([cx - 400, cy - 195, cx + 400, cy + 195], outline='#D9CDB8', width=4)
    spots = [('공방', -250, -90, ORANGE), ('갤러리', 30, -150, GRAPE), ('체험관', 250, -40, '#3E8E7E'), ('전시관', -150, 110, NAVY), ('찻집', 170, 130, '#C0567A')]
    for i, a in enumerate(spots):
        for b in spots[i + 1:]:
            d.line([(cx + a[1], cy + a[2]), (cx + b[1], cy + b[2])], fill='#E6DCCB', width=3)
    for n, x, y, c in spots:
        d.ellipse([cx + x - 58, cy + y - 58, cx + x + 58, cy + y + 58], fill=c)
        d.text((cx + x, cy + y), n, font=F('Bold', 30), fill='#FFFFFF', anchor='mm')
    d.text((cx, cy + 236), '우리 마을 · 우리 지역', font=F('Medium', 30), fill=SOFT, anchor='mm')
use(7, '저마다의 이야기가\n마을의 이야기로', ['공방은 오늘 빚은 그릇을, 갤러리는 새 전시를,', '체험관은 아이들의 웃음을 올립니다.', '하나하나 모이면 마을이 살아 있는 이야기책이 되고,', '이웃과 우리 지역에도 소식이 자연스럽게 오갑니다.'], art_town)

# 8 아우름
im, d = base(8)
title(d, 150, '어디로든\n뻗어 나갑니다', 70)
pts = net(d, W // 2, 740, 360, rings=3, seed=3)
for (dx, dy, t) in [(0, -1, '위로'), (1, 0, '옆으로'), (0, 1, '아래로')]:
    x, y = W // 2 + dx * 470, 740 + dy * 335
    d.text((x if dx else W // 2 + 210, y if dy else 740), t, font=F('Bold', 32), fill=ORANGE, anchor='mm')
body(d, 1160, ['정해진 길이 아니라, 우리가 이어 가는 만큼 길이 됩니다.', '이야기 하나가 모두의 이야기를 비춥니다.'], 34, 1.55, SOFT)
save(im, 8)

# 9 시작
im, d = base(9)
title(d, 150, '시작해 보세요', 72)
d.rounded_rectangle([140, 400, 940, 520], 60, fill='#FFFFFF', outline=NAVY, width=4)
d.text((W // 2, 460), '＋ 우리 이야기방 만들기', font=F('Bold', 42), fill=NAVY, anchor='mm')
d.text((W // 2, 560), '이름 하나면 방이 열립니다', font=F('Regular', 32), fill=SOFT, anchor='mm')
cx, cy = W // 2, 720
d.ellipse([cx - 70, cy - 70, cx + 70, cy + 70], fill=ORANGE); d.line([(cx - 34, cy), (cx + 34, cy)], fill='#FFFFFF', width=12); d.line([(cx, cy - 34), (cx, cy + 34)], fill='#FFFFFF', width=12)
d.text((W // 2, 830), '사진 한 장 올리고, 카톡으로 링크를 보내 보세요', font=F('Regular', 32), fill=INK, anchor='mm')
bx, by = W // 2 - 50, 930
d.ellipse([bx - 10, by - 10, bx + 110, by + 110], fill=NAVY)
d.line([(bx + 20, by + 35), (bx + 50, by + 42), (bx + 80, by + 35), (bx + 80, by + 78), (bx + 50, by + 85), (bx + 20, by + 78), (bx + 20, by + 35)], fill='#FFFFFF', width=5); d.line([(bx + 50, by + 42), (bx + 50, by + 85)], fill='#FFFFFF', width=5)
d.text((W // 2, 1110), '처음이시면 위 📖 「우리 이야기 사용법」을 펼쳐 보세요'.replace('📖 ', ''), font=F('Regular', 32), fill=SOFT, anchor='mm')
save(im, 9)
print('ok', OUT)

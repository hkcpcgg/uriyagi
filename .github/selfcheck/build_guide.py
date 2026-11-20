# 안내 방 그림 만들기 v2 (261119 · 대표 지적 ① · ② · 시안 v3 OK 22:45)
# 쓰는 법: guide 가지의 날 그림(png) + boxes.json 을 한 폴더에 풀고
#   python3 build_guide.py <날그림폴더> <내보낼 seed/guide 폴더>
# 새 꼴 = 전체를 어둡게 · 누를 곳만 원래 밝기 · 노란 테두리 · 노란 말풍선(남색 번호 + 「여기를 누르면 ○○」)
# 번호는 원고 글 번호와 똑같이 · 말풍선은 서로 · 누를 곳과 겹치지 않게
import json, sys, os
ONLY = set(int(x) for x in os.environ.get('ONLY', '').split(',') if x)   # ★v3 몇 편만 다시 만들 때
from PIL import Image, ImageDraw, ImageFont, ImageEnhance

SRC, OUT = sys.argv[1], sys.argv[2]
FONT = next(f for f in ['/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc', '/usr/share/fonts/noto-cjk/NotoSansCJK-Bold.ttc'] if os.path.exists(f))
BOX = json.load(open(os.path.join(SRC, 'boxes.json'), encoding='utf-8'))
Y, NAVY = (255, 210, 74), (31, 42, 68)
S = 2  # 날 그림은 390x844 화면을 2배로 찍음

# (편, [(날 그림, [(boxes 열쇠, 번호 또는 None, 말풍선 글)])])
SPEC = [
 (1, [('g01_마당', [])]),
 (2, [('g01_마당', [('g01_마당:pz', 1, '마당'), ('g01_마당:fd', 2, '검색'), ('g01_마당:me', 3, '내 방'), ('g01_마당:up', 4, '올리기'), ('g01_마당:menu', None, '메뉴')])]),
 (3, [('g03_방누름', [('g03_방누름', 1, '방 하나를 눌러요')]), ('g03b_방첫화면', [('g03b_방첫화면:hd', 2, '그 방 첫 화면이에요')])]),
 (4, [('g02_검색누름', [('g02_검색누름', 1, '「검색」을 눌러요')]), ('g02b_검색', [('g02b_검색:inp', 2, '여기에 방 이름을 적어요')])]),
 (5, [('g04_방첫화면', [('g04_방첫화면:hd', None, '방 사진 · 이름 · 소개', 'above'), ('g04_방첫화면:tabs', None, '사진 · 영상 · 글로 나눠 봐요')])]),
 (6, [('g05_사진누름', [('g05_사진누름', 1, '보고 싶은 사진을 눌러요')]), ('g05b_게시물', [])]),
 (7, [('g06_좋아요', [('g06_좋아요', None, '♥ 누르면 빨갛게 채워져요')])]),
 (8, [('g06_좋아요', [('g06_좋아요:mem', None, '나도 기억해요')])]),
 (9, [('g07_기억누름', [('g07_기억누름', 1, '기억 단추를 눌러요')]), ('g07b_기억창', [('g07b_기억창:sh', 2, '기억 창이 올라와요', 'above'), ('g07b_기억창:paW', 3, '「기억 남기기」를 눌러요')])]),
 (10, [('g08_공유누름', [('g08_공유누름', 1, '공유 단추를 눌러요')]), ('g08b_공유창', [('g08b_공유창:pick', 2, '보낼 사진을 골라요'), ('g08b_공유창:kk', 3, '「카톡으로 보내기」')])]),
 (11, [('g09_저장', [('g09_저장', 1, '더 보기(⋯)를 눌러요')]), ('g09b_저장', [('g09b_저장:sv', 2, '「휴대폰에 저장」')])]),
 (12, [('g10_더보기', [('g10_더보기', None, '더 보기(⋯)를 누르면 메뉴')]), ('g10b_더보기창', [('g10b_더보기창:del', None, '내가 나온 사진을 내릴 때')])]),
 (13, [('g14_손님올리기', [('g14_손님올리기', None, '올리기를 누르면 이 창이 떠요')]), ('g14b_로그인안내', [('g14b_로그인안내:age', 1, '먼저 여기에 체크', 'above'), ('g14b_로그인안내:kakao', 2, '노란 단추를 눌러요', 'below')])]),
 (14, [('m03_올리기누름', [('m03_올리기누름', 1, '주황 「올리기」를 눌러요')]), ('m03b_새게시물', [('m03b_새게시물:pick', 2, '앨범에서 사진을 골라요'), ('m03b_새게시물:go', 3, '「올리기」를 눌러요')]), ('g16_나도사진올리기', [('g16_나도사진올리기:up', None, '방 맨 아래에서도 바로 올려요')])]),
 (15, [('m02_초대누름', [('m02_초대누름', 1, '「초대하기」를 눌러요')])]),
 (16, [('g11b_메뉴', [('g11b_메뉴:mk', 1, '여기를 누르면 방을 만들어요')]), ('g15_방만들기', [('g15_방만들기:kind', 2, '어떤 방인지 골라요')])]),
 (17, [('g13_닫힌방', [('g13_닫힌방', 1, '자물쇠 방을 눌러요')]), ('g13b_방두드리기', [('g13b_방두드리기:knock', 2, '「방 두드리기」를 눌러요')])]),
 (18, [('m04_내방누름', [('m04_내방누름', None, '아래 「내 방」')]), ('m04b_내방', [('m04b_내방:news', None, '새 소식이 모여요'), ('m04b_내방:av', None, '누르면 내 사진 바꾸기')])]),
 (19, [('m01_방첫화면', [('m01_방첫화면:mgr', 1, '「방 관리 ›」를 눌러요')]), ('m06b_방관리', [('m06b_방관리:ok', 2, '처음 한 번 카카오로 확인')])]),
 (20, [('m09b_내게시물메뉴', [('m09b_내게시물메뉴:ed', 2, '고칠 때 「수정」'), ('m09b_내게시물메뉴:del', 2, '지울 때 「게시물 삭제」')])]),   # ★v3 261120 시험 방 내 게시물 ⋯ 창
 (21, [('g11_메뉴누름', [('g11_메뉴누름', 1, '메뉴 단추를 눌러요')]), ('g12_홈화면누름', [('g12_홈화면누름', 2, '「홈 화면에 추가」')]), ('g12b_홈화면', [('g12b_홈화면:how', 3, '안내대로 하면 포도 아이콘')])]),
 (22, [('g05b_게시물', [])]),
 (23, [('g04_방첫화면', [])]),
]

def font(px): return ImageFont.truetype(FONT, px * S)

def draw(shot, targets):
    im = Image.open(os.path.join(SRC, shot + '.png')).convert('RGB')
    W, H = im.size[0] // S, im.size[1] // S
    ts = []
    for tg in targets:
        key, n, txt = tg[:3]; side0 = tg[3] if len(tg) > 3 else None
        b = BOX.get(key)
        if not b or b['w'] <= 0 or b['h'] <= 0 or b['y'] > H or b['y'] + b['h'] < 0:
            print('  ★자리 없음', key); continue
        x0, y0 = max(2, b['x'] - 5), max(2, b['y'] - 5)
        x1, y1 = min(W - 2, b['x'] + b['w'] + 5), min(H - 2, b['y'] + b['h'] + 5)
        ts.append((n, txt, (x0, y0, x1, y1), side0))
    if ts:
        dim = ImageEnhance.Brightness(im).enhance(0.45)
        mask = Image.new('L', im.size, 0); md = ImageDraw.Draw(mask)
        for _, _, (x0, y0, x1, y1), _s in ts: md.rounded_rectangle([x0 * S, y0 * S, x1 * S, y1 * S], radius=12 * S, fill=255)
        im = Image.composite(im, dim, mask)
    d = ImageDraw.Draw(im)
    for _, _, (x0, y0, x1, y1), _s in ts: d.rounded_rectangle([x0 * S, y0 * S, x1 * S, y1 * S], radius=12 * S, outline=Y, width=4 * S)
    placed = [r for _, _, r, _s in ts]   # 말풍선이 덮지 말아야 할 자리
    many = len(ts) >= 4
    fs = 15 if many else 18
    f = font(fs)
    for idx, (n, txt, (x0, y0, x1, y1), side0) in enumerate(ts):
        tw = d.textlength(txt, font=f) / S
        bw, bh = tw + (44 if n is not None else 26), fs + 18
        cx = (x0 + x1) / 2
        cands = []
        for side in ([side0] if side0 else (['below', 'above'] if (y0 + y1) / 2 < H * 0.55 else ['above', 'below'])):
            for lift in range(0, 160, 12):
                by = (y1 + 16 + lift) if side == 'below' else (y0 - 16 - bh - lift)
                if many and side == 'above': by -= (idx % 2) * (bh + 6)   # 아래 네 칸처럼 붙은 것은 두 줄로 엇갈림
                bx = min(max(6, cx - bw / 2), W - 6 - bw)
                cands.append((side, bx, by))
        def hit(r):
            return any(not (r[2] <= q[0] or r[0] >= q[2] or r[3] <= q[1] or r[1] >= q[3]) for q in placed)
        side, bx, by = cands[0]
        for c in cands:
            r = (c[1], c[2], c[1] + bw, c[2] + bh)
            if c[2] >= 4 and c[2] + bh <= H - 4 and not hit(r): side, bx, by = c; break
        placed.append((bx, by, bx + bw, by + bh))
        d.rounded_rectangle([bx * S, by * S, (bx + bw) * S, (by + bh) * S], radius=bh / 2 * S, fill=Y)
        ax = min(max(cx, bx + 14), bx + bw - 14)
        if side == 'below': d.polygon([((ax - 9) * S, (by + 1) * S), ((ax + 9) * S, (by + 1) * S), (cx * S, (y1 + 2) * S)], fill=Y)
        else: d.polygon([((ax - 9) * S, (by + bh - 1) * S), ((ax + 9) * S, (by + bh - 1) * S), (cx * S, (y0 - 2) * S)], fill=Y)
        tx = bx + 12
        if n is not None:
            r0 = (bh - 10) / 2
            d.ellipse([(bx + 6) * S, (by + 5) * S, (bx + 6 + 2 * r0) * S, (by + 5 + 2 * r0) * S], fill=NAVY)
            d.text(((bx + 6 + r0) * S, (by + bh / 2) * S), str(n), font=font(fs), fill='white', anchor='mm')
            tx = bx + 6 + 2 * r0 + 7
        d.text((tx * S, (by + bh / 2) * S), txt, font=f, fill=NAVY, anchor='lm')
    return im

os.makedirs(OUT, exist_ok=True)
counts = {}
for k, imgs in SPEC:
    if ONLY and k not in ONLY: continue
    for j, (shot, tg) in enumerate(imgs, 1):
        if not os.path.exists(os.path.join(SRC, shot + '.png')): print('  ★날 그림 없음', shot); continue
        im = draw(shot, tg)
        nm = 'p%02d_%d' % (k, j)
        im.save(os.path.join(OUT, nm + '.jpg'), quality=82, optimize=True)
        t = im.resize((320, round(im.size[1] * 320 / im.size[0])), Image.LANCZOS); t.save(os.path.join(OUT, nm + '_t.jpg'), quality=72, optimize=True)
    counts[k] = len(imgs)
print(json.dumps(counts))

# -*- coding: utf-8 -*-
# 261121 검색 엔진 재료 — 서버가 고른 공개 방(recSeoRooms: 열린 모임 · 열림 · 시험 방 아님 · 「누구나」 사진 3장 이상)마다
# 게시물을 받아 seed/rooms/C-xxxx.json 으로. 닫힌 방 · 사람 이름 · 댓글 · 열쇠는 담지 않음.
# 쓰는 법: python3 .github/selfcheck/fetch_rooms.py (저장소 맨 위) → 이어서 build_pages.py
import json, os, glob, urllib.request
G = 'https://script.google.com/macros/s/AKfycbyxGWMrhY9Ffihk56ve-8s_S87fdkg_WEMpJO7q3FZRkdlBZWwkWo8m2Gs-fBbrhoVMOg/exec'
NCP = 'https://kr.object.ncloudstorage.com/uriyagi-photo/'
SKIP = {'C-0295'}   # 안내 방은 /guide/ 가 맡음
out_dir = os.path.join(os.getcwd(), 'seed', 'rooms'); os.makedirs(out_dir, exist_ok=True)


def call(body):
    req = urllib.request.Request(G, data=json.dumps(body).encode(), headers={'Content-Type': 'text/plain;charset=utf-8'})
    return json.loads(urllib.request.urlopen(req, timeout=120).read().decode())


def img(n):
    if isinstance(n, dict):
        k = n.get('s') or n.get('m')
        if k: return NCP + k
    return ''


lst = call({'action': 'recSeoRooms'})
rooms = [r for r in (lst.get('rooms') or []) if r.get('com') not in SKIP]
print('공개 방', len(rooms))
keep = set()
for meta in rooms:
    c = meta['com']
    try:
        d = call({'action': 'recHome', 'c': c, 'lite': '1', 'n': '60', 'mode': 'new'})
    except Exception as e:
        print(c, '못 받음', e); continue
    if d.get('status') != 'ok' or d.get('room') != '열린 모임':
        print(c, '건너뜀', d.get('status'), d.get('room')); continue
    items = []
    try:
        f = call({'action': 'recSeoRoom', 'c': c})
        for it in (f.get('items') or []) if f.get('status') == 'ok' else []:
            ims = [NCP + k for k in (it.get('imgs') or []) if k]
            if ims: items.append({'id': it.get('id'), 'title': (it.get('title') or '').strip(), 'text': str(it.get('text') or '').strip()[:400], 'when': it.get('when') or '', 'cat': it.get('cat') or '', 'imgs': ims})
    except Exception as e:
        print(c, '사진 목록 못 받음', e)
    ups = [{'c': u.get('com'), 'name': u.get('name')} for u in (d.get('ups') or []) if u.get('com')]
    downs = [{'c': u.get('com'), 'name': u.get('name')} for u in (d.get('subs') or []) if isinstance(u, dict) and u.get('com')]
    o = {'com': c, 'name': d.get('comName') or meta.get('name') or c, 'intro': d.get('intro') or meta.get('intro') or '', 'frame': meta.get('frame') or '',
         'frameName': meta.get('frameName') or '', 'gos': meta.get('gos') or [], 'cats': [x.get('name') for x in (d.get('cats') or []) if isinstance(x, dict)],
         'ups': ups, 'downs': downs, 'items': items}
    json.dump(o, open(os.path.join(out_dir, c + '.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    keep.add(c)
    print(c, o['name'], '게시물', len(items), '그림', sum(len(i['imgs']) for i in items))
# 더는 공개가 아닌 방(닫혔거나 숨김)의 재료는 지움 → 페이지도 다음 build 에서 빠짐
for f in glob.glob(os.path.join(out_dir, 'C-*.json')):
    if os.path.basename(f)[:-5] not in keep and lst.get('status') == 'ok':
        os.remove(f); print('지움', os.path.basename(f))

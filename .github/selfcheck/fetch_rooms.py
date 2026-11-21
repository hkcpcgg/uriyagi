# -*- coding: utf-8 -*-
# 261121 검색용 방 소개 페이지 재료 — 공개 방(손님 보기 · 열쇠 없음)의 게시물을 서버에서 받아 seed/rooms/C-xxxx.json 으로
# 공개 범위 「누구나」 사진만 서버가 내줌(n.s = 네이버 공개 그림). 사람 이름 · 댓글은 담지 않음.
# 쓰는 법: python3 .github/selfcheck/fetch_rooms.py (저장소 맨 위) → 이어서 build_pages.py
import json, os, urllib.request
G = 'https://script.google.com/macros/s/AKfycbyxGWMrhY9Ffihk56ve-8s_S87fdkg_WEMpJO7q3FZRkdlBZWwkWo8m2Gs-fBbrhoVMOg/exec'
NCP = 'https://kr.object.ncloudstorage.com/uriyagi-photo/'
ROOMS = ['C-0294', 'C-0258', 'C-0257', 'C-0256', 'C-0246', 'C-0297']
out_dir = os.path.join(os.getcwd(), 'seed', 'rooms'); os.makedirs(out_dir, exist_ok=True)
def call(body):
    req = urllib.request.Request(G, data=json.dumps(body).encode(), headers={'Content-Type': 'text/plain;charset=utf-8'})
    return json.loads(urllib.request.urlopen(req, timeout=90).read().decode())
def img(n):
    if isinstance(n, dict):
        k = n.get('s') or n.get('m')
        if k: return NCP + k
    return ''
for c in ROOMS:
    try:
        d = call({'action': 'recHome', 'c': c, 'lite': '1', 'n': '40', 'mode': 'new'})
    except Exception as e:
        print(c, '못 받음', e); continue
    if d.get('status') != 'ok' or d.get('room') != '열린 모임':
        print(c, '건너뜀', d.get('status'), d.get('room')); continue
    items = []
    for it in d.get('list') or []:
        ims = []
        if it.get('photo'):
            u = img(it.get('n'));
            if u: ims.append(u)
        for p in (it.get('photos') or [])[:6]:
            u = img(p.get('n')) if isinstance(p, dict) else ''
            if u and u not in ims: ims.append(u)
        if it.get('video') and isinstance(it['video'], dict) and it['video'].get('thumb') and 'ytimg' in it['video']['thumb']:
            ims.append(it['video']['thumb'])
        t = (it.get('title') or '').strip(); x = (it.get('text') or '').strip()
        if not ims and not x: continue
        items.append({'id': it.get('id'), 'title': t, 'text': x[:400], 'when': it.get('when') or '', 'cat': it.get('cat') or '', 'imgs': ims[:6]})
    ups = [{'c': u.get('com'), 'name': u.get('name')} for u in (d.get('ups') or []) if u.get('com')]
    downs = [{'c': u.get('com'), 'name': u.get('name')} for u in (d.get('downs') or []) if isinstance(u, dict) and u.get('com')]
    o = {'com': c, 'name': d.get('comName') or c, 'intro': d.get('intro') or '', 'ups': ups, 'downs': downs, 'items': items}
    json.dump(o, open(os.path.join(out_dir, c + '.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(c, o['name'], '게시물', len(items), '그림', sum(len(i['imgs']) for i in items))

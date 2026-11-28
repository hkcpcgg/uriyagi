# [우리이야기] 견본 모바일 홈페이지 만들기 · tpl/sample/gen.py · v1 · 261126
# 대표 20:01 「견본 5~6개 · 동창회 · 스포츠 모임 · 각종 단체 · 자동차 영업 · 정치인 · 많이 할 수 있는 것」
# 꼴: home/sample-org(단체 홈 시안 v3, 대표 OK 차례) 칸 그대로 · base.css = 그 페이지 style 그대로
# 사진: 사랑흐름 무료 견본 사진(rec/seed/sample · CC0 / 공공) · 옛 사진(img/era) 중 어른만 · 아이 사진 안 씀
# 자료는 모두 가상(이름 · 단체 · 가게) · 정치인 견본은 정당 · 실제 인물 없음
# 쓰기: python3 tpl/sample/gen.py  → home/<id>/index.html
import os, html
R = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(os.path.dirname(R))
CSS = open(os.path.join(R, 'base.css'), encoding='utf-8').read()
S = 'https://www.loveflow.ai.kr/rec/seed/sample/'
E = 'https://www.loveflow.ai.kr/img/era/'
e = html.escape

IC = {
 'call': '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z"/>',
 'map': '<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
 'sms': '<rect x="3" y="5" width="18" height="13" rx="3"/><path d="M7 10h10M7 13.5h6"/>',
 'kakao': '<path d="M12 4.5c-4.7 0-8.5 3-8.5 6.6 0 2.3 1.5 4.3 3.9 5.5l-.8 3.4 3.9-2.5c.5.1 1 .1 1.5.1 4.7 0 8.5-3 8.5-6.5S16.7 4.5 12 4.5z"/>',
 'insta': '<rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.5"/>',
 'blog': '<path d="M5 19l1-4L16 5l3 3L9 18z"/><path d="M14 7l3 3"/>',
 'card': '<rect x="3" y="6" width="18" height="12" rx="2.5"/><circle cx="8.5" cy="12" r="2"/><path d="M13 10.5h5M13 13.5h4"/>',
 'cal': '<rect x="4" y="5" width="16" height="15" rx="2.5"/><path d="M4 10h16M9 3v4M15 3v4"/>',
 'mail': '<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M4 7l8 6 8-6"/>',
 'tube': '<rect x="3" y="6" width="18" height="12" rx="4"/><path d="M10.5 9.5v5l4-2.5z"/>',
 'doc': '<rect x="5" y="3.5" width="14" height="17" rx="2.5"/><path d="M8.5 8h7M8.5 11.5h7M8.5 15h4"/>',
}
def ic(k): return '<svg viewBox="0 0 24 24">' + IC[k] + '</svg>'

def acts(lst):
    o = []
    for i, (k, label) in enumerate(lst):
        o.append('<a%s href="#s" data-s="1"><span class="circ">%s</span><span>%s</span></a>' % (' class="hi"' if i == 0 else '', ic(k), e(label)))
    return '<nav class="acts">' + ''.join(o) + '</nav>'

def bg(u): return "background:url('%s') center/cover no-repeat" % u

def gallery(imgs, room=None, note='우리 이야기 방에 올린 공개 사진이 이 자리에 보입니다 · 누르면 그 방으로'):
    h = '<div class="ph">' + ''.join('<a href="%s"%s style="%s"></a>' % (room or '#s', '' if room else ' data-s="1"', bg(u)) for u in imgs) + '</div>'
    h += '<p class="note" style="margin-top:6px">%s</p>' % e(note)
    h += '<a class="more" href="%s"%s>우리 이야기 방 ›</a>' % (room or '#s', '' if room else ' data-s="1"')
    return h

def rows(lst):
    """lst: (thumb_html_or_url, title, small, right)"""
    o = []
    for th, t, sm, rt in lst:
        if th.startswith('http'):
            th = '<span class="th" style="%s"></span>' % bg(th)
        else:
            th = '<span class="th">%s</span>' % th
        o.append('<a href="#s" data-s="1">%s<span class="t"><b>%s</b><small>%s</small></span>%s</a>' % (th, e(t), e(sm), ('<i style="font-size:14px;font-weight:800">%s</i>' % e(rt)) if rt else '<i>›</i>'))
    return '<div class="ml">' + ''.join(o) + '</div>'

def members(lst, search):
    cards = ''.join('<a class="mm" href="#s" data-s="1"><span class="noimg" style="%s">%s</span><b>%s</b><small>%s</small></a>' % (bg(u) if u.startswith('http') else 'background:#F3EEE6', '' if u.startswith('http') else u, e(n), e(sm)) for u, n, sm in lst)
    return ('<div class="srch" style="margin-top:18px"><span class="mag"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6.5"/><path d="M16 16l4.5 4.5"/></svg>'
            '<input type="search" placeholder="%s" aria-label="%s" data-s="1" readonly></span></div><div class="mg">%s</div>'
            '<a class="more" href="#s" data-s="1" style="margin-top:8px">전체 회원 보기 ›</a>') % (e(search), e(search), cards)

def fold(title, one, full):
    return '<details class="box fold"><summary><b>%s</b><span class="sub one">%s</span></summary><span class="sub">%s</span></details>' % (e(title), e(one), full)

def owner(face, name, title, line):
    f = ('<span style="width:72px;height:72px;border-radius:50%%;flex:none;border:3px solid #fff;box-shadow:0 1px 6px rgba(0,0,0,.15);%s"></span>' % (bg(face) if face.startswith('http') else 'background:#F3EEE6;display:grid;place-items:center'))
    if not face.startswith('http'):
        f = f.replace('"></span>', '">%s</span>' % face)
    return ('<div style="display:flex;align-items:center;gap:14px;margin:16px 16px 4px">%s<div><b style="font-size:19px;color:var(--ink)">%s</b> <span style="color:var(--sub);font-size:14px">%s</span><div style="font-size:13.5px;color:var(--sub)">%s</div></div></div>' % (f, e(name), e(title), e(line)))

def page(p):
    cover = p['cover'] or 'x'
    cv = ('<div class="cv-img" role="img" aria-label="표지" style="%s"></div>' % (bg(cover) if cover.startswith('http') else cover))
    body = [] if not p['id'] else [
        '<div class="smpbar">견본 · 이 모양으로 만들어 드립니다 · <a href="%s" style="font-weight:800;color:#1E4A76">%s ›</a></div>' % (p['mk'][0], e(p['mk'][1])),
        '<header class="cover">%s<div class="cv-t"><h1>%s</h1><p>%s</p></div></header>' % (cv, e(p['title']), e(p['sub'])),
    ]
    body += p['body']
    if not p['id']:
        body.append('<div data-howto="home,loop,faq"></div>')  # 261128 사용 안내 펼치기 card/howto.js
    body.append('<div class="mini">' + ''.join('<a href="%s"%s>%s<i>›</i></a>' % (u, ' data-s="1"' if u == '#s' else '', e(t)) for t, u in p['mini']) + '</div>')
    body.append('<footer class="ft"><div><a href="https://www.loveflow.ai.kr/use/"><b>사랑흐름</b></a> · 디지털 명함 · 모바일 홈페이지 제작 © 2026 사랑흐름 · LFRI™ · 무단 복제 · 배포 · 상업적 이용 금지 · All rights reserved</div></footer>')
    out = '''<!DOCTYPE html>
<!-- [우리이야기] 견본 모바일 홈페이지 · %(id)s · v1 · 261126 · tpl/sample/gen.py 로 만듦(손으로 고치지 말고 gen.py 에서) · 자료는 모두 가상 -->
<html lang="ko"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex,nofollow"><meta name="description" content="%(desc)s">
<meta property="og:title" content="%(title)s"><meta property="og:description" content="%(desc)s"><meta property="og:image" content="%(og)s">
<title>%(title)s</title>
<style>%(css)s
.cv-svg{position:absolute;left:0;right:0;top:14px;display:flex;justify-content:center}.cv-svg svg{width:58%%;max-width:260px;height:auto}
.price{margin:0 16px;border:1px solid var(--line);border-radius:14px;overflow:hidden;font-size:14.5px}.price div{display:flex;justify-content:space-between;padding:11px 14px;border-bottom:1px solid var(--line)}.price div:last-child{border:0}.price b{color:var(--navy)}
.cal{margin:0 16px}.cal div{display:flex;gap:12px;align-items:center;padding:10px 2px;border-bottom:1px solid var(--line)}.cal em{font-style:normal;flex:none;width:52px;text-align:center;background:var(--sand);border-radius:10px;padding:6px 0;font-weight:800;color:var(--navy);font-size:13px;line-height:1.3}.cal b{display:block;font-size:15px}.cal small{color:var(--sub);font-size:13px}
</style></head><body>
<div class="pg">
%(body)s
</div>
<div id="stt" hidden>견본입니다 · 실제 홈페이지에서는 이 단추가 바로 연결됩니다</div>
<script>
(function(){
function sh(){ var t=document.getElementById('stt'); t.hidden=false; clearTimeout(t._h); t._h=setTimeout(function(){ t.hidden=true; },2200); }
document.addEventListener('click',function(e){ var a=e.target.closest('[data-s]'); if(!a){ return; } e.preventDefault(); sh(); });
document.addEventListener('focusin',function(e){ if(e.target.matches&&e.target.matches('input[data-s]')){ e.target.blur(); sh(); } });
})();
</script>
%(hw)s</body></html>
''' % dict(hw=('' if p['id'] else '<script src="/card/howto.js?v=1" defer></script>\n'), id=p['id'], desc=e(p['desc']), title=e(p['title']), og=p.get('og', ''), css=CSS, body='\n'.join(body))
    d = os.path.join(ROOT, 'home', p['id']); os.makedirs(d, exist_ok=True)
    open(os.path.join(d, 'index.html'), 'w', encoding='utf-8').write(out)
    print('home/%s' % (p['id'] + '/' if p['id'] else ''))

# ── 그림(SVG) — 사선 없이 둥근 칸 · 원으로만 ──
def car(body, roof, w=300, h=120, roofw=150, roofx=None, tall=0, mark=''):
    rx = roofx if roofx is not None else (w - roofw) / 2 + 10
    return ('<svg viewBox="0 0 320 170" xmlns="http://www.w3.org/2000/svg">'
            '<rect x="0" y="150" width="320" height="6" rx="3" fill="rgba(0,0,0,.12)"/>'
            '<rect x="%d" y="%d" width="%d" height="%d" rx="26" fill="%s"/>' % (rx, 40 - tall, roofw, 60 + tall, roof) +
            '<rect x="%d" y="%d" width="%d" height="%d" rx="16" fill="#E8F1F8" opacity=".9"/>' % (rx + 14, 52 - tall, roofw / 2 - 20, 30 + tall // 2) +
            '<rect x="%d" y="%d" width="%d" height="%d" rx="16" fill="#E8F1F8" opacity=".9"/>' % (rx + roofw / 2 + 6, 52 - tall, roofw / 2 - 20, 30 + tall // 2) +
            '<rect x="%d" y="80" width="%d" height="56" rx="24" fill="%s"/>' % ((320 - w) / 2, w, body) +
            '<rect x="%d" y="96" width="22" height="10" rx="5" fill="#FFE9A8"/>' % ((320 - w) / 2 + w - 30) +
            '<rect x="%d" y="96" width="16" height="10" rx="5" fill="#F3A7A0"/>' % ((320 - w) / 2 + 8) +
            '<circle cx="%d" cy="136" r="22" fill="#2E3A46"/><circle cx="%d" cy="136" r="9" fill="#C9CED4"/>' % ((320 - w) / 2 + 62, (320 - w) / 2 + 62) +
            '<circle cx="%d" cy="136" r="22" fill="#2E3A46"/><circle cx="%d" cy="136" r="9" fill="#C9CED4"/>' % ((320 - w) / 2 + w - 62, (320 - w) / 2 + w - 62) +
            mark + '</svg>')

def svg_uri(svg):
    import urllib.parse
    return 'data:image/svg+xml,' + urllib.parse.quote(svg)

def thumb_svg(inner, bgc='#EEF3F8'):
    return '<svg viewBox="0 0 48 48" style="width:48px;height:48px;stroke:none"><rect width="48" height="48" rx="10" fill="%s"/>%s</svg>' % (bgc, inner)

CAR_SMALL = car('#F2B84B', '#E3A63A', w=220, roofw=120)
CAR_SEDAN = car('#1E4A76', '#173C61', w=300, roofw=150)
CAR_SUV = car('#4E7A5A', '#3F684B', w=290, roofw=210, tall=14)
CAR_EV = car('#E8ECEF', '#CFD6DC', w=290, roofw=160, mark='<circle cx="160" cy="108" r="13" fill="#0F9D7A"/><rect x="155" y="101" width="10" height="14" rx="2" fill="#fff"/>')
def tile(svg, c):
    return svg_uri('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 320"><rect width="320" height="320" fill="%s"/><g transform="translate(0 75)">%s</g></svg>' % (c, svg.replace('<svg viewBox="0 0 320 170" xmlns="http://www.w3.org/2000/svg">','').replace('</svg>','')))

def cover_svg(svg, c1, c2):
    return 'background:linear-gradient(160deg,%s,%s)"></div><div class="cv-svg">%s</div><div style="display:none' % (c1, c2, svg)

PAY = ('https://uriyagi.kr/card/new/?m=pay', '주문 제작 신청')
ORG = ('https://www.loveflow.ai.kr/use/#o', '단체 홈페이지')
MINI_P = [('디지털 명함 보기', '#s'), ('사랑흐름으로 더 풍성하게', 'https://www.loveflow.ai.kr/use/')]
MINI_O = [('사용법 · 스스로 배우기', 'https://uriyagi.kr/guide/'), ('단체 교육 문의', '#s'), ('사랑흐름으로 더 풍성하게', 'https://www.loveflow.ai.kr/use/#o')]

# ① 학교 동창회
page(dict(id='sample-alumni', title='견본 · 한빛초등학교 32회 동창회', sub='1985년 졸업 · 동창 소식과 사진을 한곳에', desc='학교 동창회 모바일 홈페이지 견본 · 사랑흐름',
  og=S + 'hike/h7.jpg', cover=S + 'hike/h7.jpg', mk=ORG, mini=MINI_O, body=[
  fold('우리 동창회를 소개합니다', '졸업 40년, 다시 모인 한빛 32회입니다.', '졸업 40년, 다시 모인 한빛 32회입니다. 봄 · 가을 정기 모임과 동창 산악회 · 경조사 소식을 이곳에서 나눕니다. 연락이 끊긴 친구가 있으면 이 주소를 보내 주세요. (가상 동창회 · 견본 글)'),
  members([(E + 'n03_grandpa_color.jpg', '김동수 (동수 철물)', '회장 · 철물점'), (E + 'n01_flower_grandma_color.jpg', '박영희 (영희 꽃방)', '총무 · 꽃집'),
           (S + 'bike/b3.jpg', '이철민 (한결 자전거)', '동창 · 자전거 가게'), (E + 'p07_office_bw.jpg', '최정호 (정호 세무)', '동창 · 세무사')], '동창 검색 (이름 · 상호)'),
  '<h2>모임 · 행사</h2><div class="cal"><div><em>12월<br>13일</em><span><b>송년회</b><small>토요일 저녁 6시 · ○○회관 2층 (가상)</small></span></div><div><em>1월<br>10일</em><span><b>동창 산악회 새해 산행</b><small>아침 8시 · ○○산 입구 (가상)</small></span></div><div><em>매달<br>셋째 주</em><span><b>서울 · 경기 동창 점심</b><small>장소는 단체방에서 알려 드립니다</small></span></div></div>',
  '<h2>추억 · 사진</h2>' + gallery([E + 'p07_office_bw.jpg', S + 'bike/b2.jpg', E + 'n06_hanok_room_color.jpg', S + 'hike/h9.jpg', S + 'hike/h3.jpg', E + 'n05_porch_radish_color.jpg']),
  '<h2>경조사 알림</h2>' + rows([(thumb_svg('<circle cx="24" cy="24" r="9" fill="#C9A96E"/>'), '경사 · 조사 소식', '총무에게 알려 주시면 이 자리에 올립니다', ''), (thumb_svg('<rect x="12" y="14" width="24" height="20" rx="4" fill="#1E4A76"/>'), '회비 안내', '연회비 · 계좌는 총무에게 문의 (견본)', '')]),
  '<h2>총무 · 연락</h2><div class="box" style="margin-top:0"><b>총무 박영희</b><span class="sub">모임 · 회비 · 경조사 문의</span></div>' + acts([('call', '총무 전화'), ('sms', '문자'), ('kakao', '단체방'), ('map', '모임 장소')]),
]))

# ② 스포츠 모임 — sample-org 는 그대로(대표 OK 시안) · 여기선 러닝 모임
page(dict(id='sample-run', title='견본 · 강변 새벽 러닝 크루', sub='화 · 목 새벽 6시 · 토요일 아침 7시', desc='스포츠 모임 모바일 홈페이지 견본 · 사랑흐름',
  og=S + 'bike/b5.jpg', cover=S + 'bike/b5.jpg', mk=ORG, mini=MINI_O, body=[
  fold('우리 크루를 소개합니다', '처음 뛰는 분도 5km부터 함께 달립니다.', '처음 뛰는 분도 5km부터 함께 달립니다. 기록보다 꾸준함이 목표이고, 한 달에 한 번은 대회에 함께 나갑니다. (가상 모임 · 견본 글)'),
  '<h2>이번 주 달리기</h2><div class="cal"><div><em>화</em><span><b>새벽 5km · 천천히</b><small>6시 · ○○교 아래 모임 (가상)</small></span></div><div><em>목</em><span><b>인터벌 훈련</b><small>6시 · 강변 트랙 (가상)</small></span></div><div><em>토</em><span><b>10km 함께 달리기</b><small>7시 · 끝나고 아침 식사</small></span></div></div>',
  members([(S + 'bike/b6.jpg', '정민호', '크루장 · 마라톤 30회'), (S + 'hike/h4.jpg', '한수진', '총무'), (S + 'bike/b4.jpg', '바람 러닝화', '회원 가게 · 운동화'), (S + 'swim/s3.jpg', '튼튼 정형외과', '회원 · 병원')], '회원 검색 (이름 · 상호)'),
  '<h2>소식 · 기록</h2>' + gallery([S + 'bike/b1.jpg', S + 'bike/b5.jpg', S + 'hike/h6.jpg', S + 'bike/b2.jpg', S + 'bike/b4.jpg', S + 'hike/h1.jpg'], room='https://uriyagi.kr/?c=C-0294', note='견본 방 「우리들의 주말 러닝」의 공개 사진처럼 이 자리에 보입니다 · 누르면 그 방으로'),
  '<h2>대회 기록</h2><div class="price"><div><span>○○ 하프 마라톤 (가상)</span><b>12명 완주</b></div><div><span>○○ 강변 10km (가상)</span><b>18명 완주</b></div><div><span>크루 첫 풀코스 (가상)</span><b>3명 완주</b></div></div>',
  '<h2>가입 · 연락</h2>' + acts([('kakao', '가입 문의'), ('call', '크루장 전화'), ('map', '모이는 곳'), ('insta', '인스타')]),
]))

# ③ 자동차 영업
page(dict(id='sample-car', title='견본 · 홍길동 차장', sub='○○자동차 ○○지점 · 새 차 · 리스 · 렌트 상담', desc='자동차 영업 모바일 홈페이지 견본 · 사랑흐름',
  og=S + 'hike/h6.jpg', cover=cover_svg(CAR_SEDAN, '#9DB7C9', '#1E4A76'), mk=PAY, mini=[('디지털 명함 보기', '/card/sample-car/'), ('사랑흐름으로 더 풍성하게', 'https://www.loveflow.ai.kr/use/')], body=[
  owner(thumb_svg('<circle cx="24" cy="19" r="8" fill="#1E4A76"/><rect x="11" y="30" width="26" height="12" rx="6" fill="#1E4A76"/>', '#F3EEE6').replace('width:48px;height:48px', 'width:66px;height:66px'), '홍길동', '차장', '출고 1,200대 · 상담은 편하게 (가상)'),
  acts([('call', '전화'), ('sms', '문자'), ('kakao', '카카오톡'), ('map', '지점 위치')]),
  '<h2>판매 차종</h2>' + rows([
    ('<img src="%s" alt="" style="width:48px;height:48px;border-radius:10px;background:#FFF4DE">' % svg_uri(CAR_SMALL), '경차', '첫 차 · 출퇴근 · 세금 · 주차 부담 적게', '견적 ›'),
    ('<img src="%s" alt="" style="width:48px;height:48px;border-radius:10px;background:#E8F0F8">' % svg_uri(CAR_SEDAN), '세단', '조용한 승차감 · 법인 · 가족', '견적 ›'),
    ('<img src="%s" alt="" style="width:48px;height:48px;border-radius:10px;background:#E9F2EA">' % svg_uri(CAR_SUV), 'SUV', '캠핑 · 짐 많은 가족 · 사륜', '견적 ›'),
    ('<img src="%s" alt="" style="width:48px;height:48px;border-radius:10px;background:#E6F5F0">' % svg_uri(CAR_EV), '전기차', '충전비 · 보조금 상담 · 집 충전기', '견적 ›')]),
  '<a class="more" href="#s" data-s="1">차종 사진 더 보기 ›</a>',
  '<h2>이달의 혜택</h2><div class="box" style="margin-top:0"><b>12월 출고 고객 · 블랙박스 · 틴팅 (가상)</b><span class="sub">혜택이 바뀌면 이 칸만 바꿉니다 · 주소와 QR은 그대로</span></div>',
  '<h2>구매 방법 비교</h2><div class="price"><div><span>일시불 · 할부</span><b>내 차로 · 이자 비교</b></div><div><span>리스</span><b>사업자 비용 처리</b></div><div><span>장기 렌트</span><b>보험 · 정비 포함</b></div></div><p class="note" style="margin:8px 16px">어느 쪽이 맞는지 상담에서 같이 계산해 드립니다 (견본 글)</p>',
  '<h2>출고 후기</h2>' + gallery([tile(CAR_SEDAN,'#E8F0F8'), S + 'hike/h6.jpg', tile(CAR_SUV,'#E9F2EA'), tile(CAR_EV,'#E6F5F0'), S + 'bike/b4.jpg', tile(CAR_SMALL,'#FFF4DE')], note='출고 사진과 고객 후기를 우리 이야기 방에 올리면 이 자리에 보입니다'),
  fold('자주 묻는 질문', '시승은 어떻게 하나요?', '<b style="color:var(--ink);display:inline">시승은 어떻게 하나요?</b> 원하시는 날을 문자로 주시면 차를 가지고 찾아갑니다.<br><b style="color:var(--ink);display:inline">타던 차는요?</b> 중고 시세를 함께 알아봐 드립니다.<br><b style="color:var(--ink);display:inline">출고는 얼마나 걸리나요?</b> 차종마다 달라 상담 때 바로 확인해 드립니다. (견본 글)'),
  '<a class="btn org" href="#s" data-s="1">견적 · 상담 신청</a>',
]))

# ④ 정치인(지역 의원) — 정당 · 실제 인물 없음
page(dict(id='sample-council', title='견본 · ○○시의원 홍길동', sub='○○동 · ○○동 · ○○동 · 주민 곁에서', desc='지역 의원 모바일 홈페이지 견본 · 사랑흐름',
  og=S + 'bike/b4.jpg', cover=S + 'hike/h6.jpg', mk=PAY, mini=MINI_P, body=[
  owner(thumb_svg('<circle cx="24" cy="19" r="8" fill="#1E4A76"/><rect x="11" y="30" width="26" height="12" rx="6" fill="#1E4A76"/>', '#F3EEE6').replace('width:48px;height:48px', 'width:66px;height:66px'), '홍길동', '○○시의원', '○○위원회 · 가상 인물 · 견본'),
  acts([('doc', '민원 접수'), ('call', '사무실 전화'), ('cal', '의정 일정'), ('map', '사무실')]),
  fold('인사드립니다', '동네 일은 동네에서 듣고 풉니다.', '동네 일은 동네에서 듣고 풉니다. 매주 화요일 오후는 사무실 문을 열어 두고 주민 이야기를 듣습니다. (가상 인물 · 견본 글)'),
  '<h2>우리 동네 현안</h2>' + rows([
    (S + 'bike/b4.jpg', '하천 산책로 가로등', '어두운 구간 12곳 · 예산 반영 요청', '진행'),
    (S + 'hike/h6.jpg', '다리 위 보행로 넓히기', '주민 설명회 마침 · 설계 중', '진행'),
    (S + 'swim/s3.jpg', '체육관 주차장', '평일 저녁 개방 · 시험 운영', '완료'),
    (S + 'bike/b7.jpg', '자전거 수리 쉼터', '산책로 2곳 더 · 다음 해', '검토')]),
  '<h2>의정 활동</h2><div class="cal"><div><em>11월<br>20일</em><span><b>행정사무감사 · 도로 정비 질의</b><small>회의록 보기 › (견본)</small></span></div><div><em>11월<br>12일</em><span><b>○○동 주민 간담회</b><small>현안 7건 접수 · 답변 정리 중</small></span></div><div><em>10월<br>28일</em><span><b>조례 대표 발의</b><small>○○ 조례 일부 개정 (가상)</small></span></div></div>',
  '<h2>현장 사진</h2>' + gallery([S + 'bike/b4.jpg', S + 'hike/h6.jpg', S + 'swim/s3.jpg', S + 'bike/b7.jpg', S + 'bike/b5.jpg', S + 'swim/s5.jpg'], note='현장 사진을 우리 이야기 방에 올리면 이 자리에 보입니다'),
  '<h2>민원 · 연락</h2><div class="box" style="margin-top:0"><b>지역 사무실 (가상)</b><span class="sub">○○로 12 · 평일 9시 ~ 6시 · 화요일 오후 주민 상담</span></div><a class="btn navy" href="#s" data-s="1">민원 접수</a>',
]))

# ⑤ 보험 설계사
SHIELD = '<rect x="14" y="11" width="20" height="24" rx="9" fill="#1E4A76"/><rect x="21" y="18" width="6" height="11" rx="2" fill="#fff"/><rect x="18.5" y="20.5" width="11" height="6" rx="2" fill="#fff"/>'
page(dict(id='sample-insure', title='견본 · 김미래 보험 설계', sub='여러 보험사 비교 · 가입한 보험 점검 · 보상 청구 도움', desc='보험 설계사 모바일 홈페이지 견본 · 사랑흐름',
  og=S + 'hike/h1.jpg', cover=S + 'hike/h1.jpg', mk=PAY, mini=MINI_P, body=[
  owner(thumb_svg('<circle cx="24" cy="19" r="8" fill="#C9A96E"/><rect x="11" y="30" width="26" height="12" rx="6" fill="#C9A96E"/>', '#F3EEE6').replace('width:48px;height:48px', 'width:66px;height:66px'), '김미래', '보험 설계사', '경력 15년 · 가상 인물 · 견본'),
  acts([('kakao', '카카오톡 상담'), ('call', '전화'), ('sms', '문자'), ('cal', '상담 예약')]),
  '<h2>상담 분야</h2>' + rows([
    (thumb_svg(SHIELD), '가입한 보험 점검', '겹치는 것 · 빠진 것 · 보험료 줄이기', ''),
    (thumb_svg('<rect x="12" y="22" width="24" height="15" rx="3" fill="#C9A96E"/><rect x="16" y="12" width="16" height="14" rx="7" fill="#C9A96E"/>', '#FFF6E6'), '실손 · 건강', '병원비 · 수술 · 입원', ''),
    (thumb_svg('<rect x="10" y="20" width="28" height="12" rx="6" fill="#4E7A5A"/><circle cx="17" cy="33" r="4" fill="#2E3A46"/><circle cx="31" cy="33" r="4" fill="#2E3A46"/>', '#EAF3EC'), '자동차', '갱신 비교 · 사고 처리', ''),
    (thumb_svg('<rect x="12" y="20" width="24" height="17" rx="3" fill="#1E4A76"/><rect x="18" y="11" width="12" height="12" rx="3" fill="#1E4A76"/><rect x="21" y="27" width="6" height="10" rx="2" fill="#fff"/>'), '집 · 가게 화재', '가게 사장님 · 배상 책임', ''),
    (thumb_svg('<circle cx="18" cy="20" r="6" fill="#C9A96E"/><circle cx="31" cy="22" r="5" fill="#1E4A76"/><rect x="10" y="28" width="16" height="10" rx="5" fill="#C9A96E"/><rect x="25" y="29" width="13" height="9" rx="4.5" fill="#1E4A76"/>', '#F3EEE6'), '어린이 · 태아', '가족 한 번에 점검', '')]),
  '<h2>보상 청구 도움</h2><div class="box" style="margin-top:0"><b>영수증 사진만 보내 주세요</b><span class="sub">병원 영수증 · 진단서를 사진으로 보내 주시면 청구를 도와드립니다 (견본 글)</span></div>',
  fold('자주 묻는 질문', '상담하면 꼭 가입해야 하나요?', '<b style="color:var(--ink);display:inline">상담하면 꼭 가입해야 하나요?</b> 아닙니다. 점검만 받으셔도 됩니다.<br><b style="color:var(--ink);display:inline">어느 보험사 것인가요?</b> 여러 보험사 상품을 나란히 놓고 비교해 드립니다.<br><b style="color:var(--ink);display:inline">만나지 않고도 되나요?</b> 카카오톡 · 전화로도 됩니다. (견본 글)'),
  '<h2>고객 소식</h2>' + gallery([S + 'hike/h1.jpg', S + 'bike/b2.jpg', S + 'swim/s2.jpg', S + 'hike/h9.jpg', S + 'bike/b6.jpg', S + 'hike/h5.jpg'], note='소식과 사진을 우리 이야기 방에 올리면 이 자리에 보입니다'),
  '<a class="btn org" href="#s" data-s="1">보험 점검 신청</a>',
]))

# ⑥ 종친회(많이 할 수 있는 것 · 각종 단체)
page(dict(id='sample-clan', title='견본 · ○○ 김씨 ○○공파 종친회', sub='종원 소식 · 시제 · 족보 이야기를 한곳에', desc='종친회 모바일 홈페이지 견본 · 사랑흐름',
  og=E + 'p09_hanok_yard_bw.jpg', cover=E + 'n06_hanok_room_color.jpg', mk=ORG, mini=MINI_O, body=[
  fold('종친회를 소개합니다', '흩어져 사는 종원이 소식을 나누는 곳입니다.', '흩어져 사는 종원이 소식을 나누는 곳입니다. 해마다 음력 10월 시제를 모시고, 집안 옛 사진과 이야기를 모아 다음 세대에 남깁니다. (가상 종친회 · 견본 글)'),
  '<h2>행사</h2><div class="cal"><div><em>음력<br>10월</em><span><b>시제</b><small>오전 11시 · ○○ 재실 (가상)</small></span></div><div><em>1월</em><span><b>정기 총회</b><small>결산 · 임원 선출 · ○○회관 (가상)</small></span></div><div><em>봄</em><span><b>벌초 · 묘역 정비</b><small>날짜는 단체방에서 알려 드립니다</small></span></div></div>',
  members([(E + 'n03_grandpa_color.jpg', '김○○ 회장', '○○ 거주 · 24세손'), (E + 'n01_flower_grandma_color.jpg', '김○○ 부회장', '○○ 거주'), (E + 'p07_office_bw.jpg', '김○○ (○○ 건축)', '종원 · 건축사무소'), (S + 'hike/h3.jpg', '김○○ (○○ 농원)', '종원 · 농원')], '종원 검색 (이름 · 상호)'),
  '<h2>옛 사진 · 이야기</h2>' + gallery([E + 'p04_wedding_sepia_bw.jpg', E + 'n06_hanok_room_color.jpg', E + 'p06_wedding_hanbok_bw.jpg', E + 'n05_porch_radish_color.jpg', E + 'p05_wedding_70s_bw.jpg', E + 'p07_office_bw.jpg'], note='종원이 올린 옛 사진은 종원만 보게 할 수도 있습니다 · 공개 사진만 이 자리에'),
  '<h2>알림</h2>' + rows([(thumb_svg('<rect x="13" y="11" width="22" height="26" rx="3" fill="#1E4A76"/><rect x="17" y="16" width="14" height="3" rx="1.5" fill="#fff"/><rect x="17" y="22" width="14" height="3" rx="1.5" fill="#fff"/>'), '족보 · 항렬 안내', '항렬자 · 세손 확인은 총무에게', ''), (thumb_svg('<circle cx="24" cy="24" r="9" fill="#C9A96E"/>'), '경조사 소식', '종원 경사 · 조사를 알려 드립니다', ''), (thumb_svg('<rect x="12" y="14" width="24" height="20" rx="4" fill="#4E7A5A"/>', '#EAF3EC'), '회비 · 기금', '연회비 · 장학 기금 안내 (견본)', '')]),
  '<h2>총무 · 연락</h2><div class="box" style="margin-top:0"><b>○○ 재실 (가상)</b><span class="sub">시제 · 총회 장소 · 주차 있음</span></div>' + acts([('call', '총무 전화'), ('kakao', '종친 단체방'), ('map', '재실 길찾기'), ('mail', '소식 받기')]),
]))

# ── 견본 모음 home/index.html ──
LIST = [('단체 · 모임', [('sample-alumni', '학교 동창회', S + 'hike/h7.jpg'), ('sample-org', '동네 운동 모임', S + 'bike/b5.jpg'), ('sample-run', '러닝 크루', S + 'bike/b1.jpg'), ('sample-clan', '종친회', E + 'n06_hanok_room_color.jpg')]),
        ('개인 · 영업', [('sample-car', '자동차 영업', tile(CAR_SEDAN, '#E8F0F8')), ('sample-insure', '보험 설계사', S + 'hike/h1.jpg'), ('sample-council', '지역 의원', S + 'hike/h6.jpg'), ('C-1001', '사랑흐름 대표 황규찬', '/card/C-1001/photo.jpg')])]
b = ['<div class="smpbar">견본 모음 · 누르면 견본이 열립니다</div>', '<header class="cover" style="height:150px"><div class="cv-img" style="%s"></div><div class="cv-t"><h1>모바일 홈페이지 견본</h1><p>이 모양으로 만들어 드립니다</p></div></header>' % bg(S + 'hike/h5.jpg')]
for t, xs in LIST:
    b.append('<h2>%s</h2><div class="mg">' % e(t) + ''.join('<a class="mm" href="/home/%s/"><span class="noimg" style="%s"></span><b>%s</b><small>견본 보기 ›</small></a>' % (i, bg(u), e(n)) for i, n, u in xs) + '</div>')
b.append('<a class="btn org" href="https://uriyagi.kr/card/new/?m=pay" style="margin-top:22px">주문 제작 신청</a><a class="btn ln" href="https://www.loveflow.ai.kr/use/#o">단체 홈페이지</a>')
page(dict(id='', title='견본 · 모바일 홈페이지', sub='', desc='모바일 홈페이지 견본 모음 · 사랑흐름', og=S + 'hike/h5.jpg', cover='', mk=('https://uriyagi.kr/card/new/', '디지털 명함 만들기'), mini=[('사랑흐름으로 더 풍성하게', 'https://www.loveflow.ai.kr/use/')], body=b))

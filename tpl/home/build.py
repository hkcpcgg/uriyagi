# -*- coding: utf-8 -*-
"""[우리이야기] 모바일 홈페이지 틀 엔진 v1 · 261125
자료(tpl/home/data/<번호>.json) 하나 → home/<번호>/index.html + manifest.webmanifest
꼴 = 다복 home/C-1003 그대로(색 · 칸 · 단추) · 말은 통합 표준 v0.2 · 한국어만(외국어는 v2)
쓰는 법: python3 tpl/home/build.py            (data 안 전부)
         python3 tpl/home/build.py sample-car (하나만)
칸(모두 없어도 됨 · 있는 것만 그림):
 id · title · sub · logo · owner{face,title,name,line} · acts[{k,u,label,hi}] (k = book call sms map insta blog kakao youtube web card)
 items{title,list[{img,name,desc,price,u}],more,moreLabel} (more = 쇼룸 · 우리 이야기 방 주소 · 유료) · info[{title,text,note}] · room{code,title,note} · way{map,link,addr,note}
 consult{tel,sms,label} · links[{k,u,label}] · sample(견본 띠 · noindex) · desc(검색 설명)"""
import json, os, sys, html
ROOT=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
IC={
 'book':'<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4M9 14l2 2 4-4"/>',
 'call':'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z"/>',
 'sms':'<rect x="4" y="5" width="16" height="14" rx="2"/><path d="M8 10h8M8 14h5"/>',
 'map':'<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
 'insta':'<rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.5"/>',
 'blog':'<path d="M5 19l1-4L16 5l3 3L9 18z"/><path d="M14 7l3 3"/>',
 'kakao':'<path d="M12 4C7 4 3 7.1 3 11c0 2.4 1.6 4.6 4 5.8L6 20l4-2.3c.7.1 1.3.2 2 .2 5 0 9-3.1 9-7s-4-7-9-7z"/>',
 'youtube':'<rect x="3" y="6" width="18" height="12" rx="3"/><circle cx="12" cy="12" r="2.5"/>',
 'web':'<path d="M3 11l9-7 9 7M5 10v10h14V10"/>',
 'card':'<rect x="3" y="6" width="18" height="12" rx="2"/><circle cx="8.5" cy="12" r="2"/><path d="M13 10h5M13 14h4"/>',
 'item':'<rect x="4" y="4" width="16" height="16" rx="3"/><circle cx="12" cy="11" r="3"/><path d="M8 17h8"/>',
}
LBL={'book':'예약','call':'전화','sms':'문자','map':'길찾기','insta':'인스타','blog':'블로그','kakao':'카카오','youtube':'유튜브','web':'홈페이지','card':'디지털 명함'}
def e(v): return html.escape(str(v or ''),quote=True)
def svg(k): return '<svg viewBox="0 0 24 24">'+IC.get(k,IC['web'])+'</svg>'
def ext(u): return u.startswith('http')
def a(u,inner,cls=''):
  if u=='#s': return '<a%s href="#s" data-s="1">%s</a>'%(' class="%s"'%cls if cls else '',inner)
  return '<a%s href="%s"%s>%s</a>'%(' class="%s"'%cls if cls else '',e(u),' target="_blank" rel="noopener"' if ext(u) and 'uriyagi.kr' not in u else '',inner)
CSS=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'home.css'),encoding='utf-8').read()
JS=open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'home.js'),encoding='utf-8').read()
def build(d):
  hid=d['id']; url='https://uriyagi.kr/home/%s/'%hid; o=[]
  if d.get('sample'): o.append('<div class="smpbar">견본 · 이 모양으로 만들어 드립니다 · <a href="/card/new/">디지털 명함 만들기 ›</a></div>')
  h='<header class="hero">'
  if d.get('logo'): h+='<img class="lg" src="%s" alt="%s" width="150" height="150">'%(e(d['logo']),e(d['title']))
  h+='<h1>%s</h1>'%e(d['title'])+('<p>%s</p>'%e(d['sub']) if d.get('sub') else '')
  ow=d.get('owner')
  if ow: h+='<div class="own">'+('<img src="%s" alt="" width="46" height="46">'%e(ow['face']) if ow.get('face') else '')+'<span>'+('%s '%e(ow.get('title','')) if ow.get('title') else '')+'<b>%s</b>'%e(ow.get('name',''))+(' · %s'%e(ow['line']) if ow.get('line') else '')+'</span></div>'
  o.append(h+'</header>')
  ac=d.get('acts') or []
  if ac: o.append('<nav class="acts" style="grid-template-columns:repeat(%d,1fr)">'%min(5,len(ac))+''.join(a(x['u'],'<span class="circ">'+svg(x['k'])+'</span><span>'+e(x.get('label') or LBL.get(x['k'],''))+'</span>','hi' if x.get('hi') else '') for x in ac)+'</nav>')
  it=d.get('items')
  if it and it.get('list'):
    def card(x):
      u=x.get('u'); op='<a class="mc" href="#s" data-s="1">' if u=='#s' else ('<a class="mc" href="%s">'%e(u) if u else '<div class="mc">')
      return op+('<img src="%s" alt="%s" width="200" height="140" loading="lazy">'%(e(x['img']),e(x['name'])) if x.get('img') else '<span class="noimg">'+svg('item')+'</span>')+'<b>%s</b>'%e(x['name'])+('<small>%s</small>'%e(x['desc']) if x.get('desc') else '')+('<em>%s</em>'%e(x['price']) if x.get('price') else '')+('</a>' if u else '</div>')
    o.append('<h2>%s</h2><div class="mcs">'%e(it.get('title','대표 상품'))+''.join(card(x) for x in it['list'])+'</div>')
    if it.get('more'): o.append(a(it['more'],e(it.get('moreLabel','사진 더 많은 상품 보기 ›')),'more'))
  for x in d.get('info') or []:
    o.append('<div class="box">'+('<b>%s</b>'%e(x['title']) if x.get('title') else '')+'<span>%s</span>'%e(x.get('text',''))+('<br><span class="sub">%s</span>'%e(x['note']) if x.get('note') else '')+'</div>')
  rm=d.get('room')
  if rm:
    o.append('<h2>%s <span class="newn" id="newn" hidden></span></h2>'%e(rm.get('title','새 소식'))+('<p class="note">%s</p>'%e(rm['note']) if rm.get('note') else '')+'<div class="ph" id="ph" data-room="%s"></div>'%e(rm.get('code',''))+('<a class="btn navy" href="https://uriyagi.kr/?c=%s">%s</a>'%(e(rm['code']),e(rm.get('enter','이야기 방 들어가기'))) if rm.get('code') else ''))
  w=d.get('way')
  if w:
    o.append('<h2>오시는 길</h2>'+('<div class="map">'+a(w.get('link','#'),'<img src="%s" alt="오시는 길" loading="lazy">'%e(w['map']))+'</div>' if w.get('map') else '')+'<div class="box"><span>%s</span>'%e(w.get('addr',''))+('<br><span class="sub">%s</span>'%e(w['note']) if w.get('note') else '')+('<br>'+a(w['link'],'길찾기 ›','tx') if w.get('link') else '')+'</div>')
  c=d.get('consult')
  if c:
    o.append('<h2>%s</h2><div class="two">'%e(c.get('label','상담'))+(a('#s' if c['tel']=='#s' else 'tel:'+c['tel'].replace('-',''),'전화 상담','btn org') if c.get('tel') else '')+(a('#s' if c['sms']=='#s' else 'sms:'+c['sms'].replace('-',''),'문자 상담','btn ln') if c.get('sms') else '')+'</div>')
  lk=d.get('links') or []
  if lk: o.append('<div class="bund" style="grid-template-columns:repeat(%d,1fr)">'%min(3,len(lk))+''.join(a(x['u'],svg(x['k'])+'<span>'+e(x.get('label') or LBL.get(x['k'],''))+'</span>') for x in lk)+'</div>')
  o.append('<div class="hs"><button type="button" id="hsb">휴대폰 홈 화면에 두기</button><div id="hsx" hidden><p>안드로이드: 오른쪽 위 ⋮ 메뉴 › 「홈 화면에 추가」</p><p>아이폰: 아래 □↑ 단추 › 「홈 화면에 추가」</p><p>카카오톡 안에서 여셨다면: 오른쪽 위 ⋮ › 「다른 브라우저로 열기」 뒤에 위처럼</p></div></div>')
  o.append('<footer class="ft"><div><a href="https://www.loveflow.ai.kr/"><b>사랑흐름</b></a> · 디지털 명함 · 모바일 홈페이지 제작 © 2026 사랑흐름 · LFRI™ · 무단 복제 · 배포 · 상업적 이용 금지 · All rights reserved</div></footer>')
  robots='noindex' if d.get('sample') or d.get('noindex') else 'index,follow'
  head=('<!DOCTYPE html>\n<!-- [우리이야기] 모바일 홈페이지 · home/%s · 틀 엔진 tpl/home/build.py 로 만듦(손으로 고치지 말고 data/%s.json 을 고친 뒤 다시 돌림) -->\n'%(hid,hid)+
   '<html lang="ko"><head><meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
   '<title>%s%s</title>\n<meta name="description" content="%s">\n<meta name="robots" content="%s"><link rel="canonical" href="%s">\n'%(e(d['title']),(' · '+e(d['sub'])) if d.get('sub') else '',e(d.get('desc') or d.get('sub') or d['title']),robots,url)+
   '<meta property="og:title" content="%s"><meta property="og:description" content="%s"><meta property="og:url" content="%s"><meta property="og:image" content="%s">\n'%(e(d['title']),e(d.get('sub','')),url,e(d.get('og') or 'https://uriyagi.kr/og-image.png'))+
   '<link rel="icon" href="/uri-favicon-48.png"><link rel="manifest" href="manifest.webmanifest"><meta name="theme-color" content="#1E4A76"><link rel="apple-touch-icon" href="%s">\n'%e(d.get('icon') or '/uri-apple-180.png')+
   '<style>\n'+CSS+'</style></head>\n<body><div class="pg">\n')
  page=head+'\n'.join(o)+'\n</div>\n<div id="stt" hidden>견본입니다 · 실제 홈페이지에서는 이 단추가 바로 연결됩니다</div>\n<script>\n'+JS+'</script>\n</body></html>\n'
  od=os.path.join(ROOT,'home',hid); os.makedirs(od,exist_ok=True)
  open(os.path.join(od,'index.html'),'w',encoding='utf-8').write(page)
  ic=d.get('icon192') or '/uri-icon-192.png'
  man={'name':d['title'],'short_name':d.get('short') or d['title'][:12],'lang':'ko','start_url':'/home/%s/'%hid,'scope':'/home/%s/'%hid,'display':'standalone','background_color':'#FFFCF7','theme_color':'#1E4A76','icons':[{'src':ic,'sizes':'192x192','type':'image/png'},{'src':d.get('icon512') or '/uri-icon-512.png','sizes':'512x512','type':'image/png'}]}
  open(os.path.join(od,'manifest.webmanifest'),'w',encoding='utf-8').write(json.dumps(man,ensure_ascii=False,indent=1))
  return od
if __name__=='__main__':
  dd=os.path.join(os.path.dirname(os.path.abspath(__file__)),'data')
  names=sys.argv[1:] or [f[:-5] for f in sorted(os.listdir(dd)) if f.endswith('.json')]
  for n in names: print(build(json.load(open(os.path.join(dd,n+'.json'),encoding='utf-8'))))

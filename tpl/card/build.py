# -*- coding: utf-8 -*-
"""[우리이야기] 주문 제작 디지털 명함 틀 엔진 v1 · 261125
자료(tpl/card/data/<번호>.json) 하나 → card/<번호>/index.html + 연락처 파일(.vcf) + qr.png
꼴 = 다복 card/C-1003 그대로(앞면 · 단추 줄 · 바닥 「연락처 저장 | 내 명함 보내기」 · 뒷면 · 약도 · 묶음 · 공유하기 · 푸터) · 한국어만(외국어 v2)
쓰는 법: python3 tpl/card/build.py [번호 …]   (qrcode · pillow 필요: pip install qrcode pillow)
칸: id · brand · brandEn · logo · face · title · name · line · tel · mobile(내 명함 보내기 받는 번호 · 화면엔 안 보임) · mail · hours · addr · mapUrl
   acts[{k,u,label,hi}] · items{title,list[{img,name,desc,price}]} · note · open{title,text} · tag · map{img,link} · links[{k,u,label}] · home(모바일 홈페이지 주소) · sample · desc"""
import json, os, sys, html
ROOT=os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
HERE=os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0,os.path.join(ROOT,'tpl','home')); from build import IC, LBL  # 아이콘 · 이름은 홈페이지 틀과 같은 것
IC=dict(IC); IC['room']='<rect x="4" y="5" width="16" height="14" rx="2"/><path d="M8 10h8M8 14h5"/>'; LBL=dict(LBL); LBL['room']='우리 이야기 방'; LBL['nori']='그때 그 놀이'
IC['nori']='<rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="9" cy="9" r="1.2"/><circle cx="15" cy="15" r="1.2"/><circle cx="15" cy="9" r="1.2"/><circle cx="9" cy="15" r="1.2"/>'
SHARE='<svg class="shg" viewBox="0 0 24 24"><path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/></svg>'
def e(v): return html.escape(str(v or ''),quote=True)
def svg(k,cls=''): return '<svg%s viewBox="0 0 24 24">%s</svg>'%(' class="%s"'%cls if cls else '',IC.get(k,IC['web']))
def a(u,inner,cls=''):
  if u=='#s': return '<a%s href="#s" data-s="1">%s</a>'%(' class="%s"'%cls if cls else '',inner)
  return '<a%s href="%s">%s</a>'%(' class="%s"'%cls if cls else '',e(u),inner)
def tel(v): return 'tel:'+str(v).replace('-','').replace(' ','')
def vcf(d,url):
  L=['BEGIN:VCARD','VERSION:3.0','FN:'+(d.get('name') or d['brand']),'N:'+(d.get('name') or d['brand'])+';;;;','ORG:'+d['brand']]
  if d.get('title'): L.append('TITLE:'+d['title'])
  if d.get('tel'): L.append('TEL;TYPE=WORK,VOICE:'+d['tel'])
  if d.get('mail'): L.append('EMAIL:'+d['mail'])
  if d.get('addr'): L.append('ADR;TYPE=WORK:;;'+d['addr']+';;;;')
  if d.get('home'): L.append('URL:'+d['home'])
  L+=['NOTE:디지털 명함 '+url,'END:VCARD']; return '\r\n'.join(L)+'\r\n'
def build(d):
  cid=d['id']; url='https://uriyagi.kr/card/%s/'%cid; od=os.path.join(ROOT,'card',cid); os.makedirs(od,exist_ok=True)
  vname=(d.get('vcfName') or cid)+'.vcf'; open(os.path.join(od,vname),'w',encoding='utf-8').write(vcf(d,url))
  try:
    import qrcode; qrcode.make(url,box_size=8,border=2).save(os.path.join(od,'qr.png'))
  except Exception as x: print('QR 못 만듦',x)
  o=['<div class="smpbar">견본 · 이 모양으로 만들어 드립니다 · <a href="/card/new/">디지털 명함 만들기 ›</a></div>' if d.get('sample') else '','<div class="band"></div><div class="front">']
  o.append('<div class="brand">'+('<img src="%s" alt="%s" width="110" height="105">'%(e(d['logo']),e(d['brand'])) if d.get('logo') else '')+'<div><div class="k">%s</div>'%e(d['brand'])+('<div class="e">%s</div>'%e(d['brandEn']) if d.get('brandEn') else '')+'</div></div>')
  o.append('<div class="who">'+('<img class="av" src="%s" alt="" width="108" height="108">'%e(d['face']) if d.get('face') else '<span class="av noimg">'+svg('item')+'</span>')+'<div>'+('<div class="ti">%s</div>'%e(d['title']) if d.get('title') else '')+'<div class="nm">%s</div>'%e(d.get('name',''))+('<div class="hj" style="font-family:inherit;letter-spacing:0;font-size:14px">%s</div>'%e(d['line']) if d.get('line') else '')+'</div></div>')
  inf=[]
  if d.get('tel'): inf.append(a('#s' if d.get('sample') else tel(d['tel']),'<i>T</i>'+e(d['tel'])))
  if d.get('mail'): inf.append(a('#s' if d.get('sample') else 'mailto:'+d['mail'],'<i>E</i>'+e(d['mail'])))
  if d.get('hours'): inf.append('<a><i>H</i><span>%s</span></a>'%e(d['hours']))
  if d.get('addr'): inf.append(a(d.get('mapUrl') or ('#s' if d.get('sample') else 'https://map.naver.com/p/search/'+d['addr']),'<i>A</i><span>%s</span>'%e(d['addr'])))
  o.append('<div class="info">'+''.join(inf)+'</div></div><div class="band"></div>')
  ac=d.get('acts') or []
  if ac: o.append('<nav class="acts" style="grid-template-columns:repeat(%d,1fr)">'%min(5,len(ac))+''.join(a(x['u'],'<span class="circ">'+svg(x['k'],'ic')+'</span><span>'+e(x.get('label') or LBL.get(x['k'],''))+'</span>','hi' if x.get('hi') else '') for x in ac)+'</nav>')
  o.append('<div class="pad two"><a class="btn navy" id="save" href="%s" download="%s">연락처 저장</a>%s</div><div class="gap"></div>'%(e(vname),e(vname),'<a class="btn org" href="#s" data-s="1">내 명함 보내기</a>' if d.get('sample') else '<a class="btn org" id="send" href="#" data-card="%s" data-tel="%s" data-name="%s">내 명함 보내기</a>'%(e(cid),e(d.get('mobile') or d.get('tel','')),e(d.get('name') or d['brand']))))
  bk=['<section class="back">']
  it=d.get('items')
  if it and it.get('list'):
    bk.append('<h2>%s</h2><ul class="mn">'%e(it.get('title','대표 상품'))+''.join('<li>'+('<img src="%s" alt="%s" width="72" height="72" loading="lazy">'%(e(x['img']),e(x['name'])) if x.get('img') else '<span class="noimg" style="width:72px;height:72px;border-radius:10px;flex:0 0 auto">'+svg('item')+'</span>')+'<div><b>%s</b>'%e(x['name'])+('<small>%s</small>'%e(x['desc']) if x.get('desc') else '')+('<em>%s</em>'%e(x['price']) if x.get('price') else '')+'</div></li>' for x in it['list'])+'</ul>')
  if d.get('note'): bk.append('<p class="note">%s</p>'%e(d['note']))
  if d.get('open'): bk.append('<div class="with"><b>%s</b><span>%s</span></div>'%(e(d['open'].get('title','')),e(d['open'].get('text',''))))
  bk.append('<div class="qrw"><img src="qr.png" alt="이 명함 QR" width="104" height="104"><p><b>%s</b><span>%s</span></p></div></section>'%(e(d['brand']),e(d.get('tag',''))))
  o.append(''.join(bk))
  if d.get('map'): o.append('<div class="gap"></div><div class="map">'+a(d['map'].get('link','#s'),'<img src="%s" alt="오시는 길" loading="lazy">'%e(d['map']['img']))+'</div>')
  lk=d.get('links') or []
  if lk: o.append('<div class="gap"></div><div class="pad"><div class="bund b4" style="grid-template-columns:repeat(%d,1fr)">'%min(4,len(lk))+''.join(a(x['u'],svg(x['k'],'ic')+'<span>'+e(x.get('label') or LBL.get(x['k'],''))+'</span>') for x in lk)+'</div></div>')
  o.append('<div class="gap"></div><div class="pad"><button class="btn ln" id="share">'+SHARE+'공유하기</button><a class="btn org" href="/card/new/">무료 디지털 명함 만들기</a></div>')
  o.append('<footer class="ft"><div class="tx"><a href="https://www.loveflow.ai.kr/use/"><b>사랑흐름</b></a> · 디지털 명함 · 모바일 홈페이지 제작 © 2026 사랑흐름 · LFRI™ · 무단 복제 · 배포 · 상업적 이용 금지 · All rights reserved</div><a class="rp" href="https://pf.kakao.com/_ExndxfX/chat">신고</a></footer>')
  robots='noindex' if d.get('sample') or d.get('noindex') else 'index,follow'
  css=open(os.path.join(HERE,'card.css'),encoding='utf-8').read(); js=open(os.path.join(HERE,'card.js'),encoding='utf-8').read()
  page=('<!DOCTYPE html>\n<!-- [우리이야기] 디지털 명함 · card/%s · 틀 엔진 tpl/card/build.py 로 만듦(손으로 고치지 말고 data/%s.json 을 고친 뒤 다시 돌림) -->\n'%(cid,cid)+
   '<html lang="ko"><head><meta charset="utf-8">\n<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
   '<title>%s · 디지털 명함</title>\n<meta name="description" content="%s">\n<meta name="robots" content="%s"><link rel="canonical" href="%s">\n'%(e(d['brand']),e(d.get('desc') or d['brand']),robots,url)+
   '<meta property="og:title" content="%s"><meta property="og:description" content="%s"><meta property="og:url" content="%s"><meta property="og:image" content="%s">\n'%(e(d['brand']),e(d.get('desc','')),url,e(d.get('og') or 'https://uriyagi.kr/og-image.png'))+
   '<link rel="icon" href="/uri-favicon-48.png">\n<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Noto+Serif+KR:wght@700;900&display=swap" rel="stylesheet">\n'
   '<style>\n'+css+'</style>\n</head>\n<body><div class="pg">\n'+'\n'.join(x for x in o if x)+'\n</div>\n'
   '<div id="toast"><div><b id="tB"></b><p id="tP"></p><button type="button" id="tX">확인</button></div></div>\n'
   '<script>var CARD_URL=%s, CARD_VCF=%s, CARD_TITLE=%s;</script>\n<script>\n'%(json.dumps(url),json.dumps(url+vname),json.dumps(d['brand']+' · 디지털 명함',ensure_ascii=False))+js+'</script>\n<script src="../send.js?v=5" defer></script>\n</body></html>\n')
  open(os.path.join(od,'index.html'),'w',encoding='utf-8').write(page); return od
if __name__=='__main__':
  dd=os.path.join(HERE,'data'); names=sys.argv[1:] or [f[:-5] for f in sorted(os.listdir(dd)) if f.endswith('.json')]
  for n in names: print(build(json.load(open(os.path.join(dd,n+'.json'),encoding='utf-8'))))

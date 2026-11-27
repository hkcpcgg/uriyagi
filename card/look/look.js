/* [우리이야기] 완성 명함 틀 v3 · card/look/look.js · 261127 · 연락처 저장: 서버 연락처 파일 주소(vcfUrl · ①Code v146 recCardVcf)로 엶 · 카카오톡 안에서는 휴대폰 기본 브라우저로 넘겨 엶(전처럼 연락처 앱으로) · 대표 17:30 「파일 다운로드만 됨」
   (v2) 261127 · 대표 17:23 지적: 다른 화면 칸 이름과 겹쳐 이름이 잘리고 상호가 흐림 · 안쪽 칸 이름을 모두 lk- 로 바꿈 · 맨 위 배경 사진(cover · 매장 사진) · 배경 사진이 있으면 머리 높이 키우고 아래로 어둡게 · 홈페이지 아이콘 겹침 걷음 · 맨 아래 글에 링크(나도 만들기 · 사랑흐름 · 우리 이야기)
   (v1) 261127 · 대표 15:40 OK(시안 v2)
   + 하나의 틀로 무료 명함 · 주문 제작 명함 · 신청 화면 「완성 시안 확인」 · 단체 명함이 함께 씀
   + 판: dk(짙은 판) · lt(밝은 판) · 손님이 고름 · 내용은 같고 색만 다름
   + 공유는 표준 공유 그림 svg(card/C-1002 · 404.html 과 같은 것) · 화면 글자에 화살표 쓰지 않음
   + 아이콘은 tpl/home/build.py IC 와 같은 그림
   쓰는 법: LookCard.render(놓을자리, 자료, '판') · LookCard.theme(놓을자리, '판')
   자료 칸: cover(맨 위 배경 사진) · name · title · brand · intro · face · mobile · tel · mail · web · addr · mapUrl · links[{k,u,label}] · url(명함 주소 · /card/qrcode.js 를 먼저 부르면 QR을 그 자리에서 그림) · vcfUrl(서버 연락처 파일 주소 · 있으면 이것을 엶) · vcf(연락처 파일 주소 · 없으면 그 자리에서 만듦) · no(명함 번호) · qr(QR 그림 주소) */
(function(){
var IC={
 call:'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a1 1 0 0 1-1 1A16 16 0 0 1 4 5a1 1 0 0 1 1-1z"/>',
 sms:'<rect x="4" y="5" width="16" height="14" rx="2"/><path d="M8 10h8M8 14h5"/>',
 map:'<path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
 web:'<path d="M3 11l9-7 9 7M5 10v10h14V10"/>',
 mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>',
 insta:'<rect x="4" y="4" width="16" height="16" rx="5"/><circle cx="12" cy="12" r="3.5"/>',
 blog:'<path d="M5 19l1-4L16 5l3 3L9 18z"/><path d="M14 7l3 3"/>',
 kakao:'<path d="M12 4C7 4 3 7.1 3 11c0 2.4 1.6 4.6 4 5.8L6 20l4-2.3c.7.1 1.3.2 2 .2 5 0 9-3.1 9-7s-4-7-9-7z"/>',
 youtube:'<rect x="3" y="6" width="18" height="12" rx="3"/><circle cx="12" cy="12" r="2.5"/>',
 book:'<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16M9 3v4M15 3v4M9 14l2 2 4-4"/>',
 mobile:'<rect x="7" y="2.5" width="10" height="19" rx="2"/><path d="M11 18h2"/>',
 save:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M19 8v6M16 11h6"/>',
 share:'<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>'
};
var LBL={call:'전화',sms:'문자',map:'길찾기',web:'홈페이지',mail:'이메일',insta:'인스타',blog:'블로그',kakao:'카카오',youtube:'유튜브',book:'예약'};
var CSS='.lk{--or:#C9A96E;--navy:#1E4A76;max-width:480px;margin:0 auto;overflow:hidden;background:var(--bg);color:var(--fg);font-family:-apple-system,"Apple SD Gothic Neo","Noto Sans KR","Malgun Gothic",sans-serif;line-height:1.5;transition:background .25s,color .25s}'+
'.lk.dk{--bg:#16202B;--fg:#F4EFE7;--sub:#B9C0C8;--box:#212D3A;--ln:#2E3B4A;--ic:#C9A96E}'+
'.lk.lt{--bg:#FFFFFF;--fg:#222;--sub:#5C636B;--box:#F6F2EB;--ln:#ECE4D8;--ic:#1E4A76}'+
'.lk *{box-sizing:border-box}.lk a{color:inherit;text-decoration:none}'+
'.lk .lk-cv{height:118px;background:linear-gradient(135deg,#1E4A76,#C9A96E);background-size:cover;background-position:center}.lk .lk-cv.ph{height:190px}'+
'.lk .lk-who{text-align:center;margin-top:-62px;padding:0 20px}'+
'.lk .lk-av{width:124px;height:124px;border-radius:50%;object-fit:cover;border:4px solid var(--bg);box-shadow:0 6px 18px rgba(0,0,0,.25);background:var(--box);display:inline-block;vertical-align:top}'+
'.lk .lk-av.lk-no{display:inline-grid;place-items:center;font-size:44px;font-weight:900;color:var(--ic);font-family:"Noto Serif KR",serif}'+
'.lk .lk-nm{font-family:"Noto Serif KR","Nanum Myeongjo",serif;font-size:32px;font-weight:900;letter-spacing:4px;margin:10px 0 0;line-height:1.2;word-break:keep-all}'+
'.lk .lk-ti{font-size:16px;color:var(--sub);margin-top:4px;word-break:keep-all}.lk .lk-ti b{color:var(--or);font-weight:700}'+
'.lk .lk-ics{display:flex;justify-content:center;flex-wrap:wrap;gap:12px;padding:20px 12px 4px}'+
'.lk .lk-ics a{display:flex;flex-direction:column;align-items:center;gap:6px;font-size:13px;width:60px}'+
'.lk .lk-ci{width:52px;height:52px;border-radius:50%;background:var(--box);border:1px solid var(--ln);display:grid;place-items:center;color:var(--ic)}'+
'.lk svg.lk-g{width:22px;height:22px;stroke:currentColor;fill:none;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;display:block;flex:0 0 auto}'+
'.lk .lk-two{display:grid;grid-template-columns:1fr 1fr;gap:10px;padding:18px 16px 6px}'+
'.lk .lk-bt{display:flex;align-items:center;justify-content:center;gap:8px;border:0;border-radius:14px;padding:16px 8px;font:inherit;font-size:17px;font-weight:700;cursor:pointer;width:100%}'+
'.lk .lk-sv{background:#1E4A76;color:#fff}.lk .lk-sd{background:#C9A96E;color:#2E3A46}'+
'.lk .lk-hp{padding:0 16px;margin:0;font-size:13px;color:var(--sub);text-align:center;word-break:keep-all}'+
'.lk .lk-sc{margin:16px 16px 0;background:var(--box);border:1px solid var(--ln);border-radius:16px;padding:16px}'+
'.lk .lk-sc h2{margin:0 0 8px;font-size:13px;letter-spacing:3px;color:var(--or)}.lk .lk-sc p{margin:0;font-size:16px;white-space:pre-line;word-break:keep-all}'+
'.lk .lk-rw{display:flex;gap:10px;align-items:flex-start;padding:8px 0;font-size:15.5px;border-top:1px solid var(--ln);word-break:break-all}.lk .lk-rw:first-of-type{border-top:0}.lk .lk-rw svg.lk-g{color:var(--ic);margin-top:1px}'+
'.lk .lk-qr{display:flex;gap:14px;align-items:center}.lk .lk-qr img,.lk .lk-qr i,.lk .lk-qr .lk-qv{width:96px;height:96px;border-radius:10px;background:#fff;padding:4px;flex:0 0 auto}'+
'.lk .lk-qr i{display:grid;place-items:center;font-style:normal;font-size:12px;color:#888;text-align:center}'+
'.lk .lk-qr .lk-qv svg{width:100%;height:100%;display:block}.lk .lk-qr p{font-size:14.5px}.lk .lk-qr b{color:var(--or)}'+
'.lk .lk-ft{margin-top:18px;padding:14px 16px 22px;font-size:13px;color:var(--sub);text-align:center;border-top:1px solid var(--ln);line-height:1.9}.lk .lk-ft a{color:var(--or);font-weight:700;text-decoration:underline;text-underline-offset:3px}.lk .lk-ft a.mk{display:inline-block;text-decoration:none;border:1.5px solid var(--or);border-radius:20px;padding:4px 14px;margin-bottom:6px}'+
'.lk-t{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#2E3A46;color:#fff;border-radius:12px;padding:12px 16px;font-size:15px;opacity:0;transition:opacity .2s;pointer-events:none;max-width:90vw;z-index:50;text-align:center}.lk-t.on{opacity:1}';
function css(){ if(document.getElementById('lkCss')) return; var s=document.createElement('style'); s.id='lkCss'; s.textContent=CSS; document.head.appendChild(s); }
function esc(s){ return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }
function g(k){ return '<svg class="lk-g" viewBox="0 0 24 24" aria-hidden="true">'+(IC[k]||IC.web)+'</svg>'; }
function digits(s){ return String(s||'').replace(/[^0-9+]/g,''); }
function toast(m){ var t=document.querySelector('.lk-t'); if(!t){ t=document.createElement('div'); t.className='lk-t'; document.body.appendChild(t); } t.textContent=m; t.className='lk-t on'; clearTimeout(toast.h); toast.h=setTimeout(function(){ t.className='lk-t'; },2600); }
function vcf(d){ var L=['BEGIN:VCARD','VERSION:3.0','N:'+(d.name||'').slice(0,1)+';'+(d.name||'').slice(1)+';;;','FN:'+(d.name||'')];
  if(d.brand) L.push('ORG:'+d.brand); if(d.title) L.push('TITLE:'+d.title);
  if(d.mobile) L.push('TEL;TYPE=CELL:'+d.mobile); if(d.tel) L.push('TEL;TYPE=WORK:'+d.tel);
  if(d.mail) L.push('EMAIL:'+d.mail); if(d.web) L.push('URL:'+d.web); if(d.addr) L.push('ADR;TYPE=WORK:;;'+d.addr+';;;;');
  if(d.url) L.push('NOTE:디지털 명함 '+d.url); L.push('END:VCARD'); return L.join('\r\n'); }
function qrSvg(u){ try{ var q=qrcode(0,'M'); q.addData(u); q.make(); return q.createSvgTag({cellSize:4,margin:0}); }catch(x){ return ''; } }
function acts(d){ var a=[];
  if(d.mobile||d.tel) a.push({k:'call',u:'tel:'+digits(d.mobile||d.tel)});
  if(d.mobile) a.push({k:'sms',u:'sms:'+digits(d.mobile)});
  if(d.web) a.push({k:'web',u:d.web});
  if(d.addr) a.push({k:'map',u:d.mapUrl||('https://map.naver.com/p/search/'+encodeURIComponent(d.addr))});
  function nu(u){ return String(u||'').toLowerCase().replace(/^https?:\/\//,'').replace(/^www\./,'').replace(/\/+$/,''); }
  (d.links||[]).forEach(function(x){ if(!x||!x.u||a.length>=6) return; if(a.some(function(y){ return nu(y.u)===nu(x.u); })) return; a.push(x); });   /* v2 같은 주소 두 번 걷음 */
  return a.slice(0,6); }
function render(el,d,th){ css(); d=d||{}; var A=acts(d), no=!!d.preview;
  var cvs=d.cover?' ph" style="background-image:linear-gradient(180deg,rgba(0,0,0,0) 45%,rgba(0,0,0,.45)),url(\''+esc(d.cover)+'\')':'';
  var h='<div class="lk '+(th==='lt'?'lt':'dk')+'"><div class="lk-cv'+cvs+'"></div><div class="lk-who">'+
   (d.face?'<img class="lk-av" src="'+esc(d.face)+'" alt="'+esc(d.name)+' 사진">':'<span class="lk-av lk-no">'+esc((d.name||'').slice(0,1))+'</span>')+
   '<div class="lk-nm">'+esc(d.name||'이름')+'</div>'+
   '<div class="lk-ti">'+(d.brand?'<b>'+esc(d.brand)+'</b>':'')+(d.brand&&d.title?' · ':'')+esc(d.title||'')+'</div></div>';
  if(A.length) h+='<nav class="lk-ics">'+A.map(function(x){ var ext=/^https?:/.test(x.u); return '<a href="'+esc(x.u)+'"'+(ext?' target="_blank" rel="noopener"':'')+'><span class="lk-ci">'+g(x.k)+'</span>'+esc(x.label||LBL[x.k]||'링크')+'</a>'; }).join('')+'</nav>';
  h+='<div class="lk-two"><a class="lk-bt lk-sv" data-lk="save" href="'+esc(d.vcfUrl||d.vcf||'#')+'"'+(d.vcf&&!d.vcfUrl?' download':'')+'>'+g('save')+'연락처 저장</a>'+
     '<button class="lk-bt lk-sd" type="button" data-lk="send">'+g('share')+'내 명함 보내기</button></div>'+
     '<p class="lk-hp">「연락처 저장」을 누르면 이 명함 주인 연락처가 내 휴대폰에 저장됩니다</p>';
  if(d.intro) h+='<div class="lk-sc"><h2>소개</h2><p>'+esc(d.intro)+'</p></div>';
  var R=[]; if(d.mobile) R.push(['mobile',d.mobile]); if(d.tel) R.push(['call',d.tel]); if(d.mail) R.push(['mail',d.mail]);
  if(d.web) R.push(['web',String(d.web).replace(/^https?:\/\//,'').replace(/\/$/,'')]); if(d.addr) R.push(['map',d.addr]);
  if(R.length) h+='<div class="lk-sc"><h2>연락처</h2>'+R.map(function(r){ return '<div class="lk-rw">'+g(r[0])+'<span>'+esc(r[1])+'</span></div>'; }).join('')+'</div>';
  h+='<div class="lk-sc lk-qr">'+(d.qr?'<img src="'+esc(d.qr)+'" alt="명함 QR">':(d.url&&window.qrcode?'<span class="lk-qv">'+qrSvg(d.url)+'</span>':'<i>확정하면<br>QR이<br>나옵니다</i>'))+
     '<p>이 QR을 찍으면 이 명함이 열립니다<br><b>'+esc(d.url?String(d.url).replace(/^https?:\/\//,'').replace(/\/$/,''):'확정하면 명함 주소가 나옵니다')+'</b></p></div>'+
     '<div class="lk-ft"><a class="mk" href="https://uriyagi.kr/card/">나도 디지털 명함 만들기</a><br><a href="https://www.loveflow.ai.kr/">사랑흐름</a> · <a href="https://uriyagi.kr/">우리 이야기</a> 디지털 명함</div></div>';
  el.innerHTML=h;
  var sv=el.querySelector('[data-lk=save]'), sd=el.querySelector('[data-lk=send]');
  sv.addEventListener('click',function(e){ if(no){ e.preventDefault(); toast('미리 보기입니다 · 발급되면 이 단추로 연락처가 저장됩니다'); return; }
    var vu=d.vcfUrl||d.vcf; if(vu){ var ua=navigator.userAgent||''; if(/KAKAOTALK/i.test(ua)){ e.preventDefault(); var abs=/^https?:/.test(vu)?vu:location.origin+vu; if(/Android/i.test(ua)){ location.href='intent://'+abs.replace(/^https:\/\//,'')+'#Intent;scheme=https;package=com.android.chrome;end'; } else { location.href='kakaotalk://web/openExternal?url='+encodeURIComponent(abs); } return; } if(d.vcfUrl){ e.preventDefault(); location.href=d.vcfUrl; } return; }   /* v3 */
    e.preventDefault();
    try{ var b=new Blob([vcf(d)],{type:'text/vcard;charset=utf-8'}), u=URL.createObjectURL(b), a=document.createElement('a'); a.href=u; a.download=(d.name||'명함')+'.vcf'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(function(){ URL.revokeObjectURL(u); },4000); }catch(x){ toast('연락처를 만들지 못했습니다'); } });
  sd.addEventListener('click',function(){ if(no||!d.url){ toast('미리 보기입니다 · 발급되면 카카오톡 · 문자로 이 명함을 보냅니다'); return; }
    var s={title:(d.brand?d.brand+' ':'')+(d.title?d.title+' ':'')+(d.name||'')+' · 디지털 명함',url:d.url};
    if(navigator.share){ navigator.share(s).catch(function(){}); return; }
    try{ navigator.clipboard.writeText(d.url).then(function(){ toast('링크를 복사했습니다 · 카카오톡이나 문자 창에 붙여넣기 하세요'); }); }catch(x){ toast(d.url); } });
  return el; }
function theme(el,th){ var c=el.querySelector('.lk'); if(c) c.className='lk '+(th==='lt'?'lt':'dk'); }
window.LookCard={render:render,theme:theme,vcf:vcf,IC:IC};
})();

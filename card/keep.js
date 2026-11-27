/* [우리이야기] card/keep.js · v1 · 261128 · 디지털 명함 「명함 이미지 저장 · 링크 복사 · 디지털 명함 사용법」 한 덩어리
   대표 OK 11월 28일 8시 42분(시안 https://claude.ai/artifact/AeH8YHAQpMdGK5A231KMmr) · 무료 명함(404.html)과 주문 제작 명함(card/look)이 함께 부름
   쓰는 법: CardKeep.mount(단추 자리, {co,name,title,one,tel,web,url,no,col}, 사용법 자리) · 사용법 자리를 안 주면 단추 아래에 붙음  · QR 은 /card/qrcode.js 를 먼저 불러 둠(없으면 QR 없이 그림)
   그림: 가로 9 세로 5 · 1080×600 PNG · 이름 · 직함 · 상호 · 전화 · 홈페이지 · QR · 짧은 주소 · 서버에 묻지 않음 */
(function(){
var CSS='.ck{padding:4px 14px 6px}.ck *{box-sizing:border-box}'+
'.ck-b{display:grid;grid-template-columns:1fr 1fr;gap:8px}'+
'.ck-b button{display:block;width:100%;text-align:center;border:1.5px solid #1E4A76;background:#fff;color:#1E4A76;border-radius:12px;padding:12px 6px;font:inherit;font-size:15.5px;font-weight:700;cursor:pointer;min-height:48px}'+
'.ck details{border:1px solid #ECE4D8;border-radius:12px;margin-top:12px;background:#fff;color:#2E3A46}'+
'.ck summary{cursor:pointer;padding:13px 14px;font-weight:700;font-size:15.5px;list-style:none;display:flex;justify-content:space-between;align-items:center;min-height:48px}'+
'.ck summary::-webkit-details-marker{display:none}'+
'.ck summary::after{content:"펼치기";font-size:12.5px;font-weight:700;color:#1E4A76;border:1px solid #C8D3E0;border-radius:14px;padding:2px 10px}'+
'.ck details[open] summary::after{content:"접기"}'+
'.ck-d{padding:0 14px 12px;font-size:14.5px;line-height:1.6}.ck-d h4{margin:12px 0 4px;font-size:14.5px;color:#1E4A76}.ck-d p{margin:4px 0}.ck-d ol{margin:4px 0;padding-left:20px}.ck-d li{margin:2px 0}'+
'.ck-t{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:6px}.ck-t button{border:0;border-radius:10px;padding:9px;font:inherit;font-size:14.5px;font-weight:700;background:#F0EBE3;color:#5C636B;cursor:pointer}.ck-t button.on{background:#1E4A76;color:#fff}'+
'.ck-o{position:fixed;inset:0;background:rgba(20,28,36,.82);display:none;align-items:center;justify-content:center;z-index:60;padding:18px}.ck-o.on{display:flex}'+
'.ck-o div{background:#fff;border-radius:16px;padding:14px;max-width:440px;width:100%;color:#2E3A46;font-size:14.5px;text-align:center}.ck-o img{width:100%;border-radius:8px;box-shadow:0 4px 14px rgba(0,0,0,.2);display:block;margin-bottom:10px}'+
'.ck-o button{margin-top:10px;border:0;border-radius:12px;background:#1E4A76;color:#fff;font:inherit;font-weight:700;font-size:15.5px;padding:12px;width:100%;min-height:48px;cursor:pointer}'+
'.lk .ck-b button{background:transparent;color:var(--ic);border-color:var(--ic)}.lk .ck details{background:var(--box);border-color:var(--ln);color:var(--fg)}.lk .ck-d h4{color:var(--or)}.lk .ck summary::after{color:var(--or);border-color:var(--ln)}.lk .ck-t button{background:var(--bg);color:var(--sub)}.lk .ck-t button.on{background:#1E4A76;color:#fff}.lk .ck{padding:14px 16px 0}'+
'.ck-m{position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#2E3A46;color:#fff;border-radius:12px;padding:12px 16px;font-size:15px;opacity:0;transition:opacity .2s;pointer-events:none;max-width:90vw;z-index:61;text-align:center}.ck-m.on{opacity:1}';
function esc(v){ return String(v==null?'':v).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
var UA=navigator.userAgent||'', IOS=/iPhone|iPad|iPod/i.test(UA), KAKAO=/KAKAOTALK/i.test(UA);
function say(t){ var m=document.querySelector('.ck-m'); if(!m){ m=document.createElement('div'); m.className='ck-m'; document.body.appendChild(m); } m.textContent=t; m.className='ck-m on'; clearTimeout(m._t); m._t=setTimeout(function(){ m.className='ck-m'; },2600); }
function outside(){ var here=location.href; if(/Android/i.test(UA)){ location.href='intent://'+here.replace(/^https:\/\//,'')+'#Intent;scheme=https;package=com.android.chrome;end'; } else { location.href='kakaotalk://web/openExternal?url='+encodeURIComponent(here); } }
function fit(x,t,max,size,w){ var s=size; x.font=w+' '+s+'px '+F; while(s>18&&x.measureText(t).width>max){ s-=2; x.font=w+' '+s+'px '+F; } return s; }
var F='-apple-system,"Apple SD Gothic Neo","Noto Sans KR","Malgun Gothic",sans-serif';
function draw(d){
  var W=1080,H=600,c=document.createElement('canvas'); c.width=W; c.height=H; var x=c.getContext('2d'), col=d.col||'#1E4A76';
  x.fillStyle='#fff'; x.fillRect(0,0,W,H); x.fillStyle=col; x.fillRect(0,0,22,H);
  var QS=d.url&&window.qrcode?190:0, TX=QS?W-QS-140:W-120;
  x.textBaseline='alphabetic';
  if(d.co){ fit(x,d.co,TX,32,'700'); x.fillStyle=col; x.fillText(d.co,80,96); }
  fit(x,d.name||'',TX,76,'900'); x.fillStyle='#222'; x.fillText(d.name||'',80,236);
  if(d.title){ fit(x,d.title,TX,32,'400'); x.fillStyle='#555'; x.fillText(d.title,80,290); }
  if(d.one){ fit(x,d.one,TX,24,'400'); x.fillStyle='#666'; x.fillText(d.one,80,334); }
  x.fillStyle='#333'; var y=460; [d.tel,d.web].forEach(function(t){ if(t){ fit(x,t,TX,28,'400'); x.fillText(t,80,y); y+=44; } });
  if(QS){ try{ var q=qrcode(0,'M'); q.addData(d.url); q.make(); var n=q.getModuleCount(), cell=QS/n, qx=W-QS-60, qy=H-QS-84;
    for(var r=0;r<n;r++){ for(var k=0;k<n;k++){ if(q.isDark(r,k)){ x.fillStyle='#111'; x.fillRect(qx+k*cell,qy+r*cell,Math.ceil(cell),Math.ceil(cell)); } } }
    x.fillStyle='#777'; x.font='400 20px '+F; x.textAlign='center'; x.fillText('비추면 명함이 열립니다',qx+QS/2,qy+QS+36); x.textAlign='left'; }catch(e){} }
  x.fillStyle='#999'; x.font='400 18px '+F; x.fillText('사랑흐름 디지털 명함'+(d.url?' · '+d.url.replace(/^https?:\/\//,'').replace(/\/$/,''):''),80,H-28);
  return c;
}
function save(d){
  if(KAKAO){ say('카카오톡 안에서는 저장이 안 되어 기본 브라우저로 엽니다'); setTimeout(outside,900); return; }
  var c=draw(d), fn=(d.name||'명함')+' 디지털 명함.png', o=document.querySelector('.ck-o');
  o.querySelector('img').src=c.toDataURL('image/png');
  o.querySelector('p').textContent=IOS?'아래 창에서 「이미지 저장」을 누르면 사진 앨범에 들어갑니다. 창이 안 뜨면 그림을 길게 눌러 「사진에 저장」을 누르세요.':'갤러리(다운로드 폴더)에 저장했습니다. 안 보이면 그림을 길게 눌러 「이미지 저장」을 누르세요.';
  o.className='ck-o on';
  c.toBlob(function(b){ if(!b){ return; }
    var f=null; try{ f=new File([b],fn,{type:'image/png'}); }catch(e){}
    if(IOS&&f&&navigator.canShare&&navigator.canShare({files:[f]})){ navigator.share({files:[f]}).catch(function(){}); return; }
    var a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download=fn; document.body.appendChild(a); a.click(); setTimeout(function(){ URL.revokeObjectURL(a.href); a.remove(); },1500);
  },'image/png');
}
function copy(u){ function ok(){ say('링크를 복사했습니다 · 메모장이나 문자에 붙여 넣으세요'); }
  try{ navigator.clipboard.writeText(u).then(ok,function(){ fb(); }); }catch(e){ fb(); }
  function fb(){ var t=document.createElement('textarea'); t.value=u; t.style.position='fixed'; t.style.opacity='0'; document.body.appendChild(t); t.select(); try{ document.execCommand('copy'); ok(); }catch(e){ say(u); } t.remove(); } }
var GUIDE='<details><summary>디지털 명함 사용법</summary><div class="ck-d">'+
'<h4>휴대폰 홈 화면에 두기</h4><p><b>카톡에서 여셨으면 먼저</b> 오른쪽 위 ⋮ 를 누르고 「다른 브라우저로 열기」</p>'+
'<div class="ck-t"><button type="button" data-ck="g" class="on">갤럭시</button><button type="button" data-ck="i">아이폰</button></div>'+
'<ol data-ckl="g"><li>삼성 인터넷은 오른쪽 아래 ≡, 크롬은 오른쪽 위 ⋮ 누르기</li><li>「현재 페이지 추가」 또는 「홈 화면에 추가」 누르기</li><li>「홈 화면」 고르고 「추가」</li><li>바탕화면에 명함 아이콘이 생깁니다</li></ol>'+
'<ol data-ckl="i" hidden><li>사파리로 엽니다</li><li>아래 가운데 공유 단추 누르기</li><li>「홈 화면에 추가」 누르기</li><li>오른쪽 위 「추가」</li></ol>'+
'<h4>전화번호부에 넣기</h4><p>「연락처 저장」을 누르면 이름 · 전화 · 상호와 명함 주소가 함께 들어갑니다. 전화번호부에서 이름을 누르면 명함 주소가 보입니다.</p>'+
'<h4>앨범에 남기기</h4><p>「명함 이미지 저장」을 누르면 명함 한 장이 앨범에 들어갑니다. 그림 속 QR을 카메라로 비추면 명함이 다시 열립니다.</p>'+
'<h4>메모장에 붙이기</h4><p>「링크 복사」를 누르고 메모장이나 문자에 붙여 넣습니다.</p>'+
'<h4>카톡 「나와의 채팅」에 두기</h4><p>「내 명함 보내기」에서 카카오톡을 고르고 「나와의 채팅」으로 보내 두면 찾기 쉽습니다.</p>'+
'</div></details>';
window.CardKeep={draw:draw,mount:function(el,d,gel){
  if(!el){ return; }
  if(!document.getElementById('ckcss')){ var s=document.createElement('style'); s.id='ckcss'; s.textContent=CSS; document.head.appendChild(s); }
  if(!document.querySelector('.ck-o')){ var o=document.createElement('div'); o.className='ck-o'; o.innerHTML='<div><img alt="명함 이미지"><p></p><button type="button">닫기</button></div>'; o.onclick=function(e){ if(e.target===o||e.target.tagName==='BUTTON'){ o.className='ck-o'; } }; document.body.appendChild(o); }
  el.className='ck'; el.innerHTML='<div class="ck-b"><button type="button" data-ka="img">명함 이미지 저장</button><button type="button" data-ka="copy">링크 복사</button></div>'+(gel?'':GUIDE); if(gel){ gel.className='ck'; gel.innerHTML=GUIDE; }
  el.querySelector('[data-ka=img]').onclick=function(){ save(d); };
  el.querySelector('[data-ka=copy]').onclick=function(){ copy(d.url||location.href); };
  var ge=gel||el; [].forEach.call(ge.querySelectorAll('[data-ck]'),function(b){ b.onclick=function(){ [].forEach.call(ge.querySelectorAll('[data-ck]'),function(z){ z.className=z===b?'on':''; }); [].forEach.call(ge.querySelectorAll('[data-ckl]'),function(l){ l.hidden=l.getAttribute('data-ckl')!==b.getAttribute('data-ck'); }); }; });
}};
})();

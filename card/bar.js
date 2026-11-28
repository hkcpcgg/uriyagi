/* [우리이야기] card/bar.js · v1 · 261128 · 명함 쪽 모든 화면 위 띠 「‹ 뒤로 · 만들기 · 내 명함 · 전시관」(흐름도 시안 대표 OK 11월 28일 11시 22분)
   쓰는 법: 화면 맨 아래에 <script src="/card/bar.js?v=1" defer></script> 한 줄 · 몸 맨 앞에 저절로 붙음
   명함 화면(/card/C 번호/)에서는 「내 명함」을 카카오로 들어온 주인(명함 열쇠 uri_card_ck)에게만 보임
   뒤로: 같은 사이트에서 왔으면 앞 화면 · 바깥(카톡 등)에서 바로 열었으면 명함 입구(/card/) */
(function(){
  if(document.getElementById('cbar')){ return; }
  var P=location.pathname, isCard=/^\/card\/C-\d+\/?$/i.test(P), ck='';
  try{ ck=localStorage.getItem('uri_card_ck')||''; }catch(e){}
  var L=[['만들기','/card/',/^\/card\/(index\.html)?$|^\/card\/(new|order)\//],['내 명함','/card/my/',/^\/card\/my\//],['전시관','/card/hall/',/^\/card\/hall\//]];
  if(isCard&&!ck){ L.splice(1,1); }
  var css='#cbar{position:relative;z-index:30;background:#1E4A76;color:#fff;font-family:-apple-system,"Apple SD Gothic Neo","Noto Sans KR","Malgun Gothic",sans-serif}'+
  '#cbar div{max-width:560px;margin:0 auto;display:flex;align-items:center;gap:2px;padding:0 6px;height:44px}'+
  '#cbar a{color:#fff;text-decoration:none;font-size:14.5px;font-weight:700;padding:8px 11px;border-radius:18px;white-space:nowrap;opacity:.88}'+
  '#cbar a.on{background:rgba(201,169,110,.28);color:#F3E6CC;opacity:1}'+
  '#cbar a.bk{font-size:15px;padding:8px 10px 8px 6px;margin-right:auto;opacity:1}'+
  '#cbar a:focus-visible{outline:2px solid #C9A96E;outline-offset:1px}';
  var s=document.createElement('style'); s.textContent=css; document.head.appendChild(s);
  var nav=document.createElement('nav'); nav.id='cbar'; nav.setAttribute('aria-label','디지털 명함');
  var h='<div><a class="bk" href="/card/" id="cbBk">‹ 뒤로</a>';
  L.forEach(function(x){ h+='<a href="'+x[1]+'"'+(x[2].test(P)?' class="on" aria-current="page"':'')+'>'+x[0]+'</a>'; });
  nav.innerHTML=h+'</div>';
  document.body.insertBefore(nav,document.body.firstChild);
  document.getElementById('cbBk').onclick=function(e){
    var same=false; try{ same=document.referrer&&new URL(document.referrer).host===location.host; }catch(x){}
    if(same&&history.length>1){ e.preventDefault(); history.back(); }
  };
})();

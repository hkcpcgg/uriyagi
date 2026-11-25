(function(){
[].forEach.call(document.querySelectorAll('[data-s]'),function(x){ x.onclick=function(ev){ ev.preventDefault(); var t=document.getElementById('stt'); t.hidden=false; clearTimeout(t._h); t._h=setTimeout(function(){ t.hidden=true; },2200); }; });
var b=document.getElementById('hsb'); if(b){ b.onclick=function(){ var x=document.getElementById('hsx'); x.hidden=!x.hidden; }; }
/* 이야기 방 공개 사진 — 열 때마다 /room/방번호/ 에서 읽음 · 이 휴대폰이 지난번에 본 것과 견줘 「새 소식 ○」 */
var ph=document.getElementById('ph'); if(!ph){ return; } var C=ph.getAttribute('data-room'); if(!C){ ph.innerHTML='<div class="emp">새 소식은 이야기 방에 올린 사진이 이 자리에 보입니다</div>'; return; }
var KEY='uri_home_seen_'+C, seen=[]; try{ seen=JSON.parse(localStorage.getItem(KEY)||'[]'); }catch(e){}
function draw(list){ var u=[],s={}; list.forEach(function(x){ if(!s[x]){ s[x]=1; u.push(x); } });
  ph.innerHTML=u.length?u.slice(0,9).map(function(x){ return '<a href="https://uriyagi.kr/?c='+C+'"><img src="'+x+'" alt="" loading="lazy"></a>'; }).join(''):'<div class="emp">아직 올린 사진이 없습니다</div>';
  if(seen.length){ var n=u.filter(function(x){ return seen.indexOf(x)<0; }).length; var el=document.getElementById('newn'); if(el&&n){ el.textContent='새 소식 '+n; el.hidden=false; } }
  try{ localStorage.setItem(KEY,JSON.stringify(u.slice(0,60))); }catch(e){} }
var re=new RegExp('https://kr\\.object\\.ncloudstorage\\.com/uriyagi-photo/s/'+C+'/R-\\d+\\.jpg','g');
try{ fetch('/room/'+C+'/',{cache:'no-cache'}).then(function(r){ return r.text(); }).then(function(t){ draw(t.match(re)||[]); }).catch(function(){ draw([]); }); }catch(e){ draw([]); }
})();

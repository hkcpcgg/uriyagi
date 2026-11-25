/* [우리이야기] card/dock.js · v1 · 261125 — 바닥 고정 띠(.dock)가 맨 아래 푸터 · 단추를 가리지 않게 띠 높이만큼 아래를 비움 · 오른쪽 세로 단추(.rail · 위쪽에 붙음)는 푸터와 겹칠 때만 숨김 · 무료 명함(404)은 그림이 늦게 그려져 기다렸다 붙임 */
(function(){
  var tries=0;
  function go(){ var d=document.querySelector('.dock'), pg=document.querySelector('.pg'); if(!d||!pg){ if(++tries<40){ setTimeout(go,150); } return; }
    function pad(){ pg.style.paddingBottom=(d.offsetHeight+16)+'px'; } pad(); window.addEventListener('resize',pad); setTimeout(pad,800); setTimeout(pad,2500);
    try{ new ResizeObserver(pad).observe(d); }catch(e){}
    var r=document.querySelector('.rail'), ft=document.querySelector('footer');
    if(r&&ft){ r.style.transition='opacity .2s'; var chk=function(){ var hit=ft.getBoundingClientRect().top<r.getBoundingClientRect().bottom+8; r.style.opacity=hit?'0':''; r.style.pointerEvents=hit?'none':''; }; window.addEventListener('scroll',chk,{passive:true}); window.addEventListener('resize',chk); chk(); setTimeout(chk,900); } }
  if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded',go); } else { go(); }
})();

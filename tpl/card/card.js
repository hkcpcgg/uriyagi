(function(){
var ua=navigator.userAgent||'', kakao=/KAKAOTALK/i.test(ua), android=/Android/i.test(ua), ios=/iPhone|iPad|iPod/i.test(ua);
function toast(b,p){ var t=document.getElementById('toast'); document.getElementById('tB').textContent=b; document.getElementById('tP').textContent=p||''; t.className='on'; }
window.cardToast=toast; document.getElementById('tX').onclick=function(){ document.getElementById('toast').className=''; };
[].forEach.call(document.querySelectorAll('[data-s]'),function(x){ x.addEventListener('click',function(ev){ ev.preventDefault(); toast('견본입니다','실제 명함에서는 이 단추가 바로 연결됩니다'); }); });
/* 카톡 안에서는 파일 받기가 막히는 일이 있어 휴대폰 기본 앱으로 넘겨 엶 */
document.getElementById('save').addEventListener('click',function(e){ if(!kakao){ return; } e.preventDefault();
  if(android){ location.href='intent://'+CARD_VCF.replace(/^https:\/\//,'')+'#Intent;scheme=https;package=com.android.chrome;end'; }
  else if(ios){ location.href='kakaotalk://web/openExternal?url='+encodeURIComponent(CARD_VCF); } else { location.href=CARD_VCF; } });
document.getElementById('share').addEventListener('click',function(){ var d={title:CARD_TITLE,url:CARD_URL};
  if(navigator.share){ navigator.share(d).catch(function(){}); return; }
  try{ navigator.clipboard.writeText(CARD_URL).then(function(){ toast('링크를 복사했습니다','카카오톡이나 문자 대화창에 붙여넣기 하세요'); }); }catch(x){ toast('이 링크를 보내 주세요',CARD_URL); } });
})();

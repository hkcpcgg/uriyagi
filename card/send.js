/* [우리이야기] card/send.js · v3 · 261123 · 대표 19:34 — 「연락처 저장」 누르면 휴대폰별 저장 안내 · 내 명함이 없을 때 인사 문자만 보내지 않고 먼저 물음(무료로 만들기 / 인사 문자만) · (v2) 日本語 더함 · (v1) · 「명함 보내기」 — 받은 명함 자리에서 내 명함을 그 명함 주인 휴대폰으로 문자로 바로 보냄(대표 OK 14:54)
   + 이 휴대폰이 기억한 내 명함(localStorage uri_my_card)이 있으면 그 주소를 실어 보냄
   + 내 명함 주인이 처음 한 번 `내명함주소?me=1` 로 열면 이 휴대폰이 내 명함으로 기억
   + 내 명함을 내가 보고 있으면 휴대폰 공유 창(아무에게나 보내기)
   + 내 명함이 없으면 인사 문자만(무료 만들기가 열리면 그리로 이음)
   단추: <a id="send" data-card="C-1001" data-tel="010..." data-name="황규찬"> */
(function(){
var KEY='uri_my_card';
var W={
 ko:{body1:'명함 잘 받았습니다. 제 명함 보내 드립니다. ',body0:'명함 잘 받았습니다.',me:'내 명함으로 기억했습니다',me2:'이제 다른 분 명함에서 「명함 보내기」를 누르면 이 명함이 문자로 바로 갑니다.',cp:'링크를 복사했습니다',cp2:'카카오톡이나 문자 대화창을 열고 길게 눌러 「붙여넣기」 하세요'},
 en:{body1:'Thank you for your card. Here is mine: ',body0:'Thank you for your card.',me:'Saved as my card',me2:'Now tap “Send My Card” on any card and this card goes by text message right away.',cp:'Link copied',cp2:'Open a chat or message, press and hold, then paste'},
 ja:{body1:'名刺をいただきありがとうございます。私の名刺をお送りします：',body0:'名刺をいただきありがとうございます。',me:'自分の名刺として保存しました',me2:'他の方の名刺で「名刺を送る」を押すと、この名刺がすぐにメッセージで送られます。',cp:'リンクをコピーしました',cp2:'トークやメッセージを開き、長押しして貼り付けてください'},
 zh:{body1:'已收到您的名片，这是我的名片：',body0:'已收到您的名片。',me:'已设为我的名片',me2:'在任何名片上点击「发送名片」，即可通过短信立即发送此名片。',cp:'链接已复制',cp2:'打开聊天窗口，长按后粘贴'}
};
function lg(){ var l=(document.documentElement.lang||'ko').slice(0,2); return W[l]?l:'ko'; }
function t(k){ return W[lg()][k]; }
function getMy(){ try{ return JSON.parse(localStorage.getItem(KEY)||'null'); }catch(e){ return null; } }
function setMy(o){ try{ localStorage.setItem(KEY,JSON.stringify(o)); }catch(e){} }
function say(a,b){ if(window.cardToast){ window.cardToast(a,b); } else { alert(a+(b?'\n'+b:'')); } }
var btn=document.getElementById('send'); if(!btn){ return; }
var here=btn.getAttribute('data-card'), url='https://uriyagi.kr/card/'+here+'/';
var tel=(btn.getAttribute('data-tel')||'').replace(/[^0-9+]/g,'');
try{ if(new URLSearchParams(location.search).get('me')==='1'){ setMy({c:here,u:url,n:btn.getAttribute('data-name')||''}); say(t('me'),t('me2')); } }catch(e){}
btn.addEventListener('click',function(e){
  e.preventDefault();
  var my=getMy();
  if(my&&my.c===here){
    if(navigator.share){ navigator.share({url:url}).catch(function(){}); return; }
    try{ navigator.clipboard.writeText(url).then(function(){ say(t('cp'),t('cp2')); }); }catch(x){ say(url); }
    return;
  }
  if(!(my&&my.u)&&lg()==='ko'){ noCard(); return; }
  sms(my&&my.u?t('body1')+my.u:t('body0'));
});
function sms(body){ var ios=/iPhone|iPad|iPod/i.test(navigator.userAgent||''); location.href='sms:'+tel+(ios?'&':'?')+'body='+encodeURIComponent(body); }
/* ★v3 내 명함이 아직 이 휴대폰에 없을 때 */
function sheet(html){ var d=document.createElement('div'); d.setAttribute('style','position:fixed;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:flex-end;justify-content:center;z-index:50'); d.innerHTML='<div style="background:#fff;width:100%;max-width:480px;border-radius:18px 18px 0 0;padding:20px 18px calc(18px + env(safe-area-inset-bottom));font-family:inherit">'+html+'</div>'; d.addEventListener('click',function(e){ if(e.target===d||e.target.getAttribute('data-x')){ d.remove(); } }); document.body.appendChild(d); return d; }
var B='display:block;width:100%;margin-top:10px;border-radius:12px;padding:14px;font:inherit;font-size:16.5px;font-weight:700;text-align:center;text-decoration:none;border:0;cursor:pointer;';
function noCard(){ var d=sheet('<b style="display:block;font-size:19px;color:#1E4A76">이 휴대폰에 아직 내 명함이 없습니다</b><p style="margin:8px 0 4px;font-size:15px;color:#444;line-height:1.5">종이 명함을 찍으면 1분이면 내 디지털 명함이 생기고, 그 뒤로는 이 단추를 누르면 내 명함이 바로 갑니다.</p>'+
  '<a href="/card/new/" style="'+B+'background:#E8771E;color:#fff">무료로 내 명함 만들기</a>'+
  '<button type="button" id="snHi" style="'+B+'background:#fff;color:#1E4A76;border:1.5px solid #1E4A76">인사 문자만 보내기</button>'+
  '<p style="margin:12px 0 0;font-size:12.5px;color:#777;line-height:1.5">이미 디지털 명함이 있으시면, 내 명함을 이 휴대폰에서 한 번 열고 맨 아래 「이 휴대폰의 내 명함으로」를 눌러 주세요.</p>'+
  '<button type="button" data-x="1" style="'+B+'background:#f3f3f3;color:#555">닫기</button>');
  d.querySelector('#snHi').onclick=function(){ d.remove(); sms(t('body0')); }; }
/* ★v3 이 명함 주인이 「이 휴대폰의 내 명함으로」 기억 */
(function(){ var pad=btn.parentNode; if(!pad||document.getElementById('snMe')){ return; } var my=getMy(); var a=document.createElement('a'); a.id='snMe'; a.href='#'; a.setAttribute('style','display:block;text-align:center;font-size:12.5px;color:#8a8378;margin:2px 0 6px;text-decoration:underline;grid-column:1/-1'); a.textContent=(my&&my.c===here)?'✓ 이 휴대폰의 내 명함':'이 휴대폰의 내 명함으로'; a.onclick=function(e){ e.preventDefault(); setMy({c:here,u:url,n:btn.getAttribute('data-name')||''}); a.textContent='✓ 이 휴대폰의 내 명함'; say(t('me'),t('me2')); }; if(lg()==='ko'){ pad.appendChild(a); } })();
/* ★v3 연락처 저장 안내 — 받은 파일이 어디로 가는지 */
(function(){ var sv=document.getElementById('save'); if(!sv||lg()!=='ko'){ return; } sv.addEventListener('click',function(){ var ua=navigator.userAgent||'', ios=/iPhone|iPad|iPod/i.test(ua), and=/Android/i.test(ua);
  setTimeout(function(){ say('연락처 저장', ios?'화면에 뜨는 연락처 카드에서 「새로운 연락처 생성」을 누르면 아이폰 연락처에 저장됩니다.':and?'화면 아래(또는 알림)에 뜨는 받은 파일을 누르면 연락처 앱이 열립니다. 저장할 곳(구글 계정 등)을 고르고 「저장」을 누르세요. 네이버 주소록은 휴대폰 연락처와 맞춤(동기화)을 켜 두시면 함께 들어갑니다.':'받은 연락처 파일(.vcf)을 열면 연락처에 저장됩니다.'); },1200); }); })();
})();

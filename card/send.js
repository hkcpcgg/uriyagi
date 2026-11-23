/* [우리이야기] card/send.js · v1 · 261123 · 「명함 보내기」 — 받은 명함 자리에서 내 명함을 그 명함 주인 휴대폰으로 문자로 바로 보냄(대표 OK 14:54)
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
  var body=my&&my.u?t('body1')+my.u:t('body0');
  var ios=/iPhone|iPad|iPod/i.test(navigator.userAgent||'');
  location.href='sms:'+tel+(ios?'&':'?')+'body='+encodeURIComponent(body);
});
})();

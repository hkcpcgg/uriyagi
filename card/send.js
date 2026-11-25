/* [우리이야기] card/send.js · v5 · 261125 · 「이 휴대폰의 내 명함으로」 단추 뺌(손님 모두에게 보일 필요 없음 · 말이 어려움) · 내 명함 기억은 ?me=1 로만 · (v4) 261123 · 대표 19:55 — 누가 누구에게 보내는지 분명히 · 정중한 회신 글 · 내 명함 없어도 이름을 적어 인사 + 무료 디지털 명함 주소를 함께 보냄 · 연락처 저장 방법 안내(이 휴대폰 · QR 로 옆 휴대폰) · (v3) 대표 19:34 — 「연락처 저장」 누르면 휴대폰별 저장 안내 · 내 명함이 없을 때 인사 문자만 보내지 않고 먼저 물음(무료로 만들기 / 인사 문자만) · (v2) 日本語 더함 · (v1) · 「명함 보내기」 — 받은 명함 자리에서 내 명함을 그 명함 주인 휴대폰으로 문자로 바로 보냄(대표 OK 14:54)
   + 이 휴대폰이 기억한 내 명함(localStorage uri_my_card)이 있으면 그 주소를 실어 보냄
   + 내 명함 주인이 처음 한 번 `내명함주소?me=1` 로 열면 이 휴대폰이 내 명함으로 기억
   + 내 명함을 내가 보고 있으면 휴대폰 공유 창(아무에게나 보내기)
   + 내 명함이 없으면 인사 문자만(무료 만들기가 열리면 그리로 이음)
   단추: <a id="send" data-card="C-1001" data-tel="010..." data-name="황규찬"> */
(function(){
var KEY='uri_my_card';
var W={
 ko:{body1:'명함 잘 받았습니다. 제 명함 보내 드립니다. ',body0:'명함 잘 받았습니다.',me:'내 명함으로 기억했습니다',me2:'이제 다른 분 명함에서 「내 명함 보내기」를 누르면 이 명함이 문자로 바로 갑니다.',cp:'링크를 복사했습니다',cp2:'카카오톡이나 문자 대화창을 열고 길게 눌러 「붙여넣기」 하세요'},
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
  if(lg()==='ko'){ sms(koMsg(my.u,'')); return; }
  sms(my&&my.u?t('body1')+my.u:t('body0'));
});
function sms(body){ var ios=/iPhone|iPad|iPod/i.test(navigator.userAgent||''); location.href='sms:'+tel+(ios?'&':'?')+'body='+encodeURIComponent(body); }
/* ★v3 내 명함이 아직 이 휴대폰에 없을 때 */
function sheet(html){ var d=document.createElement('div'); d.setAttribute('style','position:fixed;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:flex-end;justify-content:center;z-index:50'); d.innerHTML='<div style="background:#fff;width:100%;max-width:480px;border-radius:18px 18px 0 0;padding:20px 18px calc(18px + env(safe-area-inset-bottom));font-family:inherit">'+html+'</div>'; d.addEventListener('click',function(e){ if(e.target===d||e.target.getAttribute('data-x')){ d.remove(); } }); document.body.appendChild(d); return d; }
var B='display:block;width:100%;margin-top:10px;border-radius:12px;padding:14px;font:inherit;font-size:16.5px;font-weight:700;text-align:center;text-decoration:none;border:0;cursor:pointer;';
var OWN=btn.getAttribute('data-name')||'';
function koMsg(myUrl,meName){ return '[명함 회신] '+(OWN?OWN+'님, ':'')+'보내 주신 디지털 명함 잘 받았습니다.'+(myUrl?' 제 명함도 보내 드립니다.\n'+myUrl:(meName?' 저는 '+meName+'입니다.':''))+'\n반갑습니다.'+(myUrl?'':'\n\n(디지털 명함 무료 만들기 https://uriyagi.kr/card/new/)'); }
function noCard(){ var nm=''; try{ nm=localStorage.getItem('uri_my_name')||''; }catch(e){}
  var d=sheet('<b style="display:block;font-size:19px;color:#1E4A76">'+(OWN?esc(OWN)+'님께 ':'')+'명함 회신 보내기</b><p style="margin:8px 0 4px;font-size:15px;color:#444;line-height:1.5">문자는 <b>'+(OWN?esc(OWN)+'님':'이 명함 주인')+'</b> 휴대폰으로 갑니다. 이 휴대폰에는 아직 내 디지털 명함이 없어, 이름과 소속을 적어 정중한 인사와 함께 보냅니다.</p>'+
  '<input id="snNm" value="'+esc(nm)+'" placeholder="예: 사랑흐름 대표 황규찬" style="width:100%;box-sizing:border-box;margin-top:8px;font:inherit;font-size:16px;border:1px solid #ddd;border-radius:10px;padding:11px">'+
  '<button type="button" id="snHi" style="'+B+'background:#C9A96E;color:#2E3A46">인사와 함께 보내기</button>'+
  '<a href="/card/new/" style="'+B+'background:#fff;color:#1E4A76;border:1.5px solid #1E4A76">먼저 내 디지털 명함 만들기 (무료)</a>'+
  '<p style="margin:12px 0 0;font-size:12.5px;color:#777;line-height:1.5">보내는 글: 「[명함 회신] '+(OWN?esc(OWN)+'님, ':'')+'보내 주신 디지털 명함 잘 받았습니다. 저는 ○○입니다. 반갑습니다.」 와 무료 디지털 명함 주소. 이미 디지털 명함이 있으시면 「내 명함」 화면(uriyagi.kr/card/my/)에서 「보기」를 한 번 눌러 주세요. 그 뒤로는 명함 주소가 함께 갑니다.</p>'+
  '<button type="button" data-x="1" style="'+B+'background:#f3f3f3;color:#555">닫기</button>');
  d.querySelector('#snHi').onclick=function(){ var v=(d.querySelector('#snNm').value||'').trim().slice(0,40); if(!v){ d.querySelector('#snNm').focus(); return; } try{ localStorage.setItem('uri_my_name',v); }catch(e){} d.remove(); sms(koMsg('',v)); }; }
function esc(v){ return String(v||'').replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];}); }
/* ★v3 이 명함 주인이 「이 휴대폰의 내 명함으로」 기억 */
(function(){ var pad=btn.parentNode; if(!pad||document.getElementById('snMe')){ return; } var my=getMy(); var a=document.createElement('a'); a.id='snMe'; a.href='#'; a.setAttribute('style','display:block;text-align:center;font-size:12.5px;color:#8a8378;margin:2px 0 6px;text-decoration:underline;grid-column:1/-1'); a.textContent=(my&&my.c===here)?'✓ 이 휴대폰의 내 명함':'이 휴대폰의 내 명함으로'; a.onclick=function(e){ e.preventDefault(); setMy({c:here,u:url,n:btn.getAttribute('data-name')||''}); a.textContent='✓ 이 휴대폰의 내 명함'; say(t('me'),t('me2')); }; /* ★v5 손님 화면에서 뺌(대표 261125 19:10 「무슨 말이야」) — 내 명함 기억은 만들기 끝 「내 명함 보기」 · 내 명함 관리 「보기」(?me=1)로 저절로 */ })();
/* ★v4 연락처 저장 방법 — 이 휴대폰에 · 옆 휴대폰은 QR(카메라로 찍으면 「연락처 추가」) */
function vcfText(cb){ if(window.cardVcf){ cb(window.cardVcf); return; } var sv=document.getElementById('save'), h=sv&&sv.getAttribute('href'); if(!h||h==='#'){ cb(''); return; } fetch(h).then(function(r){ return r.text(); }).then(cb).catch(function(){ cb(''); }); }
function qrLib(cb){ if(window.qrcode){ cb(); return; } var sc=document.createElement('script'); sc.src='/card/qrcode.js'; sc.onload=cb; sc.onerror=function(){ cb(); }; document.head.appendChild(sc); }
function saveSheet(){ var ua=navigator.userAgent||'', ios=/iPhone|iPad|iPod/i.test(ua), and=/Android/i.test(ua);
  var how=ios?'<li>화면에 연락처 카드가 뜨면 맨 아래 <b>「새로운 연락처 생성」</b>을 누릅니다.</li><li>아이폰 연락처(iCloud)에 저장됩니다.</li>':and?'<li>화면 아래(또는 맨 위 알림)에 뜨는 <b>받은 파일(.vcf)</b>을 누릅니다.</li><li>연락처 앱이 열리면 저장할 곳(<b>구글 계정</b> 권함)을 고르고 <b>「저장」</b>.</li><li>네이버 주소록에도 넣으려면 네이버 앱 주소록에서 「휴대폰 연락처와 동기화」를 켜 두세요.</li>':'<li>받은 연락처 파일(.vcf)을 열면 연락처에 저장됩니다.</li>';
  var d=sheet('<b style="display:block;font-size:19px;color:#1E4A76">연락처 저장 방법</b><p style="margin:10px 0 2px;font-size:15px;font-weight:700;color:#333">① 이 휴대폰에 저장</p><ol style="margin:4px 0 0;padding-left:20px;font-size:14.5px;color:#444;line-height:1.6">'+how+'</ol>'+
    '<p style="margin:14px 0 2px;font-size:15px;font-weight:700;color:#333">② 옆 사람 휴대폰에 바로 넣기 (QR)</p><p style="margin:2px 0 6px;font-size:14px;color:#555;line-height:1.5">옆 분 휴대폰 <b>카메라</b>로 이 QR을 찍으면 「연락처 추가」가 바로 뜹니다.</p><div id="snQr" style="display:flex;justify-content:center;padding:6px 0"><span style="font-size:13px;color:#999">QR 만드는 중…</span></div>'+
    '<button type="button" data-x="1" style="'+B+'background:#f3f3f3;color:#555">닫기</button>');
  vcfText(function(v){ qrLib(function(){ var box=d.querySelector('#snQr'); if(!v||!window.qrcode){ box.innerHTML='<span style="font-size:13px;color:#999">QR을 만들지 못했습니다</span>'; return; } try{ qrcode.stringToBytes=qrcode.stringToBytesFuncs['UTF-8']; var q=qrcode(0,'L'); q.addData(v.replace(/\r?\n/g,'\r\n'),'Byte'); q.make(); box.innerHTML=q.createSvgTag({cellSize:4,margin:2}); var sv0=box.querySelector('svg'); if(sv0){ sv0.setAttribute('style','width:220px;height:220px;background:#fff'); } }catch(e){ box.innerHTML='<span style="font-size:13px;color:#999">QR을 만들지 못했습니다</span>'; } }); }); }
(function(){ var sv=document.getElementById('save'); if(!sv||lg()!=='ko'){ return; } sv.addEventListener('click',function(){ setTimeout(saveSheet,900); }); })();
})();

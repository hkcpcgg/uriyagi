/* [우리이야기] card/howto.js · v1 · 261128 · 「디지털 명함 사용 안내」(card/guide) 글을 화면마다 펼치기로 나눠 씀(대표 11월 28일 11시 23분 「버리지 말고 펼쳐보기로 쓸 데 찾아라」)
   쓰는 법: <div data-howto="loop,mine,faq"></div> 를 두고 <script src="/card/howto.js?v=1" defer></script> · 글을 고칠 때는 이 파일과 card/guide 를 함께 고침
   갈래: loop 돌고 도는 명함 · make 만들기 · open 받은 명함 · keep 간직하기 · give 건네기 · mine 내 명함 · hall 전시관 · home 모바일 홈페이지 · room 우리 이야기 방 · faq 자주 묻는 질문 */
(function(){
var B=function(h,t,c){ return '<a class="hw-go'+(c?' '+c:'')+'" href="'+h+'">'+t+' ›</a>'; };
var UL=function(a){ return '<ul>'+a.map(function(x){ return '<li>'+x+'</li>'; }).join('')+'</ul>'; };
var S={
loop:['명함은 이렇게 돌고 돌아요','<p>디지털 명함은 한 번 건네면 끝나지 않아요. 받은 분이 열어 보고, 마음에 들면 자기 명함을 만들어 또 다른 분께 건넵니다.</p><div class="hw-ring"><a href="/card/guide/#s3"><b>받아요</b>카톡 · 문자 · QR</a><a href="/card/guide/#s3"><b>열어 봐요</b>전화 · 길찾기 · 홈페이지</a><a href="/card/"><b>만들어요</b>나도 디지털 명함 만들기</a><a href="/card/my/"><b>내 명함이 생겨요</b>확정하면 바로 주소와 QR</a><a href="/card/guide/#s5"><b>건네요</b>카톡 · 문자 · 링크 · 이미지</a><a href="/card/hall/"><b>전시관에 올려요</b>여러 분께 알려요</a></div>'],
make:['명함 만들기',UL(['내 종이 명함 그대로 · 무료 · 찍어 올리면 글자를 읽어 칸에 넣어 드려요','새로 꾸미는 명함 · 주문 제작 · 얼굴 · 가게 사진 · 소개 · 링크 · 지도까지','선물 명함 · 소중한 분의 명함을 대신 만들어 선물해요'])+B('/card/new/','무료로 만들기','org')+B('/card/order/','주문 제작하기','navy')],
open:['받은 명함 열어 보기',UL(['명함 위 동그라미 단추를 누르면 바로 전화가 걸리고 길찾기 · 홈페이지 · 이메일이 열려요','「연락처 저장」을 누르면 이름 · 전화 · 상호가 휴대폰 연락처에 한 번에 들어가요','카톡 안에서 여셨다면 저장할 때 휴대폰 기본 브라우저로 넘어가요'])],
keep:['받은 명함 간직하기',UL(['휴대폰 홈 화면에 두기 · 카톡에서 여셨으면 오른쪽 위 ⋮ 「다른 브라우저로 열기」 뒤, 메뉴에서 「홈 화면에 추가」','전화번호부에 넣기 · 「연락처 저장」을 누르면 명함 주소도 함께 들어가요','앨범에 남기기 · 「명함 이미지 저장」 그림 속 QR을 비추면 명함이 다시 열려요','메모장에 붙이기 · 「링크 복사」','카톡 「나와의 채팅」에 보내 두기'])+B('/card/guide/#s4','갤럭시 · 아이폰 차례','ln')],
give:['내 명함 건네기',UL(['「내 명함 보내기」 · 카톡이나 문자로 바로 보내요','「링크 복사」 · 단체방 · 메일 · 블로그 어디든 붙여 넣어요','「명함 이미지 저장」 · 그림 한 장으로 건네요','얼굴을 마주했다면 명함 속 QR을 보여 드리세요'])+'<p>받은 분 명함 아래에는 「나도 디지털 명함 만들기」가 있어요. 그렇게 명함이 다시 돌아요.</p>'],
mine:['내 명함 고치고 관리하기',UL(['카카오로 들어오시면 내가 만든 명함이 모여 있어요','주문 제작 명함은 얼굴 · 가게 사진 · 판 · 글자를 직접 고쳐요','잠시 쉬고 싶으면 「내리기」, 다시 보이려면 「다시 열기」','명함마다 전시관에 올릴지 정해요 · 맨 아래 「내 주문」에서 진행을 확인해요'])+B('/card/my/','내 명함 관리','ln')],
hall:['명함 전시관','<p>여러 분이 올린 디지털 명함을 구경하는 곳이에요. 마음에 드는 모양을 보고 내 명함을 만들어 보세요.</p>'+B('/card/hall/','명함 전시관','ln')],
home:['모바일 홈페이지',UL(['명함과 같은 자료로 휴대폰에 꼭 맞는 홈페이지를 만들어 드려요','주문 제작 명함에 더해 신청해요','동창회 · 운동 모임 · 종친회 · 자동차 영업 · 보험 설계사 같은 견본을 먼저 둘러보세요'])+B('/home/','모바일 홈페이지 견본','ln')],
room:['우리 이야기 방과 함께',UL(['모임 사진을 한 방에 모아 두는 곳이에요','초대 링크를 누르면 바로 그 방으로 들어가요','닫힌 방은 「방 두드리기」를 누르고 방 관리자가 받아 주면 들어가요','방 사진을 보다가 「나도 사진 올리기」로 바로 함께해요'])+B('/guide/','우리 이야기 사용법','ln')],
faq:['자주 묻는 질문','<p><b>무료와 주문 제작은 무엇이 달라요?</b><br>무료는 내 종이 명함 사진을 그대로 쓰고 전화 · 홈페이지 · 길찾기 단추와 연락처 저장 · 내 명함 보내기가 들어가요. 주문 제작은 명함을 새로 꾸며 얼굴 · 가게 사진 · 소개 · 링크 · 지도까지 넣어요.</p><p><b>휴대폰을 바꾸면 명함은요?</b><br>명함은 주소로 열려서 그대로예요. 고칠 때는 새 휴대폰에서 카카오로 들어오시면 돼요.</p><p><b>누가 제 이름으로 명함을 만들었어요</b><br>그 명함 맨 아래 「신고」를 눌러 적어 주세요. 확인하는 동안 가려 둬요.</p><p><b>여러 사람 명함을 한꺼번에 만들 수 있나요?</b><br>가게 · 사업장 · 단체 명함은 준비하고 있어요. 지금은 <a href="https://pf.kakao.com/_ExndxfX/chat" target="_blank" rel="noopener">카카오 채널 ›</a>로 안내해 드려요.</p>']
};
var CSS='.hw{max-width:560px;margin:18px auto 8px;padding:0 14px;color:#2E3A46;font-family:-apple-system,"Apple SD Gothic Neo","Noto Sans KR","Malgun Gothic",sans-serif;line-height:1.6;text-align:left}'+
'.hw h3{margin:0 0 6px;font-size:16px;color:#1E4A76;font-weight:900}'+
'.hw details{border:1px solid #ECE4D8;border-radius:12px;margin-top:8px;background:#fff}'+
'.hw summary{cursor:pointer;padding:12px 14px;font-weight:700;font-size:15.5px;list-style:none;display:flex;justify-content:space-between;align-items:center;min-height:48px}'+
'.hw summary::-webkit-details-marker{display:none}'+
'.hw summary::after{content:"펼치기";font-size:12.5px;font-weight:700;color:#1E4A76;border:1px solid #C8D3E0;border-radius:14px;padding:2px 10px;flex:0 0 auto;margin-left:8px}'+
'.hw details[open] summary::after{content:"접기"}'+
'.hw .hw-b{padding:0 14px 12px;font-size:15px}.hw p{margin:6px 0}.hw a{color:#1E4A76}'+
'.hw ul{margin:6px 0;padding:0;list-style:none}.hw li{padding-left:1.2em;text-indent:-1.2em;margin:4px 0}.hw li::before{content:"+ ";font-weight:900;color:#1E4A76}'+
'.hw-ring{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px}.hw-ring a{display:block;background:#F6F2EB;border-radius:12px;padding:9px 11px;font-size:13.5px;color:#4A525C;text-decoration:none}.hw-ring b{display:block;color:#1E4A76;font-size:14.5px}'+
'.hw-go{display:block;text-align:center;border-radius:12px;padding:11px;margin-top:8px;font-weight:700;text-decoration:none;font-size:15px}.hw-go.navy{background:#1E4A76;color:#fff!important}.hw-go.org{background:#C9A96E;color:#2E3A46!important}.hw-go.ln{border:1.5px solid #1E4A76;background:#fff}'+
'.hw-all{display:block;text-align:right;margin-top:10px;font-size:14px;font-weight:700;text-decoration:underline;text-underline-offset:3px}';
function run(){
  var els=document.querySelectorAll('[data-howto]'); if(!els.length){ return; }
  if(!document.getElementById('hwcss')){ var s=document.createElement('style'); s.id='hwcss'; s.textContent=CSS; document.head.appendChild(s); }
  [].forEach.call(els,function(el){
    var ks=(el.getAttribute('data-howto')||'').split(',').map(function(k){ return k.trim(); }).filter(function(k){ return S[k]; });
    el.className='hw';
    el.innerHTML='<h3>사용 안내</h3>'+ks.map(function(k){ return '<details><summary>'+S[k][0]+'</summary><div class="hw-b">'+S[k][1]+'</div></details>'; }).join('')+'<a class="hw-all" href="/card/guide/">전체 사용 안내 ›</a>';
  });
}
if(document.readyState==='loading'){ document.addEventListener('DOMContentLoaded',run); } else { run(); }
})();

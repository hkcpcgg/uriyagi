/* [우리이야기] card/pay.js · v1 · 261125 — 디지털 명함 주문 제작 결제 상자(대표 21:37 시안 v1 OK)
   사랑흐름 lf/pay-one.js(마음 카드 결제 상자)의 꼴 · 말을 그대로 옮김. 다른 것은 셋:
   + 주문번호는 우리 서버(recCardOrder · ①Code v131)가 만든 것(LF-BCARD|BHOME|BSHOW-12자리)을 씀
   + 승인 뒤 「결제 끝」은 우리 서버 recCardPaid 가 결제 서버에 다시 물어 정함(손님 화면 말을 믿지 않음)
   + 값은 결제 서버 op=price 의 bcard · bhome · bshow · 0(값을 넣기 전)이면 상자를 그리지 않음 = 판매 꺼짐
   쓰는 법: UriPay.render(상자, { item:'bhome', no:'O-0001', oid:'LF-BHOME-…', goods:'주문 제작 명함 · 모바일 홈페이지', ck, rec })
           UriPay.resume({ ck, rec }, function(r){ r.state = 'paid' | 'fail' | 'wait' · r.msg · r.no })
   [원칙] 백틱 금지 · 문자열 연결(+)만 */
(function(){
  var PAY = 'https://script.google.com/macros/s/AKfycbxLIG_LRAZD3AMJH26gPhefdkwLbXmA5ip_UurBfQ-53bxgq2T63dSre6YO9j4hxBZM1A/exec';   /* 결제 서버 · lf/pay-one.js PAY 와 같음 */
  var CK = 'live_ck_nRQoOaPz8LEovWPx0WGN3y47BMw6';   /* 토스 손님 키 · lf/pay-one.js CK 와 같음 */
  var PEND = 'uri_bpay_pend', AG = 'b17-0.1';
  var WAYS = { invite: '초대장', guide: '안내 받아보기', partner: '안내자', org: '기관', ad: '광고', direct: '직접' };

  function ls(k, v){ try{ if (v === undefined) { return localStorage.getItem(k) || ''; } if (v === '') { localStorage.removeItem(k); } else { localStorage.setItem(k, v); } }catch(e){ return ''; } }
  function esc(x){ return String(x == null ? '' : x).replace(/[&<>"]/g, function(c){ return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function won(n){ return Number(n || 0).toLocaleString('ko-KR') + '원'; }
  (function pick(){
    try{
      var q = new URLSearchParams(location.search), now = (new Date()).getTime(), w = (q.get('way') || '').toLowerCase();
      if (w) { localStorage.setItem('lf_way', (WAYS[w] || '그 밖') + '|' + now); }
      else if (q.get('utm_source') || q.get('utm_medium')) { localStorage.setItem('lf_way', '광고|' + now); }
      var o = /^ORG-[A-Za-z0-9]+$/i.exec(q.get('lf') || ''); if (o) { localStorage.setItem('lf_org', o[0].toUpperCase() + '|' + now); }
    }catch(e){}
  })();
  function org(){ var v = ls('lf_org').split('|')[0] || ''; return /^ORG-[A-Za-z0-9]+$/i.test(v) ? v.toUpperCase() : ''; }
  function way(){ var raw = ls('lf_way'), a = raw.split('|'); if (raw && (new Date()).getTime() - Number(a[1] || 0) <= 30 * 24 * 3600 * 1000 && a[0]) { return a[0]; } return org() ? '안내자' : '직접'; }

  function jsonp(base, params, done){
    var cb = 'uripay' + Date.now() + Math.floor(Math.random() * 1000), fin = false, sc = document.createElement('script');
    var tm = setTimeout(function(){ if (fin) { return; } fin = true; cl(); done(null); }, 25000);
    function cl(){ try{ delete window[cb]; }catch(e){ window[cb] = undefined; } if (sc.parentNode) { sc.parentNode.removeChild(sc); } }
    window[cb] = function(r){ if (fin) { return; } fin = true; clearTimeout(tm); cl(); done(r); };
    var u = base + '?callback=' + cb;
    for (var k in params) { if (params[k] !== '' && params[k] != null) { u += '&' + k + '=' + encodeURIComponent(params[k]); } }
    sc.src = u; sc.onerror = function(){ if (fin) { return; } fin = true; clearTimeout(tm); cl(); done(null); };
    document.body.appendChild(sc);
  }
  function price(item, cb){
    jsonp(PAY, { action: 'tossConfirm', op: 'price' }, function(r){ if (!r || r.status !== 'ok') { return cb(0); } cb(Number(r[item]) || 0); });
  }
  function rec(base, body, cb){
    fetch(base, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(body) })
      .then(function(r){ return r.json(); }).then(cb)['catch'](function(){ cb(null); });
  }

  var CSS = '.lfpo{background:#fff;border:1px solid #E4E0D8;border-radius:16px;padding:16px 16px 14px;margin:14px 16px;text-align:left;color:#1D2433}'
    + '.lfpo h4{margin:0 0 4px;font-size:16px;font-weight:800}'
    + '.lfpo .sum{font-size:15px;margin:2px 0 6px}.lfpo .sum b{font-size:18px}'
    + '.lfpo label{display:flex;gap:8px;align-items:flex-start;font-size:14px;line-height:1.5;cursor:pointer;min-height:44px;padding-top:6px}'
    + '.lfpo label input{width:20px;height:20px;flex:0 0 20px;margin:1px 0 0;accent-color:#1E4A76}'
    + '.lfpo .s{font-size:12.5px;color:#667085;line-height:1.6;margin:2px 0 10px}.lfpo .s a{color:#667085}'
    + '.lfpo button.go{width:100%;min-height:50px;border:0;border-radius:14px;background:#1E4A76;color:#fff;font:inherit;font-weight:800;font-size:16px;cursor:pointer}'
    + '.lfpo button.go:disabled{opacity:.5;cursor:default}'
    + '.lfpo .msg{font-size:14px;color:#667085;line-height:1.6;margin:6px 0 0}'
    + '.lfpo-lv{position:fixed;inset:0;z-index:3000;background:rgba(15,20,30,.55);display:none;align-items:flex-end;justify-content:center}'
    + '.lfpo-lv.on{display:flex}'
    + '.lfpo-lv .bx{width:100%;max-width:480px;background:#fff;border-radius:20px 20px 0 0;padding:22px 20px 26px;text-align:center;color:#1D2433}'
    + '.lfpo-lv h3{font-size:17px;margin:0 0 8px}.lfpo-lv p{font-size:14px;color:#667085;line-height:1.7;margin:0 0 16px}'
    + '.lfpo-lv .row{display:flex;gap:8px}.lfpo-lv .row button{flex:1;border:0;border-radius:14px;padding:14px;font:inherit;font-weight:800;font-size:15px;cursor:pointer;min-height:48px}'
    + '.lfpo-lv .no{background:#F1EEE8;color:#1D2433}.lfpo-lv .yes{background:#1E4A76;color:#fff}';
  function css(){ if (document.getElementById('lfpoCss')) { return; } var s = document.createElement('style'); s.id = 'lfpoCss'; s.textContent = CSS; document.head.appendChild(s); }
  function toss(cb, fail){ if (window.TossPayments) { return cb(); } var sc = document.createElement('script'); sc.src = 'https://js.tosspayments.com/v2/standard'; sc.onload = cb; sc.onerror = fail; document.head.appendChild(sc); }
  function tip(el, m){ var t = el.querySelector('.msg'); if (!t) { t = document.createElement('p'); t.className = 'msg'; (el.querySelector('.lfpo') || el).appendChild(t); } t.textContent = m; }

  function leave(go){
    css();
    var lv = document.getElementById('lfpoLv');
    if (!lv) {
      lv = document.createElement('div'); lv.className = 'lfpo-lv'; lv.id = 'lfpoLv';
      lv.innerHTML = '<div class="bx"><h3>결제 창으로 잠시 이동해요</h3><p>카드 결제는 토스 결제 창에서 해요.<br>적으신 주문은 그대로 있어요.<br>결제를 마치시면 이 자리로 돌아와요.</p><div class="row"><button type="button" class="no" id="lfpoNo">취소</button><button type="button" class="yes" id="lfpoGo">결제하러 가기</button></div></div>';
      document.body.appendChild(lv);
    }
    lv.classList.add('on');
    var g = document.getElementById('lfpoGo'); g.disabled = false; g.textContent = '결제하러 가기';
    document.getElementById('lfpoNo').onclick = function(){ lv.classList.remove('on'); };
    g.onclick = function(){ g.disabled = true; g.textContent = '결제 창을 여는 중이에요…'; go(function(){ g.disabled = false; g.textContent = '결제하러 가기'; lv.classList.remove('on'); }); };
  }

  /* 주문 넣기 뒤 — 결제 상자. cb(그렸는지) */
  function render(el, o, cb){
    cb = cb || function(){};
    if (!el || !o || !/^LF-B(CARD|HOME|SHOW)-[A-Z0-9]{12}$/.test(o.oid || '')) { return cb(false); }
    css();
    price(o.item, function(n){
      if (!(n > 0)) { el.innerHTML = ''; return cb(false); }   /* 값을 넣기 전 = 판매 꺼짐 */
      el.innerHTML = '<div class="lfpo"><h4>' + esc(o.goods) + '</h4>'
        + '<div class="sum">주문 번호 ' + esc(o.no) + ' · 1년 <b>' + won(n) + '</b></div>'
        + '<label><input type="checkbox" class="ag"> 결제 내용을 확인했고 결제에 동의해요</label>'
        + '<p class="s">디지털 콘텐츠 · 만든 날부터 1년 · 환불은 <a href="/terms/" target="_blank" rel="noopener">이용약관</a>을 따라요</p>'
        + '<button type="button" class="go">결제하기</button></div>';
      var ag = el.querySelector('.ag'), bt = el.querySelector('.go');
      ag.onchange = function(){ var t = el.querySelector('.msg'); if (t) { t.textContent = ''; } };
      bt.onclick = function(){
        if (!ag.checked) { ag.focus(); tip(el, '결제 내용을 확인하고 동의에 체크해 주세요'); return; }
        leave(function(back){
          ls(PEND, JSON.stringify({ no: o.no, oid: o.oid, item: o.item, amount: n, goods: o.goods, at: Date.now() }));
          var to = location.origin + location.pathname + '?';
          toss(function(){
            try{
              window.TossPayments(CK).payment({ customerKey: 'LFC-' + o.oid.slice(-12) }).requestPayment({
                method: 'CARD', amount: { currency: 'KRW', value: n }, orderId: o.oid,
                orderName: '사랑흐름 ' + o.goods, successUrl: to + 'bpay=1', failUrl: to + 'bpay=0',
                card: { useEscrow: false, flowMode: 'DEFAULT' }
              })['catch'](function(){ back(); });
            }catch(e){ back(); tip(el, '결제 창을 열지 못했어요'); }
          }, function(){ back(); tip(el, '결제 창을 불러오지 못했어요'); });
        });
      };
      cb(true);
    });
  }

  /* 우리 서버에 「결제 끝」 — 서버가 결제 서버에 다시 물어 정함 */
  function paid(pend, o, cb){
    rec(o.rec, { action: 'recCardPaid', ck: o.ck, no: pend.no }, function(d){
      if (d && d.status === 'ok') { ls(PEND, ''); return cb({ state: 'paid', no: pend.no, goods: pend.goods }); }
      pend.confirmed = true; ls(PEND, JSON.stringify(pend));
      cb({ state: 'wait', no: pend.no, msg: (d && d.msg) || '결제 확인이 늦어지고 있어요. 잠시 뒤 이 화면을 다시 열면 이어서 확인해요.' });
    });
  }
  function confirm(pend, o, cb){
    jsonp(PAY, { action: 'tossConfirm', paymentKey: pend.pk, orderId: pend.oid, amount: pend.am, ag: AG, way: way(), org: org() }, function(r){
      if (!r) { return cb({ state: 'wait', no: pend.no, msg: '결제 확인이 늦어지고 있어요. 잠시 뒤 이 화면을 다시 열면 이어서 확인해요.' }); }
      if (r.status !== 'ok') { ls(PEND, ''); return cb({ state: 'fail', no: pend.no, msg: r.msg || '결제가 끝나지 않았어요. 카드에서 돈은 나가지 않았어요.' }); }
      pend.confirmed = true; ls(PEND, JSON.stringify(pend));
      paid(pend, o, cb);
    });
  }
  /* 토스에서 돌아왔을 때 · 지난번에 못 끝낸 것 이어서 */
  function resume(o, cb){
    var q = new URLSearchParams(location.search), c = q.get('bpay'), pend = null;
    try{ pend = JSON.parse(ls(PEND) || 'null'); }catch(e){ pend = null; }
    if (!c) {
      if (pend && pend.confirmed && o.ck) { return paid(pend, o, cb); }
      if (pend && pend.pk) { return confirm(pend, o, cb); }
      return;
    }
    try{ history.replaceState(null, '', location.pathname); }catch(e){}
    if (c !== '1') { if (pend) { ls(PEND, ''); } return cb({ state: 'fail', msg: '결제가 끝나지 않았어요. 카드에서 돈은 나가지 않았어요.' }); }
    if (!pend) { return cb({ state: 'fail', msg: '결제 정보를 찾지 못했어요. 카드에서 돈이 나갔다면 카카오톡으로 알려 주세요.' }); }
    if ((q.get('orderId') || '') !== pend.oid) { return cb({ state: 'fail', msg: '결제 정보가 맞지 않아요. 카카오톡으로 알려 주세요.' }); }
    pend.pk = q.get('paymentKey') || ''; pend.am = Number(q.get('amount') || 0); ls(PEND, JSON.stringify(pend));
    confirm(pend, o, cb);
  }

  window.UriPay = { render: render, resume: resume };
})();

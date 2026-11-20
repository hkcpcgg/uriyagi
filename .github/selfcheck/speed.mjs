// 속도 재기(261120 · 대표 「사진 불러오는 중 화면이 길다 · 주기적으로 재라」) — 첫 화면 · 방 열기 · 게시물 열기 · 옆으로 넘기기 · 다음 게시물
// 손님 눈(열쇠 없음) + KEY 있으면 멤버 눈(닫힌 사진 = 서버를 거치는 길)
import { chromium } from 'playwright-core';
const B = 'https://uriyagi.kr/', ROOMS = (process.env.ROOMS || 'C-0255,C-0031,C-0294').split(',').map(s => s.trim()).filter(Boolean), KEY = (process.env.KEY || '').trim();
const browser = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome' });
const UA = 'Mozilla/5.0 (Linux; Android 14; SM-S918N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36';
const out = [];
function sum(L) { const g = {}; L.filter(x => x.a).forEach(x => { (g[x.a] = g[x.a] || []).push(x.ms); }); return Object.keys(g).map(a => a + ' ' + g[a].length + '번(가장 늦은 ' + (Math.max(...g[a]) / 1000).toFixed(1) + '초)').join(' · '); }
const T = ms => (ms / 1000).toFixed(1) + '초';
async function ctx() { return browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'ko-KR', userAgent: UA }); }
function netlog(p) { const L = []; const st = new Map();
  p.on('request', r => { if (/script\.google/.test(r.url())) { let a = ''; try { a = JSON.parse(r.postData() || '{}').action || ''; } catch (e) {} st.set(r, [Date.now(), a]); } });   // 261120 시작 때도 남김
  p.on('requestfinished', r => { let root = r; while (root.redirectedFrom()) root = root.redirectedFrom(); const s = st.get(root); if (s && r === root) {} if (s && !r.redirectedTo()) { st.delete(root); L.push({ a: s[1], ms: Date.now() - s[0], st: s[0] }); } });   // 261120 v223 한 번 부름을 두 번 적던 것 — 적고 나면 지움
  p.on('response', r => { if (/ncloudstorage/.test(r.url())) { L.push({ a: (/X-Amz-Signature/.test(r.url()) ? '네이버 서명 ' : '네이버 ') + r.status(), ms: 0 }); } });
  return L; }
async function until(p, fn, max = 30000) { const t0 = Date.now(); while (Date.now() - t0 < max) { if (await p.evaluate(`(${fn})()`).catch(() => false)) return Date.now() - t0; await p.waitForTimeout(100); } return -1; }
const firstPic = `() => [...document.querySelectorAll('#main .tl[data-tid],#main .tl[data-pz],#main .tl[data-vz]')].some(e => /url\\(/.test(getComputedStyle(e).backgroundImage) && e.getBoundingClientRect().top < innerHeight)`;
const curLoaded = `() => { const pf = document.querySelector('#pf.on'); if (!pf) return false; const arts = [...pf.querySelectorAll('.pfp')]; const a = arts.find(x => { const b = x.getBoundingClientRect(); return b.top > -50 && b.top < 200; }); if (!a) return false; const sc = a.querySelector('.pfs'); const w = sc.clientWidth || 1, k = Math.round(sc.scrollLeft / w); const im = sc.querySelectorAll('.pfi img')[k]; return !!im && im.complete && im.naturalWidth > 0 && !sc.children[k].querySelector('.pfw8'); }`;
async function room(p, L, label, url) {
  L.length = 0; const t0 = Date.now(); await p.goto(url); const t1 = await until(p, firstPic, 40000);
  out.push(`| ${label} | 방 열기 → 첫 사진 | ${t1 < 0 ? '★ 40초 넘음' : T(t1)} | ${L.filter(x => x.a).map(x => x.a + '@' + T(x.st - t0) + '+' + T(x.ms)).join(' · ')} |`);
  // 여러 장 게시물 먼저 · 없으면 첫 칸
  const ok = await p.evaluate(() => { const ts = [...document.querySelectorAll('#main .tl[data-tid]')]; const t = ts.find(x => x.querySelector('.cnt.mul')) || ts[0]; if (!t) return 0; t.click(); return t.querySelector('.cnt.mul') ? 2 : 1; });
  if (!ok) { out.push(`| ${label} | 게시물 | 칸 없음 |`); return; }
  L.length = 0; const t2 = await until(p, curLoaded, 40000); const sv = [sum(L)];
  out.push(`| ${label} | 게시물 열기 → 큰 사진 | ${t2 < 0 ? '★ 40초 넘음' : T(t2)} | ${sv.slice(0, 4).join(' · ')} |`);
  const n = await p.evaluate(() => { const pf = document.querySelector('#pf.on .pfp .pfs'); return pf ? pf.children.length : 0; });
  for (let k = 1; k < Math.min(n, 6); k++) {
    L.length = 0; await p.evaluate(() => { const b = [...document.querySelectorAll('#pf.on .pfar.r')].find(x => { const r = x.getBoundingClientRect(); return r.top > 0 && r.top < innerHeight; }); if (b) b.click(); });
    await p.waitForTimeout(350); const tk = await until(p, curLoaded, 30000); const s2 = [sum(L)];
    out.push(`| ${label} | 옆으로 ${k + 1}/${n} 장 | ${tk < 0 ? '★ 30초 넘음' : T(tk + 350)} | ${s2.join(' · ')} |`);
  }
  L.length = 0; await p.evaluate(() => { const b = [...document.querySelectorAll('#pf.on .pfnv button[data-pa=gmv]')].pop(); if (b) b.click(); });
  await p.waitForTimeout(600); const t3 = await until(p, curLoaded, 30000);
  out.push(`| ${label} | › 다음 게시물 | ${t3 < 0 ? '★ 30초 넘음' : T(t3 + 600)} | ${sum(L)} |`);
}
// ★ 닫힌 사진 서명 주소 시험(KEY + PHOTO) — 서버에 url=1 로 묻고 그 주소를 바로 받아 봄
if (/^[a-f0-9]{32}$/.test(KEY) && /^R-\d{6}$/.test(process.env.PHOTO || '')) {
  const GAS = 'https://script.google.com/macros/s/AKfycbyxGWMrhY9Ffihk56ve-8s_S87fdkg_WEMpJO7q3FZRkdlBZWwkWo8m2Gs-fBbrhoVMOg/exec';
  { const h = await fetch(GAS, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action: 'recHome', k: KEY, lite: '1', n: '20' }) }).then(x => x.json()).catch(e => ({ err: e.message }));
    const cards = []; (function walk(o, d) { if (!o || typeof o !== 'object' || d > 6) return; if (Array.isArray(o)) { o.forEach(x => walk(x, d + 1)); return; } if (o.id && o.photo !== undefined) cards.push(o); for (const k in o) if (o[k] && typeof o[k] === 'object') walk(o[k], d + 1); })(h, 0);
    out.push(`| 목록 서명 주소 | 카드 ${cards.length} · su 있음 ${cards.filter(c => c.su).length} · n 있음 ${cards.filter(c => c.n).length} · ${cards.slice(0, 3).map(c => c.id + (c.su ? '(su)' : '') + (c.pv ? '(pv)' : '')).join(' ')} | ${Object.keys(h).slice(0, 12).join(',')} |`); }   // 261120 v107 확인
  for (const sm of ['', '1']) {
    const t0 = Date.now(); const d = await fetch(GAS, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action: 'recPhoto', k: KEY, id: process.env.PHOTO, small: sm, url: '1' }) }).then(x => x.json()).catch(e => ({ err: e.message }));
    const t1 = Date.now() - t0;
    if (d.url) { const t2 = Date.now(); const r = await fetch(d.url); const b = await r.arrayBuffer(); const r0 = await fetch(d.url.split('?')[0]);
      out.push(`| 닫힌 사진 ${process.env.PHOTO}${sm ? ' 작게' : ''} | 서명 주소 받기 ${T(t1)} · 네이버 ${r.status} ${Math.round(b.byteLength / 1024)}KB ${T(Date.now() - t2)} | 서명 없이 ${r0.status} |`); }
    else out.push(`| 닫힌 사진 ${process.env.PHOTO} | 주소 못 받음 ${T(t1)} | ${JSON.stringify(d).slice(0, 120)} |`);
  }
  const t3 = Date.now(); const d0 = await fetch(GAS, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action: 'recPhoto', k: KEY, id: process.env.PHOTO }) }).then(x => x.json()).catch(e => ({}));
  out.push(`| 닫힌 사진 옛 길(서버가 받아 넘김) | ${T(Date.now() - t3)} | ${d0.data ? Math.round(d0.data.length * 0.75 / 1024) + 'KB' : '못 받음'} |`);
}
try {
  let c = await ctx(), p = await c.newPage(), L = netlog(p);
  const t0 = Date.now(); await p.goto(B + '?plaza=1'); const tp = await until(p, firstPic, 40000);
  out.push('| 마당 | 첫 사진 | ' + (tp < 0 ? '★ 40초 넘음' : T(tp)) + ' |');
  for (const r of ROOMS) await room(p, L, '손님 ' + r, B + '?c=' + r);
  await c.close();
  if (/^[a-f0-9]{32}$/.test(KEY)) { c = await ctx(); p = await c.newPage(); L = netlog(p); await p.goto(B + '?k=' + KEY); await p.waitForTimeout(3000);
    if (/^R-\d{6}$/.test(process.env.PHOTO || '')) { await p.evaluate(id => { const o = JSON.parse(localStorage.getItem('lf_rec_pv') || '{}'); o[id] = 'https://kr.object.ncloudstorage.com/uriyagi-photo/u/old.jpg?X-Amz-Signature=dead'; localStorage.setItem('lf_rec_pv', JSON.stringify(o)); }, process.env.PHOTO); }   // 261120 v220 — 닫힌 옛 주소를 일부러 넣어 둠
    await room(p, L, '멤버 내 방', B + '?me=1');
    const bad = await p.evaluate(() => ({ left: /X-Amz-Signature/.test(localStorage.getItem('lf_rec_pv') || ''), broken: [...document.querySelectorAll('#pf .pfi img[src]')].filter(i => i.complete && !i.naturalWidth).length, stuck: [...document.querySelectorAll('#pf .pfi .pfw8')].filter(w => !w.querySelector('button')).length }));
    out.push(`| 멤버 내 방 | 닫힌 옛 주소 | 창고에 남음 ${bad.left ? '★ 있음' : '없음'} · 깨진 그림 ${bad.broken} · 불러오는 중 남음 ${bad.stuck} |`);
    await c.close(); }
} catch (e) { out.push('| 오류 | ' + e.message.slice(0, 150) + ' |'); }
await browser.close();
console.log('| 어디 | 무엇 | 걸린 때 | 서버에 물은 것 |\n|---|---|---|---|\n' + out.join('\n'));

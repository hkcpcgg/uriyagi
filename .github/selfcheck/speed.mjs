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
  p.on('request', r => { if (/script\.google/.test(r.url())) { let a = ''; try { a = JSON.parse(r.postData() || '{}').action || ''; } catch (e) {} st.set(r, [Date.now(), a]); } });
  p.on('requestfinished', r => { let root = r; while (root.redirectedFrom()) root = root.redirectedFrom(); const s = st.get(root); if (s && r === root) {} if (s && !r.redirectedTo()) L.push({ a: s[1], ms: Date.now() - s[0] }); });
  return L; }
async function until(p, fn, max = 30000) { const t0 = Date.now(); while (Date.now() - t0 < max) { if (await p.evaluate(`(${fn})()`).catch(() => false)) return Date.now() - t0; await p.waitForTimeout(100); } return -1; }
const firstPic = `() => [...document.querySelectorAll('#main .tl[data-tid],#main .tl[data-pz],#main .tl[data-vz]')].some(e => /url\\(/.test(getComputedStyle(e).backgroundImage) && e.getBoundingClientRect().top < innerHeight)`;
const curLoaded = `() => { const pf = document.querySelector('#pf.on'); if (!pf) return false; const arts = [...pf.querySelectorAll('.pfp')]; const a = arts.find(x => { const b = x.getBoundingClientRect(); return b.top > -50 && b.top < 200; }); if (!a) return false; const sc = a.querySelector('.pfs'); const w = sc.clientWidth || 1, k = Math.round(sc.scrollLeft / w); const im = sc.querySelectorAll('.pfi img')[k]; return !!im && im.complete && im.naturalWidth > 0 && !sc.children[k].querySelector('.pfw8'); }`;
async function room(p, L, label, url) {
  L.length = 0; const t0 = Date.now(); await p.goto(url); const t1 = await until(p, firstPic, 40000);
  out.push(`| ${label} | 방 열기 → 첫 사진 | ${t1 < 0 ? '★ 40초 넘음' : T(t1)} |`);
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
try {
  let c = await ctx(), p = await c.newPage(), L = netlog(p);
  const t0 = Date.now(); await p.goto(B + '?plaza=1'); const tp = await until(p, firstPic, 40000);
  out.push('| 마당 | 첫 사진 | ' + (tp < 0 ? '★ 40초 넘음' : T(tp)) + ' |');
  for (const r of ROOMS) await room(p, L, '손님 ' + r, B + '?c=' + r);
  await c.close();
  if (/^[a-f0-9]{32}$/.test(KEY)) { c = await ctx(); p = await c.newPage(); L = netlog(p); await p.goto(B + '?k=' + KEY); await p.waitForTimeout(3000); await room(p, L, '멤버 내 방', B + '?me=1'); await c.close(); }
} catch (e) { out.push('| 오류 | ' + e.message.slice(0, 150) + ' |'); }
await browser.close();
console.log('| 어디 | 무엇 | 걸린 때 | 서버에 물은 것 |\n|---|---|---|---|\n' + out.join('\n'));

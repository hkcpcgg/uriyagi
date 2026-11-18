// 우리 이야기 매일 자가진단 (v2 · 261118 · 대표 OK 20:15) — v2 바탕 그림(background-image) 사진 칸도 셈 · 공유 링크 방 열쇠는 방 답의 g
// 손님 눈으로 uriyagi.kr 를 열어 봄: 마당 · 방 · 사진 한 장 · 공유 링크 · 첫 화면 시간 · 빈 사진 칸 · 오류 · 서버 시간
// 결과 = 표(GitHub 실행 요약) · 하나라도 「고장」이면 실패로 끝남(→ 알림 글)
import { chromium } from 'playwright';
import fs from 'fs';

const BASE = 'https://uriyagi.kr/';
const ROOM = process.env.ROOM || 'C-0294';           // (견본) 우리들의 주말 러닝 — 공개 방
const LIM = { first: 8000, firstWarn: 4000, srv: 15000, srvWarn: 6000 };
const rows = [];   // [항목, 결과, 값, 메모]
let bad = 0, warn = 0;
const put = (k, ok, v, m) => { rows.push([k, ok === true ? '정상' : ok === 'w' ? '느림' : '고장', v, m || '']); if (ok === false) bad++; if (ok === 'w') warn++; };

const browser = await chromium.launch();
const mobile = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true,
  userAgent: 'Mozilla/5.0 (Linux; Android 14; SM-S918N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36' };
const desktop = { viewport: { width: 1280, height: 900 } };

const srvTimes = [];
let roomG = '', recId = '';

async function openPage(name, url, ctxOpt) {
  const ctx = await browser.newContext(ctxOpt);
  const p = await ctx.newPage();
  const errs = [];
  p.on('pageerror', e => errs.push(String(e.message || e).slice(0, 120)));
  const t0 = Date.now(); const reqStart = new Map();
  p.on('request', r => { if (/script\.google(usercontent)?\.com/.test(r.url())) reqStart.set(r, Date.now()); });
  p.on('response', async r => {
    if (!reqStart.has(r.request())) return;
    if (/script\.google\.com/.test(r.url()) && r.status() === 302) return;
    srvTimes.push({ page: name, ms: Date.now() - reqStart.get(r.request()) });
    try {
      const tx = await r.text();
      if (!roomG && name === '방') { const m = tx.match(/"g"\s*:\s*"([a-f0-9]{32})"/); if (m) roomG = m[1]; }
      if (!recId) { const m = tx.match(/"(R-\d{6})"/); if (m) recId = m[1]; }
    } catch (e) {}
  });
  await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch(e => errs.push('열기 실패 ' + e.message.slice(0, 80)));
  // 첫 사진이 보일 때까지
  let first = -1;
  for (let i = 0; i < 60; i++) {
    const ok = await p.evaluate(() => [...document.querySelectorAll('#main *')].some(el => { const b = el.getBoundingClientRect(); if (b.width < 40 || b.height < 40) return false; if (el.tagName === 'IMG') return el.complete && el.naturalWidth > 0; return /url\(/.test(getComputedStyle(el).backgroundImage); })).catch(() => false);
    if (ok) { first = Date.now() - t0; break; }
    await p.waitForTimeout(250);
  }
  await p.waitForTimeout(2500);
  const st = await p.evaluate(async () => {
    // 사진 칸 = 40px 넘는 <img> 와 바탕 그림(background-image) 칸 · 바탕 그림은 따로 불러 봐서 안 오면 빈 칸
    const tiles = [], urls = new Set();
    for (const el of document.querySelectorAll('#main *')) {
      const b = el.getBoundingClientRect(); if (b.width < 40 || b.height < 40) continue;
      if (el.tagName === 'IMG') { if (!el.src || /^data:|\.svg/.test(el.src) || /uri-logo|lf-og/.test(el.src)) continue; tiles.push({ img: el }); continue; }
      const m = getComputedStyle(el).backgroundImage.match(/url\(["']?([^"')]+)/); if (!m || /^data:|\.svg/.test(m[1])) continue;
      tiles.push({ bg: m[1] }); urls.add(m[1]);
    }
    const fail = new Set();
    await Promise.all([...urls].slice(0, 60).map(u => new Promise(res => { const im = new Image(); const to = setTimeout(() => { fail.add(u); res(); }, 10000); im.onload = () => { clearTimeout(to); if (!im.naturalWidth) fail.add(u); res(); }; im.onerror = () => { clearTimeout(to); fail.add(u); res(); }; im.src = u; })));
    const broken = [];
    for (const t of tiles) { if (t.img) { if (t.img.complete && t.img.naturalWidth === 0) broken.push((t.img.currentSrc || t.img.src).slice(-60)); } else if (fail.has(t.bg)) broken.push(t.bg.slice(-60)); }
    const tx = (document.getElementById('main') || document.body).innerText || '';
    return { n: tiles.length, broken, down: /연결되지 않습니다|들어오지 못했습니다|찾을 수 없습니다/.test(tx), text: tx.slice(0, 80).replace(/\s+/g, ' ') };
  }).catch(e => ({ n: 0, broken: [], down: true, text: '점검 오류 ' + e.message }));
  return { p, ctx, errs, first, st };
}

function judgePage(name, r, minImgs) {
  const f = r.first;
  put(name + ' · 첫 사진', f < 0 ? false : f > LIM.first ? false : f > LIM.firstWarn ? 'w' : true, f < 0 ? '안 보임' : (f / 1000).toFixed(1) + '초');
  put(name + ' · 사진 수', r.st.n >= minImgs && !r.st.down, r.st.n + '장', (r.st.down || r.st.n < minImgs) ? '화면 말: ' + r.st.text : '');
  put(name + ' · 빈 사진 칸', r.st.broken.length === 0, r.st.broken.length + '칸', r.st.broken.slice(0, 3).join(' , '));
  put(name + ' · 화면 오류', r.errs.length === 0, r.errs.length + '건', r.errs.slice(0, 2).join(' / '));
}

// 1 마당
let r = await openPage('마당', BASE + '?plaza=1', mobile); judgePage('마당', r, 3); await r.ctx.close();
// 2 방(고정 주소 = QR · 링크 복사)
r = await openPage('방', BASE + '?c=' + ROOM, mobile); judgePage('방 ' + ROOM, r, 2); await r.ctx.close();
// 3 사진 한 장(데스크톱 · 사진 공유 &r=)
if (recId) {
  r = await openPage('사진 한 장', BASE + '?c=' + ROOM + '&r=' + recId, desktop);
  const big = await r.p.evaluate(() => [...document.querySelectorAll('img')].some(im => { const b = im.getBoundingClientRect(); return im.naturalWidth > 0 && b.width > 250 && b.height > 150; })).catch(() => false);
  put('사진 한 장 · 큰 사진', big, recId, big ? '' : '사진 칸이 비어 보임(v201 같은 꼴)');
  put('사진 한 장 · 화면 오류', r.errs.length === 0, r.errs.length + '건', r.errs.slice(0, 2).join(' / '));
  await r.ctx.close();
} else put('사진 한 장', false, '기록 번호 못 받음', '방 답에서 R- 번호가 안 옴');
// 4 받은 방 링크(카톡 공유 · 초대 ?g=)
if (roomG) {
  r = await openPage('공유 링크', BASE + '?g=' + roomG, mobile);
  put('공유 링크 · 바로 그 방', r.st.n >= 2 && !r.st.down, r.st.n + '장', r.st.down ? r.st.text : '');
  put('공유 링크 · 화면 오류', r.errs.length === 0, r.errs.length + '건', r.errs.slice(0, 2).join(' / '));
  await r.ctx.close();
} else put('공유 링크', false, '방 열쇠 못 받음', '방 답 ' + srvTimes.filter(x => x.page === '방').length + '번');
// 5 서버 시간
if (srvTimes.length) {
  const ms = srvTimes.map(x => x.ms).sort((a, b) => a - b), mx = ms[ms.length - 1], md = ms[Math.floor(ms.length / 2)];
  put('서버 · 가장 느린 답', mx > LIM.srv ? false : mx > LIM.srvWarn ? 'w' : true, (mx / 1000).toFixed(1) + '초', '가운데 ' + (md / 1000).toFixed(1) + '초 · ' + ms.length + '번');
} else put('서버 답', false, '0번', '서버에서 답이 하나도 안 옴');
await browser.close();

const now = new Date(Date.now() + 9 * 3600e3).toISOString().slice(0, 16).replace('T', ' ');
const head = bad ? '❌ 고장 ' + bad + '건' : warn ? '⚠ 정상 · 느림 ' + warn + '건' : '✅ 모두 정상';
let md = '## 우리 이야기 자가진단 ' + now + ' (한국 시간) — ' + head + '\n\n| 항목 | 결과 | 값 | 메모 |\n|---|---|---|---|\n';
for (const x of rows) md += '| ' + x.map(v => String(v).replace(/\|/g, '/')).join(' | ') + ' |\n';
console.log(md);
fs.writeFileSync('selfcheck.md', md);
if (process.env.GITHUB_STEP_SUMMARY) fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, md);
process.exit(bad ? 1 : 0);

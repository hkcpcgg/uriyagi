// 안내 방 그림 — 실제 uriyagi.kr 화면을 휴대폰 눈으로 찍고, 누를 곳 자리(boxes.json)를 같이 남김(손으로 · 261119)
// 손님 화면 + 시험 방(C-0294) 관리자 열쇠로 본 멤버 화면 · 열쇠는 실행 때 입력으로만 받고 어디에도 적지 않음
import { chromium } from 'playwright-core';
import fs from 'fs';
const B = 'https://uriyagi.kr/', ROOM = process.env.ROOM || 'C-0294', KEY = (process.env.KEY || '').trim();
fs.mkdirSync('guide', { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome' });
const UA = 'Mozilla/5.0 (Linux; Android 14; SM-S918N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36';
const log = [], boxes = {};
async function newCtx() { return browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'ko-KR', userAgent: UA }); }
async function wait(p) { for (let i = 0; i < 40; i++) { const ok = await p.evaluate(() => [...document.querySelectorAll('#main *')].some(el => /url\(/.test(getComputedStyle(el).backgroundImage) || (el.tagName === 'IMG' && el.naturalWidth > 0 && el.width > 60))); if (ok) break; await p.waitForTimeout(300); } await p.waitForTimeout(2500); }
async function snap(p, n) { await p.waitForTimeout(1300); await p.screenshot({ path: 'guide/' + n + '.png' }); log.push(n); }
// 누를 곳을 찾아 자리를 적고(그림에 동그라미용) 찍은 뒤 누름
async function boxOf(p, find) { return p.evaluate(`(() => { const e = (${find})(); if (!e) return null; const b = e.getBoundingClientRect(); return { x: b.left, y: b.top, w: b.width, h: b.height }; })()`); }
async function tapAt(p, n, find, after) {
  const ok = await p.evaluate(`(() => { const e = (${find})(); if (!e) return false; e.scrollIntoView({ block: 'nearest' }); return true; })()`);
  if (!ok) { log.push(n + ' (못 찾음)'); return false; }
  await p.waitForTimeout(500);
  boxes[n] = await boxOf(p, find); await snap(p, n);
  await p.evaluate(`(() => { const e = (${find})(); if (e) e.click(); })()`);
  if (after) { await p.waitForTimeout(1800); await snap(p, after); }
  return true;
}
const T = re => `() => [...document.querySelectorAll('button,a,[role=button],label')].filter(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 && ${re}.test((e.textContent || '') + ' ' + (e.getAttribute('aria-label') || '')); }).pop()`;
const Q = s => `() => [...document.querySelectorAll('${s}')].filter(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 && b.top < innerHeight; })[0]`;
const PIC = `() => [...document.querySelectorAll('#main *')].find(e => { const b = e.getBoundingClientRect(); return b.width > 100 && b.height > 100 && b.top > 150 && /url\\(/.test(getComputedStyle(e).backgroundImage); })`;
try {
  // ── 손님
  let c = await newCtx(), p = await c.newPage();
  await p.goto(B + '?plaza=1'); await wait(p); await snap(p, 'g01_마당');
  await tapAt(p, 'g02_검색누름', Q('#btab [data-bt=fd]'), 'g02b_검색');
  await p.goto(B + '?plaza=1'); await wait(p);
  await tapAt(p, 'g03_방누름', `() => [...document.querySelectorAll('#main [data-pg],#main .pzr button,#main .rc')].filter(e=>e.getBoundingClientRect().width>30)[0]`, 'g03b_방첫화면');
  await p.goto(B + '?c=' + ROOM); await wait(p); await snap(p, 'g04_방첫화면');
  await tapAt(p, 'g05_사진누름', PIC, 'g05b_게시물');
  await p.mouse.wheel(0, 0);
  await tapAt(p, 'g06_좋아요', Q('#pf.on .pfa [data-pa=like]'));
  await tapAt(p, 'g07_기억누름', Q('#pf.on .pfa [data-pa=write]'), 'g07b_기억창');
  await p.evaluate(() => { const d = document.getElementById('dimTop'); if (d) d.remove(); });
  await tapAt(p, 'g08_공유누름', Q('#pf.on .pfa [data-pa=send]'), 'g08b_공유창');
  await p.evaluate(() => { const d = document.getElementById('dimTop'); if (d) d.remove(); });
  boxes['g09_저장'] = await boxOf(p, Q('#pf.on .pfa [data-pa=save]')); await snap(p, 'g09_저장');
  await tapAt(p, 'g10_더보기', Q('#pf.on .pfa [data-pa=more]'), 'g10b_더보기창');
  await p.goto(B + '?c=' + ROOM); await wait(p);
  await tapAt(p, 'g11_메뉴누름', T('/☰|메뉴/'), 'g11b_메뉴');
  await tapAt(p, 'g12_홈화면누름', T('/홈 화면에 추가/'), 'g12b_홈화면');
  await p.goto(B + '?plaza=1'); await wait(p);
  const lk = await p.evaluate(() => !!document.querySelector('.lck'));
  if (lk) await tapAt(p, 'g13_닫힌방', Q('.lck'), 'g13b_방두드리기'); else log.push('g13 닫힌 방 못 찾음');
  await p.goto(B + '?c=' + ROOM); await wait(p);
  await tapAt(p, 'g14_손님올리기', Q('#btab [data-bt=up]'), 'g14b_로그인안내');
  await p.goto(B + '?open=form'); await p.waitForTimeout(3500); await snap(p, 'g15_방만들기');
  await c.close();
  // ── 멤버(시험 방 관리자 열쇠)
  if (/^[a-f0-9]{32}$/.test(KEY)) {
    c = await newCtx(); p = await c.newPage();
    await p.goto(B + '?c=' + ROOM + '#k=' + KEY); await wait(p); await snap(p, 'm01_방첫화면');
    await tapAt(p, 'm02_초대누름', T('/초대하기/'), 'm02b_초대창');
    await p.goto(B + '?c=' + ROOM); await wait(p);
    await tapAt(p, 'm03_올리기누름', Q('#btab [data-bt=up]'), 'm03b_새게시물');
    await p.goto(B + '?c=' + ROOM); await wait(p);
    await tapAt(p, 'm04_내방누름', Q('#btab [data-bt=me]'), 'm04b_내방');
    await tapAt(p, 'm05_내사진', `() => [...document.querySelectorAll('#meP .av, #meP [data-me=pic], #meP .mh .av')].filter(e=>e.getBoundingClientRect().width>20)[0]`, 'm05b_내사진창');
    await p.goto(B + '?c=' + ROOM); await wait(p);
    await tapAt(p, 'm06_관리누름', T('/방 관리|⚙/'), 'm06b_방관리');
    await tapAt(p, 'm07_처리할일', T('/처리할 일/'), 'm07b_처리할일');
    await p.goto(B + '?c=' + ROOM); await wait(p);
    await tapAt(p, 'm08_사진누름', PIC, 'm08b_게시물');
    await tapAt(p, 'm09_더보기', Q('#pf.on .pfa [data-pa=more]'), 'm09b_내게시물메뉴');
    await c.close();
  } else log.push('멤버 화면은 건너뜀(열쇠 없음)');
} catch (e) { log.push('오류 ' + e.message.slice(0, 160)); }
fs.writeFileSync('guide/boxes.json', JSON.stringify(boxes, null, 1));
await browser.close();
console.log(log.join('\n'));

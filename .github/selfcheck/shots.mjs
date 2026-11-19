// 안내 방 그림 — 실제 uriyagi.kr 화면을 손님 휴대폰 눈으로 찍음(수동 실행 · 261118)
import { chromium } from 'playwright-core';
import fs from 'fs';
const B = 'https://uriyagi.kr/', ROOM = process.env.ROOM || 'C-0294';
fs.mkdirSync('shots', { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROME || '/usr/bin/google-chrome' });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, locale: 'ko-KR',
  userAgent: 'Mozilla/5.0 (Linux; Android 14; SM-S918N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36' });
const log = [];
async function snap(p, n) { await p.waitForTimeout(1200); await p.screenshot({ path: 'shots/' + n + '.png' }); log.push(n); }
async function textAt(p, re, n) {
  const ok = await p.evaluate(src => { const re = new RegExp(src); const els = [...document.querySelectorAll('body *')].filter(e => e.children.length < 3 && re.test(e.textContent || '') && e.getBoundingClientRect().height > 0); const e = els[els.length - 1]; if (!e) return false; e.scrollIntoView({ block: 'center' }); return true; }, re.source);
  if (ok) await snap(p, n); else log.push(n + ' (못 찾음)'); return ok;
}
async function wait(p) { for (let i = 0; i < 40; i++) { const ok = await p.evaluate(() => [...document.querySelectorAll('#main *')].some(el => /url\(/.test(getComputedStyle(el).backgroundImage) || (el.tagName === 'IMG' && el.naturalWidth > 0 && el.width > 60))); if (ok) break; await p.waitForTimeout(300); } await p.waitForTimeout(2500); }
try {
  let p = await ctx.newPage();
  await p.goto(B + '?plaza=1'); await wait(p); await snap(p, '01_마당'); await p.waitForTimeout(6000); await snap(p, '01b_마당_7초뒤'); await p.evaluate(() => window.scrollTo(0, 500)); await p.waitForTimeout(4000); await snap(p, '01c_마당_아래');
  await textAt(p, /우리 이야기방 만들기/, '02_만들기칸');
  await p.evaluate(() => window.scrollTo(0, 0));
  const lk = await p.evaluate(() => { const e = document.querySelector('.lck'); if (!e) return false; e.scrollIntoView({ block: 'center' }); return true; });
  if (lk) { await snap(p, '03_닫힌방동그라미'); await p.locator('.lck').first().click().catch(() => {}); await snap(p, '04_방두드리기'); } else log.push('03 닫힌 방 못 찾음');
  await p.goto(B + '?open=form'); await p.waitForTimeout(3000); await snap(p, '05_만들기화면');
  await p.goto(B + '?c=' + ROOM); await wait(p); await snap(p, '06_방첫화면');
  await textAt(p, /초대하기/, '07_초대하기');
  await textAt(p, /나도 사진 올리기/, '08_나도사진올리기');
  await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(500);
  // 첫 사진 눌러 게시물
  const clicked = await p.evaluate(() => { const el = [...document.querySelectorAll('#main *')].find(e => { const b = e.getBoundingClientRect(); return b.width > 100 && b.height > 100 && b.top > 150 && /url\(/.test(getComputedStyle(e).backgroundImage); }); if (!el) return false; el.click(); return true; });
  if (clicked) { await p.waitForTimeout(2500); await snap(p, '09_게시물'); await p.locator('#pf.on .pfp [data-pa=write]').first().click().catch(() => {}); await p.waitForTimeout(2500); await snap(p, '10_기억창'); await p.keyboard.press('Escape').catch(() => {}); await p.evaluate(() => { const d = document.getElementById('dimTop'); if (d) d.remove(); const pf = document.getElementById('pf'); if (pf) pf.scrollTop = pf.clientHeight; }); await snap(p, '10b_다음게시물'); } else log.push('09 사진 못 누름');
  await p.goto(B + '?c=' + ROOM); await wait(p);
  const mt = await p.evaluate(() => { const e = [...document.querySelectorAll('button,a,[role=button]')].find(x => /☰|메뉴/.test((x.textContent || '') + (x.getAttribute('aria-label') || ''))); if (!e) return false; e.click(); return true; });
  if (mt) { await snap(p, '11_메뉴'); await textAt(p, /홈 화면에 추가/, '12_홈화면에추가'); } else log.push('11 메뉴 못 엶');
  await p.goto(B + '?c=' + ROOM); await wait(p);
  const me = await p.evaluate(() => { const e = [...document.querySelectorAll('button,a')].find(x => /^\s*내 방\s*$/.test(x.textContent || '') || /내 방/.test(x.getAttribute('aria-label') || '')); if (!e) return false; e.click(); return true; });
  if (me) await snap(p, '13_내방_손님'); else log.push('13 내 방 못 누름');
  const up = await p.evaluate(() => { const e = document.querySelector('.oc,#fab'); if (!e) return false; e.click(); return true; });
  if (up) await snap(p, '14_올리기누름'); else log.push('14 올리기 못 누름');
} catch (e) { log.push('오류 ' + e.message.slice(0, 120)); }
await browser.close();
console.log(log.join('\n'));

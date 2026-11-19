// 안내 방 그림 — 실제 uriyagi.kr 화면을 휴대폰 눈으로 찍고, 누를 곳 자리(boxes.json)를 같이 남김(손으로 · 261119)
// ★v2 261119 23시 — 대표 지적 ② 고침: 창 · 메뉴가 멈춘 뒤 자리를 잼 · 마당 사진은 사진 칸에만 흐림(뜬 창은 안 흐림) · 그림마다 누를 곳을 여럿 잼 · 저장은 ⋯ 안(v211)
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
let REN = null;   // 멤버 화면: 시험 방 이름 · 이름을 보기용 이름으로 바꿔 찍음(안내 그림에 「지울 것」 같은 말이 안 나오게)
async function ren(p) { if (!REN) return; await p.evaluate(R => { const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); let n; while ((n = w.nextNode())) { let v = n.nodeValue; for (const [a, b] of R) v = v.replace(new RegExp(a, 'g'), b); if (v !== n.nodeValue) n.nodeValue = v; } document.querySelectorAll('input,textarea').forEach(e => { for (const [a, b] of R) if (e.value) e.value = e.value.replace(new RegExp(a, 'g'), b); }); }, REN).catch(() => {}); }
const BLUR = '.tl[data-vz],.tl[data-pz],.pzw .tl{filter:blur(16px) saturate(.8)}';   // 마당 사진 칸만(아이 사진 · 다른 방 사진이 안내 그림에 옮겨 실리지 않게)
async function snap(p, n) { await p.waitForTimeout(1300); await ren(p); await p.addStyleTag({ content: BLUR }).catch(() => {}); await p.waitForTimeout(150); await p.screenshot({ path: 'guide/' + n + '.png' }); log.push(n); }
// 누를 곳을 찾아 자리를 적고(그림에 동그라미용) 찍은 뒤 누름
async function box1(p, find) { return p.evaluate(`(() => { const e = (${find})(); if (!e) return null; const b = e.getBoundingClientRect(); return { x: Math.round(b.left), y: Math.round(b.top), w: Math.round(b.width), h: Math.round(b.height) }; })()`).catch(() => null); }
// 움직임이 멈춘 뒤의 자리 — 0.25초 사이로 두 번 재어 같을 때까지
async function boxOf(p, find) { let a = await box1(p, find); for (let i = 0; i < 20; i++) { await p.waitForTimeout(250); const b = await box1(p, find); if (JSON.stringify(a) === JSON.stringify(b)) return b; a = b; } return a; }
async function mark(p, shot, pairs) { for (const [k, f] of pairs) boxes[shot + ':' + k] = await boxOf(p, f); }
async function tapAt(p, n, find, after, more) {
  const ok = await p.evaluate(`(() => { const e = (${find})(); if (!e) return false; e.scrollIntoView({ block: 'nearest' }); return true; })()`);
  if (!ok) { log.push(n + ' (못 찾음)'); return false; }
  await p.waitForTimeout(500);
  boxes[n] = await boxOf(p, find); await snap(p, n);
  await p.evaluate(`(() => { const e = (${find})(); if (e) e.click(); })()`);
  if (after) { await p.waitForTimeout(3200); if (more && more[0]) { for (let i = 0; i < 50; i++) { if (await boxOf(p, more[0][1])) break; await p.waitForTimeout(400); } await p.waitForTimeout(600); } for (const [mn, mf] of (more || [])) { boxes[after + ':' + mn] = await boxOf(p, mf); } await snap(p, after); }
  return true;
}
// ★v2 맨 위에 보이는 것만(뒤에 깔린 같은 이름 단추를 잡아 동그라미가 엉뚱한 데 가던 고장 — 16편)
const TOP = `(e => { const b = e.getBoundingClientRect(); const x = b.left + b.width / 2, y = b.top + Math.min(b.height / 2, 20); if (x < 0 || y < 0 || x > innerWidth || y > innerHeight) return true; const h = document.elementFromPoint(x, y); return !!h && (h === e || e.contains(h) || h.contains(e)); })`;
const T = re => `() => [...document.querySelectorAll('button,a,[role=button],label')].filter(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 && ${re}.test((e.textContent || '') + ' ' + (e.getAttribute('aria-label') || '')) && ${TOP}(e); }).pop()`;
const Q = s => `() => [...document.querySelectorAll('${s}')].filter(e => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0 && b.top < innerHeight && ${TOP}(e); })[0]`;
const PIC = `() => [...document.querySelectorAll('#main *')].find(e => { const b = e.getBoundingClientRect(); return b.width > 100 && b.height > 100 && b.top > 150 && /url\\(/.test(getComputedStyle(e).backgroundImage); })`;
try {
  // ── 손님
  let c = await newCtx(), p = await c.newPage();
  await p.goto(B + '?plaza=1'); await wait(p);
  await mark(p, 'g01_마당', [['pz', Q('#btab [data-bt=pz]')], ['fd', Q('#btab [data-bt=fd]')], ['me', Q('#btab [data-bt=me]')], ['up', Q('#btab [data-bt=up]')], ['menu', T('/☰|메뉴/')]]);
  await snap(p, 'g01_마당');
  await tapAt(p, 'g02_검색누름', Q('#btab [data-bt=fd]'), 'g02b_검색', [['inp', `() => [...document.querySelectorAll('input[type=search],input[type=text],input:not([type])')].filter(e => e.getBoundingClientRect().width > 60)[0]`]]);
  await p.goto(B + '?plaza=1'); await wait(p);
  await tapAt(p, 'g03_방누름', `() => [...document.querySelectorAll('#main [data-pg],#main .pzr button,#main .rc')].filter(e=>e.getBoundingClientRect().width>30)[0]`, 'g03b_방첫화면', [['hd', `() => document.querySelector('#main .rph') || document.querySelector('#main h1,#main h2')`]]);
  await p.goto(B + '?c=' + ROOM); await wait(p);
  await mark(p, 'g04_방첫화면', [['hd', `() => document.querySelector('#main .rph')`], ['tabs', `() => document.querySelector('#main .rtabs')`]]); await snap(p, 'g04_방첫화면');
  await tapAt(p, 'g05_사진누름', PIC, 'g05b_게시물');
  boxes['g06_좋아요'] = await boxOf(p, Q('#pf.on .pfa [data-pa=like]')); boxes['g06_좋아요:mem'] = await boxOf(p, Q('#pf.on .pfa [data-pa=mem]')); await snap(p, 'g06_좋아요');   // 누르지 않음(견본 숫자 안 바꿈)
  await tapAt(p, 'g07_기억누름', Q('#pf.on .pfa [data-pa=write]'), 'g07b_기억창', [['paW', Q('#paW')], ['sh', `() => document.querySelector('#dimTop h2')`]]);
  await p.evaluate(() => { const d = document.getElementById('dimTop'); if (d) d.remove(); });
  await tapAt(p, 'g08_공유누름', Q('#pf.on .pfa [data-pa=send]'), 'g08b_공유창', [['kk', T('/카톡으로 보내기/')], ['pick', `() => [...document.querySelectorAll('#dimTop img')].filter(e => e.getBoundingClientRect().width > 40)[0]`]]);
  await p.evaluate(() => { const d = document.getElementById('dimTop'); if (d) d.remove(); });
  await tapAt(p, 'g09_저장', Q('#pf.on .pfa [data-pa=more]'), 'g09b_저장', [['sv', Q('#mSv')]]);
  await p.evaluate(() => { const d = document.getElementById('dimTop'); if (d) d.remove(); });
  await tapAt(p, 'g10_더보기', Q('#pf.on .pfa [data-pa=more]'), 'g10b_더보기창', [['del', T('/삭제 요청/')]]);
  await p.goto(B + '?c=' + ROOM); await wait(p);
  await tapAt(p, 'g11_메뉴누름', T('/☰|메뉴/'), 'g11b_메뉴', [['mk', T('/^[^가-힣]*우리 이야기방 만들기/')]]);
  await tapAt(p, 'g12_홈화면누름', T('/홈 화면에 추가/'), 'g12b_홈화면', [['how', `() => [...document.querySelectorAll('#dimTop *')].find(e => /홈 화면에 추가/.test(e.textContent || '') && e.children.length >= 2 && e.getBoundingClientRect().height < 120 && e.getBoundingClientRect().top > 300)`]]);
  await p.goto(B + '?plaza=1'); await wait(p);
  const lk = await p.evaluate(() => !!document.querySelector('.lck'));
  if (lk) await tapAt(p, 'g13_닫힌방', Q('.lck'), 'g13b_방두드리기', [['knock', T('/방 두드리기/')]]); else log.push('g13 닫힌 방 못 찾음');
  await p.goto(B + '?c=' + ROOM); await wait(p);
  await tapAt(p, 'g14_손님올리기', Q('#btab [data-bt=up]'), 'g14b_로그인안내', [['kakao', T('/카카오 로그인/')], ['age', `() => { const i = document.querySelector('#dimTop input[type=checkbox]'); return i && (i.closest('label') || i); }`]]);
  await p.goto(B + '?open=form'); await p.waitForTimeout(3500);
  await mark(p, 'g15_방만들기', [['kind', `() => [...document.querySelectorAll('#main *')].find(e => /어떤 방인가요/.test(e.textContent || '') && e.children.length >= 2 && e.getBoundingClientRect().height < 260)`]]); await snap(p, 'g15_방만들기');
  await p.goto(B + '?c=' + ROOM); await wait(p);
  await p.evaluate(() => { const d = document.getElementById('dimTop'); if (d) d.remove(); });   // 손님 올리기 뒤 남은 로그인 창(알려진 고장 · 대표 OK 대기) 걷고 찍음
  const up = await p.evaluate(() => { const e = [...document.querySelectorAll('button,a')].find(x => /나도 사진 올리기/.test(x.textContent || '')); if (!e) return false; e.scrollIntoView({ block: 'center' }); return true; });
  if (up) { await p.waitForTimeout(800); await mark(p, 'g16_나도사진올리기', [['up', T('/나도 사진 올리기/')]]); await snap(p, 'g16_나도사진올리기'); } else log.push('g16 나도 사진 올리기 못 찾음');
  await c.close();
  // ── 멤버(시험 방 관리자 열쇠)
  if (/^[a-f0-9]{32}$/.test(KEY)) {
    c = await newCtx(); p = await c.newPage();
    REN = [['시험\\s*관리자', '김우리'], ['시험\\s*v101', '우리 동아리'], ['거.\\s*방', '방'], ['\\s*\\(지울\\s*것\\)', '']];
    await p.goto(B + '?k=' + KEY); await wait(p); await p.goto(B + '?me=1'); await wait(p); await snap(p, 'm01_방첫화면');
    boxes['m01_방첫화면:mgr'] = await boxOf(p, T('/방 관리/')); boxes['m01_방첫화면:inv'] = await boxOf(p, T('/초대하기/'));
    await tapAt(p, 'm02_초대누름', T('/초대하기/'), 'm02b_초대창');
    await p.goto(B + '?me=1'); await wait(p);
    await tapAt(p, 'm03_올리기누름', Q('#btab [data-bt=up]'), 'm03b_새게시물', [['pick', `() => [...document.querySelectorAll('body *')].filter(e => /사진 선택/.test(e.textContent || '') && e.getBoundingClientRect().height > 80 && e.getBoundingClientRect().height < 300).pop()`], ['go', `() => [...document.querySelectorAll('button')].filter(e => /올리기/.test(e.textContent || '') && e.getBoundingClientRect().top > 600 && e.getBoundingClientRect().width > 200).pop()`]]);
    await p.goto(B + '?me=1'); await wait(p);
    await tapAt(p, 'm04_내방누름', Q('#btab [data-bt=me]'), 'm04b_내방', [['av', `() => [...document.querySelectorAll('#meP .av, #meP [data-me=pic], #meP img, #meP .mh .av')].filter(e => e.getBoundingClientRect().width > 30 && e.getBoundingClientRect().top < 260)[0]`], ['news', `() => [...document.querySelectorAll('#meP *')].find(e => /새 소식/.test(e.textContent || '') && e.children.length < 4 && e.getBoundingClientRect().height > 0)`]]);
    await tapAt(p, 'm05_내사진', `() => [...document.querySelectorAll('#meP .av, #meP [data-me=pic], #meP .mh .av')].filter(e=>e.getBoundingClientRect().width>20)[0]`, 'm05b_내사진창');
    await p.goto(B + '?me=1'); await wait(p);
    await tapAt(p, 'm06_관리누름', T('/방 관리/'), 'm06b_방관리', [['ok', T('/카카오로 관리 확인/')]]);
    await tapAt(p, 'm07_처리할일', T('/처리할 일/'), 'm07b_처리할일');
    await p.goto(B + '?me=1'); await wait(p);
    await tapAt(p, 'm08_사진누름', PIC, 'm08b_게시물');
    await tapAt(p, 'm09_더보기', Q('#pf.on .pfa [data-pa=more]'), 'm09b_내게시물메뉴');
    await c.close();
  } else log.push('멤버 화면은 건너뜀(열쇠 없음)');
} catch (e) { log.push('오류 ' + e.message.slice(0, 160)); }
fs.writeFileSync('guide/boxes.json', JSON.stringify(boxes, null, 1));
await browser.close();
console.log(log.join('\n'));

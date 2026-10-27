// Site checks for Norenius: phone-line status at fixed Stockholm times, reveals, scroll-spy, images.
const { chromium } = require('playwright');
const times = { 'mon 08:00': '2026-10-26T07:00:00Z', 'mon 16:00': '2026-10-26T15:00:00Z', 'fri 13:00': '2026-10-30T12:00:00Z', 'sat 10:00': '2026-10-31T09:00:00Z', 'tue 06:00': '2026-10-27T05:00:00Z' };
(async () => {
  const b = await chromium.launch({ proxy: { server: process.env.HTTPS_PROXY } });
  for (const [label, iso] of Object.entries(times)) {
    const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, isMobile: true });
    await ctx.addInitScript(t => { const R = Date; const fixed = new R(t).getTime(); globalThis.Date = class extends R { constructor(...a) { super(...(a.length ? a : [fixed])); } static now() { return fixed; } }; }, iso);
    const p = await ctx.newPage();
    await p.goto(process.argv[2], { waitUntil: 'load' }); await p.waitForTimeout(300);
    console.log(label, '|', await p.evaluate(() => document.getElementById('phoneState').textContent + ' / ' + document.getElementById('phoneSub').textContent + ' / today:' + (document.querySelector('#tel tr.today td')?.textContent || '-')));
    await ctx.close();
  }
  for (const [n, vp, m] of [['desktop', { width: 1440, height: 900 }, false], ['mobile', { width: 390, height: 844 }, true]]) {
    const p = await (await b.newContext({ viewport: vp, isMobile: m })).newPage();
    const errs = []; p.on('pageerror', e => errs.push(e.message)); p.on('console', c => c.type() === 'error' && errs.push(c.text()));
    await p.goto(process.argv[2], { waitUntil: 'load', timeout: 60000 }); await p.waitForTimeout(1200);
    const H = await p.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < H; y += 400) { await p.evaluate(v => scrollTo(0, v), y); await p.waitForTimeout(120); }
    await p.waitForTimeout(1500);
    const r = await p.evaluate(() => ({ rv: document.querySelectorAll('.rv.in').length + '/' + document.querySelectorAll('.rv').length, lineup: document.getElementById('lineup').classList.contains('in'),
      imgs: [...document.images].filter(i => !i.naturalWidth).map(i => i.src.split('/').pop()), n: document.images.length, overflow: document.documentElement.scrollWidth - innerWidth }));
    if (!m) { await p.evaluate(() => document.getElementById('t-krona').scrollIntoView({behavior:'instant'})); await p.waitForTimeout(600); r.spy = await p.evaluate(() => document.querySelector('#spy a.on')?.textContent); }
    else { await p.evaluate(() => scrollTo(0, 0)); await p.click('.menu'); await p.waitForTimeout(200); r.menu = await p.evaluate(() => getComputedStyle(document.getElementById('nav')).display); }
    console.log(n, JSON.stringify(r), 'errors', errs);
  }
  await b.close();
})();
